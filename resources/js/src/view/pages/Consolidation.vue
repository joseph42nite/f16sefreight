<template>
    <div class="bg-white" style="height: auto !important">
        <template>
            <header>
                <nav id="nav">
                    <ul style="z-index: 1098">
                        <li v-for="item in items">
                            <a :href="item.url" v-if="!item.children">
                                {{ item.name }}
                            </a>
                            <span v-else v-on:mouseover="mouseover" v-on:mouseleave="mouseleave">
                                {{ item.name }}

                                <ul class="dropdown" :class="{ isOpen }">
                                    <li v-for="child in item.children">
                                        <a :href="child.url">
                                            {{ child.name }}
                                        </a>
                                    </li>
                                </ul>
                            </span>
                        </li>
                    </ul>
                </nav>
            </header>
        </template>
        <template>
            <div class="d-flex justify-content-center align-items-center mt-5 bg-white">
                <b-button id="show-btn" v-b-modal.modal-ss class="mx-2 custom-btn">Activity</b-button>
                <!-- <b-button id="toggle-btn" class="mx-2 custom-btn" v-b-modal.modal-prevent-closing>Search</b-button> -->
                <b-button id="show-btn" v-b-modal.modal-s class="mx-2 custom-btn">10 Latest</b-button>
                <b-button id="toggle-btn" @click="toggleModal" class="mx-2 custom-btn">Related</b-button>

                <b-modal id="modal-ss" title="Activity" ok-only>
                    <div class="d-block">
                        <h3>Updated:04:49</h3>
                    </div>
                </b-modal>
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

                <b-modal id="modal-prevent-closing" ref="modal" title="Submit Your Name" @ok="handleOk">
                    <form ref="form">
                        <b-form-group label="Cereated By:" label-for="name-input" v-slot="{ ariaDescribedby }">
                            <!-- <b-form-input id="name-input"></b-form-input> -->
                            <b-form-radio-group id="radio-slots" :options="options" :aria-describedby="ariaDescribedby"
                                name="radio-options-slots"></b-form-radio-group>
                        </b-form-group>
                        <b-form-group id="fieldset-horizontal" label-cols-lg="4" content-cols-sm content-cols-lg="4"
                            label="Id:" label-for="input-horizontal" class="form-control-sm">
                            <b-form-input id="input-horizontal" class="form-control-sm"></b-form-input>
                        </b-form-group>
                        <b-form-group id="fieldset-horizontal" label-cols-lg="4" content-cols-sm content-cols-lg="2"
                            label="Destination:" label-for="input-horizontal" class="form-control-sm col-form-label">
                            <b-form-input id="input-horizontal" class="form-control-sm"></b-form-input>
                        </b-form-group>
                        <b-form-group id="fieldset-horizontal" label-cols-lg="4" content-cols-sm content-cols-lg="2"
                            label="Issued:" label-for="input-horizontal" class="form-control-sm">
                            <b-form-checkbox size="sm"></b-form-checkbox>
                        </b-form-group>
                        <b-form-group id="fieldset-horizontal" label-cols-lg="4" content-cols-sm content-cols-lg="2"
                            label="Draft:" label-for="input-horizontal" class="form-control-sm">
                            <b-form-checkbox size="sm"></b-form-checkbox>
                        </b-form-group>
                        <b-form-group id="fieldset-horizontal" label-cols-lg="4" content-cols-sm content-cols-lg="2"
                            label="Not Issue:" label-for="input-horizontal" class="form-control-sm">
                            <b-form-checkbox size="sm"></b-form-checkbox>
                        </b-form-group>
                    </form>
                </b-modal>

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
                <b-modal id="modal-templates" title="Templates" ok-only>
                    <div class="d-block">
                        <b-form-group v-slot="{ ariaDescribedby }">
                            <b-row>
                                <b-col cols="auto">
                                    <h6>Created by:</h6>
                                </b-col>
                                <b-col cols="auto">
                                    <b-form-radio :aria-describedby="ariaDescribedby" name="some-radios"
                                        value="A">Me</b-form-radio>
                                </b-col>
                                <b-col cols="auto">
                                    <b-form-radio :aria-describedby="ariaDescribedby" name="some-radios"
                                        value="B">Participant group</b-form-radio>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-label">
                            <b-row align-v="center">
                                <label>Template</label>
                                <b-col cols="auto">
                                    <b-form-select class="form-control-sm" style="width: 220px">
                                        <option disabled value="">
                                            Please choose a Custom Origin
                                        </option>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                    </b-form-select>
                                </b-col>
                            </b-row>
                        </b-form-group>

                        <hr class="hr" />
                        <h4 class="h-color">Save</h4>
                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-lg="auto" label="Name:"
                            label-for="input-horizontal" class="form-control-sm col-form-label">
                            <b-row>
                                <b-col cols="auto">
                                    <b-form-input id="input-horizontal" class="form-control-sm"
                                        style="width: 200px"></b-form-input>
                                </b-col>
                                <b-col>
                                    <b-button>+Save</b-button>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <h3 class="h-color font-weight-bolder mt-lg-10">
                            Modify your templates
                        </h3>
                        <h5 style="font-size: smaller">
                            Showing all templates in participant group
                        </h5>
                        <h5 class="text-danger ml-5">No Templates found</h5>
                        <hr class="hr mt-lg-12" />
                        <h5 style="font-size: smaller">
                            The e-AWB can be saved as 'draft' and a list with
                            draft e-AWB created during the day will be presented
                            below. The last 10 e-AWB will be visible.
                        </h5>
                    </div>
                </b-modal>
            </div>
        </template>
        <div class="container mt-lg-15 border-2 bg-light p-2"
            style="margin-bottom: 20px; border-bottom: 1px solid black">
            <template>
                <!-- <b-form @submit.prevent="onSubmit"> -->
                    <div class="container">
                        <div class="h_background_color text-white pt-2 pb-2">
                            <table>
                                <tr>
                                    <th class="pl-2">
                                        Create Electronic Consolidation (FHL)
                                    </th>
                                </tr>
                            </table>
                        </div>
                        <div class="d-flex mt-5">
                            <div>
                                <b-form-group id="fieldset-horizontal" content-cols-sm
                                    content-cols-lg="auto"
                                    class="form-control-sm">
                                    <template #label>
                                        <label>Master no: <span class="text-danger">*</span></label>
                                    </template>
                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 40px;border-radius: 0px;"
                                        v-model="form.awb_code" :class="{ 'is-invalid': form.errors.has('awb_code') }">
                                    </b-form-input>
                                    <has-error :form="form" field="awb_code"></has-error>
                                </b-form-group>
                            </div>
                            -
                            <div>
                                <b-form-group id="fieldset-horizontal" content-cols-sm
                                    content-cols-lg="auto"
                                    class="form-control-sm">
                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 120px"
                                        v-model="form.awb_no" :class="{ 'is-invalid': form.errors.has('awb_no') }">
                                    </b-form-input>
                                    <has-error :form="form" field="awb_no"></has-error>
                                </b-form-group>
                            </div> 
                            <button @click="searchWayBills">Search</button>
                        </div>
                        <hr class="hr" />

                        <div v-if="hasSearchResults">
                            <div class="d-flex flex-column align-items-start pt-2 pb-2">
                                    <table v-if="existingData">
                                        <thead>
                                            <tr class="h_background_color">
                                                <th class="form-control1 text-white" style="width:60px !important;">Action</th>
                                                <th class="form-control1 text-white">Air Waybill Number</th>
                                                <th class="form-control1 text-white">Master Origin</th>
                                                <th class="form-control1 text-white">Master Destination</th>
                                                <th class="form-control1 text-white">Air Waybill Quantity</th>
                                                <th class="form-control1 text-white"></th>
                                                <th class="form-control1 text-white"></th>
                                                <th class="form-control1 text-white"></th>
                                                <th class="form-control1 text-white"></th>
                                            </tr>
                                        </thead>
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
                                        <!-- </tbody>weight_code gross_weight -->
                                    </table>
                            </div>

                            <hr class="hr" />

                            <div>
                                <div class="py-md-4">
                                    <b-tabs content-class="">
                                        <b-tab title="House Waybill Details" class="bg-white" style="border:1px solid #000 !important;">
                                            <b-row class="hwb-details mt-5 mb-1">
                                                <b-col cols="auto">
                                                    <b-form-group id="fieldset-hwb" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-hwb" label="HWB No: *"
                                                    class="form-control-sm custom-label-styling"
                                                    style="width:500px;">
                                                        <template #label>
                                                            <label>HWB No: *</label>
                                                        </template>
                                                    <b-form-input id="input-hwb" class="form-control-sm" style="width:250px;" v-model="form.id" disabled></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto">
                                                    <!-- Weight input -->
                                                    <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-destination" label="Origin: *"
                                                    class="form-control-sm custom-label-styling-two"
                                                    style="width:350px;">
                                                    <template #label>
                                                        <label>Origin: *</label>
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
                                                <b-col cols="auto" style="padding-right:0px !important;">
                                                    <!-- Volume input -->
                                                    <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-destination"
                                                    label="Destination: *" class="form-control-sm custom-label-styling-two">
                                                    <template #label>
                                                        <label>Destination: *</label>
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
                                                    <!-- <b-form-input  v-model="form.master_destination" id="input-destination" class="form-control-sm" style="width:70px;padding-right:0px !important;"></b-form-input> -->
                                                    </b-form-group>
                                                </b-col>
                                            </b-row>
                                            <!-- <b-row class="hwb-details mb-2">
                                                <b-col cols="auto">
                                                    <b-form-group id="fieldset-horizontal"
                                                        label-cols-lg="auto" content-cols-sm
                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                        class="form-control-sm custom-label-styling"
                                                        label="Ship Code:*">
                                                        <template #label>
                                                            <label>Ship Code:</label>
                                                        </template>
                                                        <b-form-select class="form-control-sm"
                                                        style="width:180px;">
                                                            <option value="T"> Total Consignment</option>
                                                            <option value="D">Divided Consignment</option>
                                                            <option value="M">Multi Shipments</option>
                                                            <option value="P">Part Consignment</option>
                                                            <option value="S">Split Consignment</option>
                                                        </b-form-select>
                                                    </b-form-group>
                                                </b-col>
                                            </b-row> -->
                                            <b-row class="hwb-details mb-1">
                                                <b-col cols="auto">
                                                    <!-- Pieces input -->
                                                    <b-form-group id="fieldset-hwb" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-hwb"
                                                    label="Pieces: *"
                                                    class="form-control-sm col-form-label custom-label-styling"
                                                    style="padding-right:0px !important;">
                                                        <template #label>
                                                            <label>Pieces: *</label>
                                                        </template>
                                                        <b-form-input id="input-hwb" class="form-control-sm" style="width: 50px;" v-model="form.pieces"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto" style="padding-left:0px;">
                                                    <!-- of label -->
                                                    <b-form-group id="fieldset-origin" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label="of" label-for="input-origin"
                                                    class="form-control-sm col-form-label"
                                                    style="width:240px;padding-left:0px !important;">
                                                    <b-form-input id="input-origin" class="form-control-sm" style="width: 50px;" v-model="form.pieces"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto">
                                                    <!-- Weight input -->
                                                    <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-destination" label="Weight: *"
                                                    class="form-control-sm custom-label-styling-two"
                                                    style="width:350px;">
                                                    <template #label>
                                                        <label>Weight: *</label>
                                                    </template>
                                                    <b-form-input id="input-destination" class="form-control-sm" v-model="form.gross_weight"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto" style="padding-right:0px !important;">
                                                    <!-- Volume input -->
                                                    <b-form-group id="fieldset-destination" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-destination"
                                                    label="Volume:" class="form-control-sm custom-label-styling-two">
                                                    <template #label>
                                                        <label>Volume:</label>
                                                    </template>
                                                    <b-form-input id="input-destination" class="form-control-sm" style="width:70px;padding-right:0px !important;"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto" style="padding-left:0px !important;padding-right:0px !important;">
                                                    <!-- Volume Select -->
                                                    <b-form-group id="fieldset-horizontal"
                                                        label-cols-lg="auto" content-cols-sm
                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                        class="form-control-sm" style="padding-left:0px !important;">
                                                        <b-form-select class="form-control-sm"
                                                        style="width:70px;">
                                                            <option value="">cm3</option>
                                                            <option value="CC">m3</option>
                                                            <option value="CC">ft3</option>
                                                            <option value="CC">in3</option>
                                                        </b-form-select>
                                                    </b-form-group>
                                                </b-col>
                                            </b-row>
                                            <b-row class="hwb-details mb-4">
                                                <b-col cols="auto">
                                                    <!-- Nature of Goods input -->
                                                    <b-form-group id="fieldset-hwb" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-hwb" label="Nature of Goods: *"
                                                    class="form-control-sm custom-label-styling">
                                                        <template #label>
                                                            <label>Nature of Goods: *</label>
                                                        </template>
                                                        <b-form-input id="input-hwb" class="form-control-sm" style="width:300px;" v-model="form.description"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                            </b-row>
                                            <b-row class="hwb-details mb-4">
                                                <b-col cols="auto" style="padding-right:0px!important;">
                                                    <!-- Handling Codes input -->
                                                    <b-form-group id="fieldset-horizontal"
                                                        label-cols-lg="auto" content-cols-sm
                                                        content-cols-lg="auto" label="Handling Codes:" label-for="input-horizontal"
                                                        class="form-control-sm custom-label-styling">
                                                        <template #label>
                                                            <label>Handling Codes:</label>
                                                        </template>
                                                        <b-form-select class="form-control-sm" style="width:500px;" v-model="selectedCode">
                                                            <!-- :class="{ 'is-invalid': form.errors.has('special_handling_code') }"> -->
                                                            <option disabled value="">Select Special Handling Codes</option>
                                                            <option v-for="code in codes" :key="code.value"
                                                                :value="code.value">{{ code.text }}</option>
                                                            <option value="">Select Special Handling Codes</option>
                                                        </b-form-select>
                                                        <!-- <has-error :form="form" field="special_handling_code"></has-error> -->
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto" style="padding-left: 0px;padding-right: 0px;">
                                                    <!-- or label / input -->
                                                    <b-form-group id="fieldset-origin" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label="or:" label-for="input-origin" class="form-control-sm">
                                                    <b-form-input id="input-origin" class="form-control-sm"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto" style="padding-left: 0px;">
                                                    <!-- Add button -->
                                                    <b-button @click="addManualCode">Add</b-button>
                                                </b-col>
                                            </b-row>
                                            <b-row class="mb-4">
                                                <div class="d-flex text-align-center flex-column" style="margin-left:213px;">
                                                    <table style="width:630px;">
                                                        <thead>
                                                            <tr class="h_background_color">
                                                                <th class="form-control1 text-white">codes</th>
                                                            </tr>
                                                        </thead>
                                                        <tr v-for="(code, index) in form.tableCodes" :key="index" style="border: 1px solid #c2c0c0;padding: 4px 20px;">
                                                            <td class="editable-cell">{{ code }}</td>
                                                            <td class="editable-cell"><b-icon icon="trash" font-scale="1"
                                                                @click="deleteSplCode(index)"></b-icon>
                                                            </td>
                                                    </tr>
                                                    </table>
                                                </div>
                                            </b-row>
                                        </b-tab>
                                        <b-tab title="Other Customs Information" class="bg-white" style="border:1px solid #000 !important;">
                                            <b-row class="mt-4">
                                                <b-col class="ml-4">
                                                    <b-row>
                                                        <b-col cols="auto">
                                                            <table>
                                                                <thead>
                                                                    <tr class="h_background_color">
                                                                        <th class="form-control1 pl-4" style="width: 180px;">Country code:</th>
                                                                        <th class="form-control1" style="width: 180px;">Information identifier:</th>
                                                                        <th class="form-control1" style="width: 380px;">Customs information identifier</th>
                                                                    </tr>
                                                                </thead>
                                                            </table>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row class="mt-1">
                                                        <b-col cols="auto" style="padding-right:2px;">
                                                            <b-form-group id="fieldset-horizontal"
                                                            style="padding-left:0px !important;">
                                                                <b-form-select class="form-control-sm"
                                                                style="width:180px;border-radius: 0px;" v-model="oci_info.country_code">
                                                                    <option value="">Select a country</option>
                                                                    <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                        {{ country.text }}
                                                                    </option>
                                                                </b-form-select>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="auto" style="padding-left:2px;padding-right:2px;">
                                                            <b-form-group id="fieldset-horizontal"
                                                            style="padding-left:0px !important;">
                                                                <b-form-select class="form-control-sm"
                                                                style="width:180px;border-radius: 0px;" v-model="oci_info.info_identifier">
                                                                    <option value="">Select a code</option>
                                                                        <option value="ABI">ABI - AWB Amount Detail
                                                                            Information</option>
                                                                        <option value="ABS">ABS - AWB Supplementary
                                                                            Information</option>
                                                                        <option value="ABT">ABT - AWB Total Amount
                                                                            Information</option>
                                                                        <option value="ACC">ACC - Accounting Information
                                                                        </option>
                                                                        <option value="ACD">ACD - AWB Consignment
                                                                            Details</option>
                                                                        <option value="ACK">ACK - Reason for
                                                                            Acknowledgement</option>
                                                                        <option value="ACS">ACS - AWB Charge Summary
                                                                        </option>
                                                                        <option value="ADR">ADR - Street Address
                                                                        </option>
                                                                        <option value="AGT">AGT - Agent</option>
                                                                        <option value="AID">AID - Arrival Information
                                                                            Details</option>
                                                                        <option value="AIR">AIR - Airline Header
                                                                        </option>
                                                                        <option value="ALA">ALA - Allotment Availability
                                                                            Information</option>
                                                                        <option value="ALI">ALI - Allotment Information
                                                                        </option>
                                                                        <option value="ALR">ALR - Allotment Remaining
                                                                        </option>
                                                                        <option value="ALT">ALT - Allotment Total
                                                                        </option>
                                                                        <option value="AMD">AMD - Amendment
                                                                            Identification</option>
                                                                        <option value="API">API - Air Waybill Piece
                                                                            Information</option>
                                                                        <option value="ARD">ARD - Agent Reference Data
                                                                        </option>
                                                                        <option value="ARI">ARI - AWB Recapitulation
                                                                            Information</option>
                                                                        <option value="ATH">ATH - Authorisation</option>
                                                                        <option value="ATW">ATW - AWB Total Weight
                                                                            Summary</option>
                                                                        <option value="AUD">AUD - Allotment Used Details
                                                                        </option>
                                                                        <option value="AVS">AVS - Availability
                                                                            Supplementary Details</option>
                                                                        <option value="BGD">BGD - Baggage Detail
                                                                            Information</option>
                                                                        <option value="BGT">BGT - Baggage Tag
                                                                            Identification</option>
                                                                        <option value="BRK">BRK - Broker</option>
                                                                        <option value="CAI">CAI - CCA/Adjustment
                                                                            Information</option>
                                                                        <option value="CAN">CAN - Customs Action
                                                                            Notification</option>
                                                                        <option value="CAS">CAS - CCA/Adjustment
                                                                            Supplementary Information</option>
                                                                        <option value="CBD">CBD - CASS Billing Details
                                                                        </option>
                                                                        <option value="CBI">CBI - CASS Billing
                                                                            Information</option>
                                                                        <option value="CBP">CBP - CASS Billing Period
                                                                        </option>
                                                                        <option value="CBR">CBR - Courier Baggage
                                                                            Receiver</option>
                                                                        <option value="CBS">CBS - Courier Baggage Sender
                                                                        </option>
                                                                        <option value="CBV">CBV - Courier Baggage
                                                                            Voucher Identification</option>
                                                                        <option value="CCD">CCD - Consignment Control
                                                                            Details</option>
                                                                        <option value="CCL">CCL - Cargo Control Location
                                                                        </option>
                                                                        <option value="CDC">CDC - CC Charges in
                                                                            Destination Currency</option>
                                                                        <option value="CDI">CDI - Charge Declarations
                                                                        </option>
                                                                        <option value="CER">CER - AWB Content
                                                                            Certification</option>
                                                                        <option value="CID">CID - Correction
                                                                            Identification</option>
                                                                        <option value="CIH">CIH - CASS Invoice Header
                                                                            Details</option>
                                                                        <option value="CIN">CIN - CASS Identification
                                                                            Number</option>
                                                                        <option value="CMI">CMI - Consignment Onward
                                                                            Movement Information</option>
                                                                        <option value="CND">CND - Customs Notification
                                                                            Details</option>
                                                                        <option value="CNE">CNE - Consignee</option>
                                                                        <option value="COI">COI - Commission Information
                                                                        </option>
                                                                        <option value="COL">COL - Collect Charge Summary
                                                                        </option>
                                                                        <option value="COM">COM - Embargoed Commodities
                                                                        </option>
                                                                        <option value="COR">COR - Customs Origin
                                                                        </option>
                                                                        <option value="CRD">CRD - Carrier Reference Data
                                                                        </option>
                                                                        <option value="CRR">CRR - Embargo Carriage
                                                                            Restrictions</option>
                                                                        <option value="CTI">CTI - CCA/Adjustment Total
                                                                            Information</option>
                                                                        <option value="CTW">CTW - CCA/Adjustment Total
                                                                            Weight Summary</option>
                                                                        <option value="CUR">CUR - Currency Details
                                                                        </option>
                                                                        <option value="CUS">CUS - Customer
                                                                            Identification</option>
                                                                        <option value="CVD">CVD - Charge Declarations
                                                                        </option>
                                                                        <option value="CWI">CWI - CASS AWB Information
                                                                        </option>
                                                                        <option value="DAI">DAI - DGD Additional
                                                                            Handling Information</option>
                                                                        <option value="DAP">DAP - DGD “All Packed in
                                                                            One” Indication</option>
                                                                        <option value="DAT">DAT - DGD “All Packed in
                                                                            One” Total</option>
                                                                        <option value="DAU">DAU - DGD Item Authorisation
                                                                        </option>
                                                                        <option value="DCI">DCI - DGD Emergency Contact
                                                                            Information</option>
                                                                        <option value="DCL">DCL - Declarant</option>
                                                                        <option value="DES">DES - Despatch Information
                                                                        </option>
                                                                        <option value="DHD">DHD - DGD Header Details
                                                                        </option>
                                                                        <option value="DII">DII - DGD Item Information
                                                                        </option>
                                                                        <option value="DIM">DIM - Dimensions Information
                                                                        </option>
                                                                        <option value="DNR">DNR - DGD Item Number
                                                                        </option>
                                                                        <option value="DOC">DOC - Documentation
                                                                            Identification</option>
                                                                        <option value="DOS">DOS - DGD Overpack Summary
                                                                        </option>
                                                                        <option value="DPI">DPI - DGD Item Packing Group
                                                                            and Instructions</option>
                                                                        <option value="DQP">DQP - DGD Item Quantity and
                                                                            Type of Packing</option>
                                                                        <option value="DRA">DRA - DGD Radioactive
                                                                            Activity Information</option>
                                                                        <option value="DRC">DRC - DGD Radioactive
                                                                            Consignment Information</option>
                                                                        <option value="DRP">DRP - DGD Radioactive
                                                                            Packing Instructions</option>
                                                                        <option value="DSN">DSN - DGD Item Shipping Name
                                                                        </option>
                                                                        <option value="DSU">DSU - DGD Signatory Details
                                                                        </option>
                                                                        <option value="DTN">DTN - Date/Time of
                                                                            Notification</option>
                                                                        <option value="EIC">EIC - Empty Equipment in
                                                                            Compartment Information</option>
                                                                        <option value="EXP">EXP - Export</option>
                                                                        <option value="FLT">FLT - Flight Booking
                                                                        </option>
                                                                        <option value="FLT">FLT - Flight Information
                                                                        </option>
                                                                        <option value="GRI">GRI - Grand AWB
                                                                            Recapitulation Information</option>
                                                                        <option value="GTI">GTI - Grand Total
                                                                            Information</option>
                                                                        <option value="HAH">HAH - HWB Agent’s Head
                                                                            Office</option>
                                                                        <option value="HBS">HBS - House Waybill Summary
                                                                            Details</option>
                                                                        <option value="HCD">HCD - HWB Consignment
                                                                            Details</option>
                                                                        <option value="HDL">HDL - Handling Details
                                                                        </option>
                                                                        <option value="HLC">HLC - HWB Letter of Credit
                                                                            Details</option>
                                                                        <option value="HPI">HPI - House Waybill Piece
                                                                            Information</option>
                                                                        <option value="HTS">HTS - Harmonised Tariff
                                                                            Schedule Information</option>
                                                                        <option value="HWB">HWB - House Waybill</option>
                                                                        <option value="IMP">IMP - Import</option>
                                                                        <option value="ISS">ISS - The Regulated Agent
                                                                            Issuing the Security Status for a
                                                                            Consignment</option>
                                                                        <option value="ISU">ISU - AWB Issue Details
                                                                        </option>
                                                                        <option value="ITA">ITA - Invoice Total Amount
                                                                            Information</option>
                                                                        <option value="ITW">ITW - Invoice Total Weight
                                                                            Summary</option>
                                                                        <option value="JST">JST - Embargo Justification
                                                                        </option>
                                                                        <option value="LOC">LOC - Location</option>
                                                                        <option value="MAL">MAL - Mail</option>
                                                                        <option value="MAT">MAT - Message Advice Type
                                                                        </option>
                                                                        <option value="MBI">MBI - Master Waybill
                                                                            Identification</option>
                                                                        <option value="MCH">MCH - Mail Consignment
                                                                            Header</option>
                                                                        <option value="MCT">MCT - Mail Consignment Total
                                                                        </option>
                                                                        <option value="MHU">MHU - Mail Handling Unit
                                                                        </option>
                                                                        <option value="MID">MID - Mail Inbound Data
                                                                        </option>
                                                                        <option value="MLI">MLI - Mail Label
                                                                            Identification</option>
                                                                        <option value="MOD">MOD - Mail Outbound Data
                                                                        </option>
                                                                        <option value="MPI">MPI - Movement Priority
                                                                            Information</option>
                                                                        <option value="MSD">MSD - Mail Status Details
                                                                        </option>
                                                                        <option value="MSU">MSU - Message Sequence and
                                                                            ULD Origin</option>
                                                                        <option value="MUD">MUD - Mail ULD Information
                                                                        </option>
                                                                        <option value="NAM">NAM - Name</option>
                                                                        <option value="NBI">NBI - Net Billing
                                                                            Information</option>
                                                                        <option value="NEW">NEW - New Information
                                                                        </option>
                                                                        <option value="NFY">NFY - Also Notify</option>
                                                                        <option value="NFY">NFY - Notify Name and
                                                                            Address</option>
                                                                        <option value="NNS">NNS - Net/Net Sales</option>
                                                                        <option value="NOM">NOM - Nominated Handling
                                                                            Party</option>
                                                                        <option value="OCI">OCI - Other Customs,
                                                                            Security and Regulatory Control Information
                                                                        </option>
                                                                        <option value="OLD">OLD - Original Information
                                                                        </option>
                                                                        <option value="OPI">OPI - Other Participant
                                                                            Information</option>
                                                                        <option value="OSI">OSI - Other Service
                                                                            Information</option>
                                                                        <option value="OSS">OSS - The Regulated Agent
                                                                            Accepting the Security Status for a
                                                                            Consignment Issued by Another RA</option>
                                                                        <option value="OTH">OTH - Other Charges</option>
                                                                        <option value="PAS">PAS - Passenger Information
                                                                        </option>
                                                                        <option value="PID">PID - Product Information
                                                                        </option>
                                                                        <option value="PPD">PPD - Prepaid Charge Summary
                                                                        </option>
                                                                        <option value="PRD">PRD - Planning Request
                                                                            Details</option>
                                                                        <option value="RCI">RCI - Recapitulation Amount
                                                                            Information</option>
                                                                        <option value="REC">REC - Receptacle Information
                                                                        </option>
                                                                        <option value="REF">REF - References</option>
                                                                        <option value="RID">RID - Rate Information
                                                                            Answer Details</option>
                                                                        <option value="RIH">RIH - Rate Information
                                                                            Answer Header</option>
                                                                        <option value="RIR">RIR - Rate Information
                                                                            Request Details</option>
                                                                        <option value="RQD">RQD - Charge Calculation
                                                                            Answer Details</option>
                                                                        <option value="RQH">RQH - Charge Calculation
                                                                            Request Header</option>
                                                                        <option value="RQT">RQT - Charge Calculation
                                                                            Answer Totals</option>
                                                                        <option value="RQU">RQU - Charge Calculation
                                                                            Request — ULD</option>
                                                                        <option value="RQV">RQV - Charge Calculation
                                                                            Request — Volume</option>
                                                                        <option value="RTD">RTD - Rate Description
                                                                        </option>
                                                                        <option value="RTG">RTG - Routing</option>
                                                                        <option value="RTI">RTI - Recapitulation Total
                                                                            Information</option>
                                                                        <option value="RTS">RTS - Embargo Routes/Areas
                                                                        </option>
                                                                        <option value="SAA">SAA - Schedule and
                                                                            Availability Information Answer Details
                                                                        </option>
                                                                        <option value="SAR">SAR - Schedule and
                                                                            Availability Information Request Details
                                                                        </option>
                                                                        <option value="SCI">SCI - Special Customs
                                                                            Information</option>
                                                                        <option value="SCS">SCS - Surface Charge Summary
                                                                        </option>
                                                                        <option value="SDI">SDI - Surface Delivery
                                                                            Information</option>
                                                                        <option value="SHP">SHP - Shipper</option>
                                                                        <option value="SII">SII - Sales Incentive
                                                                            Information</option>
                                                                        <option value="SKH">SKH - Schedule Information
                                                                            Answer Header</option>
                                                                        <option value="SLC">SLC - Status List Criteria
                                                                        </option>
                                                                        <option value="SPH">SPH - Special Handling
                                                                            Details</option>
                                                                        <option value="SPI">SPI - Surface Pickup
                                                                            Information</option>
                                                                        <option value="SRA">SRA - Supplementary Rate
                                                                            Information Answer Details</option>
                                                                        <option value="SRI">SRI - Shipment Reference
                                                                            Information</option>
                                                                        <option value="SRR">SRR - Supplementary Rate
                                                                            Information Request Details</option>
                                                                        <option value="SSI">SSI - Supplementary Status
                                                                            Information</option>
                                                                        <option value="SSR">SSR - Special Service
                                                                            Request</option>
                                                                        <option value="STI">STI - Storage Information
                                                                        </option>
                                                                        <option value="STS">STS - Status Details
                                                                        </option>
                                                                        <option value="SVA">SVA - Surface Vehicle
                                                                            Arrival Information</option>
                                                                        <option value="SVD">SVD - Surface Vehicle
                                                                            Departure Information</option>
                                                                        <option value="SVL">SVL - Surface Vehicle Delay
                                                                            Information</option>
                                                                        <option value="SVN">SVN - Surface Vehicle Next
                                                                            Information</option>
                                                                        <option value="TAR">TAR - Total AWB
                                                                            Recapitulation Information</option>
                                                                        <option value="TCC">TCC - Total Collect Charges
                                                                        </option>
                                                                        <option value="TID">TID - Terminal
                                                                            Identification</option>
                                                                        <option value="TOT">TOT - Total Amount</option>
                                                                        <option value="TRA">TRA - Transit</option>
                                                                        <option value="TRN">TRN - Transfer/Transit
                                                                            Information</option>
                                                                        <option value="TXS">TXS - Tax Summary</option>
                                                                        <option value="TXT">TXT - Free Text Description
                                                                        </option>
                                                                        <option value="UCI">UCI - ULD Connection
                                                                            Information</option>
                                                                        <option value="UDI">UDI - ULD Destination
                                                                            Information</option>
                                                                        <option value="UII">UII - ULD Inclusion
                                                                            Information</option>
                                                                        <option value="ULD">ULD - ULD Description
                                                                        </option>
                                                                        <option value="UMI">UMI - ULD Movement
                                                                            Information</option>
                                                                        <option value="UPI">UPI - Unique Piece
                                                                            Information</option>
                                                                        <option value="VCD">VCD - Void/Cancel Details
                                                                        </option>
                                                                        <option value="VOD">VOD - Vehicle Operator
                                                                            Details</option>
                                                                        <option value="WBD">WBD - Waybill Details
                                                                        </option>
                                                                        <option value="WBH">WBH - Waybill Header Details
                                                                        </option>
                                                                        <option value="WBI">WBI - Waybill Information
                                                                        </option>
                                                                        <option value="WBL">WBL - Waybill Details
                                                                        </option>
                                                                </b-form-select>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="auto" style="padding-left:2px;">
                                                            <b-form-group id="fieldset-horizontal"
                                                            style="padding-left:0px !important;">
                                                                <b-form-select class="form-control-sm"
                                                                style="width:280px;border-radius: 0px;" v-model="oci_info.custom_info_identifier">
                                                                <option value="">Select a code</option>
                                                                <option value="A">A - Automated Broker Interface
                                                                    (ABI) Filer Code</option>
                                                                <option value="AC">AC - Account Consignor
                                                                    (consignor for all cargo aircraft)</option>
                                                                <option value="C">C - Certificate Number
                                                                </option>
                                                                <option value="CP">CP - Contact Person</option>
                                                                <option value="CT">CT- Contact Telephone Number
                                                                </option>
                                                                <option value="D">D - Dangerous Goods</option>
                                                                <option value="DI">DI - Declaration
                                                                    Identification</option>
                                                                <option value="E">E - Authorised Economic
                                                                    Operator</option>
                                                                <option value="ED">ED - Expiry Date</option>
                                                                <option value="F">F - Facilities Information and
                                                                    Resource Management</option>
                                                                <option value="I">I - Item Number</option>
                                                                <option value="KC">KC - Known Consignor</option>
                                                                <option value="L">L - Exemption Legend</option>
                                                                <option value="LI">LI - License Identification
                                                                </option>
                                                                <option value="M">M - Movement Reference Number
                                                                </option>
                                                                <option value="N">N - Seal Number</option>
                                                                <option value="P">P - Packing List Number
                                                                </option>
                                                                <option value="RA">RA - Regulated Agent</option>
                                                                <option value="RC">RC - Regulated Carrier
                                                                </option>
                                                                <option value="S">S - System Downtime Reference
                                                                </option>
                                                                <option value="SD">SD - Security Status Date
                                                                    &amp; Time</option>
                                                                <option value="SM">SM - Screening Method
                                                                </option>
                                                                <option value="SN">SN - Security Status Name of
                                                                    Issuer</option>
                                                                <option value="SS">SS - Security Status</option>
                                                                <option value="ST">ST - Security Textual
                                                                    Statement</option>
                                                                <option value="T">T - Trader Identification
                                                                    Number</option>
                                                                <option value="U">U - Unique Consignment
                                                                    Reference Number</option>
                                                                <option value="V">V - Invoice Number</option>
                                                                </b-form-select>
                                                            </b-form-group>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row>
                                                        <b-col cols="auto" >
                                                            <b-form-group id="fieldset-horizontal"
                                                                label-cols-lg="auto" content-cols-sm
                                                                content-cols-lg="auto" label="Handling Codes:" label-for="input-horizontal"
                                                                class="form-control-sm" style="width:650px;">
                                                                <template #label>
                                                                    <label style="width:165px;">Supplementary information:</label>
                                                                </template>
                                                                <b-form-input id="input-origin" class="form-control-sm" style="border-radius: 0px;width:350px;" v-model="oci_info.supplementary_info"></b-form-input>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col cols="auto" style="padding-left: 0px;">
                                                        <!-- Add button -->
                                                        <b-button class="" style="border-radius: 2px;border:1px solid #000;padding:4px 20px" @click="addOtherCustomInfo"> {{ editIndex !== null ? 'Update' : 'Add' }}</b-button>
                                                    </b-col>
                                                    </b-row>
                                                    <b-row>
                                                        <b-col cols="auto" class="mt-2">
                                                            <table>
                                                                <thead>
                                                                    <tr class="h_background_color">
                                                                        <th class="form-control1 pl-2" style="width: 650px;">Other Customs Information</th>
                                                                    </tr>
                                                                </thead>
                                                            </table>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row v-for="(row, index) in form.oci_entries" :key="index">
                                                        <b-col cols="auto" style="width:300px;">
                                                            <p class="pl-2">{{ row.country_code }}</p>
                                                        </b-col>
                                                        <b-col cols="auto">
                                                            <p>{{ row.info_identifier }}</p>
                                                        </b-col>
                                                        <b-col cols="auto">
                                                            <p>{{ row.custom_info_identifier }}</p>
                                                        </b-col>
                                                        <b-col cols="auto">
                                                            <p>{{ row.supplementary_info }}</p>
                                                        </b-col>
                                                        <b-col cols="auto">
                                                            <p v-if="row.country_code && row.info_identifier && row.custom_info_identifier && row.supplementary_info"> 
                                                                <b-icon icon="pencil" font-scale="1" class="mr-2" style="cursor: pointer;" @click="editOciInfo(index)"></b-icon>
                                                                <b-icon icon="trash" font-scale="1" @click="deleteOciInfo(index)"></b-icon>
                                                            </p>
                                                        </b-col>
                                                    </b-row>
                                                </b-col>
                                            </b-row>
                                        </b-tab>
                                    </b-tabs>
                                    <div class="pt-6">
                                        <div class="d-flex justify-content-end">
                                            <b-button class="" @click="updateform(consolidation.id)" style="padding:4px 20px;border:1px solid #000;border-radius:0px;">Update detail row</b-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="hr" />
                            <!-- Bottom Table row -->
                            <div class="pt-6">
                                <table>
                                    <tr class="h_background_color">
                                        <th class="py-3 pl-2" style="width: 70px;">Action</th>
                                        <th class="py-3" style="width: 200px;">House waybill No</th>
                                        <th class="py-3" style="width: 200px;">Origin</th>
                                        <th class="py-3" style="width: 200px;">Destination</th>
                                        <th class="py-3" style="width: 200px;">Quantity</th>
                                        <th class="py-3" style="width: 407px;">Nature of Goods</th>
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
                            
                            <!-- Bottom Table row -->
                            <div class="d-flex justify-content-center text-danger mt-2">
                                <div style="border:1px solid #000;width:700px;">
                                    <p class="pl-2" style="margin: 0px;">Please note the following warning(s):</p>
                                    <ul>
                                        <li>Weight mismatch. Master weight (723) is not the same as HWBs weight (1050.86)</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="py-2">
                                <div class="d-flex justify-content-end">
                                    <b-button class="mr-2" @click="generateAwbPDF">Generate PDF</b-button>
                                    <b-button class="mr-2" @click="converXml(form.awb_no)">Send</b-button>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="hasSearchResults" class="d-flex flex-column align-items-start pt-2 pb-2">
                            <p>No house waybill information found. Please use the UI above to add house waybills.</p>
                        </div>
                    </div>
                <!-- </b-form> -->
            </template>
        </div>
    </div>
</template>
<script>
import Datepicker from "vuejs-datepicker";
import DatePicker from "vue2-datepicker";
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
            options: [
                { text: "Me", value: "1" },
                { text: "Participant Group", value: "1" },
            ],
            logoSrc: "/media/custome/logo-1.png",
        };
    },

    methods: {
        generateAwbPDF(awbNo = this.form.awb_no, awbCode = this.form.awb_code) {
            const awb_code = this.form.awb_code; // Access the awb_code from the form data
            const awb_no = this.form.awb_no;
            const itemId = awb_code+awb_no; // Access the awb_no from the form data
            const pdfUrl = `/download-consolidation-pdf/${awb_code}/${awb_no}`; // Construct the URL for the PDF
            window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
            
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
        handleRadioChange() {
            const selectedCode = this.selectedCode;
            this.form.tableCodes = [];
            this.form.tableCodes.push(selectedCode);
        },
        addManualCode() {
            const code = this.selectedCode || this.manualCode.trim();
            if (code) {
                if (!this.form.tableCodes.includes(code)) {
                    this.form.tableCodes.push(code);
                    console.log("Table code ", this.form.tableCodes);
                } else {
                    alert('This code is already added.');
                }
            } else {
                alert('Please select or enter a code.');
            }
            this.selectedCode = '';
            this.manualCode = '';
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
            if (!this.oci_info.country_code || !this.oci_info.info_identifier || !this.oci_info.supplementary_info || !this.oci_info.custom_info_identifier) {
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
            const dropdownContainer_to = this.$refs.dropdownContainer_destination;
            if (dropdownContainer_to && !dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_departure = false;
            }
        },
    },
    mounted(){
        this.getLocation(); 
        this.getCountry();
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
    },
};
</script>

<style scoped>
header {
    width: 100%;
    background-color: #2637a8;
}

.h-color {
    color: #2637a8;
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
    margin-bottom: 10px !important;
}

.form-control-sm {
    height: calc(1.5em + 0.5rem + 2px) !important;
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
    border-top: 2px solid #007db9;
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
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="black" d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
    background-color: white;
    border: 1px solid #ccc;
    /* padding: 10px 40px 10px 10px; */
    font-size: 14px;
    padding: 2px;
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
    border: 1px solid gray;
    width: 150px;
    height: 25px;
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