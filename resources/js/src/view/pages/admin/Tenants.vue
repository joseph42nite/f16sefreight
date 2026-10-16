<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Companies &amp; branches</h1>
      <p class="fx-page-sub">Every client company, its branches and its people. A new client is made here in three steps: the company, its first branch, its first people.</p>
    </header>

    <div class="fx-toolbar">
      <button class="fx-btn fx-btn--primary" data-test="new-client" @click="startNew">+ New client</button>
      <input v-model.trim="q" class="fx-input" placeholder="Find a company" aria-label="Find a company" />
    </div>
    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>

    <div class="fx-tenants">
      <!-- The companies, with how many branches and people each has. -->
      <ul class="fx-tenants__list" aria-label="Companies">
        <li v-for="c in shown" :key="c.id">
          <button type="button" class="fx-tenants__item" :class="{ 'is-active': open && open.company.id === c.id }" @click="openCompany(c.id)">
            <strong>{{ c.name }}</strong>
            <span class="fx-muted">{{ c.code || "no code" }} · {{ tierLabel(c.tier) }} · {{ c.branches }} {{ c.branches === 1 ? "branch" : "branches" }} · {{ c.people }} {{ c.people === 1 ? "person" : "people" }}</span>
            <span v-if="!c.branches" class="fx-tag fx-tag--warn">no branch yet</span>
          </button>
        </li>
        <li v-if="!shown.length" class="fx-muted">No company matches.</li>
      </ul>

      <section class="fx-tenants__detail">
        <!-- Step 1 of a new client: the company. -->
        <form v-if="step === 'company'" class="fx-card" @submit.prevent="saveCompany">
          <p class="fx-steps"><strong>1 Company</strong> · 2 First branch · 3 People</p>
          <label class="fx-field"><span class="fx-field__label">Company name</span>
            <input v-model.trim="company.name" class="fx-input" required maxlength="100" /></label>
          <label class="fx-field"><span class="fx-field__label">Company code (2–6 letters)</span>
            <input v-model.trim="company.code" class="fx-input" required maxlength="6" placeholder="KRL" /></label>
          <p class="fx-muted">It goes into every enquiry and job number: ENQA-<strong>{{ (company.code || "CODE").toUpperCase() }}</strong>BRANCH-26-0001.</p>
          <label class="fx-field"><span class="fx-field__label">Plan</span>
            <select v-model="company.tier" class="fx-input" required>
              <option value="core">Core — documents and consolidation</option>
              <option value="tactical">Tactical — inbox, Kanban, 500 credits a month</option>
              <option value="command">Command — everything, with accounts, 2,000 credits a month</option>
            </select></label>
          <p v-if="formError" class="fx-error" role="alert">{{ formError }}</p>
          <div class="fx-toolbar">
            <button type="button" class="fx-btn fx-btn--ghost" @click="step = null">Cancel</button>
            <button class="fx-btn fx-btn--primary" :disabled="busy">Save and add its first branch →</button>
          </div>
        </form>

        <template v-else-if="open">
          <header class="fx-tenants__head">
            <h2 class="fx-section__title">{{ open.company.name }}</h2>
            <span class="fx-muted">Code {{ open.company.code || "—" }} · {{ tierLabel(open.company.tier) }}</span>
            <router-link :to="'/superadmin/new-company/' + open.company.id" class="fx-btn fx-btn--ghost">Edit company</router-link>
          </header>

          <!-- Step 2: a branch. Its code is the second half of every document number. -->
          <form v-if="step === 'branch'" class="fx-card" @submit.prevent="saveBranch">
            <p v-if="wizard" class="fx-steps">1 Company ✓ · <strong>2 First branch</strong> · 3 People</p>
            <h3 v-else class="fx-section__title">New branch</h3>
            <div class="fx-grid2">
              <label class="fx-field"><span class="fx-field__label">Branch name</span>
                <input v-model.trim="branch.agent_name" class="fx-input" required maxlength="100" placeholder="Kochi" /></label>
              <label class="fx-field"><span class="fx-field__label">Branch code (2–5 letters)</span>
                <input v-model.trim="branch.branch_code" class="fx-input" required maxlength="5" placeholder="COK" /></label>
              <label class="fx-field"><span class="fx-field__label">Address</span>
                <input v-model.trim="branch.agent_address" class="fx-input" required maxlength="255" /></label>
              <label class="fx-field"><span class="fx-field__label">City</span>
                <input v-model.trim="branch.agent_city" class="fx-input" required maxlength="100" /></label>
              <label class="fx-field"><span class="fx-field__label">PIN code</span>
                <input v-model.trim="branch.agent_pincode" class="fx-input" required maxlength="10" /></label>
              <label class="fx-field"><span class="fx-field__label">GSTIN</span>
                <input v-model.trim="branch.gst_no" class="fx-input" maxlength="15" placeholder="32AABCK1234E1Z2" /></label>
            </div>
            <p class="fx-muted">Its documents will be numbered ENQA-<strong>{{ (open.company.code || "") + (branch.branch_code || "CODE").toUpperCase() }}</strong>-26-0001. The GSTIN decides CGST + SGST or IGST on its bills.</p>
            <details class="fx-details">
              <summary>Air waybill details — only for a branch that issues air waybills</summary>
              <div class="fx-grid2">
                <label class="fx-field"><span class="fx-field__label">IATA agent code (7 digits)</span>
                  <input v-model.trim="branch.iata_agent_code" class="fx-input" maxlength="7" /></label>
                <label class="fx-field"><span class="fx-field__label">CASS code (4 digits)</span>
                  <input v-model.trim="branch.iata_agent_cass" class="fx-input" maxlength="4" /></label>
                <label class="fx-field"><span class="fx-field__label">Issued by (signature on the waybill)</span>
                  <input v-model.trim="branch.agent_issue_sign" class="fx-input" maxlength="100" /></label>
                <label class="fx-field"><span class="fx-field__label">Issued at (airport code)</span>
                  <input v-model.trim="branch.agent_issue_loc_code" class="fx-input" maxlength="100" placeholder="COK" /></label>
              </div>
            </details>
            <p v-if="formError" class="fx-error" role="alert">{{ formError }}</p>
            <div class="fx-toolbar">
              <button type="button" class="fx-btn fx-btn--ghost" @click="step = null; wizard = false">{{ wizard ? "Later" : "Cancel" }}</button>
              <button class="fx-btn fx-btn--primary" :disabled="busy">{{ wizard ? "Save and add its people →" : "Save branch" }}</button>
            </div>
          </form>

          <!-- Step 3: people. Their company is their branch's. -->
          <form v-if="step === 'person'" class="fx-card" @submit.prevent="savePerson">
            <p v-if="wizard" class="fx-steps">1 Company ✓ · 2 First branch ✓ · <strong>3 People</strong></p>
            <h3 v-else class="fx-section__title">New person</h3>
            <div class="fx-grid2">
              <label class="fx-field"><span class="fx-field__label">Name</span>
                <input v-model.trim="person.name" class="fx-input" required maxlength="100" /></label>
              <label class="fx-field"><span class="fx-field__label">Email (their sign-in)</span>
                <input v-model.trim="person.email" type="email" class="fx-input" required maxlength="100" /></label>
              <label class="fx-field"><span class="fx-field__label">Role</span>
                <select v-model="person.designation" class="fx-input" required>
                  <option value="boss">Boss</option>
                  <option value="pricing">Pricing</option>
                  <option value="operations">Operations</option>
                  <option value="sales">Sales</option>
                  <option value="accounts">Accounts</option>
                </select></label>
              <label class="fx-field"><span class="fx-field__label">Branch</span>
                <select v-model="person.branch_name" class="fx-input" required>
                  <option v-for="b in open.branches" :key="b.id" :value="b.id">{{ b.agent_name }} ({{ b.branch_code || "no code" }})</option>
                </select></label>
              <label class="fx-field"><span class="fx-field__label">Home airport or port code</span>
                <input v-model.trim="person.origin_airport_code" class="fx-input" required maxlength="10" placeholder="COK" /></label>
              <label class="fx-field"><span class="fx-field__label">Temporary password</span>
                <input v-model="person.password" type="text" class="fx-input" required minlength="6" autocomplete="new-password" /></label>
            </div>
            <p v-if="formError" class="fx-error" role="alert">{{ formError }}</p>
            <p v-if="added.length" class="fx-muted">Added: {{ added.join(", ") }}.</p>
            <div class="fx-toolbar">
              <button type="button" class="fx-btn fx-btn--ghost" @click="finish">{{ wizard ? "Done" : "Cancel" }}</button>
              <button class="fx-btn fx-btn--primary" :disabled="busy || !open.branches.length">{{ wizard ? "Save and add another" : "Save person" }}</button>
            </div>
          </form>

          <section class="fx-section">
            <div class="fx-tenants__head">
              <h3 class="fx-section__title">Branches ({{ open.branches.length }})</h3>
              <button class="fx-btn" @click="startBranch(false)">+ Add branch</button>
            </div>
            <p v-if="!open.branches.length" class="fx-muted">No branch yet — nobody can sign in or number a document until there is one.</p>
            <table v-else class="fx-table">
              <thead><tr><th scope="col">Branch</th><th scope="col">Code</th><th scope="col">City</th><th scope="col">GSTIN</th><th scope="col">IATA / CASS</th><th class="fx-num" scope="col">People</th><th></th></tr></thead>
              <tbody>
                <tr v-for="b in open.branches" :key="b.id">
                  <td>{{ b.agent_name }}</td>
                  <td class="identifier">{{ b.branch_code || "—" }} <span v-if="!b.branch_code" class="fx-tag fx-tag--warn">cannot number documents</span></td>
                  <td>{{ b.agent_city || "—" }}</td>
                  <td class="identifier">{{ b.gst_no || "—" }}</td>
                  <td class="identifier">{{ b.iata_agent_code ? b.iata_agent_code + " / " + (b.iata_agent_cass || "—") : "sea only" }}</td>
                  <td class="fx-num">{{ b.people }}</td>
                  <td><router-link :to="'/superadmin/new-branch/' + b.id">Edit</router-link></td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="fx-section">
            <div class="fx-tenants__head">
              <h3 class="fx-section__title">People ({{ open.people.length }})</h3>
              <button class="fx-btn" :disabled="!open.branches.length" @click="startPerson(false)">+ Add person</button>
            </div>
            <p v-if="!open.people.length" class="fx-muted">Nobody yet.</p>
            <table v-else class="fx-table">
              <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col">Branch</th><th scope="col">Active</th><th></th></tr></thead>
              <tbody>
                <tr v-for="p in open.people" :key="p.id">
                  <td>{{ p.name }}</td><td>{{ p.email }}</td><td>{{ p.designation || "—" }}</td><td>{{ p.branch || "—" }}</td>
                  <td>{{ p.is_active ? "Yes" : "No" }}</td>
                  <td><router-link :to="'/superadmin/new-users/' + p.id">Edit</router-link></td>
                </tr>
              </tbody>
            </table>
          </section>
        </template>

        <p v-else class="fx-muted">Choose a company to see its branches and people, or make a new client.</p>
      </section>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

const TIERS = { core: "Core", tactical: "Tactical", command: "Command" };

/**
 * Tenants, one page (owner, 2026-10-11: "see the client making process and the branch making process is sorted out").
 * Company, Branch and Users were three pages, and a branch made there had no branch code, so it could number nothing.
 * Here a new client is three steps on one page — the company, its first branch, its first people — each saved by the
 * same endpoints the old forms used (`create-company`, `create-branch`, `create-user`), which now check what matters.
 */
export default {
  name: "Tenants",
  data: () => ({
    companies: [], q: "", open: null, error: null,
    step: null, wizard: false, busy: false, formError: null, added: [],
    company: {}, branch: {}, person: {},
  }),
  computed: {
    shown() {
      const q = this.q.toLowerCase();
      return q ? this.companies.filter((c) => (c.name + " " + (c.code || "")).toLowerCase().includes(q)) : this.companies;
    },
  },
  created() {
    this.load().then(() => {
      const id = Number(this.$route.query.company);
      if (id) this.openCompany(id);
    });
  },
  methods: {
    tierLabel(t) {
      return TIERS[t] || t || "—";
    },
    message(e, fallback) {
      const d = e && e.response && e.response.data;
      const errors = d && d.errors;
      if (errors) return Object.values(errors).flat().join(" ");
      return (d && (d.error || d.message)) || fallback;
    },
    load() {
      return ApiService.get("/superadmin/tenants")
        .then(({ data }) => { this.companies = data.companies || []; })
        .catch((e) => { this.error = this.message(e, "Could not load the companies."); });
    },
    openCompany(id) {
      this.error = null;
      return ApiService.get("/superadmin/tenants/" + id)
        .then(({ data }) => {
          this.open = data;
          if (this.$route.query.company !== String(id)) this.$router.replace({ query: { company: String(id) } }).catch(() => {});
        })
        .catch((e) => { this.error = this.message(e, "Could not open that company."); });
    },
    startNew() {
      this.open = null;
      this.wizard = true;
      this.formError = null;
      this.added = [];
      this.company = { name: "", code: "", tier: "tactical" };
      this.step = "company";
    },
    startBranch(wizard) {
      this.wizard = wizard;
      this.formError = null;
      this.branch = { agent_name: "", branch_code: "", agent_address: "", agent_city: "", agent_pincode: "", gst_no: "",
        iata_agent_code: "", iata_agent_cass: "", agent_issue_sign: "", agent_issue_loc_code: "" };
      this.step = "branch";
    },
    startPerson(wizard) {
      this.wizard = wizard;
      this.formError = null;
      if (!wizard) this.added = [];
      const first = this.open.branches[this.open.branches.length - 1];
      this.person = { name: "", email: "", designation: wizard && !this.open.people.length ? "boss" : "pricing",
        branch_name: first ? first.id : null, origin_airport_code: first ? first.branch_code : "", password: "", can_send: 1 };
      this.step = "person";
    },
    run(call, then) {
      this.busy = true;
      this.formError = null;
      return call()
        .then(then)
        .catch((e) => { this.formError = this.message(e, "Could not save it."); })
        .finally(() => { this.busy = false; });
    },
    saveCompany() {
      this.run(() => ApiService.post("/superadmin/create-company", { ...this.company, code: this.company.code.toUpperCase() }), ({ data }) => {
        const id = data.company.id;
        return this.load().then(() => this.openCompany(id)).then(() => this.startBranch(true));
      });
    },
    saveBranch() {
      const body = { ...this.branch, company_id: this.open.company.id, branch_code: this.branch.branch_code.toUpperCase(),
        gst_no: this.branch.gst_no ? this.branch.gst_no.toUpperCase() : null };
      Object.keys(body).forEach((k) => { if (body[k] === "") body[k] = null; });
      this.run(() => ApiService.post("/superadmin/create-branch", body), () => {
        const wizard = this.wizard;
        return this.load().then(() => this.openCompany(this.open.company.id)).then(() => (wizard ? this.startPerson(true) : (this.step = null)));
      });
    },
    savePerson() {
      const body = { ...this.person, company_name: this.open.company.id };
      this.run(() => ApiService.post("/superadmin/create-user", body), () => {
        this.added.push(body.name + " (" + body.designation + ")");
        const wizard = this.wizard;
        return this.load().then(() => this.openCompany(this.open.company.id)).then(() => {
          if (wizard) this.startPerson(true);
          else this.step = null;
        });
      });
    },
    finish() {
      this.step = null;
      this.wizard = false;
    },
  },
};
</script>

<style scoped>
.fx-tenants { display: grid; grid-template-columns: minmax(240px, 320px) 1fr; gap: 24px; align-items: start; margin-top: 16px; }
@media (max-width: 900px) { .fx-tenants { grid-template-columns: 1fr; } }
.fx-tenants__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.fx-tenants__item { width: 100%; text-align: left; display: grid; gap: 2px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; cursor: pointer; }
.fx-tenants__item.is-active { border-color: #1e3a8a; box-shadow: 0 0 0 1px #1e3a8a inset; }
.fx-tenants__head { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; justify-content: space-between; }
.fx-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; background: #fff; margin: 12px 0; display: grid; gap: 10px; }
.fx-grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
.fx-grid2 .fx-input { min-width: 0; width: 100%; }
.fx-steps { margin: 0; color: #475569; }
.fx-details summary { cursor: pointer; color: #1e3a8a; }
.fx-tag { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: .75rem; }
.fx-tag--warn { background: #fef3c7; color: #92400e; }
</style>
