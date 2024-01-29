<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-sm-12 card-box">
        <div class="card card-default">
          <div class="card-header h2">Reset Password</div>
          <div class="card-body">  
              <!-- this is Form -->
            <div class="text-success h4" v-if="password_changed">Password reset successful&nbsp; <router-link to="/">Login</router-link></div>
            <form autocomplete="off" @submit.prevent="ResetPassword" v-if="has_error">
              <div class="form-group">
                  <span for="email">E-mail</span>&nbsp;&nbsp;&nbsp;
                  <input type="email" id="email" class="form-control" :value="forget_password.email" required readonly>
                  <span for="password">Password</span>&nbsp;&nbsp;&nbsp;
                  <input type="password" id="password" class="form-control" v-model="forget_password.password" required>
                  <span for="conform_password">Confirm Password</span>&nbsp;&nbsp;&nbsp;
                  <input type="password" id="password_confirmation" class="form-control" v-model="forget_password.password_confirmation" required>
              </div>
              <button type="submit" class="btn btn-primary">Reset Password</button>
            </form>
            <div class="text-danger" v-else>Forgot password token is invalid</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
      return {
        forget_password:{
            email:'',
            userType: '',
            password:'',
            password_confirmation:'',
        },
        token:'',
        has_error: true,
        password_changed:false,
      }
    },
    methods: {
        ResetPassword() {
            axios.post("/ForgotpasswordActual", this.forget_password).then(res => {
               this.password_changed=true;
            })
            .catch(err=>{
                console.log(err);
            });
        }
    },
    mounted(){
        this.token = this.$route.params.token;
        this.forget_password.email=this.$route.params.email;
        this.forget_password.userType=this.$route.params.userType;
        let credintial={"token":this.token,"email":this.forget_password.email}
        axios.post('/check-forgot-token',credintial).then(res=>{
            if(!res.data.status){
                  this.has_error=false;
            }
        })
        .catch(err=>{
          this.has_error=false;
        })
    }
}
</script>

<style scoped>
@media only screen and (max-width: 600px){
  .card-box{
  margin-top: 25%;
}
}
.card-box{
  margin-top: 10%;
}
</style>