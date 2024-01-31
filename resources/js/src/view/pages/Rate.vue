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
                                    <td style="vertical-align: middle;">{{ rate.carrier_code + "(" + rate.carrier_prefix +
                                        ")" }}</td>
                                    <td style="vertical-align: middle;">{{ rate.product_name }}</td>
                                    <td>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td>Quantity</td>
                                                    <td>Price</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(q_r, index) in rate.my_rate" :key="index">
                                                    <td>{{ index }}</td>
                                                    <td>{{ q_r }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
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
                from: '',
                to: '',
                selected_quantity: '',
                quantity: "",
            }),
            rate_data: '',
        }
    },
    methods: {
        get_rate() {
            this.rate_data='';
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
                            let user_quantity = this.search_form.quantity;
                            user_quantity = user_quantity.trim();
                            for (let key in rate_data) {
                                let value = rate_data[key];
                                if (key == 'Minimum' || key == 'Normal') { }
                                else {
                                    let db_quantity = parseInt(key);
                                    if (user_quantity <= db_quantity) {
                                        data[i]['my_rate'][key] = rate_data[key];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    this.rate_data = data;
                })
                .catch(err => { });
        }
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
</style>