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
                <b-button id="show-btn" @click="showModal" class="mx-2 custom-btn">Update Draft</b-button>

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
                        <b-form-group label-for="name-input" label="Created By:" v-slot="{ ariaDescribedby }">
                            <b-form-radio-group id="radio-slots" :options="options" :aria-describedby="ariaDescribedby"
                                name="radio-options-slots"></b-form-radio-group>
                        </b-form-group>
                        <hr class="hr" />
                        <b-row class="mt-5">
                            <b-col>
                                <a href="" class="custom-link">Edit e-AWB Data</a>
                                <a href="" class="custom-link">Copy e-AWB Data</a>
                                <a href="" class="custom-link">Create House Waybill from e-AWB Data</a>
                                <a href="" class="custom-link">Create Booking from e-AWB Data</a>
                                <a href="" class="custom-link">Create Flight Status from e-AWB Data</a>
                                <a href="" class="custom-link">Edit label</a>
                            </b-col>
                            <b-col>
                                <a href="" class="custom-link">e-AWB Pdf file</a>
                                <a href="" class="custom-link">Multipage e-AWB Pdf</a>
                                <a href="" class="custom-link">Multipage e-AWB Pdf with back pages</a>
                                <a href="" class="custom-link">Without IATA template</a>
                                <a href="" class="custom-link">1 Page generic e-AWB label</a>
                                <a href="" class="custom-link">e-AWB label per item (50 pages)</a>
                                <a href="" class="custom-link">Cargo Pouch label as a PDF</a>
                            </b-col>
                        </b-row>
                        <p>Issued at: 15 Jun 14:24 By: jgeorgeblr@gln.com</p>
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
                <h4> Create Master Air Waybill(e-AWB)
                    <span class="float-right">New</span>
                </h4>
            </div>
            <template>
                <b-form @submit="onSubmit">
                    <div class="container">
                        <b-row class="mt-5">
                            <b-col cols="auto">
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label="AWB No:*" label-for="input-horizontal"
                                    class="form-control-sm col-form-label">
                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 50px"
                                        v-model="form.awb_code"
                                        :class="{ 'is-invalid': form.errors.has('awb_code') }"></b-form-input>
                                    <has-error :form="form" field="awb_code"></has-error>
                                </b-form-group>
                            </b-col>
                            -
                            <b-col cols="auto">
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label">
                                    <b-form-input id="input-horizontal" class="form-control-sm" style="width: 90px"
                                        v-model="form.awb_no"
                                        :class="{ 'is-invalid': form.errors.has('awb_no') }"></b-form-input>
                                    <has-error :form="form" field="awb_no"></has-error>
                                </b-form-group>
                            </b-col>
                            <b-col cols="auto mr-7">
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label="" label-for="input-horizontal"
                                    class="form-control-sm col-form-label">
                                    <b-form-checkbox size="sm" v-model="form.consolidated_MAWB">Consolidate
                                        MAWB</b-form-checkbox>
                                </b-form-group>
                            </b-col>
                            <b-col cols="auto ml-7" style="padding-left: 9.3%">
                                <b-form-group label-for="name-input">
                                    <b-form-radio name="radio-size" size="sm" v-model="form.awb"
                                        value="true">AWB</b-form-radio>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row class="justify-content-center mt-5">
                            <b-col cols="auto" style="padding-left: 33.6%">
                                <b-form-group label-for="">
                                    <b-form-radio name="radio-size" size="sm" value="EAW" v-model="selectedCode"
                                        @change="handleRadioChange">e-AWB With No Accompanying Paper
                                        Documents</b-form-radio>
                                </b-form-group>
                            </b-col>
                            <b-col cols="auto" class="">
                                <b-form-group label-for="name-input">
                                    <b-form-radio name="radio-size" size="sm">e-CSD AWB</b-form-radio>
                                </b-form-group>
                            </b-col>
                            <b-col cols="auto" style="margin-left: 22.5%">
                                <b-form-group label-for="name-input">
                                    <b-form-radio name="radio-size" size="sm" @change="handleRadioChange"
                                        v-model="selectedCode" value="EAP">e-AWB With Accompanying Paper
                                        Documents</b-form-radio>
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
                                            <div class="flex-grow-1">
                                                <select class="custom-select form-control-sm" style="width: 320px">
                                                    <option disabled value=""> Select a Shipper</option>
                                                    <option value="ABS">A</option>
                                                    <option value="BDE">B</option>
                                                    <option value="RTY">C</option>
                                                </select>
                                            </div>
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
                                                    v-model="form.shipper_address.name"
                                                    :class="{ 'is-invalid': form.errors.has('ship_name') }"></b-form-input>
                                                <has-error :form="form" field="ship_name"></has-error>
                                            </b-form-group>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal" label="Account:"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-15"
                                                v-model="form.shipper_address.account"
                                                :class="{ 'is-invalid': form.errors.has('ship_account') }"></b-form-input>
                                            <has-error :form="form" field="ship_account"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Address:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-15"
                                                style="width: 220px" v-model="form.shipper_address.address"
                                                :class="{ 'is-invalid': form.errors.has('ship_address') }"></b-form-input>
                                            <has-error :form="form" field="ship_address"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-31"
                                                style="width: 220px" v-model="form.shipper_address.address_line_2"
                                                :class="{ 'is-invalid': form.errors.has('ship_address_line_2') }"></b-form-input>
                                            <has-error :form="form" field="ship_address_line_2"></has-error>
                                        </b-form-group>
                                        <div class="d-flex align-items-center mt-1">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label" label="City:">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-22"
                                                    v-model="form.shipper_address.city"
                                                    :class="{ 'is-invalid': form.errors.has('ship_city') }"></b-form-input>
                                                <has-error :form="form" field="ship_city"></has-error>
                                            </b-form-group>
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                style="width: 50px" v-model="form.shipper_address.airport_code"
                                                :class="{ 'is-invalid': form.errors.has('ship_airport_code') }"></b-form-input>
                                            <has-error :form="form" field="ship_airport_code"></has-error>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Post Code:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-11"
                                                v-model="form.shipper_address.post_code"
                                                :class="{ 'is-invalid': form.errors.has('ship_post_code') }"></b-form-input>
                                            <has-error :form="form" field="ship_post_code"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="State:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-20"
                                                v-model="form.shipper_address.state"
                                                :class="{ 'is-invalid': form.errors.has('ship_state') }"></b-form-input>
                                            <has-error :form="form" field="ship_state"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-s
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3 mb-3" label="Country:">
                                            <b-form-select class="form-control-sm ml-lg-15" style="width: 220px"
                                                v-model="form.shipper_address.country"
                                                :class="{ 'is-invalid': form.errors.has('ship_country') }">
                                                <option disabled value=""> Please select one</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option Value="c">C</option>
                                            </b-form-select>
                                            <has-error :form="form" field="ship_country"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Phone:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-17"
                                                v-model="form.shipper_address.phone"
                                                :class="{ 'is-invalid': form.errors.has('ship_phone') }"></b-form-input>
                                            <has-error :form="form" field="ship_phone"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Fax:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-22"
                                                v-model="form.shipper_address.fax"
                                                :class="{ 'is-invalid': form.errors.has('ship_fax') }"></b-form-input>
                                            <has-error :form="form" field="ship_fax"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Telex:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-19"
                                                v-model="form.shipper_address.telex"></b-form-input>
                                        </b-form-group>

                                        <b-form-checkbox size="sm" class="ml-lg-35" v-model="is_shipper_address_save"
                                            @change="SaveAddress('shipper_address')"> Save new address to address
                                            book</b-form-checkbox>
                                    </b-col>
                                </b-col>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label="" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mt-2">
                                    <b-form-checkbox size="sm" class="mt-2 text-bold">Set as default e-AWB shipper for
                                        later logins</b-form-checkbox>
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
                                                <select class="custom-select form-control-sm" style="width: 320px"
                                                    :class="{ 'is-invalid': form.errors.has('cons_name') }"
                                                    v-model="form.cons_name">
                                                    <option disabled value=""> Select a Consignee</option>
                                                    <option value="ABC">A</option>
                                                    <option value="BDE">B</option>
                                                    <option value="CAB">C</option>
                                                </select>
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
                                                    v-model="form.consignee_address.name"
                                                    :class="{ 'is-invalid': form.errors.has('cons_name') }"></b-form-input>
                                                <has-error :form="form" field="cons_name"></has-error>
                                            </b-form-group>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal" label="Account:"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                v-model="form.consignee_address.account"
                                                :class="{ 'is-invalid': form.errors.has('cons_account') }"></b-form-input>
                                            <has-error :form="form" field="cons_account"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Address:">
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                style="width: 220px"
                                                v-model="form.consignee_address.address"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-16"
                                                style="width: 220px" v-model="form.consignee_address.address_line_2"
                                                :class="{ 'is-invalid': form.errors.has('cons_address_line_2') }"></b-form-input>
                                            <has-error :form="form" field="cons_address_line_2"></has-error>
                                        </b-form-group>
                                        <div class="d-flex align-items-center mt-1">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label" label="City:">
                                                <b-form-input id="input-horizontal" class="form-control-sm ml-lg-8"
                                                    v-model="form.consignee_address.city"
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
                                                v-model="form.consignee_address.post_code"
                                                :class="{ 'is-invalid': form.errors.has('cons_post_code') }"></b-form-input>
                                            <has-error :form="form" field="cons_post_code"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="State:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-6"
                                                v-model="form.consignee_address.state"
                                                :class="{ 'is-invalid': form.errors.has('cons_state') }"></b-form-input>
                                            <has-error :form="form" field="cons_state"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3 mb-3" label="Country:">
                                            <b-form-select class="form-control-sm ml-lg-1" style="width: 220px"
                                                v-model="form.consignee_address.country"
                                                :class="{ 'is-invalid': form.errors.has('cons_country') }">
                                                <option disabled value="Please select one"> Please select one</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                            </b-form-select>
                                            <has-error :form="form" field="cons_country"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Phone:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-3"
                                                v-model="form.consignee_address.phone"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Fax:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-8"
                                                v-model="form.consignee_address.fax"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Telex:">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-5"
                                                v-model="form.consignee_address.telex"></b-form-input>
                                        </b-form-group>

                                        <b-form-checkbox size="sm" class="ml-lg-21" v-model="is_consignee_address_save"
                                            @change="SaveAddress('consignee_address')"> Save new address to address
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
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                label="Departure Airport*" label-for="input-departure-airport"
                                                class="form-control-sm">
                                                <b-form-select class="form-control" style="width: 150px"
                                                    v-model="form.departure_airport"
                                                    :class="{ 'is-invalid': form.errors.has('cons_state') }">
                                                    <option disabled value=""> Select a Rate Class</option>
                                                    <option value="ABY, Albany (ABY), United States"> ABY, Albany (ABY),
                                                        United States</option>
                                                    <option value="ABZ, Aberdeen (ABZ), United Kingdom">
                                                        ABZ, Aberdeen (ABZ), United
                                                        Kingdom
                                                    </option>
                                                </b-form-select>
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
                                                label="Destination Airport: *" label-for="input-departure-airport"
                                                class="form-control-sm col-form-label">
                                                <!-- <b-form-input id="input-departure-airport"
                                                    class="form-control-sm"></b-form-input> -->
                                                <b-form-select class="form-control" style="width: 150px"
                                                    v-model="form.destination_airport"
                                                    :class="{ 'is-invalid': form.errors.has('destination_airport') }">
                                                    <option disabled value=""> Select a Rate Class</option>
                                                    <option value="ABY, Albany (ABY), United States">ABY, Albany (ABY),
                                                        United States</option>
                                                    <option value="ABZ, Aberdeen (ABZ), United Kingdom"> ABZ, Aberdeen
                                                        (ABZ), United Kingdom</option>
                                                </b-form-select>
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
                                                                <b-form-select class="form-control"
                                                                    style="width: 150px;"
                                                                    v-model="form.departure_airport"
                                                                    :class="{ 'is-invalid': form.errors.has('from') }">
                                                                    <option disabled>Select a Rate Class</option>
                                                                    <option value="ABY, Albany (ABY), United States">
                                                                        ABY, Albany (ABY), United States</option>
                                                                    <option value="ABZ, Aberdeen (ABZ), United Kingdom">
                                                                        ABZ, Aberdeen (ABZ), United Kingdom</option>
                                                                </b-form-select>
                                                                <has-error :form="form" field="from"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <b-form-select class="form-control"
                                                                    style="width: 150px;" v-model="form.to"
                                                                    :class="{ 'is-invalid': form.errors.has('to') }">
                                                                    <option disabledvalue=""> Select a Rate Class
                                                                    </option>
                                                                    <option value="ABY, Albany (ABY), United States">
                                                                        ABY, Albany (ABY), United States</option>
                                                                    <option value="ABZ, Aberdeen (ABZ), United Kingdom">
                                                                        ABZ, Aberdeen (ABZ), United Kingdom</option>
                                                                </b-form-select>
                                                                <has-error :form="form" field="to"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 40px;" v-model="form.by"
                                                                    :class="{ 'is-invalid': form.errors.has('by') }" />
                                                                <has-error :form="form" field="by"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style=" width: 50px;" v-model="form.flight"
                                                                    :class="{ 'is-invalid': form.errors.has('flight') }" />
                                                                <has-error :form="form" field="flight"></has-error>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 60px;" v-model="form.date"
                                                                    :class="{ 'is-invalid': form.errors.has('date') }" />
                                                                <has-error :form="form" field="date"></has-error>
                                                            </td>
                                                            <td class="editable-cell w-10" style="width: 60px">
                                                                <date-picker valueType="format"
                                                                    style="width: 30px !important;"
                                                                    @change="handleDateChange"></date-picker>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </b-row>
                                    <b-row class="justify-content-end" style="margin-right: 23%">
                                        <div class="d-flex flex-column justify-content-end">
                                            <table class="mx-auto table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <b-form-select class="form-control" style="width: 150px"
                                                                v-model="form.to_2"
                                                                :class="{ 'is-invalid': form.errors.has('to_2') }">
                                                                <option disabled value=""> Select 2 a Rate Class
                                                                </option>
                                                                <option value="ABY, Albany (ABY), United States">ABY,
                                                                    Albany (ABY), United States</option>
                                                                <option value="ABZ, Aberdeen (ABZ), United Kingdom">
                                                                    ABZ, Aberdeen (ABZ), United Kingdom</option>
                                                            </b-form-select>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 40px"
                                                                v-model="form.by_2"
                                                                :class="{ 'is-invalid': form.errors.has('by_2') }" />
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 50px"
                                                                v-model="form.flight_2"
                                                                :class="{ 'is-invalid': form.errors.has('flight_2') }" />
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 60px"
                                                                v-model="form.date_2"
                                                                :class="{ 'is-invalid': form.errors.has('date_2') }" />
                                                        </td>
                                                        <td class="editable-cell w-10" style="width: 60px !important;">
                                                            <date-picker valueType="format"
                                                                style=" width: 30px !important;"
                                                                @change="handleDateChange"></date-picker>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!-- </div> -->
                                        </div>
                                    </b-row>
                                    <b-row class="justify-content-end" style="margin-right: 23%">
                                        <div class="d-flex flex-column justify-content-end">
                                            <table class="mx-auto table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <b-form-select class="form-control" style="width: 150px"
                                                                v-model="form.to_3"
                                                                :class="{ 'is-invalid': form.errors.has('to_3') }">
                                                                <option disabled value=""> Select 3 a Rate Class
                                                                </option>
                                                                <option value="ABY, Albany (ABY), United States">ABY,
                                                                    Albany (ABY), United States</option>
                                                                <option value="ABZ, Aberdeen (ABZ), United Kingdom">ABZ,
                                                                    Aberdeen (ABZ), United Kingdom</option>
                                                            </b-form-select>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 40px"
                                                                v-model="form.by_3"
                                                                :class="{ 'is-invalid': form.errors.has('by_3') }" />
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 50px"
                                                                v-model="form.flight_3"
                                                                :class="{ 'is-invalid': form.errors.has('flight_3') }" />
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width: 60px"
                                                                v-model="form.date_3"
                                                                :class="{ 'is-invalid': form.errors.has('date_3') }" />
                                                        </td>
                                                        <td class="editable-cell" style="width: 60px !important;">
                                                            <date-picker valueType="format"
                                                                style=" width: 30px !important;"
                                                                @change="handleDateChange"></date-picker>
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
                                                            :value="getOriginCode(form.departure_airport)" />
                                                    </td>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control"
                                                            :value="getDestinationCode(form.destination_airport)" />
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
                                <div>
                                    <b-button class="btn-secondary mr-2">
                                        <b-icon icon="search" font-scale="1"></b-icon>Get Rates
                                    </b-button>
                                    <b-button class="btn-secondary">
                                        <b-icon icon="calendar2-minus-fill" font-scale="1"></b-icon>Collect house
                                        waybill sum's
                                    </b-button>
                                </div>
                            </div>
                            <b-button class="mt-5" v-b-modal.modal-consignment variant="warning">Add Consignment
                                Information</b-button>
                            <b-modal id="modal-consignment" ref="modalConsignment" title="Consignment Information"
                                size="xl" ok-only hide-footer>
                                <div class="d-block">
                                    <b-row>
                                        <!-- First Column -->
                                        <b-col cols="6">
                                            <h6>Pieces and Nature and Quantity of Goods</h6>
                                            <div class="bg-light pl-2">
                                                <label for="">Pieces</label>
                                                <b-form-input id="input-departure-airport" class="form-control-sm"
                                                    v-model="consignment_list.pieces"></b-form-input>
                                                <label for="">Description</label>
                                                <b-form-textarea
                                                    style="grid-column: span 2 !important;width: 100% !important;"
                                                    id="textarea" rows="3" max-rows="6"
                                                    v-model="consignment_list.description"></b-form-textarea>
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
                                                                    v-model="consignment_list.rate_class">
                                                                    <option disabled value="">Select a Rate Class
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
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 170px;"
                                                                    v-model="consignment_list.uld_rate_class" />
                                                            </td>
                                                        </tr>
                                                        <tr v-if="consignment_list.rate_class">
                                                            <td colspan="4" class="editable-cell">
                                                                <div
                                                                    class="d-flex justify-content-end align-items-center">
                                                                    <span class="mr-2">Charge:</span>
                                                                    <input type="text" class="form-control"
                                                                        style="width: 170px;"
                                                                        v-model="consignment_list.total_amount" />
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
                                                                    v-model="consignment_list.service_code">
                                                                    <option disabled value="">Select a Service Code
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
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 170px;"
                                                                    v-model="consignment_list.commodity_item" />
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
                                                                    v-model="consignment_list.country_origin_goods">
                                                                    <option disabled value=""> Select a Country</option>
                                                                    <option value="AF"> Afghanistan</option>
                                                                    <option value="AX"> Åland Islands </option>
                                                                    <option value="AL">Albania</option>
                                                                    <option value="DZ">Algeria</option>
                                                                    <option value="AS">American Samoa </option>
                                                                    <option value="AD"> Andorra</option>
                                                                    <option value="AO"> Angola</option>
                                                                    <option value="AI"> Anguilla</option>
                                                                    <option value="AQ"> Antarctica</option>
                                                                    <option value="AG"> Antigua and Barbuda</option>
                                                                    <option value="AR"> Argentina</option>
                                                                    <option value="AM">Armenia</option>
                                                                    <option value="AW">Aruba</option>
                                                                    <option value="AU"> Australia</option>
                                                                    <option value="AT"> Austria</option>
                                                                    <option value="AZ"> Azerbaijan</option>
                                                                    <option value="BS"> Bahamas</option>
                                                                    <option value="BH">Bahrain</option>
                                                                    <option value="BD">Bangladesh</option>
                                                                    <option value="BB">Barbados</option>
                                                                    <option value="BY">Belarus</option>
                                                                    <option value="BE">Belgium</option>
                                                                    <option value="BZ">Belize</option>
                                                                    <option value="BJ">Benin</option>
                                                                    <option value="BM"> Bermuda</option>
                                                                    <option value="BT"> Bhutan</option>
                                                                    <option value="BO"> Bolivia, Plurinational State of
                                                                    </option>
                                                                    <option value="BA"> Bosnia and Herzegovina</option>
                                                                    <option value="BW"> Botswana</option>
                                                                    <option value="BV">Bouvet Island</option>
                                                                    <option value="BR"> Brazil</option>
                                                                    <option value="IO"> British Indian Ocean Territory
                                                                    </option>
                                                                    <option value="BN">Brunei Darussalam</option>
                                                                    <option value="BG"> Bulgaria</option>
                                                                    <option value="BF">Burkina Faso</option>
                                                                    <option value="BI">Burundi</option>
                                                                    <option value="KH">Cambodia</option>
                                                                    <option value="CM">Cameroon</option>
                                                                    <option value="CA">Canada</option>
                                                                    <option value="CV"> Cape Verde</option>
                                                                    <option value="KY"> Cayman Islands</option>
                                                                    <option value="CF"> Central African Republic
                                                                    </option>
                                                                    <option value="TD">Chad</option>
                                                                    <option value="CL">Chile</option>
                                                                    <option value="CN">China</option>
                                                                    <option value="CX">Christmas Island</option>
                                                                    <option value="CC">Cocos (Keeling) Islands</option>
                                                                    <option value="CO">Colombia</option>
                                                                    <option value="KM">Comoros</option>
                                                                    <option value="CG">Congo</option>
                                                                    <option value="CD">Congo, the Democratic Republic of
                                                                        the</option>
                                                                    <option value="CK">Cook Islands</option>
                                                                    <option value="CR">Costa Rica</option>
                                                                    <option value="CI">Côte d'Ivoire</option>
                                                                    <option value="HR">Croatia</option>
                                                                    <option value="CU">Cuba</option>
                                                                    <option value="CY">Cyprus</option>
                                                                    <option value="CZ">Czech Republic</option>
                                                                    <option value="DK">Denmark</option>
                                                                    <option value="DJ">Djibouti</option>
                                                                    <option value="DM">Dominica</option>
                                                                    <option value="DO">Dominican Republic</option>
                                                                    <option value="EC">Ecuador</option>
                                                                    <option value="EG">Egypt</option>
                                                                    <option value="SV">El Salvador</option>
                                                                    <option value="GQ">Equatorial Guinea</option>
                                                                    <option value="ER">Eritrea</option>
                                                                    <option value="EE">Estonia
                                                                    </option>
                                                                    <option value="ET">Ethiopia</option>
                                                                    <option value="FK">Falkland Islands (Malvinas)
                                                                    </option>
                                                                    <option value="FO">Faroe Islands</option>
                                                                    <option value="FJ">Fiji</option>
                                                                    <option value="FI">Finland</option>
                                                                    <option value="FR">France</option>
                                                                    <option value="GF">French Guiana</option>
                                                                    <option value="PF">French Polynesia</option>
                                                                    <option value="TF">French Southern Territories
                                                                    </option>
                                                                    <option value="GA">Gabon</option>
                                                                    <option value="GM">Gambia</option>
                                                                    <option value="GE">Georgia</option>
                                                                    <option value="DE">Germany</option>
                                                                    <option value="GH">Ghana</option>
                                                                    <option value="GI">Gibraltar</option>
                                                                    <option value="GR">Greece</option>
                                                                    <option value="GL">Greenland</option>
                                                                    <option value="GD">Grenada</option>
                                                                    <option value="GP">Guadeloupe</option>
                                                                    <option value="GU">Guam</option>
                                                                    <option value="GT">Guatemala</option>
                                                                    <option value="GG">Guernsey</option>
                                                                    <option value="GN">Guinea</option>
                                                                    <option value="GW">Guinea-Bissau</option>
                                                                    <option value="GY">Guyana</option>
                                                                    <option value="HT">Haiti</option>
                                                                    <option value="HM">Heard Island and McDonald Islands
                                                                    </option>
                                                                    <option value="VA">Holy See (Vatican City State)
                                                                    </option>
                                                                    <option value="HN">Honduras</option>
                                                                    <option value="HK">Hong Kong</option>
                                                                    <option value="HU">Hungary</option>
                                                                    <option value="IS">Iceland</option>
                                                                    <option value="IN">India</option>
                                                                    <option value="ID">Indonesia</option>
                                                                    <option value="IR">Iran, Islamic Republic of
                                                                    </option>
                                                                    <option value="IQ">Iraq</option>
                                                                    <option value="IE">Ireland</option>
                                                                    <option value="IM">Isle of Man</option>
                                                                    <option value="IL">Israel</option>
                                                                    <option value="IT">Italy</option>
                                                                    <option value="JM">Jamaica</option>
                                                                    <option value="JP">Japan</option>
                                                                    <option value="JE">Jersey</option>
                                                                    <option value="JO">Jordan</option>
                                                                    <option value="KZ">Kazakhstan</option>
                                                                    <option value="KE">Kenya</option>
                                                                    <option value="KI">Kiribati</option>
                                                                    <option value="KP">Korea, Democratic People's
                                                                        Republic of</option>
                                                                    <option value="KR">Korea, Republic of</option>
                                                                    <option value="KW"> Kuwait</option>
                                                                    <option value="KG">Kyrgyzstan</option>
                                                                    <option value="LA">Lao People's Democratic Republic
                                                                    </option>
                                                                    <option value="LV">Latvia</option>
                                                                    <option value="LB">Lebanon</option>
                                                                    <option value="LS">Lesotho</option>
                                                                    <option value="LR">Liberia</option>
                                                                    <option value="LY">Libyan Arab Jamahiriya</option>
                                                                    <option value="LI">Liechtenstein</option>
                                                                    <option value="LT">Lithuania</option>
                                                                    <option value="LU">Luxembourg</option>
                                                                    <option value="MO">Macao</option>
                                                                    <option value="MK">Macedonia, the former Yugoslav
                                                                        Republic of</option>
                                                                    <option value="MG">Madagascar</option>
                                                                    <option value="MW">Malawi</option>
                                                                    <option value="MY">Malaysia</option>
                                                                    <option value="MV">Maldives</option>
                                                                    <option value="ML">Mali</option>
                                                                    <option value="MT">Malta</option>
                                                                    <option value="MH">Marshall Islands</option>
                                                                    <option value="MQ">Martinique</option>
                                                                    <option value="MR">Mauritania</option>
                                                                    <option value="MU">Mauritius</option>
                                                                    <option value="YT">Mayotte</option>
                                                                    <option value="MX">Mexico</option>
                                                                    <option value="FM">Micronesia, Federated States of
                                                                    </option>
                                                                    <option value="MD">Moldova, Republic of</option>
                                                                    <option value="MC">Monaco</option>
                                                                    <option value="MN">Mongolia</option>
                                                                    <option value="ME">Montenegro</option>
                                                                    <option value="MS">Montserrat</option>
                                                                    <option value="MA">Morocco</option>
                                                                    <option value="MZ">Mozambique</option>
                                                                    <option value="MM">Myanmar</option>
                                                                    <option value="NA">Namibia</option>
                                                                    <option value="NR">Nauru</option>
                                                                    <option value="NP">Nepal</option>
                                                                    <option value="NL">Netherlands</option>
                                                                    <option value="AN">Netherlands Antilles</option>
                                                                    <option value="NC">New Caledonia</option>
                                                                    <option value="NZ">New Zealand</option>
                                                                    <option value="NI">Nicaragua</option>
                                                                    <option value="NE">Niger</option>
                                                                    <option value="NG">Nigeria</option>
                                                                    <option value="NU">Niue</option>
                                                                    <option value="NF">Norfolk Island</option>
                                                                    <option value="MP">Northern Mariana Islands</option>
                                                                    <option value="NO">Norway</option>
                                                                    <option value="OM">Oman</option>
                                                                    <option value="PK">Pakistan</option>
                                                                    <option value="PW">Palau</option>
                                                                    <option value="PS">Palestinian Territory, Occupied
                                                                    </option>
                                                                    <option value="PA">Panama</option>
                                                                    <option value="PG">Papua New Guinea</option>
                                                                    <option value="PY">Paraguay</option>
                                                                    <option value="PE">Peru</option>
                                                                    <option value="PH">Philippines</option>
                                                                    <option value="PN">Pitcairn</option>
                                                                    <option value="PL">Poland</option>
                                                                    <option value="PT">Portugal</option>
                                                                    <option value="PR">Puerto Rico</option>
                                                                    <option value="QA">Qatar</option>
                                                                    <option value="RE">Réunion</option>
                                                                    <option value="RO">Romania</option>
                                                                    <option value="RU">Russian Federation</option>
                                                                    <option value="RW">Rwanda</option>
                                                                    <option value="BL">Saint Barthélemy</option>
                                                                    <option value="SH">Saint Helena, Ascension and
                                                                        Tristan da Cunha</option>
                                                                    <option value="KN">Saint Kitts and Nevis</option>
                                                                    <option value="LC">Saint Lucia</option>
                                                                    <option value="MF">Saint Martin (French part)
                                                                    </option>
                                                                    <option value="PM">Saint Pierre and Miquelon
                                                                    </option>
                                                                    <option value="VC">Saint Vincent and the Grenadines
                                                                    </option>
                                                                    <option value="WS">Samoa</option>
                                                                    <option value="SM">San Marino</option>
                                                                    <option value="ST">Sao Tome and Principe</option>
                                                                    <option value="SA"> Saudi Arabia</option>
                                                                    <option value="SN">Senegal</option>
                                                                    <option value="RS">Serbia</option>
                                                                    <option value="SC">Seychelles</option>
                                                                    <option value="SL">Sierra Leone</option>
                                                                    <option value="SG">Singapore</option>
                                                                    <option value="SK">Slovakia</option>
                                                                    <option value="SI">Slovenia</option>
                                                                    <option value="SB">Solomon Islands</option>
                                                                    <option value="SO">Somalia</option>
                                                                    <option value="ZA">South Africa</option>
                                                                    <option value="GS">South Georgia and the South
                                                                        Sandwich Islands</option>
                                                                    <option value="SS">South Sudan</option>
                                                                    <option value="ES">Spain</option>
                                                                    <option value="LK">Sri Lanka</option>
                                                                    <option value="SD">Sudan</option>
                                                                    <option value="SR">Suriname</option>
                                                                    <option value="SJ">Svalbard and Jan Mayen </option>
                                                                    <option value="SZ">Swaziland </option>
                                                                    <option value="SE">Sweden </option>
                                                                    <option value="CH">Switzerland</option>
                                                                    <option value="SY">Syrian Arab Republic</option>
                                                                    <option value="TW">Taiwan, Republic of China
                                                                    </option>
                                                                    <option value="TJ">Tajikistan</option>
                                                                    <option value="TZ">Tanzania, United Republic of
                                                                    </option>
                                                                    <option value="TH">Thailand</option>
                                                                    <option value="TL">Timor-Leste</option>
                                                                    <option value="TG">Togo</option>
                                                                    <option value="TK">Tokelau</option>
                                                                    <option value="TO">Tonga</option>
                                                                    <option value="TT">Trinidad and Tobago </option>
                                                                    <option value="TN">Tunisia </option>
                                                                    <option value="TR">Turkey</option>
                                                                    <option value="TM">Turkmenistan </option>
                                                                    <option value="TC">Turks and Caicos Islands</option>
                                                                    <option value="TV">Tuvalu</option>
                                                                    <option value="UG">Uganda</option>
                                                                    <option value="UA">Ukraine</option>
                                                                    <option value="AE">United Arab Emirates </option>
                                                                    <option value="GB">United Kingdom</option>
                                                                    <option value="US">United States</option>
                                                                    <option value="UM">United States Minor Outlying
                                                                        Islands</option>
                                                                    <option value="UY">Uruguay</option>
                                                                    <option value="UZ">Uzbekistan</option>
                                                                    <option value="VU">Vanuatu</option>
                                                                    <option value="VE">Venezuela, Bolivarian Republic of
                                                                    </option>
                                                                    <option value="VN">Viet Nam</option>
                                                                    <option value="VG">Virgin Islands, British</option>
                                                                    <option value="VI">Virgin Islands, U.S.</option>
                                                                    <option value="WF">Wallis and Futuna</option>
                                                                    <option value="EH">Western Sahara</option>
                                                                    <option value="YE">Yemen</option>
                                                                    <option value="ZM">Zambia</option>
                                                                    <option value="ZW">Zimbabwe</option>
                                                                </b-form-select>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 170px;"
                                                                    v-model="consignment_list.slac" />
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
                                                                    v-model="consignment_list.hs_code"
                                                                    :class="{ 'is-invalid': consignment_list.errors.has('hs_code') }"></b-form-input>
                                                                <has-error :form="form" field="hs_code"></has-error>
                                                                <button @click="addHsCode">Add</button>
                                                            </td>
                                                        </tr>
                                                        <tr class="h_background_color">
                                                            <th>HS Codes</th>
                                                        </tr>
                                                        <tr v-for="(code, index) in consignment_list.hsCodes"
                                                            :key="index">
                                                            <td class="editable-cell"
                                                                style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                <span>{{ code.hs_code }}</span>
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
                                                                    v-model="consignment_list.gross_weight" />
                                                            </td>
                                                            <td class="editable-cell">
                                                                <b-form-select class="form-control"
                                                                    style=" width: 70px;"
                                                                    v-model="consignment_list.weight_code">
                                                                    <option value="K">Kgs</option>
                                                                    <option value="L">Lbs</option>
                                                                </b-form-select>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style="width: 70px;"
                                                                    v-model="consignment_list.chargable_weight" />
                                                            </td>
                                                            <td class="editable-cell">
                                                                <input type="text" class="form-control"
                                                                    style=" width: 100px;"
                                                                    v-model="consignment_list.rate" />
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
                                                                    v-model="consignment_list.gross_weight" />
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
                                                                <input type="text" class="form-control"
                                                                    style="width: 100%;"
                                                                    v-model="consignment_list.height" />
                                                            </td>
                                                            <td class="editable-cell">
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
                                                            <td class="editable-cell">{{ row.gross_weight }}</td>
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
                                                            v-model="consignment_list.dimention_unit">
                                                            <option value="CC">cm³</option>
                                                            <option value="MC">m³</option>
                                                            <option value="CF">ft³</option>
                                                            <option value="CI">in³</option>
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
                                                <th class="form-control1">Detailed Pcs. Info</th>
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
                                                <td>{{ entry.pcs }}</td>
                                                <td>{{ entry.description }}</td>
                                                <td>{{ entry.service_code }}</td>
                                                <td>{{ entry.commodity_item }}</td>
                                                <td>{{ entry.gross_weight }}, {{ entry.weight_code }}</td>
                                                <td>{{ entry.chargable_weight }}</td>
                                                <td>{{ entry.rate }}</td>
                                                <td>
                                                    <div v-for="(pcs, pcsIndex) in entry.itemss" :key="pcsIndex"
                                                        class="mb-1">
                                                        {{ pcs.pcs }}-{{ pcs.gross_weight }}-{{ pcs.weight_code }}-{{
                                                            pcs.length }}x{{ pcs.width }}x{{ pcs.height }}-{{ pcs.unit }}
                                                    </div>
                                                </td>
                                                <!-- <td>{{ entry.pcs }}-{{ entry.gross_weight }}-{{ entry.weight_code }}-{{ entry.length }}x{{ entry.width }}x{{ entry.height }}-{{ entry.unit }}</td> -->
                                                <td>{{ entry.volume }}</td>
                                                <td>{{ entry.rate_class }}</td>
                                                <td>{{ entry.uld_rate_class }}</td>
                                                <td>{{ entry.total_amount }}</td>
                                                <!-- <td>{{ entry.hs_code }}</td> -->
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
                                <div class="d-flex justify-content-end ml-auto">
                                    <div class="d-flex align-items-center">
                                        <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-">
                                            <div class="d-flex align-items-center">
                                                <label for="input-horizontal" class="mr-2 mb-0">Total Volume:</label>
                                                <b-form-input id="input-horizontal" class="form-control-sm mr-2"
                                                    v-model="form.total_valume"></b-form-input>
                                                <b-form-select class="form-control-sm" v-model="form.dimention_unit">
                                                    <option value="CC">cm³</option>
                                                    <option value="MC">m³</option>
                                                    <option value="CF">ft³</option>
                                                    <option value="CI">in³</option>
                                                </b-form-select>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <label for="input-horizontal" class="mr-2 mb-0">Total Amount:</label>
                                                <b-form-input id="input-horizontal" class="form-control-sm mr-2"
                                                    v-model="form.total_amount"></b-form-input>
                                            </div>
                                        </b-form-group>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="hr" />
                        <div>
                            <h5>Customs Origin Code:</h5>
                            <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-label"
                                style="width: 350px">
                                <b-form-select class="form-control-sm" v-model="form.customs_origin_code">
                                    <option value="T1">T1 - Goods from outside the EC under Customs Control</option>
                                    <option value="T2"> T2 - EC Goods not in free circulation </option>
                                    <option value="TE"> TE - Goods in trade with Spain subject to duties </option>
                                    <option value="TP"> TP - Goods in trade with Portugal subject to special duties
                                    </option>
                                    <option value="TD"> TD - Goods already under formal transit procedure </option>
                                    <option value="TF"> TF - Goods in trade between EC and Canary Islands </option>
                                    <option value="C"> C - Goods in free circulation </option>
                                    <option value="X"> X - Goods in free circulation with destination outside the EC
                                    </option>
                                </b-form-select>
                            </b-form-group>
                            <div class="py-md-9">
                                <b-tabs content-class="mt-3">
                                    <b-tab title="OSI" active>
                                        <h5>Other Service Information:</h5>
                                        <div class="py-7">
                                            <b-form-textarea class=""
                                                style=" grid-column: span 2 !important;width: 60% !important;"
                                                id="textarea" rows="3" max-rows="6"
                                                v-model="form.other_service_information"
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
                                                v-model="form.special_service_request"
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
                                                v-model="form.accounting_information"
                                                :class="{ 'is-invalid': form.errors.has('accounting_information') }"></b-form-textarea>
                                            <has-error :form="form" field="accounting_information"></has-error>
                                            <b-form-checkbox size="sm" v-model="form.letter_credit">Letter Of
                                                Credit</b-form-checkbox>
                                        </div>
                                    </b-tab>
                                    <b-tab title="Shipment Reference Infomation">
                                        <h4 class="h-color font-weight-bolder ml-2">Shipment Reference Information</h4>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            label="Shipment Reference Number:" class="form-control-sm col-form-label">
                                            <b-form-input id="input-horizontal" class="form-control-sm ml-lg-14"
                                                v-model="form.shipment_ref_no"
                                                :class="{ 'is-invalid': form.errors.has('shipment_ref_no') }"></b-form-input>
                                            <has-error :form="form" field="shipment_ref_no"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            label="Supplementary Shipment Information:"
                                            class="form-control-sm col-form-label">
                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                v-model="form.supplementary_shipment_Info"
                                                :class="{ 'is-invalid': form.errors.has('supplementary_shipment_Info') }"></b-form-input>
                                            <has-error :form="form" field="supplementary_shipment_Info"></has-error>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label ml-lg-30">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-36 ml-sm-16 ml-md-16 ml-auto"
                                                v-model="form.supplementary_shipment_Info"></b-form-input>
                                        </b-form-group>
                                    </b-tab>
                                    <b-tab title="IATA and Cass">
                                        <h5 class="ml-5 py-5">
                                            Override IATA And Cass:
                                        </h5>
                                        <b-row>
                                            <b-col cols="auto">
                                                <b-form-group id="fieldset-horizontal" abel-cols-lg="auto"
                                                    content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                    label="IATA:" class="form-control-sm col-form-label">
                                                    <b-form-input id="input-horizontal" class="form-control-sm"
                                                        v-model="form.iata_agent_code"
                                                        :class="{ 'is-invalid': form.errors.has('iata_agent_code') }"></b-form-input>
                                                    <has-error :form="form" field="iata_agent_code"></has-error>
                                                </b-form-group>
                                            </b-col>
                                            <b-col cols="auto mr-7">
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                    content-cols-sm content-cols-lg="auto" label="Cass:"
                                                    label-for="input-horizontal" class="form-control-sm col-form-label">
                                                    <b-form-input id="input-horizontal" class="form-control-sm"
                                                        v-model="form.iata_agent_cass"
                                                        :class="{ 'is-invalid': form.errors.has('iata_agent_cass') }"></b-form-input>
                                                    <has-error :form="form" field="iata_agent_cass"></has-error>
                                                </b-form-group>
                                            </b-col>
                                            <b-col cols="auto ml-7" style="padding-left: 9.3%">
                                                <b-form-group label-for="name-input">
                                                    <b-form-checkbox size="sm">Save information for later
                                                        logins</b-form-checkbox>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>
                                    </b-tab>
                                    <b-tab title="Agent Information">
                                        <div class="container py-5">
                                            <div class="row">
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
                                                                        v-model="form.agent_name" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell"> Agent Address: </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="form.agent_address" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell"></td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 130px"
                                                                        v-model="form.agent_city" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 130px"
                                                                        v-model="form.agent_pincode" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Issuing Signature:* </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="form.agent_issue_sign" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Issuing Location Code:* </td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="form.agent_issue_loc_code">
                                                                        <option disabled value=""> Please select one
                                                                        </option>
                                                                        <option value="BLR">BLR, Bangalore (BLR), India
                                                                        </option>
                                                                        <option value="AAE">AAE, Annaba (AAE), Algeria
                                                                        </option>
                                                                        <option value="AAH">AAH, Aachen (AAH), Germany
                                                                        </option>
                                                                        <option value="AAI">AAI, Arraias (AAI), Brazil
                                                                        </option>
                                                                        <option value="AAL">AAL, Aalborg (AAL), Denmark
                                                                        </option>
                                                                        <option value="AAM">AAM, Mala Mala (AAM), South
                                                                            Africa</option>
                                                                        <option value="AAN">AAN, Al Ain (AAN), United
                                                                            Arab Emirates</option>
                                                                        <option value="AAP">AAP, Samarinda (AAP),
                                                                            Indonesia</option>
                                                                        <option value="AAR">AAR, Aarhus (AAR), Denmark
                                                                        </option>
                                                                        <option value="ABA">ABA, Abakan (ABA), Russian
                                                                            Federation</option>
                                                                        <option value="ABC">ABC, Albacete (ABC), Spain
                                                                        </option>
                                                                    </b-form-select>
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
                                                                        v-model="form.agent_issue_date" />
                                                                </td>
                                                                <date-picker valueType="format"
                                                                    style=" width: 30px !important;"></date-picker>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Agent Account:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="form.agent_account" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-checkbox size="sm">Save information for
                                                                        later logins</b-form-checkbox>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="col-md-6">
                                                    <table class="table-bordered table-sm">
                                                        <thead>
                                                            <tr class="h_background_color">
                                                                <th class="form-control1">Senders Reference:</th>
                                                                <th class="form-control1"></th>
                                                                <th class="form-control1"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <b-form-radio name="participate" size="sm"
                                                                        v-model="form.participate"
                                                                        value="0">Participant</b-form-radio>
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-radio name="office" size="sm"
                                                                        v-model="form.participate"
                                                                        value="1">Office</b-form-radio>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Participant Airport:</td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="form.participate_airport">
                                                                        <option disabled value=""> Please select one
                                                                        </option>
                                                                        <option value="BLR, Bangalore (BLR), India">BLR,
                                                                            Bangalore (BLR), India</option>
                                                                        <option value="AAE, Annaba (AAE), Algeria">AAE,
                                                                            Annaba (AAE), Algeria</option>
                                                                        <option value="AAH, Aachen (AAH), Germany">AAH,
                                                                            Aachen (AAH), Germany</option>
                                                                        <option value="AAI, Arraias (AAI), Brazil">AAI,
                                                                            Arraias (AAI), Brazil</option>
                                                                        <option value="AAL, Aalborg (AAL), Denmark">AAL,
                                                                            Aalborg (AAL), Denmark</option>
                                                                        <option
                                                                            value="AAM, Mala Mala (AAM), South Africa">
                                                                            AAM, Mala Mala (AAM), South Africa</option>
                                                                        <option
                                                                            value="AAN, Al Ain (AAN), United Arab Emirates">
                                                                            AAN, Al Ain (AAN), United Arab Emirates
                                                                        </option>
                                                                        <option value="AAP, Samarinda (AAP), Indonesia">
                                                                            AAP, Samarinda (AAP), Indonesia</option>
                                                                        <option value="AAR, Aarhus (AAR), Denmark">AAR,
                                                                            Aarhus (AAR), Denmark</option>
                                                                        <option
                                                                            value="ABA, Abakan (ABA), Russian Federation">
                                                                            ABA, Abakan (ABA), Russian Federation
                                                                        </option>
                                                                        <option value="ABC, Albacete (ABC), Spain">ABC,
                                                                            Albacete (ABC), Spain</option>
                                                                    </b-form-select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Participant Identifer:</td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="form.prticipant_identifer">
                                                                        <option disabled value=""> Please select one
                                                                        </option>
                                                                        <option value="AIR"> Airline AIR</option>
                                                                        <option value="APT">Airport Authority APT
                                                                        </option>
                                                                        <option value="AGT">Agent AGT</option>
                                                                        <option value="BRK">Broker BRK</option>
                                                                        <option value="CAG">Commissionable Agent CAG
                                                                        </option>
                                                                        <option value="CNE">Consignee CNE</option>
                                                                        <option value="CTM">Customs CTM</option>
                                                                        <option value="DCL">Declarant DCL</option>
                                                                        <option value="DEC">Deconsolidator DEC</option>
                                                                        <option value="FFW">Freight Forwarder FFW
                                                                        </option>
                                                                        <option value="GHA">Ground Handling Agent GHA
                                                                        </option>
                                                                        <option value="PTT">Post Office PTT</option>
                                                                        <option value="SHP">Shipper SHP</option>
                                                                        <option value="TRK">Trucker TRK</option>
                                                                    </b-form-select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Participant Code:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 150px"
                                                                        v-model="form.participant_code" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">Office File Reference:</td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control"
                                                                        style="width: 200px"
                                                                        v-model="form.office_file_reference" />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>

                                    <b-tab title="Also Notify">
                                        <h4 class="h-color font-weight-bolder ml-2 mt-2"> Also Notify </h4>
                                        <div class="d-flex align-items-center mt-5">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label mr-3" label="Name:">
                                                <b-form-input id="input-horizontal"
                                                    class="form-control-sm ml-lg-20"></b-form-input>
                                            </b-form-group>
                                            <b-form-checkbox size="sm">Letter Of Credit</b-form-checkbox>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-31"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Address:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-15"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-31"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="City:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-23"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Post Code:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-11"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="State:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-20"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Country:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-15"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Phone:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-17"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Fax:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-22"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Telex:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-19"></b-form-input>
                                        </b-form-group>

                                        <b-form-checkbox size="sm" class="ml-lg-35"> Save new address to address
                                            book</b-form-checkbox>
                                    </b-tab>
                                    <b-tab title="Exta Print Information">
                                        <h5> Extra information printed of Air Way Bill (Only printed - not saved or sent
                                            to Airlines): </h5>
                                        <b-form-textarea class=""
                                            style="grid-column: span 2 !important;width: 60% !important;" id="textarea"
                                            rows="3" max-rows="6" v-model="form.extra_print"></b-form-textarea>
                                    </b-tab>
                                    <b-tab title="Carrier Address">
                                        <h4 class="h-color font-weight-bolder ml-2 mt-2">Override the Carrier Address on
                                            the PDF Document
                                        </h4>
                                        <h6> (This can be used for non-IATA carriers) </h6>
                                        <div class="d-flex align-items-center mt-5">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal"
                                                class="form-control-sm col-form-label mr-3" label="Name:">
                                                <b-form-input id="input-horizontal"
                                                    class="form-control-sm ml-lg-20"></b-form-input>
                                            </b-form-group>
                                            <b-form-checkbox size="sm">Public Address</b-form-checkbox>
                                        </div>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-31"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Address:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-15"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-31"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="City:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-23"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="Post Code:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-11"></b-form-input>
                                        </b-form-group>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mr-3" label="State:">
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm ml-lg-20"></b-form-input>
                                        </b-form-group>
                                    </b-tab>
                                </b-tabs>
                            </div>
                        </div>
                        <hr class="hr" />
                        <div class="py-5">
                            <b-tabs content-class="mt-3" class="nav-tabs">
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
                                                <b-form-select class="form-control-sm" v-model="form.code">
                                                    <option disabled value=""> Select an Other Charge Code </option>
                                                    <option value="MY - Fuel Surcharge">MY - Fuel Surcharge </option>
                                                    <option value="SC - Security Charge">SC - Security Charge </option>
                                                    <option value="AC - Animal Container">AC - Animal Container
                                                    </option>
                                                </b-form-select>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-input class="form-control-sm" v-model="form.other_code"
                                                    placeholder="or:"></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-input class="form-control-sm"
                                                    v-model="form.amount"></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="due" size="sm" v-model="form.due" value="Agent">Due
                                                    Agent</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="due" size="sm" v-model="form.due"
                                                    value="Carrier">Due Carrier</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="payment_type" size="sm" v-model="form.payment_type"
                                                    value="Prepaid">Prepaid</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-radio name="payment_type" size="sm" v-model="form.payment_type"
                                                    value="Collect">Collect</b-form-radio>
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
                                                            v-model="form.chargable_weight1" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="editable-cell"> Charge </td>
                                                    <td class="editable-cell">
                                                        <input type="text" class="form-control" style="width: 100px"
                                                            v-model="form.charge" />
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
                                                <th class="form-control1">Amount</th>
                                                <th class="form-control1">Due</th>
                                                <th class="form-control1">Type Of Payment</th>
                                                <th class="form-control1">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(charge, index) in charges" :key="index">
                                                <td class="editable-cell">
                                                    {{ charge.code || charge.other_code }}
                                                </td>
                                                <td class="editable-cell">
                                                    {{ charge.amount }}
                                                </td>
                                                <td class="editable-cell">
                                                    {{ charge.due }}
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
                            </b-tabs>
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
                                                                        v-model="form.type_of_payment">
                                                                        <option disabled value=""> Please select one
                                                                        </option>
                                                                        <option value="CA">Partial Collect Credit —
                                                                            Partial Prepaid Cash CA</option>
                                                                        <option value="CB">Partial Collect Credit —
                                                                            Partial Prepaid Credit CB</option>
                                                                        <option value="CC">All Charges Collect CC
                                                                        </option>
                                                                        <option value="CG">All Charges Collect by GBL CG
                                                                        </option>
                                                                        <option value="CP">Destination Collect Cash CP
                                                                        </option>
                                                                        <option value="CX">Destination Collect Credit CX
                                                                        </option>
                                                                        <option value="CX">No Charge NC</option>
                                                                        <option value="PC">Partial Prepaid Cash —
                                                                            Partial Collect Cash PC</option>
                                                                        <option value="PD">Partial Prepaid Credit —
                                                                            Partial Collect Cash PD</option>
                                                                        <option value="PG">All Charges Prepaid by GBL PG
                                                                        </option>
                                                                        <option value="PP">All Charges Prepaid Cash PP
                                                                        </option>
                                                                        <option value="PX">All Charges Prepaid Credit PX
                                                                        </option>
                                                                    </b-form-select>
                                                                </b-form-group>
                                                                <label class="ml-3 mt-4 mb-5 mr-5">Currency:</label>
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm" style="width: 50px;"
                                                                    v-model="form.currency"
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
                                                                    v-model="form.carriage"></b-form-input>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                content-cols-sm content-cols-lg="auto"
                                                                label-for="input-horizontal"
                                                                class="form-control-sm col-form-label mr-3"
                                                                label="Customs :">
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm ml-lg-31 mt-3"
                                                                    style="width: 220px;"
                                                                    v-model="form.customs"></b-form-input>
                                                            </b-form-group>
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                content-cols-sm content-cols-lg="auto"
                                                                label-for="input-horizontal" label="Insurance:"
                                                                class="form-control-sm col-form-label mr-3">
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm ml-lg-30 mt-3"
                                                                    style="width: 220px;"
                                                                    v-model="form.insurance"></b-form-input>
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
                                                            <td class="editable-cell">0.00 INR</td>
                                                            <td class="editable-cell">{{ weightCharge.toFixed(2) }} INR
                                                            </td>
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
                                                    <th class="form-control1">
                                                        Code
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- <tr>
                                                    <td class="editable-cell"></td>
                                                </tr> -->
                                                <tr v-for="(code, index) in tableCodes" :key="index">
                                                    <td class="editable-cell">{{ code }}</td>
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
                                                                        v-model="form.oci_country_code"
                                                                        :class="{ 'is-invalid': form.errors.has('oci_country_code') }">
                                                                        <option disabled value="">Select a country
                                                                        </option>
                                                                        <option value="AF">Afghanistan</option>
                                                                        <option value="AX">Åland Islands</option>
                                                                        <option value="AL">Albania</option>
                                                                        <option value="DZ">Algeria</option>
                                                                        <option value="AS">American Samoa</option>
                                                                        <option value="AD">Andorra</option>
                                                                        <option value="AO">Angola</option>
                                                                        <option value="AI">Anguilla</option>
                                                                        <option value="AQ">Antarctica</option>
                                                                        <option value="AG">Antigua and Barbuda</option>
                                                                        <option value="AR">Argentina</option>
                                                                        <option value="AM">Armenia</option>
                                                                        <option value="AW">Aruba</option>
                                                                        <option value="AU">Australia</option>
                                                                        <option value="AT">Austria</option>
                                                                        <option value="AZ">Azerbaijan</option>
                                                                        <option value="BS">Bahamas</option>
                                                                        <option value="BH">Bahrain</option>
                                                                        <option value="BD">Bangladesh</option>
                                                                        <option value="BB">Barbados</option>
                                                                        <option value="BY">Belarus</option>
                                                                        <option value="BE">Belgium</option>
                                                                        <option value="BZ">Belize</option>
                                                                        <option value="BJ">Benin</option>
                                                                        <option value="BM">Bermuda</option>
                                                                        <option value="BT">Bhutan</option>
                                                                        <option value="BO">Bolivia</option>
                                                                        <option value="BQ">Bonaire</option>
                                                                        <option value="BA">Bosnia and Herzegovina
                                                                        </option>
                                                                        <option value="BW">Botswana</option>
                                                                        <option value="BV">Bouvet Island</option>
                                                                        <option value="BR">Brazil</option>
                                                                        <option value="IO">British Indian Ocean
                                                                            Territory</option>
                                                                        <option value="BN">Brunei Darussalam</option>
                                                                        <option value="BG">Bulgaria</option>
                                                                        <option value="BF">Burkina Faso</option>
                                                                        <option value="BI">Burundi</option>
                                                                        <option value="KH">Cambodia</option>
                                                                        <option value="CM">Cameroon</option>
                                                                        <option value="CA">Canada</option>
                                                                        <option value="CV">Cape Verde</option>
                                                                        <option value="KY">Cayman Islands</option>
                                                                        <option value="CF">Central African Republic
                                                                        </option>
                                                                        <option value="TD">Chad</option>
                                                                        <option value="CL">Chile</option>
                                                                        <option value="CN">China</option>
                                                                        <option value="CX">Christmas Island</option>
                                                                        <option value="CC">Cocos (Keeling) Islands
                                                                        </option>
                                                                        <option value="CO">Colombia</option>
                                                                        <option value="KM">Comoros</option>
                                                                        <option value="CG">Congo</option>
                                                                        <option value="CD">Congo, the Democratic
                                                                            Republic of the</option>
                                                                        <option value="CK">Cook Islands</option>
                                                                        <option value="CR">Costa Rica</option>
                                                                        <option value="CI">Côte d'Ivoire</option>
                                                                        <option value="HR">Croatia</option>
                                                                        <option value="CU">Cuba</option>
                                                                        <option value="CW">Curacao</option>
                                                                        <option value="CY">Cyprus</option>
                                                                        <option value="CZ">Czech Republic</option>
                                                                        <option value="DK">Denmark</option>
                                                                        <option value="DJ">Djibouti</option>
                                                                        <option value="DM">Dominica</option>
                                                                        <option value="DO">Dominican Republic</option>
                                                                        <option value="EC">Ecuador</option>
                                                                        <option value="EG">Egypt</option>
                                                                        <option value="SV">El Salvador</option>
                                                                        <option value="GQ">Equatorial Guinea</option>
                                                                        <option value="ER">Eritrea</option>
                                                                        <option value="EE">Estonia</option>
                                                                        <option value="ET">Ethiopia</option>
                                                                        <option value="FK">Falkland Islands (Malvinas)
                                                                        </option>
                                                                        <option value="FO">Faroe Islands</option>
                                                                        <option value="FJ">Fiji</option>
                                                                        <option value="FI">Finland</option>
                                                                        <option value="FR">France</option>
                                                                        <option value="GF">French Guiana</option>
                                                                        <option value="PF">French Polynesia</option>
                                                                        <option value="TF">French Southern Territories
                                                                        </option>
                                                                        <option value="GA">Gabon</option>
                                                                        <option value="GM">Gambia</option>
                                                                        <option value="GE">Georgia</option>
                                                                        <option value="DE">Germany</option>
                                                                        <option value="GH">Ghana</option>
                                                                        <option value="GI">Gibraltar</option>
                                                                        <option value="GR">Greece</option>
                                                                        <option value="GL">Greenland</option>
                                                                        <option value="GD">Grenada</option>
                                                                        <option value="GP">Guadeloupe</option>
                                                                        <option value="GU">Guam</option>
                                                                        <option value="GT">Guatemala</option>
                                                                        <option value="GG">Guernsey</option>
                                                                        <option value="GN">Guinea</option>
                                                                        <option value="GW">Guinea-Bissau</option>
                                                                        <option value="GY">Guyana</option>
                                                                        <option value="HT">Haiti</option>
                                                                        <option value="HM">Heard Island and McDonald
                                                                            Islands</option>
                                                                        <option value="VA">Holy See (Vatican City State)
                                                                        </option>
                                                                        <option value="HN">Honduras</option>
                                                                        <option value="HK">Hong Kong</option>
                                                                        <option value="HU">Hungary</option>
                                                                        <option value="IS">Iceland</option>
                                                                        <option value="IN">India</option>
                                                                        <option value="ID">Indonesia</option>
                                                                        <option value="IR">Iran, Islamic Republic of
                                                                        </option>
                                                                        <option value="IQ">Iraq</option>
                                                                        <option value="IE">Ireland</option>
                                                                        <option value="IM">Isle of Man</option>
                                                                        <option value="IL">Israel</option>
                                                                        <option value="IT">Italy</option>
                                                                        <option value="JM">Jamaica</option>
                                                                        <option value="JP">Japan</option>
                                                                        <option value="JE">Jersey</option>
                                                                        <option value="JO">Jordan</option>
                                                                        <option value="KZ">Kazakhstan</option>
                                                                        <option value="KE">Kenya</option>
                                                                        <option value="KI">Kiribati</option>
                                                                        <option value="KP">Korea, Democratic People's
                                                                            Republic of</option>
                                                                        <option value="KR">Korea, Republic of</option>
                                                                        <option value="XK">Kosovo, Republic of</option>
                                                                        <option value="KW">Kuwait</option>
                                                                        <option value="KG">Kyrgyzstan</option>
                                                                        <option value="LA">Lao People's Democratic
                                                                            Republic</option>
                                                                        <option value="LV">Latvia</option>
                                                                        <option value="LB">Lebanon</option>
                                                                        <option value="LS">Lesotho</option>
                                                                        <option value="LR">Liberia</option>
                                                                        <option value="LY">Libya</option>
                                                                        <option value="LI">Liechtenstein</option>
                                                                        <option value="LT">Lithuania</option>
                                                                        <option value="LU">Luxembourg</option>
                                                                        <option value="MO">Macao</option>
                                                                        <option value="MK">Macedonia, the former
                                                                            Yugoslav Republic of</option>
                                                                        <option value="MG">Madagascar</option>
                                                                        <option value="MW">Malawi</option>
                                                                        <option value="MY">Malaysia</option>
                                                                        <option value="MV">Maldives</option>
                                                                        <option value="ML">Mali</option>
                                                                        <option value="MT">Malta</option>
                                                                        <option value="MH">Marshall Islands</option>
                                                                        <option value="MQ">Martinique</option>
                                                                        <option value="MR">Mauritania</option>
                                                                        <option value="MU">Mauritius</option>
                                                                        <option value="YT">Mayotte</option>
                                                                        <option value="MX">Mexico</option>
                                                                        <option value="FM">Micronesia, Federated States
                                                                            of</option>
                                                                        <option value="MD">Moldova, Republic of</option>
                                                                        <option value="MC">Monaco</option>
                                                                        <option value="MN">Mongolia</option>
                                                                        <option value="ME">Montenegro</option>
                                                                        <option value="MS">Montserrat</option>
                                                                        <option value="MA">Morocco</option>
                                                                        <option value="MZ">Mozambique</option>
                                                                        <option value="MM">Myanmar</option>
                                                                        <option value="NA">Namibia</option>
                                                                        <option value="NR">Nauru</option>
                                                                        <option value="NP">Nepal</option>
                                                                        <option value="NL">Netherlands</option>
                                                                        <option value="NC">New Caledonia</option>
                                                                        <option value="NZ">New Zealand</option>
                                                                        <option value="NI">Nicaragua</option>
                                                                        <option value="NE">Niger</option>
                                                                        <option value="NG">Nigeria</option>
                                                                        <option value="NU">Niue</option>
                                                                        <option value="NF">Norfolk Island</option>
                                                                        <option value="XI">Northern Ireland</option>
                                                                        <option value="MP">Northern Mariana Islands
                                                                        </option>
                                                                        <option value="NO">Norway</option>
                                                                        <option value="OM">Oman</option>
                                                                        <option value="PK">Pakistan</option>
                                                                        <option value="PW">Palau</option>
                                                                        <option value="PS">Palestinian Territory,
                                                                            Occupied</option>
                                                                        <option value="PA">Panama</option>
                                                                        <option value="PG">Papua New Guinea</option>
                                                                        <option value="PY">Paraguay</option>
                                                                        <option value="PE">Peru</option>
                                                                        <option value="PH">Philippines</option>
                                                                        <option value="PN">Pitcairn</option>
                                                                        <option value="PL">Poland</option>
                                                                        <option value="PT">Portugal</option>
                                                                        <option value="PR">Puerto Rico</option>
                                                                        <option value="QA">Qatar</option>
                                                                        <option value="RE">Reunion Réunion</option>
                                                                        <option value="RO">Romania</option>
                                                                        <option value="RU">Russian Federation</option>
                                                                        <option value="RW">Rwanda</option>
                                                                        <option value="BL">Saint Barthélemy</option>
                                                                        <option value="SH">Saint Helena</option>
                                                                        <option value="KN">Saint Kitts and Nevis
                                                                        </option>
                                                                        <option value="LC">Saint Lucia</option>
                                                                        <option value="MF">Saint Martin (French part)
                                                                        </option>
                                                                        <option value="PM">Saint Pierre and Miquelon
                                                                        </option>
                                                                        <option value="VC">Saint Vincent and the
                                                                            Grenadines</option>
                                                                        <option value="WS">Samoa</option>
                                                                        <option value="SM">San Marino</option>
                                                                        <option value="ST">Sao Tome and Principe
                                                                        </option>
                                                                        <option value="SA">Saudi Arabia</option>
                                                                        <option value="SN">Senegal</option>
                                                                        <option value="RS">Serbia</option>
                                                                        <option value="SC">Seychelles</option>
                                                                        <option value="SL">Sierra Leone</option>
                                                                        <option value="SG">Singapore</option>
                                                                        <option value="SX">Sint Maarten</option>
                                                                        <option value="SK">Slovakia</option>
                                                                        <option value="SI">Slovenia</option>
                                                                        <option value="SB">Solomon Islands</option>
                                                                        <option value="SO">Somalia</option>
                                                                        <option value="ZA">South Africa</option>
                                                                        <option value="GS">South Georgia and the South
                                                                            Sandwich Islands</option>
                                                                        <option value="SS">South Sudan</option>
                                                                        <option value="ES">Spain</option>
                                                                        <option value="LK">Sri Lanka</option>
                                                                        <option value="SD">Sudan</option>
                                                                        <option value="SR">Suriname</option>
                                                                        <option value="SJ">Svalbard and Jan Mayen
                                                                        </option>
                                                                        <option value="SW">Swahili</option>
                                                                        <option value="SZ">Swaziland</option>
                                                                        <option value="SE">Sweden</option>
                                                                        <option value="CH">Switzerland</option>
                                                                        <option value="SY">Syrian Arab Republic</option>
                                                                        <option value="TW">Taiwan, Republic of China
                                                                        </option>
                                                                        <option value="TJ">Tajikistan</option>
                                                                        <option value="TZ">Tanzania, United Republic of
                                                                        </option>
                                                                        <option value="TH">Thailand</option>
                                                                        <option value="TL">Timor-Leste</option>
                                                                        <option value="TG">Togo</option>
                                                                        <option value="TK">Tokelau</option>
                                                                        <option value="TO">Tonga</option>
                                                                        <option value="TT">Trinidad and Tobago</option>
                                                                        <option value="TN">Tunisia</option>
                                                                        <option value="TR">Turkey</option>
                                                                        <option value="TM">Turkmenistan</option>
                                                                        <option value="TC">Turks and Caicos Islands
                                                                        </option>
                                                                        <option value="TV">Tuvalu</option>
                                                                        <option value="UG">Uganda</option>
                                                                        <option value="UA">Ukraine</option>
                                                                        <option value="AE">United Arab Emirates</option>
                                                                        <option value="GB">United Kingdom</option>
                                                                        <option value="US">United States</option>
                                                                        <option value="UM">United States Minor Outlying
                                                                            Islands</option>
                                                                        <option value="UY">Uruguay</option>
                                                                        <option value="UZ">Uzbekistan</option>
                                                                        <option value="VU">Vanuatu</option>
                                                                        <option value="VE">Venezuela</option>
                                                                        <option value="VN">Viet Nam</option>
                                                                        <option value="VG">Virgin Islands, British
                                                                        </option>
                                                                        <option value="VI">Virgin Islands, U.S.</option>
                                                                        <option value="WF">Wallis and Futuna</option>
                                                                        <option value="EH">Western Sahara</option>
                                                                        <option value="YE">Yemen</option>
                                                                        <option value="ZM">Zambia</option>
                                                                        <option value="ZW">Zimbabwe</option>
                                                                    </b-form-select>
                                                                    <has-error :form="form"
                                                                        field="oci_country_code"></has-error>
                                                                </b-form-group>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <b-form-group id="fieldset-horizontal"
                                                                    class="form-control-sm col-form-label"
                                                                    style="width: 350px;">
                                                                    <b-form-select class="form-control-sm"
                                                                        v-model="form.oci_info_identifier"
                                                                        :class="{ 'is-invalid': form.errors.has('oci_info_identifier') }">
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
                                                                        field="oci_info_identifier"></has-error>
                                                                </b-form-group>
                                                            </td>
                                                            <td class="editable-cell">
                                                                <b-form-group id="fieldset-horizontal"
                                                                    class="form-control-sm col-form-label"
                                                                    style="width: 350px;">
                                                                    <b-form-select class="form-control-sm"
                                                                        v-model="form.oci_custom_info_identifier"
                                                                        :class="{ 'is-invalid': form.errors.has('oci_custom_info_identifier') }">
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
                                                                        field="oci_custom_info_identifier"></has-error>
                                                                </b-form-group>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="editable-cell px-5">Supplementary Information:
                                                            </td>
                                                            <td class="editable-cell px-4">
                                                                <input type="text" class="form-control"
                                                                    style="width: 330px;"
                                                                    v-model="form.oci_supplementary_info"
                                                                    :class="{ 'is-invalid': form.errors.has('oci_supplementary_info') }" />
                                                                <has-error :form="form"
                                                                    field="oci_supplementary_info"></has-error>
                                                            </td>
                                                            <td class="editable-cell"></td>
                                                            <td class="editable-cell mb-2">
                                                                <input type="button" class="form-control pb-1"
                                                                    style="width: 100px;font-size: 12px;font-weight: bold;"
                                                                    value="Add" @click="addOtherCustomInfo" />
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
                                                            <tr v-for="(row, index) in oci_entries" :key="index">
                                                                <td class="editable-cell">{{ row.oci_country_code }}
                                                                </td>
                                                                <td class="editable-cell">{{ row.oci_info_identifier }}
                                                                </td>
                                                                <td class="editable-cell">{{
                                                                    row.oci_custom_info_identifier }}</td>
                                                                <td class="editable-cell">{{ row.oci_supplementary_info
                                                                    }}</td>
                                                                <td class="editable-cell"
                                                                    style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                    <b-icon icon="pencil" font-scale="1"
                                                                        style="cursor: pointer;"
                                                                        @click="editOciInfo(index)"
                                                                        class="mr-2"></b-icon>
                                                                    <b-icon icon="trash" font-scale="1"
                                                                        @click="deleteOciInfo(index)"></b-icon>
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
                                <b-button class="mr-2">Generate PDF</b-button>
                                <b-button class="mr-2">Send</b-button>
                                <b-button class="mr-2">Send & Clear</b-button>
                                <b-button type="submit">Save Draft</b-button>
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
            form: new Form({
                awb_code: '',
                awb_no: '',
                consolidated_MAWB: false,
                awb: true,
                oci_country_code: '',
                oci_info_identifier: '',
                oci_custom_info_identifier: '',
                oci_supplementary_info: '',
                shipper_address: {
                    name: '',
                    account: '',
                    address: '',
                    address_line_2: '',
                    city: '',
                    post_code: '',
                    state: '',
                    country: '',
                    phone: '',
                    fax: '',
                    telex: '',
                    new_address: '',
                    airport_code: null,
                },
                consignee_address: {
                    name: '',
                    account: '',
                    address: '',
                    address_line_2: '',
                    city: '',
                    airport_code: null,
                    post_code: '',
                    state: '',
                    country: '',
                    phone: '',
                    fax: '',
                    telex: '',
                    new_address: '',
                },
                departure_airport: '',
                destination_airport: '',
                from: '',
                from_2: '',
                from_3: '',
                to: '',
                to_2: '',
                to_3: '',
                by: '',
                by_2: '',
                by_3: '',
                flight: '',
                flight_2: '',
                flight_3: '',
                date: this.getCurrentDate(),
                date_2: this.getCurrentDate(),
                date_3: this.getCurrentDate(),

                entries: [],
                total_valume: null,
                total_amount: 0,

                customs_origin_code: null,
                other_service_information: '',
                special_service_request: '',
                accounting_information: '',
                letter_credit: false,
                shipment_ref_no: null,
                supplementary_shipment_Info: '',
                iata_agent_code: null,
                iata_agent_cass: null,
                extra_print: null,

                agent_name: '',
                agent_address: '',
                agent_city: '',
                agent_pincode: '',
                agent_issue_sign: '',
                agent_issue_loc_code: '',
                agent_issue_date: this.getCurrentDate(),
                agent_account: null,
                participate: '0',
                participate_airport: '',
                prticipant_identifer: '',
                participant_code: null,
                office_file_reference: '',
                office_airport: '',
                office_function_designator: '',
                office_company_designator: '',
                participant_file_reference: '',
                // other_charge_code: '',
                // other_code: null,
                // other_amount: null,
                // due_agent: '',
                // due_carrier: '',
                code: '',
                other_code: '',
                amount: '',
                due: "Carrier",
                payment_type: "Prepaid",
                charge: '',
                // prepaid: '',
                // collect: '',
                chargable_weight1: '',

                carr_namr: '',
                carr_prefix: '',
                carr_address: '',
                carr_city: '',
                carr_post_code: '',
                carr_state: '',
                carr_country: '',

                type_of_payment: '',
                currency: 'INR',
                carriage: 'NVD',
                insurance: 'XXX',
                customs: 'NCV',
                other_charges_due_carrier: '',
                other_charges_due_agent: '',
                taxes: '',
                weight_charge: '',
                total_charges: '',
            }),
            consignment_list: {
                pieces: '',
                description: '',
                rate_class: '',
                uld_rate_class: '',
                service_code: '',
                commodity_item: '',
                country_origin_goods: '',
                slac: '',
                hs_code: '',

                gross_weight: '',
                weight_code: 'K', //kgs/lbs
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
                dimention_unit: 'MC', //cm3,m3,ft3

                uld_type: '',
                uld_serial: '',
                owner: '',

                itemss: [],
                hsCodes: [],
                uld_info: [],
            },

            selectedCode: '',
            manualCode: '',
            tableCodes: [],
            charges: [],
            oci_entries: [],
            newHsCode: '',
            isOpen: false,
            showShipper: false,
            showConsignee: false,
            showCalculationTable: false,
            is_consignee_address_save: false,
            is_shipper_address_save: false,
            editIndex: null,
            edit_entry_index: null,
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
        mouseover: function () {
            this.isOpen = true;
        },
        mouseleave: function () {
            this.isOpen = false;
        },
        SaveAddress(address_type) {

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
        handleDateChange(date) {
            this.form.date = this.formatDate(date);
        },
        issueDateChange(date) {
            this.form.issue_date = this.formatDate(date);
        },
        saveAll() {
            const formData = new FormData();
            formData.append('oci_entries', JSON.stringify(this.oci_entries));
            formData.append('other_charges', JSON.stringify(this.charges));
            formData.append('special_handling_code', JSON.stringify(this.tableCodes));
            ApiService.post(`/create-webdoc`, formData)
                .then(response => {
                    console.log('Save successful:', response.data);
                })
                .catch(error => {
                    console.error('Save failed:', error.response?.data || error.message);
                });
        },
        onSubmit(evt) {
            evt.preventDefault();
            this.saveAll();
            // this.form.post(`/create-webdoc`)
            // .then(({ data }) => {
            //     console.log('data', data);
            // })
            // .catch(err => { 
            //     console.log('data', err);
            // });
        },
        handleRadioChange() {
            const selectedCode = this.selectedCode;
            this.tableCodes = [];
            this.tableCodes.push(selectedCode);
        },
        addManualCode() {
            const code = this.selectedCode || this.manualCode.trim();
            if (code) {
                if (!this.tableCodes.includes(code)) {
                    this.tableCodes.push(code);
                } else {
                    alert('This code is already added.');
                }
            } else {
                alert('Please select or enter a code.');
            }
            this.selectedCode = '';
            this.manualCode = '';
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
            let chargeRate = parseFloat(this.form.charge);
            let weight = parseFloat(this.form.chargable_weight1);
            if (!isNaN(weight) && this.form.charge > 0 && !isNaN(chargeRate) && chargeRate > 0) {
                let calculatedAmount = weight * chargeRate;
                this.form.amount = calculatedAmount.toFixed(2);
            } else {
                alert('Please enter valid numeric values for chargeable weight and charge rate.');
            }
        },
        addCharge() {
            // if (this.form.code || this.form.other_code && this.form.amount) {
            //     if (this.editIndex !== null) {
            //         this.charges[this.editIndex] = {
            //             ...this.form,
            //             amount: this.form.amount
            //         };
            //         this.editIndex = null;
            //     } else {
            //         this.charges.push({
            //             ...this.form,
            //             amount: this.form.amount
            //         });
            //     }
            // } 
            // else {
            //     alert("Please select a code or enter other code.");
            // }
            if (!this.form.code && !this.form.other_code) {
                alert("Please select a code or enter other code.");
                return;
            }

            if (!this.form.amount) {
                alert("Please enter the amount.");
                return;
            }

            // If we are editing an existing charge
            if (this.editIndex !== null) {
                this.charges[this.editIndex] = {
                    code: this.form.code,
                    other_code: this.form.other_code,
                    amount: this.form.amount,
                    due: this.form.due,
                    payment_type: this.form.payment_type,
                    chargable_weight1: this.form.chargable_weight1,
                    charge: this.form.charge
                };
                this.editIndex = null;
            } else {
                // Add new charge
                this.charges.push({
                    code: this.form.code,
                    other_code: this.form.other_code,
                    amount: this.form.amount,
                    due: this.form.due,
                    payment_type: this.form.payment_type,
                    chargable_weight1: this.form.chargable_weight1,
                    charge: this.form.charge
                });
            }
        },
        editCharge(index) {
            this.form = { ...this.charges[index] };
            this.editIndex = index;
        },
        removeCharge(index) {
            this.charges.splice(index, 1);
        },
        editEntry(index) {
            this.edit_entry_index = index;
            this.consignment_list = { ...this.form.entries[index] };
            this.$refs.modalConsignment.show();
        },
        deleteEntry(index) {
            this.form.entries.splice(index, 1);
        },
        addOrUpdateEntry() {
            if (this.edit_entry_index !== null) {
                this.form.entries[this.edit_entry_index] = this.consignment_list;
            } else {
                this.form.entries.push(this.consignment_list);
            }
            this.closeModal();

            //clear consignment_list data
            for (let key in this.consignment_list) {
                if (typeof this.consignment_list[key] === 'string') {
                    this.consignment_list[key] = '';
                } else if (typeof this.consignment_list[key] === 'array') {
                    this.consignment_list[key] = []; // Reset objects if needed
                }
            }
        },
        calculateTotalVolume() {
            let volumePerPiece = (this.form.length * this.form.width * this.form.height) / 1e6;
            return this.form.total_valume = volumePerPiece * (parseFloat(this.form.pcs) || 0);
        },

        calculateTotalAmount() {
            let chargable_weight = parseFloat(this.form.chargable_weight) || 0;
            let rate = parseFloat(this.form.rate) || 0;
            return this.form.total_amount = chargable_weight * rate;
        },
        addHsCode() {
            if (this.consignment_list.hs_code) {
                this.consignment_list.hsCodes.push({
                    hs_code: this.consignment_list.hs_code
                });
                this.consignment_list.hs_code = "";
            }
            else {
                alert("This field are empty");
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
        addUldInfo() {
            if (this.consignment_list.uld_type && this.consignment_list.uld_serial && this.consignment_list.owner) {
                this.consignment_list.uld_info.push({
                    uld_type: this.consignment_list.uld_type,
                    uld_serial: this.consignment_list.uld_serial,
                    owner: this.consignment_list.owner
                });
                this.consignment_list.uld_type = "";
                this.consignment_list.uld_serial = "";
                this.consignment_list.owner = "";
            }
            else {
                alert("This field are empty");
            }
        },
        deleteUldInfo(index) {
            if (this.consignment_list.uld_info && this.consignment_list.uld_info.length > index) {
                this.consignment_list.uld_info.splice(index, 1);
            }
        },
        editOciInfo(index) {
            const entry = this.oci_entries[index];
            this.form.oci_country_code = entry.oci_country_code;
            this.form.oci_info_identifier = entry.oci_info_identifier;
            this.form.oci_custom_info_identifier = entry.oci_custom_info_identifier;
            this.form.oci_supplementary_info = entry.oci_supplementary_info;
            this.editingIndex = index;
        },
        addOtherCustomInfo() {
            if (!this.form.oci_country_code || !this.form.oci_info_identifier || !this.form.oci_supplementary_info || !this.form.oci_custom_info_identifier) {
                alert('Please fill in all fields');
                return;
            }

            // Add entry to oci_entries array
            this.oci_entries.push({
                oci_custom_info_identifier: this.form.oci_custom_info_identifier,
                oci_country_code: this.form.oci_country_code,
                oci_info_identifier: this.form.oci_info_identifier,
                oci_supplementary_info: this.form.oci_supplementary_info,
            });

            // Clear form after adding entry
            this.form.oci_custom_info_identifier = '';
            this.form.oci_country_code = '';
            this.form.oci_info_identifier = '';
            this.form.oci_supplementary_info = '';
        },
        deleteOciInfo(index) {
            // this.oci_entries.splice(index, 1);
            if (this.oci_entries.length > index) {
                this.oci_entries.splice(index, 1);
            }
        },
        addPcsInfo() {
            if (this.consignment_list.itemss.length >= 1) {
                alert("You have exceeded your limit");
                return;
            }
            this.consignment_list.itemss.push({
                pcs: this.consignment_list.pcs,
                gross_weight: this.consignment_list.gross_weight,
                length: this.consignment_list.length,
                width: this.consignment_list.width,
                height: this.consignment_list.height,
                unit: this.consignment_list.unit
            });

            // Reset consignment_list fields if needed
            this.consignment_list.pcs = '';
            this.consignment_list.gross_weight = '';
            this.consignment_list.length = '';
            this.consignment_list.width = '';
            this.consignment_list.height = '';
            this.consignment_list.unit = '';
        },
        deletePcs(index) {
            if (this.consignment_list.itemss.length > index) {
                this.consignment_list.itemss.splice(index, 1);
            }
        },
    },
    watch: {
        'form.rate_class': function () {
            this.form.total_amount = this.calculateTotalAmount();
        },
        'form.rate': function () {
            this.form.total_amount = this.calculateTotalAmount();
        },
        'form.chargable_weight': function () {
            this.form.total_amount = this.calculateTotalAmount();
        }
    },
    computed: {
        weightCharge() {
            return parseFloat(this.form.total_amount || 0);

        },
        taxes() {
            return 0.00;
        },
        totalDueAgentPrepaid() {
            return this.charges
                .filter(charge => charge.due === 'Agent' && charge.payment_type === 'Prepaid')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalDueAgentCollect() {
            return this.charges
                .filter(charge => charge.due === 'Agent' && charge.payment_type === 'Collect')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalDueCarrierPrepaid() {
            return this.charges
                .filter(charge => charge.due === 'Carrier' && charge.payment_type === 'Prepaid')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalDueCarrierCollect() {
            return this.charges
                .filter(charge => charge.due === 'Carrier' && charge.payment_type === 'Collect')
                .reduce((sum, charge) => sum + parseFloat(charge.amount), 0)
                .toFixed(2);
        },
        totalChargesPrepaid() {
            return (
                parseFloat(this.totalDueAgentPrepaid) +
                parseFloat(this.totalDueCarrierPrepaid)
            ).toFixed(2);
        },
        totalChargesCollect() {
            return (
                this.weightCharge +
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
</style>