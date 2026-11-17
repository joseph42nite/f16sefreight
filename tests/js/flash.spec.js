import { flash } from "@/core/services/flash";

describe("flash (a notice that fades in and out)", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("shows the notice, fades it out, and leaves it as its stylesheet has it", () => {
        const el = document.createElement("div");
        flash(el, { fade: 1000, fadeOutAt: 2000 });
        expect(el.style.display).toBe("block");
        expect(el.style.opacity).toBe("1");

        jest.advanceTimersByTime(2000);
        expect(el.style.opacity).toBe("0");
        expect(el.style.display).toBe("block");

        jest.advanceTimersByTime(1000);
        expect(el.style.display).toBe("");
        expect(el.style.opacity).toBe("");
    });

    it("never starts fading out before the fade in has ended", () => {
        const el = document.createElement("div");
        flash(el, { fade: 1000, fadeOutAt: 0 });
        jest.advanceTimersByTime(999);
        expect(el.style.opacity).toBe("1");
        jest.advanceTimersByTime(1);
        expect(el.style.opacity).toBe("0");
    });

    it("starts again cleanly when saved twice in a row", () => {
        const el = document.createElement("div");
        flash(el);
        jest.advanceTimersByTime(2500);
        flash(el);
        jest.advanceTimersByTime(600);
        expect(el.style.display).toBe("block");
        expect(el.style.opacity).toBe("1");
    });

    it("does nothing when the notice is not on the page", () => {
        expect(() => flash(null)).not.toThrow();
    });
});
