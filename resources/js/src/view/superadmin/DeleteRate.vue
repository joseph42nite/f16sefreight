<template>
    <div class="mt-10 p-5">
        <b-table :bordered="true" responsive :fields="fields" :items="items" style="white-space:nowrap" primary-key="id"
            :filter="filter" :current-page="currentPage" :per-page="perPage" @filtered="onFiltered">
            <template #cell(action)="data">
                <b-button variant="danger" :id="'delete_'+data.item['carrier_code']" v-on:click="deleteRate(data.item['carrier_code'],data.item['carrier_prefix'])">Delete</b-button>
            </template>
        </b-table>
    </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
export default {
    name: "superadmin-DeleteRate",
    data() {
        return {
            fields: ['carrier_code', 'carrier_prefix', 'Action'],
            items: [],
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],
        };
    },
    methods: {
        deleteRate(carrier_code,carrier_prefix){
            const deleted_btn='#delete_'+carrier_code;
            $(deleted_btn).html("wait...");
            ApiService.delete(`/superadmin/delete-rate/${carrier_code}/${carrier_prefix}`)
                .then(({ data }) => {
                    this.getData();
                })
                .catch(err => { });
        },
        getData() {
            ApiService.get(`/superadmin/get-airline-list`)
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
  