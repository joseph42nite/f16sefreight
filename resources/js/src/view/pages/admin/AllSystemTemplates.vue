<template>
    <div class="mt-10 p-5">
        <div class="d-flex justify-content-between align-items-center mb-8">
            <h2 class="font-weight-bolder text-dark">System OCR Templates</h2>
            <router-link to="/superadmin/edit-template" class="btn btn-primary font-weight-bold px-6">
                <i class="la la-plus mr-2"></i> Create New Template
            </router-link>
        </div>

        <div class="bg-white p-8 rounded shadow-sm border">
            <div class="table-responsive">
                <table class="table table-vertical-center table-head-custom table-borderless">
                    <thead>
                        <tr class="text-left text-uppercase">
                            <th style="min-width: 200px" class="pl-7"><span class="text-muted">System Key</span></th>
                            <th><span class="text-muted">Fields Count</span></th>
                            <th><span class="text-muted">Last Modified</span></th>
                            <th class="text-right pr-7"><span class="text-muted">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="4" class="text-center p-10 text-muted">
                                <b-spinner small class="mr-2"></b-spinner> Loading system configurations...
                            </td>
                        </tr>
                        <tr v-else v-for="row in items" :key="row.id" class="border-bottom">
                            <td class="pl-7">
                                <span class="font-weight-bolder text-dark-75 font-size-h6">{{ row.key }}</span>
                            </td>
                            <td>
                                <span class="badge badge-light-info font-weight-bold">
                                    {{ Object.keys(row.coordinates || {}).length }} standard regions
                                </span>
                            </td>
                            <td>
                                <span class="text-muted font-size-sm">
                                    {{ formatDate(row.updated_at) }}
                                </span>
                            </td>
                            <td class="text-right pr-7">
                                <b-button variant="light-primary" size="sm" class="font-weight-bold mr-2" @click="editRow(row)">
                                    Edit Grid
                                </b-button>
                                <b-button variant="light-danger" size="sm" @click="deleteRow(row)">
                                    <i class="flaticon2-trash"></i>
                                </b-button>
                            </td>
                        </tr>
                        <tr v-if="!loading && items.length === 0">
                            <td colspan="4" class="text-center p-10 text-muted">No system templates defined. Click 'Create New' to bootstrap.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            items: [],
            loading: true
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;
            ApiService.get("/superadmin/system-templates")
                .then(({ data }) => {
                    this.items = data.templates || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        formatDate(dateString) {
            if (!dateString) return "N/A";
            const d = new Date(dateString);
            return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        },
        editRow(row) {
            this.$router.push(`/superadmin/edit-template/${row.key}`);
        },
        deleteRow(row) {
            Swal.fire({
                title: "Delete Master Template?",
                text: `This will permanently remove the '${row.key}' definition from physical disk. This cannot be undone.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Confirm Destroy",
                confirmButtonColor: "#F64E60"
            }).then((result) => {
                if (result.isConfirmed) {
                    ApiService.delete(`/superadmin/system-templates/${row.id}`)
                        .then(() => {
                            Swal.fire("Erased!", "Template successfully decommissioned.", "success");
                            this.fetchData();
                        })
                        .catch(err => {
                            const msg = err.response?.data?.message || "Failed to perform excision.";
                            Swal.fire("Access Blocked", msg, "error");
                        });
                }
            });
        }
    }
};
</script>
