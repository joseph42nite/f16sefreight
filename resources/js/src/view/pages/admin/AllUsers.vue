<template>
  <div class="py-5">
    <div class="admin-page-header">
      <h2>User Registry</h2>
      <router-link to="/superadmin/new-users" class="admin-pill-btn text-white">
        <i class="fas fa-plus-circle"></i>
        Add New User
      </router-link>
    </div>

    <div class="admin-glass-card">
      <!-- Filtering and Pagination Size Bar -->
      <div class="admin-filter-row">
        <div class="d-flex align-items-center">
          <span class="mr-3 font-weight-bold text-muted">Show:</span>
          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" class="form-control-sm" style="max-width: 120px;"></b-form-select>
        </div>
        
        <div class="w-md-25">
          <b-input-group size="sm">
            <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Search users..." class="py-4"></b-form-input>
          </b-input-group>
        </div>
      </div>

      <div class="admin-table-wrapper">
        <SkeletonTable v-if="isLoading" :rows="10" :columns="6" />
        
        <b-table 
          v-else 
          responsive 
          hover 
          :items="items" 
          :fields="fields" 
          primary-key="id" 
          :filter="filter" 
          :current-page="currentPage" 
          :per-page="perPage"  
          @filtered="onFiltered"
          thead-class="text-uppercase"
        >
          <template #cell(index)="data">
            <span class="font-weight-bold">#{{ data.index + 1 }}</span>
          </template>
          
          <template #cell(name)="data">
             <div class="d-flex align-items-center">
               <div class="symbol symbol-35 symbol-light-primary mr-3">
                 <span class="symbol-label font-size-h5 font-weight-bolder">{{ data.item.name.charAt(0).toUpperCase() }}</span>
               </div>
               <span class="font-weight-bolder text-dark">{{ data.item.name }}</span>
             </div>
          </template>

          <template #cell(is_active)="data">
            <span class="status-badge" :class="data.item.is_active == 1 ? 'status-active' : 'status-inactive'">
              {{ data.item.is_active == 1 ? 'Active' : 'Inactive' }}
            </span>
          </template>

          <template #cell(action)="data">
            <div class="d-flex gap-2">
              <router-link :to="'/superadmin/new-users/'+data.item['id']" class="btn btn-icon btn-light-primary btn-sm mr-2">
                <i class="fas fa-pen font-size-sm"></i>
              </router-link>
              <button class="btn btn-icon btn-light-danger btn-sm" @click="delete_user(data.item['id'])">
                <i class="fas fa-trash font-size-sm"></i>
              </button>
            </div>
          </template>
        </b-table>
      </div>

      <!-- Pagination Wrap -->
      <div class="admin-pagination-wrap">
        <div class="text-muted font-weight-bold font-size-sm">
          Showing {{ items.length ? (currentPage - 1) * perPage + 1 : 0 }} to {{ Math.min(currentPage * perPage, totalRows) }} of {{ totalRows }} entries
        </div>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" size="sm" class="my-0"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import SkeletonTable from "../../components/SkeletonTable.vue";
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
        // {label:'Today login count',key:"daily_login_count"},
        // {label:'Plan expiry date',key:"plan_expiry_date"},
        // {label:'Plan status',key:"plan_status"},
        {label:"Action",key:"action"}
        ],
      items: [],
      isLoading: false,
      current_date:'',
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
      this.isLoading = true;
      ApiService.get(`/superadmin/all-user/0`)
        .then(({ data }) => {
          this.items=data;
          this.totalRows=data.length;
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
     onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  components: {
    SkeletonTable
  },
  mounted(){
     this.get_users();
     this.current_date = new Date().toISOString().slice(0, 10);
  },
};
</script>