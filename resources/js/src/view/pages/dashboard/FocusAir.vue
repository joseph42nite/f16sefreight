    <!-- <div class="">
        <div class="container-fluid"> -->
        <b-container fluid class="body-color">
            <!-- Include PageLoader -->
            <!-- <PageLoader></PageLoader> -->
            <!-- Include Header -->

            <div class="d-flex flex-column flex-lg-row">
                <SideBar></SideBar>
                <div style="background: #ffffff; border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1); z-index: 1; border-radius: 32px; flex: 1; min-width: 0;">
                    <div class="container py-8 px-6 px-sm-8 px-md-10">
                        <template>
                            <b-row class="align-items-center mb-8">
                                <b-col cols="12" md="6">
                                    <div class="d-flex flex-column">
                                        <span style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 700; color: #355594; opacity: 0.6; margin-bottom: 0.5rem; display: block;">Navigation</span>
                                        <h6 style="color:#355594;font-size:26px !important;line-height:34px !important;font-weight:800 !important;letter-spacing:-0.5px !important;margin-bottom:1rem;font-family:'Inter', sans-serif !important;">Documentation</h6>
                                        <b-form-group id="fieldset-horizontal" class="mb-0 nav-dropdown-group">
                                            <div class="d-flex align-items-center" style="background:#F0F7FF;border-radius:12px;padding:6px 16px;width:fit-content;border:1px solid #E6F0FF;">
                                                <b-icon icon="folder2-open" style="color:#355594;font-size:1.2rem;margin-right:12px;"></b-icon>
                                                <b-form-select style="width: 180px;border: 0px !important;color: #355594;font-weight: 600;background:transparent;cursor:pointer;outline:none;box-shadow:none;padding-left:0;" class="form-control-sm" v-model="selectedViewPageOption" @change="onSelect">
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
                                        <b-button @click="getAirwayBills('draft')" class="show-btn">
                                            <b-icon icon="file-earmark-text" class="mr-2"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">Drafts</b>
                                        </b-button>
                                        <b-button @click="getAirwayBills('send')" class="show-btn">
                                            <b-icon icon="clock-history" class="mr-2"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">10 Latest</b>
                                        </b-button>
                                        <OcrUploadModal category="focus_air" @extracted="processExtractedData" />
                                    </div>
                                </b-col>
                                <!-- History List Modals injected from reusable component -->
                                <DashboardHistoryModal 
                                    id="modal-draft-air" 
                                    title="My Drafts" 
                                    mode="draft" 
                                    docType="master"
                                    :items="data_items" 
                                    :isFetching="isFetching"
                                    @action="item => handleEditNavigation(item.id)"
                                />

                                <DashboardHistoryModal 
                                    id="modal-s-air" 
                                    title="Latest Messages" 
                                    mode="send" 
                                    docType="master"
                                    :items="data_items" 
                                    :isFetching="isFetching"
                                    @action="item => handleEditNavigation(item.id)"
                                />

                            </b-row>
                        </template>
                    </div>

                    <hr class="hr" />

                    <template> 
                        <b-form @submit.prevent="onSubmit">
                            <div class="container py-8 px-6 px-sm-8 px-md-10">
                                <!-- AWB NO & AWB CODE SECTION START -->
                                <div class="mx-2 mx-sm-8">
                                    <b-row class="mt-0 mb-4 mt-md-0 mb-md-10">
                                        <!-- First column of Three -->
                                        <b-col cols="12" md="6" lg="5">
                                            <div>
                                                <div class="d-flex flex-wrap align-items-center">
                                                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto"
                                                    label-for="input-horizontal"
                                                    class="align-items-center mb-0">
                                                    <template #label>
                                                        <span>AWB No:</span>
                                                        <span style="color: red;">*</span>
                                                    </template>
                                                        <div class="awb-flex-row">
                                                            <b-form-input id="input-horizontal" class="awb-code-input" style="width: 62px"
                                                                v-model="form.first_box.awb_code"
                                                                :class="{ 'is-invalid': form.errors.has('awb_code') }" @input="onAWBInput" v-on:keypress="validateNumericInput($event, 'awb_code', 3)" required></b-form-input>
                                                            <span style="color: #355594; font-weight: bold;">-</span>
                                                            <b-form-input id="input-horizontal" class="awb-no-input" style="width: 100px"
                                                                v-model="form.first_box.awb_no"
                                                                :class="{ 'is-invalid': form.errors.has('awb_no') }" @input="onAWBInput" v-on:keypress="validateNumericInput($event, 'awb_no', 8)" required></b-form-input>
                                                            <b-form-checkbox size="sm" v-model="form.first_box.consolidated_mawb" class="ml-3 mb-0">Consolidate MAWB</b-form-checkbox>
                                                        </div>
                                                    </b-form-group>
                                                </div>
                                                <div>
                                                    <has-error :form="form" field="awb_code" :class="{ 'd-block': form.errors.has('awb_code') }"></has-error>
                                                    <has-error :form="form" field="awb_no" :class="{ 'd-block': form.errors.has('awb_no') }"></has-error>
                                                    <p style="font-weight:400;font-size:12px;line-height:18px;" v-if="awb_prefix_message" class="mt-2">{{ awb_prefix_message }}</p>
                                                    <div v-if="awbId && showAWBSection">
                                                        <p>The Air Waybill number has been used (printed at:)</p>
                                                        <p>
                                                            Load content:
                                                            <span style="cursor: pointer; color: blue;">
                                                                <router-link v-slot="{ navigate, href }" :to="'/edit-airway-bill/' + awbId" custom>
                                                                    <!-- <p @click="confirmReload">{{ awbId }}</p> -->
                                                                    <p @click="confirmReload">{{ formattedAWBId }}</p>
                                                                </router-link>
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </b-col>
                                        <!-- Second column of Three -->
                                        <b-col cols="12" md="4" lg="5" class="mt-6 mt-md-0 mt-lg-0">
                                            <b-form-group
                                            label-for="name-input">
                                                <b-form-radio name="radio-size" size="sm" v-model="form.first_box.awb"
                                                :value="true" @change="handleRadioChange(true)">AWB</b-form-radio>
                                            </b-form-group>
                                            <b-form-group label-for="">
                                                <b-form-radio name="radio-size" size="sm" value="EAW" v-model="selectedCode"
                                                    @change="handleRadioChange('EAW')">e-AWB With No Accompanying Paper
                                                    Documents</b-form-radio>
                                            </b-form-group>

                                            <b-form-group label-for="name-input">
                                                <b-form-radio name="radio-size" size="sm" @change="handleRadioChange('EAP')"
                                                    v-model="selectedCode" value="EAP">e-AWB With Accompanying Paper
                                                    Documents</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                        <!-- Third column of Three -->
                                        <b-col cols="12" md="2" lg="2" class="mt-6 mt-md-0 mt-lg-0">
                                            <b-form-group label-for="name-input">
                                                <b-form-radio name="radio-size" size="sm">e-CSD AWB</b-form-radio>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </div>
                                <!-- AWB NO & AWB CODE SECTION END -->
                                <hr class="hr" />
                                <!-- SHIPPER AND CONSIGNEE ADDRESS SECTION START -->
                                <b-row class="my-4 my-md-10">
                                    <b-col cols="12" md="6">
                                        <address-block
                                            title="Shipper"
                                            dropdown-name="shipper"
                                            prefix="ship"
                                            address-key="shipper_address"
                                            control-class="shipper-form-control"
                                            search-id="shipper"
                                            search-placeholder="Search shipper"
                                            name2-id="shipper-name-2-input"
                                            name2-extra-class="ship_name_2"
                                            country-placeholder=" Please select one"
                                            :form="form"
                                            :address="form.shipper_address"
                                            :countries="countries"
                                            :active-dropdown="activeDropdown"
                                            :filtered="filteredShippers"
                                            :show="showShipper"
                                            :save-checked="form.is_shipper_address_save"
                                            @update:show="showShipper = $event"
                                            @update:saveChecked="form.is_shipper_address_save = $event"
                                            @toggle="toggleDropdown"
                                            @filter="filterShippers"
                                            @select="selectShipper"
                                            @limit="inputLimit"
                                            @register-ref="registerDropdownRef"
                                        ></address-block>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label="" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mt-2 d-none d-md-block">
                                            <b-form-checkbox size="sm" class="mt-2 text-bold">Set as default e-AWB shipper for
                                                later logins</b-form-checkbox>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="12" md="6" class="mt-6 mt-md-0 mt-lg-0">
                                        <address-block
                                            title="Consignee"
                                            dropdown-name="consignee"
                                            prefix="cons"
                                            address-key="consignee_address"
                                            control-class="consignee-form-control"
                                            city-control-class="consignee-form-control"
                                            search-id="consignee"
                                            search-placeholder="Search consignee"
                                            name2-id="consignee-name-2-input"
                                            :form="form"
                                            :address="form.consignee_address"
                                            :countries="countries"
                                            :active-dropdown="activeDropdown"
                                            :filtered="filteredConsignees"
                                            :show="showConsignee"
                                            :save-checked="form.is_consignee_address_save"
                                            @update:show="showConsignee = $event"
                                            @update:saveChecked="form.is_consignee_address_save = $event"
                                            @toggle="toggleDropdown"
                                            @filter="filterConsignee"
                                            @select="selectConsignee"
                                            @limit="inputLimit"
                                            @register-ref="registerDropdownRef"
                                        ></address-block>
                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                            content-cols-lg="auto" label="" label-for="input-horizontal"
                                            class="form-control-sm col-form-label mt-2 d-md-none">
                                            <b-form-checkbox size="sm" class="mt-2 text-bold">Set as default e-AWB shipper for
                                                later logins</b-form-checkbox>
                                            </b-form-group>
                                    </b-col>
                                </b-row>
                                <!-- SHIPPER AND CONSIGNEE ADDRESS SECTION END -->
                                <hr class="hr" />
                                <!-- ROUTING INFORMATION TAB SECTION START -->
                                <b-tabs content-class="mt-7" class="custom-nav-title mt-6">
                                    <b-tab title="Routing Information" style="border-bottom:0px !important;">
                                        <b-row class="mt-8 mb-6">
                                            <b-col cols="12" lg="4">
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                    label-for="input-departure-airport"
                                                    style="width:100%;"
                                                    class="align-items-center my-4">
                                                    <template #label>
                                                        <div class="routing-info-label">
                                                            <span>Departure Airport:</span>
                                                            <span style="color: red;">*</span>
                                                        </div>
                                                    </template>
                                                    <div style="width: 220px !important;" class="custom-dropdown  align-items-center" ref="dropdownContainer_departure" @click="toggleDropdown('departure')">
                                                        <input style="width:100%" type="text" v-model="form.routing_information.departure_airport" placeholder="Search departure" id="departure" class="form-control" 
                                                            autocomplete="off" :class="{ 'is-invalid': form.errors.has('departure_airport') }">
                                                        <div v-if="activeDropdown === 'departure' && getFilteredLocations(form.routing_information.departure_airport).length" class="dropdown-options">
                                                            <div v-for="(item, index) in getFilteredLocations(form.routing_information.departure_airport)" :key="index" @click.stop="selectLocation('departure_airport', item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
                                                        </div>
                                                    </div>
                                                    <has-error :form="form" field="departure_airport" :class="{ 'd-block': form.errors.has('departure_airport') }"></has-error>
                                                </b-form-group>
                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                     label-for="input-destination-airport"
                                                     style="width: 100%;"
                                                     class="align-items-center my-4">
                                                     <template #label>
                                                         <div class="routing-info-label">
                                                             <span>Destination Airport:</span>
                                                             <span style="color: red;">*</span>
                                                         </div>
                                                     </template>
                                                         <div style="width: 220px !important;" class="custom-dropdown align-items-center" ref="dropdownContainer_destination" @click="toggleDropdown('destination')">
                                                             <input style="width:100%" type="text" v-model="form.routing_information.destination_airport" placeholder="Search destination" id="destination" class="form-control" 
                                                                 autocomplete="off" :class="{ 'is-invalid': form.errors.has('destination_airport') }">
                                                            <div v-if="activeDropdown === 'destination' && getFilteredLocations(form.routing_information.destination_airport).length" class="dropdown-options">
                                                                <div v-for="(item, index) in getFilteredLocations(form.routing_information.destination_airport)" 
                                                                    :key="index" 
                                                                    @click.stop="selectLocation('destination_airport', item)" 
                                                                    class="option">
                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                </div>
                                                            </div>
                                                        </div>
                                                    <has-error :form="form" field="destination_airport" :class="{ 'd-block': form.errors.has('destination_airport') }"></has-error>
                                                </b-form-group>
                                            </b-col>
                                            <b-col cols="12" lg="8" class="mt-6 mt-lg-0">
                                                <!-- <div class="d-flex flex-column align-items-center"> -->
                                                    <!-- <div class="container"> -->
                                                        <div class="table-responsive">
                                                        <table class="table" style="max-width:100%;width:100%;min-width:650px !important;">
                                                            <thead>
                                                                <tr class="">
                                                                    <th class="" style="color:#355594; width: 8%; padding: 12px 6px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;">&nbsp;</th>
                                                                    <th class="" style="color:#355594; width: 21%; padding: 12px 6px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;">From</th>
                                                                    <th class="" style="color:#355594; width: 21%; padding: 12px 6px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;">To</th>
                                                                    <th class="" style="color:#355594; width: 11%; padding: 12px 6px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;">By</th>
                                                                    <th class="" style="color:#355594; width: 14%; padding: 12px 6px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;">Flight</th>
                                                                    <th class="" style="color:#355594; width: 20%; padding: 12px 6px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;">Date</th>
                                                                    <th class="" style="color:#355594; width: 5%; padding: 12px 6px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td class="editable-cell" style="width: 8%; padding: 8px 6px !important; font-weight: 500; color: #475569;">Routing:<span style="color: red;">*</span></td>
                                                                    <td class="editable-cell" style="width: 21%; padding: 8px 6px !important;">
                                                                        <div style="width: 100%;" class="custom-dropdown align-items-center" ref="dropdownContainer_from" @click="toggleDropdown('from')">
                                                                            <input type="text" v-model="form.routing_information.from" placeholder="Search destination" id="from_id" style="" class="form-control" 
                                                                                autocomplete="off" :class="{ 'is-invalid': form.errors.has('from') }">
                                                                            <div v-if="activeDropdown === 'from' && getFilteredLocations(form.routing_information.from).length" class="dropdown-options">
                                                                                <div v-for="(item, index) in getFilteredLocations(form.routing_information.from)" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectLocation('from', item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 21%; padding: 8px 6px !important;">
                                                                        <div style="width: 100%;" class="custom-dropdown align-items-center" ref="dropdownContainer_to" @click="toggleDropdown('to')">
                                                                            <input type="text" v-model="form.routing_information.to" placeholder="Search destination" id="to_id" style="" class="form-control" 
                                                                                autocomplete="off" :class="{ 'is-invalid': form.errors.has('to') }">
                                                                            <div v-if="activeDropdown === 'to' && getFilteredLocations(form.routing_information.to).length" class="dropdown-options">
                                                                                <div v-for="(item, index) in getFilteredLocations(form.routing_information.to)" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectLocation('to', item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 11%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control"
                                                                            style="padding: 0.375rem 0.25rem; text-align: center;" v-model="form.routing_information.by"
                                                                            :class="{ 'is-invalid': form.errors.has('by') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 14%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control"
                                                                            style="padding: 0.375rem 0.5rem; text-align: center;" v-model="form.routing_information.flight"
                                                                            :class="{ 'is-invalid': form.errors.has('flight') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 20%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control"
                                                                            style="text-align: center;" v-model="form.routing_information.date"
                                                                            :class="{ 'is-invalid': form.errors.has('date') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 5%; padding: 8px 6px !important; padding-left: 10px !important;">
                                                                        <date-picker valueType="format"
                                                                            style="width: 100%; max-width: 30px;"
                                                                            @change="handleDateChange($event, 'form.routing_information.date')"></date-picker>
                                                                    </td>
                                                                 </tr>
                                                                 <tr v-if="form.errors.has('from') || form.errors.has('to') || form.errors.has('by') || form.errors.has('flight') || form.errors.has('date')">
                                                                    <td class="editable-cell" style="width: 8%; padding: 8px 6px !important;">&nbsp;</td>
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
                                                                    <td class="editable-cell" style="width: 5%; padding: 8px 6px !important;">&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="width: 8%; padding: 8px 6px !important;" class="editable-cell">&nbsp;</td>
                                                                    <td style="width: 21%; padding: 8px 6px !important;" class="editable-cell">&nbsp;</td>
                                                                    <td class="editable-cell" style="width: 21%; padding: 8px 6px !important;">
                                                                        <!-- <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-to2" class="form-control-sm col-form-label"> -->
                                                                        <div style="width: 100%;" class="custom-dropdown" ref="dropdownContainer_to2" @click="toggleDropdown('to2')">
                                                                            <input type="text" v-model="form.routing_information.to_2" placeholder="Search destination" id="to2_id" style=""
                                                                            class="form-control" autocomplete="off" :class="{ 'is-invalid': form.errors.has('to_2') }">
                                                                            <div v-if="activeDropdown === 'to2' && getFilteredLocations(form.routing_information.to_2).length" class="dropdown-options">
                                                                                <div v-for="(item, index) in getFilteredLocations(form.routing_information.to_2)" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectLocation('to_2', item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <has-error :form="form" field="to_2"></has-error>
                                                                        <!-- </b-form-group> -->
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 11%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control" style="padding: 0.375rem 0.25rem; text-align: center;"
                                                                            v-model="form.routing_information.by_2"
                                                                            :class="{ 'is-invalid': form.errors.has('by_2') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 14%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control" style="padding: 0.375rem 0.5rem; text-align: center;"
                                                                            v-model="form.routing_information.flight_2"
                                                                            :class="{ 'is-invalid': form.errors.has('flight_2') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 20%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control" style="text-align: center;"
                                                                            v-model="form.routing_information.date_2"
                                                                            :class="{ 'is-invalid': form.errors.has('date_2') }" />
                                                                    </td>
                                                                    <td class="editable-cell w-10" style="width: 5%; padding: 8px 6px !important; padding-left: 10px !important;">
                                                                        <date-picker valueType="format"
                                                                            style="width: 100%; max-width: 30px;"
                                                                            @change="handleDateChange($event, 'form.routing_information.date_2')"></date-picker>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="width: 8%; padding: 8px 6px !important;" class="editable-cell" >&nbsp;</td>
                                                                    <td style="width: 21%; padding: 8px 6px !important;" class="editable-cell">&nbsp;</td>
                                                                    <td class="editable-cell" style="width: 21%; padding: 8px 6px !important;">
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
                                                                        <!-- <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-to3" class="form-control-sm col-form-label"> -->
                                                                        <div style="width: 100%;" class="custom-dropdown" ref="dropdownContainer_to3" @click="toggleDropdown('to3')">
                                                                            <input type="text" v-model="form.routing_information.to_3" placeholder="Search destination" id="to3_id" style="" class="form-control" 
                                                                                autocomplete="off" :class="{ 'is-invalid': form.errors.has('to_3') }">
                                                                            <div v-if="activeDropdown === 'to3' && getFilteredLocations(form.routing_information.to_3).length" class="dropdown-options">
                                                                                <div v-for="(item, index) in getFilteredLocations(form.routing_information.to_3)" 
                                                                                    :key="index" 
                                                                                    @click.stop="selectLocation('to_3', item)" 
                                                                                    class="option">
                                                                                    {{ item.iata_code }} ({{ item.destination }})
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <has-error :form="form" field="to_3"></has-error>
                                                                        <!-- </b-form-group> -->
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 11%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control" style="padding: 0.375rem 0.25rem; text-align: center;"
                                                                            v-model="form.routing_information.by_3"
                                                                            :class="{ 'is-invalid': form.errors.has('by_3') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 14%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control" style="padding: 0.375rem 0.5rem; text-align: center;"
                                                                            v-model="form.routing_information.flight_3"
                                                                            :class="{ 'is-invalid': form.errors.has('flight_3') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 20%; padding: 8px 6px !important;">
                                                                        <input type="text" class="form-control" style="text-align: center;"
                                                                            v-model="form.routing_information.date_3"
                                                                            :class="{ 'is-invalid': form.errors.has('date_3') }" />
                                                                    </td>
                                                                    <td class="editable-cell" style="width: 5%; padding: 8px 6px !important; padding-left: 10px !important;">
                                                                        <date-picker valueType="format"
                                                                            style="width: 100%; max-width: 30px;"
                                                                            @change="handleDateChange($event, 'form.routing_information.date_3')"></date-picker>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        </div>
                                                    <!-- </div> -->
                                                <!-- </div> -->
                                            </b-col>
                                        </b-row>
                                    </b-tab>
                                    <!-- <b-tab title="Search Flights">
                                        <b-row>
                                            <b-col cols="12">
                                                <div class="container d-flex align-items-center" style="background-color:#F2F9FF;color:#355594 !important;">
                                                    <div style="width:160px !important;padding:5px">
                                                        Carrier <span style="color:red;">*</span>
                                                    </div>
                                                    <div style="width:240px !important;padding:5px">
                                                        Origin <span style="color:red;">*</span>
                                                    </div>
                                                    <div style="width:150px !important;padding:5px">
                                                        Destination <span style="color:red;">*</span>
                                                    </div>
                                                    <div style="width:100px !important;padding:5px">
                                                        Flight Date <span style="color:red;">*</span>
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
                                <!-- ROUTING INFORMATION TAB SECTION END -->
                                <hr class="hr" />
                                <!-- CONSIGNMENT RATE DESCRIPTION SECTION START HERE -->
                                <div class="py-5">
                                    <b-row>
                                        <b-col cols="12" sm="6">
                                            <div class="align-items-center">
                                                <h6 class="h-color mb-0">Consignment Rate Description</h6>
                                            </div>
                                        </b-col>
                                        <b-col cols="12" sm="6" class="mt-2 mt-sm-0 text-left text-sm-right">
                                            <div class="d-flex justify-content-start justify-content-sm-end align-items-center mr-0 mr-sm-16">
                                                <p class="mb-0 ml-0 ml-sm-4 mr-4" style="border-bottom: 1px solid #355594; color: #355594; font-size: 13px; font-weight: 600; cursor: pointer;">Collect house waybill sum's</p>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <!-- CONSIGNMENT MODEL CODE START HERE -->
                                    <b-button class="mt-5 mb-5 show-btn" v-b-modal.modal-consignment @click="handleAddConsignment" :disabled="isConsignmentAdded">Add Consignment Information</b-button>
                                    <b-modal id="modal-consignment" ref="modalConsignment" title="Consignment Information"
                                        size="xl" ok-only hide-footer @hide="handleModalClose"
                                        centered modal-class="premium-modal" title-class="font-weight-bolder text-dark" header-class="border-bottom-0 pb-0 px-5 pt-5">
                                        <b-row>
                                            <!-- First Column -->
                                            <b-col cols="12" md="6">
                                                <h6 style="color: #0f2247; font-weight: 700; margin-bottom: 15px; background: #e1e8f5; padding: 10px 14px; border-left: 4px solid #2c4d8c; border-radius: 4px; font-size: 14px; letter-spacing: 0.3px;">Pieces and Nature and Quantity of Goods</h6>
                                                <div class="">
                                                    <label for="Pieces" style="margin-bottom:0px;">Pieces</label>
                                                    <b-form-input id="input-departure-airport" class="form-control" style="width:100% !important;margin-bottom:10px;"
                                                        v-model="consignment_list.pieces" :class="{ 'is-invalid': consignment_list.errors.has('pieces') }"></b-form-input>
                                                        <has-error :form="consignment_list" field="pieces"></has-error>
                                                    <label for="Description7"  style="margin-bottom:0px;">Description</label>
                                                    <b-form-textarea style="height: 70px;width: 100%;margin-bottom:10px;" id="textarea"
                                                        v-model="consignment_list.description" :class="{ 'is-invalid': consignment_list.errors.has('description') }"></b-form-textarea>
                                                        <has-error :form="consignment_list" field="description"></has-error>
                                                    <div class="table-responsive">
                                                    <table class="table table-sm">
                                                        <tbody>
                                                            <tr>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Rate Class:</th>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">ULD Rate class:</th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control w-100" style="margin-bottom:10px;" v-model="consignment_list.rate_class" @change="calculateTotalAmount" :class="{ 'is-invalid': consignment_list.errors.has('rate_class') }">
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
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.uld_rate_class" :class="{ 'is-invalid': consignment_list.errors.has('uld_rate_class') }"/>
                                                                        <has-error :form="consignment_list" field="uld_rate_class"></has-error>
                                                                </td>
                                                            </tr>
                                                            <tr v-if="consignment_list.rate_class">
                                                                <td colspan="4" class="editable-cell" style="margin-bottom:10px;">
                                                                    <div
                                                                        class="d-flex justify-content-end align-items-center">
                                                                        <span class="mr-2">Charge:</span>
                                                                        <input type="text" class="form-control w-100" :value="calculatedCharge" />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Service code</th>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Commodity Item</th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control w-100" style="margin-bottom:10px;" v-model="consignment_list.service_code" :class="{ 'is-invalid': consignment_list.errors.has('service_code') }">
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
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.commodity_item" :class="{ 'is-invalid': consignment_list.errors.has('commodity_item') }"/>
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
                                                                    <b-form-select class="form-control w-100" style="margin-bottom:10px;" v-model="consignment_list.country_origin_goods" :class="{ 'is-invalid': consignment_list.errors.has('country_origin_goods') }">
                                                                        <option value=""> Select a Country</option>
                                                                        <option v-for="country in countries" :key="country.value" :value="country.value">
                                                                            {{ country.text }}
                                                                        </option>
                                                                    </b-form-select>
                                                                    <has-error :form="consignment_list" field="country_origin_goods"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.slac" :class="{ 'is-invalid': consignment_list.errors.has('slac') }"/>
                                                                    <has-error :form="consignment_list" field="commodity_item"></has-error>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th style="font-family:13px;font-weight: 500;padding-bottom:0px;">Hs Codes:</th>
                                                            </tr>
                                                            <tr>
                                                                <td class="editable-cell" style="display: flex;align-items: center;">
                                                                    <b-form-input type="text" class="form-control" style="width: 100%;margin-right: 10px;margin-bottom:10px;" v-model="consignment_list.hs_code" :class="{ 'is-invalid': hs_code_error.length > 0 }"></b-form-input>
                                                                    <button @click="addHsCode" class="show-btn" style="margin-bottom:10px;">Add</button>
                                                                </td>
                                                                <div v-if="hs_code_error.length" class="text-danger">
                                                                    <ul  style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                        <li>Warning:</li>
                                                                        <li v-for="(error, index) in hs_code_error" :key="index">{{ error }}</li>
                                                                    </ul>
                                                                </div>
                                                            </tr>
                                                            <tr style="background-color:#F8FAFC;">
                                                                <th style="color:#8A99AD !important; font-weight:500 !important; font-size:11px !important; text-transform:uppercase !important; letter-spacing:0.5px !important; padding: 6px 2px !important; border-bottom: 1px solid rgba(53, 85, 148, 0.05) !important;">HS Codes</th>
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
                                                </div>
                                            </b-col>
                                            <!-- Second Column -->
                                            <b-col cols="12" md="6" class="mt-6 mt-md-0 mt-lg-0">
                                                <h6 style="color: #0f2247; font-weight: 700; margin-bottom: 25px; background: #e1e8f5; padding: 10px 14px; border-left: 4px solid #2c4d8c; border-radius: 4px; font-size: 14px; letter-spacing: 0.3px;">Weight and Dimensions</h6>
                                                <div class="table-responsive">
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
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.gross_weight" :class="{ 'is-invalid': consignment_list.errors.has('gross_weight') }" />
                                                                    <has-error :form="consignment_list" field="gross_weight"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <b-form-select class="form-control w-100" v-model="consignment_list.weight_code" :class="{ 'is-invalid': consignment_list.errors.has('weight_code') }">
                                                                        <option value="KGM">Kgs</option>
                                                                        <option value="LBR">Lbs</option>
                                                                    </b-form-select>
                                                                    <has-error :form="consignment_list" field="weight_code"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.chargable_weight" @input="calculateTotalAmount" :class="{ 'is-invalid': consignment_list.errors.has('chargable_weight') }" />
                                                                    <has-error :form="consignment_list" field="chargable_weight"></has-error>
                                                                </td>
                                                                <td class="editable-cell" style="margin-bottom:10px;">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.rate" @input="calculateTotalAmount" :class="{ 'is-invalid': consignment_list.errors.has('rate') }" />
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
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.pcs" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.wgt" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.length" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.width" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <input class="form-control w-100" v-model="consignment_list.height" type="text" />
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control w-100" v-model="consignment_list.unit">
                                                                        <option value="CMT">CMT</option>
                                                                        <option value="INH">INH</option>
                                                                        <option value="FOT">FOT</option>
                                                                    </b-form-select>
                                                                </td>
                                                                <td class="editable-cell"><button @click="addPcsInfo" class="show-btn">Add</button></td>
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
                                                    <table class="table-lightweight">
                                                        <thead>
                                                            <tr>
                                                                <th>Pcs</th>
                                                                <th>Wgt</th>
                                                                <th>Length</th>
                                                                <th>Width</th>
                                                                <th>Height</th>
                                                                <th>Unit</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(row, index) in consignment_list.itemss"
                                                                :key="index">
                                                                <td>{{ row.pcs }}</td>
                                                                <td>{{ row.wgt }} {{ consignment_list.weight_code }}</td>
                                                                <td>{{ row.length }}</td>
                                                                <td>{{ row.width }}</td>
                                                                <td>{{ row.height }}</td>
                                                                <td style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                    <span class="mr-3">{{ row.unit }}</span>
                                                                    <b-icon icon="trash" font-scale="1"
                                                                        @click="deletePcs(index)"
                                                                        style="cursor: pointer;"></b-icon>
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
                                                                    <b-form-input id="input-horizontal" class="form-control w-100" v-model="consignment_list.volume"></b-form-input>
                                                                </td>
                                                                <td class="editable-cell">
                                                                    <b-form-select class="form-control w-100" v-model="this.form.entries.dimention_unit">
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
                                                <div class="table-responsive">
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
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.uld_type" />
                                                                </td>
                                                                <td class="editable-cell pr-15">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.uld_serial" />
                                                                    <!-- <has-error :form="form" field="uld_serial"></has-error> -->
                                                                </td>
                                                                <td class="editable-cell pr-2">
                                                                    <input type="text" class="form-control w-100" v-model="consignment_list.owner" />
                                                                </td>
                                                                <td class="editable-cell"><button @click="addUldInfo" class="show-btn">Add</button></td>
                                                            </tr>
                                                            <tr v-if="uld_error.length" style="color: red;">
                                                                <td colspan="4" style="border:0px;">
                                                                    <ul style="list-style-type: none; padding-left: 0;font-size: 10px;">
                                                                        <li>Warning:</li>
                                                                        <li v-for="(error, index) in uld_error" :key="index">{{ error }}</li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table class="table-lightweight">
                                                        <thead>
                                                            <tr>
                                                                <th>ULD Type:</th>
                                                                <th>ULD Serial:</th>
                                                                <th>Owner:</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(row, index) in consignment_list.uld_infos" :key="index">
                                                                <td>{{ row.uld_type }}</td>
                                                                <td>{{ row.uld_serial }}</td>
                                                                <td>{{ row.owner }}</td>
                                                                <td style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                                    <span></span>
                                                                    <b-icon icon="trash" font-scale="1"
                                                                        @click="deleteUldInfo(index)"
                                                                        style="cursor: pointer;"></b-icon>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </b-col>
                                        </b-row>
                                        <div class="d-flex justify-content-end">
                                            <button @click="addOrUpdateEntry" class="show-btn">
                                                {{ edit_entry_index !== null ? 'Update' : 'Add' }}
                                            </button>
                                        </div>
                                    </b-modal>
                                    <!-- CONSIGNMENT MODEL CODE END HERE -->
                                    <b-row>
                                        <b-col cols="12">
                                            <div class="table-responsive">
                                                <table class="table table-hover table-sm align-middle" style="max-width:100%">
                                                <thead>
                                                    <tr class="text-nowrap" style="background-color: #F2F9FF;">
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 60px; padding: 10px 8px;" class="">Pcs.</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 250px; padding: 10px 8px;" class="">Description</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 90px; padding: 10px 8px;">Srv. Code</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 95px; padding: 10px 8px;" class="">Com. Itm.</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 110px; padding: 10px 8px;" class="">Gross Wgt.</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 110px; padding: 10px 8px;" class="">Chrg. Wgt.</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 80px; padding: 10px 8px;" class="">Rate</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 260px; padding: 10px 8px;" class="">Detailed Pcs. Info</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 80px; padding: 10px 8px;" class="">Vol.</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 100px; padding: 10px 8px;" class="">Rate Class</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 120px; padding: 10px 8px;" class="">UID Rate Class</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 90px; padding: 10px 8px;" class="">Charge</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 115px; padding: 10px 8px;" class="">HS Code</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 120px; padding: 10px 8px;" class="">Origin Country</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 160px; padding: 10px 8px;" class="">UID information</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 80px; padding: 10px 8px;" class="">Slac</th>
                                                        <th style="font-size: 12px; font-weight: 600 !important; min-width: 80px; padding: 10px 8px;" class=""></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(entry, index) in form.entries" :key="index">
                                                        <td class="align-middle"><strong>{{ entry.pieces }}</strong></td>
                                                        <td class="align-middle text-wrap" style="max-width: 300px; line-height: 1.4;">
                                                            <div v-if="entry.description">
                                                                <div v-for="(line, lineIdx) in entry.description.split('\n')" :key="lineIdx"
                                                                    :class="lineIdx === 0 ? 'font-weight-bold text-dark' : 'text-muted small mt-1'">
                                                                    {{ line }}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="align-middle">{{ entry.service_code }}</td>
                                                        <td class="align-middle">{{ entry.commodity_item }}</td>
                                                        <td class="align-middle">
                                                            <div class="text-nowrap">
                                                                <strong>{{ entry.gross_weight }}</strong> <span class="text-muted small">{{ entry.weight_code }}</span>
                                                            </div>
                                                        </td>
                                                        <td class="align-middle">
                                                            <div class="text-nowrap">
                                                                <strong>{{ entry.chargable_weight }}</strong> <span class="text-muted small">{{ entry.weight_code || 'KGM' }}</span>
                                                            </div>
                                                        </td>
                                                        <td class="align-middle"><strong>{{ entry.rate }}</strong></td>
                                                        <td class="align-middle">
                                                            <div v-for="(pcs, pcsIndex) in entry.itemss" :key="pcsIndex" class="mb-1">
                                                                <span class="badge badge-light border text-dark px-2 py-1 d-inline-block" style="font-size: 11px; white-space: nowrap;">
                                                                    <strong>{{ pcs.pcs }}</strong> pcs
                                                                    <span v-if="pcs.wgt" class="text-muted"> ({{ pcs.wgt }} {{ pcs.weight_code }})</span>
                                                                    <span v-if="pcs.length || pcs.width || pcs.height" class="text-muted font-weight-normal ml-1">
                                                                        • {{ pcs.length }}×{{ pcs.width }}×{{ pcs.height }} {{ pcs.unit }}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td class="align-middle">{{ entry.volume }}</td>
                                                        <td class="align-middle"><span class="badge badge-secondary" v-if="entry.rate_class">{{ entry.rate_class }}</span></td>
                                                        <td class="align-middle">{{ entry.uld_rate_class }}</td>
                                                        <td class="align-middle"><strong>{{ form.totals.total_amount }}</strong></td>
                                                        <td class="align-middle">
                                                            <div class="d-flex flex-wrap">
                                                                <span v-for="(hs, hsIndex) in entry.hsCodes" :key="hsIndex"
                                                                    class="badge mr-1 mb-1 px-2 py-1" style="font-size: 11px; background-color: #e1e8f5; color: #2c4d8c; border: 1px solid #c9d6ec; font-weight: 600;">
                                                                    {{ hs }}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td class="align-middle">{{ entry.country_origin_goods }}</td>
                                                        <td class="align-middle">
                                                            <div v-for="(uld, uldIndex) in entry.uld_infos" :key="uldIndex" class="mb-1">
                                                                <span class="badge badge-light border text-dark px-2 py-1 d-inline-block" style="font-size: 11px; white-space: nowrap;">
                                                                    <strong>{{ uld.uld_type }}</strong>
                                                                    <span class="text-muted">#{{ uld.uld_serial }} ({{ uld.owner }})</span>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td class="align-middle">{{ entry.slac }}</td>
                                                        <td class="align-middle text-nowrap">
                                                            <b-icon icon="pencil" font-scale="1" style="cursor: pointer;"
                                                                @click="editEntry(index)" class="mr-2 text-primary"></b-icon>
                                                            <b-icon icon="trash" font-scale="1" style="cursor: pointer;"
                                                                @click="deleteEntry(index)" class="text-danger"></b-icon>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col cols="12" style="justify-items: flex-end;">
                                            <div class="d-flex align-items-center mr-32 mt-4">
                                                <b-form-group id="fieldset-horizontal" class="">
                                                    <div class="d-flex align-items-center mb-2">
                                                        <div class="mr-2">Total Volume:</div>
                                                        <b-form-input id="input-horizontal" class="form-control mr-2" v-model="form.totals.total_volume" style="width:140px;"></b-form-input>
                                                        <b-form-select class="form-control" v-model="form.totals.dimention_unit" style="width:60px;background-position-x: right;">
                                                            <option value="CMQ">cm³</option> <!-- CC Cubic centimetre-->
                                                            <option value="MTQ">m³</option> <!-- MC  Cubic Metre-->  
                                                            <option value="FTQ">ft³</option> <!-- CF  Cubic Foot--> 
                                                            <option value="INQ">in³</option> <!-- CI  Cubic inch--> 
                                                        </b-form-select>
                                                    </div>
                                                    <div class="d-flex align-items-center">
                                                        <div class="mr-2 mb-0">Total Amount:</div>
                                                        <b-form-input style="width:140px;" id="input-horizontal" class="form-control mr-2" :value="calculatedCharge"></b-form-input>
                                                    </div>
                                                </b-form-group>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </div>
                                <!-- CONSIGNMENT RATE DESCRIPTION SECTION END HERE -->
                                <hr class="hr" />
                                <div>
                                    <b-row>
                                        <b-col cols="12">
                                            <div class="mt-6 mb-15 ml-4 mr-4">
                                                <h6 class="h-color mb-6">Customs Origin Code:</h6>
                                                <b-form-group id="fieldset-horizontal" style="max-width: 450px; width: 100%;">
                                                    <b-form-select class="form-control" v-model="form.custom_origin.customs_origin_code">
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
                                                </b-form-group>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <hr class="hr" />
                                    <b-row>
                                        <b-col cols="12">
                                            <div class="pt-4 pb-9">
                                                <b-tabs content-class="mt-3" class="custom-nav">
                                                    <b-tab title="OSI" active>
                                                        <div class="ml-3 mt-8">
                                                            <h6 class="h-color" style="font-size: 15px;font-weight:500">Other Service Information:</h6>
                                                            <div class="py-7">
                                                                <b-form-textarea class="responsive-textarea" style="height:80px;width: 60%;" id="textarea"
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
                                                                <b-form-textarea class="responsive-textarea" style="height:80px;" id="textarea"
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
                                                                <b-form-textarea class="responsive-textarea"
                                                                style="height:80px;" id="textarea"
                                                                v-model="form.custom_origin.accounting_information"
                                                                :class="{ 'is-invalid': form.errors.has('accounting_information') }"></b-form-textarea>
                                                                <has-error :form="form" field="accounting_information"></has-error>
                                                            </div>
                                                            <div class="d-flex align-items-center mt-2 flex-wrap tab-input-group">
                                                                <label for="input-horizontal" class="mb-0 mr-2" style="width: 90px">Letter Of Credit</label>
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
                                                    <b-tab title="IATA and Cass">
                                                        <div class="ml-3 mt-8">
                                                            <h6 class="h-color" style="font-size: 15px;font-weight:500">Override IATA And Cass:</h6>
                                                            <div class="py-7">
                                                                <b-row>
                                                                    <b-col cols="auto" class="d-flex align-items-center">
                                                                        <b-form-group id="fieldset-horizontal" abel-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                            label="IATA:" class="form-control-sm col-form-label">
                                                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                                                v-model="iata_cass.iata_agent_code"></b-form-input>
                                                                        </b-form-group>
                                                                    </b-col>
                                                                    <b-col cols="auto" class="d-flex align-items-center">
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label="Cass:"
                                                                            label-for="input-horizontal" class="form-control-sm col-form-label">
                                                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                                                v-model="iata_cass.iata_agent_cass"></b-form-input>
                                                                        </b-form-group>
                                                                    </b-col>
                                                                    <b-col cols="auto" class="d-flex align-items-center">
                                                                        <b-form-group label-for="name-input">
                                                                            <b-form-checkbox size="sm" v-model="form.is_iata_login_later">Save information for later logins</b-form-checkbox>
                                                                        </b-form-group>
                                                                    </b-col>
                                                                </b-row>
                                                            </div>
                                                        </div>
                                                    </b-tab>
                                                    <b-tab title="Agent Information">
                                                        <div class="ml-3 mt-8">
                                                            <h6 class="h-color" style="font-size: 15px;font-weight:500">Agent information:</h6>
                                                            <div class="py-7">
                                                                <b-row>
                                                                    <b-col cols="12" md="6" class="align-items-center mb-6 mb-md-0 mb-lg-0">
                                                                        <div style="background-color: #F2F9FF;" class="mb-4">
                                                                            <h6 class="h-color" style="padding:5px 20px;font-size: 15px;font-weight:500">Override Issuing Agent:</h6>
                                                                        </div>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                            class="" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Agent Name:</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input style="width: 315px;" id="input-horizontal" class="form-control-lg"
                                                                                v-model="agent_information.agent_name"></b-form-input>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                            class="" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Agent Address:</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input style="width: 315px;" id="input-horizontal" class="form-control-lg"
                                                                                v-model="agent_information.agent_address"></b-form-input>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                            class="" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>&nbsp;</span>
                                                                                </div>
                                                                            </template>
                                                                            <div class="d-flex">
                                                                                <b-form-input style="width: 150px;" id="input-horizontal" class="form-control-sm mr-4"
                                                                                v-model="agent_information.agent_city"></b-form-input>
                                                                                <b-form-input style="width: 150px;" id="input-horizontal" class="form-control-sm"
                                                                                    v-model="agent_information.agent_pincode"></b-form-input>
                                                                            </div>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                            class="" style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Issuing Signature:</span>
                                                                                    <span style="color: red;">*</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input style="width:315px" id="input-horizontal" class="form-control-sm"
                                                                                v-model="agent_information.agent_issue_sign"></b-form-input>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class=""
                                                                            style="margin-bottom:4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Issuing Location Code:</span>
                                                                                    <span style="color:red;">*</span>
                                                                                </div>
                                                                            </template>
                                                                            <div class="custom-dropdown" ref="dropdownContainer_issue" @click="toggleDropdown('issue')">
                                                                                <input type="text" v-model="agent_information.agent_issue_loc_code" placeholder="Search location" id="agent_issue_loc_code" style="width:170px;" class="form-control" 
                                                                                    autocomplete="off" :class="{ 'is-invalid': form.errors.has('agent_issue_loc_code') }">
                                                                                <div v-if="activeDropdown === 'issue' && getFilteredLocations(agent_information.agent_issue_loc_code).length" class="dropdown-options">
                                                                                    <div v-for="(item, index) in getFilteredLocations(agent_information.agent_issue_loc_code)" 
                                                                                        :key="index" 
                                                                                        @click.stop="selectLocation('agent_issue_loc_code', item, 'agent_information')" 
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
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                            class="" style="margin-bottom: 4px !important;">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Issuing Date:</span>
                                                                                    <span style="color: red;">*</span>
                                                                                </div>
                                                                            </template>
                                                                            <div class="d-flex">
                                                                                <input type="text" style="width:150px;" id="input-horizontal" class="form-control-sm form-control  mr-2" v-model="agent_information.agent_issue_date" />
                                                                                <date-picker valueType="format" style=" width: 30px !important;" @change="handleDateChange($event, 'agent_information.agent_issue_date')"></date-picker>
                                                                            </div>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                            class="">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>Agent Account:</span>
                                                                                </div>
                                                                            </template>
                                                                            <input type="text" style="width:150px;" id="input-horizontal" class="form-control-sm form-control" v-model="agent_information.agent_account" />
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                            content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class="">
                                                                            <template #label>
                                                                                <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                    <span>&nbsp;</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-checkbox size="sm">Save information for later logins</b-form-checkbox>
                                                                        </b-form-group>
                                                                    </b-col>
                                                                    <b-col cols="12" md="6" class="align-items-center mt-6 mt-md-0 mt-lg-0">
                                                                        <div style="background-color: #F2F9FF;" class="mb-4">
                                                                            <h6 class="h-color" style="padding:5px 20px;font-size: 15px;font-weight:500">Senders Reference:</h6>
                                                                        </div>
                                                                        <div class="d-flex mb-6">
                                                                            <div style="padding:0px 20px;">
                                                                                <b-form-radio name="participate" size="sm" v-model="agent_information.participate" value="0" style="font-size: 14px;">Participant</b-form-radio>
                                                                            </div>
                                                                            <div style="padding:0px 20px;">
                                                                                <b-form-radio name="participate" size="sm" v-model="agent_information.participate" value="1" style="font-size: 14px;">Office</b-form-radio>
                                                                            </div>
                                                                        </div>
                                                                        <div v-if="agent_information.participate === '0'">
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Participant Airport:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <div class="custom-dropdown dropdown-container" ref="dropdownContainer_participant" @click="toggleDropdown('participant')">
                                                                                    <input type="text" v-model="agent_information.participate_airport" placeholder="Search location" id="participant" class="form-control" 
                                                                                        autocomplete="off" :class="{ 'is-invalid': form.errors.has('participate_airport') }">
                                                                                    <div v-if="activeDropdown === 'participant' && getFilteredLocations(agent_information.participate_airport).length" class="dropdown-options">
                                                                                        <div v-for="(item, index) in getFilteredLocations(agent_information.participate_airport)" 
                                                                                            :key="index" 
                                                                                            @click.stop="selectLocation('participate_airport', item, 'agent_information')" 
                                                                                            class="option">
                                                                                            {{ item.iata_code }} ({{ item.destination }})
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <has-error :form="form" field="participate_airport"></has-error>
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Participant Identifer:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-select class="form-control-sm"
                                                                                    style="width: 250px"
                                                                                    v-model="agent_information.prticipant_identifer">
                                                                                    <option disabled value="">Please select one</option>
                                                                                    <option value="AIR">Airline AIR</option>
                                                                                    <option value="APT">Airport Authority APT</option>
                                                                                    <option value="AGT">Agent AGT</option>
                                                                                    <option value="BRK">Broker BRK</option>
                                                                                    <option value="CAG">Commissionable Agent CAG</option>
                                                                                    <option value="CNE">Consignee CNE</option>
                                                                                    <option value="CTM">Customs CTM</option>
                                                                                    <option value="DCL">Declarant DCL</option>
                                                                                    <option value="DEC">Deconsolidator DEC</option>
                                                                                    <option value="FFW">Freight Forwarder FFW</option>
                                                                                    <option value="GHA">Ground Handling Agent GHA</option>
                                                                                    <option value="PTT">Post Office PTT</option>
                                                                                    <option value="SHP">Shipper SHP</option>
                                                                                    <option value="TRK">Trucker TRK</option>
                                                                                </b-form-select>
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Participant Code:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input style="width: 300px;" id="input-horizontal" class="form-control-sm"
                                                                                    v-model="agent_information.participant_code"></b-form-input>
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:150px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Office File Reference:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input style="width:250px" id="input-horizontal" class="form-control-sm"
                                                                                    v-model="agent_information.office_file_reference"></b-form-input>
                                                                            </b-form-group>
                                                                        </div>
                                                                        <div v-if="agent_information.participate === '1'">
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:165px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Office Airport:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-select class="form-control-sm" style="width: 250px"
                                                                                    v-model="agent_information.office_airport">
                                                                                    <option disabled value="">Please select one</option>
                                                                                        <option value="BLR">BLR, Bangalore (BLR), India</option>
                                                                                        <option value="AAE">AAE, Annaba (AAE), Algeria</option>
                                                                                        <option value="AAH">AAH, Aachen (AAH), Germany</option>
                                                                                </b-form-select>
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:165px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Office Function Designator:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <input type="text" class="form-control" style="width: 250px" v-model="agent_information.office_function_designator" />
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:165px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Office Company Designator:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <input type="text" class="form-control" style="width: 250px" v-model="agent_information.office_company_designator" />
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                                                content-cols-sm content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom:4px !important;">
                                                                                <template #label>
                                                                                    <div style="width:165px;" class="d-flex align-items-center justify-content-end">
                                                                                        <span>Office File Reference:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input style="width:250px" id="input-horizontal" class="form-control-sm"
                                                                                    v-model="agent_information.office_file_reference"></b-form-input>
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
                                                                                <div class="align-items-center custom-dropdown mr-4" ref="dropdownContainer_alsoNotify" @click="toggleDropdown('alsoNotify')">
                                                                                    <input style="width: 315px" type="text" v-model="form.also_notify_address.also_name" placeholder="Search name" id="also_notify" class="form-control-sm form-control" autocomplete="off"
                                                                                    :class="{ 'is-invalid': form.errors.has('also_name') }"
                                                                                    @input="filteralsoNotify" @focus="toggleDropdown('alsoNotify', true)" />

                                                                                    <div v-if="activeDropdown === 'alsoNotify' && filteredAlsoNotify.length" class="dropdown-options">
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
                                                                            <b-form-input style="width: 315px" id="input-horizontal" class="form-control-sm"
                                                                                v-model="form.also_notify_address.also_name_2"
                                                                                :class="{ 'is-invalid': form.errors.has('also_name_2') }"></b-form-input>
                                                                            <has-error :form="form" field="also_name_2"></has-error>
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
                                                                            <b-form-input id="input-horizontal" class="form-control-sm"
                                                                                style="width: 315px" v-model="form.also_notify_address.also_address_line_2"
                                                                                :class="{ 'is-invalid': form.errors.has('also_address_line_2') }"></b-form-input>
                                                                            <has-error :form="form" field="also_address_line_2"></has-error>
                                                                        </b-form-group>
                                                                        <div class="d-flex align-items-center" style="margin-bottom:4px !important;">
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="align-items-center">
                                                                                <template #label>
                                                                                    <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                        <span>City:</span>
                                                                                        <span style="color:red;">*</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input id="input-horizontal" class="form-control-sm mr-5" style="width: 250px"
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
                                                                            class="align-items-center" style="margin-bottom: 4px !important;">
                                                                            <template #label>
                                                                                <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                    <span>Post Code:</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input id="input-horizontal" class="form-control-sm" style="width: 315px"
                                                                                v-model="form.also_notify_address.also_post_code"
                                                                                :class="{ 'is-invalid': form.errors.has('also_post_code') }"></b-form-input>
                                                                            <has-error :form="form" field="also_post_code"></has-error>
                                                                        </b-form-group>
                                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                            content-cols-lg="auto" label-for="input-horizontal"
                                                                            class="align-items-center" style="margin-bottom: 4px !important;">
                                                                            <template #label>
                                                                                <div class="d-flex justify-content-end align-items-center" style="width:80px;">
                                                                                    <span>State:</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-input id="input-horizontal" class="form-control-sm" style="width: 315px"
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
                                                                                    <span style="color:red;">*</span>
                                                                                </div>
                                                                            </template>
                                                                            <b-form-select class="form-control-sm" style="width: 315px"
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
                                                                            <b-form-input id="input-horizontal" class="form-control-sm" style="width:315px;"
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
                                                                            <b-form-input style="width:315px;" id="input-horizontal" class="form-control-sm"
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
                                                                            <b-form-input style="width:315px;" id="input-horizontal" class="form-control-sm"
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
                                                                        <b-form-textarea style="width:500px;height:80px;" class="" id="textarea" v-model="form.custom_origin.extra_print"></b-form-textarea>
                                                                    </b-col>
                                                                </b-row>
                                                            </div>
                                                        </div>
                                                    </b-tab>
                                                    <b-tab title="Carrier Address">
                                                        <div class="ml-3 mt-8">
                                                            <h6 class="h-color" style="font-size: 15px;font-weight:500">Override the Carrier Address on the PDF Document</h6>
                                                            <h6 class="" style="font-size: 12px;font-weight:500">(This can be used for non-IATA carriers)</h6>
                                                            <div class="py-7">
                                                                <b-row>
                                                                    <b-col cols="auto">
                                                                        <div class="align-items-center mt-5">
                                                                            <div class="d-flex align-items-center" style="margin-bottom: 4px !important;">
                                                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                    content-cols-lg="auto" label-for="input-horizontal"
                                                                                    class="mr-4">
                                                                                    <template #label>
                                                                                        <div class="d-flex align-items-center justify-content-end" style="width:100px;">
                                                                                            <span>Carrier Name:</span>
                                                                                        </div>
                                                                                    </template>
                                                                                    <b-form-input id="input-horizontal"
                                                                                        class="form-control-sm" style="width:315px;"></b-form-input>
                                                                                    </b-form-group>
                                                                                <b-form-checkbox size="sm">Public Address</b-form-checkbox>
                                                                            </div>
                                                                            <b-form-group style="margin-bottom: 4px !important;" id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                content-cols-lg="auto" label-for="input-horizontal" class="">
                                                                                <template #label>
                                                                                    <div class="d-flex align-items-center justify-content-end" style="width:100px;">
                                                                                        <span>Carrier Prefix:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input id="input-horizontal" class="form-control-sm" style="width:315px;"></b-form-input>
                                                                            </b-form-group>
                                                                            <b-form-group style="margin-bottom: 4px !important;" id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="">
                                                                                <template #label>
                                                                                    <div class="d-flex align-items-center justify-content-end" style="width:100px;">
                                                                                        <span>Address:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input id="input-horizontal"
                                                                                    class="form-control-sm" style="width:315px;"></b-form-input>
                                                                            </b-form-group>
                                                                            <div class="d-flex align-items-center" style="margin-bottom: 4px !important;">
                                                                                <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                    content-cols-lg="auto" label-for="input-horizontal"
                                                                                    class="">
                                                                                    <template #label>
                                                                                        <div class="d-flex align-items-center justify-content-end" style="width:100px;">
                                                                                            <span>City:</span>
                                                                                        </div>
                                                                                    </template>
                                                                                    <b-form-input id="input-horizontal"
                                                                                        class="form-control-sm mr-4" style="width:230px;"></b-form-input>
                                                                                </b-form-group>
                                                                                <b-form-input id="input-horizontal"
                                                                                    class="form-control-sm" style="width:60px;"></b-form-input>
                                                                            </div>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom: 4px !important;">
                                                                                <template #label>
                                                                                    <div class="d-flex align-items-center justify-content-end" style="width:100px;">
                                                                                        <span>Pin code:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input id="input-horizontal"
                                                                                    class="form-control-sm" style="width:200px;"></b-form-input>
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom: 4px !important;">
                                                                                <template #label>
                                                                                    <div class="d-flex align-items-center justify-content-end" style="width:100px;">
                                                                                        <span>State:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input id="input-horizontal"
                                                                                    class="form-control-sm" style="width:200px;"></b-form-input>
                                                                            </b-form-group>
                                                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm
                                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                                class="" style="margin-bottom: 4px !important;">
                                                                                <template #label>
                                                                                    <div class="d-flex align-items-center justify-content-end" style="width:100px;">
                                                                                        <span>Country:</span>
                                                                                    </div>
                                                                                </template>
                                                                                <b-form-input id="input-horizontal"
                                                                                    class="form-control-sm" style="width:300px;"></b-form-input>
                                                                            </b-form-group>
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
                                </div>
                                <hr class="hr" />
                                <div class="py-5">
                                    <div class="ml-3 mt-8">
                                        <h6 class="h-color">Other Charges:</h6>
                                        <div class="py-7">
                                            <b-row>
                                                <b-col cols="12">
                                                    <div class="table-responsive">
                                                     <table class="table table-sm other-charges-entry-table" style="max-width:100%;">
                                                         <thead>
                                                             <tr class="" style="background-color: #F2F9FF;">
                                                                 <th class="">Code</th>
                                                                 <th class="">&nbsp;</th>
                                                                 <th class="">Amount In INR</th>
                                                                 <th class="">&nbsp;</th>
                                                                 <th class="">&nbsp;</th>
                                                                 <th class="">&nbsp;</th>
                                                                 <th class="">&nbsp;</th>
                                                                 <th class="">&nbsp;</th>
                                                             </tr>
                                                         </thead>
                                                         <tbody>
                                                             <tr>
                                                                 <td class="pt-5 editable-cell align-items-center" style="width:300px;vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal" class="d-flex align-items-center">
                                                                         <b-form-select class="form-control-sm" v-model="other_charges.other_charge_code">
                                                                         <option value="">Select an Other Charge Code</option>
                                                                         <option v-for="charge in other_charges_code" :key="charge.value" :value="charge.value">
                                                                             {{ charge.text }}
                                                                         </option>
                                                                         </b-form-select>
                                                                     </b-form-group>
                                                                 </td>
                                                                 <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" label-for="input-horizontal" class="align-items-center">
                                                                         <template #label>
                                                                             <div class="d-flex align-items-center">
                                                                                 <span>Or:</span>
                                                                             </div>
                                                                         </template>
                                                                         <b-form-input id="input-horizontal" style="width:40px;" class="form-control-sm" v-model="other_charges.other_code" placeholder="Or code"></b-form-input>
                                                                     </b-form-group>
                                                                 </td>
                                                                 <td class="pt-5 editable-cell" style="vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal"
                                                                         class="align-items-center">
                                                                         <b-form-input style="width:80px;" class="form-control-sm"
                                                                             v-model="other_charges.amount" placeholder="Amount"></b-form-input>
                                                                     </b-form-group>
                                                                 </td>
                                                                 <td class="pt-5 editable-cell charge-radio-cell" style="vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal"
                                                                         class="align-items-center">
                                                                         <b-form-radio name="due" size="sm" v-model="other_charges.due" value="A">Due Agent</b-form-radio>
                                                                     </b-form-group>
                                                                 </td>
                                                                 <td class="pt-5 editable-cell charge-radio-cell" style="vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal"
                                                                         class="align-items-center">
                                                                         <b-form-radio name="due" size="sm" v-model="other_charges.due"
                                                                             value="C">Due Carrier</b-form-radio>
                                                                     </b-form-group>
                                                                 </td>
                                                                 <td class="pt-5 editable-cell charge-radio-cell" style="vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal"
                                                                         class="align-items-center">
                                                                         <b-form-radio name="payment_type" size="sm" v-model="other_charges.payment_type"
                                                                             value="P">Prepaid</b-form-radio>
                                                                     </b-form-group>
                                                                 </td>
                                                                 <td class="pt-5 editable-cell charge-radio-cell" style="vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal"
                                                                         class="align-items-center">
                                                                         <b-form-radio name="payment_type" size="sm" v-model="other_charges.payment_type"
                                                                             value="C">Collect</b-form-radio>
                                                                     </b-form-group>
                                                                 </td>
                                                                 <td class="pt-5 editable-cell align-items-center charge-btn-cell" style="vertical-align: middle;">
                                                                     <b-form-group id="fieldset-horizontal"
                                                                         class="align-items-center">
                                                                         <b-button class="show-btn px-5" @click="addCharge">
                                                                             {{ editIndex !== null ? 'Update' : 'Add' }}
                                                                         </b-button>
                                                                     </b-form-group>
                                                                 </td>
                                                             </tr>
                                                         </tbody>
                                                     </table>
                                                     </div>
                                                </b-col>
                                                <b-col cols="12">
                                                    <!-- Calculation Table always visible -->
                                                    <div class="d-flex align-items-start py-8">
                                                        <div class="table-responsive">
                                                        <table class="table table-sm">
                                                            <thead>
                                                                <tr style="background-color: #F2F9FF;">
                                                                    <th class="">Calculated Charges</th>
                                                                    <th class=""></th>
                                                                    <th class=""></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td class="pt-5 editable-cell" style="vertical-align: middle;">Chargeable Weight</td>
                                                                    <td class="pt-5 editable-cell">
                                                                        <input type="text" class="form-control" style="width: 100px;vertical-align: middle;"
                                                                            v-model="other_charges.chargable_weight1" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="editable-cell" style="vertical-align: middle;">Charge</td>
                                                                    <td class="editable-cell" style="vertical-align: middle;">
                                                                        <input type="text" class="form-control" style="width: 100px;vertical-align: middle;"
                                                                            v-model="other_charges.charge" />
                                                                    </td>
                                                                    <td class="editable-cell mb-2" style="vertical-align: middle;">
                                                                        <b-button class="show-btn px-5"
                                                                            @click="calculateCharge">Calculate</b-button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        </div>
                                                    </div>
                                                </b-col>
                                                <b-col cols="12">
                                                    <div class="d-flex align-items-start py-8">
                                                        <div class="table-responsive">
                                                        <table class="table table-sm" style="max-width: 100%;">
                                                            <thead>
                                                                <tr style="background-color: #F2F9FF;">
                                                                    <th class="">Code</th>
                                                                    <th class="">Due</th>
                                                                    <th class="">Amount</th>
                                                                    <th class="">Type Of Payment</th>
                                                                    <th class="">Actions</th>
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
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </div>  
                                </div>
                                <hr class="hr" />
                                <div class="py-7">
                                    <b-tabs class="custom-nav">
                                        <b-tab title="Payment Information">
                                            <b-row>
                                                <b-col cols="12" md="6" class="mb-6 mb-md-0 mb-lg-0">
                                                    <div class="d-flex align-items-center ml-3 mt-6" style="justify-content: space-between;margin-bottom:4px !important;">
                                                        <div style="float:left;">
                                                            <b-form-group id="fieldset-horizontal"
                                                                label-cols-lg="auto" content-cols-sm
                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                class="" label="Type Of Payment:">
                                                                <b-form-select class="form-control-sm"
                                                                    style="width: 205px;"
                                                                    v-model="form.payment_info.type_of_payment">
                                                                    <option value=""> Please select one</option>
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
                                                                    <option value="PP">PP - All charges prepaid cash</option>
                                                                    <option value="PX">PX - All charges prepaid credit</option>
                                                                </b-form-select>
                                                            </b-form-group>
                                                        </div>
                                                        <div style="float:right;">
                                                            <b-form-group id="fieldset-horizontal"
                                                                label-cols-lg="auto" content-cols-sm
                                                                content-cols-lg="auto" label-for="input-horizontal"
                                                                class="">
                                                                <template #label>
                                                                    <div class="align-items-center d-flex">
                                                                        <span>Currency:</span>
                                                                        <span style="color:red;">*</span>
                                                                    </div>
                                                                </template>
                                                                <b-form-input id="input-horizontal"
                                                                    class="form-control-sm" style="width: 60px;"
                                                                    v-model="form.payment_info.currency"
                                                                    :class="{ 'is-invalid': form.errors.has('currency') }"></b-form-input>
                                                                    <has-error :form="form" field="currency"></has-error>
                                                            </b-form-group>
                                                        </div>
                                                    </div>
                                                    <div class="ml-3 mt-4 mb-4">
                                                        <h6 style="font-size:13px;font-weight:400;">Declared Values For:</h6>
                                                    </div>

                                                    <b-form-group style="margin-bottom:4px !important;" id="fieldset-horizontal" label-cols-lg="auto"
                                                        content-cols-sm content-cols-lg="auto"
                                                        label-for="input-horizontal"
                                                        class="ml-3">
                                                        <template #label>
                                                            <div class="align-items-center d-flex" style="width: 60px;">
                                                                <span>Carriage:</span>
                                                            </div>
                                                        </template>
                                                        <b-form-input id="input-horizontal"
                                                            class="form-control-sm"
                                                            style=" width: 200px;"
                                                            v-model="form.payment_info.declear_value_carriage"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group style="margin-bottom:4px !important;" id="fieldset-horizontal" label-cols-lg="auto"
                                                        content-cols-sm content-cols-lg="auto"
                                                        label-for="input-horizontal"
                                                        class="ml-3">
                                                        <template #label>
                                                            <div class="align-items-center d-flex" style="width: 60px;">
                                                                <span>Customs:</span>
                                                            </div>
                                                        </template>
                                                        <b-form-input id="input-horizontal"
                                                            class="form-control-sm"
                                                            style="width: 200px;"
                                                            v-model="form.payment_info.declear_value_customs"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group style="margin-bottom:4px !important;" id="fieldset-horizontal" label-cols-lg="auto"
                                                        content-cols-sm content-cols-lg="auto"
                                                        label-for="input-horizontal" class="ml-3">
                                                        <template #label>
                                                            <div class="align-items-center d-flex" style="width: 60px;">
                                                                <span>Insurance:</span>
                                                            </div>
                                                        </template>
                                                        <b-form-input id="input-horizontal"
                                                            class="form-control-sm"
                                                            style="width: 200px;"
                                                            v-model="form.payment_info.declear_value_insurance"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col cols="12" md="6" class="mt-6 mt-md-0 mt-lg-0">
                                                    <div class="d-flex justify-content-end">
                                                        <div class="table-responsive">
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
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </b-tab>
                                        <b-tab title="Special Handling Codes">
                                            <b-row>
                                                <div class="d-flex mt-6 ml-3">
                                                    <b-col cols="auto">
                                                        <b-form-group id="fieldset-horizontal"
                                                            class="">
                                                            <b-form-select style="width:430px;" class="form-control-sm" v-model="selectedCode"
                                                                :class="{ 'is-invalid': form.errors.has('special_handling_code') }">
                                                                <option disabled value="">Select Special Handling Codes</option>
                                                                <option v-for="code in codes" :key="code.value"
                                                                    :value="code.value">{{ code.text }}</option>
                                                            </b-form-select>
                                                            <has-error :form="form" field="special_handling_code"></has-error>
                                                        </b-form-group>
                                                    </b-col>
                                                    <b-col cols="auto">
                                                        <b-form-group id="fieldset-horizontal" label-cols-lg="auto"
                                                            content-cols-sm content-cols-lg="auto"
                                                            label-for="input-horizontal"
                                                            class="">
                                                            <template #label>
                                                                <div class="align-items-center d-flex">
                                                                    <span>Or:</span>
                                                                </div>
                                                            </template>
                                                            <b-form-input style="width: 60px;" id="input-horizontal"
                                                                class="form-control-sm" v-model="custom_special_handling_code"></b-form-input>
                                                        </b-form-group>
                                                    </b-col>
                                                    <b-col cols="auto">
                                                        <b-form-group id="fieldset-horizontal"
                                                            class="">
                                                            <b-button class="show-btn px-5" id="input-horizontal"
                                                                type="button" @click="addManualCode">Add</b-button>
                                                        </b-form-group>
                                                    </b-col>
                                                </div>
                                            </b-row>
                                            <b-row>
                                                <b-col cols="12">
                                                    <div class="d-flex align-items-start py-7">
                                                        <table class="table table-sm" style="max-width: 100%">
                                                            <thead>
                                                                <tr class="" style="background: #F2F9FF;">
                                                                    <td style="padding:5px;font-size:12px;font-weight:400;" class="editable-cell">Code</td>
                                                                    <td style="padding:5px;font-size:12px;font-weight:400;" class="editable-cell"></td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(code, index) in form.tableCodes" :key="index">
                                                                    <td class="editable-cell">{{ code }}</td>
                                                                    <td class="editable-cell"><b-icon icon="trash" font-scale="1"
                                                                        @click="deleteSplCode(index)"></b-icon></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                            
                                        </b-tab>
                                        <b-tab title="Other Customs Information">
                                            <b-row>
                                                <b-col cols="12">
                                                    <div class="ml-3 mt-6">
                                                        <h6 class="h-color" style="font-size: 15px;font-weight:500">Other Customs Information:</h6>
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
                                                                                <b-button class="show-btn px-5" @click="addOtherCustomInfo">
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
                                                        <b-form-textarea style="width: 1000px !important;height:80px;" id="textarea"></b-form-textarea>
                                                    </div>
                                                </b-col>
                                                <b-col cols="12">
                                                    <div class="ml-3 mt-3 d-flex justify-content-end" style="max-width:1000px;">
                                                        <b-button class="show-btn px-5">Upload</b-button>
                                                    </div>
                                                </b-col>
                                                <b-col cols="12">
                                                    <div class="ml-3 mt-6">
                                                        <table class="table table-sm" style="max-width:40%;">
                                                            <tbody>
                                                                <tr>
                                                                    <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;">Other Customs
                                                                        Information</th>
                                                                        <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;">&nbsp;</th>
                                                                        <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;">&nbsp;</th>
                                                                        <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;">&nbsp;</th>
                                                                        <th class="" style="background:#F2F9FF;font-size:13px;font-weight:400;">&nbsp;</th>
                                                                </tr>
                                                                <tr v-for="(row, index) in form.oci_entries" :key="index">
                                                                    <td class="editable-cell">{{ row.country_code }}
                                                                    </td>
                                                                    <td class="editable-cell">{{ row.info_identifier }}
                                                                    </td>
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
                                <div class="py-7 bottom-email-section">
                                    <b-row class="justify-content-end">
                                        <b-col cols="12" md="auto" class="text-right mobile-text-left">
                                            <div class="d-flex justify-content-end mobile-justify-start mb-2">
                                                <b-form-checkbox size="sm" class="premium-checkbox">Including Cargo Label</b-form-checkbox>
                                            </div>
                                            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label-for="input-horizontal" label="Email FNA:" class="form-control-sm col-form-label mb-0">
                                                <b-form-input id="input-horizontal" v-model="form.awb_email" @input="handleAwbEmailInput" class="form-control-sm" style="width: 300px" placeholder="Separate addresses with a semicolon ';'"></b-form-input>
                                                <div class="d-flex justify-content-end mt-1">
                                                    <b-form-checkbox size="sm" v-model="use_my_email" @change="handleUseMyEmailChange" class="premium-checkbox font-size-xs text-muted">
                                                        Use my default FNA email
                                                    </b-form-checkbox>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </div>
                                <div class="py-10">
                                    <!-- Spinner (Initially Hidden) -->
                                    <div v-if="pdf_error_msg" class="text-danger text-right mb-3">
                                        <div v-html="pdf_error_msg"></div>
                                    </div>
                                    <div v-if="showSpinner" class="spin" style="margin-top: 20px;"></div>
                                    <div class="d-flex justify-content-between">
                                        <div v-if="is_generate_pdf" class="mb-24" style="box-shadow: 0px 3px 15px 0px #0013;border-radius: 12px;width: 100%;">
                                            <div class="" style="display:flex;width:96%;margin-left: 2%;margin-right: 2%;">
                                                <div style="display:flex;justify-content: start;color:#355594;font-size:15px;line-height:71px;font-weight:500;width:100%">Cargo document created</div>
                                                <div style="display:flex;justify-content: end;line-height: 71px;align-self: center;width:100%" @click="isGeneratePdf(generateButton=0);"><img src="/media/assets/ui/cross.png" alt="cross button" style="width:24px;height: 24px;cursor: pointer;"></div>
                                            </div>
                                            <div style="width:96%;margin-left: 2%;margin-right: 2%;">
                                                <div style="width:100%;">
                                                    <p style="color:#4C4C4C;font-size: 13px;line-height:13px;font-weight: 400;margin: 0;">Airway bill message saved in database</p>
                                                    <p style="color:#4C4C4C;font-size: 13px;line-height:18px;font-weight: 400;border-bottom: 1px solid #CDCDCD;padding-bottom: 15px;">PDF documents prepared</p>
                                                </div>
                                            </div>
                                            <div class="mb-16" style="width:96%;margin-left: 2%;margin-right: 2%;">
                                                <a href="#" style="width:fit-content;" class="custom-link mb-0" @click="() => handleSaveAndGeneratePDF('download-awb-pdf')">
                                                    <p class="mb-0 ml-2">e-AWB Pdf file</p>
                                                </a>
                                                <a href="#" style="width:fit-content;" class="custom-link mb-0" @click="() => handleSaveAndGeneratePDF('download-multiple-awb-pdf')">
                                                    <p class="mb-0 ml-2">Multipage e-AWB Pdf</p>
                                                </a>
                                                <a href="#" style="width:fit-content;" class="custom-link mb-0" @click="() => handleSaveAndGeneratePDF('download-multiple-both-page-awb-pdf')">
                                                    <p class="mb-0 ml-2">Multipage e-AWB Pdf with back pages</p>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                   
                                    <div v-if="main_error_msg" class="text-danger text-right mb-3">
                                        <div v-html="main_error_msg"></div>
                                    </div>
                                    <div v-if="successMessage" class="" style="font-weight: bold; display: flex; justify-content: flex-end; text-align: right;">
                                        <span>
                                            {{ successMessage.split('-Pass')[0] }}
                                            <span style="color: green;">-Pass</span>
                                        </span>
                                    </div>
                                    <div class="d-flex justify-content-end submit-button">
                                        <b-button class="show-btn mr-2" type="button" @click="isGeneratePdf(generateButton=1); form.status='generate_pdf';">Generate PDF</b-button>
                                        <div v-if="current_user.can_send">
                                            <b-button class="show-btn mr-2" type="submit" @click="form.status='send';">Send</b-button>
                                            <b-button class="show-btn mr-2" type="submit" @click="form.status='send';">Send & Clear</b-button>
                                        </div>
                                        <div v-if="form.first_box.status!='send'">
                                           <b-button class="show-btn" type="submit" @click="form.status='draft';">{{submitButtonText}}</b-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-form>
                    </template>
                </div>
            </div>
        </b-container>
        <!-- </div>
    </div> -->
</template>
<script>
import Datepicker from "vuejs-datepicker";
import DatePicker from "vue2-datepicker";
import ApiService from "@/core/services/api.service";
import { loadLocations } from "@/core/services/location.cache";
import "vue2-datepicker/index.css";
import debounce from 'lodash.debounce';

import SideBar from "@/view/layouts/public/SideBar.vue";
import { mapGetters } from "vuex";
import OcrUploadModal from "@/view/components/OcrUploadModal.vue";
import DashboardHistoryModal from "@/view/components/DashboardHistoryModal.vue";
// import PageLoader from "../../components/PageLoader.vue";
import airWayBillMixin from "@/core/mixins/airWayBillMixin";
import AddressBlock from "@/view/pages/dashboard/components/AddressBlock.vue";

export default {
    name: "FocusAir",
    mixins: [airWayBillMixin],
    data() {
        return {
            form: new Form({
                awb_email:'',
                first_box:{
                    awb_code: '',
                    awb_no: '',
                    consolidated_mawb: false,
                    awb: true,
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
                    also_name_2: '',
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
                    date: this.getCurrentDate(),
                    date_2: this.getCurrentDate(),
                    date_3: this.getCurrentDate(),
                },
                entries: [],
                oci_entries: [],
                tableCodes: [],
                charges: [],
                shipper_name: '',
                totals:{
                    total_volume: null,
                    total_amount: 0,
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
                    // declear_value_carriage: '',
                    // declear_value_customs: '',
                    // declear_value_insurance: '',
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
                is_iata_login_later: false,
                status:'',
            }),
            consignmentUrl: '/user/get-consignment-error',
            iata_cass:{
                iata_agent_code: null,
                iata_agent_cass: null,
            },
            agent_information:{
                agent_name: '',
                agent_address: '',
                agent_city: '',
                agent_pincode: '',
                agent_issue_sign: '',
                agent_issue_loc_code: '',
                agent_issue_date: '',
                agent_account: null,

                //Participate Sender Reference
                participate: '0',
                participate_airport: '',
                prticipant_identifer: '',
                participant_code: null,
                office_file_reference: '',
               
                //Office Sender Reference
                office_airport: null,
                office_function_designator: null,
                office_company_designator: null,
            },
            defaultPaymentInfo: {
                declear_value_carriage: 'NVD',
                declear_value_customs: 'NCV',
                declear_value_insurance: 'XXX',
                currency: 'INR',
            },
            selectedViewPageOption: '/focus-air',
            selectedShipper: null,
            selectedConsignee: null,
            selectAlsoNotify: null,
            shippers: [],
            consignees: [],
            alsoNotify: [],
            searchQuery_to: '',
            selectedCode: '',
            custom_special_handling_code: '',
            manualCode: '',
            location: [],
            newHsCode: '',
            isOpen: false,
            showShipper: false,
            showConsignee: false,
            showCalculationTable: false,
            generatePDFAfterSave: '',
            countries: [],
            oci_data:{}, ///get-oci-data
            oci_identifiers:{},
            other_charges_code: [],
            existingData: {},
            data_items: [],
            isFetching: false,
            use_my_email: false,
            mode: 'add',
            awbDetails: false,
            awbError: null,
            awbId: null,
            filteredShippers: [],
            filteredConsignees: [],
            filteredAlsoNotify: [],
            awb_prefix_message: '',
            showAWBSection: false,
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
            logoSrc: "/media/assets/logos/logo-1.png",
            main_error_msg: "",
            pdf_error_msg: '',
            is_generate_pdf:0,
            showSpinner: false,
            selectedCompanyForUpload: null,
        };
    },
    
    methods: {
        handleUseMyEmailChange(checked) {
            if (checked) {
                this.form.awb_email = localStorage.getItem('fna_default_email') || '';
            } else {
                this.form.awb_email = '';
            }
        },
        handleAwbEmailInput(val) {
            if (val) {
                localStorage.setItem('fna_default_email', val);
            }
        },
        processExtractedData(response) {
            // Reset the form and UI states to clear any previously populated data
            this.form.reset();
            this.showShipper = false;
            this.showConsignee = false;
            this.isConsignmentAdded = false;

            // Injected existing extraction pipeline
            var awb_number = response.awb_number ? response.awb_number.split("-") : ['', ''];
            this.form.first_box.awb_code = awb_number[0] || '';
            this.form.first_box.awb_no = awb_number[1] || '';
            
            // Routing
            var departure = response.departure;
            var destination = response.destination;
            var transit = response.transit?.[0];
            
            // Departure + destination are populated independently of transit
            if (departure && destination) {
                var all_airport_short_code = [
                    departure,
                    destination,
                    transit?.transit_airports?.[0],
                    transit?.transit_airports?.[1],
                    transit?.transit_airports?.[2]
                ];
                ApiService.post(`/user/get-airport-by-airport-code`, {"airport_code": all_airport_short_code}).then((response2) => {
                    response2 = response2.data?.data;
                    this.form.routing_information.departure_airport = `${response2[0]['iata_code']}, ${response2[0]['destination']}`;
                    this.form.routing_information.destination_airport = `${response2[1]['iata_code']}, ${response2[1]['destination']}`;
                    this.form.routing_information.from = `${response2[0]['iata_code']}, ${response2[0]['destination']}`;
                    // Transit hops only filled when transit data is present
                    if (transit) {
                        this.form.routing_information.to = `${response2[2] ? response2[2]['iata_code'] : response2[1]['iata_code']}, ${response2[2] ? response2[2]['destination'] : response2[1]['destination']}`;
                        if (transit.transit_airports[1]) {
                            this.form.routing_information.to_2 = `${response2[3] ? response2[3]['iata_code'] : response2[1]['iata_code']}, ${response2[3] ? response2[3]['destination'] : response2[1]['destination']}`;
                        }
                        if (transit.transit_airports[2]) {
                            this.form.routing_information.to_3 = `${response2[4] ? response2[4]['iata_code'] : response2[1]['iata_code']}, ${response2[4] ? response2[4]['destination'] : response2[1]['destination']}`;
                        }
                    }
                });
                // Flight numbers and dates only when transit is available
                if (transit) {
                    if (transit.flights[0]) {
                        this.form.routing_information.by = transit.flights[0]?.flight_number?.slice(0, 2);
                        this.form.routing_information.flight = transit.flights[0]?.flight_number?.slice(2);
                        this.form.routing_information.date = this.formatDate(transit.flights[0].date);
                    }
                    if (transit.flights[1]) {
                        this.form.routing_information.by_2 = transit.flights[1]?.flight_number?.slice(0, 2);
                        this.form.routing_information.flight_2 = transit.flights[1]?.flight_number?.slice(2);
                        this.form.routing_information.date_2 = this.formatDate(transit.flights[1].date);
                    }
                    if (transit.flights[2]) {
                        this.form.routing_information.by_3 = transit.flights[2]?.flight_number?.slice(0, 2);
                        this.form.routing_information.flight_3 = transit.flights[2]?.flight_number?.slice(2);
                        this.form.routing_information.date_3 = this.formatDate(transit.flights[2].date);
                    }
                }
            }
            

            // Shipper details
            this.showShipper=true;
            var shipper=response.shipper;
            if (shipper) {
                const matchedShipper = this.findMatchingAddress(shipper, this.shippers);
                if (matchedShipper) {
                    this.selectShipper(matchedShipper);
                } else {
                    this.form.shipper_address.ship_name = shipper.name.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
                    this.form.shipper_address.ship_address = shipper.address.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30).trim();
                    this.form.shipper_address.ship_city=shipper.city;
                    this.form.shipper_address.ship_post_code=shipper.pin;
                    this.form.shipper_address.ship_state=shipper.state;
                    if(shipper.country){
                        this.form.shipper_address.ship_country=this.countryCodeByName(shipper.country);
                    }
                    this.form.shipper_address.ship_phone=shipper.phone;
                    this.form.shipper_address.ship_fax=shipper.email;
                }
            }
            
            // Consignee details
            this.showConsignee=true;
            var consignee=response.consignee; 
            if (consignee) {
                const matchedConsignee = this.findMatchingAddress(consignee, this.consignees);
                if (matchedConsignee) {
                    this.selectConsignee(matchedConsignee);
                } else {
                    this.form.consignee_address.cons_name = consignee.name.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
                    this.form.consignee_address.cons_name_2=consignee.eori;
                    this.form.consignee_address.cons_address = consignee.address.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30).trim();
                    this.form.consignee_address.cons_city=consignee.city;
                    this.form.consignee_address.cons_post_code=consignee.pin;
                    this.form.consignee_address.cons_state=consignee.state;
                    if(consignee.country){
                        this.form.consignee_address.cons_country=this.countryCodeByName(consignee.country);
                    }
                    this.form.consignee_address.cons_phone=consignee.phone;
                    this.form.consignee_address.cons_fax=consignee.email;
                    if(consignee.eori){
                        this.oci_info.supplementary_info=consignee.eori;
                        this.oci_info.custom_info_identifier="CNE";
                    }
                }
            }

            // Consignment Info
            let cargo_data=response.cargo;
            let piece_weight=response.piece_weight;
            let weight_charge=response.weight_charge;
            
            if (piece_weight) {
                // Safely slice the rate class — fall back to '' so the select shows "Select a Rate Class"
                let rate_class = piece_weight.rate_class
                    ? (piece_weight.rate_class.length > 2 ? piece_weight.rate_class.slice(2) : piece_weight.rate_class)
                    : '';
                this.consignment_list.rate_class = rate_class;
                this.consignment_list.pieces = piece_weight.no_of_pieces;
                this.consignment_list.rate = piece_weight.rate;
                this.consignment_list.gross_weight = piece_weight.gross_weight;
                this.consignment_list.chargable_weight = piece_weight.chargeable_weight;
            }
            
            if (cargo_data) {
                this.consignment_list.hsCodes=cargo_data.hs_codes;
                this.consignment_list.description = cargo_data.description.replace(/[&/=]/g, ' ').slice(0, 70).trim();
                if (cargo_data.dimensions) {
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
                }
            }
            this.$refs.modalConsignment.show();

            // Payment Remaining
            if (response.chrg_code) {
                this.form.payment_info.type_of_payment=response.chrg_code;
            }
        },

        inputLimit(event, fieldPath, maxLength) {
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

        isGeneratePdf(generateButton) {
            const errors = [];
        
            // Check first box
            if (!this.form.first_box.awb_code) errors.push('AWB Code');
            if (!this.form.first_box.awb_no) errors.push('AWB Number');
            
            // Check routing information
            if (!this.form.routing_information.departure_airport) errors.push('Departure Airport');
            if (!this.form.routing_information.destination_airport) errors.push('Destination Airport');
            if (!this.form.routing_information.from) errors.push('From Airport');
            
            // Check shipper details
            if (!this.form.shipper_address.ship_name) errors.push('Shipper Name');
            if (!this.form.shipper_address.ship_address) errors.push('Shipper Address');
            if (!this.form.shipper_address.ship_city) errors.push('Shipper City');
            
            // Check consignee details
            if (!this.form.consignee_address.cons_name) errors.push('Consignee Name');
            if (!this.form.consignee_address.cons_address) errors.push('Consignee Address');
            if (!this.form.consignee_address.cons_city) errors.push('Consignee City');

            // Check if there are any entries in the consignment
            if (this.form.entries.length === 0) {
            
        }

        if (errors.length > 0) {
            this.pdf_error_msg = `<br>- ${errors.join('<br>- ')}`;
            return;
        }

        // Clear error message if validation passes
        this.pdf_error_msg = '';
        this.is_generate_pdf = generateButton === 1;
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
        generateAwbPDF(pdf_generate_type) {
            this.generatePDFAfterSave = '';
            if (!this.existingData || !this.existingData.id) {
                return;
            }
            const pdfUrl = `/${pdf_generate_type}/${this.existingData.id}`;
            window.open(pdfUrl, '_blank');
        },
        handleSaveAndGeneratePDF(pdf_generate_type) {
            // onSubmit() opens the PDF on a successful save (see generatePDFAfterSave).
            this.generatePDFAfterSave = pdf_generate_type;
            this.onSubmit();
        },
        formatBackendError(msg) {
            if (!msg) return "";
            
            let cleanMsg = msg.toLowerCase();
            
            // Map technical field names to clean names
            const mapping = {
                'awb no': 'AWB Number',
                'awb code': 'AWB Prefix',
                'cons name': 'Consignee Name',
                'cons address': 'Consignee Address',
                'cons city': 'Consignee City',
                'cons country': 'Consignee Country',
                'ship name': 'Shipper Name',
                'ship address': 'Shipper Address',
                'ship city': 'Shipper City',
                'ship country': 'Shipper Country',
                'by': 'Carrier Code',
                'dept airport': 'Departure Airport',
                'flight': 'Flight Number',
                'date': 'Flight Date'
            };

            // Apply technical name replacements
            Object.keys(mapping).forEach(key => {
                if (cleanMsg.includes(key)) {
                    cleanMsg = cleanMsg.replace(key, mapping[key]);
                }
            });

            // Improve grammar and language
            cleanMsg = cleanMsg
                .replace(/^the /i, '')
                .replace(/ field is required/i, ' is missing or empty')
                .replace(/ field /i, ' ')
                .trim();

            // Capitalize first letter
            return cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
        },
        validateFormFields() {
            const requiredFields = {
                "AWB prefix": this.form.first_box.awb_code, // AWB prefix
                "AWB number": this.form.first_box.awb_no, // AWB number
                "Shipper address": this.form.shipper_address.ship_address, // Shipper address
                "Shipper city": this.form.shipper_address.ship_address, // Shipper city
                "Consignee address": this.form.consignee_address.cons_address, // Consignee address
                "Consignee city": this.form.consignee_address.cons_city, // Consignee city
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
        mouseover: function () {
            this.isOpen = true;
        },
        mouseleave: function () {
            this.isOpen = false;
        },
        converXml(awb_no){
            ApiService.get(`/user/waybill/${awb_no}`)
                .then(({ data }) => {
                });
        },
        toggleModal() {
            this.$refs["my-modal"].toggle("#toggle-btn");
        },
        handleOk(bvModalEvent) {
            bvModalEvent.preventDefault();
        },

        handleDateChange(date, field) {
            const keys = field.split('.');
            let target = this;

            for (let i = 0; i < keys.length - 1; i++) {
                target = target[keys[i]];
            }
            target[keys[keys.length - 1]] = date;
        },
        
        // for remove
        prepareFormDataForSubmission() {
            const formData = { ...this.form };
            
            // Convert display dates back to proper format for backend
            if (formData.routing_information) {
                if (formData.routing_information.date) {
                    if (typeof formData.routing_information.date === 'string' && formData.routing_information.date.length <= 10) {
                        // If it's a formatted string like "02Sept", convert it back to proper date
                        const date = new Date(formData.routing_information.date);
                        if (!isNaN(date.getTime())) {
                            formData.routing_information.date = date.toISOString().slice(0, 19).replace('T', ' ');
                        }
                    } else if (formData.routing_information.date instanceof Date) {
                        // If it's already a Date object, format it
                        formData.routing_information.date = formData.routing_information.date.toISOString().slice(0, 19).replace('T', ' ');
                    }
                }
                if (formData.routing_information.date_2) {
                    if (typeof formData.routing_information.date_2 === 'string' && formData.routing_information.date_2.length <= 10) {
                        const date = new Date(formData.routing_information.date_2);
                        if (!isNaN(date.getTime())) {
                            formData.routing_information.date_2 = date.toISOString().slice(0, 19).replace('T', ' ');
                        }
                    } else if (formData.routing_information.date_2 instanceof Date) {
                        formData.routing_information.date_2 = formData.routing_information.date_2.toISOString().slice(0, 19).replace('T', ' ');
                    }
                }
                if (formData.routing_information.date_3) {
                    if (typeof formData.routing_information.date_3 === 'string' && formData.routing_information.date_3.length <= 10) {
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
        // location
        getLocation() {
            loadLocations().then(data => {
                this.location = data;
            });
        },
        fetchAllAddressBook() {
            ApiService.get('/user/get-shippers').then(response => {
                const all = response.data;
                this.shippers = all.filter(s => s.address_type === 'shipper_address');
                this.consignees = all.filter(s => s.address_type === 'consignee_address');
                this.alsoNotify = all.filter(s => s.address_type === 'also_notify_address');
                this.filteredShippers = this.shippers;
                this.filteredConsignees = this.consignees;
                this.filteredAlsoNotify = this.alsoNotify;
            });
        },
        fillShipperDetails() {
            if (this.selectedShipper) {
                ApiService.get(`/user/get-shipper-address?id=${this.selectedShipper}`)
                .then( response => {
                    this.form.shipper_address = response.data; 
                })
                .catch(error => {
                });
            } else {
                this.form.shipper_address = {
                ship_name: '',
                ship_name_2: '',
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
                })
                .catch(error => {
                });
            } else {
                this.form.consignee_address = {
                cons_name: '',
                cons_name_2: '',
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
                })
                .catch(error => {
                });
            } else {
                this.form.also_notify_address = {
                also_name: '',
                also_name_2: '',
                also_account: '',
                also_address: '',
                also_city: '',
                };
            }
        },

        onSubmit() {
            this.main_error_msg='';
            $('.submit-button').css({'pointer-events':'none','opacity': '0.5'});
            // Prepare form data for submission - convert display dates to proper format
            
            if (this.mode === 'add') {
                // Update the existing form with prepared data
                this.from= { ...this.form };
                this.form.post(`/user/create-focusair`)
                .then(response => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
                        this.existingData = response.data.data.first_box.original.data;
                        if (this.generatePDFAfterSave && this.existingData && this.existingData.id) {
                            this.generateAwbPDF(this.generatePDFAfterSave);
                        }
                        this.successMessage = '-e-AWB Saved in database -Pass';
                    } else {}
                })
                .catch(error => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    var main_error_msg='';
                    if (error.response) {
                        if (error.response.status === 422) {
                            const errors=error.response.data.errors
                            for (const field in errors) {
                                main_error_msg+=`${this.formatBackendError(errors[field][0])}<br>`;
                            }
                        }
                    }
                    this.main_error_msg=main_error_msg;
                });
            } else if (this.mode === 'update') {
                if (!this.existingData || !this.existingData.id) {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    return;
                }
                // Update the existing form with prepared data
                this.from= { ...this.form };
                this.form.put(`/user/update-airway-bill/${this.existingData.id}`)
                .then(response => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
                        this.existingData = response.data.data.first_box.original.data;
                        if (this.generatePDFAfterSave && this.existingData && this.existingData.id) {
                            this.generateAwbPDF(this.generatePDFAfterSave);
                        }
                        this.successMessage = '-e-AWB Saved in database -Pass';
                    } else {}
                })
                .catch(error => {
                    $('.submit-button').css({'pointer-events':'auto','opacity': '1'});
                    var main_error_msg='';
                    if (error.response) {
                        if (error.response.status === 422) {
                            const errors=error.response.data.errors
                            for (const field in errors) {
                                main_error_msg+=`${this.formatBackendError(errors[field][0])}<br>`;
                            }
                        }
                    }
                    this.main_error_msg=main_error_msg;
                });
            }
        },
        onSelect(value) {
            if (value) {
                window.location.href = value;
            }
        },
        getAirwayBills(status) {
            this.isFetching = true;
            this.data_items = []; // Clear stale data before fetch
            // Open the correct modal immediately — spinner shows while loading
            const modalId = status === 'draft' ? 'modal-draft-air' : 'modal-s-air';
            this.$bvModal.show(modalId);
            ApiService.get(`/user/get-airway-bills/${status}`)
                .then(response => {
                    this.data_items = response.data;
                })
                .catch(error => {
                })
                .finally(() => {
                    this.isFetching = false;
                });
        },
        getAirWayBill(id) { 
            ApiService.get(`/user/airway-bill/${id}`)
                .then(response => {
                    if (response.data && response.data.id == id) {
                        this.existingData = response.data;
                        this.existingData.payment_info = {
                            ...this.defaultPaymentInfo,
                            ...(this.existingData.payment_info || {})
                        };
                        this.showAWBSection = true;
                        this.awbError = null;
                        this.openForm('update', this.existingData.id);
                        if (this.existingData && this.existingData.consignment_data) {
                            this.isConsignmentAdded = true;
                        }
                    } else {
                        this.showAWBSection = false; // Hide if no data exists
                        this.awbError = "No data found for this AWB ID.";
                    }
                })
                .catch(error => {
                    this.existingData = null;
                    this.showAWBSection = false;
                    this.awbError = "No data found for this AWB ID.";
                    this.awbDetails = false;
                });
        },
        getAirWayBillForRealod(id){
            ApiService.get(`/user/airway-bill/${id}`).then((response) => {
                const fetchedId = response.data?.id?.toString();
                const inputId = id.toString();
                if (fetchedId === inputId) {
                    this.existingData = response.data;
                    this.showAWBSection = true;
                    this.awbError = null;
                } else {
                    this.existingData = null;
                    this.showAWBSection = false;
                    this.awbError = "No data found for this AWB ID.";
                }
            })
            .catch((error) => {
                this.showAWBSection = false;
                this.awbError = error.response?.status === 404
                    ? "Air Waybill not found."
                    : "";
            });
        },
        openForm(mode, id = null) {
            this.mode = mode;
            this.showAWBSection = false;
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

                    const specialHandlingCodes = Array.isArray(this.form.tableCodes) ? this.form.tableCodes : [];

                    if (specialHandlingCodes.includes("EAW")) {
                        this.selectedCode = "EAW";
                        this.form.first_box.awb = false;
                    } else if (specialHandlingCodes.includes("EAP")) {
                        this.selectedCode = "EAP";
                        this.form.first_box.awb = false;
                    } else if (this.form.first_box.awb === true) {
                        this.selectedCode = "";
                    }

                    this.form.oci_entries = Array.isArray(this.existingData.other_custom_information) ? this.existingData.other_custom_information : [];
                    
                    this.form.payment_info = {
                        ...this.defaultPaymentInfo,
                        ...(this.existingData.payment_info || {})
                    };
                    this.form.charges = Array.isArray(this.existingData.other_charge)
                    ? this.existingData.other_charge
                    : [];
                    const entry = this.existingData.consignment_data;
                    if (entry) {
                        const parsedEntry = {
                            ...entry,
                            hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
                            itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
                            uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : [],
                        };
                        this.form.entries = [parsedEntry];
                    } else {
                        this.form.entries = []; // Default to an empty array if no data exists
                    }
                    if(!this.form.entries){
                        this.isConsignmentAdded = true;
                    }
                    this.form.consignee_address = this.existingData.way_bill_address;
                    this.form.shipper_address = this.existingData.way_bill_address;
                    this.form.also_notify_address = this.existingData.way_bill_address;
                    this.form.awb_email=this.existingData.awb_email;
                } else {
                }
        },
        handleEditNavigation(id) {
            this.$bvModal.hide('modal-s-air');
            const targetPath = `/edit-airway-bill/${String(id)}`;
            if (this.$route.path !== targetPath) {
                this.$router.push(targetPath).then(() => {
                    window.location.reload();
                });
            } else {
                window.location.reload();
            }
        },
        getAgent(company_id,branch_id){
            ApiService.get(`/user/agent-info`)
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
                });
        },
        getCountry(){
            ApiService.get('/user/get-country').then(({ data }) => {
                this.countries = Object.keys(data).map(key => ({
                    value: key,
                    text: data[key]
                }));
            }).catch(error => {
            });
        },
        getOtherChargesCode(){
            ApiService.get('/user/other-charges').then(({ data }) => {
                this.other_charges_code = Object.keys(data).map(key => ({
                    value: key,
                    text: data[key]
                }));
            }).catch(error => {
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
                this.oci_data.oci_custom_info_identifier = []; 
            });
        },
        handleRadioChange(value) {
            

            if (!Array.isArray(this.form.tableCodes)) {
                this.form.tableCodes = [];
            }

            if (value === true) {
                this.selectedCode = "";
                this.form.tableCodes = this.form.tableCodes.filter(code => code !== "EAW" && code !== "EAP");
                this.form.first_box.awb = true;
            } else {
                this.form.tableCodes = this.form.tableCodes.filter(code => code !== "EAW" && code !== "EAP");
                if (value) {
                    this.form.tableCodes.push(value);
                }
                this.form.first_box.awb = false;
            }
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
            } else {
                alert('Please select or enter a code.');
            }

            this.selectedCode = '';
            this.custom_special_handling_code = '';
        },
        deleteSplCode(index) {
            this.form.tableCodes.splice(index, 1);
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
            const { awb_code, awb_no } = this.form.first_box;
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
            if (awb_code && awb_no) {
                this.awbId = `${String(awb_code)}${String(awb_no)}`;
                this.getAirWayBillForRealod(this.awbId);
                this.$router.push({ query: { awb_code: String(awb_code), awb_no: String(awb_no) } });
            } else{
                this.awbId = null;
                return;
            }
        }, 500),
        confirmReload() {
            const confirmed = window.confirm(
            `Are you sure you want to reload the content for AWB: ${this.awbId}?`
            );
            if (confirmed) { 
                this.awbDetails = false;
                this.showAWBSection = false;
                this.$router.go(0);
                this.getAirWayBill(this.awbId);
            }
        },
        reloadPageWithContent() {
            const awbId = this.awbId;
            if (!awbId) {
                return;
            }
               ApiService.get(`/user/airway-bill/${awbId}`)
                .then(response => {
                    this.existingData = response.data;
                    if (this.existingData) {
                        this.awbDetails = false;
                        this.openForm('update', this.existingData.id);
                    }else{
                        this.awbDetails = false;
                    }
                })
                .catch(error => {
                    this.existingData = null;
                    this.awbDetails = false;
                });
        },

    },
    mounted(){
        this.calculateTotalVolume();
        this.getLocation(); 
        this.fetchAllAddressBook();
        this.fillShipperDetails();
        this.fillConsigneeDetails();
        this.fillAlsoNotifyDetails();
        this.getCountry();
        this.getOtherChargesCode();
        this.getOCIData();
        const { awbId, awbError, existingData } = this.$route.query;
        if (awbId) {
            this.awbId = awbId;
        }
        if (awbError) {
            this.awbError = awbError;
        }
        if (existingData) {
            this.existingData = JSON.parse(existingData);
        }
        if (!this.awbId) {
            const { awb_code, awb_no } = this.$route.query;
            if (awb_code && awb_no) {
                this.awbId = `${String(awb_code)}${String(awb_no)}`;
                this.getAirWayBill(this.awbId);
                this.showAWBSection = false;
            }
        }
        if(this.current_user)
        this.getAgent(this.current_user.company_name,this.current_user.branch_name);
    },
    watch: {
        'form.awb_email'(val) {
            const savedEmail = localStorage.getItem('fna_default_email');
            this.use_my_email = !!(savedEmail && val === savedEmail);
        },
        '$route.params.id'(newId) {
            if (newId) {
                this.getAirWayBill(newId);
            }
        },
    },
    created() {
        const id = this.$route.params.id;
        if (id) {
            this.isEdit = true;
            this.getAirWayBill(id);
        }
        this.getOCIData();
        this.onSubmit = this.onSubmit.bind(this);
    },
    computed: {
        ...mapGetters({ current_user: "currentUser"}),

        submitButtonText() {
            return this.mode === 'add' ? 'Add Draft' : 'Update Draft';
        },
        formattedAWBId() {
            if (this.awbId && this.awbId.length > 3) {
                return `${this.awbId.slice(0, 3)}-${this.awbId.slice(3)}`;
            }
            return this.awbId;
        }
    },

    components: {
        DashboardHistoryModal,
        OcrUploadModal,
        Datepicker,
        DatePicker,
        AddressBlock,

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
    border: 2px dashed #CBD5E1;
    border-radius: 16px;
    padding: 60px 40px;
    text-align: center;
    background-color: #ffffff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.upload-box:hover {
    border-color: #355594;
    background-color: #F8FAFC;
    box-shadow: 0 10px 25px rgba(53, 85, 148, 0.05);
}

.upload-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #F0F7FF 0%, #E6F0FF 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-icon svg {
    width: 32px;
    height: 32px;
    color: #355594;
}

.upload-text {
    color: #1E293B;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
}

.upload-divider {
    color: #64748B;
    font-size: 14px;
    margin: 12px 0;
}

.upload-link {
    color: #355594;
    font-size: 14px;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
}

.upload-link:hover {
    color: #28447a;
    text-decoration: underline;
}

#fileInput {
    display: none;
}
/* end of file upload css */
header {
    width: 100%;
    background-color: #355594;
}

.h-color {
    color: #355594;
    font-family: 'Inter', sans-serif;
    font-weight: 800 !important;
    font-size: 18px !important;
    letter-spacing: -0.2px;
}

.h_background_color {
    background-color: #355594;
    color: white;
}

#nav {
    display: flex;
    width: 100%;
    max-width: 1280px;
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
    width: 150px;
    border-bottom: 1px solid #fff;
}

.dropdown li a {
    display: block;
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

.show-btn {
  background: white !important;
  color: #355594 !important;
  border: 1px solid #E6F0FF !important;
  border-radius: 50px !important;
  padding: 10px 22px !important;
  font-weight: 600 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
}

.show-btn:hover {
  background: #f0f7ff !important;
  border-color: #355594 !important;
  color: #355594 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 12px rgba(53, 85, 148, 0.1) !important;
}

.custom-btn:hover {
    background-color: #355594 !important;
    color: white !important;
}

.form-group {
    margin-bottom: 0px !important;
}

.shipper-toggle-label {
    width: 80px;
    display: inline-block;
    text-align: end;
    white-space: nowrap;
}
.routing-info-label {
    width: 150px;
    display: inline-block;
    text-align: end;
}
.form-row {
    flex-wrap: nowrap !important;
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
    border: 0;
    border-top: 1px solid rgba(53, 85, 148, 0.12);
    margin: 2rem 0;
}

.aselect {
    position: relative;
    width: 200px;
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


.table {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 1px solid rgba(53, 85, 148, 0.08) !important;
    box-shadow: 0 4px 12px rgba(53, 85, 148, 0.02) !important;
    background: #FFFFFF !important;
    max-width: 100%;
}

.table th {
    background-color: #F8FAFC !important;
    color: #355594 !important;
    font-weight: 700 !important;
    font-size: 13px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    padding: 12px 6px !important;
    border-bottom: 1px solid rgba(53, 85, 148, 0.1) !important;
    border-top: none !important;
}

.table td {
    padding: 8px 6px !important;
    vertical-align: middle !important;
    border-bottom: 1px solid #F1F5F9 !important;
    border-top: none !important;
    color: #475569 !important;
    font-size: 14px !important;
}

.table tr:last-child td {
    border-bottom: none !important;
}

td.editable-cell1 {
    border: 1px solid rgba(53, 85, 148, 0.2) !important;
    border-radius: 8px !important;
}

td.editable-cell {
    border: 0 !important;
}

th {
    border: 0 !important;
}

.shipper-form-control, .consignee-form-control {
    border: 1px solid #E2E8F0 !important;
    border-radius: 10px !important;
    width: 300px;
    height: 38px;
    font-family: 'Inter', sans-serif !important;
    font-weight: 500 !important;
    color: #1E293B !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    background-color: #FFFFFF !important;
}

.form-control {
    border: 1px solid #E2E8F0 !important;
    border-radius: 10px !important;
    height: 38px;
    font-family: 'Inter', sans-serif !important;
    font-weight: 500 !important;
    color: #1E293B !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    background-color: #FFFFFF !important;
}

.form-control:focus, .shipper-form-control:focus, .consignee-form-control:focus, select.form-control:focus {
    border-color: #355594 !important;
    box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.12) !important;
    outline: none !important;
    background-color: #FFFFFF !important;
}

.awb-code-input, .awb-no-input {
    text-align: center !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
}

.form-control1 {
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    width: 150px;
    height: 28px;
    font-family: 'Inter', sans-serif !important;
    font-size: 13px !important;
}
.form-control1:focus {
    border-color: #355594 !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(53, 85, 148, 0.1) !important;
}

.add-cons-btn {
    border: 1px solid #355594 !important;
    border-radius: 30px !important;
    color: #355594 !important;
    background: #fff !important;
    padding: 8px 20px !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    transition: all 0.25s ease !important;
    box-shadow: 0 2px 4px rgba(53, 85, 148, 0.05) !important;
}

.add-cons-btn:hover {
    background: #355594 !important;
    color: #fff !important;
    box-shadow: 0 4px 10px rgba(53, 85, 148, 0.15) !important;
}

.custom-link {
    display: block;
    margin-bottom: 0.5rem;
    color: #64748B;
    font-weight: 500;
    text-decoration: underline;
    transition: color 0.2s ease;
}

.custom-link:hover {
    color: #355594;
    text-decoration: underline #355594 !important;
}
.custom-link-custom {
    display: block;
    margin-bottom: 0.5rem;
    color:#355594;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
}
.custom-link-custom:hover {
    text-decoration: underline #355594 !important;
}

.column_b {
    border: 1px solid #E2E8F0;
    border-radius: 12px;
}
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-options {
    position: absolute;
    border: 1px solid rgba(53, 85, 148, 0.12);
    border-radius: 12px;
    box-shadow: 0px 10px 30px rgba(53, 85, 148, 0.08);
    background-color: #fff;
    border-top: none;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1000;
    width: 100%;
    padding: 4px;
}

.option {
    padding: 8px 12px !important;
    cursor: pointer;
    border-radius: 8px !important;
    border: 0px !important;
    font-weight: 500;
    color: #475569;
    font-size: 14px;
    transition: all 0.2s ease;
}

.option:hover {
  background-color: rgba(53, 85, 148, 0.06) !important;
  color: #355594 !important;
}

    .table-lightweight {
        width: 100% !important;
        border-collapse: separate !important;
        border-spacing: 0 !important;
        margin-top: 10px !important;
        margin-bottom: 20px !important;
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
    }
    .table-lightweight th {
        color: #8A99AD !important;
        font-weight: 500 !important;
        font-size: 11px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        padding: 8px 6px !important;
        border-bottom: 1px solid rgba(53, 85, 148, 0.08) !important;
        background: transparent !important;
    }
    .table-lightweight td {
        padding: 10px 6px !important;
        vertical-align: middle !important;
        border-bottom: 1px solid rgba(53, 85, 148, 0.05) !important;
        color: #475569 !important;
        font-size: 13px !important;
        background: transparent !important;
    }
    .table-lightweight tr:last-child td {
        border-bottom: none !important;
    }

    /* Ultra-Premium Modal Styles from Header */
    .ultra-premium-modal .modal-dialog {
        max-width: 1000px !important;
        margin: 1.75rem auto;
    }
    .ultra-premium-modal .modal-content {
        background: transparent !important;
        border: none !important;
        border-radius: 32px !important;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25) !important;
        font-family: 'Inter', sans-serif !important;
        overflow: hidden;
        animation: fadeInUp 0.4s ease;
    }
    .ultra-premium-modal .modal-body {
        padding: 0 !important;
        background: #ffffff;
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modal-split-layout { display: flex; flex-direction: row; min-height: 600px; position: relative; width: 100%; align-items: stretch; }
    .ultra-close-btn { position: absolute; top: 25px; right: 25px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.05); border: none; color: #5A6B8A; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; z-index: 50; transition: all 0.3s ease; }
    .ultra-close-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }
    .modal-left-pane { flex: 0 0 40%; padding: 4rem 3.5rem; position: relative; overflow: hidden; color: white; display: flex; flex-direction: column; background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%); }
    .login-pane { text-align: left; }
    .pane-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; }
    .pane-icon-wrapper { width: 80px; height: 80px; background: rgba(255,255,255,0.25); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: white; border: 1px solid rgba(255,255,255,0.2); }
    .pane-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.5px; line-height: 1.1; color: white !important;}
    .pane-subtitle { font-size: 1.1rem; line-height: 1.7; opacity: 0.85; color: white !important;}
    .pane-feature { display: flex; align-items: center; margin-bottom: 1rem; font-size: 1rem; font-weight: 500; color: white !important;}
    .pane-decoration { position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: 1; }
    .pane-decoration-2 { position: absolute; bottom: -150px; left: -150px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: 1; }
    .modal-right-pane { flex: 0 0 60%; background: white; position: relative; display: flex; flex-direction: column; }
    .form-scroll-container { height: 100%; overflow-y: auto; padding: 4rem; }
    .form-section-title { font-size: 1.8rem; font-weight: 700; color: #1e3a6e; letter-spacing: -0.5px; text-align: center; }
    .ultra-submit-btn { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none; }
    .ultra-submit-btn:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35); }
    .ultra-submit-btn span { color: white; font-weight: 500; margin-right: 14px; }
    .ultra-submit-btn .btn-icon { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important; }

    @media (max-width: 991px) { 
        .modal-split-layout { flex-direction: column; min-height: auto; } 
        .modal-left-pane { flex: 0 0 auto; padding: 3rem 2rem; } 
        .pane-title { font-size: 1.8rem; } 
        .pane-icon-wrapper { width: 60px; height: 60px; margin-bottom: 1.5rem !important; } 
        .modal-right-pane { flex: 0 0 auto; } 
        .form-scroll-container { padding: 3rem 2rem; height: auto; max-height: 60vh; } 
        .ultra-close-btn { top: 15px; right: 15px; background: rgba(255,255,255,0.2); color: white; } 
    }
.awb-flex-row {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
}

@media (max-width: 768px) {
.shipper-form-control, .consignee-form-control {
max-width: 100% !important;
}
.shipper-toggle-label, .routing-info-label {
width: 100% !important;
text-align: start !important;
margin-bottom: 4px;
}
.form-row {
flex-wrap: wrap !important;
}
.responsive-width-60 {
width: 100% !important;
}
.responsive-textarea {
width: 100% !important;
}
.oci-table {
max-width: 100% !important;
}

/* Broad overrides for inline/fixed width labels and divs inside form groups */
.form-group:not(.nav-dropdown-group) div[style*="width:"] {
width: 100% !important;
max-width: 100% !important;
justify-content: flex-start !important;
text-align: left !important;
margin-bottom: 4px !important;
}

/* Ensure fixed-width inputs and textareas scale to fit mobile screens */
textarea[style*="width:"],
input[style*="width:1000px"],
input[style*="width: 1000px"],
input[style*="width:400px"],
input[style*="width: 400px"] {
width: 100% !important;
max-width: 100% !important;
}

input[style*="width:"],
select[style*="width:"],
textarea[style*="width:"],
.mx-datepicker[style*="width:"] {
max-width: 100% !important;
}

.form-group:not(.nav-dropdown-group) input,
.form-group:not(.nav-dropdown-group) select,
.form-group:not(.nav-dropdown-group) textarea,
.form-group:not(.nav-dropdown-group) .custom-dropdown,
.form-group:not(.nav-dropdown-group) .mx-datepicker,
.form-group:not(.nav-dropdown-group) .form-control {
width: 100% !important;
max-width: 100% !important;
}

.form-group:not(.nav-dropdown-group) input.awb-code-input {
    width: 62px !important;
    max-width: 62px !important;
}
.form-group:not(.nav-dropdown-group) input.awb-no-input {
    width: 100px !important;
    max-width: 100% !important;
}

/* Stack horizontal form-group elements */
.form-group:not(.nav-dropdown-group) .d-flex {
    flex-direction: column !important;
    align-items: stretch !important;
}

/* Relocate sibling horizontal margins on mobile stacking */
.form-group .ml-3,
.form-group .ml-4,
.form-group .ml-lg-35 {
    margin-left: 0 !important;
    margin-top: 8px !important;
}

    .mobile-justify-start {
        justify-content: flex-start !important;
    }
    .mobile-text-left {
        text-align: left !important;
    }
    .bottom-email-section .col-form-label {
        text-align: left !important;
    }
    .bottom-email-section input {
        width: 100% !important;
    }
    .submit-button {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 10px !important;
    }
    .submit-button .show-btn,
    .submit-button div,
    .submit-button div button {
        width: 100% !important;
        margin: 0 !important;
    }
    .submit-button div {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    /* Responsive tables and custom tables constraints */
    .table-responsive {
        width: 100% !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        margin-bottom: 1rem !important;
    }
    table[style*="max-width"] {
        max-width: 100% !important;
    }
    
    /* Make modal tables stack vertically and span full-width on mobile */
    .modal-body table, 
    .modal-body tbody, 
    .modal-body tr, 
    .modal-body th, 
    .modal-body td {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    /* Prevent table-responsive tables inside modals from stacking */
    .modal-body .table-responsive table {
        display: table !important;
        width: 100% !important;
        max-width: none !important;
    }
    .modal-body .table-responsive tbody {
        display: table-row-group !important;
    }
    .modal-body .table-responsive tr {
        display: table-row !important;
    }
    .modal-body .table-responsive th,
    .modal-body .table-responsive td {
        display: table-cell !important;
        width: auto !important;
        max-width: none !important;
    }
    .modal-body td.editable-cell {
        padding: 6px 0 !important;
    }
    .modal-body textarea,
    .modal-body select,
    .modal-body input {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Horizontal scrollable tab container on mobile for a clean native bar feel */
    .custom-nav ::v-deep .nav-tabs {
        display: flex !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        border-bottom: 0px !important;
        padding-bottom: 8px !important;
    }
    .custom-nav ::v-deep .nav-item {
        flex: 0 0 auto !important;
    }
    .custom-nav ::v-deep .nav-tabs::-webkit-scrollbar {
        display: none !important;
    }
    .custom-nav ::v-deep .nav-tabs {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
    }
    
    /* Stack nested d-flex form containers inside tabs on mobile */
    .tab-content .d-flex {
        flex-direction: column !important;
        align-items: stretch !important;
    }
    .tab-content label[style*="width:"] {
        width: 100% !important;
        max-width: 100% !important;
        justify-content: flex-start !important;
        text-align: left !important;
        margin-bottom: 4px !important;
        padding-right: 0 !important;
    }
    .tab-content input[style*="width:"],
    .tab-content select[style*="width:"],
    .tab-content textarea[style*="width:"] {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Letter of Credit & select input group stacking in tabs */
    .tab-input-group {
        flex-direction: column !important;
        align-items: stretch !important;
    }
    .tab-input-group label {
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 4px !important;
        justify-content: flex-start !important;
        text-align: left !important;
    }
    .tab-input-group select {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Optimize Other Charges entry form on mobile */
    .other-charges-entry-table thead {
        display: none !important;
    }
    .other-charges-entry-table,
    .other-charges-entry-table tbody,
    .other-charges-entry-table tr,
    .other-charges-entry-table td {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    .other-charges-entry-table td {
        padding: 8px 0 !important;
        border: none !important;
    }
    .other-charges-entry-table td select,
    .other-charges-entry-table td input,
    .other-charges-entry-table td .form-group,
    .other-charges-entry-table td .form-control {
        width: 100% !important;
        max-width: 100% !important;
    }
    /* Set due and payment radio columns as inline flex/grid on mobile */
    .other-charges-entry-table td.charge-radio-cell {
        display: inline-flex !important;
        width: 50% !important;
        vertical-align: middle !important;
        padding: 8px 0 !important;
        margin: 0 !important;
    }
    .other-charges-entry-table td.charge-radio-cell .form-group {
        margin-bottom: 0 !important;
    }
    .other-charges-entry-table td.charge-btn-cell b-button,
    .other-charges-entry-table td.charge-btn-cell button,
    .other-charges-entry-table td.charge-btn-cell .show-btn {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
    }
}

/* Deep custom-nav selectors for modern pill segmented tab selector */
.custom-nav ::v-deep .nav-tabs {
    border-bottom: 0px !important;
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    gap: 4px !important;
    background: #F1F5F9 !important;
    padding: 6px !important;
    border-radius: 14px !important;
    margin-bottom: 1.5rem !important;
    width: 100% !important;
}
.custom-nav ::v-deep .nav-tabs::-webkit-scrollbar {
    display: none !important;
}
.custom-nav ::v-deep .nav-item {
    flex: 0 0 auto !important;
}
.custom-nav ::v-deep .nav-link {
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
.custom-nav ::v-deep .nav-link:hover {
    color: #355594 !important;
    background: rgba(53, 85, 148, 0.05) !important;
}
.custom-nav ::v-deep .nav-link.active {
    color: #355594 !important;
    background: #FFFFFF !important;
    box-shadow: 0 4px 12px rgba(53, 85, 148, 0.08) !important;
    border-bottom: none !important;
}
</style>
<style>
    .modal-content {
        border-radius: 20px !important;
        padding: 0rem 2rem 2rem !important;
    }
    .modal-header {
        padding: 1rem 0rem !important;
        border-bottom: 0px !important;
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
    .custom-nav-title .nav-tabs {
        border-bottom: 0px !important;
        background: transparent !important;
        padding: 0 !important;
        margin-bottom: 1.5rem;
        display: block !important;
    }
    .custom-nav-title .nav-link {
        color: #355594 !important;
        font-weight: 800 !important;
        font-size: 18px !important;
        font-family: 'Inter', sans-serif !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        cursor: default !important;
        pointer-events: none !important;
    }
    .custom-nav-title .nav-link.active {
        color: #355594 !important;
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
    }
    .mx-input {
        display: inline-block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        color: #355594 !important;
        border: 0px !important;
        background: transparent !important;
        padding: 0px !important;
        height: 38px !important;
        font-family: 'Inter', sans-serif !important;
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
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
        cursor: pointer;
        transition: transform 0.2s ease, color 0.2s ease;
    }
    .mx-icon-calendar:hover {
        color: #28447a !important;
        transform: translateY(-50%) scale(1.15);
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