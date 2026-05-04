<template>
    <div class="body-color">
        <div class="container-fluid">
            <!-- Include Page Loader -->
             <!-- <PageLoader></PageLoader> -->
            <div class="d-flex">
                <SideBar></SideBar>
                <div class="container" style="background-color:#fff; box-shadow: 3px 3px 10px #d0d0d0;z-index: 1;border-radius: 30px;">
                    <div class="mt-14 mb-8 px-10">
                        <b-row>
                            <b-col cols="6">
                                <h6 style="color:#355594;font-size:22px !important;line-height:30px !important;font-weight:600 !important;">Documentation</h6>
                                <b-form-group id="fieldset-horizontal" class="d-flex align-items-center ">
                                    <b-form-select 
                                        style="width: 140px;border: 0px !important;color: #355594;font-weight: 600;"
                                        class="form-control-sm"
                                        v-model="selectedViewPageOption"
                                        @change="onSelect">
                                        <option value="/focus-air">Master Airway Bill</option>
                                        <option value="/house-way-bill">Houseway Bill</option>
                                        <option value="/consolidation">Consolidation</option>
                                        <!-- <option value="/message-log">Message Log</option> -->
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <div class="d-flex justify-content-end" style="margin-top: 42px !important;">
                                    <b-button @click.prevent="getHousewayBills('draft')" v-b-modal.modal-draft class="mx-2 show-btn">Draft</b-button>
                                    <b-button @click.prevent="getHousewayBills('send')" v-b-modal.modal-s class="ml-2 mx-2 show-btn">10 Latest</b-button>
                                    <b-button style="background: rgb(53, 85, 148) !important; color:white !important;" v-b-modal.upload-file-modal class="ml-2 mx-2 show-btn">Upload</b-button>
                                </div>
                            </b-col>
                            <!-- Draft model code Start here -->
                            <b-modal id="modal-draft" title="Drafts" :hide-footer="true" ok-only>
                                <div class="d-block">
                                    <b-row>
                                        <b-col>
                                            <div v-for="item in data_items" :key="item.id">
                                                <div v-if="item.awb_no && item.awb_code" class="py-2">
                                                    <a href="#" class="custom-link-custom" @click.prevent="handleEditNavigation(String(item.id))">
                                                        <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(item.id)" custom>
                                                            <p @click="navigate" class="mb-0">
                                                                {{ item.id }}
                                                                <!-- {{ String(item.awb_code) }}-{{ String(item.awb_no) }}  -->
                                                                ({{ item.departure_airport ? item.departure_airport.split(',')[0] : '-' }}-{{ item.destination_airport ? item.destination_airport.split(',')[0] : '-' }})
                                                            </p>
                                                        </router-link>
                                                    </a>
                                                    <div class="d-flex flex-row justify-content-start">
                                                        <div class="px-2">
                                                            <a href="#" class="custom-link mb-0" @click.prevent="handleEditNavigation(String(item.id))">
                                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(item.id)" custom>
                                                                    <p @click="navigate" class="mb-0 ml-2">Edit e-AWB Data </p>
                                                                </router-link>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <!-- <p class="mt-5 mb-0" style="border-bottom: 1px solid #CDCDCD;">Issued at: 15 Jun 14:24 By: jgeorgeblr@gln.com</p> -->
                                                </div>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </div>
                            </b-modal>
                            <!-- Draft model code Ends here -->
                            <!-- 10 Latest model code start here -->
                            <b-modal id="modal-s" title="Latest Messages" :hide-footer="true" ok-only>
                                <div class="d-block">
                                    <b-row>
                                        <b-col>
                                            <div v-for="item in data_items" :key="item.id">
                                                <div v-if="item.awb_no && item.awb_code" class="py-2">
                                                    <a href="#" class="custom-link-custom" @click.prevent="handleEditNavigation(String(item.id))">
                                                        <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(item.id)" custom>
                                                            <p @click="navigate" class="mb-0">
                                                                {{ item.id }}
                                                                <!-- {{ String(item.awb_code) }}-{{ String(item.awb_no) }}  -->
                                                                ({{ item.departure_airport ? item.departure_airport.split(',')[0] : '-' }}-{{ item.destination_airport ? item.destination_airport.split(',')[0] : '-' }})
                                                            </p>
                                                        </router-link>
                                                    </a>
                                                    <div class="d-flex flex-row justify-content-start">
                                                        <div class="px-2">
                                                            <a href="#" class="custom-link mb-0" @click.prevent="handleEditNavigation(String(item.id))">
                                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(item.id)" custom>
                                                                    <p @click="navigate" class="mb-0 ml-2">Edit e-AWB Data </p>
                                                                </router-link>
                                                            </a>
                                                        </div>
                                                        <div class="px-2">
                                                            <a href="#" class="custom-link mb-0" @click="getAirWayBill(String(item.id))">
                                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(item.id)" custom>
                                                                        <p class="mb-0 ml-2"><a :href="'/download-awb-pdf/' + String(item.id)" target="_blank" class="custom-link">e-AWB Pdf file</a></p>
                                                                </router-link>
                                                            </a>
                                                            <a href="#" class="custom-link mb-0" @click="getAirWayBill(String(item.id))">
                                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(item.id)" custom>
                                                                        <p class="mb-0 ml-2"><a :href="'/download-multiple-awb-pdf/' + String(item.id)" target="_blank" class="custom-link">Multipage e-AWB Pdf</a></p>
                                                                </router-link>
                                                            </a>
                                                            <a href="#" class="custom-link mb-0" @click="getAirWayBill(String(item.id))">
                                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(item.id)" custom>
                                                                        <p class="mb-0 ml-2"><a :href="'/download-multiple-both-page-awb-pdf/' + String(item.id)" target="_blank" class="custom-link">Multipage e-AWB Pdf with back pages</a></p>
                                                                </router-link>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <!-- <p class="mt-5 mb-0" style="border-bottom: 1px solid #CDCDCD;">Issued at: 15 Jun 14:24 By: jgeorgeblr@gln.com</p> -->
                                                </div>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </div>
                            </b-modal>
                            <!-- 10 Latest model code Ends here -->
                            <!-- Upload file model code start here -->
                                <b-modal id="upload-file-modal" title="Uplaod File" :hide-footer="true" ok-only>
                                    <div class="d-block">
                                        <b-row>
                                            <b-col>
                                                <div class="upload-container">
                                                    <div class="upload-box" @click="triggerFileInput">
                                                        <div class="upload-icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                            </svg>
                                                        </div>
                                                        <div class="upload-text">Drop your file here</div>
                                                        <div class="upload-divider">Or</div>
                                                        <div class="upload-link">Select file to be uploaded</div>
                                                        <input type="file" ref="fileInput" accept=".pdf,application/pdf" @change="handleFileSelect" style="display:none">
                                                    </div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </b-modal>
                                <!-- Upload file model code Ends here -->
                        </b-row>
                    </div>

                    <hr class="hr" />

                    <template>
                        <b-form @submit.prevent="onSubmit">
                            <div class="">
                                <b-row>
                                    <b-col cols="12">
                                        <div class="my-5">
                                            <h6 class="pl-4">Create Electronic House Waybill (FHL)</h6>
                                        </div>
                                    </b-col>
                                    <b-col cols="12">
                                        <div class="pl-4">
                                            <b-row>
                                                <b-col cols="8">
                                                    <b-row>
                                                        <b-col cols="12">
                                                            <div class="d-flex align-items-center">
                                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                                    label-for="hawbNo-input"
                                                                    class="">
                                                                    <template #label>
                                                                        <div class="d-flex justify-content-end" style="width: 100px;">
                                                                            <span>HAWB No:</span>
                                                                            <span class="text-danger"> &nbsp;*</span>
                                                                        </div>
                                                                    </template>
                                                                    <b-form-input id="hawbNo-input" class="form-control" v-model="form.first_box.hawb_no"
                                                                        style="width:210px;"
                                                                        :class="{ 'is-invalid': form.errors.has('hawb_no') }"></b-form-input>
                                                                    <!-- <has-error :form="form" field="hawb_no"></has-error> -->
                                                                </b-form-group>
                                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                                    label-for="masterno-input" class="">
                                                                    <template #label>
                                                                        <div class="d-flex justify-content-end" style="width: 100px;">
                                                                            <span>Master No:</span>
                                                                            <span class="text-danger">&nbsp;*</span>
                                                                        </div>
                                                                    </template>
                                                                    <b-form-input id="masterno-input" class="form-control" style="width: 62px" v-model="form.first_box.awb_code" :class="{ 'is-invalid': form.errors.has('awb_code') }" v-on:keypress="validateNumericInput($event, 'awb_code', 3)" @input="onAWBInput"></b-form-input>
                                                                    <!-- <has-error :form="form" field="awb_code"></has-error> -->
                                                                    <!-- <p v-if="awb_prefix_message" class="mt-2">{{ awb_prefix_message }}</p> -->
                                                                </b-form-group>

                                                                <div class="d-flex align-items-center pl-2"><p class="">-</p></div>

                                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                                    label-for="masterno-awb-input" class="px-0">
                                                                    <b-form-input id="masterno-awb-input" class="form-control" style="width: 150px" v-model="form.first_box.awb_no" :class="{ 'is-invalid': form.errors.has('awb_no') }" v-on:keypress="validateNumericInput($event, 'awb_no', 8)" @input="onAWBInput"></b-form-input>
                                                                    <!-- <has-error :form="form" field="awb_no"></has-error> -->
                                                                </b-form-group>
                                                            </div>
                                                            <div class="d-flex flex-row error-msg-container">
                                                                <div style="width: 50%;">
                                                                    <div v-if="form.errors.has('hawb_no')" class="d-flex justify-content-end text-danger" style="width: 75%;">
                                                                        {{ form.errors.get('hawb_no') }}
                                                                    </div>
                                                                </div>
                                                                <div style="width: 50%;">
                                                                    <div v-if="form.errors.has('awb_code')" class="text-danger">
                                                                        {{ form.errors.get('awb_code') }}
                                                                    </div>
                                                                    <div v-if="form.errors.has('awb_no')" class="text-danger">
                                                                        {{ form.errors.get('awb_no') }}
                                                                    </div>
                                                                    <p v-if="awb_prefix_message" class="">{{ awb_prefix_message }}</p>
                                                                </div>
                                                            </div>
                                                        </b-col>
                                                    </b-row>
                                                </b-col>
                                                <b-col cols="4">
                                                    <div class="d-flex justify-content-end mr-34">
                                                        <b-form-group>
                                                            <b-form-radio name="radio-size" size="sm">e-CSD Status</b-form-radio>
                                                        </b-form-group>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col cols="12">
                                                    <div class="d-flex text-align-center">
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                            label-for="agent-account-input" class="">
                                                            <template #label>
                                                                <div class="d-flex justify-content-end" style="width: 100px;">
                                                                    <span>Agent Account:</span>
                                                                    <span class="text-danger">&nbsp;*</span>
                                                                </div>
                                                            </template>
                                                            <b-form-input id="agent-account-input" class="form-control"  v-model="form.first_box.agent_account"
                                                                style="width:210px;"
                                                                :class="{ 'is-invalid': form.errors.has('agent_account') }"></b-form-input>
                                                            <!-- <has-error :form="form" field="agent_account"></has-error> -->
                                                        </b-form-group>
                                                    </div>
                                                    <div class="d-flex flex-row error-msg-container">
                                                        <div style="width: 25%;">
                                                            <div v-if="form.errors.has('agent_account')" class="d-flex justify-content-end text-danger">
                                                                {{ form.errors.get('agent_account') }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </b-col>
                                </b-row>
                                <hr class="hr" />
                                <!-- SHIPPER AND CONSIGNEE ADDRESS ROW START HERE -->
                                <b-row>
                                    <b-col cols="6">
                                        <div class="mt-2 mb-4">
                                            <h6 class="pl-6">Shipper</h6>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto"
                                            label-for="shipper"
                                            style="margin-bottom: 4px !important;"
                                            class="">
                                            <template #label>
                                                <div class="d-flex justify-content-end" style="width: 100px;">
                                                    <span>Name:</span>
                                                    <span class="text-danger"> &nbsp;*</span>
                                                </div>
                                            </template>
                                            <div class="d-flex align-items-center">
                                                <!-- <div class="flex-grow-1">
                                                    <select class="custom-select form-control-sm" style="width: 320px">
                                                        <option disabled value=""> Select a Shipper</option>
                                                        <option value="ABS">A</option>
                                                        <option value="BDE">B</option>
                                                        <option value="RTY">C</option>  
                                                    </select>
                                                </div> -->
                                                <!-- <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-shipper" class="form-control-sm col-form-label"> -->
                                                    <div class="custom-dropdown" ref="dropdownContainer_shipper" @click="toggleDropdown_shipper">
                                                        <input type="text" v-model="form.shipper_address.ship_name" placeholder="Search shipper" id="shipper" class="form-control" autocomplete="off"
                                                        :class="{ 'is-invalid': form.errors.has('ship_name') }"
                                                        style="width:300px;"
                                                        @input="filterShippers" @focus="toggleDropdown_shipper(true)" @blur="closeDropdown_shipper" />

                                                        <div v-if="isDropdownOpen_shipper && filteredShippers.length" class="dropdown-options">
                                                            <div v-for="(shipper, index) in filteredShippers" :key="shipper.id" @click.stop="selectShipper(shipper)" class="option">
                                                                {{ shipper.name }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <has-error :form="form" field="ship_name"></has-error>
                                                <!-- </b-form-group> -->
                                                <b-icon icon="box-arrow-up-right" aria-hidden="true" class="ml-2"
                                                    style="stroke: #355594"
                                                    @click="showShipper = !showShipper"></b-icon>
                                            </div>
                                        </b-form-group>
                                        <div v-if="showShipper">
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                    content-cols-lg="auto" label-for="shipper-name-input"
                                                    style="margin-bottom: 4px !important;"
                                                    class="">
                                                    <template #label>
                                                        <div class="d-flex justify-content-end" style="width: 100px;">
                                                            <span>&nbsp;</span>
                                                            <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                        </div>
                                                    </template>
                                                    <b-form-input id="shipper-name-input" class="form-control"
                                                        v-model="form.shipper_address.ship_name_2"
                                                        style="width:300px;"
                                                        :class="{ 'is-invalid': form.errors.has('ship_name_2') }"></b-form-input>
                                                    <has-error :form="form" field="ship_name_2"></has-error>
                                                </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-account-input"
                                                style="margin-bottom:4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Account:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="shipper-account-input" class="form-control"
                                                    v-model="form.shipper_address.ship_account"
                                                    style="width:300px;"
                                                    :class="{ 'is-invalid': form.errors.has('ship_account') }"></b-form-input>
                                                <has-error :form="form" field="ship_account"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="ship-address-input"
                                                style="margin-bottom:4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Address:</span>
                                                        <span class="text-danger"> &nbsp;*</span>
                                                    </div>
                                                </template>
                                                <b-form-input id="ship-address-input" class="form-control"
                                                    style="width: 300px" v-model="form.shipper_address.ship_address"
                                                    :class="{ 'is-invalid': form.errors.has('ship_address') }" @keydown="limitInput($event, 'shipper_address.ship_address', 40)"></b-form-input>
                                                <has-error :form="form" field="ship_address"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-address-line-2-input"
                                                style="margin-bottom:4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>&nbsp;</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="shipper-address-line-2-input" class="form-control"
                                                    style="width: 300px" v-model="form.shipper_address.ship_address_line_2"
                                                    :class="{ 'is-invalid': form.errors.has('ship_address_line_2') }" @keydown="limitInput($event, 'shipper_address.ship_address_line_2', 35)"></b-form-input>
                                                <has-error :form="form" field="ship_address_line_2"></has-error>
                                            </b-form-group>
                                            
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="ship-city-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>City:</span>
                                                        <span class="text-danger"> &nbsp;*</span>
                                                    </div>
                                                </template>
                                                <div class="d-flex align-items-center">
                                                    <b-form-input id="ship-city-input" class="form-control mr-2"
                                                        v-model="form.shipper_address.ship_city"
                                                        style="width:230px;"
                                                        :class="{ 'is-invalid': form.errors.has('ship_city') }"></b-form-input>
                                                    <b-form-input id="ship-city-input" class="form-control ml-2"
                                                        style="width: 60px" v-model="form.shipper_address.ship_airport_code"
                                                        :class="{ 'is-invalid': form.errors.has('ship_airport_code') }"></b-form-input>
                                                </div>
                                                <has-error :form="form" field="ship_city" :class="{ 'd-block': form.errors.has('ship_city') }"></has-error>
                                                <has-error :form="form" field="ship_airport_code"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-postcode-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Post Code:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="shipper-postcode-input" class="form-control"
                                                    v-model="form.shipper_address.ship_post_code"
                                                    style="width:200px;"
                                                    :class="{ 'is-invalid': form.errors.has('ship_post_code') }"></b-form-input>
                                                <has-error :form="form" field="ship_post_code"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-state-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>State:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="shipper-state-input" class="form-control"
                                                    style="width:200px;"
                                                    v-model="form.shipper_address.ship_state"
                                                    :class="{ 'is-invalid': form.errors.has('ship_state') }"></b-form-input>
                                                <has-error :form="form" field="ship_state"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-country-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Country:</span>
                                                        <span class="text-danger"> &nbsp;*</span>
                                                    </div>
                                                </template>
                                                <b-form-select id="shipper-country-input" class="form-control" style="width: 300px"
                                                    v-model="form.shipper_address.ship_country"
                                                    :class="{ 'is-invalid': form.errors.has('ship_country') }">
                                                    <option disabled value=""> Please select one</option>
                                                    <option v-for="country in countries" :key="country.value" :value="country.value">
                                                        {{ country.text }}
                                                    </option>
                                                </b-form-select>
                                                <has-error :form="form" field="ship_country"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-phone-input"
                                                style="margin-bottom:4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Phone:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="shipper-phone-input" class="form-control"
                                                    v-model="form.shipper_address.ship_phone"
                                                    style="width:200px;"
                                                    :class="{ 'is-invalid': form.errors.has('ship_phone') }"></b-form-input>
                                                <has-error :form="form" field="ship_phone"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-fax-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Fax:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="shipper-fax-input" class="form-control"
                                                    v-model="form.shipper_address.ship_fax"
                                                    style="width:200px;"
                                                    :class="{ 'is-invalid': form.errors.has('ship_fax') }"></b-form-input>
                                                <has-error :form="form" field="ship_fax"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="shipper-telex-input"
                                                class=""
                                                style="margin-bottom: 4px !important;">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Telex:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="shipper-telex-input"
                                                    style="width:200px;"
                                                    class="form-control"
                                                    v-model="form.shipper_address.ship_telex"></b-form-input>
                                            </b-form-group>

                                            <b-form-checkbox size="sm" class="ml-lg-35" v-model="form.is_shipper_address_save">Save new address to address book</b-form-checkbox>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label="" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mt-2">
                                            <b-form-checkbox size="sm" class="mt-2 text-bold">Set as default house shipper for later logins</b-form-checkbox>
                                        </b-form-group>
                                    </b-col>
                                    <!-- CONSIGNEE SECTION COLUMN -->
                                    <b-col cols="6">
                                        <div class="mt-2 mb-4">
                                            <h6 class="pl-6">Consignee</h6>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="consignee"
                                            style="margin-bottom: 4px !important;"
                                            class="">
                                            <template #label>
                                                <div class="d-flex justify-content-end" style="width: 100px;">
                                                    <span>Name:</span>
                                                    <span class="text-danger"> &nbsp;*</span>
                                                </div>
                                            </template>
                                            <div class="d-flex align-items-center">
                                                <div class="custom-dropdown" ref="dropdownContainer_consignee" @click="toggleDropdown_consignee">
                                                    <input type="text" v-model="form.consignee_address.cons_name" placeholder="Search consignee" id="consignee" class="form-control" autocomplete="off"
                                                    style="width:300px;"
                                                    :class="{ 'is-invalid': form.errors.has('cons_name') }"
                                                    @input="filterConsignee" @focus="toggleDropdown_consignee(true)" @blur="closeDropdown_consignee" />

                                                    <div v-if="isDropdownOpen_consignee && filteredConsignees.length" class="dropdown-options">
                                                        <div v-for="(consignee, index) in filteredConsignees" :key="consignee.id" @click.stop="selectConsignee(consignee)" class="option">
                                                            {{ consignee.name }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <has-error :form="form" field="cons_name"></has-error>
                                                <b-icon icon="box-arrow-up-right" aria-hidden="true" class="ml-2"
                                                    style="stroke: #355594"
                                                    @click="showConsignee = !showConsignee"></b-icon>
                                            </div>
                                        </b-form-group>
                                        <div v-if="showConsignee">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-name-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>&nbsp;</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-name-input" class="form-control"
                                                    v-model="form.consignee_address.cons_name_2"
                                                    style="width:300px;"
                                                    :class="{ 'is-invalid': form.errors.has('cons_name_2') }"></b-form-input>
                                                <has-error :form="form" field="cons_name_2"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-account-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Account:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-account-input" class="form-control"
                                                    v-model="form.consignee_address.cons_account"
                                                    style="width:300px;"
                                                    :class="{ 'is-invalid': form.errors.has('cons_account') }"></b-form-input>
                                                <has-error :form="form" field="cons_account"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-address-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Address:</span>
                                                        <span class="text-danger"> &nbsp;*</span>
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-address-input" class="form-control"
                                                    style="width: 300px"
                                                    v-model="form.consignee_address.cons_address" :class="{ 'is-invalid': form.errors.has('cons_address') }" @keydown="limitInput($event, 'consignee_address.cons_address', 40)"></b-form-input>
                                                    <has-error :form="form" field="cons_address"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-address-line-2-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>&nbsp;</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-address-line-2-input" class="form-control"
                                                    style="width: 300px" v-model="form.consignee_address.cons_address_line_2"
                                                    :class="{ 'is-invalid': form.errors.has('cons_address_line_2') }" @keydown="limitInput($event, 'consignee_address.cons_address_line_2', 35)"></b-form-input>
                                                <has-error :form="form" field="cons_address_line_2"></has-error>
                                            </b-form-group>
                                            
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>City:</span>
                                                        <span class="text-danger"> &nbsp;*</span>
                                                    </div>
                                                </template>
                                                <div class="d-flex align-items-center">
                                                    <b-form-input id="input-horizontal" class="form-control mr-2"
                                                        v-model="form.consignee_address.cons_city"
                                                        style="width: 230px"
                                                        :class="{ 'is-invalid': form.errors.has('cons_city') }"></b-form-input>
                                                    <b-form-input id="input-horizontal" class="form-control ml-2"
                                                        style="width: 60px"></b-form-input>
                                                </div>
                                                <has-error :form="form" field="cons_city" :class="{ 'd-block': form.errors.has('cons_city') }"></has-error>
                                            </b-form-group>
                                                
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-post-code"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Post Code:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-post-code" class="form-control"
                                                    style="width:200px;"
                                                    v-model="form.consignee_address.cons_post_code"
                                                    :class="{ 'is-invalid': form.errors.has('cons_post_code') }"></b-form-input>
                                                <has-error :form="form" field="cons_post_code"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-state-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>State:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-state-input" class="form-control"
                                                    v-model="form.consignee_address.cons_state"
                                                    style="width:200px;"
                                                    :class="{ 'is-invalid': form.errors.has('cons_state') }"></b-form-input>
                                                <has-error :form="form" field="cons_state"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-country-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Country:</span>
                                                        <span class="text-danger"> &nbsp;*</span>
                                                    </div>
                                                </template>
                                                <b-form-select class="form-control" style="width: 300px"
                                                    v-model="form.consignee_address.cons_country"
                                                    :class="{ 'is-invalid': form.errors.has('cons_country') }">
                                                    <option value="Please select one"> Please select one</option>
                                                    <option v-for="country in countries" :key="country.value" :value="country.value">
                                                        {{ country.text }}
                                                    </option>
                                                </b-form-select>
                                                <has-error :form="form" field="cons_country"></has-error>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-phone-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Phone:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-phone-input" class="form-control"
                                                    style="width:200px;"
                                                    v-model="form.consignee_address.cons_phone"></b-form-input>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-fax-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Fax:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="input-horizontal" class="form-control"
                                                    style="width:200px;"
                                                    v-model="form.consignee_address.cons_fax"></b-form-input>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="cons-telex-input"
                                                style="margin-bottom: 4px !important;"
                                                class="">
                                                <template #label>
                                                    <div class="d-flex justify-content-end" style="width: 100px;">
                                                        <span>Telex:</span>
                                                        <!-- <span class="text-danger"> &nbsp;*</span> -->
                                                    </div>
                                                </template>
                                                <b-form-input id="cons-telex-input" class="form-control"
                                                    style="width:200px;"
                                                    v-model="form.consignee_address.cons_telex"></b-form-input>
                                            </b-form-group>

                                            <b-form-checkbox size="sm" class="ml-lg-35" v-model="form.is_consignee_address_save">Save new address to address book</b-form-checkbox>
                                        </div>
                                    </b-col>
                                </b-row>
                                <hr class="hr" />
                                <!-- ROUTING INDORMATION AND SEARCH FLIGHTS TABS -->
                                <div>
                                    <b-tabs content-class="mt-7" class="custom-nav">
                                        <b-tab title="Routing Information">
                                            <b-row class="mt-5">
                                                <b-col cols="5">
                                                    <!-- <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                        label="Departure Airport*" label-for="input-departure-airport"
                                                        class="form-control-sm">
                                                        <b-form-select class="form-control" style="width: 150px"
                                                            v-model="form.routing_information.departure_airport"
                                                            :class="{ 'is-invalid': form.errors.has('departure_airport') }">
                                                            <option disabled value=""> Select a Rate Class</option>
                                                            <option value="ABY, Albany (ABY), United States"> ABY, Albany (ABY),
                                                                United States</option>
                                                            <option value="ABZ, Aberdeen (ABZ), United Kingdom">
                                                                ABZ, Aberdeen (ABZ), United
                                                                Kingdom
                                                            </option>
                                                        </b-form-select>
                                                        <has-error :form="form" field="departure_airport"></has-error>
                                                    </b-form-group> -->
                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                        label-for="departure"
                                                        class="">
                                                        <template #label>
                                                            <div class="d-flex justify-content-end" style="width: 122px;">
                                                                <span>Departure Airport:</span>
                                                                <span class="text-danger"> &nbsp;*</span>
                                                            </div>
                                                        </template>
                                                            <div class="custom-dropdown" ref="dropdownContainer_departure" @click="toggleDropdown_departure">
                                                                <input type="text" v-model="form.routing_information.departure_airport" placeholder="Search departure" id="departure" class="form-control" 
                                                                    style="width: 60%;"
                                                                    autocomplete="off" :class="{ 'is-invalid': form.errors.has('departure_airport') }">
                                                                <div v-if="isDropdownOpen_departure && filteredLocations_departure.length" class="dropdown-options">
                                                                    <div v-for="(item, index) in filteredLocations_departure" 
                                                                        :key="index" 
                                                                        @click.stop="selectOption_departure(item)" 
                                                                        class="option">
                                                                        {{ item.iata_code }} ({{ item.destination }})
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        <has-error :form="form" field="departure_airport" :class="{ 'd-block': form.errors.has('departure_airport') }"></has-error>
                                                    </b-form-group>
                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                        label-for="destination"
                                                        class="">
                                                        <template #label>
                                                            <div class="d-flex justify-content-end" style="width: 122px;">
                                                                <span>Destination Airport:</span>
                                                                <span class="text-danger"> &nbsp;*</span>
                                                            </div>
                                                        </template>
                                                        <div class="custom-dropdown" ref="dropdownContainer_destination" @click="toggleDropdown_destination">
                                                            <input type="text" v-model="form.routing_information.destination_airport" placeholder="Search destination" id="destination" class="form-control" 
                                                            style="width: 60%;"
                                                            autocomplete="off" :class="{ 'is-invalid': form.errors.has('destination_airport') }">
                                                            <div v-if="isDropdownOpen_destination && filteredLocations_destination.length" class="dropdown-options">
                                                                <div v-for="(item, index) in filteredLocations_destination" 
                                                                    :key="index" 
                                                                    @click.stop="selectOption_destination(item)" 
                                                                    class="option">
                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <has-error :form="form" field="destination_airport" :class="{ 'd-block': form.errors.has('destination_airport') }"></has-error>
                                                    </b-form-group>
                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                        label-for="input-master-origin"
                                                        class="">
                                                        <template #label>
                                                            <div class="d-flex justify-content-end" style="width: 122px;">
                                                                <span>Master Origin:</span>
                                                                <span class="text-danger"> &nbsp;*</span>
                                                            </div>
                                                        </template>
                                                        <b-form-input id="input-master-origin"
                                                            style="width: 60%;"
                                                            class="form-control" v-model="form.routing_information.master_origin"
                                                            :class="{ 'is-invalid': form.errors.has('master_origin') }"></b-form-input>
                                                        <has-error :form="form" field="master_origin"></has-error>
                                                    </b-form-group>
                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                        label-for="input-master-destination"
                                                        class="">
                                                        <template #label>
                                                            <div class="d-flex justify-content-end" style="width: 122px;">
                                                                <span>Master Destination:</span>
                                                                <span class="text-danger"> &nbsp;*</span>
                                                            </div>
                                                        </template>
                                                        <b-form-input id="input-master-destination"
                                                            style="width: 60%;"
                                                            class="form-control" v-model="form.routing_information.master_destination"
                                                            :class="{ 'is-invalid': form.errors.has('master_destination') }"></b-form-input>
                                                        <has-error :form="form" field="master_destination"></has-error>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="7">
                                                    <div class="container mt-13">
                                                        <table class="">
                                                            <thead>
                                                                <tr class="">
                                                                    <th class=""style="color:#355594;">&nbsp;</th>
                                                                    <th class=""style="color:#355594;">From</th>
                                                                    <th class=""style="color:#355594;">To</th>
                                                                    <th class=""style="color:#355594;">By</th>
                                                                    <th class=""style="color:#355594;">Flight</th>
                                                                    <th class=""style="color:#355594;">Date</th>
                                                                    <th class="" style="width:100%;"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td class="editable-cell" style="width: 7%;padding: 2px;">Routing:<span class="text-danger">*</span></td>
                                                                    <td class="editable-cell" style="width: 28%;padding: 2px;">
                                                                        <div class="custom-dropdown" ref="dropdownContainer_from" @click="toggleDropdown_from">
                                                                            <input type="text" v-model="form.routing_information.from" placeholder="Search destination" id="from_id" class="form-control" 
                                                                                autocomplete="off"
                                                                                style=""
                                                                                :class="{ 'is-invalid': form.errors.has('from') }">
                                                                            <div v-if="isDropdownOpen_from && filteredLocations_from.length" class="dropdown-options">
                                                                                <div v-for="(item, index) in filteredLocations_from" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectOption_from(item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 28%;padding: 2px;">
                                                                        <div class="custom-dropdown" ref="dropdownContainer_to" @click="toggleDropdown_to">
                                                                            <input type="text" v-model="form.routing_information.to" placeholder="Search destination" id="to_id" class="form-control" 
                                                                                autocomplete="off"
                                                                                style=""
                                                                                :class="{ 'is-invalid': form.errors.has('to') }">
                                                                            <div v-if="isDropdownOpen_to && filteredLocations_to.length" class="dropdown-options">
                                                                                <div v-for="(item, index) in filteredLocations_to" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectOption_to(item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 10%;padding: 2px;">
                                                                        <input type="text" class="form-control"
                                                                            style="" v-model="form.routing_information.by"
                                                                            :class="{ 'is-invalid': form.errors.has('by') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 12%;padding: 2px;">
                                                                        <input type="text" class="form-control"
                                                                            style="" v-model="form.routing_information.flight"
                                                                            :class="{ 'is-invalid': form.errors.has('flight') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 15%;padding: 2px;">
                                                                        <input type="text" class="form-control"
                                                                            style="" v-model="form.routing_information.date"
                                                                            :class="{ 'is-invalid': form.errors.has('date') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 5%; padding-left: 20px;">
                                                                        <date-picker valueType="format"
                                                                            style="width: 100%;"
                                                                            @change="handleDateChange($event, 'form.routing_information.date')"></date-picker>
                                                                    </td>
                                                                </tr>
                                                                <tr v-if="form.errors.has('from') || form.errors.has('to') || form.errors.has('by') || form.errors.has('flight') || form.errors.has('date')">
                                                                    <td style="width: 7%;padding: 2px;">&nbsp;</td>
                                                                    <td valign="top" class="text-danger" style="">
                                                                        <has-error :form="form" field="from" :class="{ 'd-block': form.errors.has('from') }"></has-error>
                                                                    </td>
                                                                    <td valign="top" class="text-danger" style="">
                                                                        <has-error :form="form" field="to" :class="{ 'd-block': form.errors.has('to') }"></has-error>
                                                                    </td>
                                                                    <td valign="top" class="text-danger" style="">
                                                                        <has-error :form="form" field="by" :class="{ 'd-block': form.errors.has('by') }"></has-error>
                                                                    </td>
                                                                    <td valign="top" class="text-danger" style="">
                                                                        <has-error :form="form" field="flight" :class="{ 'd-block': form.errors.has('flight') }"></has-error>
                                                                    </td>
                                                                    <td valign="top" class="text-danger" style="">
                                                                        <has-error :form="form" field="date" :class="{ 'd-block': form.errors.has('date') }"></has-error>
                                                                    </td>
                                                                    <td style="width: 5%;padding: 2px;">&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="width: 7%;padding: 2px;">&nbsp;</td>
                                                                    <td style="width: 28%;padding: 2px;">&nbsp;</td>
                                                                    <td class="editable-cell" style="width: 28%;padding: 2px;">
                                                                        <div class="custom-dropdown" ref="dropdownContainer_to2" @click="toggleDropdown_to2">
                                                                            <input type="text" v-model="form.routing_information.to_2" placeholder="Search destination" id="to2_id" style=""
                                                                            class="form-control" autocomplete="off" :class="{ 'is-invalid': form.errors.has('to_2') }">
                                                                            <div v-if="isDropdownOpen_to2 && filteredLocations_to2.length" class="dropdown-options">
                                                                                <div v-for="(item, index) in filteredLocations_to2" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectOption_to2(item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <has-error :form="form" field="to_2"></has-error>
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 10%;padding: 2px;">
                                                                        <input type="text" class="form-control" style=""
                                                                            v-model="form.routing_information.by_2"
                                                                            :class="{ 'is-invalid': form.errors.has('by_2') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 12%;padding: 2px;">
                                                                        <input type="text" class="form-control" style=""
                                                                            v-model="form.routing_information.flight_2"
                                                                            :class="{ 'is-invalid': form.errors.has('flight_2') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 15%;padding: 2px;">
                                                                        <input type="text" class="form-control" style=""
                                                                            v-model="form.routing_information.date_2"
                                                                            :class="{ 'is-invalid': form.errors.has('date_2') }" />
                                                                    </td>
                                                                    <td class="editable-cell w-10" style="width: 5%; padding-left: 20px;">
                                                                        <date-picker valueType="format"
                                                                            style=" width: 100%;"
                                                                            @change="handleDateChange($event, 'form.routing_information.date_2')"></date-picker>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="width: 7%;padding: 2px;">&nbsp;</td>
                                                                    <td style="width: 28%;padding: 2px;">&nbsp;</td>
                                                                    <td class="editable-cell" style="width: 28%;padding: 2px;">
                                                                        <!-- <b-form-select class="form-control" style="width: 150px"
                                                                            v-model="form.routing_information.to_3"
                                                                            :class="{ 'is-invalid': form.errors.has('to_3') }">
                                                                            <option disabled value=""> Select 3 a Rate Class
                                                                            </option>
                                                                            <option value="ABY, Albany (ABY), United States">ABY,
                                                                                Albany (ABY), United States</option>
                                                                            <option value="ABZ, Aberdeen (ABZ), United Kingdom">ABZ,
                                                                                Aberdeen (ABZ), United Kingdom</option>
                                                                        </b-form-select> -->
                                                                        <div class="custom-dropdown" ref="dropdownContainer_to3" @click="toggleDropdown_to3">
                                                                            <input type="text" v-model="form.routing_information.to_3" placeholder="Search destination" id="to3_id" style="" class="form-control" 
                                                                                autocomplete="off" :class="{ 'is-invalid': form.errors.has('to_3') }">
                                                                            <div v-if="isDropdownOpen_to3 && filteredLocations_to3.length" class="dropdown-options">
                                                                                <div v-for="(item, index) in filteredLocations_to3" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectOption_to3(item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <has-error :form="form" field="to_3"></has-error>
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 10%;padding: 2px;">
                                                                        <input type="text" class="form-control" style=""
                                                                            v-model="form.routing_information.by_3"
                                                                            :class="{ 'is-invalid': form.errors.has('by_3') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 12%;padding: 2px;">
                                                                        <input type="text" class="form-control" style=""
                                                                            v-model="form.routing_information.flight_3"
                                                                            :class="{ 'is-invalid': form.errors.has('flight_3') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 15%;padding: 2px;">
                                                                        <input type="text" class="form-control" style=""
                                                                            v-model="form.routing_information.date_3"
                                                                            :class="{ 'is-invalid': form.errors.has('date_3') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 5%; padding-left: 20px;">
                                                                        <date-picker valueType="format"
                                                                            style="width: 100%;"
                                                                            @change="handleDateChange($event, 'form.routing_information.date_3')"></date-picker>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </b-tab>
                                        <!-- <b-tab title="Search Flights">
                                            <b-row>
                                                <b-col cols="12">
                                                    <div class="container d-flex align-items-center" style="background-color:#F2F9FF;color:#355594 !important;">
                                                        <div style="width:160px !important;padding:5px">
                                                            Carrier <span class="text-danger">*</span>
                                                        </div>
                                                        <div style="width:240px !important;padding:5px">
                                                            Origin <span class="text-danger">*</span>
                                                        </div>
                                                        <div style="width:150px !important;padding:5px">
                                                            Destination <span class="text-danger">*</span>
                                                        </div>
                                                        <div style="width:100px !important;padding:5px">
                                                            Flight Date <span class="text-danger">*</span>
                                                        </div>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col cols="12">
                                                    <div class="container d-flex align-items-center mt-6">
                                                        <div class="editable-cell" style="padding:5px">
                                                            <input type="text" class="form-control" style="width:150px !important;" />
                                                        </div>
                                                        <div class="editable-cell" style="padding:5px">
                                                            <input type="text" class="form-control" style="width:230px !important;"
                                                                :value="getOriginCode(form.routing_information.departure_airport)" />
                                                        </div>
                                                        <div class="editable-cell" style="padding:5px">
                                                            <input type="text" class="form-control" style="width:140px !important;"
                                                                :value="getDestinationCode(form.routing_information.destination_airport)" />
                                                        </div>
                                                        <div class="editable-cell" style="padding:5px">
                                                            <input type="text" class="form-control" style="width:70px !important;" />
                                                        </div>
                                                        <date-picker valueType="format"
                                                            style=" width: 30px !important;"></date-picker>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </b-tab> -->
                                    </b-tabs>
                                </div>
                                <hr class="hr" />

                                <div class="py-5">
                                    <b-row>
                                        <b-col cols="12">
                                            <div class="d-flex align-items-center mb-6">
                                                <div class="mr-4"><h6>Consignment Rate Description</h6></div>
                                                <div class="ml-4">
                                                    <b-button class="btn" v-b-modal.modal-consignment :disabled="isConsignmentAdded" @click="handleAddConsignment">Add Consignment Information</b-button>
                                                </div>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <b-modal id="modal-consignment" ref="modalConsignment" title="Consignment Information"
                                        size="xl" ok-only hide-footer @hide="handleModalClose">
                                        <b-row>
                                            <!-- First Column -->
                                            <b-col cols="6">
                                                <h6 style="margin-bottom:15px;">Pieces and Nature and Quantity of Goods</h6>
                                                <div class="">
                                                    <label for="Pieces" style="margin-bottom:0px;">Pieces</label>
                                                    <b-form-input id="input-departure-airport" class="form-control" style="width:80px !important;margin-bottom:10px;"
                                                        v-model="consignment_list.pieces" :class="{ 'is-invalid': consignment_list.errors.has('pieces') }"></b-form-input>
                                                        <has-error :form="consignment_list" field="pieces"></has-error>
                                                    <label for="Description7"  style="margin-bottom:0px;">Description</label>
                                                    <b-form-textarea style="height: 70px;width: 400px;margin-bottom:10px;" id="textarea"
                                                        v-model="consignment_list.description" :class="{ 'is-invalid': consignment_list.errors.has('description') }"></b-form-textarea>
                                                        <has-error :form="consignment_list" field="description"></has-error>
                                                    <table class="table table-sm">
                                                        <tbody>
                                                            <tr>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Rate Class:</th>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">ULD Rate class:</th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control" style="width: 250px;margin-bottom:10px;" v-model="consignment_list.rate_class" @change="calculateTotalAmount" :class="{ 'is-invalid': consignment_list.errors.has('rate_class') }">
                                                                        <option value="">Select a Rate Class</option>
                                                                        <option value="B">CB - Basic rate</option>
                                                                        <option value="C">CC - Specific commodity rate</option>
                                                                        <option value="E">CE - Unit load device additional rate</option>
                                                                        <option value="K">CK - Rate per kilogram</option>
                                                                        <option value="M">CM - Minimum charge</option>
                                                                        <option value="N">CN - Normal rate</option>
                                                                        <option value="P">CP - International priority service rate</option>
                                                                        <option value="Q">CQ - Quantity rate</option>
                                                                        <option value="R">CR - Class rate reduction</option>
                                                                        <option value="S">CS - Class rate surcharge</option>
                                                                        <option value="U">CU - Unit load device basic charge or rate</option>
                                                                        <option value="X">CX - Unit load device additional info</option>
                                                                        <option value="Y">CY - Unit load device discount</option>
                                                                        <option value="Z">CZ - Mutually Defined</option>
                                                                    </b-form-select>
                                                                    <has-error :form="consignment_list" field="rate_class"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control" style="width: 140px;" v-model="consignment_list.uld_rate_class" :class="{ 'is-invalid': consignment_list.errors.has('uld_rate_class') }"/>
                                                                        <has-error :form="consignment_list" field="uld_rate_class"></has-error>
                                                                </td>
                                                            </tr>
                                                            <tr v-if="consignment_list.rate_class">
                                                                <td colspan="4" class="editable-cell" style="margin-bottom:10px;">
                                                                    <div
                                                                        class="d-flex justify-content-end align-items-center">
                                                                        <span class="mr-2">Charge:</span>
                                                                        <input type="text" class="form-control" style="width: 140px;" :value="calculatedCharge" />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Service code</th>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Commodity Item</th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control" style="width: 250px;margin-bottom:10px;" v-model="consignment_list.service_code" :class="{ 'is-invalid': consignment_list.errors.has('service_code') }">
                                                                        <option value="">Select a Service Code</option>
                                                                        <option value="A">A - Airport to Airport</option>
                                                                        <option value="B">B - Service Cargo</option>
                                                                        <option value="C">C - Company Material</option>
                                                                        <option value="D">D - Door to Door</option>
                                                                        <option value="E">E - Airport to Door</option>
                                                                        <option value="F">F - Flight Specific</option>
                                                                        <option value="G">G - Door to Airport</option>
                                                                        <option value="H">H - Company Mail</option>
                                                                        <option value="I">I - Diplomatic Mail</option>
                                                                        <option value="J">J - Priority Service</option>
                                                                        <option value="P">P - Small Package Service</option>
                                                                        <option value="R">R - Restricted</option>
                                                                        <option value="S">S - Substitue Truck</option>
                                                                        <option value="T">T - Charter</option>
                                                                        <option value="X">X - Express Service</option>
                                                                    </b-form-select>
                                                                    <has-error :form="consignment_list" field="service_code"></has-error>
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control" style="width: 140px;" v-model="consignment_list.commodity_item" :class="{ 'is-invalid': consignment_list.errors.has('commodity_item') }"/>
                                                                    <has-error :form="consignment_list" field="commodity_item"></has-error>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">
                                                                    Country Of Origin of Goods
                                                                </th>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Slac:</th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control" style=" width: 250px;margin-bottom:10px;" v-model="consignment_list.country_origin_goods" :class="{ 'is-invalid': consignment_list.errors.has('country_origin_goods') }">
                                                                        <option value=""> Select a Country</option>
                                                                        <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                            {{ country.text }}
                                                                        </option>
                                                                    </b-form-select>
                                                                    <has-error :form="consignment_list" field="country_origin_goods"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control" style="width: 140px;" v-model="consignment_list.slac" :class="{ 'is-invalid': consignment_list.errors.has('slac') }"/>
                                                                    <has-error :form="consignment_list" field="commodity_item"></has-error>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Hs Codes:</th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell" style="display: flex;align-items: center;">
                                                                    <b-form-input type="text" class="form-control" style="width: 140px;margin-right: 10px;margin-bottom:10px;" v-model="consignment_list.hs_code" :class="{ 'is-invalid': hs_code_error.length > 0 }"></b-form-input>
                                                                    <button @click="addHsCode" style="margin-bottom:10px;border-radius: 30px;color: #355594;background: transparent;border: 1px solid #355594;padding: 8px 18px;">Add</button>
                                                                </td>
                                                                <div v-if="hs_code_error.length" class="text-danger">
                                                                    <ul  style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                        <li>Warning:</li>
                                                                        <li v-for="(error, index) in hs_code_error" :key="index">{{ error }}</li>
                                                                    </ul>
                                                                </div>
                                                            </tr>
                                                            <tr style="background-color:#F2F9FF;">
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">HS Codes</th>
                                                            </tr>
                                                            <tr v-for="(code, index) in consignment_list.hsCodes"
                                                                :key="index">
                                                                <td class="editable-cell"
                                                                    style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                    <span> {{ code }} </span>
                                                                    <b-icon icon="trash" font-scale="1"
                                                                        @click="removeHsCode(index)"
                                                                        style="cursor: pointer;"></b-icon>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </b-col>
                                            <!-- Second Column -->
                                            <b-col cols="6">
                                                <h6 style="margin-bottom:25px;">Weight and Dimensions</h6>
                                                <div class="">
                                                    <table class="table table-sm">
                                                        <tr>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Gross Weight</th>
                                                            <th></th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Chargeable Weight</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Rate</th>
                                                        </tr>
                                                        <tbody>
                                                            <tr>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control" style="width: 90px;" v-model="consignment_list.gross_weight" :class="{ 'is-invalid': consignment_list.errors.has('gross_weight') }" />
                                                                    <has-error :form="consignment_list" field="gross_weight"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <b-form-select class="form-control" style=" width: 65px;" v-model="consignment_list.weight_code" :class="{ 'is-invalid': consignment_list.errors.has('weight_code') }">
                                                                        <option value="KGM">Kgs</option>
                                                                        <option value="LBR">Lbs</option>
                                                                    </b-form-select>
                                                                    <has-error :form="consignment_list" field="weight_code"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control" style="width: 115px;" v-model="consignment_list.chargable_weight" :class="{ 'is-invalid': consignment_list.errors.has('chargable_weight') }" />
                                                                    <has-error :form="consignment_list" field="chargable_weight"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control" style=" width: 110px;" v-model="consignment_list.rate" :class="{ 'is-invalid': consignment_list.errors.has('rate') }" />
                                                                    <has-error :form="consignment_list" field="rate"></has-error>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table class="table table-sm">
                                                        <tr>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Pcs</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Wgt</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Length</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Width</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Height</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Unit</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;"></th>
                                                        </tr>
                                                        <tbody>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control" style="width:60px;" v-model="consignment_list.pcs" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control" style="width:60px;" v-model="consignment_list.wgt" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control" style="width:60px;" v-model="consignment_list.length" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control" style="width:60px;" v-model="consignment_list.width" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input class="form-control" style="width:60px;" v-model="consignment_list.height" type="text" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control" style="width: 65px;background-position-x: right;" v-model="consignment_list.unit">
                                                                        <option value="CMT">CMT</option>
                                                                        <option value="INH">INH</option>
                                                                        <option value="FOT">FOT</option>
                                                                    </b-form-select>
                                                                </td>
                                                                <td class="editable-cell"><button @click="addPcsInfo" style="border-radius: 30px;color: #355594;background: transparent;border: 1px solid #355594;padding: 8px 18px;">Add</button></td>
                                                            </tr>
                                                            <tr v-if="validationErrors.length > 0">
                                                                <td colspan="7" style="border:0px">
                                                                    <div class="text-danger">
                                                                        <ul style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                            <li>Warning:</li>
                                                                            <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table class="table table-sm">
                                                        <tr style="background-color:#F2F9FF">
                                                            <th style="color:#000000;font-weight:500;">Pcs</th>
                                                            <th style="color:#000000;font-weight:500;">Wgt</th>
                                                            <th style="color:#000000;font-weight:500;">Length</th>
                                                            <th style="color:#000000;font-weight:500;">Width</th>
                                                            <th style="color:#000000;font-weight:500;">Height</th>
                                                            <th style="color:#000000;font-weight:500;">Unit</th>
                                                        </tr>
                                                        <tbody>
                                                            <tr v-for="(row, index) in consignment_list.itemss"
                                                                :key="index">
                                                                <td class="editable-cell">{{ row.pcs }}</td>
                                                                <td class="editable-cell">{{ row.wgt }} {{ consignment_list.weight_code }}</td>
                                                                <td class="editable-cell">{{ row.length }}</td>
                                                                <td class="editable-cell">{{ row.width }}</td>
                                                                <td class="editable-cell">{{ row.height }}</td>
                                                                <td class="editable-cell"
                                                                    style="display: flex;align-items: center;justify-content: space-between;width: 100%;">
                                                                    <span class="mr-3">{{ row.unit }}</span>
                                                                    <b-icon icon="trash" font-scale="1"
                                                                        @click="deletePcs(index)"></b-icon>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table class="table-sm">
                                                        <tr>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;">Volume</th>
                                                            <th style="padding-bottom:0px;font-size: 13px !important;font-weight:500;"></th>
                                                        </tr>
                                                        <tbody>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <b-form-input id="input-horizontal" class="form-control" style="width: 80px" v-model="consignment_list.volume"></b-form-input>
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control" style="width:70px;background-position-x: right;" v-model="this.form.entries.dimention_unit">
                                                                        <option value="CMQ">cm³</option> <!-- CC Cubic centimetre-->
                                                                        <option value="MTQ">m³</option> <!-- MC  Cubic Metre-->  
                                                                        <option value="FTQ">ft³</option> <!-- CF  Cubic Foot--> 
                                                                        <option value="INQ">in³</option> <!-- CI  Cubic inch--> 
                                                                    </b-form-select>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <h5 class="mt-10 mb-2" style="font-size:13px;font-weight: 500;">ULD Information</h5>
                                                <div class="">
                                                    <table class="table table-sm">
                                                        <tbody>
                                                            <tr>
                                                                <th style="font-size:13px;font-weight: 500;padding-bottom:0px;">ULD Type:</th>
                                                                <th style="font-size:13px;font-weight: 500;padding-bottom:0px;">ULD Serial:</th>
                                                                <th style="font-size:13px;font-weight: 500;padding-bottom:0px;">Owner:</th>
                                                                <th></th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell pr-15">
                                                                    <input type="text" class="form-control" style="width: 80px;" v-model="consignment_list.uld_type" />
                                                                </td>
                                                                <td class="editable-cell pr-15">
                                                                    <input type="text" class="form-control" style="width: 110px;" v-model="consignment_list.uld_serial" />
                                                                    <!-- <has-error :form="form" field="uld_serial"></has-error> -->
                                                                </td>
                                                                <td class="editable-cell pr-8">
                                                                    <input type="text" class="form-control" style="width: 110px;" v-model="consignment_list.owner" />
                                                                </td>
                                                                <td class="editable-cell"><button @click="addUldInfo" style="border-radius: 30px;color: #355594;background: transparent;border: 1px solid #355594;padding: 8px 18px;">Add</button></td>
                                                            </tr>
                                                            <tr v-if="uld_error.length" style="color: red;">
                                                                <td colspan="4" style="border:0px">
                                                                    <ul style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                        <li>Warning:</li>
                                                                        <li v-for="(error, index) in uld_error" :key="index">{{ error }}</li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table class="table table-sm">
                                                        <tbody>
                                                            <tr style="background-color:#F2F9FF;">
                                                                <th style="color:000;font-size:13px;font-weight:500;">ULD Type:</th>
                                                                <th style="color:000;font-size:13px;font-weight:500;">ULD Serial:</th>
                                                                <th style="color:000;font-size:13px;font-weight:500;">Owner:</th>
                                                                <th></th>
                                                            </tr>
                                                            <tr v-for="(row, index) in consignment_list.uld_infos" :key="index">
                                                                <td class="editable-cell">{{ row.uld_type }}</td>
                                                                <td class="editable-cell">{{ row.uld_serial }}</td>
                                                                <td class="editable-cell">{{ row.owner }}</td>
                                                                <td class="editable-cell" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                    <b-icon icon="trash" font-scale="1" @click="deleteUldInfo(index)"></b-icon>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </b-col>
                                        </b-row>
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-secondary" @click="addOrUpdateEntry" style="background: transparent !important;">
                                                {{ edit_entry_index !== null ? 'Update' : 'Add' }}
                                            </button>
                                        </div>
                                    </b-modal>
                                    <b-row>
                                        <b-col cols="12">
                                            <table class="table table-sm" style="max-width:100%">
                                                <thead>
                                                    <tr class="" style="background-color: #F2F9FF;">
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Pcs.</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Description</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;">Srv. Code</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Com. Itm.</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Gross Wgt.</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Chrg. Wgt.</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Rate</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Detailed Pcs. Info</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Vol.</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Rate Class</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">UID Rate Class</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Charge</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">HS Code</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Origin Country</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">UID information</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class="">Slac</th>
                                                        <th style="font-size: 12px;font-weight: 500 !important;" class=""></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(entry, index) in form.entries" :key="index">
                                                        <!-- Table data -->
                                                        <td>{{ entry.pieces }}</td>
                                                        <td>{{ entry.description }}</td>
                                                        <td>{{ entry.service_code }}</td>
                                                        <td>{{ entry.commodity_item }}</td>
                                                        <td>{{ entry.gross_weight }}, {{ entry.weight_code }}</td>
                                                        <td>{{ entry.chargable_weight }}</td>
                                                        <td>{{ entry.rate }}</td>
                                                        <td>
                                                            <div v-for="(pcs, pcsIndex) in entry.itemss" :key="pcsIndex"
                                                                class="mb-1">
                                                                {{ pcs.pcs }}-{{ pcs.wgt }}-{{ pcs.weight_code }}-{{
                                                                    pcs.length }}x{{ pcs.width }}x{{ pcs.height }}-{{ pcs.unit }}
                                                            </div>
                                                        </td>
                                                        <!-- <td>{{ entry.pcs }}-{{ entry.gross_weight }}-{{ entry.weight_code }}-{{ entry.length }}x{{ entry.width }}x{{ entry.height }}-{{ entry.unit }}</td> -->
                                                        <td>{{ entry.volume }}</td>
                                                        <td>{{ entry.rate_class }}</td>
                                                        <td>{{ entry.uld_rate_class }}</td>
                                                        <td>{{ form.totals.total_amount }}</td>
                                                        <td>
                                                            <div v-for="(hs, hsIndex) in entry.hsCodes" :key="hsIndex"
                                                                class="mb-1">
                                                                {{ hs }}
                                                            </div>
                                                        </td>
                                                        <td>{{ entry.country_origin_goods }}</td>
                                                        <td>
                                                            <div v-for="(uld, uldIndex) in entry.uld_infos" :key="uldIndex"
                                                                class="mb-1">
                                                                {{ uld.uld_type }}-{{ uld.uld_serial }}-{{ uld.owner }}
                                                            </div>
                                                        </td>
                                                        <td>{{ entry.slac }}</td>
                                                        <td class="d-flex align-items-center">
                                                            <b-icon icon="pencil" font-scale="1" style="cursor: pointer;"
                                                                @click="editEntry(index)" class="mr-2"></b-icon>
                                                            <b-icon icon="trash" font-scale="1"
                                                                @click="deleteEntry(index)"></b-icon>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col cols="12">
                                            <div class="d-flex align-items-center justify-content-end mb-5 mt-5">
                                                <b-row>
                                                    <b-col cols="12" class="mr-28">
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                            content-cols-lg="auto" label-for="input-total-volumn"
                                                            class="">
                                                            <template #label>
                                                                <div class="d-flex align-items-center justify-content-end" style="width:92px;">
                                                                    <span>Total Volume:</span>
                                                                </div>
                                                            </template>
                                                            <div class="d-flex align-items-center">
                                                                <b-form-input id="input-total-volumn"
                                                                    style="width:140px;"    
                                                                    class="form-control" v-model="form.totals.total_volume"></b-form-input>
                                                                <b-form-select 
                                                                    style="width:60px;" 
                                                                    label-cols-lg="auto" content-cols-sm
                                                                    content-cols-lg="auto"
                                                                    class="form-control ml-2" v-model="form.totals.dimention_unit">
                                                                    <option value="CMQ">cm³</option> <!-- CC Cubic centimetre-->
                                                                    <option value="MTQ">m³</option> <!-- MC  Cubic Metre-->  
                                                                    <option value="FTQ">ft³</option> <!-- CF  Cubic Foot--> 
                                                                    <option value="INQ">in³</option> <!-- CI  Cubic inch--> 
                                                                </b-form-select>
                                                            </div>  
                                                        </b-form-group>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                            content-cols-lg="auto" label-for="input-total-amount"
                                                            class="">
                                                            <template #label>
                                                                <div class="d-flex align-items-center justify-content-end" style="width:92px;">
                                                                    <span>Total Amount:</span>
                                                                </div>
                                                            </template>
                                                            <b-form-input id="input-total-amount"  style="width:140px;"  
                                                                class="form-control" :value="calculatedCharge"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                            content-cols-lg="auto" label-for="input-master-pcs"
                                                            class="">
                                                            <template #label>
                                                                <div class="d-flex align-items-center justify-content-end" style="width:92px;">
                                                                    <span>Master Pcs:</span>
                                                                </div>
                                                            </template>
                                                            <b-form-input id="input-master-pcs" class="form-control"
                                                                style="width:140px;"
                                                                v-model="form.totals.master_pcs" :class="{ 'is-invalid': form.errors.has('master_pcs') }"></b-form-input>
                                                                <has-error :form="form" field="master_pcs"></has-error>
                                                        </b-form-group>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                            content-cols-lg="auto" label-for="input-master-weight"
                                                            class="">
                                                            <template #label>
                                                                <div class="d-flex align-items-center justify-content-end" style="width:92px;">
                                                                    <span>Master Weight:</span>
                                                                    <span class="text-danger">&nbsp;</span>
                                                                </div>
                                                            </template>
                                                            <b-form-input id="input-master-weight" class="form-control"
                                                                style="width:140px;"
                                                                v-model="form.totals.master_weight" :class="{ 'is-invalid': form.errors.has('master_weight') }"></b-form-input>
                                                                <has-error :form="form" field="master_weight"></has-error>
                                                        </b-form-group>
                                                    </b-col>
                                                </b-row>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <b-form-checkbox size="sm" class="mt-2 text-bold justify-content-lg-start" id="agreed">As Agreed</b-form-checkbox>
                                </div>
                                <hr class="hr" />
                                <div>
                                    <b-row>
                                        <b-col cols="12">
                                            <div class="mt-2 mb-10 ml-4 mr-4">
                                                <h6 class="h-color mb-6">Customs Origin Code:</h6>
                                                <b-form-group id="fieldset-horizontal" style="width: 450px">
                                                    <b-form-select class="form-control" v-model="form.custom_origin.customs_origin_code"
                                                    :class="{ 'is-invalid': form.errors.has('customs_origin_code') }">
                                                        <option value="">Select another charge code</option>
                                                        <option value="T1">T1 - Goods from outside the EC under Customs Control</option>
                                                        <option value="T2">T2 - EC Goods not in free circulation</option>
                                                        <option value="TE">TE - Goods in trade with Spain subject to duties</option>
                                                        <option value="TP">TP - Goods in trade with Portugal subject to special duties</option>
                                                        <option value="TD">TD - Goods already under formal transit procedure</option>
                                                        <option value="TF">TF - Goods in trade between EC and Canary Islands</option>
                                                        <option value="C">C - Goods in free circulation</option>
                                                        <option value="X">X - Goods in free circulation with destination outside the EC</option>
                                                    </b-form-select>
                                                    <has-error :form="form" field="customs_origin_code"></has-error>
                                                </b-form-group>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <hr class="hr" />
                                    <b-row>
                                        <b-col cols="12">
                                            <b-tabs content-class="mt-3" class="custom-nav">
                                                <b-tab title="OSI">
                                                    <div class="ml-3 mt-8">
                                                        <h6 class="h-color" style="font-size: 15px;font-weight:500">Other Service Information:</h6>
                                                        <div class="py-7">
                                                            <b-form-textarea class="" style="height:80px !important;width: 60% !important;" id="textarea"
                                                                v-model="form.custom_origin.other_service_information"
                                                                :class="{ 'is-invalid': form.errors.has('other_service_information') }" @input="validateTextarea"></b-form-textarea>
                                                            <has-error :form="form" field="other_service_information"></has-error>
                                                        </div>
                                                    </div>
                                                </b-tab>
                                                <b-tab title="SSR">
                                                        <div class="ml-3 mt-8">
                                                            <h6 class="h-color" style="font-size: 15px;font-weight:500">Special Service Request:</h6>
                                                            <div class="py-7">
                                                                <b-form-textarea class="" style="height:80px !important;width: 60% !important;" id="textarea"
                                                                    v-model="form.custom_origin.special_service_request"
                                                                    :class="{ 'is-invalid': form.errors.has('special_service_request') }"></b-form-textarea>
                                                                <has-error :form="form" field="special_service_request"></has-error>
                                                            </div>
                                                        </div>
                                                </b-tab>
                                                <b-tab title="Accounting Information">
                                                    <div class="ml-3 mt-8">
                                                        <h6 class="h-color" style="font-size: 15px;font-weight:500">Accounting Information:</h6>
                                                        <div class="py-7">
                                                            <b-form-textarea class=""
                                                            style="height:80px !important;width: 60% !important;" id="textarea"
                                                            v-model="form.custom_origin.accounting_information"
                                                            :class="{ 'is-invalid': form.errors.has('accounting_information') }"></b-form-textarea>
                                                            <has-error :form="form" field="accounting_information"></has-error>
                                                        </div>
                                                        <label for="input-horizontal" class="mt-2 mb-0" style="width: 90px">Letter Of Credit</label>
                                                        <b-form-select class="form-control-sm" v-model="form.custom_origin.letter_credit" style="width: 200px">
                                                            <option value="CRN">Credit Card Number</option>
                                                            <option value="CRD">Credit Card Expiry Date</option>
                                                            <option value="CRI">Credit Card Issuance Name</option>
                                                            <option value="GEN">General Information</option>
                                                            <option value="GBL">Government Bill of Lading</option>
                                                            <option value="STL">Mode of Settlement</option>
                                                            <option value="RET">Return to Origin</option>
                                                            <option value="SRN">Shipper's Reference Number</option>
                                                        </b-form-select>
                                                    </div>
                                                </b-tab>
                                                <b-tab title="Shipment Reference Infomation">
                                                    <div class="ml-3 mt-8">
                                                        <h6 class="h-color" style="font-size: 15px;font-weight:500">Shipment Reference Information</h6>
                                                        <div class="py-7">
                                                            <div class="d-flex align-items-center mb-2">
                                                                <label style="width:230px;justify-content: end;display: flex;padding-right: 2px;">Shipment Reference Number:</label>
                                                                <b-form-input style="width:300px;" id="input-horizontal" class="form-control"
                                                                    v-model="form.custom_origin.shipment_ref_no"
                                                                    :class="{ 'is-invalid': form.errors.has('shipment_ref_no') }"></b-form-input>
                                                                <has-error :form="form" field="shipment_ref_no"></has-error>
                                                            </div>
                                                            <div class="d-flex align-items-center mb-2">
                                                                <label style="width:230px;justify-content: end;display: flex;padding-right: 2px;">Supplementary Shipment Information:</label>
                                                                <b-form-input style="width:200px;" id="input-horizontal" class="form-control" v-model="form.custom_origin.supplementary_shipment_info"
                                                                :class="{ 'is-invalid': form.errors.has('supplementary_shipment_info') }"></b-form-input>
                                                            <has-error :form="form" field="supplementary_shipment_info"></has-error>
                                                            </div>
                                                            <div class="d-flex align-items-center">
                                                                <label style="width:230px;justify-content: end;display: flex;padding-right: 2px;">&nbsp;</label>
                                                                <b-form-input style="width:200px;" id="input-horizontal" class="form-control" v-model="form.custom_origin.supplementary_shipment_info_line_2" :class="{ 'is-invalid': form.errors.has('supplementary_shipment_info_line_2') }"></b-form-input>
                                                                <has-error :form="form" field="supplementary_shipment_info_line_2"></has-error>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </b-tab>
                                                <b-tab title="Agent Information">
                                                    <div class="ml-3 mt-8">
                                                        <h6 class="h-color" style="font-size: 15px;font-weight:500">Agent information:</h6>
                                                        <div class="py-7">
                                                            <b-row>
                                                                <b-col cols="6" class="align-items-center">
                                                                    <div style="background-color: #F2F9FF;" class="mb-4">
                                                                        <h6 class="h-color" style="padding:5px 20px;font-size: 15px;font-weight:500">HAWB Agent head office:</h6>
                                                                    </div>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-name"
                                                                        class="" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>Agent Name:</span>
                                                                                <span class="text-danger">*</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input style="width: 315px;" id="input-name" class="form-control-lg"
                                                                            v-model="agent_information.ho_name"></b-form-input>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-address"
                                                                        class="" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>Agent Address:</span>
                                                                                <span class="text-danger">*</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input style="width: 315px;" id="input-address" class="form-control-lg"
                                                                            v-model="agent_information.ho_address"></b-form-input>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-city"
                                                                        class="" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>City</span>
                                                                                <span class="text-danger">*</span>
                                                                            </div>
                                                                        </template>
                                                                        <div class="d-flex">
                                                                            <b-form-input style="width: 150px;" id="input-city" class="form-control-sm mr-4"
                                                                            v-model="agent_information.ho_city"></b-form-input>
                                                                            <b-form-input style="width: 150px;" id="input-pincode" class="form-control-sm"
                                                                                v-model="agent_information.ho_pincode"></b-form-input>
                                                                        </div>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-state"
                                                                        class="" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>State:</span>
                                                                                <!-- <span class="text-danger">*</span> -->
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input style="width:315px" id="input-state" class="form-control-sm"
                                                                            v-model="agent_information.ho_state"></b-form-input>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class=""
                                                                        style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>Country:</span>
                                                                                <span class="text-danger">*</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-select class="form-control"
                                                                            style="width: 315px"
                                                                            v-model="agent_information.ho_country"  :class="{ 'is-invalid': form.errors.has('ho_country') }">
                                                                            <option value="">Select a country</option>
                                                                            <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                                {{ country.text }}
                                                                            </option>
                                                                        </b-form-select>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class=""
                                                                        style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>&nbsp;</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-checkbox size="sm">Save Agents Head Office For Later Logins</b-form-checkbox>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-iata-agent-code"
                                                                        class="" style="margin-bottom: 4px !important;">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>IATA:</span>
                                                                                <!-- <span class="text-danger">*</span> -->
                                                                            </div>
                                                                        </template>
                                                                        <input type="text" id="input-iata-agent-code" class="form-control"
                                                                            style="width: 150px"
                                                                            v-model="agent_information.iata_agent_code" />
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-iata-agent-cass"
                                                                        class="">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>Cass</span>
                                                                            </div>
                                                                        </template>
                                                                        <input type="text" id="input-iata-agent-cass" class="form-control"
                                                                            style="width: 150px"
                                                                            v-model="agent_information.iata_agent_cass" />
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                        content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class="">
                                                                        <template #label>
                                                                            <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                <span>&nbsp;</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-checkbox size="sm">Save IATA and Cass Information For Later Logins</b-form-checkbox>
                                                                    </b-form-group>
                                                                </b-col>
                                                                <b-col cols="6" class="align-items-center">
                                                                    <div style="background-color: #F2F9FF;" class="mb-4">
                                                                        <h6 class="h-color" style="padding:5px 20px;font-size: 15px;font-weight:500">Override Issuing Agent:</h6>
                                                                    </div>
                                                                    <div class="mb-6">
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-agent-name"
                                                                            class="" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Agent Name:</span>
                                                                                    <!-- <span class="text-danger">*</span> -->
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input style="width: 315px;" id="input-agent-name" class="form-control-lg"
                                                                                v-model="agent_information.agent_name"></b-form-input>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-agent-address"
                                                                            class="" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Agent Address:</span>
                                                                                    <!-- <span class="text-danger">*</span> -->
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input style="width: 315px;" id="input-agent-address" class="form-control-lg"
                                                                                v-model="agent_information.agent_address"></b-form-input>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-agent-city"
                                                                            class="" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <!-- <span>City</span> -->
                                                                                    <!-- <span class="text-danger">*</span> -->
                                                                                </div>
                                                                            </template>
                                                                            <div class="d-flex">
                                                                                <b-form-input style="width: 150px;" id="input-agent-city" class="form-control-sm mr-4"
                                                                                v-model="agent_information.agent_city"></b-form-input>
                                                                                <b-form-input style="width: 150px;" id="input-agent-pincode" class="form-control-sm"
                                                                                    v-model="agent_information.agent_pincode"></b-form-input>
                                                                            </div>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-agent-issuing-signature" class=""
                                                                            style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Issuing Signature:</span>
                                                                                    <span class="text-danger">*</span>
                                                                                </div>
                                                                            </template>
                                                                            <input id="input-agent-issuing-signature" type="text" class="form-control"
                                                                                style="width: 315px"
                                                                                v-model="agent_information.agent_issue_sign" />
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="agent_issue_loc_code" class="">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Issuing Location:</span>
                                                                                    <span class="text-danger">*</span>
                                                                                </div>
                                                                            </template>
                                                                            <div class="custom-dropdown" ref="dropdownContainer_issue" @click="toggleDropdown_issuing_loc">
                                                                                <input type="text" v-model="agent_information.agent_issue_loc_code" placeholder="Search location" id="agent_issue_loc_code" class="form-control" 
                                                                                    style="width:315px;"
                                                                                    autocomplete="off" :class="{ 'is-invalid': form.errors.has('agent_issue_loc_code') }">
                                                                                <div v-if="isDropdownOpen_issuing_loc && filteredLocations_issuing.length" class="dropdown-options">
                                                                                    <div v-for="(item, index) in filteredLocations_issuing" 
                                                                                        :key="index" 
                                                                                        @click.stop="selectOption_issuing_loc(item)" 
                                                                                        class="option">
                                                                                        {{ item.iata_code }} ({{ item.destination }})
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class=""
                                                                            style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>&nbsp;</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-checkbox size="sm">Save information for later logins</b-form-checkbox>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-agent-issuing-date" class=""
                                                                            style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Issuing Date:</span>
                                                                                    <span class="text-danger">*</span>
                                                                                </div>
                                                                            </template>
                                                                            <div class="d-flex">
                                                                                <input id="input-agent-issuing-date" type="text" class="form-control mr-2"
                                                                                    style="width: 150px"
                                                                                    v-model="agent_information.agent_issue_date" />
                                                                                <date-picker valueType="format"
                                                                                    style=" width: 30px !important;" @change="handleDateChange($event, 'agent_information.agent_issue_date')"></date-picker>
                                                                            </div>
                                                                        </b-form-group>
                                                                    </div>
                                                                </b-col>
                                                            </b-row>
                                                        </div>
                                                    </div>
                                                </b-tab>
                                                <b-tab title="Also Notify">
                                                    <div class="ml-3 mt-8">
                                                        <h6 class="h-color" style="font-size: 15px;font-weight:500">Also Notify</h6>
                                                        <div class="py-7">
                                                            <b-row>
                                                                <b-col cols="auto">
                                                                    <div class="d-flex align-items-center">
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-notify"
                                                                            class="align-items-center" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                    <span>Name:</span>
                                                                                </div>
                                                                            </template>
                                                                            <div class="align-items-center custom-dropdown mr-4" ref="dropdownContainer_alsoNotify" @click="toggleDropdown_alsoNotify">
                                                                                <input style="width: 315px" type="text" v-model="form.also_notify_address.also_name" placeholder="Search name" id="also_notify" class="form-control" autocomplete="off"
                                                                                :class="{ 'is-invalid': form.errors.has('also_name') }"
                                                                                @input="filteralsoNotify" @focus="toggleDropdown_alsoNotify(true)" @blur="closeDropdown_alsoNotify" />

                                                                                <div v-if="isDropdownOpen_alsoNotify && filteredAlsoNotify.length" class="dropdown-options">
                                                                                    <div v-for="(also_notify, index) in filteredAlsoNotify" :key="also_notify.id" @click.stop="selectAlsoNotifyA(also_notify)" class="option">
                                                                                        {{ also_notify.name }}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <has-error :form="form" field="also_name"></has-error>
                                                                        </b-form-group>
                                                                        <b-form-checkbox size="sm">Letter Of Credit</b-form-checkbox>
                                                                    </div>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>&nbsp;</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input style="width: 315px" id="input-horizontal" class="form-control"
                                                                            v-model="form.also_notify_address.also_name"
                                                                            :class="{ 'is-invalid': form.errors.has('also_name') }"></b-form-input>
                                                                        <has-error :form="form" field="also_name"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>Address:</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input id="input-horizontal" class="form-control-sm"
                                                                            style="width: 315px" v-model="form.also_notify_address.also_address"
                                                                            :class="{ 'is-invalid': form.errors.has('also_address') }"></b-form-input>
                                                                        <has-error :form="form" field="also_address"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>&nbsp;</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input id="input-horizontal" class="form-control"
                                                                            style="width: 315px" v-model="form.also_notify_address.also_address_line_2"
                                                                            :class="{ 'is-invalid': form.errors.has('also_address_line_2') }"></b-form-input>
                                                                        <has-error :form="form" field="also_address_line_2"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>City:</span>
                                                                                <span class="text-danger">*</span>
                                                                            </div>
                                                                        </template>
                                                                        <div class="d-flex align-items-center">
                                                                            <b-form-input id="input-horizontal" class="form-control mr-5" style="width: 250px"
                                                                                v-model="form.also_notify_address.also_city"
                                                                                :class="{ 'is-invalid': form.errors.has('also_city') }"></b-form-input>
                                                                            <b-form-input id="input-horizontal" class="form-control"
                                                                                style="width: 50px" v-model="form.also_notify_address.also_airport_code"
                                                                                :class="{ 'is-invalid': form.errors.has('also_airport_code') }"></b-form-input>
                                                                        </div>
                                                                        <has-error :form="form" field="also_city"></has-error>
                                                                        <has-error :form="form" field="also_airport_code"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-also-post"
                                                                        class="align-items-center" style="margin-bottom: 4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>Post Code:</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input id="input-also-post" class="form-control" style="width: 315px"
                                                                            v-model="form.also_notify_address.also_post_code"
                                                                            :class="{ 'is-invalid': form.errors.has('also_post_code') }"></b-form-input>
                                                                        <has-error :form="form" field="also_post_code"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-also-state"
                                                                        class="align-items-center" style="margin-bottom: 4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>State:</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input id="input-horizontal" class="form-control" style="width: 315px"
                                                                            v-model="form.also_notify_address.also_state"
                                                                            :class="{ 'is-invalid': form.errors.has('also_state') }"></b-form-input>
                                                                        <has-error :form="form" field="also_state"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom: 4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>Country:</span>
                                                                                <span class="text-danger">*</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-select class="form-control" style="width: 315px"
                                                                            v-model="form.also_notify_address.also_country"
                                                                            :class="{ 'is-invalid': form.errors.has('also_country') }">
                                                                            <option value="">Please select one</option>
                                                                            <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                                {{ country.text }}
                                                                            </option>
                                                                        </b-form-select>
                                                                        <has-error :form="form" field="also_country"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom: 4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>Phone:</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input id="input-horizontal" class="form-control" style="width:315px;"
                                                                            v-model="form.also_notify_address.also_phone"
                                                                            :class="{ 'is-invalid': form.errors.has('also_phone') }"></b-form-input>
                                                                        <has-error :form="form" field="also_phone"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>Fax:</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input style="width:315px;" id="input-horizontal" class="form-control"
                                                                            v-model="form.also_notify_address.also_fax"
                                                                            :class="{ 'is-invalid': form.errors.has('also_fax') }"></b-form-input>
                                                                        <has-error :form="form" field="also_fax"></has-error>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center" style="margin-bottom:4px !important;">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>Telex:</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-input style="width:315px;" id="input-horizontal" class="form-control"
                                                                            v-model="form.also_notify_address.also_telex"></b-form-input>
                                                                    </b-form-group>
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                        content-cols-lg="auto" label-for="input-horizontal"
                                                                        class="align-items-center">
                                                                        <template #label>
                                                                            <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                <span>&nbsp;</span>
                                                                            </div>
                                                                        </template>
                                                                        <b-form-checkbox size="sm" class="" v-model="form.is_also_notify_address_save"> Save new address to address book</b-form-checkbox>
                                                                    </b-form-group>
                                                                </b-col>
                                                            </b-row>
                                                        </div>
                                                    </div>
                                                </b-tab>
                                                <b-tab title="Exta Print Information">
                                                        <div class="ml-3 mt-8">
                                                            <h6 class="h-color" style="font-size: 15px;font-weight:500">Extra information printed of Air Way Bill (Only printed - not saved or sent
                                                                to Airlines):</h6>
                                                            <div class="py-7">
                                                                <b-row>
                                                                    <b-col cols="auto">
                                                                        <b-form-textarea style="width:500px;height:80px !important;" class="" id="textarea" v-model="form.custom_origin.extra_print"></b-form-textarea>
                                                                    </b-col>
                                                                </b-row>
                                                            </div>
                                                        </div>
                                                    </b-tab>
                                            </b-tabs>
                                        </b-col>
                                    </b-row>
                                </div>


                                <hr class="hr" />
                                
                                <div class="py-7">
                                    <b-tabs class="custom-nav">
                                        <b-tab title="Payment Information">
                                            <div class="ml-3 mt-8">
                                                <b-row>
                                                    <b-col cols="6">
                                                        <div class="d-flex align-items-center" style="justify-content: space-between;">
                                                            <b-form-group id="fieldset-horizontal"
                                                                label-cols-lg="auto" content-cols-sm
                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                class="" style="margin-bottom: 4px !important;">
                                                                <template #label>
                                                                    <div class="d-flex text-align-center justify-content-end" style="width:105px;">
                                                                        <span>Type Of Payment:</span>
                                                                        <!-- <span class="text-danger">*</span> -->
                                                                    </div>
                                                                </template>
                                                                <b-form-select class="form-control"
                                                                    style="width: 210px;"
                                                                    v-model="form.payment_info.type_of_payment">
                                                                    <!-- <option disabled value="">Please select one</option> -->
                                                                    <option value="">Please select one</option>
                                                                    <option value="CA">CA - Partial collect credit - partial prepaid cash</option>
                                                                    <option value="CB">CB - Partial collect credit - partial prepaid credit</option>
                                                                    <option value="CC">CC - All charges collect</option> <!-- CC -->
                                                                    <option value="CG">CG - All Charges collect by GBL</option>
                                                                    <option value="CP">CP - Destination collect cash</option>
                                                                    <option value="CX">CX - Destination collect credit</option>
                                                                    <option value="NC">NC - Service rate. No charge</option>
                                                                    <option value="PC">PC - Partial prepaid cash - partial collect cash</option>
                                                                    <option value="PD">PD - Partial prepaid credit - partial collect cash</option>
                                                                    <option value="PG">PG - All charges prepaid by GBL</option>
                                                                    <option value="PP">PP - All charges prepaid cash</option><!-- PP -->
                                                                    <option value="PX">PX - All charges prepaid credit</option>
                                                                    <!-- <option value="C">All Charges Collect CC</option>
                                                                    <option value="P">All Charges Prepaid Cash PP</option> -->
                                                                </b-form-select>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal"
                                                                label-cols-lg="auto" content-cols-sm
                                                                content-cols-lg="auto" label-for="input-currency"
                                                                class="" style="margin-bottom: 4px !important;">
                                                                <template #label>
                                                                    <div class="d-flex text-align-center justify-content-end" style="width:105px;">
                                                                        <span>Currency:</span>
                                                                        <span class="text-danger">*</span>
                                                                    </div>
                                                                </template>
                                                                <b-form-input id="input-currency"
                                                                    class="form-control-sm" style="width: 60px;"
                                                                    v-model="form.payment_info.currency"
                                                                    :class="{ 'is-invalid': form.errors.has('currency') }"></b-form-input>
                                                                <has-error :form="form" field="currency"></has-error>
                                                            </b-form-group>
                                                        </div>

                                                        <label class="ml-3 mt-3 mb-2">Declared Values For:</label>

                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-carriage"
                                                            class="">
                                                            <template #label>
                                                                <div class="d-flex text-align-center justify-content-end" style="width:105px;">
                                                                    <span>Carriage:</span>
                                                                    <!-- <span class="text-danger">*</span> -->
                                                                </div>
                                                            </template>
                                                            <b-form-input id="input-carriage"
                                                                class="form-control"
                                                                style=" width: 210px;"
                                                                v-model="form.payment_info.declear_value_carriage"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-custom"
                                                            class="">
                                                            <template #label>
                                                                <div class="d-flex text-align-center justify-content-end" style="width:105px;">
                                                                    <span>Customs:</span>
                                                                    <!-- <span class="text-danger">*</span> -->
                                                                </div>
                                                            </template>
                                                            <b-form-input id="input-custom"
                                                                class="form-control"
                                                                style="width: 210px;"
                                                                v-model="form.payment_info.declear_value_customs"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-insurance"
                                                            class="">
                                                            <template #label>
                                                                <div class="d-flex text-align-center justify-content-end" style="width:105px;">
                                                                    <span>Insurance:</span>
                                                                    <!-- <span class="text-danger">*</span> -->
                                                                </div>
                                                            </template>
                                                            <b-form-input id="input-insurance"
                                                                class="form-control"
                                                                style="width: 210px;"
                                                                v-model="form.payment_info.declear_value_insurance"></b-form-input>
                                                        </b-form-group>
                                                    </b-col>
                                                    <b-col cols="6">
                                                        <div class="d-flex justify-content-end">
                                                            <table class="table table-sm">
                                                                <thead>
                                                                    <tr class="" style="background: #F2F9FF">
                                                                        <th style="color:#4C4C4C;font-weight:400;font-size:12px;padding: 5px;">Code</th>
                                                                        <th style="color:#4C4C4C;font-weight:400;font-size:12px;padding: 5px;">Prepaid</th>
                                                                        <th style="color:#4C4C4C;font-weight:400;font-size:12px;padding: 5px;width:100px;">Collect</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="editable-cell">Weight Charge (WT)</td>
                                                                        <!-- <td class="editable-cell">0.00 INR</td>
                                                                        <td class="editable-cell">{{ weightCharge.toFixed(2) }} INR</td> -->
                                                                        <!-- <td class="editable-cell">{{ isPrepaid ? weightCharge.toFixed(2) : '0.00' }} INR</td>
                                                                        <td class="editable-cell">{{ isPrepaid ? '0.00' : weightCharge.toFixed(2) }} INR</td> -->
                                                                        <td class="editable-cell">{{ totalCharges.prepaid }} INR</td>
                                                                        <td class="editable-cell">{{ totalCharges.collect }} INR</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="editable-cell">Taxes (TX)</td>
                                                                        <td class="editable-cell">{{ taxes.toFixed(2) }} INR</td>
                                                                        <td class="editable-cell">0.00 INR</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="editable-cell">Other Charges Due Agent (OA)</td>
                                                                        <td class="editable-cell">{{ totalDueAgentPrepaid }} INR
                                                                        </td>
                                                                        <td class="editable-cell">{{ totalDueAgentCollect }} INR
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="editable-cell">Other Charges Due Carrier (OC)
                                                                        </td>
                                                                        <td class="editable-cell">{{ totalDueCarrierPrepaid }} INR
                                                                        </td>
                                                                        <td class="editable-cell">{{ totalDueCarrierCollect }} INR
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="editable-cell">Total Charges</td>
                                                                        <td class="editable-cell">{{ totalChargesPrepaid }} INR</td>
                                                                        <td class="editable-cell">{{ totalChrage }} INR</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </b-col>
                                                </b-row>
                                            </div>
                                        </b-tab>
                                        <b-tab title="Other Charges">
                                            <div class="py-7">
                                                <b-row>
                                                    <b-col cols="12">
                                                        <table class="table table-sm" style="max-width:100%;">
                                                            <thead>
                                                                <tr class="" style="background-color: #F2F9FF;">
                                                                    <th class="mb-4" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 0px 0px 8px !important;">Code</th>
                                                                    <th class=""style="font-size:12px;line-height:22px;font-weight:400;padding:0px !important;">&nbsp;</th>
                                                                    <th class=""style="font-size:12px;line-height:22px;font-weight:400;padding:0px !important;">Amount In INR</th>
                                                                    <th class=""style="font-size:12px;line-height:22px;font-weight:400;padding:0px !important;">&nbsp;</th>
                                                                    <th class=""style="font-size:12px;line-height:22px;font-weight:400;padding:0px !important;">&nbsp;</th>
                                                                    <th class=""style="font-size:12px;line-height:22px;font-weight:400;padding:0px !important;">&nbsp;</th>
                                                                    <th class=""style="font-size:12px;line-height:22px;font-weight:400;padding:0px !important;">&nbsp;</th>
                                                                    <th class=""style="font-size:12px;line-height:22px;font-weight:400;padding:0px !important;">&nbsp;</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td class="pt-5 editable-cell align-items-center" style="width:300px;vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal" class="d-flex align-items-center">
                                                                            <b-form-select class="form-control" v-model="other_charges.other_charge_code" :class="{ 'is-invalid': form.errors.has('other_charge_code') }"> 
                                                                                <option value="">Select an Other Charge Code</option>
                                                                                <option v-for="charge in other_charges_code" :key="charge.value" :value="charge.value">
                                                                                    {{ charge.text }}
                                                                                </option>
                                                                            </b-form-select>
                                                                            <has-error :form="form" field="other_charge_code"></has-error>
                                                                        </b-form-group>
                                                                    </td>
                                                                    <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-or" class="align-items-center">
                                                                            <template #label>
                                                                                <div class="d-flex align-items-center">
                                                                                    <span>Or:</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input id="input-or" style="width:40px;" class="form-control" v-model="other_charges.other_code"></b-form-input>
                                                                        </b-form-group>
                                                                    </td>
                                                                    <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal" label-for="input-other-charge-amount"
                                                                            class="align-items-center">
                                                                            <b-form-input id="input-other-charge-amount" style="width:80px;" class="form-control"
                                                                                v-model="other_charges.amount"></b-form-input>
                                                                        </b-form-group>
                                                                    </td>
                                                                    <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal"
                                                                            class="align-items-center">
                                                                            <b-form-radio name="due" size="sm" v-model="other_charges.due" value="A">Due Agent</b-form-radio>
                                                                        </b-form-group>
                                                                    </td>
                                                                    <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal"
                                                                            class="align-items-center">
                                                                            <b-form-radio name="due" size="sm" v-model="other_charges.due"
                                                                                value="C">Due Carrier</b-form-radio>
                                                                        </b-form-group>
                                                                    </td>
                                                                    <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal"
                                                                            class="align-items-center">
                                                                            <b-form-radio name="payment_type" size="sm" v-model="other_charges.payment_type"
                                                                                value="P">Prepaid</b-form-radio>
                                                                        </b-form-group>
                                                                    </td>
                                                                    <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal"
                                                                            class="align-items-center">
                                                                            <b-form-radio name="payment_type" size="sm" v-model="other_charges.payment_type"
                                                                                value="C">Collect</b-form-radio>
                                                                        </b-form-group>
                                                                    </td>
                                                                    <td class="pt-5 editable-cell align-items-center" style="vertical-align: middle;">
                                                                        <b-form-group id="fieldset-horizontal"
                                                                            class="align-items-center">
                                                                            <b-button style="border: 1px solid #355594;border-radius: 30px;background: #ffffff !important;color: #355594;"
                                                                                class="form-control-sm px-5" @click="addCharge">
                                                                                {{ editIndex !== null ? 'Update' : 'Add' }}
                                                                            </b-button>
                                                                        </b-form-group>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </b-col>
                                                    <b-col cols="12">
                                                        <!-- Calculation Table always visible -->
                                                        <div class="d-flex align-items-start py-2">
                                                            <table class="table table-sm">
                                                                <thead>
                                                                    <tr style="background-color: #F2F9FF;">
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 0px 0px 8px;">Calculated Charges</th>
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px;"></th>
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px;"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="pt-5 editable-cell" style="vertical-align: middle;">Chargeable Weight</td>
                                                                        <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                            <input type="text" class="form-control" style="width: 100px"
                                                                                v-model="other_charges.chargable_weight1" />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="editable-cell" style="vertical-align: middle;">Charge</td>
                                                                        <td class="editable-cell">
                                                                            <input type="text" class="form-control" style="width: 100px"
                                                                                v-model="other_charges.charge" />
                                                                        </td>
                                                                        <td class="editable-cell mb-2" style="vertical-align: middle;">
                                                                            <b-button style="border: 1px solid #355594;border-radius: 30px;background: #ffffff !important;color: #355594;" class="form-control-sm px-5"
                                                                                @click="calculateCharge">Calculate</b-button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </b-col>
                                                    <b-col cols="12">
                                                        <div class="d-flex align-items-start py-8">
                                                            <table class="">
                                                                <thead>
                                                                    <tr style="background-color: #F2F9FF;">
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 8px;">Code</th>
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 8px;">Due</th>
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 8px;">Amount</th>
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 8px;">Type Of Payment</th>
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 8px;">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(charge, index) in form.charges" :key="index">
                                                                        <td class="editable-cell" style="padding:0px 8px;">
                                                                            {{ charge.other_charge_code || charge.other_code }}
                                                                        </td>
                                                                        <td class="editable-cell" style="padding:0px 8px;">
                                                                            {{ charge.due }}
                                                                        </td>
                                                                        <td class="editable-cell" style="padding:0px 8px;">
                                                                            {{ charge.amount }}.00
                                                                        </td>
                                                                        <td class="editable-cell" style="padding:0px 8px;">
                                                                            {{ charge.payment_type }}
                                                                        </td>
                                                                        <td class="editable-cell">
                                                                            <b-button size="sm" @click="editCharge(index)" style="background: none !important;border: 0px !important; border-radius: 0px !important; padding: 0px !important;">
                                                                                <b-icon icon="pencil" font-scale="1"></b-icon>
                                                                            </b-button>
                                                                            <b-button size="sm" @click="removeCharge(index)" style="background: none !important;border: 0px !important; border-radius: 0px !important; padding: 0px !important;">
                                                                                <b-icon icon="trash"></b-icon>
                                                                            </b-button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </b-col>
                                                </b-row>
                                            </div>
                                        </b-tab>
                                        <b-tab title="Special Handling Codes" style="background-color: white !important">
                                            <div class="py-7">
                                                <b-row>
                                                    <b-col cols="12">
                                                        <div class="d-flex align-items-center pt-2 ml-3">
                                                            <b-form-group id="fieldset-horizontal"
                                                                class="">
                                                                <b-form-select class="form-control" v-model="selectedCode"
                                                                    style="width:420px;"
                                                                    :class="{ 'is-invalid': form.errors.has('special_handling_code') }">
                                                                    <option disabled value="">Select Special Handling Codes</option>
                                                                    <option v-for="code in codes" :key="code.value"
                                                                        :value="code.value">{{ code.text }}</option>
                                                                </b-form-select>
                                                                <has-error :form="form" field="special_handling_code"></has-error>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                                label-for="input-shc-or"
                                                                class="ml-2">
                                                                <template #label>
                                                                    <div class="d-flex align-items-center">
                                                                        <span>Or</span>
                                                                    </div>
                                                                </template>
                                                                <b-form-input id="shc-or" style="width:60px;"
                                                                    class="form-control" v-model="custom_special_handling_code"></b-form-input>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal"
                                                                class="ml-6">
                                                                <b-button id="input-horizontal" class="form-control-sm"
                                                                    type="button" @click="addManualCode">Add</b-button>
                                                            </b-form-group>
                                                        </div>
                                                    </b-col>
                                                    <b-col cols="12">
                                                        <div class="ml-3 mt-4">
                                                            <table class="table" style="width:100%">
                                                                <thead>
                                                                    <tr style="background-color: #F2F9FF;">
                                                                        <th class="editable-cell" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 8px;">Code</th>
                                                                        <th class="" style="font-size:12px;line-height:22px;font-weight:400;padding:0px 8px;width:20px;"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(code, index) in form.tableCodes" :key="index">
                                                                        <td class="editable-cell">{{ code }}</td>
                                                                        <td class="editable-cell"><b-icon icon="trash" font-scale="1"
                                                                            @click="deleteSplCode(index)"></b-icon>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </b-col>
                                                </b-row>
                                            </div>
                                        </b-tab>
                                        <b-tab title="Other Customs Information">
                                            <b-row>
                                                <b-col cols="12">
                                                    <div class="ml-3 mt-2">
                                                        <!-- <h6 class="h-color" style="font-size: 15px;font-weight:500">Other Customs Information:</h6> -->
                                                        <div class="d-flex align-items-start py-5">
                                                            <table class="table table-sm" style="max-width: 100%">
                                                                <thead>
                                                                    <tr class="" style="background:#F2F9FF">
                                                                        <th style="padding:4px 12px;font-size:12px;font-weight:400;" class="form-control1">Country Code:</th>
                                                                        <th style="padding:4px 12px;font-size:12px;font-weight:400;" class="form-control1">Information Identifier:</th>
                                                                        <th style="padding:4px 12px;font-size:12px;font-weight:400;" class="form-control1">Customs Information Identifier</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="editable-cell py-4">
                                                                            <b-form-group id="fieldset-horizontal"
                                                                                class="form-control-sm col-form-label"
                                                                                style="width: 240px;">
                                                                                <b-form-select class="form-control-sm"
                                                                                    v-model="oci_info.country_code"
                                                                                    :class="{ 'is-invalid': form.errors.has('country_code') }">
                                                                                    <option value="">Select a country</option>
                                                                                    <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                                        {{ country.text }}
                                                                                    </option>
                                                                                </b-form-select>
                                                                                <has-error :form="form"
                                                                                    field="country_code"></has-error>
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
                                                                    <tr>
                                                                        <td class="editable-cell px-5">Supplementary Information:</td>
                                                                        <td class="editable-cell px-4">
                                                                            <input type="text" class="form-control"
                                                                                style="width: 300px;"
                                                                                v-model="oci_info.supplementary_info"
                                                                                :class="{ 'is-invalid': form.errors.has('supplementary_info') }" />
                                                                            <has-error :form="form" field="supplementary_info"></has-error>
                                                                        </td>
                                                                        <td class="editable-cell">
                                                                            <b-form-group style="display: flex;width: 240px;" id="fieldset-horizontal"
                                                                                class="form-control-sm col-form-label align-items-end justify-content-end">
                                                                                <b-button style="border-radius: 30px;color: #355594;background: #ffffff !important;border: 1px solid #355594;padding: 6px 30px;" class="form-control-sm px-5" @click="addOtherCustomInfo">
                                                                                    {{ editIndex !== null ? 'Update' : 'Add' }}
                                                                                </b-button>
                                                                            </b-form-group>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </b-col>
                                                <b-col cols="12">
                                                    <div class="ml-3 mt-4">
                                                        <h6 class="mb-4 h-color" style="font-size: 15px;font-weight:500">Upload Other Customs Information:</h6>
                                                        <b-form-textarea style="width: 1000px !important;height: 80px!important;" id="textarea"></b-form-textarea>
                                                    </div>
                                                </b-col>
                                                <b-col cols="12">
                                                    <div class="ml-3 mt-3 d-flex justify-content-end" style="max-width:1000px;">
                                                        <b-button class="" style="border-radius:30px;padding:6px 30px;color:#2637a8;background:#ffffff !important;border:1px solid #2637a8;">Upload</b-button>
                                                    </div>
                                                </b-col>
                                                <b-col cols="12">
                                                    <div class="ml-3 mt-6">
                                                        <table class="table table-sm" style="max-width:40%;">
                                                            <thead>
                                                                <tr>
                                                                    <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;padding:4px 12px;">Other Customs Information</th>
                                                                    <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;padding:4px 12px;"></th>
                                                                    <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;padding:4px 12px;"></th>
                                                                    <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;padding:4px 12px;"></th>
                                                                    <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;padding:4px 12px;"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(row, index) in form.oci_entries" :key="index">
                                                                    <td class="editable-cell">{{ row.country_code }}</td>
                                                                    <td class="editable-cell">{{ row.info_identifier }}</td>
                                                                    <td class="editable-cell">{{ row.custom_info_identifier }}</td>
                                                                    <td class="editable-cell">{{ row.supplementary_info }}</td>
                                                                    <td class="editable-cell" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                        <b-icon icon="pencil" font-scale="1" class="mr-2" style="cursor: pointer;" 
                                                                        @click="editOciInfo(index)"></b-icon>
                                                                        <b-icon icon="trash" font-scale="1"
                                                                            @click="deleteOciInfo(index)">
                                                                        </b-icon>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </b-tab>
                                    </b-tabs>
                                </div>
                                <hr class="hr" />
                                <div class="py-7">
                                    <b-row class="justify-content-end">
                                        <b-col cols="auto" class="text-right">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-pdf-copy-to" label="Email FNA 2:" class="form-control-sm col-form-label"> <b-form-input id="input-pdf-copy-to" class="form-control-sm" style="width: 300px"></b-form-input>
                                            </b-form-group>
                                            <div class="d-flex text-left ml-4 mt-4">
                                                <b-form-checkbox size="sm" class="">Including Cargo Label</b-form-checkbox>
                                                <p class="pl-18">(separate addresses with a semicolon ';')</p>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </div>
                                
                                <div class="pt-7 pb-28">
                                    <div v-if="showSpinner" class="spin" style="margin-top: 20px;"></div>
                                    <div class="d-flex justify-content-between">
                                        <div v-if="is_generate_pdf" class="mb-24" style="box-shadow: 0px 3px 15px 0px #0013;border-radius: 12px;width: 100%;">
                                            <div class="" style="display:flex;width:96%;margin-left: 2%;margin-right: 2%;">
                                                <div style="display:flex;justify-content: start;color:#355594;font-size:15px;line-height:71px;font-weight:500;width:100%">Cargo document created</div>
                                                <div style="display:flex;justify-content: end;line-height: 71px;align-self: center;width:100%" @click="isGeneratePdf(generateButton=0);"><img src="/media/custome/cross.png" alt="cross button" style="width:24px;height: 24px;cursor: pointer;"></div>
                                            </div>
                                            <div style="width:96%;margin-left: 2%;margin-right: 2%;">
                                                <div style="width:100%;">
                                                    <p style="color:#4C4C4C;font-size: 13px;line-height:13px;font-weight: 400;margin: 0;">Airway bill message saved in database</p>
                                                    <p style="color:#4C4C4C;font-size: 13px;line-height:18px;font-weight: 400;border-bottom: 1px solid #CDCDCD;padding-bottom: 15px;">PDF documents prepared</p>
                                                </div>
                                            </div>
                                            <div class="mb-16" style="width:96%;margin-left: 2%;margin-right: 2%;">
                                                <a href="#" style="width:fit-content;" class="custom-link mb-0" @click="() => handleSaveAndGeneratePDF('download-hawb-pdf')">
                                                    <p class="mb-0 ml-2">House Waybill Pdf file</p>
                                                </a>
                                                <a href="#" style="width:fit-content;" class="custom-link mb-0" @click="() => handleSaveAndGeneratePDF('download-multiple-hawb-pdf')">
                                                    <p class="mb-0 ml-2">Multipage House Waybill Pdf</p>
                                                </a>
                                                <a href="#" style="width:fit-content;" class="custom-link mb-0" @click="() => handleSaveAndGeneratePDF('download-multiple-both-page-hawb-pdf')">
                                                    <p class="mb-0 ml-2">Multipage House Waybill Pdf with back pages</p>
                                                </a>
                                            </div>
                                        </div>
                                        <div v-if="main_error_msg" class="text-danger text-right mb-3">
                                            <div v-html="main_error_msg"></div>
                                        </div>
                                    </div>
                                    <div v-if="successMessage" class="" style="font-weight: bold; display: flex; justify-content: flex-end; text-align: right;">
                                        <span>
                                            {{ successMessage.split('-Pass')[0] }}
                                            <span style="color: green;">-Pass</span>
                                        </span>
                                    </div>
                                    <div class="d-flex justify-content-end submit-button">
                                        <b-button class="mr-2" @click="isGeneratePdf(generateButton=1); form.status='generate_pdf';">Generate PDF</b-button>
                                        <div v-if="current_user.can_send">
                                            <b-button class="mr-2" type="submit" @click="form.status='send';">Send</b-button>
                                            <b-button class="mr-2" type="submit" @click="form.status='send';">Send & Clear</b-button>
                                        </div>
                                        <div v-if="form.first_box.status!='send'">
                                            <b-button type="submit" @click="form.status='draft';">{{submitButtonText}}</b-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-form>
                    </template>
                    
                </div>
            </div>
        </div>
    </div> 
</template> 
<script>
import Datepicker from "vuejs-datepicker";
import DatePicker from "vue2-datepicker";
import ApiService from "@/core/services/api.service";
import debounce from 'lodash.debounce';
import "vue2-datepicker/index.css";
import SideBar from "../layout/SideBar.vue";
import { mapGetters } from "vuex";
// import PageLoader from "../components/PageLoader.vue";
export default {
    data() {
        return {
            mode: 'add',
            form: new Form({
                first_box:{
                    hawb_no: '',
                    awb_code: '',
                    awb_no: '',
                },
                shipper_address: {
                    ship_name: '',
                    ship_name_2: '',
                    ship_account: '',
                    ship_address: '',
                    ship_address_line_2: '',
                    ship_city: '',
                    ship_post_code: '',
                    ship_state: '',
                    ship_country: '',
                    ship_phone: '',
                    ship_fax: '',
                    ship_telex: '',
                    ship_new_address: '',
                    ship_airport_code: null,
                },
                consignee_address: {
                    cons_name: '',
                    cons_name_2: '',
                    cons_account: '',
                    cons_address: '',
                    cons_address_line_2: '',
                    cons_city: '',
                    cons_airport_code: null,
                    cons_post_code: '',
                    cons_state: '',
                    cons_country: '',
                    cons_phone: '',
                    cons_fax: '',
                    cons_telex: '',
                    cons_new_address: '',
                },
                also_notify_address: {
                    also_name: '',
                    also_address: '',
                    also_address_line_2: '',
                    also_city: '',
                    also_airport_code: null,
                    also_post_code: '',
                    also_state: '',
                    also_country: '',
                    also_phone: '',
                    also_fax: '',
                    also_telex: '',
                    also_new_address: '',
                },
                routing_information:{
                    departure_airport: '',
                    destination_airport: '',
                    from: '',
                    to: '',
                    to_2: '',
                    to_3: '',
                    by: '',
                    by_2: '',
                    by_3: '',
                    flight: '',
                    flight_2: '',
                    flight_3: '',
                    master_origin:'',
                    master_destination: '',
                    date: this.getCurrentDate(),
                    date_2: this.getCurrentDate(),
                    date_3: this.getCurrentDate(),
                },

                entries: [],
                oci_entries: [],
                tableCodes: [],
                charges: [],
                totals:{
                    total_volume: null,
                    total_amount: 0,
                    master_pcs: null,
                    master_weight: null,
                    dimention_unit: "MTQ"
                },

                custom_origin:{
                    customs_origin_code: null,
                    other_service_information: '',
                    special_service_request: '',
                    accounting_information: '',
                    letter_credit: '',
                    shipment_ref_no: null,
                    supplementary_shipment_info: '',
                    supplementary_shipment_info_line_2: '',
                    extra_print: null,
                },

                carr_namr: '',
                carr_prefix: '',
                carr_address: '',
                carr_city: '',
                carr_post_code: '',
                carr_state: '',
                carr_country: '',

                payment_info:{
                    type_of_payment: '',
                    currency: 'INR',
                    declear_value_carriage: 'NVD',
                    declear_value_insurance: 'XXX',
                    declear_value_customs: 'NCV',
                    // other_charges_due_carrier: '',
                    // other_charges_due_agent: '',
                    taxes: null,
                    weight_charge: null,
                    total_charges_prepaid: null,
                    total_charges_collect: null,
                    total_charges: null,
                    other_charges_due_agent_prepaid: null,
                    other_charges_due_agent_collect: null,
                    other_charges_due_carrier_prepaid: null,
                    other_charges_due_carrier_collect: null
                },

                is_consignee_address_save: false,
                is_shipper_address_save: false,
                is_also_notify_address_save: false,
                status:'',
            }),
            oci_info:{
                country_code: '',
                info_identifier: '',
                custom_info_identifier: '',
                supplementary_info: '',
            },
            consignment_list: new Form({
                pieces: null,
                description: '',
                rate_class: '',
                uld_rate_class: '',
                service_code: '',
                commodity_item: '',
                country_origin_goods: '',
                slac: '',
                hs_code: '',

                gross_weight: '',
                weight_code: 'KGM', //kgs/lbs
                chargable_weight: '',
                other_charge: '',
                rate: '',
                pcs: '',
                wgt: '',
                length: '',
                width: '',
                height: '',
                unit: 'CMT',
                volume: '',
                // dimention_unit: 'MTQ', //cm3,m3,ft3

                uld_type: '',
                uld_serial: '',
                owner: '',

                itemss: [],
                hsCodes: [],
                uld_infos: [],
            }),
            agent_information:{
                agent_name: '',
                agent_address: '',
                agent_city: '',
                agent_pincode: '',
                agent_issue_sign: '',
                agent_issue_loc_code: '',
                agent_issue_date: '',
                agent_account: null,

                ho_name: '',
                ho_address: '',
                ho_city: '',
                ho_pincode: '',
                ho_state: '',
                ho_country: '',

                iata_agent_code: null,
                iata_agent_cass: null,
            },
            other_charges:{
                other_charge_code: '',
                other_code: '',
                amount: '',
                due: "C",
                payment_type: "P",
                charge: '',
                chargable_weight1: '',
            },
            defaultPaymentInfo: {
                declear_value_carriage: 'NVD',
                declear_value_customs: 'NCV',
                declear_value_insurance: 'XXX',
                currency: 'INR',
            },
            selectedViewPageOption: '/house-way-bill',
            searchQuery_to: '',
            isDropdownOpen_to: false,
            isDropdownOpen_departure: false,
            isDropdownOpen_destination: false,
            isDropdownOpen_to2: false,
            isDropdownOpen_to3: false,
            isDropdownOpen_from: false,
            isDropdownOpen_shipper: false,
            isDropdownOpen_consignee: false,
            isDropdownOpen_alsoNotify: false,
            isDropdownOpen_issuing_loc: false,
            isDropdownOpen_participant: false,
            generatePDFAfterSave: false,
            selectedCode: '',
            custom_special_handling_code: '',
            manualCode: '',
            validationErrors: [],
            hs_code_error: [],
            uld_error: [],
            newHsCode: '',
            isOpen: false,
            showShipper: false,
            showConsignee: false,
            showCalculationTable: false,
            editIndex: null,
            edit_entry_index: null,
            existingData: [],
            data_items:[],
            oci_data:{}, ///get-oci-data
            oci_identifiers:{},
            countries:[],
            other_charges_code: [],
            location:[],
            filteredShippers: [],
            filteredConsignees: [],
            filteredAlsoNotify: [],
            isConsignmentAdded: false,
            successMessage: '',
            awb_prefix_message: '',
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
                { value: 'RFG', text: 'RFG - Flammable Gas' },
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
            main_error_msg: "",
            is_generate_pdf:0,
            showSpinner: false,  // Initially, the progress bar is hidden
        };
    },

    methods: {
        //file upload code
        triggerFileInput() {
            this.$refs.fileInput.click()
        },
        handleFileSelect(event) {
            const upload_file = event.target.files[0]
            if (upload_file) {
                if (upload_file.type !== 'application/pdf') {
                    alert('Please select a PDF file only')
                    this.$refs.fileInput.value = ''
                    return
                }
                const formData = new FormData()
                formData.append('upload_file', upload_file)
                formData.append('type', 'ksr_house');
                ApiService.post('/user/upload-awb-file', formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
                }).then((response) => {
                    this.$bvModal.hide('upload-file-modal')
                    response=response.data?.data;
                    console.log(response);
                    this.form.first_box.hawb_no=response.awb_number;
                    //routing
                    var departure=response.departure;
                    var destination=response.destination;
                    var transit=response.transit?.[0];
                    var all_airport_short_code=[departure,destination,transit.transit_airports?.[0],transit.transit_airports?.[1],transit.transit_airports?.[2]];
                    ApiService.post(`/user/get-airport-by-airport-code`,{"airport_code":all_airport_short_code}).then((response2) => {
                      response2=response2.data?.data;
                      this.form.routing_information.departure_airport = `${response2[0]['iata_code']}, ${response2[0]['destination']}`;
                      this.form.routing_information.destination_airport = `${response2[1]['iata_code']}, ${response2[1]['destination']}`;
                      this.form.routing_information.from = `${response2[0]['iata_code']}, ${response2[0]['destination']}`;
                      this.form.routing_information.to = `${response2[2]?response2[2]['iata_code']:response2[1]['iata_code']}, ${response2[2]?response2[2]['destination']:response2[1]['destination']}`;
                      if(transit.transit_airports[1]){
                         this.form.routing_information.to_2 = `${response2[3]?response2[3]['iata_code']:response2[1]['iata_code']}, ${response2[3]?response2[3]['destination']:response2[1]['destination']}`;
                      }
                      if(transit.transit_airports[2]){
                          this.form.routing_information.to_3 = `${response2[1]['iata_code']}, ${response2[1]['destination']}`;
                      }
                    });
                    this.form.routing_information.by =transit.flights[0]?.flight_number?.slice(0,2);
                    this.form.routing_information.flight =transit.flights[0]?.flight_number?.slice(2);
                    this.form.routing_information.date = this.formatDate(transit.flights[0].date);
                    if(transit.flights[1]){
                        this.form.routing_information.by_2 =transit.flights[1]?.flight_number?.slice(0,2);
                        this.form.routing_information.flight_2 =transit.flights[1]?.flight_number?.slice(2);
                        this.form.routing_information.date_2 = this.formatDate(transit.flights[1].date);
                    }
                    if(transit.flights[2]){
                        this.form.routing_information.by_3 =transit.flights[2]?.flight_number?.slice(0,2);
                        this.form.routing_information.flight_3 =transit.flights[2]?.flight_number?.slice(2);
                        this.form.routing_information.date_3 = this.formatDate(transit.flights[2].date);
                    }
                    this.$refs.fileInput.value = ''
                    //end routing

                    //shipper
                    this.showShipper=true;
                    var shipper=response.shipper;
                    this.form.shipper_address.ship_name=shipper.name;
                    this.form.shipper_address.ship_address=shipper.address;
                    this.form.shipper_address.ship_city=shipper.city;
                    this.form.shipper_address.ship_post_code=shipper.pin;
                    this.form.shipper_address.ship_state=shipper.state;
                    if(shipper.country){
                        let shipper_country_code='';
                        for(let c=0;c<252;c++){
                            if(this.countries[c].text.toLowerCase()==shipper.country.toLowerCase()){
                                shipper_country_code=this.countries[c].value;
                                break;
                            }
                        }
                        this.form.shipper_address.ship_country=shipper_country_code;
                    }
                    this.form.shipper_address.ship_phone=shipper.phone;
                    this.form.shipper_address.ship_fax=shipper.email;
                    //end shipper
                    //consignee
                    this.showConsignee=true;
                    var consignee=response.consignee;
                    this.form.consignee_address.cons_name=consignee.name;
                    this.form.consignee_address.cons_name_2=consignee.eori;
                    this.form.consignee_address.cons_address=consignee.address;
                    this.form.consignee_address.cons_city=consignee.city;
                    this.form.consignee_address.cons_post_code=consignee.pin;
                    this.form.consignee_address.cons_state=consignee.state;
                    if(consignee.country){
                        let consignee_country_code='';
                        for(let c=0;c<252;c++){
                            if(this.countries[c].text.toLowerCase()==consignee.country.toLowerCase()){
                                consignee_country_code=this.countries[c].value;
                                break;
                            }
                        }
                        this.form.consignee_address.cons_country=consignee_country_code;
                    }
                    this.form.consignee_address.cons_phone=consignee.phone;
                    this.form.consignee_address.cons_fax=consignee.email;
                    if(consignee.eori){
                        this.oci_info.supplementary_info=consignee.eori;
                        this.oci_info.custom_info_identifier="CNE";
                    }
                    //end consignee
                    //Consignment Information
                    let cargo_data=response.cargo;
                    let piece_weight=response.piece_weight;
                    let weight_charge=response.weight_charge;
                    let rate_class = piece_weight.rate_class? (piece_weight.rate_class.length > 2? piece_weight.rate_class.slice(2): piece_weight.rate_class.slice(0)): null;
                    this.consignment_list.rate_class=piece_weight.rate_class?.slice(2);
                    this.consignment_list.pieces=piece_weight.no_of_pieces;
                    this.consignment_list.rate=piece_weight.rate;
                    this.consignment_list.hsCodes=cargo_data.hs_codes;
                    this.consignment_list.gross_weight=piece_weight.gross_weight;
                    this.consignment_list.chargable_weight=piece_weight.chargeable_weight;
                    this.consignment_list.description=cargo_data.description;
                    for(let i=0;i<cargo_data.dimensions.length;i++){
                        let dimensions_data=cargo_data.dimensions[i].dimension.split('X');
                        this.consignment_list.itemss.push({
                            pcs: cargo_data.dimensions[i].count,
                            wgt: '',
                            length: dimensions_data[0]??'',
                            width: dimensions_data[1]??'',
                            height: dimensions_data[2]??'',
                            unit: 'CMT'
                        });
                    }
                    this.$refs.modalConsignment.show();
                    //end Consignment Information

                    //remaining data
                    this.form.payment_info.type_of_payment=response.chrg_code;
                })
                .catch(error => {
                    this.$refs.fileInput.value = ''
                })
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return this.getCurrentDate();
            const [day, mon, year] = dateStr.split('-');
            const months = {
                JAN: '01', FEB: '02', MAR: '03', APR: '04',
                MAY: '05', JUN: '06', JUL: '07', AUG: '08',
                SEP: '09', OCT: '10', NOV: '11', DEC: '12'
            };
            return `${year}-${months[mon]}-${day.padStart(2, '0')}`;
        },
        //end of file upload code

        limitInput(event, fieldPath, maxLength) {
            const allowedChars = /^[a-zA-Z0-9 ,\-_]+$/;
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];

            if (allowedKeys.includes(event.key)) {
                return;
            }
            const fields = fieldPath.split(".");
            let input = this.form;
            
            for (let i = 0; i < fields.length; i++) {
                if (input[fields[i]] === undefined) {
                    return; // Stop if any level is undefined
                }
                if (i === fields.length - 1) {
                    input = input[fields[i]];
                } else {
                    input = input[fields[i]];
                }
            }
            if (typeof input !== "string") return;
            input = input.split('').filter(char => allowedChars.test(char)).join('');

            // Prevent typing beyond maxLength
            if (input.length >= maxLength) {
                event.preventDefault();
            }
            let obj = this.form;
            for (let i = 0; i < fields.length - 1; i++) {
                obj = obj[fields[i]];
            }
            obj[fields[fields.length - 1]] = input.substring(0, maxLength);
        },
        validateTextarea() {
            let text = this.form.custom_origin.other_service_information || '';
            let lines = text.split(/\r?\n/);

            if (text.length > 195) this.form.custom_origin.other_service_information = text.slice(0, 195);
            if (lines.length > 3) {
                alert("You can add a maximum of three lines.");
                this.form.custom_origin.other_service_information = lines.slice(0, 3).join("\n");
            }

            this.charCount = this.form.custom_origin.other_service_information.length;
            this.lineCount = this.form.custom_origin.other_service_information.split(/\r?\n/).length;
        },
        onSelect(value) {
            // Redirect to the selected page
            if (value) {
                window.location.href = value;  // This will navigate to the selected page
            }
        },
        isGeneratePdf(generateButton) {
            // alert("generateButton " + generateButton + "isGeneratePdf "+ this.is_generate_pdf);
            
            // Start the progress bar animation
            if(generateButton == 0 && this.is_generate_pdf == 1) {
                this.is_generate_pdf = 0;
            }
            
            if(generateButton == 1 && this.is_generate_pdf == 1) {
                this.showSpinner = true;
                this.is_generate_pdf = 0;
            }
            if(generateButton == 1 && this.is_generate_pdf == 0) {
                this.showSpinner = true;
            }
            setTimeout(() => {
                if(generateButton == 1 && this.is_generate_pdf == 1) {
                    this.showSpinner = false;
                    this.is_generate_pdf = 1;
                }
                if(generateButton == 1 && this.is_generate_pdf == 0) {
                    this.showSpinner = false;
                    this.is_generate_pdf = 1;
                }
            }, 2000);
        },
        // handleSaveAndGeneratePDF() {
        //     this.generatePDFAfterSave = true;
        //     const result = this.onSubmit() || Promise.resolve({});
        //     result.then(response => {
        //         console.log('Save response:', response);
        //         console.log('Response Data:', response.data);
        //         if (response.data && response.data.data && response.data.data.id) {
        //             this.generateHawbPDF();
        //         } else {
        //             console.error('ID is missing in the response data');
        //         }
        //     }).catch(error => {
        //         console.error('Error while saving data:', error);
        //     });
        // },
        handleSaveAndGeneratePDF(pdf_generate_type) {
            this.generatePDFAfterSave = pdf_generate_type;
            const result = this.onSubmit() || Promise.resolve({});
            result.then(response => {
                if (response.data && response.data.data && response.data.data.id) {
                    // this.generateAwbPDF(pdf_generate_type);
                } else {
                    console.error('ID is missing in the response data');
                }
            }).catch(error => {
                console.error('Error while saving data:', error);
            });
        },
        // generateHawbPDF() {
        //     if (!this.validateFormFields()) {
        //         return;
        //     }
        //     const itemId = this.$route.params.id; // Get the ID from the URL
        //     const pdfUrl = `/download-hawb-pdf/${itemId}`; // Construct the URL for the PDF
        //     window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
        // },
        generateHawbPDF() {
            if (!this.existingData || !this.existingData.id) {
                console.error('Existing data ID is missing. Cannot generate PDF.');
                return;
            }
            const pdfUrl = `/download-hawb-pdf/${this.existingData.id}`;
            window.open(pdfUrl, '_blank');
        },
        validateFormFields() {
            const requiredFields = {
                "HAWB Number is mandatory": this.form.first_box.hawb_no,
                "AWB prefix is mandatory": this.form.first_box.awb_code, // AWB prefix
                "AWB number is mandatory": this.form.first_box.awb_no, // AWB number
                "Shipper address is mandatory": this.form.shipper_address.ship_address, // Shipper address
                "Shipper city is mandatory": this.form.shipper_address.ship_address, // Shipper city
                "Consignee address is mandatory": this.form.consignee_address.cons_address, // Consignee address
                "Consignee city is mandatory": this.form.consignee_address.cons_city, // Consignee city
                "Routing by (carrier code) on row 1 is mandatory": this.form.routing_information.by // Routing by carrier code
            };
            const missingFields = Object.entries(requiredFields)
            .filter(([field, value]) => !value || (typeof value === 'string' && value.trim() === ''))
            .map(([field]) => field);
            if (missingFields.length > 0) {
                alert(`The following fields are mandatory:\n- ${missingFields.join("\n- ")}`);
                return false;
            }
            return true;
        },
        handleEditNavigation(id) {
            this.$bvModal.hide('modal-s');
            const targetPath = `/edit-houseway-bill/${id}`;
            if (this.$route.path !== targetPath) {
                this.$router.push(targetPath).then(() => {
                    window.location.reload();
                });
            } else {
                window.location.reload();
            }
        },
        mouseover: function () {
            this.isOpen = true;
        },
        mouseleave: function () {
            this.isOpen = false;
        },
        converXml(awb_no){
            ApiService.get(`/user/waybill/${awb_no}`)
                .then(({ data }) => {
                    // console.log(data);
                });
        },
        toggleModal() {
            this.$refs["my-modal"].toggle("#toggle-btn");
        },
        handleOk(bvModalEvent) {
            bvModalEvent.preventDefault();
        },
        handleAddConsignment() {
            if (this.isConsignmentAdded) {
                this.$bvToast.toast('Consignment Information is already added.', {
                title: 'Information',
                variant: 'warning',
                solid: true,
                });
            } else {
                this.$refs.modalConsignment.show();
                this.isConsignmentAdded = true;
            }
        },
        getCurrentDate() {
            // const today = new Date();
            // const day = today.getDate().toString().padStart(2, '0');
            // const month = today.toLocaleString('en-GB', { month: 'short' });
            // return `${day}${month}`;
            return new Date().toLocaleDateString("en-CA");
        },
        formatDate(date) {
            // if (!date) return '';
            // const day = new Date(date).getDate().toString().padStart(2, '0');
            // const month = new Date(date).toLocaleString('en-GB', { month: 'short' });
            // return `${day}${month}`;
            return new Date(date).toLocaleDateString("en-CA");
        },
        // handleDateChange(date) {
        //     this.form.routing_information.date = this.formatDate(date);
        // },
        handleDateChange(date, field) {
            const keys = field.split('.');
            let target = this;

            for (let i = 0; i < keys.length - 1; i++) {
                target = target[keys[i]];
            }
            
            // Store the actual date value for backend processing
            target[keys[keys.length - 1]] = date;
        },
        issueDateChange(date) {
            this.form.agent_issue_date = this.formatDate(date);
        },
        
        // Prepare form data for submission - convert display dates back to proper format
        prepareFormDataForSubmission() {
            const formData = { ...this.form };
            
            // Convert display dates back to proper format for backend
            if (formData.routing_information) {
                if (formData.routing_information.date && typeof formData.routing_information.date === 'string') {
                    // If it's a formatted string like "02Sept", convert it back to proper date
                    const date = new Date(formData.routing_information.date);
                    if (!isNaN(date.getTime())) {
                        formData.routing_information.date = date.toISOString().slice(0, 19).replace('T', ' ');
                    }
                }
                if (formData.routing_information.date_2 && typeof formData.routing_information.date_2 === 'string') {
                    if (formData.routing_information.date_2.length <= 10) {
                        const date = new Date(formData.routing_information.date_2);
                        if (!isNaN(date.getTime())) {
                            formData.routing_information.date_2 = date.toISOString().slice(0, 19).replace('T', ' ');
                        }
                    } else if (formData.routing_information.date_2 instanceof Date) {
                        formData.routing_information.date_2 = formData.routing_information.date_2.toISOString().slice(0, 19).replace('T', ' ');
                    }
                }
                if (formData.routing_information.date_3 && typeof formData.routing_information.date_3 === 'string') {
                    if (formData.routing_information.date_3.length <= 10) {
                        const date = new Date(formData.routing_information.date_3);
                        if (!isNaN(date.getTime())) {
                            formData.routing_information.date_3 = date.toISOString().slice(0, 19).replace('T', ' ');
                        }
                    } else if (formData.routing_information.date_3 instanceof Date) {
                        formData.routing_information.date_3 = formData.routing_information.date_3.toISOString().slice(0, 19).replace('T', ' ');
                    }
                }
            }
            
            return formData;
        },
        // onSubmit(evt) {
        //     evt.preventDefault();
        //     this.form.post(`/create-houseway-bill`).then(response => {
        //         console.log(response);
        //     })
        // },
        // onSubmit() {
        //     if (this.mode === 'add') {
        //         this.form.post('/create-houseway-bill')
        //         .then(response => {
        //             console.log('Add Successful:', response);
        //         })
        //         .catch(error => {
        //             console.error('Add Failed:', error);
        //         });
        //     } else if (this.mode === 'update') {
        //         this.form.put(`/update-houseway-bill/${this.existingData.id}`)
        //         .then(response => {
        //             console.log('Update Successful:', response);
        //             // this.$router.push({ path: '/house-way-bill' });
        //         })
        //         .catch(error => {
        //             console.error('Update Failed:', error);
        //         });
        //     }
        // },

        onSubmit() {
            $('.submit-button').css({'pointer-events':'none','opacity': '0.5'});
            this.main_error_msg='';
            
            // Prepare form data for submission - convert display dates to proper format
            // const preparedFormData = this.prepareFormDataForSubmission();
            
            if (this.mode === 'add') {
                // Create a new Form instance with prepared data
                const form = new Form({ ...this.form });
                form.post('/user/create-houseway-bill')
                .then(response => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
                        this.existingData = response.data.data.first_box.original.data;
                        if (this.generatePDFAfterSave && this.existingData && this.existingData.id) {
                            this.generateHawbPDF();
                        }
                        this.successMessage = '-e-HSWB Saved in database -Pass';
                    } else {
                        console.error('ID is missing in response data');
                    }
                })
                .catch(error => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    var main_error_msg='';
                    if (error.response) {
                        if (error.response.status === 422) {
                            const errors=error.response.data.errors
                            for (const field in errors) {
                                main_error_msg+=`${errors[field][0]}<br>`;
                            }
                        }
                    }
                    this.main_error_msg=main_error_msg;
                });
            } else if (this.mode === 'update') {
                if (!this.existingData || !this.existingData.id) {
                    console.error('Update Failed: existingData is missing or invalid');
                    return;
                }
                
                // Create a new Form instance with prepared data for update
                const form = new Form({ ...this.form });
                form.put(`/user/update-houseway-bill/${this.existingData.id}`)
                .then(response => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
                        this.existingData = response.data.data.first_box.original.data;
                        if (this.generatePDFAfterSave && this.existingData && this.existingData.id) {
                            this.generateHawbPDF();
                        }
                        this.successMessage = '-e-HSWB Saved in database -Pass';
                    } else {
                    }
                })
                .catch(error => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    var main_error_msg='';
                    if (error.response) {
                        if (error.response.status === 422) {
                            const errors=error.response.data.errors
                            for (const field in errors) {
                                main_error_msg+=`${errors[field][0]}<br>`;
                            }
                        }
                    }
                    this.main_error_msg=main_error_msg;
                    console.error('Update Failed:', error);
                });
            }
        },
        getHousewayBills(status) {
            ApiService.get(`/user/get-houseway-bills/${status}`)
                .then(response => {
                    this.data_items = response.data;
                })
                .catch(error => {
                    console.error("Failed to fetch items:", error);
                });
        },
        getHouseWayBill(id) { 
            ApiService.get(`/user/houseway-bill/${id}`)
                .then(response => {
                    this.existingData = response.data;
                    this.existingData.payment_info = {
                        ...this.defaultPaymentInfo,
                        ...(this.existingData.payment_info || {})
                    };
                    this.openForm('update', this.existingData.id);
                    if (this.existingData && this.existingData.consignment_data) {
                        this.isConsignmentAdded = true;
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        openForm(mode, id = null) {
            this.mode = mode;
            if (mode === 'update' && id) {
                    this.form.first_box = this.existingData;
                    this.form.first_box.hawb_no = this.existingData.id;
                    
                    // Format dates for display when editing
                    const routingInfo = { ...this.existingData };
                    if (routingInfo.date) {
                        routingInfo.date = this.formatDate(routingInfo.date);
                    }
                    if (routingInfo.date_2) {
                        routingInfo.date_2 = this.formatDate(routingInfo.date_2);
                    }
                    if (routingInfo.date_3) {
                        routingInfo.date_3 = this.formatDate(routingInfo.date_3);
                    }
                    
                    this.form.routing_information = routingInfo;
                    this.form.totals = this.existingData;
                    this.form.custom_origin = this.existingData;
                    this.form.tableCodes = JSON.parse(this.existingData.special_handling_info);
                    this.form.oci_entries = Array.isArray(this.existingData.other_custom_information) ? this.existingData.other_custom_information : [];
                    
                    // this.form.payment_info = this.existingData.payment_info || {};
                    this.form.payment_info = {
                        ...this.defaultPaymentInfo,
                        ...(this.existingData.payment_info || {})
                    };
                    this.form.charges = Array.isArray(this.existingData.other_charge)
                    ? this.existingData.other_charge
                    : [];
                    // this.form.entries = Array.isArray(this.existingData.consignment_data)
                    //     ? this.existingData.consignment_data
                    //     : [this.existingData.consignment_data];
                    // console.log("Entries in form:", this.form.entries);
                    
                    // this.consignment_list = this.existingData.consignment_data;
                    // this.form.entries = this.existingData.consignment_data;
                    // console.log("entries", this.form.entries);
                    const entry = this.existingData.consignment_data;
                    const parsedEntry = {
                        ...entry,
                        hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
                        itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
                        uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : [],
                    };
                    this.form.entries = [parsedEntry];
                    if(!this.form.entries){
                        this.isConsignmentAdded = true;
                    }
                    // console.log("hs code", parsedEntry);
                    this.form.consignee_address = this.existingData.way_bill_address;
                    this.form.shipper_address = this.existingData.way_bill_address;
                    this.form.also_notify_address = this.existingData.way_bill_address;
                } else {
                    // console.error('existingData is not an array:', this.existingData);
                    // console.log("Add mode activated");
                }
        },
        getCountry(){
            ApiService.get('/user/get-country').then(({ data }) => {
                this.countries = Object.keys(data).map(key => ({
                    value: key,
                    text: data[key]
                }));
            }).catch(error => {
                console.error("Error fetching countries:", error);
            });
        },
        getLocation() {
            ApiService.get(`/user/get-location`).then(({ data }) => {
                this.location=data;
            });
        },
        getOtherChargesCode(){
            ApiService.get('/user/other-charges').then(({ data }) => {
                this.other_charges_code = Object.keys(data).map(key => ({
                    value: key,
                    text: data[key]
                }));
            }).catch(error => {
                console.error("Error fetching countries:", error);
            });
        },
        getAgent(){
            ApiService.get(`/user/agent-info/`)
                .then(({ data }) => {
                if (Array.isArray(data) && data.length > 0) {
                    this.agent_information = data[0];
                } else {
                    this.agent_information = data;
                }
                })
                .catch(error => {
                    console.error("Error fetching agent information:", error);
                });
        },
        fetchShippers() {
            ApiService.get(`/user/get-shippers`).then(response => {
                this.shippers = response.data;
                this.filteredShippers = this.shippers.filter(shipper => shipper.address_type === 'shipper_address');
                // this.filteredShippers = this.shippers;
                // console.log('Shipper', response.data);
            });
        },
        fetchConsignee() {
            ApiService.get(`/user/get-shippers`).then(response => {
                this.consignees = response.data;
                this.filteredConsignees = this.consignees.filter(consignee => consignee.address_type === 'consignee_address');
                // this.filteredConsignees = this.consignees;
                // console.log('Shipper', response.data);
            });
        },
        fetchAlsoNotify() {
            ApiService.get(`/user/get-shippers`).then(response => {
                this.alsoNotify = response.data;
                // console.log("fgweuf", response.data);
                this.filteredAlsoNotify = this.alsoNotify.filter(also_notify => also_notify.address_type === 'also_notify_address');
                // this.filteredConsignees = this.consignees;
                // console.log('Shipper', response.data);
            });
        },
        fillShipperDetails() {
            if (this.selectedShipper) {
                ApiService.get(`/user/get-shipper-address?id=${this.selectedShipper}`)
                .then( response => {
                    this.form.shipper_address = response.data; 
                    // console.log('Shipper', response.data);
                })
                .catch(error => {
                    console.error('Error fetching shipper address:', error);
                });
            } else {
                this.form.shipper_address = {
                ship_name: '',
                ship_account: '',
                ship_address: '',
                ship_city: '',
                };
            }
        },
        fillConsigneeDetails() {
            if (this.selectedConsignee) {
                ApiService.get(`/user/get-consignee-address?id=${this.selectedConsignee}`)
                .then( response => {
                    this.form.consignee_address = response.data; 
                    // console.log('Consignee', response.data);
                })
                .catch(error => {
                    // console.error('Error fetching shipper address:', error);
                });
            } else {
                this.form.consignee_address = {
                cons_name: '',
                cons_account: '',
                cons_address: '',
                cons_city: '',
                };
            }
        },
        fillAlsoNotifyDetails() {
            if (this.selectAlsoNotify) {
                ApiService.get(`/user/get-alsonotify-address?id=${this.selectAlsoNotify}`)
                .then( response => {
                    this.form.also_notify_address = response.data; 
                    // console.log('Also Notify address', response.data);
                })
                .catch(error => {
                    // console.error('Error fetching Also notify address address:', error);
                });
            } else {
                this.form.also_notify_address = {
                also_name: '',
                also_account: '',
                also_address: '',
                also_city: '',
                };
            }
        },
        getOCIData(){
            ApiService.get('/user/get-oci-data').then(({ data }) => {
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
                    // console.log("Table codes:", this.form.tableCodes);
                } else {
                    alert('This code is already added.');
                }
            } else {
                alert('Please select or enter a code.');
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
        calculateCharge() {
            let chargeRate = parseFloat(this.other_charges.charge);
            let weight = parseFloat(this.other_charges.chargable_weight1);
            if (!isNaN(weight) && this.other_charges.charge > 0 && !isNaN(chargeRate) && chargeRate > 0) {
                let calculatedAmount = weight * chargeRate;
                this.other_charges.amount = calculatedAmount.toFixed(2);
            } else {
                alert('Please enter valid numeric values for chargeable weight and charge rate.');
            }
        },
        editCharge(index) {
            this.editIndex = index;
            this.other_charges = { ...this.form.charges[index] };
            // this.editIndex = null;
        },
        removeCharge(index) {
            this.form.charges.splice(index, 1);
        },
        editEntry(index) {
            // this.edit_entry_index = index;
            // this.consignment_list = { ...this.form.entries[index] };
            // this.$refs.modalConsignment.show();
            this.edit_entry_index = index;
            let consignment_data=this.form.entries[index];
            this.consignment_list.pieces = consignment_data.pieces;
            this.consignment_list.description = consignment_data.description;
            this.consignment_list.rate_class = consignment_data.rate_class;
            this.consignment_list.uld_rate_class = consignment_data.uld_rate_class;
            this.consignment_list.service_code = consignment_data.service_code;
            this.consignment_list.commodity_item = consignment_data.commodity_item;
            this.consignment_list.country_origin_goods = consignment_data.country_origin_goods;
            this.consignment_list.slac = consignment_data.slac;
            // this.consignment_list.hs_code = consignment_data.hs_code;
            this.consignment_list.gross_weight = consignment_data.gross_weight;
            this.consignment_list.weight_code = consignment_data.weight_code;
            this.consignment_list.chargable_weight = consignment_data.chargable_weight;
            this.consignment_list.rate = consignment_data.rate;
            // this.consignment_list.itemss = JSON.parse(consignment_data.pieces_info);
            // this.consignment_list.hsCodes = JSON.parse(consignment_data.hs_code);
            // this.consignment_list.uld_infos = JSON.parse(consignment_data.uld_info);
            this.consignment_list.itemss = consignment_data.pieces_info ? JSON.parse(consignment_data.pieces_info) : [];
            this.consignment_list.hsCodes = consignment_data.hs_code ? JSON.parse(consignment_data.hs_code) : [];
            this.consignment_list.uld_infos = consignment_data.uld_info ? JSON.parse(consignment_data.uld_info) : [];

            this.$refs.modalConsignment.show();
            this.isConsignmentAdded = true;
            this.calculateTotalAmount();
        },
        deleteEntry(index) {
            this.form.entries.splice(index, 1);
            this.calculateTotalVolume();
            this.calculateTotalAmount();
            if (this.form.entries.length === 0) {
                this.isConsignmentAdded = false;
            }
        },
        addOrUpdateEntry(evt) {
            evt.preventDefault();
            if (!(this.consignment_list instanceof Form)) {
                this.consignment_list = new Form(this.consignment_list);
            }
            this.consignment_list.post(`/user/get-house-consignment-error`)
            .then(response => {
                const updatedEntry = { 
                    ...this.consignment_list,
                    uld_info: JSON.stringify(this.consignment_list.uld_infos),
                    pieces_info: JSON.stringify(this.consignment_list.itemss),
                    hs_code: JSON.stringify(this.consignment_list.hsCodes)
                };
                if (this.edit_entry_index !== null) {
                    this.form.entries[this.edit_entry_index] = updatedEntry;
                    // this.form.entries[this.edit_entry_index] = { ...this.consignment_list };
                    // this.$set(this.form.entries, this.edit_entry_index, { ...this.consignment_list });
                    this.edit_entry_index = null;
                } else {
                    this.form.entries.push(updatedEntry);
                    // this.form.entries.push({ ...this.consignment_list });
                }
                this.calculateTotalVolume();
                this.calculateTotalAmount();
                this.isConsignmentAdded = this.form.entries.length > 0;
                this.closeModal();
                //clear consignment_list data
                for (let key in this.consignment_list) {
                    if(key !='busy' && key !='successful' && key !='errors' && key !='originalData'){
                        if (typeof this.consignment_list[key] === 'object') {
                            this.consignment_list[key] = [];
                        } else {
                            this.consignment_list[key] = '';
                        }
                    }
                }
                this.isConsignmentAdded = this.form.entries.length > 0;
            })
            .catch(error => {
                // console.error("There was an error with the consignment request:", error);
            });
        },
        // calculateTotalVolume() {
        //     let totalVolume = this.form.entries.reduce((total, entry) => {
        //         return total + entry.itemss.reduce((entryTotal, item) => {
        //             let volumePerPiece = (item.length * item.width * item.height) / 1e6;
        //             return entryTotal + (volumePerPiece * (parseFloat(item.pcs) || 0));
        //         }, 0);
        //     }, 0);
        //     return this.form.totals.total_volume = totalVolume;
        // },
       
        calculateTotalVolume() {
            let totalVolume = this.form.entries.reduce((total, entry) => {
                return total + entry.itemss.reduce((entryTotal, item) => {
                    // Parse dimensions and pcs
                    let length = parseFloat(item.length) || 0; // Length
                    let width = parseFloat(item.width) || 0;   // Width
                    let height = parseFloat(item.height) || 0; // Height
                    let pcs = parseFloat(item.pcs) || 0;        // Pieces
                    let dimensionUnit = item.unit;             // Get the dimension unit (CMT, INH, FOT)
                    let volumeInCMT = (length * width * height * pcs) / 1_000_000;
                    let volumeInCM3, volumeInFt3, volumeInIn3, volumeInM3;
                    if (dimensionUnit === 'CMT') {
                        volumeInCM3 = volumeInCM3;
                        volumeInCM3 = volumeInCMT * 1_000_000; // m³ to cm³
                        volumeInFt3 = volumeInCMT * 35.3147; // m³ to ft³
                        volumeInIn3 = volumeInCMT * 61_023.7441; // m³ to in³
                    } else if (dimensionUnit === 'INH') {
                        let volumeInInch = length * width * height * pcs; // in³
                        volumeInIn3 = volumeInInch; // Already in in³
                        volumeInCM3 = volumeInInch * 16.387; // in³ to cm³
                        volumeInFt3 = volumeInInch * 0.0005787037; // in³ to ft³
                        volumeInM3 = volumeInInch * 0.000016387064; // in³ to m³
                    } else if (dimensionUnit === 'FOT') {
                        let volumeInFoot = length * width * height * pcs; // in ft³
                        volumeInFt3 = volumeInFoot;
                        volumeInCM3 = volumeInFoot * 28_316.8466; // ft³ to cm³
                        volumeInM3 = volumeInFoot * 0.0283168466; // ft³ to m³
                        volumeInIn3 = volumeInFoot * 1_728; // ft³ to in³
                    }
                    // let selectedUnit = this.form.entries.dimention_unit; 
                    // let selectedUnit = this.consignment_list.dimention_unit; form.totals.
                    let selectedUnit = this.form.totals.dimention_unit;
                    let finalVolume = 0;

                    switch (selectedUnit) {
                        case 'CMQ': // cm³
                            finalVolume = volumeInCM3;
                            break;
                        case 'MTQ': // m³
                            finalVolume = volumeInM3 || (volumeInCMT); // Use volumeInCMT directly if in m³
                            break;
                        case 'FTQ': // ft³
                            finalVolume = volumeInFt3;
                            break;
                        case 'INQ': // in³
                            finalVolume = volumeInIn3;
                            break;
                        default:
                            finalVolume = volumeInCM3; // Default case
                    }
                    return entryTotal + finalVolume;
                }, 0);
            }, 0);

            // Set total volume in the form
            this.form.totals.total_volume = totalVolume.toFixed(2);
        },
        calculateTotalAmount() {
            // const chargeableWeight = this.form.entries.reduce((total, entry) => {
            //     let weight = parseFloat(entry.chargable_weight) || 0;
            //     return total + weight;
            // }, 0);

            const chargeableWeight = this.consignment_list.chargable_weight;
            
            const { rate_class } = this.consignment_list;
            let rates = 0;
            this.form.totals.total_amount = 0;
            if (rate_class === "B" || rate_class === "M") {
                this.form.totals.total_amount = parseFloat(this.consignment_list.rate) || 0;
                // this.form.totals.total_amount = this.consignment_list.rate || 0;
            } else if (rate_class === "P" || rate_class === "X") {
                this.form.totals.total_amount = 0;
            } else {
                // rates = parseFloat(this.form.entries.reduce((total, entry) => {
                //     return total + (parseFloat(entry.rate) || 0);
                // }, 0)) || 0;
                // this.form.totals.total_amount = chargeableWeight * rates;
                // console.log("test", this.form.totals.total_amount);
                this.form.totals.total_amount = chargeableWeight * this.consignment_list.rate;
            }
        },
        addHsCode() {
            this.hs_code_error = [];
            const hsCodeRegex = /^[a-zA-Z0-9]+$/;
            if (!this.consignment_list.hs_code) {
                this.hs_code_error.push("This field is empty.");
            } else if (!hsCodeRegex.test(this.consignment_list.hs_code)) {
                this.hs_code_error.push("HS Code can only contain letters,numbers");
            } else if (this.consignment_list.hs_code.length < 6 || this.consignment_list.hs_code.length > 18) {
                this.hs_code_error.push("HS Code must be between 6 to 18 characters/digits.");
            } else {
                this.consignment_list.hsCodes.push(this.consignment_list.hs_code);
                this.consignment_list.hs_code = "";
            }
        },
        removeHsCode(index) {
            this.consignment_list.hs_code = '';
            if (confirm('Are you sure you want to delete this HS Code?')) {
                this.consignment_list.hsCodes.splice(index, 1);
            }
        },
        displayModal() {
            this.$refs.modalConsignment.show();
        },
        closeModal() {
            this.$refs.modalConsignment.hide();
        },
        handleModalClose() {
            // if (this.form.entries.length === 0) {
            //     this.isConsignmentAdded = false;
            // }
            this.isConsignmentAdded = this.form.entries.length > 0;
        },
        addUldInfo() {
            this.uld_error = [];
            const { uld_type, uld_serial, owner } = this.consignment_list;
            const regex = {
                uldType: /^[a-zA-Z][A-Za-z0-9]{2}$/, // ULD Type
                uldSerial: /^[A-Za-z0-9]\d{3,4}$/,   // ULD Serial
                owner: /^[a-zA-Z0-9]{2}$/          // Owner
            };
            if (!uld_type) this.uld_error.push("ULD Type is required.");
            else if (!regex.uldType.test(uld_type)) this.uld_error.push("ULD Type must be 3 characters: 1 alphabetic and 2 alphanumeric.");

            if (!uld_serial) this.uld_error.push("ULD Serial is required.");
            else if (!regex.uldSerial.test(uld_serial)) this.uld_error.push("ULD Serial must be in the format 'mnnn(n)' where 'm' is an alpha character and 'n' is a digit.");

            if (!owner) this.uld_error.push("Owner is required.");
            else if (!regex.owner.test(owner)) this.uld_error.push("Owner must be exactly 2 characters long and can only contain letters and digits.");
            if (this.uld_error.length>0) {
                return;
            }
            // Push validated data to uld_info
            this.consignment_list.uld_infos.push({ uld_type, uld_serial, owner });
            this.consignment_list.uld_type = this.consignment_list.uld_serial = this.consignment_list.owner = "";
        },
        deleteUldInfo(index) {
            if (this.consignment_list.uld_infos && this.consignment_list.uld_infos.length > index) {
                this.consignment_list.uld_infos.splice(index, 1);
            }
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
        addCharge() {
            const { other_charge_code, other_code, amount, due, payment_type } = this.other_charges;
            const finalOtherChargeCode = other_code || other_charge_code;
            const finalOtherCode = other_code || null;
            if (!finalOtherChargeCode) {
                alert("Other charge code is mandatory.");
                return;
            }
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                alert("Amount is mandatory and must be a valid number greater than 0.");
                return;
            }
            // const amount = parseFloat(this.other_charges.amount);
            // if (isNaN(amount) || amount <= 0) {
            //     alert("Amount is mandatory and must be a valid number greater than 0.");
            //     return;
            // }

            const chargeData = {
                // other_charge_code: this.other_charges.other_charge_code,
                // other_code: this.other_charges.other_code,
                // amount: parseFloat(this.other_charges.amount) || 0,
                other_charge_code: finalOtherChargeCode, 
                amount: parsedAmount,
                due: this.other_charges.due,
                payment_type: this.other_charges.payment_type,
            };

            if (this.editIndex !== null) {
                this.$set(this.form.charges, this.editIndex, chargeData);
                this.editIndex = null;
            } else {
                this.form.charges.push(chargeData);
                // console.log('Added new charge:', chargeData);
            }
            for (let key in this.other_charges) {
                if (this.other_charges.hasOwnProperty(key) && key !== 'due' && key !== 'payment_type') {
                    this.other_charges[key] = '';
                }
            }
        },
        deleteOciInfo(index) {
            // this.oci_entries.splice(index, 1);
            if (this.form.oci_entries.length > index) {
                this.form.oci_entries.splice(index, 1);
            }
        },
        addPcsInfo() {
            this.validationErrors = [];
            const rules = {
                pcs: { type: 'numeric', message: "PCS must be a valid number." },
                wgt: { type: 'numeric', min: 0.1, max: 9999999, message: "Weight must be between 0.1 and 9999999." },
                length: { type: 'regex', regex: /^[0-9]+$/, maxLength: 5, message: "Length must be a numeric value with a maximum of 5 digits." },
                width: { type: 'regex', regex: /^[0-9]+$/, maxLength: 5, message: "Width must be a numeric value with a maximum of 5 digits." },
                height: { type: 'regex', regex: /^[0-9]+$/, maxLength: 5, message: "Height must be a numeric value with a maximum of 5 digits." },
            };
            let { pcs, wgt, length, width, height,unit } = this.consignment_list;
            if (this.remainingPieces <= 0) {
                this.validationErrors.push('All pieces are already added.');
                return;
            }
            if (pcs > this.remainingPieces) {
                this.validationErrors.push(`You only need ${this.remainingPieces} more pieces to complete the total.`);
                return;
            }
            if (!pcs) {
                this.validationErrors.push("When using dimensions or weight - pieces cannot be empty.");
            }
            // If any one dimension is added, all other dimensions are required
            if (length || width || height) {
                if (!length) {
                    this.validationErrors.push("Please add length to the dimension");
                }
                if (!width) {
                    this.validationErrors.push("Please add width to the dimension");
                }
                if (!height) {
                    this.validationErrors.push("Please add height to the dimension");
                }
            }
            if (!length && !width && !height && !wgt) {
                this.validationErrors.push("Only pieces filled in, please add also weight (WGT) and/or dimensions.");
            }
            // Validate individual fields based on their rules
            Object.keys(rules).forEach(field => {
                const rule = rules[field];
                const value = this.consignment_list[field];
                if (value) {
                    if (rule.type === 'numeric' && (isNaN(value) || value < rule.min || value > rule.max)) {
                        this.validationErrors.push(rule.message);
                    } else if (rule.type === 'regex' && (!rule.regex.test(value) || value.length > rule.maxLength)) {
                        this.validationErrors.push(rule.message);
                    }
                }
            });
            if (this.validationErrors.length > 0) {
                return;
            }
            this.consignment_list.itemss.push({
                pcs: pcs,
                wgt: wgt,
                length: length,
                width: width,
                height: height,
                unit: unit
            });
            // this.calculateTotalAmount();
            this.consignment_list.pcs = '';
            this.consignment_list.wgt = '';
            this.consignment_list.length = '';
            this.consignment_list.width = '';
            this.consignment_list.height = '';
            this.consignment_list.unit = 'CMT';
        },
        deletePcs(index) {
            if (this.consignment_list.itemss.length > index) {
                this.consignment_list.itemss.splice(index, 1);
            }
        },
        calculateTotalCharges() {
            this.form.totals.total_amount = this.calculateTotalAmount();
        },
        toggleDropdown_departure() {
            this.isDropdownOpen_departure = !this.isDropdownOpen_departure;
        },
       
        selectOption_departure(item) {
            this.form.routing_information.departure_airport = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.routing_information.departure_airport = final_set;
            this.isDropdownOpen_departure = false;
        },
        toggleDropdown_destination() {
            this.isDropdownOpen_destination = !this.isDropdownOpen_destination;
        },
        selectOption_destination(item) {
            this.form.routing_information.destination_airport = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.routing_information.destination_airport = final_set;
            this.isDropdownOpen_destination = false;
        },
        toggleDropdown_to() {
            this.isDropdownOpen_to = !this.isDropdownOpen_to;
        },
        selectOption_to(item) {
            this.form.routing_information.to = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.routing_information.to = final_set;
            this.isDropdownOpen_to = false;
        },
        toggleDropdown_to2() {
            this.isDropdownOpen_to2 = !this.isDropdownOpen_to2;
        },
        selectOption_to2(item) {
            this.form.routing_information.to_2 = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.routing_information.to_2 = final_set;
            this.isDropdownOpen_to2 = false;
        },
        toggleDropdown_to3() {
            this.isDropdownOpen_to3 = !this.isDropdownOpen_to3;
        },
        selectOption_to3(item) {
            this.form.routing_information.to_3 = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.routing_information.to_3 = final_set;
            this.isDropdownOpen_to3 = false;
        },
        toggleDropdown_from() {
            this.isDropdownOpen_from = !this.isDropdownOpen_from;
        },
        selectOption_from(item) {
            this.form.routing_information.from = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.form.routing_information.from = final_set;
            this.isDropdownOpen_from = false;
        },
        closeDropdown_to(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_to;
            if (!dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_to = false;
            }
        },
        closeDropdown_to2(event) {
            const dropdownContainer_to2 = this.$refs.dropdownContainer_to2;
            if (!dropdownContainer_to2.contains(event.target)) {
                this.isDropdownOpen_to2 = false;
            }
        },
        closeDropdown_to3(event) {
            const dropdownContainer_to3 = this.$refs.dropdownContainer_to3;
            if (!dropdownContainer_to3.contains(event.target)) {
                this.isDropdownOpen_to3 = false;
            }
        },
        closeDropdown_departure(event) {
            const dropdownContainer_de = this.$refs.dropdownContainer_departure;
            if (!dropdownContainer_de.contains(event.target)) {
                this.isDropdownOpen_departure = false;
            }
        },
        closeDropdown_destination(event) {
            const dropdownContainer_des = this.$refs.dropdownContainer_destination;
            if (!dropdownContainer_des.contains(event.target)) {
                this.isDropdownOpen_destination = false;
            }
        },
        closeDropdown_from(event) {
            const dropdownContainer_from = this.$refs.dropdownContainer_from;
            if (!dropdownContainer_from.contains(event.target)) {
                this.isDropdownOpen_from = false;
            }
        },
        selectShipper(shipper) {
            this.selectedShipper = shipper.id;
            this.form.shipper_address = shipper.name;
            // this.form.shipper_name = shipper.name;
            this.fillShipperDetails(shipper.id);
            this.isDropdownOpen_shipper = false;
        },
        toggleDropdown_shipper(event) {
             this.isDropdownOpen_shipper = event;
        },
        closeDropdown_shipper(event) {
            const dropdownContainer_shipper = this.$refs.dropdownContainer_shipper;
            if (!dropdownContainer_shipper.contains(event.target)) {
                this.isDropdownOpen_shipper = false;
            }
        },
        filterShippers() {
            // const query = this.form.shipper_name.toLowerCase();
            const query = this.form.shipper_address.ship_name.toLowerCase()
            if (!query) return this.shippers;
            return this.filteredShippers = this.shippers.filter(shipper =>
                shipper.name.toLowerCase().includes(query)
            );
        },
        selectConsignee(consignee) {
            this.selectedConsignee = consignee.id;
            this.form.consignee_address = consignee.name;
            this.fillConsigneeDetails(consignee.id);
            this.isDropdownOpen_consignee = false;
        },
        toggleDropdown_consignee(event) {
             this.isDropdownOpen_consignee = event;
        },
        closeDropdown_consignee(event) {
            const dropdownContainer_consignee = this.$refs.dropdownContainer_consignee;
            if (!dropdownContainer_consignee.contains(event.target)) {
                this.isDropdownOpen_consignee = false;
            }
        },
        filterConsignee() {
            const query = this.form.consignee_address.cons_name.toLowerCase()
            if (!query) return this.consignees;
            return this.filteredConsignees = this.consignees.filter(consignee =>
            consignee.name.toLowerCase().includes(query)
            );
        },

        selectAlsoNotifyA(also_notify) {
            this.selectAlsoNotify = also_notify.id;
            this.form.also_notify_address = also_notify.name;
            // this.form.shipper_name = shipper.name;
            this.fillAlsoNotifyDetails(also_notify.id);
            this.isDropdownOpen_alsoNotify = false;
        },
        toggleDropdown_alsoNotify(event) {
             this.isDropdownOpen_alsoNotify = event;
        },
        closeDropdown_alsoNotify(event) {
            const dropdownContainer_alsoNotify = this.$refs.dropdownContainer_alsoNotify;
            if (!dropdownContainer_alsoNotify.contains(event.target)) {
                this.isDropdownOpen_alsoNotify = false;
            }
        },
        filteralsoNotify() {
            const query = this.form.also_notify_address.also_name.toLowerCase()
            if (!query) return this.alsoNotify;
                return this.filteredAlsoNotify = this.alsoNotify.filter(notify =>
                also_notify.name.toLowerCase().includes(query)
            );
        },
        toggleDropdown_issuing_loc() {
            this.isDropdownOpen_issuing_loc = !this.isDropdownOpen_issuing_loc;
        },
        selectOption_issuing_loc(item) {
            this.agent_information.agent_issue_loc_code = item.iata_code;
            let source_name= item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            // this.searchQuery_to = final_set;
            this.agent_information.agent_issue_loc_code = final_set;
            this.isDropdownOpen_issuing_loc = false;
        },
        closeDropdown_issue_location(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_issue;
            if (!dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_issuing_loc = false;
            }
        },
        validateNumericInput(evt,field, maxLength) {
            evt = evt || window.event;
            const charCode = evt.which || evt.keyCode;
            if (charCode < 48 || charCode > 57) {
                evt.preventDefault();
            }
            if (this.form.first_box[field].length >= maxLength) {
                evt.preventDefault();
            }
        },
        onAWBInput: debounce(function () {
            const { awb_code } = this.form.first_box;
            const { awb_no } = this.form.first_box;
            if (awb_code && awb_code.length === 3) {
                ApiService.get(`/user/get-awbcode-prefix/${awb_code}`)
                    .then((response) => {
                        if (response.data) {
                            const { name, code} = response.data;
                            this.awb_prefix_message = `Message will be sent to ${name} (${code})`;
                        } else {
                            this.awb_prefix_message = `No agreement found for: ${awb_code} You will not be able to send the message to this carrier - only generate a PDF.`;
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching AWB details:", error);
                        this.awb_prefix_message = `No agreement found for: ${awb_code} You will not be able to send the message to this carrier - only generate a PDF.`;
                    });
                }
            else {
                this.awb_prefix_message = "";
            }
        }, 500),
    },
    mounted(){
        this.calculateTotalVolume();
        this.getCountry();
        window.addEventListener('click', this.closeDropdown_to);
        window.addEventListener('click', this.closeDropdown_to2);
        window.addEventListener('click', this.closeDropdown_to3);
        window.addEventListener('click', this.closeDropdown_from);
        window.addEventListener('click', this.closeDropdown_destination);
        window.addEventListener('click', this.closeDropdown_departure);
        window.addEventListener('click', this.closeDropdown_shipper);
        window.addEventListener('click', this.closeDropdown_consignee);
        window.addEventListener('click', this.closeDropdown_alsoNotify);
        window.addEventListener('click', this.closeDropdown_issue_location);
        this.getLocation(); 
        this.fetchShippers();
        this.fetchAlsoNotify();
        this.fillShipperDetails();
        this.fillConsigneeDetails();
        this.fillAlsoNotifyDetails();
        this.fetchConsignee();
        this.getOtherChargesCode();
        this.getOCIData();
        // const id = this.$route.params.id;
        // if (id) {
        // this.getHouseWayBill(id);
        // }
    },
    watch: {
        // 'consignment_list': function () {
        //     this.form.totals.total_amount = this.calculateTotalAmount();
        // },
        // 'consignment_list.dimention_unit': function() {
        //     this.calculateTotalVolume();
        // },
        'form.totals.dimention_unit': function() {
            this.calculateTotalVolume();
        },
        'form.charges': {
            handler(newVal) {
                this.totalChargesPrepaid;
                this.totalChargesCollect;
                this.weightCharge;
                this.taxes;
                this.totalCharges;
                this.totalDueAgentPrepaid;
                this.totalDueAgentCollect;
                this.totalDueCarrierPrepaid;
                this.totalDueCarrierCollect;
            },
            deep: true,
        },
        // 'form.payment_info.type_of_payment'(newVal) {
        //     this.calculateTotalCharges();
        // },
        totalChargesPrepaid(newVal) {
            this.form.payment_info.total_charges_prepaid = newVal;
        },
        totalChargesCollect(newVal) {
            this.form.payment_info.total_charges_collect = newVal;
        },
        weightCharge(newVal) {
            this.form.payment_info.weight_charge = newVal;
        },
        taxes(newVal) {
            this.form.payment_info.taxes = newVal;
        },
        totalCharges(newVal) {
            this.form.payment_info.total_charges = newVal;
        },
        totalDueAgentPrepaid(newVal) {
            this.form.payment_info.other_charges_due_agent_prepaid = newVal;
        },
        totalDueAgentCollect(newVal) {
            this.form.payment_info.other_charges_due_agent_collect = newVal;
        },
        totalDueCarrierPrepaid(newVal) {
            this.form.payment_info.other_charges_due_carrier_prepaid = newVal;
        },
        totalDueCarrierCollect(newVal) {
            this.form.payment_info.other_charges_due_carrier_collect = newVal;
        },
        // 'agent_information.participate': function(newValue) {
        //     console.log('Participate value changed to:', newValue);
        // },
        "form.shipper_address.ship_name"(newVal) {
            if (!newVal) {
                this.selectedShipper = null;
                this.form.shipper_address = {
                    ship_name: "",
                };
                this.filteredShippers = this.shippers;
            }
        },
        "form.consignee_address.cons_name"(newVal) {
            if (!newVal) {
                this.selectedConsignee = null;
                this.form.consignee_address = {
                    cons_name: "",
                };
                this.filteredConsignees = this.consignees;
            }
        },
        "form.also_notify_address.also_name"(newVal) {
            if (!newVal) {
                this.selectAlsoNotify = null;
                this.form.also_notify_address = {
                    also_name: "",
                };
                this.filteredAlsoNotify = this.alsoNotify;
            }
        },
        '$route.params.id'(newId) {
            if (newId) {
                this.getHouseWayBill(newId);
            }
        },
        existingData(newData) {
            // console.log("New data:", newData);
            if (newData && newData.id) {
                // this.generateAwbPDF();
            } else {
                // console.error('ID is missing in new data, cannot generate PDF.');
            }
        }
    },
    created() {
        const id = this.$route.params.id;
        if (id) {
            this.isEdit = true;
            this.getHouseWayBill(id);
        }
        this.getOCIData();
        this.onSubmit = this.onSubmit.bind(this);
        // console.log("Current User:", this.current_user);
        if(this.current_user)
        this.getAgent(this.current_user.company_name,this.current_user.branch_name);
        // this.getAgent();
    },
    computed: {
        ...mapGetters({ current_user: "currentUser"}),
        isPrepaid() {
            const prepaidTypes = ['PP'];
            return prepaidTypes.includes(this.form.payment_info.type_of_payment);
        },
        weightCharge() {
            return parseFloat(this.form.totals.total_amount || 0);
        },
        taxes() {
            return 0.00;
        },
        totalDueAgentPrepaid() {
            return this.form.charges
                .filter(charge => charge.due === 'A' && charge.payment_type === 'P')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalDueAgentCollect() {
            return this.form.charges
                .filter(charge => charge.due === 'A' && charge.payment_type === 'C')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalDueCarrierPrepaid() {
            return this.form.charges
                .filter(charge => charge.due === 'C' && charge.payment_type === 'P')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalDueCarrierCollect() {
            return this.form.charges
                .filter(charge => charge.due === 'C' && charge.payment_type === 'C')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalChargesPrepaid() {
            return (
                (this.isPrepaid ? this.weightCharge : 0) +
                parseFloat(this.totalDueAgentPrepaid) +
                parseFloat(this.totalDueCarrierPrepaid)
            ).toFixed(2);
        },
        totalChargesCollect() {
            return (
                (this.isPrepaid ? 0 : this.weightCharge) +
                parseFloat(this.totalDueAgentCollect) +
                parseFloat(this.totalDueCarrierCollect)
            ).toFixed(2);
        },
        totalChrage() {
            return (
                this.weightCharge +
                parseFloat(this.totalDueAgentCollect) +
                parseFloat(this.totalDueCarrierCollect)
            ).toFixed(2);
        },
        totalCharges() {
            return {
                prepaid: this.isPrepaid ? this.weightCharge.toFixed(2) : '0.00',
                collect: this.isPrepaid ? '0.00' : this.weightCharge.toFixed(2),
            };
        },
        calculatedCharge() {
            // return this.form.totals.total_amount.toFixed(2);
            return this.form.totals.total_amount;
        },
        submitButtonText() {
            return this.mode === 'add' ? 'Add Draft' : 'Update Draft';
        },
        filteredLocations_to() {
            const query = this.form.routing_information.to.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query)
            );
        },
        filteredLocations_to2() {
            const query = this.form.routing_information.to_2.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query)
            );
        },
        filteredLocations_to3() {
            const query = this.form.routing_information.to_3.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query)
            );
        },
        filteredLocations_from() {
            const query = this.form.routing_information.from.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query)
            );
        },
        filteredLocations_destination() {
            const query = this.form.routing_information.destination_airport.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query)
            );
        },
        filteredLocations_departure() {
            const query = this.form.routing_information.departure_airport.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query)
            );
        },
        filteredLocations_issuing() {
            const query = this.agent_information.agent_issue_loc_code.toLowerCase().trim();
            if (!query) return this.location;
            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query)
            );
        },
        remainingPieces() {
            const totalAddedPieces = this.consignment_list.itemss.reduce((sum, item) => sum + parseInt(item.pcs || 0), 0);
            return this.consignment_list.pieces - totalAddedPieces;
        }
    },

    components: {
        Datepicker,
        DatePicker,
        SideBar,
        // PageLoader
    },
};
</script>

<style scoped>
/* file upload css */
.upload-container {
    max-width: 400px;
    margin: 0 auto;
}

.upload-box {
    border: 2px dashed #d0d5dd;
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
    background-color: #ffffff;
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-box:hover {
    border-color: #4a5568;
    background-color: #f8f9fa;
}

.upload-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-icon svg {
    width: 32px;
    height: 32px;
    color: #4a6fa5;
}

.upload-text {
    color: #4a6fa5;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
}

.upload-divider {
    color: #6b7280;
    font-size: 14px;
    margin: 12px 0;
}

.upload-link {
    color: #4a6fa5;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
}

.upload-link:hover {
    color: #3b5a8a;
}

#fileInput {
    display: none;
}
/* end of file upload css */
.body-color {
}
h6 {
    font-size: 15px !important;
    line-height: 22px;
    font-weight: 600 !important;
    color: #355594 !important;
}
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

.custom-btn:hover {
    background-color: #007bff !important;
    color: white !important;
}

.form-group {
    margin-bottom: 10px !important;
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
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="black" d="M7 10l5 5 5-5z"/></svg>') no-repeat right 0px center;
    background-color: white;
    border: 1px solid #ccc;
    font-size: 14px;
    padding: 2px 26px 2px 8px;
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
    border: 1px solid #A6A6A6 !important;
    border-radius: 7px !important;
    height: 38px;
}

.form-control1 {
    border: 2px solid gray;
    width: 150px;
    height: 25px;
}

.custom-link {
    display: block; 
    margin-bottom: 0.5rem;
    color: #4C4C4C;
    text-decoration: underline;
}

.custom-link:hover {
    color: #355594;
    text-decoration: underline #355594 !important;
    text-decoration-color: #355594;
}
.custom-link-custom {
    display: block;
    margin-bottom: 0.5rem;
    color:#355594;
    text-decoration: none;
}
.custom-link-custom:hover {
    /* color: #2637a8; */
    text-decoration: underline #355594 !important;
    text-decoration-color: #355594;
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
    position: absolute;
    border: 1px solid #E4E6EF;
    border-radius: 5px; 
    box-shadow: 0px 3px 15px 0px #00000013;
    background-color: #fff;
    border-top: none;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 9;
    width: 100%;
}

.option {
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 0px !important;
    padding: 0px 4px !important;
    border: 0px !important;
}

.option:hover {
  background-color: #f0f0f0;
}
.btn {
    color: #355594 !important;
    border-radius: 30px;
    border: 1px solid #355594 !important;
    padding: 6px 30px !important;
    background: #fff !important;
}

</style>
<style>
    .modal-content {
        border-radius: 20px !important;
        padding: 0rem 2rem 2rem !important;
    }
    .modal-header {
        padding: 1rem 0rem !important;
        border-bottom:0px !important;
    }
    .modal .modal-header .modal-title {
        color: #355594 !important;
    }
    .modal-header > .close {
        font-size: 2rem !important;
    }
    .modal .modal-header .close:hover {
        color: #355594 !important;
    }
    .custom-nav .nav-tabs {
        border-bottom: 0px !important;
    }
    .custom-nav .nav-link {
        color: #355594 !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        border: none !important;
        padding: 0px !important;
        margin: 0px 10px !important;
    }
    .custom-nav .nav-link:hover,
    .custom-nav .nav-link.active {
        border-bottom: 2px solid #355594 !important;
    }
    .mx-input {
        display: inline-block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        /* height: 34px; */
        padding: 0px !important;
        color:  #355594 !important;
        border: 0px !important;
        -webkit-box-shadow: inset 0 1px 1px #fff;
        box-shadow: inset 0 1px 1px #fff;
    }
    .mx-icon-calendar, .mx-icon-clear {
        position: absolute;
        top: 50%;
        right: 0px !important;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        font-size: 20px;
        line-height: 1;
        color: #355594 !important;
        stroke: #355594 !important;
        vertical-align: middle;
    }
    /* Spinner Styles */
    .spin {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #355594;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>