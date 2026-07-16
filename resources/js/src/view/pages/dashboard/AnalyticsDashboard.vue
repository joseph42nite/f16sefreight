<template>
    <div>
        <!-- Sales role sees their dedicated branch analytics dashboard -->
        <SalesAnalyticsDashboard v-if="isSalesRole" />

        <!-- Boss role sees company-wide analytics dashboard -->
        <BossAnalyticsDashboard v-else-if="isBossRole" />

        <!-- All other roles see the original ops/boss analytics dashboard -->
        <b-container v-else fluid class="body-color">
        <div class="d-flex flex-column flex-lg-row">
            <SideBar></SideBar>
            <div class="main-content-area ml-lg-4 mt-4 mt-lg-0">
                <!-- Header -->
                <div class="container py-8 px-6 px-sm-8 px-md-10">
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div class="d-flex flex-column">
                            <span class="sub-header-text">Operations & Sales Intelligence</span>
                            <h6 class="main-header-title">Analytics Dashboard</h6>
                        </div>
                        <!-- Filters -->
                        <div class="d-flex align-items-center mt-3 mt-md-0" v-if="!isViperCore">
                            <b-form-select v-model="filterTransportMode" class="filter-select mr-2" size="sm" @change="fetchData">
                                <option value="">All Modes</option>
                                <option value="air">Focus Air</option>
                                <option value="sea">Focus Sea</option>
                            </b-form-select>
                            <b-form-select v-model="filterPeriod" class="filter-select" size="sm" @change="fetchData">
                                <option value="daily">Daily View</option>
                                <option value="monthly">Monthly View</option>
                                <option value="yearly">Yearly View</option>
                            </b-form-select>
                        </div>
                    </div>
                </div>

                <hr class="separator-line" />

                <!-- Tier 1 Core Locked Teaser -->
                <div v-if="isViperCore" class="container py-12 px-6 px-sm-8 px-md-10 text-center">
                    <div class="teaser-container mx-auto py-10 px-8 rounded-lg shadow-lg">
                        <div class="icon-circle mb-6 mx-auto">
                            <b-icon icon="shield-lock-fill" font-scale="3" class="lock-icon"></b-icon>
                        </div>
                        <h3 class="teaser-title mb-4">Upgrade to Unlock Analytics</h3>
                        <p class="teaser-description mb-6 mx-auto">
                            Unlock dynamic conversion funnels, lost reason pie charts, average response latency indicators, staff workload indicators, and on-demand Gemini AI client summaries.
                        </p>
                        <b-button class="upgrade-btn px-8 py-3" variant="primary">
                            Upgrade to Viper Tactical
                        </b-button>
                    </div>
                </div>

                <!-- Active Dashboard -->
                <div v-else class="container-fluid py-6 px-6 px-sm-8 px-md-10">
                    <b-overlay :show="loading" rounded="lg" opacity="0.6">
                        <!-- Top Summary Cards -->
                        <b-row class="mb-8">
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Jobs Raised</span>
                                    <div class="metric-value text-primary">{{ totals.raised }}</div>
                                    <span class="metric-subtext">Total inquiries triaged</span>
                                </div>
                            </b-col>
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Jobs Replied</span>
                                    <div class="metric-value text-success">{{ totals.replied }}</div>
                                    <span class="metric-subtext">Proposals or replies sent</span>
                                </div>
                            </b-col>
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Jobs Converted</span>
                                    <div class="metric-value text-info">{{ totals.converted }}</div>
                                    <span class="metric-subtext">Moved to executed jobs</span>
                                </div>
                            </b-col>
                            <b-col md="3">
                                <div class="metric-card shadow-sm border-danger-left">
                                    <span class="metric-label">Pending SLA Breaches</span>
                                    <div class="metric-value text-danger">{{ totals.pending_sla_breached }}</div>
                                    <span class="metric-subtext">> 15 min without reply</span>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- Chart Section -->
                        <b-row class="mb-8">
                            <b-col lg="8" class="mb-8 mb-lg-0">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">Enquiry Conversion Funnel</h5>
                                    <apexchart type="bar" height="350" :options="funnelChartOptions" :series="funnelChartSeries"></apexchart>
                                </div>
                            </b-col>
                            <b-col lg="4">
                                <div class="chart-container shadow-sm h-100">
                                    <h5 class="chart-title">Inquiry Drop-off (Lost Reasons)</h5>
                                    <apexchart type="donut" height="350" :options="lostChartOptions" :series="lostChartSeries" v-if="lostChartSeries.length > 0"></apexchart>
                                    <div v-else class="d-flex align-items-center justify-content-center h-75 text-muted">
                                        No lost data recorded in this range.
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- Secondary Metrics Section -->
                        <b-row class="mb-8">
                            <b-col lg="6" class="mb-8 lg-mb-0">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">Average SLA Response Time (Latency)</h5>
                                    <apexchart type="line" height="300" :options="responseTimeOptions" :series="responseTimeSeries"></apexchart>
                                </div>
                            </b-col>
                            <b-col lg="6">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">Operator Load Index (OLI) & Staff Load</h5>
                                    <div class="staff-list">
                                        <div v-for="staff in staffLoad" :key="staff.operator_id" class="staff-row d-flex justify-content-between align-items-center py-3 border-bottom">
                                            <div class="d-flex flex-column">
                                                <span class="staff-name">{{ staff.name }}</span>
                                                <span class="staff-desg">{{ staff.designation || 'Operator' }} • {{ staff.active_jobs_count }} active jobs</span>
                                            </div>
                                            <div class="text-right">
                                                <div class="oli-badge" :class="getOliClass(staff.oli_score)">
                                                    OLI: {{ staff.oli_score }}
                                                </div>
                                                <span class="oli-indicator-text" :class="getOliTextClass(staff.oli_score)">
                                                    {{ getOliStatusText(staff.oli_score) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div v-if="staffLoad.length === 0" class="py-5 text-center text-muted">
                                            No operator logs found for this branch.
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- Client Summary and Lane AI Leads -->
                        <b-row>
                            <b-col lg="6" class="mb-8 lg-mb-0">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">On-Demand Client Activity Summary</h5>
                                    <p class="text-muted small">Select a customer profile to compile an on-demand Gemini AI quarterly report.</p>
                                    <div class="d-flex align-items-center mb-4">
                                        <b-form-select v-model="selectedClientId" class="mr-2">
                                            <option :value="null">-- Select Customer --</option>
                                            <option v-for="client in clients" :key="client.id" :value="client.id">
                                                {{ client.name }}
                                            </option>
                                        </b-form-select>
                                        <b-button variant="primary" @click="generateClientSummary" :disabled="!selectedClientId || summaryLoading" class="px-5">
                                            <b-spinner small class="mr-2" v-if="summaryLoading"></b-spinner>
                                            Generate AI
                                        </b-button>
                                    </div>
                                    <div v-if="clientSummary" class="ai-summary-box p-4 rounded mt-3">
                                        <h6 class="mb-2 text-primary font-weight-bold">Gemini AI Analysis:</h6>
                                        <div class="ai-text-content" v-html="formattedSummary"></div>
                                    </div>
                                </div>
                            </b-col>
                            <b-col lg="6">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">AI Opportunity Engine (Lane Consolidation Leads)</h5>
                                    <div class="ai-opportunity-alert p-4 rounded mb-3">
                                        <div class="d-flex align-items-start">
                                            <b-icon icon="lightbulb-fill" class="text-warning mr-3 font-scale-1.5 mt-1"></b-icon>
                                            <div>
                                                <h6 class="font-weight-bold mb-1 text-primary">Consolidation Alert: Frankfurt Lane Expansion</h6>
                                                <p class="mb-0 text-muted small">
                                                    Client <strong>Command Logix</strong> shipped general cargo to London Heathrow (LHR) 5 times in the last 7 days. We recommend offering a consolidated container tariff to increase margins by up to 35%.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ai-opportunity-alert p-4 rounded">
                                        <div class="d-flex align-items-start">
                                            <b-icon icon="lightbulb-fill" class="text-warning mr-3 font-scale-1.5 mt-1"></b-icon>
                                            <div>
                                                <h6 class="font-weight-bold mb-1 text-primary">Credit Alert: Chennai Core Logix</h6>
                                                <p class="mb-0 text-muted small">
                                                    Client <strong>Core Logix</strong> outstanding receivables have reached 83% of their set credit limit. Coordinate collection follow-ups before the system freezes pending releases.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>
                    </b-overlay>
                </div>
            </div>
        </div>
        </b-container>
    </div>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import SalesAnalyticsDashboard from "@/view/pages/dashboard/SalesAnalyticsDashboard.vue";
import BossAnalyticsDashboard from "@/view/pages/dashboard/BossAnalyticsDashboard.vue";
import VueApexCharts from "vue-apexcharts";
import ApiService from "@/core/services/api.service";

export default {
    name: "AnalyticsDashboard",
    components: {
        SideBar,
        SalesAnalyticsDashboard,
        BossAnalyticsDashboard,
        apexchart: VueApexCharts
    },
    data() {
        return {
            loading: false,
            summaryLoading: false,
            filterTransportMode: "",
            filterPeriod: "daily",
            totals: {
                raised: 0,
                replied: 0,
                converted: 0,
                pending_sla_breached: 0
            },
            funnelChartSeries: [],
            funnelChartOptions: {
                chart: {
                    type: 'bar',
                    toolbar: { show: false }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: { enabled: false },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: [],
                },
                yaxis: {
                    title: { text: 'Shipments' }
                },
                fill: { opacity: 1 },
                colors: ['#355594', '#10B981', '#3B82F6', '#EF4444']
            },
            lostChartSeries: [],
            lostChartOptions: {
                chart: { type: 'donut' },
                labels: [],
                colors: ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: { width: 200 },
                        legend: { position: 'bottom' }
                    }
                }]
            },
            responseTimeSeries: [],
            responseTimeOptions: {
                chart: {
                    type: 'line',
                    toolbar: { show: false }
                },
                stroke: { width: 3, curve: 'smooth' },
                xaxis: { categories: [] },
                yaxis: {
                    title: { text: 'Minutes' }
                },
                colors: ['#F59E0B']
            },
            staffLoad: [],
            clients: [],
            selectedClientId: null,
            clientSummary: null
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        isSalesRole() {
            return this.currentUser && this.currentUser.designation === 'sales';
        },
        isBossRole() {
            return this.currentUser && this.currentUser.designation === 'boss';
        },
        companyTier() {
            return this.currentUser && this.currentUser.company ? this.currentUser.company.tier : 'viper_core';
        },
        isViperCore() {
            return this.companyTier === 'viper_core';
        },
        formattedSummary() {
            if (!this.clientSummary) return '';
            // Basic markdown-to-html conversion for display
            return this.clientSummary
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/### (.*?)\n/g, '<h6 class="mt-3 font-weight-bold text-dark">$1</h6>')
                .replace(/- (.*?)\n/g, '<li class="ml-3">$1</li>')
                .replace(/\n/g, '<br />');
        }
    },
    mounted() {
        // Sales and Boss roles are handled by their own dedicated dashboards
        if (this.isSalesRole || this.isBossRole) return;

        const isExcluded = this.currentUser && (this.currentUser.designation === 'operations' || this.currentUser.designation === 'pricing');
        if (isExcluded) {
            this.$router.push('/inbox');
            return;
        }
        if (!this.isViperCore) {
            this.fetchData();
            this.fetchClients();
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            const params = {
                transport_mode: this.filterTransportMode,
                period: this.filterPeriod
            };

            // Funnel Metrics
            ApiService.query('/user/analytics/funnel', { params })
                .then(res => {
                    if (res.data.status) {
                        const rawData = res.data.data;
                        this.totals = res.data.totals;
 
                        // Setup funnel chart
                        this.funnelChartOptions = {
                            ...this.funnelChartOptions,
                            xaxis: {
                                categories: rawData.map(item => item.period)
                            }
                        };
                        this.funnelChartSeries = [
                            { name: 'Jobs Raised', data: rawData.map(item => item.raised) },
                            { name: 'Jobs Replied', data: rawData.map(item => item.replied) },
                            { name: 'Jobs Converted', data: rawData.map(item => item.converted) },
                            { name: 'SLA Breached', data: rawData.map(item => item.pending_sla_breached) }
                        ];
                    }
                })
                .catch(err => console.error(err));
 
            // Lost Reasons
            ApiService.query('/user/analytics/lost-reasons', { params })
                .then(res => {
                    if (res.data.status) {
                        const rawData = res.data.data;
                        this.lostChartSeries = rawData.map(item => item.total);
                        this.lostChartOptions = {
                            ...this.lostChartOptions,
                            labels: rawData.map(item => item.lost_reason)
                        };
                    }
                })
                .catch(err => console.error(err));
 
            // Response Times
            ApiService.query('/user/analytics/response-times', { params })
                .then(res => {
                    if (res.data.status) {
                        const rawData = res.data.data;
                        this.responseTimeOptions = {
                            ...this.responseTimeOptions,
                            xaxis: {
                                categories: rawData.map(item => item.date_group)
                            }
                        };
                        // Convert response times from seconds to minutes
                        this.responseTimeSeries = [
                            {
                                name: 'Avg Reply Time',
                                data: rawData.map(item => roundToDecimals(item.avg_latency_seconds / 60, 1))
                            }
                        ];
                    }
                })
                .catch(err => console.error(err));
 
            // Staff Load
            ApiService.get('/user/analytics/staff-load')
                .then(res => {
                    if (res.data.status) {
                        this.staffLoad = res.data.data;
                    }
                })
                .catch(err => console.error(err))
                .finally(() => {
                    this.loading = false;
                });
        },
        fetchClients() {
            ApiService.get('/companies')
                .then(res => {
                    this.clients = res.data;
                })
                .catch(err => console.error(err));
        },
        generateClientSummary() {
            this.summaryLoading = true;
            this.clientSummary = null;
            ApiService.query('/user/analytics/client-summary', {
                params: { client_id: this.selectedClientId }
            })
            .then(res => {
                if (res.data.status) {
                    this.clientSummary = res.data.summary;
                }
            })
            .catch(err => {
                console.error(err);
                this.clientSummary = "Error: Failed to fetch analysis summary.";
            })
            .finally(() => {
                this.summaryLoading = false;
            });
        },
        getOliClass(score) {
            if (score >= 15.0) return 'oli-danger';
            if (score >= 8.0) return 'oli-warning';
            return 'oli-success';
        },
        getOliTextClass(score) {
            if (score >= 15.0) return 'text-danger font-weight-bold';
            if (score >= 8.0) return 'text-warning font-weight-bold';
            return 'text-success font-weight-bold';
        },
        getOliStatusText(score) {
            if (score >= 15.0) return '🔴 OVERLOADED';
            if (score >= 8.0) return '🟡 HEAVY LOAD';
            return '🟢 OPTIMAL';
        }
    }
};

function roundToDecimals(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
</script>

<style scoped>
.body-color {
    padding-bottom: 3rem;
}

.main-content-area {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);
    border-radius: 32px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
}

.sub-header-text {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #355594;
    opacity: 0.6;
    margin-bottom: 0.5rem;
    display: block;
}

.main-header-title {
    color: #355594;
    font-size: 26px;
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

.separator-line {
    border: 0;
    border-top: 1px solid rgba(53, 85, 148, 0.12);
    margin: 0;
}

/* Upgrade Card */
.teaser-container {
    max-width: 600px;
    background: linear-gradient(135deg, #f8fafd 0%, #ffffff 100%);
    border: 1px solid rgba(53, 85, 148, 0.15);
    border-radius: 24px;
}

.icon-circle {
    width: 90px;
    height: 90px;
    background: linear-gradient(135deg, #a5c7f7 0%, #355594 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.2);
}

.teaser-title {
    color: #355594;
    font-weight: 800;
    font-family: 'Inter', sans-serif;
}

.teaser-description {
    color: #64748b;
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 480px;
}

.upgrade-btn {
    background: linear-gradient(135deg, #355594 0%, #1e3a8a 100%) !important;
    border: none !important;
    border-radius: 12px;
    font-weight: 700;
    box-shadow: 0 8px 16px rgba(53, 85, 148, 0.25);
    transition: all 0.3s ease;
}

.upgrade-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(53, 85, 148, 0.35);
}

/* Metric Cards */
.metric-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(53, 85, 148, 0.08);
    transition: transform 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-4px);
}

.metric-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.metric-value {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.2;
    margin: 0.5rem 0;
}

.metric-subtext {
    font-size: 0.8rem;
    color: #94a3b8;
}

.border-danger-left {
    border-left: 4px solid #ef4444;
}

/* Chart Box */
.chart-container {
    background: white;
    border-radius: 20px;
    padding: 1.75rem;
    border: 1px solid rgba(53, 85, 148, 0.08);
}

.chart-title {
    color: #1e293b;
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    font-family: 'Inter', sans-serif;
}

/* Staff Load List */
.staff-list {
    max-height: 280px;
    overflow-y: auto;
}

.staff-name {
    font-weight: 700;
    color: #1e293b;
    font-size: 0.95rem;
}

.staff-desg {
    font-size: 0.8rem;
    color: #64748b;
}

.oli-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 700;
}

.oli-success {
    background-color: #d1fae5;
    color: #065f46;
}

.oli-warning {
    background-color: #fef3c7;
    color: #92400e;
}

.oli-danger {
    background-color: #fee2e2;
    color: #991b1b;
}

.oli-indicator-text {
    font-size: 0.75rem;
    display: block;
    margin-top: 2px;
}

/* AI Elements */
.ai-summary-box {
    background: #f0f7ff;
    border: 1px solid rgba(59, 130, 246, 0.2);
}

.ai-text-content {
    color: #334155;
    font-size: 0.95rem;
    line-height: 1.6;
}

.ai-opportunity-alert {
    background: #fffbeb;
    border: 1px solid rgba(245, 158, 11, 0.2);
}
</style>
