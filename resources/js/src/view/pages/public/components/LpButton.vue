<script>
/**
 * The one button of the public site (owner, 2026-11-16: "let all the buttons be designed like the hero's").
 * A 50px pill in Inter 600:
 *   solid — white with the sky blue text and a soft blue shadow (the hero's "Get started")
 *   ghost — frosted glass with white text, for blue backgrounds (the hero's "See how it works")
 * size="sm" is a 44px pill for buttons inside cards.
 *
 * It renders a router-link (to), a plain link (href) or a <button> (neither), so one look covers navigation, in-page
 * jumps and form submits. Listeners pass straight through: a handler gets the click event and can preventDefault().
 *
 *   <lp-button to="/product-description" variant="ghost">See how it works</lp-button>
 *   <lp-button href="#talk-to-us" icon="arrow-right" @click="toForm">Get started</lp-button>
 *   <lp-button type="submit" icon="arrow-right" :disabled="sending">Request a walkthrough</lp-button>
 */
export default {
  name: "LpButton",
  props: {
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
    variant: { type: String, default: "solid", validator: (v) => ["solid", "ghost"].includes(v) },
    size: { type: String, default: "md", validator: (v) => ["md", "sm"].includes(v) },
    icon: { type: String, default: "" },
    type: { type: String, default: "button" },
    disabled: { type: Boolean, default: false },
  },
  render(h) {
    const cls = ["lp-btn", "lp-btn--" + this.variant, "lp-btn--" + this.size];
    const children = [this.$slots.default];
    if (this.icon) children.push(h("b-icon", { class: "lp-btn__icon", props: { icon: this.icon }, attrs: { "aria-hidden": "true" } }));

    if (this.to) {
      return h("router-link", { class: cls, props: { to: this.to }, nativeOn: this.$listeners }, children);
    }
    if (this.href) {
      return h("a", { class: cls, attrs: { href: this.href }, on: this.$listeners }, children);
    }
    return h("button", { class: cls, attrs: { type: this.type, disabled: this.disabled }, on: this.$listeners }, children);
  },
};
</script>

<style>
.lp-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 50px; padding: 0 28px; border: 0;
  border-radius: 999px; cursor: pointer; white-space: nowrap;
  font: 600 .9375rem "Inter", sans-serif; letter-spacing: 0; text-decoration: none !important;
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.lp-btn--sm { height: 44px; padding: 0 20px; font-size: .875rem; }
.lp-btn--solid { background: #fff; color: #3E8BEA !important; box-shadow: 0 10px 30px rgba(62, 139, 234, .25); }
.lp-btn--solid:hover { transform: translateY(-1px); box-shadow: 0 14px 34px rgba(20, 60, 140, .28); }
.lp-btn--ghost {
  background: rgba(255, 255, 255, .16); border: 1px solid rgba(255, 255, 255, .4); color: #fff !important;
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
}
.lp-btn--ghost:hover { background: rgba(255, 255, 255, .26); transform: translateY(-1px); }
.lp-btn:focus-visible { outline: 2px solid #3E8BEA; outline-offset: 3px; }
.lp-btn--ghost:focus-visible { outline-color: #fff; }
.lp-btn:disabled { opacity: .7; cursor: default; transform: none; }
.lp-btn__icon { transition: transform .2s ease; }
.lp-btn:hover .lp-btn__icon { transform: translateX(2px); }
@media (prefers-reduced-motion: reduce) { .lp-btn, .lp-btn__icon { transition: none; } }
</style>
