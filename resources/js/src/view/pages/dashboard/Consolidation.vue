<template>
    <div class="body-color">
        <div class="container-fluid">
            <!-- Include Page Loader -->
            <!-- <PageLoader></PageLoader> -->
            <div class="d-flex flex-column flex-lg-row">
                <SideBar></SideBar>
                <div style="background: #ffffff; border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1); z-index: 1; border-radius: 32px; flex: 1; min-width: 0;">
                    <div class="container py-8 px-6 px-sm-8 px-md-10">
                        <b-row class="align-items-center mb-8">
                            <b-col cols="12" md="6">
                                <div class="d-flex flex-column">
                                    <span style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 700; color: #355594; opacity: 0.6; margin-bottom: 0.5rem; display: block;">Navigation</span>
                                    <h6 style="color:#355594;font-size:26px !important;line-height:34px !important;font-weight:800 !important;letter-spacing:-0.5px !important;margin-bottom:1rem;font-family:'Inter', sans-serif !important;">Documentation</h6>
                                    <b-form-group id="fieldset-horizontal" class="mb-0">
                                        <div class="d-flex align-items-center" style="background:#F0F7FF;border-radius:12px;padding:6px 16px;width:fit-content;border:1px solid #E6F0FF;">
                                            <b-icon icon="folder2-open" style="color:#355594;font-size:1.2rem;margin-right:12px;"></b-icon>
                                            <b-form-select 
                                                style="width: 180px;border: 0px !important;color: #355594;font-weight: 600;background:transparent;cursor:pointer;outline:none;box-shadow:none;padding-left:0;"
                                                class="form-control-sm"
                                                v-model="selectedViewPageOption"
                                                @change="onSelect">
                                                <option value="/focus-air">Master Airway Bill</option>
                                                <option value="/house-way-bill">Houseway Bill</option>
                                                <option value="/consolidation">Consolidation</option>
                                                <!-- <option value="/message-log">Message Log</option> -->
                                            </b-form-select>
                                        </div>
                                    </b-form-group>
                                </div>
                            </b-col>
                            <b-col cols="12" md="6" class="mt-6 mt-md-0">
                                <div class="d-flex justify-content-md-end flex-wrap" style="gap: 12px; align-items: center;">
                                    <b-button @click.prevent="getHousewayBills('send')" v-b-modal.modal-s-consolidation class="show-btn">
                                        <b-icon icon="clock-history" class="mr-2"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">10 Latest</b>
                                    </b-button>
                                </div>
                            </b-col>

                            <!-- 10 Latest model code start here -->
                            <!-- History List Modals from reusable component -->
                            <DashboardHistoryModal 
                                id="modal-s-consolidation" 
                                title="Latest Messages" 
                                mode="send" 
                                docType="consolidation"
                                :items="data_items" 
                                :isFetching="isFetching"
                                @action="selectAndSearchAwb"
                            >
                                <template #actions="{ item }">
                                    <div class="d-flex flex-column align-items-end">
                                        <p class="text-muted small mb-1 font-weight-bold">
                                            Issued: {{ formatDate(item.updated_at) }}
                                        </p>
                                    </div>
                                </template>
                            </DashboardHistoryModal>
                        </b-row>
                    </div>
                    <hr class="hr" />
                    <div class="container px-6 px-sm-8 px-md-10 pt-6 pb-10">
                    <b-row>
                        <b-col cols="12">
                            <div class="align-items-center">
                                <h4 class="h-color ml-4 mb-0">
                                    {{ form.id ? 'Edit House Waybill Details' : 'Create Electronic Consolidation (FHL)' }}
                                </h4>
                            </div>
                            <div class="d-flex align-items-center ml-4 mt-7">
                                 <b-form-group id="fieldset-horizontal" label-cols="auto" content-cols="auto"
                                     label-for="input-horizontal"
                                     class="align-items-center mb-0">
                                     <template #label>
                                         <span class="mr-2">Master no:</span>
                                         <span class="text-danger mr-2">*</span>
                                     </template>
                                     <div class="d-flex align-items-center flex-wrap" style="gap: 8px;">
                                         <b-form-input id="input-horizontal" class="form-control awb-code-input" style="width: 62px;"
                                             v-model="form.awb_code" :class="{ 'is-invalid': form.errors.has('awb_code') }" v-on:keypress="validateNumericInput($event, 'awb_code', 3)">
                                         </b-form-input>
                                         <span>-</span>
                                         <b-form-input id="input-horizontal-2" class="form-control awb-no-input" style="width: 150px"
                                             v-model="form.awb_no" :class="{ 'is-invalid': form.errors.has('awb_no') }" v-on:keypress="validateNumericInput($event, 'awb_no', 8)">
                                         </b-form-input>
                                         <b-button class="show-btn ml-2" @click="searchWayBills">Search</b-button>
                                     </div>
                                 </b-form-group>
                             </div>
                            <has-error :form="form" field="awb_code" :class="{ 'd-block': form.errors.has('awb_code') }"></has-error>
                            <has-error :form="form" field="awb_no" :class="{ 'd-block': form.errors.has('awb_no') }"></has-error>
                        </b-col>
                    </b-row>
                    <div v-if="hasSearchResults">
                        <hr class="hr" />
                        <b-row>
                            <b-col cols="12">
                                <div class="d-flex align-items-start py-2">
                                    <div class="table-responsive-wrapper"><table v-if="existingData" style="width: 100%;">
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
                                                    <a :href="'/edit-airway-bill/' + String(existingData.id)" class="custom-link" @click="getAirWayBill(String(existingData.id))">
                                                        <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + String(existingData.id)" custom>
                                                            <b-button class="" style="background:#A4D3EE;">
                                                                <b-icon icon="pencil" font-scale="1"></b-icon>
                                                            </b-button>
                                                        </router-link>
                                                    </a>
                                                </td>
                                                <td class="">
                                                    {{ String(existingData.awb_code) }}-{{ String(existingData.awb_no) }}
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
                                    </table></div>
                                </div>
                            </b-col>
                        </b-row>
                        <hr class="hr" />
                        <b-row>
                            <b-col cols="12">
                                <div class="py-5">
                                    <b-tabs content-class="mt-3" class="custom-nav">
                                         <b-tab title="House Waybill Details">
                                             <div class="ml-3 mt-8">
                                                 <div class="py-7">
                                                     <b-row>
                                                         <!-- Row 1: HWB No, Origin, Destination -->
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">HWB No <span class="text-danger">*</span></label>
                                                             <b-form-input id="input-hwb" class="form-control" v-model="form.id" disabled></b-form-input>
                                                         </b-col>
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Origin <span class="text-danger">*</span></label>
                                                             <div class="custom-dropdown" ref="dropdownContainer_departure" @click="toggleDropdown_departure">
                                                                 <input type="text" v-model="form.master_origin" placeholder="Search Origin" id="departure" class="form-control" autocomplete="off">
                                                                 <div v-if="isDropdownOpen_departure && filteredLocations_departure.length" class="dropdown-options">
                                                                     <div v-for="(item, index) in filteredLocations_departure" 
                                                                         :key="index" 
                                                                         @click.stop="selectOption_departure(item)" 
                                                                         class="option">
                                                                         {{ item.iata_code }} ({{ item.destination }})
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                         </b-col>
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Destination <span class="text-danger">*</span></label>
                                                             <div class="custom-dropdown" ref="dropdownContainer_destination" @click="toggleDropdown_destination">
                                                                 <input type="text" v-model="form.master_destination" placeholder="Search destination" id="destination" class="form-control" autocomplete="off">
                                                                 <div v-if="isDropdownOpen_destination && filteredLocations_destination.length" class="dropdown-options">
                                                                     <div v-for="(item, index) in filteredLocations_destination" 
                                                                         :key="index" 
                                                                         @click.stop="selectOption_destination(item)" 
                                                                         class="option">
                                                                         {{ item.iata_code }} ({{ item.destination }})
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                         </b-col>
                                                     </b-row>
                                                     <b-row>
                                                         <!-- Row 2: Pieces, Weight, Volume -->
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Pieces <span class="text-danger">*</span></label>
                                                             <div class="d-flex align-items-center">
                                                                 <b-form-input id="input-pieces-1" class="form-control" style="width: 80px;" v-model="form.pieces"></b-form-input>
                                                                 <span class="px-3 text-muted">of</span>
                                                                 <b-form-input id="input-pieces-2" class="form-control" style="width: 80px;" v-model="form.pieces"></b-form-input>
                                                             </div>
                                                         </b-col>
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Weight <span class="text-danger">*</span></label>
                                                             <b-form-input id="input-weight" class="form-control" v-model="form.gross_weight"></b-form-input>
                                                         </b-col>
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Volume</label>
                                                             <div class="d-flex align-items-center">
                                                                 <b-form-input id="input-volume" class="form-control mr-2" style="flex: 1;"></b-form-input>
                                                                 <b-form-select class="form-control" style="width: 90px;">
                                                                     <option value="">cm3</option>
                                                                     <option value="CC">m3</option>
                                                                     <option value="CC">ft3</option>
                                                                     <option value="CC">in3</option>
                                                                 </b-form-select>
                                                             </div>
                                                         </b-col>
                                                     </b-row>
                                                     <b-row>
                                                         <!-- Row 3: Nature of Goods -->
                                                         <b-col cols="12" class="mb-4">
                                                             <label class="premium-field-label">Nature of Goods <span class="text-danger">*</span></label>
                                                             <b-form-input id="input-goods" class="form-control" v-model="form.description"></b-form-input>
                                                         </b-col>
                                                     </b-row>
                                                     <b-row class="align-items-end">
                                                         <!-- Row 4: Handling Codes selection -->
                                                         <b-col cols="12" md="6" class="mb-4">
                                                             <label class="premium-field-label">Handling Codes</label>
                                                             <div class="d-flex align-items-center">
                                                                 <b-form-select class="form-control mr-2" style="flex: 1;" v-model="selectedCode">
                                                                     <option disabled value="">Select Special Handling Codes</option>
                                                                     <option v-for="code in codes" :key="code.value" :value="code.value">{{ code.text }}</option>
                                                                     <option value="">Select Special Handling Codes</option>
                                                                 </b-form-select>
                                                                 <span class="px-2 text-muted">Or</span>
                                                                 <b-form-input id="input-custom-handling" class="form-control ml-2" style="width: 120px;" placeholder="Custom Code" v-model="custom_special_handling_code"></b-form-input>
                                                             </div>
                                                         </b-col>
                                                         <b-col cols="12" md="6" class="mb-4 d-flex justify-content-start" style="gap: 12px;">
                                                             <b-button class="show-btn" @click="addManualCode">
                                                                 <b-icon icon="plus-circle" class="mr-1"></b-icon> Add Code
                                                             </b-button>
                                                             <b-button @click.prevent="getHousewayBills('send')" v-b-modal.modal-s-consolidation class="btn btn-outline-secondary" style="border-radius: 10px; height: 38px; font-weight: 500;">
                                                                 <b-icon icon="clock-history" class="mr-1"></b-icon> 10 Latest
                                                             </b-button>
                                                         </b-col>
                                                     </b-row>
                                                     <b-row>
                                                         <!-- Row 5: Table of handling codes -->
                                                         <b-col cols="12" class="mt-4">
                                                             <div class="table-responsive-wrapper">
                                                                 <table class="table table-bordered table-hover" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border-collapse: separate; border-spacing: 0;">
                                                                     <thead>
                                                                         <tr style="background-color: #F8FAFC;">
                                                                             <th class="font-weight-bold py-3 px-4" style="color: #475569; font-size: 13px; border-bottom: 2px solid #E2E8F0;">Special Handling Codes</th>
                                                                             <th class="text-center font-weight-bold py-3 px-4" style="width: 100px; color: #475569; font-size: 13px; border-bottom: 2px solid #E2E8F0;">Action</th>
                                                                         </tr>
                                                                     </thead>
                                                                     <tbody>
                                                                         <tr v-if="!form.tableCodes || form.tableCodes.length === 0">
                                                                             <td colspan="2" class="text-center text-muted py-4">No special handling codes added yet.</td>
                                                                         </tr>
                                                                         <tr v-for="(code, index) in form.tableCodes" :key="index">
                                                                             <td class="py-3 px-4" style="color: #1E293B; font-weight: 500;">{{ code }}</td>
                                                                             <td class="text-center py-2 px-4">
                                                                                 <b-button variant="flat" size="sm" class="text-danger p-1" @click="deleteSplCode(index)" style="background: transparent; border: none;">
                                                                                     <b-icon icon="trash" font-scale="1.2"></b-icon>
                                                                                 </b-button>
                                                                             </td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
                                                             </div>
                                                         </b-col>
                                                     </b-row>
                                                 </div>
                                             </div>
                                         </b-tab>
                                         <b-tab title="Other Customs Information">
                                             <div class="ml-3 mt-8">
                                                 <div class="py-7">
                                                     <b-row>
                                                         <!-- Row 1: Country Code, Info Identifier, Customs Info Identifier -->
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Country Code</label>
                                                             <b-form-select class="form-control" v-model="oci_info.country_code">
                                                                 <option value="">Select a country</option>
                                                                 <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                     {{ country.text }}
                                                                 </option>
                                                             </b-form-select>
                                                         </b-col>
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Information Identifier</label>
                                                             <b-form-select class="form-control" v-model="oci_info.info_identifier" :class="{ 'is-invalid': form.errors.has('info_identifier') }">
                                                                 <option value="">Select a code</option>
                                                                 <option v-for="oci_option in oci_identifiers.identifiers" :key="oci_option.value" :value="oci_option.value">
                                                                     {{ oci_option.text }}
                                                                 </option>
                                                             </b-form-select>
                                                             <has-error :form="form" field="info_identifier"></has-error>
                                                         </b-col>
                                                         <b-col cols="12" md="4" class="mb-4">
                                                             <label class="premium-field-label">Customs Information Identifier</label>
                                                             <b-form-select class="form-control" v-model="oci_info.custom_info_identifier" :class="{ 'is-invalid': form.errors.has('custom_info_identifier') }">
                                                                 <option value="">Select a code</option>
                                                                 <option v-for="oci_options in oci_data.oci_custom_info_identifier" :key="oci_options.value" :value="oci_options.value">
                                                                     {{ oci_options.text }}
                                                                 </option>
                                                             </b-form-select>
                                                             <has-error :form="form" field="custom_info_identifier"></has-error>
                                                         </b-col>
                                                     </b-row>
                                                     <b-row class="row-gap-3 align-items-end">
                                                         <!-- Row 2: Supplementary Info & Button -->
                                                         <b-col cols="12" md="9" class="mb-4">
                                                             <label class="premium-field-label">Supplementary Information</label>
                                                             <b-form-input id="input-supplementary" class="form-control" v-model="oci_info.supplementary_info"></b-form-input>
                                                         </b-col>
                                                         <b-col cols="12" md="3" class="mb-4 d-flex justify-content-md-end">
                                                             <b-button class="show-btn btn-block" @click="addOtherCustomInfo" style="height: 38px;">
                                                                 <b-icon :icon="editIndex !== null ? 'check-circle' : 'plus-circle'" class="mr-1"></b-icon>
                                                                 {{ editIndex !== null ? 'Update OCI' : 'Add OCI' }}
                                                             </b-button>
                                                         </b-col>
                                                     </b-row>
                                                     <b-row>
                                                         <!-- Row 3: OCI Table entries -->
                                                         <b-col cols="12" class="mt-4">
                                                             <div class="table-responsive-wrapper">
                                                                 <table class="table table-bordered table-hover" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border-collapse: separate; border-spacing: 0;">
                                                                     <thead>
                                                                         <tr style="background-color: #F8FAFC;">
                                                                             <th class="font-weight-bold py-3 px-4" style="color: #475569; font-size: 13px; border-bottom: 2px solid #E2E8F0;">Country Code</th>
                                                                             <th class="font-weight-bold py-3 px-4" style="color: #475569; font-size: 13px; border-bottom: 2px solid #E2E8F0;">Info Identifier</th>
                                                                             <th class="font-weight-bold py-3 px-4" style="color: #475569; font-size: 13px; border-bottom: 2px solid #E2E8F0;">Customs Info Identifier</th>
                                                                             <th class="font-weight-bold py-3 px-4" style="color: #475569; font-size: 13px; border-bottom: 2px solid #E2E8F0;">Supplementary Info</th>
                                                                             <th class="text-center font-weight-bold py-3 px-4" style="width: 120px; color: #475569; font-size: 13px; border-bottom: 2px solid #E2E8F0;">Action</th>
                                                                         </tr>
                                                                     </thead>
                                                                     <tbody>
                                                                         <tr v-if="!form.oci_entries || form.oci_entries.length === 0">
                                                                             <td colspan="5" class="text-center text-muted py-4">No custom information entries added yet.</td>
                                                                         </tr>
                                                                         <tr v-for="(row, index) in form.oci_entries" :key="index">
                                                                             <td class="py-3 px-4" style="color: #1E293B; font-weight: 500;">{{ row.country_code }}</td>
                                                                             <td class="py-3 px-4" style="color: #1E293B; font-weight: 500;">{{ row.info_identifier }}</td>
                                                                             <td class="py-3 px-4" style="color: #1E293B; font-weight: 500;">{{ row.custom_info_identifier }}</td>
                                                                             <td class="py-3 px-4" style="color: #1E293B; font-weight: 500;">{{ row.supplementary_info }}</td>
                                                                             <td class="text-center py-2 px-4">
                                                                                 <b-button variant="flat" size="sm" class="text-primary p-1 mr-2" @click="editOciInfo(index)" style="background: transparent; border: none;">
                                                                                     <b-icon icon="pencil" font-scale="1.2"></b-icon>
                                                                                 </b-button>
                                                                                 <b-button variant="flat" size="sm" class="text-danger p-1" @click="deleteOciInfo(index)" style="background: transparent; border: none;">
                                                                                     <b-icon icon="trash" font-scale="1.2"></b-icon>
                                                                                 </b-button>
                                                                             </td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
                                                             </div>
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
                                    <p class="mb-0 ml-4 mr-4 h-color" style="border-bottom: 1px solid #2637a8; cursor: pointer; font-size: 14px;" @click="cancelUpdate">Cancel</p>
                                    <p class="mb-0 ml-4 mr-4 h-color" style="border-bottom: 1px solid #2637a8; cursor: pointer; font-size: 14px;" @click="updateHouseWayBill">Update</p>
                                    <p class="mb-0 ml-4 mr-4 h-color" style="border-bottom: 1px solid #2637a8; cursor: pointer; font-size: 14px;" @click="addDetailsRow">Add details row</p>
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <div class="py-6">
                                    <div class="table-responsive-wrapper"><table>
                                        <tr class="" style="background-color: #F2F9FF;">
                                            <th class="" style="font-size: 12px;font-weight:400;width: 70px;padding: 4px 0px 4px 10px;">Action</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">House waybill No</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">Origin</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">Destination</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 200px;">Quantity</th>
                                            <th class="" style="font-size: 12px;font-weight:400;width: 407px;">Nature of Goods</th>
                                        </tr>
                                    </table></div>
                                </div>
                                <!-- <template v-if="consolidation && consolidation.length > 0">
                                    <RecycleScroller
                                        class="scroller"
                                        :items="consolidation"
                                        :item-size="50"
                                        key-field="id"
                                        v-slot="{ item }"
                                        style="max-height: 500px;"
                                    >
                                        <div class="d-flex border-bottom" style="background-color: #E6EBFF; height: 50px; align-items: center;">
                                            <div class="d-flex justify-content-center" style="width: 70px; background: #A4D3EE; height: 100%; align-items: center;">
                                                <div>
                                                    <b-icon icon="pencil" font-scale="1" style="cursor: pointer;" @click="editConsolidation(item.id)"></b-icon>
                                                    &nbsp;
                                                    <b-icon icon="trash" font-scale="1" style="cursor: pointer;" @click="deleteConsolidation(item.id)"></b-icon>
                                                </div>
                                            </div>
                                            <div class="pl-2" style="width: 200px;">
                                                {{ item.id }}
                                            </div>
                                            <div class="" style="width: 200px;">
                                                {{ item.master_origin }}
                                            </div>
                                            <div class="" style="width: 200px;">
                                                {{ item.master_destination }}
                                            </div>
                                            <div class="" style="width: 200px;">
                                                T/{{ item.pieces }}/K/{{  item.gross_weight }} 
                                            </div>
                                            <div class="" style="width: 407px;">
                                                {{ item.description }}
                                            </div>
                                        </div>
                                    </RecycleScroller>
                                </template> -->
                                <template v-if="consolidation && consolidation.length > 0">
                                    <div v-for="item in consolidation" :key="item.id" class="d-flex border-bottom" style="background-color: #E6EBFF; height: 50px; align-items: center;">
                                        <div class="d-flex justify-content-center" style="width: 70px; background: #A4D3EE; height: 100%; align-items: center; white-space: nowrap;">
                                            <div>
                                                <b-icon icon="pencil" font-scale="1" style="cursor: pointer;" @click="editConsolidation(item.id)"></b-icon>
                                                &nbsp;
                                                <b-icon icon="trash" font-scale="1" style="cursor: pointer;" @click="deleteConsolidation(item.id)"></b-icon>
                                            </div>
                                        </div>
                                        <div class="pl-2" style="width: 200px;">
                                            <router-link :to="`/edit-houseway-bill/${item.id}`">{{ item.id }}</router-link>
                                        </div>
                                        <div style="width: 200px;">
                                            {{ item.master_origin }}
                                        </div>
                                        <div style="width: 200px;">
                                            {{ item.master_destination }}
                                        </div>
                                        <div style="width: 200px;">
                                            T/{{ item.pieces }}/K/{{ item.gross_weight }}
                                        </div>
                                        <div style="width: 407px;">
                                            {{ item.description }}
                                        </div>
                                    </div>
                                </template>
                                <div v-else class="d-flex justify-content-center text-muted mt-2">
                                    <p>No house waybills found for this master AWB.</p>
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
                                <div class="d-flex justify-content-end flex-wrap submit-button mt-6" style="gap: 12px; align-items: center; padding-right: 16px;">
                                     <b-button class="show-btn" type="button" @click="generateAwbPDF">
                                         <b-icon icon="file-earmark-pdf" class="mr-2"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">Generate PDF</b>
                                     </b-button>
                                     <b-button class="show-btn" type="button" @click="manifest_send()" id="manifest-send-btn">
                                         <b-icon icon="cursor" class="mr-2"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">Send</b>
                                     </b-button>
                                 </div>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-else-if="searchPerformed && !hasSearchResults" class="d-flex flex-column align-items-start pt-2 pb-2">
                        <p class="text-danger mt-5">No house waybills found for this master AWB.</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>  
    </div>
</template>
<script>
import Datepicker from "vuejs-datepicker";
import DatePicker from "vue2-datepicker";
import SideBar from "@/view/layouts/public/SideBar.vue";
import DashboardHistoryModal from "@/view/components/DashboardHistoryModal.vue";
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
                pieces: '',
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
            isFetching: false,
            hasSearchResults: false,
            searchPerformed: false,
            data_items: [],
            oci_data:{}, ///get-oci-data
            oci_identifiers:{},
            tableData: [],
            existingData: {},
            isEdit: false,
            mode: '',
            options: [
                { text: "Me", value: "1" },
                { text: "Participant Group", value: "1" },
            ],
            logoSrc: "/media/assets/logos/logo-1.png",
        };
    },

    methods: {
        onSelect(value) {
            // Redirect to the selected page
            if (value) {
                window.location.href = value;  // This will navigate to the selected page
            }
        },
        generateAwbPDF() {
            const awb_code = this.form.awb_code;
            const awb_no = this.form.awb_no;
            const pdfUrl = `/download-consolidation-pdf/${String(awb_code)}/${String(awb_no)}`;
            window.open(pdfUrl, '_blank');
        },
        mouseover: function () {
            this.isOpen = true;
        },
        mouseleave: function () {
            this.isOpen = false;
        },
        manifest_send(){
            ApiService.get(`/user/manifest-send/${this.form.awb_code}${this.form.awb_no}`)
                .then(response => {});
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
            ApiService.get(`/user/get-location`).then(({ data }) => {
                this.location=data;
            });
        },
        getHousewayBills(status) {
            this.isFetching = true;
            this.data_items = [];
            ApiService.get(`/user/get-master-awbs-with-housewaybills`)
                .then(response => {
                    this.data_items = response.data;
                })
                .catch(error => {
                    console.error("Failed to fetch items:", error);
                })
                .finally(() => {
                    this.isFetching = false;
                });
        },
        allHousewayBill() {
            ApiService.get('/user/get-master-awbs-with-housewaybills')
                .then(response => {
                    this.data_items = response.data;
                })
                .catch(error => {
                    console.error("Failed to fetch master AWBs with house waybills:", error);
                    this.data_items = [];
                });
        },
        searchWayBills() {
            this.searchPerformed = true;
            this.form.post('/user/search-house-way-bills', {
                awb_no: this.form.awb_no,
                awb_code: this.form.awb_code
            })
            .then(response => {
                if (response.data && response.data.length) {
                    const id = `${String(this.form.awb_code)}${String(this.form.awb_no)}`;
                    this.getAirWayBill(id);
                    this.consolidation = response.data;
                    this.hasSearchResults = true; 
                } else {
                    this.consolidation = [];
                    this.hasSearchResults = false; 
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.consolidation = [];
                this.hasSearchResults = false; 
            });
        },
        getAirWayBill(id) { 
            ApiService.get(`/user/airway-bill/${id}`)
                .then(response => {
                    if (response.data && response.data.id == id) {
                        this.existingData = response.data;
                    }
                })
                .catch(error => {
                    this.existingData = null;
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        updateform(id){
            this.form.put(`/user/update-consolidation/${this.form.id}`)
            .then(response => {
                // Waybill updated successfully
            })
            .catch(error => {
                console.error("Error updating waybill:", error);
            });
        },
        updateHouseWayBill() {
            if (!this.form.id) {
                this.$bvToast.toast('Please select a house waybill to update', {
                    title: 'Warning',
                    variant: 'warning',
                    solid: true,
                    autoHideDelay: 3000
                });
                return;
            }
            
            // Prepare the data for update
            const updateData = {
                awb_code: this.form.awb_code,
                awb_no: this.form.awb_no,
                master_origin: this.form.master_origin,
                master_destination: this.form.master_destination,
                pieces: this.form.pieces,
                gross_weight: this.form.gross_weight,
                description: this.form.description,
                special_handling_info: JSON.stringify(this.form.tableCodes),
                other_service_information: this.form.other_service_information,
                oci_entries: this.form.oci_entries,
                status: 'draft'
            };
            
            this.form.put(`/user/update-consolidation/${this.form.id}`, updateData)
            .then(response => {
                this.$bvToast.toast('House waybill updated successfully', {
                    title: 'Success',
                    variant: 'success',
                    solid: true,
                    autoHideDelay: 3000
                });
                // Refresh the consolidation data
                this.searchWayBills();
                // Clear the form
                this.clearForm();
            })
            .catch(error => {
                console.error("Error updating house waybill:", error);
                this.$bvToast.toast('Error updating house waybill. Please try again.', {
                    title: 'Error',
                    variant: 'danger',
                    solid: true,
                    autoHideDelay: 5000
                });
            });
        },
        cancelUpdate() {
            this.clearForm();
        },
        addDetailsRow() {
            // This method can be used to add a new house waybill row
            // For now, it will clear the form to allow adding new data
            this.clearForm();
        },
        clearForm() {
            this.form.id = '';
            this.form.master_origin = '';
            this.form.master_destination = '';
            this.form.description = '';
            this.form.gross_weight = '';
            this.form.pieces = '';
            this.form.special_handling_info = '';
            this.form.other_service_information = '';
            this.form.tableCodes = [];
            this.form.oci_entries = [];
            this.editIndex = null;
        },
        editConsolidation(id) {
            const item = this.consolidation.find((waybill) => waybill.id === id);
            if (item) {
                this.form.id = String(item.id);
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
                // Scroll to the form section for better UX
                this.$nextTick(() => {
                    const formElement = document.querySelector('.custom-nav');
                    if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            } else {
                console.warn("Item not found for ID:", id);
                this.$bvToast.toast('House waybill not found', {
                    title: 'Error',
                    variant: 'danger',
                    solid: true,
                    autoHideDelay: 3000
                });
            }
        },
        deleteConsolidation(index) {
            this.form.tableCodes.splice(index, 1);
        },
        openForm(mode, id = null) {
            this.mode = mode;
            if (mode === 'update' && id && this.existingData) {
                this.form.id = String(this.existingData.id);
                this.form.master_origin = this.existingData.master_origin || '';
                this.form.master_destination = this.existingData.master_destination || '';
                this.form.other_service_information = this.existingData.other_service_information || '';
                this.form.oci_entries = this.existingData.other_custom_information || this.existingData.custom_info || [];
                
                if (this.existingData.special_handling_info && typeof this.existingData.special_handling_info === 'string') {
                    try {
                        this.form.tableCodes = JSON.parse(this.existingData.special_handling_info);
                    } catch (error) {
                        console.error("Error parsing special_handling_info:", error);
                        this.form.tableCodes = [];
                    }
                } else {
                    this.form.tableCodes = [];
                }

                if (this.existingData.consignment_data) {
                    this.form.description = this.existingData.consignment_data.description || '';
                    this.form.pieces = this.existingData.consignment_data.pieces || '';
                    this.form.gross_weight = this.existingData.consignment_data.gross_weight || '';
                }
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
        getAgent(){
            ApiService.get(`/user/agent-info/`)
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
        getHouseWayBill(id) { 
            ApiService.get(`/user/houseway-bill/${id}`)
                .then(response => {
                    this.existingData = response.data;
                    this.openForm('update', String(this.existingData.id));
                    if (this.existingData && this.existingData.consignment_data) {
                        this.isConsignmentAdded = true;
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch data for updating:", error);
                });
        },
        handleRadioChange() {
            const selectedCode = this.selectedCode;
            this.form.tableCodes = [];
            this.form.tableCodes.push(selectedCode);
        },
        addManualCode() {
            if (!Array.isArray(this.form.tableCodes)) {
                this.form.tableCodes = [];
            }
            const code = this.selectedCode || this.custom_special_handling_code.trim();
            if (code) {
                if (!this.form.tableCodes.includes(code)) {
                    this.form.tableCodes.push(code);
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
            if (this.form.oci_entries.length > index) {
                this.form.oci_entries.splice(index, 1);
            }
        },
        toggleDropdown_departure() {
            this.isDropdownOpen_departure = !this.isDropdownOpen_departure;
        },
       
        selectOption_departure(item) {
            let source_name = item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
            this.form.master_origin = final_set;
            this.isDropdownOpen_departure = false;
        },
        toggleDropdown_destination() {
            this.isDropdownOpen_destination = !this.isDropdownOpen_destination;
        },
        selectOption_destination(item) {
            let source_name = item.destination;
            let final_set = `${item.iata_code}, ${source_name}`;
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
        validateNumericInput(evt,field, maxLength) {
            evt = evt || window.event;
            const charCode = evt.which || evt.keyCode;
            if (charCode < 48 || charCode > 57) {
                evt.preventDefault();
            }

            if (this.form[field].length >= maxLength) {
                evt.preventDefault();
            }
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        getCurrentUser() {
            // You can get this from your auth store or API
            // For now, returning a placeholder
            return 'Current User';
        },
        selectAndSearchAwb(item) {
            // Fill the search fields with the selected AWB data
            this.form.awb_code = String(item.awb_code);
            this.form.awb_no = String(item.awb_no);
            
            // Close the modal
            this.$bvModal.hide('modal-s-consolidation');
            
            // Perform the search automatically
            this.searchWayBills();
            
            // Show a toast notification
            this.$bvToast.toast(`Searching for AWB ${item.awb_code}-${item.awb_no}`, {
                title: 'Search Initiated',
                variant: 'info',
                solid: true,
                autoHideDelay: 2000
            });
        },
    },
    mounted(){
        this.getLocation();
        this.getCountry();
        this.getOCIData();
        this.allHousewayBill();
        this.location = [];
        window.addEventListener('click', this.closeDropdown_destination);
        window.addEventListener('click', this.closeDropdown_departure);
    },
    watch: {
        '$route.params.id'(newId) {
            if (newId) {
                this.getAirWayBill(newId);
                this.getHouseWayBill(newId);
            }
        },
    },
    created() {
        const id = this.$route.params.id;
        if (id) {
            this.isEdit = true;
            this.getAirWayBill(id);
            this.getHouseWayBill(id);
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
        DashboardHistoryModal,
        Datepicker,
        DatePicker,
        SideBar,
    },
};
</script>

<style scoped>

.show-btn {
  background: white !important;
  color: #355594 !important;
  border: 1px solid #E6F0FF !important;
  border-radius: 50px !important;
  padding: 10px 22px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
}

.show-btn:hover {
  background: #355594 !important;
  color: white !important;
  border-color: #355594 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(53, 85, 148, 0.15) !important;
}

.form-row {
    flex-wrap: nowrap !important;
}
header {
    width: 100%;
    background-color: #2637a8;
}

.h-color {
    color: #355594;
    font-family: 'Inter', sans-serif;
    font-weight: 800 !important;
    font-size: 18px !important;
    letter-spacing: -0.2px;
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
    color: #4C4C4C;
    text-decoration: none;
}

.custom-link:hover {
    /* color: #2637a8; */
    text-decoration: underline #4C4C4C !important;
    text-decoration-color: #4C4C4C;
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
.awbcodetitle {
    color: #355594;
    transition: color 0.3s ease;
}

.awbcodetitle:hover {
    color: #2637a8;
    text-decoration: underline;
}

        /* Responsive overrides for smaller viewports */
        @media (max-width: 991px) {

            /* Ensure AWB input boxes keep their original widths on all viewports */
            .form-control.awb-code-input,
            .awb-code-input {
                width: 62px !important;
                max-width: 62px !important;
                flex: 0 0 62px !important;
            }
            .form-control.awb-no-short-input,
            .awb-no-short-input {
                width: 100px !important;
                max-width: 100px !important;
                flex: 0 0 100px !important;
            }
            .form-control.awb-no-input,
            .awb-no-input {
                width: 150px !important;
                max-width: 150px !important;
                flex: 0 0 150px !important;
            }
            .form-control.hawb-no-input,
            .hawb-no-input {
                width: 210px !important;
                max-width: 210px !important;
                flex: 0 0 210px !important;
            }


            /* Ensure AWB input boxes keep their original widths on all viewports */
            .form-control.awb-code-input,
            .awb-code-input {
                width: 62px !important;
                max-width: 62px !important;
                flex: 0 0 62px !important;
            }
            .form-control.awb-no-short-input,
            .awb-no-short-input {
                width: 100px !important;
                max-width: 100px !important;
                flex: 0 0 100px !important;
            }
            .form-control.awb-no-input,
            .awb-no-input {
                width: 150px !important;
                max-width: 150px !important;
                flex: 0 0 150px !important;
            }
            .form-control.hawb-no-input,
            .hawb-no-input {
                width: 210px !important;
                max-width: 210px !important;
                flex: 0 0 210px !important;
            }


            /* Ensure AWB input boxes keep their original widths on all viewports */
            .form-control.awb-code-input,
            .awb-code-input {
                width: 62px !important;
                max-width: 62px !important;
                flex: 0 0 62px !important;
            }
            .form-control.awb-no-short-input,
            .awb-no-short-input {
                width: 100px !important;
                max-width: 100px !important;
                flex: 0 0 100px !important;
            }
            .form-control.awb-no-input,
            .awb-no-input {
                width: 150px !important;
                max-width: 150px !important;
                flex: 0 0 150px !important;
            }
            .form-control.hawb-no-input,
            .hawb-no-input {
                width: 210px !important;
                max-width: 210px !important;
                flex: 0 0 210px !important;
            }

            .container, .container-fluid {
                padding-left: 10px !important;
                padding-right: 10px !important;
            }
            .py-8.px-10 {
                padding: 1.5rem 1rem !important;
            }
            
            /* Form fields custom responsiveness */
            .shipper-form-control, .consignee-form-control, .form-control {
                width: 100% !important;
                max-width: 100% !important;
            }
            .custom-dropdown, .custom-dropdown input {
                width: 100% !important;
            }
            
            /* Keep form groups and siblings aligned inline */
            .d-flex.align-items-center {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                align-items: center !important;
            }
            
            .d-flex.align-items-center > .form-group {
                flex: 1 1 auto !important;
                margin-bottom: 0 !important;
            }
            
            /* Stack labels vertically above their input columns inside form-groups */
            .form-group {
                width: 100% !important;
                margin-bottom: 0.5rem !important;
            }
            .form-row {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            .col-form-label {
                text-align: left !important;
                width: 100% !important;
                max-width: 100% !important;
                flex: 0 0 auto !important;
                padding-bottom: 4px !important;
            }
            .bv-no-focus-ring {
                width: 100% !important;
                max-width: 100% !important;
                flex: 0 0 auto !important;
            }
            
            /* Make form labels left-aligned and full width */
            .shipper-toggle-label, .routing-info-label {
                width: auto !important;
                max-width: 100% !important;
                text-align: left !important;
                display: block !important;
                margin-bottom: 2px !important;
            }
            
            /* Adjust alignment & margins for checkboxes */
            .b-form-checkbox {
                margin-left: 0 !important;
                padding-top: 4px !important;
            }
            
            /* Table responsiveness */
            .table-responsive-wrapper {
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                margin-bottom: 1rem;
            }
            .table-responsive-wrapper .table {
                min-width: 900px !important;
            }

            /* Consignment Modal Specific Responsiveness */
            #modal-consignment table {
                display: block !important;
                width: 100% !important;
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
                margin-bottom: 1.5rem !important;
            }
            #modal-consignment textarea, 
            #modal-consignment .b-form-textarea {
                width: 100% !important;
                max-width: 100% !important;
            }
        }
    
</style>
<style>
    .modal-content {
        border-radius: 20px !important;
        padding: 0rem 2rem 2rem !important;
    }
    .modal-header {
        padding: 1rem 0rem !important;
        border-bottom: 1px solid #CDCDCD !important;
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
        display: flex !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        gap: 4px;
        background: #F1F5F9;
        padding: 6px;
        border-radius: 14px;
        margin-bottom: 1.5rem;
        width: 100% !important;
    }
    .custom-nav .nav-tabs::-webkit-scrollbar {
        display: none !important;
    }
    .custom-nav .nav-item {
        flex: 0 0 auto !important;
    }
    .custom-nav .nav-link {
        color: #64748B !important;
        font-weight: 600 !important;
        font-size: 13px !important;
        border: none !important;
        padding: 8px 16px !important;
        margin: 0px !important;
        border-radius: 10px !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        white-space: nowrap !important;
    }
    .custom-nav .nav-link:hover {
        color: #355594 !important;
        background: rgba(53, 85, 148, 0.05) !important;
    }
    .custom-nav .nav-link.active {
        color: #355594 !important;
        background: #FFFFFF !important;
        box-shadow: 0 4px 12px rgba(53, 85, 148, 0.08) !important;
        border-bottom: none !important;
    }
    .premium-field-label {
        font-family: 'Inter', sans-serif !important;
        font-weight: 600 !important;
        font-size: 13px !important;
        color: #355594 !important;
        margin-bottom: 6px !important;
        display: block !important;
    }
</style>