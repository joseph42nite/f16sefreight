<template>
    <div class="py-5">
        <div class="admin-page-header">
            <h2>Company Registry</h2>
            <router-link to="/superadmin/new-company" class="admin-pill-btn text-white">
                <i class="fas fa-plus-circle"></i>
                Add Company
            </router-link>
        </div>
        
        <div class="admin-glass-card">
            <!-- Filters -->
            <div class="admin-filter-row">
                <div class="d-flex align-items-center">
                    <span class="mr-3 font-weight-bold text-muted">Show:</span>
                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" class="form-control-sm" style="max-width: 120px;"></b-form-select>
                </div>
                <div class="w-md-25">
                    <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Search company..." class="py-4"></b-form-input>
                </div>
            </div>

            <!-- Table Content -->
            <div class="admin-table-wrapper">
                <SkeletonTable v-if="isLoading" :rows="8" :columns="3" />

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
                            <div class="symbol symbol-35 symbol-light-success mr-3">
                                <span class="symbol-label font-size-h5 font-weight-bolder">{{ data.item.name.charAt(0).toUpperCase() }}</span>
                            </div>
                            <span class="font-weight-bolder text-dark">{{ data.item.name }}</span>
                        </div>
                    </template>

                    <template #cell(tier)="data">
                        <b-badge :variant="getTierBadgeVariant(data.item.tier)" class="text-uppercase font-weight-bold px-3 py-2">
                            {{ formatTierName(data.item.tier) }}
                        </b-badge>
                    </template>

                    <template #cell(credit_limit)="data">
                        <span class="font-weight-bold text-dark">{{ formatCurrency(data.item.credit_limit) }}</span>
                    </template>

                    <template #cell(credit_balance)="data">
                        <span class="font-weight-bold text-success" v-if="data.item.credit_balance > 0">
                            {{ formatCurrency(data.item.credit_balance) }}
                        </span>
                        <span class="text-muted" v-else>
                            $0.00
                        </span>
                    </template>

                    <template #cell(action)="data">
                        <router-link :to="'/superadmin/new-company/' + data.item['id']" class="btn btn-icon btn-light-primary btn-sm">
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
    name: "superadminallcompany",
    data() {
        return {
            fields: [
                { label: "Sl", key: "index" },
                { label: "Company Name", key: "name" },
                { label: "Service Tier", key: "tier" },
                { label: "Credit Limit", key: "credit_limit" },
                { label: "Available Balance", key: "credit_balance" },
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
        get_company() {
            this.items = [];
            this.isLoading = true;
            ApiService.get(`/superadmin/all-company/0`)
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
        getTierBadgeVariant(tier) {
            switch(tier) {
                case 'viper_core': return 'light-primary';
                case 'premium': return 'light-success';
                case 'enterprise': return 'light-warning';
                default: return 'light-info';
            }
        },
        formatTierName(tier) {
            if (!tier) return 'Core';
            return tier.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
        },
    },
    mounted() {
        this.get_company();
        this.current_date = new Date().toISOString().slice(0, 10);
    },
};
</script>
