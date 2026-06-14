<template>
    <div class="mt-10 p-5">
        <div class="d-flex justify-content-between align-items-center mb-8">
            <div>
                <b-button variant="link" class="p-0 font-weight-bold mb-2 text-muted" @click="$router.go(-1)">
                    <i class="la la-arrow-left"></i> Back to List
                </b-button>
                <h2 class="font-weight-bolder text-dark">{{ isEditMode ? 'Configure Coordinates' : 'Define New System Template' }}</h2>
            </div>
            <b-button variant="success" size="lg" class="font-weight-bolder px-10 shadow-sm" @click="saveData" :disabled="isSaving">
                <b-spinner small v-if="isSaving" class="mr-2"></b-spinner>
                {{ isSaving ? 'Saving...' : 'Commit & Propagate Changes' }}
            </b-button>
        </div>

        <div class="bg-white p-10 rounded shadow-sm border mb-10">
            <div class="w-50 mb-10">
                <label class="font-weight-bolder font-size-h6 text-dark-75 mb-3">System Identifier (Template Key)</label>
                <b-form-input 
                    v-model="templateKey" 
                    placeholder="e.g. air_main_ksr_v2" 
                    class="form-control-lg font-weight-bold"
                    :disabled="isEditMode"
                ></b-form-input>
                <small class="form-text text-muted mt-2" v-if="!isEditMode">
                    Alpha-numeric and underscores only. This matches the internal lookup handle.
                </small>
                <small class="form-text text-danger font-weight-bold mt-2" v-else>
                    System key is fixed after creation to prevent schema drift.
                </small>
            </div>

            <h5 class="font-weight-bolder border-bottom pb-3 mb-7 text-primary d-flex align-items-center">
                <i class="flaticon2-cube-1 mr-2 text-primary"></i> Physical Bound Map [X1, Y1, X2, Y2]
            </h5>

            <div v-if="loadingSchema" class="p-10 text-center text-muted">
                <b-spinner class="mb-4"></b-spinner>
                <p>Synchronizing coordinate dictionary schema from cluster...</p>
            </div>

            <div v-else class="row">
                <div v-for="fieldName in schemaKeys" :key="fieldName" class="col-md-6 col-lg-4 mb-6">
                    <div class="p-6 bg-light rounded border shadow-hover-sm transition-all" style="min-height: 160px; border-color: #ebedf3 !important;">
                        <label class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2 border-light">
                            <span class="font-weight-bold text-uppercase text-muted small" style="letter-spacing: 0.5px;">
                                {{ fieldName.replace(/_/g, ' ') }}
                            </span>
                            <i class="la la-vector-square text-primary font-size-h4 opacity-50"></i>
                        </label>
                        
                        <div class="row no-gutters">
                            <div class="col-3 pr-2">
                                <label class="text-muted font-weight-bold" style="font-size: 10px; text-transform: uppercase;">X1</label>
                                <b-form-input type="number" v-model.number="coords[fieldName][0]" size="sm" class="bg-white border-1 text-center font-weight-bold"></b-form-input>
                            </div>
                            <div class="col-3 pr-2">
                                <label class="text-muted font-weight-bold" style="font-size: 10px; text-transform: uppercase;">Y1</label>
                                <b-form-input type="number" v-model.number="coords[fieldName][1]" size="sm" class="bg-white border-1 text-center font-weight-bold"></b-form-input>
                            </div>
                            <div class="col-3 pr-2">
                                <label class="text-muted font-weight-bold" style="font-size: 10px; text-transform: uppercase;">X2</label>
                                <b-form-input type="number" v-model.number="coords[fieldName][2]" size="sm" class="bg-white border-1 text-center font-weight-bold"></b-form-input>
                            </div>
                            <div class="col-3">
                                <label class="text-muted font-weight-bold" style="font-size: 10px; text-transform: uppercase;">Y2</label>
                                <b-form-input type="number" v-model.number="coords[fieldName][3]" size="sm" class="bg-white border-1 text-center font-weight-bold"></b-form-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            templateKey: "",
            schemaKeys: [],
            coords: {},
            loadingSchema: true,
            isSaving: false,
            isEditMode: false
        };
    },
    mounted() {
        this.loadSchemaAndData();
    },
    methods: {
        async loadSchemaAndData() {
            this.loadingSchema = true;
            try {
                const { data } = await ApiService.get("/superadmin/system-templates");
                this.schemaKeys = data.schema || [];
                
                // Initialize fresh empty data grid based on standard backend schema
                const emptyGrid = {};
                this.schemaKeys.forEach(key => {
                    emptyGrid[key] = [0, 0, 0, 0];
                });
                
                const targetKey = this.$route.params.key;
                if (targetKey) {
                    this.isEditMode = true;
                    this.templateKey = targetKey;
                    
                    // Search current templates for existing vectors
                    const existing = (data.templates || []).find(t => t.key === targetKey);
                    if (existing && existing.coordinates) {
                        // Fill what matches, default the rest
                        this.coords = { ...emptyGrid, ...existing.coordinates };
                        
                        // Handle potential drift: if existing was array shape we ensure missing fields hold empty values
                        this.schemaKeys.forEach(k => {
                            if (!Array.isArray(this.coords[k]) || this.coords[k].length !== 4) {
                                this.$set(this.coords, k, [0,0,0,0]);
                            }
                        });
                    } else {
                        this.coords = emptyGrid;
                    }
                } else {
                    this.coords = emptyGrid;
                }
            } catch (err) {
                console.error("Schema acquisition failure", err);
            } finally {
                this.loadingSchema = false;
            }
        },
        saveData() {
            if (!this.templateKey || this.templateKey.trim() === "") {
                Swal.fire("Empty Key", "Please define a unique system key identifier.", "warning");
                return;
            }

            this.isSaving = true;
            ApiService.post("/superadmin/system-templates/save", {
                key: this.templateKey.trim(),
                coordinates: this.coords
            })
            .then(() => {
                Swal.fire({
                    title: "Sync Complete",
                    text: "Database state updated and configuration file successfully re-generated.",
                    icon: "success",
                    timer: 2000
                }).then(() => {
                    this.$router.push("/superadmin/all-templates");
                });
            })
            .catch(err => {
                Swal.fire("Validation Fail", "Coordinate vectors must contain positive integer values.", "error");
            })
            .finally(() => {
                this.isSaving = false;
            });
        }
    }
};
</script>

<style scoped>
.transition-all {
    transition: all 0.2s ease-in-out;
}
.shadow-hover-sm:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    transform: translateY(-2px);
    background-color: #ffffff !important;
}
</style>
