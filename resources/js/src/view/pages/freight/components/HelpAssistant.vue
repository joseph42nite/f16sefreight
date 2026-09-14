<template>
  <div class="fx-help">
    <!-- The launcher sits beside Report a problem: help first, a ticket when help runs out. -->
    <button
      class="fx-btn fx-btn--ghost"
      aria-label="Help assistant"
      data-help="help-assistant"
      :aria-expanded="String(open)"
      @click="open = !open"
    >💬 Help</button>

    <section v-if="open" class="fx-help__panel" role="dialog" aria-label="Help assistant">
      <header class="fx-help__head">
        <strong>Help</strong>
        <span class="fx-muted">Ask how to do something in the portal</span>
        <button class="fx-btn fx-btn--ghost" aria-label="Close help" @click="open = false">✕</button>
      </header>

      <ol ref="log" class="fx-help__log">
        <li v-if="!turns.length" class="fx-muted fx-help__hint">
          For example: “An arrival notice came in — where do I enter it?”
        </li>
        <li v-for="(t, i) in turns" :key="i" class="fx-help__turn">
          <p class="fx-help__question">{{ t.question }}</p>

          <p v-if="t.pending" class="fx-muted">Looking in the help documents…</p>
          <template v-else>
            <p class="fx-help__answer" :class="{ 'fx-help__answer--unsure': !t.found }">{{ t.answer }}</p>

            <div class="fx-help__actions">
              <!-- A page the documents named, not one the model made up (the server checks it). -->
              <button v-if="t.page && !onPage(t.page)" class="fx-btn fx-btn--ghost" @click="goTo(t.page)">Go to page</button>
              <button v-if="t.steps && t.steps.length" class="fx-btn" @click="showMe(t)">Show me</button>
              <button v-if="!t.found" class="fx-btn fx-btn--ghost" @click="raiseTicket">Raise a ticket</button>
            </div>
            <p v-if="t.note" class="fx-muted">{{ t.note }}</p>
          </template>
        </li>
      </ol>

      <form class="fx-help__ask" @submit.prevent="ask">
        <textarea
          v-model="question"
          class="fx-input fx-help__input"
          rows="2"
          maxlength="1000"
          placeholder="Type your question"
          :disabled="busy"
          @keydown.enter.exact.prevent="ask"
        ></textarea>
        <button class="fx-btn fx-btn--primary" :disabled="busy || !question.trim()">Ask</button>
      </form>
      <!-- ⚠️ Always reachable: a person who does not trust the answer should not have to argue with it first. -->
      <button class="fx-btn fx-btn--ghost fx-help__ticket" @click="raiseTicket">Still stuck? Raise a ticket</button>
    </section>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

/**
 * The help copilot (PRD §5.10, user decisions 2026-09-14).
 *
 * 🔴 Answers come only from the help documents F16s uploads; when they do not cover the question it
 * says so and offers a ticket. "Show me" highlights the controls a document names as `[[name]]`
 * (see core/config/helpTargets.js) — the server has already dropped any name the documents do not use.
 */
export default {
  name: "HelpAssistant",
  data: () => ({ open: false, question: "", busy: false, turns: [] }),
  methods: {
    ask() {
      const question = this.question.trim();
      if (!question || this.busy) return;

      // The last three answered turns, so "and where is that?" is understood.
      const history = this.turns.filter((t) => !t.pending && t.answered)
        .slice(-3).map((t) => ({ question: t.question, answer: t.answer }));

      const turn = { question, pending: true, found: false, answer: "", steps: [], page: null, note: null, answered: false };
      this.turns.push(turn);
      this.question = "";
      this.busy = true;
      this.scrollDown();

      ApiService.post("/help/ask", { question, route: this.$route ? this.$route.path : null, history })
        .then(({ data }) => Object.assign(turn, { found: data.found, answer: data.answer, steps: data.steps || [], page: data.page, answered: true }))
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          Object.assign(turn, { found: false, answer: d.error || "Help could not answer just now. Try again, or raise a ticket." });
        })
        .finally(() => { turn.pending = false; this.busy = false; this.scrollDown(); });
    },
    onPage(page) {
      return !!this.$route && this.$route.path.startsWith(page);
    },
    goTo(page) {
      this.$router.push(page).catch(() => {});
    },
    /**
     * The guided steps, on the page they belong to.
     *
     * ⚠️ A control can be on the page but not open yet — the Extraction panel lives in the workspace
     * drawer — so steps whose control is not on screen are skipped, and the note says so.
     */
    async showMe(turn) {
      if (turn.page && !this.onPage(turn.page)) {
        await this.$router.push(turn.page).catch(() => {});
      }

      const selector = (s) => '[data-help="' + s.target + '"]';
      const visible = await this.waitFor(turn.steps.map(selector));
      const steps = turn.steps.filter((s) => visible.includes(selector(s)));

      turn.note = steps.length < turn.steps.length
        ? (steps.length ? "Some steps are on a part of the page that is not open yet." : "Those controls are not on screen yet — open the part of the page the answer describes, then press Show me again.")
        : null;

      if (!steps.length) return;

      const [{ driver }] = await Promise.all([
        import(/* webpackChunkName: "driver" */ "driver.js"),
        import(/* webpackChunkName: "driver" */ "driver.js/dist/driver.css"),
      ]);

      this.open = false;
      driver({
        showProgress: steps.length > 1,
        steps: steps.map((s, i) => ({
          element: selector(s),
          popover: { title: "Step " + (i + 1), description: s.instruction },
        })),
      }).drive();
    },
    /** Selectors that are on screen, waiting up to ~3 s for a page that is still rendering. */
    async waitFor(selectors) {
      for (let i = 0; i < 15; i += 1) {
        const found = selectors.filter((sel) => document.querySelector(sel));
        if (found.length === selectors.length || i === 14) return found;
        await new Promise((r) => setTimeout(r, 200));
      }
      return [];
    },
    raiseTicket() {
      const transcript = this.turns.filter((t) => !t.pending).map((t) => ({ question: t.question, answer: t.answer || "" }));
      this.open = false;
      this.$emit("raise-ticket", transcript);
    },
    scrollDown() {
      this.$nextTick(() => { if (this.$refs.log) this.$refs.log.scrollTop = this.$refs.log.scrollHeight; });
    },
  },
};
</script>
