<template>
    <div class="main-page w-100">
        <div class="search-area" style="margin-top: 5%;">
            <div>
                <img src="/media/custome/aakash-logo.png" alt="aakash logo" width="100" height="100" class="img-fluid">
            </div>
            <div class="row mt-5">
                <div class="col-12 col-md-3">
                    <label for="dist_form">From</label>
                    <input type="text" class="form-control" v-model="search_form.from">
                </div>
                <div class="col-12 col-md-3">
                    <label for="dist_form">To</label>
                    <input type="text" class="form-control" v-model="search_form.to">
                </div>
                <div class="col-12 col-md-3" v-if="search_form.selected_quantity != 'custom'">
                    <label for="dist_form">Weights</label>
                    <select name="" id="" class="form-control" v-model="search_form.selected_quantity">
                        <option value="">Select quantity</option>
                        <option value="Minimum">Minimum</option>
                        <option value="Normal">Normal</option>
                        <option value="custom">Custom quantity</option>
                    </select>
                </div>
                <div class="col-12 col-md-3" v-if="search_form.selected_quantity == 'custom'">
                    <input type="text" class="form-control" placeholder="Enter quantity" v-model="search_form.quantity">
                </div>
                <div class="col-12 col-md-3">
                    <button class="btn btn1" @click="get_rate()">Rates</button>
                </div>
            </div>
            <!-- display area code -->
            <div class="row" style="margin-top: 6%;">
                <div class="col-12 col-md-8">
                    <div class="rate-area mr-1">
                        <span @click="copyToClipboard()" class="copy-cls">copy</span>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Airline</th>
                                    <th>Product Type</th>
                                    <th>Quantity/Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(rate, index) in rate_data" :key="index">
                                    <td>{{ rate.carrier_code + "(" + rate.carrier_prefix +
                                        ")" }}</td>
                                    <td>{{ rate.product_name }}</td>
                                    <td>
                                        {{ Object.keys(rate.my_rate)[0] }} : {{ rate.my_rate[Object.keys(rate.my_rate)[0]] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="rate-area ml-1">
                        <h1>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta blanditiis pariatur dolor
                            necessitatibus voluptatum accusamus. Delectus praesentium nemo dolorem? Debitis officia dicta
                            quas quibusdam, inventore at laboriosam magni aliquid nam!</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
export default {
    name: "Rate",
    data() {
        return {
            search_form: new Form({
                from: 'BLR',
                to: 'ABQ',
                selected_quantity: 'custom',
                quantity: "55 kg",
            }),
            rate_data: '',
        }
    },
    methods: {
        get_rate() {
            this.rate_data = '';
            this.search_form.post(`/user/get-rate`)
                .then(({ data }) => {
                    for (let i = 0; i < data.length; i++) {
                        let arr_data = data[i].rate_range;
                        let rate_data = JSON.parse(arr_data, true);
                        data[i]['my_rate'] = {};
                        if (this.search_form.selected_quantity == 'Minimum') {
                            data[i]['my_rate']['Minimum'] = rate_data['Minimum'];
                        }
                        else if (this.search_form.selected_quantity == 'Normal') {
                            data[i]['my_rate']['Normal'] = rate_data['Normal'];
                        }
                        else {
                            let user_quantity = parseInt(this.search_form.quantity);
                            let keys = Object.keys(rate_data);
                            for (let j = 0; j < keys.length; j++) {
                                if (keys[j] == 'Minimum' || keys[j] == 'Normal') { }
                                else {
                                    let from_key = parseInt(keys[j]);
                                    let to_key = 1000000;
                                    if ((j + 1) < keys.length)
                                        to_key = parseInt(keys[j + 1]);
                                    if (user_quantity >= from_key && user_quantity < to_key) {
                                        let rate_key = keys[j];
                                        data[i]['my_rate'][rate_key] = rate_data[rate_key];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    this.rate_data = data;
                })
                .catch(err => { });
        },
        copyToClipboard() {
            let clip_arr=[];
            for(let i=0;i<this.rate_data.length;i++){
                let currentData = {};
                currentData.Sl=i+1;
                currentData.Airline=`${this.rate_data[i].carrier_code}(${this.rate_data[i].carrier_prefix})`;
                currentData.ProductType=this.rate_data[i].product_name;
                currentData.QuantityPrice=`${Object.keys(this.rate_data[i].my_rate)[0]} : ${this.rate_data[i].my_rate[Object.keys(this.rate_data[i].my_rate)[0]]}`;
                clip_arr.push(currentData);
            }
            const headers = Object.keys(clip_arr[0]);
            const headerRow = headers.join('\t\t\t');
            const dataRows = clip_arr.map(row => Object.values(row).join('\t\t')).join('\n');
            const tableText = `${headerRow}\n\n${dataRows}`;
    
            const textarea = document.createElement('textarea');
            textarea.value = tableText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            $('.copy-cls').html('Copid.');
        },
    }
}
</script>
<style>
.search-area {
    background: #ffeaa7;
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
.copy-cls{
    cursor: pointer;
    color: white;
    background: gainsboro;
    border-radius: 5px;
    padding: 5px;
}
</style>