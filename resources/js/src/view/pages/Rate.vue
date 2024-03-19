<template>
    <div class="main-page w-100">
        <div class="search-area" style="margin-top: 2%">
            <div class="d-flex justify-content-between">
                <img src="/media/custome/aakash-logo.png" alt="aakash logo" width="100" height="100" class="img-fluid" />
                <a href="javascript:void(0)" @click="report_popup=true">Report here</a>
            </div>
            <div class="row mt-3">
                <div class="col-12 col-md-3">
                    <label for="dist_form">From</label>
                    <input type="text" v-model="search_form.from" placeholder="Search source" class="form-control" readonly style="background: lightgrey;">
                    <!-- <div class="custom-dropdown" ref="dropdownContainer_from" @click="toggleDropdown_from">
                        <input type="text" v-model="searchQuery_from" placeholder="Search source" id="from_id" class="form-control">
                        <div v-if="isDropdownOpen_from" class="dropdown-options">
                            <div v-for="(item, index) in filteredLocations_from" :key="index" @click="selectOption_from(item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
                        </div>
                    </div> -->
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">To</label>
                    <div class="custom-dropdown" ref="dropdownContainer_to" @click="toggleDropdown_to">
                        <input type="text" v-model="searchQuery_to" placeholder="Search destination" id="from_id" class="form-control">
                        <div v-if="isDropdownOpen_to" class="dropdown-options">
                            <div v-for="(item, index) in filteredLocations_to" :key="index" @click="selectOption_to(item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">Weight in kg</label>
                    <input type="text" @keyup="isNumber()" class="form-control" placeholder="Enter quantity"
                        v-model="search_form.quantity" :readonly="search_form.selected_quantity != 'custom'" />
                    <span class="err_cls" id="quantity_msg"></span>
                </div>
                <div class="col-12 col-md-2">
                    <label for="dist_form">Weights Type</label>
                    <select name="" id="selected_quantity_1" class="form-control" v-model="search_form.selected_quantity"
                        @change="check_rate_type()">
                        <option value="custom">Custom</option>
                        <option value="Minimum">Minimum</option>
                        <option value="Normal">Normal</option>
                        <option value="all">All Rate</option>
                    </select>
                </div>
                <div class="col-12 col-md-1">
                    <button class="btn btn1" @click="get_rate()">Rates</button>
                </div>
            </div>
            <!-- display area code -->
            <div class="row" style="margin-top: 2%">
                <div :class="is_all_rate ? 'col-12 col-md-12' : 'col-12 col-md-8'
                    ">
                    <div class="rate-area mr-1">
                        <div class="sticky-div">
                            <span @click="copyToClipboard()" class="copy-cls" v-if="!is_all_rate">Export</span>
                            <input type="number" v-model="extra_comission" @keyup="extraComission()" v-if="!is_all_rate" />
                            <select name="profit_type" id="profit_type" v-model="profit_type" @change="extra_comission = 0; last_extra_comission = 0; final_extra_comission = 0; get_rate();" v-if="!is_all_rate">
                                <option value="total">Total profit</option>
                                <option value="per_kg">-/kg</option>
                            </select>
                            <vue-excel-xlsx :data="items" :columns="fields" :file-name="'rate'" :file-type="'xlsx'"
                                :sheet-name="'rate'" v-if="is_all_rate">
                                <button class="btn create_btn font-weight-bold py-2 text-white">
                                    Export rate
                                </button>
                            </vue-excel-xlsx>
                        </div>
                        <b-table :bordered="true" responsive :items="items" :fields="fields" style="white-space: nowrap"
                            primary-key="id" :filter="filter" :current-page="currentPage" :per-page="perPage"
                            @filtered="onFiltered" v-if="is_all_rate">
                        </b-table>
                        <table class="table" v-else>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Airline</th>
                                    <th>Product Type</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Added Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(rate, index) in rate_data" :key="index" :class="{ 'selected-row': selectedRows.includes(index) }">
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
                                    <td style="color: #ee5253;">
                                        {{ rate.my_rate_2[Object.keys(rate.my_rate_2)[0]] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-12 col-md-4" v-if="!is_all_rate">
                    <div class="rate-area ml-1">
                        <div>
                            <span>FSC : <span>{{ ams_arr.fsc }}</span></span><br>
                            <span>SCC : <span>{{ ams_arr.scc }}</span></span><br>
                            <span>XRAY : <span>{{ ams_arr.xray }}</span></span><br>
                            <span>MISC : <span>{{ ams_arr.misc }}</span></span><br>
                            <span>CTG : <span>{{ ams_arr.ctg }}</span></span><br>
                            <span>AWB FEE : <span>{{ ams_arr.awb_fee }}</span></span><br>
                            <span>MAWB : <span>{{ ams_arr.mawb }}</span></span><br>
                            <span>HAWB : <span>{{ ams_arr.hawb }}</span></span><br>
                        </div>
                        <hr>
                        <div v-if="user_notice" class="d-flex">
                            <h4 class="text-danger">Notice:</h4><span>{{ user_notice }}</span>
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
                    <button class="btn font-weight-bolder btn-primary py-3" @click="submit_report()">Submit</button>
                </div>
            </div>
        </b-modal>    
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
                quantity: "101",
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
        };
    },
    methods: {
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
        get_asm() {
            ApiService.get(`/user/get-ams`).then(({ data }) => {
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
            this.rate_data = "";
            let rate_data_loop = [];
            let items_loop = [];
            let rate_index = 3;
            this.search_form.post(`/user/get-rate`)
                .then(({ data }) => {
                    this.searched_country_code=data.country_code;
                    this.searched_region=data.region;
                    data=data.rates;
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

                                        if (
                                            user_quantity >= from_key &&
                                            user_quantity < to_key
                                        ) {
                                            let rate_key = keys[j];
                                            data[i]["my_rate"][rate_key] =
                                                rate_data[rate_key];
                                            break;
                                        }
                                        if (user_quantity < first_quantity) {
                                            data[i]["my_rate"]["Normal"] =
                                                rate_data["Normal"];
                                            break;
                                        }
                                    }
                                }
                            }
                            data[i]["my_rate_2"] = JSON.parse(JSON.stringify(data[i]['my_rate']));
                        }
                        this.rate_data = data;
                    }
                })
                .catch((err) => { });
        },
        copyToClipboard() {
            if(confirm("This rate can be wrong. confirm it from official website")){
                let clip_arr = [];
                let arr_len = Object.entries(this.rate_data_copy).length;
                let carrier_code='';
                let index_count=1;
                if (arr_len) {
                    for (let i in this.rate_data_copy) {
                        let currentData = {};
                        carrier_code=this.rate_data_copy[i].carrier_code;
                        // currentData.Sl = index_count;
                        // currentData.Airline = ``;
                        // currentData.ProductType = this.rate_data_copy[i].product_name;
                        // currentData.Quantity = `${Object.keys(this.rate_data_copy[i].my_rate)[0]}`;
                        currentData.Price = `${index_count}. ${carrier_code}(${this.rate_data_copy[i].carrier_prefix}): ${this.rate_data_copy[i].my_rate_2[Object.keys(this.rate_data_copy[i].my_rate_2)[0]]}++, Surcharges:`;
                        if(carrier_code=='EK'){
                            if(this.all_ams_ek[this.searched_country_code].fsc)
                            currentData.Price+=`${this.all_ams_ek[this.searched_country_code].fsc} (FSC) +`;
                            if(this.all_ams_ek[this.searched_country_code].misc)
                            currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].misc} (MISC) +`; 
                            if(this.all_ams_ek[this.searched_country_code].xray)
                            currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].xray} (XRAY) +`; 
                            if(this.all_ams_ek[this.searched_country_code].scc)
                            currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].scc} (SCC) +`;
                            if(this.all_ams_ek[this.searched_country_code].ctg)
                            currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].ctg} (CTG) +`;
                            if(this.all_ams_ek[this.searched_country_code].awb_fee)
                            currentData.Price+=` ${this.all_ams_ek[this.searched_country_code].awb_fee} (AWB FEE) +`; 
                            if(this.all_ams_ek[this.searched_country_code].mawb)
                            currentData.Price+=`, AMS: ${this.all_ams_ek[this.searched_country_code].mawb} (MAWB) + `;
                            if(this.all_ams_ek[this.searched_country_code].hawb)
                            currentData.Price+=`${this.all_ams_ek[this.searched_country_code].hawb} (HAWB)`; 
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
                                currentData.Price+=`${this.all_ams_tg_cx[main_key].fsc} (FSC) +`;
                                if(this.all_ams_tg_cx[main_key].misc)
                                currentData.Price+=` ${this.all_ams_tg_cx[main_key].misc} (MISC) +`; 
                                if(this.all_ams_tg_cx[main_key].xray)
                                currentData.Price+=` ${this.all_ams_tg_cx[main_key].xray} (XRAY) +`; 
                                if(this.all_ams_tg_cx[main_key].scc)
                                currentData.Price+=` ${this.all_ams_tg_cx[main_key].scc} (SCC) +`;
                                if(this.all_ams_tg_cx[main_key].ctg)
                                currentData.Price+=` ${this.all_ams_tg_cx[main_key].ctg} (CTG) +`;
                                if(this.all_ams_tg_cx[main_key].awb_fee)
                                currentData.Price+=` ${this.all_ams_tg_cx[main_key].awb_fee} (AWB FEE) +`; 
                                if(this.all_ams_tg_cx[main_key].mawb)
                                currentData.Price+=`, AMS: ${this.all_ams_tg_cx[main_key].mawb} (MAWB) + `;
                                if(this.all_ams_tg_cx[main_key].hawb)
                                currentData.Price+=`${this.all_ams_tg_cx[main_key].hawb} (HAWB)`;
                            }
                        }
                        else{
                            if(this.all_ams[carrier_code].fsc)
                            currentData.Price+=`${this.all_ams[carrier_code].fsc} (FSC) +`;
                            if(this.all_ams[carrier_code].misc)
                            currentData.Price+=` ${this.all_ams[carrier_code].misc} (MISC) +`; 
                            if(this.all_ams[carrier_code].xray)
                            currentData.Price+=` ${this.all_ams[carrier_code].xray} (XRAY) +`; 
                            if(this.all_ams[carrier_code].scc)
                            currentData.Price+=` ${this.all_ams[carrier_code].scc} (SCC) +`;
                            if(this.all_ams[carrier_code].ctg)
                            currentData.Price+=` ${this.all_ams[carrier_code].ctg} (CTG) +`;
                            if(this.all_ams[carrier_code].awb_fee)
                            currentData.Price+=` ${this.all_ams[carrier_code].awb_fee} (AWB FEE) +`; 
                            if(this.all_ams[carrier_code].mawb)
                            currentData.Price+=`, AMS: ${this.all_ams[carrier_code].mawb} (MAWB) + `;
                            if(this.all_ams[carrier_code].hawb)
                            currentData.Price+=`${this.all_ams[carrier_code].hawb} (HAWB)`;     
                        }
                        currentData.Price = currentData.Price.replace(' +, AMS:', ', AMS:');
                        currentData.Price = currentData.Price.replace('+, AMS:', ', AMS:');        
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
                    $(".copy-cls").html("Exported.");
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
        extraComission() {
            for (let i = 0; i < this.rate_data.length; i++) {
                let obj_key = Object.keys(this.rate_data[i].my_rate_2)[0];
                if (parseInt(this.last_extra_comission) > 0) {
                    if (this.profit_type == "total") {
                        let add_profit =parseInt(this.last_extra_comission) / parseInt(this.search_form.quantity);
                        this.rate_data[i].my_rate_2[obj_key] =parseInt(this.rate_data[i].my_rate_2[obj_key]) - parseInt(add_profit);
                    } else if (this.profit_type == "per_kg") {
                        this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) - parseInt(this.last_extra_comission);
                    }
                }
                if (parseInt(this.extra_comission) > 0) {
                    if (this.profit_type == "total") {
                        let add_profit = parseInt(this.extra_comission) / parseInt(this.search_form.quantity);
                        console.log(add_profit);
                        this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) + parseInt(add_profit);
                    } else if (this.profit_type == "per_kg") {
                        this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) + parseInt(this.extra_comission);
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
        this.get_asm();
        if (this.current_user){
            this.search_form.from = this.current_user.origin_airport_code;
            // this.searchQuery_from = this.current_user.origin_airport_code;
        }

        // window.addEventListener('click', this.closeDropdown_from); 
        window.addEventListener('click', this.closeDropdown_to);    
    },
    computed: {
        ...mapGetters({ current_user: "currentUser" }),
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
                    item.destination.toLowerCase().includes(query) || // Filter by destination
                    item.iata_code.toLowerCase().includes(query)      // Filter by iata_code
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
    font-size: 18px;
    font-weight: 600;
}

.btn1:hover {
    color: white;
}

.rate-area {
    background: white;
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
    padding: 3%;
}

.copy-cls {
    cursor: pointer;
    color: white;
    background: gainsboro;
    border-radius: 5px;
    padding: 5px;
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
    background-color: lightblue;
}
.sticky-div {
    position: sticky;
    top: 1px;
    background-color: #f1f2f6;
    padding: 4px 2%;
    border-radius: 5px;
}
</style>
