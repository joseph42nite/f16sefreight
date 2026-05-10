<template>
    <b-container fluid class="body-color">

        <div class="d-flex">
            <SideBar></SideBar>
            <div style="background-color: #fff;box-shadow: 3px 3px 10px #d0d0d0;z-index: 1;border-radius: 30px; padding: 15px;">
                <h3>XML View: {{ awb_id }}</h3>
                {{xml_content}}
            </div>
        </div>
    </b-container>
</template>

<script>

import SideBar from "@/view/layouts/public/SideBar.vue";
import ApiService from "@/core/services/api.service";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            awb_id: null,
            xml_content: "",
        };
    },
    methods: {
        getXML(awb_id) {
            ApiService.get(`/user/get-xml/${awb_id}`)
                .then((response) => {
                    this.xml_content = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
    mounted() {
        this.awb_id = this.$route.params.id;
        this.getXML(this.awb_id);
    },

    components: {

        SideBar,
    },
};
</script>
