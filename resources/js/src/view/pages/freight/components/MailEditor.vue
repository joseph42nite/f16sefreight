<template>
  <div class="fx-mail-editor">
    <!--
      🔴 EIGHT CONTROLS ONLY (PRD §5.2.4): bold, italic, underline, bulleted list, numbered list,
      link, blockquote, clear formatting. No fonts, colours, sizes, tables or images — every extra
      control is another way to emit markup that breaks in a client we cannot test.
    -->
    <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
      <!-- ⚠️ mousedown.prevent: a button that takes focus leaves the editor, and the next
           keystroke after "Bulleted list" went nowhere. -->
      <div class="fx-mail-editor__bar" role="toolbar" aria-label="Formatting" @mousedown.prevent>
        <button type="button" class="fx-mail-editor__btn" :class="{ 'is-active': isActive.bold() }" title="Bold" aria-label="Bold" @click="commands.bold"><strong>B</strong></button>
        <button type="button" class="fx-mail-editor__btn" :class="{ 'is-active': isActive.italic() }" title="Italic" aria-label="Italic" @click="commands.italic"><em>I</em></button>
        <button type="button" class="fx-mail-editor__btn" :class="{ 'is-active': isActive.underline() }" title="Underline" aria-label="Underline" @click="commands.underline"><u>U</u></button>
        <span class="fx-mail-editor__sep" aria-hidden="true"></span>
        <button type="button" class="fx-mail-editor__btn" :class="{ 'is-active': isActive.bullet_list() }" title="Bulleted list" aria-label="Bulleted list" @click="commands.bullet_list">•</button>
        <button type="button" class="fx-mail-editor__btn" :class="{ 'is-active': isActive.ordered_list() }" title="Numbered list" aria-label="Numbered list" @click="commands.ordered_list">1.</button>
        <span class="fx-mail-editor__sep" aria-hidden="true"></span>
        <button type="button" class="fx-mail-editor__btn" :class="{ 'is-active': isActive.link() }" title="Link" aria-label="Link" @click="setLink(commands)">🔗</button>
        <button type="button" class="fx-mail-editor__btn" :class="{ 'is-active': isActive.blockquote() }" title="Quote" aria-label="Quote" @click="commands.blockquote">❝</button>
        <button type="button" class="fx-mail-editor__btn" title="Clear formatting" aria-label="Clear formatting" @click="clearFormatting">⌫</button>
      </div>
    </editor-menu-bar>

    <editor-content class="fx-mail-editor__body" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { lift, liftListItem } from "tiptap-commands";
import {
  Blockquote, Bold, BulletList, HardBreak, History, Italic, Link, ListItem, OrderedList, Underline,
} from "tiptap-extensions";

/**
 * The mail body editor.
 *
 * 🔴 TIPTAP, not a bare contenteditable (PRD §5.2.4). ProseMirror keeps a document model that
 * knows only these nodes and marks, so anything pasted from Word or Outlook that is not one of
 * them is dropped on the way in. The server still cleans it with HTMLPurifier — the editor is a
 * convenience, not the security boundary.
 */
export default {
  name: "MailEditor",
  components: { EditorContent, EditorMenuBar },
  props: {
    /** The body as HTML. */
    value: { type: String, default: "" },
  },
  data() {
    return { editor: null };
  },
  watch: {
    // A new draft (Reply, then Forward) replaces the content; our own echo does not.
    value(html) {
      if (this.editor && html !== this.editor.getHTML()) this.editor.setContent(html || "");
    },
  },
  mounted() {
    this.editor = new Editor({
      content: this.value || "",
      extensions: [
        new Bold(), new Italic(), new Underline(),
        new BulletList(), new OrderedList(), new ListItem(),
        // ⚠️ Not opened on click: a click in the editor is to edit the link's text.
        new Link({ openOnClick: false }),
        new Blockquote(), new HardBreak(), new History(),
      ],
      // Settings records a pasted signature as `pasted` (PRD §5.2.4 signature_source).
      editorProps: {
        handlePaste: () => {
          this.$emit("paste");
          return false;
        },
      },
      onUpdate: ({ getHTML }) => {
        const html = getHTML();
        this.$emit("input", html === "<p></p>" ? "" : html);
      },
    });
  },
  beforeDestroy() {
    if (this.editor) this.editor.destroy();
  },
  methods: {
    setLink(commands) {
      const href = window.prompt("Link address (leave empty to remove the link)", "https://");

      if (href === null) return;

      commands.link(href && href !== "https://" ? { href } : {});
    },
    /** Bold, italic, underline and links off; out of any list or quote. */
    clearFormatting() {
      const { state, view } = this.editor;
      const { from, to } = state.selection;

      view.dispatch(state.tr.removeMark(from, to));

      const item = this.editor.schema.nodes.list_item;

      // One level per pass; a quote inside a list needs two.
      for (let i = 0; i < 5; i += 1) {
        const lifted = liftListItem(item)(this.editor.state, this.editor.view.dispatch)
          || lift(this.editor.state, this.editor.view.dispatch);

        if (!lifted) break;
      }

      this.editor.focus();
    },
  },
};
</script>
