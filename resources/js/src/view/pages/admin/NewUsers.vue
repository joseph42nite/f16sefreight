<template>
  <div class="py-5">
    <div class="admin-page-header mb-7">
      <h2>{{ action }} User Account</h2>
    </div>

    <div class="row justify-content-center">
      <div class="col-xl-9">
        <div class="admin-glass-card p-8 p-md-10">
          <b-form @submit="onSubmit" class="fw-700">
            
            <h4 class="font-weight-bolder text-dark mb-6">Primary Information</h4>
            
            <div class="row">
              <div class="col-md-6">
                <div class="admin-form-group">
                  <label>Full Name <span class="text-danger">*</span></label>
                  <b-form-input
                    v-model="user_form.name"
                    type="text"
                    required
                    placeholder="e.g. Jane Smith"
                    :class="{ 'is-invalid': user_form.errors.has('name') }"
                  ></b-form-input>
                  <has-error :form="user_form" field="name"></has-error>
                </div>
              </div>

              <div class="col-md-6">
                <div class="admin-form-group">
                  <label>Email Address <span class="text-danger">*</span></label>
                  <b-form-input 
                    v-model="user_form.email" 
                    type="email" 
                    required 
                    placeholder="email@example.com" 
                    :readonly="action == 'Edit'" 
                    :class="{ 'is-invalid': user_form.errors.has('email') }"
                  ></b-form-input>
                  <has-error :form="user_form" field="email"></has-error>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                 <div class="admin-form-group">
                   <label>Company</label>
                   <b-form-select v-model="user_form.company_name" :options="all_company" @change="getBranch('add')" class="custom-select"></b-form-select>
                   <has-error :form="user_form" field="company_name"></has-error>
                 </div>
              </div>
              <div class="col-md-6">
                 <div class="admin-form-group">
                   <label>Branch Location</label>
                   <b-form-select v-model="user_form.branch_name" :options="all_branch" class="custom-select"></b-form-select>
                   <has-error :form="user_form" field="branch_name"></has-error>
                 </div>
              </div>
            </div>

            <hr class="my-8 opacity-10">
            <h4 class="font-weight-bolder text-dark mb-6">Settings & Auth</h4>

            <div class="row">
              <div class="col-md-6">
                <div class="admin-form-group">
                    <label>Origin Airport</label>
                    <div class="custom-dropdown w-100" ref="dropdownContainer" @click="toggleDropdown">
                      <input type="text" v-model="searchQuery" placeholder="Search for code/city..." class="form-control" autocomplete="off">
                      <div v-if="isDropdownOpen" class="dropdown-options shadow">
                        <div v-for="(item, index) in filteredLocations" :key="index" @click.stop="selectOption(item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
                      </div>
                    </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="admin-form-group">
                    <label>Pima Address</label>
                    <b-form-input v-model="user_form.pima_address" placeholder="Address string" :class="{ 'is-invalid': user_form.errors.has('pima_address') }"></b-form-input>
                    <has-error :form="user_form" field="pima_address"></has-error>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="admin-form-group">
                  <label>Access Password</label>
                  <b-input-group>
                     <b-form-input v-model="user_form.password" :type="showpass ? 'password' : 'text'" placeholder="••••••••" :class="{ 'is-invalid': user_form.errors.has('password') }"></b-form-input>
                     <b-input-group-append>
                        <b-button variant="light" @click="showpass = !showpass">
                            <i :class="showpass ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </b-button>
                     </b-input-group-append>
                  </b-input-group>
                  <has-error :form="user_form" field="password"></has-error>
                </div>
              </div>
              
              <div class="col-md-6 d-flex align-items-center pt-6">
                 <b-form-checkbox v-model="user_form.can_send" :value="1" :unchecked-value="0" class="font-weight-bold mb-0">
                    Grant explicit sending rights
                 </b-form-checkbox>
              </div>
            </div>

            <div class="mt-8 d-flex justify-content-between align-items-center">
                <div v-if="action=='Edit'">
                    <span class="font-weight-bold mr-3">Account Status:</span>
                    <b-form-checkbox v-model="user_form.is_active" :value="1" :unchecked-value="0" switch inline size="lg">
                        <span :class="user_form.is_active ? 'text-success' : 'text-danger'" class="font-weight-bolder ml-2">
                          {{ user_form.is_active ? 'ACTIVE' : 'INACTIVE' }}
                        </span>
                    </b-form-checkbox>
                </div>
                <div v-else></div>

                <button type="submit" class="admin-pill-btn btn-lg" :disabled="isSubmitting">
                   <span v-if="isSubmitting"><b-spinner small class="mr-2"></b-spinner>Saving...</span>
                   <span v-else>{{ action == 'Add' ? 'Create User Profile' : 'Update Settings' }}</span>
                </button>
            </div>

            <div v-if="savedSuccessfully" class="alert alert-custom alert-light-success mt-5 text-center font-weight-bold">
                <i class="fas fa-check-circle mr-2 text-success"></i> Saved Successfully
            </div>

          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data() {
    return {
      user_form:new Form({  
        id:"",
        name: "",
        email: "",
        origin_airport_code:null,
        company_name:null,
        branch_name:null,
        daily_login_count:'',
        password: "",
        pima_address: "",
        is_active:"",
        can_send:1,
        plan_expiry_date:'',
      }),
      action: 'Add',
      all_company:[{ value: null, text: 'Select Company' }],
      all_branch:[{ value: null, text: 'Select Branch' }],
      location:[],
      searchQuery: '',
      isDropdownOpen: false,
      showpass: true,
      isSubmitting: false,
      savedSuccessfully: false
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(item) {
      this.user_form.origin_airport_code = item.iata_code;
      let source_name = item.destination;
      let final_set = this.user_form.origin_airport_code + "(" + source_name + ")";
      this.searchQuery = final_set;
      this.isDropdownOpen = false; // Auto-close after selection
    },
    closeDropdown(event) {
      const dropdownContainer = this.$refs.dropdownContainer;
      if (dropdownContainer && !dropdownContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.isSubmitting = true;
      this.savedSuccessfully = false;
      
      if (!this.user_form.origin_airport_code && this.searchQuery) {
          // AUTO-CAPTURE: If you type 'DXB' but don't click dropdown, intercept the raw text so validation succeeds.
          this.user_form.origin_airport_code = this.searchQuery.split('(')[0].trim().toUpperCase();
      }

      if(this.action=='Add'){
        this.user_form.post(`/superadmin/create-user`)
        .then(({ data }) => {
          this.$router.push('/superadmin/all-users');
        })
        .catch(err => {})
        .finally(() => { this.isSubmitting = false; });
      }
      else {
        this.user_form.put(`/superadmin/edit-user/${this.user_form.id}`)
        .then(({ data }) => {
           this.savedSuccessfully = true;
           setTimeout(() => { this.savedSuccessfully = false; }, 4000);
        })
        .catch(err => {})
        .finally(() => { this.isSubmitting = false; });
      }
    },
    getData(id){
      ApiService.get(`/superadmin/all-user/${id}`)
        .then(({ data }) => {
          this.user_form.fill(data[0])
          this.searchQuery=data[0].origin_airport_code;
          this.getBranch('edit');
        })
    },
    getLocation(){
      ApiService.get(`/superadmin/get-location`)
        .then(({ data }) => {
          this.location=data;
        })
    },
    getCompany() {
        ApiService.get(`/superadmin/all-company`).then(({ data }) => {
            for(let i=0;i<data.length;i++){
                this.all_company.push({"value":data[i].id,"text":data[i].name})
            }
        });
    },
    getBranch(operation){
      if(operation=='add'){
        this.all_branch=[{ value: null, text: 'Select Branch' }];
        this.user_form.branch_name=null;
      }
        ApiService.get(`/superadmin/get-company-branch/${this.user_form.company_name}`).then(({ data }) => {
            for(let i=0;i<data.length;i++){
                this.all_branch.push({"value":data[i].id,"text":data[i].agent_city})
            }
        });
    },
    normalizer(node) {
      return {
        id: node.value,
        label: node.name,
      };
    },
  },
  mounted(){
   this.getLocation();
   this.getCompany();
   if(this.get_item){
      this.getData(this.get_item);
      this.action='Edit';
   }
    window.addEventListener('click', this.closeDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.closeDropdown);
  },
  computed: {
    get_item: function(){
      if(this.$route.params.id)
      return this.$route.params.id;
      else
      return 0;
    },
    filteredLocations() {
      if (!this.searchQuery) {
        return this.location.slice(0, 20); // Limit to top 20 to avoid browser lag with 20k records
      }
      const query = this.searchQuery.toLowerCase();
      const filtered = this.location.filter(item => {
          return (
              item.iata_code.toLowerCase().includes(query) ||
              (item.destination && item.destination.toLowerCase().includes(query))
          );
      });
      
      // Sort to prioritize IATA code matches on top
      filtered.sort((a, b) => {
        const aIata = a.iata_code.toLowerCase();
        const bIata = b.iata_code.toLowerCase();
        const aDest = (a.destination || "").toLowerCase();
        const bDest = (b.destination || "").toLowerCase();

        // 1. Exact match on IATA code
        const aExactIata = aIata === query;
        const bExactIata = bIata === query;
        if (aExactIata && !bExactIata) return -1;
        if (!aExactIata && bExactIata) return 1;

        // 2. Starts with IATA code
        const aStartsIata = aIata.startsWith(query);
        const bStartsIata = bIata.startsWith(query);
        if (aStartsIata && !bStartsIata) return -1;
        if (!aStartsIata && bStartsIata) return 1;

        // 3. Starts with destination name
        const aStartsDest = aDest.startsWith(query);
        const bStartsDest = bDest.startsWith(query);
        if (aStartsDest && !bStartsDest) return -1;
        if (!aStartsDest && bStartsDest) return 1;

        return 0; // maintain relative order
      });

      return filtered.slice(0, 20);
    }
  },
};
</script>
<style scoped>
.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #E4E6EF;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
  margin-top: 5px;
}
.option {
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 500;
  color: #3F4254;
  transition: background 0.2s;
}
.option:hover {
  background-color: #F3F6F9;
  color: #355594;
}
</style>
