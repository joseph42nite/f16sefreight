<template>
  <section class="fx-section fx-bl-reader" aria-label="Read a bill of lading">
    <h2 class="fx-section__title">Read a BL or booking</h2>
    <p class="fx-muted">
      A carrier's bill of lading or booking confirmation, as a PDF. What it says is shown against this bill's fields;
      tick what to take. Nothing is kept until you {{ mode === "save" ? "save it to the bill" : "save the form" }}.
    </p>

    <div class="fx-toolbar">
      <input ref="file" type="file" accept="application/pdf" class="fx-input" :disabled="busy" aria-label="BL or booking PDF" />
      <button class="fx-btn" :disabled="busy" @click="read">{{ busy ? "Reading…" : "Read it" }}</button>
    </div>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>

    <!-- A scan costs credits to read; a person decides (PRD §5.1 consent). -->
    <div v-if="consent" class="fx-notice" role="status">
      This looks like a scan ({{ consent.pages || "?" }} page(s)). Read it with AI for {{ consent.cost }} credit(s)?
      <button class="fx-btn" :disabled="busy" @click="answer('accept')">Read it</button>
      <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="answer('decline')">No</button>
    </div>

    <template v-if="bill">
      <p v-if="modelError" class="fx-error" role="alert">The AI did not read it: {{ modelError }}. Type the bill in instead.</p>

      <table v-if="bill.fields.length" class="fx-table">
        <thead>
          <tr><th scope="col">Take</th><th scope="col">Field</th><th scope="col">The document says</th><th scope="col">Goes in as</th></tr>
        </thead>
        <tbody>
          <tr v-for="f in bill.fields" :key="f.key" :class="{ 'is-review': f.problem }">
            <td><input v-model="take[f.key]" type="checkbox" :disabled="f.value === null" :aria-label="'Take ' + f.label" /></td>
            <td>{{ f.label }}</td>
            <td>{{ f.read }}</td>
            <td>
              <span v-if="f.value !== null" class="identifier">{{ f.key === "carrier_id" ? f.read : f.value }}</span>
              <span v-if="f.problem" class="fx-muted">{{ f.problem }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-if="bill.containers.length" class="fx-table">
        <thead><tr><th scope="col">Take</th><th scope="col">Container</th><th scope="col">Seal</th><th scope="col"></th></tr></thead>
        <tbody>
          <tr v-for="(c, i) in bill.containers" :key="c.container_number + i" :class="{ 'is-review': c.problem }">
            <td><input v-model="takeBox[i]" type="checkbox" :aria-label="'Take ' + c.container_number" /></td>
            <td class="identifier">{{ c.container_number }}</td>
            <td class="identifier">{{ c.seal_number || "—" }}</td>
            <td class="fx-muted">{{ c.problem }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Parties are matched, never created: a name that is one of yours can be used; the rest go in Parties. -->
      <ul v-if="bill.parties.length" class="fx-bl-reader__parties">
        <li v-for="p in bill.parties" :key="p.role">
          <strong>{{ ROLE[p.role] }}:</strong> {{ p.name }}<span v-if="p.address" class="fx-muted"> — {{ p.address }}</span>
          <template v-if="p.match && jobId">
            · <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="useParty(p)">Use {{ p.match.name }}</button>
          </template>
          <span v-else class="fx-muted"> · not one of your clients or partners — choose it in Parties</span>
        </li>
      </ul>

      <div class="fx-toolbar">
        <button class="fx-btn fx-btn--primary" :disabled="busy || !anyTaken" @click="apply">
          {{ mode === "save" ? "Save to the bill" : "Put into the form" }}
        </button>
      </div>
      <p v-if="notice" class="fx-notice" role="status">{{ notice }}</p>
    </template>
  </section>
</template>

<script>
import ApiService from "@/core/services/api.service";

/**
 * Reading a BL or a carrier's booking into the sea bill (guide Step 12.4).
 *
 * The same road as an invoice in the Extraction panel — upload, the queue, the parser, a scan asks before it spends —
 * with the bill's own schema. The server returns each value already in the form's own field and checked against
 * §4.1.2 (SeaBillReading); a value with a problem is shown, never ticked.
 *
 * `mode="form"` puts the ticked values into the FocusSea form for the operator to save; `mode="save"` (the inbox)
 * saves them to the bill directly, merging containers with the ones already on it.
 */
const ROLE = { shipper: "Shipper", consignee: "Consignee", notify_party: "Notify" };

export default {
  name: "BlReader",
  props: {
    jobId: { type: [Number, String], default: null },
    mode: { type: String, default: "form" },
  },
  data: () => ({ ROLE, busy: false, error: null, reading: null, consent: null, bill: null, modelError: null, take: {}, takeBox: {}, notice: null }),
  computed: {
    anyTaken() {
      return Object.values(this.take).some(Boolean) || Object.values(this.takeBox).some(Boolean);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    read() {
      const file = this.$refs.file && this.$refs.file.files[0];
      if (!file) { this.error = "Choose the PDF first."; return; }

      const body = new FormData();
      body.append("upload_file", file);
      body.append("type", "bill_of_lading");
      if (this.jobId) body.append("job_id", this.jobId);

      Object.assign(this, { busy: true, error: null, bill: null, consent: null, notice: null, modelError: null });
      ApiService.post("/user/upload-awb-file", body)
        .then(({ data }) => { this.reading = data.job_id; this.poll(); })
        .catch((e) => { this.error = this.readable(e); this.busy = false; });
    },
    poll() {
      ApiService.get("/user/ocr-status/" + this.reading)
        .then(({ data }) => {
          if (data.job_status === "completed") return this.show(data);
          if (data.job_status === "awaiting_vision_consent") {
            this.consent = { pages: data.page_count, cost: data.credit_cost };
            this.busy = false;
            return null;
          }
          if (data.job_status === "failed") {
            this.error = data.failure_code === "upgrade_required"
              ? "Reading documents with AI is on the Tactical plan." : (data.error || "The document could not be read.");
            this.busy = false;
            return null;
          }
          this.timer = setTimeout(this.poll, 1500);
          return null;
        })
        .catch((e) => { this.error = this.readable(e); this.busy = false; });
    },
    answer(decision) {
      this.busy = true;
      ApiService.post("/user/ocr-consent/" + this.reading, { decision })
        .then(() => {
          this.consent = null;
          if (decision === "accept") this.poll();
          else this.busy = false;
        })
        .catch((e) => { this.error = this.readable(e); this.busy = false; });
    },
    show(data) {
      this.bill = data.bill || { fields: [], containers: [], parties: [] };
      this.modelError = data.model_error || null;
      this.take = {};
      this.bill.fields.forEach((f) => { this.$set(this.take, f.key, !!f.apply); });
      this.takeBox = {};
      this.bill.containers.forEach((c, i) => { this.$set(this.takeBox, i, !!c.apply); });
      this.busy = false;
    },
    /** What was ticked: the form's own keys, and the containers. */
    taken() {
      const fields = {};
      this.bill.fields.forEach((f) => { if (this.take[f.key] && f.value !== null) fields[f.key] = f.value; });
      const containers = this.bill.containers.filter((c, i) => this.takeBox[i])
        .map((c) => ({ container_number: c.container_number, seal_number: c.seal_number || null }));
      return { fields, containers };
    },
    apply() {
      const reading = this.taken();
      if (this.mode !== "save") {
        // The form says what it took and what it left; one notice, not two.
        this.$emit("apply", reading);
        return;
      }
      this.saveToBill(reading);
    },
    /** The inbox: the bill as it stands, with the ticked values over it and the containers merged in. */
    saveToBill({ fields, containers }) {
      this.busy = true;
      ApiService.get(`/jobs/${this.jobId}/sea-shipment`)
        .then(({ data }) => {
          const locked = data.from_master || [];
          const payload = {};
          const skipped = [];
          Object.keys(fields).forEach((k) => {
            const key = k === "bl_number" ? (data.document === "master" ? "mbl_number" : "hbl_number") : k;
            if (locked.includes(key)) skipped.push(key); else payload[key] = fields[k];
          });
          let boxesNote = "";
          if (containers.length && data.locking && data.locking.containers_enabled) {
            const have = (data.containers || []).map((c) => ({ container_number: c.container_number, container_type: c.container_type, seal_number: c.seal_number }));
            containers.forEach((c) => { if (!have.some((h) => h.container_number === c.container_number)) have.push(c); });
            payload.containers = have;
          } else if (containers.length) {
            boxesNote = " The containers were not added: this bill's cargo type carries none.";
          }
          return ApiService.post(`/jobs/${this.jobId}/sea-shipment`, payload).then(() => {
            this.notice = "Saved to the bill." + (skipped.length ? " Left as the master has them: " + skipped.join(", ").replace(/_/g, " ") + "." : "") + boxesNote;
            this.$emit("saved");
          });
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    useParty(p) {
      this.busy = true;
      ApiService.post(`/jobs/${this.jobId}/entities`, { role: p.role, party_type: p.match.party_type, party_id: p.match.party_id })
        .then(() => { this.notice = `${p.match.name} is now the ${p.role}.`; this.$emit("parties"); })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      if (d.errors) return Object.values(d.errors).flat().join(" ");
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
