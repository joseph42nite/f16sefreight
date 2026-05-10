<template>
    <div class="py-5">
        <div class="admin-page-header">
            <h2>AMS Data Import</h2>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="admin-glass-card text-center">
                    <h4 class="font-weight-bold mb-2 text-dark">Import New AMS Data</h4>
                    <p class="text-muted mb-7">Standardized file imports for aviation data management.</p>

                    <div class="admin-upload-zone mb-6" :class="{'has-file': file}">
                        <div class="upload-icon-wrap">
                            <i :class="file ? 'fas fa-file-signature text-info' : 'fas fa-upload'"></i>
                        </div>
                        
                        <h4 v-if="file">{{ file.name }}</h4>
                        <div v-else>
                            <h4>Drag & Drop your data file</h4>
                            <p>Browse your folders</p>
                        </div>

                        <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx,.xls,.csv" :disabled="isUploading"/>
                    </div>

                    <div v-if="successMsg" class="alert alert-custom alert-light-info py-3 font-weight-bolder mb-6">
                        <i class="fas fa-info-circle mr-2 text-info"></i> Import Request Sent Successfully.
                    </div>

                    <div class="d-flex justify-content-center">
                        <button @click="uploadFile" class="admin-pill-btn btn-lg px-10" :disabled="!file || isUploading">
                            <span v-if="isUploading"><b-spinner small class="mr-2"></b-spinner>Processing...</span>
                            <span v-else><i class="fas fa-arrow-circle-up mr-2"></i>Commit Import</span>
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
    name: "superadmin-ImportAms",
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
            if(!this.file) return;
            evt.preventDefault();
            this.isUploading = true;
            this.successMsg = false;

            let formData = new FormData();
            formData.append('file', this.file);

            ApiService.post(`/superadmin/import-ams`, formData, { 
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(({ data }) => {
                this.file = null;
                this.successMsg = true;
                if(this.$refs.fileInput) this.$refs.fileInput.value = "";
                setTimeout(() => { this.successMsg = false; }, 4000);
            })
            .catch(err => {
                alert("Import process error encountered.");
            })
            .finally(() => {
                this.isUploading = false;
            });
        }
    }
};
</script>
  