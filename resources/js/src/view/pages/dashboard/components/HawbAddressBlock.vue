<template>
    <b-col cols="auto">
        <h4 class="h-color ml-2">
            {{ title }}
        </h4>
        <div class="d-flex align-items-center pb-2">
            <b-form-group id="fieldset-horizontal"
            label-cols-lg="auto"
            :label-for="searchId"
            class="align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Name:</span>
                        <span class="text-danger">*</span>
                    </div>
                </template>
                <div class="custom-dropdown align-items-center" ref="dropdown" @click="$emit('toggle', dropdownName)">
                    <input type="text" v-model="address[prefix + '_name']" :placeholder="searchPlaceholder" :id="searchId" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_name') }]" autocomplete="off"
                    @input="$emit('filter')" @focus="$emit('toggle', dropdownName, true)" />

                    <div v-if="activeDropdown === dropdownName && filtered.length" class="dropdown-options align-items-center">
                        <div v-for="(item, index) in filtered" :key="item.id" @click.stop="$emit('select', item)" class="option">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <has-error :form="form" :field="prefix + '_name'"></has-error>
            </b-form-group>
            <b-icon icon="box-arrow-up-right" aria-hidden="true" class="ml-2" style="color:#355594;stroke:#355594;" @click="$emit('update:show', !show)"></b-icon>
        </div>
        <!-- Show all input fields here -->
        <div v-if="show">
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-name2-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>&nbsp;</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-name2-input'" class="form-control" :class="[controlClass, name2ExtraClass, { 'is-invalid': form.errors.has(prefix + '_name_2') }]" v-model="address[prefix + '_name_2']" autocomplete="off"></b-form-input>
                <has-error :form="form" :field="prefix + '_name_2'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-account-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Account:</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-account-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_account') }]" v-model="address[prefix + '_account']"></b-form-input>
                <has-error :form="form" :field="prefix + '_account'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-address-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Address:</span>
                        <span class="text-danger">*</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-address-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_address') }]" v-model="address[prefix + '_address']" @keydown="$emit('limit', $event, addressKey + '.' + prefix + '_address', 40)"></b-form-input>
                <has-error :form="form" :field="prefix + '_address'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-address-line-2-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>&nbsp;</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-address-line-2-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_address_line_2') }]" v-model="address[prefix + '_address_line_2']" @keydown="$emit('limit', $event, addressKey + '.' + prefix + '_address_line_2', 35)"></b-form-input>
                <has-error :form="form" :field="prefix + '_address_line_2'"></has-error>
            </b-form-group>

            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-city-input'" class="align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>City:</span>
                        <span class="text-danger">*</span>
                    </div>
                </template>
                <div class="d-flex align-items-center pb-2">
                    <b-form-input :id="idPrefix + '-city-input'" class="form-control" :class="[cityControlClass, { 'is-invalid': form.errors.has(prefix + '_city') }]" style="width: 240px" v-model="address[prefix + '_city']"></b-form-input>
                    <b-form-input :id="idPrefix + '-airport-input'" class="ml-3 form-control" :class="[cityControlClass, { 'is-invalid': form.errors.has(prefix + '_airport_code') }]" style="width: 50px" v-model="address[prefix + '_airport_code']"></b-form-input>
                </div>
                <div>
                    <has-error :form="form" :field="prefix + '_city'" :class="{ 'd-block': form.errors.has(prefix + '_city') }"></has-error>
                    <has-error :form="form" :field="prefix + '_airport_code'" :class="{ 'd-block': form.errors.has(prefix + '_airport_code') }"></has-error>
                </div>
            </b-form-group>

            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-postcode-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Post Code:</span>
                        <span class="text-danger">*</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-postcode-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_post_code') }]" style="width:200px;" v-model="address[prefix + '_post_code']"></b-form-input>
                <has-error :form="form" :field="prefix + '_post_code'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-state-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>State:</span>
                        <span class="text-danger">*</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-state-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_state') }]" style="width:200px;" v-model="address[prefix + '_state']"></b-form-input>
                <has-error :form="form" :field="prefix + '_state'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-country-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Country:</span>
                        <span class="text-danger">*</span>
                    </div>
                </template>
                <b-form-select :id="idPrefix + '-country-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_country') }]" v-model="address[prefix + '_country']">
                    <option disabled value=""> Please select one</option>
                    <option v-for="country in countries" :key="country.value" :value="country.value">
                        {{ country.text }}
                    </option>
                </b-form-select>
                <has-error :form="form" :field="prefix + '_country'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-phone-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Phone:</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-phone-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_phone') }]" style="width:200px;" v-model="address[prefix + '_phone']"></b-form-input>
                <has-error :form="form" :field="prefix + '_phone'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-fax-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Fax:</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-fax-input'" class="form-control" :class="[controlClass, { 'is-invalid': form.errors.has(prefix + '_fax') }]" style="width:200px;" v-model="address[prefix + '_fax']"></b-form-input>
                <has-error :form="form" :field="prefix + '_fax'"></has-error>
            </b-form-group>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" content-cols-sm content-cols-lg="auto" :label-for="idPrefix + '-telex-input'" class="pb-2 align-items-center">
                <template #label>
                    <div class="shipper-toggle-label">
                        <span>Telex:</span>
                    </div>
                </template>
                <b-form-input :id="idPrefix + '-telex-input'" class="form-control" :class="controlClass" style="width:200px;" v-model="address[prefix + '_telex']"></b-form-input>
            </b-form-group>
            <b-form-checkbox size="sm" class="" style="margin-left: 110px;" :checked="saveChecked" @change="$emit('update:saveChecked', $event)">Save new address to address book</b-form-checkbox>
        </div>
    </b-col>
</template>

<script>
// Shared shipper/consignee address block for HouseWayBill.vue (Phase 4 dedup).
// Same design as FocusAir's AddressBlock but with HWB's own markup (all
// required marks use text-danger, "Post Code:" label, ids derived from a prefix,
// symmetric airport field bound to `${prefix}_airport_code`). Presentational
// only: state + methods live on the parent (airWayBillMixin); wired via props +
// events. Every shipper-vs-consignee difference is a prop so output stays
// identical to the original inline markup — EXCEPT both country dropdowns now
// share the same `disabled value=""` placeholder (previously the consignee one
// used `value="Please select one"`, which could write that literal string into
// cons_country; unified per request).
export default {
    name: "HawbAddressBlock",
    props: {
        title: { type: String, required: true },            // "Shipper" / "Consignee"
        dropdownName: { type: String, required: true },      // "shipper" / "consignee"
        prefix: { type: String, required: true },            // "ship" / "cons"
        idPrefix: { type: String, required: true },          // id namespace, e.g. "shipper" / "cons"
        addressKey: { type: String, required: true },        // "shipper_address" / "consignee_address"
        controlClass: { type: String, required: true },      // "shipper-form-control" / "consignee-form-control"
        cityControlClass: { type: String, default: "" },     // "" for shipper, "consignee-form-control" for consignee
        name2ExtraClass: { type: String, default: "" },      // "ship_name_2" for shipper, "" for consignee
        searchId: { type: String, required: true },          // id of the search input (also the name group's label-for)
        searchPlaceholder: { type: String, required: true }, // "Search shipper" / "Search consignee"
        form: { type: Object, required: true },
        address: { type: Object, required: true },           // form.shipper_address / form.consignee_address
        countries: { type: Array, default: () => [] },
        activeDropdown: { type: String, default: null },
        filtered: { type: Array, default: () => [] },
        show: { type: Boolean, default: false },
        saveChecked: { type: Boolean, default: false },
    },
    mounted() {
        // Hand our dropdown's DOM node to the parent so the shared mixin's
        // closeAllDropdowns() keeps finding it (see registerDropdownRef).
        this.$emit("register-ref", this.dropdownName, this.$refs.dropdown);
    },
};
</script>
