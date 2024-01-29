<template>
  <div class="mt-10 p-5">
    <b-form
      @submit="onSubmit"
      class="w-md-50 fw-700"
    >
      <h3 class="fw-700">Personal details</h3>
      <div class="bg-white p-10 rounded">
        <b-form-group>
          <b-form-input
            id="input-3"
            type="text"
            v-model="user_form.name"
            required
            placeholder="Name"
            class="ml-1 input-box"
          ></b-form-input>
          <!-- <has-error :form="form" field="address2"></has-error> -->
        </b-form-group>
        <b-form-group>
          <b-form-input
            id="input-3"
            v-model="user_form.email"
            type="email"
            required
            placeholder="Email"
            class="ml-1 input-box"
            readonly
          ></b-form-input>
          <!-- <has-error :form="form" field="email"></has-error> -->
        </b-form-group>
        <div class="alert alert-success" role="alert" id="fade1">
          <span class="font-weight-bolder font-size-h6">Saved Successfully</span>
        </div>
         <button  class="btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white">Save details</button>
      </div>
      </b-form>
      <b-form
      @submit="submitPassword"
      class="w-md-50 fw-700"
    >
      <h3 class="font-weight-bolder mt-10">Reset password</h3>
      <div class="bg-white p-10 rounded">
        <b-form-group>
          <b-form-input
            id="input-4"
            v-model="password_form.password"
            type="password"
            required
            placeholder="Password"
            class="ml-1 input-box"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            id="input-4"
            v-model="password_form.password_confirmation"
            type="password"
            required
            placeholder="Confirm password"
            class="ml-1 input-box"
          ></b-form-input>
        </b-form-group>
        <!-- <has-error :form="form" field="password"></has-error> -->
        <div class="alert alert-success" role="alert" id="fade">
          <span class="font-weight-bolder font-size-h6">Saved Successfully</span>
        </div>
         <button  class="btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white">Save password</button>
      </div>
    </b-form>
  </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import { mapGetters } from "vuex";
import { LOGOUT} from "@/core/services/store/auth.module";
export default {
  data() {        
    return {
      user_form:new Form({  
        name: "",
        email: "",
      }),
      password_form:new Form({  
        password: "",
        password_confirmation: "",
      }),
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      ApiService.put(`/superadmin/upadte-detail`, this.user_form)
        .then(({ data }) => {
           $('#fade1').fadeToggle(1000);
           $('#fade1').fadeToggle(1000);
        })
    },
    submitPassword(evt){
        evt.preventDefault();
        ApiService.put(`/superadmin/update-password`, this.password_form)
            .then(({ data }) => {
                this.$store.dispatch(LOGOUT)
                .then(() => this.$router.push('/login'));
            })
    },
  },
  mounted(){
      this.user_form.name=this.current_user.name;
      this.user_form.email=this.current_user.email;
  },
computed: {
    ...mapGetters({ current_user: 'currentUser' })
},
};
</script>
<style scoped>
.fw-700{
    font-weight: 700;
}
.input-box{
    padding: 4%;
    border: 1px silver solid;
}
.create_btn{
    background: #00A1E4;
}
#fade{
  display: none;
}
#fade1{
  display: none;
}
</style>
