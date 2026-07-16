<template>
    <div>
        <!-- Trigger Button -->
        <b-button v-if="!isDrawer" v-b-modal.upload-file-modal class="show-btn ultra-trigger-btn">
            <b-icon icon="cloud-arrow-up" class="mr-2"></b-icon> Upload
        </b-button>
        <b-button v-else @click="openInline" class="show-btn ultra-trigger-btn">
            <b-icon icon="cloud-arrow-up" class="mr-2"></b-icon> Upload
        </b-button>

        <!-- Standard Modal Mode -->
        <b-modal 
            v-if="!isDrawer"
            id="upload-file-modal" 
            hide-footer 
            hide-header 
            centered 
            size="xl" 
            modal-class="ultra-premium-modal" 
            @hidden="resetModal"
        >
            <div class="modal-split-layout">
                <button class="ultra-close-btn" @click="$bvModal.hide('upload-file-modal')">
                    <b-icon icon="x"></b-icon>
                </button>
                <div class="modal-left-pane login-pane">
                    <div class="pane-content">
                        <div class="pane-icon-wrapper mb-8">
                            <b-icon icon="cloud-upload" font-scale="2.5"></b-icon>
                        </div>
                        <h2 class="pane-title">Upload Document{{ isMultiMode ? 's' : '' }}</h2>
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
                            <div v-if="isMultiMode" class="pane-feature">
                                <b-icon icon="files" class="mr-3"></b-icon>
                                <span>Multi-Document Merge</span>
                            </div>
                        </div>
                    </div>
                    <div class="pane-decoration"></div>
                    <div class="pane-decoration-2"></div>
                </div>
                
                <div class="modal-right-pane">
                    <div class="form-scroll-container">
                        <div class="ultra-form">
                            <h3 class="form-section-title mb-6">{{ isMultiMode ? 'Upload & Assign Documents' : 'Select File' }}</h3>

                            <!-- Document Type (for single / Viper Core mode) -->
                            <div v-if="!isMultiMode" class="mb-8 text-left">
                                <label class="font-weight-bold mb-3" style="color: #5A6B8A;">Document Type</label>
                                <b-form-select 
                                    class="form-control form-control-solid h-auto py-4 px-6 rounded-xl font-size-h6 border-1" 
                                    style="background: #f8fafc; border: 1px solid #e2e8f0;"
                                    v-model="selectedUploadType">
                                    <option v-for="tpl in allowedTemplates" :key="tpl.key" :value="tpl.key">{{ tpl.label || tpl.key }}</option>
                                </b-form-select>
                            </div>

                            <!-- Multi-Mode: File Upload Area -->
                            <div v-if="isMultiMode" class="mb-6">
                                <!-- Drop Zone for adding files -->
                                <div 
                                    class="upload-dropzone-multi mb-4"
                                    :class="{ 'drag-active': dragActive }"
                                    @click="!isUploading && triggerFileInput()"
                                    @dragover.prevent="dragActive = true"
                                    @dragleave.prevent="dragActive = false"
                                    @drop.prevent="handleDrop"
                                    :style="{
                                        cursor: isUploading ? 'default' : 'pointer',
                                    }"
                                >
                                    <div v-if="!isUploading" class="text-center">
                                        <div class="mb-3">
                                            <b-icon icon="file-earmark-plus" font-scale="2.5" style="color: #355594; opacity: 0.6;"></b-icon>
                                        </div>
                                        <p class="mb-1 font-weight-bolder font-size-h6" style="color: #1e3a6e;">
                                            {{ selectedFiles.length === 0 ? 'Click or drag PDFs here' : 'Add more PDFs' }}
                                        </p>
                                        <p class="text-muted font-size-sm mb-0">Up to 5 files • Max 10MB each</p>
                                    </div>
                                    <div v-else class="text-center d-flex flex-column align-items-center justify-content-center py-4">
                                        <div class="clean-loader-wrapper mb-4">
                                            <div class="dual-ring-spinner"></div>
                                            <b-icon icon="file-earmark-arrow-up" font-scale="2" class="loader-center-icon"></b-icon>
                                        </div>
                                        <h5 class="text-primary font-weight-bolder mb-2" style="letter-spacing:-0.5px;">
                                            {{ ocrStatusMessage || 'Processing...' }}
                                        </h5>
                                        <p class="text-muted small mb-0">AI-powered multi-document extraction. Please wait.</p>
                                    </div>
                                </div>
                                <input type="file" ref="fileInput" @change="handleMultiFileSelect" style="display: none;" accept=".pdf" multiple>

                                <!-- File List with Role Assignment -->
                                <div v-if="selectedFiles.length > 0 && !isUploading" class="file-list-container">
                                    <div 
                                        v-for="(fileEntry, idx) in selectedFiles" 
                                        :key="idx"
                                        class="file-chip d-flex align-items-center justify-content-between mb-3 p-3 rounded-lg"
                                    >
                                        <div class="d-flex align-items-center flex-grow-1 mr-3" style="min-width: 0;">
                                            <div class="file-chip-icon mr-3">
                                                <b-icon icon="file-earmark-pdf-fill" font-scale="1.3" class="text-danger"></b-icon>
                                            </div>
                                            <div style="min-width: 0; flex: 1;">
                                                <p class="file-chip-name mb-1 text-truncate font-weight-bold" style="color: #1e293b; font-size: 0.9rem;">
                                                    {{ fileEntry.file.name }}
                                                </p>
                                                <span class="text-muted" style="font-size: 0.75rem;">
                                                    {{ (fileEntry.file.size / 1024).toFixed(0) }} KB
                                                </span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center" style="gap: 8px;">
                                            <b-form-select 
                                                v-model="fileEntry.role" 
                                                size="sm" 
                                                class="role-select"
                                                style="width: 180px;"
                                            >
                                                <option value="full">Full Document</option>
                                                <option value="shipper_consignee">Shipper & Consignee</option>
                                                <option value="pieces_dimensions">Pieces & Dimensions</option>
                                            </b-form-select>
                                            <b-button 
                                                variant="light" 
                                                size="sm" 
                                                class="remove-file-btn p-1" 
                                                @click="removeFile(idx)"
                                                v-b-tooltip.hover title="Remove"
                                            >
                                                <b-icon icon="x" font-scale="1.1" class="text-danger"></b-icon>
                                            </b-button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Single-Mode: Original Dropzone -->
                            <div v-if="!isMultiMode" class="upload-dropzone mb-10" @click="!isUploading && triggerFileInput()"
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
                                
                                <div v-if="!isUploading" class="text-center">
                                    <div class="mb-4">
                                        <b-icon icon="file-earmark-pdf" font-scale="3" style="color: #355594; opacity: 0.6;"></b-icon>
                                    </div>
                                    <p class="mb-0 font-weight-bolder font-size-h5" style="color: #1e3a6e;">Click to select PDF</p>
                                    <p class="text-muted font-size-sm mt-2">Maximum file size: 10MB</p>
                                </div>

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

                            <!-- Action Buttons -->
                            <div class="form-actions mt-6 d-flex flex-column align-items-center w-100">
                                <!-- Single mode selected file indicator -->
                                <div v-if="!isMultiMode && selectedFile && !isUploading" class="mb-4 text-primary font-weight-bold">
                                    Selected: {{ selectedFile.name }}
                                </div>

                                <!-- Multi mode file count indicator -->
                                <div v-if="isMultiMode && selectedFiles.length > 0 && !isUploading" class="mb-4 d-flex align-items-center" style="gap: 8px;">
                                    <b-badge variant="primary" pill class="px-3 py-2" style="font-size: 0.85rem;">
                                        {{ selectedFiles.length }} document{{ selectedFiles.length > 1 ? 's' : '' }} ready
                                    </b-badge>
                                    <span class="text-muted small">
                                        Roles assigned — click Extract to process
                                    </span>
                                </div>

                                <button class="ultra-submit-btn" @click="submitUpload">
                                    <span v-if="!isUploading">{{ isMultiMode && selectedFiles.length > 1 ? 'Extract All' : 'Extract' }}</span>
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

        <!-- Inline Drawer Mode -->
        <transition v-else name="slide-in-right">
            <div v-if="showInline" class="inline-upload-panel">
                <div class="modal-split-layout inline-layout">
                    <button class="ultra-close-btn" @click="closeInline">
                        <b-icon icon="x"></b-icon>
                    </button>
                    
                    <div class="modal-right-pane inline-right-pane">
                        <div class="form-scroll-container">
                            <div class="ultra-form">
                                <h3 class="form-section-title mb-6">{{ isMultiMode ? 'Upload & Assign Documents' : 'Select File' }}</h3>

                                <!-- Document Type (for single / Viper Core mode) -->
                                <div v-if="!isMultiMode" class="mb-8 text-left">
                                    <label class="font-weight-bold mb-3" style="color: #5A6B8A;">Document Type</label>
                                    <b-form-select 
                                        class="form-control form-control-solid h-auto py-4 px-6 rounded-xl font-size-h6 border-1" 
                                        style="background: #f8fafc; border: 1px solid #e2e8f0;"
                                        v-model="selectedUploadType">
                                        <option v-for="tpl in allowedTemplates" :key="tpl.key" :value="tpl.key">{{ tpl.label || tpl.key }}</option>
                                    </b-form-select>
                                </div>

                                <!-- Multi-Mode: File Upload Area -->
                                <div v-if="isMultiMode" class="mb-6">
                                    <!-- Drop Zone for adding files -->
                                    <div 
                                        class="upload-dropzone-multi mb-4"
                                        :class="{ 'drag-active': dragActive }"
                                        @click="!isUploading && triggerFileInput()"
                                        @dragover.prevent="dragActive = true"
                                        @dragleave.prevent="dragActive = false"
                                        @drop.prevent="handleDrop"
                                        :style="{
                                            cursor: isUploading ? 'default' : 'pointer',
                                        }"
                                    >
                                        <div v-if="!isUploading" class="text-center">
                                            <div class="mb-3">
                                                <b-icon icon="file-earmark-plus" font-scale="2.5" style="color: #355594; opacity: 0.6;"></b-icon>
                                            </div>
                                            <p class="mb-1 font-weight-bolder font-size-h6" style="color: #1e3a6e;">
                                                {{ selectedFiles.length === 0 ? 'Click or drag PDFs here' : 'Add more PDFs' }}
                                            </p>
                                            <p class="text-muted font-size-sm mb-0">Up to 5 files • Max 10MB each</p>
                                        </div>
                                        <div v-else class="text-center d-flex flex-column align-items-center justify-content-center py-4">
                                            <div class="clean-loader-wrapper mb-4">
                                                <div class="dual-ring-spinner"></div>
                                                <b-icon icon="file-earmark-arrow-up" font-scale="2" class="loader-center-icon"></b-icon>
                                            </div>
                                            <h5 class="text-primary font-weight-bolder mb-2" style="letter-spacing:-0.5px;">
                                                {{ ocrStatusMessage || 'Processing...' }}
                                            </h5>
                                            <p class="text-muted small mb-0">AI-powered multi-document extraction. Please wait.</p>
                                        </div>
                                    </div>
                                    <input type="file" ref="fileInputInline" @change="handleMultiFileSelect" style="display: none;" accept=".pdf" multiple>

                                    <!-- File List with Role Assignment -->
                                    <div v-if="selectedFiles.length > 0 && !isUploading" class="file-list-container">
                                        <div 
                                            v-for="(fileEntry, idx) in selectedFiles" 
                                            :key="idx"
                                            class="file-chip d-flex align-items-center justify-content-between mb-3 p-3 rounded-lg"
                                        >
                                            <div class="d-flex align-items-center flex-grow-1 mr-3" style="min-width: 0;">
                                                <div class="file-chip-icon mr-3">
                                                    <b-icon icon="file-earmark-pdf-fill" font-scale="1.3" class="text-danger"></b-icon>
                                                </div>
                                                <div style="min-width: 0; flex: 1;">
                                                    <p class="file-chip-name mb-1 text-truncate font-weight-bold" style="color: #1e293b; font-size: 0.9rem;">
                                                        {{ fileEntry.file.name }}
                                                    </p>
                                                    <span class="text-muted" style="font-size: 0.75rem;">
                                                        {{ (fileEntry.file.size / 1024).toFixed(0) }} KB
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="d-flex align-items-center" style="gap: 8px;">
                                                <b-form-select 
                                                    v-model="fileEntry.role" 
                                                    size="sm" 
                                                    class="role-select"
                                                    style="width: 180px;"
                                                >
                                                    <option value="full">Full Document</option>
                                                    <option value="shipper_consignee">Shipper & Consignee</option>
                                                    <option value="pieces_dimensions">Pieces & Dimensions</option>
                                                </b-form-select>
                                                <b-button 
                                                    variant="light" 
                                                    size="sm" 
                                                    class="remove-file-btn p-1" 
                                                    @click="removeFile(idx)"
                                                    v-b-tooltip.hover title="Remove"
                                                >
                                                    <b-icon icon="x" font-scale="1.1" class="text-danger"></b-icon>
                                                </b-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Single-Mode: Original Dropzone -->
                                <div v-if="!isMultiMode" class="upload-dropzone mb-10" @click="!isUploading && triggerFileInput()"
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
                                    
                                    <div v-if="!isUploading" class="text-center">
                                        <div class="mb-4">
                                            <b-icon icon="file-earmark-pdf" font-scale="3" style="color: #355594; opacity: 0.6;"></b-icon>
                                        </div>
                                        <p class="mb-0 font-weight-bolder font-size-h5" style="color: #1e3a6e;">Click to select PDF</p>
                                        <p class="text-muted font-size-sm mt-2">Maximum file size: 10MB</p>
                                    </div>

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
                                    <input type="file" ref="fileInputInline" @change="handleFileSelect" style="display: none;" accept=".pdf">
                                </div>

                                <!-- Action Buttons -->
                                <div class="form-actions mt-6 d-flex flex-column align-items-center w-100">
                                    <!-- Single mode selected file indicator -->
                                    <div v-if="!isMultiMode && selectedFile && !isUploading" class="mb-4 text-primary font-weight-bold">
                                        Selected: {{ selectedFile.name }}
                                    </div>

                                    <!-- Multi mode file count indicator -->
                                    <div v-if="isMultiMode && selectedFiles.length > 0 && !isUploading" class="mb-4 d-flex align-items-center" style="gap: 8px;">
                                        <b-badge variant="primary" pill class="px-3 py-2" style="font-size: 0.85rem;">
                                            {{ selectedFiles.length }} document{{ selectedFiles.length > 1 ? 's' : '' }} ready
                                        </b-badge>
                                        <span class="text-muted small">
                                            Roles assigned — click Extract to process
                                        </span>
                                    </div>

                                    <button class="ultra-submit-btn" @click="submitUpload">
                                        <span v-if="!isUploading">{{ isMultiMode && selectedFiles.length > 1 ? 'Extract All' : 'Extract' }}</span>
                                        <span v-else>Processing...</span>
                                        <b-icon v-if="!isUploading" icon="arrow-right" class="btn-icon"></b-icon>
                                        <b-spinner v-else small class="ml-2" variant="light"></b-spinner>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
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
                return v === '' || ['focus_air', 'house_air', 'focus_air_import'].includes(v);
            }
        },
        isDrawer: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectedUploadType: this.initialType,
            // Single-file mode (Viper Core)
            selectedFile: null,
            // Multi-file mode (Tactical/Command)
            selectedFiles: [], // Array of { file: File, role: String }
            dragActive: false,
            // Shared state
            isUploading: false,
            ocrPollInterval: null,
            ocrJobId: null,
            ocrStatusMessage: '',
            fetchedConfig: null,
            showInline: false
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        companyTier() {
            return this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
        },
        isMultiMode() {
            // Tactical and Command tiers get multi-PDF mode
            return this.companyTier === 'viper_tactical' || this.companyTier === 'viper_command';
        },
        templatesConfig() {
            return this.fetchedConfig || (this.currentUser ? this.currentUser.templates_config : null);
        },
        allowedTemplates() {
            let list = [];
            if (this.templatesConfig && this.templatesConfig.allowed_templates && this.templatesConfig.allowed_templates.length > 0) {
                list = [...this.templatesConfig.allowed_templates];
            } else {
                list = [
                    { key: 'ksr', label: 'Standard (ksr)' },
                    { key: 'ksr_house1', label: 'House 1' },
                    { key: 'ksr_house2', label: 'House 2' },
                    { key: 'ksr_apex_house', label: 'Apex House' }
                ];
            }

            if (this.isMultiMode) {
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
        getActiveFileInput() {
            return this.isDrawer ? this.$refs.fileInputInline : this.$refs.fileInput;
        },
        triggerFileInput() {
            const input = this.getActiveFileInput();
            if (input) input.click();
        },
        openInline() {
            this.showInline = true;
            this.resetModal();
        },
        closeInline() {
            this.showInline = false;
            this.resetModal();
        },
        // --- Single File Mode Handlers (Viper Core) ---
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.type !== 'application/pdf') {
                    alert('Please select a PDF file only');
                    const input = this.getActiveFileInput();
                    if (input) input.value = '';
                    return;
                }
                this.selectedFile = file;
            }
        },
        // --- Multi File Mode Handlers (Tactical/Command) ---
        handleMultiFileSelect(event) {
            const files = Array.from(event.target.files);
            this.addFiles(files);
            const input = this.getActiveFileInput();
            if (input) input.value = '';
        },
        handleDrop(event) {
            this.dragActive = false;
            
            // Check if there is attachment data in the drag event
            const attData = event.dataTransfer.getData('application/json');
            if (attData) {
                try {
                    const att = JSON.parse(attData);
                    if (att && att.id && att.filename) {
                        this.isUploading = true;
                        this.ocrStatusMessage = `Downloading "${att.filename}"...`;
                        
                        ApiService.get(`/user/inbox/attachments/${att.id}/download`, { responseType: 'blob' })
                            .then(response => {
                                const blob = response.data;
                                const file = new File([blob], att.filename, { type: att.mime_type || 'application/pdf' });
                                if (this.isMultiMode) {
                                    this.addFiles([file]);
                                } else {
                                    if (file.type !== 'application/pdf') {
                                        alert('Please select a PDF file only');
                                        return;
                                    }
                                    this.selectedFile = file;
                                }
                            })
                            .catch(err => {
                                console.error('Failed to retrieve attachment file:', err);
                                alert(`Failed to download attachment "${att.filename}".`);
                            })
                            .finally(() => {
                                this.isUploading = false;
                                this.ocrStatusMessage = '';
                            });
                        return; // Drag handled
                    }
                } catch (e) {
                    console.error('Error parsing drag drop data:', e);
                }
            }

            // Fallback to standard files from OS drag-and-drop
            const files = Array.from(event.dataTransfer.files);
            if (files.length > 0) {
                if (this.isMultiMode) {
                    this.addFiles(files);
                } else {
                    const file = files[0];
                    if (file.type !== 'application/pdf') {
                        alert('Please select a PDF file only');
                        return;
                    }
                    this.selectedFile = file;
                }
            }
        },
        addFiles(files) {
            for (const file of files) {
                if (file.type !== 'application/pdf') {
                    alert(`"${file.name}" is not a PDF and was skipped.`);
                    continue;
                }
                if (this.selectedFiles.length >= 5) {
                    alert('Maximum 5 files allowed. Extra files were not added.');
                    break;
                }
                // Check for duplicate filenames
                if (this.selectedFiles.some(f => f.file.name === file.name && f.file.size === file.size)) {
                    continue; // Skip duplicate
                }
                this.selectedFiles.push({
                    file: file,
                    role: 'full' // Default role
                });
            }
        },
        removeFile(idx) {
            this.selectedFiles.splice(idx, 1);
        },
        // --- Upload Submission ---
        submitUpload() {
            if (this.isUploading) return;

            if (this.isMultiMode) {
                this.submitMultiUpload();
            } else {
                this.submitSingleUpload();
            }
        },
        submitSingleUpload() {
            if (!this.selectedFile) {
                this.triggerFileInput();
                return;
            }
            this.isUploading = true;
            this.ocrStatusMessage = 'Uploading file...';
            const formData = new FormData();
            formData.append('upload_file', this.selectedFile);
            formData.append('type', this.selectedUploadType);
            
            ApiService.post('/user/upload-awb-file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((response) => {
                if (response.data && response.data.job_id) {
                    this.ocrJobId = response.data.job_id;
                    this.ocrStatusMessage = 'File loaded. Analyzing...';
                    this.startOcrPolling(response.data.job_id);
                } else {
                    throw new Error('Failed to generate job reference ID.');
                }
            }).catch(error => {
                this.isUploading = false;
                this.ocrStatusMessage = '';
                const input = this.getActiveFileInput();
                if (input) input.value = '';
                if (error.response && error.response.status === 429) {
                    alert('Speed limit reached! Please wait a minute before your next upload to protect server capacity.');
                } else {
                    alert('Encountered failure preparing document for analysis.');
                }
            });
        },
        submitMultiUpload() {
            if (this.selectedFiles.length === 0) {
                this.triggerFileInput();
                return;
            }
            this.isUploading = true;
            this.ocrStatusMessage = `Uploading ${this.selectedFiles.length} document(s)...`;

            const formData = new FormData();
            const roles = [];

            this.selectedFiles.forEach((entry, idx) => {
                formData.append('upload_files[]', entry.file);
                roles.push({ index: idx, role: entry.role });
            });
            formData.append('roles', JSON.stringify(roles));

            ApiService.post('/user/upload-awb-files-multi', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((response) => {
                if (response.data && response.data.job_id) {
                    this.ocrJobId = response.data.job_id;
                    this.ocrStatusMessage = `${this.selectedFiles.length} files loaded. AI extraction in progress...`;
                    this.startOcrPolling(response.data.job_id);
                } else {
                    throw new Error('Failed to generate job reference ID.');
                }
            }).catch(error => {
                this.isUploading = false;
                this.ocrStatusMessage = '';
                if (error.response && error.response.status === 429) {
                    alert('Speed limit reached! Please wait before your next upload.');
                } else if (error.response && error.response.status === 403) {
                    alert('Multi-document upload requires Viper Tactical or Command subscription.');
                } else {
                    alert('Encountered failure preparing documents for analysis.');
                }
            });
        },
        startOcrPolling(jobId) {
            this.stopOcrPolling();
            this.ocrPollInterval = setInterval(() => {
                ApiService.get(`/user/ocr-status/${jobId}`)
                .then(res => {
                    const data = res.data;
                    if (data.job_status === 'processing') {
                        this.ocrStatusMessage = this.isMultiMode 
                            ? 'Merging extracted data from all documents...'
                            : 'Extracting IATA fields...';
                    }

                    if (data.job_status === 'completed') {
                        this.stopOcrPolling();
                        this.ocrStatusMessage = '';
                        this.isUploading = false;
                        if (!this.isDrawer) {
                            this.$bvModal.hide('upload-file-modal');
                        } else {
                            this.showInline = false;
                        }
                        this.$emit('extracted', data.data);
                        this.resetModal();
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
        },
        resetModal() {
            this.selectedFile = null;
            this.selectedFiles = [];
            this.isUploading = false;
            this.ocrStatusMessage = '';
            this.ocrJobId = null;
            this.dragActive = false;
            const input = this.getActiveFileInput();
            if (input) {
                input.value = '';
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

    /* Multi-mode dropzone */
    .upload-dropzone-multi {
        border: 2px dashed #355594;
        border-radius: 20px;
        padding: 40px 20px;
        background: rgba(53, 85, 148, 0.02);
        transition: all 0.3s ease;
    }
    .upload-dropzone-multi:hover {
        background: rgba(53, 85, 148, 0.05);
        border-color: #28447a;
    }
    .upload-dropzone-multi.drag-active {
        background: rgba(53, 85, 148, 0.08);
        border-color: #28447a;
        border-style: solid;
        transform: scale(1.01);
    }

    /* File chips */
    .file-list-container {
        max-height: 280px;
        overflow-y: auto;
    }
    .file-chip {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        transition: all 0.2s ease;
    }
    .file-chip:hover {
        background: #f0f4ff;
        border-color: #c7d2fe;
        box-shadow: 0 2px 8px rgba(53, 85, 148, 0.08);
    }
    .file-chip-icon {
        width: 40px;
        height: 40px;
        background: #fef2f2;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .role-select {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-weight: 600;
        color: #355594;
        font-size: 0.8rem;
        cursor: pointer;
    }
    .role-select:focus {
        border-color: #355594;
        box-shadow: 0 0 0 2px rgba(53, 85, 148, 0.15);
    }
    .remove-file-btn {
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    .remove-file-btn:hover {
        background: #fef2f2 !important;
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

/* Inline drawer panel styles */
.inline-upload-panel {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 50% !important;
    height: 100vh !important;
    background: #ffffff !important;
    z-index: 1050 !important;
    display: flex !important;
    flex-direction: column !important;
    border-radius: 0 !important;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.08) !important;
    overflow: hidden !important;
}
@media (max-width: 1200px) {
    .inline-upload-panel {
        width: 70% !important;
    }
}
@media (max-width: 991px) {
    .inline-upload-panel {
        width: 100% !important;
    }
}

.inline-layout {
    display: flex !important;
    flex-direction: row !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 100% !important;
    position: relative !important;
}

.inline-right-pane {
    flex: 0 0 100% !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    background: white !important;
}

.inline-upload-panel .form-scroll-container {
    height: 100% !important;
    overflow-y: auto !important;
    padding: 3rem 2.5rem !important;
    width: 100% !important;
}

/* Slide in from right transition overrides */
.slide-in-right-enter-active, .slide-in-right-leave-active {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.slide-in-right-enter, .slide-in-right-leave-to {
    transform: translateX(100%) !important;
}
</style>
