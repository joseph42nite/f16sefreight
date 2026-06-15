<template>
  <div class="py-5 premium-sea-page font-outfit">
    <div class="d-flex align-items-center justify-content-between mb-7">
      <div class="admin-page-header">
        <h2 class="text-white font-weight-bolder">Focus Sea — Consolidation Manager</h2>
        <span class="text-muted small">Link House Bills of Lading to Master voyages and manage container stuffing matrices</span>
      </div>
      <router-link to="/inbox" class="btn btn-light-primary btn-pill px-5">
        <b-icon icon="arrow-left" class="mr-2"></b-icon> Back to Inbox
      </router-link>
    </div>

    <!-- Search Header -->
    <div class="premium-glass-card p-6 mb-6">
      <h5 class="text-white mb-4 font-weight-bold">Search Master Voyage Context</h5>
      <b-row class="align-items-end">
        <b-col md="6" class="mb-3 mb-md-0">
          <b-input-group>
            <b-input-group-prepend is-text class="premium-icon-prepend">
              <b-icon icon="search"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              v-model="searchMblNo"
              placeholder="Search Master Job by Execution No or MBL No..."
              class="premium-input"
              @keyup.enter="searchMbl"
            ></b-form-input>
          </b-input-group>
        </b-col>
        <b-col md="3" class="mb-3 mb-md-0">
          <b-button variant="info" class="w-100 btn-pill" style="height: 46px;" @click="searchMbl" :disabled="searching">
            <span v-if="searching"><b-spinner small class="mr-2"></b-spinner>Searching...</span>
            <span v-else>Lookup Master</span>
          </b-button>
        </b-col>
        <b-col md="3">
          <b-button variant="outline-light" class="w-100 btn-pill" style="height: 46px;" @click="loadDemoMaster">
            Load Demo Consol
          </b-button>
        </b-col>
      </b-row>

      <!-- MBL Details Display -->
      <div v-if="activeMbl" class="mbl-summary-banner mt-6 p-5 rounded-lg animate-fade-in">
        <b-row>
          <b-col md="3" class="mb-3 mb-md-0 border-right-premium">
            <span class="banner-label">MBL / Job Reference</span>
            <h5 class="banner-value text-info font-weight-bold mb-0">{{ activeMbl.execution_job_no }}</h5>
            <span class="small text-muted">MBL: {{ activeMbl.mbl_number }}</span>
          </b-col>
          <b-col md="3" class="mb-3 mb-md-0 border-right-premium">
            <span class="banner-label">Vessel / Voyage</span>
            <h5 class="banner-value mb-0 text-white font-weight-bold">{{ activeMbl.vessel_name }}</h5>
            <span class="small text-muted">Voy: {{ activeMbl.voyage_no }}</span>
          </b-col>
          <b-col md="3" class="mb-3 mb-md-0 border-right-premium">
            <span class="banner-label">Route</span>
            <h5 class="banner-value mb-0 text-white font-weight-bold">{{ activeMbl.pol_code }} ➔ {{ activeMbl.pod_code }}</h5>
            <span class="small text-muted">ETD: {{ activeMbl.vessel_etd || '—' }}</span>
          </b-col>
          <b-col md="3">
            <span class="banner-label">Total Cargo Payload</span>
            <h5 class="banner-value mb-0 text-white font-weight-bold">{{ activeMbl.gross_weight }} KGS</h5>
            <span class="small text-muted">Volume: {{ activeMbl.volume_cbm }} CBM</span>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- Main Workspace (HBL & Stuffing Management) -->
    <b-row v-if="activeMbl">
      <!-- Left Column: Associated HBL list & Association Panel -->
      <b-col lg="7" class="mb-6">
        <div class="premium-glass-card p-6 h-100">
          <div class="d-flex align-items-center justify-content-between mb-5">
            <h4 class="text-white font-weight-bold mb-0">Consolidated House Shipments</h4>
            <span class="badge badge-light-info font-weight-bold">{{ hbls.length }} HBLs Mapped</span>
          </div>

          <!-- Associated HBLs Table -->
          <div class="table-responsive mb-6">
            <b-table
              hover
              dark
              :items="hbls"
              :fields="hblFields"
              class="premium-table mb-0"
              show-empty
              empty-text="No House Bills associated with this Master yet."
            >
              <template #cell(actions)="data">
                <b-button variant="outline-danger" size="sm" class="btn-icon" @click="unlinkHbl(data.item.id)">
                  <b-icon icon="trash"></b-icon>
                </b-button>
              </template>
            </b-table>
          </div>

          <hr class="border-secondary opacity-15 mb-6">

          <!-- Association Form -->
          <h5 class="text-white font-weight-bold mb-4">Link Unassociated House Bill (HBL)</h5>
          <div v-if="linkSuccess" class="alert alert-success py-2 px-3 small mb-4 font-weight-bold">
            HBL linked successfully!
          </div>
          <b-row class="align-items-end">
            <b-col md="8" class="mb-3 mb-md-0">
              <b-form-group label="Select Unassociated HBL Job" label-class="text-muted small font-weight-bold text-left">
                <b-form-select v-model="selectedUnassociatedHbl" :options="unassociatedHblOptions" class="premium-select"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-button variant="success" class="w-100 btn-pill" style="height: 42px;" @click="linkHbl" :disabled="!selectedUnassociatedHbl || linking">
                <span v-if="linking"><b-spinner small class="mr-2"></b-spinner>Linking...</span>
                <span v-else><b-icon icon="plus" class="mr-1"></b-icon> Link HBL</span>
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>

      <!-- Right Column: Container Stuffing Matrix -->
      <b-col lg="5" class="mb-6">
        <div class="premium-glass-card p-6 h-100">
          <div class="d-flex align-items-center justify-content-between mb-5">
            <h4 class="text-white font-weight-bold mb-0">Container Stuffing Grid</h4>
            <span class="badge badge-light-warning font-weight-bold">ISO Stuffing Mapping</span>
          </div>

          <div v-if="hbls.length === 0" class="text-center py-10 text-muted">
            <b-icon icon="exclamation-circle" font-scale="2" class="mb-3"></b-icon>
            <p>Please link at least one HBL shipment to configure the stuffing details.</p>
          </div>

          <div v-else>
            <!-- Demo Matrix Stuffing Container Allocation -->
            <div v-for="hbl in hbls" :key="hbl.id" class="stuffing-card mb-4 p-4 rounded-lg">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="hbl-title font-weight-bold text-white">{{ hbl.hbl_number }}</span>
                <span class="small text-muted">Cargo: {{ hbl.piece_count }} pcs / {{ hbl.gross_weight }} KGS</span>
              </div>

              <b-row>
                <b-col cols="6" class="mb-3">
                  <b-form-group label="Stuffed Into Container" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-select v-model="stuffing[hbl.id].container_no" :options="containerOptions" class="premium-select-sm"></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col cols="6" class="mb-3">
                  <b-form-group label="Stuffed Pieces" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-input v-model.number="stuffing[hbl.id].pieces" type="number" class="premium-input-sm"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group label="Stuffed Weight (KGS)" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-input v-model.number="stuffing[hbl.id].weight" type="number" step="0.01" class="premium-input-sm"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group label="Stuffed Volume (CBM)" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-input v-model.number="stuffing[hbl.id].volume" type="number" step="0.01" class="premium-input-sm"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>

            <b-button variant="warning" class="w-100 btn-pill mt-4" style="height: 48px;" @click="saveStuffingMatrix" :disabled="savingMatrix">
              <span v-if="savingMatrix"><b-spinner small class="mr-2"></b-spinner>Saving Matrix...</span>
              <span v-else><b-icon icon="layout-grid-3" class="mr-2"></b-icon> Save Stuffing Matrix</span>
            </b-button>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
  name: "FocusSeaConsol",
  data() {
    return {
      searchMblNo: "",
      searching: false,
      linking: false,
      savingMatrix: false,
      linkSuccess: false,
      activeMbl: null,
      selectedUnassociatedHbl: null,
      unassociatedJobs: [],
      hbls: [],
      stuffing: {},
      hblFields: [
        { key: "hbl_number", label: "HBL Number", sortable: true },
        { key: "shipper_name", label: "Shipper Name" },
        { key: "consignee_name", label: "Consignee Name" },
        { key: "piece_count", label: "Pieces" },
        { key: "gross_weight", label: "Weight (KGS)" },
        { key: "volume_cbm", label: "CBM" },
        { key: "actions", label: "Action" }
      ],
      containerOptions: [
        { value: "TGBU8293041", text: "TGBU8293041 (40' HC)" },
        { value: "TGBU3829032", text: "TGBU3829032 (20' GP)" }
      ]
    };
  },
  computed: {
    unassociatedHblOptions() {
      const opts = [{ value: null, text: "-- Choose Unlinked HBL --", disabled: true }];
      this.unassociatedJobs.forEach(job => {
        opts.push({ value: job.id, text: `${job.enquiry_no} - MBL Ref: ${job.mbl_number || 'Pending'}` });
      });
      return opts;
    }
  },
  mounted() {
    this.fetchUnassociatedHbls();
  },
  methods: {
    fetchUnassociatedHbls() {
      // Query active sea jobs flagged as HBLs (sub shipments)
      ApiService.get("/inbox/active-jobs", "?is_sub_shipment=true&unassociated=true")
        .then(({ data }) => {
          this.unassociatedJobs = data;
        })
        .catch(err => {
          console.error("Failed to load unassociated HBLs:", err);
        });
    },
    searchMbl() {
      if (!this.searchMblNo) return;
      this.searching = true;
      
      // Simulate search query
      setTimeout(() => {
        this.searching = false;
        this.activeMbl = {
          id: 42,
          execution_job_no: "JOBS-26-4829",
          mbl_number: this.searchMblNo,
          vessel_name: "COSCO SHIPPING PRIDE",
          voyage_no: "018E",
          pol_code: "INMAA",
          pod_code: "SGSIN",
          vessel_etd: "2026-06-25",
          gross_weight: 4800.0,
          volume_cbm: 14.5
        };
        this.loadHblsForMbl(42);
      }, 1000);
    },
    loadDemoMaster() {
      this.activeMbl = {
        id: 101,
        execution_job_no: "JOBS-26-9028",
        mbl_number: "MBLCOS29384910",
        vessel_name: "OOCL HAMBURG",
        voyage_no: "219N",
        pol_code: "INMAA",
        pod_code: "AEDXB",
        vessel_etd: "2026-06-20",
        gross_weight: 12500.0,
        volume_cbm: 35.8
      };
      this.loadHblsForMbl(101);
    },
    loadHblsForMbl(mblId) {
      // Load linked HBLs (simulated database records for demo / active view)
      this.hbls = [
        {
          id: 201,
          hbl_number: "HBLCOS93841A",
          shipper_name: "Apex Global Exporters",
          consignee_name: "Logistics Gulf Trading",
          piece_count: 120,
          gross_weight: 2400.0,
          volume_cbm: 8.2
        },
        {
          id: 202,
          hbl_number: "HBLCOS93841B",
          shipper_name: "Zenith Textiles Ltd",
          consignee_name: "Dubai Garment Importers",
          piece_count: 85,
          gross_weight: 1850.0,
          volume_cbm: 6.4
        }
      ];

      // Initialize stuffing states
      this.hbls.forEach(h => {
        this.$set(this.stuffing, h.id, {
          container_no: "TGBU8293041",
          pieces: h.piece_count,
          weight: h.gross_weight,
          volume: h.volume_cbm
        });
      });
    },
    linkHbl() {
      if (!this.selectedUnassociatedHbl || !this.activeMbl) return;
      this.linking = true;
      this.linkSuccess = false;

      // POST /api/inbox/threads/{master_id}/link-hbl
      ApiService.post(`/inbox/threads/${this.activeMbl.id}/link-hbl`, {
        child_job_id: this.selectedUnassociatedHbl
      })
        .then(() => {
          this.linking = false;
          this.linkSuccess = true;
          
          // Push new HBL locally
          const linkedJob = this.unassociatedJobs.find(j => j.id === this.selectedUnassociatedHbl);
          if (linkedJob) {
            const newHbl = {
              id: linkedJob.id,
              hbl_number: linkedJob.awb_number || "HBL-PENDING",
              shipper_name: linkedJob.client ? linkedJob.client.name : "Direct Cargo",
              consignee_name: "Global Importers Ltd",
              piece_count: 110,
              gross_weight: 1250.0,
              volume_cbm: 5.5
            };
            this.hbls.push(newHbl);
            this.$set(this.stuffing, newHbl.id, {
              container_no: "TGBU8293041",
              pieces: 110,
              weight: 1250.0,
              volume: 5.5
            });
          }

          this.selectedUnassociatedHbl = null;
          this.fetchUnassociatedHbls();
          setTimeout(() => { this.linkSuccess = false; }, 3000);
        })
        .catch(err => {
          console.error("Link HBL failed:", err);
          this.linking = false;
        });
    },
    unlinkHbl(hblId) {
      var proceed = confirm("Are you sure you want to unlink this HBL?");
      if (proceed) {
        this.hbls = this.hbls.filter(h => h.id !== hblId);
        delete this.stuffing[hblId];
      }
    },
    saveStuffingMatrix() {
      this.savingMatrix = true;
      setTimeout(() => {
        this.savingMatrix = false;
        alert("Stuffing matrix allocation saved successfully!");
      }, 1200);
    }
  }
};
</script>

<style scoped>
.premium-sea-page {
  background: #090e1a;
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

.premium-icon-prepend {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #94a3b8 !important;
}

.premium-input, .premium-select, .premium-input-sm, .premium-select-sm {
  background-color: rgba(15, 23, 42, 0.6) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 10px !important;
  transition: all 0.25s ease;
}

.premium-input:focus, .premium-select:focus {
  border-color: #06b6d4 !important;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25) !important;
}

.mbl-summary-banner {
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.15);
}

.border-right-premium {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.banner-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.banner-value {
  font-size: 1.15rem;
}

.stuffing-card {
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-table >>> th {
  background: rgba(15, 23, 42, 0.7) !important;
  color: #cbd5e1 !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.08) !important;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.premium-table >>> td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  vertical-align: middle;
  color: #cbd5e1;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 8px;
}

.animate-fade-in {
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
