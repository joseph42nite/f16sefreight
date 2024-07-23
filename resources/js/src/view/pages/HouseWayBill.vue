<template>
    <div class="bg-white" style="height: auto !important;">
        <!-- <div class="navbar-header">
        <b-navbar-brand href="https://f16sefs.in/">
            <img :src="logoSrc" alt="f16s logo" id="main-logo">
        </b-navbar-brand>
        </div> -->
        <template>
            <header>
                <nav id="nav">
                    <ul style="z-index: 1098;">
                        <li v-for="item in items">
                            <a :href="item.url" v-if="!item.children">
                                {{ item.name }}
                            </a>
                            <span v-else v-on:mouseover="mouseover" v-on:mouseleave="mouseleave">
                                {{ item.name }}

                                <ul class=" dropdown" :class="{ isOpen }">
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
                        <hr class="hr">
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
                                <a href="" class="custom-link"> Multipage e-AWB Pdf with back pages</a>
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
                                    <b-form-select class="form-control-sm" style="width:220px">
                                        <option>Please choose a Custom Origin</option>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                    </b-form-select>
                                </b-col>
                            </b-row>
                        </b-form-group>

                        <hr class="hr">
                        <h4 class="h-color">Save</h4>
                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-lg="auto" label="Name:"
                            label-for="input-horizontal" class="form-control-sm col-form-label">
                            <b-row>
                                <b-col cols="auto">
                                    <b-form-input id="input-horizontal" class="form-control-sm"
                                        style="width: 200px;"></b-form-input>
                                </b-col>
                                <b-col>
                                    <b-button>+Save</b-button>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <h3 class="h-color font-weight-bolder mt-lg-10">Modify your templates</h3>
                        <h5 style="font-size: smaller">Showing all templates in participant group</h5>
                        <h5 class="text-danger ml-5">No Templates found</h5>
                        <hr class="hr mt-lg-12">
                        <h5 style="font-size: smaller">The e-AWB can be saved as 'draft' and a list with draft e-AWB
                            created during the day will be presented below.
                            The last 10 e-AWB will be visible.</h5>
                    </div>
                </b-modal>
            </div>
        </template>
        <div class="container mt-lg-15 border-2 bg-light p-2" style="margin-bottom:20px; border-bottom:1px solid black;">
            <div class="container h_background_color text-white pt-2 pb-2">
                <h4>Create Master Air Waybill(e-AWB)
                    <span class="float-right">New</span>
                </h4>
            </div>
            <!-- <template> -->
            <form>
                <div class="container">
                    <b-row class="mt-5">
                        <b-col cols="auto">
                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                content-cols-lg="auto" label="AWB No:*" label-for="input-horizontal"
                                class="form-control-sm col-form-label">
                                <b-form-input id="input-horizontal" class="form-control-sm"
                                    style="width: 50px;"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="auto">
                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                content-cols-lg="auto" label-for="input-horizontal"
                                class="form-control-sm col-form-label">
                                <b-form-input id="input-horizontal" class="form-control-sm"
                                    style="width: 90px;"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="auto mr-7">
                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                content-cols-lg="auto" label="" label-for="input-horizontal"
                                class="form-control-sm col-form-label">
                                <b-form-checkbox size="sm">Consolidate MAWB</b-form-checkbox>
                            </b-form-group>
                        </b-col>
                        <b-col cols="auto ml-7" style="padding-left:9.3%;">
                            <b-form-group label-for="name-input">
                                <b-form-radio name="radio-size" size="sm">AWB</b-form-radio>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-center mt-5">
                        <b-col cols="auto" style="padding-left: 33.6%;">
                            <b-form-group label-for="">
                                <b-form-radio name="radio-size" size="sm">e-AWB With No Accompanying Paper
                                    Documents</b-form-radio>
                            </b-form-group>
                        </b-col>
                        <b-col cols="auto" class="">
                            <b-form-group label-for="name-input">
                                <b-form-radio name="radio-size" size="sm">e-CSD AWB</b-form-radio>
                            </b-form-group>
                        </b-col>
                        <b-col cols="auto" style="margin-left:22.5%;">
                            <b-form-group label-for="name-input">
                                <b-form-radio name="radio-size" size="sm">e-AWB With Accompanying Paper
                                    Documents</b-form-radio>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <hr class="hr">

                    <b-row class="justify-content-center mt-5">
                        <b-col>
                            <b-col cols="auto">
                                <h4 class="h-color font-weight-bolder ml-2">Shipper</h4>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label="Name:*" label-for="input-horizontal"
                                    class="form-control-sm col-form-label">
                                    <div class="aselect mt-1">
                                        <div class="selector box">
                                            <div class="arrow box"></div>
                                            <select class="custom-select form-control-sm">
                                                <option value="Select a Shipper">Select a Shipper</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                            </select>
                                        </div>
                                    </div>
                                </b-form-group>
                                <div class="d-flex align-items-center mt-5">
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label-for="input-horizontal"
                                        class="form-control-sm col-form-label mr-3" label="">
                                        <b-form-input id="input-horizontal"
                                            class="form-control-sm ml-lg-30"></b-form-input>
                                    </b-form-group>
                                </div>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal" label="Account:"
                                    class="form-control-sm col-form-label mr-3">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-15"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Address:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-15"
                                        style="width: 220px;"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-31"
                                        style="width: 220px;"></b-form-input>
                                </b-form-group>
                                <div class="d-flex align-items-center mt-1">
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label-for="input-horizontal"
                                        class="form-control-sm col-form-label" label="City:">
                                        <b-form-input id="input-horizontal"
                                            class="form-control-sm ml-lg-22"></b-form-input>
                                    </b-form-group>
                                    <b-form-input id="input-horizontal" class="form-control-sm"
                                        style="width: 50px;"></b-form-input>
                                </div>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Post Code:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-11"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="State:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-20"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3 mb-3" label="Country:">
                                    <b-form-select class="form-control-sm ml-lg-15" style="width: 220px;">
                                        <option disabled value="Please select one">Please select one</option>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                    </b-form-select>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Phone:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-17"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Fax:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-22"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Telex:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-19"></b-form-input>
                                </b-form-group>

                                <b-form-checkbox size="sm" class="ml-lg-35"> Save new address to address
                                    book</b-form-checkbox>
                            </b-col>
                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                content-cols-lg="auto" label="" label-for="input-horizontal"
                                class="form-control-sm col-form-label mt-2">
                                <b-form-checkbox size="sm" class="mt-2 text-bold">Set as default e-AWB shipper for later
                                    logins</b-form-checkbox>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-col cols="auto">
                                <h4 class="h-color font-weight-bolder ml-2">Consignee</h4>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label="Name:*" label-for="input-horizontal"
                                    class="form-control-sm col-form-label">
                                    <div class="aselect mt-1 ml-2">
                                        <div class="selector box">
                                            <div class="arrow box"></div>
                                            <select class="custom-select form-control-sm">
                                                <option value="Select a Consignee">Select a Consignee</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                            </select>
                                        </div>
                                    </div>
                                </b-form-group>
                                <div class="d-flex align-items-center mt-5">
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label-for="input-horizontal"
                                        class="form-control-sm col-form-label mr-3">
                                        <b-form-input id="input-horizontal"
                                            class="form-control-sm ml-lg-16"></b-form-input>
                                    </b-form-group>
                                </div>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal" label="Account:"
                                    class="form-control-sm col-form-label mr-3">
                                    <b-form-input id="input-horizontal" class="form-control-sm"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Address:">
                                    <b-form-input id="input-horizontal" class="form-control-sm"
                                        style="width: 220px;"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-16"
                                        style="width: 220px;"></b-form-input>
                                </b-form-group>
                                <div class="d-flex align-items-center mt-1">
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label-for="input-horizontal"
                                        class="form-control-sm col-form-label" label="City:">
                                        <b-form-input id="input-horizontal"
                                            class="form-control-sm ml-lg-8"></b-form-input>
                                    </b-form-group>
                                    <b-form-input id="input-horizontal" class="form-control-sm"
                                        style="width: 50px;"></b-form-input>
                                </div>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Post Code:">
                                    <b-form-input id="input-horizontal" class="form-control-sm "></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="State:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-6"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3 mb-3" label="Country:">
                                    <b-form-select class="form-control-sm ml-lg-1" style="width: 220px;">
                                        <option disabled value="Please select one">Please select one</option>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                    </b-form-select>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Phone:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-3"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Fax:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-8"></b-form-input>
                                </b-form-group>
                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                    content-cols-lg="auto" label-for="input-horizontal"
                                    class="form-control-sm col-form-label mr-3" label="Telex:">
                                    <b-form-input id="input-horizontal" class="form-control-sm ml-lg-5"></b-form-input>
                                </b-form-group>

                                <b-form-checkbox size="sm" class="ml-lg-21"> Save new address to address
                                    book
                                </b-form-checkbox>
                            </b-col>
                        </b-col>
                    </b-row>
                    <hr class="hr">
                    <div>
                        <b-tabs content-class="mt-3" class="nav-tabs">
                            <b-tab title="Routing Information" style="border: 2px solid black !important;">
                                <b-row class="mt-5">
                                    <b-col cols="auto">
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                            label="Departure Airport*" label-for="input-departure-airport"
                                            class="form-control-sm col-form-label">
                                            <b-form-input id="input-departure-airport"
                                                class="form-control-sm ml-0 pl-0"></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <div class="d-flex flex-column align-items-center" style="margin-left: 8.5%;">
                                        <div class="container">
                                            <table class="table-bordered mx-auto table-sm">
                                                <thead>
                                                    <tr class="h_background_color">
                                                        <th class="form-control1">From</th>
                                                        <th class="form-control1">To</th>
                                                        <th class="form-control1" style="width: 50px;padding-left: 3%;">
                                                            By</th>
                                                        <th class="form-control1" style="width: 50px;padding-left: 3%;">
                                                            Flight
                                                        </th>
                                                        <th class="form-control1" style="width: 50px;padding-left: 3%;">
                                                            Date
                                                        </th>
                                                        <th class="form-control1" style="width: 80px;"></th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </div>
                                </b-row>
                                <b-row class="mt-5">
                                    <b-col cols="auto">
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                            label="Departure Airport*" label-for="input-departure-airport"
                                            class="form-control-sm col-form-label">
                                            <b-form-input id="input-departure-airport"
                                                class="form-control-sm"></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="1">Routing:*</b-col>
                                    <div class="d-flex flex-column align-items-center">
                                        <div class="container">
                                            <table class="mx-auto table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td class="editable-cell"><input type="text"
                                                                class="form-control"></td>
                                                        <td class="editable-cell"><input type="text"
                                                                class="form-control"></td>
                                                        <td class="editable-cell"><input type="text"
                                                                class="form-control" style="width: 40px;"></td>
                                                        <td class="editable-cell"><input type="text"
                                                                class="form-control" style="width: 50px;"></td>
                                                        <td class="editable-cell"><input type="text"
                                                                class="form-control" style="width: 60px;"></td>
                                                        <td class="editable-cell w-10" style="width: 60px">
                                                            <date-picker valueType="format"
                                                                style="width: 30px !important;"></date-picker>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </b-row>
                                <b-row class="justify-content-end" style="margin-right: 23%;">
                                    <div class="d-flex flex-column justify-content-end">
                                        <!-- <div class="container"> -->
                                        <table class="mx-auto table-sm">
                                            <tbody>
                                                <tr>
                                                    <td class="editable-cell"><input type="text" class="form-control">
                                                    </td>
                                                    <td class="editable-cell"><input type="text" class="form-control"
                                                            style="width: 40px;"></td>
                                                    <td class="editable-cell"><input type="text" class="form-control"
                                                            style="width: 50px;"></td>
                                                    <td class="editable-cell"><input type="text" class="form-control"
                                                            style="width: 60px;"></td>
                                                    <td class="editable-cell w-10" style="width: 60px !important;">
                                                        <date-picker valueType="format"
                                                            style="width: 30px !important;"></date-picker>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!-- </div> -->
                                    </div>
                                </b-row>
                                <b-row class="justify-content-end" style="margin-right: 23%;">
                                    <div class="d-flex flex-column justify-content-end">
                                        <!-- <div class="container"> -->
                                        <table class="mx-auto table-sm">
                                            <tbody>
                                                <tr>
                                                    <td class="editable-cell"><input type="text" class="form-control">
                                                    </td>
                                                    <td class="editable-cell"><input type="text" class="form-control"
                                                            style="width: 40px;"></td>
                                                    <td class="editable-cell"><input type="text" class="form-control"
                                                            style="width: 50px;"></td>
                                                    <td class="editable-cell"><input type="text" class="form-control"
                                                            style="width: 60px;"></td>
                                                    <td class="editable-cell" style="width: 60px !important;">
                                                        <date-picker valueType="format"
                                                            style="width: 30px !important;"></date-picker>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!-- </div> -->
                                    </div>
                                </b-row>
                            </b-tab>
                            <b-tab title="Search Flights" style="border: 2px solid black !important;">
                                <div class="d-flex flex-column align-items-start py-5">
                                    <table class="table-bordered table-sm">
                                        <thead>
                                            <tr class="h_background_color">
                                                <th class="form-control1">Carrier</th>
                                                <th class="form-control1">Origin</th>
                                                <th class="form-control1">Destination</th>
                                                <th class="form-control1">Flight Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="editable-cell"><input type="text" class="form-control">
                                                </td>
                                                <td class="editable-cell"><input type="text" class="form-control">
                                                </td>
                                                <td class="editable-cell"><input type="text" class="form-control">
                                                </td>
                                                <td class="editable-cell"><input type="text" class="form-control">
                                                </td>
                                                <date-picker valueType="format"
                                                    style="width: 30px !important;"></date-picker>
                                                <!-- <Datepicker format="yyyy-MM-dd" class="small-datepicker mb-2">
                                                </Datepicker> -->
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>
                    <hr class="hr">
                    <div class="py-5">
                        <div class="d-flex justify-content-between align-items-center">
                            <h4 class="h-color font-weight-bolder ml-2 mb-0">Consignment Rate Description</h4>
                            <div>
                                <b-button class="btn-secondary mr-2">
                                    <b-icon icon="search" font-scale="1"></b-icon>Get Rates
                                </b-button>
                                <b-button class="btn-secondary">
                                    <b-icon icon="calendar2-minus-fill" font-scale="1"></b-icon>Collect house waybill
                                    sum's
                                </b-button>
                            </div>
                        </div>
                        <b-button class="mt-5" v-b-modal.modal-consignment variant="warning">Add Consignment
                            Information</b-button>
                        <b-modal id="modal-consignment" title="Consignment Information" size="xl" ok-only>
                            <div class="d-block">
                                <b-row>
                                    <!-- First Column -->
                                    <b-col cols="6">
                                        <h6>Pieces and Nature and Quantity of Goods</h6>
                                        <div class="bg-light pl-2">
                                            <label for="">Pieces</label>
                                            <b-form-input id="input-departure-airport"
                                                class="form-control-sm"></b-form-input>
                                            <label for="">Description</label>
                                            <b-form-textarea
                                                style="grid-column: span 2 !important;width:100% !important"
                                                id="textarea" rows="3" max-rows="6"></b-form-textarea>
                                            <table class="table table-sm">
                                                <tbody>
                                                    <tr>
                                                        <th>Rate Class:</th>
                                                        <th>ULD Rate class:</th>
                                                    </tr>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <b-form-select class="form-control" style="width:320px">
                                                                <option>Please choose a Custom Origin</option>
                                                                <option>A</option>
                                                                <option>B</option>
                                                                <option>C</option>
                                                            </b-form-select>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width: 170px;">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Service code</th>
                                                        <th>Commodity Item</th>
                                                    </tr>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <b-form-select class="form-control" style="width:320px">
                                                                <option>Please choose a Custom Origin</option>
                                                                <option>A</option>
                                                                <option>B</option>
                                                                <option>C</option>
                                                            </b-form-select>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width: 170px;">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Country Of Origin of Goods</th>
                                                        <th>Slac:</th>
                                                    </tr>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <b-form-select class="form-control" style="width:320px">
                                                                <option>Please choose a Custom Origin</option>
                                                                <option>A</option>
                                                                <option>B</option>
                                                                <option>C</option>
                                                            </b-form-select>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width: 170px;">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Hs Codes:</th>
                                                    </tr>
                                                    <tr>
                                                        <td class="editable-cell"
                                                            style="display: flex; align-items: center;">
                                                            <input type="text" class="form-control"
                                                                style="width: 170px; margin-right: 10px;">
                                                            <button>Add</button>
                                                        </td>
                                                    </tr>
                                                    <tr class="h_background_color">
                                                        <th>HS Codes</th>
                                                    </tr>
                                                    <tr>
                                                        <td class="editable-cell"
                                                            style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                            <span>testing</span>
                                                            <b-icon icon="trash" font-scale="1"></b-icon>
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
                                                        <th>Chargeable Weight</th>
                                                        <th>Rate</th>
                                                    </tr>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width:70px;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <b-form-select class="form-control" style="width:70px;">
                                                                <option>Kg</option>
                                                                <option>Lbs</option>
                                                            </b-form-select>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control" style="width:70px;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width:100px;">
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
                                                                style="width: 100%;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width: 100%;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width: 100%;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width: 100%;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width: 100%;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <b-form-select class="form-control" style="width: 100%;">
                                                                <option>Kg</option>
                                                                <option>Lbs</option>
                                                            </b-form-select>
                                                        </td>
                                                        <td class="editable-cell">
                                                            <button>Add</button>
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
                                                    <tr>
                                                        <td class="editable-cell">
                                                            2
                                                        </td>
                                                        <td class="editable-cell">
                                                            3
                                                        </td>
                                                        <td class="editable-cell">
                                                            10
                                                        </td>
                                                        <td class="editable-cell">
                                                            30
                                                        </td>
                                                        <td class="editable-cell">
                                                            40
                                                        </td>
                                                        <td class="editable-cell"
                                                            style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                            <span class="mr-3">CMT</span>
                                                            <b-icon icon="trash" font-scale="1"></b-icon>
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
                                                            style="width:80px"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="auto">
                                                    <b-form-select class="form-control"
                                                        style="width:70px;margin-right: 10px;">
                                                        <option>m3</option>
                                                        <option>cm3</option>
                                                        <option>ft3</option>
                                                        <option>in3</option>
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
                                                                style="width:100px;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width:100px;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <input type="text" class="form-control"
                                                                style="width:100px;">
                                                        </td>
                                                        <td class="editable-cell">
                                                            <button>Add</button>
                                                        </td>
                                                    </tr>
                                                    <tr class="h_background_color">
                                                        <th>ULD Type:</th>
                                                        <th>ULD Serial:</th>
                                                        <th>Owner:</th>
                                                        <th></th>
                                                    </tr>
                                                    <tr>
                                                        <td class="editable-cell">
                                                            2
                                                        </td>
                                                        <td class="editable-cell">
                                                            3
                                                        </td>
                                                        <td class="editable-cell">
                                                            10
                                                        </td>
                                                        <td class="editable-cell"
                                                            style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                            <b-icon icon="trash" font-scale="1"></b-icon>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </b-col>
                                </b-row>
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-secondary">Add</button>
                                </div>
                            </div>
                        </b-modal>

                        <div class="d-flex flex-column align-items-center mb-5 mt-5">
                            <div class="">
                                <table class="table-bordered mx-auto table-sm">
                                    <thead>
                                        <tr class="h_background_color" style="font-size: 10px;">
                                            <th class="form-control1">Pcs.</th>
                                            <th class="form-control1">Description</th>
                                            <th class="form-control1">Srv. Code</th>
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
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="d-flex justify-content-end ml-auto">
                                <div class="d-flex align-items-center">
                                    <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-">
                                        <div class="d-flex align-items-center">
                                            <label for="input-horizontal" class="mr-2 mb-0">Total Volume:</label>
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm mr-2"></b-form-input>
                                            <b-form-select class="form-control-sm">
                                                <option disabled value="Please select one">Please select one</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                            </b-form-select>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <label for="input-horizontal" class="mr-2 mb-0">Total Amount:</label>
                                            <b-form-input id="input-horizontal"
                                                class="form-control-sm mr-2"></b-form-input>
                                        </div>
                                    </b-form-group>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="hr">
                    <div>
                        <h5>Customs Origin Code:</h5>
                        <b-form-group id="fieldset-horizontal" class="form-control-sm col-form-label"
                            style="width: 350px;">
                            <b-form-select class="form-control-sm">
                                <option>Please choose a Custom Origin</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                            </b-form-select>
                        </b-form-group>
                        <div class="py-md-9">
                            <b-tabs content-class="mt-3">
                                <b-tab title="OSI" active>
                                    <h5>Other Service Information:</h5>
                                    <div class="py-7">
                                        <b-form-textarea class=""
                                            style="grid-column: span 2 !important;width: 60% !important" id="textarea"
                                            rows="3" max-rows="6"></b-form-textarea>
                                    </div>
                                </b-tab>
                                <b-tab title="SSR">
                                    <h5>Special Service Request:</h5>
                                    <div class="py-7">
                                        <b-form-textarea class=""
                                            style="grid-column: span 2 !important;width: 60% !important" id="textarea"
                                            rows="3" max-rows="6"></b-form-textarea>
                                    </div>
                                </b-tab>
                                <b-tab title="Accounting Information">
                                    <h5>Accounting Information:</h5>
                                    <div class="py-7">
                                        <b-form-textarea class=""
                                            style="grid-column: span 2 !important;width: 60% !important" id="textarea"
                                            rows="3" max-rows="6"></b-form-textarea>

                                        <b-form-checkbox size="sm">Letter Of Credit</b-form-checkbox>
                                    </div>
                                </b-tab>
                                <b-tab title="Shipment Reference Infomation">
                                    <h4 class="h-color font-weight-bolder ml-2">Shipment Reference Information</h4>
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label-for="input-horizontal"
                                        label="Shipment Reference Number:" class="form-control-sm col-form-label">
                                        <b-form-input id="input-horizontal"
                                            class="form-control-sm ml-lg-14"></b-form-input>
                                    </b-form-group>
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label-for="input-horizontal"
                                        label="Supplementary Shipment Information:"
                                        class="form-control-sm col-form-label">
                                        <b-form-input id="input-horizontal" class="form-control-sm"></b-form-input>
                                    </b-form-group>
                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                        content-cols-lg="auto" label-for="input-horizontal"
                                        class="form-control-sm col-form-label ml-lg-30">
                                        <b-form-input id="input-horizontal"
                                            class="form-control-sm ml-lg-36 ml-sm-16 ml-md-16 ml-auto"></b-form-input>
                                    </b-form-group>
                                </b-tab>
                                <b-tab title="IATA and Cass">
                                    <h5 class="ml-5 py-5">Override IATA And Cass:</h5>
                                    <b-row>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label-for="input-horizontal" label="IATA:"
                                                class="form-control-sm col-form-label">
                                                <b-form-input id="input-horizontal"
                                                    class="form-control-sm"></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto mr-7">
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                content-cols-lg="auto" label="Cass:" label-for="input-horizontal"
                                                class="form-control-sm col-form-label">
                                                <b-form-input id="input-horizontal"
                                                    class="form-control-sm"></b-form-input>

                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="auto ml-7" style="padding-left:9.3%;">
                                            <b-form-group label-for="name-input">
                                                <b-form-checkbox size="sm">Save information for later
                                                    logins</b-form-checkbox>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </b-tab>
                                <b-tab title="Agent Information">
                                    <p>I'm a disabled tab!</p>
                                </b-tab>

                                <b-tab title="Also Notify">
                                    <h4 class="h-color font-weight-bolder ml-2 mt-2">Also Notify</h4>
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
                                    <h5>Extra information printed of Air Way Bill (Only printed - not saved or sent to
                                        Airlines):</h5>
                                    <b-form-textarea class=""
                                        style="grid-column: span 2 !important;width: 60% !important" id="textarea"
                                        rows="3" max-rows="6"></b-form-textarea>
                                </b-tab>
                                <b-tab title="Carrier Address">
                                    <h4 class="h-color font-weight-bolder ml-2 mt-2"> Override the Carrier Address on
                                        the PDF
                                        Document</h4>
                                    <h6>(This can be used for non-IATA carriers)</h6>
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
                    <hr class="hr">
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
                                            <b-form-select class="form-control-sm">
                                                <option>Select an Other Charge Code</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                            </b-form-select>
                                        </b-form-group>
                                    </b-col>
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
                                            <b-form-input id="input-horizontal" class="form-control-sm"></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-form-group id="fieldset-horizontal"
                                            class="form-control-sm col-form-label mt-2">
                                            <b-form-radio name="radio-size" size="sm">Due Agent </b-form-radio>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-form-group id="fieldset-horizontal"
                                            class="form-control-sm col-form-label mt-2">
                                            <b-form-radio name="radio-size" size="sm">Due Carrier</b-form-radio>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-form-group id="fieldset-horizontal"
                                            class="form-control-sm col-form-label mt-2">
                                            <b-form-radio name="radio-size" size="sm">Prepaid</b-form-radio>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-form-group id="fieldset-horizontal"
                                            class="form-control-sm col-form-label mt-2">
                                            <b-form-radio name="radio-size" size="sm">Collect</b-form-radio>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-form-group id="fieldset-horizontal"
                                            class="form-control-sm col-form-label mt-2">
                                            <b-button class="bg-secondary form-control-sm px-5">Add</b-button>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                                <div class="d-flex flex-column align-items-start py-5">
                                    <!-- <div class="container"> -->
                                    <table class="table-bordered table-sm">
                                        <thead>
                                            <tr class="h_background_color">
                                                <th class="form-control1">Calculate Charge</th>
                                                <th class="form-control1"></th>
                                                <th class="form-control1"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="editable-cell">Chargeable Weight
                                                </td>
                                                <td class="editable-cell"><input type="text" class="form-control"
                                                        style="width: 50px;" value="0">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="editable-cell">Charge
                                                </td>
                                                <td class="editable-cell"><input type="text" class="form-control"
                                                        style="width: 50px;" value="">
                                                </td>
                                                <td class="editable-cell mb-2"><input type="button" class="form-control"
                                                        style="width: 100px;font-size:12px;font-weight:bold"
                                                        value="Calculate">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <!-- </div> -->
                                </div>
                                <div class="d-flex flex-column align-items-start py-5">
                                    <!-- <div class="container"> -->
                                    <table class="table-bordered table-sm" style="width:100%">
                                        <thead>
                                            <tr class="h_background_color">
                                                <th class="form-control1">Code</th>
                                                <th class="form-control1">Due</th>
                                                <th class="form-control1">Amount</th>
                                                <th class="form-control1">Type Of Payment</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <!-- </div> -->
                                </div>
                                <hr class="hr">
                            </b-tab>
                        </b-tabs>
                    </div>
                    <hr class="hr">
                    <div class="py-7">
                        <b-tabs>
                            <b-tab title="Payment Information" active style="background-color: white !important;">
                                <div>
                                    <b-row>
                                        <b-col cols="7">
                                            <b-row class="justify-content-center mt-5">
                                                <b-col>
                                                    <b-col cols="auto">
                                                        <div class="d-flex align-items-center mt-1">
                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                content-cols-sm content-cols-lg="auto"
                                                                label-for="input-horizontal"
                                                                class="form-control-sm col-form-label mr-3 mb-3"
                                                                label="Type Of Payment:*">
                                                                <b-form-select class="form-control-sm ml-lg-15"
                                                                    style="width: 220px;">
                                                                    <option disabled value="Please select one">Please
                                                                        select one
                                                                    </option>
                                                                    <option>A</option>
                                                                    <option>B</option>
                                                                    <option>C</option>
                                                                </b-form-select>
                                                            </b-form-group>
                                                            <lable class="ml-3 mt-4 mb-5 mr-5">Currency:</lable>
                                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                                style="width: 50px;"></b-form-input>
                                                        </div>
                                                        <lable class="ml-3 mt-5 mb-5">Declared Values For:</lable>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-horizontal" label="Carriage :"
                                                            class="form-control-sm col-form-label mr-3">
                                                            <b-form-input id="input-horizontal"
                                                                class="form-control-sm ml-lg-31 mt-3"
                                                                style="width: 220px;"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-horizontal"
                                                            class="form-control-sm col-form-label mr-3"
                                                            label="Customs :">
                                                            <b-form-input id="input-horizontal"
                                                                class="form-control-sm ml-lg-31 mt-3"
                                                                style="width: 220px;"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-horizontal" label="Insurance:"
                                                            class="form-control-sm col-form-label mr-3">
                                                            <b-form-input id="input-horizontal"
                                                                class="form-control-sm ml-lg-30 mt-3"
                                                                style="width: 220px;"></b-form-input>
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

                                                    <tr class="column_b">
                                                        <td class="editable-cell1">
                                                            Weight Charge (WT)
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                    </tr>
                                                    <tr class="column_b">
                                                        <td class="editable-cell1">
                                                            Taxes (TX)
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                    </tr>
                                                    <tr class="column_b">
                                                        <td class="editable-cell1">
                                                            Other Charges Due Agent (OA)
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                    </tr>
                                                    <tr class="column_b">
                                                        <td class="editable-cell1">
                                                            Other Charges Due Carrier (OC)
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                    </tr>
                                                    <tr class="">
                                                        <td class="editable-cell1">
                                                            Total Charges
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                        <td class="editable-cell1">
                                                            0.00 INR
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </b-col>
                                    </b-row>
                                </div>
                            </b-tab>
                            <!-- <b-tab title="Other Changes" style="background-color: white !important;"></b-tab> -->
                            <b-tab title="Special Handling Codes" style="background-color: white !important;">
                                <div>
                                    <b-row>
                                        <b-col cols="auto">
                                            <b-form-group id="fieldset-horizontal"
                                                class="form-control-sm col-form-label mt-2">
                                                <b-form-select class="form-control-sm">
                                                    <option>Select an Other Charge Code</option>
                                                    <option>A</option>
                                                    <option>B</option>
                                                    <option>C</option>
                                                </b-form-select>
                                            </b-form-group>
                                        </b-col>
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
                                                    type="button">Add</b-button>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </div>
                                <div class="d-flex flex-column align-items-start py-5">
                                    <table class="table-bordered table-sm" style="width:31%">
                                        <thead>
                                            <tr class="h_background_color">
                                                <th class="form-control1">Code</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="editable-cell"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </b-tab>
                            <b-tab title="Other Customs Information" style="background-color: white !important;">
                                <p>I'm a disabled tab!</p>
                            </b-tab>
                        </b-tabs>
                    </div>
                    <hr class="hr">
                    <div class="py-7">
                        <b-row class="justify-content-end">
                            <b-col cols="auto" class="text-right">
                                <b-form-group
                                    id="fieldset-horizontal"
                                    label-cols-lg="auto"
                                    label-for="input-horizontal"
                                    label="Email PDF copy To:"
                                    class="form-control-sm col-form-label">
                                    <b-form-input
                                        id="input-horizontal"
                                        class="form-control-sm"
                                        style="width: 320px;">
                                    </b-form-input>
                                </b-form-group>
                                <b-form-checkbox size="sm" class="text-left ml-4">Including Cargo Label</b-form-checkbox> 
                                <p>(separate addresses with a semicolon ';')</p>
                            </b-col>
                        </b-row>
                    </div>
                    <hr class="hr">
                    <div class="py-7">
                        <div class="d-flex justify-content-end">
                            <b-button class="mr-2">Generate PDF</b-button>
                            <b-button class="mr-2">Send</b-button>
                            <b-button class="mr-2">Send & Clear</b-button>
                            <b-button>Save Draft</b-button>
                        </div>
                    </div>
                </div>
            </form>
            <!-- </template> -->
        </div>
    </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
export default {
    data() {
        return {
            isOpen: false,
            items: [
                {
                    url: '#webdoc',
                    name: 'WebDoc'
                },
                {
                    url: '#booking',
                    name: 'Booking(FFR)'
                },
                {
                    url: '#webdoc',
                    name: 'WebDoc',
                    children: [
                        {
                            url: '#booking',
                            name: 'Booking(FFR)'
                        },
                        {
                            url: '#air_waybill',
                            name: 'Air Waybill(FWB)',
                        },
                        {
                            url: '#house_waybill',
                            name: 'House Waybill(FHL)'
                        },
                        {
                            url: '#consolidation',
                            name: 'Consolidation(FHL)'
                        },
                        {
                            url: '#import_mail_data',
                            name: 'Import Mail Data'
                        },
                        {
                            url: '#create_label',
                            name: 'Create Label'
                        },
                        {
                            url: '#message_log',
                            name: 'Message Log'
                        },
                        {
                            url: '#maintain_contracts',
                            name: 'Maintain Contracts'
                        },
                        {
                            url: '#web_doc_printer_setup',
                            name: 'WebDoc Printer Setup'
                        },
                        {
                            url: '#help',
                            name: 'Help'
                        },
                    ]
                },
                {
                    url: '#contact',
                    name: 'Contact'
                }
            ],
            options: [
                { text: 'Me', value: '1' },
                { text: 'Participant Group', value: '1' }
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
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide();
        },
        toggleModal() {
            this.$refs['my-modal'].toggle('#toggle-btn');
        },
        handleOk(bvModalEvent) {
            bvModalEvent.preventDefault();
        },
    },
    components: {
        Datepicker,
        DatePicker
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