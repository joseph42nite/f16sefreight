<style>
.waybill-status-header{
        background: #3b6fb6;
        color: #fff;
        font-weight: 600;
        padding: 6px 8px;
        justify-content: space-between;
}
hr{
    margin-top: 0px !important;
    margin-bottom: 0px !important;
}
td[aria-colindex="5"] {
  width: 50% !important;
}
</style>
<template>
    <b-container fluid class="body-color">
        <!-- Include Page Loader -->
        <!-- <PageLoader></PageLoader> -->
        <!-- Include Header -->

        <div class="d-flex flex-column flex-lg-row">
            <SideBar></SideBar>
            <div
                style="
                    background: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1);
                    z-index: 1;
                    border-radius: 32px;
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                "
                class="ml-lg-4 mt-4 mt-lg-0"
            >
                <div class="container py-8 px-6 px-sm-8 px-md-10">
                    <template>
                        <b-row class="align-items-center mb-0">
                            <b-col cols="12">
                                <div class="d-flex flex-column">
                                    <span style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 700; color: #355594; opacity: 0.6; margin-bottom: 0.5rem; display: block;">Navigation</span>
                                    <h6 style="color:#355594;font-size:26px !important;line-height:34px !important;font-weight:800 !important;letter-spacing:-0.5px !important;margin-bottom:0px;font-family:'Inter', sans-serif !important;">Message Log</h6>
                                </div>
                            </b-col>
                        </b-row>
                    </template>
                </div>

                <hr class="hr" />

                <div class="container py-8 px-6 px-sm-8 px-md-10">
                    <div class="mx-2 mx-sm-4">
                        <h4 class="h-color mb-4">Search Waybill Messages</h4>

                        <div class="d-flex align-items-center mb-6 flex-wrap" style="gap: 12px; background: #F8FCFF; border: 1px solid #E6F0FF; padding: 20px 24px; border-radius: 16px; width: fit-content;">
                            <label class="mb-0 font-weight-bold" style="color: #355594; font-size: 0.95rem;">
                                Master No: <span class="text-danger">*</span>
                            </label>
                            <div class="d-flex align-items-center" style="gap: 8px;">
                                <b-form-input
                                    v-model="form.masterStart"
                                    class="form-control-custom awb-code-input text-center" id="awb_code"
                                    style="width: 70px" maxlength="3" @input="validateAwbCode"
                                    placeholder="Prefix"
                                />
                                <span style="color: #355594; font-weight: bold;">-</span>
                                <b-form-input
                                    v-model="form.masterEnd" id="awb_no"
                                    class="form-control-custom awb-no-input text-center"
                                    style="width: 140px" maxlength="8" @input="validateAwbNo"
                                    placeholder="AWB Number"
                                />
                            </div>
                            <div class="d-flex align-items-center" style="gap: 8px;">
                                <b-button
                                    class="show-btn"
                                    @click="searchAWB"
                                    style="height: 42px;"
                                    >
                                    <b-icon icon="search" class="mr-2"></b-icon>Search
                                </b-button>
                                <b-button
                                    class="show-btn"
                                    @click="clearSearch"
                                    style="height: 42px;"
                                    >
                                    <b-icon icon="x-circle" class="mr-2"></b-icon>Clear
                                </b-button>
                            </div>
                        </div>

                        <div v-if="errorMessage" class="text-center text-danger my-3">
                            {{ errorMessage }}
                        </div>

                        <div class="d-flex align-items-center justify-content-between mb-4 mt-6">
                            <h4 class="h-color mb-0">Message History Logs</h4>
                            <div class="d-flex align-items-center" style="background:#F0F7FF;border-radius:12px;padding:6px 14px;border:1px solid #E6F0FF;">
                                <span class="mr-2 font-weight-bold" style="color: #355594; font-size: 0.85rem;">Show:</span>
                                <b-form-select
                                    id="per-page-select"
                                    v-model="perPage"
                                    :options="pageOptions"
                                    class="form-control-sm"
                                    style="width: 65px; border: 0px !important; color: #355594; font-weight: 600; background: transparent; cursor: pointer; outline: none; box-shadow: none; padding-left: 0; padding-top: 0; padding-bottom: 0; height: auto;"
                                ></b-form-select>
                            </div>
                        </div>
                        
                        <SkeletonTable v-if="isLoading" :rows="10" :columns="5" />
                        <template v-else>
                            <b-table :items="normalizedItems" :fields="fields" small responsive class="w-100 custom-table" :per-page="perPage" :current-page="currentPage" @filtered="onFiltered" >
                            <!-- Index -->
                            <template #cell(index)="row">
                                <span class="font-weight-bold text-muted">{{ row.index + 1 }}</span>
                            </template>

                            <!-- AWB No. -->
                            <template #cell(id)="row">
                                <router-link :to="'/edit-airway-bill/' + String(row.item.id)" class="custom-link font-weight-bold" @click.native="getAirWayBill(String(row.item.id))">
                                    {{ String(row.item.awb_code) }}-{{ String(row.item.awb_no) }}
                                </router-link>
                            </template>

                            <!-- Destination -->
                            <template #cell(destination_airport)="row">
                                <span class="badge badge-light px-2 py-1" style="color: #355594; background: #F0F7FF; border: 1px solid #E6F0FF; font-weight: 600; border-radius: 6px;">
                                    {{ getAirportCode(row.item.destination_airport) }}
                                </span>
                            </template>

                            <!-- Created At -->
                            <template #cell(send_created)="row">
                                <span class="text-muted">{{ formatDate(row.item.send_created) }}</span>
                            </template>

                            <!-- Custom Header for Houseway Column -->
                            <template #head(houseway)>
                                <div class="d-flex font-weight-bold" style="color: #8A99AD; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                                    <div class="w-25">House No.</div>
                                    <div class="w-25">Actions</div>
                                    <div class="w-25">Place</div>
                                    <div class="w-25">Date</div>
                                </div>
                            </template>

                            <!-- Houseway Details in Same Row -->
                            <template #cell(houseway)="row">
                                <div v-if="row.item.house_way_bills && row.item.house_way_bills.length" class="mb-3">
                                    <div v-for="(bill, i) in row.item.house_way_bills" :key="i" class="d-flex py-2 house-row border-bottom align-items-center">
                                        <div class="w-25 font-weight-bold" style="color: #1e3a6e;">{{ bill.id }}</div>
                                        <div class="w-25 d-flex align-items-center">
                                            <b-icon icon="pencil" class="text-primary mr-3" style="cursor: pointer; font-size: 1.1rem;" @click="$router.push('/edit-houseway-bill/' + bill.id)"/>
                                            <b-icon icon="trash" class="text-danger" style="cursor: pointer; font-size: 1.1rem;" @click="handleDeleteHouseBill(bill.id)"/>
                                        </div>
                                        <div class="w-25">
                                            <span class="badge badge-light px-2 py-1" style="color: #475569; background: #F8FCFF; border: 1px solid #E2E8F0; font-weight: 500; border-radius: 6px;">
                                                {{ getAirportCode(bill.destination_airport) }}
                                            </span>
                                        </div>
                                        <div class="w-25 text-muted" style="font-size: 0.8rem;">
                                            {{ formatDate(bill.created_at) }}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex font-weight-bold waybill-status-header">
                                    <div class="w-25">FNA and FMAs</div>
                                    <div class="w-25 text-right pr-3">Date</div>
                                </div>
                                
                                <div class="status-response-container">
                                    <div v-for="(status,i) in data_items.status_reponse" :key="i" class="status-log-item py-2 px-3 mb-2 rounded" style="background: #F8FCFF; border: 1px solid #E6F0FF;">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="d-flex align-items-center">
                                                <span class="status-badge mr-2">{{ i + 1 }}</span>
                                                <span class="font-weight-bold" style="color: #355594; font-size: 0.9rem;">{{ status.business_status_code }}</span>
                                            </div>
                                            <span class="text-muted" style="font-size: 0.75rem;">{{ formatDate(status.created_at) }}</span>
                                        </div>
                                        <div v-if="status.reason" class="pl-7 mt-1 text-muted" style="font-size: 0.8rem;">
                                            <b-icon icon="info-circle" class="mr-1" style="color: #355594; opacity: 0.7;"></b-icon>
                                            <strong>{{ status.condition_code }}:</strong> {{ status.reason }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                            </b-table>
                        </template>
                        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="mt-4 custom-pagination"></b-pagination>
                    </div>
                </div>
            </div>
        </div>
    </b-container>
</template>
<script>

import SideBar from "@/view/layouts/public/SideBar.vue";
import SkeletonTable from "../../components/SkeletonTable.vue";
import ApiService from "@/core/services/api.service";
import { mapGetters } from "vuex";
// import PageLoader from '../../components/PageLoader.vue';

export default {
    name: "MessageLog",
    data() {
        return {
            form: new Form({
                masterStart: "",
                masterEnd: "",
            }),
            selectedViewPageOption: '/message-log',
            filter: "",
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            pageOptions: [10, 20, 50, 100],
            data_items: [],
            filteredData: [],
            isSearchValid: false,
            searchPerformed: false,
            consolidation: [],
            existingData: {},
            errorMessage: '',
            isLoading: false,
            fields: [
                { key: "index", label: "Sl No." },
                { key: "id", label: "AWB No." },
                { key: "destination_airport", label: "Destination" },
                { key: "created_at", label: "Date & time" },
                { key: "houseway", label: "" },
            ]
        };
    },
    computed: {
        ...mapGetters({ current_user: "currentUser" }),
        filteredItems() {
        if (!this.filter) return this.data_items;

        const search = this.filter.toLowerCase();
        return this.data_items.filter(
            (item) =>
            (item.awb_code || "")
                    .toString()
                    .toLowerCase()
                    .includes(search) ||
                (item.awb_no || "")
                    .toString()
                    .toLowerCase()
                    .includes(search) ||
                (item.destination_airport || "")
                    .toLowerCase()
                    .includes(search) ||
                (item.place || "").toLowerCase().includes(search)
        );
    },
    normalizedItems() {
        if (this.searchPerformed && this.data_items && this.data_items.airway_bill && this.data_items.airway_bill !== null) {
            if (!this.data_items.airway_bill.destination_airport) return [];
            
            return [{
                id: this.data_items.airway_bill.id,
                awb_no: this.data_items.airway_bill.awb_no,
                awb_code: this.data_items.airway_bill.awb_code,
                destination_airport: this.getAirportCode(this.data_items.airway_bill.destination_airport),
                created_at: this.formatDate(this.data_items.airway_bill.created_at),
                house_way_bills: this.data_items.house_way_bills
                    .filter(hwb => hwb.destination_airport)
                    .map(hwb => ({
                        ...hwb,
                        destination_airport: this.getAirportCode(hwb.destination_airport),
                        created_at: this.formatDate(hwb.created_at),
                    }))
            }];
        } else if (Array.isArray(this.data_items)) {
            return this.data_items.filter(item => item.destination_airport);
        }
        return [];
    }
        // filteredItems() {
        //     if (!this.filter) return this.data_items;

        //     const search = this.filter.toLowerCase();
        //     return this.data_items.filter(
        //         (item) =>
        //         (item.awb_code || "")
        //                 .toString()
        //                 .toLowerCase()
        //                 .includes(search) ||
        //             (item.awb_no || "")
        //                 .toString()
        //                 .toLowerCase()
        //                 .includes(search) ||
        //             (item.destination_airport || "")
        //                 .toLowerCase()
        //                 .includes(search) ||
        //             (item.place || "").toLowerCase().includes(search)
        //     );
        // },
        // normalizedItems() {
        //     if (this.searchPerformed && this.data_items && this.data_items.airway_bill && this.data_items.airway_bill !== null) {
        //     return [{
        //         awb_no: this.data_items.airway_bill.awb_no,
        //         awb_code: this.data_items.airway_bill.awb_code,
        //         destination_airport: this.getAirportCode(this.data_items.airway_bill.destination_airport),
        //         created_at: this.formatDate(this.data_items.airway_bill.created_at),
        //         house_way_bills: this.data_items.house_way_bills.map(hwb => ({
        //         ...hwb,
        //         destination_airport: this.getAirportCode(hwb.destination_airport),
        //         created_at: this.formatDate(hwb.created_at),
        //         }))
        //     }];
        //     } else if (Array.isArray(this.data_items)) {
        //     return this.data_items;
        //     }
        //     return [];
        // }
    },
    watch: {
        filteredItems(val) {
            this.totalRows = val.length;
        },
        "$route.params.id"(newId) {
            if (newId) {
                this.getAirWayBill(newId);
                this.getHouseWayBill(newId);
            }
        },
    },
    mounted() {
        this.totalRows = this.data_items.length;
        this.allAirwayBill();
    },
    methods: {
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        onSelect(value) {
            if (value) {
                window.location.href = value;
            }
        },
        getHouseWayBill(id) {
            ApiService.get(`/user/houseway-bill/${id}`)
                .then((response) => {
                    this.existingData = response.data;
                    this.openForm("update", this.existingData.id);
                    if (
                        this.existingData &&
                        this.existingData.consignment_data
                    ) {
                        this.isConsignmentAdded = true;
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date
                .toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
                .replace(",", "");
        },
        getAirportCode(airport) {
            if (!airport) return "";
            return airport.split(",")[0].trim();
        },
        allAirwayBill() {
            this.isLoading = true;
            ApiService.get("/user/all-airway-bill")
                .then((response) => {
                    this.data_items = response.data;
                    this.filteredData = response.data;
                    this.totalRows = response.data.length;
                })
                .catch((error) => {
                    console.error("Failed to fetch items:", error);
                    this.data_items = [];
                    this.filteredData = [];
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        getAirWayBill(id) {
            ApiService.get(`/user/airway-bill/${id}`)
                .then((response) => {
                    if (response.data && response.data.id == id) {
                        this.existingData = response.data;
                    } else {
                    }
                })
                .catch((error) => {
                    this.existingData = null;
                });
        },
        handleDeleteHouseBill(id) {
            if (
                confirm("Are you sure you want to delete this house way bill?")
            ) {
                ApiService.delete(`/user/house-way-bills/${id}`)
                    .then(() => {
                        // Clear the cached house way bills
                        this.house_way_bills = {};
                        // Refresh the data
                        this.allAirwayBill();
                    })
                    .catch((error) => {
                        console.error("Failed to delete house way bill:", error);
                    });
            }
        },
        searchAWB() {
            this.errorMessage = ''; // reset
            this.searchPerformed = false;
            if (!this.form.masterStart || !this.form.masterEnd) {
            this.$bvToast.toast('Please enter both master start and end numbers.', {
                title: 'Validation Error',
                variant: 'danger',
                solid: true
            });
            return;
            }

            this.form.post(`/user/search-airway-bills`, {
                params: {
                    awb_code: this.form.masterStart,
                    awb_no: this.form.masterEnd
                }
            })
            .then(response => {
                // this.airway_bill = response.data.airway_bill;
                // this.data_items = response.data.house_way_bills;
                this.data_items = response.data;
                this.currentPage = 1;
                this.searchPerformed = true;
                this.totalRows = response.data.length;
                // this.form.reset();

            })
            .catch(error => {
                this.searchPerformed = true;
                if (error.response && error.response.data && error.response.data.message) {
                this.errorMessage = error.response.data.message;
                } else {
                this.errorMessage = 'Something went wrong.';
                }
            });
        },
        validateAwbCode(value) {
            this.form.masterStart = value.replace(/[^0-9]/g, '').slice(0, 3);
            this.validateSearch();
            this.checkEmptyFields();
        },

        validateAwbNo(value) {
            this.form.masterEnd = value.replace(/[^0-9]/g, '').slice(0, 8);
            this.validateSearch();
            this.checkEmptyFields();
        },

        validateSearch() {
            this.isSearchValid = this.form.masterStart.length === 3 && this.form.masterEnd.length === 8;
        },

        checkEmptyFields() {
            // If both fields are empty, reload all data
            if (this.form.masterStart === "" && this.form.masterEnd === "") {
                this.searchPerformed = false;
                this.errorMessage = '';
                this.allAirwayBill();
            }
        },

        clearSearch() {
            // Clear the form fields
            this.form.masterStart = "";
            this.form.masterEnd = "";
            this.searchPerformed = false;
            this.errorMessage = '';
            this.allAirwayBill();
        },
    },
    components: {
        SideBar,
        SkeletonTable
        // PageLoader
    },
};
</script>
<style scoped>
.custom-table {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    width: 100% !important;
    margin-top: 10px !important;
    margin-bottom: 20px !important;
    background: transparent !important;
    border: none !important;
}

.custom-table >>> th {
    color: #8A99AD !important;
    font-weight: 600 !important;
    font-size: 11px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    padding: 12px 8px !important;
    border-bottom: 2px solid rgba(53, 85, 148, 0.08) !important;
    border-top: none !important;
    background: #F8FCFF !important;
    font-family: 'Inter', sans-serif !important;
}

.custom-table >>> td {
    padding: 14px 8px !important;
    vertical-align: top !important;
    border-bottom: 1px solid rgba(53, 85, 148, 0.05) !important;
    color: #475569 !important;
    font-size: 13px !important;
    background: transparent !important;
}

.custom-table >>> tr:hover td {
    background-color: rgba(53, 85, 148, 0.01) !important;
}

.custom-table th:nth-child(1),
.custom-table td:nth-child(1) {
    width: 60px !important;
    text-align: center !important;
}

.custom-table th:nth-child(2),
.custom-table td:nth-child(2) {
    width: 140px !important;
}

.custom-link {
    color: #355594 !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    text-decoration: none !important;
    border-bottom: 1px dashed rgba(53, 85, 148, 0.4) !important;
}

.custom-link:hover {
    color: #2637a8 !important;
    border-bottom: 1px solid #2637a8 !important;
    text-decoration: none !important;
}

.house-row {
    border-bottom: 1px solid rgba(53, 85, 148, 0.05) !important;
    align-items: center;
    transition: all 0.2s ease;
}

.house-row:hover {
    background-color: rgba(53, 85, 148, 0.02);
}

.house-row .b-icon {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.house-row .b-icon:hover {
    transform: scale(1.15);
}

.waybill-status-header {
    background: rgba(53, 85, 148, 0.06);
    color: #355594;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 8px 12px;
    border-radius: 8px;
    margin-top: 10px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
}

.status-log-item {
    transition: all 0.3s ease;
}

.status-log-item:hover {
    background: #F0F7FF !important;
    border-color: #355594 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(53, 85, 148, 0.05);
}

.status-badge {
    background: #E6F0FF;
    color: #355594;
    font-weight: 700;
    font-size: 0.75rem;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.hr {
    border: 0;
    border-top: 1px solid rgba(53, 85, 148, 0.12);
    margin: 2rem 0;
}

.h-color {
    color: #355594;
    font-family: 'Inter', sans-serif;
    font-weight: 800 !important;
    font-size: 18px !important;
    letter-spacing: -0.2px;
}

.custom-pagination >>> .page-link {
    background-color: #F8FCFF !important;
    color: #355594 !important;
    border: 1px solid #E6F0FF !important;
    border-radius: 8px !important;
    margin: 0 3px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
}

.custom-pagination >>> .page-link:hover {
    background-color: #F0F7FF !important;
    border-color: #355594 !important;
}

.custom-pagination >>> .page-item.active .page-link {
    background-color: #355594 !important;
    border-color: #355594 !important;
    color: #FFFFFF !important;
    box-shadow: 0 4px 10px rgba(53, 85, 148, 0.2) !important;
}

.custom-pagination >>> .page-item.disabled .page-link {
    background-color: #F8FCFF !important;
    color: #A0AEC0 !important;
    border-color: #E2E8F0 !important;
    opacity: 0.6 !important;
}

.show-btn {
  background: white !important;
  color: #355594 !important;
  border: 1px solid #E6F0FF !important;
  border-radius: 50px !important;
  padding: 10px 22px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
}

.show-btn:hover {
  background: #f0f7ff !important;
  border-color: #355594 !important;
  color: #355594 !important;
  box-shadow: 0 6px 12px rgba(53, 85, 148, 0.1) !important;
}

.form-control-custom {
    border: 1px solid #E6F0FF !important;
    border-radius: 8px !important;
    height: 42px !important;
    padding: 10px 16px !important;
    font-size: 14px !important;
    color: #355594 !important;
    font-weight: 500 !important;
    background-color: #ffffff !important;
    transition: all 0.3s ease !important;
}

.form-control-custom:focus {
    border-color: #355594 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.1) !important;
    outline: none !important;
}

.awb-code-input, .awb-no-input {
    text-align: center !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
}

@media (max-width: 767.98px) {
  .custom-pagination {
    justify-content: center !important;
  }
}
</style>
