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
                            <option v-for="airline in all_airline" :key="airline.id" :value="airline.code">
                                {{ airline.code }} — {{ airline.name }}
                            </option>
                        </select>
                    </div>
                    <button class="admin-pill-btn w-100 justify-content-center" @click="submit">Save</button>
                    <p v-if="error" class="text-danger mt-3 mb-0" role="alert">{{ error }}</p>
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
import { say } from "@/core/services/toast";
import ApiService from "@/core/services/api.service";
import { serverMessage } from "@/core/services/serverMessage";
export default {
    data() {
        return {
            msg_form:new Form({
                airline:'',
                message:'',  
            }),    
            all_airline:[],
            all_notice:[],
            error:'',
        };
    },
    methods: {
        submit() {
            this.error = '';
            this.msg_form.post(`/superadmin/add-notice`).then(({ data }) => {
              say(this, "Notice added.");
              this.msg_form.airline='';
              this.msg_form.message='';
              this.get_notice();
            }).catch((err) => { this.error = serverMessage(err, 'The notice could not be saved.'); });
        },
        get_notice(){
            ApiService.get(`/superadmin/get-notice`).then(({ data }) => {
                this.all_notice=data;
            });
        },
        get_airline(){
            // The platform airline list (FA4): the route asked before never existed, so this was always empty.
            // A notice is filed under the two-letter code, so a carrier without one cannot be chosen.
            ApiService.get(`/superadmin/airlines?per_page=500`).then(({ data }) => {
                this.all_airline=(data.data || []).filter((a) => a.code)
                    .sort((a, b) => String(a.code).localeCompare(String(b.code)));
            }).catch((err) => { this.error = serverMessage(err, 'The airline list could not be loaded.'); });
        },
        delete_notice(carrier_code){
            // It removes EVERY notice filed under the carrier, so it asks first (FA9).
            if (!confirm(`Delete every notice for ${carrier_code}?`)) return;
            this.error = '';
            ApiService.post(`/superadmin/delete-notice`,{'carrier_code':carrier_code}).then(({ data }) => {
                this.get_notice();
                say(this, "Notices deleted.");
            }).catch((err) => { this.error = serverMessage(err, 'The notice could not be deleted.'); });
        }
    },
    mounted() {
        this.get_notice();
        this.get_airline();
    },
};
</script>
