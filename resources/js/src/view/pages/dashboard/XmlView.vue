<template>
    <b-container fluid class="body-color">

        <div class="d-flex flex-column flex-lg-row">
            <SideBar></SideBar>
            <div class="w-100 ml-lg-4 mt-4 mt-lg-0" style="background-color: #fff;box-shadow: 3px 3px 10px #d0d0d0;z-index: 1;border-radius: 30px; padding: 15px;">
                <h3>XML View: {{ awb_id }}</h3>
                <p v-if="note" class="text-muted" role="alert">{{ note }}</p>
                {{xml_content}}
            </div>
        </div>
    </b-container>
</template>

<script>

import SideBar from "@/view/layouts/public/SideBar.vue";
import ApiService from "@/core/services/api.service";
import { serverMessage } from "@/core/services/serverMessage";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            awb_id: null,
            xml_content: "",
            note: "",
        };
    },
    methods: {
        getXML(awb_id) {
            ApiService.get(`/user/get-xml/${awb_id}`)
                .then((response) => {
                    this.xml_content = response.data;
                })
                .catch((error) => {
                    this.note = serverMessage(error, "The XML for this waybill could not be loaded.");
                });
        },
    },
    mounted() {
        this.awb_id = this.$route.params.id;
        // Opened with no waybill in the address: said, where it asked the server for "undefined".
        if (!this.awb_id) { this.note = "No waybill was chosen. Open the XML from a waybill."; return; }
        this.getXML(this.awb_id);
    },

    components: {

        SideBar,
    },
};
</script>
