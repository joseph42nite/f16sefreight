<template>
  <div class="fx-mail-body">
    <!--
      The mail as it was written (user, 2026-09-17): its own spacing, bold, colours and tables, in a frame so the app's
      styles cannot flatten it and its styles cannot leak out. No scripts run inside (sandbox without allow-scripts);
      links open in a new tab. The server has already removed anything unsafe.
    -->
    <!-- Pictures from the internet stay off until asked for (frontend audit, FS10): loading one tells the sender the
         mail was opened, when, and from where. Pictures sent inside the mail itself always show. -->
    <p v-if="html !== null && hasRemoteImages && !showImages" class="fx-muted fx-mail-body__images">
      Pictures from the internet are hidden.
      <button type="button" class="fx-btn fx-btn--ghost" @click="showImages = true">Show pictures</button>
    </p>
    <iframe
      v-if="html !== null"
      ref="frame"
      class="fx-mail-body__frame"
      :srcdoc="document"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      :style="{ height: height + 'px' }"
      title="Message"
      @load="fit"
    ></iframe>
    <p v-else class="fx-message__body">{{ snippet }}</p>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
  name: "MailBodyFrame",
  props: {
    messageId: { type: Number, required: true },
    /** Shown while the full mail loads, or if it cannot be fetched. */
    snippet: { type: String, default: "" },
  },
  data: () => ({ html: null, height: 60, showImages: false }),
  computed: {
    /** A picture fetched from somewhere else — not one carried in the mail (data:, cid:) or served by this app. */
    hasRemoteImages() {
      return /<img\b[^>]*\bsrc\s*=\s*["']?\s*(https?:)?\/\//i.test(this.html || "")
        || /url\(\s*["']?\s*(https?:)?\/\//i.test(this.html || "");
    },
    document() {
      // The frame's own rule, so nothing is fetched whatever the markup tries (img, background, srcset).
      const policy = this.showImages ? "" : '<meta http-equiv="Content-Security-Policy" content="img-src \'self\' data: blob: cid:">';

      return '<!doctype html><html><head><meta charset="utf-8">' + policy + '<base target="_blank">'
        + "<style>body{margin:0;font:13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1f2933;overflow-wrap:anywhere}"
        + "h1,h2,h3,h4,h5,h6{font-size:1em;margin:0 0 6px}"
        // A wide table keeps its words whole and scrolls sideways in the frame (GAPS #466): squeezed to the frame with
        // words broken anywhere, an airline's FNA table read one letter per line.
        + "html{overflow-x:auto}td,th{overflow-wrap:normal;word-break:normal}"
        + "img{max-width:100%;height:auto}p{margin:0 0 10px}</style></head><body>"
        + this.html + "</body></html>";
    },
  },
  watch: {
    messageId: { immediate: true, handler: "load" },
  },
  methods: {
    load() {
      this.html = null;
      this.showImages = false;
      ApiService.get("/inbox/messages/" + this.messageId + "/body")
        .then(({ data }) => { this.html = data.html || ""; })
        .catch(() => { this.html = null; });
    },
    /** As tall as the mail, so only the conversation scrolls — never a box inside it. */
    fit() {
      const doc = this.$refs.frame && this.$refs.frame.contentDocument;
      if (!doc || !doc.body) return;
      this.height = Math.max(24, doc.documentElement.scrollHeight);
      // Images arriving late change the height once more.
      Array.from(doc.images).forEach((img) => img.addEventListener("load", () => {
        this.height = Math.max(24, doc.documentElement.scrollHeight);
      }));
    },
  },
};
</script>
