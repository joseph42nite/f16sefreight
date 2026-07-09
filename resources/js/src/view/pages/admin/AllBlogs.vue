<template>
    <div class="py-5">
        <div class="admin-page-header">
            <h2>Editorial & Blogs Registry</h2>
            <router-link to="/superadmin/new-blog" class="admin-pill-btn text-white">
                <i class="fas fa-plus-circle mr-2"></i>
                Create New Blog
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
                    <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Search blogs..." class="py-4"></b-form-input>
                </div>
            </div>

            <!-- Table Content -->
            <div class="admin-table-wrapper">
                <SkeletonTable v-if="isLoading" :rows="8" :columns="4" />

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
                    thead-class="text-uppercase font-size-xs text-muted"
                    empty-text="No blogs found in the database yet."
                    show-empty
                >
                    <template #cell(image)="data">
                        <div class="symbol symbol-70 symbol-2by3 shadow-sm overflow-hidden" style="border-radius: 8px; background: #eee;">
                            <img :src="data.item.image_path" class="object-fit-cover h-100 w-100" alt="Blog Thumbnail" v-if="data.item.image_path" />
                            <div v-else class="d-flex align-items-center justify-content-center h-100 font-size-xs text-muted">No Image</div>
                        </div>
                    </template>

                    <template #cell(title)="data">
                        <div>
                            <div class="font-weight-bolder text-dark font-size-lg mb-1">{{ data.item.title }}</div>
                            <div class="text-muted font-size-sm">
                                <b-badge variant="light-primary" class="mr-2">{{ data.item.category }}</b-badge>
                                <span>{{ data.item.read_time }} read</span>
                            </div>
                        </div>
                    </template>

                    <template #cell(status)="data">
                        <b-badge :variant="data.item.published_at ? 'light-success' : 'light-warning'">
                            {{ data.item.published_at ? 'Published' : 'Draft' }}
                        </b-badge>
                    </template>

                    <template #cell(date)="data">
                        <span class="text-muted" v-if="data.item.published_at">{{ formatDate(data.item.published_at) }}</span>
                        <span class="text-muted italic" v-else>—</span>
                    </template>

                    <template #cell(action)="data">
                        <div class="d-flex justify-content-end align-items-center">
                            <router-link :to="'/superadmin/new-blog/' + data.item.id" class="btn btn-icon btn-light-primary btn-sm mr-2" v-b-tooltip.hover title="Edit Blog">
                                <i class="fas fa-pen font-size-sm"></i>
                            </router-link>
                            <b-button variant="light-danger" size="sm" class="btn-icon" @click="confirmDelete(data.item)" v-b-tooltip.hover title="Delete">
                                <i class="fas fa-trash font-size-sm"></i>
                            </b-button>
                        </div>
                    </template>
                </b-table>
            </div>

            <!-- Pagination -->
            <div class="admin-pagination-wrap" v-if="totalRows > 0">
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
import Swal from 'sweetalert2';

export default {
    name: "superadminallblogs",
    data() {
        return {
            fields: [
                { label: "Cover", key: "image", thClass: "pl-4", tdClass: "pl-4" },
                { label: "Content / Title", key: "title" },
                { label: "Status", key: "status" },
                { label: "Published Date", key: "date" },
                { label: "Actions", key: "action", tdClass: "text-right", thClass: "text-right pr-4" },
            ],
            items: [],
            isLoading: false,
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 15, 20],
        };
    },
    components: {
        SkeletonTable
    },
    methods: {
        fetchBlogs() {
            this.isLoading = true;
            // Pull the internal protected list
            ApiService.get(`/superadmin/all-blogs-internal`)
              .then(({ data }) => {
                if(data.success){
                    this.items = data.data;
                    this.totalRows = data.data.length;
                }
              })
              .catch(error => {
                  console.error("Error fetching blogs", error);
              })
              .finally(() => {
                this.isLoading = false;
              });
        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        formatDate(dateString) {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        confirmDelete(blog) {
            Swal.fire({
                title: 'Delete this Blog?',
                text: `You are about to permanently delete "${blog.title}". This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#355594',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    ApiService.delete(`/superadmin/delete-blog/${blog.id}`)
                    .then(response => {
                        Swal.fire('Deleted!', 'Successfully removed blog.', 'success');
                        this.fetchBlogs();
                    })
                    .catch(err => {
                        Swal.fire('Error', 'Failed to delete record.', 'error');
                    });
                }
            });
        }
    },
    mounted() {
        this.fetchBlogs();
    },
};
</script>
