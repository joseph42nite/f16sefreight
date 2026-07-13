<template>
  <div class="py-5">
    <div class="admin-page-header d-flex flex-wrap justify-content-between align-items-center mb-6">
      <div class="d-flex flex-column">
        <h2 class="font-weight-bold text-dark mb-1">Client Shipments Tracker</h2>
        <span class="text-muted font-size-sm">Monitor all airway bills (AWB) and house airway bills (HAWB) executed per client</span>
      </div>
      <div class="d-flex align-items-center mt-3 mt-md-0" v-if="lastUpdated">
        <b-badge variant="light-primary" class="font-weight-bold px-3 py-2">
          <i class="fas fa-sync-alt fa-spin mr-1 text-primary"></i> Live: Updated at {{ lastUpdated }}
        </b-badge>
      </div>
    </div>

    <!-- Statistics Metric Cards -->
    <div class="row mb-5">
      <div class="col-md-6">
        <div class="admin-glass-card stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-primary text-white">
          <div>
            <span class="stats-label text-white-50 text-uppercase font-weight-bold">Total AWB Shipments</span>
            <h3 class="stats-value font-weight-bolder mt-2">{{ totalAwb }}</h3>
          </div>
          <div class="stats-icon">
            <i class="fas fa-file-invoice font-size-h1 text-white-50"></i>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="admin-glass-card stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-success text-white">
          <div>
            <span class="stats-label text-white-50 text-uppercase font-weight-bold">Total HAWB Shipments</span>
            <h3 class="stats-value font-weight-bolder mt-2">{{ totalHawb }}</h3>
          </div>
          <div class="stats-icon">
            <i class="fas fa-boxes font-size-h1 text-white-50"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="admin-glass-card">
      <!-- Search & Filters Container -->
      <div class="p-6 border-bottom mb-4 bg-light-card rounded-top">
        <h5 class="mb-4 text-primary font-weight-bold"><i class="fas fa-filter mr-2"></i>Filter Shipments</h5>
        <div class="row align-items-end">
          <div class="col-md-2 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">Client / Company</label>
            <b-form-select 
              v-model="filters.company_id" 
              :options="companyOptions" 
              class="form-control"
              @change="fetchShipments"
            ></b-form-select>
          </div>
          <div class="col-md-2 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">Origin</label>
            <b-form-input 
              v-model="filters.origin" 
              type="text" 
              placeholder="e.g. JFK" 
              class="form-control"
              @keyup.enter="fetchShipments"
            ></b-form-input>
          </div>
          <div class="col-md-2 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">Destination</label>
            <b-form-input 
              v-model="filters.destination" 
              type="text" 
              placeholder="e.g. LHR" 
              class="form-control"
              @keyup.enter="fetchShipments"
            ></b-form-input>
          </div>
          <div class="col-md-2 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">Date of Sending</label>
            <b-form-input 
              v-model="filters.date" 
              type="date" 
              class="form-control"
              @change="fetchShipments"
            ></b-form-input>
          </div>
          <div class="col-md-2 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">FNA Status</label>
            <b-form-select 
              v-model="filters.fna_status" 
              :options="fnaOptions" 
              class="form-control"
              @change="fetchShipments"
            ></b-form-select>
          </div>
          <div class="col-md-2 d-flex">
            <b-button variant="primary" class="w-100 mr-2" @click="fetchShipments">
              <i class="fas fa-search"></i>
            </b-button>
            <b-button variant="outline-secondary" class="w-100" @click="resetFilters">
              <i class="fas fa-sync-alt"></i>
            </b-button>
          </div>
        </div>
      </div>

      <!-- Pagination Size & Filter indicator -->
      <div class="admin-filter-row d-flex flex-wrap align-items-center justify-content-between px-6 pt-4">
        <div class="d-flex align-items-center">
          <span class="mr-3 font-weight-bold text-muted">Show:</span>
          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" class="form-control-sm" style="max-width: 120px;"></b-form-select>
        </div>
        <div class="w-md-25">
          <b-input-group size="sm">
            <b-form-input id="filter-input" v-model="searchText" type="search" placeholder="Search filtered table..." class="py-4"></b-form-input>
          </b-input-group>
        </div>
      </div>

      <!-- Table Wrapper -->
      <div class="admin-table-wrapper px-6 pb-6">
        <SkeletonTable v-if="isLoading" :rows="8" :columns="8" />

        <b-table
          v-else
          responsive
          hover
          :items="items"
          :fields="fields"
          primary-key="id"
          :filter="searchText"
          :current-page="currentPage"
          :per-page="perPage"
          @filtered="onFiltered"
          thead-class="text-uppercase text-muted font-size-xs"
          empty-text="No shipments found for this client matching the filters."
          show-empty
          :tbody-tr-class="rowClass"
        >
          <template #cell(index)="data">
            <span class="font-weight-bold">#{{ (currentPage - 1) * perPage + data.index + 1 }}</span>
          </template>

          <template #cell(awb_number)="data">
            <div>
              <span class="font-weight-bold text-dark font-size-lg">{{ data.item.awb_code }}-{{ data.item.awb_no }}</span>
              <div class="text-muted font-size-xs" v-if="data.item.agents_info && data.item.agents_info.company_name">
                <i class="fas fa-building mr-1"></i>{{ data.item.agents_info.company_name.name }}
              </div>
            </div>
          </template>

          <template #cell(house_way_bills_count)="data">
            <b-badge variant="light-success" pill class="px-3 py-2 font-weight-bold font-size-sm">
              {{ data.item.house_way_bills_count }} HAWB
            </b-badge>
          </template>

          <template #cell(pieces)="data">
            <span class="font-weight-bolder">{{ data.item.consignment_data ? data.item.consignment_data.pieces : '—' }}</span>
          </template>

          <template #cell(weight)="data">
            <span class="font-weight-bolder" v-if="data.item.consignment_data">
              {{ data.item.consignment_data.gross_weight }} {{ data.item.consignment_data.weight_code || 'K' }}
            </span>
            <span v-else>—</span>
          </template>

          <template #cell(date_sent)="data">
            <div>
              <span class="font-weight-bold text-dark">{{ formatDate(data.item.created_at) }}</span>
              <div class="text-muted font-size-xs">{{ formatTime(data.item.created_at) }}</div>
            </div>
          </template>

          <template #cell(fna_status)="data">
            <b-badge v-if="data.item.fna_received" variant="danger" class="text-uppercase font-weight-bold px-3 py-2" v-b-tooltip.hover :title="data.item.fna_reason || 'Rejection reason not specified'">
              <i class="fas fa-exclamation-triangle mr-1"></i> FNA Received
            </b-badge>
            <b-badge v-else variant="success" class="text-uppercase font-weight-bold px-3 py-2">
              <i class="fas fa-check-circle mr-1"></i> No FNA
            </b-badge>
          </template>

          <template #cell(action)="data">
            <b-button variant="light-primary" size="sm" class="btn-icon-sm" @click="viewXml(data.item.id)">
              <i class="fas fa-code mr-1"></i> XML
            </b-button>
          </template>
        </b-table>
      </div>

      <!-- Pagination -->
      <div class="admin-pagination-wrap px-6 pb-6" v-if="totalRows > 0">
        <div class="text-muted font-weight-bold font-size-sm">
          Showing {{ items.length ? (currentPage - 1) * perPage + 1 : 0 }} to {{ Math.min(currentPage * perPage, totalRows) }} of {{ totalRows }} entries
        </div>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" size="sm" class="my-0"></b-pagination>
      </div>
    </div>

    <!-- XML Viewer Modal -->
    <b-modal 
      id="xml-viewer-modal" 
      title="XML Message Viewer" 
      size="lg" 
      hide-footer
      modal-class="xml-modal"
      header-bg-variant="primary"
      header-text-variant="white"
    >
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="font-weight-bold text-muted">AWB ID: <span class="text-dark">{{ selectedAwbId }}</span></span>
        <div>
          <b-button variant="outline-primary" size="sm" class="mr-2" @click="copyXml">
            <i class="fas fa-copy mr-1"></i> Copy
          </b-button>
          <b-button variant="primary" size="sm" @click="downloadXml">
            <i class="fas fa-download mr-1"></i> Download
          </b-button>
        </div>
      </div>
      <div class="xml-content-wrapper">
        <pre class="xml-pre-code"><code>{{ xmlContent }}</code></pre>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import SkeletonTable from "../../components/SkeletonTable.vue";
import Swal from 'sweetalert2';

export default {
  name: "superadminclientshipments",
  data() {
    return {
      fields: [
        { label: "Sl", key: "index" },
        { label: "AWB Number / Client", key: "awb_number" },
        { label: "HAWB Count", key: "house_way_bills_count" },
        { label: "Origin", key: "departure_airport" },
        { label: "Destination", key: "destination_airport" },
        { label: "Pcs", key: "pieces" },
        { label: "Weight", key: "weight" },
        { label: "Time & Date Sent", key: "date_sent" },
        { label: "FNA Status", key: "fna_status" },
        { label: "Sent XML", key: "action" }
      ],
      items: [],
      companies: [],
      filters: {
        company_id: null,
        origin: "",
        destination: "",
        date: "",
        fna_status: null
      },
      fnaOptions: [
        { value: null, text: "All Shipments" },
        { value: "yes", text: "FNA Received" },
        { value: "no", text: "No FNA" }
      ],
      totalAwb: 0,
      totalHawb: 0,
      isLoading: false,
      searchText: "",
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],
      xmlContent: "",
      selectedAwbId: "",
      pollTimer: null,
      lastUpdated: ""
    };
  },
  components: {
    SkeletonTable
  },
  computed: {
    companyOptions() {
      const options = [{ value: null, text: "All Clients / Companies" }];
      this.companies.forEach(company => {
        options.push({ value: company.id, text: company.name });
      });
      return options;
    }
  },
  methods: {
    fetchCompanies() {
      ApiService.get(`/superadmin/all-company`)
        .then(({ data }) => {
          this.companies = data;
        })
        .catch(err => {
          console.error("Failed to load companies", err);
        });
    },
    fetchShipments(showLoading = true) {
      if (showLoading) {
        this.isLoading = true;
      }
      ApiService.query(`/superadmin/client-shipments`, { params: this.filters })
        .then(({ data }) => {
          this.items = data.shipments;
          this.totalAwb = data.total_awb;
          this.totalHawb = data.total_hawb;
          this.totalRows = data.shipments.length;

          const now = new Date();
          this.lastUpdated = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
        })
        .catch(err => {
          console.error("Failed to load shipments", err);
          if (showLoading) {
            Swal.fire("Error", "Could not retrieve shipments data.", "error");
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.scheduleNextPoll();
        });
    },
    scheduleNextPoll() {
      this.clearPollTimer();

      // Check Operating Hours (10:00 AM to 10:00 PM)
      const now = new Date();
      const hour = now.getHours();
      const isOperatingHours = hour >= 10 && hour < 22;

      // Only poll if tab is active/visible and within operating hours
      if (isOperatingHours && document.visibilityState === "visible") {
        this.pollTimer = setTimeout(() => {
          this.fetchShipments(false); // Fetch silently in background
        }, 60000); // 60 seconds
      } else {
        // Check again in 60 seconds even if suspended, to resume when time/visibility changes
        this.pollTimer = setTimeout(() => {
          this.scheduleNextPoll();
        }, 60000);
      }
    },
    clearPollTimer() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer);
        this.pollTimer = null;
      }
    },
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.fetchShipments(false); // Fetch immediately upon window focus & resume schedule
      } else {
        this.clearPollTimer(); // Stop timers when invisible
      }
    },
    resetFilters() {
      this.filters = {
        company_id: null,
        origin: "",
        destination: "",
        date: "",
        fna_status: null
      };
      this.fetchShipments();
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rowClass(item, type) {
      if (!item || type !== 'row') return '';
      return item.fna_received ? 'table-row-fna' : '';
    },
    formatDate(dateString) {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatTime(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },
    viewXml(awbId) {
      this.selectedAwbId = awbId;
      this.xmlContent = "Loading XML content...";
      this.$bvModal.show("xml-viewer-modal");

      ApiService.get(`/superadmin/shipment-xml/${awbId}`)
        .then(response => {
          // If response is XML string
          this.xmlContent = typeof response.data === 'string' ? response.data : new XMLSerializer().serializeToString(response.data);
        })
        .catch(err => {
          console.error("Failed to fetch XML file", err);
          this.xmlContent = "Error: XML file could not be found or retrieved.";
        });
    },
    copyXml() {
      navigator.clipboard.writeText(this.xmlContent)
        .then(() => {
          Swal.fire({
            title: "Copied!",
            text: "XML content copied to clipboard.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
        })
        .catch(err => {
          Swal.fire("Error", "Failed to copy text.", "error");
        });
    },
    downloadXml() {
      const blob = new Blob([this.xmlContent], { type: "application/xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `xml_airway_bill_${this.selectedAwbId}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted() {
    this.fetchCompanies();
    this.fetchShipments();
    this.scheduleNextPoll();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeDestroy() {
    this.clearPollTimer();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }
};
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #355594 0%, #1d3363 100%);
}
.bg-gradient-success {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}
.stats-card {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}
.stats-card:hover {
  transform: translateY(-5px);
}
.stats-label {
  font-size: 0.8rem;
  letter-spacing: 1px;
}
.stats-value {
  font-size: 2.2rem;
  line-height: 1;
}
.bg-light-card {
  background-color: #f8fafc;
}
.xml-content-wrapper {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 16px;
  max-height: 450px;
  overflow-y: auto;
  border: 1px solid #333;
}
.xml-pre-code {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.xml-pre-code code {
  color: #e2e8f0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
}
.btn-icon-sm {
  border-radius: 6px;
  padding: 4px 10px;
}
.table-row-fna {
  background-color: rgba(246, 78, 96, 0.04) !important;
  border-left: 4px solid #f64e60 !important;
}
.table-row-fna:hover {
  background-color: rgba(246, 78, 96, 0.08) !important;
}
</style>
