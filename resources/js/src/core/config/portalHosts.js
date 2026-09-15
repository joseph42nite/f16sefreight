/**
 * Which portal a sign-in is for, and where that portal lives.
 *
 * 🔴 Each portal is its own subdomain (config/f16s.php `portals`): the server decides the portal from the
 * HOST, and the sign-in token is stored per subdomain. So choosing a portal means signing in ON its
 * subdomain — the password is only ever sent to the portal that was picked.
 *
 * Superadmin is deliberately not offered (user, 2026-09-15): F16s staff sign in at superadmin.<domain>.
 * FocusRoad has no screens yet (PRD §11), so it is not offered either.
 */
export const SIGN_IN_PORTALS = [
  { key: "focusair", label: "FocusAir", note: "Air freight" },
  { key: "focussea", label: "FocusSea", note: "Sea freight" },
  // The ledger is a Command plan feature: a Tactical company has no Accounts portal (config/f16s.php min_tier).
  { key: "accounts", label: "Accounts", note: "Command plan only" },
  { key: "admin", label: "Tenant Admin", note: "For the director" },
];

const ALL_PORTALS = ["focusair", "focussea", "focusroad", "accounts", "admin", "superadmin"];

/** The portal a hostname names ("focussea.localhost" → "focussea"), or null for a bare host. */
export function portalFromHost(hostname) {
  const first = String(hostname || "").split(".")[0].toLowerCase();

  return ALL_PORTALS.includes(first) ? first : null;
}

/**
 * The sign-in address on another portal: same protocol, domain and port, that portal's subdomain,
 * and `?signin=1` so the sign-in box opens there.
 *
 * @param {string} key a portal key
 * @param {{protocol: string, hostname: string, port: string}} location window.location
 */
export function portalSignInUrl(key, location) {
  const labels = String(location.hostname).split(".");
  const domain = portalFromHost(location.hostname) ? labels.slice(1).join(".") : labels.join(".");
  const port = location.port ? ":" + location.port : "";

  return `${location.protocol}//${key}.${domain}${port}/?signin=1`;
}
