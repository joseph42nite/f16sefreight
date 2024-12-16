<template>
    <div class="bg-white">
        <div class="container-fluid">
            <div class="d-flex">
                <SideBar></SideBar>
                <div class="container" style="box-shadow: 3px 3px 10px #d0d0d0;z-index: 1;border-radius: 30px;">
                    <b-row class="mt-14 mb-8 px-10">
                        <b-col cols="6">
                            <h6 style="color:#355594;font-size:22px;line-height:30px;font-weight:600;">Documentation</h6>
                            <b-form-group id="fieldset-horizontal" class="d-flex align-items-center ">
                                <b-form-select 
                                    style="width: 180px;border: 0px !important;color: #355594;font-weight: 600;"
                                    class="form-control-sm"
                                    v-model="selectedViewPageOption"
                                    @change="onSelect">
                                    <option value="/web-doc">Master Airway Bill</option>
                                    <option value="/house-way-bill">Houseway Bill</option>
                                    <option value="/consolidation">Consolidation</option>
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <div class="d-flex justify-content-end" style="margin-top: 42px !important;">
                                <b-button style="border-radius:30px;border:1px solid #355594;padding:6px 30px;color:#355594;background:#ffffff !important;" 
                                id="show-btn" v-b-modal.modal-draft class="mx-2">Draft</b-button>
                                <b-button style="border-radius:30px;border:1px solid #355594;padding:6px 30px;color:#355594;background:#ffffff !important;" 
                                id="show-btn" v-b-modal.modal-s class="ml-2 mr-10">10 Latest</b-button>
                            </div>
                        </b-col>
                        <!-- Draft model code Start here -->
                        <b-modal id="modal-draft" title="Activity" ok-only>
                            <div class="d-block">
                                <b-row class="mt-5">
                                    <b-col cols="auto">
                                        <a href="" class="custom-link">none</a>
                                        <h6>( - )</h6>
                                    </b-col>
                                    <b-col cols="auto">
                                        <a href="" class="custom-link">Edit e-AWB Data</a>
                                        <a href="" class="custom-link">Create House Waybill from e-AWB Data</a>
                                        <h6>By: jgeorgeblr@gln.com at: 13 Jul 15:03</h6>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-modal>
                        <!-- Draft model code Ends here -->
                        <!-- 10 Latest model code start here -->
                        <b-modal id="modal-s" title="Latest Messages" ok-only>
                            <div class="d-block">
                                <b-row class="mt-5">
                                    <b-col>
                                        <div v-for="item in data_items" :key="item.id" style="border-bottom: 1px solid #bcbcbc;">
                                            <a href="#" class="custom-link mb-3" @click="getHouseWayBill(item.id)">
                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + item.id" custom>
                                                    <p @click="navigate" class="mb-0">
                                                        {{ item.awb_code }}-{{ item.awb_no }} 
                                                        ({{ item.departure_airport.split(',')[0] }}-{{ item.destination_airport.split(',')[0] }})
                                                    </p>
                                            </router-link>
                                            </a>
                                            <a href="#" class="custom-link mb-0" @click="getHouseWayBill(item.id)">
                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + item.id" custom>
                                                        <p class="mb-0 ml-2"><a :href="'/download-consolidation-pdf/' + item.awb_code+'/' + item.awb_no" target="_blank" class="custom-link">Consolidation Pdf file</a></p>
                                                </router-link>
                                            </a>
                                            <a href="#" class="custom-link mb-0" @click="getHouseWayBill(item.id)">
                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + item.id" custom>
                                                        <p class="mb-0 ml-2"><a :href="'/download-multiple-consolidation-pdf/' + item.id" target="_blank" class="custom-link">Multipage Consolidation Pdf file</a></p>
                                                </router-link>
                                            </a>
                                            <p class="mt-5 mb-0">Issued at: 15 Jun 14:24 By: jgeorgeblr@gln.com</p>
                                        </div>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-modal>
                        <!-- 10 Latest model code Ends here -->
                    </b-row>
                    <hr class="hr" />
                    <b-row>
                        <b-col cols="12">
                            <div class="align-items-center">
                                <h6 class="h-color ml-4 mb-0">Create Electronic Consolidation (FHL)</h6>
                            </div>
                            <div class="d-flex ml-4 my-7">
                                <div class="d-flex">
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                        label-for="input-horizontal"
                                        class="align-items-center">
                                        <template #label>
                                            <span class="">Master no:</span>
                                            <span class="text-danger">*</span>
                                        </template>
                                        <b-form-input id="input-horizontal" class="form-control" style="width: 60px;"
                                            v-model="form.awb_code" :class="{ 'is-invalid': form.errors.has('awb_code') }">
                                        </b-form-input>
                                        <has-error :form="form" field="awb_code"></has-error>
                                    </b-form-group>
                                </div>
                                <div class="d-flex"><span class="d-flex align-items-center pl-3">-</span></div>
                                <div class="d-flex">
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto"
                                        label-for="input-horizontal"
                                        class="align-items-center">
                                        <b-form-input id="input-horizontal" class="form-control" style="width: 150px"
                                            v-model="form.awb_no" :class="{ 'is-invalid': form.errors.has('awb_no') }">
                                        </b-form-input>
                                        <has-error :form="form" field="awb_no"></has-error>
                                    </b-form-group>
                                </div>
                                <b-button style="border-radius:30px;border:1px solid #355594;padding:6px 30px;color:#355594;background:#ffffff !important;" 
                                    class="ml-4" @click="searchWayBills">Search</b-button>
                            </div>
                        </b-col>
                    </b-row>
                    <div v-if="hasSearchResults">
                        <hr class="hr" />
                        <b-row>
                            <b-col cols="12">
                                <div class="d-flex align-items-start py-2">
                                    <table v-if="existingData" style="width: 100%;">
                                        <thead>
                                            <tr class="" style="background-color: #F2F9FF;">
                                                <th class="" style="width:60px !important;">Action</th>
                                                <th class="">Air Waybill Number</th>
                                                <th class="">Master Origin</th>
                                                <th class="">Master Destination</th>
                                                <th class="">Air Waybill Quantity</th>
                                                <th class=""></th>
                                                <th class=""></th>
                                                <th class=""></th>
                                                <th class=""></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="">
                                                    <!-- <b-button class="" style="background:#A4D3EE;">
                                                        <b-icon icon="pencil" font-scale="1"></b-icon>
                                                    </b-button> -->
                                                    <a :href="'/edit-airway-bill/' + existingData.id" class="custom-link" @click="getAirWayBill(existingData.id)">
                                                        <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + existingData.id" custom>
                                                            <b-button class="" style="background:#A4D3EE;">
                                                                <b-icon icon="pencil" font-scale="1"></b-icon>
                                                            </b-button>
                                                        </router-link>
                                                    </a>
                                                </td>
                                                <td class="">
                                                    {{ existingData.awb_code }}-{{ existingData.awb_no }}
                                                </td>
                                                <td class="">
                                                    {{ existingData.departure_airport }}
                                                </td>
                                                <td class="">
                                                    {{ existingData.destination_airport }}
                                                </td> 
                                                <td class="">
                                                    T/{{ existingData.consignment_data ? existingData.consignment_data.pieces : 'N/A' }}/{{ existingData.consignment_data ? existingData.consignment_data.weight_code : 'N/A' }}/{{ existingData.consignment_data ? existingData.consignment_data.gross_weight : 'N/A' }}/
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </b-col>
                        </b-row>
                        <hr class="hr" />
                        <b-row>
                            <b-col cols="12">
                                <div class="py-5">
                                    <b-tabs content-class="mt-3">
                                        <b-tab title="House Waybill Details">
                                            <div class="ml-3 mt-8">
                                                <div class="py-7">
                                                    <b-row>
                                                        <b-col cols="4">
                                                            <b-form-group id="fieldset-hwb" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                                label-for="input-hwb"
                                                                class="" style="margin-bottom: 7px !important;">
                                                                <template #label>
                                                                    <div style="width: 120px;" class="d-flex justify-content-end">
                                                                        <span>HWB No:</span>
                                                                        <span class="text-danger">*</span>
                                                                    </div>
                                                                </template>
                                                                <b-form-input id="input-hwb" class="form-control" style="width:240px;" v-model="form.id" disabled></b-form-input>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="4">
                                                            <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                                label-for="input-destination"
                                                                class=""
                                                                style="width:140px;margin-bottom: 7px !important;">
                                                                <template #label>
                                                                    <div style="width: 120px;" class="d-flex justify-content-end">
                                                                        <span>Origin:</span>
                                                                        <span class="text-danger">*</span>
                                                                    </div>
                                                                </template>
                                                                <div class="custom-dropdown" ref="dropdownContainer_departure" @click="toggleDropdown_departure">
                                                                    <input type="text" v-model="form.master_origin" placeholder="Search Origin" id="departure" class="form-control" 
                                                                        autocomplete="off">
                                                                    <div v-if="isDropdownOpen_departure && filteredLocations_departure.length" class="dropdown-options">
                                                                        <div v-for="(item, index) in filteredLocations_departure" 
                                                                            :key="index" 
                                                                            @click.stop="selectOption_departure(item)" 
                                                                            class="option">
                                                                            {{ item.iata_code }} ({{ item.destination }})
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="4">
                                                            <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                                label-for="input-destination" class="" style="width:140px;margin-bottom: 7px !important;">
                                                                <template #label>
                                                                    <div style="width: 120px;" class="d-flex justify-content-end">
                                                                        <span>Destination:</span>
                                                                        <span class="text-danger">*</span>
                                                                    </div>
                                                                </template>
                                                                <div class="custom-dropdown" ref="dropdownContainer_destination" @click="toggleDropdown_destination">
                                                                    <input type="text" v-model="form.master_destination" placeholder="Search destination" id="destination" class="form-control" 
                                                                        autocomplete="off">
                                                                    <div v-if="isDropdownOpen_destination && filteredLocations_destination.length" class="dropdown-options">
                                                                        <div v-for="(item, index) in filteredLocations_destination" 
                                                                            :key="index" 
                                                                            @click.stop="selectOption_destination(item)" 
                                                                            class="option">
                                                                            {{ item.iata_code }} ({{ item.destination }})
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </b-form-group>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row>
                                                        <b-col cols="4">
                                                            <!-- Pieces input -->
                                                            <b-form-group id="fieldset-hwb" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-hwb"
                                                                class="" style="margin-bottom: 7px !important;">
                                                                <template #label>
                                                                    <div style="width: 120px;" class="d-flex justify-content-end">
                                                                        <span>Pieces:</span>
                                                                        <span class="text-danger">*</span>
                                                                    </div>
                                                                </template>
                                                                <div class="d-flex align-items-center">
                                                                    <b-form-input id="input-hwb" class="form-control" style="width: 65px;" v-model="form.pieces"></b-form-input>
                                                                    <span class="px-4">of</span>
                                                                    <b-form-input id="input-origin" class="form-control" style="width: 65px;" v-model="form.pieces"></b-form-input>
                                                                </div>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="4">
                                                            <!-- Weight input -->
                                                            <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-destination"
                                                            class=""
                                                            style="width:140px;margin-bottom: 7px !important;">
                                                            <template #label>
                                                                <div style="width: 120px;" class="d-flex justify-content-end">
                                                                    <span>Weight:</span>
                                                                    <span class="text-danger">*</span>
                                                                </div>
                                                            </template>
                                                            <b-form-input id="input-destination" class="form-control" v-model="form.gross_weight"></b-form-input>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="4">
                                                            <!-- Volume input -->
                                                            <div class="d-flex">
                                                            <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-destination"
                                                                class="" style="margin-bottom: 7px !important;">
                                                                <template #label>
                                                                    <div style="width: 120px;" class="d-flex justify-content-end">
                                                                        <span>Volume:</span>
                                                                    </div>
                                                                </template>
                                                                <b-form-input id="input-destination" class="form-control" style="width:100px;"></b-form-input>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal"
                                                                label-cols-lg="auto" content-cols-sm
                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                class="" style="padding-left:0px !important;">
                                                                <b-form-select class="form-control"
                                                                style="width:70px;">
                                                                    <option value="">cm3</option>
                                                                    <option value="CC">m3</option>
                                                                    <option value="CC">ft3</option>
                                                                    <option value="CC">in3</option>
                                                                </b-form-select>
                                                            </b-form-group>
                                                            </div>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row>
                                                        <b-col cols="auto">
                                                            <!-- Nature of Goods input -->
                                                            <b-form-group id="fieldset-hwb" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-hwb"
                                                                class="" style="margin-bottom: 7px !important;">
                                                                <template #label>
                                                                    <div style="width: 120px;" class="d-flex justify-content-end">
                                                                        <span>Nature of Goods:</span>
                                                                        <span class="text-danger">*</span>
                                                                    </div>
                                                                </template>
                                                                <b-form-input id="input-hwb" class="form-control" style="width:320px;" v-model="form.description"></b-form-input>
                                                            </b-form-group>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row>
                                                        <b-col cols="auto">
                                                            <!-- Handling Codes input -->
                                                            <b-form-group id="fieldset-horizontal"
                                                                label-cols-lg="auto" content-cols-sm
                                                                content-cols-lg="auto" label="Handling Codes:" label-for="input-horizontal"
                                                                class="">
                                                                <template #label>
                                                                    <div style="width: 120px;" class="d-flex justify-content-end">
                                                                        <span>Handling Codes:</span>
                                                                    </div>
                                                                </template>
                                                                <div class="d-flex align-items-center">
                                                                    <b-form-select class="form-control" style="width:320px;" v-model="selectedCode">
                                                                    <option disabled value="">Select Special Handling Codes</option>
                                                                    <option v-for="code in codes" :key="code.value"
                                                                        :value="code.value">{{ code.text }}</option>
                                                                    <option value="">Select Special Handling Codes</option>
                                                                    </b-form-select>
                                                                    <span class="px-4">Or:</span>
                                                                    <b-form-input id="input-origin" class="form-control" style="width:100px;" v-model="custom_special_handling_code"></b-form-input>
                                                                </div>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="auto">
                                                            <!-- Add button -->
                                                            <b-button style="border-radius:30px;border:1px solid #355594;padding:6px 30px;color:#355594;background:#ffffff !important;" 
                                                            class="ml-4" @click="addManualCode">Add</b-button>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row>
                                                        <b-col cols="auto" class="mt-4">
                                                            <table>
                                                                <thead>
                                                                    <tr class="" style="background-color: #F2F9FF;">
                                                                        <th class="" style="width:400px;font-size: 12px;font-weight:400;padding:4px 0px 4px 6px;">Other Customs Information</th>
                                                                        <th style="width:50px;">&nbsp;</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(code, index) in form.tableCodes" :key="index">
                                                                        <td class="">{{ code }}</td>
                                                                        <td class=""><b-icon icon="trash" font-scale="1"
                                                                            @click="deleteSplCode(index)"></b-icon>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </b-col>
                                                    </b-row>
                                                </div>
                                            </div>
                                        </b-tab>
                                        <b-tab title="Other Customs Information">
                                            <div class="ml-3 mt-8">
                                                <div class="py-7">
                                                    <b-row>
                                                        <b-col cols="auto">
                                                            <table>
                                                                <thead>
                                                                    <tr class="" style="background-color: #F2F9FF;margin-bottom:10px;">
                                                                        <th class="" style="font-size: 12px;font-weight:400;padding:4px 0px 4px 6px;">Country code:</th>
                                                                        <th class="" style="font-size: 12px;font-weight:400;">Information identifier:</th>
                                                                        <th class="" style="font-size: 12px;font-weight:400;">Customs information identifier</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="padding: 12px 20px 0px 0px;">
                                                                            <b-form-group id="fieldset-horizontal">
                                                                                <b-form-select class="form-control"
                                                                                style="width:200px;" v-model="oci_info.country_code">
                                                                                    <option value="">Select a country</option>
                                                                                    <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                                        {{ country.text }}
                                                                                    </option>
                                                                                </b-form-select>
                                                                            </b-form-group>
                                                                        </td>
                                                                        <td class="editable-cell py-4">
                                                                            <b-form-group id="fieldset-horizontal"
                                                                                class="form-control-sm col-form-label"
                                                                                style="width: 240px;">
                                                                                <b-form-select class="form-control-sm"
                                                                                    v-model="oci_info.info_identifier"
                                                                                    :class="{ 'is-invalid': form.errors.has('info_identifier') }">
                                                                                    <option value="">Select a code</option>
                                                                                    <option v-for="oci_option in oci_identifiers.identifiers" 
                                                                                            :key="oci_option.value" 
                                                                                            :value="oci_option.value">
                                                                                        {{ oci_option.text }}
                                                                                    </option>
                                                                                    <has-error :form="form" field="info_identifier"></has-error>
                                                                                </b-form-select>
                                                                            </b-form-group>
                                                                        </td>
                                                                        <td class="editable-cell py-4">
                                                                            <b-form-group id="fieldset-horizontal"
                                                                                class="form-control-sm col-form-label"
                                                                                style="width: 240px;">
                                                                                <b-form-select class="form-control-sm"
                                                                                    v-model="oci_info.custom_info_identifier"
                                                                                    :class="{ 'is-invalid': form.errors.has('custom_info_identifier') }">
                                                                                    <option value="">Select a code</option>
                                                                                    <option v-for="oci_options in oci_data.oci_custom_info_identifier" 
                                                                                            :key="oci_options.value" :value="oci_options.value">
                                                                                        {{ oci_options.text }}
                                                                                    </option>
                                                                                </b-form-select>
                                                                                <has-error :form="form"
                                                                                    field="custom_info_identifier"></has-error>
                                                                            </b-form-group>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div class="d-flex align-items-center pt-4">
                                                                <div>
                                                                    <b-form-group id="fieldset-horizontal"
                                                                        label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="d-flex align-items-center" style="">
                                                                        <template #label>
                                                                            <span class="d-flex justify-content-center" style="width:210px;">Supplementary information:</span>
                                                                        </template>
                                                                        <b-form-input id="input-origin" class="form-control" style="width:350px;" v-model="oci_info.supplementary_info"></b-form-input>
                                                                    </b-form-group>
                                                                </div>
                                                                <div class="d-flex justify-content-end" style="width: 100%;">
                                                                    <b-button style="border-radius:30px;border:1px solid #355594;padding:6px 30px;color:#355594;background:#ffffff !important;"
                                                                    class="" @click="addOtherCustomInfo">{{ editIndex !== null ? 'Update' : 'Add' }}</b-button>
                                                                </div>
                                                            </div>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row>
                                                        <b-col cols="auto" class="mt-4">
                                                            <table>
                                                                <thead>
                                                                    <tr class="" style="background-color: #F2F9FF;">
                                                                        <th class="" style="width:240px;font-size: 12px;font-weight:400;padding:4px 0px 4px 6px;">Other Customs Information</th>
                                                                        <th style="width:180px;">&nbsp;</th>
                                                                        <th style="width:180px;">&nbsp;</th>
                                                                        <th style="width:180px;">&nbsp;</th>
                                                                        <th style="width:60px;">&nbsp;</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(row, index) in form.oci_entries" :key="index">
                                                                        <td><p class="pl-2">{{ row.country_code }}</p></td>
                                                                        <td><p>{{ row.info_identifier }}</p></td>
                                                                        <td><p>{{ row.custom_info_identifier }}</p></td>
                                                                        <td><p>{{ row.supplementary_info }}</p></td>
                                                                        <td><p v-if="row.country_code && row.info_identifier && row.custom_info_identifier && row.supplementary_info"> 
                                                                            <b-icon icon="pencil" font-scale="1" class="mr-2" style="cursor: pointer;" @click="editOciInfo(index)"></b-icon>
                                                                            <b-icon icon="trash" font-scale="1" @click="deleteOciInfo(index)"></b-icon>
                                                                        </p></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </b-col>
                                                    </b-row>
                                                </div>
                                            </div>
                                        </b-tab>
                                    </b-tabs>
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <div class="d-flex justify-content-end align-items-center mr-16 pb-5">
                                    <p class="mb-0 ml-4 mr-4 h-color" style="border-bottom: 1px solid #2637a8;">Cancel</p>
                                    <p class="mb-0 ml-4 mr-4 h-color" style="border-bottom: 1px solid #2637a8;">Add details row</p>
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <div class="py-6">
                                    <table>
                                        <tr class="" style="background-color: #F2F9FF;">
                                            <th class="" style="font-size: 12px;font-weight:400;width: 70px;padding: 4px 0px 4px 10px;">Action</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">House waybill No</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">Origin</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">Destination</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">Quantity</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 407px;">Nature of Goods</th>
                                        </tr>
                                    </table>
                                </div>
                                <div v-for="(waybill, index) in consolidation" :key="index" class="d-flex" style="background-color: #E6EBFF;">
                                    <div class="d-flex justify-content-center" style="width: 70px;background: #A4D3EE;">
                                        <div>
                                            <b-icon icon="pencil" font-scale="1" @click="editConsolidation(waybill.id)"></b-icon>
                                            &nbsp;
                                            <b-icon icon="trash" font-scale="1" @click="deleteConsolidation(waybill.id)"></b-icon>
                                        </div>
                                    </div>
                                    <div class="pl-2" style="width: 200px;">
                                        {{ waybill.id }}
                                    </div>
                                    <div class="" style="width: 200px;">
                                        {{ waybill.master_origin }}
                                    </div>
                                    <div class="" style="width: 200px;">
                                        {{ waybill.master_destination }}
                                    </div>
                                    <div class="" style="width: 200px;">
                                        T/{{ waybill.pieces }}/K/{{  waybill.gross_weight }} 
                                    </div>
                                    <div class="" style="width: 407px;">
                                        {{ waybill.description }}
                                    </div>
                                </div>
                                <!-- <div class="d-flex justify-content-center text-danger mt-2">
                                    <div style="border:1px solid #000;width:700px;">
                                        <p class="pl-2" style="margin: 0px;">Please note the following warning(s):</p>
                                        <ul>
                                            <li>Weight mismatch. Master weight (723) is not the same as HWBs weight (1050.86)</li>
                                        </ul>
                                    </div>
                                </div> -->
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <div class="d-flex justify-content-end align-items-center mr-16 py-8">
                                    <b-button style="border-radius:30px;border:1px solid #355594;padding:6px 30px;color:#355594;background:#ffffff !important;" class="mr-2" @click="generateAwbPDF">Generate PDF</b-button>
                                    <b-button style="border-radius:30px;border:1px solid #355594;padding:6px 30px;color:#355594;background:#ffffff !important;" class="mr-2" @click="converXml(form.awb_no)">Send</b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-else-if="hasSearchResults" class="d-flex flex-column align-items-start pt-2 pb-2">
                        <p>No house waybill information found. Please use the UI above to add house waybills.</p>
                    </div>
                </div>
            </div>
        </div>  
    </div>
</template>
<script>
import Datepicker from "vuejs-datepicker";
import DatePicker from "vue2-datepicker";
import SideBar from "../layout/SideBar.vue";
import ApiService from "@/core/services/api.service";
import "vue2-datepicker/index.css";
export default {
    data() {
        return {
            form: new Form({
                id: '',
                master_origin: '',
                master_destination: '',
                description:'',
                gross_weight: '',
                special_handling_info:'',
                special_service_request:'',
                other_service_information:'',
                awb_code: '',
                awb_no: '',
                
                entries: [],
                oci_entries: [],
                tableCodes: [],
                totals:{
                    total_volume: null,
                    total_amount: 0,
                },
            }),
            selectedViewPageOption: '/consolidation',
            codes: [
                { value: 'ACT', text: 'ACT - Active Temperature Controlled System' },
                { value: 'AOG', text: 'AOG - Aircraft on ground' },
                { value: 'ATT', text: 'ATT - Cargo attached to AWB' },
                { value: 'AVI', text: 'AVI - Live animals' },
                { value: 'BIG', text: 'BIG - Outsized' },
                { value: 'BUP', text: 'BUP - Built up pallet' },
                { value: 'CAO', text: 'CAO - Cargo Aircraft Only' },
                { value: 'CAT', text: 'CAT - Cargo Attendant Accompanying Shipment' },
                { value: 'COL', text: 'COL – Cool Goods/Refrigerated Goods' },
                { value: 'COM', text: 'COM - Company mail' },
                { value: 'CRT', text: 'CRT - Control Room Temperature ' },
                { value: 'DGD', text: 'DGD - Dangerous Goods as per attached DGD or DGD-CAO' },
                { value: 'DIP', text: 'DIP - Diplomatic mail' },
                { value: 'EAP', text: 'EAP - e-freight Consignment with Accompanying Documents' },
                { value: 'EAW', text: 'EAW - e-freight Consignment with No Accompanying Documents' },
                { value: 'EAT', text: 'EAT - Foodstuffs' },
                { value: 'ECC', text: 'ECC - Electronically Concluded Cargo Contract' },
                { value: 'ELI', text: 'ELI - Lithium Ion batteries excepted class 9' },
                { value: 'ELM', text: 'ELM - Lithium Metal batteries excepted class 9' },
                { value: 'EMD', text: 'EMD - Electronic Monitoring Devices on/in Cargo/Container' },
                { value: 'ERT', text: 'ERT - Extended Room Temperature +2°C to +25°C' },
                { value: 'FIL', text: 'FIL - Undeveloped/unexposed film' },
                { value: 'FRI', text: 'FRI - Frozen Goods Subject to Veterinary/Phytosanitary Inspections' },
                { value: 'FRO', text: 'FRO - Frozen Goods (not for dry ice but -20 C products)' },
                { value: 'GCO', text: 'GCO - General Cargo' },
                { value: 'GOG', text: 'GOG - Hanging Garments' },
                { value: 'HEA', text: 'HEA - Heavy Cargo, over 150kg pc' },
                { value: 'HEG', text: 'HEG - Hatching Eggs' },
                { value: 'HUM', text: 'HUM - Human remains' },
                { value: 'ICE', text: 'ICE - Dry ice' },
                { value: 'LHO', text: 'LHO - Living Human Organs/Blood' },
                { value: 'LIC', text: 'LIC - License Required' },
                { value: 'MAG', text: 'MAG - Magnetised Material' },
                { value: 'MAL', text: 'MAL - Mail ' },
                { value: 'MUW', text: 'MUW - Munitions / Guns' },
                { value: 'NDA', text: 'NDA - No dims Available' },
                { value: 'NWP', text: 'NWP - Newspapers / Magazines' },
                { value: 'OBX', text: 'OBX - Obnoxious Cargo' },
                { value: 'OCI', text: 'OCI - Other Customs, Security and Regulatory Control Information' },
                { value: 'OHG', text: 'OHG - Overhang Items ' },
                { value: 'OSI', text: 'OSI - Other Service Information' },
                { value: 'PAC', text: 'PAC - Passenger and Cargo' },
                { value: 'PEA', text: 'PEA - Hunting trophies' },
                { value: 'PEF', text: 'PEF - Flowers' },
                { value: 'PEM', text: 'PEM - Meat' },
                { value: 'PEP', text: 'PEP - Fruits and Vegetables' },
                { value: 'PER', text: 'PER - Perishable cargo' },
                { value: 'PES', text: 'PES - Fish / Seafood' },
                { value: 'PIL', text: 'PIL - Pharmaceuticals' },
                { value: 'QRT', text: 'QRT - Quick Ramp Transfer ' },
                { value: 'RAC', text: 'RAC - Reserverd Air Cargo' },
                { value: 'RBI', text: 'RBI - Fully regulated lithium ion batteries (Class 9, UN 3480) as per Section IA and IB of PI 965' },
                { value: 'RBM', text: 'RBM - Cargo-XML Manual and ToolkitFully regulated lithium metal batteries (Class 9, UN 3090) as per Section IA and IB of PI 968' },
                { value: 'RCL', text: 'RCL - Cryogenic Liquid' },
                { value: 'RCM', text: 'RCM - Corrosive' },
                { value: 'RCX', text: 'RCX - Explosives 1.3C' },
                { value: 'RDS', text: 'RDS - Biological Substance' },
                { value: 'REQ', text: 'REQ - Dangerous Goods in Excepted Quantities' },
                { value: 'REX', text: 'REX - To be reserved for normally forbidden Explosives, Divisions 1.1, 1.2, 1.3, 1.4F, 1.5 and 1.6' },
                { value: 'RFG', text: '>RFG - Flammable Gas' },
                { value: 'RFL', text: 'RFL - Flammable Liquid' },
                { value: 'RFS', text: 'RFS - Flammable Solid' },
                { value: 'RFW', text: 'RFW - Dangerous When Wet' },
                { value: 'RGX', text: 'RGX - Explosives 1.3G' },
                { value: 'RIS', text: 'RIS - Infectious Substance' },
                { value: 'RLI', text: 'RLI - Litium Ion batteries' },
                { value: 'RLM', text: 'RLM - Litium Metal batteries' },
                { value: 'RMD', text: 'RMD - Miscellaneous Dangerous Goods' },
                { value: 'RNG', text: 'RNG - Non-Flammable Gas' },
                { value: 'ROP', text: 'ROP - Organic Peroxide' },
                { value: 'ROX', text: 'ROX - Oxidiser' },
                { value: 'RPB', text: 'RPB - Poison' },
                { value: 'RPG', text: 'RPG - Toxic (Poison) Gas' },
                { value: 'RRE', text: 'RRE - Excepted Quantities of Radioactive Material' },
                { value: 'RRW', text: 'RRW - Radioactive - White' },
                { value: 'RRY', text: 'RRY - Radioactive - Yellow' },
                { value: 'RSB', text: 'RSB - Polystyrene Beads' },
                { value: 'RSC', text: 'RSC - Spontaneously Combustible' },
                { value: 'RXB', text: 'RXB - Explosives 1.4B' },
                { value: 'RXC', text: 'RXC - Explosives 1.4C' },
                { value: 'RXD', text: 'RXD - Explosives 1.4D' },
                { value: 'RXE', text: 'RXE - Explosives 1.4E' },
                { value: 'RXG', text: 'RXG - Explosives 1.4G' },
                { value: 'RXS', text: 'RXS - Explosives' },
                { value: 'SAL', text: 'SAL - Surface Mail ' },
                { value: 'SCO', text: 'SCO - Cargo Secure for All-Cargo Aircraft Only ' },
                { value: 'SFX', text: 'SFX - Expedair Service ' },
                { value: 'SHL', text: 'SHL - Save Human Life ' },
                { value: 'SHR', text: 'SHR - Secure for Passenger, All-Cargo and All-Mail Aircraft in Accordance with High Risk Requirements ' },
                { value: 'SPF', text: 'SPF - Laboratory Animals' },
                { value: 'SPX', text: 'SPX - Cargo Secure for Passenger and All-Cargo Aircraft ' },
                { value: 'SUR', text: 'SUR - Surface Transportation' },
                { value: 'SWP', text: 'SWP - Sporting weapons' },
                { value: 'VAL', text: 'VAL - Valuable cargo' },
                { value: 'VOL', text: 'VOL - Volume' },
                { value: 'VUN', text: 'VUN - Vulnerable Cargo' },
                { value: 'WET', text: 'WET - Shipments of Wet Material not Packed in Watertight Containers' },
                { value: 'XPH', text: 'XPH - Equation Heavy for KLM' },
                { value: 'XPS', text: 'XPS - 236 XPS' },
            ],
            oci_info:{
                country_code: '',
                info_identifier: '',
                custom_info_identifier: '',
                supplementary_info: '',
            },
            countries:[],
            searchQuery_to: '',
            isDropdownOpen_departure: false,
            isDropdownOpen_destination: false,
            selectedCode: '',
            custom_special_handling_code: '',
            manualCode: '',
            validationErrors: [],
            hs_code_error: [],
            location: [],
            isOpen: false,
            consolidation: [],
            editIndex: null,
            edit_entry_index: null,
            hasSearchResults: false,
            data_items: [],
            oci_data:{}, ///get-oci-data
            oci_identifiers:{},
            tableData: [],
            existingData: {},
            items: [
                {
                    url: "#webdoc",
                    name: "WebDoc",
                },
                {
                    url: "#booking",
                    name: "Booking(FFR)",
                },
                {
                    url: "#webdoc",
                    name: "WebDoc",
                    children: [
                        {
                            url: "#booking",
                            name: "Booking(FFR)",
                        },
                        {
                            url: "#air_waybill",
                            name: "Air Waybill(FWB)",
                        },
                        {
                            url: "/house-way-bill",
                            name: "House Waybill(FHL)",
                        },
                        {
                            url: "/consolidation",
                            name: "Consolidation(FHL)",
                        },
                        {
                            url: "#import_mail_data",
                            name: "Import Mail Data",
                        },
                        {
                            url: "#create_label",
                            name: "Create Label",
                        },
                        {
                            url: "message-log",
                            name: "Message Log",
                        },
                        {
                            url: "#maintain_contracts",
                            name: "Maintain Contracts",
                        },
                        {
                            url: "#web_doc_printer_setup",
                            name: "WebDoc Printer Setup",
                        },
                        {
                            url: "#help",
                            name: "Help",
                        },
                    ],
                },
                {
                    url: "#contact",
                    name: "Contact",
                },
            ],
            options: [
                { text: "Me", value: "1" },
                { text: "Participant Group", value: "1" },
            ],
            logoSrc: "/media/custome/logo-1.png",
        };
    },

    methods: {
        onSelect(value) {
            // Redirect to the selected page
            if (value) {
                window.location.href = value;  // This will navigate to the selected page
            }
        },
        generateAwbPDF(awbNo = this.form.awb_no, awbCode = this.form.awb_code) {
            const awb_code = this.form.awb_code; // Access the awb_code from the form data
            const awb_no = this.form.awb_no;
            const itemId = awb_code+awb_no; // Access the awb_no from the form data
            const pdfUrl = `/download-consolidation-pdf/${awb_code}/${awb_no}`; // Construct the URL for the PDF
            window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
            
        },
        referTOEditAwb() {
            // Navigating to another route using Vue Router
            // this.$router.push({ name: 'YourPage' });  // Replace 'YourPage' with the name of your route
        },
        mouseover: function () {
            this.isOpen = true;
        },
        mouseleave: function () {
            this.isOpen = false;
        },
        converXml(awb_no){
            ApiService.get(`/waybill/${awb_no}`)
                .then(({ data }) => {
                    console.log(data);
                });
        },
        showModal() {
            this.$refs["my-modal"].show();
        },
        hideModal() {
            this.$refs["my-modal"].hide();
        },
        toggleModal() {
            this.$refs["my-modal"].toggle("#toggle-btn");
        },
        handleOk(bvModalEvent) {
            bvModalEvent.preventDefault();
        },
        // location
        getLocation() {
            ApiService.get(`/get-location`).then(({ data }) => {
                this.location=data;
            });
        },
        onSubmit(evt) {
            evt.preventDefault();
            // this.form.put(`/update-consolidation`).then(response => {
            //     console.log(response);
            // })
        },
        allHousewayBill() {
            ApiService.get('/all-houseway-bill')
                .then(response => {
                    this.data_items = response.data;
                })
                .catch(error => {
                    console.error("Failed to fetch items:", error);
                });
        },
        allConsolidation(){
            // ApiService.get(`/all-consolidation`).then(({ data }) => {
            //     this.consolidation =  data;
            //     console.log("consolidation", data);
            // });
        },
        searchWayBills() {
            // this.hasSearchResults = true;
            this.form.post('/search-house-way-bills', {
                awb_no: this.form.awb_no,
                awb_code: this.form.awb_code
            })
            .then(response => {
                if (response.data && response.data.length) {
                    console.log("console data", response.data);
                    const id = `${this.form.awb_code}${this.form.awb_no}`;
                    console.log("id", id);
                    this.getAirWayBill(id);
                    this.consolidation = response.data;
                    this.hasSearchResults = true; 
                } else {
                    this.form = [];
                    this.hasSearchResults = true; 
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.form = [];
                this.hasSearchResults = true; 
            });
        },
        getAirWayBill(id) { 
            ApiService.get(`/airway-bill/${id}`)
                .then(response => {
                    if (response.data && response.data.id == id) {
                        this.existingData = response.data;
                    } else {
                       console.log("something went wrong");
                    }
                })
                .catch(error => {
                    this.existingData = null;
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        updateform(id){
            this.form.put(`/update-consolidation/${this.form.id}`)
            .then(response => {
                console.log("Waybill updated:", response.data);
            })
            .catch(error => {
                console.error("Error updating waybill:", error);
            });
        },
        editConsolidation(id) {
            const item = this.consolidation.find((waybill) => waybill.id === id);
            if (item) {
                console.log("item.country_code:", this.consolidation);
                this.form.id = item.id;
                this.form.master_origin = item.master_origin;
                this.form.master_destination = item.master_destination;
                this.form.description = item.description;
                this.form.pieces = item.pieces;
                this.form.gross_weight = item.gross_weight;
                this.form.other_service_information = item.other_service_information;
                this.form.oci_entries = item.custom_info || [];
                if (item.special_handling_info && typeof item.special_handling_info === 'string') {
                    try {
                        this.form.tableCodes = JSON.parse(item.special_handling_info);
                    } catch (error) {
                        console.error("Error parsing special_handling_info:", error);
                        this.form.tableCodes = [];
                    }
                } else {
                    this.form.tableCodes = [];
                }
                console.log("Editing consolidation with ID:", id);
            } else {
                console.warn("Item not found for ID:", id);
            }
        },
        deleteConsolidation(index) {
            console.log("Deleting code at index", index);
            this.form.tableCodes.splice(index, 1);
        },
        getCountry(){
            ApiService.get('/get-country').then(({ data }) => {
                this.countries = Object.keys(data).map(key => ({
                    value: key,
                    text: data[key]
                }));
            }).catch(error => {
                console.error("Error fetching countries:", error);
            });
        },
        getAgent(){
            ApiService.get(`/agent-info/`)
                .then(({ data }) => {
                if (Array.isArray(data) && data.length > 0) {
                    this.agent_information = data[0];
                    this.iata_cass = {
                        iata_agent_code: this.agent_information.iata_agent_code || null,
                        iata_agent_cass: this.agent_information.iata_agent_cass || null
                    };
                } else {
                    this.agent_information = data;
                }
                })
                .catch(error => {
                    console.error("Error fetching agent information:", error);
                });
        },
        getOCIData(){
            ApiService.get('/get-oci-data').then(({ data }) => {
            if (data && data.oci_custom_info_identifier) {
                this.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(([key, value]) => ({
                    value: key,
                    text: value
                }));
            } else {
                this.oci_data.oci_custom_info_identifier = [];
            }
            if(data && data.identifiers){
                this.oci_identifiers.identifiers = Object.entries(data.identifiers).map(([key, value]) => ({
                    value: key,
                    text: value
                }));
            }
            }).catch(error => {
                console.error("Error fetching countries:", error);
                this.oci_data.oci_custom_info_identifier = []; 
            });
        },
        handleRadioChange() {
            const selectedCode = this.selectedCode;
            this.form.tableCodes = [];
            this.form.tableCodes.push(selectedCode);
        },
        // addManualCode() {
        //     const code = this.selectedCode || this.manualCode.trim();
        //     if (code) {
        //         if (!this.form.tableCodes.includes(code)) {
        //             this.form.tableCodes.push(code);
        //             console.log("Table code ", this.form.tableCodes);
        //         } else {
        //             alert('This code is already added.');
        //         }
        //     } else {
        //         alert('Please select or enter a code.');
        //     }
        //     this.selectedCode = '';
        //     this.manualCode = '';
        // },
        addManualCode() {
            if (!Array.isArray(this.form.tableCodes)) {
                this.form.tableCodes = [];
            }
            const code = this.selectedCode || this.custom_special_handling_code.trim();
            if (code) {
                if (!this.form.tableCodes.includes(code)) {
                    this.form.tableCodes.push(code);
                    console.log("Table codes:", this.form.tableCodes);
                } else {
                    alert('This code is already added.');
                }
            }
            this.selectedCode = '';
            this.custom_special_handling_code = '';
        },
        deleteSplCode(index) {
            this.form.tableCodes.splice(index, 1);
        },
        getOriginCode(airportString) {
            if (airportString) {
                return airportString.split(',')[0];
            }
            return '';
        },
        getDestinationCode(airportString) {
            if (airportString) {
                return airportString.split(',')[0];
            }
            return '';
        },
        editOciInfo(index) {
            this.editIndex = index;
            this.oci_info = { ...this.form.oci_entries[index] };
        },
        addOtherCustomInfo() {
            if (!this.oci_info.info_identifier || !this.oci_info.supplementary_info) {
                alert('Please fill in all fields');
                return;
            }
            if(!this.oci_info.info_identifier){}
            if (this.editIndex !== null) {
                this.form.oci_entries[this.editIndex] = { ...this.oci_info };
                this.editIndex = null;
            } else {
                this.form.oci_entries.push({ ...this.oci_info });
            }
            for (let key in this.oci_info) {
                if (this.oci_info.hasOwnProperty(key)) {
                    this.oci_info[key] = '';
                }
            }
        },
        deleteOciInfo(index) {
            // this.oci_entries.splice(index, 1);
            if (this.form.oci_entries.length > index) {
                this.form.oci_entries.splice(index, 1);
            }
        },
        toggleDropdown_departure() {
            this.isDropdownOpen_departure = !this.isDropdownOpen_departure;
        },
       
        selectOption_departure(item) {
            this.form.master_origin = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.master_origin.departure_airport = final_set;
            this.isDropdownOpen_departure = false;
        },
        toggleDropdown_destination() {
            this.isDropdownOpen_destination = !this.isDropdownOpen_destination;
        },
        selectOption_destination(item) {
            this.form.master_destination = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.master_destination = final_set;
            this.isDropdownOpen_destination = false;
        },
        closeDropdown_departure(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_departure;
            if (dropdownContainer_to && !dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_destination = false;
            }
        },
        closeDropdown_destination(event) {
            const dropdownContainer_des = this.$refs.dropdownContainer_destination;
            if (dropdownContainer_des && !dropdownContainer_des.contains(event.target)) {
                this.isDropdownOpen_departure = false;
            }
        },
    },
    mounted(){
        this.getLocation(); 
        this.getCountry();
        this.getOCIData();
        // this.allConsolidation();
        this.allHousewayBill();
        this.location = [];
        window.addEventListener('click', this.closeDropdown_destination);
        window.addEventListener('click', this.closeDropdown_departure);
    },
    watch: {
        '$route.params.id'(newId) {
            if (newId) {
                this.getAirWayBill(newId);
            }
        }
    },
    created() {
        const id = this.$route.params.id;
        if (id) {
            this.isEdit = true;
            this.getAirWayBill(id);
        }
        this.getOCIData();
    },
    computed: {
        filteredLocations_destination() {
            const query = this.form.master_destination.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
        filteredLocations_departure() {
            const query = this.form.master_origin.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
    },
    components: {
        Datepicker,
        DatePicker,
        SideBar
    },
};
</script>

<style scoped>
.form-row {
    flex-wrap: nowrap !important;
}
header {
    width: 100%;
    background-color: #2637a8;
}

.h-color {
    color: #355594;
}

.h_background_color {
    background-color: #2637a8;
    color: white;
}

#nav {
    display: flex;
    /* align-items: center;
    justify-content: center; */
    width: 100%;
    max-width: 1280px;
    /* margin: 0 auto; */
}

#nav>ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style-type: none;
}

#nav>ul>li:hover {
    background-color: gray;
}

#nav>ul>li>span:after {
    display: inline-block;
}

#nav>ul>li>a {
    display: block;
    height: auto;
    padding: 3px;
    color: #fff;
    text-decoration: none;
}

#nav>ul>li>span {
    position: relative;
    display: block;
    height: auto;
    padding: 3px;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
}

li {
    border-right: 1px solid white;
}

#nav>ul>li>span:after {
    /* content: '▼'; */
    display: inline-block;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    padding: 0;
    list-style-type: none;
    background-color: gray;
}

.dropdown li {
    /* width: 250px; */
    width: 150px;
    border-bottom: 1px solid #fff;
}

.dropdown li a {
    display: block;
    /* padding: 10px; */
    padding-left: 5px;
    color: #fff;
    text-decoration: none;
}

.isOpen {
    display: block;
}

.custom-btn {
    transition: background-color 0.3s;
}

/* #show-btn:hover {
  background-color: #007bff;
} */

.custom-btn:hover {
    background-color: #007bff !important;
    color: white !important;
}

.form-group {
    margin-bottom: 0px !important;
}

.form-control-sm {
    /* height: calc(1.5em + 0.5rem + 2px) !important; */
}

.col-form-label {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    font-size: inherit !important;
    line-height: 1.5 !important;
}

.background-color {
    background-color: grey;
}

.hr {
    border-top: 2px solid #CDCDCD;
}

.aselect {
    position: relative;
    width: 200px;
    /* Adjust the width as needed */
}

.selector.box {
    position: relative;
}

.custom-select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="34" viewBox="0 0 24 24"><path fill="black" d="M7 10l5 5 5-5z"/></svg>') no-repeat right center;
        background-color: white;
        font-size: 14px;
        cursor: pointer;
        width: 100%;
    }

    .custom-select:focus {
        outline: none;
        border-color: #5cb3fd;
    }

.nav-tabs .nav-links {
    border: 2px solid black;
}

.mh-100vh {
    /* min-height: 100vh; */
}

.table {
    max-width: 400px;
    border: 0;
}

td.editable-cell1 {
    border: 1 solid gray !important;
}

td.editable-cell {
    border: 0 !important;
}

th {
    border: 0 !important;
}

.form-control {
    border: 1px solid #A6A6A6;
    height: 38px !important;
    border-radius: 7px !important;
}

.form-control1 {
    border: 2px solid gray;
    width: 150px;
    height: 25px;
}

.custom-link {
    display: block;
    margin-bottom: 0.5rem;
    color: red;
    text-decoration: none;
}

.custom-link:hover {
    color: #2637a8;
    text-decoration: underline #2637a8 !important;
    text-decoration-color: #2637a8;
}

.column_b {
    border: 1px solid #b1b1b1;
}
.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  /* border: solid 1px silver; */
  border-radius: 5px;
}

.dropdown-options {
  /* position: absolute; */
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1;
}

.option {
  padding: 5px 10px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
}

.custom-label-styling label {
    font-size: 1rem;
    font-weight: 400;
    color: #3F4254;
    width: 180px;
}

.custom-label-styling-two label {
    font-size: 1rem;
    font-weight: 400;
    color: #3F4254;
    width: 100px;
}

.hwb-details input, .hwb-details select {
    border-radius: 0px !important;
}
.hwb-details button {
    padding: 4px 12px;
    border: 1px solid #000;
    border-radius: 4px;
}
.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  /* border: solid 1px silver; */
  border-radius: 5px;
}

.dropdown-options {
  /* position: absolute; */
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1;
}

.option {
  padding: 5px 10px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
} 
</style>
<style>
    .nav-tabs {
        border-bottom: 0px !important;
    }
    .nav-link {
        color: #355594 !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        border: none !important;
        padding: 0px !important;
        margin: 0px 10px !important;
    }
    .nav-link:hover, .nav-link.active {
        border-bottom: 2px solid #355594 !important;
    }
</style>