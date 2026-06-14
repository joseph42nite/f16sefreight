<template>
  <div class="py-5">
    <div class="admin-page-header mb-7">
      <h2>Account Settings</h2>
    </div>

    <div class="row">
      <div class="col-xl-6 mb-7 mb-xl-0">
        <!-- Profile Section -->
        <div class="admin-glass-card h-100">
          <div class="d-flex align-items-center mb-8">
            <div class="symbol symbol-50 symbol-light-primary mr-4">
               <span class="symbol-label font-size-h3 font-weight-boldest"><i class="far fa-id-card text-primary"></i></span>
            </div>
            <div>
               <h4 class="font-weight-boldest text-dark mb-0">Personal Profile</h4>
               <span class="text-muted font-weight-bold font-size-sm">Manage identity preferences</span>
            </div>
          </div>

          <b-form @submit.prevent="onSubmit" class="fw-700">
             <div class="admin-form-group">
               <label>Full Name</label>
               <b-form-input v-model="user_form.name" type="text" required placeholder="Your Name"></b-form-input>
             </div>
             
             <div class="admin-form-group">
               <label>Email Address</label>
               <b-form-input v-model="user_form.email" type="email" readonly class="bg-light text-muted"></b-form-input>
               <small class="form-text text-muted">Identifier cannot be changed by self.</small>
             </div>

             <div class="mt-8">
               <button type="submit" class="admin-pill-btn" :disabled="isSavingProfile">
                  <span v-if="isSavingProfile"><b-spinner small class="mr-2"></b-spinner>Updating...</span>
                  <span v-else><i class="fas fa-save mr-2"></i>Save Personal Data</span>
               </button>
             </div>

             <div v-if="profileSaved" class="alert alert-custom alert-light-success mt-4 mb-0 py-3">
               <div class="alert-text font-weight-bold text-center"><i class="fas fa-check-circle text-success mr-2"></i> Saved Successfully</div>
             </div>
          </b-form>
        </div>
      </div>

      <div class="col-xl-6">
        <!-- Security Section -->
        <div class="admin-glass-card h-100">
           <div class="d-flex align-items-center mb-8">
            <div class="symbol symbol-50 symbol-light-danger mr-4">
               <span class="symbol-label font-size-h3 font-weight-boldest"><i class="fas fa-shield-alt text-danger"></i></span>
            </div>
            <div>
               <h4 class="font-weight-boldest text-dark mb-0">Security Settings</h4>
               <span class="text-muted font-weight-bold font-size-sm">Refresh your secure access credentials</span>
            </div>
          </div>

          <b-form @submit.prevent="submitPassword" class="fw-700">
             <div class="admin-form-group">
               <label>New Password</label>
               <b-form-input v-model="password_form.password" type="password" required placeholder="Enter min 6 chars"></b-form-input>
             </div>

             <div class="admin-form-group">
               <label>Confirm Password</label>
               <b-form-input v-model="password_form.password_confirmation" type="password" required placeholder="Match above entry"></b-form-input>
             </div>

             <div class="mt-8">
               <button type="submit" class="admin-pill-btn btn-danger" :disabled="isUpdatingPass" style="background: #F1416C !important; border-color: #F1416C !important; box-shadow: 0 4px 10px rgba(241, 65, 108, 0.15) !important;">
                  <span v-if="isUpdatingPass"><b-spinner small class="mr-2"></b-spinner>Encrypting...</span>
                  <span v-else><i class="fas fa-key mr-2"></i>Update Password</span>
               </button>
             </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { mapGetters } from "vuex";
import { LOGOUT} from "@/core/services/store/auth.module";

export default {
  data() {        
    return {
      user_form: new Form({  
        name: "",
        email: "",
      }),
      password_form: new Form({  
        password: "",
        password_confirmation: "",
      }),
      isSavingProfile: false,
      profileSaved: false,
      isUpdatingPass: false
    };
  },
  methods: {
    onSubmit() {
      this.isSavingProfile = true;
      this.profileSaved = false;
      ApiService.put(`/superadmin/upadte-detail`, this.user_form)
        .then(({ data }) => {
           this.profileSaved = true;
           setTimeout(() => { this.profileSaved = false; }, 4000);
        })
        .finally(() => {
           this.isSavingProfile = false;
        });
    },
    submitPassword() {
        this.isUpdatingPass = true;
        ApiService.put(`/superadmin/update-password`, this.password_form)
            .then(({ data }) => {
                this.$store.dispatch(LOGOUT)
                .then(() => this.$router.push('/login'));
            })
            .catch(err => {
               alert("Password update failed. Please try again.");
            })
            .finally(() => {
                this.isUpdatingPass = false;
            });
    },
  },
  mounted() {
      this.user_form.name = this.current_user.name;
      this.user_form.email = this.current_user.email;
  },
  computed: {
    ...mapGetters({ current_user: 'currentUser' })
  },
};
</script>
