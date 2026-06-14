<template>
    <div class="mt-10 p-5">
        <h1>Add notice for Airline</h1>
        <div class="d-flex justify-content-between">
            <div>
                <label for="user_message">User Message</label>
                <textarea rows="7" cols="100" v-model="msg_form.message"></textarea>
            </div>
            <div>
                <select v-model="msg_form.airline" class="form-control">
                    <option value="">Select Airline</option>
                    <option v-for="airline in all_airline" :key="airline.carrier_prefix" :value="airline.carrier_code">
                        {{ airline.carrier_code }}
                    </option>
                </select>
            </div>
            <div><button class="btn btn-primary" @click="submit">Save</button></div>
        </div>
        <table class="table mt-5">
            <thead>
                <th>Airline</th>
                <th>Message</th>
                <th>Action</th>
            </thead>
            <tbody>
                <tr v-for="notice in all_notice" :key="notice.carrier_code">
                  <td>{{notice.carrier_code}}</td>
                  <td>{{notice.user_notice_1}}</td>
                  <td><button class="btn btn-danger" @click="delete_notice(notice.carrier_code)">Delete</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
export default {
    data() {
        return {
            msg_form:new Form({
                airline:'',
                message:'',  
            }),    
            all_airline:[],
            all_notice:[],
        };
    },
    methods: {
        submit() {
            this.msg_form.post(`/superadmin/add-notice`).then(({ data }) => {
              alert("Added successfull");
              this.msg_form.airline='';
              this.msg_form.message='';
              this.get_notice();
            });
        },
        get_notice(){
            ApiService.get(`/superadmin/get-notice`).then(({ data }) => {
                this.all_notice=data;
            });
        },
        get_airline(){
            ApiService.get(`/superadmin/get-airline-list`).then(({ data }) => {
                this.all_airline=data;
            });
        },
        delete_notice(carrier_code){
            ApiService.post(`/superadmin/delete-notice`,{'carrier_code':carrier_code}).then(({ data }) => {
                this.get_notice();
            });
        }
    },
    mounted() {
        this.get_notice();
        this.get_airline();
    },
};
</script>
