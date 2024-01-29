<template>
  <div class="mt-10 p-5 d-flex" style="justify-content: space-between;">
    <div class="w-md-50">
      <b-form class="fw-700 mt-5">
      <h3 class="fw-700">Personal details</h3>
      <div class="bg-white p-10 rounded">
        <b-form-group>
          <b-form-input
            id="input-3"
            type="text"
            v-model="user_form.name"
            required
            readonly
            placeholder="Name"
            class="ml-1 input-box"
          ></b-form-input>
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
        </b-form-group>
      </div>
      </b-form>
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
      user_form:new Form({  
        name:"",
        email:"",
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
      ApiService.put(`/user/upadte-detail`, this.user_form)
        .then(({ data }) => {
           $('#fade1').fadeToggle(1000);
           $('#fade1').fadeToggle(1000);
        })
    },
    submitPassword(evt){
        evt.preventDefault();
        ApiService.put(`/user/update-password`, this.password_form)
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
    ...mapGetters({ current_user: 'currentUser' }),
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
