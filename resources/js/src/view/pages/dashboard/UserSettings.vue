<template>
    <b-container fluid class="body-color">
        <div class="d-flex flex-column flex-lg-row">
            <SideBar></SideBar>
            <div
                style="
                    background: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1);
                    z-index: 1;
                    border-radius: 32px;
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                "
                class="ml-lg-4 mt-4 mt-lg-0"
            >
                <div class="container py-6 px-4 px-sm-8 px-md-10">
                    <!-- Header Title -->
                    <div class="d-flex flex-column mb-6 pb-4 border-bottom">
                        <span class="nav-eyebrow">User Profile</span>
                        <h6 class="nav-title">User & Branch Settings</h6>
                        <p class="nav-subtitle">
                            View your profile details and manage saved branch address records for accurate OCR matching.
                        </p>
                    </div>

                    <!-- User Profile Details Card -->
                    <b-card class="profile-card border-0 mb-6 shadow-sm">
                        <div class="d-flex align-items-center mb-4">
                            <div class="profile-avatar-wrap mr-4">
                                <b-icon icon="person-circle" font-scale="3" style="color: #355594;"></b-icon>
                            </div>
                            <div>
                                <h4 class="mb-1 font-weight-700" style="color: #355594;">{{ userProfile.name || 'User Profile' }}</h4>
                                <span class="badge badge-primary-light px-3 py-1 font-weight-600">
                                    {{ userProfile.company || 'Company User' }}
                                </span>
                            </div>
                        </div>

                        <b-row>
                            <b-col md="6" lg="3" class="mb-3">
                                <div class="profile-info-box">
                                    <span class="info-label">Full Name</span>
                                    <span class="info-value">{{ userProfile.name || 'N/A' }}</span>
                                </div>
                            </b-col>

                            <b-col md="6" lg="3" class="mb-3">
                                <div class="profile-info-box">
                                    <span class="info-label">Company Email Address</span>
                                    <span class="info-value">{{ userProfile.email || 'N/A' }}</span>
                                </div>
                            </b-col>

                            <b-col md="6" lg="3" class="mb-3">
                                <div class="profile-info-box">
                                    <span class="info-label">Branch / Agent</span>
                                    <span class="info-value">{{ userProfile.branch || 'Default Branch' }}</span>
                                </div>
                            </b-col>

                            <b-col md="6" lg="3" class="mb-3">
                                <div class="profile-info-box">
                                    <span class="info-label">Company Name</span>
                                    <span class="info-value">{{ userProfile.company || 'N/A' }}</span>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card>

                    <!-- Saved Address Book Management Section -->
                    <div class="address-book-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-5 py-2">
                        <div class="mb-3 mb-lg-0">
                            <h4 class="mb-1 font-weight-700" style="color: #355594;">
                                <b-icon icon="journal-bookmark-fill" class="mr-2" style="color: #355594;"></b-icon>
                                Branch Address Book
                            </h4>
                            <span style="color: #5A6B8A;" class="small">Showing Shipper and Consignee saved records for your branch.</span>
                        </div>

                        <!-- Type Filter & Search Controls on Single Line -->
                        <div class="filter-search-row d-flex flex-column flex-sm-row align-items-sm-center">
                            <!-- Address Type Filter -->
                            <b-form-select
                                v-model="filterType"
                                :options="typeOptions"
                                class="type-filter-select mb-2 mb-sm-0 mr-0 mr-sm-3"
                                @change="handleSearch"
                            ></b-form-select>

                            <!-- Search Input & Button -->
                            <b-input-group class="search-input-group">
                                <b-form-input
                                    v-model="searchQuery"
                                    placeholder="Search name, account, address..."
                                    @keyup.enter="handleSearch"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button variant="primary" class="btn-search px-4" @click="handleSearch">
                                        <b-icon icon="search"></b-icon>
                                        <span class="ml-1 font-weight-600">Search</span>
                                    </b-button>
                                    <b-button v-if="searchQuery" variant="outline-secondary" @click="clearSearch" title="Clear Search">
                                        <b-icon icon="x"></b-icon>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </div>

                    <!-- Address Table -->
                    <div class="table-responsive glass-table-wrap">
                        <b-table
                            hover
                            striped
                            outlined
                            responsive
                            :items="addressItems"
                            :fields="tableFields"
                            :busy="isBusy"
                            show-empty
                            empty-text="No saved Shipper or Consignee addresses found."
                            class="address-table mb-0"
                        >
                            <!-- Loading Spinner -->
                            <template #table-busy>
                                <div class="text-center text-primary py-5">
                                    <b-spinner class="align-middle mr-2"></b-spinner>
                                    <strong>Loading saved addresses...</strong>
                                </div>
                            </template>

                            <!-- Type Column -->
                            <template #cell(address_type)="data">
                                <span
                                    class="badge px-3 py-2 font-weight-600 text-uppercase"
                                    :class="data.item.address_type === 'shipper_address' ? 'badge-shipper' : 'badge-consignee'"
                                >
                                    {{ data.item.address_type === 'shipper_address' ? 'Shipper' : 'Consignee' }}
                                </span>
                            </template>

                            <!-- Name Column -->
                            <template #cell(name)="data">
                                <div class="font-weight-700" style="color: #181C32; font-size: 0.95rem;">{{ data.item.name }}</div>
                                <small v-if="data.item.name_2" style="color: #5A6B8A;" class="d-block">
                                    <strong>Name 2:</strong> {{ data.item.name_2 }}
                                </small>
                            </template>

                            <!-- Account Column -->
                            <template #cell(account)="data">
                                <span v-if="data.item.account" class="font-weight-600" style="color: #181C32;">
                                    {{ data.item.account }}
                                </span>
                                <span v-else style="color: #5A6B8A;" class="font-italic">-</span>
                            </template>

                            <!-- Address Details Column -->
                            <template #cell(address)="data">
                                <div class="address-cell">
                                    <div class="font-weight-600" style="color: #181C32;">{{ data.item.address }}</div>
                                    <small v-if="data.item.address_line_2" style="color: #5A6B8A;" class="d-block">{{ data.item.address_line_2 }}</small>
                                    <small class="font-weight-600" style="color: #5A6B8A;">
                                        {{ [data.item.city, data.item.state, data.item.post_code, data.item.country].filter(Boolean).join(', ') }}
                                    </small>
                                </div>
                            </template>

                            <!-- Last Updated Column -->
                            <template #cell(updated_at)="data">
                                <div class="small">
                                    <div class="font-weight-600" style="color: #181C32;">
                                        <b-icon icon="clock" class="mr-1" style="color: #5A6B8A;"></b-icon>
                                        {{ formatDateTime(data.item.updated_at) }}
                                    </div>
                                    <div v-if="data.item.user && data.item.user.name" style="color: #5A6B8A;">
                                        <b-icon icon="person" class="mr-1"></b-icon>
                                        {{ data.item.user.name }}
                                    </div>
                                </div>
                            </template>

                            <!-- Actions Column -->
                            <template #cell(actions)="data">
                                <b-button
                                    size="sm"
                                    class="btn-brand-outline-pill px-3"
                                    @click="openEditModal(data.item)"
                                >
                                    <b-icon icon="pencil-square"></b-icon>
                                    <span>Edit</span>
                                </b-button>
                            </template>
                        </b-table>
                    </div>

                    <!-- Pagination -->
                    <div class="d-flex flex-column flex-sm-row align-items-center justify-content-between mt-4">
                        <span class="text-muted small mb-2 mb-sm-0">
                            Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }} records
                        </span>
                        <b-pagination
                            v-if="pagination.total > pagination.per_page"
                            v-model="pagination.current_page"
                            :total-rows="pagination.total"
                            :per-page="pagination.per_page"
                            align="right"
                            size="sm"
                            class="mb-0 custom-pagination"
                            @change="onPageChange"
                        ></b-pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Address Modal -->
        <b-modal
            id="edit-address-modal"
            v-model="showEditModal"
            modal-class="ultra-premium-modal"
            hide-header
            hide-footer
            size="lg"
            centered
        >
            <div class="custom-modal-wrap" v-if="editForm">
                <!-- Custom Modal Header -->
                <div class="modal-header-clean d-flex align-items-center justify-content-between px-6 py-4">
                    <div class="d-flex align-items-center">
                        <div class="modal-header-icon mr-3">
                            <b-icon icon="pencil-square" font-scale="1.1" style="color: #355594;"></b-icon>
                        </div>
                        <div>
                            <h5 class="modal-title-clean mb-0 font-weight-700">Edit Saved Address</h5>
                            <span class="modal-subtitle-clean">Update shipper/consignee record details for your branch</span>
                        </div>
                    </div>
                    <button type="button" class="modal-close-btn" @click="showEditModal = false" title="Close">
                        <b-icon icon="x" font-scale="1.3"></b-icon>
                    </button>
                </div>

                <!-- Custom Modal Body -->
                <div class="modal-body-custom px-6 py-4">
                    <b-form @submit.prevent="saveAddressUpdate">
                        <b-row>
                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Address Type</label>
                                <b-form-select
                                    v-model="editForm.address_type"
                                    :options="[
                                        { value: 'shipper_address', text: 'Shipper Address' },
                                        { value: 'consignee_address', text: 'Consignee Address' }
                                    ]"
                                    disabled
                                    class="custom-form-control disabled-control"
                                ></b-form-select>
                            </b-col>

                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Account Number</label>
                                <b-form-input v-model="editForm.account" placeholder="e.g. ACC-665412" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Name <span class="text-danger">*</span></label>
                                <b-form-input v-model="editForm.name" required placeholder="Company or Individual Name" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Name 2 / EORI</label>
                                <b-form-input v-model="editForm.name_2" placeholder="Secondary Name or EORI" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Address Line 1 <span class="text-danger">*</span></label>
                                <b-form-input v-model="editForm.address" required placeholder="Street Address" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Address Line 2</label>
                                <b-form-input v-model="editForm.address_line_2" placeholder="Building, Suite, Unit" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="4" class="mb-3">
                                <label class="form-field-label">City <span class="text-danger">*</span></label>
                                <b-form-input v-model="editForm.city" required placeholder="City" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="4" class="mb-3">
                                <label class="form-field-label">State / Province</label>
                                <b-form-input v-model="editForm.state" placeholder="State" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="4" class="mb-3">
                                <label class="form-field-label">Postal Code</label>
                                <b-form-input v-model="editForm.post_code" placeholder="PIN / Zip Code" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Country Code / Name <span class="text-danger">*</span></label>
                                <b-form-input v-model="editForm.country" required placeholder="Country" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="6" class="mb-3">
                                <label class="form-field-label">Airport Code</label>
                                <b-form-input v-model="editForm.airport_code" placeholder="e.g. FRA, LHR, NRT" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="4" class="mb-3">
                                <label class="form-field-label">Phone Number</label>
                                <b-form-input v-model="editForm.phone" placeholder="Phone" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="4" class="mb-3">
                                <label class="form-field-label">Fax</label>
                                <b-form-input v-model="editForm.fax" placeholder="Fax" class="custom-form-control"></b-form-input>
                            </b-col>

                            <b-col md="4" class="mb-3">
                                <label class="form-field-label">Telex</label>
                                <b-form-input v-model="editForm.telex" placeholder="Telex" class="custom-form-control"></b-form-input>
                            </b-col>
                        </b-row>
                    </b-form>
                </div>

                <!-- Custom Modal Footer -->
                <div class="modal-footer-clean d-flex align-items-center justify-content-end px-6 py-4">
                    <b-button class="btn-brand-outline-pill mr-3 px-4" style="border-color: #cbd5e1 !important; color: #475569 !important;" @click="showEditModal = false">Cancel</b-button>
                    <b-button class="btn-brand-pill px-5" :disabled="isSaving" @click="saveAddressUpdate">
                        <b-spinner v-if="isSaving" small class="mr-2"></b-spinner>
                        <span>Save Changes</span>
                    </b-button>
                </div>
            </div>
        </b-modal>
    </b-container>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import ApiService from "@/core/services/api.service";

export default {
    name: "UserSettings",
    components: {
        SideBar,
    },
    data() {
        return {
            isBusy: false,
            isSaving: false,
            showEditModal: false,
            searchQuery: "",
            filterType: "",
            typeOptions: [
                { value: "", text: "All Address Types" },
                { value: "shipper_address", text: "Shipper Only" },
                { value: "consignee_address", text: "Consignee Only" },
            ],
            userProfile: {
                name: "",
                email: "",
                branch: "",
                company: "",
            },
            addressItems: [],
            pagination: {
                current_page: 1,
                per_page: 10,
                total: 0,
                from: 0,
                to: 0,
            },
            tableFields: [
                { key: "address_type", label: "Type", sortable: false, thClass: "bg-light text-uppercase font-weight-700" },
                { key: "name", label: "Name / Name 2", sortable: false, thClass: "bg-light text-uppercase font-weight-700" },
                { key: "account", label: "Account #", sortable: false, thClass: "bg-light text-uppercase font-weight-700" },
                { key: "address", label: "Address & Location", sortable: false, thClass: "bg-light text-uppercase font-weight-700" },
                { key: "updated_at", label: "Last Updated", sortable: false, thClass: "bg-light text-uppercase font-weight-700" },
                { key: "actions", label: "Action", sortable: false, thClass: "text-center bg-light text-uppercase font-weight-700", tdClass: "text-center" },
            ],
            editForm: null,
        };
    },
    mounted() {
        this.fetchSavedAddresses();
    },
    methods: {
        fetchSavedAddresses(page = 1) {
            this.isBusy = true;
            const params = {
                page: page,
                per_page: this.pagination.per_page,
                search: this.searchQuery,
                address_type: this.filterType,
            };

            ApiService.query("/user/saved-addresses", { params })
                .then(({ data }) => {
                    this.isBusy = false;
                    if (data.user) {
                        this.userProfile = data.user;
                    }
                    if (data.data) {
                        this.addressItems = data.data.data || [];
                        this.pagination = {
                            current_page: data.data.current_page || 1,
                            per_page: data.data.per_page || 10,
                            total: data.data.total || 0,
                            from: data.data.from || 0,
                            to: data.data.to || 0,
                        };
                    }
                })
                .catch((error) => {
                    this.isBusy = false;
                    this.$bvToast.toast("Failed to load saved addresses.", {
                        title: "Error",
                        variant: "danger",
                        solid: true,
                    });
                });
        },
        handleSearch() {
            this.pagination.current_page = 1;
            this.fetchSavedAddresses(1);
        },
        clearSearch() {
            this.searchQuery = "";
            this.handleSearch();
        },
        onPageChange(page) {
            this.fetchSavedAddresses(page);
        },
        openEditModal(item) {
            this.editForm = { ...item };
            this.showEditModal = true;
        },
        saveAddressUpdate() {
            if (!this.editForm || !this.editForm.name || !this.editForm.address || !this.editForm.city || !this.editForm.country) {
                this.$bvToast.toast("Please fill in all required fields (Name, Address, City, Country).", {
                    title: "Validation Warning",
                    variant: "warning",
                    solid: true,
                });
                return;
            }

            this.isSaving = true;
            ApiService.put(`/user/saved-addresses/${this.editForm.id}`, this.editForm)
                .then(({ data }) => {
                    this.isSaving = false;
                    this.showEditModal = false;
                    this.$bvToast.toast("Address updated successfully!", {
                        title: "Success",
                        variant: "success",
                        solid: true,
                    });
                    this.fetchSavedAddresses(this.pagination.current_page);
                })
                .catch((error) => {
                    this.isSaving = false;
                    const msg = error.response?.data?.message || "Failed to update address.";
                    this.$bvToast.toast(msg, {
                        title: "Error",
                        variant: "danger",
                        solid: true,
                    });
                });
        },
        formatDateTime(dateStr) {
            if (!dateStr) return "-";
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
};
</script>

<style scoped>
.body-color {
    padding-left: 10px !important;
    padding-right: 10px !important;
    padding-top: 10px !important;
    padding-bottom: 20px !important;
}

.settings-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    color: #355594;
    font-size: 1.65rem;
}

.profile-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 255, 0.9) 100%);
    border-radius: 20px !important;
    border: 1px solid rgba(53, 85, 148, 0.12) !important;
}

.profile-info-box {
    background: rgba(255, 255, 255, 0.7);
    padding: 12px 16px;
    border-radius: 14px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    display: flex;
    flex-direction: column;
}

.info-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: #5A6B8A;
    margin-bottom: 4px;
}

.info-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: #355594;
}

.badge-primary-light {
    background: rgba(53, 85, 148, 0.12);
    color: #355594;
    border-radius: 12px;
}

.badge-shipper {
    background: rgba(40, 167, 69, 0.15);
    color: #1e7e34;
    border: 1px solid rgba(40, 167, 69, 0.3);
    border-radius: 12px;
}

.badge-consignee {
    background: rgba(0, 123, 255, 0.15);
    color: #0056b3;
    border: 1px solid rgba(0, 123, 255, 0.3);
    border-radius: 12px;
}

.filter-search-row {
    gap: 16px;
}

.type-filter-select {
    width: 210px;
    height: 42px;
    border-radius: 12px !important;
    border: 1px solid #cbd5e1;
    font-weight: 600;
    color: #355594;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.search-input-group {
    width: 360px;
    max-width: 100%;
}

.search-input-group .form-control {
    height: 42px;
    border-top-left-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
    border: 1px solid #cbd5e1;
    font-size: 0.95rem;
    color: #2a4478;
}

.glass-table-wrap {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
}

.address-table td {
    vertical-align: middle !important;
}

.btn-search {
    height: 42px;
    border-top-right-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
    background-color: #355594;
    border-color: #355594;
    display: inline-flex;
    align-items: center;
}

.btn-search:hover {
    background-color: #2a4478;
    border-color: #2a4478;
}

.btn-edit-address {
    border-radius: 10px;
    font-weight: 600;
}

/* Custom Ultra Premium Modal Styles */
::v-deep .ultra-premium-modal .modal-dialog {
    max-width: 780px;
}

::v-deep .ultra-premium-modal .modal-content {
    background: #ffffff !important;
    border: none !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.25) !important;
    overflow: hidden;
    font-family: 'Inter', sans-serif !important;
}

::v-deep .ultra-premium-modal .modal-body {
    padding: 0 !important;
    background: #ffffff;
}

.modal-header-clean {
    background: #ffffff;
    border-bottom: 1px solid #f1f5f9;
    padding: 20px 28px !important;
}

.modal-header-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(53, 85, 148, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-title-clean {
    color: #355594;
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.2;
}

.modal-subtitle-clean {
    color: #5A6B8A;
    font-size: 0.8rem;
    display: block;
    margin-top: 2px;
}

.modal-close-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    color: #5A6B8A;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    cursor: pointer;
}

.modal-close-btn:hover {
    background: #f1f5f9;
    color: #355594;
    border-color: #cbd5e1;
}

.modal-body-custom {
    padding: 24px 28px !important;
}

.form-field-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #355594;
    margin-bottom: 6px;
    display: block;
}

.custom-form-control {
    height: 42px;
    border-radius: 10px !important;
    border: 1px solid #cbd5e1;
    font-size: 0.92rem;
    color: #2a4478;
    padding: 0 14px;
    background-color: #ffffff;
    transition: all 0.15s ease;
    box-shadow: none !important;
}

.custom-form-control:focus {
    border-color: #355594 !important;
    box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.12) !important;
}

.disabled-control {
    background-color: #f8fafc !important;
    border-color: #e2e8f0 !important;
    color: #5A6B8A !important;
    font-weight: 600;
}

.modal-footer-clean {
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
    padding: 16px 28px !important;
}

.btn-cancel-clean {
    border-radius: 10px;
    font-weight: 600;
    color: #475569;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    height: 40px;
    font-size: 0.9rem;
}

.btn-cancel-clean:hover {
    background: #f1f5f9;
    color: #1e293b;
    border-color: #94a3b8;
}

.btn-save-clean {
    border-radius: 10px;
    font-weight: 600;
    background: #355594;
    border: 1px solid #355594;
    color: #ffffff;
    height: 40px;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(53, 85, 148, 0.2);
    transition: all 0.15s ease;
}

.btn-save-clean:hover {
    background: #2a4478;
    border-color: #2a4478;
    box-shadow: 0 6px 16px rgba(53, 85, 148, 0.3);
}

@media (max-width: 768px) {
    .body-color {
        padding-left: 10px !important;
        padding-right: 10px !important;
        padding-top: 10px !important;
        padding-bottom: 20px !important;
    }

    .container {
        padding-left: 16px !important;
        padding-right: 16px !important;
        padding-top: 16px !important;
        padding-bottom: 20px !important;
    }

    .settings-title {
        font-size: 1.35rem;
    }

    .profile-card {
        padding: 1rem !important;
    }

    .filter-search-row {
        width: 100%;
        gap: 12px;
    }

    .type-filter-select {
        width: 100% !important;
        margin-right: 0 !important;
    }

    .search-input-group {
        width: 100% !important;
    }
}
</style>
