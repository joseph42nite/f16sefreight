<template>
  <div>
    <!-- The launcher. Always reachable, because a bug is reported from wherever it
         happened — not from a settings page you have to navigate to first. -->
    <button
      v-if="!picking && !form"
      class="fx-btn fx-btn--ghost fx-reporter__launch"
      aria-label="Report a problem"
      @click="startPicking"
    >⚑</button>

    <!--
      Element-selection mode. §5.10 — the cursor changes and the hovered element is
      outlined, so the operator can see exactly what they are about to attach.
    -->
    <div v-if="picking" class="fx-reporter__banner" role="status">
      Click the thing that is wrong.
      <button class="fx-btn fx-btn--ghost" @click="cancel">Cancel</button>
    </div>

    <div v-if="form" class="fx-modal" role="dialog" aria-modal="true" aria-label="Report a problem">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 class="fx-modal__title">Report a problem</h2>
          <button class="fx-btn fx-btn--ghost" aria-label="Close" @click="cancel">✕</button>
        </header>

        <div class="fx-modal__body">
          <!--
            🔴 EVERYTHING BELOW IS READ OFF THE BROWSER, NOT INFERRED. §5.10 keeps the
            model out of this path deliberately: a hallucinated selector or route makes
            a bug report worse than useless, because it sends a developer to the wrong
            screen carrying confident-looking evidence.

            Shown to the reporter before sending, so they can see what they are about
            to attach rather than trusting it.
          -->
          <dl class="fx-defs">
            <dt>Route</dt>
            <dd class="identifier">{{ captured.route }}</dd>
            <dt>Element</dt>
            <dd class="identifier">{{ captured.element_selector || "—" }}</dd>
            <dt>Console</dt>
            <dd>{{ captured.console_logs.length }} recent entries</dd>
            <dt>Screenshot</dt>
            <dd>{{ shot ? "attached" : shotError || "not captured" }}</dd>
          </dl>

          <img v-if="shot" :src="shot" alt="Captured screenshot" class="fx-reporter__shot" />

          <label class="fx-field" style="margin-top: var(--space-3)">
            <span class="fx-field__label">What went wrong?</span>
            <textarea
              v-model="description"
              class="fx-input fx-reporter__text"
              rows="4"
              placeholder="What did you expect, and what happened instead?"
            ></textarea>
          </label>

          <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
          <p v-if="sent" class="fx-warn" role="status">
            Reported. The support desk sees this with the route, the element and the logs.
          </p>
        </div>

        <footer class="fx-modal__foot">
          <button class="fx-btn" @click="cancel">Cancel</button>
          <button
            class="fx-btn fx-btn--primary"
            :disabled="busy || sent || !description.trim()"
            @click="send"
          >{{ busy ? "Sending…" : "Send report" }}</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import recorder from "@/core/services/console.recorder";

/**
 * A CSS selector path for one element.
 *
 * ⚠️ Built by walking up from the clicked node, preferring an `id` and stopping the
 * moment the path is unique. A full body-to-leaf path is brittle — it breaks on the
 * next layout change and points a developer at nothing.
 */
function selectorFor(el) {
  if (!el || el === document.body) return "body";

  const parts = [];
  let node = el;

  while (node && node.nodeType === 1 && node !== document.body && parts.length < 6) {
    if (node.id) {
      parts.unshift("#" + node.id);
      break;                                    // an id is unique; stop climbing
    }

    let part = node.tagName.toLowerCase();
    const cls = (node.className && typeof node.className === "string")
      ? node.className.trim().split(/\s+/).filter(Boolean).slice(0, 2)
      : [];
    if (cls.length) part += "." + cls.join(".");

    const parent = node.parentElement;
    if (parent) {
      const sameTag = Array.prototype.filter.call(parent.children, (c) => c.tagName === node.tagName);
      if (sameTag.length > 1) part += ":nth-child(" + (Array.prototype.indexOf.call(parent.children, node) + 1) + ")";
    }

    parts.unshift(part);
    node = node.parentElement;
  }

  return parts.join(" > ");
}

export default {
  name: "VisualReporter",
  data: () => ({
    picking: false, form: false, busy: false, sent: false,
    description: "", error: null, shot: null, shotError: null,
    captured: { route: "", element_selector: "", console_logs: [] },
    highlighted: null,
  }),
  beforeDestroy() {
    this.teardown();
  },
  methods: {
    startPicking() {
      this.picking = true;
      document.body.classList.add("fx-picking");
      document.addEventListener("mouseover", this.onHover, true);
      document.addEventListener("click", this.onPick, true);
    },
    teardown() {
      document.body.classList.remove("fx-picking");
      document.removeEventListener("mouseover", this.onHover, true);
      document.removeEventListener("click", this.onPick, true);
      if (this.highlighted) {
        this.highlighted.classList.remove("fx-picked");
        this.highlighted = null;
      }
    },
    onHover(e) {
      if (this.highlighted) this.highlighted.classList.remove("fx-picked");
      this.highlighted = e.target;
      if (this.highlighted && this.highlighted.classList) this.highlighted.classList.add("fx-picked");
    },
    onPick(e) {
      /* Stop the click reaching the app: the operator is pointing at a control, not
         pressing it, and firing it would change the very state being reported. */
      e.preventDefault();
      e.stopPropagation();

      const target = e.target;
      this.teardown();
      this.picking = false;

      this.captured = {
        route: this.$route ? this.$route.fullPath : window.location.pathname,
        element_selector: selectorFor(target),
        console_logs: recorder.entries(),
      };

      this.form = true;
      this.capture(target);
    },
    /**
     * html2canvas, loaded ON DEMAND.
     *
     * ⚠️ It is a heavy dependency and almost nobody files a bug, so importing it at
     * boot would cost every session for the benefit of a few. A failed capture is
     * REPORTED and the ticket still sends — a screenshot is evidence, not a
     * precondition.
     */
    capture() {
      import(/* webpackChunkName: "html2canvas" */ "html2canvas")
        .then((mod) => (mod.default || mod)(document.body, {
          logging: false,
          scale: 0.5,               // half scale: legible, and a fraction of the bytes
          useCORS: true,
        }))
        .then((canvas) => { this.shot = canvas.toDataURL("image/jpeg", 0.7); })
        .catch((e) => { this.shotError = "could not capture (" + (e.message || "unknown") + ")"; });
    },
    send() {
      this.busy = true;
      this.error = null;

      ApiService.post("/tickets", {
        route: this.captured.route,
        description: this.description,
        element_selector: this.captured.element_selector,
        console_logs: this.captured.console_logs,
        /* The image is NOT posted: `support_tickets.screenshot_path` expects a path to
           object storage, and a multi-megabyte data URI in a VARCHAR(500) would be
           truncated into garbage. Upload lands with the storage decision — GAPS #35. */
      })
        .then(() => {
          this.sent = true;
          /* Cleared so the next report does not inherit this one's logs. */
          recorder.clear();
        })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.error = d.error || d.message || "Could not send the report.";
        })
        .finally(() => { this.busy = false; });
    },
    cancel() {
      this.teardown();
      this.picking = false;
      this.form = false;
      this.sent = false;
      this.description = "";
      this.shot = null;
      this.shotError = null;
      this.error = null;
    },
  },
};
</script>
