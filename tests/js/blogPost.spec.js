/**
 * A public blog article, mounted (2026-11-15 frontend audit, tests section: "no test for the blog pages").
 */
import { shallowMount } from "@vue/test-utils";
import ApiService from "@/core/services/api.service";
import BlogPost from "@/view/pages/public/BlogPost.vue";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const article = {
  id: 4, slug: "air-rates-q4", title: "Air rates in Q4", excerpt: "What moved.", content: "<h3>Rates</h3><p>Up 4%.</p>",
  image_path: "/media/assets/blog/rates.webp", read_time: "4 min", takeaways: '["Book early","Watch fuel"]',
  published_at: "2026-10-02T00:00:00Z", meta_title: "Q4 air rates", meta_description: "Rates this quarter.",
};
const open = async (answers) => {
  jest.spyOn(ApiService, "get").mockImplementation((url) => {
    const answer = answers[url];

    return answer instanceof Error ? Promise.reject(answer) : Promise.resolve({ data: answer });
  });
  const wrapper = shallowMount(BlogPost, {
    mocks: { $route: { params: { slug: "air-rates-q4" } } },
    stubs: ["router-link", "b-icon", "b-modal", "b-button"],
  });
  await flush();

  return wrapper;
};

beforeAll(() => { window.scrollTo = jest.fn(); });
afterEach(() => jest.restoreAllMocks());

it("shows the article the server has, with its takeaways", async () => {
  const wrapper = await open({
    "/get-public-blog/air-rates-q4": { success: true, data: article },
    "/get-public-blogs": { success: true, data: [article, { ...article, id: 5, slug: "sea-rates", title: "Sea rates" }] },
  });

  expect(wrapper.find(".article-body").html()).toContain("<h3>Rates</h3>");
  expect(wrapper.vm.post.takeaways).toEqual(["Book early", "Watch fuel"]);
  expect(wrapper.text()).toContain("Book early");
  // Related: the others, never the article itself.
  expect(wrapper.vm.relatedPosts.map((p) => p.slug)).toEqual(["sea-rates"]);
});

it("keeps what it has when the server cannot be reached", async () => {
  const wrapper = await open({
    "/get-public-blog/air-rates-q4": new Error("Network Error"),
    "/get-public-blogs": new Error("Network Error"),
  });

  expect(wrapper.vm.relatedPosts.every((p) => p.slug !== "air-rates-q4")).toBe(true);
  expect(wrapper.find(".article-body").exists()).toBe(true);
});

it("describes the page for search engines from the article", async () => {
  const wrapper = await open({
    "/get-public-blog/air-rates-q4": { success: true, data: article },
    "/get-public-blogs": { success: true, data: [] },
  });
  const meta = BlogPost.metaInfo.call(wrapper.vm);
  const schema = JSON.parse(meta.script[0].innerHTML);

  expect(meta.title).toBe("Q4 air rates");
  expect(meta.meta.find((m) => m.name === "description").content).toBe("Rates this quarter.");
  expect(schema.headline).toBe("Air rates in Q4");
  expect(schema.image[0]).toMatch(/\/media\/assets\/blog\/rates\.webp$/);
});

it("a title cannot end the search-engine block early (FS6)", async () => {
  const wrapper = await open({
    "/get-public-blog/air-rates-q4": { success: true, data: { ...article, title: 'Rates </script><script>alert(1)</script>' } },
    "/get-public-blogs": { success: true, data: [] },
  });
  const block = BlogPost.metaInfo.call(wrapper.vm).script[0].innerHTML;

  expect(block).not.toContain("<");
  expect(JSON.parse(block).headline).toBe('Rates </script><script>alert(1)</script>');
});
