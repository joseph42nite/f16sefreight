<template>
  <div class="py-5 premium-sea-page font-outfit">
    <div class="d-flex align-items-center justify-content-between mb-7">
      <div class="admin-page-header">
        <h2 class="text-white font-weight-bolder">Focus Sea — House Bill of Lading</h2>
        <span class="text-muted small">Manage ocean cargo HBL shippers, consignees, weights, and cargo descriptions</span>
      </div>
      <router-link to="/inbox" class="btn btn-light-primary btn-pill px-5">
        <b-icon icon="arrow-left" class="mr-2"></b-icon> Back to Inbox
      </router-link>
    </div>

    <div v-if="successMsg" class="alert alert-custom alert-light-success mb-6 shadow-sm">
      <div class="alert-icon"><i class="fas fa-check-circle text-success"></i></div>
      <div class="alert-text font-weight-bold">{{ successMsg }}</div>
    </div>

    <b-form @submit.prevent="saveHouseBill">
      <!-- General details -->
      <div class="premium-glass-card p-6 mb-6">
        <h4 class="text-white font-weight-bold mb-5 d-flex align-items-center">
          <b-icon icon="file-earmark-text" class="mr-3 text-success"></b-icon> HBL References
        </h4>
        <b-row>
          <b-col md="4" class="mb-4">
            <b-form-group label="House BL Number *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.hbl_number" required placeholder="e.g. F16S-HBL-2601" class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4" class="mb-4">
            <b-form-group label="Parent Master BL No *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.mbl_number" required placeholder="e.g. COSU63082910" class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4" class="mb-4">
            <b-form-group label="Filing Mode" label-class="text-muted small font-weight-bold">
              <b-form-select v-model="form.filing_mode" :options="filingModeOptions" class="premium-select"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </div>

      <!-- Entities & Addresses -->
      <div class="premium-glass-card p-6 mb-6">
        <h4 class="text-white font-weight-bold mb-5 d-flex align-items-center">
          <b-icon icon="people" class="mr-3 text-info"></b-icon> Shipping Parties
        </h4>
        <b-row>
          <!-- Shipper -->
          <b-col md="6" class="mb-4">
            <b-form-group label="Shipper Name *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.shipper_name" required placeholder="Full corporate name" class="premium-input mb-3"></b-form-input>
            </b-form-group>
            <b-form-group label="Shipper Address *" label-class="text-muted small font-weight-bold">
              <b-form-textarea v-model="form.shipper_address" required rows="3" placeholder="Full physical warehouse location..." class="premium-textarea"></b-form-textarea>
            </b-form-group>
          </b-col>

          <!-- Consignee -->
          <b-col md="6" class="mb-4">
            <b-form-group label="Consignee Name *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.consignee_name" required placeholder="Full corporate name" class="premium-input mb-3"></b-form-input>
            </b-form-group>
            <b-form-group label="Consignee Address *" label-class="text-muted small font-weight-bold">
              <b-form-textarea v-model="form.consignee_address" required rows="3" placeholder="Full physical delivery location..." class="premium-textarea"></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
      </div>

      <!-- Cargo Grid -->
      <div class="premium-glass-card p-6 mb-6">
        <h4 class="text-white font-weight-bold mb-5 d-flex align-items-center">
          <b-icon icon="box" class="mr-3 text-warning"></b-icon> Cargo & Packaging
        </h4>
        <b-row>
          <b-col md="3" class="mb-4">
            <b-form-group label="Piece Count *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model.number="form.piece_count" type="number" required class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="3" class="mb-4">
            <b-form-group label="Gross Weight (KGS) *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model.number="form.gross_weight" type="number" step="0.001" required class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="3" class="mb-4">
            <b-form-group label="Volume (CBM) *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model.number="form.volume_cbm" type="number" step="0.001" required class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="3" class="mb-4">
            <b-form-group label="HS Code" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.hs_code" placeholder="6 to 10 digits" class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6" class="mb-4">
            <b-form-group label="Marks & Numbers" label-class="text-muted small font-weight-bold">
              <b-form-textarea v-model="form.marks_and_numbers" rows="3" placeholder="Stencil markings, shipping labels..." class="premium-textarea"></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="6" class="mb-4">
            <b-form-group label="Nature of Goods Description" label-class="text-muted small font-weight-bold">
              <b-form-textarea v-model="form.commodity_description" rows="3" placeholder="Detailed cargo contents description..." class="premium-textarea"></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
      </div>

      <div class="d-flex justify-content-end align-items-center mt-6">
        <b-button type="submit" class="btn btn-success btn-pill btn-lg px-8 py-3" :disabled="loading">
          <span v-if="loading"><b-spinner small class="mr-2"></b-spinner>Saving HBL...</span>
          <span v-else><b-icon icon="check-circle" class="mr-2"></b-icon> Save House waybill</span>
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "FocusSeaHouse",
  data() {
    return {
      loading: false,
      successMsg: null,
      form: {
        hbl_number: "",
        mbl_number: "",
        filing_mode: "house_agent",
        shipper_name: "",
        shipper_address: "",
        consignee_name: "",
        consignee_address: "",
        piece_count: 0,
        gross_weight: 0.0,
        volume_cbm: 0.0,
        hs_code: "",
        marks_and_numbers: "",
        commodity_description: ""
      },
      filingModeOptions: [
        { value: "house_agent", text: "Filed by Agent" },
        { value: "house_direct", text: "Filed by Direct Carrier" }
      ]
    };
  },
  methods: {
    saveHouseBill() {
      this.loading = true;
      this.successMsg = null;

      setTimeout(() => {
        this.loading = false;
        this.successMsg = `House Bill of Lading ${this.form.hbl_number} saved and linked to MBL ${this.form.mbl_number} successfully!`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  }
};
</script>

<style scoped>
.premium-sea-page {
  background: #0b1329;
  min-height: 90vh;
  padding: 24px;
}

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.premium-glass-card {
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
}

.premium-input, .premium-select, .premium-textarea {
  background-color: rgba(15, 23, 42, 0.6) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 10px !important;
  transition: all 0.25s ease;
}

.premium-input:focus, .premium-select:focus, .premium-textarea:focus {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25) !important;
}

.premium-textarea {
  min-height: 90px;
}
</style>
