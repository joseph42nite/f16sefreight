/**
 * Fade a hidden notice in, then out again, and leave it hidden: what the two platform forms did with jQuery's
 * fadeToggle, in plain DOM, so that jQuery is not part of every visitor's download for two "Saved" notices.
 *
 * @param {Element|null} el       the notice (hidden by its stylesheet)
 * @param {number} fade           how long each fade lasts, in ms
 * @param {number} fadeOutAt      when the fade out starts, in ms from now (never before the fade in ends)
 */
export function flash(el, { fade = 1000, fadeOutAt = 2000 } = {}) {
    if (!el) return;
    clearTimeout(el.__flashOut);
    clearTimeout(el.__flashHide);

    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.display = "block";
    void el.offsetWidth; // the browser must see opacity 0 before the transition starts
    el.style.transition = `opacity ${fade}ms`;
    el.style.opacity = "1";

    const out = Math.max(fade, fadeOutAt);
    el.__flashOut = setTimeout(() => { el.style.opacity = "0"; }, out);
    el.__flashHide = setTimeout(() => {
        el.style.display = "";
        el.style.opacity = "";
        el.style.transition = "";
    }, out + fade);
}

export default flash;
