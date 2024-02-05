<template>
  <div class="mt-5">
    <div class="d-flex ml-2" style="justify-content: space-between;">
          <h2>Users</h2>
          <div><button class="btn create_btn font-weight-bold"><router-link class="text-white" to="/superadmin/new-users">Add Users</router-link></button></div>
      </div>
       <div class="mt-2" id="table_data">
           <!-- for number of pages -->
        <div class="float-left">
            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
        </div>
        <!-- end for number of pages -->
        <!-- for filter table -->
          <div class="float-right">
           <div class="w-100">
              <b-form-group label-for="filter-input">
                 <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>
              </b-form-group>
           </div>
          </div>
      <!-- for filter table end -->
          <div class="text-center bg-white px-5 py-10 mt-5 rounded">
            <b-table :bordered="true" responsive :items="items" :fields="fields" style="white-space:nowrap" primary-key="id" :filter="filter" :current-page="currentPage" :per-page="perPage"  @filtered="onFiltered">
              <template #cell(index)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(is_active)="data">
                <span v-if="data.is_active==1">Active</span><span v-else>InActive</span>
              </template>
              <template #cell(action)="data">
              <b-button variant="success"><router-link :to="'/superadmin/new-users/'+data.item['id']" class="text-white">Edit</router-link></b-button>
               <b-button variant="danger" v-on:click="delete_user(data.item['id'])">Delete</b-button>
              </template>
           </b-table>
          <!-- for pagination -->
          <div class="float-right">
               <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
          </div>
          <!-- for pagination end -->
          </div>
        </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
export default {
  name: "superadminalluser",
  data() {
    return {
      fields: [
        {label:'Sl',key:'index'},
        {label:'Name',key:"name"},
        {label:'Email address',key:"email"},
        {label:'Company',key:"company_name"},
        {label:'Status',key:"is_active"},
        {label:'Today login count',key:"daily_login_count"},
        {label:"Action",key:"action"}
        ],
      items: [],
      filter: null,
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, 20,{ value: 100, text: "Show a lot" }],
    };
  },
  methods: {
    delete_user(id){
      var proceed = confirm("Are you sure you want to proceed?");
      if(proceed){
        ApiService.delete(`/superadmin/user/${id}`)
        .then(({ data }) => {
          this.get_users();
        })
      }
    },
    get_users(){
      this.items=[];
      ApiService.get(`/superadmin/all-user/0`)
        .then(({ data }) => {
          this.items=data;
          this.totalRows=data.length;
        })
    },
     onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  mounted(){
     this.get_users();
  },
};
</script>

<style>
.create_btn{
    background: #00A1E4;
    padding: 9px 25px !important;
}
</style>