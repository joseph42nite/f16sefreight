<template>
  <div class="py-5 premium-sea-page font-outfit">
    <div class="d-flex align-items-center justify-content-between mb-7">
      <div class="admin-page-header">
        <h2 class="text-white font-weight-bolder">Focus Sea — Master Shipment Details</h2>
        <span class="text-muted small">Manage ocean cargo MBL voyage parameters and shipping configurations</span>
      </div>
      <router-link to="/inbox" class="btn btn-light-primary btn-pill px-5">
        <b-icon icon="arrow-left" class="mr-2"></b-icon> Back to Inbox
      </router-link>
    </div>

    <div v-if="successMsg" class="alert alert-custom alert-light-success mb-6 shadow-sm">
      <div class="alert-icon"><i class="fas fa-check-circle text-success"></i></div>
      <div class="alert-text font-weight-bold">{{ successMsg }}</div>
    </div>

    <b-form @submit.prevent="saveShipment">
      <!-- Premium Global Header Fields Card -->
      <div class="premium-glass-card p-6 mb-6">
        <h4 class="text-white font-weight-bold mb-5 d-flex align-items-center">
          <b-icon icon="globe2" class="mr-3 text-info"></b-icon> Shipment Configuration
        </h4>
        <b-row>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Shipment No" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.execution_job_no" readonly placeholder="SSEA-26-XXXX" class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Shipment Date *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.planned_clearance_date" type="date" required class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Consol Type" label-class="text-muted small font-weight-bold">
              <b-form-select v-model="form.consol_type" :options="consolOptions" class="premium-select"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Cargo Type" label-class="text-muted small font-weight-bold">
              <b-form-select v-model="form.cargo_type" :options="cargoOptions" class="premium-select"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Delivery Mode" label-class="text-muted small font-weight-bold">
              <b-form-select v-model="form.delivery_mode" :options="deliveryOptions" class="premium-select"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Booking Thru" label-class="text-muted small font-weight-bold">
              <b-form-select v-model="form.booking_thru" :options="bookingThruOptions" class="premium-select"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Job Owner ID" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.job_owner_id" placeholder="Owner username" class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4">
            <b-form-group label="Quotation No" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="form.quotation_no" placeholder="e.g. QT-26-0928" class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4" lg="3" class="mb-4 d-flex align-items-center pt-4">
            <b-form-checkbox v-model="form.is_sub_shipment" class="text-white font-weight-bold">
              Sub Shipment (HBL)
            </b-form-checkbox>
          </b-col>
        </b-row>
      </div>

      <!-- Tab Layout -->
      <div class="premium-tabs-wrapper">
        <b-tabs content-class="mt-4" nav-wrapper-class="premium-tab-nav" active-nav-item-class="active-tab">
          <!-- TAB 1: Voyage details -->
          <b-tab title="Voyage Details" active>
            <div class="premium-glass-card p-6">
              <h5 class="text-white mb-5 font-weight-bold">Ocean Transit Parameters</h5>
              <b-row>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Carrying Vessel *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.vessel_name" required placeholder="e.g. EVER GIVEN" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Voyage No *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.voyage_no" required placeholder="e.g. 093W" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Vessel Flag" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.vessel_flag" placeholder="e.g. PA" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="IMO Number" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.imo_number" placeholder="7-digit IMO" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Place of Receipt (POR)" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.por_code" placeholder="UN/LOCODE e.g. INBLR" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Port of Loading (POL) *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.pol_code" required placeholder="UN/LOCODE e.g. INMAA" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Port of Discharge (POD) *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.pod_code" required placeholder="UN/LOCODE e.g. SGSIN" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Place of Delivery (DEL)" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.del_code" placeholder="UN/LOCODE e.g. SGSIN" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Vessel ETD" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.vessel_etd" type="date" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-tab>

          <!-- TAB 2: Cargo Details -->
          <b-tab title="Cargo & Volume">
            <div class="premium-glass-card p-6">
              <h5 class="text-white mb-5 font-weight-bold">Weights, Quantities & Packaging</h5>
              <b-row>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Piece Count *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model.number="form.piece_count" type="number" required class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Gross Weight (KGS) *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model.number="form.gross_weight" type="number" step="0.001" required class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Net Weight (KGS)" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model.number="form.net_weight" type="number" step="0.001" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Volume (CBM) *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model.number="form.volume_cbm" type="number" step="0.001" required class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="8" class="mb-4">
                  <b-form-group label="Commodity Description" label-class="text-muted small font-weight-bold">
                    <b-form-textarea v-model="form.commodity_description" rows="3" placeholder="Customs manifest goods declaration..." class="premium-textarea"></b-form-textarea>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-tab>

          <!-- TAB 3: Bill of Lading Options -->
          <b-tab title="Bill of Lading Details">
            <div class="premium-glass-card p-6">
              <h5 class="text-white mb-5 font-weight-bold">MBL Release Details</h5>
              <b-row>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Master Bill of Lading No *" label-class="text-muted small font-weight-bold">
                    <b-form-input v-model="form.mbl_number" required placeholder="e.g. COSU63082910" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="BL Release Type" label-class="text-muted small font-weight-bold">
                    <b-form-select v-model="form.bl_release_type" :options="releaseOptions" class="premium-select"></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="6" lg="4" class="mb-4">
                  <b-form-group label="Freight Terms" label-class="text-muted small font-weight-bold">
                    <b-form-select v-model="form.freight_terms" :options="freightTermsOptions" class="premium-select"></b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-tab>
        </b-tabs>
      </div>

      <!-- Form Footer Actions -->
      <div class="d-flex justify-content-end align-items-center mt-6">
        <b-button type="submit" class="btn btn-primary btn-pill btn-lg px-8 py-3" :disabled="loading">
          <span v-if="loading"><b-spinner small class="mr-2"></b-spinner>Saving Shipment...</span>
          <span v-else><b-icon icon="check-circle" class="mr-2"></b-icon> Save Master Shipment</span>
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "FocusSeaMaster",
  data() {
    return {
      loading: false,
      successMsg: null,
      form: {
        execution_job_no: "",
        planned_clearance_date: new Date().toISOString().slice(0, 10),
        consol_type: "agent_consol",
        cargo_type: "fcl",
        delivery_mode: "fcl",
        booking_thru: "self",
        job_owner_id: "operations",
        quotation_no: "",
        is_sub_shipment: false,
        vessel_name: "",
        voyage_no: "",
        vessel_flag: "",
        imo_number: "",
        por_code: "",
        pol_code: "",
        pod_code: "",
        del_code: "",
        vessel_etd: "",
        piece_count: 0,
        gross_weight: 0.0,
        net_weight: 0.0,
        volume_cbm: 0.0,
        commodity_description: "",
        mbl_number: "",
        bl_release_type: "original",
        freight_terms: "prepaid"
      },
      consolOptions: [
        { value: "agent_consol", text: "Agent Consolidation" },
        { value: "buyers_consol", text: "Buyer's Consolidation" },
        { value: "direct", text: "Direct Shipment" },
        { value: "back_to_back", text: "Back-to-Back" },
        { value: "none", text: "None" }
      ],
      cargoOptions: [
        { value: "fcl", text: "FCL (Full Container Load)" },
        { value: "lcl", text: "LCL (Less Container Load)" },
        { value: "liquid_cont", text: "Liquid Container" },
        { value: "break_bulk", text: "Break Bulk" },
        { value: "liquid_bulk", text: "Liquid Bulk" },
        { value: "bulk", text: "Dry Bulk" },
        { value: "ro_ro", text: "Ro-Ro" }
      ],
      deliveryOptions: [
        { value: "fcl", text: "FCL" },
        { value: "lcl", text: "LCL" }
      ],
      bookingThruOptions: [
        { value: "self", text: "Direct Booking (Self)" },
        { value: "agent", text: "Booking via Third-Party Agent" }
      ],
      releaseOptions: [
        { value: "original", text: "Original OBL Issued" },
        { value: "telex", text: "Telex / Surrender Release" },
        { value: "seaway", text: "Sea Waybill" }
      ],
      freightTermsOptions: [
        { value: "prepaid", text: "Prepaid" },
        { value: "collect", text: "Collect" }
      ]
    };
  },
  methods: {
    saveShipment() {
      this.loading = true;
      this.successMsg = null;
      
      // Simulate save delay
      setTimeout(() => {
        this.loading = false;
        this.form.execution_job_no = "JOBS-26-" + Math.floor(1000 + Math.random() * 9000);
        this.successMsg = `Master Sea shipment finalized successfully. Generated execution number: ${this.form.execution_job_no}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  }
};
</script>

<style scoped>
.premium-sea-page {
  background: #0f172a;
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
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25) !important;
}

.premium-textarea {
  min-height: 90px;
}

.premium-tabs-wrapper >>> .nav-tabs {
  border-bottom: 2px solid rgba(255, 255, 255, 0.08) !important;
  gap: 8px;
}

.premium-tabs-wrapper >>> .nav-link {
  color: #94a3b8 !important;
  border: none !important;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 12px 24px !important;
  border-radius: 10px 10px 0 0 !important;
  transition: all 0.25s ease;
}

.premium-tabs-wrapper >>> .nav-link:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #ffffff !important;
}

.premium-tabs-wrapper >>> .nav-link.active {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
  border-bottom: 2px solid #3b82f6 !important;
}
</style>
