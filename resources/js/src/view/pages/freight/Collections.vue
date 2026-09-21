<template>
  <div>
    <header v-if="!embedded" class="fx-page-head">
      <h1 class="fx-page-title">Ageing &amp; collections</h1>
      <p class="fx-page-sub">
        {{ subtitleForView }}
        <router-link to="/billing">Billing →</router-link>
      </p>
    </header>

    <!--
      Two halves of one job (user, 2026-09-20): who owes what and for how long, and what has been done about it.
      One page, because an ageing nobody acts on is a report and a queue without the ageing beside it is a to-do
      list nobody trusts.
    -->
    <!-- Inside Money in the stage bar is the navigation; these two stay, because "who to chase" and "the ageing
         it comes from" are genuinely two readings of stage ⑤. -->
    <div class="fx-toolbar fx-financials__views">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="fx-btn"
        :class="{ 'fx-btn--primary': view === v.key }"
        @click="showView(v.key)"
      >{{ v.label }}</button>
    </div>

    <div class="fx-toolbar">
      <label v-if="branches.length > 1" class="fx-field">
        <span class="fx-field__label">Branch</span>
        <select v-model="filters.agent_id" class="fx-input" @change="load">
          <option :value="null">All branches</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </label>
      <label v-if="view === 'ageing'" class="fx-field">
        <!-- An ageing is always AS OF a date; the month-end one is the figure that gets reported. -->
        <span class="fx-field__label">As of</span>
        <input v-model="filters.as_of" type="date" class="fx-input" @change="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Who</span>
        <select v-model="filters.party_type" class="fx-input" @change="load">
          <option value="">Clients and agents</option>
          <option value="customer">Clients</option>
          <option value="partner">Agents and partners</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Search</span>
        <input v-model="filters.q" class="fx-input" placeholder="organization or number" @keyup.enter="load" />
      </label>
      <button v-if="view === 'ageing'" class="fx-btn" :disabled="busy" @click="exportCsv">Export</button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <!-- ── The ageing ────────────────────────────────────────────────────── -->
    <template v-else-if="view === 'ageing'">
      <p v-if="!parties.length" class="fx-muted">Nobody owes anything.</p>
      <template v-else>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Organization</th>
              <th class="fx-num" scope="col">Docs</th>
              <th v-for="(label, key) in buckets" :key="key" class="fx-num" scope="col">{{ label }}</th>
              <th class="fx-num" scope="col">Total</th>
              <th class="fx-num" scope="col">Overdue</th>
              <th scope="col">Oldest</th>
              <th scope="col">Being chased</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in parties"
              :key="p.party_type + p.party_id"
              class="is-clickable"
              :class="{ 'is-selected': isOpen(p) }"
              tabindex="0"
              @click="openParty(p)"
              @keydown.enter="openParty(p)"
            >
              <td>
                {{ p.name }}
                <span v-if="p.party_type === 'partner'" class="fx-muted">(agent)</span>
              </td>
              <td class="fx-num">{{ p.documents }}</td>
              <td v-for="(label, key) in buckets" :key="key" class="fx-num" :class="{ 'is-late': key === 'd90_plus' && p[key] > 0 }">
                <Figure v-if="p[key]" :value="p[key]" kind="currency" currency-code="INR" />
                <span v-else class="fx-muted">—</span>
              </td>
              <td class="fx-num"><Figure :value="p.total" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><strong><Figure :value="p.overdue" kind="currency" currency-code="INR" /></strong></td>
              <td>{{ p.oldest_days ? p.oldest_days + " days" : "—" }}</td>
              <td>
                <span v-if="p.being_chased">
                  {{ money(p.promised) }}<span v-if="p.promised_by"> by {{ p.promised_by }}</span>
                </span>
                <span v-else class="fx-muted">Not yet</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"><strong>{{ parties.length }} organization(s)</strong></td>
              <td v-for="(label, key) in buckets" :key="key" class="fx-num">
                <strong><Figure :value="totals[key]" kind="currency" currency-code="INR" /></strong>
              </td>
              <td class="fx-num"><strong><Figure :value="totals.total" kind="currency" currency-code="INR" /></strong></td>
              <td class="fx-num"><strong><Figure :value="totals.overdue" kind="currency" currency-code="INR" /></strong></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
        <p class="fx-muted">
          As of {{ asOf }}, in INR at each document's own exchange rate. Age runs from the due date; a credit note
          takes money off what they owe.
        </p>
      </template>
    </template>

    <!-- ── The work queue ────────────────────────────────────────────────── -->
    <template v-else>
      <div v-if="summary" class="fx-toolbar">
        <p class="fx-muted">
          <strong>{{ money(summary.overdue) }}</strong> overdue across {{ summary.parties }} organization(s).
          {{ summary.broken_promises }} broken promise(s), {{ summary.never_chased }} nobody has called,
          {{ money(summary.promised) }} promised.
        </p>
      </div>

      <p v-if="!queue.length" class="fx-muted">Nothing is overdue. Nobody to chase today.</p>
      <table v-else class="fx-table">
        <thead>
          <tr>
            <th scope="col">Organization</th>
            <th class="fx-num" scope="col">Overdue</th>
            <th scope="col">Oldest</th>
            <th scope="col">Where it stands</th>
            <th class="fx-num" scope="col">Promised</th>
            <th scope="col">By when</th>
            <th scope="col">Next action</th>
            <th scope="col">Last note</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in queue"
            :key="'q-' + p.party_type + p.party_id"
            class="is-clickable"
            :class="{ 'is-selected': isOpen(p) }"
            tabindex="0"
            @click="openParty(p)"
            @keydown.enter="openParty(p)"
          >
            <td>{{ p.name }}</td>
            <td class="fx-num"><Figure :value="p.overdue" kind="currency" currency-code="INR" /></td>
            <td>{{ p.oldest_days ? p.oldest_days + " days" : "—" }}</td>
            <td>
              <span v-if="p.promise_broken"><StatusChip value="promise_broken" /> They said they would pay</span>
              <span v-else-if="p.never_chased"><StatusChip value="not_chased" /> Nobody has called</span>
              <span v-else-if="p.due_today">Due to be chased</span>
              <span v-else class="fx-muted">Waiting on their date</span>
            </td>
            <td class="fx-num">
              <Figure v-if="p.promised" :value="p.promised" kind="currency" currency-code="INR" />
              <span v-else class="fx-muted">—</span>
            </td>
            <td>{{ p.promised_by || "—" }}</td>
            <td>{{ p.next_action || "—" }}</td>
            <td class="fx-muted">{{ p.last_note || "—" }}</td>
          </tr>
        </tbody>
      </table>
    </template>

    <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>

    <!-- ── One organization ──────────────────────────────────────────────── -->
    <FxDrawer
      :open="!!party"
      :title="party ? party.party.name : ''"
      :subtitle="partySubtitle"
      :tabs="PARTY_TABS"
      :active-tab="tab"
      @tab="tab = $event"
      @close="party = null"
    >
      <template #meta>
        <dl v-if="party" class="fx-defs">
          <dt>Owed</dt>
          <dd><Figure :value="party.total" kind="currency" currency-code="INR" /></dd>
          <dt>Overdue</dt>
          <dd><strong><Figure :value="party.overdue" kind="currency" currency-code="INR" /></strong></dd>
          <dt>Credit limit</dt>
          <dd>
            <span v-if="party.party.credit_limit === null" class="fx-muted">Not configured</span>
            <Figure v-else :value="party.party.credit_limit" kind="currency" currency-code="INR" />
          </dd>
          <dt>Chase goes to</dt>
          <dd class="fx-muted">{{ party.contacts.join(", ") || "No address on file" }}</dd>
        </dl>
      </template>

      <template v-if="party">
        <!-- What they owe, oldest first. -->
        <section v-if="tab === 'documents'" class="fx-section">
          <table class="fx-table">
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col">Type</th>
                <th scope="col">Raised</th>
                <th scope="col">Due</th>
                <th scope="col">Age</th>
                <th class="fx-num" scope="col">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in party.documents" :key="'pd-' + d.id">
                <td class="identifier">{{ d.invoice_no }}</td>
                <td>{{ d.label }}</td>
                <td><Figure :value="d.document_date" kind="date" /></td>
                <td>
                  {{ d.due_on }}
                  <!-- 🔴 Said, not hidden: this bill had no due date and is aged from the day it was raised. -->
                  <span v-if="d.due_assumed" class="fx-muted">(assumed)</span>
                </td>
                <td :class="{ 'is-late': d.days_overdue > 90 }">
                  {{ d.days_overdue ? d.days_overdue + " days over" : "Not due" }}
                </td>
                <td class="fx-num"><Figure :value="d.outstanding_inr" kind="currency" currency-code="INR" /></td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- What has been said, and what was promised. -->
        <section v-else class="fx-section">
          <h3 class="fx-section__title">Log a chase</h3>
          <div class="fx-toolbar">
            <label v-if="branches.length > 1" class="fx-field">
              <span class="fx-field__label">Branch</span>
              <select v-model="chase.agent_id" class="fx-input">
                <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">How</span>
              <select v-model="chase.channel" class="fx-input">
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="visit">Visit</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">They promised</span>
              <input v-model.number="chase.promised_amount" type="number" step="0.01" class="fx-input fx-num" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">By when</span>
              <input v-model="chase.promised_date" type="date" class="fx-input" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Ask again on</span>
              <input v-model="chase.next_action_date" type="date" class="fx-input" />
            </label>
          </div>
          <label class="fx-field">
            <span class="fx-field__label">What was said</span>
            <textarea v-model="chase.note" class="fx-input" rows="3" placeholder="who you spoke to, and what they said"></textarea>
          </label>
          <div class="fx-toolbar">
            <button class="fx-btn fx-btn--primary" :disabled="busy || !chase.note.trim()" @click="logChase">Log it</button>
            <button class="fx-btn" :disabled="busy || !party.overdue" @click="draftChase">Draft a chasing mail</button>
          </div>

          <h3 class="fx-section__title">What has been done</h3>
          <p v-if="!party.follow_ups.length" class="fx-muted">Nobody has chased them yet.</p>
          <table v-else class="fx-table">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">How</th>
                <th scope="col">What was said</th>
                <th class="fx-num" scope="col">Promised</th>
                <th scope="col">By when</th>
                <th scope="col">Where it stands</th>
                <th v-if="canChase" scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in party.follow_ups" :key="'f-' + f.id">
                <td><Figure :value="f.created_at" kind="date" /></td>
                <td>{{ f.channel }}</td>
                <td>
                  {{ f.note }}
                  <span v-if="f.outcome_note" class="fx-muted"> — {{ f.outcome_note }}</span>
                  <span v-if="f.invoice_no" class="fx-muted"> ({{ f.invoice_no }})</span>
                </td>
                <td class="fx-num">
                  <Figure v-if="f.promised_amount" :value="f.promised_amount" kind="currency" currency-code="INR" />
                  <span v-else class="fx-muted">—</span>
                </td>
                <td>{{ f.promised_date || "—" }}</td>
                <td><StatusChip :value="f.state" /></td>
                <td v-if="canChase" class="fx-row-actions">
                  <template v-if="f.state === 'open'">
                    <button class="fx-btn" :disabled="busy" @click="close(f, 'kept')">They paid</button>
                    <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="close(f, 'broken')">They did not</button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </template>
    </FxDrawer>

    <!-- The chasing mail, before anybody sends it. -->
    <div v-if="chaseDraft" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="chase-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="chase-title" class="fx-modal__title">Chase {{ party ? party.party.name : "" }}</h2>
        </header>
        <div class="fx-modal__body fx-newmail">
          <p class="fx-muted">
            Written from what they owe{{ chaseDraft.written_by === "ai" ? " by the model" : "" }}; every figure comes
            from the ageing. Edit anything before it goes.
          </p>
          <label class="fx-field" for="chase-to">
            <span class="fx-field__label">To</span>
            <input id="chase-to" v-model="chaseDraft.toLine" class="fx-input" placeholder="comma separated" />
          </label>
          <label class="fx-field" for="chase-subject">
            <span class="fx-field__label">Subject</span>
            <input id="chase-subject" v-model="chaseDraft.subject" class="fx-input" />
          </label>
          <MailEditor v-model="chaseDraft.body" />
          <p v-if="chaseDraft.sent" class="fx-notice" role="status">Sent, and logged against them.</p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="chaseDraft = null">Close</button>
          <button v-if="!chaseDraft.sent" class="fx-btn fx-btn--primary" :disabled="busy || !chaseDraft.toLine.trim()" @click="sendChase">
            {{ busy ? "Sending…" : "Send from my mailbox" }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";

const VIEWS = [
  { key: "queue", label: "Who to chase" },
  { key: "ageing", label: "Ageing" },
];

const PARTY_TABS = [
  { key: "documents", label: "What they owe" },
  { key: "chases", label: "What has been done" },
];

export default {
  name: "Collections",
  components: { Figure, StatusChip, FxDrawer, MailEditor },
  props: {
    /** Rendered as stage ⑤ of Money in rather than as a page of its own. */
    embedded: { type: Boolean, default: false },
  },
  data: () => ({
    /* The queue opens first: it is the day's work, and the ageing is what it is derived from. */
    view: "queue", VIEWS, PARTY_TABS,
    parties: [], totals: {}, buckets: {}, asOf: "",
    queue: [], summary: null,
    branches: [],
    filters: { agent_id: null, as_of: "", party_type: "", q: "" },
    party: null, tab: "documents",
    chase: { agent_id: null, channel: "call", note: "", promised_amount: null, promised_date: "", next_action_date: "" },
    chaseDraft: null,
    loading: true, busy: false, error: null, actionError: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Accounts chase. The Boss watches the ageing and does not log calls. */
    canChase() {
      return this.designation === "accounts";
    },
    subtitleForView() {
      return this.view === "ageing"
        ? "What every client and agent owes, and how long it has been owed."
        : "Who to call today: broken promises first, then whoever nobody has called.";
    },
    partySubtitle() {
      if (!this.party) return "";

      return `${this.party.documents.length} open document(s)`
        + (this.party.party.gst_no ? ` · GSTIN ${this.party.party.gst_no}` : "");
    },
  },
  created() {
    this.load();
  },
  methods: {
    showView(key) {
      this.view = key;
      this.party = null;
      this.actionError = null;
      this.load();
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    },
    isOpen(row) {
      return !!this.party && this.party.party.id === row.party_id && this.party.party.type === row.party_type;
    },
    query() {
      const params = [];
      ["agent_id", "party_type", "q"].forEach((key) => {
        if (this.filters[key]) params.push(key + "=" + encodeURIComponent(this.filters[key]));
      });
      if (this.view === "ageing" && this.filters.as_of) params.push("as_of=" + this.filters.as_of);

      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;
      ApiService.get((this.view === "ageing" ? "/ageing" : "/collections") + this.query())
        .then(({ data }) => {
          if (this.view === "ageing") {
            this.parties = data.parties || [];
            this.totals = data.totals || {};
            this.buckets = data.buckets || {};
            this.asOf = data.as_of;
          } else {
            this.queue = data.queue || [];
            this.summary = data.summary;
          }

          if (data.branches) this.branches = data.branches;
          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    exportCsv() {
      this.busy = true;
      ApiService.query("/ageing/export" + this.query(), { responseType: "blob" })
        .then(({ data }) => {
          const url = window.URL.createObjectURL(new Blob([data], { type: "text/csv" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = "ageing.csv";
          link.click();
          setTimeout(() => window.URL.revokeObjectURL(url), 30000);
        })
        .catch(() => { this.actionError = "The export could not be built."; })
        .finally(() => { this.busy = false; });
    },
    openParty(row) {
      this.actionError = null;
      this.tab = "documents";
      ApiService.get(`/ageing/${row.party_type}/${row.party_id}`
        + (this.filters.as_of && this.view === "ageing" ? `?as_of=${this.filters.as_of}` : ""))
        .then(({ data }) => {
          this.party = data;
          this.chase = {
            agent_id: this.branches.length ? this.branches[0].id : null,
            channel: "call", note: "", promised_amount: null, promised_date: "", next_action_date: "",
          };
        })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    logChase() {
      this.busy = true;
      this.actionError = null;
      ApiService.post("/collections/follow-ups", {
        ...this.chase,
        party_type: this.party.party.type,
        party_id: this.party.party.id,
        promised_amount: this.chase.promised_amount || null,
        promised_date: this.chase.promised_date || null,
        next_action_date: this.chase.next_action_date || null,
      })
        .then(({ data }) => {
          this.party = { ...this.party, follow_ups: data.follow_ups };
          this.chase = { ...this.chase, note: "", promised_amount: null, promised_date: "", next_action_date: "" };
          this.load();
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    close(followUp, state) {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/collections/follow-ups/${followUp.id}/close`, { state })
        .then(({ data }) => { this.party = { ...this.party, follow_ups: data.follow_ups }; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    draftChase() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/ageing/${this.party.party.type}/${this.party.party.id}/draft-chase`, {})
        .then(({ data }) => { this.chaseDraft = { ...data, toLine: (data.to || []).join(", "), sent: false }; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    /** Sent from the person's own mailbox — and logged, because a chase nobody recorded did not happen. */
    sendChase() {
      const form = new FormData();
      this.chaseDraft.toLine.split(",").map((a) => a.trim()).filter(Boolean).forEach((a) => form.append("to[]", a));
      form.append("subject", this.chaseDraft.subject);
      form.append("body", this.chaseDraft.body);
      form.append("include_signature", "1");

      this.busy = true;
      this.actionError = null;
      ApiService.post("/inbox/compose", form)
        .then(() => {
          this.chaseDraft = { ...this.chaseDraft, sent: true };

          return ApiService.post("/collections/follow-ups", {
            agent_id: this.branches.length ? this.branches[0].id : null,
            party_type: this.party.party.type, party_id: this.party.party.id, channel: "email",
            note: "Chasing mail sent: " + this.chaseDraft.subject,
            next_action_date: null, promised_amount: null, promised_date: null,
          });
        })
        .then(({ data }) => { this.party = { ...this.party, follow_ups: data.follow_ups }; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      return (e.response && e.response.data && e.response.data.error) || "Something went wrong. Try again.";
    },
  },
};
</script>

<style scoped>
/* Over ninety days is the number people look for first; it should not need hunting. */
.is-late {
  font-weight: 600;
}
</style>
