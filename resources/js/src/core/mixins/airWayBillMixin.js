import ApiService from "@/core/services/api.service";

export default {
    data() {
        return {
            validationErrors: [],
            hs_code_error: [],
            uld_error: [],
            oci_info: {
                country_code: '',
                info_identifier: '',
                custom_info_identifier: '',
                supplementary_info: '',
            },
            editIndex: null,
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
    mounted() {
        window.addEventListener('click', this.closeAllDropdowns);
    },
    beforeDestroy() {
        window.removeEventListener('click', this.closeAllDropdowns);
    },
    methods: {
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
        displayModal() {
            this.$refs.modalConsignment.show();
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
            this.editIndex = index;
            this.oci_info = { ...this.form.oci_entries[index] };
        },
        addOtherCustomInfo() {
            if (!this.oci_info.info_identifier || !this.oci_info.supplementary_info) {
                alert('Please fill in all fields');
                return;
            }
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
        calculateTotalCharges() {
            this.form.totals.total_amount = this.calculateTotalAmount();
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
                    this.form.entries[this.edit_entry_index] = updatedEntry;
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
            if (!q) return this.location;
            return this.location.filter(item =>
                item.iata_code.toLowerCase().includes(q)
            );
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
            this.selectedShipper = shipper.id;
            this.form.shipper_address = shipper.name;
            this.fillShipperDetails(shipper.id);
            this.activeDropdown = null;
        },
        selectConsignee(consignee) {
            this.selectedConsignee = consignee.id;
            this.form.consignee_address = consignee.name;
            this.fillConsigneeDetails(consignee.id);
            this.activeDropdown = null;
        },
        selectAlsoNotifyA(also_notify) {
            this.selectAlsoNotify = also_notify.id;
            this.form.also_notify_address = also_notify.name;
            this.fillAlsoNotifyDetails(also_notify.id);
            this.activeDropdown = null;
        },
        normalizeText(str) {
            if (!str) return '';
            return str.toLowerCase().replace(/[^a-z0-9]/g, '');
        },
        calculateSimilarity(str1, str2) {
            if (!str1 || !str2) return 0;
            const s1 = this.normalizeText(str1);
            const s2 = this.normalizeText(str2);
            if (!s1 || !s2) return 0;
            if (s1 === s2) return 1.0;
            if (s1.includes(s2) || s2.includes(s1)) return 0.95;

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
                if (!savedItem.address) {
                    addressPass = true;
                } else {
                    const normSavedAddr = this.normalizeText(savedItem.address);
                    const normOcrFull = this.normalizeText(ocrEntity.full_details || ocrEntity.address);
                    
                    if (normOcrFull && normSavedAddr && normOcrFull.includes(normSavedAddr)) {
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
    }
};
