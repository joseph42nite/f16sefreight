<template>
    <div class="mt-10 p-5">
        <div class="w-50">
            <label for="">Select Origin:</label>
            <b-form-select v-model="selected_source" :options="all_source" @change="getData()"></b-form-select>
        </div>
        <b-table :bordered="true" responsive :fields="fields" :items="items" style="white-space:nowrap" primary-key="id"
            :filter="filter" :current-page="currentPage" :per-page="perPage" @filtered="onFiltered">
            <template #cell(action)="data">
                <b-button variant="danger" :id="'delete_'+data.item['carrier_code']" v-on:click="deleteRate(data.item['carrier_code'])">Delete</b-button>
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
            fields: ['carrier_code', 'Action'],
            items: [],
            all_source:[],
            selected_source:'BLR',
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 50,
            pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],
        };
    },
    methods: {
        deleteRate(carrier_code,carrier_prefix=0){
            const deleted_btn='#delete_'+carrier_code;
            $(deleted_btn).html("wait...");
            ApiService.delete(`/superadmin/delete-rate/${carrier_code}/${carrier_prefix}/${this.selected_source}`)
                .then(({ data }) => {
                    this.getData();
                })
                .catch(err => { });
        },
        getData() {
            ApiService.get(`/superadmin/get-airline-list/${this.selected_source}`)
                .then(({ data }) => {
                    this.items = data;
                })
                .catch(err => { });
        },
        getSource() {
            ApiService.get(`/superadmin/get-source-list`)
                .then(({ data }) => {
                    for(let i=0; i<data.length; i++){
                        this.all_source.push({"value":data[i].origin_airport_code,"text":data[i].origin_airport_code})
                    }
                })
        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
    },
    mounted() {
        this.getData();
        this.getSource();
    },
};
</script>
<style>
#fade {
    display: none;
}
</style>
  