/**
 * Request context — designation, tier and active portal.
 *
 * Populated from the login response, which carries `context` (designation, tier,
 * company_id, agent_id) and `portal` (key, label, scope). Persisted to localStorage so a
 * page refresh does not lose the shell's shape before /me returns.
 *
 * 🔴 **THIS IS CONVENIENCE, NEVER SECURITY.** Everything here is re-checked server-side
 * on every request — the role gates, the tier middleware and the portal middleware all
 * run regardless of what this store says. A user editing localStorage changes what their
 * sidebar looks like and nothing else. Never gate a mutation on these values alone.
 */

import ApiService from "@/core/services/api.service";

const STORAGE_KEY = "f16s_context";

export const SET_CONTEXT = "setContext";
export const PURGE_CONTEXT = "purgeContext";

const persisted = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
};

const saved = persisted();

const state = {
  designation: saved.designation || null,
  tier: saved.tier || null,
  companyId: saved.companyId || null,
  agentId: saved.agentId || null,
  portal: saved.portal || null, // { key, label, scope }
};

/** Ascending entitlement. The ORDER is load-bearing — tierAtLeast compares by index. */
const TIERS = ["core", "tactical", "command"];

const getters = {
  designation: (state) => state.designation,
  tier: (state) => state.tier,
  portal: (state) => state.portal,

  /** 'air' | 'sea' | 'road', or null on the cross-mode portals (accounts, admin). */
  portalScope: (state) => (state.portal ? state.portal.scope : null),

  portalLabel: (state) => (state.portal ? state.portal.label : null),

  tierAtLeast: (state) => (required) => {
    if (!required) return true;
    const have = TIERS.indexOf(state.tier);
    const need = TIERS.indexOf(required);
    return have !== -1 && need !== -1 && have >= need;
  },

  /**
   * Mirrors the server gates in AuthServiceProvider.
   *
   * ⚠️ TIER IS CHECKED BEFORE ROLE, exactly as the server does. On `core` designation is
   * inert and nothing role-scoped opens, whatever the column says.
   */
  can: (state, getters) => (designations, minTier) => {
    if (!getters.tierAtLeast(minTier)) return false;
    if (!designations || designations.length === 0) return true;
    return designations.indexOf(state.designation) !== -1;
  },
};

const mutations = {
  [SET_CONTEXT](state, { context, portal }) {
    state.designation = (context && context.designation) || null;
    state.tier = (context && context.tier) || null;
    state.companyId = (context && context.company_id) || null;
    state.agentId = (context && context.agent_id) || null;
    state.portal = portal || null;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          designation: state.designation,
          tier: state.tier,
          companyId: state.companyId,
          agentId: state.agentId,
          portal: state.portal,
        })
      );
    } catch (e) {
      /* private browsing — the shell still works, it just re-fetches on refresh */
    }
  },

  [PURGE_CONTEXT](state) {
    state.designation = null;
    state.tier = null;
    state.companyId = null;
    state.agentId = null;
    state.portal = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* nothing to clear */
    }
  },
};

export const LOAD_CONTEXT = "loadContext";

const actions = {
  /**
   * Fetch the context for a session that has a token but no stored context.
   *
   * 🔴 Without this the rail silently degrades: `designation` is null, so every
   * role-scoped item is filtered out and the user stares at a near-empty sidebar while
   * being perfectly authenticated. Nothing prompts them, because nothing is broken from
   * the server's point of view — their token is fine.
   *
   * ⚠️ Only when it is MISSING. This is not a refresh on every page load; the login
   * response is still the normal path and localStorage still carries it across refreshes.
   */
  [LOAD_CONTEXT](context) {
    if (context.state.designation) return Promise.resolve();

    return ApiService.get("/me")
      .then(({ data }) => context.commit(SET_CONTEXT, { context: data.context, portal: data.portal }))
      // A failure here leaves the shell exactly as it was. The route guards and the
      // server still decide everything that matters.
      .catch(() => {});
  },
};

export default { state, getters, actions, mutations };
