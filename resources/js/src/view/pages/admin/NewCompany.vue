<template>
    <div class="mt-10 p-5">
        <b-form @submit="onSubmit" class="w-md-50 fw-700">
            <h3 class="fw-700">{{ action }} company</h3>
            <div class="bg-white p-10 rounded">
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input
                            id="input-1"
                            v-model="company_form.name"
                            type="text"
                            required
                            placeholder="Name"
                            class="mx-1 input-box"
                            :class="{'is-invalid': company_form.errors.has('name'),}"
                        ></b-form-input>
                        <has-error :form="company_form" field="name"></has-error>
                    </b-form-group>
                </div>
                <hr class="mb-7" />
                <h5 class="mb-4 text-dark font-weight-bold">Document Templates Configuration</h5>
                
                <b-form-group label="Configured Document Templates" class="mb-7">
                    <!-- Repeater Layout -->
                    <div v-for="(row, index) in company_form.templates_config.allowed_templates" :key="index" class="row no-gutters mb-3 align-items-center p-3 rounded border" style="background: #f8fafc; border: 1px solid #e2e8f0 !important;">
                        <div class="col-5 pr-2">
                            <label class="small font-weight-bold text-muted">System Key (Internal)</label>
                            <b-form-input v-model="row.key" size="sm" list="suggested-keys-list" placeholder="Type or Select Key"></b-form-input>
                            
                            <!-- Browser Native Auto-Suggest Source -->
                            <datalist id="suggested-keys-list">
                                <option v-for="code in availableTemplates" :key="'suggest-'+code" :value="code" />
                            </datalist>
                        </div>
                        <div class="col-5 pr-2">
                            <label class="small font-weight-bold text-muted">Display Label (User Visible)</label>
                            <b-form-input v-model="row.label" size="sm" placeholder="e.g. Main Focus Air"></b-form-input>
                        </div>
                        <div class="col-2 pt-6 text-right">
                            <b-button variant="light-danger" size="sm" @click="removeTemplateRow(index)" class="btn-icon px-2">
                                <i class="flaticon2-trash text-danger"></i>
                            </b-button>
                        </div>
                    </div>
                    <div class="mb-5">
                        <b-button variant="outline-primary" size="sm" class="font-weight-bolder px-4" @click="addTemplateRow">
                            <i class="la la-plus mr-1"></i> Add Template Mapping
                        </b-button>
                    </div>
                    <has-error :form="company_form" field="templates_config.allowed_templates"></has-error>
                    
                    <!-- Helper Pill Hints -->
                    <div v-if="availableTemplates.length > 0" class="mt-4 p-3 bg-light rounded border">
                        <span class="d-block text-muted font-size-xs font-weight-bold mb-2">AVAILABLE SYSTEM KEYS (SOURCE OF TRUTH)</span>
                        <div class="d-flex flex-wrap">
                            <span v-for="code in availableTemplates" :key="'pill-'+code" class="badge badge-light-primary badge-pill mr-2 mb-2 p-2" style="cursor: pointer;" title="Click to assign to company" @click="addTemplateFromPill(code)">
                                <i class="la la-plus-circle mr-1 text-primary"></i> {{ code }}
                            </span>
                        </div>
                    </div>
                </b-form-group>

                <div class="row mb-7">
                    <div class="col-md-6">
                        <b-form-group label="Default Focus Air Template">
                            <b-form-select v-model="company_form.templates_config.default_focus_air">
                                <option value="">-- Select Default --</option>
                                <option v-for="tpl in company_form.templates_config.allowed_templates" :key="'fa-'+tpl.key" :value="tpl.key">{{ tpl.label || tpl.key }}</option>
                            </b-form-select>
                            <has-error :form="company_form" field="templates_config.default_focus_air"></has-error>
                        </b-form-group>
                    </div>
                    <div class="col-md-6">
                        <b-form-group label="Default House Waybill Template">
                            <b-form-select v-model="company_form.templates_config.default_house_air">
                                <option value="">-- Select Default --</option>
                                <option v-for="tpl in company_form.templates_config.allowed_templates" :key="'hw-'+tpl.key" :value="tpl.key">{{ tpl.label || tpl.key }}</option>
                            </b-form-select>
                            <has-error :form="company_form" field="templates_config.default_house_air"></has-error>
                        </b-form-group>
                    </div>
                </div>
                <div class="alert alert-success mt-3" role="alert" id="fade">
                    <span class="font-weight-bolder font-size-h6">Saved Successfully</span>
                </div>
                <button class="btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white mt-3">
                    {{ action }} company
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
            company_form: new Form({
                id: "",
                name: "",
                templates_config: {
                    allowed_templates: [],
                    default_focus_air: "",
                    default_house_air: ""
                }
            }),
            action: "Add",
            location: [],
            searchQuery: "",
            isDropdownOpen: false,
            showpass: true,
            availableTemplates: []
        };
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            
            // Safeguard: Duplicate Key Guard
            const list = this.company_form.templates_config.allowed_templates || [];
            const validKeys = list.map(x => (x.key || '').trim().toLowerCase()).filter(k => k !== '');
            if (new Set(validKeys).size !== validKeys.length) {
                alert("Duplicate Template Keys detected. Please ensure all keys are unique.");
                return;
            }

            if (this.action == "Add") {
                this.company_form
                    .post(`/superadmin/create-company`)
                    .then(({ data }) => {
                        this.$router.push("/superadmin/all-company");
                    })
                    .catch((err) => {
                    });
            } else {
                this.company_form
                    .put(`/superadmin/edit-company/${this.company_form.id}`)
                    .then(({ data }) => {
                        $("#fade").fadeToggle(1000);
                        setTimeout(() => $("#fade").fadeToggle(1000), 2000);
                    });
            }
        },
        addTemplateRow() {
            if (!this.company_form.templates_config.allowed_templates) {
                this.company_form.templates_config.allowed_templates = [];
            }
            this.company_form.templates_config.allowed_templates.push({ key: '', label: '' });
        },
        removeTemplateRow(index) {
            this.company_form.templates_config.allowed_templates.splice(index, 1);
        },
        addTemplateFromPill(key) {
            if (!this.company_form.templates_config.allowed_templates) {
                this.$set(this.company_form.templates_config, 'allowed_templates', []);
            }
            
            // Prevent duplicates
            const exists = this.company_form.templates_config.allowed_templates.some(t => t.key === key);
            if (exists) {
                alert(`'${key}' is already assigned.`);
                return;
            }

            this.company_form.templates_config.allowed_templates.push({ 
                key: key, 
                label: key.replace(/_/g, ' ').toUpperCase() 
            });
        },
        getData(id) {
            ApiService.get(`/superadmin/all-company/${id}`).then(({ data }) => {
                const payload = data[0];
                // Ensure we instantiate object shape to protect bindings if remote payload is null
                if (!payload.templates_config) {
                     payload.templates_config = { allowed_templates: [], default_focus_air: '', default_house_air: '' };
                } else {
                    // LEGACY DEFENSE: Transform string arrays ['ksr'] into object arrays [{key:'ksr', label:'ksr'}]
                    if (Array.isArray(payload.templates_config.allowed_templates)) {
                        payload.templates_config.allowed_templates = payload.templates_config.allowed_templates.map(item => {
                            if (typeof item === 'string') {
                                return { key: item, label: item };
                            }
                            return item;
                        });
                    } else {
                        payload.templates_config.allowed_templates = [];
                    }
                }
                this.company_form.fill(payload);
            });
        },
        fetchAvailableTemplates() {
            ApiService.get('/superadmin/available-templates').then(({data}) => {
                this.availableTemplates = data;
            });
        }
    },
    mounted() {
        this.fetchAvailableTemplates();
        if (this.get_item) {
            this.getData(this.get_item);
            this.action = "Edit";
        }
    },
    activated() {
        // Re-fetch every time the user navigates to this page
        // so newly added system templates appear immediately
        this.fetchAvailableTemplates();
    },
    computed: {
        get_item: function () {
            if (this.$route.params.id) return this.$route.params.id;
            else return 0;
        },
    },
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
