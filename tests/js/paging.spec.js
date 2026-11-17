/**
 * Frontend audit FM7: three registers read page one of a 50-a-page list and had no pager, so row 51 could not be
 * seen. They now share one pager.
 */
import fs from "fs";
import path from "path";
import { mount } from "@vue/test-utils";
import { pagingOf, pagingMixin } from "@/core/services/paging";
import Pager from "@/view/pages/freight/components/Pager.vue";

beforeAll(() => { window.scrollTo = jest.fn(); });

const page = (name) => fs.readFileSync(path.resolve(__dirname, "../../resources/js/src/view/pages/freight", name), "utf8");

/** A stand-in page: the mixin over a `load` that only counts its calls. */
function register(data = {}) {
  const vm = { ...pagingMixin.data(), ...data, load: jest.fn() };
  Object.keys(pagingMixin.methods).forEach((k) => { vm[k] = pagingMixin.methods[k].bind(vm); });
  return vm;
}

describe("pagingOf", () => {
  it("reads the page, the last page and the count from the server's answer", () => {
    expect(pagingOf({ current_page: 2, last_page: 3, total: 120 }, 50)).toEqual({ page: 2, lastPage: 3, total: 120 });
  });

  it("is one page of the rows it was given when the answer is not paged", () => {
    // The unposted register answers `{ rows, total }`, where total is money and not a count of rows.
    expect(pagingOf({ rows: [], total: 99000 }, 7)).toEqual({ page: 1, lastPage: 1, total: 7 });
    expect(pagingOf(undefined)).toEqual({ page: 1, lastPage: 1, total: 0 });
  });
});

describe("pagingMixin", () => {
  it("asks for the page it is on", () => {
    expect(register({ page: 3 }).pageParam()).toBe("page=3");
  });

  it("starts a new search from the first page", () => {
    const vm = register({ page: 4 });
    vm.search();
    expect(vm.page).toBe(1);
    expect(vm.load).toHaveBeenCalledTimes(1);
  });

  it("goes to the page asked for", () => {
    const vm = register();
    vm.goTo(2);
    expect(vm.page).toBe(2);
    expect(vm.load).toHaveBeenCalledTimes(1);
  });

  it("keeps what the server said", () => {
    const vm = register({ page: 2 });
    expect(vm.readPaging({ current_page: 2, last_page: 5, total: 230 }, 50)).toBe(false);
    expect([vm.page, vm.lastPage, vm.total]).toEqual([2, 5, 230]);
    expect(vm.load).not.toHaveBeenCalled();
  });

  it("falls back to the last page when the one asked for is past the end", () => {
    const vm = register({ page: 3 });
    expect(vm.readPaging({ current_page: 3, last_page: 2, total: 100, data: [] }, 0)).toBe(true);
    expect(vm.page).toBe(2);
    expect(vm.load).toHaveBeenCalledTimes(1);
  });
});

describe("Pager", () => {
  it("is not drawn for a single page", () => {
    expect(mount(Pager, { propsData: { page: 1, lastPage: 1, total: 12 } }).find("nav").exists()).toBe(false);
  });

  it("says where the reader is and moves one page at a time", async () => {
    const wrapper = mount(Pager, { propsData: { page: 2, lastPage: 3, total: 120, noun: "filings" } });
    expect(wrapper.text()).toContain("Page 2 of 3 · 120 filings");

    const [previous, next] = wrapper.findAll("button").wrappers;
    await previous.trigger("click");
    await next.trigger("click");
    expect(wrapper.emitted().go).toEqual([[1], [3]]);
  });

  it("stops at both ends and while a page is loading", () => {
    const buttons = (props) => mount(Pager, { propsData: props }).findAll("button").wrappers.map((b) => b.element.disabled);
    expect(buttons({ page: 1, lastPage: 3 })).toEqual([true, false]);
    expect(buttons({ page: 3, lastPage: 3 })).toEqual([false, true]);
    expect(buttons({ page: 2, lastPage: 3, busy: true })).toEqual([true, true]);
  });
});

describe("the three registers", () => {
  it.each(["ManifestFiling.vue", "DirectoryTable.vue", "Financials.vue"])("%s pages its list", (name) => {
    const source = page(name);
    expect(source).toContain("mixins: [pagingMixin]");
    expect(source).toContain("<Pager ");
    expect(source).toContain("this.pageParam()");
    expect(source).toContain("this.readPaging(data");
  });

  it("a filter starts again from the first page", () => {
    expect(page("ManifestFiling.vue")).not.toMatch(/@(change|keyup\.enter|click)="load"/);
    expect(page("DirectoryTable.vue")).toContain("setTimeout(this.search, 250)");
    expect(page("Financials.vue")).toContain('v-model="status" class="fx-input" @change="search"');
  });
});
