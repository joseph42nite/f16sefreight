import { shallowMount } from "@vue/test-utils";
import ExtractionPanel from "@/view/pages/freight/components/ExtractionPanel.vue";
import ApiService from "@/core/services/api.service";

jest.mock("@/core/services/api.service", () => ({ get: jest.fn(), post: jest.fn(), query: jest.fn() }));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Walk 2 #20: Generate client link files the PDF, which moves the job to "PDF Generated" on the server, but the
 * workspace header kept saying Intake until a reload. The panel now says the job changed, so the workspace reloads it.
 */
describe("ExtractionPanel — Generate client link", () => {
  beforeEach(() => {
    ApiService.get.mockReset().mockResolvedValue({ data: {} });
    ApiService.query.mockReset().mockResolvedValue({ data: {} });
    ApiService.post.mockReset()
      .mockResolvedValueOnce({ data: { document_id: 9 } })
      .mockResolvedValueOnce({ data: { url: "https://x.test/d/abc" } });
  });

  it("tells the workspace the job moved on once the link is made", async () => {
    const wrapper = shallowMount(ExtractionPanel, { propsData: { jobId: 5 } });
    wrapper.setData({ awbCode: "176", awbNo: "10000008" });

    wrapper.vm.createClientLink();
    await flush();

    expect(wrapper.vm.shareLink).toBe("https://x.test/d/abc");
    expect(wrapper.emitted("job-changed")).toHaveLength(1);
  });

  it("says nothing when the link could not be made", async () => {
    ApiService.post.mockReset().mockRejectedValue({ response: { status: 422, data: { message: "No" } } });
    const wrapper = shallowMount(ExtractionPanel, { propsData: { jobId: 5 } });
    wrapper.setData({ awbCode: "176", awbNo: "10000008" });

    wrapper.vm.createClientLink();
    await flush();

    expect(wrapper.emitted("job-changed")).toBeUndefined();
  });
});
