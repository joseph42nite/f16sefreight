<template>
    <div class="d-flex flex-column flex-md-row">
        <div class="main-content-area flex-fill py-8 px-6 px-sm-8 px-md-10">
            <!-- Staleness Alert Banner -->
            <b-alert v-if="snapshotStatus && snapshotStatus.is_stale" show variant="warning" class="staleness-alert d-flex align-items-center mb-6">
                <b-icon icon="exclamation-triangle-fill" class="mr-3 font-scale-1.3"></b-icon>
                <div>
                    <h6 class="font-weight-bold mb-0">Financial snapshot data is stale</h6>
                    <span class="small text-muted">Last computed at: {{ formatDate(snapshotStatus.last_computed_at) }}. Run reconciliation or wait for scheduled update.</span>
                </div>
            </b-alert>

            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center flex-wrap mb-8">
                <div class="d-flex flex-column">
                    <span class="sub-header-text">Macro Organization Audit</span>
                    <h1 class="main-header-title">Boss / Director Cockpit</h1>
                </div>
                <!-- Controls -->
                <div class="d-flex align-items-center mt-3 mt-md-0">
                    <b-form-select v-model="filterTransportMode" class="filter-select mr-2" size="sm" @change="fetchMetrics">
                        <option value="">All Modes</option>
                        <option value="air">Focus Air</option>
                        <option value="sea">Focus Sea</option>
                    </b-form-select>
                    <b-button variant="primary" @click="fetchMetrics" class="btn-sm rounded-pill px-4">
                        <b-icon icon="arrow-clockwise" class="mr-1"></b-icon> Refresh
                    </b-button>
                </div>
            </div>

            <!-- Funnel Overview -->
            <b-row class="mb-8">
                <b-col md="3" class="mb-4 mb-md-0">
                    <div class="boss-metric-card border-primary-left">
                        <span class="boss-metric-label">Raised (Org-Wide)</span>
                        <div class="boss-metric-value">{{ totals.raised }}</div>
                    </div>
                </b-col>
                <b-col md="3" class="mb-4 mb-md-0">
                    <div class="boss-metric-card border-success-left">
                        <span class="boss-metric-label">Replied (Org-Wide)</span>
                        <div class="boss-metric-value">{{ totals.replied }}</div>
                    </div>
                </b-col>
                <b-col md="3" class="mb-4 mb-md-0">
                    <div class="boss-metric-card border-info-left">
                        <span class="boss-metric-label">Converted (Org-Wide)</span>
                        <div class="boss-metric-value">{{ totals.converted }}</div>
                    </div>
                </b-col>
                <b-col md="3">
                    <div class="boss-metric-card border-danger-left">
                        <span class="boss-metric-label">Delayed SLA (Org-Wide)</span>
                        <div class="boss-metric-value">{{ totals.pending_sla_breached }}</div>
                    </div>
                </b-col>
            </b-row>

            <b-row class="mb-8">
                <!-- Branch Performance Matrix -->
                <b-col lg="8" class="mb-8 mb-lg-0">
                    <div class="boss-card shadow-sm h-100">
                        <h4 class="boss-card-title mb-6">Branch Comparative Performance Matrix</h4>
                        <b-overlay :show="loading" rounded="lg">
                            <b-table hover responsive :items="branchMatrix" :fields="matrixFields" class="boss-table">
                                <template #cell(raised)="data">
                                    <span class="font-weight-bold">{{ data.value }}</span>
                                </template>
                                <template #cell(conversion_rate)="data">
                                    <b-progress :value="data.value" max="100" show-value class="progress-bar-rate" variant="primary"></b-progress>
                                </template>
                            </b-table>
                        </b-overlay>
                    </div>
                </b-col>

                <!-- Target Assigner Form -->
                <b-col lg="4">
                    <div class="boss-card shadow-sm">
                        <h4 class="boss-card-title mb-6">Sales Target Assigner</h4>
                        <b-form @submit.prevent="submitSalesTarget">
                            <b-form-group label="Target Entity Type" label-for="target-type" class="small font-weight-bold">
                                <b-form-select id="target-type" v-model="targetForm.target_type" required @change="onTargetTypeChange">
                                    <option value="branch">Branch (Agent Location)</option>
                                    <option value="user">Individual User (Operator)</option>
                                </b-form-select>
                            </b-form-group>

                            <b-form-group label="Select Target" label-for="target-id" class="small font-weight-bold">
                                <b-form-select id="target-id" v-model="targetForm.target_id" required>
                                    <option :value="null">-- Select Entity --</option>
                                    <option v-for="entity in targetEntityList" :key="entity.id" :value="entity.id">
                                        {{ entity.name }}
                                    </option>
                                </b-form-select>
                            </b-form-group>

                            <b-form-group label="Target Quarter" label-for="quarter" class="small font-weight-bold">
                                <b-form-input id="quarter" v-model="targetForm.quarter" placeholder="e.g. 2026-Q3" required></b-form-input>
                            </b-form-group>

                            <b-row>
                                <b-col sm="6">
                                    <b-form-group label="Revenue (USD)" label-for="rev-target" class="small font-weight-bold">
                                        <b-form-input id="rev-target" type="number" step="0.01" v-model="targetForm.revenue_target" placeholder="50000"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group label="Tonnage (Tons)" label-for="ton-target" class="small font-weight-bold">
                                        <b-form-input id="ton-target" type="number" step="0.01" v-model="targetForm.tonnage_target" placeholder="25"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <b-button type="submit" variant="primary" block class="mt-4 rounded-pill py-2" :disabled="targetSaving">
                                <b-spinner small class="mr-2" v-if="targetSaving"></b-spinner>
                                Assign Targets
                            </b-button>
                        </b-form>
                    </div>
                </b-col>
            </b-row>

            <!-- AI Weekly Executive Brief Card -->
            <b-row class="mb-8">
                <b-col cols="12">
                    <div class="boss-card shadow-sm">
                        <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
                            <h4 class="boss-card-title mb-0">AI Weekly Executive Brief</h4>
                            <b-button variant="success" @click="generateWeeklyBrief" :disabled="briefLoading" class="rounded-pill px-5 btn-sm mt-3 mt-md-0">
                                <b-spinner small class="mr-2" v-if="briefLoading"></b-spinner>
                                <b-icon icon="cpu" class="mr-1" v-else></b-icon> Compile AI Brief
                            </b-button>
                        </div>
                        <p class="text-muted small">
                            A scheduled analysis summarizing system bottlenecks, Frankfurt lane increases, response latency shifts, and overdue milestones.
                        </p>
                        <hr />
                        <div v-if="executiveBrief" class="ai-brief-box p-5 rounded">
                            <h5 class="text-success font-weight-bold mb-3 d-flex align-items-center">
                                <b-icon icon="check-circle-fill" class="mr-2"></b-icon> Compiled Executive Brief
                            </h5>
                            <div class="ai-brief-content" v-html="formattedBrief"></div>
                        </div>
                        <div v-else class="py-10 text-center text-muted border rounded dotted-border">
                            No active weekly brief compiled yet. Click the button above to generate a brief.
                        </div>
                    </div>
                </b-col>
            </b-row>

            <!-- AI Macro Cash Flow & Payment Risk Audit -->
            <b-row class="mb-8">
                <b-col cols="12">
                    <div class="boss-card shadow-sm" style="border: 1px dashed #355594; background: rgba(248, 250, 252, 0.8);">
                        <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
                            <h4 class="boss-card-title mb-0 text-primary">
                                <b-icon icon="shield-shaded" class="mr-2"></b-icon> AI Cash Flow & Credit Risk Audit
                            </h4>
                            <b-button variant="info" @click="fetchCashFlowRisk" :disabled="riskLoading" class="rounded-pill px-5 btn-sm mt-3 mt-md-0 text-white">
                                <b-spinner small class="mr-2" v-if="riskLoading"></b-spinner>
                                <b-icon icon="cpu-fill" class="mr-1" v-else></b-icon> Run Risk Analysis
                            </b-button>
                        </div>
                        <p class="text-muted small">
                            Privacy-masked micro-auditing of client payment delays, unpaid credit exposure, and booking volume fluctuations across all active branches.
                        </p>
                        <hr />
                        <div v-if="cashFlowRisk" class="ai-brief-box p-5 rounded bg-white border">
                            <h5 class="text-info font-weight-bold mb-3 d-flex align-items-center">
                                <b-icon icon="exclamation-circle-fill" class="mr-2"></b-icon> Organization Credit Risk Analysis
                            </h5>
                            <div class="ai-brief-content font-size-sm text-dark" v-html="formattedRisk"></div>
                        </div>
                        <div v-else class="py-10 text-center text-muted border rounded dotted-border">
                            No macro cash flow risk assessment generated. Click the button above to analyze org-wide credit health.
                        </div>
                    </div>
                </b-col>
            </b-row>

            <!-- Sales Targets Listing Grid -->
            <b-row>
                <b-col cols="12">
                    <div class="boss-card shadow-sm">
                        <h4 class="boss-card-title mb-4">Sales Targets Tally</h4>
                        <b-overlay :show="loading" rounded="lg">
                            <b-table hover responsive :items="salesTargets" :fields="targetFields" class="boss-table">
                                <template #cell(revenue_target)="data">
                                    <span class="font-weight-bold text-dark">${{ formatCurrency(data.value) }}</span>
                                </template>
                                <template #cell(tonnage_target)="data">
                                    <span class="font-weight-bold text-muted">{{ data.value }} Tons</span>
                                </template>
                            </b-table>
                            <div v-if="salesTargets.length === 0" class="py-5 text-center text-muted">
                                No sales targets assigned yet.
                            </div>
                        </b-overlay>
                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import moment from "moment";

export default {
    name: "BossDashboard",
    data() {
        return {
            loading: false,
            briefLoading: false,
            targetSaving: false,
            filterTransportMode: "",
            totals: {
                raised: 0,
                replied: 0,
                converted: 0,
                pending_sla_breached: 0
            },
            snapshotStatus: null,
            branchMatrix: [],
            matrixFields: [
                { key: 'branch_name', label: 'Branch / Location', sortable: true },
                { key: 'raised', label: 'Inquiries (Raised)', sortable: true },
                { key: 'replied', label: 'Replied', sortable: true },
                { key: 'converted', label: 'Converted', sortable: true },
                { key: 'conversion_rate', label: 'Win Rate %', sortable: true }
            ],
            targetForm: {
                target_type: "branch",
                target_id: null,
                quarter: moment().format("YYYY") + "-Q" + moment().quarter(),
                revenue_target: "",
                tonnage_target: ""
            },
            targetEntityList: [],
            salesTargets: [],
            targetFields: [
                { key: 'quarter', label: 'Quarter', sortable: true },
                { key: 'target_type', label: 'Type', formatter: val => val.toUpperCase(), sortable: true },
                { key: 'name', label: 'Assigned Entity', sortable: true },
                { key: 'revenue_target', label: 'Revenue Target', sortable: true },
                { key: 'tonnage_target', label: 'Tonnage Target', sortable: true }
            ],
            executiveBrief: null,
            cashFlowRisk: null,
            riskLoading: false
        };
    },
    computed: {
        formattedBrief() {
            if (!this.executiveBrief) return '';
            return this.executiveBrief
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/### (.*?)\n/g, '<h6 class="mt-4 font-weight-bold text-dark">$1</h6>')
                .replace(/## (.*?)\n/g, '<h5 class="mt-4 font-weight-bold text-success">$1</h5>')
                .replace(/- (.*?)\n/g, '<li class="ml-3 mb-1">$1</li>')
                .replace(/\n/g, '<br />');
        },
        formattedRisk() {
            if (!this.cashFlowRisk) return '';
            return this.cashFlowRisk
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/### (.*?)\n/g, '<h6 class="mt-4 font-weight-bold text-primary">$1</h6>')
                .replace(/## (.*?)\n/g, '<h5 class="mt-4 font-weight-bold text-info">$1</h5>')
                .replace(/- (.*?)\n/g, '<li class="ml-3 mb-1">$1</li>')
                .replace(/\n/g, '<br />');
        }
    },
    mounted() {
        this.fetchMetrics();
        this.fetchTargetEntities();
        this.fetchSalesTargets();
    },
    methods: {
        fetchMetrics() {
            this.loading = true;
            const params = {
                transport_mode: this.filterTransportMode,
                period: 'monthly' // aggregated view for matrices
            };

            // Fetch funnel stats first
            ApiService.query('/superadmin/analytics/funnel', { params })
                .then(res => {
                    this.totals = res.data.totals;
                    this.snapshotStatus = res.data.snapshot_status;
                })
                .catch(err => console.error(err));
 
            // Load branches list and trigger comparative metrics queries
            ApiService.get('/superadmin/all-branch')
                .then(res => {
                    const branches = Array.isArray(res.data) ? res.data : [];
                    const promises = branches.map(b => {
                        return ApiService.query('/superadmin/analytics/funnel', {
                            params: {
                                ...params,
                                agent_id: b.id
                            }
                        })
                        .then(r => {
                            const tot = r.data.totals;
                            return {
                                branch_name: b.agent_name,
                                raised: tot.raised,
                                replied: tot.replied,
                                converted: tot.converted,
                                conversion_rate: tot.raised > 0 ? Math.round((tot.converted / tot.raised) * 100) : 0
                            };
                        });
                    });
 
                    Promise.all(promises).then(matrixData => {
                        this.branchMatrix = matrixData;
                    });
                })
                .catch(err => console.error(err))
                .finally(() => {
                    this.loading = false;
                });
        },
        fetchTargetEntities() {
            this.targetEntityList = [];
            this.targetForm.target_id = null;

            if (this.targetForm.target_type === 'branch') {
                ApiService.get('/superadmin/all-branch')
                    .then(res => {
                        const branches = Array.isArray(res.data) ? res.data : [];
                        this.targetEntityList = branches.map(b => ({ id: b.id, name: b.agent_name }));
                    })
                    .catch(err => console.error(err));
            } else {
                ApiService.get('/superadmin/all-user')
                    .then(res => {
                        // User indexes might return json array string or actual array
                        const rawUsers = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                        const users = Array.isArray(rawUsers) ? rawUsers : [];
                        this.targetEntityList = users.map(u => ({ id: u.id, name: u.name }));
                    })
                    .catch(err => console.error(err));
            }
        },
        onTargetTypeChange() {
            this.fetchTargetEntities();
        },
        fetchSalesTargets() {
            ApiService.get('/superadmin/analytics/sales-targets')
                .then(res => {
                    if (res.data.status) {
                        this.salesTargets = res.data.data;
                    }
                })
                .catch(err => console.error(err));
        },
        submitSalesTarget() {
            this.targetSaving = true;
            ApiService.post('/superadmin/analytics/sales-targets', this.targetForm)
                .then(res => {
                    if (res.data.status) {
                        this.$bvToast.toast("Sales target saved successfully.", {
                            title: "Success",
                            variant: "success",
                            solid: true
                        });
                        this.targetForm.revenue_target = "";
                        this.targetForm.tonnage_target = "";
                        this.fetchSalesTargets();
                    }
                })
                .catch(err => {
                    console.error(err);
                    const msg = err.response?.data?.error || "Failed to save target.";
                    this.$bvToast.toast(msg, {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.targetSaving = false;
                });
        },
        generateWeeklyBrief() {
            this.briefLoading = true;
            this.executiveBrief = null;
            ApiService.get('/superadmin/analytics/weekly-brief')
                .then(res => {
                    if (res.data.status) {
                        this.executiveBrief = res.data.brief;
                        this.$bvToast.toast("Weekly AI executive brief compiled.", {
                            title: "AI Compile Complete",
                            variant: "success",
                            solid: true
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    const msg = err.response?.data?.error || "AI compilation offline.";
                    this.$bvToast.toast(msg, {
                        title: "AI Failed",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.briefLoading = false;
                });
        },
        fetchCashFlowRisk() {
            this.riskLoading = true;
            this.cashFlowRisk = null;
            ApiService.get('/superadmin/analytics/cash-flow-risk')
                .then(res => {
                    if (res.data.status) {
                        this.cashFlowRisk = res.data.analysis;
                        this.$bvToast.toast("Macro payment risk audit completed.", {
                            title: "AI Risk Audit Complete",
                            variant: "info",
                            solid: true
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    const msg = err.response?.data?.error || "AI risk analysis offline.";
                    this.$bvToast.toast(msg, {
                        title: "Analysis Failed",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.riskLoading = false;
                });
        },
        formatDate(dateStr) {
            return moment(dateStr).format("YYYY-MM-DD HH:mm:ss");
        },
        formatCurrency(value) {
            return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }
};
</script>

<style scoped>
.main-content-area {
    background: #f8fafc;
    min-height: 100vh;
}

.staleness-alert {
    border-radius: 16px;
    border: 1px solid rgba(245, 158, 11, 0.2);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08);
}

.sub-header-text {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #475569;
    opacity: 0.7;
    margin-bottom: 0.5rem;
    display: block;
}

.main-header-title {
    color: #1e293b;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 0;
    font-family: 'Inter', sans-serif;
}

.filter-select {
    width: auto;
    border-radius: 20px;
    border: 1px solid rgba(53, 85, 148, 0.2);
    color: #355594;
    font-weight: 600;
    background-color: white;
}

/* Boss Metric Card */
.boss-metric-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(53, 85, 148, 0.08);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.boss-metric-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.boss-metric-value {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    margin-top: 0.25rem;
}

.border-primary-left { border-left: 4px solid #3b82f6; }
.border-success-left { border-left: 4px solid #10b981; }
.border-info-left { border-left: 4px solid #06b6d4; }
.border-danger-left { border-left: 4px solid #ef4444; }

/* Boss Cards */
.boss-card {
    background: white;
    border-radius: 24px;
    padding: 2rem;
    border: 1px solid rgba(53, 85, 148, 0.08);
}

.boss-card-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
    font-family: 'Inter', sans-serif;
}

/* Tables */
.boss-table {
    font-size: 0.9rem;
    color: #334155;
}

.boss-table th {
    font-weight: 700;
    color: #475569;
    border-top: none;
}

.progress-bar-rate {
    height: 16px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
}

/* AI Brief Box */
.ai-brief-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.ai-brief-content {
    font-size: 0.95rem;
    color: #334155;
    line-height: 1.7;
}

.dotted-border {
    border-style: dashed !important;
}
</style>
