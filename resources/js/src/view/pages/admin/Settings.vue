<template>
    <div class="py-5">
        <div class="admin-page-header mb-6">
            <h2>Add notice for Airline</h2>
        </div>

        <div class="admin-glass-card mb-6">
            <div class="row">
                <div class="col-12 col-md-8 mb-4 mb-md-0">
                    <div class="admin-form-group mb-0">
                        <label for="user_message">User Message</label>
                        <textarea id="user_message" class="form-control" rows="6" v-model="msg_form.message"></textarea>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="admin-form-group">
                        <label>Airline</label>
                        <select v-model="msg_form.airline" class="form-control custom-select">
                            <option value="">Select Airline</option>
                            <option v-for="airline in all_airline" :key="airline.carrier_prefix" :value="airline.carrier_code">
                                {{ airline.carrier_code }}
                            </option>
                        </select>
                    </div>
                    <button class="admin-pill-btn w-100 justify-content-center" @click="submit">Save</button>
                </div>
            </div>
        </div>

        <div class="admin-glass-card">
            <div class="admin-table-wrapper table-responsive">
                <table class="table b-table mb-0">
                    <thead>
                        <tr>
                            <th>Airline</th>
                            <th>Message</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="notice in all_notice" :key="notice.carrier_code">
                          <td data-label="Airline">{{notice.carrier_code}}</td>
                          <td data-label="Message">{{notice.user_notice_1}}</td>
                          <td data-label="Action" class="text-right">
                            <button class="btn btn-danger btn-sm" @click="delete_notice(notice.carrier_code)">Delete</button>
                          </td>
                        </tr>
                        <tr v-if="!all_notice.length">
                          <td colspan="3" class="text-center text-muted py-6">No airline notices configured yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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
