<template>
 <div class="container">
  <div class="row">
    <div>
      <h1>hello</h1>
    </div>
  </div>
 </div>
</template>

<!-- Load login custom page styles -->
<style lang="scss">
@import "@/assets/sass/pages/login/login-1.scss";
</style>

<script>
import formValidation from "@/assets/plugins/formvalidation/dist/es6/core/Core";
import axios from 'axios';
// FormValidation plugins
import Trigger from "@/assets/plugins/formvalidation/dist/es6/plugins/Trigger";
import Bootstrap from "@/assets/plugins/formvalidation/dist/es6/plugins/Bootstrap";
import SubmitButton from "@/assets/plugins/formvalidation/dist/es6/plugins/SubmitButton";
import KTUtil from "@/assets/js/components/util";
import { mapGetters, mapState } from "vuex";
import { LOGIN, LOGOUT} from "@/core/services/store/auth.module";
import Swal from "sweetalert2";

export default {
name: "login-1",
data() {
  return {
    state: "signin",
    email_send: false,
    check_email:false,
    email:'',
    // Remove this dummy login info
    form: {
      email: "",
      password: ""
    }
  };
},
computed: {
  ...mapState({
    errors: state => state.auth.errors
  }),
  ...mapGetters(["currentUser"]),

  backgroundImage() {
    return (
      process.env.BASE_URL + "media/svg/illustrations/login-visual-1.svg"
    );
  }
},
mounted() {
  const signin_form = KTUtil.getById("kt_login_signin_form");
  this.fv = formValidation(signin_form, {
    fields: {
      email: {
        validators: {
          notEmpty: {
            message: "Username is required"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "Password is required"
          }
        }
      }
    },
    plugins: {
      trigger: new Trigger(),
      submitButton: new SubmitButton(),
      bootstrap: new Bootstrap()
    }
  });
  this.fv.on("core.form.valid", () => {
    var email = this.form.email;
    var password = this.form.password;

    // clear existing errors
    this.$store.dispatch(LOGOUT);

    // send login request
      this.$store.dispatch(LOGIN, { email, password })
  });

  this.fv.on("core.form.invalid", () => {
    Swal.fire({
      title: "",
      text: "Please, provide correct data!",
      icon: "error",
      confirmButtonClass: "btn btn-secondary",
      heightAuto: false
    });
  });
},
methods: {
  showForm(form) {
    this.state = form;
    var form_name = "kt_login_" + form + "_form";
    KTUtil.animateClass(
      KTUtil.getById(form_name),
      "animate__animated animate__backInUp"
    );
  },
  requestResetPassword() {
      axios.post("/Forgotpassword", {email: this.email}).then(result => {
          this.email_send=true;
          this.check_email=false;
      })
      .catch(err=>{
        this.check_email=true;
        this.email_send=false;
      })
  }  
},
};
</script>
<style scoped>
.btn-color{
background:#00A1E4;
}
.image-div{
height: 100%;
}
.text-al{
text-align: -webkit-center;
}
@media (min-width: 720px){
}
@media (max-width: 720px){
.login-content{
  padding: 5%;
}
.image-div{
  height: 70%;
}
}
</style>
