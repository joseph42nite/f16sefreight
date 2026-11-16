/**
 * The route guard: who may enter which page, decided before the page is entered.
 *
 * Lifted out of main.js so it can be tested (2026-11-15 frontend audit, tests section: nothing tested the guards).
 * Everything it needs is handed in, so a test can run it without the router, the store or a server.
 *
 * 🔴 CONVENIENCE, NEVER SECURITY: the server checks every request again whatever this decides.
 *
 * @param {object} deps
 * @param {() => boolean} deps.isAuthenticated a token is held
 * @param {() => string|null} deps.getRole "user", "superAdmin" or nothing
 * @param {() => string|null} deps.getToken
 * @param {() => string} deps.userStart where a tenant person's day starts (their designation's landing route)
 * @param {(userType: string) => Promise<boolean>} deps.verify resolves false when the person was signed out
 * @returns {(to: object, from: object, next: Function) => void}
 */
export const STAFF_START = "/superadmin/overview";

export function makeAuthGuard({ isAuthenticated, getRole, getToken, userStart, verify }) {
  return function authGuard(to, from, next) {
    const role = getRole();

    // A signed-in person on the public home page goes to their own start (FK5).
    if (to.path === "/" && isAuthenticated()) {
      if (role === "user") return next(userStart());
      if (role === "superAdmin") return next(STAFF_START);
    }

    // A public page: nothing to check.
    if (!to.matched.some((record) => record.meta.userType)) return next();

    const userType = to.meta.userType;
    const token = getToken();

    // A page for the OTHER kind of account (FS13): a tenant who opened a /superadmin address was checked as
    // platform staff, refused, and signed out of their own session. They are sent back to their own start.
    const wrongKind = token && token !== "undefined"
      && ((role === "user" && userType === "superadmin") || (role === "superAdmin" && userType === "user"));

    if (wrongKind) return next(role === "user" ? userStart() : STAFF_START);

    // Waited for (FK1): the page is not entered until the session has been checked. `false` means the person was
    // signed out and is already on the way to the sign-in page.
    return verify(userType).then((ok) => (ok === false ? next(false) : next()));
  };
}

export default makeAuthGuard;
