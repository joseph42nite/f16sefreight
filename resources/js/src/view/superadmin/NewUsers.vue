<template>
  <div class="mt-10 p-5">
    <b-form
      @submit="onSubmit"
      class="w-md-50 fw-700"
    >
      <h3 class="fw-700">{{action}} users</h3>
      <div class="bg-white p-10 rounded">
        <div class="d-flex mb-7">
        <b-form-group class="w-50 mr-2">
          <b-form-input
            id="input-1"
            v-model="user_form.name"
            type="text"
            required
            placeholder="Name"
            class="mx-1 input-box"
            :class="{ 'is-invalid': user_form.errors.has('name') }"
          ></b-form-input>
          <has-error :form="user_form" field="name"></has-error>
        </b-form-group>
        <b-form-group class="w-50 ml-2">
          <b-form-input
            id="input-2"
            v-model="user_form.email"
            type="email"
            required
            placeholder="Email address"
            class="mx-1 input-box"
            :readonly="action=='Edit'"
            :class="{ 'is-invalid': user_form.errors.has('email') }"
          ></b-form-input>
          <has-error :form="user_form" field="email"></has-error>
        </b-form-group>
        </div>
        <b-form-group>
          <b-form-input
            id="input-1"
            v-model="user_form.company_name"
            type="text"
            required
            placeholder="Company name"
            class="mx-1 input-box"
            :class="{ 'is-invalid': user_form.errors.has('company_name') }"
          ></b-form-input>
          <has-error :form="user_form" field="company_name"></has-error>
        </b-form-group>
        <b-form-group v-if="action=='Edit'">
          <b-form-input
            id="input-1"
            v-model="user_form.daily_login_count"
            type="number"
            required
            placeholder="Today login count"
            class="mx-1 input-box"
            :class="{ 'is-invalid': user_form.errors.has('daily_login_count') }"
          ></b-form-input>
          <has-error :form="user_form" field="daily_login_count"></has-error>
        </b-form-group>
        <b-form-group v-if="action=='Edit'">
          <b-form-input
            id="input-1"
            v-model="user_form.plan_expiry_date"
            type="date"
            class="mx-1 input-box"
            :class="{ 'is-invalid': user_form.errors.has('plan_expiry_date') }"
          ></b-form-input>
          <has-error :form="user_form" field="plan_expiry_date"></has-error>
        </b-form-group>
        <b-form-group>
          <b-input-group class="input-group-merge">
            <div class="custom-dropdown" ref="dropdownContainer" @click="toggleDropdown">
              <input type="text" v-model="searchQuery" placeholder="Search source" id="from_id" class="form-control">
              <div v-if="isDropdownOpen" class="dropdown-options">
                <div v-for="(item, index) in filteredLocations" :key="index" @click="selectOption(item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
              </div>
            </div>
            <!-- <treeselect :options="location" :value="user_form.origin_airport_code" v-model="user_form.origin_airport_code" :multiple="false" :searchable="true" placeholder="Select Origin City" :normalizer="normalizer"></treeselect> -->
          </b-input-group>
        </b-form-group>
        <b-form-group v-if="action=='Add'">
          <b-form-input
            id="input-5"
            v-model="user_form.password"
            type="password"
            required
            placeholder="Password"
            class="ml-1 input-box"
            :class="{ 'is-invalid': user_form.errors.has('password') }"
          ></b-form-input>
          <has-error :form="user_form" field="password"></has-error>
        </b-form-group>
        <b-form-group v-if="action=='Edit'">
          <input type="checkbox" v-model="user_form.is_active" class="ml-1 input-box"> <span v-if="user_form.is_active">Active</span><span v-else>InActive</span>
        </b-form-group>
        <has-error :form="user_form" field="is_admin"></has-error>
        <div class="alert alert-success mt-3" role="alert" id="fade">
          <span class="font-weight-bolder font-size-h6">Saved Successfully</span>
        </div>
         <button  class="btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white mt-3">{{action}} user</button>
      </div>
    </b-form>
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
        company_name:'',
        daily_login_count:'',
        password: "",
        is_active:"",
        plan_expiry_date:'',
      }),
      action: 'Add',
      location:[],
      searchQuery: '',
      isDropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(item) {
      this.user_form.origin_airport_code = item.iata_code;
      let source_name= item.destination;
      let final_set=this.user_form.origin_airport_code+"("+source_name+")";
      this.searchQuery=final_set;
    },
    closeDropdown(event) {
      const dropdownContainer = this.$refs.dropdownContainer;
      if (!dropdownContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      if(this.action=='Add'){
        this.user_form.post(`/superadmin/create-user`)
        .then(({ data }) => {
          this.$router.push('/superadmin/all-users');
        })
        .catch(err => {
          //   this.openNotification(err);
        });
      }
      else{
        this.user_form.put(`/superadmin/edit-user/${this.user_form.id}`)
        .then(({ data }) => {
           $('#fade').fadeToggle(1000);
           $('#fade').fadeToggle(1000);
        })
      }
    },
    getData(id){
      ApiService.get(`/superadmin/all-user/${id}`)
        .then(({ data }) => {
          this.user_form.fill(data[0])
          this.searchQuery=data[0].origin_airport_code;
        })
    },
    getLocation(){
      ApiService.get(`/superadmin/get-location`)
        .then(({ data }) => {
          this.location=data;
          // data.forEach((element) => {
          //   this.location.push({
          //     value: element["iata_code"],
          //     name: element["iata_code"] + " (" + element["destination"] + ")",
          //   });
          // });
        })
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
   if(this.get_item){
      this.getData(this.get_item);
      this.action='Edit';
   }
   window.addEventListener('click', this.closeDropdown);
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
        return this.location;
      }
      const query = this.searchQuery.toLowerCase();
      return this.location.filter(item => {
          return (
              // item.destination.toLowerCase().includes(query) || // Filter by destination
              item.iata_code.toLowerCase().includes(query)      // Filter by iata_code
          );
      });
    }
  },
};
</script>
<style scoped>
.fw-700{
    font-weight: 700;
}
.input-box{
    border: 1px silver solid;
}
.create_btn{
    background: #00A1E4;
}
#fade{
  display: none;
}

.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  border: solid 1px silver;
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
}

.option {
  padding: 5px 10px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
}
</style>
