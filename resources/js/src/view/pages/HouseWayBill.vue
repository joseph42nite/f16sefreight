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
                <b-button id="toggle-btn" class="mx-2 custom-btn" v-b-modal.modal-prevent-closing>Search</b-button>
                <b-button id="show-btn" v-b-modal.modal-s class="mx-2 custom-btn">10 Latest</b-button>
                <b-button id="toggle-btn" v-b-modal.modal-templates class="mx-2 custom-btn">Templates</b-button>
                <b-button id="show-btn" v-b-modal.modal-draft class="mx-2 custom-btn">Draft</b-button>
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
                        <!-- <b-form-group label-for="name-input" label="Created By:" v-slot="{ ariaDescribedby }">
                            <b-form-radio-group id="radio-slots" :options="options" :aria-describedby="ariaDescribedby"
                                name="radio-options-slots"></b-form-radio-group>
                        </b-form-group>
                        <hr class="hr" /> -->
                        <b-row>
                            <b-col>
                                <div v-for="item in data_items" :key="item.id" style="border-bottom: 1px solid #bcbcbc;">
                                    <a href="#" class="custom-link mb-3" @click="getHouseWayBill(item.id)">
                                        <router-link v-slot="{ navigate, href }" :to="'/edit-houseway-bill/' + item.id" custom>
                                            <p @click="navigate" class="mb-0">
                                                {{ item.id }} 
                                                ({{ item.departure_airport.split(',')[0] }}-{{ item.destination_airport.split(',')[0] }})
                                            </p>
                                       </router-link>
                                    </a>
                                    <a href="#" class="custom-link mb-0" @click="getHouseWayBill(item.id)">
                                        <router-link v-slot="{ navigate, href }" :to="'/edit-houseway-bill/' + item.id" custom>
                                            <p @click="navigate" class="mb-0 ml-2">Edit House Waybill Data </p>
                                        </router-link>
                                    </a>
                                    <a href="#" class="custom-link mb-0" @click="getHouseWayBill(item.id)">
                                        <router-link v-slot="{ navigate, href }" :to="'/edit-houseway-bill/' + item.id" custom>
                                            <p @click="navigate" class="mb-0 ml-2">Create e-AWB from House Waybill Data </p>
                                        </router-link>
                                    </a>
                                    <a href="#" class="custom-link mb-0" @click="getHouseWayBill(item.id)">
                                        <router-link v-slot="{ navigate, href }" :to="'/edit-houseway-bill/' + item.id" custom>
                                                <p class="mb-0 ml-2"><a :href="'/download-hawb-pdf/' + item.id" target="_blank" class="custom-link">House Waybill Pdf file</a></p>
                                        </router-link>
                                    </a>
                                    <a href="#" class="custom-link mb-0" @click="getHouseWayBill(item.id)">
                                        <router-link v-slot="{ navigate, href }" :to="'/edit-houseway-bill/' + item.id" custom>
                                                <p class="mb-0 ml-2"><a :href="'/download-multiple-hawb-pdf/' + item.id" target="_blank" class="custom-link">Multipage House Waybill Pdf</a></p>
                                        </router-link>
                                    </a>
                                    <a href="#" class="custom-link mb-0" @click="getHouseWayBill(item.id)">
                                        <router-link v-slot="{ navigate, href }" :to="'/edit-houseway-bill/' + item.id" custom>
                                                <p class="mb-0 ml-2"><a :href="'/download-multiple-both-page-hawb-pdf/' + item.id" target="_blank" class="custom-link">Multipage House Waybill Pdf with back pages</a></p>
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
            <div class="container h_background_color text-white pt-2 pb-2">
                <h4>Create Electronic House Waybill (FHL)
                    <span class="float-right">New</span>
                </h4>
            </div>
            <template>
                <b-form @submit.prevent="onSubmit">
                    <div class="container">
                        <b-row class="mt-5">
                            <b-col cols="auto">
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label="HAWB No:*" label-for="input-horizontal" class="form-control-sm col-form-label">
                                    <b-form-input id="input-horizontal" class="form-control-sm" v-model="form.first_box.hawb_no" :class="{ 'is-invalid': form.errors.has('hawb_no') }"></b-form-input>
                                    <has-error :form="form" field="hawb_no"></has-error>
                                </b-form-group>
                            </b-col>
                            <b-col cols="auto">
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label="Master No:*" label-for="input-horizontal" class="form-control-sm col-form-label">
                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 50px" v-model="form.first_box.awb_code" :class="{ 'is-invalid': form.errors.has('awb_code') }" v-on:keypress="validateNumericInput($event, 'awb_code', 3)"></b-form-input>
                                    <has-error :form="form" field="awb_code"></has-error>
                                </b-form-group>
                            </b-col>
                            -
                            <b-col cols="auto">
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class="form-control-sm col-form-label">
                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 90px" v-model="form.first_box.awb_no" :class="{ 'is-invalid': form.errors.has('awb_no') }" v-on:keypress="validateNumericInput($event, 'awb_no', 8)"></b-form-input>
                                    <has-error :form="form" field="awb_no"></has-error>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="auto">
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label="Agent Account: " label-for="input-horizontal" class="form-control-sm col-form-label">
                                    <b-form-input id="input-horizontal" class="form-control-sm"  v-model="form.first_box.agent_account" :class="{ 'is-invalid': form.errors.has('agent_account') }"></b-form-input>
                                    <has-error :form="form" field="agent_account"></has-error>
                                </b-form-group>
                            </b-col>
                            <b-col class="ml-auto" cols="auto">
                                <b-form-group label-for="name-input">
                                    <b-form-radio name="radio-size" size="sm">e-CSD Status</b-form-radio>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <hr class="hr" />

                        <b-row class="justify-content-center mt-5">
                            <b-col>
                                <b-col cols="auto">
                                    <h4 class="h-color font-weight-bolder ml-2">
                                        Shipper
                                    </h4>
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label="Name:*" label-for="input-horizontal"
                                        class="form-control-sm col-form-label">
                                        <div class="d-flex align-items-center">
                                            <!-- <div class="flex-grow-1">
                                                <select class="custom-select form-control-sm" style="width: 320px">
                                                    <option disabled value=""> Select a Shipper</option>
                                                    <option value="ABS">A</option>
                                                    <option value="BDE">B</option>
                                                    <option value="RTY">C</option>  
                                                </select>
                                            </div> -->
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-shipper" class="form-control-sm col-form-label">
                                                <div class="custom-dropdown" ref="dropdownContainer_shipper" @click="toggleDropdown_shipper">
                                                    <input type="text" v-model="form.shipper_address.ship_name" placeholder="Search shipper" id="shipper" class="form-control" autocomplete="off"
                                                    :class="{ 'is-invalid': form.errors.has('ship_name') }"
                                                    @input="filterShippers" @focus="toggleDropdown_shipper(true)" @blur="closeDropdown_shipper" />

                                                    <div v-if="isDropdownOpen_shipper && filteredShippers.length" class="dropdown-options">
                                                        <div v-for="(shipper, index) in filteredShippers" :key="shipper.id" @click.stop="selectShipper(shipper)" class="option">
                                                            {{ shipper.name }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <has-error :form="form" field="ship_name"></has-error>
                                            </b-form-group>
                                            <b-icon icon="arrows-expand" aria-hidden="true" class="ml-2"
                                                @click="showShipper = !showShipper"></b-icon>
                                        </div>
                                    </b-form-group>
                                    <b-col v-if="showShipper">
                                        <div class="d-flex align-items-center mt-5">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label mr-3" label="">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-30"
                                                    v-model="form.shipper_address.ship_name"
                                                    :class="{ 'is-invalid': form.errors.has('ship_name') }"></b-form-input>
                                                <has-error :form="form" field="ship_name"></has-error>
                                            </b-form-group>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal" label="Account:"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-15"
                                                v-model="form.shipper_address.ship_account"
                                                :class="{ 'is-invalid': form.errors.has('ship_account') }"></b-form-input>
                                            <has-error :form="form" field="ship_account"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Address *:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-15"
                                                style="width: 220px" v-model="form.shipper_address.ship_address"
                                                :class="{ 'is-invalid': form.errors.has('ship_address') }"></b-form-input>
                                            <has-error :form="form" field="ship_address"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-31"
                                                style="width: 220px" v-model="form.shipper_address.ship_address_line_2"
                                                :class="{ 'is-invalid': form.errors.has('ship_address_line_2') }"></b-form-input>
                                            <has-error :form="form" field="ship_address_line_2"></has-error>
                                        </b-form-group>
                                        <div class="d-flex align-items-center mt-1">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label" label="City *:">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-22"
                                                    v-model="form.shipper_address.ship_city"
                                                    :class="{ 'is-invalid': form.errors.has('ship_city') }"></b-form-input>
                                                <has-error :form="form" field="ship_city"></has-error>
                                            </b-form-group>
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                style="width: 50px" v-model="form.shipper_address.ship_airport_code"
                                                :class="{ 'is-invalid': form.errors.has('ship_airport_code') }"></b-form-input>
                                            <has-error :form="form" field="ship_airport_code"></has-error>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Post Code:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-11"
                                                v-model="form.shipper_address.ship_post_code"
                                                :class="{ 'is-invalid': form.errors.has('ship_post_code') }"></b-form-input>
                                            <has-error :form="form" field="ship_post_code"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="State:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-20"
                                                v-model="form.shipper_address.ship_state"
                                                :class="{ 'is-invalid': form.errors.has('ship_state') }"></b-form-input>
                                            <has-error :form="form" field="ship_state"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-s
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3 mb-3" label="Country *:">
                                            <b-form-select class="form-control-sm ml-lg-15" style="width: 220px"
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
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Phone:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-17"
                                                v-model="form.shipper_address.ship_phone"
                                                :class="{ 'is-invalid': form.errors.has('ship_phone') }"></b-form-input>
                                            <has-error :form="form" field="ship_phone"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Fax:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-22"
                                                v-model="form.shipper_address.ship_fax"
                                                :class="{ 'is-invalid': form.errors.has('ship_fax') }"></b-form-input>
                                            <has-error :form="form" field="ship_fax"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Telex:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-19"
                                                v-model="form.shipper_address.ship_telex"></b-form-input>
                                        </b-form-group>

                                        <b-form-checkbox size="sm" class="ml-lg-35" v-model="form.is_shipper_address_save"> Save new address to address
                                            book</b-form-checkbox>
                                    </b-col>
                                </b-col>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label="" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mt-2">
                                    <b-form-checkbox size="sm" class="mt-2 text-bold">Set as default house shipper for later logins</b-form-checkbox>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-col cols="auto">
                                    <h4 class="h-color font-weight-bolder ml-2">
                                        Consignee
                                    </h4>
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label="Name:*" label-for="input-horizontal"
                                        class="form-control-sm col-form-label">
                                        <div class="d-flex align-items-center">
                                            <div class="flex-grow-1">
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-shipper" class="form-control-sm col-form-label">
                                                    <div class="custom-dropdown" ref="dropdownContainer_consignee" @click="toggleDropdown_consignee">
                                                        <input type="text" v-model="form.consignee_address.cons_name" placeholder="Search consignee" id="consignee" class="form-control" autocomplete="off"
                                                        :class="{ 'is-invalid': form.errors.has('cons_name') }"
                                                        @input="filterConsignee" @focus="toggleDropdown_consignee(true)" @blur="closeDropdown_consignee" />

                                                        <div v-if="isDropdownOpen_consignee && filteredConsignees.length" class="dropdown-options">
                                                            <div v-for="(consignee, index) in filteredConsignees" :key="consignee.id" @click.stop="selectConsignee(consignee)" class="option">
                                                                {{ consignee.name }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </b-form-group>
                                                <has-error :form="form" field="cons_name"></has-error>
                                            </div>
                                            <b-icon icon="arrows-expand" aria-hidden="true" class="ml-2"
                                                @click="showConsignee = !showConsignee"></b-icon>
                                        </div>
                                    </b-form-group>
                                    <b-col v-if="showConsignee">
                                        <div class="d-flex align-items-center mt-5">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label mr-3">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-16"
                                                    v-model="form.consignee_address.cons_name"
                                                    :class="{ 'is-invalid': form.errors.has('cons_name') }"></b-form-input>
                                                <has-error :form="form" field="cons_name"></has-error>
                                            </b-form-group>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal" label="Account:"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                v-model="form.consignee_address.cons_account"
                                                :class="{ 'is-invalid': form.errors.has('cons_account') }"></b-form-input>
                                            <has-error :form="form" field="cons_account"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Address *:">
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                style="width: 220px"
                                                v-model="form.consignee_address.cons_address" :class="{ 'is-invalid': form.errors.has('cons_address') }"></b-form-input>
                                                <has-error :form="form" field="cons_address"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-16"
                                                style="width: 220px" v-model="form.consignee_address.cons_address_line_2"
                                                :class="{ 'is-invalid': form.errors.has('cons_address_line_2') }"></b-form-input>
                                            <has-error :form="form" field="cons_address_line_2"></has-error>
                                        </b-form-group>
                                        <div class="d-flex align-items-center mt-1">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label" label="City *:">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-8"
                                                    v-model="form.consignee_address.cons_city"
                                                    :class="{ 'is-invalid': form.errors.has('cons_city') }"></b-form-input>
                                                <has-error :form="form" field="cons_city"></has-error>
                                            </b-form-group>
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                style="width: 50px"></b-form-input>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Post Code:">
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                v-model="form.consignee_address.cons_post_code"
                                                :class="{ 'is-invalid': form.errors.has('cons_post_code') }"></b-form-input>
                                            <has-error :form="form" field="cons_post_code"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="State:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-6"
                                                v-model="form.consignee_address.cons_state"
                                                :class="{ 'is-invalid': form.errors.has('cons_state') }"></b-form-input>
                                            <has-error :form="form" field="cons_state"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3 mb-3" label="Country *:">
                                            <b-form-select class="form-control-sm ml-lg-1" style="width: 220px"
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
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Phone:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-3"
                                                v-model="form.consignee_address.cons_phone"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Fax:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-8"
                                                v-model="form.consignee_address.cons_fax"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Telex:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-5"
                                                v-model="form.consignee_address.cons_telex"></b-form-input>
                                        </b-form-group>

                                        <b-form-checkbox size="sm" class="ml-lg-21" v-model="form.is_consignee_address_save"> Save new address to address
                                            book</b-form-checkbox>
                                    </b-col>
                                </b-col>
                            </b-col>
                        </b-row>
                        <hr class="hr" />
                        <div>
                            <b-tabs content-class="mt-3" class="nav-tabs">
                                <b-tab title="Routing Information" style="border: 2px solid black !important">
                                    <b-row class="mt-5">
                                        <b-col cols="auto">
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
                                                label="Departure Airport: *" label-for="input-departure-airport"
                                                class="form-control-sm col-form-label">
                                                    <div class="custom-dropdown" ref="dropdownContainer_departure" @click="toggleDropdown_departure">
                                                        <input type="text" v-model="form.routing_information.departure_airport" placeholder="Search departure" id="departure" class="form-control" 
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
                                                <has-error :form="form" field="departure_airport"></has-error>
                                            </b-form-group>
                                        </b-col>
                                        <div class="d-flex flex-column align-items-center" style="margin-left: 8.5%">
                                            <div class="container">
                                                <table class="table-bordered mx-auto table-sm">
                                                    <thead>
                                                        <tr class="h_background_color">
                                                            <th class="form-control1">From</th>
                                                            <th class="form-control1">To</th>
                                                            <th class="form-control1"
                                                                style="width: 50px;padding-left: 3%;">By</th>
                                                            <th class="form-control1"
                                                                style="width: 50px;padding-left: 3%;">Flight</th>
                                                            <th class="form-control1"
                                                                style="width: 50px;padding-left: 3%;">Date</th>
                                                            <th class="form-control1" style="width: 80px"></th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>
                                        </div>
                                    </b-row>
                                    <b-row class="mt-5">
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                label="Destination Airport: *" label-for="input-destination-airport"
                                                class="form-control-sm col-form-label">
                                                    <div class="custom-dropdown" ref="dropdownContainer_destination" @click="toggleDropdown_destination">
                                                        <input type="text" v-model="form.routing_information.destination_airport" placeholder="Search destination" id="destination" class="form-control" 
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
                                                <has-error :form="form" field="destination_airport"></has-error>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="1">Routing:*</b-col>
                                        <div class="d-flex flex-column align-items-center">
                                            <div class="container">
                                                <table class="mx-auto table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-form-airport"
                                                                    class="form-control-sm col-form-label">
                                                                        <div class="custom-dropdown" ref="dropdownContainer_from" @click="toggleDropdown_from">
                                                                            <input type="text" v-model="form.routing_information.from" placeholder="Search destination" id="from_id" class="form-control" 
                                                                                autocomplete="off" :class="{ 'is-invalid': form.errors.has('from') }">
                                                                            <div v-if="isDropdownOpen_from && filteredLocations_from.length" class="dropdown-options">
                                                                                <div v-for="(item, index) in filteredLocations_from" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectOption_from(item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    <has-error :form="form" field="from"></has-error>
                                                                </b-form-group>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-to"
                                                                    class="form-control-sm col-form-label">
                                                                        <div class="custom-dropdown" ref="dropdownContainer_to" @click="toggleDropdown_to">
                                                                            <input type="text" v-model="form.routing_information.to" placeholder="Search destination" id="to_id" class="form-control" 
                                                                                autocomplete="off" :class="{ 'is-invalid': form.errors.has('to') }">
                                                                            <div v-if="isDropdownOpen_to && filteredLocations_to.length" class="dropdown-options">
                                                                                <div v-for="(item, index) in filteredLocations_to" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectOption_to(item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    <has-error :form="form" field="to"></has-error>
                                                                </b-form-group>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 40px;" v-model="form.routing_information.by"
                                                                    :class="{ 'is-invalid': form.errors.has('by') }" />
                                                                <has-error :form="form" field="by"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style=" width: 50px;" v-model="form.routing_information.flight"
                                                                    :class="{ 'is-invalid': form.errors.has('flight') }" />
                                                                <has-error :form="form" field="flight"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 60px;" v-model="form.routing_information.date"
                                                                    :class="{ 'is-invalid': form.errors.has('date') }" />
                                                                <has-error :form="form" field="date"></has-error>
                                                            </td>
                                                            <td class="editable-cell w-10" style="width: 60px">
                                                                <date-picker valueType="format"
                                                                    style="width: 30px !important;" format="DDMMM"
                                                                    @change="handleDateChange($event, 'form.routing_information.date')"></date-picker>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </b-row>
                                    <b-row class="">
                                        <b-col cols="auto" class="justify-content-lg-start">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                label="Master Origin: *" label-for="input-departure-airport"
                                                class="form-control-sm col-form-label">
                                                <b-form-input id="input-departure-airport"
                                                    class="form-control-sm" v-model="form.routing_information.master_origin"
                                                    :class="{ 'is-invalid': form.errors.has('master_origin') }"></b-form-input>
                                                <has-error :form="form" field="master_origin"></has-error>
                                            </b-form-group>
                                        </b-col>
                                        <div class="d-flex flex-column justify-content-end" style="margin-left: 24%">
                                            <table class="mx-auto table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-to2"
                                                                    class="form-control-sm col-form-label">
                                                                        <div class="custom-dropdown" ref="dropdownContainer_to2" @click="toggleDropdown_to2">
                                                                            <input type="text" v-model="form.routing_information.to_2" placeholder="Search destination" id="to2_id" class="form-control" 
                                                                                autocomplete="off" :class="{ 'is-invalid': form.errors.has('to_2') }">
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
                                                            </b-form-group>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 40px"
                                                                v-model="form.routing_information.by_2"
                                                                :class="{ 'is-invalid': form.errors.has('by_2') }" />
                                                                <has-error :form="form" field="by_2"></has-error>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 50px"
                                                                v-model="form.routing_information.flight_2"
                                                                :class="{ 'is-invalid': form.errors.has('flight_2') }" />
                                                                <has-error :form="form" field="flight_2"></has-error>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 60px"
                                                                v-model="form.routing_information.date_2"
                                                                :class="{ 'is-invalid': form.errors.has('date_2') }" />
                                                            <has-error :form="form" field="date_2"></has-error>
                                                        </td>
                                                        <td class="editable-cell w-10" style="width: 60px !important;">
                                                            <date-picker valueType="format"
                                                                style=" width: 30px !important;"
                                                                @change="handleDateChange($event, 'form.routing_information.date_2')"></date-picker>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!-- </div> -->
                                        </div>
                                    </b-row>
                                    <b-row class="">
                                        <b-col cols="auto" class="justify-content-lg-start">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                label="Master Destination: *" label-for="input-departure-airport"
                                                class="form-control-sm col-form-label">
                                                <b-form-input id="input-departure-airport"
                                                    class="form-control-sm" v-model="form.routing_information.master_destination"
                                                    :class="{ 'is-invalid': form.errors.has('master_destination') }"></b-form-input>
                                                <has-error :form="form" field="master_destination"></has-error>
                                            </b-form-group>
                                        </b-col>
                                        <div class="d-flex flex-column justify-content-end" style="margin-left: 22%">
                                            <table class="mx-auto table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-to3"
                                                                    class="form-control-sm col-form-label">
                                                                        <div class="custom-dropdown" ref="dropdownContainer_to3" @click="toggleDropdown_to3">
                                                                            <input type="text" v-model="form.routing_information.to_3" placeholder="Search destination" id="to3_id" class="form-control" 
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
                                                            </b-form-group>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 40px"
                                                                v-model="form.routing_information.by_3"
                                                                :class="{ 'is-invalid': form.errors.has('by_3') }" />
                                                                <has-error :form="form" field="by_3"></has-error>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 50px"
                                                                v-model="form.routing_information.flight_3"
                                                                :class="{ 'is-invalid': form.errors.has('flight_3') }" />
                                                            <has-error :form="form" field="flight_3"></has-error>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 60px"
                                                                v-model="form.routing_information.date_3"
                                                                :class="{ 'is-invalid': form.errors.has('date_3') }" />
                                                            <has-error :form="form" field="date_3"></has-error>
                                                        </td>
                                                        <td class="editable-cell" style="width: 60px !important;">
                                                            <date-picker valueType="format"
                                                                style=" width: 30px !important;"
                                                                @change="handleDateChange($event, 'form.routing_information.date_3')"></date-picker>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!-- </div> -->
                                        </div>
                                    </b-row>
                                </b-tab>
                                <b-tab title="Search Flights" style="border: 2px solid black !important">
                                    <div class="d-flex flex-column align-items-start py-5">
                                        <table class="table-bordered table-sm">
                                            <thead>
                                                <tr class="h_background_color">
                                                    <th class="form-control1">
                                                        Carrier *
                                                    </th>
                                                    <th class="form-control1">
                                                        Origin *
                                                    </th>
                                                    <th class="form-control1">
                                                        Destination *
                                                    </th>
                                                    <th class="form-control1">
                                                        Flight Date *
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control" />
                                                    </td>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control"
                                                            :value="getOriginCode(form.routing_information.departure_airport)" />
                                                    </td>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control"
                                                            :value="getDestinationCode(form.routing_information.destination_airport)" />
                                                    </td>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control" />
                                                    </td>
                                                    <date-picker valueType="format"
                                                        style=" width: 30px !important;"></date-picker>
                                                    <!-- <Datepicker format="yyyy-MM-dd" class="small-datepicker mb-2">
                                                    </Datepicker> -->
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </div>
                        <hr class="hr" />
                        <div class="py-5">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="h-color font-weight-bolder ml-2 mb-0">
                                    Consignment Rate Description
                                </h4>
                            </div>
                            <b-button class="mt-5" v-b-modal.modal-consignment variant="warning" :disabled="isConsignmentAdded" @click="handleAddConsignment">Add Consignment Information</b-button>
                            <b-modal id="modal-consignment" ref="modalConsignment" title="Consignment Information"
                                size="xl" ok-only hide-footer @hide="handleModalClose">
                                <div class="d-block">
                                    <b-row>
                                        <!-- First Column -->
                                        <b-col cols="6">
                                            <h6>Pieces and Nature and Quantity of Goods</h6>
                                            <div class="bg-light pl-2">
                                                <label for="">Pieces</label>
                                                <b-form-input id="input-departure-airport" class="form-control-sm"
                                                    v-model="consignment_list.pieces" :class="{ 'is-invalid': consignment_list.errors.has('pieces') }"></b-form-input>
                                                    <has-error :form="consignment_list" field="pieces"></has-error>
                                                <label for="">Description</label>
                                                <b-form-textarea
                                                    style="grid-column: span 2 !important;width: 100% !important;"
                                                    id="textarea" rows="3" max-rows="6"
                                                    v-model="consignment_list.description" :class="{ 'is-invalid': consignment_list.errors.has('description') }"></b-form-textarea>
                                                    <has-error :form="consignment_list" field="description"></has-error>
                                                <table class="table table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th>Rate Class:</th>
                                                            <th>ULD Rate class:</th>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <b-form-select class="form-control"
                                                                    style="width: 320px;"
                                                                    v-model="consignment_list.rate_class" @change="calculateTotalAmount" :class="{ 'is-invalid': consignment_list.errors.has('rate_class') }">
                                                                    <option value="">Select a Rate Class
                                                                    </option>
                                                                    <option value="B">CB - Basic rate</option>
                                                                    <option value="C">CC - Specific commodity rate
                                                                    </option>
                                                                    <option value="E">CE - Unit load device additional
                                                                        rate</option>
                                                                    <option value="K"> CK - Rate per kilogram</option>
                                                                    <option value="M">CM - Minimum charge</option>
                                                                    <option value="N">CN - Normal rate</option>
                                                                    <option value="P">CP - International priority
                                                                        service rate</option>
                                                                    <option value="Q">CQ - Quantity rate</option>
                                                                    <option value="R">CR - Class rate reduction</option>
                                                                    <option value="S">CS - Class rate surcharge</option>
                                                                    <option value="U"> CU - Unit load device basic
                                                                        charge or rate</option>
                                                                    <option value="X">CX - Unit load device additional
                                                                        info</option>
                                                                    <option value="Y">CY - Unit load device discount
                                                                    </option>
                                                                    <option value="Z">CZ - Mutually Defined</option>
                                                                </b-form-select>
                                                                <has-error :form="consignment_list" field="rate_class"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 170px;"
                                                                    v-model="consignment_list.uld_rate_class" :class="{ 'is-invalid': consignment_list.errors.has('uld_rate_class') }"/>
                                                                    <has-error :form="consignment_list" field="uld_rate_class"></has-error>
                                                            </td>
                                                        </tr>
                                                        <tr v-if="consignment_list.rate_class">
                                                            <td colspan="4" class="editable-cell">
                                                                <div
                                                                    class="d-flex justify-content-end align-items-center">
                                                                    <span class="mr-2">Charge:</span>
                                                                    <input type="text" class="form-control"
                                                                        style="width: 170px;"
                                                                        v-model="calculatedCharge" />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Service code</th>
                                                            <th>Commodity Item</th>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <b-form-select class="form-control"
                                                                    style="width: 320px;"
                                                                    v-model="consignment_list.service_code" :class="{ 'is-invalid': consignment_list.errors.has('service_code') }">
                                                                    <option value="">Select a Service Code
                                                                    </option>
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
                                                                    <option value="P">P - Small Package Service
                                                                    </option>
                                                                    <option value="R">R - Restricted</option>
                                                                    <option value="S">S - Substitue Truck</option>
                                                                    <option value="T">T - Charter</option>
                                                                    <option value="X">X - Express Service</option>
                                                                </b-form-select>
                                                                <has-error :form="consignment_list" field="service_code"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 170px;"
                                                                    v-model="consignment_list.commodity_item" :class="{ 'is-invalid': consignment_list.errors.has('commodity_item') }"/>
                                                                    <has-error :form="consignment_list" field="commodity_item"></has-error>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>
                                                                Country Of Origin of Goods
                                                            </th>
                                                            <th>Slac:</th>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <b-form-select class="form-control"
                                                                    style=" width: 320px;"
                                                                    v-model="consignment_list.country_origin_goods" :class="{ 'is-invalid': consignment_list.errors.has('country_origin_goods') }">
                                                                    <option value=""> Select a Country</option>
                                                                    <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                        {{ country.text }}
                                                                    </option>
                                                                </b-form-select>
                                                                <has-error :form="consignment_list" field="country_origin_goods"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 170px;"
                                                                    v-model="consignment_list.slac" :class="{ 'is-invalid': consignment_list.errors.has('slac') }"/>
                                                                    <has-error :form="consignment_list" field="commodity_item"></has-error>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Hs Codes:</th>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell"
                                                                style="display: flex;align-items: center;">
                                                                <b-form-input type="text" class="form-control"
                                                                    style="width: 170px;margin-right: 10px;"
                                                                    v-model="consignment_list.hs_code" :class="{ 'is-invalid': hs_code_error.length > 0 }"></b-form-input>
                                                                <button @click="addHsCode">Add</button>
                                                            </td>
                                                            <div v-if="hs_code_error.length" class="text-danger">
                                                                <ul  style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                    <li>Warning:</li>
                                                                    <li v-for="(error, index) in hs_code_error" :key="index">{{ error }}</li>
                                                                </ul>
                                                            </div>
                                                        </tr>
                                                        <tr class="h_background_color">
                                                            <th>HS Codes</th>
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
                                            <h6>Weight and Dimensions</h6>
                                            <div class="bg-light pl-2">
                                                <table class="table table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th>Gross Weight</th>
                                                            <th></th>
                                                            <th> Chargeable Weight</th>
                                                            <th>Rate</th>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 70px;"
                                                                    v-model="consignment_list.gross_weight" :class="{ 'is-invalid': consignment_list.errors.has('gross_weight') }" />
                                                                    <has-error :form="consignment_list" field="uld_serial"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <b-form-select class="form-control"
                                                                    style=" width: 70px;"
                                                                    v-model="consignment_list.weight_code" :class="{ 'is-invalid': consignment_list.errors.has('weight_code') }">
                                                                    <option value="KGM">Kgs</option>
                                                                    <option value="LBR">Lbs</option>
                                                                </b-form-select>
                                                                <has-error :form="consignment_list" field="weight_code"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control" style="width: 70px;" v-model="consignment_list.chargable_weight" :class="{ 'is-invalid': consignment_list.errors.has('chargable_weight') }" />
                                                                <has-error :form="consignment_list" field="chargable_weight"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control" style=" width: 100px;" v-model="consignment_list.rate" :class="{ 'is-invalid': consignment_list.errors.has('rate') }" />
                                                                <has-error :form="consignment_list" field="rate"></has-error>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Pcs</th>
                                                            <th>Wgt</th>
                                                            <th>Length</th>
                                                            <th>Width</th>
                                                            <th>Height</th>
                                                            <th>Unit</th>
                                                            <th></th>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 100%;"
                                                                    v-model="consignment_list.pcs" />
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 100%;"
                                                                    v-model="consignment_list.wgt" />
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 100%;"
                                                                    v-model="consignment_list.length" />
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 100%;"
                                                                    v-model="consignment_list.width" />
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input class="form-control"
                                                                    style="width: 100%;"
                                                                    v-model="consignment_list.height" type="text" />
                                                            </td>
                                                            <td class="editable-cell" style="width: 100%;">
                                                                <b-form-select class="form-control" style="width: 100%;"
                                                                    v-model="consignment_list.unit">
                                                                    <option value="CMT">CMT</option>
                                                                    <option value="INH">INH</option>
                                                                    <option value="FOT">FOT</option>
                                                                </b-form-select>
                                                            </td>
                                                            <td class="editable-cell"><button
                                                                    @click="addPcsInfo">Add</button></td>
                                                        </tr>
                                                        <tr v-if="validationErrors.length > 0">
                                                            <td colspan="7">
                                                                <div class="text-danger">
                                                                    <ul style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                        <li>Warning:</li>
                                                                        <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr class="h_background_color">
                                                            <th>Pcs</th>
                                                            <th>Wgt</th>
                                                            <th>Length</th>
                                                            <th>Width</th>
                                                            <th>Height</th>
                                                            <th>Unit</th>
                                                        </tr>
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
                                                <h6>Volume</h6>
                                                <b-row class="justify-content-end">
                                                    <b-col cols="auto">
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-horizontal"
                                                            class="form-control-sm col-form-label">
                                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                                style="width: 80px"
                                                                v-model="consignment_list.volume"></b-form-input>
                                                        </b-form-group>
                                                    </b-col>
                                                    <b-col cols="auto">
                                                        <b-form-select class="form-control"
                                                            style="width:70px;margin-right: 10px;"
                                                            v-model="this.form.entries.dimention_unit">
                                                            <option value="CMQ">cm³</option> <!-- CC Cubic centimetre-->
                                                            <option value="MTQ">m³</option> <!-- MC  Cubic Metre-->  
                                                            <option value="FTQ">ft³</option> <!-- CF  Cubic Foot--> 
                                                            <option value="INQ">in³</option> <!-- CI  Cubic inch--> 
                                                        </b-form-select>
                                                    </b-col>
                                                </b-row>
                                            </div>
                                            <h5 class="mt-5 mb-2">ULD Information</h5>
                                            <div class="bg-light">
                                                <table class="table table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th>ULD Type:</th>
                                                            <th>ULD Serial:</th>
                                                            <th>Owner:</th>
                                                            <th></th>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 100px;"
                                                                    v-model="consignment_list.uld_type" />
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 100px;"
                                                                    v-model="consignment_list.uld_serial" />
                                                                <!-- <has-error :form="form" field="uld_serial"></has-error> -->
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 100px;"
                                                                    v-model="consignment_list.owner" />
                                                            </td>
                                                            <td class="editable-cell"><button
                                                                    @click="addUldInfo">Add</button></td>
                                                        </tr>
                                                        <tr v-if="uld_error.length" style="color: red;">
                                                            <td colspan="4">
                                                                <ul style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                    <li>Warning:</li>
                                                                    <li v-for="(error, index) in uld_error" :key="index">{{ error }}</li>
                                                                </ul>
                                                            </td>
                                                        </tr>
                                                        <tr class="h_background_color">
                                                            <th>ULD Type:</th>
                                                            <th>ULD Serial:</th>
                                                            <th>Owner:</th>
                                                            <th></th>
                                                        </tr>
                                                        <tr v-for="(row, index) in consignment_list.uld_info"
                                                            :key="index">
                                                            <td class="editable-cell">{{ row.uld_type }}</td>
                                                            <td class="editable-cell">{{ row.uld_serial }}</td>
                                                            <td class="editable-cell">{{ row.owner }}</td>
                                                            <td class="editable-cell"
                                                                style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                <b-icon icon="trash" font-scale="1"
                                                                    @click="deleteUldInfo(index)"></b-icon>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <div class="d-flex justify-content-end">
                                        <button class="btn btn-secondary" @click="addOrUpdateEntry">
                                            {{ edit_entry_index !== null ? 'Update' : 'Add' }}
                                        </button>
                                    </div>
                                </div>
                            </b-modal>

                            <div class="d-flex flex-column align-items-center mb-5 mt-5">
                                <div class="">
                                    <table class="table-bordered mx-auto table-sm">
                                        <thead>
                                            <tr class="h_background_color" style="font-size: 10px">
                                                <th class="form-control1">Pcs.</th>
                                                <th class="form-control1">Description</th>
                                                <th>Srv. Code</th>
                                                <th class="form-control1">Com. Itm.</th>
                                                <th class="form-control1">Gross Wgt.</th>
                                                <th class="form-control1">Chrg. Wgt.</th>
                                                <th class="form-control1">Rate</th>
                                                <th class="form-control1" style="width:100px;">Detailed Pcs. Info</th>
                                                <th class="form-control1">Vol</th>
                                                <th class="form-control1">Rate Class</th>
                                                <th class="form-control1">UID Rate Class</th>
                                                <th class="form-control1">Charge</th>
                                                <th class="form-control1">HS Code</th>
                                                <th class="form-control1">Origin Country</th>
                                                <th class="form-control1">UID information</th>
                                                <th class="form-control1">Slac</th>
                                                <th class="form-control1"></th>
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
                                                        {{ hs.hs_code }}
                                                    </div>
                                                </td>
                                                <td>{{ entry.country_origin_goods }}</td>
                                                <td>
                                                    <div v-for="(uld, uldIndex) in entry.uld_info" :key="uldIndex"
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
                                </div>
                                <div class="d-flex justify-content-end ml-auto mb-20">
                                    <div class="d-flex align-items-center">
                                        <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-" >
                                            <div class="d-flex align-items-center">
                                                <label for="input-horizontal" class="mr-2 mb-0">Total Volume:</label>
                                                <b-form-input id="input-horizontal" class="form-control-sm mr-2" v-model="form.totals.total_volume"></b-form-input>
                                                <b-form-select class="form-control-sm" v-model="form.totals.dimention_unit">
                                                    <option value="CMQ">cm³</option> <!-- CC Cubic centimetre-->
                                                    <option value="MTQ">m³</option> <!-- MC  Cubic Metre-->  
                                                    <option value="FTQ">ft³</option> <!-- CF  Cubic Foot--> 
                                                    <option value="INQ">in³</option> <!-- CI  Cubic inch--> 
                                                </b-form-select>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <label for="input-horizontal" class="mr-2 mb-0" >Total Amount:</label>
                                                <b-form-input id="input-horizontal" class="form-control-sm mr-2" :value="calculatedCharge"></b-form-input>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <label for="input-horizontal1" class="mr-2 mb-3" >Master Pcs:*</label>
                                                <b-form-input id="input-horizontal1" class="form-control-sm mr-2 mt-2" v-model="form.totals.master_pcs"></b-form-input>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <label for="input-horizontal2" class="mr-2 mb-0" >Master Weight:*</label>
                                                <b-form-input id="input-horizontal2" class="form-control-sm mr-2 mt-2" v-model="form.totals.master_weight"></b-form-input>
                                            </div>
                                        </b-form-group>
                                    </div>
                                </div>
                            </div>
                            <b-form-checkbox size="sm" class="mt-2 text-bold justify-content-lg-start" id="agreed">As Agreed</b-form-checkbox>
                        </div>
                        <hr class="hr" />
                        <div>
                            <div class="py-md-9">
                                <b-tabs content-class="mt-3">
                                    <b-tab title="OSI" active>
                                        <h5>Other Service Information:</h5>
                                        <div class="py-7">
                                            <b-form-textarea class=""
                                                style=" grid-column: span 2 !important;width: 60% !important;"
                                                id="textarea" rows="3" max-rows="6"
                                                v-model="form.custom_origin.other_service_information"
                                                :class="{ 'is-invalid': form.errors.has('other_service_information') }"></b-form-textarea>
                                            <has-error :form="form" field="other_service_information"></has-error>
                                        </div>
                                    </b-tab>
                                    <b-tab title="SSR">
                                        <h5>Special Service Request:</h5>
                                        <div class="py-7">
                                            <b-form-textarea class=""
                                                style="grid-column: span 2 !important;width: 60% !important;"
                                                id="textarea" rows="3" max-rows="6"
                                                v-model="form.custom_origin.special_service_request"
                                                :class="{ 'is-invalid': form.errors.has('special_service_request') }"></b-form-textarea>
                                            <has-error :form="form" field="special_service_request"></has-error>
                                        </div>
                                    </b-tab>
                                    <b-tab title="Accounting Information">
                                        <h5>Accounting Information:</h5>
                                        <div class="py-7">
                                            <b-form-textarea class=""
                                                style="grid-column: span 2 !important;width: 60% !important;"
                                                id="textarea" rows="3" max-rows="6"
                                                v-model="form.custom_origin.accounting_information"
                                                :class="{ 'is-invalid': form.errors.has('accounting_information') }"></b-form-textarea>
                                            <has-error :form="form" field="accounting_information"></has-error>
                                            <!-- <b-form-checkbox size="sm" v-model="form.custom_origin.letter_credit">Letter Of
                                                Credit</b-form-checkbox> -->
                                                <label for="input-horizontal" class="mr-2 mt-2 mb-0" style="width: 150px">Letter Of Credit</label>
                                                <b-form-select class="form-control-sm" v-model="form.custom_origin.letter_credit" style="width: 250px">
                                                    <option value="CRN">Credit Card Number</option>
                                                    <option value="CRD">Credit Card Expiry Date</option>
                                                    <option value="CRI">Credit Card Issuance Name</option>
                                                    <option value="GEN">General Information</option>
                                                    <option value="GBL">Government Bill of Lading</option>
                                                    <option value="STL">Mode of Settlement</option>
                                                    <option value="RET">Return to Origin</option>
                                                    <option value="SRN">Shipper’s Reference Number</option>
                                                </b-form-select>
                                        </div>
                                    </b-tab>
                                    <b-tab title="Shipment Reference Infomation">
                                        <h4 class="h-color font-weight-bolder ml-2">Shipment Reference Information</h4>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            label="Shipment Reference Number:" class="form-control-sm col-form-label">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-14"
                                                v-model="form.custom_origin.shipment_ref_no"
                                                :class="{ 'is-invalid': form.errors.has('shipment_ref_no') }"></b-form-input>
                                            <has-error :form="form" field="shipment_ref_no"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            label="Supplementary Shipment Information:"
                                            class="form-control-sm col-form-label">
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                v-model="form.custom_origin.supplementary_shipment_info"
                                                :class="{ 'is-invalid': form.errors.has('supplementary_shipment_info') }"></b-form-input>
                                            <has-error :form="form" field="supplementary_shipment_info"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label ml-lg-30">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-36 ml-sm-16 ml-md-16 ml-auto"
                                                v-model="form.custom_origin.supplementary_shipment_info"></b-form-input>
                                        </b-form-group>
                                    </b-tab>
                                    <b-tab title="Customs Origin">
                                        <h5>Customs Origin Code:</h5>
                                        <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-label"
                                            style="width: 350px">
                                            <b-form-select class="form-control-sm" v-model="form.custom_origin.customs_origin_code">
                                                <option value="T1">T1 - Goods from outside the EC under Customs Control</option>
                                                <option value="T2"> T2 - EC Goods not in free circulation </option>
                                                <option value="TE"> TE - Goods in trade with Spain subject to duties </option>
                                                <option value="TP"> TP - Goods in trade with Portugal subject to special duties</option>
                                                <option value="TD"> TD - Goods already under formal transit procedure </option>
                                                <option value="TF"> TF - Goods in trade between EC and Canary Islands </option>
                                                <option value="C"> C - Goods in free circulation </option>
                                                <option value="X"> X - Goods in free circulation with destination outside the EC
                                                </option>
                                            </b-form-select>
                                        </b-form-group>
                                    </b-tab>
                                    <b-tab title="Agent Information">
                                        <div class="container py-5">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <table class="table-bordered table-sm">
                                                        <thead>
                                                            <tr class="h_background_color">
                                                                <th class="form-control1" style="width: 180px;">HAWB Agents Head Office</th>
                                                                <th class="form-control1"></th>
                                                                <th class="form-control1"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td class="editable-cell">Name:*</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.ho_name" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Address:*</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.ho_address" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">City:*</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 130px"
                                                                        v-model="agent_information.ho_city" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Post Code:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 130px"
                                                                        v-model="agent_information.ho_pincode" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">State:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.ho_state" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Country:* </td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.ho_country"  :class="{ 'is-invalid': form.errors.has('ho_country') }">
                                                                        <option value="">Select a country</option>
                                                                        <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                            {{ country.text }}
                                                                        </option>
                                                                    </b-form-select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell"></td>
                                                                <td class="editable-cell">
                                                                    <b-form-checkbox size="sm">Save Agents Head Office For Later Logins</b-form-checkbox>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">IATA:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.iata_agent_code" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Cass:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.iata_agent_cass" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell"></td>
                                                                <td class="editable-cell">
                                                                    <b-form-checkbox size="sm">Save IATA and Cass Information For Later Logins</b-form-checkbox>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="col-md-6">
                                                    <table class="table-bordered table-sm">
                                                        <thead>
                                                            <tr class="h_background_color">
                                                                <th class="form-control1" style="width: 180px;">Override
                                                                    Issuing Agent:</th>
                                                                <th class="form-control1"></th>
                                                                <th class="form-control1"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td class="editable-cell"> Agent Name: </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.agent_name" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell"> Agent Address: </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.agent_address" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell"></td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 130px"
                                                                        v-model="agent_information.agent_city" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 130px"
                                                                        v-model="agent_information.agent_pincode" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Issuing Signature:* </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.agent_issue_sign" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Issuing Location Code:* </td>
                                                                <td class="editable-cell">
                                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-agent_issue_loc_code"
                                                                        class="form-control-sm col-form-label">
                                                                            <div class="custom-dropdown" ref="dropdownContainer_issue" @click="toggleDropdown_issuing_loc">
                                                                                <input type="text" v-model="agent_information.agent_issue_loc_code" placeholder="Search location" id="agent_issue_loc_code" class="form-control" 
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
                                                                        <has-error :form="form" field="agent_issue_loc_code"></has-error>
                                                                    </b-form-group>
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-checkbox size="sm">Save information for
                                                                        later logins</b-form-checkbox>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Issuing Date:*</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.agent_issue_date" />
                                                                </td>
                                                                <date-picker valueType="format"
                                                                    style=" width: 30px !important;" @change="handleDateChange($event, 'agent_information.agent_issue_date')"></date-picker>
                                                            </tr>
                                                            <!-- <tr>
                                                                <td class="editable-cell">Agent Account:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="agent_information.agent_account" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-checkbox size="sm">Save information for
                                                                        later logins</b-form-checkbox>
                                                                </td>
                                                            </tr> -->
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>

                                    <b-tab title="Also Notify">
                                        <h4 class="h-color font-weight-bolder ml-2 mt-2"> Also Notify </h4>
                                        <div class="d-flex align-items-center mt-5">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-notify" class="form-control-sm col-form-label">
                                                <div class="custom-dropdown" ref="dropdownContainer_alsoNotify" @click="toggleDropdown_alsoNotify">
                                                    <input type="text" v-model="form.also_notify_address.also_name" placeholder="Search address" id="also_notify" class="form-control" autocomplete="off"
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
                                        <div class="d-flex align-items-center mt-5">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label mr-3" label="">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-30"
                                                    v-model="form.also_notify_address.also_name"
                                                    :class="{ 'is-invalid': form.errors.has('also_name') }"></b-form-input>
                                                <has-error :form="form" field="also_name"></has-error>
                                            </b-form-group>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Address:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-15"
                                                style="width: 220px" v-model="form.also_notify_address.also_address"
                                                :class="{ 'is-invalid': form.errors.has('also_address') }"></b-form-input>
                                            <has-error :form="form" field="also_address"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-31"
                                                style="width: 220px" v-model="form.also_notify_address.also_address_line_2"
                                                :class="{ 'is-invalid': form.errors.has('also_address_line_2') }"></b-form-input>
                                            <has-error :form="form" field="also_address_line_2"></has-error>
                                        </b-form-group>
                                        <div class="d-flex align-items-center mt-1">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label" label="City:">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-22"
                                                    v-model="form.also_notify_address.also_city"
                                                    :class="{ 'is-invalid': form.errors.has('also_city') }"></b-form-input>
                                                <has-error :form="form" field="also_city"></has-error>
                                            </b-form-group>
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                style="width: 50px" v-model="form.also_notify_address.also_airport_code"
                                                :class="{ 'is-invalid': form.errors.has('also_airport_code') }"></b-form-input>
                                            <has-error :form="form" field="also_airport_code"></has-error>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Post Code:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-11"
                                                v-model="form.also_notify_address.also_post_code"
                                                :class="{ 'is-invalid': form.errors.has('also_post_code') }"></b-form-input>
                                            <has-error :form="form" field="also_post_code"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="State:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-20"
                                                v-model="form.also_notify_address.also_state"
                                                :class="{ 'is-invalid': form.errors.has('also_state') }"></b-form-input>
                                            <has-error :form="form" field="also_state"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-s
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3 mb-3" label="Country:">
                                            <b-form-select class="form-control-sm ml-lg-15" style="width: 220px"
                                                v-model="form.also_notify_address.also_country"
                                                :class="{ 'is-invalid': form.errors.has('also_country') }">
                                                <option disabled value=""> Please select one</option>
                                                <option v-for="country in countries" :key="country.value" :value="country.value">
                                                    {{ country.text }}
                                                </option>
                                            </b-form-select>
                                            <has-error :form="form" field="also_country"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Phone:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-17"
                                                v-model="form.also_notify_address.also_phone"
                                                :class="{ 'is-invalid': form.errors.has('also_phone') }"></b-form-input>
                                            <has-error :form="form" field="also_phone"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Fax:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-22"
                                                v-model="form.also_notify_address.also_fax"
                                                :class="{ 'is-invalid': form.errors.has('also_fax') }"></b-form-input>
                                            <has-error :form="form" field="also_fax"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Telex:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-19"
                                                v-model="form.also_notify_address.also_telex"></b-form-input>
                                        </b-form-group>

                                        <b-form-checkbox size="sm" class="ml-lg-35"
                                            v-model="form.is_also_notify_address_save"> Save new address to address
                                            book</b-form-checkbox>
                                    </b-tab>
                                    <!-- <b-tab title="Exta Print Information">
                                        <h5> Extra information printed on House Way Bill (Only printed - not saved or sent to Airlines):</h5>
                                        <b-form-textarea class=""
                                            style="grid-column: span 2 !important;width: 60% !important;" id="textarea"
                                            rows="3" max-rows="6" v-model="form.custom_origin.extra_print"></b-form-textarea>
                                    </b-tab> -->
                                </b-tabs>
                            </div>
                        </div>
                        <hr class="hr" />
                        <div class="py-7">
                            <b-tabs>
                                <b-tab title="Payment Information" active style="background-color: white !important">
                                    <div>
                                        <b-row>
                                            <b-col cols="7">
                                                <b-row class="justify-content-center mt-5">
                                                    <b-col>
                                                        <b-col cols="auto">
                                                            <div class="d-flex align-items-center mt-1">
                                                                <b-form-group id="fieldset-horizontal"
                                                                    label-cols-lg="auto" content-cols-sm
                                                                    content-cols-lg="auto" label-for="input-horizontal"
                                                                    class="form-control-sm col-form-label mr-3 mb-3"
                                                                    label="Type Of Payment:*">
                                                                    <b-form-select class="form-control-sm ml-lg-15"
                                                                        style="width: 220px;"
                                                                        v-model="form.payment_info.type_of_payment">
                                                                        <option disabled value=""> Please select one
                                                                        </option>
                                                                        <option value=""> Please select one</option>
                                                                        <option value="CC">CA - Partial collect credit - partial prepaid cash</option>
                                                                        <option value="CC">CB - Partial collect credit - partial prepaid credit</option>
                                                                        <option value="CC">CC - All charges collect</option> <!-- CC -->
                                                                        <option value="CC">CG - All Charges collect by GBL</option>
                                                                        <option value="CC">CP - Destination collect cash</option>
                                                                        <option value="CC">CX - Destination collect credit</option>
                                                                        <option value="CP">NC - Service rate. No charge</option>
                                                                        <option value="PP">PC - Partial prepaid cash - partial collect cash</option>
                                                                        <option value="PP">PD - Partial prepaid credit - partial collect cash</option>
                                                                        <option value="PP">PG - All charges prepaid by GBL</option>
                                                                        <option value="PP">PP - All charges prepaid cash</option><!-- PP -->
                                                                        <option value="PP">PX - All charges prepaid credit</option>
                                                                        <!-- <option value="C">All Charges Collect CC</option>
                                                                        <option value="P">All Charges Prepaid Cash PP</option> -->
                                                                    </b-form-select>
                                                                </b-form-group>
                                                                <label class="ml-3 mt-4 mb-5 mr-5">Currency:</label>
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm" style="width: 50px;"
                                                                    v-model="form.payment_info.currency"
                                                                    :class="{ 'is-invalid': form.errors.has('currency') }"></b-form-input>
                                                                <has-error :form="form" field="currency"></has-error>
                                                            </div>
                                                            <label class="ml-3 mt-5 mb-5">Declared Values For:</label>

                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                content-cols-sm content-cols-lg="auto"
                                                                label-for="input-horizontal" label="Carriage :"
                                                                class="form-control-sm col-form-label mr-3">
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm ml-lg-31 mt-3"
                                                                    style=" width: 220px;"
                                                                    v-model="form.payment_info.declear_value_carriage"></b-form-input>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                content-cols-sm content-cols-lg="auto"
                                                                label-for="input-horizontal"
                                                                class="form-control-sm col-form-label mr-3"
                                                                label="Customs :">
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm ml-lg-31 mt-3"
                                                                    style="width: 220px;"
                                                                    v-model="form.payment_info.declear_value_customs"></b-form-input>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                content-cols-sm content-cols-lg="auto"
                                                                label-for="input-horizontal" label="Insurance:"
                                                                class="form-control-sm col-form-label mr-3">
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm ml-lg-30 mt-3"
                                                                    style="width: 220px;"
                                                                    v-model="form.payment_info.declear_value_insurance"></b-form-input>
                                                            </b-form-group>
                                                        </b-col>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                            <b-col cols="5">
                                                <table class="table-bordered ml-auto table-sm m-5">
                                                    <thead>
                                                        <tr class="h_background_color">
                                                            <th>Charges Summary</th>
                                                            <th>Prepaid</th>
                                                            <th>Collect</th>
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
                                            </b-col>
                                        </b-row>
                                    </div>
                                </b-tab>
                                <b-tab title="Other Charges">
                                    <div class="container h_background_color text-white pt-2 pb-2">
                                        <div class="row">
                                            <div class="col text-left">
                                                <h4>Code</h4>
                                            </div>
                                            <div class="col text-left">
                                                <h4>Amount In INR</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <b-row>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-label mt-2">
                                                <b-form-select class="form-control-sm" v-model="oci_info.country_code" :class="{ 'is-invalid': form.errors.has('other_charge_code') }">
                                                    <option value="">Select an Other Charge Code</option>
                                                    <option v-for="charge in other_charges_code" :key="charge.value" :value="charge.value">
                                                        {{ charge.text }}
                                                    </option>
                                                </b-form-select>
                                                <has-error :form="form" field="other_charge_code"></has-error>
                                            </b-form-group>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-input class="form-control-sm" v-model="other_charges.other_code"
                                                    placeholder="or:"></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-input class="form-control-sm"
                                                    v-model="other_charges.amount"></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="due" size="sm" v-model="other_charges.due" value="A">Due
                                                    Agent</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="due" size="sm" v-model="other_charges.due"
                                                    value="C">Due Carrier</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="payment_type" size="sm" v-model="other_charges.payment_type"
                                                    value="P">Prepaid</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="payment_type" size="sm" v-model="other_charges.payment_type"
                                                    value="C">Collect</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-button class="bg-secondary form-control-sm px-5" @click="addCharge">
                                                    {{ editIndex !== null ? 'Update' : 'Add' }}
                                                </b-button>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>

                                    <!-- Calculation Table always visible -->
                                    <div class="d-flex flex-column align-items-start py-5">
                                        <table class="table-bordered table-sm">
                                            <thead>
                                                <tr class="h_background_color">
                                                    <th class="form-control1"> Calculate Charge </th>
                                                    <th class="form-control1"></th>
                                                    <th class="form-control1"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="editable-cell"> Chargeable Weight </td>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control" style="width: 100px"
                                                            v-model="other_charges.chargable_weight1" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="editable-cell"> Charge </td>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control" style="width: 100px"
                                                            v-model="other_charges.charge" />
                                                    </td>
                                                    <td class="editable-cell mb-2">
                                                        <b-button class="bg-secondary form-control-sm px-5"
                                                            @click="calculateCharge">Calculate</b-button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Charges Table -->
                                    <table class="table-bordered table-sm">
                                        <thead>
                                            <tr class="h_background_color">
                                                <th class="form-control1">Code</th>
                                                <th class="form-control1">Due</th>
                                                <th class="form-control1">Amount</th>
                                                <th class="form-control1">Type Of Payment</th>
                                                <th class="form-control1">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(charge, index) in form.charges" :key="index">
                                                <td class="editable-cell">
                                                    {{ charge.other_charge_code || charge.other_code }}
                                                </td>
                                                <td class="editable-cell">
                                                    {{ charge.due }}
                                                </td>
                                                <td class="editable-cell">
                                                    {{ charge.amount }}.00
                                                </td>
                                                <td class="editable-cell">
                                                    {{ charge.payment_type }}
                                                </td>
                                                <td class="editable-cell">
                                                    <b-button size="sm" @click="editCharge(index)">
                                                        <b-icon icon="pencil" font-scale="1"></b-icon>
                                                    </b-button>
                                                    <b-button size="sm" @click="removeCharge(index)">
                                                        <b-icon icon="trash"></b-icon>
                                                    </b-button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <hr class="hr" />

                                </b-tab>
                                <b-tab title="Special Handling Codes" style="background-color: white !important">
                                    <div>
                                        <b-row>
                                            <b-col cols="auto">
                                                <b-form-group id="fieldset-horizontal"
                                                    class="form-control-sm col-form-label mt-2">
                                                    <b-form-select class="form-control-sm" v-model="selectedCode"
                                                        :class="{ 'is-invalid': form.errors.has('special_handling_code') }">
                                                        <option disabled value="">Select Special Handling Codes</option>
                                                        <option v-for="code in codes" :key="code.value"
                                                            :value="code.value">{{ code.text }}</option>
                                                    </b-form-select>
                                                    <has-error :form="form" field="special_handling_code"></has-error>
                                                </b-form-group>
                                            </b-col>
                                            or:
                                            <b-col cols="auto">
                                                <b-form-group id="fieldset-horizontal"
                                                    class="form-control-sm col-form-label mt-2">
                                                    <b-form-input id="input-horizontal"
                                                        class="form-control-sm">or:</b-form-input>
                                                </b-form-group>
                                            </b-col>
                                            <b-col cols="auto">
                                                <b-form-group id="fieldset-horizontal"
                                                    class="form-control-sm col-form-label mt-2">
                                                    <b-button id="input-horizontal" class="form-control-sm"
                                                        type="button" @click="addManualCode">Add</b-button>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>
                                    </div>
                                    <div class="d-flex flex-column align-items-start py-5">
                                        <table class="table-bordered table-sm" style="width: 31%">
                                            <thead>
                                                <tr class="h_background_color">
                                                        <td class="editable-cell">Code</td>
                                                        <td class="editable-cell"></td>
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
                                </b-tab>
                                <b-tab title="Other Customs Information" style="background-color: white !important">
                                    <b-tabs class="mt-lg-5">
                                        <b-tab title="Other Customs Information" class="mt-lg-7">
                                            <div class="d-flex flex-column align-items-start py-5">
                                                <table class="table-bordered table-sm" style="width: 100%">
                                                    <thead>
                                                        <tr class="h_background_color">
                                                            <th class="form-control1">
                                                                Country Code:
                                                            </th>
                                                            <th class="form-control1"> Information Identifier: </th>
                                                            <th class="form-control1"> Customs Information Identifier
                                                            </th>
                                                            <th class="form-control1"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="editable-cell">
                                                                <b-form-group id="fieldset-horizontal"
                                                                    class="form-control-sm col-form-label"
                                                                    style="width: 350px;">
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
                                                            <td class="editable-cell">
                                                                <b-form-group id="fieldset-horizontal"
                                                                    class="form-control-sm col-form-label"
                                                                    style="width: 350px;">
                                                                    <b-form-select class="form-control-sm"
                                                                        v-model="oci_info.info_identifier"
                                                                        :class="{ 'is-invalid': form.errors.has('info_identifier') }">
                                                                        <option disabled value="">Select a code</option>
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
                                                                    <has-error :form="form"
                                                                        field="info_identifier"></has-error>
                                                        </b-form-group>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <b-form-group id="fieldset-horizontal"
                                                                    class="form-control-sm col-form-label"
                                                                    style="width: 350px;">
                                                                    <b-form-select class="form-control-sm"
                                                                        v-model="oci_info.custom_info_identifier"
                                                                        :class="{ 'is-invalid': form.errors.has('custom_info_identifier') }">
                                                                        <option disabled value="">Select a code</option>
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
                                                                    <has-error :form="form"
                                                                        field="custom_info_identifier"></has-error>
                                                                </b-form-group>
                                                            </td>
                                                        </tr>
                                                        
                                                        <tr>
                                                            <td class="editable-cell px-5">Supplementary Information:
                                                            </td>
                                                            <td class="editable-cell px-4">
                                                                <input type="text" class="form-control"
                                                                    style="width: 330px;"
                                                                    v-model="oci_info.supplementary_info"
                                                                    :class="{ 'is-invalid': form.errors.has('supplementary_info') }" />
                                                                <has-error :form="form"
                                                                    field="supplementary_info"></has-error>
                                                            </td>
                                                            <td class="editable-cell"></td>
                                                            <td class="editable-cell mb-2">
                                                                <b-form-group id="fieldset-horizontal"
                                                                    class="form-control-sm col-form-label mt-2">
                                                                    <b-button class="bg-secondary form-control-sm px-5" @click="addOtherCustomInfo">
                                                                        {{ editIndex !== null ? 'Update' : 'Add' }}
                                                                    </b-button>
                                                                </b-form-group>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!-- </div> -->
                                                <div class="mt-5 mb-5 pt-1 pb-1 px-4">

                                                    <table class="table table-sm" style="width:100%;">
                                                        <tbody>
                                                            <tr>
                                                                <th class="h_background_color"
                                                                    style="width:100%;max-width: 100%">Other Customs
                                                                    Information</th>
                                                                <th></th>
                                                                <th></th>
                                                                <th></th>
                                                                <th></th>
                                                                <th></th>
                                                            </tr>
                                                            <tr v-for="(row, index) in form.oci_entries" :key="index">
                                                                <td class="editable-cell">{{ row.country_code }}
                                                                </td>
                                                                <td class="editable-cell">{{ row.info_identifier }}
                                                                </td>
                                                                <td class="editable-cell">{{
                                                                    row.custom_info_identifier }}</td>
                                                                <td class="editable-cell">{{ row.supplementary_info
                                                                    }}</td>
                                                                <td class="editable-cell"
                                                                    style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                    <b-icon icon="pencil" font-scale="1" class="mr-2" style="cursor: pointer;" @click="editOciInfo(index)"></b-icon>
                                                                    <b-icon icon="trash" font-scale="1"
                                                                        @click="deleteOciInfo(index)">
                                                                    </b-icon>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </b-tab>

                                        <b-tab title="Other Customs Information Segment"
                                            style="background-color: white !important;">
                                            <div class="h_background_color mt-5 mb-5 pt-1 pb-1 px-4">
                                                <h5 class="">Other Customs Information Segment</h5>
                                            </div>
                                            <div class="py-7 px-3 d-flex align-items-end">
                                                <b-form-textarea style="width: 70% !important" id="textarea" rows="3"
                                                    max-rows="6"></b-form-textarea>
                                                <b-button class="ml-2">Upload</b-button>
                                            </div>
                                        </b-tab>
                                    </b-tabs>
                                </b-tab>
                            </b-tabs>
                        </div>
                        <hr class="hr" />
                        <div class="py-7">
                            <b-row class="justify-content-end">
                                <b-col cols="auto" class="text-right">
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                        label-for="input-horizontal" label="Email PDF copy To:"
                                        class="form-control-sm col-form-label">
                                        <b-form-input id="input-horizontal" class="form-control-sm"
                                            style="width: 320px"> </b-form-input>
                                    </b-form-group>
                                    <b-form-checkbox size="sm" class="text-left ml-4">Including Cargo
                                        Label</b-form-checkbox>
                                    <p>(separate addresses with a semicolon ';')</p>
                                </b-col>
                            </b-row>
                        </div>
                        <hr class="hr" />
                        <div class="py-7">
                            <div class="d-flex justify-content-end">
                                <b-button class="mr-2" @click="generateHawbPDF">Generate PDF</b-button>
                                <b-button class="mr-2" @click="converXml(form.first_box.awb_no)">Send</b-button>
                                <b-button class="mr-2">Send & Clear</b-button>
                                <!-- <b-button type="submit">Save Draft</b-button> -->
                                <b-button type="submit">{{submitButtonText}}</b-button>
                            </div>
                        </div>
                    </div>
                </b-form>
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
            mode: 'add',
            form: new Form({
                first_box:{
                    hawb_no: '',
                    awb_code: '',
                    awb_no: '',
                },
                shipper_address: {
                    ship_name: '',
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
                uld_info: [],
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
            selectedCode: '',
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
            countries:[],
            other_charges_code: [],
            location:[],
            filteredShippers: [],
            filteredConsignees: [],
            filteredAlsoNotify: [],
            isConsignmentAdded: false,
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
                            url: "/web-doc",
                            name: "Air Waybill(FWB)",
                        },
                        {
                            url: "/house-way-bill",
                            name: "House Waybill(FHL)",
                        },
                        {
                            url: "#consolidation",
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
        };
    },

    methods: {
        generateHawbPDF() {
            const itemId = this.$route.params.id; // Get the ID from the URL
            const pdfUrl = `/download-hawb-pdf/${itemId}`; // Construct the URL for the PDF
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
        // showModal() {
        //     this.$refs["my-modal"].show();
        // },
        // hideModal() {
        //     this.$refs["my-modal"].hide();
        // },
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
            const today = new Date();
            const day = today.getDate().toString().padStart(2, '0');
            const month = today.toLocaleString('en-GB', { month: 'short' });
            return `${day}${month}`;
        },
        formatDate(date) {
            if (!date) return '';
            const day = new Date(date).getDate().toString().padStart(2, '0');
            const month = new Date(date).toLocaleString('en-GB', { month: 'short' });

            return `${day}${month}`;
        },
        // handleDateChange(date) {
        //     this.form.routing_information.date = this.formatDate(date);
        // },
        handleDateChange(date, field) {
            const formattedDate = this.formatDate(date);
            const keys = field.split('.');
            let target = this;

            for (let i = 0; i < keys.length - 1; i++) {
            target = target[keys[i]];
            }
            target[keys[keys.length - 1]] = formattedDate;
        },
        issueDateChange(date) {
            this.form.agent_issue_date = this.formatDate(date);
        },
        // onSubmit(evt) {
        //     evt.preventDefault();
        //     this.form.post(`/create-houseway-bill`).then(response => {
        //         console.log(response);
        //     })
        // },
        onSubmit() {
            if (this.mode === 'add') {
                this.form.post('/create-houseway-bill')
                .then(response => {
                    console.log('Add Successful:', response);
                })
                .catch(error => {
                    console.error('Add Failed:', error);
                });
            } else if (this.mode === 'update') {
                this.form.put(`/update-houseway-bill/${this.existingData.id}`)
                .then(response => {
                    console.log('Update Successful:', response);
                    // this.$router.push({ path: '/house-way-bill' });
                })
                .catch(error => {
                    console.error('Update Failed:', error);
                });
            }
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
        getHouseWayBill(id) { 
            ApiService.get(`/houseway-bill/${id}`)
                .then(response => {
                    this.existingData = response.data;
                    this.openForm('update', this.existingData.id);
                })
                .catch(error => {
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        openForm(mode, id = null) {
            this.mode = mode;
            if (mode === 'update' && id) {
                    console.log("Data prepared for update, ID:", this.existingData);
                    this.form.first_box = this.existingData;
                    this.form.first_box.hawb_no = this.existingData.id;
                    this.form.routing_information = this.existingData;
                    this.form.totals = this.existingData;
                    this.form.custom_origin = this.existingData;
                    this.form.tableCodes = JSON.parse(this.existingData.special_handling_info);
                    this.form.oci_entries = Array.isArray(this.existingData.other_custom_information) ? this.existingData.other_custom_information : [];
                    
                    this.form.payment_info = this.existingData.payment_info || {};
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
                    this.form.consignee_address = this.existingData.way_bill_address;
                    this.form.shipper_address = this.existingData.way_bill_address;
                    this.form.also_notify_address = this.existingData.way_bill_address;
                } else {
                    // console.error('existingData is not an array:', this.existingData);
                    console.log("Add mode activated");
                }
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
        getLocation() {
            ApiService.get(`/get-location`).then(({ data }) => {
                this.location=data;
            });
        },
        getOtherChargesCode(){
            ApiService.get('/other-charges').then(({ data }) => {
                this.other_charges_code = Object.keys(data).map(key => ({
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
                } else {
                    this.agent_information = data;
                }
                })
                .catch(error => {
                    console.error("Error fetching agent information:", error);
                });
        },
        fetchShippers() {
            ApiService.get(`/get-shippers`).then(response => {
                this.shippers = response.data;
                this.filteredShippers = this.shippers.filter(shipper => shipper.address_type === 'shipper_address');
                // this.filteredShippers = this.shippers;
                // console.log('Shipper', response.data);
            });
        },
        fetchConsignee() {
            ApiService.get(`/get-shippers`).then(response => {
                this.consignees = response.data;
                this.filteredConsignees = this.consignees.filter(consignee => consignee.address_type === 'consignee_address');
                // this.filteredConsignees = this.consignees;
                // console.log('Shipper', response.data);
            });
        },
        fetchAlsoNotify() {
            ApiService.get(`/get-shippers`).then(response => {
                this.alsoNotify = response.data;
                console.log("fgweuf", response.data);
                this.filteredAlsoNotify = this.alsoNotify.filter(also_notify => also_notify.address_type === 'also_notify_address');
                // this.filteredConsignees = this.consignees;
                // console.log('Shipper', response.data);
            });
        },
        fillShipperDetails() {
            if (this.selectedShipper) {
                ApiService.get(`/get-shipper-address?id=${this.selectedShipper}`)
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
                ApiService.get(`/get-consignee-address?id=${this.selectedConsignee}`)
                .then( response => {
                    this.form.consignee_address = response.data; 
                    console.log('Consignee', response.data);
                })
                .catch(error => {
                    console.error('Error fetching shipper address:', error);
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
                ApiService.get(`/get-alsonotify-address?id=${this.selectAlsoNotify}`)
                .then( response => {
                    this.form.also_notify_address = response.data; 
                    console.log('Also Notify address', response.data);
                })
                .catch(error => {
                    console.error('Error fetching Also notify address address:', error);
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
        addCharge() {
            if (!this.other_charges.other_charge_code) {
                alert("Other charge code is mandatory.");
                return;
            }
            const amount = parseFloat(this.other_charges.amount);
            if (isNaN(amount) || amount <= 0) {
                alert("Amount is mandatory and must be a valid number greater than 0.");
                return;
            }

            const chargeData = {
                other_charge_code: this.other_charges.other_charge_code,
                other_code: this.other_charges.other_code,
                amount: parseFloat(this.other_charges.amount) || 0,
                due: this.other_charges.due,
                payment_type: this.other_charges.payment_type,
            };

            if (this.editIndex !== null) {
                this.$set(this.form.charges, this.editIndex, chargeData);
                this.editIndex = null;
            } else {
                this.form.charges.push(chargeData);
                console.log('Added new charge:', chargeData);
            }
            for (let key in this.other_charges) {
                if (this.other_charges.hasOwnProperty(key) && key !== 'due' && key !== 'payment_type') {
                    this.other_charges[key] = '';
                }
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
            this.edit_entry_index = index;
            this.consignment_list = { ...this.form.entries[index] };
            this.$refs.modalConsignment.show();
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
            this.consignment_list.post(`/get-house-consignment-error`)
            .then(response => {
                if (this.edit_entry_index !== null) {
                    this.form.entries[this.edit_entry_index] = { ...this.consignment_list };
                    // this.$set(this.form.entries, this.edit_entry_index, { ...this.consignment_list });
                    this.edit_entry_index = null;
                } else {
                    this.form.entries.push({ ...this.consignment_list });
                }
                this.calculateTotalVolume();
                this.calculateTotalAmount();
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
            })
            .catch(error => {
                console.error("There was an error with the consignment request:", error);
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
            if (this.form.entries.length === 0) {
                this.isConsignmentAdded = false;
            }
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
            this.consignment_list.uld_info.push({ uld_type, uld_serial, owner });
            this.consignment_list.uld_type = this.consignment_list.uld_serial = this.consignment_list.owner = "";
        },
        deleteUldInfo(index) {
            if (this.consignment_list.uld_info && this.consignment_list.uld_info.length > index) {
                this.consignment_list.uld_info.splice(index, 1);
            }
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
            const dropdownContainer_to = this.$refs.dropdownContainer_to2;
            if (!dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_to2 = false;
            }
        },
        closeDropdown_to3(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_to3;
            if (!dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_to3 = false;
            }
        },
        closeDropdown_departure(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_departure;
            if (!dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_departure = false;
            }
        },
        closeDropdown_destination(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_destination;
            if (!dropdownContainer_to.contains(event.target)) {
                this.isDropdownOpen_destination = false;
            }
        },
        closeDropdown_from(event) {
            const dropdownContainer_to = this.$refs.dropdownContainer_from;
            if (!dropdownContainer_to.contains(event.target)) {
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
    },
    mounted(){
        this.calculateTotalVolume();
        this.allHousewayBill();
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
        'agent_information.participate': function(newValue) {
            console.log('Participate value changed to:', newValue);
        },
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
    },
    created() {
        // this.getAgent();
    },
    computed: {
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
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
        filteredLocations_to2() {
            const query = this.form.routing_information.to_2.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
        filteredLocations_to3() {
            const query = this.form.routing_information.to_3.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
        filteredLocations_from() {
            const query = this.form.routing_information.from.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
        filteredLocations_destination() {
            const query = this.form.routing_information.destination_airport.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
        filteredLocations_departure() {
            const query = this.form.routing_information.departure_airport.toLowerCase().trim();
            if (!query) return this.location;

            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
            );
        },
        filteredLocations_issuing() {
            const query = this.agent_information.agent_issue_loc_code.toLowerCase().trim();
            if (!query) return this.location;
            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(query) ||
                item.destination.toLowerCase().includes(query)
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
</style>