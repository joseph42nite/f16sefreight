import ApiService from "@/core/services/api.service";

/**
 * `/me`, asked once for everyone who needs it on a load (GAPS #466). The shell, the profile menu and the mailbox
 * reminder each fetched it, so one page spent three of the API's per-minute requests on the same answer. Callers
 * within a few seconds share one request; `fresh` asks again (the profile was just changed), and a failure is not kept.
 */
const SHARE_MS = 5000;
let pending = null;
let askedAt = 0;

export function getMe({ fresh = false } = {}) {
  if (!fresh && pending && Date.now() - askedAt < SHARE_MS) return pending;

  askedAt = Date.now();
  pending = ApiService.get("/me");
  pending.catch(() => { pending = null; });

  return pending;
}
