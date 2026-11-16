/**
 * The route guard, run (2026-11-15 frontend audit, tests section: "no test for the route guards").
 * FK1, FK5 and FS13 were checked by reading main.js; they are decided here by calling the guard.
 */
import { makeAuthGuard, STAFF_START } from "@/core/services/authGuard";

const page = (path, userType) => ({ path, meta: userType ? { userType } : {}, matched: [{ meta: userType ? { userType } : {} }] });
const guardFor = (session = {}) => {
  const verify = jest.fn(() => (session.verify === undefined ? Promise.resolve(true) : session.verify));
  const guard = makeAuthGuard({
    isAuthenticated: () => !!session.token,
    getRole: () => session.role || null,
    getToken: () => session.token || null,
    userStart: () => session.start || "/focus-air",
    verify,
  });

  return { guard, verify };
};
const go = async (guard, to) => {
  const next = jest.fn();
  await guard(to, { path: "/" }, next);

  return next;
};

describe("a public page", () => {
  it("is entered without asking the server", async () => {
    const { guard, verify } = guardFor();
    const next = await go(guard, page("/blogs-and-news"));

    expect(next).toHaveBeenCalledWith();
    expect(verify).not.toHaveBeenCalled();
  });
});

describe("the home page, signed in (FK5)", () => {
  it("sends a tenant person to where their day starts", async () => {
    const next = await go(guardFor({ token: "t", role: "user", start: "/kanban" }).guard, page("/"));

    expect(next).toHaveBeenCalledWith("/kanban");
  });

  it("sends platform staff to the overview", async () => {
    const next = await go(guardFor({ token: "t", role: "superAdmin" }).guard, page("/"));

    expect(next).toHaveBeenCalledWith(STAFF_START);
  });

  it("is shown to a visitor who is not signed in", async () => {
    const next = await go(guardFor().guard, page("/"));

    expect(next).toHaveBeenCalledWith();
  });
});

describe("a page that needs a session (FK1)", () => {
  it("is not entered until the session has been checked", async () => {
    let answer;
    const { guard, verify } = guardFor({ token: "t", role: "user", verify: new Promise((resolve) => { answer = resolve; }) });
    const next = jest.fn();

    const waiting = guard(page("/inbox", "user"), { path: "/" }, next);

    expect(verify).toHaveBeenCalledWith("user");
    expect(next).not.toHaveBeenCalled();

    answer(true);
    await waiting;

    expect(next).toHaveBeenCalledWith();
  });

  it("is refused when the check signed the person out", async () => {
    const next = await go(guardFor({ token: "t", role: "user", verify: Promise.resolve(false) }).guard, page("/inbox", "user"));

    expect(next).toHaveBeenCalledWith(false);
  });

  it("is still checked with no token, so the store can send the visitor to sign in", async () => {
    const { guard, verify } = guardFor({ verify: Promise.resolve(false) });
    const next = await go(guard, page("/inbox", "user"));

    expect(verify).toHaveBeenCalledWith("user");
    expect(next).toHaveBeenCalledWith(false);
  });
});

describe("a page for the other kind of account (FS13)", () => {
  it("sends a tenant back to their own start, unchecked and still signed in", async () => {
    const { guard, verify } = guardFor({ token: "t", role: "user", start: "/today" });
    const next = await go(guard, page("/superadmin/overview", "superadmin"));

    expect(next).toHaveBeenCalledWith("/today");
    expect(verify).not.toHaveBeenCalled();
  });

  it("sends platform staff back to the overview", async () => {
    const { guard, verify } = guardFor({ token: "t", role: "superAdmin" });
    const next = await go(guard, page("/inbox", "user"));

    expect(next).toHaveBeenCalledWith(STAFF_START);
    expect(verify).not.toHaveBeenCalled();
  });
});
