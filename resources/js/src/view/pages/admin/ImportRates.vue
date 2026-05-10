<template>
    <div class="py-5">
        <div class="admin-page-header">
            <h2>Rate Data Import</h2>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="admin-glass-card text-center">
                    <h4 class="font-weight-bold mb-2 text-dark">Upload New Rate File</h4>
                    <p class="text-muted mb-7">Supported format: .xlsx, .csv. Max size 10MB.</p>

                    <div class="admin-upload-zone mb-6" :class="{'has-file': file}">
                        <div class="upload-icon-wrap">
                            <i :class="file ? 'fas fa-file-excel text-success' : 'fas fa-cloud-upload-alt'"></i>
                        </div>
                        
                        <h4 v-if="file">{{ file.name }}</h4>
                        <div v-else>
                            <h4>Drag & Drop your file here</h4>
                            <p>or click to browse your computer</p>
                        </div>

                        <input 
                          type="file" 
                          ref="fileInput" 
                          @change="handleFileUpload" 
                          accept=".xlsx,.xls,.csv" 
                          :disabled="isUploading"
                        />
                    </div>

                    <div v-if="successMsg" class="alert alert-custom alert-light-success font-weight-bolder py-3 mb-6">
                        <i class="fas fa-check-circle mr-2"></i> File Imported Successfully!
                    </div>

                    <div class="d-flex justify-content-center mt-3">
                        <button 
                          @click="uploadFile" 
                          class="admin-pill-btn btn-lg px-12" 
                          :disabled="!file || isUploading"
                        >
                            <span v-if="isUploading">
                                <b-spinner small class="mr-2"></b-spinner>
                                Processing...
                            </span>
                            <span v-else>
                                <i class="fas fa-file-import mr-2"></i>
                                Start Import
                            </span>
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
    name: "superadmin-ImportExcel",
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

            ApiService.post(`/superadmin/import-excel`, formData, { 
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(({ data }) => {
                this.file = null;
                this.successMsg = true;
                if (this.$refs.fileInput) {
                   this.$refs.fileInput.value = ""; // Clear hidden file input native binding
                }
                setTimeout(() => { this.successMsg = false; }, 4000);
            })
            .catch(err => {
                alert("Import failed. Please check the file format and try again.");
            })
            .finally(() => {
                this.isUploading = false;
            });
        },
    },
};
</script>
  