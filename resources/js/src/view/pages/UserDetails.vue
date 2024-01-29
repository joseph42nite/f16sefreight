<template>
    <div class="row" v-if="data_loded">
        <h2 class="ml-5">{{branch_detail['association']['association_name']}}</h2>
            <div class="col-sm-12 mt-3">
            <div class="mb-3"><button class="btn btn-primary" @click="handleBackButtonClick"><span><i class="fas fa-angle-double-left" style="margin-top: -3px;"></i> <span style="font-weight: 700;font-size: 15px;">Back</span></span></button></div>
                <h3>Submission details</h3>
                <div class="mb-5">
                    <div class="bg-white p-5 rounded" style="width:auto;float:left;">
                        <div class="d-flex"><h4>Association:-</h4>&nbsp;<h5>{{branch_detail['association']['name']}}</h5></div>
                        <div class="d-flex"><h4>Branch:-</h4>&nbsp;<h5>{{branch_detail['branch_name']}}</h5></div>
                        <div class="d-flex"><h4>Date:-</h4>&nbsp;<h5>{{ moment(branch_detail['created_at']).format('MM-DD-YYYY HH:mm:ss') }}</h5></div>
                    </div>
                </div>
                <br><br><br><br><br>
                <h3 class="mb-1 mt-3">Personal details</h3>
                <div class="bg-white p-5 rounded" style="margin-right: 2%">
                    <div class="mb-3 input-value-div" style="width:48%; float: right;">
                        <span>Last name</span><br>
                        <input type="text" :value="branch_detail['last_name']" class="input-value" readonly>   
                    </div>
                    <div class="mb-3 input-value-div" style="width:48%;">
                        <span>First name</span><br>
                         <input type="text" :value="branch_detail['first_name']" class="input-value" readonly>  
                    </div>
                    <div class="mb-3" style="width:31%;float: right;">
                        <span>Number of people in household</span><br>
                        <input type="text" :value="branch_detail['no_of_people']" class="input-value" readonly> 
                    </div>
                    <div class="mb-3" style="width:31%;float: right;padding-right: 4%;">
                        <span>Member/lead id</span><br>
                        <input type="text" :value="branch_detail['lead_id']" class="input-value" readonly>
                    </div>
                    <div class="mb-3" style="width:31%;">
                        <span>Email id</span><br>
                        <input type="text" :value="branch_detail['email_id']" class="input-value" readonly> 
                    </div>
                    <div class="mb-3 input-value-div">
                        <span>Address</span><br>
                        <input type="text" :value="branch_detail['street_address']" class="input-value" readonly style="padding:7px">
                    </div>
                    <div class="mb-3 input-value-div" style="width:31%;float: right;">
                        <span>Zip code</span><br>
                        <input type="text" :value="branch_detail['zip_code']" class="input-value" readonly>
                    </div>
                    <div class="mb-3 input-value-div" style="width:31%;float: right;padding-right: 4%;">
                        <span>State</span><br>
                        <input type="text" :value="branch_detail['state']" class="input-value" readonly>
                    </div>
                    <div class="mb-3 input-value-div" style="width:31%;">
                        <span>City</span><br>
                        <input type="text" :value="branch_detail['city']" class="input-value" readonly>
                    </div>
                </div>
                <div class="bg-white px-3 pb-1 mt-5 rounded" style="margin-right: 2%" v-if="branch_detail['comment']">
                    <span>Comments</span><br>
                    <h5>{{branch_detail['comment']}}</h5>
                    
                </div>
                <p class="fw mt-5" style="font-size: 18px;">{{branch_detail['first_name']}}
                <span v-if="branch_detail['api_status']=='Qualified'"> 
                  is qualified for the following financial assistance.
                </span>
                <span v-else-if="branch_detail['api_status']=='Not Qualified'">
                  is not qualified for any financial assistance.
                </span>
                <span v-else>
                  - There was no match for this data.
                </span>
                </p>
                <div class="table-responsive text-center bg-white" style="width: 50%">
                    <table class="table table-striped p-2">
                        <tbody>
                        <tr v-for="(key,value) in plans">
                            <td>{{value}}</td>
                            <td>{{key}}</td>
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
      user_id:'',  
      branch_detail:[],
      plans:null,
      data_loded:false,
      start:'',
      end:'',
      status:'',
      page_count:'',
    };
  },
  methods: {
    getUserSumissionDetail(){
        ApiService.get(`/user/user-sumission-detail/${this.user_id}`)
          .then(({ data }) => {
              this.branch_detail=data;
              if(this.branch_detail['zip_code'].toString().length==4)
               this.branch_detail['zip_code']="0"+this.branch_detail['zip_code'];
              if(data['plans']){
              let plan_data=JSON.parse(data['plans']['plans']);
              delete plan_data.index;
              delete plan_data.action;
              delete plan_data.no_of_people;
              this.plans=plan_data;
              }
              this.data_loded=true;
          })
    },
    handleBackButtonClick() {
        this.$router.push({ name: 'user-eligibiltyreport', query: {start:this.start, end:this.end, page_count:this.page_count, status:this.status } });
    }
  },
  mounted(){
      this.user_id=this.$route.params.id;
      this.start=this.$route.params.start;
      this.end=this.$route.params.end;
      this.status=this.$route.params.status;
      this.page_count=this.$route.params.page_count;
      this.getUserSumissionDetail();
  },
};
</script>
<style scoped>
.input-value{
    padding: 1.5%;
    border: 0;
    font-size: 18px;
}
.input-value-div{
  
}
.input-value:focus {
  outline: none;
}
.col-sm-12{
    margin-left: 7px;
    background: #F0F2F5;
    color: black;
}
.table-striped>tbody>tr:nth-child(even)>td {
   background-color: #00A1E4; 
   opacity: 60%;
   color: black;
   font-weight: 900;
 }
.table-striped>tbody>tr:nth-child(odd)>td {
    background-color: whitesmoke; 
   opacity: 60%;
   color: black;
   font-weight: 900;
 }
 .display-flex{
    display: flex !important;
 }
.fw{
    font-weight: bolder;
}
</style>
