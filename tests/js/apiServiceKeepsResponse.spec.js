import Vue from "vue";
import ApiService from "@/core/services/api.service";

/**
 * Walk 4 #42. get/query/delete rethrew a bare `new Error(...)` and dropped `error.response`, so every screen that read the
 * server's reason from `e.response.data` fell through to "Something went wrong." — the same text for "you may not" (403)
 * and "the server broke" (500). The wrapped error keeps the response and its status.
 */
describe("ApiService errors", () => {
  const refused = { response: { status: 403, data: { message: "This action is unauthorized." } } };

  beforeEach(() => {
    Vue.axios = { get: jest.fn().mockRejectedValue(refused), delete: jest.fn().mockRejectedValue(refused) };
  });

  it.each([["get", "/sea-shipments"], ["query", "/sea-shipments"], ["delete", "/sea-shipments/1"]])(
    "%s keeps the server's reason",
    async (verb, url) => {
      Vue.axios.get = Vue.axios.get || jest.fn();
      const error = await ApiService[verb](url).catch((e) => e);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(/ApiService/);
      expect(error.status).toBe(403);
      expect(error.response.data.message).toBe("This action is unauthorized.");
    },
  );

  it("does not invent a response for a network failure", async () => {
    Vue.axios.get = jest.fn().mockRejectedValue(new Error("Network Error"));
    const error = await ApiService.get("/x").catch((e) => e);

    expect(error.response).toBeUndefined();
    expect(error.status).toBeUndefined();
  });
});
