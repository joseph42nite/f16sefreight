<template>
    <div class="py-5">
        <div class="admin-page-header d-flex justify-content-between align-items-center mb-8">
            <h2>Client AWB Tracking Logs</h2>
            <b-button @click="exportCSV" variant="success" class="admin-pill-btn text-white px-6 font-weight-bold">
                <i class="fas fa-file-csv mr-2"></i> Export to CSV
            </b-button>
        </div>
        
        <div class="admin-glass-card p-6" style="background: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(53, 85, 148, 0.05); border: 1px solid #e2e8f0;">
            <!-- Filters -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-6">
                <div class="d-flex flex-wrap align-items-center gap-3">
                    <div class="d-flex align-items-center">
                        <label class="mr-2 font-weight-bold text-muted mb-0">From:</label>
                        <b-form-input type="date" v-model="fromDate" class="form-control-sm" style="max-width: 160px;"></b-form-input>
                    </div>
                    <div class="d-flex align-items-center">
                        <label class="mr-2 font-weight-bold text-muted mb-0">Till:</label>
                        <b-form-input type="date" v-model="toDate" class="form-control-sm" style="max-width: 160px;"></b-form-input>
                    </div>
                    <b-button @click="fetchLogs" variant="primary" size="sm" class="px-4">
                        Filter
                    </b-button>
                </div>
                <div class="w-md-25">
                    <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Search logs..." class="py-4"></b-form-input>
                </div>
            </div>

            <!-- Table Content -->
            <div class="admin-table-wrapper table-responsive">
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
                    thead-class="text-uppercase text-muted"
                >
                    <template #cell(index)="data">
                        <span class="font-weight-bold text-muted">#{{ data.index + 1 }}</span>
                    </template>

                    <template #cell(original_filename)="data">
                        <span class="font-weight-bolder text-dark">{{ data.item.original_filename }}</span>
                    </template>

                    <template #cell(document_type)="data">
                        <span class="badge badge-light-primary text-uppercase font-weight-bold">{{ formatDocType(data.item.document_type) }}</span>
                    </template>

                    <template #cell(status)="data">
                        <span :class="getStatusBadgeClass(data.item.status)" class="badge font-weight-bolder text-uppercase">
                            {{ data.item.status }}
                        </span>
                    </template>

                    <template #cell(created_at)="data">
                        <span class="text-muted">{{ data.item.created_at }}</span>
                    </template>
                </b-table>
            </div>

            <!-- Pagination -->
            <div class="admin-pagination-wrap d-flex justify-content-between align-items-center mt-6">
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
    name: "ClientAwbTracking",
    components: {
        SkeletonTable
    },
    data() {
        return {
            fields: [
                { label: "Sl", key: "index" },
                { label: "Filename", key: "original_filename", sortable: true },
                { label: "Doc Type", key: "document_type", sortable: true },
                { label: "Company", key: "company_name", sortable: true },
                { label: "Operator", key: "operator_name", sortable: true },
                { label: "Status", key: "status", sortable: true },
                { label: "Created At", key: "created_at", sortable: true },
            ],
            items: [],
            isLoading: false,
            filter: null,
            fromDate: "",
            toDate: "",
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
        };
    },
    methods: {
        fetchLogs() {
            this.isLoading = true;
            this.items = [];
            
            const params = {};
            if (this.fromDate) params.from_date = this.fromDate;
            if (this.toDate) params.to_date = this.toDate;

            ApiService.get("/superadmin/client-awbs", { params })
                .then(({ data }) => {
                    if (data && data.status) {
                        this.items = data.data || [];
                        this.totalRows = this.items.length;
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch client logs:", err);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        getStatusBadgeClass(status) {
            switch (status) {
                case "completed":
                    return "badge-light-success";
                case "failed":
                    return "badge-light-danger";
                case "processing":
                    return "badge-light-info";
                default:
                    return "badge-light-warning";
            }
        },
        formatDocType(type) {
            if (!type) return "N/A";
            return type.replace(/_/g, " ");
        },
        exportCSV() {
            if (!this.items.length) {
                alert("No records to export.");
                return;
            }
            const headers = ['ID', 'Filename', 'Doc Type', 'Company', 'Operator', 'Status', 'Date Created', 'Date Completed'];
            const rows = this.items.map(item => [
                item.id,
                `"${item.original_filename.replace(/"/g, '""')}"`,
                item.document_type,
                `"${item.company_name.replace(/"/g, '""')}"`,
                `"${item.operator_name.replace(/"/g, '""')}"`,
                item.status,
                item.created_at,
                item.completed_at
            ]);

            const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `client_awb_logs_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    mounted() {
        this.fetchLogs();
    }
};
</script>

<style scoped>
.gap-3 {
    gap: 1rem;
}
.gap-4 {
    gap: 1.5rem;
}
.admin-page-header h2 {
    color: #355594;
    font-weight: 800;
    letter-spacing: -0.5px;
}
.admin-pill-btn {
    border-radius: 30px;
    font-size: 0.95rem;
}
</style>
