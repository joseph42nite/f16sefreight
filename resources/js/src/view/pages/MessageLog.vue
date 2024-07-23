<template>
    <div class>
        <h4 class="h_background_color">Message Log</h4>
        <div>
            <b-form-group v-slot="{ ariaDescribedby }" class="ml-3">
                <b-form-radio-group id="radio-slots" v-model="selected" :options="options"
                    :aria-describedby="ariaDescribedby" name="radio-options-slots">
                </b-form-radio-group>
            </b-form-group>
        </div>
        <div>
            <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label="Message Id:"
                label-for="input-departure-airport" class="form-control-sm col-form-label" style="width: 21.5%;">
                <b-form-input id="input-departure-airport" class="form-control-sm ml-lg-5"></b-form-input>
            </b-form-group>
            <b-row>
                <b-col cols="auto">
                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label="Shipper Name:"
                        label-for="input-departure-airport" class="form-control-sm col-form-label"
                        style="width: 350px;">
                        <b-form-input id="input-departure-airport" class="form-control-sm"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="auto">
                    <b-form-group id="fieldset-horizontal" label-cols-lg="auto" label="Consignee Name:"
                        label-for="input-departure-airport" class="form-control-sm col-form-label"
                        style="width: 350px;">
                        <b-form-input id="input-departure-airport" class="form-control-sm"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="auto">
                    <label for="message-checkbox" class="ml-4">Message:</label>
                </b-col>
                <b-col cols="auto">
                    <b-form-checkbox id="message-checkbox" size="sm" class="ml-lg-3">Message Types:</b-form-checkbox>
                </b-col>
            </b-row>
            <b-row>												
                <b-form-checkbox id="message-checkbox1" size="sm" class="ml-lg-36">FWB</b-form-checkbox>
                <b-form-checkbox id="message-checkbox2" size="sm" class="ml-lg-3">FZB</b-form-checkbox>
                <b-form-checkbox id="message-checkbox3" size="sm" class="ml-lg-3">FSU</b-form-checkbox>
                <b-form-checkbox id="message-checkbox4" size="sm" class="ml-lg-3">FHL</b-form-checkbox>
                <b-form-checkbox id="message-checkbox5" size="sm" class="ml-lg-3">FFM</b-form-checkbox>
                <b-form-checkbox id="message-checkbox6" size="sm" class="ml-lg-3">FFR</b-form-checkbox>
                <b-form-checkbox id="message-checkbox7" size="sm" class="ml-lg-3">FBL</b-form-checkbox>
                <b-form-checkbox id="message-checkbox8" size="sm" class="ml-lg-3">FMA</b-form-checkbox>
                <b-form-checkbox id="message-checkbox18" size="sm" class="ml-lg-3">FFA</b-form-checkbox>
                <b-form-checkbox id="message-checkbox9" size="sm" class="ml-lg-3">FAD</b-form-checkbox>
                <b-form-checkbox id="message-checkbox01" size="sm" class="ml-lg-3">FYT</b-form-checkbox>
                <b-form-checkbox id="message-checkbox02" size="sm" class="ml-lg-3">CPM</b-form-checkbox>
                <b-form-checkbox id="message-checkbox03" size="sm" class="ml-lg-3">CSN</b-form-checkbox>
                <b-form-checkbox id="message-checkbox04" size="sm" class="ml-lg-3">FRP</b-form-checkbox>
                <b-form-checkbox id="message-checkbox05" size="sm" class="ml-lg-3">FNA</b-form-checkbox>
            </b-row>			
            <b-row>												
                <b-form-checkbox id="message-checkbox06" size="sm" class="ml-lg-36">MVT</b-form-checkbox>
                <b-form-checkbox id="message-checkbox07" size="sm" class="ml-lg-3">SCM</b-form-checkbox>
                <b-form-checkbox id="message-checkbox08" size="sm" class="ml-lg-3">UCM</b-form-checkbox>
                <b-form-checkbox id="message-checkbox09" size="sm" class="ml-lg-3">UWS</b-form-checkbox>
            </b-row>
        </div>
        <div> <b-row>
            <b-col>
                <label for="">Created date:</label>
            <b-form-select class="form-control-sm" style="width:220px">
                <option>Please choose a Custom Origin</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
            </b-form-select>
            <Datepicker format="yyyy-MM-dd" class="small-datepicker mb-2">
            </Datepicker>
            <Datepicker format="yyyy-MM-dd" class="small-datepicker mb-2">
            </Datepicker>
        </b-col>
        </b-row>
        </div>
    </div>
</template>

<script>

import Datepicker from 'vuejs-datepicker';
import DatePicker from 'vue2-datepicker';
export default {
    data() {
        return {
            selected: '',
            options: [
                { text: 'Created By You', value: 'second' },
                { text: 'Ceated In Your Participant Region', value: 'third' }
            ]
        }
    },
    components: {
        Datepicker,
        DatePicker
    },
}
</script>
<style scoped>
.h_background_color {
    background-color: #2637a8;
    color: white;
}
</style>