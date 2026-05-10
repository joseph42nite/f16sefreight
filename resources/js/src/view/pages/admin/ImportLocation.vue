<template>
    <div class="py-5">
        <div class="admin-page-header">
            <h2>Location Data Import</h2>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="admin-glass-card text-center">
                    <h4 class="font-weight-bold mb-2 text-dark">Upload Location Data</h4>
                    <p class="text-muted mb-7">Import latest geography mappings to DB.</p>

                    <div class="admin-upload-zone mb-6" :class="{'has-file': file}">
                        <div class="upload-icon-wrap">
                            <i :class="file ? 'fas fa-file-csv text-primary' : 'fas fa-map-marked-alt'"></i>
                        </div>
                        
                        <h4 v-if="file">{{ file.name }}</h4>
                        <div v-else>
                            <h4>Drag & Drop Location file here</h4>
                            <p>or click to browse files</p>
                        </div>

                        <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx,.csv" :disabled="isUploading"/>
                    </div>

                    <div v-if="successMsg" class="alert alert-custom alert-light-success font-weight-bolder py-3 mb-6">
                        <i class="fas fa-check-circle mr-2"></i> Locations Imported Successfully!
                    </div>

                    <div class="d-flex justify-content-center">
                        <button @click="uploadFile" class="admin-pill-btn btn-lg px-10" :disabled="!file || isUploading">
                            <span v-if="isUploading"><b-spinner small class="mr-2"></b-spinner>Uploading...</span>
                            <span v-else><i class="fas fa-upload mr-2"></i>Start Upload</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mt-4 mt-md-0">
                <div class="card card-custom border-0 shadow-sm" style="border-radius: 16px; overflow: hidden;">
                    <div class="card-body bg-light-danger text-center p-8">
                        <div class="mb-6">
                            <i class="fas fa-exclamation-triangle text-danger font-size-h1"></i>
                        </div>
                        <h4 class="font-weight-bold text-danger">Danger Zone</h4>
                        <p class="text-dark-50 mt-3 mb-7">Warning: This will permanently wipe all location entities from the database. This action cannot be undone.</p>
                        <button class="btn btn-danger btn-shadow font-weight-bold w-100 py-3" @click="delete_data" style="border-radius: 10px;">
                            Delete All Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
    name: "superadmin-ImportLocation",
    data() {
        return {
            file: null,
            isUploading: false,
            successMsg: false
        };
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0] || null;
            this.successMsg = false;
        },
        uploadFile(evt) {
            if (!this.file) return;
            evt.preventDefault();
            this.isUploading = true;
            this.successMsg = false;

            let formData = new FormData();
            formData.append('file', this.file);
            
            ApiService.post(`/superadmin/import-loctaion`, formData, { 
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(({ data }) => {
                this.file = null;
                this.successMsg = true;
                if(this.$refs.fileInput) this.$refs.fileInput.value = "";
                setTimeout(() => { this.successMsg = false; }, 4000);
            })
            .catch(err => {
                alert("An error occurred during import.");
            })
            .finally(() => {
                this.isUploading = false;
            });
        },
        delete_data() {
            if (window.confirm("DANGER: Are you ABSOLUTELY sure you want to wipe all location data? This cannot be undone.")) {
                ApiService.delete(`/superadmin/delete-location`)
                    .then(({ data }) => {
                        alert("Data successfully purged. Please upload fresh data immediately.");
                    })
                    .catch(err => { 
                        alert("Purge failed.");
                    });
            }
        }
    },
};
</script>
  