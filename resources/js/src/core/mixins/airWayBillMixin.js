import ApiService from "@/core/services/api.service";
import { noticesFor } from "@/core/services/airlineNotice";
import { loadLocations } from "@/core/services/location.cache";
import { branchDetailsOn, changedBranchDetails, branchDetailsQuestion } from "@/core/services/branchDetails";

export default {
    data() {
        return {
            // The platform's notices, and the airline the waybill number's prefix belongs to.
            airlineNotices: [],
            // The branch's details as the server gave them, to tell on Send whether a box was changed (FW15).
            branchDetailsLoaded: null,
            branchDetailsSettled: false,
            awb_airline_code: '',
            validationErrors: [],
            hs_code_error: [],
            uld_error: [],
            oci_info: {
                country_code: '',
                info_identifier: '',
                custom_info_identifier: '',
                supplementary_info: '',
            },
            // One per list (frontend audit, FW12): shared, an edit begun on the customs lines was finished by adding a
            // charge, which overwrote a charge row.
            editIndex: null,
            ociEditIndex: null,
            isConsignmentAdded: false,
            showSpinner: false,
            successMessage: '',
            charCount: 0,
            lineCount: 0,
            edit_entry_index: null,
            other_charges: {
                other_charge_code: '',
                other_code: '',
                amount: '',
                due: "C",
                payment_type: "P",
                charge: '',
                chargable_weight1: '',
            },
            consignment_list: new Form({
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
                uld_type: '',
                uld_serial: '',
                owner: '',
                itemss: [],
                hsCodes: [],
                uld_infos: [],
            }),
            activeDropdown: null,
        };
    },
    computed: {
        /**
         * What F16s staff want said about this waybill's airline. The airline is the one the number's prefix
         * names; until that is known, the carrier of the first flight.
         */
        airlineNotice() {
            const routing = this.form.routing_information || {};

            return noticesFor(this.airlineNotices, this.awb_airline_code || routing.by);
        },
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
            return this.form.totals.total_amount;
        },
        remainingPieces() {
            const totalAddedPieces = this.consignment_list.itemss.reduce((sum, item) => sum + parseInt(item.pcs || 0), 0);
            return this.consignment_list.pieces - totalAddedPieces;
        },
    },
    watch: {
        // Replaced whole when the branch's details arrive (getAgent); typing in a box does not come through here.
        agent_information(details) {
            this.branchDetailsLoaded = branchDetailsOn(details, this.iata_cass);
        },
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
        "form.shipper_address.ship_name"(newVal) {
            if (!newVal) {
                // Only the pick is dropped (frontend audit, FW11). The whole address object used to be replaced, so
                // backspacing a name wiped the address, city, country and phone typed under it.
                this.selectedShipper = null;
                this.filteredShippers = this.shippers;
            }
        },
        "form.consignee_address.cons_name"(newVal) {
            if (!newVal) {
                // Only the pick is dropped (frontend audit, FW11). The whole address object used to be replaced, so
                // backspacing a name wiped the address, city, country and phone typed under it.
                this.selectedConsignee = null;
                this.filteredConsignees = this.consignees;
            }
        },
        "form.also_notify_address.also_name"(newVal) {
            if (!newVal) {
                // Only the pick is dropped (frontend audit, FW11). The whole address object used to be replaced, so
                // backspacing a name wiped the address, city, country and phone typed under it.
                this.selectAlsoNotify = null;
                this.filteredAlsoNotify = this.alsoNotify;
            }
        },
    },
    mounted() {
        // A notice is extra: the form works without it, so a failure here is not shown.
        ApiService.get(`/user/get-notice`)
            .then(({ data }) => { this.airlineNotices = Array.isArray(data) ? data : []; })
            .catch(() => {});
        window.addEventListener('click', this.closeAllDropdowns);
    },
    beforeDestroy() {
        window.removeEventListener('click', this.closeAllDropdowns);
    },
    methods: {
        /**
         * Enter in a text box does not submit the waybill (frontend audit 2026-11-15, FW2). The browser "clicks" the
         * form's first submit button on Enter, and that button is Send: a stray Enter transmitted to the airline.
         * Only plain inputs are stopped; Enter still works on buttons and makes a new line in a text area.
         */
        noEnterSubmit(event) {
            if (event.target && event.target.tagName === "INPUT") {
                event.preventDefault();
            }
        },
        /**
         * A flight number read from a document, as the two boxes the form has (frontend audit, FW8).
         *
         * It used to be cut after two characters whatever it was, so "UAE501" was saved as carrier "UA" — another
         * airline — flight "E501". The carrier box takes the two-character code only, so a three-letter prefix
         * leaves it EMPTY for the operator to fill: a blank the form refuses, not a wrong airline it accepts.
         */
        splitFlight(number) {
            const text = String(number || "").replace(/\s+/g, "").toUpperCase();
            const threeLetter = text.match(/^([A-Z]{3})(\d.*)$/);

            if (threeLetter) return { carrier: "", flight: threeLetter[2] };

            return { carrier: text.slice(0, 2), flight: text.slice(2) };
        },
        getCurrentDate() {
            return new Date().toLocaleDateString("en-CA");
        },
        formatDate(date) {
            if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date.trim())) {
                const [day, month, year] = date.trim().split("/");
                return `${year}-${month}-${day}`;
            }
            return new Date(date).toLocaleDateString("en-CA");
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
        closeModal() {
            this.$refs.modalConsignment.hide();
        },
        handleModalClose() {
            this.isConsignmentAdded = this.form.entries.length > 0;
        },
        addUldInfo() {
            this.uld_error = [];
            const { uld_type, uld_serial, owner } = this.consignment_list;
            const regex = {
                uldType: /^[a-zA-Z][A-Za-z0-9]{2}$/,
                uldSerial: /^[A-Za-z0-9]\d{3,4}$/,
                owner: /^[a-zA-Z0-9]{2}$/
            };
            if (!uld_type) this.uld_error.push("ULD Type is required.");
            else if (!regex.uldType.test(uld_type)) this.uld_error.push("ULD Type must be 3 characters: 1 alphabetic and 2 alphanumeric.");

            if (!uld_serial) this.uld_error.push("ULD Serial is required.");
            else if (!regex.uldSerial.test(uld_serial)) this.uld_error.push("ULD Serial must be in the format 'mnnn(n)' where 'm' is an alpha character and 'n' is a digit.");

            if (!owner) this.uld_error.push("Owner is required.");
            else if (!regex.owner.test(owner)) this.uld_error.push("Owner must be exactly 2 characters long and can only contain letters and digits.");
            
            if (this.uld_error.length > 0) {
                return;
            }
            this.consignment_list.uld_infos.push({ uld_type, uld_serial, owner });
            this.consignment_list.uld_type = this.consignment_list.uld_serial = this.consignment_list.owner = "";
        },
        deleteUldInfo(index) {
            if (this.consignment_list.uld_infos && this.consignment_list.uld_infos.length > index) {
                this.consignment_list.uld_infos.splice(index, 1);
            }
        },
        editOciInfo(index) {
            this.ociEditIndex = index;
            this.oci_info = { ...this.form.oci_entries[index] };
        },
        addOtherCustomInfo() {
            if (!this.oci_info.info_identifier || !this.oci_info.supplementary_info) {
                alert('Please fill in all fields');
                return;
            }
            if (this.ociEditIndex !== null) {
                this.$set(this.form.oci_entries, this.ociEditIndex, { ...this.oci_info });
                this.ociEditIndex = null;
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
        addPcsInfo() {
            this.validationErrors = [];
            const rules = {
                pcs: { type: 'numeric', message: "PCS must be a valid number." },
                wgt: { type: 'numeric', min: 0.1, max: 9999999, message: "Weight must be between 0.1 and 9999999." },
                length: { type: 'regex', regex: /^[0-9]+$/, maxLength: 5, message: "Length must be a numeric value with a maximum of 5 digits." },
                width: { type: 'regex', regex: /^[0-9]+$/, maxLength: 5, message: "Width must be a numeric value with a maximum of 5 digits." },
                height: { type: 'regex', regex: /^[0-9]+$/, maxLength: 5, message: "Height must be a numeric value with a maximum of 5 digits." },
            };
            let { pcs, wgt, length, width, height, unit } = this.consignment_list;
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
        getOriginCode(airportString) {
            if (airportString) {
                return airportString.split(',')[0];
            }
            return '';
        },
        getDestinationCode(airportString) {
            return this.getOriginCode(airportString);
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
            const { other_charge_code, other_code, amount, due, payment_type } = this.other_charges;
            const finalOtherChargeCode = other_code || other_charge_code;
            if (!finalOtherChargeCode) {
                alert("Other charge code is mandatory.");
                return;
            }
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                alert("Amount is mandatory and must be a valid number greater than 0.");
                return;
            }
            const chargeData = {
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
        },
        removeCharge(index) {
            this.form.charges.splice(index, 1);
        },
        editEntry(index) {
            this.edit_entry_index = index;
            let consignment_data = this.form.entries[index];
            this.consignment_list.pieces = consignment_data.pieces;
            this.consignment_list.description = consignment_data.description;
            this.consignment_list.rate_class = consignment_data.rate_class;
            this.consignment_list.uld_rate_class = consignment_data.uld_rate_class;
            this.consignment_list.service_code = consignment_data.service_code;
            this.consignment_list.commodity_item = consignment_data.commodity_item;
            this.consignment_list.country_origin_goods = consignment_data.country_origin_goods;
            this.consignment_list.slac = consignment_data.slac;
            this.consignment_list.gross_weight = consignment_data.gross_weight;
            this.consignment_list.weight_code = consignment_data.weight_code;
            this.consignment_list.chargable_weight = consignment_data.chargable_weight;
            this.consignment_list.rate = consignment_data.rate;
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
            this.validationErrors = [];
            if (this.consignment_list.itemss.length <= 0) {
                this.validationErrors.push('Add at least 1 entry');
                return;
            }
            if (!(this.consignment_list instanceof Form)) {
                this.consignment_list = new Form(this.consignment_list);
            }
            const url = this.consignmentUrl || '/user/get-consignment-error';
            this.consignment_list.post(url)
            .then(response => {
                const updatedEntry = { 
                    ...this.consignment_list,
                    uld_info: JSON.stringify(this.consignment_list.uld_infos),
                    pieces_info: JSON.stringify(this.consignment_list.itemss),
                    hs_code: JSON.stringify(this.consignment_list.hsCodes)
                };
                if (this.edit_entry_index !== null) {
                    this.$set(this.form.entries, this.edit_entry_index, updatedEntry);
                    this.edit_entry_index = null;
                } else {
                    this.form.entries.push(updatedEntry);
                }
                this.calculateTotalVolume();
                this.calculateTotalAmount();
                this.isConsignmentAdded = this.form.entries.length > 0;
                this.closeModal();
                for (let key in this.consignment_list) {
                    if (key !== 'busy' && key !== 'successful' && key !== 'errors' && key !== 'originalData') {
                        if (typeof this.consignment_list[key] === 'object') {
                            this.consignment_list[key] = [];
                        } else {
                            this.consignment_list[key] = '';
                        }
                    }
                }
                // The units go back to their defaults, not to nothing (frontend audit, FW13): the next row was stored
                // with no unit, and the message's `?? 'CMT'` fallback does not catch an empty string.
                this.consignment_list.weight_code = 'KGM';
                this.consignment_list.unit = 'CMT';
                this.isConsignmentAdded = this.form.entries.length > 0;
            })
            .catch(error => {
                // handle error
            });
        },
        calculateTotalVolume() {
            let totalVolume = this.form.entries.reduce((total, entry) => {
                return total + entry.itemss.reduce((entryTotal, item) => {
                    let length = parseFloat(item.length) || 0;
                    let width = parseFloat(item.width) || 0;
                    let height = parseFloat(item.height) || 0;
                    let pcs = parseFloat(item.pcs) || 0;
                    let dimensionUnit = item.unit;
                    let volumeInCMT = (length * width * height * pcs) / 1_000_000;
                    let volumeInCM3, volumeInFt3, volumeInIn3, volumeInM3;
                    if (dimensionUnit === 'CMT') {
                        volumeInCM3 = volumeInCMT * 1_000_000;
                        volumeInFt3 = volumeInCMT * 35.3147;
                        volumeInIn3 = volumeInCMT * 61_023.7441;
                    } else if (dimensionUnit === 'INH') {
                        let volumeInInch = length * width * height * pcs;
                        volumeInIn3 = volumeInInch;
                        volumeInCM3 = volumeInInch * 16.387;
                        volumeInFt3 = volumeInInch * 0.0005787037;
                        volumeInM3 = volumeInInch * 0.000016387064;
                    } else if (dimensionUnit === 'FOT') {
                        let volumeInFoot = length * width * height * pcs;
                        volumeInFt3 = volumeInFoot;
                        volumeInCM3 = volumeInFoot * 28_316.8466;
                        volumeInM3 = volumeInFoot * 0.0283168466;
                        volumeInIn3 = volumeInFoot * 1_728;
                    }
                    let selectedUnit = this.form.totals.dimention_unit;
                    let finalVolume = 0;
                    switch (selectedUnit) {
                        case 'CMQ':
                            finalVolume = volumeInCM3;
                            break;
                        case 'MTQ':
                            finalVolume = volumeInM3 || volumeInCMT;
                            break;
                        case 'FTQ':
                            finalVolume = volumeInFt3;
                            break;
                        case 'INQ':
                            finalVolume = volumeInIn3;
                            break;
                        default:
                            finalVolume = volumeInCM3;
                    }
                    return entryTotal + finalVolume;
                }, 0);
            }, 0);
            this.form.totals.total_volume = totalVolume.toFixed(2);
        },
        calculateTotalAmount() {
            const chargeableWeight = this.consignment_list.chargable_weight;
            const { rate_class } = this.consignment_list;
            this.form.totals.total_amount = 0;
            if (rate_class === "B" || rate_class === "M") {
                this.form.totals.total_amount = parseFloat(this.consignment_list.rate) || 0;
            } else if (rate_class === "P" || rate_class === "X") {
                this.form.totals.total_amount = 0;
            } else {
                this.form.totals.total_amount = chargeableWeight * this.consignment_list.rate;
            }
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
        onSelect(value) {
            if (value) {
                window.location.href = value;
            }
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
        toggleDropdown(name, event) {
            if (typeof event === 'boolean') {
                if (event) {
                    this.activeDropdown = name;
                } else if (this.activeDropdown === name) {
                    this.activeDropdown = null;
                }
            } else {
                this.activeDropdown = this.activeDropdown === name ? null : name;
            }
        },
        selectLocation(name, item, parentPath) {
            const formattedVal = `${item.iata_code}, ${item.destination}`;
            if (parentPath === 'agent_information') {
                this.agent_information[name] = formattedVal;
            } else {
                this.form.routing_information[name] = formattedVal;
            }
            this.activeDropdown = null;
        },
        getFilteredLocations(query) {
            const q = (query || '').toLowerCase().trim();
            if (!q) {
                return this.location.slice(0, 20); // Limit to top 20 to avoid browser lag with 20k records
            }
            const filtered = this.location.filter(item =>
                item.iata_code.toLowerCase().includes(q) ||
                (item.destination && item.destination.toLowerCase().includes(q))
            );
            
            // Sort to prioritize IATA code matches on top
            filtered.sort((a, b) => {
                const aIata = a.iata_code.toLowerCase();
                const bIata = b.iata_code.toLowerCase();
                const aDest = (a.destination || "").toLowerCase();
                const bDest = (b.destination || "").toLowerCase();

                // 1. Exact match on IATA code
                const aExactIata = aIata === q;
                const bExactIata = bIata === q;
                if (aExactIata && !bExactIata) return -1;
                if (!aExactIata && bExactIata) return 1;

                // 2. Starts with IATA code
                const aStartsIata = aIata.startsWith(q);
                const bStartsIata = bIata.startsWith(q);
                if (aStartsIata && !bStartsIata) return -1;
                if (!aStartsIata && bStartsIata) return 1;

                // 3. Starts with destination name
                const aStartsDest = aDest.startsWith(q);
                const bStartsDest = bDest.startsWith(q);
                if (aStartsDest && !bStartsDest) return -1;
                if (!aStartsDest && bStartsDest) return 1;

                return 0; // maintain relative order
            });

            return filtered.slice(0, 20);
        },
        filterShippers() {
            const query = (this.form.shipper_address.ship_name || '').toLowerCase();
            if (!query) {
                this.filteredShippers = this.shippers;
                return this.shippers;
            }
            return this.filteredShippers = this.shippers.filter(shipper =>
                shipper.name.toLowerCase().includes(query)
            );
        },
        filterConsignee() {
            const query = (this.form.consignee_address.cons_name || '').toLowerCase();
            if (!query) {
                this.filteredConsignees = this.consignees;
                return this.consignees;
            }
            return this.filteredConsignees = this.consignees.filter(consignee =>
                consignee.name.toLowerCase().includes(query)
            );
        },
        filteralsoNotify() {
            const query = (this.form.also_notify_address.also_name || '').toLowerCase();
            if (!query) {
                this.filteredAlsoNotify = this.alsoNotify;
                return this.alsoNotify;
            }
            return this.filteredAlsoNotify = this.alsoNotify.filter(notify =>
                notify.name.toLowerCase().includes(query)
            );
        },
        closeAllDropdowns(event) {
            if (!this.activeDropdown) return;
            let refName = 'dropdownContainer_' + this.activeDropdown;
            if (this.activeDropdown === 'issuing_loc' || this.activeDropdown === 'issue') {
                refName = 'dropdownContainer_issue';
            }
            const container = this.$refs[refName];
            if (container && typeof container.contains === 'function') {
                if (!container.contains(event.target)) {
                    this.activeDropdown = null;
                }
            } else {
                this.activeDropdown = null;
            }
        },
        selectShipper(shipper) {
            if (!shipper) return;
            this.selectedShipper = shipper.id;
            this.form.shipper_address = {
                ship_name: shipper.name || '',
                ship_name_2: shipper.name_2 || '',
                ship_account: shipper.account || '',
                ship_address: shipper.address || '',
                ship_address_line_2: shipper.address_line_2 || '',
                ship_city: shipper.city || '',
                ship_airport_code: shipper.airport_code || '',
                ship_post_code: shipper.post_code || '',
                ship_state: shipper.state || '',
                ship_country: shipper.country || '',
                ship_phone: shipper.phone || '',
                ship_fax: shipper.fax || '',
                ship_telex: shipper.telex || ''
            };
            this.fillShipperDetails(shipper.id);
            this.activeDropdown = null;
        },
        selectConsignee(consignee) {
            if (!consignee) return;
            this.selectedConsignee = consignee.id;
            this.form.consignee_address = {
                cons_name: consignee.name || '',
                cons_name_2: consignee.name_2 || '',
                cons_account: consignee.account || '',
                cons_address: consignee.address || '',
                cons_address_line_2: consignee.address_line_2 || '',
                cons_city: consignee.city || '',
                cons_airport_code: consignee.airport_code || '',
                cons_post_code: consignee.post_code || '',
                cons_state: consignee.state || '',
                cons_country: consignee.country || '',
                cons_phone: consignee.phone || '',
                cons_fax: consignee.fax || '',
                cons_telex: consignee.telex || ''
            };
            this.fillConsigneeDetails(consignee.id);
            this.activeDropdown = null;
        },
        selectAlsoNotifyA(also_notify) {
            if (!also_notify) return;
            this.selectAlsoNotify = also_notify.id;
            this.form.also_notify_address = {
                also_name: also_notify.name || '',
                also_name_2: also_notify.name_2 || '',
                also_account: also_notify.account || '',
                also_address: also_notify.address || '',
                also_address_line_2: also_notify.address_line_2 || '',
                also_city: also_notify.city || '',
                also_airport_code: also_notify.airport_code || '',
                also_post_code: also_notify.post_code || '',
                also_state: also_notify.state || '',
                also_country: also_notify.country || '',
                also_phone: also_notify.phone || '',
                also_fax: also_notify.fax || '',
                also_telex: also_notify.telex || ''
            };
            this.fillAlsoNotifyDetails(also_notify.id);
            this.activeDropdown = null;
        },
        normalizeText(str) {
            if (!str) return '';
            return str.toLowerCase().replace(/[^a-z0-9]/g, '');
        },
        /**
         * Resolve a country name (e.g. from OCR) to its select `value` code.
         * Scans the full `countries` list (no hardcoded length) and returns
         * '' when there is no match.
         */
        countryCodeByName(name) {
            if (!name) return '';
            const target = String(name).toLowerCase();
            const match = (this.countries || []).find(
                c => c && c.text && c.text.toLowerCase() === target
            );
            return match ? match.value : '';
        },
        calculateSimilarity(str1, str2) {
            if (!str1 || !str2) return 0;
            const s1 = this.normalizeText(str1);
            const s2 = this.normalizeText(str2);
            if (!s1 || !s2) return 0;
            if (s1 === s2) return 1.0;
            
            const minLen = Math.min(s1.length, s2.length);
            const maxLen = Math.max(s1.length, s2.length);
            if ((s1.includes(s2) || s2.includes(s1)) && (minLen / maxLen >= 0.65)) {
                return 0.95;
            }

            const longer = s1.length >= s2.length ? s1 : s2;
            const shorter = s1.length < s2.length ? s1 : s2;
            const longerLength = longer.length;
            if (longerLength === 0) return 1.0;

            const costs = [];
            for (let i = 0; i <= s1.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= s2.length; j++) {
                    if (i === 0) {
                        costs[j] = j;
                    } else if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
                if (i > 0) costs[s2.length] = lastValue;
            }
            return (longerLength - costs[s2.length]) / parseFloat(longerLength);
        },
        findMatchingAddress(ocrEntity, savedList) {
            if (!ocrEntity || !ocrEntity.name || !savedList || !savedList.length) {
                return null;
            }

            let bestMatch = null;
            let highestScore = 0;

            for (let i = 0; i < savedList.length; i++) {
                const savedItem = savedList[i];

                // 1. Name Similarity (Target >= 90% / 0.90)
                const nameScore = this.calculateSimilarity(ocrEntity.name, savedItem.name);
                if (nameScore < 0.90) continue;

                // 2. Address Check
                let addressPass = false;
                if (!savedItem.address || !ocrEntity.address || !ocrEntity.address.trim()) {
                    addressPass = true;
                } else {
                    const normSavedAddr = this.normalizeText(savedItem.address);
                    const normOcrFull = this.normalizeText(ocrEntity.full_details || ocrEntity.address);
                    
                    if (normOcrFull && normSavedAddr && (normOcrFull.includes(normSavedAddr) || normSavedAddr.includes(normOcrFull))) {
                        addressPass = true;
                    } else {
                        const addrScore = this.calculateSimilarity(savedItem.address, ocrEntity.address);
                        if (addrScore >= 0.85) {
                            addressPass = true;
                        }
                    }
                }

                if (addressPass && nameScore > highestScore) {
                    highestScore = nameScore;
                    bestMatch = savedItem;
                }
            }

            return bestMatch;
        },
        /**
         * Before a Send (owner, 2026-11-16; frontend audit FW15): were the branch's details changed on this form?
         * Nothing is saved while typing. If a box differs, the person is asked whether to save it to the branch for
         * this and future shipments. Resolves true to go on with the send, false to stop it.
         *
         *   Save       → the branch is updated first; the send goes on only if that worked.
         *   Don't save → the boxes go back to what the branch has, which is what is sent.
         *   Closed     → nothing is sent.
         */
        settleBranchDetails() {
            const changes = changedBranchDetails(this.branchDetailsLoaded, branchDetailsOn(this.agent_information, this.iata_cass));

            if (!changes.length) return Promise.resolve(true);

            return this.$bvModal.msgBoxConfirm(branchDetailsQuestion(changes), {
                title: 'Save the branch details?',
                okTitle: 'Save for future shipments',
                cancelTitle: "Don't save",
                okVariant: 'primary',
                bodyClass: 'branch-details-question',
                centered: true,
                noCloseOnBackdrop: true,
            }).then((answer) => {
                if (answer === null) return false;

                if (answer === false) {
                    changes.forEach((c) => this.putBranchDetail(c.key, c.from));

                    return true;
                }

                const body = {};
                changes.forEach((c) => { body[c.key] = c.to === '' ? null : c.to; });

                return ApiService.put('/user/agent-info', body)
                    .then(() => {
                        this.branchDetailsLoaded = branchDetailsOn(this.agent_information, this.iata_cass);

                        return true;
                    })
                    .catch((error) => {
                        const data = error && error.response && error.response.data;
                        const first = data && data.errors && Object.values(data.errors)[0];

                        this.main_error_msg = 'The branch details were NOT saved, so nothing was sent. '
                            + ((first && first[0]) || (data && (data.error || data.message)) || 'The server could not be reached.');

                        return false;
                    });
            });
        },
        /** One branch box, wherever the form keeps it. */
        putBranchDetail(key, value) {
            if (this.iata_cass && key in this.iata_cass) this.$set(this.iata_cass, key, value || null);
            else this.$set(this.agent_information, key, value || null);
        },
        /**
         * The gate both forms' onSubmit goes through. True means "go on now"; false means the question is being
         * asked and onSubmit will be called again if the answer allows it.
         */
        branchDetailsAllowSend(asked) {
            if (asked !== 'send' || this.branchDetailsSettled) {
                this.branchDetailsSettled = false;

                return true;
            }

            // Nothing was changed: no question, and the send goes on in the same click.
            if (!changedBranchDetails(this.branchDetailsLoaded, branchDetailsOn(this.agent_information, this.iata_cass)).length) return true;

            this.settleBranchDetails().then((go) => {
                if (!go) return;
                this.branchDetailsSettled = true;
                this.onSubmit();
            });

            return false;
        },
        /*
         * ── Moved here from FocusAir.vue and HouseWayBill.vue (2026-11-15 frontend audit, duplicates) ──────────
         * Each of these was written out in both pages, identical. One copy, so a fix lands once.
         */
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
        handleSaveAndGeneratePDF(pdf_generate_type) {
            // onSubmit() opens the PDF on a successful save (see generatePDFAfterSave).
            this.generatePDFAfterSave = pdf_generate_type;
            // 🔴 A PDF link saves; it never sends (FW2). The status was left as whatever was clicked last, so a PDF
            // link clicked after a Send transmitted the waybill to the airline a second time.
            this.form.status = 'generate_pdf';
            this.onSubmit();
        },
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
        deleteSplCode(index) {
            this.form.tableCodes.splice(index, 1);
        },
        handleDateChange(date, field) {
            const keys = field.split('.');
            let target = this;

            for (let i = 0; i < keys.length - 1; i++) {
                target = target[keys[i]];
            }
            target[keys[keys.length - 1]] = date;
        },
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
    }
};
