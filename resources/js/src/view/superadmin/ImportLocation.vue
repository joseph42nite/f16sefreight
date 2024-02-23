<template>
    <div class="mt-10 p-5 d-flex justify-content-between">
        <div>
            <h2>Import location here</h2>
            <div>
                <input type="file" ref="fileInput" @change="handleFileUpload" />
                <button @click="uploadFile" id="upload_btn">Upload</button>
            </div>
            <div class="alert alert-success mt-3" role="alert" id="fade">
                <span class="font-weight-bolder font-size-h6">Upload Successfully</span>
            </div>
        </div>
        <div>
            <button class="btn btn-danger" @click="delete_data()">Delete All Location</button>
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
        };
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        uploadFile(evt) {
            evt.preventDefault();
            $('#upload_btn').html("wait...");
            let formData = new FormData();
            formData.append('file', this.file);
            ApiService.post(`/superadmin/import-loctaion`, formData, { headers: { 'Content-Type': 'multipart/form-data', }, })
                .then(({ data }) => {
                    this.file = null;
                    $('#upload_btn').html('Upload')
                    $('#fade').fadeToggle(1000);
                    $('#fade').fadeToggle(1000);
                })
                .catch(err => { });
        },
        delete_data() {
            if (window.confirm("Do you want to delete all Location data?")) {
                ApiService.delete(`/superadmin/delete-location`)
                    .then(({ data }) => {
                        alert("data delete successfull. Now please import the location data quick");
                    })
                    .catch(err => { });
            }
        }
    },
    mounted() {
    },
};
</script>
<style>
#fade {
    display: none;
}
</style>
  