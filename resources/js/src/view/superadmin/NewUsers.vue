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
export default {
  data() {
    return {
      user_form:new Form({  
        id:"",
        name: "",
        email: "",
        password: "",
      }),
      action: 'Add',
    };
  },
  methods: {
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
        })
    },
  },
  mounted(){
   if(this.get_item){
      this.getData(this.get_item);
      this.action='Edit';
   }
  },
  computed: {
    get_item: function(){
      if(this.$route.params.id)
      return this.$route.params.id;
      else
      return 0;
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
</style>
