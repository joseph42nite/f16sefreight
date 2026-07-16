<template>
  <div class="py-5">
    <div class="admin-page-header d-flex flex-wrap justify-content-between align-items-center mb-6">
      <div class="d-flex flex-column">
        <h2 class="font-weight-bold text-dark mb-1">Client Shipments Tracker</h2>
        <span class="text-muted font-size-sm">Monitor all airway bills (AWB) and house airway bills (HAWB) executed per client</span>
      </div>
      <div class="d-flex align-items-center mt-3 mt-md-0" v-if="lastUpdated">
        <b-badge v-if="isFiltered" variant="light-warning" class="font-weight-bold px-3 py-2 mr-2 cursor-pointer animate-pulse" @click="resetFilters" style="cursor: pointer;">
          <i class="fas fa-filter mr-1 text-warning"></i> Filtering Active (Clear)
        </b-badge>
        <b-badge variant="light-primary" class="font-weight-bold px-3 py-2">
          <i class="fas fa-sync-alt fa-spin mr-1 text-primary"></i> Live: Updated at {{ lastUpdated }}
        </b-badge>
      </div>
    </div>

    <!-- Statistics Metric Cards -->
    <div class="row mb-5">
      <div class="col-md-6">
        <div class="stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-primary text-white">
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
        <div class="stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-success text-white">
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
      <div class="filter-panel p-6 mb-6">
        <h5 class="mb-4 text-primary font-weight-bold"><i class="fas fa-filter mr-2"></i>Filter Shipments</h5>
        <div class="row align-items-end">
          <div class="col-md-2 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">Client / Company</label>
            <b-form-select 
              v-model="filters.company_id" 
              :options="companyOptions" 
              class="form-control"
              @change="applyFilters"
            ></b-form-select>
          </div>
          <div class="col-md-1 mb-3 mb-md-0 px-1">
            <label class="font-weight-bold text-muted font-size-sm">Origin</label>
            <b-form-input 
              v-model="filters.origin" 
              type="text" 
              placeholder="Origin" 
              class="form-control"
              @keyup.enter="applyFilters"
            ></b-form-input>
          </div>
          <div class="col-md-1 mb-3 mb-md-0 px-1">
            <label class="font-weight-bold text-muted font-size-sm">Destination</label>
            <b-form-input 
              v-model="filters.destination" 
              type="text" 
              placeholder="Dest" 
              class="form-control"
              @keyup.enter="applyFilters"
            ></b-form-input>
          </div>
          <div class="col-md-3 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">Date / Month of Sending</label>
            <div class="d-flex align-items-center">
              <div class="mr-2" style="flex: none;">
                <b-button-group size="sm">
                  <b-button 
                    :variant="dateFilterType === 'day' ? 'primary' : 'outline-primary'" 
                    @click="setDateFilterType('day')"
                    style="padding: 0.45rem 0.6rem; font-size: 0.8rem;"
                  >
                    Day
                  </b-button>
                  <b-button 
                    :variant="dateFilterType === 'month' ? 'primary' : 'outline-primary'" 
                    @click="setDateFilterType('month')"
                    style="padding: 0.45rem 0.6rem; font-size: 0.8rem;"
                  >
                    Mon
                  </b-button>
                </b-button-group>
              </div>
              <div class="flex-grow-1" style="min-width: 140px;">
                <date-picker 
                  v-if="dateFilterType === 'day'"
                  v-model="filters.dates" 
                  type="date" 
                  multiple 
                  placeholder="Select dates" 
                  valueType="format" 
                  format="YYYY-MM-DD"
                  class="w-100 mx-datepicker-custom"
                  @change="applyFilters"
                ></date-picker>
                <date-picker 
                  v-else
                  v-model="filters.months" 
                  type="month" 
                  multiple 
                  placeholder="Select months" 
                  valueType="format" 
                  format="YYYY-MM"
                  class="w-100 mx-datepicker-custom"
                  @change="applyFilters"
                ></date-picker>
              </div>
            </div>
          </div>
          <div class="col-md-2 mb-3 mb-md-0">
            <label class="font-weight-bold text-muted font-size-sm">FNA Status</label>
            <b-form-select 
              v-model="filters.fna_status" 
              :options="fnaOptions" 
              class="form-control"
              @change="applyFilters"
            ></b-form-select>
          </div>
          <div class="col-md-3 d-flex">
            <b-button variant="primary" class="w-100 mr-2 d-flex align-items-center justify-content-center" @click="applyFilters" v-b-tooltip.hover title="Apply Filters">
              <i class="fas fa-search mr-1"></i> Search
            </b-button>
            <b-button variant="outline-secondary" class="w-100 d-flex align-items-center justify-content-center" @click="resetFilters" v-b-tooltip.hover title="Reset Filters & Show Live Count">
              <i class="fas fa-undo-alt mr-1"></i> Reset
            </b-button>
          </div>
        </div>
      </div>

      <!-- Pagination Size & Filter indicator -->
      <div class="admin-filter-row d-flex flex-wrap align-items-center justify-content-between px-6 pt-4">
        <div class="d-flex align-items-center">
          <span class="mr-3 font-weight-bold text-muted">Show:</span>
          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" class="form-control-sm mr-4" style="max-width: 120px;"></b-form-select>
          <b-button variant="outline-success" size="sm" class="d-flex align-items-center" @click="downloadCsv">
            <i class="fas fa-file-csv mr-1"></i> Export CSV
          </b-button>
        </div>
        <div class="w-md-25">
          <b-input-group size="sm">
            <b-form-input id="filter-input" v-model="searchText" type="search" placeholder="Search AWB... (Enter)" @keyup.enter="handleAwbSearch" @search="handleAwbSearch"></b-form-input>
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
          :items="localFilteredItems !== null ? localFilteredItems : items"
          :fields="fields"
          primary-key="id"
          thead-class="text-uppercase text-muted font-size-xs"
          empty-text="No shipments found matching the filters."
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

          <template #cell(departure_airport)="data">
            <div v-if="data.item.departure_airport">
              <span class="font-weight-bold text-dark">{{ getAirportCode(data.item.departure_airport) }}</span>
              <div class="text-muted font-size-xs text-truncate" style="max-width: 120px;" v-if="getAirportName(data.item.departure_airport)" v-b-tooltip.hover :title="getAirportName(data.item.departure_airport)">
                {{ getAirportName(data.item.departure_airport) }}
              </div>
            </div>
            <span v-else>—</span>
          </template>

          <template #cell(destination_airport)="data">
            <div v-if="data.item.destination_airport">
              <span class="font-weight-bold text-dark">{{ getAirportCode(data.item.destination_airport) }}</span>
              <div class="text-muted font-size-xs text-truncate" style="max-width: 120px;" v-if="getAirportName(data.item.destination_airport)" v-b-tooltip.hover :title="getAirportName(data.item.destination_airport)">
                {{ getAirportName(data.item.destination_airport) }}
              </div>
            </div>
            <span v-else>—</span>
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
            <div class="text-nowrap">
              <span class="font-weight-bold text-dark d-block mb-1">{{ formatDate(data.item.updated_at) }}</span>
              <span class="text-muted font-size-xs"><i class="far fa-clock mr-1 text-primary"></i>{{ formatTime(data.item.updated_at) }}</span>
            </div>
          </template>

          <template #cell(fna_status)="data">
            <b-badge v-if="data.item.fna_received" variant="light-danger" class="text-uppercase font-weight-bold px-3 py-2" style="cursor: pointer;" v-b-tooltip.hover :title="(data.item.fna_reason || 'Rejection reason not specified') + ' — Click to copy'" @click="copyFnaReason(data.item.fna_reason)">
              <i class="fas fa-exclamation-triangle mr-1 text-danger"></i> FNA Received
            </b-badge>
            <b-badge v-else variant="light-success" class="text-uppercase font-weight-bold px-3 py-2">
              <i class="fas fa-check-circle mr-1 text-success"></i> FMA
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

    <!-- XML Viewer Modal (redesigned) -->
    <b-modal
      id="xml-viewer-modal"
      size="xl"
      hide-header
      hide-footer
      body-class="p-0"
      modal-class="xml-modal-dark"
      centered
    >
      <!-- Custom Modal Header -->
      <div class="xml-modal-header">
        <div class="d-flex align-items-center">
          <div class="xml-modal-icon mr-3">
            <i class="fas fa-file-code"></i>
          </div>
          <div>
            <h5 class="mb-0 text-white font-weight-bold">XML Message Viewer</h5>
            <div class="d-flex align-items-center mt-1">
              <span class="xml-awb-badge mr-2"><i class="fas fa-tag mr-1"></i>AWB</span>
              <code class="text-white font-size-sm" style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; font-size: 0.82rem;">{{ selectedAwbId }}</code>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <button class="xml-action-btn mr-2" @click="copyXml" title="Copy to clipboard">
            <i class="fas fa-copy mr-1"></i> Copy
          </button>
          <button class="xml-action-btn xml-action-btn--primary mr-3" @click="downloadXml" title="Download XML">
            <i class="fas fa-download mr-1"></i> Download
          </button>
          <button class="xml-close-btn" @click="$bvModal.hide('xml-viewer-modal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Code Editor Area -->
      <div class="xml-editor-area">
        <!-- Toolbar bar -->
        <div class="xml-editor-toolbar">
          <div class="d-flex align-items-center">
            <span class="xml-dot xml-dot--red mr-1"></span>
            <span class="xml-dot xml-dot--yellow mr-1"></span>
            <span class="xml-dot xml-dot--green mr-2"></span>
            <span class="xml-lang-badge">XML</span>
          </div>
          <span class="xml-toolbar-hint"><i class="fas fa-lock mr-1"></i>Read-only</span>
        </div>
        <!-- The actual code -->
        <div class="xml-code-scroll">
          <pre class="xml-code-pre"><code class="xml-code-content">{{ xmlContent }}</code></pre>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import SkeletonTable from "../../components/SkeletonTable.vue";
import Swal from 'sweetalert2';
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

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
        { label: "Time & Date Sent", key: "date_sent", thStyle: { minWidth: '150px' } },
        { label: "FNA Status", key: "fna_status" },
        { label: "Sent XML", key: "action" }
      ],
      items: [],
      companies: [],
      filters: {
        company_id: null,
        origin: "",
        destination: "",
        dates: [],
        months: [],
        fna_status: null
      },
      dateFilterType: "day",
      fnaOptions: [
        { value: null, text: "All Shipments" },
        { value: "yes", text: "FNA Received" },
        { value: "no", text: "FMA" }
      ],
      totalAwb: 0,
      totalHawb: 0,
      isLoading: false,
      searchText: "",
      totalRows: 0,
      currentPage: 1,
      perPage: 50,
      pageOptions: [50, 100],
      localFilteredItems: null,
      xmlContent: "",
      selectedAwbId: "",
      pollTimer: null,
      lastUpdated: ""
    };
  },
  components: {
    SkeletonTable,
    DatePicker
  },
  computed: {
    companyOptions() {
      const options = [{ value: null, text: "All Clients / Companies" }];
      this.companies.forEach(company => {
        options.push({ value: company.id, text: company.name });
      });
      return options;
    },
    isFiltered() {
      return this.filters.company_id !== null ||
             this.filters.origin !== "" ||
             this.filters.destination !== "" ||
             (this.filters.dates && this.filters.dates.length > 0) ||
             (this.filters.months && this.filters.months.length > 0) ||
             this.filters.fna_status !== null;
    }
  },
  watch: {
    currentPage() {
      this.fetchShipments();
    },
    perPage() {
      this.applyFilters();
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

      const params = {
        ...this.filters,
        page: this.currentPage,
        per_page: this.perPage,
        search: this.searchText
      };

      ApiService.query(`/superadmin/client-shipments`, { params })
        .then(({ data }) => {
          this.localFilteredItems = null;
          this.items = data.shipments;
          this.totalAwb = data.total_awb;
          this.totalHawb = data.total_hawb;
          if (data.pagination) {
            this.totalRows = data.pagination.total;
          } else {
            this.totalRows = data.shipments.length;
          }

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
    applyFilters() {
      this.localFilteredItems = null;
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      } else {
        this.fetchShipments();
      }
    },
    handleAwbSearch() {
      const search = this.searchText ? this.searchText.trim().toLowerCase() : "";
      
      if (!search) {
        this.localFilteredItems = null;
        this.applyFilters();
        return;
      }

      // Search in currently loaded items first
      const localMatches = this.items.filter(item => {
        const awbCode = item.awb_code ? String(item.awb_code).toLowerCase() : "";
        const awbNo = item.awb_no ? String(item.awb_no).toLowerCase() : "";
        const combined = `${awbCode}-${awbNo}`;
        return combined.includes(search) || awbCode.includes(search) || awbNo.includes(search);
      });

      if (localMatches.length > 0) {
        this.localFilteredItems = localMatches;
      } else {
        // Not found locally, fallback to server search
        this.localFilteredItems = null;
        this.applyFilters();
      }
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
        dates: [],
        months: [],
        fna_status: null
      };
      this.fetchShipments();
    },
    setDateFilterType(type) {
      this.dateFilterType = type;
      if (type === 'day') {
        this.filters.months = [];
      } else {
        this.filters.dates = [];
      }
      this.fetchShipments();
    },
    downloadCsv() {
      const isDateFilterActive = (this.filters.dates && this.filters.dates.length > 0) ||
                                 (this.filters.months && this.filters.months.length > 0);

      if (isDateFilterActive) {
        this.isLoading = true;
        const params = {
          ...this.filters,
          search: this.searchText,
          export: 'all'
        };
        ApiService.query(`/superadmin/client-shipments`, { params })
          .then(({ data }) => {
            this.generateAndDownloadCsv(data.shipments);
          })
          .catch(err => {
            console.error("Failed to export shipments", err);
            Swal.fire("Error", "Could not retrieve export data.", "error");
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        this.generateAndDownloadCsv(this.items);
      }
    },
    generateAndDownloadCsv(items) {
      const headers = [
        "AWB Number",
        "Client/Company",
        "HAWB Count",
        "Origin",
        "Destination",
        "Pieces",
        "Weight",
        "Date Sent",
        "Time Sent",
        "FNA Status"
      ];

      const rows = items.map(item => {
        const awb = `${item.awb_code}-${item.awb_no}`;
        const company = item.agents_info && item.agents_info.company_name 
          ? item.agents_info.company_name.name 
          : "";
        const hawbCount = item.house_way_bills_count || 0;
        const origin = this.getAirportCode(item.departure_airport);
        const destination = this.getAirportCode(item.destination_airport);
        const pieces = item.consignment_data ? item.consignment_data.pieces : "";
        const weight = item.consignment_data 
          ? `${item.consignment_data.gross_weight} ${item.consignment_data.weight_code || 'K'}` 
          : "";
        const dateSent = this.formatDate(item.created_at);
        const timeSent = this.formatTime(item.created_at);
        const fnaStatus = item.fna_received ? "FNA Received" : "FMA";

        return [
          awb,
          company,
          hawbCount,
          origin,
          destination,
          pieces,
          weight,
          dateSent,
          timeSent,
          fnaStatus
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `shipments_export_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
    getAirportCode(val) {
      if (!val) return "";
      return val.split(',')[0].trim();
    },
    getAirportName(val) {
      if (!val) return "";
      const parts = val.split(',');
      if (parts.length > 1) {
        return parts.slice(1).join(',').trim();
      }
      return "";
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
    },
    copyFnaReason(reason) {
      const text = reason || 'Rejection reason not specified';
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$bvToast.toast('FNA reason copied to clipboard', {
            title: 'Copied!',
            variant: 'success',
            solid: true,
            autoHideDelay: 2000
          });
        })
        .catch(() => {
          this.$bvToast.toast('Failed to copy text', {
            title: 'Error',
            variant: 'danger',
            solid: true
          });
        });
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
}
.stats-label {
  font-size: 0.8rem;
  letter-spacing: 1px;
}
.stats-value {
  font-size: 2.2rem;
  line-height: 1;
}
.filter-panel {
  background: #f8fafc;
  border: 1px solid #eff2f5;
  border-radius: 12px;
}
/* XML Modal Dark Theme */
.xml-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1a1f35 0%, #252d4a 100%);
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.xml-modal-icon {
  width: 40px;
  height: 40px;
  background: rgba(99, 179, 237, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #63b3ed;
  font-size: 1.1rem;
}
.xml-awb-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #63b3ed;
  background: rgba(99, 179, 237, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
}
.xml-action-btn {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #e2e8f0;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.xml-action-btn:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}
.xml-action-btn--primary {
  background: #355594;
  border-color: #355594;
  color: #fff;
}
.xml-action-btn--primary:hover {
  background: #2a4278;
}
.xml-close-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: #a0aec0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}
.xml-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fc8181;
}
.xml-editor-area {
  background: #1e2030;
  border-radius: 0 0 4px 4px;
}
.xml-editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #161824;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.xml-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.xml-dot--red   { background: #ff5f57; }
.xml-dot--yellow { background: #febc2e; }
.xml-dot--green  { background: #28c840; }
.xml-lang-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #63b3ed;
  text-transform: uppercase;
}
.xml-toolbar-hint {
  font-size: 0.72rem;
  color: #4a5568;
  font-style: italic;
}
.xml-code-scroll {
  max-height: 520px;
  overflow-y: auto;
  padding: 20px;
  scrollbar-width: thin;
  scrollbar-color: #355594 #1e2030;
}
.xml-code-scroll::-webkit-scrollbar { width: 6px; }
.xml-code-scroll::-webkit-scrollbar-track { background: #1e2030; }
.xml-code-scroll::-webkit-scrollbar-thumb { background: #355594; border-radius: 3px; }
.xml-code-pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}
.xml-code-content {
  color: #a9dc76 !important;
  font-family: 'Courier New', Courier, 'Fira Code', monospace !important;
  font-size: 0.88rem !important;
  line-height: 1.7 !important;
  background: transparent !important;
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
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .85; transform: scale(0.97); }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.mx-datepicker-custom {
  width: 100% !important;
}
.mx-datepicker-custom .mx-input {
  height: calc(1.5em + 1.5rem + 2px) !important;
  border-radius: 10px !important;
  border: 1px solid #E4E6EF !important;
  background-color: #F9FAFB !important;
  color: #3F4254 !important;
  font-family: inherit !important;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  box-shadow: none !important;
  padding: 0.75rem 1rem 0.75rem 2.2rem !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.mx-datepicker-custom .mx-input:focus {
  border-color: #355594 !important;
  background-color: white !important;
  box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.15) !important;
}
.mx-datepicker-custom .mx-icon-calendar {
  left: 10px !important;
  right: auto !important;
  color: #a1a5b7 !important;
}
.mx-datepicker-custom .mx-icon-clear {
  right: 10px !important;
  color: #a1a5b7 !important;
}
</style>

<!-- Global styles for the XML modal — b-modal renders outside scoped boundary -->
<style>
.xml-modal-dark .modal-content {
  background: #1e2030 !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5) !important;
}
.xml-modal-dark .modal-body {
  padding: 0 !important;
  background: transparent !important;
}
/* Force code text to be visible — override any global Bootstrap/theme color */
.xml-modal-dark .xml-code-content,
.xml-modal-dark code,
.xml-modal-dark pre code {
  color: #a9dc76 !important;
  background: transparent !important;
  font-family: 'Courier New', Courier, monospace !important;
  font-size: 0.88rem !important;
  line-height: 1.7 !important;
}
.xml-modal-dark pre {
  background: transparent !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  color: inherit !important;
}
</style>
