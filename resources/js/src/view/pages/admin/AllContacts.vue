<template>
    <div class="py-5">
      <div class="admin-page-header">
            <h2>Contact Submissions</h2>
        </div>
         
         <div class="admin-glass-card">
            <!-- Filter Controls -->
            <div class="admin-filter-row">
                <div class="d-flex align-items-center">
                    <span class="mr-3 font-weight-bold text-muted">Show:</span>
                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" class="form-control-sm" style="max-width: 120px;"></b-form-select>
                </div>
                <div class="w-md-25">
                    <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Search contacts..." class="py-4"></b-form-input>
                </div>
            </div>

            <!-- Table -->
            <div class="admin-table-wrapper">
              <SkeletonTable v-if="isLoading" :rows="8" :columns="7" />
              <b-table v-else responsive stacked="md" hover :items="items" :fields="fields" primary-key="id" :filter="filter" :current-page="currentPage" :per-page="perPage" @filtered="onFiltered" thead-class="text-uppercase">
                <template #cell(index)="data">
                  <span class="font-weight-bold">#{{ data.index + 1 }}</span>
                </template>

                <template #cell(first_name)="data">
                    <div class="font-weight-bold text-dark">{{ data.item.first_name }} {{ data.item.last_name }}</div>
                </template>

                <template #cell(message)="data">
                    <div class="text-wrap text-muted" style="max-width: 300px; font-size: 0.9rem;">{{ data.item.message }}</div>
                </template>

                <template #cell(action)="data">
                 <button class="btn btn-icon btn-light-danger btn-sm" @click="delete_contacts(data.item['id'])">
                    <i class="fas fa-trash-alt font-size-sm"></i>
                 </button>
                </template>
             </b-table>
            </div>

            <!-- Footer -->
            <div class="admin-pagination-wrap">
                 <div class="text-muted font-weight-bold font-size-sm">
                    Showing {{ items.length ? (currentPage - 1) * perPage + 1 : 0 }} to {{ Math.min(currentPage * perPage, totalRows) }} of {{ totalRows }}
                 </div>
                 <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" size="sm" class="my-0"></b-pagination>
            </div>
         </div>
    </div>
  </template>
  
  <script>
  import SkeletonTable from "../../components/SkeletonTable.vue";
  import adminListMixin from "@/core/mixins/adminList.mixin";
  export default {
    name: "superadmin-allcontacts",
    mixins: [adminListMixin],
    data() {
      return {
        fields: [
          {label:'Sl',key:'index'},
          {label:'Full Name',key:"first_name"},
          // {label:'Last Name',key:"last_name"},  // Merged above in template
          {label:'Email',key:"email"},
          {label:'Phone', key:"phone" },
          {label:'Message',key:"message"},
          {label:"Action",key:"action"}
          ],
      };
    },
    components: {
        SkeletonTable
    },
    methods: {
      delete_contacts(id){
        this.confirmRemove(`/delete-contact/${id}`, "Are you sure you want to delete this contact?")
          .then(removed => { if (removed) this.get_contacts(); });
      },
      get_contacts(){
        return this.loadItems(`/all-contacts/`);
      },
    },
    mounted(){
       this.get_contacts();
    },
  };
  </script>