<template>
    <div class="body-color">
        <div class="container-fluid">
            <!-- Include Page Loader -->
             <!-- <PageLoader></PageLoader> -->
            <!-- Include Header -->
            <Header></Header>
            <div class="d-flex">
                <SideBar></SideBar>
                <div style="background-color: #fff; box-shadow: 3px 3px 10px #d0d0d0;z-index: 1;border-radius: 30px;">
                    <div class="container">
                        <b-card-title class="title_color mt-9"> Search </b-card-title>
                        <hr class="hr" />
                        <b-card-text class="border_rounded">
                            <div class="mr-8">
                                <b-row class="my-8">
                                    <b-col cols="5">
                                        <div>
                                            <div class="d-flex">
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                    label-for="input-horizontal" class="form-control-sm align-items-center">
                                                    <template #label>
                                                        <span>Master No:</span>
                                                        <span style="color: red">*</span>
                                                    </template>
                                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 50px" v-model="searchForm.awb_code" maxlength="3" @input="validateAwbCode"></b-form-input>
                                                </b-form-group>
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class="form-control-sm align-items-center">
                                                    <template #label>
                                                        <span>-</span>
                                                    </template>
                                                    <b-form-input v-model="searchForm.awb_no" maxlength="8" @input="validateAwbNo" id="input-horizontal" class="form-control-sm" style="width: 90px"></b-form-input>
                                                </b-form-group>
                                                <div class="mt-3">
                                                    <b-button :disabled="!isSearchValid" @click="searchAirwayBills" pill style="color: #2637a8; background: #ffffff !important; border: 1px solid #2637a8;padding: 6px 25px;">Search</b-button>
                                                </div>
                                            </div>
                                        </div>
                                    </b-col>
                                </b-row>
                            </div>

                            <div>
                                <div class="py-5">
                                    <div class="ml-3 mt-8">
                                        <div class="">
                                            <b-row>
                                                <b-col cols="12">
                                                    <table class="table table-sm" style="max-width:100%;">
                                                        <thead>
                                                            <tr style="background-color: #F2F9FF;">
                                                                <th style="width:30px !important;">Sl No.</th>
                                                                <th style="width: 100px !important;">AWB No.</th>
                                                                <th style="width: 100px;">Destination</th>
                                                                <th style="width: 120px;">Date & time</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(item, index) in data_items" :key="index" class="tr">
                                                                <td class="editable-cell align-items-center pt-4 " style="width:60px;">
                                                                    {{ index + 1 }}
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    <a :href="'/edit-airway-bill/' + item.id" class="custom-link" @click="getAirWayBill(item.id)">
                                                                        <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + item.id" custom>
                                                                            {{ item.awb_code }} {{ item.awb_no }}
                                                                        </router-link>
                                                                    </a>
                                                                   
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    {{ getAirportCode(item.destination_airport) }} 
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    {{ formatDate(item.updated_at) }}
                                                                </td>
                                                                <td style="margin-left: 10px;">
                                                                    <div style="width: 112%;">
                                                                        <table class="table table-sm" style="max-width:100%;">
                                                                            <thead v-if="index === 0">
                                                                                <tr style="background-color: #F2F9FF;overflow: hidden;">
                                                                                    <th style="width:400px !important;padding-left: 15px !important;">Houseway Bills</th>
                                                                                    <th style="width:130px !important;">&nbsp;&nbsp;&nbsp;</th>
                                                                                    <th style="width:150px !important;">Place </th>
                                                                                    <th style="width:130px !important;">Date</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr v-for="(houseBill, hIndex) in getHouseWayBills(item)" :key="hIndex" style="padding-left: 10px !important;" class="tr">
                                                                                    <td class="editable-cell align-items-center px-4 " style="width:60px;">
                                                                                        <!-- 217 pieces CRC - Consignment reported to customs authorities -->
                                                                                        <!-- {{ houseBill.pieces }} pieces {{ houseBill.description }} -->
                                                                                        {{ houseBill.id }}
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        <div class="d-flex align-items-center">
                                                                                            <router-link :to="'/edit-houseway-bill/' + houseBill.id" custom v-slot="{ navigate }">
                                                                                                <b-icon 
                                                                                                    icon="pencil" 
                                                                                                    aria-hidden="true" 
                                                                                                    style="color: #355594 !important; cursor: pointer; margin-right: 10px;"
                                                                                                    @click="navigate"
                                                                                                ></b-icon>
                                                                                            </router-link>
                                                                                            <b-icon 
                                                                                                icon="trash" 
                                                                                                aria-hidden="true" 
                                                                                                style="color: #355594 !important; cursor: pointer;"
                                                                                                @click="handleDeleteHouseBill(houseBill.id)"
                                                                                            ></b-icon>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        <!-- {{ houseBill.destination_airport }} -->
                                                                                        {{ getAirportCode(houseBill.destination_airport) }} 
                                                                                        <b-icon icon="flag-fill" aria-hidden="true"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        {{ formatDate(houseBill.created_at) }}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </b-card-text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Header from "../layout/Header.vue";
import SideBar from "../layout/SideBar.vue";
import ApiService from "@/core/services/api.service";
import { mapGetters } from "vuex";
// import PageLoader from '../components/PageLoader.vue';
export default {
    data() {
        return {
            data_items: [],
            house_way_bills: {},
            // searchForm: new Form({ 
            //     awb_code: '',
            //     awb_no: ''
            // }),
            searchForm: { 
                awb_code: '',
                awb_no: ''
            },
            isSearchValid: false,
            searchPerformed: false,
            consolidation: [],
            existingData: {},
        }
    },

    methods: {
        getHouseWayBills(item) {
            if (!item.awb_code || !item.awb_no) return [];
            const key = `${item.awb_code}-${item.awb_no}`;
            if (!this.house_way_bills[key]) {
                ApiService.get(`/user/house-way-bills/${item.awb_code}/${item.awb_no}`)
                    .then(response => {
                        this.$set(this.house_way_bills, key, response.data);
                    })
                    .catch(error => {
                        console.error("Failed to fetch house way bills:", error);
                        this.$set(this.house_way_bills, key, []);
                    });
                return [];
            }
            return this.house_way_bills[key];
        },
        getHouseWayBill(id) { 
            ApiService.get(`/user/houseway-bill/${id}`)
                .then(response => {
                    this.existingData = response.data;
                    this.openForm('update', this.existingData.id);
                    if (this.existingData && this.existingData.consignment_data) {
                        this.isConsignmentAdded = true;
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).replace(',', '');
        },
        getAirportCode(airport) {
            if (!airport) return '';
            return airport.split(',')[0].trim();
        },
        validateAwbCode(value) {
        this.searchForm.awb_code = value.replace(/[^0-9]/g, '').slice(0, 3);
        this.validateSearch();
    },

    validateAwbNo(value) {
        this.searchForm.awb_no = value.replace(/[^0-9]/g, '').slice(0, 8);
        this.validateSearch();
    },

    validateSearch() {
        this.isSearchValid = this.searchForm.awb_code.length === 3 && this.searchForm.awb_no.length === 8;
    },

    searchAirwayBills() {
        if (!this.isSearchValid) return;
        this.searchPerformed = true;
        ApiService.get(`/user/all-airway-bill?awb_code=${this.searchForm.awb_code}&awb_no=${this.searchForm.awb_no}`)
        
        .then(response => {
            this.data_items = response.data;
            this.house_way_bills = {};
        })
        .catch(error => {
            console.error("Failed to fetch items:", error);
            this.data_items = [];
        });
    },

    // Add clear search method
    searchWayBills() {
        if (!this.isSearchValid) return;
        
        this.searchPerformed = true;
        ApiService.get('/user/all-airway-bill', {
            params: {
                awb_code: this.searchForm.awb_code,
                awb_no: this.searchForm.awb_no
            }
        })
        .then(response => {
            this.data_items = response.data;
            // this.house_way_bills = {};  // Clear cached house way bills
            
            if (response.data.length === 0) {
                const id = `${this.searchForm.awb_code}${this.searchForm.awb_no}`;
                this.getAirWayBill(id);
                this.hasSearchResults = true;
            } else {
                this.hasSearchResults = false;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            this.data_items = [];
            this.hasSearchResults = false;
        });
    },
    clearSearch() {
        this.searchForm.awb_code = '';
        this.searchForm.awb_no = '';
        this.searchPerformed = false;
        this.isSearchValid = false;
        this.allAirwayBill();
    },

    // Update allAirwayBill method
    allAirwayBill() {
        // if (this.searchPerformed) return; 
        ApiService.get('/user/all-airway-bill')
            .then(response => {
                this.data_items = response.data;
                // this.house_way_bills = {};
            })
            .catch(error => {
                console.error("Failed to fetch items:", error);
                this.data_items = [];
            });
    },
        getAirWayBill(id) { 
            ApiService.get(`/user/airway-bill/${id}`)
                .then(response => {
                    if (response.data && response.data.id == id) {
                        this.existingData = response.data;
                    } else {
                       console.log("something went wrong");
                    }
                })
                .catch(error => {
                    this.existingData = null;
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        handleDeleteHouseBill(id) {
        if (confirm('Are you sure you want to delete this house way bill?')) {
            ApiService.delete(`/user/house-way-bills/${id}`)
                .then(() => {
                    // Clear the cached house way bills
                    this.house_way_bills = {};
                    // Refresh the data
                    this.allAirwayBill();
                })
                .catch(error => {
                    console.error("Failed to delete house way bill:", error);
                });
        }
    }
    },
    mounted() {
        this.allAirwayBill(); 
    },
    watch: {
        '$route.params.id'(newId) {
            if (newId) {
                this.getAirWayBill(newId);
            }
        },
        '$route.params.id'(newId) {
            if (newId) {
                this.getHouseWayBill(newId);
            }
        },
    },
    created() {
        // this.allAirwayBill();
    },
    computed: {
        ...mapGetters({ current_user: "currentUser"}), 
    },
    components: {
        Header,
        SideBar,
        // PageLoader
    }
}
</script>
<style scoped>
.body-color {
    background: linear-gradient(180deg, #D0E6F8 8%, #FFFFFF 20%);
}
.border_rounded {
    border-radius: 30px !important;
}
.title_color {
    color: #355594;
    font-size: 30px;
    font-weight: 500;
}
.card-title {
    margin-bottom: 5px;
}
.hr {
    border-top: 2px solid #CDCDCD;
}
.vr{
    display: inline-block;
    align-self: stretch;
    width: 1px;
    min-height: 1em;
    background-color: #CDCDCD;
    margin-right: 10px;
}
.tr {
    padding-bottom: 2.75rem !important;
    vertical-align: top;
    border-bottom: 2px solid #EBEDF3;
}
.tr-padding {
    padding-top: 10px;
}
.table thead th, .table thead td {
    font-weight: 600;
    font-size: 1rem;
    /* border-bottom-width: 1px; */
    /* padding-top: 1rem; */
    /* padding-bottom: 1rem; */
    height: 10px !important;
}

.table thead th, .table thead td {
    font-weight: 600;
    font-size: 1rem;
    border-bottom-width: 1px;
    /* padding-top: 1rem; */
    /* padding-bottom: 1rem; */
}
</style>
