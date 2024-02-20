<template>
    <div class="main-page w-100">
        <div class="search-area" style="margin-top: 5%">
            <div>
                <img src="/media/custome/aakash-logo.png" alt="aakash logo" width="100" height="100" class="img-fluid" />
            </div>
            <div class="row mt-5">
                <div class="col-12 col-md-3">
                    <label for="dist_form">From</label>
                    <treeselect :options="location" :value="search_form.from" v-model="search_form.from" :multiple="false"
                        :searchable="true" :normalizer="normalizer"></treeselect>
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">To</label>
                    <treeselect :options="location" :value="search_form.to" v-model="search_form.to" :multiple="false"
                        :searchable="true" :normalizer="normalizer"></treeselect>
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">Weight in kg</label>
                    <input type="text" @keyup="isNumber()" class="form-control" placeholder="Enter quantity"
                        v-model="search_form.quantity" :readonly="search_form.selected_quantity != 'custom'" />
                    <span class="err_cls" id="quantity_msg"></span>
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">Weights Type</label>
                    <select name="" id="selected_quantity_1" class="form-control" v-model="search_form.selected_quantity"
                        @change="check_rate_type()">
                        <option value="custom">Custom</option>
                        <option value="Minimum">Minimum</option>
                        <option value="Normal">Normal</option>
                        <option value="all">All Rate</option>
                    </select>
                </div>
                <div class="col-12 mt-3 text-right">
                    <button class="btn btn1" @click="get_rate()">Rates</button>
                </div>
            </div>
            <!-- display area code -->
            <div class="row" style="margin-top: 6%">
                <div :class="is_all_rate ? 'col-12 col-md-12' : 'col-12 col-md-8'
                    ">
                    <div class="rate-area mr-1">
                        <span @click="copyToClipboard()" class="copy-cls" v-if="!is_all_rate">Export</span>
                        <input type="number" v-model="extra_comission" @keyup="extraComission()" v-if="!is_all_rate" />
                        <select name="profit_type" id="profit_type" v-model="profit_type" @change="extra_comission = 0;
                        last_extra_comission = 0;
                        final_extra_comission = 0;
                        " v-if="!is_all_rate">
                            <option value="total">Total profit</option>
                            <option value="per_kg">-/kg</option>
                        </select>
                        <vue-excel-xlsx :data="items" :columns="fields" :file-name="'rate'" :file-type="'xlsx'"
                            :sheet-name="'rate'" v-if="is_all_rate">
                            <button class="btn create_btn font-weight-bold py-2 text-white">
                                Export rate
                            </button>
                        </vue-excel-xlsx>
                        <b-table :bordered="true" responsive :items="items" :fields="fields" style="white-space: nowrap"
                            primary-key="id" :filter="filter" :current-page="currentPage" :per-page="perPage"
                            @filtered="onFiltered" v-if="is_all_rate">
                            <!-- <template #cell(index)="data">
                                {{ data.index + 1 }}
                            </template> -->
                        </b-table>
                        <table class="table" v-else>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Airline</th>
                                    <th>Product Type</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Extra Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(rate, index) in rate_data" :key="index">
                                    <td>
                                        <input type="checkbox" @change="selcted_column(index,rate.carrier_code)" :id="'selected_' + index" />
                                    </td>
                                    <td>
                                        {{
                                            rate.carrier_code +
                                            "(" +
                                            rate.carrier_prefix +
                                            ")"
                                        }}
                                    </td>
                                    <td>{{ rate.product_name }}</td>
                                    <td>
                                        {{ Object.keys(rate.my_rate)[0] }}
                                    </td>
                                    <td>
                                        {{ rate.my_rate[Object.keys(rate.my_rate)[0]] }}
                                    </td>
                                    <td>
                                        {{ final_extra_comission }}
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
                            <span>MISC : <span>{{ ams_arr.misc }}</span></span><br>
                            <span>AMS : <span>{{ ams_arr.ams }}</span></span><br>
                        </div>
                        <hr>
                        <div>
                            <h4 class="text-danger">Notice:</h4><span>{{ user_notice_1 }}</span>
                        </div>
                    </div>
                </div>
            </div>
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
                to: "ABJ",
                selected_quantity: "custom",
                quantity: "101",
            }),
            rate_data: "",
            rate_data_copy: {},
            location: [],
            extra_comission: "",
            last_extra_comission: "",
            final_extra_comission: 0,
            profit_type: "total",
            is_all_rate: false,
            user_notice_1: '',
            all_ams:[],
            ams_arr:{
                fsc:'',
                misc:'',
                ams:'',
            },
            fields: [
                { label: "Sl", key: "index", field: "index" },
                { label: "Airline", key: "carrier_code", field: "carrier_code" },
                { label: "Product Type", key: "product_name", field: "product_name" },
            ],
            items: [],
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],
        };
    },
    methods: {
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
                this.user_notice_1 = data[0].user_notice_1;
            });
        },
        get_asm() {
            ApiService.get(`/user/get-ams`).then(({ data }) => {
                for(let i=0;i<data.length;i++){
                    this.all_ams[data[i].carrier_code]={};
                    this.all_ams[data[i].carrier_code]=data[i];
                }
            });
        },
        get_rate() {
            this.rate_data = "";
            let rate_data_loop = [];
            let items_loop = [];
            let rate_index = 3;
            this.search_form
                .post(`/user/get-rate`)
                .then(({ data }) => {
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
                            if (
                                this.search_form.selected_quantity == "Minimum"
                            ) {
                                data[i]["my_rate"]["Minimum"] =
                                    rate_data["Minimum"];
                            } else if (
                                this.search_form.selected_quantity == "Normal"
                            ) {
                                data[i]["my_rate"]["Normal"] =
                                    rate_data["Normal"];
                            } else if (
                                this.search_form.selected_quantity == "custom"
                            ) {
                                let user_quantity = parseInt(
                                    this.search_form.quantity
                                );
                                let keys = Object.keys(rate_data);
                                let is_first_quantity_get = 0;
                                let first_quantity = 0;
                                for (let j = 0; j < keys.length; j++) {
                                    if (
                                        keys[j] == "Minimum" ||
                                        keys[j] == "Normal"
                                    ) {
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
                        }
                        this.rate_data = data;
                    }
                })
                .catch((err) => { });
        },
        copyToClipboard() {
            let clip_arr = [];
            let arr_len = Object.entries(this.rate_data_copy).length;
            let carrier_code='';
            if (arr_len) {
                for (let i = 0; i < arr_len; i++) {
                    let currentData = {};
                    carrier_code=this.rate_data_copy[i].carrier_code;
                    currentData.Sl = i + 1;
                    currentData.Airline = `${carrier_code}(${this.rate_data_copy[i].carrier_prefix})`;
                    currentData.ProductType = this.rate_data_copy[i].product_name;
                    currentData.Quantity = `${Object.keys(this.rate_data_copy[i].my_rate)[0]}`;
                    currentData.Price = `${this.rate_data_copy[i].my_rate[Object.keys(this.rate_data_copy[i].my_rate)[0]] + parseFloat(this.final_extra_comission)}++ SC: ${this.all_ams[carrier_code].fsc} + ${this.all_ams[carrier_code].misc} + AMS : ${parseInt(this.all_ams[carrier_code].mawb)+parseInt(this.all_ams[carrier_code].hawb)}`;
                    clip_arr.push(currentData);
                }
                const headers = Object.keys(clip_arr[0]);
                const headerRow = headers.join("\t\t\t");
                const dataRows = clip_arr
                    .map((row) => Object.values(row).join("\t\t"))
                    .join("\n");
                const tableText = `${headerRow}\n\n${dataRows}`;

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
        },
        selcted_column(index,carrier_code) {
            const checkbox = $(`#selected_${index}`);
            const isChecked = checkbox.prop("checked");
            if (isChecked) this.rate_data_copy[index] = this.rate_data[index];
            else delete this.rate_data_copy[index];

            this.ams_arr.fsc=this.all_ams[carrier_code].fsc;
            this.ams_arr.misc=this.all_ams[carrier_code].misc;
            this.ams_arr.ams=parseInt(this.all_ams[carrier_code].hawb)+parseInt(this.all_ams[carrier_code].mawb);
        },
        getLocation() {
            ApiService.get(`/user/get-location`).then(({ data }) => {
                data.forEach((element) => {
                    this.location.push({
                        value: element["iata_code"],
                        name:
                            element["iata_code"] +
                            " (" +
                            element["destination"] +
                            ")",
                    });
                });
            });
        },
        normalizer(node) {
            return {
                id: node.value,
                label: node.name,
            };
        },
        extraComission() {
            if (this.profit_type == "total") {
                let add_profit = this.extra_comission / this.search_form.quantity;
                this.final_extra_comission = add_profit.toFixed(2);
            } else if (this.profit_type == "per_kg") {
                this.final_extra_comission = this.extra_comission;
            }
        },
        extraComission2() {
            for (let i = 0; i < this.rate_data.length; i++) {
                let obj_key = Object.keys(this.rate_data[i].my_rate)[0];
                if (parseInt(this.last_extra_comission) > 0) {
                    if (this.profit_type == "total") {
                        let add_profit =
                            parseInt(this.last_extra_comission) /
                            parseInt(this.search_form.quantity);
                        this.rate_data[i].my_rate[obj_key] =
                            parseInt(this.rate_data[i].my_rate[obj_key]) -
                            parseInt(add_profit);
                    } else if (this.profit_type == "per_kg") {
                        this.rate_data[i].my_rate[obj_key] =
                            parseInt(this.rate_data[i].my_rate[obj_key]) -
                            parseInt(this.last_extra_comission);
                    }
                }
                if (parseInt(this.extra_comission) > 0) {
                    if (this.profit_type == "total") {
                        let add_profit =
                            parseInt(this.extra_comission) /
                            parseInt(this.search_form.quantity);
                        this.rate_data[i].my_rate[obj_key] =
                            parseInt(this.rate_data[i].my_rate[obj_key]) +
                            parseInt(add_profit);
                    } else if (this.profit_type == "per_kg") {
                        this.rate_data[i].my_rate[obj_key] =
                            parseInt(this.rate_data[i].my_rate[obj_key]) +
                            parseInt(this.extra_comission);
                    }
                }
            }
        },
        check_rate_type() {
            if (this.search_form.selected_quantity == 'all')
                this.is_all_rate = true;
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
        if (this.current_user)
            this.search_form.from = this.current_user.origin_airport_code;
    },
    computed: {
        ...mapGetters({ current_user: "currentUser" }),
    },
    watch: {
        extra_comission(newValue, oldValue) {
            this.last_extra_comission = oldValue;
        },
    },
};
</script>
<style>
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
</style>
