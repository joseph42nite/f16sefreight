<template>
    <div>
        <!-- The trigger button (so we can place this component directly on any page) -->
        <b-button v-b-modal.upload-file-modal class="show-btn ultra-trigger-btn">
            <b-icon icon="cloud-arrow-up" class="mr-2"></b-icon> Upload
        </b-button>

        <b-modal id="upload-file-modal" hide-footer hide-header centered size="xl" modal-class="ultra-premium-modal">
            <div class="modal-split-layout">
                <button class="ultra-close-btn" @click="$bvModal.hide('upload-file-modal')">
                    <b-icon icon="x"></b-icon>
                </button>
                <div class="modal-left-pane login-pane">
                    <div class="pane-content">
                        <div class="pane-icon-wrapper mb-8">
                            <b-icon icon="cloud-upload" font-scale="2.5"></b-icon>
                        </div>
                        <h2 class="pane-title">Upload Document</h2>
                        <p class="pane-subtitle">Please manually verify each input field extracted by the upload feature. F16s E-freight Solutions is not legally liable for incorrect data sent to the airline. The automated extraction process may contain errors.</p>
                        
                        <div class="pane-footer mt-auto">
                            <div class="pane-feature">
                                <b-icon icon="check-circle" class="mr-3"></b-icon>
                                <span>Automated Extraction</span>
                            </div>
                            <div class="pane-feature">
                                <b-icon icon="shield-check" class="mr-3"></b-icon>
                                <span>Secure Processing</span>
                            </div>
                        </div>
                    </div>
                    <div class="pane-decoration"></div>
                    <div class="pane-decoration-2"></div>
                </div>
                
                <div class="modal-right-pane">
                    <div class="form-scroll-container">
                        <div class="ultra-form">
                            <h3 class="form-section-title mb-10">Select File</h3>

                            <div class="mb-8 text-left">
                                <label class="font-weight-bold mb-3" style="color: #5A6B8A;">Document Type</label>
                                <b-form-select 
                                    class="form-control form-control-solid h-auto py-4 px-6 rounded-xl font-size-h6 border-1" 
                                    style="background: #f8fafc; border: 1px solid #e2e8f0;"
                                    v-model="selectedUploadType">
                                    <option v-for="tpl in allowedTemplates" :key="tpl.key" :value="tpl.key">{{ tpl.label || tpl.key }}</option>
                                </b-form-select>
                            </div>

                            <div class="upload-dropzone mb-10" @click="!isUploading && triggerFileInput()"
                                :style="{
                                    border: isUploading ? '2px solid #355594' : '2px dashed #355594',
                                    borderRadius: '20px',
                                    padding: '60px 20px',
                                    cursor: isUploading ? 'default' : 'pointer',
                                    background: isUploading ? 'rgba(53, 85, 148, 0.05)' : 'rgba(53, 85, 148, 0.02)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease'
                                }">
                                
                                <!-- Mode 1: Standard selection state -->
                                <div v-if="!isUploading" class="text-center">
                                    <div class="mb-4">
                                        <b-icon icon="file-earmark-pdf" font-scale="3" style="color: #355594; opacity: 0.6;"></b-icon>
                                    </div>
                                    <p class="mb-0 font-weight-bolder font-size-h5" style="color: #1e3a6e;">Click to select PDF</p>
                                    <p class="text-muted font-size-sm mt-2">Maximum file size: 10MB</p>
                                </div>

                                <!-- Mode 2: Minimal & Clean Loading State -->
                                <div v-else class="text-center d-flex flex-column align-items-center justify-content-center py-4">
                                    <div class="clean-loader-wrapper mb-6">
                                        <div class="dual-ring-spinner"></div>
                                        <b-icon icon="file-earmark-arrow-up" font-scale="2" class="loader-center-icon"></b-icon>
                                    </div>
                                    
                                    <div class="status-info-text">
                                        <h4 class="text-primary font-weight-bolder mb-2" style="letter-spacing:-0.5px; text-shadow: none;">
                                            {{ ocrStatusMessage || 'Processing...' }}
                                        </h4>
                                        <p class="text-muted small mb-0" style="text-shadow: none;">AI-powered data extraction active. Please wait.</p>
                                    </div>
                                </div>
                                <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none;" accept=".pdf">
                            </div>

                            <div class="form-actions mt-6 d-flex flex-column align-items-center w-100">
                                <div v-if="selectedFile && !isUploading" class="mb-4 text-primary font-weight-bold">
                                    Selected: {{ selectedFile.name }}
                                </div>

                                <button class="ultra-submit-btn" @click="submitUpload">
                                    <span v-if="!isUploading">Extract</span>
                                    <span v-else>Processing...</span>
                                    <b-icon v-if="!isUploading" icon="arrow-right" class="btn-icon"></b-icon>
                                    <b-spinner v-else small class="ml-2" variant="light"></b-spinner>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
    name: "OcrUploadModal",
    props: {
        initialType: {
            type: String,
            default: 'ksr'
        },
        category: {
            type: String,
            default: '',
            validator: v => {
                return v === '' || ['focus_air', 'house_air'].includes(v);
            }
        }
    },
    data() {
        return {
            selectedUploadType: this.initialType,
            selectedFile: null,
            isUploading: false,
            ocrPollInterval: null,
            ocrJobId: null,
            ocrStatusMessage: '',
            fetchedConfig: null // Direct runtime payload fallback
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        templatesConfig() {
            // Prioritize directly fetched, fallback to Vuex
            return this.fetchedConfig || (this.currentUser ? this.currentUser.templates_config : null);
        },
        allowedTemplates() {
            let list = [];
            if (this.templatesConfig && this.templatesConfig.allowed_templates && this.templatesConfig.allowed_templates.length > 0) {
                list = [...this.templatesConfig.allowed_templates];
            } else {
                // Core fallback safety array
                list = [
                    { key: 'ksr', label: 'Standard (ksr)' },
                    { key: 'ksr_house1', label: 'House 1' },
                    { key: 'ksr_house2', label: 'House 2' },
                    { key: 'ksr_apex_house', label: 'Apex House' }
                ];
            }

            const tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
            if (tier === 'viper_tactical' || tier === 'viper_command') {
                if (!list.some(tpl => tpl.key === 'commercial_invoice')) {
                    list.push({ key: 'commercial_invoice', label: 'Commercial Invoice' });
                }
                if (!list.some(tpl => tpl.key === 'packing_list')) {
                    list.push({ key: 'packing_list', label: 'Packing List' });
                }
            }
            return list;
        }
    },
    mounted() {
        this.loadActiveConfiguration();
    },
    watch: {
        templatesConfig: {
            handler(val) {
                if (val) this.applyDefaults();
            },
            immediate: true
        }
    },
    beforeDestroy() {
        this.stopOcrPolling();
    },
    methods: {
        loadActiveConfiguration() {
            // Direct physical load eliminates Vuex initialization race states entirely
            ApiService.get('/user/company-templates')
                .then(({ data }) => {
                    this.fetchedConfig = data;
                    this.applyDefaults();
                })
                .catch(err => {
                    console.warn('[OCR] Direct fallback active: using ambient memory payload.', err);
                    this.applyDefaults();
                });
        },
        applyDefaults() {
            const config = this.templatesConfig;
            if (!config) return;

            if (this.category === 'focus_air' && config.default_focus_air) {
                this.selectedUploadType = config.default_focus_air;
            } else if (this.category === 'house_air' && config.default_house_air) {
                this.selectedUploadType = config.default_house_air;
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click()
        },
        handleFileSelect(event) {
            const file = event.target.files[0]
            if (file) {
                if (file.type !== 'application/pdf') {
                    alert('Please select a PDF file only')
                    this.$refs.fileInput.value = ''
                    return
                }
                this.selectedFile = file
            }
        },
        submitUpload() {
            if (this.isUploading) return;
            if (!this.selectedFile) {
                this.triggerFileInput();
                return
            }
            this.isUploading = true
            this.ocrStatusMessage = 'Uploading file...'
            const formData = new FormData()
            formData.append('upload_file', this.selectedFile)
            formData.append('type', this.selectedUploadType);
            
            ApiService.post('/user/upload-awb-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                if (response.data && response.data.job_id) {
                    this.ocrJobId = response.data.job_id
                    this.ocrStatusMessage = 'File loaded. Analyzing...'
                    this.startOcrPolling(response.data.job_id)
                } else {
                    throw new Error('Failed to generate job reference ID.')
                }
            }).catch(error => {
                this.isUploading = false
                this.ocrStatusMessage = ''
                this.$refs.fileInput.value = ''
                if (error.response && error.response.status === 429) {
                    alert('Speed limit reached! Please wait a minute before your next upload to protect server capacity.')
                } else {
                    alert('Encountered failure preparing document for analysis.')
                }
            })
        },
        startOcrPolling(jobId) {
            this.stopOcrPolling();
            this.ocrPollInterval = setInterval(() => {
                ApiService.get(`/user/ocr-status/${jobId}`)
                .then(res => {
                    const data = res.data;
                    if (data.job_status === 'processing') {
                        this.ocrStatusMessage = 'Extracting IATA fields...';
                    }

                    if (data.job_status === 'completed') {
                        this.stopOcrPolling();
                        this.ocrStatusMessage = '';
                        this.isUploading = false;
                        this.$bvModal.hide('upload-file-modal');
                        this.$emit('extracted', data.data);
                        this.selectedFile = null;
                        this.$refs.fileInput.value = '';
                    } else if (data.job_status === 'failed') {
                        this.stopOcrPolling();
                        this.isUploading = false;
                        this.ocrStatusMessage = '';
                        alert('Parsing failure: ' + (data.error || 'Unknown engine error'));
                    }
                }).catch(err => {
                    this.stopOcrPolling();
                    this.isUploading = false;
                    this.ocrStatusMessage = '';
                });
            }, 800);
        },
        stopOcrPolling() {
            if (this.ocrPollInterval) {
                clearInterval(this.ocrPollInterval);
                this.ocrPollInterval = null;
            }
        }
    }
};
</script>

<style scoped>
    .ultra-trigger-btn {
        background: #355594 !important;
        color: white !important;
        border: none !important;
        border-radius: 50px;
        padding: 10px 26px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px rgba(53, 85, 148, 0.15);
    }
    .ultra-trigger-btn:hover {
        background: #28447a !important;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 15px 25px rgba(53, 85, 148, 0.25);
    }

    /* Animations */
    .animate-pulse {
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { opacity: 0.6; transform: scale(0.98); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0.6; transform: scale(0.98); }
    }

    /* Clean Loader Visuals */
    .clean-loader-wrapper {
        position: relative;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loader-center-icon {
        position: absolute;
        color: #355594;
        opacity: 0.8;
    }
    .dual-ring-spinner {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid rgba(53, 85, 148, 0.1);
        border-top-color: #355594;
        animation: spinRotate 1s ease-in-out infinite;
    }
    @keyframes spinRotate {
        to { transform: rotate(360deg); }
    }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modal-split-layout { display: flex; flex-direction: row; min-height: 600px; position: relative; width: 100%; align-items: stretch; }
    .ultra-close-btn { position: absolute; top: 25px; right: 25px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.05); border: none; color: #5A6B8A; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; z-index: 50; transition: all 0.3s ease; }
    .ultra-close-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }
    .modal-left-pane { flex: 0 0 40%; padding: 4rem 3.5rem; position: relative; overflow: hidden; color: white; display: flex; flex-direction: column; background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%); }
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
    .ultra-submit-btn { background: #355594 !important; border: none !important; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none; }
    .ultra-submit-btn:hover { background: #28447a !important; transform: translateY(-2px) !important; box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35) !important; }
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
</style>

<style>
/* Non-scoped globally accessible logic for bootstrap overrides */
.ultra-premium-modal .modal-dialog {
    max-width: 1000px !important;
    margin: 1.75rem auto;
    box-shadow: none !important;
}
.ultra-premium-modal .modal-content {
    background: transparent !important;
    border: none !important;
    border-radius: 32px !important;
    box-shadow: none !important;
    font-family: 'Inter', sans-serif !important;
    overflow: hidden;
    animation: fadeInUp 0.4s ease;
}
.ultra-premium-modal .modal-body {
    padding: 0 !important;
    background: #ffffff;
}
</style>
