<template>
  <!--
    ✉ Mails to the team (user, 2026-09-16; GAPS #457). The Boss's (/boss/mails): worked out nightly from the figures —
    targets, drops, clients gone quiet, a branch behind target, lanes lost on price, slower replies, money overdue — and,
    each quarter, a review per client for its salesperson. A Command salesperson's (/sales/team-mails): that quarter's
    review per client, for the ops and pricing staff who worked it. Drafted when opened, sent from the sender's own
    mailbox, to staff only; nothing goes on its own.
  -->
  <section class="fx-section">
    <h2 class="fx-section__title">{{ title }}</h2>
    <p class="fx-muted fx-outreach__intro">{{ intro }}</p>

    <p v-if="loaded && !hasMailbox" class="fx-warn" role="status">
      Mails go from your own mailbox. <router-link to="/settings">Connect your mailbox in Settings</router-link> before sending.
    </p>
    <p v-if="loaded && !mails.length" class="fx-muted">{{ empty }}</p>

    <ul v-else class="fx-outreach">
      <li v-for="m in mails" :key="m.id" class="fx-outreach__card">
        <div class="fx-outreach__head">
          <strong>{{ m.kind === "quarterly_review" ? m.facts.client : m.branch }}</strong>
          <span class="fx-chip">{{ m.title }}</span>
        </div>
        <p class="fx-outreach__why">{{ summary(m) }}</p>
        <p class="fx-muted fx-outreach__note">
          To: {{ m.suggested_to.length ? m.suggested_to.map((p) => p.name).join(", ") : "nobody in this branch yet — add who should get it" }}
        </p>

        <form v-if="dismissing && dismissing.id === m.id" class="fx-outreach__dismiss" @submit.prevent="dismiss(m)">
          <label class="fx-field">
            <span class="fx-field__label">Why dismiss?</span>
            <select v-model="dismissing.reason" class="fx-input" required>
              <option value="" disabled>Choose a reason</option>
              <option v-for="(label, key) in dismissReasons" :key="key" :value="key">{{ label }}</option>
            </select>
          </label>
          <input v-if="dismissing.reason" v-model="dismissing.note" class="fx-input" maxlength="500"
                 :required="dismissing.reason === 'other'" placeholder="Anything to add" />
          <p v-if="dismissing.error" class="fx-error" role="alert">{{ dismissing.error }}</p>
          <div class="fx-outreach__actions">
            <button class="fx-btn" :disabled="!dismissing.reason">Dismiss</button>
            <button type="button" class="fx-btn fx-btn--ghost" @click="dismissing = null">Cancel</button>
          </div>
        </form>
        <div v-else class="fx-outreach__actions">
          <button class="fx-btn fx-btn--primary" @click="open(m)">{{ m.subject ? "Open draft" : "✉ Draft mail" }}</button>
          <router-link v-if="m.kind === 'quarterly_review'" class="fx-btn fx-btn--ghost" :to="'/review/' + m.id">See the details</router-link>
          <button class="fx-btn fx-btn--ghost" @click="dismissing = { id: m.id, reason: '', note: '', error: null }">Dismiss</button>
        </div>
      </li>
    </ul>

    <FxDrawer :open="!!composing" :title="composing ? composing.title + ' · ' + heading(composing) : ''" @close="composing = null">
      <template v-if="composing">
        <p v-if="drafting" class="fx-muted" role="status">Writing the draft… {{ draftSeconds }} s</p>
        <template v-else>
          <p class="fx-muted fx-outreach__note">
            {{ writtenBy === "ai" ? "Drafted by AI from the figures." : "A starting draft from the figures." }}
            Read it and change anything before you send. It can go only to your own staff.
          </p>
          <label class="fx-field">
            <span class="fx-field__label">To</span>
            <input v-model="form.to" class="fx-input" placeholder="name@company.com, …" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Cc</span>
            <input v-model="form.cc" class="fx-input" placeholder="Optional" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Subject</span>
            <input v-model="form.subject" class="fx-input" />
          </label>
          <MailEditor v-model="form.body" />
          <p class="fx-muted fx-outreach__note">Your mailbox signature is added when it is sent.</p>
          <p v-if="sendError" class="fx-error" role="alert">{{ sendError }}</p>
        </template>
      </template>
      <template #footer>
        <button class="fx-btn" :disabled="drafting || sending" @click="draft(composing)">Redraft</button>
        <button class="fx-btn fx-btn--primary" :disabled="drafting || sending || !form.to.trim()" @click="send">
          {{ sending ? "Sending…" : "Send" }}
        </button>
      </template>
    </FxDrawer>
  </section>
</template>

<script>
import ApiService from "@/core/services/api.service";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";

const list = (text) => String(text || "").split(",").map((x) => x.trim()).filter(Boolean);

export default {
  name: "TeamMails",
  components: { FxDrawer, MailEditor },
  props: {
    /** "/boss/mails" or "/sales/team-mails" — the same flow, each scoped to its own rows by the server. */
    endpoint: { type: String, required: true },
    title: { type: String, default: "Mails to your team" },
    intro: { type: String, default: "Suggested from the figures. Open one to read the draft, change anything, and send it yourself." },
    empty: { type: String, default: "Nothing to raise with the team right now." },
  },
  data: () => ({
    mails: [], loaded: false, hasMailbox: true, dismissReasons: {}, dismissing: null,
    composing: null, form: { to: "", cc: "", subject: "", body: "" },
    drafting: false, draftSeconds: 0, writtenBy: null, sending: false, sendError: null,
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      ApiService.get(this.endpoint)
        .then(({ data }) => {
          this.mails = data.mails || [];
          this.hasMailbox = data.has_mailbox;
          this.dismissReasons = data.dismiss_reasons || {};
        })
        .catch(() => { this.mails = []; })
        .finally(() => { this.loaded = true; });
    },
    heading(m) {
      return m.kind === "quarterly_review" ? m.facts.quarter : m.branch;
    },
    /** One line saying what the mail is about, from its figures. */
    summary(m) {
      const f = m.facts || {};
      switch (m.kind) {
        case "next_month_targets": return "Targets proposed for " + f.month + " from the last 3 months and the trend.";
        case "volume_drop": return "Tonnage " + f.change_percent + "% over the last 3 months: " + f.monthly_tonnage_kg_last_3_months + " kg a month against " + f.monthly_tonnage_kg_before + " kg before.";
        case "top_clients_quiet": return (f.clients || []).map((c) => c.client + " (" + c.last_3_months_kg + " kg of a usual " + c.usual_quarter_kg + " kg a quarter)").join(", ") + ".";
        case "behind_target": return (f.behind || []).map((b) => b.mode.toUpperCase() + " " + b.measure + " at " + b.month_end_pace_percent + "% pace").join(", ") + " · " + f.days_left + " days left.";
        case "losing_on_price": return (f.lanes || []).map((l) => l.lane + ": " + l.lost_on_price + " of " + l.closed + " lost on price").join(", ") + ".";
        case "slow_replies": return "First replies take " + f.median_hours_last_30_days + " h (was " + f.median_hours_60_days_before + " h).";
        case "money_overdue": return "₹" + Number(f.overdue_60_plus_inr).toLocaleString("en-IN") + " overdue beyond 60 days.";
        case "quarterly_review": return (f.mode === "sea" ? "Sea" : "Air") + " · " + f.quarter + ": " + f.shipments + " shipments (" + f.previous_shipments + " before), "
          + "enquiries lost " + (f.lost || []).length + ", cancelled " + (f.cancelled || []).length
          + (f.mode === "air" ? ", rejected by the airline " + (f.rejected_by_airline || []).length : "") + ".";
        default: return "";
      }
    },
    open(m) {
      this.composing = m;
      this.sendError = null;
      if (m.subject) this.fill(m);
      else this.draft(m);
    },
    fill(m) {
      this.form = { to: m.to.join(", "), cc: m.cc.join(", "), subject: m.subject || "", body: m.body || "" };
    },
    draft(m) {
      this.drafting = true;
      this.draftSeconds = 0;
      this.sendError = null;
      const ticker = setInterval(() => { this.draftSeconds += 1; }, 1000);
      ApiService.post(`${this.endpoint}/${m.id}/draft`, {})
        .then(({ data }) => {
          Object.assign(m, data);
          this.writtenBy = data.written_by;
          if (this.composing === m) this.fill(m);
        })
        .catch((err) => { this.sendError = this.error(err, "Could not write the draft. Try again."); })
        .finally(() => { clearInterval(ticker); this.drafting = false; });
    },
    send() {
      const m = this.composing;
      this.sending = true;
      this.sendError = null;
      ApiService.post(`${this.endpoint}/${m.id}/send`, {
        to: list(this.form.to), cc: list(this.form.cc), subject: this.form.subject, body: this.form.body,
      })
        .then(() => { this.mails = this.mails.filter((x) => x.id !== m.id); this.composing = null; })
        .catch((err) => { this.sendError = this.error(err, "Not sent. Try again."); })
        .finally(() => { this.sending = false; });
    },
    dismiss(m) {
      const d = this.dismissing;
      ApiService.post(`${this.endpoint}/${m.id}/dismiss`, { reason: d.reason, note: d.note || null })
        .then(() => { this.mails = this.mails.filter((x) => x.id !== m.id); this.dismissing = null; })
        .catch((err) => { d.error = this.error(err, "Not dismissed. Try again."); });
    },
    error(err, fallback) {
      const d = (err.response && err.response.data) || {};
      if (d.errors) return Object.values(d.errors).flat()[0];
      return d.error || d.message || fallback;
    },
  },
};
</script>
