<template>
    <div class="mt-5">
      <div class="d-flex ml-2" style="justify-content: space-between;">
            <h2>Contact</h2>
        </div>
         <div class="mt-2" id="table_data">
          <div class="float-left">
              <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
          </div>
            <div class="float-right">
             <div class="w-100">
                <b-form-group label-for="filter-input">
                   <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>
                </b-form-group>
             </div>
            </div>
            <div class="text-center bg-white px-5 py-10 mt-5 rounded">
              <b-table :bordered="true" responsive :items="items" :fields="fields" style="white-space:nowrap" primary-key="id" :filter="filter" :current-page="currentPage" :per-page="perPage"  @filtered="onFiltered">
                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(action)="data">
                 <b-button variant="danger" v-on:click="delete_contacts(data.item['id'])">Delete</b-button>
                </template>
             </b-table>
            <div class="float-right">
                 <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
            </div>
            </div>
          </div>
    </div>
  </template>
  
  <script>
  import ApiService from "@/core/services/api.service";
  export default {
    name: "superadmin-allcontacts",
    data() {
      return {
        fields: [
          {label:'Sl',key:'index'},
          {label:'First Name',key:"first_name"},
          {label:'Last Name',key:"last_name"},
          {label:'Email Address',key:"email"},
          {label:'Phone No', key:"phone" },
          {label:'Message',key:"message"},
          {label:"Action",key:"action"}
          ],
        items: [],
        current_date:'',
        filter: null,
        totalRows: 0,
        currentPage: 1,
        perPage: 10,
        pageOptions: [10, 15, 20,{ value: 100, text: "Show a lot" }],
      };
    },
    methods: {
      delete_contacts(id){
        var proceed = confirm("Are you sure you want to delete this contact?");
        if(proceed){
          ApiService.delete(`/delete-contact/${id}`)
          .then(({ data }) => {
            this.get_contacts();
          })
        }
      },
      get_contacts(){
        this.items=[];
        ApiService.get(`/all-contacts/`)
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
       this.get_contacts();
       this.current_date = new Date().toISOString().slice(0, 10);
    },
  };
  </script>
  
  <style>
  .create_btn{
      background: #00A1E4;
      padding: 9px 25px !important;
  }
  </style>