<template>
    <b-modal :id="id" :title="title" :hide-footer="true" centered size="lg" modal-class="premium-modal" title-class="font-weight-bolder text-dark" header-class="border-bottom-0 pb-0 px-5 pt-5">
        <div class="history-list p-5">
            <div v-if="isFetching" class="text-center py-20 d-flex flex-column align-items-center">
                <b-spinner style="width: 3rem; height: 3rem; color: #355594;" label="Loading..."></b-spinner>
                <p class="mt-4 font-weight-bold" style="color: #355594; font-size: 1.1rem;">Loading your data...</p>
            </div>
            <template v-else>
                <!-- Empty State -->
                <div v-if="!items || items.length === 0" class="text-center py-12">
                    <div class="empty-icon-wrap mb-4 mx-auto">
                        <b-icon :icon="mode === 'draft' ? 'inbox' : 'chat-dots'" font-scale="2.5"></b-icon>
                    </div>
                    <h5 class="font-weight-bold text-dark mb-2">No records found</h5>
                    <p class="text-muted">You don't have any {{ mode === 'draft' ? 'drafts' : 'messages' }} right now.</p>
                </div>

                <!-- The List Loop -->
                <div v-for="item in items" :key="item.id" 
                     class="history-card mb-4" 
                     :class="mode === 'draft' ? 'draft-card' : 'send-card'">
                    
                    <div class="d-flex align-items-center justify-content-between">
                        <!-- Main Info Group -->
                        <div class="d-flex align-items-center" 
                             :style="docType === 'consolidation' ? 'cursor: pointer;' : ''"
                             @click="handleMainClick(item)">
                            
                            <!-- Premium Icon Wrapper -->
                            <div class="icon-wrapper mr-4 shadow-sm">
                                <b-icon :icon="mode === 'draft' ? 'file-earmark-text' : 'clock-history'" 
                                        font-scale="1.3"></b-icon>
                            </div>
                            
                            <div class="info-content">
                                <!-- Dynamic Identification Rendering -->
                                <h6 class="mb-1 font-weight-bold awb-title">
                                    <template v-if="docType === 'house'">{{ item.id }}</template>
                                    <template v-else>{{ item.awb_code }}-{{ item.awb_no }}</template>
                                </h6>
                                <!-- Dynamic Routing Path Rendering -->
                                <div class="route-badge mt-2 d-inline-flex align-items-center px-3 py-1 rounded-pill shadow-sm">
                                    <b-icon icon="geo-alt-fill" class="mr-2 route-icon"></b-icon>
                                    <span class="font-weight-bold">{{ getAirport(item.departure_airport) }}</span>
                                    <b-icon icon="arrow-right-short" class="mx-1"></b-icon>
                                    <span class="font-weight-bold">{{ getAirport(item.destination_airport) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Right Action Area Slot -->
                        <slot name="actions" :item="item">
                            <div class="d-flex">
                                <button @click="$emit('action', item)" class="premium-btn px-4 py-2 shadow-sm">
                                    {{ mode === 'draft' ? 'Edit Draft' : 'View Details' }}
                                    <b-icon icon="arrow-right" class="ml-2 icon-hover-slide"></b-icon>
                                </button>
                            </div>
                        </slot>
                    </div>

                    <!-- Quick Download Strip (Only active on 'Send' lists) -->
                    <div v-if="mode !== 'draft'" class="download-strip mt-4 pt-3 d-flex flex-wrap align-items-center border-top-light">
                        <span class="text-muted small font-weight-bold mr-3 text-uppercase tracking-wide">Generate:</span>
                        
                        <!-- Consolidation Downloads -->
                        <template v-if="docType === 'consolidation'">
                            <a :href="`/download-consolidation-pdf/${String(item.awb_code)}/${String(item.awb_no)}`" target="_blank" class="download-link">
                                <b-icon icon="file-earmark-pdf" class="mr-2"></b-icon> Consolidation PDF
                            </a>
                            <a :href="`/download-multiple-consolidation-pdf/${String(item.awb_code)}/${String(item.awb_no)}`" target="_blank" class="download-link">
                                <b-icon icon="files" class="mr-2"></b-icon> Multipage PDF
                            </a>
                        </template>

                        <!-- House WayBill Downloads -->
                        <template v-else-if="docType === 'house'">
                            <a :href="`/download-hawb-pdf/${item.id}`" target="_blank" class="download-link">
                                <b-icon icon="file-earmark-pdf" class="mr-2"></b-icon> PDF
                            </a>
                            <a :href="`/download-multiple-hawb-pdf/${item.id}`" target="_blank" class="download-link">
                                <b-icon icon="files" class="mr-2"></b-icon> Multi-PDF
                            </a>
                            <a :href="`/download-multiple-both-page-hawb-pdf/${item.id}`" target="_blank" class="download-link">
                                <b-icon icon="book" class="mr-2"></b-icon> Multi-PDF (Back)
                            </a>
                        </template>

                        <!-- Master Airway Bill (FocusAir) Downloads -->
                        <template v-else>
                            <a :href="`/download-awb-pdf/${item.id}`" target="_blank" class="download-link">
                                <b-icon icon="file-earmark-pdf" class="mr-2"></b-icon> PDF
                            </a>
                            <a :href="`/download-multiple-awb-pdf/${item.id}`" target="_blank" class="download-link">
                                <b-icon icon="files" class="mr-2"></b-icon> Multi-PDF
                            </a>
                            <a :href="`/download-multiple-both-page-awb-pdf/${item.id}`" target="_blank" class="download-link">
                                <b-icon icon="book" class="mr-2"></b-icon> Multi-PDF (Back)
                            </a>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: "DashboardHistoryModal",
    props: {
        id: { type: String, required: true },
        title: { type: String, required: true },
        mode: { type: String, default: 'send' }, // 'draft' or 'send'
        docType: { type: String, required: true }, // 'master', 'house', 'consolidation'
        items: { type: Array, default: () => [] },
        isFetching: { type: Boolean, default: false }
    },
    methods: {
        getAirport(val) {
            if (!val) return "-";
            return val.split(',')[0].trim();
        },
        handleMainClick(item) {
            if (this.docType === 'consolidation') {
                this.$emit('action', item);
            }
        }
    }
}
</script>

<style scoped>
/* Card Base Styling */
.history-card {
    padding: 1.5rem;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
}

.history-card:hover {
    box-shadow: 0 8px 20px rgba(53, 85, 148, 0.08);
}

/* Card Variations */
.draft-card {
    background: #fafcff;
    border: 1px solid #eef2f7;
}

.send-card {
    background: #f4f9ff;
    border: 1px solid #e0eeff;
}

/* Icon Wrapper */
.icon-wrapper {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: #355594;
    background: #ffffff;
    border: 1px solid rgba(53, 85, 148, 0.1);
}

.draft-card .icon-wrapper {
    color: #4a5568;
}

/* Typography */
.awb-title {
    color: #1e3a6e;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
}

/* Route Badge Pill */
.route-badge {
    background: #ffffff;
    border: 1px solid rgba(53, 85, 148, 0.15);
    font-size: 0.8rem;
    color: #355594;
}

.route-icon {
    color: #647cae;
}

/* Premium Action Button */
.premium-btn {
    background: #355594;
    color: #ffffff;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
}

.premium-btn:hover {
    background: #1e3a6e;
}

/* Download Strip Styles */
.border-top-light {
    border-top: 1px dashed rgba(53, 85, 148, 0.15);
}

.tracking-wide {
    letter-spacing: 1px;
}

.download-link {
    background: rgba(53, 85, 148, 0.05);
    color: #355594;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none !important;
    display: inline-flex;
    align-items: center;
    margin-right: 12px;
    border: 1px solid transparent;
}

.download-link:hover {
    background: #ffffff;
    border-color: rgba(53, 85, 148, 0.2);
    box-shadow: 0 4px 6px rgba(53, 85, 148, 0.05);
    color: #1e3a6e;
}

/* Empty State Styling */
.empty-icon-wrap {
    width: 80px;
    height: 80px;
    background: #f4f9ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a0aec0;
}
</style>
