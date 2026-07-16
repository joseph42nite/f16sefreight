<template>
    <div class="mt-10 p-5">
        <b-form @submit="onSubmit" class="w-md-50 fw-700">
            <h3 class="fw-700">{{ action }} Branch</h3>
            <div class="bg-white p-10 rounded">
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.agent_name" type="text" required placeholder="Agent Name" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('agent_name'),}"></b-form-input>
                        <has-error :form="branch_form" field="agent_name"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.agent_address" type="text" required placeholder="Agent Address" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('agent_address'),}"></b-form-input>
                        <has-error :form="branch_form" field="agent_address"></has-error>
                    </b-form-group>
                </div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.agent_pincode" type="number" required placeholder="Agent Pincode" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('agent_pincode'),}"></b-form-input>
                        <has-error :form="branch_form" field="agent_pincode"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.agent_city" type="text" required placeholder="Agent City" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('agent_city'),}"></b-form-input>
                        <has-error :form="branch_form" field="agent_city"></has-error>
                    </b-form-group>
                </div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-select v-model="branch_form.company_id" :options="all_company"></b-form-select>
                        <has-error :form="branch_form" field="company"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.agent_issue_sign" type="text" required placeholder="Agent issue Sign" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('agent_issue_sign'),}"></b-form-input>
                        <has-error :form="branch_form" field="agent_issue_sign"></has-error>
                    </b-form-group>
                </div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <div class="custom-dropdown" ref="dropdownContainer" @click="toggleDropdown">
                            <input type="text" v-model="searchQuery" placeholder="Agent Issue Loc Code" id="from_id" class="form-control" autocomplete="off">
                            <div v-if="isDropdownOpen" class="dropdown-options">
                                <div v-for="(item, index) in filteredLocations" :key="index" @click="selectOption(item)" class="option">{{ item.iata_code }}, {{ item.destination }} ({{ item.iata_code }})</div>
                            </div>
                        </div>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.agent_issue_date" type="date" required placeholder="Agent Issue Date" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('agent_issue_date'),}"></b-form-input>
                        <has-error :form="branch_form" field="agent_issue_date"></has-error>
                    </b-form-group>
                </div>
                <div>Iata Code and Case</div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.iata_agent_code" type="text" required placeholder="IATA Agent Code" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('iata_agent_code'),}"></b-form-input>
                        <has-error :form="branch_form" field="iata_agent_code"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.iata_agent_cass" type="text" required placeholder="IATA Agent Cass" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('iata_agent_cass'),}"></b-form-input>
                        <has-error :form="branch_form" field="iata_agent_cass"></has-error>
                    </b-form-group>
                </div>
                <div>Participant Details</div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.participant_airport" type="text" required placeholder="Participant Airport" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('participant_airport'),}"></b-form-input>
                        <has-error :form="branch_form" field="participant_airport"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.prticipant_identifer" type="text" required placeholder="Participant Identifer" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('prticipant_identifer'),}"></b-form-input>
                        <has-error :form="branch_form" field="prticipant_identifer"></has-error>
                    </b-form-group>
                </div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.participant_code" type="text" required placeholder="Participant Code" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('participant_code'),}"></b-form-input>
                        <has-error :form="branch_form" field="participant_code"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.participant_file_reference" type="text" required placeholder="Participant File Reference" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('participant_file_reference'),}"></b-form-input>
                        <has-error :form="branch_form" field="participant_file_reference"></has-error>
                    </b-form-group>
                </div>
                <div>Office Details</div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.office_airport" type="text" required placeholder="Office Airport" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('office_airport'),}"></b-form-input>
                        <has-error :form="branch_form" field="office_airport"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.office_function_designator" type="text" required placeholder="Office Function Designtor" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('office_function_designator'),}"></b-form-input>
                        <has-error :form="branch_form" field="office_function_designator"></has-error>
                    </b-form-group>
                </div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.office_company_designator" type="text" required placeholder="Office Company Designator" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('office_company_designator'),}"></b-form-input>
                        <has-error :form="branch_form" field="office_company_designator"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.office_file_reference" type="text" required placeholder="Office File Reference" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('office_file_reference'),}"></b-form-input>
                        <has-error :form="branch_form" field="office_file_reference"></has-error>
                    </b-form-group>
                </div>
                <div>HO Details</div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.ho_name" type="text" required placeholder="Ho Name" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('ho_name'),}"></b-form-input>
                        <has-error :form="branch_form" field="ho_name"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.ho_address" type="text" required placeholder="Ho Address" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('ho_address'),}"></b-form-input>
                        <has-error :form="branch_form" field="ho_address"></has-error>
                    </b-form-group>
                </div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.ho_city" type="text" required placeholder="Ho City" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('ho_city'),}"></b-form-input>
                        <has-error :form="branch_form" field="ho_city"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.ho_pincode" type="number" required placeholder="Ho Pincode" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('ho_pincode'),}"></b-form-input>
                        <has-error :form="branch_form" field="ho_pincode"></has-error>
                    </b-form-group>
                </div>
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.ho_state" type="text" required placeholder="Ho State" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('ho_state'),}"></b-form-input>
                        <has-error :form="branch_form" field="ho_state"></has-error>
                    </b-form-group>
                    <b-form-group class="w-50 mr-2">
                        <b-form-input id="input-1" v-model="branch_form.ho_country" type="text" required placeholder="Ho Country" class="mx-1 input-box" :class="{'is-invalid': branch_form.errors.has('ho_country'),}"></b-form-input>
                        <has-error :form="branch_form" field="ho_country"></has-error>
                    </b-form-group>
                </div>
                <div class="alert alert-success mt-3" role="alert" id="fade">
                    <span class="font-weight-bolder font-size-h6">Saved Successfully</span>
                </div>
                <button class="btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white mt-3">
                    {{ action }} Branch
                </button>
            </div>
        </b-form>
    </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    data() {
        return {
            branch_form: new Form({
                id: "",
                //agent details
                agent_name: "",
                agent_address:"",
                agent_pincode: "",
                agent_city:"",
                company_id: null,
                agent_issue_sign:"",
                agent_issue_loc_code: '',
                agent_issue_date:"",
                agent_account: "",
                //iata cass and code
                iata_agent_code:"",
                iata_agent_cass: "",
                //Participant
                participant_airport:"",
                prticipant_identifer: "",
                participant_code:"",
                participant_file_reference:"",
                //office details
                office_airport:"",
                office_function_designator: "",
                office_company_designator:"",
                office_file_reference: "",
                //HAWB Agents Head Office
                ho_name:"",
                ho_address:"",
                ho_city:"",
                ho_pincode:"",
                ho_state:"",
                ho_country:"",
            }),
            action: "Add",
            all_company:[{ value: null, text: 'Select Company' }],
            location: [],
            searchQuery: "",
            isDropdownOpen: false,
            showpass: true,
        };
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            if (this.action == "Add") {
                this.branch_form.post(`/superadmin/create-branch`)
                    .then(({ data }) => {
                        this.$router.push("/superadmin/all-branch");
                    })
                    .catch((err) => {
                    });
            } else {
                this.branch_form
                    .put(`/superadmin/edit-branch/${this.branch_form.id}`)
                    .then(({ data }) => {
                        $("#fade").fadeToggle(1000);
                        $("#fade").fadeToggle(1000);
                    });
            }
        },
        getData(id) {
            ApiService.get(`/superadmin/all-branch/${id}`).then(({ data }) => {
                this.branch_form.fill(data[0]);
                this.searchQuery=data[0].agent_issue_loc_code;
            });
        },
        getCompany() {
            ApiService.get(`/superadmin/all-company`).then(({ data }) => {
                for(let i=0;i<data.length;i++){
                    this.all_company.push({"value":data[i].id,"text":data[i].name})
                }
            });
        },
        getLocation(){
            ApiService.get(`/superadmin/get-location`)
                .then(({ data }) => {
                this.location=data;
            })
        },
        normalizer(node) {
            return {
                id: node.value,
                label: node.name,
            };
        },
        selectOption(item) {
            if (!item) return;
            const iata = item.iata_code || '';
            const dest = item.destination || '';
            this.branch_form.agent_issue_loc_code = iata + (dest ? `, ${dest} (${iata})` : '');
            this.searchQuery = this.branch_form.agent_issue_loc_code;
        },
         toggleDropdown() {
           this.isDropdownOpen = !this.isDropdownOpen;
        },
        closeDropdown(event) {
            const dropdownContainer = this.$refs.dropdownContainer;
            if (!dropdownContainer.contains(event.target)) {
                this.isDropdownOpen = false;
            }
        },
    },
    mounted() {
        this.getCompany();
        this.getLocation();
        if (this.get_item) {
            this.getData(this.get_item);
            this.action = "Edit";
        }
        window.addEventListener('click', this.closeDropdown);
    },
    computed: {
        get_item: function () {
            if (this.$route.params.id) return this.$route.params.id;
            else return 0;
        },
        filteredLocations() {
            if (!this.searchQuery) {
                return this.location.slice(0, 20); // Limit to top 20 to avoid browser lag with 20k records
            }
            const query = this.searchQuery.toLowerCase();
            const filtered = this.location.filter(item => {
                return (
                    item.iata_code.toLowerCase().includes(query) ||
                    (item.destination && item.destination.toLowerCase().includes(query))
                );
            });
            return filtered.slice(0, 20);
        }
    },
    watch: {
        searchQuery(val) {
            this.branch_form.agent_issue_loc_code = val;
        }
    }
};
</script>
<style scoped>
.fw-700 {
    font-weight: 700;
}
.input-box {
    border: 1px silver solid;
}
.create_btn {
    background: #00a1e4;
}
#fade {
    display: none;
}

.custom-dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    border: solid 1px silver;
    border-radius: 5px;
}

.form-control {
    width: 100%;
}

.dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-top: none;
    max-height: 200px; /* Adjust as needed */
    overflow-y: auto;
}

.option {
    padding: 5px 10px;
    cursor: pointer;
}

.option:hover {
    background-color: #f0f0f0;
}
</style>
