<template>
    <div class="mt-10 p-5">
        <b-table :bordered="true" responsive :fields="fields" :items="items" style="white-space:nowrap" primary-key="id"
            :filter="filter" :current-page="currentPage" :per-page="perPage" @filtered="onFiltered">
            <template #cell(action)="data">
                <b-button variant="danger" :id="'delete_'+data.item['carrier_code']" v-on:click="deleteAms(data.item['carrier_code'])">Delete</b-button>
            </template>
        </b-table>
    </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
export default {
    name: "superadmin-DeleteAms",
    data() {
        return {
            fields: ['carrier_code', 'Action'],
            items: [],
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 50,
            pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],
        };
    },
    methods: {
        deleteAms(carrier_code,carrier_prefix=0){
            const deleted_btn='#delete_'+carrier_code;
            $(deleted_btn).html("wait...");
            ApiService.delete(`/superadmin/delete-ams/${carrier_code}/${carrier_prefix}`)
                .then(({ data }) => {
                    this.getData();
                })
                .catch(err => { });
        },
        getData() {
            ApiService.get(`/superadmin/get-ams-list`)
                .then(({ data }) => {
                    this.items = data;
                })
                .catch(err => { });
        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
    },
    mounted() {
        this.getData();
    },
};
</script>
<style>
#fade {
    display: none;
}
</style>
  