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
    <div class="body-color">
        <div class="container-fluid">
            <!-- Include Page Loader -->
            <!-- <PageLoader></PageLoader> -->
            <!-- Include Header -->

            <div class="d-flex">
                <SideBar></SideBar>
                <template>
                    <div
                        class="table-responsive"
                        style="
                            overflow-x: hidden !important;
                            background-color: #fff;
                            box-shadow: 3px 3px 10px #d0d0d0;
                            z-index: 1;
                            border-radius: 30px;
                        "
                    >
                        <b-card class="p-4 mb-5">
                            <h3 class="mb-3">Search</h3>

                            <b-form inline class="mb-4">
                                <label class="mr-2"
                                    >Master No:
                                    <span class="text-danger">*</span></label
                                >
                                <b-form-input
                                    v-model="form.masterStart"
                                    class="mr-2" id="awb_code"
                                    style="width: 100px" maxlength="3" @input="validateAwbCode"
                                />
                                <b-form-input
                                    v-model="form.masterEnd" id="awb_no"
                                    class="mr-2"
                                    style="width: 100px" maxlength="8" @input="validateAwbNo"
                                />
                                <b-button
                                    pill
                                    style="
                                        color: #2637a8;
                                        background: #ffffff !important;
                                        border: 1px solid #2637a8;
                                        padding: 6px 25px;
                                    "
                                    @click="searchAWB"
                                    >Search</b-button
                                >
                                <b-button
                                    pill
                                    class="ml-2"
                                    style="
                                        color: #2637a8;
                                        background: #ffffff !important;
                                        border: 1px solid #2637a8;
                                        padding: 6px 25px;
                                    "
                                    @click="clearSearch"
                                    >Clear</b-button
                                >
                            </b-form>
                            <div v-if="errorMessage" class="text-center text-danger my-3">
  {{ errorMessage }}
</div>

                            <div class="d-flex">
                                <div class="d-flex align-items-center ml-auto">
                                    <b-form-select
                                        id="per-page-select"
                                        v-model="perPage"
                                        :options="pageOptions"
                                        class="mr-2 mb-1"
                                        style="background: white; width: 60px"
                                    ></b-form-select>
                                </div>
                            </div>
                            <!-- :items="data_items" -->
                            <!-- <b-table
                            :items="normalizedItems"
                                :fields="fields"
                                small
                                responsive
                                class="w-100 custom-table"
                                :per-page="perPage"
                                :current-page="currentPage"
                                @filtered="onFiltered"
                            >
                                <template #cell(index)="row">
                                    {{ row.index + 1 }}
                                </template>
                                <template #cell(id)="row">
                                    <a
                                        :href="
                                            '/edit-airway-bill/' + row.item.id
                                        "
                                        class="custom-link"
                                        @click="getAirWayBill(String(row.item.id))"
                                    >
                                        <router-link
                                            v-slot="{ navigate, href }"
                                            :to="
                                                '/edit-airway-bill/' +
                                                row.item.id
                                            "
                                            custom
                                        >
                                            {{ String(row.item.awb_code) }}-{{ String(row.item.awb_no) }}
                                        </router-link>
                                    </a>
                                </template>
                                <template #cell(destination_airport)="row">
                                    {{
                                        getAirportCode(
                                            row.item.destination_airport
                                        )
                                    }}
                                </template>
                                <template #cell(created_at)="row">
                                    {{ formatDate(row.item.created_at) }}
                                </template>
                                <div
                                    v-for="(item, index) in data_items"
                                    :key="index"
                                    class="d-flex py-1 house-row"
                                >
                                    <div class="w-25">
                                        <a
                                            :href="
                                                '/edit-airway-bill/' + item.id
                                            "
                                            class="custom-link"
                                            @click="getAirWayBill(String(item.id))"
                                        >
                                            <router-link
                                                v-slot="{ navigate, href }"
                                                :to="
                                                    '/edit-airway-bill/' +
                                                    item.id
                                                "
                                                custom
                                            >
                                                {{ String(item.awb_code) }}
                                                {{ String(item.awb_no) }}
                                            </router-link>
                                        </a>
                                    </div>
                                    <div class="w-25">
                                        {{
                                            getAirportCode(
                                                item.destination_airport
                                            )
                                        }}
                                    </div>
                                    <div class="w-25">
                                        {{ formatDate(item.created_at) }}
                                    </div>
                                </div>

                                <template #cell(houseway)="row">
                                    <div v-if="row.index === 0">
                                        <div
                                            class="d-flex font-weight-bold house-row"
                                            style="
                                                background-color: rgb(
                                                    242,
                                                    249,
                                                    255
                                                );
                                                padding-top: 10px;
                                                padding-bottom: 10px;
                                            "
                                        >
                                            <div class="w-25">House No.</div>
                                            <div class="w-25"></div>
                                            <div class="w-25">Place</div>
                                            <div class="w-25">Date</div>
                                        </div>
                                    </div>
                                    <div
                                        v-for="(bill, i) in getHouseWayBills(
                                            row.item
                                        )"
                                        :key="i"
                                        class="d-flex py-1 house-row"
                                    >
                                        <div class="w-25">
                                            {{ bill.id }}
                                        </div>
                                        <div class="w-25">
                                            <router-link
                                                :to="
                                                    '/edit-houseway-bill/' +
                                                    bill.id
                                                "
                                                custom
                                                v-slot="{ navigate }"
                                            >
                                                <b-icon
                                                    icon="pencil"
                                                    aria-hidden="true"
                                                    style="
                                                        color: #355594 !important;
                                                        cursor: pointer;
                                                        margin-right: 10px;
                                                    "
                                                    @click="navigate"
                                                ></b-icon>
                                            </router-link>
                                            <b-icon
                                                icon="trash"
                                                class="text-danger"
                                                style="cursor: pointer"
                                                @click="
                                                    handleDeleteHouseBill(
                                                        bill.id
                                                    )
                                                "
                                            />
                                        </div>
                                        <div class="w-25">
                                            {{ getAirportCode(bill.destination_airport) }}
                                            <b-icon
                                                icon="flag-fill"
                                                class="ml-1 text-dark"
                                            />
                                        </div>
                                        <div class="w-25">
                                            {{ formatDate(bill.created_at) }}
                                        </div>
                                    </div>
                                </template>
                            </b-table> -->
                            <b-table :items="normalizedItems" :fields="fields" small responsive class="w-100 custom-table" :per-page="perPage" :current-page="currentPage" @filtered="onFiltered" >
                                <!-- Index -->
                                <template #cell(index)="row">
                                    {{ row.index + 1 }}
                                </template>

                                <!-- AWB No. -->
                                <template #cell(id)="row">
                                    <router-link :to="'/edit-airway-bill/' + String(row.item.id)" class="custom-link"  @click.native="getAirWayBill(String(row.item.id))">
                                    {{ String(row.item.awb_code) }} {{ String(row.item.awb_no) }}
                                    </router-link>
                                    <!-- <router-link :to="'/xml-view/' + String(row.item.id)" class="custom-link"> (View XML)</router-link> -->
                                </template>

                                <!-- Destination -->
                                <template #cell(destination_airport)="row">
                                    {{ getAirportCode(row.item.destination_airport) }}
                                </template>

                                <!-- Created At -->
                                <template #cell(send_created)="row">
                                    {{ formatDate(row.item.send_created) }}
                                </template>
                                <!-- Custom Header for Houseway Column -->
                                <template #head(houseway)>
                                    <div class="d-flex font-weight-bold">
                                        <div class="w-25">House No.</div>
                                        <div class="w-25">Actions</div>
                                        <div class="w-25">Place</div>
                                        <div class="w-25">Date</div>
                                    </div>
                                </template>

                                <!-- Houseway Details in Same Row -->
                                <template #cell(houseway)="row">
                                    <div v-if="getHouseWayBills(row.item).length">
                                        <div v-for="(bill, i) in getHouseWayBills(row.item)" :key="i" class="d-flex py-1 house-row border-bottom">
                                            <div class="w-25">{{ bill.id }}</div>
                                            <div class="w-25">
                                                <b-icon icon="pencil" class="text-primary mr-2" style="cursor: pointer" @click="$router.push('/edit-houseway-bill/' + bill.id)"/>
                                                <b-icon icon="trash" class="text-danger" style="cursor: pointer" @click="handleDeleteHouseBill(bill.id)"/>
                                            </div>
                                            <div class="w-25">
                                            {{ getAirportCode(bill.destination_airport) }}
                                            </div>
                                            <div class="w-25">
                                            {{ formatDate(bill.created_at) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex font-weight-bold waybill-status-header">
                                        <div class="w-25">FNA and FMAs</div>
                                        <div class="w-25" style="text-align: center;">Date</div>
                                    </div>
                                    <div v-for="(status,i) in data_items.status_reponse">
                                        <hr>
                                        <div class="d-flex font-weight-bold justify-content-between">
                                            <div style="margin-left: 5px; margin-right: 5px;">{{i+1}}. {{status.business_status_code}}</div>
                                            <div style="margin-left: 5px; margin-right: 5px;">{{ formatDate(status.created_at) }}</div>
                                        </div>
                                        <div v-if="status.reason">
                                           <p>{{status.condition_code}}: {{status.reason}}</p>
                                        </div>
                                        <hr>
                                    </div>
                                </template>
                                </b-table>
                            <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="mt-3 custom-pagination"></b-pagination>
                        </b-card>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>

import SideBar from "../layout/SideBar.vue";
import ApiService from "@/core/services/api.service";
import { mapGetters } from "vuex";
// import PageLoader from '../components/PageLoader.vue';

export default {
    data() {
        return {
            form: new Form({
                masterStart: "",
                masterEnd: "",
            }),
            filter: "",
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            pageOptions: [10, 20, 50, 100],
            data_items: [],
            house_way_bills: {},
            filteredData: [],
            isSearchValid: false,
            searchPerformed: false,
            consolidation: [],
            existingData: {},
            errorMessage: '',
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
        getHouseWayBills(item) {
            if (!item.awb_code || !item.awb_no) return [];
            const key = `${String(item.awb_code)}-${String(item.awb_no)}`;
            if (!this.house_way_bills[key]) {
                ApiService.get(
                    `/user/house-way-bills/${String(item.awb_code)}/${String(item.awb_no)}`
                )
                    .then((response) => {
                        this.$set(this.house_way_bills, key, response.data);
                    })
                    .catch((error) => {
                        console.error(
                            "Failed to fetch house way bills:",
                            error
                        );
                        this.$set(this.house_way_bills, key, []);
                    });
                return [];
            }
            return this.house_way_bills[key];
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
                        console.error(
                            "Failed to delete house way bill:",
                            error
                        );
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
        // PageLoader
    },
};
</script>
<style scoped>
.custom-table {
    /* background-color: #f8fcff; */
    /* border-radius: 8px; */
    width: 100%;
}

.nested-table {
    margin-top: -12px;
    margin-bottom: -10px;
    border-top: none;
}

.table td,
.table th {
    vertical-align: middle;
}
[class^="only-first-header-"] thead {
    display: none;
}

.only-first-header-0 thead {
    display: table-header-group;
}
.custom-table th:nth-child(1),
.custom-table td:nth-child(1) {
    width: 40px;
    text-align: center;
}

.custom-table th:nth-child(2),
.custom-table td:nth-child(2) {
    width: 120px;
}
.body-color {
}
.custom-table >>> thead {
    background-color: rgb(242, 249, 255);
}
.custom-table {
    border-left: none !important;
    border-right: none !important;
}
.house-row {
    border-bottom: 1px solid #dee2e6;
}
.custom-pagination .page-link {
    background-color: rgb(242, 249, 255) !important;
    color: #000;
    border-color: #dee2e6;
}
.page-item.active .page-link {
    z-index: 3;
    color: #ffffff;
    background-color: rgb(38, 55, 168) !important;
    border-color: rgb(38, 55, 168);
}
</style>
