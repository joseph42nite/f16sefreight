<template>
  <!--
    Safe and in control (redesigned 2026-11-16, owner). A shield with the F16s jet in the middle, the six safeguards
    around it, three a side, each wired to the shield. A scan line passes over the shield; the rings pulse.
    Every point is shipped: docs/LANDING_PAGE.md §2 (audit log trigger, upload virus scan that fails closed,
    encrypted tokens and bank details, company/branch scoping, role separation, single session).
  -->
  <section class="ltr" aria-labelledby="trust-heading">
    <header class="lp-head">
      <span class="lp-eyebrow">Safe and in control</span>
      <h2 id="trust-heading" class="lp-title">Your data, kept apart<br />and kept honest.</h2>
      <p class="lp-sub">Six safeguards built into F16s, so nobody has to remember to switch them on.</p>
    </header>

    <div class="ltr-board">
      <ul class="ltr-side ltr-side--left">
        <li v-for="item in left" :key="item.title" class="ltr-item" :class="'is-' + item.tone">
          <span class="ltr-icon"><b-icon :icon="item.icon" aria-hidden="true"></b-icon></span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ul>

      <div class="ltr-core" aria-hidden="true">
        <svg viewBox="0 0 320 340">
          <defs>
            <symbol id="ltr-jet" viewBox="0 0 24 24">
              <path d="M12 1.2 C12.9 2.3 13.3 4 13.3 6.2 V9.4 L21.2 14.4 V16.3 L13.3 13.9 L13.1 18.1 L16.2 20.4 V21.9 L12 20.9 L7.8 21.9 V20.4 L10.9 18.1 L10.7 13.9 L2.8 16.3 V14.4 L10.7 9.4 V6.2 C10.7 4 11.1 2.3 12 1.2 Z" />
            </symbol>
            <linearGradient id="ltr-shield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#4C8FE6" /><stop offset=".55" stop-color="#2459B5" /><stop offset="1" stop-color="#14295A" />
            </linearGradient>
            <linearGradient id="ltr-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#FFFFFF" /><stop offset="1" stop-color="#D3DDEC" />
            </linearGradient>
            <linearGradient id="ltr-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#9FF3E2" stop-opacity="0" /><stop offset=".8" stop-color="#9FF3E2" stop-opacity=".45" /><stop offset="1" stop-color="#E6FFF9" stop-opacity=".95" />
            </linearGradient>
            <clipPath id="ltr-clip"><path d="M160 72 L232 98 V164 C232 214 202 248 160 266 C118 248 88 214 88 164 V98 Z" /></clipPath>
            <filter id="ltr-drop" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#1E3A6E" flood-opacity=".28" />
            </filter>
          </defs>

          <!-- Rings that pulse outwards. -->
          <g fill="none" stroke="#2F6FCF">
            <circle class="ltr-ring" cx="160" cy="168" r="112" stroke-opacity=".14" />
            <circle class="ltr-ring ltr-ring--2" cx="160" cy="168" r="140" stroke-opacity=".1" stroke-dasharray="2 6" />
          </g>
          <circle cx="160" cy="168" r="96" fill="#fff" fill-opacity=".55" />

          <!-- The shield: white rim, blue body, the jet, a scan line passing down. -->
          <g filter="url(#ltr-drop)">
            <path d="M160 60 L244 90 V164 C244 222 209 260 160 280 C111 260 76 222 76 164 V90 Z" fill="url(#ltr-rim)" />
            <path d="M160 72 L232 98 V164 C232 214 202 248 160 266 C118 248 88 214 88 164 V98 Z" fill="url(#ltr-shield)" />
          </g>
          <g clip-path="url(#ltr-clip)">
            <path d="M160 72 L232 98 V130 H88 V98 Z" fill="#fff" fill-opacity=".08" />
            <rect class="ltr-beam" x="80" y="40" width="160" height="40" fill="url(#ltr-beam)" />
          </g>
          <use href="#ltr-jet" x="128" y="122" width="64" height="64" fill="#fff" />

          <!-- A padlock at the foot of the shield. -->
          <g transform="translate(160 262)">
            <circle r="22" fill="#fff" />
            <path d="M-7 -4 V-9 a7 7 0 0 1 14 0 V-4" fill="none" stroke="#1E3A6E" stroke-width="3" stroke-linecap="round" />
            <rect x="-10" y="-5" width="20" height="16" rx="4" fill="#1E3A6E" />
            <circle cy="2" r="2.2" fill="#fff" />
          </g>

          <!-- Two small badges orbiting: a key and a tick. -->
          <g class="ltr-float">
            <circle cx="62" cy="96" r="18" fill="#fff" />
            <path d="M54 96 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M64 96 H74 M70 96 V101" fill="none" stroke="#C8632B" stroke-width="2.4" stroke-linecap="round" />
          </g>
          <g class="ltr-float ltr-float--2">
            <circle cx="262" cy="232" r="18" fill="#fff" />
            <path d="M254 232 l5 5 l10 -11" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </g>
        </svg>
      </div>

      <ul class="ltr-side ltr-side--right">
        <li v-for="item in right" :key="item.title" class="ltr-item" :class="'is-' + item.tone">
          <span class="ltr-icon"><b-icon :icon="item.icon" aria-hidden="true"></b-icon></span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
const ITEMS = [
  { icon: "file-lock", tone: "sky", title: "An audit log that can't be changed", text: "The database refuses edits and deletes to the log." },
  { icon: "shield-check", tone: "mint", title: "Every upload virus-scanned", text: "If the scanner is down, the file is refused, not let through." },
  { icon: "key", tone: "peach", title: "Encrypted where it matters", text: "Mailbox tokens and bank details are encrypted at rest." },
  { icon: "diagram-3", tone: "violet", title: "Each company kept apart", text: "Company and branch data are separated, and plan and role are checked on every request." },
  { icon: "shield-lock", tone: "butter", title: "Separation of duties", text: "Only accounts posts to the ledger and closes a month. Sales never sees the margin." },
  { icon: "lock", tone: "rose", title: "One session per person", text: "Logins aren't shared, and file types are checked by their content, not their name." },
];

export default {
  name: "HomeTrust",
  data: () => ({ left: ITEMS.slice(0, 3), right: ITEMS.slice(3) }),
};
</script>

<style>
.ltr { padding: 72px 0 40px; font-family: "Inter", sans-serif; }

/* Straight on the paper, no panel: a soft blue glow behind the shield only. */
.ltr-board {
  position: relative; display: grid; grid-template-columns: 1fr 320px 1fr; align-items: center; gap: 0 44px; margin-top: 44px;
}
.ltr-board::before {
  content: ""; position: absolute; left: 50%; top: 50%; width: 520px; height: 520px; margin: -260px 0 0 -260px; z-index: 0; pointer-events: none;
  background: radial-gradient(closest-side, rgba(156, 198, 247, .35), rgba(156, 198, 247, 0));
}
.ltr-side, .ltr-core { position: relative; z-index: 1; }
.ltr-side { list-style: none; margin: 0; padding: 0; display: grid; gap: 34px; }

.ltr-item {
  --soft: #E6F0FD; --ink: #2F6FCF;
  position: relative; display: flex; align-items: flex-start; gap: 14px;
}
/* Left side reads towards the shield: text right-aligned, icon on the inside. */
.ltr-side--left .ltr-item { flex-direction: row-reverse; text-align: right; }
.ltr-item.is-sky { --soft: #E6F0FD; --ink: #2F6FCF; }
.ltr-item.is-mint { --soft: #E3F6EA; --ink: #13865A; }
.ltr-item.is-peach { --soft: #FDEEE4; --ink: #C8632B; }
.ltr-item.is-violet { --soft: #EFEAFD; --ink: #6B4FD8; }
.ltr-item.is-butter { --soft: #FCF3D6; --ink: #A77A0B; }
.ltr-item.is-rose { --soft: #FCE9F1; --ink: #C2417A; }
.ltr-icon { flex: 0 0 auto; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: var(--soft); color: var(--ink); font-size: 1.0625rem; }
.ltr-item h3 { margin: 0 0 4px; font-size: 1rem; font-weight: 700; color: #102552; }
.ltr-item p { margin: 0; font-size: .875rem; line-height: 1.5; color: #4B5B78; }

/* Each card is wired to the shield: a dashed line into the gap, ending in a dot. */
.ltr-item::after, .ltr-item::before { content: ""; position: absolute; top: 19px; pointer-events: none; }
.ltr-item::after { width: 30px; border-top: 2px dashed rgba(47, 111, 207, .3); }
.ltr-item::before { width: 9px; height: 9px; margin-top: -3.5px; border-radius: 50%; background: #2F6FCF; box-shadow: 0 0 0 4px rgba(47, 111, 207, .15); }
.ltr-side--left .ltr-item::after { left: calc(100% + 10px); }
.ltr-side--left .ltr-item::before { left: calc(100% + 40px); }
.ltr-side--right .ltr-item::after { right: calc(100% + 10px); }
.ltr-side--right .ltr-item::before { right: calc(100% + 40px); }

.ltr-core svg { display: block; width: 100%; height: auto; overflow: visible; }
.ltr-ring { transform-box: fill-box; transform-origin: center; animation: ltr-pulse 4s ease-in-out infinite; }
.ltr-ring--2 { animation-delay: -2s; }
@keyframes ltr-pulse { 0%, 100% { transform: scale(.96); opacity: .6; } 50% { transform: scale(1.04); opacity: 1; } }
.ltr-beam { animation: ltr-scan 3.6s cubic-bezier(.45, 0, .55, 1) infinite; }
@keyframes ltr-scan { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(230px); opacity: 0; } }
.ltr-float { animation: ltr-bob 5s ease-in-out infinite alternate; }
.ltr-float--2 { animation-delay: -2.5s; }
@keyframes ltr-bob { from { transform: translateY(-4px); } to { transform: translateY(4px); } }

@media (max-width: 1199px) { .ltr-board { grid-template-columns: 1fr 260px 1fr; gap: 0 36px; } .ltr-item::after { width: 22px; } .ltr-side--left .ltr-item::before { left: calc(100% + 32px); } .ltr-side--right .ltr-item::before { right: calc(100% + 32px); } }
/* Tablet and phone: the shield on top, the six cards below in one or two columns, no wires. */
@media (max-width: 991px) {
  .ltr-board { grid-template-columns: 1fr 1fr; gap: 28px 32px; }
  .ltr-side--left .ltr-item { flex-direction: row; text-align: left; }
  .ltr-core { grid-column: 1 / -1; grid-row: 1; justify-self: center; width: 240px; }
  .ltr-item::after, .ltr-item::before { display: none; }
}
@media (max-width: 575px) {
  .ltr-board { grid-template-columns: 1fr; gap: 24px; }
  .ltr-side { gap: 24px; }
  .ltr-core { width: 210px; }
}
@media (prefers-reduced-motion: reduce) {
  .ltr-ring, .ltr-beam, .ltr-float { animation: none; }
}
</style>
