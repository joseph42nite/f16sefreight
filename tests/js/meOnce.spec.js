import ApiService from "@/core/services/api.service";
import { getMe } from "@/core/services/me";

jest.mock("@/core/services/api.service", () => ({ get: jest.fn() }));

/**
 * One /me per page load (GAPS #466): the shell, the profile menu and the mailbox reminder each fetched it, so opening
 * one conversation spent 3 of the 60 requests a minute the API allowed and "Use these figures" was refused (429).
 */
describe("getMe", () => {
  beforeEach(() => ApiService.get.mockReset().mockResolvedValue({ data: { profile: { name: "Joseph" } } }));

  it("asks the server once for callers on the same load", async () => {
    const [a, b, c] = await Promise.all([getMe(), getMe(), getMe()]);
    expect(ApiService.get).toHaveBeenCalledTimes(1);
    expect(a.data.profile.name).toBe("Joseph");
    expect(b).toBe(a);
    expect(c).toBe(a);
  });

  it("asks again when told the profile changed", async () => {
    await getMe({ fresh: true });
    await getMe(); // shared
    await getMe({ fresh: true }); // asked again
    expect(ApiService.get).toHaveBeenCalledTimes(2);
  });

  it("does not keep a failure", async () => {
    ApiService.get.mockReset().mockRejectedValueOnce(new Error("down")).mockResolvedValue({ data: {} });
    await expect(getMe({ fresh: true })).rejects.toThrow("down");
    await getMe();
    expect(ApiService.get).toHaveBeenCalledTimes(2);
  });
});
