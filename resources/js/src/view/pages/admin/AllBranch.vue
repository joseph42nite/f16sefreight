<template>
    <div class="py-5">
        <div class="admin-page-header">
            <h2>Branch Registry</h2>
            <router-link to="/superadmin/new-branch" class="admin-pill-btn text-white">
                <i class="fas fa-plus-circle"></i>
                Add Branch
            </router-link>
        </div>

        <div class="admin-glass-card">
            <!-- Filter Head -->
            <div class="admin-filter-row">
                <div class="d-flex align-items-center">
                    <span class="mr-3 font-weight-bold text-muted">Show:</span>
                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" class="form-control-sm" style="max-width: 120px;"></b-form-select>
                </div>
                <div class="w-md-25">
                    <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Search branches..." class="py-4"></b-form-input>
                </div>
            </div>

            <!-- Table -->
            <div class="admin-table-wrapper">
                <SkeletonTable v-if="isLoading" :rows="8" :columns="6" />
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
                    
                    <template #cell(agent_name)="data">
                        <span class="font-weight-bold text-dark">{{ data.item.agent_name }}</span>
                    </template>
                    
                    <template #cell(iata_agent_code)="data">
                        <code class="font-weight-bold" style="font-size: 0.85rem; background: #F3F6F9; padding: 2px 6px; border-radius: 4px;">{{ data.item.iata_agent_code }}</code>
                    </template>

                    <template #cell(action)="data">
                        <router-link :to="'/superadmin/new-branch/' + data.item['id']" class="btn btn-icon btn-light-primary btn-sm">
                            <i class="fas fa-pen font-size-sm"></i>
                        </router-link>
                    </template>
                </b-table>
            </div>

            <!-- Pagination -->
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
import ApiService from "@/core/services/api.service";
import SkeletonTable from "../../components/SkeletonTable.vue";
export default {
    name: "superadminallbranch",
    data() {
        return {
            fields: [
                { label: "Sl", key: "index" },
                { label: "Company", key: "company_name.name" },
                { label: "Agent Name", key: "agent_name" },
                { label: "Agent code", key: "iata_agent_code" },
                { label: "Agent Cass", key: "iata_agent_cass" },
                { label: "Action", key: "action" },
            ],
            items: [],
            isLoading: false,
            current_date: "",
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],
        };
    },
    components: {
        SkeletonTable
    },
    methods: {
        get_branch() {
            this.items = [];
            this.isLoading = true;
            ApiService.get(`/superadmin/all-branch/0`)
              .then(({ data }) => {
                this.items = data;
                this.totalRows = data.length;
              })
              .finally(() => {
                this.isLoading = false;
              });
        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
    },
    mounted() {
        this.get_branch();
        this.current_date = new Date().toISOString().slice(0, 10);
    },
};
</script>
