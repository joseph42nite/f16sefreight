<template>
    <div class="main-page w-100">
        <div class="search-area" style="margin-top: 2%;background-color: rgba(213, 179, 176, 0.2);">
            <div class="text-center">
                <img src="/media/custome/FocusAkash.png" alt="aakash logo" width="350" height="50" class="img-fluid mb-5"/>
                <!-- <a href="javascript:void(0)" @click="report_popup=true">Report here</a> -->
            </div>
            <div class="row mt-3 fw-600">
                <div class="col-12 col-md-3">
                    <label for="dist_form">Origin</label>
                    <input type="text" v-model="search_form.from" placeholder="Search source" class="form-control" readonly style="background: lightgrey;">
                    <!-- <div class="custom-dropdown" ref="dropdownContainer_from" @click="toggleDropdown_from">
                        <input type="text" v-model="searchQuery_from" placeholder="Search source" id="from_id" class="form-control">
                        <div v-if="isDropdownOpen_from" class="dropdown-options">
                            <div v-for="(item, index) in filteredLocations_from" :key="index" @click="selectOption_from(item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
                        </div>
                    </div> -->
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">Destination</label>
                    <div class="custom-dropdown" ref="dropdownContainer_to" @click="toggleDropdown_to">
                        <input type="text" v-model="searchQuery_to" placeholder="Search destination" id="from_id" class="form-control" autocomplete="off">
                        <div v-if="isDropdownOpen_to" class="dropdown-options">
                            <div v-for="(item, index) in filteredLocations_to" :key="index" @click="selectOption_to(item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">Weight in Kgs</label>
                    <input type="text" @keyup="isNumber()" class="form-control" placeholder="Enter quantity"
                        v-model="search_form.quantity" :readonly="search_form.selected_quantity != 'custom'" />
                    <span class="err_cls" id="quantity_msg"></span>
                </div>
                <div class="col-12 col-md-2">
                    <label for="dist_form">Slab</label>
                    <select name="" id="selected_quantity_1" class="form-control" v-model="search_form.selected_quantity"
                        @change="check_rate_type()">
                        <option value="custom">Custom</option>
                        <option value="Minimum">Minimum</option>
                        <option value="Normal">Normal</option>
                        <option value="all">All Rate</option>
                    </select>
                </div>
                <div class="col-12 col-md-1 mt-7 text-center">
                    <button class="btn btn1" @click="get_rate()" id="rate_id">Rates</button>
                </div>
            </div>
            <div class="mt-4">
                <div class="all_cs" v-if="!is_all_rate">
                    <input type="checkbox" style="width: 15px;" v-model="is_allin_check"/>&nbsp;&nbsp;<label style="margin-top: 3px; font-weight: 600;">Overseas/ALLIN</label>
                    <div style="margin-left: 3%;">
                        <input type="number" style="width: 40%; height: 100%;" v-model="allin_amount" :readonly="!is_allin_check"/>
                        <select name="profit_type" id="profit_type" style="height: 100%;" class="mx-3" v-model="selected_currency" @change="get_allin_amount()">
                            <option v-for="(item, index) in currency_rate" :key="index" :value="item.currency">{{item.currency}} (<span>{{item.rate}}</span>)</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- display area code -->
            <div class="row" style="margin-top: 2%">
                <div :class="is_all_rate ? 'col-12 col-md-12 rate_area' : 'col-12 col-md-9 rate_area'
                    ">
                    <div class="rate-area mr-1" style="padding: 0px 3% 3% 3%;">
                        <div class="sticky-div">
                            <div style="justify-content: space-between; display: flex; white-space: nowrap;">
                                <div class="d-flex">
                                    <input type="number" v-model="extra_comission" placeholder="Enter profit in INR" style="width: 40%;" v-if="!is_all_rate" />
                                    <select name="profit_type" id="profit_type" class="mx-3" v-model="profit_type" @change="extra_comission = 0; last_extra_comission = 0; final_extra_comission = 0; get_rate();" v-if="!is_all_rate">
                                        <option value="total">Total</option>
                                        <option value="per_kg">Per kg</option>
                                    </select>
                                    <span @click="extraComission()" class="copy-cls-css" v-if="!is_all_rate" style="background: #c0392b; padding: 5px 5px;">Add profit</span>
                                </div>
                                <span @click="copyToClipboard()" class="copy-cls copy-cls-css" v-if="!is_all_rate" style="background: #487eb0; padding: 5px 15px;">Export</span>
                            </div>
                            <vue-excel-xlsx :data="items" :columns="fields" :file-name="'rate'" :file-type="'xlsx'"
                                :sheet-name="'rate'" v-if="is_all_rate">
                                <span class="font-weight-bold text-dark" style="padding: 5px; ">Export Rate</span>
                            </vue-excel-xlsx>
                        </div>
                            <b-table :bordered="true" responsive :items="items" :fields="fields" style="white-space: nowrap"
                                primary-key="id" :filter="filter" :current-page="currentPage" :per-page="perPage"
                                @filtered="onFiltered" v-if="is_all_rate">
                            </b-table>
                            <table class="table mt-2" v-else>
                                <thead>
                                    <tr style="white-space: nowrap;">
                                        <th>#</th>
                                        <th>Airline</th>
                                        <th>Product Type</th>
                                        <th>Slab</th>
                                        <th>Price</th>
                                        <th>Added Profit</th>
                                        <th>Offline/Online</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(rate, index) in rate_data" :key="index" :class="{ 'selected-row': selectedRows.includes(index) }" v-if="rate.my_rate[Object.keys(rate.my_rate)[0]]">
                                        <td>
                                            <input type="checkbox" @change="selcted_column(index,rate.carrier_code)" :id="'selected_' + index" />
                                        </td>
                                        <td> {{ rate.carrier_code +"(" + rate.carrier_prefix +")"}}</td>
                                        <td>{{ rate.product_name }}</td>
                                        <td>
                                            {{ Object.keys(rate.my_rate)[0] }}
                                        </td>
                                        <td>
                                            {{ rate.my_rate[Object.keys(rate.my_rate)[0]] }}
                                        </td>
                                        <td :style="{ color: selectedRows.includes(index) ? 'black' : '#ee5253', fontWeight: selectedRows.includes(index) ? '700' : 'normal' }">
                                            {{ rate.my_rate_2[Object.keys(rate.my_rate_2)[0]] }}
                                        </td>
                                        <td>{{rate.online_offline}}</td>
                                    </tr>
                                    <tr v-if="is_rate_available" style="text-align: center;"><td colspan="6">No data available</td></tr>
                                </tbody>
                            </table>
                    </div>
                </div>
                <div class="col-12 col-md-3 rate_area" v-if="!is_all_rate">
                    <div class="rate-area ml-1" style="padding: 3%;">
                        <div>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">FSC :</span> {{ ams_arr.fsc }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">SCC :</span> {{ ams_arr.scc }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">XRAY :</span> {{ ams_arr.xray }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">MISC :</span> {{ ams_arr.misc }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">CTG :</span> {{ ams_arr.ctg }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">AWB FEE :</span> {{ ams_arr.awb_fee }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">MAWB :</span> {{ ams_arr.mawb }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">HAWB :</span> {{ ams_arr.hawb }}</span>
                            <span class="d-flex"><span class="d-block" style="width:80px; font-weight: 700;">DG FEE :</span> {{ ams_arr.dg_fee }}</span>
                        </div>
                        <hr>
                        <div v-if="user_notice">
                            <h3 class="mr-3 text-center" style="color: #cf5244ff;">Notification</h3>
                            <h5 v-html="user_notice"></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal id="login-modal" v-model="report_popup" :hide-footer="true">
            <div class="w-100">
                <div class="form-group">
                    <label for="report_title">Report title</label>
                    <input type="text" id="report_title" v-model="report_arr.title" class="form-control">
                </div>
                <div class="form-group">
                    <label for="report_description">Report description</label>
                    <textarea name="report_description" id="report_description" cols="30" rows="3" v-model="report_arr.description" class="form-control"></textarea>
                </div>
                <div class="text-center">
                    <button class="btn font-weight-bolder py-3 btn1" @click="submit_report()">Submit</button>
                </div>
            </div>
        </b-modal>
        <div id="whatsapp-float">
            <a :href="'//api.whatsapp.com/send?phone=918660320019&text=Name: ' + current_user.name + '%0AEmail: ' + current_user.email + '%0AType your message:%0A'" target="_blank" rel="noopener noreferrer">
                <img src="media/custome/w4.png" alt="WhatsApp">
            </a>
        </div>    
    </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from "vuex";
export default {
    name: "Rate",
    data() {
        return {
            search_form: new Form({
                from: null,
                to: "",
                selected_quantity: "custom",
                quantity: "",
            }),
            rate_data: "",
            rate_data_copy: {},
            location: [],
            extra_comission: "",
            last_extra_comission: "",
            profit_type: "total",
            is_all_rate: false,
            all_user_notice: [],
            user_notice:'',
            report_popup:false,
            all_ams:[],
            all_ams_ek:{},
            all_ams_tg_cx:{},
            ams_arr:{
                fsc:'',
                scc:'',
                xray:'',
                misc:'',
                ctg:'',
                awb_fee:'',
                mawb:'',
                hawb:'',
                dg_fee:'',
            },
            fields: [
                { label: "Sl", key: "index", field: "index" },
                { label: "Airline", key: "carrier_code", field: "carrier_code" },
                { label: "Product Type", key: "product_name", field: "product_name" },
            ],
            report_arr:new Form({
                title:'',
                description:'',
            }),
            //exception
            searched_country_code:'',
            searched_region:'',
            items: [],
            is_rate_available:true,
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],

            searchQuery_from: '',
            isDropdownOpen_from: false,
            searchQuery_to: '',
            isDropdownOpen_to: false,
            selectedRows: [],

            currency_rate:[],
            is_allin_check: false,
            allin_amount:1.00,
            selected_currency:'INR',
        };
    },
    methods: {
        get_allin_amount(){
            for(let i=0;i<4;i++){
                if(this.currency_rate[i]['currency']==this.selected_currency)
                {
                    this.allin_amount=this.currency_rate[i]['rate'];
                    break;
                }
            }
        },
        toggleDropdown_from() {
            this.isDropdownOpen_from = !this.isDropdownOpen_from;
        },
        selectOption_from(item) {
            this.search_form.from = item.iata_code;
            let source_name= item.destination;
            let final_set=this.search_form.from+"("+source_name+")";
            this.searchQuery_from=final_set;
        },
        closeDropdown_from(event) {
            const dropdownContainer_from = this.$refs.dropdownContainer_from;
            if (!dropdownContainer_from.contains(event.target)) {
                this.isDropdownOpen_from = false;
            }
        },

        toggleDropdown_to() {
            this.isDropdownOpen_to = !this.isDropdownOpen_to;
        },
        selectOption_to(item) {
            this.search_form.to = item.iata_code;
            let source_name= item.destination;
            let final_set=this.search_form.to+"("+source_name+")";
            this.searchQuery_to=final_set;
        },
        closeDropdown_to(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_to;
            if (!dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_to = false;
            }
        },

        submit_report(){
            this.report_arr.post(`/user/report`).then(({ data }) => {
                this.report_popup=false;
                this.report_arr.title="";
                this.report_arr.description="";
                alert("report submited successfull. Thank you");
            });
        },
        isNumber() {
            if (isNaN(this.search_form.quantity)) {
                $("#quantity_msg").html("Select Weight type Normal/Minimum");
                $("#selected_quantity_1").css("border", "1px solid #c0392b");
                this.search_form.quantity = "";
            } else {
                $("#quantity_msg").html("");
                $("#selected_quantity_1").css("border", "none");
            }
        },
        get_notice() {
            ApiService.get(`/user/get-notice`).then(({ data }) => {
                for(let i=0;i<data.length;i++){
                    this.all_user_notice[data[i].carrier_code]={};
                    this.all_user_notice[data[i].carrier_code]=data[i];
                }
            });
        },
        get_asm(origin) {
            ApiService.get(`/user/get-ams/${origin}`).then(({ data }) => {
                for(let i=0;i<data.length;i++){
                    this.all_ams[data[i].carrier_code]={};
                    if(data[i].carrier_code=='EK'){
                        this.all_ams_ek[data[i].country_code]=data[i];
                    }
                    else if(data[i].carrier_code=='TG' || data[i].carrier_code=='CX'){
                        let key="";
                        if(data[i].dest_airport_code)
                         key=data[i].dest_airport_code+"_"+data[i].carrier_code;
                        else if(data[i].country_code)
                         key=data[i].country_code+"_"+data[i].carrier_code;
                        else if(data[i].region)
                         key=data[i].region+"_"+data[i].carrier_code;

                        this.all_ams_tg_cx[key]=data[i];  
                    }
                    else{
                        this.all_ams[data[i].carrier_code]=data[i];
                    }
                }
            });
        },
        get_rate() {
            $('#rate_id').html("Loading..");
            //reset ams value
            this.ams_arr.fsc='';
            this.ams_arr.scc='';
            this.ams_arr.xray='';
            this.ams_arr.misc='';
            this.ams_arr.ctg='';
            this.ams_arr.awb_fee='';
            this.ams_arr.mawb='';
            this.ams_arr.hawb='';
            this.ams_arr.dg_fee='';
            // end reset ams value
            this.rate_data = "";
            this.selectedRows=[];
            let rate_data_loop = [];
            let items_loop = [];
            let rate_index = 3;
            this.search_form.post(`/user/get-rate`)
                .then(({ data }) => {
                    $('#rate_id').html("Rates");
                    $(".copy-cls").html("Export");
                    this.searched_country_code=data.country_code;
                    this.searched_region=data.region;

                    //for check if data will get on the basis of dist_airport_code are else take it on zone basis
                    let data_dublicate=data.rates;
                    data=[];
                    let carrier_product=[];
                    for(let d=0;d<data_dublicate.length;d++){
                        if(data_dublicate[d].dest_airport_code){
                            data.push(data_dublicate[d]);
                            const p_t=data_dublicate[d].carrier_code + "__" + data_dublicate[d].product_name;
                            carrier_product.push(p_t);
                            data_dublicate.splice(d, 1);
                            d--;
                        }
                    }
                    for(let d1=0;d1<data_dublicate.length;d1++){
                        const p_t=data_dublicate[d1].carrier_code + "__" + data_dublicate[d1].product_name;
                        if (!carrier_product.includes(p_t)) {
                            data.push(data_dublicate[d1]);
                        }
                    }
                    //end for check if data will get on the basis of dist_airport_code are else take it on zone basis

                    if (this.is_all_rate) {
                        for (let i = 0; i < data.length; i++) {
                            items_loop[i] = {};
                            rate_data_loop[i] = {};
                            rate_data_loop[i] = JSON.parse(data[i].rate_range);
                            if (i == 0) {
                                for (let key in rate_data_loop[i]) {
                                    this.fields[rate_index] = {};
                                    this.fields[rate_index]["key"] = key;
                                    this.fields[rate_index]["field"] = key;
                                    this.fields[rate_index]["label"] = key;
                                    rate_index++;
                                }
                            }
                            rate_data_loop[i]["index"] = i;
                            rate_data_loop[i]["carrier_code"] =
                                data[i].carrier_code;
                            rate_data_loop[i]["carrier_prefix"] =
                                data[i].carrier_prefix;
                            rate_data_loop[i]["product_name"] =
                                data[i].product_name;
                            items_loop[i] = rate_data_loop[i];
                        }
                        this.items = items_loop;
                    } else {
                        if(data.length){
                            this.is_rate_available=false;
                            for (let i = 0; i < data.length; i++) {
                                let arr_data = data[i].rate_range;
                                let rate_data = JSON.parse(arr_data, true);
                                data[i]["my_rate"] = {};
                                data[i]["my_rate_2"] = {};
                                if (this.search_form.selected_quantity == "Minimum") {
                                    data[i]["my_rate"]["Minimum"] =rate_data["Minimum"];
                                } else if (this.search_form.selected_quantity == "Normal") {
                                    data[i]["my_rate"]["Normal"] = rate_data["Normal"];
                                } else if ( this.search_form.selected_quantity == "custom") {
                                    let user_quantity = parseInt(this.search_form.quantity);
                                    let keys = Object.keys(rate_data);
                                    let is_first_quantity_get = 0;
                                    let first_quantity = 0;
                                    for (let j = 0; j < keys.length; j++) {
                                        if (keys[j] == "Minimum" ||keys[j] == "Normal") {
                                        } else {
                                            let from_key = parseInt(keys[j]);
                                            if (!is_first_quantity_get) {
                                                first_quantity = from_key;
                                                is_first_quantity_get = 1;
                                            }

                                            let to_key = 1000000;
                                            if (j + 1 < keys.length)
                                                to_key = parseInt(keys[j + 1]);

                                            if (user_quantity >= from_key && user_quantity < to_key) {
                                                let rate_key = keys[j];
                                                data[i]["my_rate"][rate_key] = rate_data[rate_key];
                                                break;
                                            }
                                            if (user_quantity < first_quantity) {
                                                data[i]["my_rate"]["Normal"] = rate_data["Normal"];
                                                break;
                                            }
                                        }
                                    }
                                }
                                data[i]["my_rate_2"] = JSON.parse(JSON.stringify(data[i]['my_rate']));
                            }
                        }    
                        else{
                            this.is_rate_available=true;
                        }
                        this.rate_data = data;
                    }
                })
                .catch((err) => { });
        },
        getValueBeforeSlash(str) {
            const indexOfSlash = str.indexOf('/');
            if (indexOfSlash !== -1) {
                return str.substring(0, indexOfSlash);
            } else {
                return 0;
            }
        },
        copyToClipboard() {
            if(confirm("The rates provided are in accordance with the current tariff. For system rates, please contact the respective airlines directly. Should there be any changes in other charges, kindly click on “WhatsApp” button to resolve the issue at the earliest. Always do manual checking before quoting to clients.")){
                let clip_arr = [];
                let arr_len = Object.entries(this.rate_data_copy).length;
                let carrier_code='';
                let index_count=1;
                if (arr_len) {
                    for (let i in this.rate_data_copy) {
                        let currentData = {};
                        carrier_code=this.rate_data_copy[i].carrier_code;
                        let all_subcharge_amount=0;
                        let all_ams_amount=0;
                        let final_added_profit=0;
                        let dg_fee='';
                        // currentData.Sl = index_count;
                        // currentData.Airline = ``;
                        // currentData.ProductType = this.rate_data_copy[i].product_name;
                        // currentData.Quantity = `${Object.keys(this.rate_data_copy[i].my_rate)[0]}`;
                        if(this.is_allin_check){
                            currentData.Price = `${index_count}. ${carrier_code}(${this.rate_data_copy[i].carrier_prefix}):`;
                            final_added_profit=parseFloat(this.rate_data_copy[i].my_rate_2[Object.keys(this.rate_data_copy[i].my_rate_2)[0]]);
                        }
                        else
                          currentData.Price = `${index_count}. ${carrier_code}(${this.rate_data_copy[i].carrier_prefix}): ${this.rate_data_copy[i].my_rate_2[Object.keys(this.rate_data_copy[i].my_rate_2)[0]]}++, Surcharges: `;
                        if(carrier_code=='EK'){
                            if(this.all_ams_ek[this.searched_country_code]){
                                if(this.all_ams_ek[this.searched_country_code].fsc){
                                    if(this.is_allin_check)
                                       all_subcharge_amount+=parseFloat(this.all_ams_ek[this.searched_country_code].fsc);
                                    else
                                      currentData.Price+=`${this.all_ams_ek[this.searched_country_code].fsc} (FSC) +`;     
                                }
                                if(this.all_ams_ek[this.searched_country_code].misc){
                                    if(this.is_allin_check)
                                       all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].misc));
                                    else
                                       currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].misc} (MISC) +`; 
                                }
                                if(this.all_ams_ek[this.searched_country_code].xray){
                                    if(this.is_allin_check)
                                       all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].xray));
                                    else
                                        currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].xray} (XRAY) +`;
                                } 
                                if(this.all_ams_ek[this.searched_country_code].scc){
                                    if(this.is_allin_check)
                                       all_subcharge_amount+=parseFloat(this.all_ams_ek[this.searched_country_code].scc);
                                    else
                                       currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].scc} (SCC) +`;
                                }
                                if(this.all_ams_ek[this.searched_country_code].ctg){
                                    if(this.is_allin_check)
                                       all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].ctg));
                                    else
                                       currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].ctg} (CTG) +`;
                                }
                                if(this.all_ams_ek[this.searched_country_code].awb_fee){
                                    if(this.is_allin_check)
                                       all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].awb_fee));
                                    else
                                       currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].awb_fee} (AWB FEE) +`; 
                                }
                                if(!this.is_allin_check)
                                    currentData.Price+=`, AMS: `;
                                if(this.all_ams_ek[this.searched_country_code].mawb){
                                    if(this.is_allin_check)
                                       all_ams_amount+=parseFloat(this.all_ams_ek[this.searched_country_code].mawb);
                                    else
                                       currentData.Price+=`${this.all_ams_ek[this.searched_country_code].mawb} (MAWB) `;
                                }
                                if(this.all_ams_ek[this.searched_country_code].hawb){
                                    if(this.is_allin_check)
                                       all_ams_amount+=parseFloat(this.all_ams_ek[this.searched_country_code].hawb);
                                    else
                                    currentData.Price+=`+ ${this.all_ams_ek[this.searched_country_code].hawb} (HAWB)`;
                                }
                                if(this.all_ams_ek[this.searched_country_code].dg_fee){
                                    if(this.is_allin_check)
                                    dg_fee=this.all_ams_ek[this.searched_country_code].dg_fee;
                                    else
                                      currentData.Price+=`, DG FEE : ${this.all_ams_ek[this.searched_country_code].dg_fee}`;
                                    
                                }
                            } 
                        }
                        else if(carrier_code=='TG' || carrier_code=='CX'){
                            let key1=this.search_form.to+"_"+carrier_code;
                            let key2=this.searched_country_code+"_"+carrier_code;
                            let key3=this.searched_region+"_"+carrier_code;
                            let main_key="";
                            if(this.all_ams_tg_cx.hasOwnProperty(key1))
                            main_key=key1;
                            else if(this.all_ams_tg_cx.hasOwnProperty(key2))
                            main_key=key2;
                            else if(this.all_ams_tg_cx.hasOwnProperty(key3))
                            main_key=key3;
                            if(main_key){
                                if(this.all_ams_tg_cx[main_key]){
                                    if(this.all_ams_tg_cx[main_key].fsc){
                                        if(this.is_allin_check)
                                           all_subcharge_amount+=parseFloat(this.all_ams_tg_cx[main_key].fsc);
                                        else
                                            currentData.Price+=`${this.all_ams_tg_cx[main_key].fsc} (FSC) +`;
                                    }
                                    if(this.all_ams_tg_cx[main_key].misc){
                                        if(this.is_allin_check)
                                           all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].misc));
                                        else
                                    currentData.Price+=` ${this.all_ams_tg_cx[main_key].misc} (MISC) +`; 
                                    }
                                    if(this.all_ams_tg_cx[main_key].xray){
                                        if(this.is_allin_check)
                                           all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].xray));
                                        else
                                    currentData.Price+=` ${this.all_ams_tg_cx[main_key].xray} (XRAY) +`; 
                                    }
                                    if(this.all_ams_tg_cx[main_key].scc){
                                        if(this.is_allin_check)
                                           all_subcharge_amount+=parseFloat(this.all_ams_tg_cx[main_key].scc);
                                        else
                                    currentData.Price+=` ${this.all_ams_tg_cx[main_key].scc} (SCC) +`;
                                    }
                                    if(this.all_ams_tg_cx[main_key].ctg){
                                        if(this.is_allin_check)
                                           all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].ctg));
                                        else
                                    currentData.Price+=` ${this.all_ams_tg_cx[main_key].ctg} (CTG) +`;
                                    }
                                    if(this.all_ams_tg_cx[main_key].awb_fee){
                                        if(this.is_allin_check)
                                           all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].awb_fee));
                                        else
                                    currentData.Price+=` ${this.all_ams_tg_cx[main_key].awb_fee} (AWB FEE) +`; 
                                    }
                                    if(!this.is_allin_check)
                                      currentData.Price+=`, AMS: `;
                                    if(this.all_ams_tg_cx[main_key].mawb){
                                        if(this.is_allin_check)
                                           all_ams_amount+=parseFloat(this.all_ams_tg_cx[main_key].mawb);
                                        else
                                    currentData.Price+=`${this.all_ams_tg_cx[main_key].mawb} (MAWB) `;
                                    }
                                    if(this.all_ams_tg_cx[main_key].hawb){
                                        if(this.is_allin_check)
                                           all_ams_amount+=parseFloat(this.all_ams_tg_cx[main_key].hawb);
                                        else
                                    currentData.Price+=`+ ${this.all_ams_tg_cx[main_key].hawb} (HAWB)`;
                                    }
                                    if(this.all_ams_tg_cx[main_key].dg_fee){
                                        if(this.is_allin_check)
                                        dg_fee=this.all_ams_tg_cx[main_key].dg_fee;
                                        else
                                           currentData.Price+=`, DG FEE : ${this.all_ams_tg_cx[main_key].dg_fee}`;
                                        
                                    }
                                }
                            }
                        }
                        else{
                            if(this.all_ams[carrier_code]){
                                if(this.all_ams[carrier_code].fsc){
                                    if(this.is_allin_check)
                                    all_subcharge_amount+=parseFloat(this.all_ams[carrier_code].fsc);
                                    else
                                currentData.Price+=`${this.all_ams[carrier_code].fsc} (FSC) +`;
                                }
                                if(this.all_ams[carrier_code].misc){
                                    if(this.is_allin_check)
                                    all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].misc));
                                    else
                                currentData.Price+=` ${this.all_ams[carrier_code].misc} (MISC) +`; 
                                }
                                if(this.all_ams[carrier_code].xray){
                                    if(this.is_allin_check)
                                    all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].xray));
                                    else
                                currentData.Price+=` ${this.all_ams[carrier_code].xray} (XRAY) +`; 
                                }
                                if(this.all_ams[carrier_code].scc){
                                    if(this.is_allin_check)
                                    all_subcharge_amount+=parseFloat(this.all_ams[carrier_code].scc);
                                    else
                                currentData.Price+=` ${this.all_ams[carrier_code].scc} (SCC) +`;
                                }
                                if(this.all_ams[carrier_code].ctg){
                                    if(this.is_allin_check)
                                    all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].ctg));
                                    else
                                currentData.Price+=` ${this.all_ams[carrier_code].ctg} (CTG) +`;
                                }
                                if(this.all_ams[carrier_code].awb_fee){
                                    if(this.is_allin_check)
                                    all_subcharge_amount+=parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].awb_fee));
                                    else
                                currentData.Price+=` ${this.all_ams[carrier_code].awb_fee} (AWB FEE) +`; 
                                }
                                if(!this.is_allin_check)
                                  currentData.Price+=`, AMS: `;
                                if(this.all_ams[carrier_code].mawb){
                                    if(this.is_allin_check)
                                    all_ams_amount+=parseFloat(this.all_ams[carrier_code].mawb);
                                    else
                                currentData.Price+=`${this.all_ams[carrier_code].mawb} (MAWB) `;
                                }
                                if(this.all_ams[carrier_code].hawb){
                                    if(this.is_allin_check)
                                    all_ams_amount+=parseFloat(this.all_ams[carrier_code].hawb);
                                    else
                                currentData.Price+=`+ ${this.all_ams[carrier_code].hawb} (HAWB)`;
                                }
                                if(this.all_ams[carrier_code].dg_fee){
                                    if(this.is_allin_check)
                                    dg_fee=this.all_ams[carrier_code].dg_fee;
                                else
                                      currentData.Price+=`, DG FEE : ${this.all_ams[carrier_code].dg_fee}`;
                                      
                                }
                            }
                        }
                        if(this.is_allin_check){
                            if(!all_subcharge_amount)
                              all_subcharge_amount=0;
                            if(!all_ams_amount)
                              all_ams_amount=0;  
                              currentData.Price+=`${this.selected_currency} ${((all_subcharge_amount+final_added_profit)/this.allin_amount).toFixed(2)}/kg ALLIN, AMS: ${this.selected_currency} ${(all_ams_amount/this.allin_amount).toFixed(2)} ALLIN ( MAWB + 1 HAWB )`;
                            if(dg_fee)
                               currentData.Price+=`, DG FEE : ${dg_fee}`;
                               
                        }
                        else{
                            currentData.Price = currentData.Price.replace(' +, AMS:', ', AMS:');
                            currentData.Price = currentData.Price.replace('+, AMS:', ', AMS:');
                            currentData.Price = currentData.Price.replace('AMS: +', 'AMS:');
                            currentData.Price = currentData.Price.replace('  ', ' ');    
                        }    
                        clip_arr.push(currentData);
                        index_count++;
                    }
                    const headers = Object.keys(clip_arr[0]);
                    const headerRow = headers.join("\t\t\t");
                    const dataRows = clip_arr
                        .map((row) => Object.values(row).join("\t\t"))
                        .join("\n\n");
                    const tableText = `${dataRows}`;   //${headerRow}\n\n   removed header

                    const textarea = document.createElement("textarea");
                    textarea.value = tableText;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    $(".copy-cls").html("Exported");
                } else {
                    alert("Select data for Export");
                }
            }   
        },
        selcted_column(index,carrier_code) {
            const checkbox = $(`#selected_${index}`);
            const isChecked = checkbox.prop("checked");
            if (isChecked) 
              this.rate_data_copy[index] = this.rate_data[index];
            else 
              delete this.rate_data_copy[index];

            if (this.selectedRows.includes(index)) {
                const idx = this.selectedRows.indexOf(index);
                this.selectedRows.splice(idx, 1);
            } else {
                this.selectedRows.push(index);
            }  

            this.ams_arr.fsc="";
            this.ams_arr.scc="";
            this.ams_arr.xray="";
            this.ams_arr.misc="";
            this.ams_arr.ctg="";
            this.ams_arr.awb_fee="";
            this.ams_arr.mawb="";
            this.ams_arr.hawb="";
            this.ams_arr.dg_fee="";
            if(carrier_code=='EK'){
                if(this.all_ams_ek.hasOwnProperty(this.searched_country_code)){
                    if(this.all_ams_ek[this.searched_country_code].fsc)  
                    this.ams_arr.fsc=this.all_ams_ek[this.searched_country_code].fsc;
                    if(this.all_ams_ek[this.searched_country_code].scc)
                    this.ams_arr.scc=this.all_ams_ek[this.searched_country_code].scc;
                    if(this.all_ams_ek[this.searched_country_code].xray)
                    this.ams_arr.xray=this.all_ams_ek[this.searched_country_code].xray;
                    if(this.all_ams_ek[this.searched_country_code].misc)
                    this.ams_arr.misc=this.all_ams_ek[this.searched_country_code].misc;
                    if(this.all_ams_ek[this.searched_country_code].ctg)
                    this.ams_arr.ctg=this.all_ams_ek[this.searched_country_code].ctg;
                    if(this.all_ams_ek[this.searched_country_code].awb_fee)
                    this.ams_arr.awb_fee=this.all_ams_ek[this.searched_country_code].awb_fee;
                    if(this.all_ams_ek[this.searched_country_code].mawb)
                    this.ams_arr.mawb=this.all_ams_ek[this.searched_country_code].mawb;
                    if(this.all_ams_ek[this.searched_country_code].hawb)
                    this.ams_arr.hawb=this.all_ams_ek[this.searched_country_code].hawb;
                    if(this.all_ams_ek[this.searched_country_code].dg_fee)
                    this.ams_arr.dg_fee=this.all_ams_ek[this.searched_country_code].dg_fee;
                }    
            }
            else if(carrier_code=='TG' || carrier_code=='CX'){
                let key1=this.search_form.to+"_"+carrier_code;
                let key2=this.searched_country_code+"_"+carrier_code;
                let key3=this.searched_region+"_"+carrier_code;
                let main_key="";
                if(this.all_ams_tg_cx.hasOwnProperty(key1))
                 main_key=key1;
                else if(this.all_ams_tg_cx.hasOwnProperty(key2))
                  main_key=key2;
                else if(this.all_ams_tg_cx.hasOwnProperty(key3))
                  main_key=key3;
                if(main_key){
                    if(this.all_ams_tg_cx[main_key].fsc)  
                    this.ams_arr.fsc=this.all_ams_tg_cx[main_key].fsc;
                    if(this.all_ams_tg_cx[main_key].scc)
                    this.ams_arr.scc=this.all_ams_tg_cx[main_key].scc;
                    if(this.all_ams_tg_cx[main_key].xray)
                    this.ams_arr.xray=this.all_ams_tg_cx[main_key].xray;
                    if(this.all_ams_tg_cx[main_key].misc)
                    this.ams_arr.misc=this.all_ams_tg_cx[main_key].misc;
                    if(this.all_ams_tg_cx[main_key].ctg)
                    this.ams_arr.ctg=this.all_ams_tg_cx[main_key].ctg;
                    if(this.all_ams_tg_cx[main_key].awb_fee)
                    this.ams_arr.awb_fee=this.all_ams_tg_cx[main_key].awb_fee;
                    if(this.all_ams_tg_cx[main_key].mawb)
                    this.ams_arr.mawb=this.all_ams_tg_cx[main_key].mawb;
                    if(this.all_ams_tg_cx[main_key].hawb)
                    this.ams_arr.hawb=this.all_ams_tg_cx[main_key].hawb;
                    if(this.all_ams_tg_cx[main_key].dg_fee)
                    this.ams_arr.dg_fee=this.all_ams_tg_cx[main_key].dg_fee;
                }
            }
            else{
                if(this.all_ams.hasOwnProperty(carrier_code)){
                    if(this.all_ams[carrier_code].fsc)  
                    this.ams_arr.fsc=this.all_ams[carrier_code].fsc;
                    if(this.all_ams[carrier_code].scc)
                    this.ams_arr.scc=this.all_ams[carrier_code].scc;
                    if(this.all_ams[carrier_code].xray)
                    this.ams_arr.xray=this.all_ams[carrier_code].xray;
                    if(this.all_ams[carrier_code].misc)
                    this.ams_arr.misc=this.all_ams[carrier_code].misc;
                    if(this.all_ams[carrier_code].ctg)
                    this.ams_arr.ctg=this.all_ams[carrier_code].ctg;
                    if(this.all_ams[carrier_code].awb_fee)
                    this.ams_arr.awb_fee=this.all_ams[carrier_code].awb_fee;
                    if(this.all_ams[carrier_code].mawb)
                    this.ams_arr.mawb=this.all_ams[carrier_code].mawb;
                    if(this.all_ams[carrier_code].hawb)
                    this.ams_arr.hawb=this.all_ams[carrier_code].hawb;
                    if(this.all_ams[carrier_code].dg_fee)
                    this.ams_arr.dg_fee=this.all_ams[carrier_code].dg_fee;
                }
            }

            //for notice
            this.user_notice='';
            if(this.all_user_notice[carrier_code])
              this.user_notice=this.all_user_notice[carrier_code].user_notice_1;
        },
        getLocation() {
            ApiService.get(`/user/get-location`).then(({ data }) => {
                this.location=data;
            });
        },
        getCurrencyRate() {
            ApiService.get(`/user/get-currency-rate`).then(({ data }) => {
                this.currency_rate=data;
            });
        },
        extraComission(){
            for (let i = 0; i < this.rate_data.length; i++) {
                let obj_key = Object.keys(this.rate_data[i].my_rate_2)[0];
                if (parseInt(this.extra_comission) > 0) {
                    if (this.profit_type == "total") {
                        let add_profit = parseFloat(this.extra_comission) / parseFloat(this.search_form.quantity);
                        this.rate_data[i].my_rate_2[obj_key] = parseFloat(this.rate_data[i].my_rate[obj_key]) + parseFloat(add_profit);
                    } else if (this.profit_type == "per_kg") {
                        this.rate_data[i].my_rate_2[obj_key] = parseFloat(this.rate_data[i].my_rate[obj_key]) + parseFloat(this.extra_comission);
                    }
                    this.rate_data[i].my_rate_2[obj_key]=this.rate_data[i].my_rate_2[obj_key].toFixed(2)
                }
            }
        },
        extraComission2() {
            // console.log(event.key);
            // event.key==0 || event.key==1 || event.key==2 || event.key==3 || event.key==4 || event.key==4 || event.key==6 || event.key==7 || event.key==8 || event.key==9 || event.key=="Backspace"
            if(1){
                for (let i = 0; i < this.rate_data.length; i++) {
                    let obj_key = Object.keys(this.rate_data[i].my_rate_2)[0];
                    if (parseInt(this.last_extra_comission) > 0) {
                        if (this.profit_type == "total") {
                            let add_profit_1 =parseInt(this.last_extra_comission) / parseInt(this.search_form.quantity);
                            this.rate_data[i].my_rate_2[obj_key] =parseInt(this.rate_data[i].my_rate_2[obj_key]) - parseInt(add_profit_1);
                        } else if (this.profit_type == "per_kg") {
                            this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) - parseInt(this.last_extra_comission);
                        }
                    }
                    if (parseInt(this.extra_comission) > 0) {
                        if (this.profit_type == "total") {
                            let add_profit = parseInt(this.extra_comission) / parseInt(this.search_form.quantity);
                            this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) + parseInt(add_profit);
                        } else if (this.profit_type == "per_kg") {
                            this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) + parseInt(this.extra_comission);
                        }
                    }
                }
            }    
        },
        check_rate_type() {
            if (this.search_form.selected_quantity == 'all')
                this.is_all_rate = true;
            else
                this.is_all_rate = false; 
        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
    },
    mounted() {
        this.getLocation();
        this.get_notice();
        this.getCurrencyRate();
        if (this.user_source){
            this.search_form.from = this.user_source;
            this.get_asm(this.user_source);
            // this.searchQuery_from = this.current_user.origin_airport_code;
        }

        // window.addEventListener('click', this.closeDropdown_from); 
        window.addEventListener('click', this.closeDropdown_to);    
    },
    computed: {
        ...mapGetters({ current_user: "currentUser", user_source: "userSource"}),
        // filteredLocations_from() {
        //     if (!this.searchQuery_from) {
        //         return this.location;
        //     }
        //     const query = this.searchQuery_from.toLowerCase();
        //     return this.location.filter(item => {
        //         return (item.destination.toLowerCase().includes(query) || item.iata_code.toLowerCase().includes(query));
        //     });
        // },
        filteredLocations_to() {
            if (!this.searchQuery_to) {
                return this.location;
            }
            const query = this.searchQuery_to.toLowerCase();
            return this.location.filter(item => {
                return (
                    item.iata_code.toLowerCase().includes(query)
                );
            });
        }
    },
    watch: {
        extra_comission(newValue, oldValue) {
            this.last_extra_comission = oldValue;
        },
    },
};
</script>
<style>
.rate-area{
    height: 320px;
    overflow-y: auto;
}
.search-area {
    background: gainsboro;
    padding: 3%;
    border-radius: 10px;
}

.btn1 {
    background: #c0392b;
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.btn1:hover {
    color: white;
}

.rate-area {
    background: white;
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
}

.copy-cls-css {
    cursor: pointer;
    color: white;
    border-radius: 5px;
}
.fw-600{
    font-weight:600;
}
.err_cls {
    color: #c0392b;
}

.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  /* border: solid 1px silver; */
  border-radius: 5px;
}

.form-control {
  width: 100%;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px; /* Adjust as needed */
  overflow-y: auto;
  z-index: 1;
}

.option {
  padding: 5px 10px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
}
.selected-row {
    background-color: #ffcccc;
    font-weight: 600;  
}
.sticky-div {
    position: sticky;
    top: 1px;
    background-color: #f1f2f6;
    padding: 4px 2%;
    border-radius: 5px;
}
.all_cs{
    display:flex;
}
@media (max-width: 768px)  {
    .rate_area{
        margin-top: 15px;
    }
    .sticky-div{
        width: 143%;
    }
}
@media (max-width: 340px)  {
    .all_cs{
        display:block !important;
    }
}
</style>
<style>
    .menu-text{
        font-size: 14px !important;
    }
    #whatsapp-float {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000; /* Ensure it's above other content */
    }

    #whatsapp-float img {
        width: 60px; /* Adjust size as needed */
        height: auto; /* Maintain aspect ratio */
        border-radius: 50%; /* Circular shape */
        transition: transform 0.2s; /* Smooth animation */
    }

    #whatsapp-float img:hover {
        transform: scale(1.1); /* Scale up on hover */
    }
    input[readonly] {
        background: lightgrey;
        border: 1px solid;
    }
    option span {
        color: green !important;
    }
</style>
