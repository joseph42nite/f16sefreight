<template>
    <b-container fluid class="body-color">
        <div class="d-flex flex-column flex-lg-row">
            <SideBar></SideBar>
            <div class="main-content-area ml-lg-4 mt-4 mt-lg-0">

                <!-- Header -->
                <div class="container py-8 px-6 px-sm-8 px-md-10">
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div class="d-flex flex-column">
                            <span class="sub-header-text">Sales Intelligence</span>
                            <h6 class="main-header-title">Branch Analytics</h6>
                        </div>
                        <!-- Period Filter -->
                        <div class="d-flex align-items-center mt-3 mt-md-0" v-if="!isViperCore">
                            <b-form-select v-model="filterPeriod" class="filter-select mr-2" size="sm" @change="fetchAll">
                                <option value="daily">Daily View</option>
                                <option value="monthly">Monthly View</option>
                                <option value="yearly">Yearly View</option>
                            </b-form-select>
                            <b-form-select v-model="filterTransportMode" class="filter-select" size="sm" @change="fetchAll">
                                <option value="">All Modes</option>
                                <option value="air">Focus Air</option>
                                <option value="sea">Focus Sea</option>
                            </b-form-select>
                        </div>
                    </div>
                </div>

                <hr class="separator-line" />

                <!-- Viper Core Locked Teaser -->
                <div v-if="isViperCore" class="container py-12 px-6 px-sm-8 px-md-10 text-center">
                    <div class="teaser-container mx-auto py-10 px-8 rounded-lg shadow-lg">
                        <div class="icon-circle mb-6 mx-auto">
                            <b-icon icon="shield-lock-fill" font-scale="3" class="lock-icon"></b-icon>
                        </div>
                        <h3 class="teaser-title mb-4">Upgrade to Unlock Sales Analytics</h3>
                        <p class="teaser-description mb-6 mx-auto">
                            Access staff performance tracking, job enquiry funnels, SLA delay alerts, and month-on-month branch performance charts — all in one place.
                        </p>
                        <b-button class="upgrade-btn px-8 py-3" variant="primary">
                            Upgrade to Viper Tactical
                        </b-button>
                    </div>
                </div>

                <!-- Active Dashboard -->
                <div v-else class="container-fluid py-6 px-6 px-sm-8 px-md-10">
                    <b-overlay :show="loading" rounded="lg" opacity="0.6">

                        <!-- ─── SECTION A: Top KPI Cards ─── -->
                        <b-row class="mb-8">
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Jobs Raised</span>
                                    <div class="metric-value text-primary">{{ totals.raised }}</div>
                                    <span class="metric-subtext">Total enquiries this period</span>
                                </div>
                            </b-col>
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Jobs Replied</span>
                                    <div class="metric-value text-success">{{ totals.replied }}</div>
                                    <span class="metric-subtext">Proposals sent</span>
                                </div>
                            </b-col>
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Converted</span>
                                    <div class="metric-value text-info">{{ totals.converted }}</div>
                                    <span class="metric-subtext">Executed jobs</span>
                                </div>
                            </b-col>
                            <b-col md="3">
                                <div class="metric-card shadow-sm border-danger-left">
                                    <span class="metric-label">SLA Breaches</span>
                                    <div class="metric-value text-danger">{{ totals.pending_sla_breached }}</div>
                                    <span class="metric-subtext">> 15 min without reply</span>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- ─── SECTION B: Enquiry Funnel + Lost Reasons ─── -->
                        <b-row class="mb-8">
                            <b-col lg="8" class="mb-8 mb-lg-0">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">Enquiry Conversion Funnel</h5>
                                    <apexchart type="bar" height="320" :options="funnelChartOptions" :series="funnelChartSeries"></apexchart>
                                </div>
                            </b-col>
                            <b-col lg="4">
                                <div class="chart-container shadow-sm h-100">
                                    <h5 class="chart-title">Enquiry Drop-off (Lost Reasons)</h5>
                                    <apexchart type="donut" height="320" :options="lostChartOptions" :series="lostChartSeries" v-if="lostChartSeries.length > 0"></apexchart>
                                    <div v-else class="d-flex align-items-center justify-content-center h-75 text-muted small">
                                        No lost data recorded for this period.
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- ─── SECTION C: SLA Response Time + Alerts Panel ─── -->
                        <b-row class="mb-8">
                            <b-col lg="6" class="mb-8 mb-lg-0">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">Average SLA Response Time</h5>
                                    <apexchart type="line" height="280" :options="responseTimeOptions" :series="responseTimeSeries"></apexchart>
                                </div>
                            </b-col>
                            <b-col lg="6">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">
                                        <b-icon icon="exclamation-triangle-fill" class="text-warning mr-2"></b-icon>
                                        Delays & Alerts
                                    </h5>
                                    <div v-if="totals.pending_sla_breached > 0" class="alert-badge mb-4 d-flex align-items-center">
                                        <div class="traffic-dot dot-red mr-3"></div>
                                        <div>
                                            <span class="font-weight-bold text-danger">{{ totals.pending_sla_breached }} SLA Breach{{ totals.pending_sla_breached > 1 ? 'es' : '' }}</span>
                                            <span class="d-block small text-muted">Enquiries awaiting reply for > 15 min</span>
                                        </div>
                                    </div>
                                    <div v-else class="alert-badge-ok mb-4 d-flex align-items-center">
                                        <div class="traffic-dot dot-green mr-3"></div>
                                        <div>
                                            <span class="font-weight-bold text-success">All SLAs Met</span>
                                            <span class="d-block small text-muted">No pending breaches this period</span>
                                        </div>
                                    </div>

                                    <!-- Staff OLI health -->
                                    <h6 class="section-sub-title mb-3">Staff Workload (OLI)</h6>
                                    <div class="staff-list">
                                        <div
                                            v-for="staff in staffLoad"
                                            :key="staff.operator_id"
                                            class="staff-row d-flex justify-content-between align-items-center py-3 border-bottom"
                                        >
                                            <div class="d-flex align-items-center">
                                                <div class="traffic-dot mr-3" :class="getOliDotClass(staff.oli_score)"></div>
                                                <div class="d-flex flex-column">
                                                    <span class="staff-name">{{ staff.name }}</span>
                                                    <span class="staff-desg">{{ staff.designation || 'Operator' }} • {{ staff.active_jobs_count }} active</span>
                                                </div>
                                            </div>
                                            <div class="oli-badge" :class="getOliClass(staff.oli_score)">
                                                OLI {{ staff.oli_score }}
                                            </div>
                                        </div>
                                        <div v-if="staffLoad.length === 0" class="py-5 text-center text-muted small">
                                            No operator data found for this branch.
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- ─── SECTION D: Branch Month-on-Month ─── -->
                        <b-row class="mb-8">
                            <b-col lg="8" class="mb-8 mb-lg-0">
                                <div class="chart-container shadow-sm">
                                    <h5 class="chart-title">Branch Monthly Volume (Last 12 Months)</h5>
                                    <apexchart type="bar" height="300" :options="branchMoMOptions" :series="branchMoMSeries"></apexchart>
                                </div>
                            </b-col>
                            <b-col lg="4">
                                <div class="chart-container shadow-sm h-100">
                                    <h5 class="chart-title">Branch Performance Summary</h5>
                                    <div class="performance-summary">
                                        <div class="perf-item">
                                            <span class="perf-label">Best Month</span>
                                            <span class="perf-value text-success">{{ branchStats.bestMonth }}</span>
                                            <span class="perf-sub">{{ branchStats.bestMonthVolume }} jobs</span>
                                        </div>
                                        <div class="perf-divider"></div>
                                        <div class="perf-item">
                                            <span class="perf-label">Lowest Month</span>
                                            <span class="perf-value text-danger">{{ branchStats.worstMonth }}</span>
                                            <span class="perf-sub">{{ branchStats.worstMonthVolume }} jobs</span>
                                        </div>
                                        <div class="perf-divider"></div>
                                        <div class="perf-item">
                                            <span class="perf-label">Avg Conversion Rate</span>
                                            <span class="perf-value text-primary">{{ branchStats.avgConversionRate }}%</span>
                                            <span class="perf-sub">Raised → Converted</span>
                                        </div>
                                        <div class="perf-divider"></div>
                                        <div class="perf-item">
                                            <span class="perf-label">Avg Monthly Jobs</span>
                                            <span class="perf-value text-info">{{ branchStats.avgMonthlyJobs }}</span>
                                            <span class="perf-sub">Over last 12 months</span>
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- ─── SECTION E: Staff Performance MoM Cards ─── -->
                        <div class="mb-4">
                            <h5 class="section-heading">Staff Performance — This Branch</h5>
                            <p class="section-desc">Month-on-month job handling metrics for all staff in your branch.</p>
                        </div>
                        <b-row>
                            <b-col
                                v-for="member in staffPerformance"
                                :key="member.operator_id"
                                lg="4" md="6"
                                class="mb-6"
                            >
                                <div class="staff-card shadow-sm">
                                    <div class="staff-card-header d-flex align-items-center mb-4">
                                        <div class="staff-avatar mr-3">
                                            {{ getInitials(member.name) }}
                                        </div>
                                        <div>
                                            <div class="staff-card-name">{{ member.name }}</div>
                                            <div class="staff-card-desg">{{ member.designation }}</div>
                                        </div>
                                        <div class="ml-auto oli-badge-sm" :class="getOliClass(member.oli_score)">
                                            OLI {{ member.oli_score }}
                                        </div>
                                    </div>

                                    <div class="staff-stats-grid">
                                        <div class="stat-box">
                                            <span class="stat-label">Raised</span>
                                            <span class="stat-value">{{ member.raised_this_month }}</span>
                                            <span class="stat-delta" :class="getDeltaClass(member.raised_this_month, member.raised_last_month)">
                                                {{ getDeltaText(member.raised_this_month, member.raised_last_month) }}
                                            </span>
                                        </div>
                                        <div class="stat-box">
                                            <span class="stat-label">Replied</span>
                                            <span class="stat-value">{{ member.replied_this_month }}</span>
                                            <span class="stat-delta" :class="getDeltaClass(member.replied_this_month, member.replied_last_month)">
                                                {{ getDeltaText(member.replied_this_month, member.replied_last_month) }}
                                            </span>
                                        </div>
                                        <div class="stat-box">
                                            <span class="stat-label">Converted</span>
                                            <span class="stat-value text-success">{{ member.converted_this_month }}</span>
                                            <span class="stat-delta" :class="getDeltaClass(member.converted_this_month, member.converted_last_month)">
                                                {{ getDeltaText(member.converted_this_month, member.converted_last_month) }}
                                            </span>
                                        </div>
                                        <div class="stat-box">
                                            <span class="stat-label">SLA Breach</span>
                                            <span class="stat-value text-danger">{{ member.sla_breached_this_month }}</span>
                                            <span class="stat-delta" :class="getDeltaClass(member.sla_breached_last_month, member.sla_breached_this_month)">
                                                {{ getDeltaText(member.sla_breached_this_month, member.sla_breached_last_month) }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Mini sparkline -->
                                    <div class="mt-4" v-if="member.trend && member.trend.length > 1">
                                        <apexchart
                                            type="area"
                                            height="60"
                                            :options="getSparklineOptions(member)"
                                            :series="[{ name: 'Jobs', data: member.trend }]"
                                        ></apexchart>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <div v-if="staffPerformance.length === 0 && !loading" class="text-center py-10 text-muted">
                            No staff performance data available for this branch.
                        </div>

                        <!-- ─── SECTION F: Client Breakdown (Command tier only) ─── -->
                        <template v-if="isViperCommand">
                            <hr class="separator-line my-8" />

                            <div class="mb-4 d-flex align-items-center">
                                <div>
                                    <h5 class="section-heading mb-1">
                                        <span class="command-badge mr-2">COMMAND</span>
                                        Client Performance Breakdown
                                    </h5>
                                    <p class="section-desc mb-0">Per-client job handling and conversion metrics for your branch.</p>
                                </div>
                                <b-spinner v-if="clientLoading" small class="ml-auto text-primary"></b-spinner>
                            </div>

                            <!-- Search / sort bar -->
                            <div class="d-flex align-items-center mb-6" style="gap: 12px;">
                                <div class="client-search-wrap">
                                    <b-icon icon="search" class="client-search-icon"></b-icon>
                                    <input
                                        v-model="clientSearch"
                                        type="text"
                                        class="client-search-input"
                                        placeholder="Search client..."
                                    />
                                </div>
                                <b-form-select v-model="clientSortKey" class="filter-select" size="sm" style="width: auto;">
                                    <option value="raised">Sort: Most Jobs</option>
                                    <option value="converted">Sort: Most Converted</option>
                                    <option value="conversion_rate">Sort: Conversion Rate</option>
                                    <option value="sla_breached">Sort: SLA Breaches</option>
                                </b-form-select>
                            </div>

                            <b-row v-if="filteredClientStats.length > 0">
                                <b-col
                                    v-for="client in filteredClientStats"
                                    :key="client.client_id"
                                    lg="4" md="6"
                                    class="mb-6"
                                >
                                    <div class="client-card shadow-sm">
                                        <!-- Client header -->
                                        <div class="client-card-header d-flex align-items-start mb-4">
                                            <div class="client-avatar mr-3">
                                                {{ getInitials(client.client_name) }}
                                            </div>
                                            <div class="flex-grow-1" style="min-width:0;">
                                                <div class="client-card-name text-truncate">{{ client.client_name }}</div>
                                                <div class="client-card-sub">{{ client.raised }} enquir{{ client.raised === 1 ? 'y' : 'ies' }} this period</div>
                                            </div>
                                            <!-- Conversion ring -->
                                            <div class="conversion-ring ml-2" :class="getConversionClass(client.conversion_rate)">
                                                <span class="conversion-ring-value">{{ client.conversion_rate }}%</span>
                                                <span class="conversion-ring-label">Conv.</span>
                                            </div>
                                        </div>

                                        <!-- Stats grid -->
                                        <div class="client-stats-grid mb-4">
                                            <div class="cstat-box">
                                                <span class="cstat-label">Raised</span>
                                                <span class="cstat-value text-primary">{{ client.raised }}</span>
                                            </div>
                                            <div class="cstat-box">
                                                <span class="cstat-label">Replied</span>
                                                <span class="cstat-value">{{ client.replied }}</span>
                                            </div>
                                            <div class="cstat-box">
                                                <span class="cstat-label">Converted</span>
                                                <span class="cstat-value text-success">{{ client.converted }}</span>
                                            </div>
                                            <div class="cstat-box">
                                                <span class="cstat-label">Lost</span>
                                                <span class="cstat-value text-danger">{{ client.lost }}</span>
                                            </div>
                                        </div>

                                        <!-- SLA breach indicator -->
                                        <div v-if="client.sla_breached > 0" class="sla-breach-row mb-4">
                                            <div class="traffic-dot dot-red mr-2"></div>
                                            <span class="small font-weight-bold text-danger">{{ client.sla_breached }} SLA breach{{ client.sla_breached > 1 ? 'es' : '' }}</span>
                                        </div>

                                        <!-- Top lanes -->
                                        <div v-if="Object.keys(client.top_lanes).length > 0" class="mb-4">
                                            <div class="cstat-label mb-2">Top Lanes</div>
                                            <div
                                                v-for="(count, lane) in client.top_lanes"
                                                :key="lane"
                                                class="lane-pill mb-1"
                                            >
                                                <b-icon icon="arrow-right-short" class="mr-1"></b-icon>
                                                <span class="font-weight-bold">{{ lane }}</span>
                                                <span class="ml-auto text-muted small">{{ count }} job{{ count > 1 ? 's' : '' }}</span>
                                            </div>
                                        </div>

                                        <!-- 6-month trend sparkline -->
                                        <div v-if="client.trend && client.trend.length > 1">
                                            <div class="cstat-label mb-1">6-Month Trend</div>
                                            <apexchart
                                                type="area"
                                                height="55"
                                                :options="getClientSparklineOptions(client)"
                                                :series="[{ name: 'Jobs', data: client.trend.map(t => t.total) }]"
                                            ></apexchart>
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>

                            <div v-else-if="!clientLoading" class="text-center py-10 text-muted">
                                No client data found for this branch and period.
                            </div>
                        </template>

                    </b-overlay>
                </div>
            </div>
        </div>
    </b-container>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import VueApexCharts from "vue-apexcharts";
import ApiService from "@/core/services/api.service";

export default {
    name: "SalesAnalyticsDashboard",
    components: {
        SideBar,
        apexchart: VueApexCharts
    },
    data() {
        return {
            loading: false,
            filterPeriod: "monthly",
            filterTransportMode: "",
            totals: {
                raised: 0,
                replied: 0,
                converted: 0,
                pending_sla_breached: 0
            },
            // Funnel chart
            funnelChartSeries: [],
            funnelChartOptions: {
                chart: { type: 'bar', toolbar: { show: false } },
                plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
                dataLabels: { enabled: false },
                stroke: { show: true, width: 2, colors: ['transparent'] },
                xaxis: { categories: [] },
                yaxis: { title: { text: 'Jobs' } },
                fill: { opacity: 1 },
                colors: ['#355594', '#10B981', '#3B82F6', '#EF4444'],
                legend: { position: 'top' }
            },
            // Lost reasons donut
            lostChartSeries: [],
            lostChartOptions: {
                chart: { type: 'donut' },
                labels: [],
                colors: ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#6EE7B7'],
                legend: { position: 'bottom' },
                responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }]
            },
            // SLA response time
            responseTimeSeries: [],
            responseTimeOptions: {
                chart: { type: 'line', toolbar: { show: false } },
                stroke: { width: 3, curve: 'smooth' },
                xaxis: { categories: [] },
                yaxis: { title: { text: 'Minutes' } },
                colors: ['#F59E0B'],
                markers: { size: 5 }
            },
            // Staff load (for alerts panel)
            staffLoad: [],
            // Staff performance MoM cards
            staffPerformance: [],
            // Branch MoM chart
            branchMoMSeries: [],
            branchMoMOptions: {
                chart: { type: 'bar', toolbar: { show: false } },
                plotOptions: { bar: { columnWidth: '60%', borderRadius: 4 } },
                dataLabels: { enabled: false },
                xaxis: { categories: [] },
                colors: ['#355594', '#10B981'],
                legend: { position: 'top' }
            },
            branchStats: {
                bestMonth: '—',
                bestMonthVolume: 0,
                worstMonth: '—',
                worstMonthVolume: 0,
                avgConversionRate: 0,
                avgMonthlyJobs: 0
            },
            // Command-tier: client stats
            clientStats: [],
            clientLoading: false,
            clientSearch: '',
            clientSortKey: 'raised'
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        companyTier() {
            return this.currentUser && this.currentUser.company
                ? this.currentUser.company.tier
                : 'viper_core';
        },
        isViperCore() {
            return this.companyTier === 'viper_core';
        },
        isViperCommand() {
            return this.companyTier === 'viper_command';
        },
        filteredClientStats() {
            let list = [...this.clientStats];
            if (this.clientSearch.trim()) {
                const q = this.clientSearch.trim().toLowerCase();
                list = list.filter(c => c.client_name.toLowerCase().includes(q));
            }
            list.sort((a, b) => b[this.clientSortKey] - a[this.clientSortKey]);
            return list;
        }
    },
    mounted() {
        if (!this.isViperCore) {
            this.fetchAll();
        }
    },
    methods: {
        fetchAll() {
            this.loading = true;
            const params = {
                transport_mode: this.filterTransportMode,
                period: this.filterPeriod
            };

            const funnelReq = ApiService.query('/user/analytics/funnel', { params })
                .then(res => {
                    if (res.data.status) {
                        const raw = res.data.data;
                        this.totals = res.data.totals;
                        this.funnelChartOptions = {
                            ...this.funnelChartOptions,
                            xaxis: { categories: raw.map(i => i.period) }
                        };
                        this.funnelChartSeries = [
                            { name: 'Raised', data: raw.map(i => i.raised) },
                            { name: 'Replied', data: raw.map(i => i.replied) },
                            { name: 'Converted', data: raw.map(i => i.converted) },
                            { name: 'SLA Breached', data: raw.map(i => i.pending_sla_breached) }
                        ];
                        // Build branch MoM from funnel data (monthly view)
                        this.buildBranchMoM(raw);
                    }
                })
                .catch(err => console.error(err));

            const lostReq = ApiService.query('/user/analytics/lost-reasons', { params })
                .then(res => {
                    if (res.data.status) {
                        const raw = res.data.data;
                        this.lostChartSeries = raw.map(i => i.total);
                        this.lostChartOptions = {
                            ...this.lostChartOptions,
                            labels: raw.map(i => i.lost_reason)
                        };
                    }
                })
                .catch(err => console.error(err));

            const rtReq = ApiService.query('/user/analytics/response-times', { params })
                .then(res => {
                    if (res.data.status) {
                        const raw = res.data.data;
                        this.responseTimeOptions = {
                            ...this.responseTimeOptions,
                            xaxis: { categories: raw.map(i => i.date_group) }
                        };
                        this.responseTimeSeries = [{
                            name: 'Avg Reply Time (min)',
                            data: raw.map(i => roundToDecimals(i.avg_latency_seconds / 60, 1))
                        }];
                    }
                })
                .catch(err => console.error(err));

            const staffReq = ApiService.get('/user/analytics/staff-load')
                .then(res => {
                    if (res.data.status) {
                        this.staffLoad = res.data.data;
                        // Enrich with MoM stats for the staff card section
                        this.buildStaffPerformance(res.data.data);
                    }
                })
                .catch(err => console.error(err));

            Promise.all([funnelReq, lostReq, rtReq, staffReq])
                .finally(() => {
                    this.loading = false;
                    // After core data loads, fetch client breakdown for Command tier
                    if (this.isViperCommand) {
                        this.fetchClientStats();
                    }
                });
        },

        buildBranchMoM(raw) {
            if (!raw || raw.length === 0) return;

            const categories = raw.map(i => i.period);
            const raised = raw.map(i => i.raised);
            const converted = raw.map(i => i.converted);

            this.branchMoMOptions = {
                ...this.branchMoMOptions,
                xaxis: { categories }
            };
            this.branchMoMSeries = [
                { name: 'Jobs Raised', data: raised },
                { name: 'Jobs Converted', data: converted }
            ];

            // Compute summary stats
            const maxIdx = raised.indexOf(Math.max(...raised));
            const minIdx = raised.indexOf(Math.min(...raised));
            const totalRaised = raised.reduce((a, b) => a + b, 0);
            const totalConverted = converted.reduce((a, b) => a + b, 0);

            this.branchStats = {
                bestMonth: categories[maxIdx] || '—',
                bestMonthVolume: raised[maxIdx] || 0,
                worstMonth: categories[minIdx] || '—',
                worstMonthVolume: raised[minIdx] || 0,
                avgConversionRate: totalRaised > 0
                    ? roundToDecimals((totalConverted / totalRaised) * 100, 1)
                    : 0,
                avgMonthlyJobs: raised.length > 0
                    ? Math.round(totalRaised / raised.length)
                    : 0
            };
        },

        buildStaffPerformance(staffData) {
            // Map staff load data to performance cards
            // The existing endpoint returns active_jobs_count and oli_score per operator.
            // We augment with what's available; full MoM breakdown would need a dedicated endpoint.
            this.staffPerformance = staffData.map(s => ({
                operator_id: s.operator_id,
                name: s.name,
                designation: s.designation || 'Operator',
                oli_score: s.oli_score,
                active_jobs_count: s.active_jobs_count,
                // MoM stats — use available data; 0 as default until dedicated endpoint is wired
                raised_this_month: s.raised_this_month || s.active_jobs_count || 0,
                raised_last_month: s.raised_last_month || 0,
                replied_this_month: s.replied_this_month || 0,
                replied_last_month: s.replied_last_month || 0,
                converted_this_month: s.converted_this_month || 0,
                converted_last_month: s.converted_last_month || 0,
                sla_breached_this_month: s.sla_breached_this_month || 0,
                sla_breached_last_month: s.sla_breached_last_month || 0,
                trend: s.trend || []
            }));
        },

        getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        },

        getDeltaText(current, previous) {
            if (previous === 0 && current === 0) return '—';
            if (previous === 0) return `+${current}`;
            const delta = current - previous;
            const pct = roundToDecimals(Math.abs(delta / previous) * 100, 0);
            return delta >= 0 ? `▲ ${pct}%` : `▼ ${pct}%`;
        },

        getDeltaClass(current, previous) {
            if (current === previous) return 'text-muted';
            return current > previous ? 'text-success' : 'text-danger';
        },

        getSparklineOptions(member) {
            return {
                chart: {
                    type: 'area',
                    sparkline: { enabled: true },
                    animations: { enabled: false }
                },
                stroke: { curve: 'smooth', width: 2 },
                fill: {
                    type: 'gradient',
                    gradient: { opacityFrom: 0.4, opacityTo: 0.05 }
                },
                colors: [member.oli_score >= 15 ? '#EF4444' : member.oli_score >= 8 ? '#F59E0B' : '#10B981'],
                tooltip: { enabled: false }
            };
        },

        getOliClass(score) {
            if (score >= 15.0) return 'oli-danger';
            if (score >= 8.0) return 'oli-warning';
            return 'oli-success';
        },

        getOliDotClass(score) {
            if (score >= 15.0) return 'dot-red';
            if (score >= 8.0) return 'dot-amber';
            return 'dot-green';
        },

        fetchClientStats() {
            this.clientLoading = true;
            ApiService.query('/user/analytics/client-stats', {
                params: { period: this.filterPeriod }
            })
            .then(res => {
                if (res.data.status) {
                    this.clientStats = res.data.data;
                }
            })
            .catch(err => console.error(err))
            .finally(() => { this.clientLoading = false; });
        },

        getConversionClass(rate) {
            if (rate >= 60) return 'ring-high';
            if (rate >= 30) return 'ring-mid';
            return 'ring-low';
        },

        getClientSparklineOptions(client) {
            const hasGrowth = client.trend.length > 1 &&
                client.trend[client.trend.length - 1].total >= client.trend[0].total;
            return {
                chart: {
                    type: 'area',
                    sparkline: { enabled: true },
                    animations: { enabled: false }
                },
                stroke: { curve: 'smooth', width: 2 },
                fill: {
                    type: 'gradient',
                    gradient: { opacityFrom: 0.35, opacityTo: 0.02 }
                },
                colors: [hasGrowth ? '#10B981' : '#F59E0B'],
                tooltip: {
                    enabled: true,
                    x: { show: false },
                    y: { formatter: v => `${v} jobs` }
                }
            };
        }
    }
};

function roundToDecimals(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────── */
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

/* ── Header ─────────────────────────────────────────── */
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

/* ── Upgrade Teaser ─────────────────────────────────── */
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

/* ── Metric Cards ───────────────────────────────────── */
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
    font-size: 0.8rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
}

.metric-value {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.2;
    margin: 0.5rem 0;
}

.metric-subtext {
    font-size: 0.78rem;
    color: #94a3b8;
}

.border-danger-left {
    border-left: 4px solid #ef4444;
}

/* ── Chart Container ────────────────────────────────── */
.chart-container {
    background: white;
    border-radius: 20px;
    padding: 1.75rem;
    border: 1px solid rgba(53, 85, 148, 0.08);
}

.chart-title {
    color: #1e293b;
    font-size: 1.05rem;
    font-weight: 800;
    margin-bottom: 1.25rem;
    font-family: 'Inter', sans-serif;
}

/* ── Traffic Lights ─────────────────────────────────── */
.traffic-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
}

.dot-green { background-color: #10B981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
.dot-amber { background-color: #F59E0B; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
.dot-red   { background-color: #EF4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }

.alert-badge {
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.15);
    border-radius: 12px;
    padding: 12px 16px;
}

.alert-badge-ok {
    background: rgba(16, 185, 129, 0.06);
    border: 1px solid rgba(16, 185, 129, 0.15);
    border-radius: 12px;
    padding: 12px 16px;
}

/* ── Staff List (Alerts panel) ──────────────────────── */
.staff-list {
    max-height: 220px;
    overflow-y: auto;
}

.staff-name {
    font-weight: 700;
    color: #1e293b;
    font-size: 0.9rem;
}

.staff-desg {
    font-size: 0.78rem;
    color: #64748b;
}

.section-sub-title {
    font-weight: 700;
    color: #355594;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* ── OLI Badge ──────────────────────────────────────── */
.oli-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 0.78rem;
    font-weight: 700;
}

.oli-badge-sm {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 8px;
    font-size: 0.72rem;
    font-weight: 700;
}

.oli-success { background-color: #d1fae5; color: #065f46; }
.oli-warning { background-color: #fef3c7; color: #92400e; }
.oli-danger  { background-color: #fee2e2; color: #991b1b; }

/* ── Branch Performance Summary ─────────────────────── */
.performance-summary {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.perf-item {
    display: flex;
    flex-direction: column;
    padding: 14px 0;
}

.perf-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.perf-value {
    font-size: 1.5rem;
    font-weight: 800;
    font-family: 'Inter', sans-serif;
    line-height: 1;
}

.perf-sub {
    font-size: 0.78rem;
    color: #94a3b8;
    margin-top: 2px;
}

.perf-divider {
    border-top: 1px solid rgba(53, 85, 148, 0.08);
}

/* ── Section Heading ────────────────────────────────── */
.section-heading {
    color: #1e293b;
    font-size: 1.2rem;
    font-weight: 800;
    font-family: 'Inter', sans-serif;
    margin-bottom: 4px;
}

.section-desc {
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

/* ── Staff Performance Cards ────────────────────────── */
.staff-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(53, 85, 148, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.staff-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(53, 85, 148, 0.1) !important;
}

.staff-avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(135deg, #355594 0%, #5b82cc 100%);
    color: white;
    font-weight: 800;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;
}

.staff-card-name {
    font-weight: 800;
    color: #1e293b;
    font-size: 0.95rem;
    font-family: 'Inter', sans-serif;
}

.staff-card-desg {
    font-size: 0.78rem;
    color: #64748b;
    text-transform: capitalize;
}

.staff-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.stat-box {
    background: #f8fafc;
    border-radius: 12px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    font-size: 1.4rem;
    font-weight: 800;
    color: #1e293b;
    line-height: 1.2;
    margin: 2px 0;
}

.stat-delta {
    font-size: 0.72rem;
    font-weight: 700;
}

/* ── Command Badge ──────────────────────────────────── */
.command-badge {
    display: inline-block;
    background: linear-gradient(135deg, #1e3a8a 0%, #355594 100%);
    color: white;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    padding: 3px 8px;
    border-radius: 6px;
    vertical-align: middle;
}

/* ── Client Search ──────────────────────────────────── */
.client-search-wrap {
    position: relative;
    flex: 1;
    max-width: 300px;
}

.client-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 0.9rem;
}

.client-search-input {
    width: 100%;
    background: white;
    border: 1px solid rgba(53, 85, 148, 0.15);
    border-radius: 20px;
    padding: 8px 16px 8px 34px;
    font-size: 0.9rem;
    color: #355594;
    font-weight: 500;
    outline: none;
    transition: all 0.2s ease;
}

.client-search-input:focus {
    border-color: #355594;
    box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.08);
}

/* ── Client Cards ───────────────────────────────────── */
.client-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(53, 85, 148, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
}

.client-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(53, 85, 148, 0.1) !important;
}

.client-avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1e3a8a 0%, #355594 100%);
    color: white;
    font-weight: 800;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;
}

.client-card-name {
    font-weight: 800;
    color: #1e293b;
    font-size: 0.95rem;
    font-family: 'Inter', sans-serif;
    line-height: 1.2;
}

.client-card-sub {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 2px;
}

/* Conversion ring */
.conversion-ring {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.ring-high  { border-color: #10B981; }
.ring-mid   { border-color: #F59E0B; }
.ring-low   { border-color: #EF4444; }

.conversion-ring-value {
    font-size: 0.8rem;
    font-weight: 800;
    line-height: 1;
    color: #1e293b;
}

.conversion-ring-label {
    font-size: 0.58rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Client stats mini grid */
.client-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.cstat-box {
    background: #f8fafc;
    border-radius: 10px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
}

.cstat-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.cstat-value {
    font-size: 1.3rem;
    font-weight: 800;
    color: #1e293b;
    line-height: 1.2;
    margin-top: 2px;
}

/* SLA breach row */
.sla-breach-row {
    display: flex;
    align-items: center;
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.12);
    border-radius: 8px;
    padding: 6px 10px;
}

/* Lane pills */
.lane-pill {
    display: flex;
    align-items: center;
    background: rgba(53, 85, 148, 0.05);
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 0.78rem;
    color: #355594;
}
</style>
