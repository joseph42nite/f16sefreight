<template>
    <div class="mt-10 p-5">
        <label for="user_message">User Message</label>
        <textarea rows="4" cols="50" v-model="user_notice_1"></textarea>
        <button class="btn btn-primary" @click="submit">Save</button>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
export default {
    data() {
        return {
            user_notice_1:'',
        };
    },
    methods: {
        submit() {
            console.log("djhvjd");
            ApiService.put(`/superadmin/update-notice`, {"user_notice_1":this.user_notice_1}).then(({ data }) => {
              alert("update successfull");
            });
        },
        get_notice(){
            ApiService.get(`/superadmin/get-notice`).then(({ data }) => {
                this.user_notice_1=data[0].user_notice_1;
            });
        },
    },
    mounted() {
        this.get_notice();
    },
};
</script>
