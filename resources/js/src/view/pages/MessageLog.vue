<template>
    <div class="body-color">
        <div class="container-fluid">
            <!-- Include Page Loader -->
             <!-- <PageLoader></PageLoader> -->
            <!-- Include Header -->
            <Header></Header>
            <div class="d-flex">
                <SideBar></SideBar>
                <div style="background-color: #fff; box-shadow: 3px 3px 10px #d0d0d0;z-index: 1;border-radius: 30px;">
                    <div class="container">
                        <b-card-title class="title_color mt-9"> Search </b-card-title>
                        <hr class="hr" />
                        <b-card-text class="border_rounded">
                            <div class="mr-8">
                                <b-row class="my-8">
                                    <b-col cols="5">
                                        <div>
                                            <div class="d-flex">
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                    label-for="input-horizontal" class="form-control-sm align-items-center">
                                                    <template #label>
                                                        <span>Master No:</span>
                                                        <span style="color: red">*</span>
                                                    </template>
                                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 50px"></b-form-input>
                                                </b-form-group>
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class="form-control-sm align-items-center">
                                                    <template #label>
                                                        <span>-</span>
                                                    </template>
                                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 90px"></b-form-input>
                                                </b-form-group>
                                                <div class="mt-3">
                                                    <b-button pill style="color: #2637a8; background: #ffffff !important; border: 1px solid #2637a8;padding: 6px 25px;">Search</b-button>
                                                </div>
                                            </div>
                                        </div>
                                    </b-col>
                                </b-row>
                            </div>

                            <div>
                                <div class="py-5">
                                    <div class="ml-3 mt-8">
                                        <div class="">
                                            <b-row>
                                                <b-col cols="12">
                                                    <table class="table table-sm" style="max-width:100%;">
                                                        <thead>
                                                            <tr style="background-color: #F2F9FF;">
                                                                <th style="width:30px !important;">Sl No.</th>
                                                                <th style="width: 100px !important;">AWB No.</th>
                                                                <th style="width: 120px;">Document type</th>
                                                                <th style="width: 100px;">Destination</th>
                                                                <th style="width: 120px;">Date & time</th>
                                                                <th style="width: 120px;">Updated by</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                                <th class="">&nbsp;</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr class="tr">
                                                                <td class="editable-cell align-items-center pt-4 " style="width:60px;">
                                                                    1.
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    123 12345678
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    Lorum ipsum
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    BLR
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    9/11/24, 06:00 PM 
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    lorum@gmail.com
                                                                </td>
                                                            
                                                                <td style="margin-left: 10px;">
                                                                    <div style="width: 112%;">
                                                                        <table class="table table-sm" style="max-width:100%;">
                                                                            <thead>
                                                                                <tr style="background-color: #F2F9FF;overflow: hidden;">
                                                                                    <th style="width:400px !important;padding-left: 15px !important;">Event</th>
                                                                                    <th style="width:130px !important;">&nbsp;&nbsp;&nbsp;</th>
                                                                                    <th style="width:150px !important;">Place </th>
                                                                                    <th style="width:130px !important;">Date</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr style="padding-left: 10px !important;" class="tr">
                                                                                    <td class="editable-cell align-items-center px-4 " style="width:60px;">
                                                                                        217 pieces CRC - Consignment reported to customs authorities
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        <b-icon icon="trash" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                        <b-icon icon="pencil" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        BLR 
                                                                                        <b-icon icon="flag-fill" aria-hidden="true"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                    23 Nov 19:28
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="editable-cell align-items-center px-4" style="width:60px;">
                                                                                        217 pieces CRC - Consignment reported to customs authorities
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        <b-icon icon="trash" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                        <b-icon icon="pencil" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        BLR 
                                                                                        <b-icon icon="flag-fill" aria-hidden="true"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                    23 Nov 19:28
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                            <thead style="">
                                                                                <tr style="background-color: #F2F9FF;">
                                                                                    <th style="padding-left: 15px !important;">FNA & FMAs</th>
                                                                                    <th class="">&nbsp;</th>
                                                                                    <th class="">&nbsp;</th>
                                                                                    <th class="">&nbsp;</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colspan="4" style="font-weight: 400;font-size: 12px;">
                                                                                        <p class="mt-2 px-4">FMA - Aie Waybill Processed </p>
                                                                                        <p class="mt-0 px-4">Detail:</p>
                                                                                        <p class="mt-0 px-4">FWB SUCCESSFULLY PROCESSED</p>
                                                                                        <div class="d-flex justify-content-between align-items-center">
                                                                                            <p class="pt-3 mb-0 px-4">FWB/17 176-76699879UYQG/TU879UDJAOA.79</p>
                                                                                            <p class="pt-3 mb-0 text-end px-4">23 Nov 19:28</p>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </thead>
                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr class="tr tr-padding">
                                                                <td class="editable-cell align-items-center pt-4" style="width:60px;">
                                                                    1.
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    123 12345678
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    Lorum ipsum
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    BLR
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    9/11/24, 06:00 PM 
                                                                </td>
                                                                <td class="editable-cell align-items-center pt-4" style="width:70px;">
                                                                    lorum@gmail.com
                                                                </td>
                                                            
                                                                <td style="margin-left: 10px;margin-bottom: 20px;">
                                                                    <div style="width: 112%;">
                                                                        <table class="table table-sm" style="max-width:100%;">
                                                                            <thead style="">
                                                                                <tr style="background-color: #F2F9FF;overflow: hidden;">
                                                                                    <th style="width:400px !important;padding-left: 15px !important;">Event</th>
                                                                                    <th style="width:130px !important;">&nbsp;&nbsp;&nbsp;</th>
                                                                                    <th style="width:150px !important;">Place </th>
                                                                                    <th style="width:130px !important;">Date</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr style="padding-left: 10px !important;" class="tr">
                                                                                    <td class="editable-cell align-items-center px-4" style="width:60px;">
                                                                                        217 pieces CRC - Consignment reported to customs authorities
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        <b-icon icon="trash" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                        <b-icon icon="pencil" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        BLR 
                                                                                        <b-icon icon="flag-fill" aria-hidden="true"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                    23 Nov 19:28
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="editable-cell align-items-center px-4" style="width:60px;">
                                                                                        217 pieces CRC - Consignment reported to customs authorities
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        <b-icon icon="trash" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                        <b-icon icon="pencil" aria-hidden="true" style="color: #355594 !important;"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                        BLR 
                                                                                        <b-icon icon="flag-fill" aria-hidden="true"></b-icon>
                                                                                    </td>
                                                                                    <td class="editable-cell align-items-center" style="width:60px;">
                                                                                    23 Nov 19:28
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                            <thead style="">
                                                                                <tr style="background-color: #F2F9FF;">
                                                                                    <th style="padding-left: 15px !important;">FNA & FMAs</th>
                                                                                    <th class="">&nbsp;</th>
                                                                                    <th class="">&nbsp;</th>
                                                                                    <th class="">&nbsp;</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colspan="4" style="font-weight: 400;font-size: 12px;">
                                                                                        <p class="mt-2 px-4">FMA - Aie Waybill Processed </p>
                                                                                        <p class="mt-0 px-4">Detail:</p>
                                                                                        <p class="mt-0 px-4">FWB SUCCESSFULLY PROCESSED</p>
                                                                                        <div class="d-flex justify-content-between align-items-center">
                                                                                            <p class="pt-3 mb-0 px-4">FWB/17 176-76699879UYQG/TU879UDJAOA.79</p>
                                                                                            <p class="pt-3 mb-0 text-end px-4">23 Nov 19:28</p>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </thead>
                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </b-card-text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Header from "../layout/Header.vue";
import SideBar from "../layout/SideBar.vue";
// import PageLoader from '../components/PageLoader.vue';
export default {
    data() {
        return {}
    },
    components: {
        Header,
        SideBar,
        // PageLoader
    }
}
</script>
<style scoped>
.body-color {
    background: linear-gradient(180deg, #D0E6F8 8%, #FFFFFF 20%);
}
.border_rounded {
    border-radius: 30px !important;
}
.title_color {
    color: #355594;
    font-size: 30px;
    font-weight: 500;
}
.card-title {
    margin-bottom: 5px;
}
.hr {
    border-top: 2px solid #CDCDCD;
}
.vr{
    display: inline-block;
    align-self: stretch;
    width: 1px;
    min-height: 1em;
    background-color: #CDCDCD;
    margin-right: 10px;
}
.tr {
    padding-bottom: 2.75rem !important;
    vertical-align: top;
    border-bottom: 2px solid #EBEDF3;
}
.tr-padding {
    padding-top: 10px;
}
.table thead th, .table thead td {
    font-weight: 600;
    font-size: 1rem;
    /* border-bottom-width: 1px; */
    /* padding-top: 1rem; */
    /* padding-bottom: 1rem; */
    height: 10px !important;
}

.table thead th, .table thead td {
    font-weight: 600;
    font-size: 1rem;
    border-bottom-width: 1px;
    /* padding-top: 1rem; */
    /* padding-bottom: 1rem; */
}
</style>
