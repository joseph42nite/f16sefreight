/**
 * One short notice at the top of the screen when something a person did has worked (owner, 2026-11-21: "a toast
 * notification on top for all these things"). Most pages only redrew themselves, which reads as nothing happening.
 *
 * Raised on the root, so it is still there when the page changes under it (a new record that opens its own page).
 * A page's own inline message stays where it has one: this is the same news, said where the eye already is.
 */
export function say(vm, text, variant = "success") {
  const toaster = vm && vm.$root && vm.$root.$bvToast;

  if (!toaster || !text) return;

  toaster.toast(text, {
    title: variant === "danger" ? "Not done" : "Done",
    variant,
    solid: true,
    toaster: "b-toaster-top-right",
    autoHideDelay: variant === "danger" ? 8000 : 4000,
  });
}

export default say;
