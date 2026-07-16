<template>
    <b-container fluid class="body-color">
        <div class="d-flex flex-column flex-lg-row">
            <SideBar></SideBar>
            <div class="main-content-area ml-lg-4 mt-4 mt-lg-0">

                <!-- Header -->
                <div class="container py-8 px-6 px-sm-8 px-md-10">
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div class="d-flex flex-column">
                            <span class="sub-header-text">Business Intelligence</span>
                            <h6 class="main-header-title">Boss Analytics</h6>
                        </div>
                        <div class="d-flex align-items-center mt-3 mt-md-0" v-if="!isViperCore">
                            <b-form-select v-model="filterPeriod" class="filter-select mr-2" size="sm" @change="fetchAll">
                                <option value="daily">Daily View</option>
                                <option value="monthly">Monthly View</option>
                                <option value="yearly">Yearly View</option>
                            </b-form-select>
                        </div>
                    </div>
                </div>

                <hr class="separator-line" />

                <!-- Viper Core Teaser -->
                <div v-if="isViperCore" class="container py-12 px-6 text-center">
                    <div class="teaser-container mx-auto py-10 px-8">
                        <div class="icon-circle mb-6 mx-auto">
                            <b-icon icon="shield-lock-fill" font-scale="3" class="text-white"></b-icon>
                        </div>
                        <h3 class="teaser-title mb-4">Upgrade to Access Boss Analytics</h3>
                        <p class="teaser-description mb-6 mx-auto">
                            Get full cross-branch visibility, actionable alerts, staff performance tracking, and sales target management across your entire operation.
                        </p>
                        <b-button class="upgrade-btn px-8 py-3">Upgrade to Viper Tactical</b-button>
                    </div>
                </div>

                <!-- Active Dashboard -->
                <div v-else class="container-fluid py-6 px-6 px-sm-8 px-md-10">
                    <b-overlay :show="loading" rounded="lg" opacity="0.6">

                        <!-- ─── SECTION A: Top KPI Cards ─── -->
                        <b-row class="mb-8">
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Total Jobs Raised</span>
                                    <div class="metric-value text-primary">{{ totals.raised }}</div>
                                    <span class="metric-subtext">Across all branches</span>
                                </div>
                            </b-col>
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Total Converted</span>
                                    <div class="metric-value text-success">{{ totals.converted }}</div>
                                    <span class="metric-subtext">Executed jobs company-wide</span>
                                </div>
                            </b-col>
                            <b-col md="3" class="mb-4 mb-md-0">
                                <div class="metric-card shadow-sm border-danger-left">
                                    <span class="metric-label">SLA Breaches</span>
                                    <div class="metric-value text-danger">{{ totals.sla_breached }}</div>
                                    <span class="metric-subtext">> 15 min without reply</span>
                                </div>
                            </b-col>
                            <b-col md="3">
                                <div class="metric-card shadow-sm">
                                    <span class="metric-label">Active Branches</span>
                                    <div class="metric-value text-info">{{ totals.branches }}</div>
                                    <span class="metric-subtext">Branches in your company</span>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- ─── SECTION D: Action Items ─── -->
                        <b-row class="mb-8" v-if="actionItems.length > 0 || actionLoading">
                            <b-col cols="12">
                                <div class="chart-container shadow-sm">
                                    <div class="d-flex align-items-center mb-4">
                                        <h5 class="chart-title mb-0">
                                            <b-icon icon="exclamation-triangle-fill" class="text-warning mr-2"></b-icon>
                                            Actionable Items
                                        </h5>
                                        <b-spinner v-if="actionLoading" small class="ml-3 text-primary"></b-spinner>
                                    </div>
                                    <b-row>
                                        <b-col
                                            v-for="(item, idx) in actionItems"
                                            :key="idx"
                                            md="6" lg="4"
                                            class="mb-4"
                                        >
                                            <div class="action-card" :class="`action-card--${item.severity}`">
                                                <div class="d-flex align-items-start">
                                                    <div class="traffic-dot mt-1 mr-3 flex-shrink-0" :class="item.severity === 'danger' ? 'dot-red' : 'dot-amber'"></div>
                                                    <div>
                                                        <div class="action-title">{{ item.title }}</div>
                                                        <div class="action-branch">{{ item.branch_name }}</div>
                                                        <div class="action-desc">{{ item.description }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <div v-if="!actionLoading && actionItems.length === 0" class="text-center py-6 text-muted">
                                        <b-icon icon="check-circle-fill" font-scale="2" class="text-success mb-3"></b-icon>
                                        <p class="mb-0">No urgent action items — all branches running smoothly!</p>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- ─── SECTION B: Branch Performance Grid ─── -->
                        <div class="mb-4">
                            <h5 class="section-heading">Branch Performance</h5>
                            <p class="section-desc">Jobs raised, converted, and SLA health per branch over the selected period.</p>
                        </div>
                        <b-row class="mb-8">
                            <b-col
                                v-for="branch in branchData"
                                :key="branch.branch_id"
                                lg="4" md="6"
                                class="mb-5"
                            >
                                <div class="branch-card shadow-sm">
                                    <div class="d-flex align-items-center mb-3">
                                        <div class="branch-icon mr-3">
                                            <b-icon icon="building" font-scale="1.2" class="text-white"></b-icon>
                                        </div>
                                        <div class="flex-grow-1" style="min-width:0;">
                                            <div class="branch-name text-truncate">{{ branch.branch_name }}</div>
                                            <div class="branch-staff">{{ branch.staff_count }} staff</div>
                                        </div>
                                        <div class="sla-badge" :class="branch.sla_breached > 0 ? 'sla-red' : 'sla-green'">
                                            {{ branch.sla_breached > 0 ? branch.sla_breached + ' SLA' : '✓ SLA' }}
                                        </div>
                                    </div>
                                    <div class="branch-stats-row">
                                        <div class="bstat">
                                            <div class="bstat-val text-primary">{{ branch.raised }}</div>
                                            <div class="bstat-lbl">Raised</div>
                                        </div>
                                        <div class="bstat">
                                            <div class="bstat-val text-success">{{ branch.converted }}</div>
                                            <div class="bstat-lbl">Converted</div>
                                        </div>
                                        <div class="bstat">
                                            <div class="bstat-val" :class="branch.conversion_rate >= 50 ? 'text-success' : branch.conversion_rate >= 25 ? 'text-warning' : 'text-danger'">
                                                {{ branch.conversion_rate }}%
                                            </div>
                                            <div class="bstat-lbl">Conv. Rate</div>
                                        </div>
                                    </div>
                                    <!-- Sparkline -->
                                    <div v-if="branch.trend && branch.trend.length > 1" class="mt-3">
                                        <apexchart
                                            type="area"
                                            height="45"
                                            :options="getBranchSparklineOptions(branch)"
                                            :series="[{ name: 'Jobs', data: branch.trend.map(t => t.total) }]"
                                        ></apexchart>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>

                        <!-- ─── SECTION C: All Staff ─── -->
                        <div class="mb-4">
                            <h5 class="section-heading">Staff Across All Branches</h5>
                            <p class="section-desc">Operator Load Index and active job workload for every staff member.</p>
                        </div>
                        <div class="chart-container shadow-sm mb-8">
                            <div class="table-responsive">
                                <table class="boss-staff-table w-100">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Designation</th>
                                            <th>Branch</th>
                                            <th>Active Jobs</th>
                                            <th>OLI Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="member in allStaff" :key="member.user_id" class="staff-row-tr">
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="mini-avatar mr-2">{{ getInitials(member.name) }}</div>
                                                    <span class="font-weight-bold">{{ member.name }}</span>
                                                </div>
                                            </td>
                                            <td class="text-capitalize text-muted">{{ member.designation }}</td>
                                            <td><span class="branch-tag">{{ member.branch_name }}</span></td>
                                            <td>{{ member.active_jobs_count }}</td>
                                            <td>
                                                <span class="oli-badge" :class="getOliClass(member.oli_score)">
                                                    OLI {{ member.oli_score }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="allStaff.length === 0">
                                            <td colspan="5" class="text-center text-muted py-6">No staff data found.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- ─── SECTION E: Mailbox Connection ─── -->
                        <div class="mb-4">
                            <h5 class="section-heading">Mailbox Connection</h5>
                            <p class="section-desc">Connect your corporate email address to enable inbox automation.</p>
                        </div>
                        <div class="chart-container shadow-sm mb-8">
                            <!-- Connected mailboxes list -->
                            <div v-if="mailboxConnections.length > 0" class="mb-5">
                                <h6 class="section-sub-title mb-3">Connected Mailboxes</h6>
                                <div
                                    v-for="conn in mailboxConnections"
                                    :key="conn.id"
                                    class="mailbox-row d-flex align-items-center mb-3"
                                >
                                    <div class="mailbox-provider-icon mr-3">
                                        <b-icon :icon="conn.provider === 'gmail' ? 'envelope-fill' : 'microsoft'" class="text-white" font-scale="1.2"></b-icon>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="font-weight-bold">{{ conn.email_address }}</div>
                                        <div class="small text-muted text-capitalize">{{ conn.provider }} • {{ conn.is_active ? 'Active' : 'Inactive' }}</div>
                                    </div>
                                    <b-button
                                        size="sm"
                                        variant="outline-danger"
                                        class="rounded-pill px-3"
                                        @click="disconnectMailbox(conn.id)"
                                        :disabled="disconnecting === conn.id"
                                    >
                                        <b-spinner v-if="disconnecting === conn.id" small></b-spinner>
                                        <span v-else>Disconnect</span>
                                    </b-button>
                                </div>
                            </div>

                            <!-- Connect new mailbox form -->
                            <h6 class="section-sub-title mb-3">Connect a New Mailbox</h6>
                            <b-form @submit.prevent="connectMailbox">
                                <b-row>
                                    <b-col md="4" class="mb-3">
                                        <label class="form-label-boss">Email Address</label>
                                        <b-form-input
                                            v-model="newMailbox.email_address"
                                            type="email"
                                            placeholder="yourname@company.com"
                                            required
                                            class="boss-input"
                                        ></b-form-input>
                                    </b-col>
                                    <b-col md="3" class="mb-3">
                                        <label class="form-label-boss">Provider</label>
                                        <b-form-select v-model="newMailbox.provider" class="boss-input" required>
                                            <option value="gmail">Gmail (Google Workspace)</option>
                                            <option value="outlook">Outlook (Microsoft 365)</option>
                                        </b-form-select>
                                    </b-col>
                                    <b-col md="3" class="mb-3">
                                        <label class="form-label-boss">Access Token</label>
                                        <b-form-input
                                            v-model="newMailbox.access_token"
                                            type="password"
                                            placeholder="OAuth Access Token"
                                            required
                                            class="boss-input"
                                        ></b-form-input>
                                    </b-col>
                                    <b-col md="2" class="mb-3 d-flex align-items-end">
                                        <b-button type="submit" class="connect-btn w-100" :disabled="connecting">
                                            <b-spinner v-if="connecting" small class="mr-1"></b-spinner>
                                            <b-icon v-else icon="plus-circle-fill" class="mr-1"></b-icon>
                                            Connect
                                        </b-button>
                                    </b-col>
                                </b-row>
                                <p class="small text-muted mt-2">
                                    <b-icon icon="shield-check" class="text-success mr-1"></b-icon>
                                    Only corporate email domains are accepted. Personal email addresses (Gmail/Yahoo personal) are blocked for security.
                                </p>
                            </b-form>
                        </div>

                        <!-- ─── SECTION F: Sales Targets ─── -->
                        <div class="mb-4">
                            <h5 class="section-heading">Sales Targets & Plans</h5>
                            <p class="section-desc">Set quarterly revenue and tonnage targets for branches or individual sales staff.</p>
                        </div>
                        <div class="chart-container shadow-sm mb-8">
                            <!-- Existing targets table -->
                            <div v-if="salesTargets.length > 0" class="mb-6">
                                <h6 class="section-sub-title mb-3">Current Targets</h6>
                                <div class="table-responsive">
                                    <table class="boss-staff-table w-100">
                                        <thead>
                                            <tr>
                                                <th>Target</th>
                                                <th>Type</th>
                                                <th>Quarter</th>
                                                <th>Revenue Target</th>
                                                <th>Tonnage Target</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="t in salesTargets" :key="t.id">
                                                <td class="font-weight-bold">{{ t.name }}</td>
                                                <td><span class="branch-tag text-capitalize">{{ t.target_type }}</span></td>
                                                <td>{{ t.quarter }}</td>
                                                <td>{{ t.revenue_target ? 'INR ' + formatAmount(t.revenue_target) : '—' }}</td>
                                                <td>{{ t.tonnage_target ? t.tonnage_target + ' MT' : '—' }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Set new target form -->
                            <h6 class="section-sub-title mb-3">Set New Target</h6>
                            <b-form @submit.prevent="saveTarget">
                                <b-row>
                                    <b-col md="2" class="mb-3">
                                        <label class="form-label-boss">Target Type</label>
                                        <b-form-select v-model="newTarget.target_type" class="boss-input" required @change="newTarget.target_id = ''">
                                            <option value="user">Sales Staff</option>
                                            <option value="branch">Branch</option>
                                        </b-form-select>
                                    </b-col>
                                    <b-col md="3" class="mb-3">
                                        <label class="form-label-boss">{{ newTarget.target_type === 'user' ? 'Select Staff' : 'Select Branch' }}</label>
                                        <b-form-select v-model="newTarget.target_id" class="boss-input" required>
                                            <option value="">— Select —</option>
                                            <template v-if="newTarget.target_type === 'user'">
                                                <option
                                                    v-for="s in allStaff.filter(m => m.designation === 'sales')"
                                                    :key="s.user_id"
                                                    :value="s.user_id"
                                                >{{ s.name }} ({{ s.branch_name }})</option>
                                            </template>
                                            <template v-else>
                                                <option
                                                    v-for="b in branchData"
                                                    :key="b.branch_id"
                                                    :value="b.branch_id"
                                                >{{ b.branch_name }}</option>
                                            </template>
                                        </b-form-select>
                                    </b-col>
                                    <b-col md="2" class="mb-3">
                                        <label class="form-label-boss">Quarter</label>
                                        <b-form-input v-model="newTarget.quarter" class="boss-input" placeholder="e.g. Q3-2025" required></b-form-input>
                                    </b-col>
                                    <b-col md="2" class="mb-3">
                                        <label class="form-label-boss">Revenue Target (INR)</label>
                                        <b-form-input type="number" v-model="newTarget.revenue_target" class="boss-input" placeholder="0"></b-form-input>
                                    </b-col>
                                    <b-col md="2" class="mb-3">
                                        <label class="form-label-boss">Tonnage Target (MT)</label>
                                        <b-form-input type="number" v-model="newTarget.tonnage_target" class="boss-input" placeholder="0"></b-form-input>
                                    </b-col>
                                    <b-col md="1" class="mb-3 d-flex align-items-end">
                                        <b-button type="submit" class="connect-btn w-100" :disabled="savingTarget">
                                            <b-spinner v-if="savingTarget" small></b-spinner>
                                            <b-icon v-else icon="check-lg"></b-icon>
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </b-form>
                            <b-alert v-if="targetSaved" show variant="success" dismissible class="mt-3">
                                Target saved successfully!
                            </b-alert>
                        </div>

                        <!-- ─── SECTION G: Client Breakdown (Command only) ─── -->
                        <template v-if="isViperCommand">
                            <hr class="separator-line my-8" />
                            <div class="mb-4 d-flex align-items-center">
                                <div>
                                    <h5 class="section-heading mb-1">
                                        <span class="command-badge mr-2">COMMAND</span>
                                        Client Performance — All Branches
                                    </h5>
                                    <p class="section-desc mb-0">How each client is performing across all your branches.</p>
                                </div>
                                <b-spinner v-if="clientLoading" small class="ml-auto text-primary"></b-spinner>
                            </div>

                            <div class="d-flex align-items-center mb-6" style="gap:12px;">
                                <div class="client-search-wrap">
                                    <b-icon icon="search" class="client-search-icon"></b-icon>
                                    <input v-model="clientSearch" type="text" class="client-search-input" placeholder="Search client..." />
                                </div>
                                <b-form-select v-model="clientSortKey" class="filter-select" size="sm" style="width:auto;">
                                    <option value="raised">Sort: Most Jobs</option>
                                    <option value="converted">Sort: Most Converted</option>
                                    <option value="conversion_rate">Sort: Conversion Rate</option>
                                    <option value="sla_breached">Sort: SLA Breaches</option>
                                </b-form-select>
                            </div>

                            <b-row v-if="filteredClients.length > 0">
                                <b-col v-for="client in filteredClients" :key="client.client_id" lg="4" md="6" class="mb-6">
                                    <div class="client-card shadow-sm">
                                        <div class="client-card-header d-flex align-items-start mb-4">
                                            <div class="client-avatar mr-3">{{ getInitials(client.client_name) }}</div>
                                            <div class="flex-grow-1" style="min-width:0;">
                                                <div class="client-card-name text-truncate">{{ client.client_name }}</div>
                                                <div class="client-card-sub">{{ client.raised }} enquir{{ client.raised === 1 ? 'y' : 'ies' }} • {{ client.branches }} branch{{ client.branches > 1 ? 'es' : '' }}</div>
                                            </div>
                                            <div class="conversion-ring ml-2" :class="getConversionClass(client.conversion_rate)">
                                                <span class="conversion-ring-value">{{ client.conversion_rate }}%</span>
                                                <span class="conversion-ring-label">Conv.</span>
                                            </div>
                                        </div>
                                        <div class="client-stats-grid mb-4">
                                            <div class="cstat-box"><span class="cstat-label">Raised</span><span class="cstat-value text-primary">{{ client.raised }}</span></div>
                                            <div class="cstat-box"><span class="cstat-label">Replied</span><span class="cstat-value">{{ client.replied }}</span></div>
                                            <div class="cstat-box"><span class="cstat-label">Converted</span><span class="cstat-value text-success">{{ client.converted }}</span></div>
                                            <div class="cstat-box"><span class="cstat-label">Lost</span><span class="cstat-value text-danger">{{ client.lost }}</span></div>
                                        </div>
                                        <div v-if="client.sla_breached > 0" class="sla-breach-row mb-4">
                                            <div class="traffic-dot dot-red mr-2"></div>
                                            <span class="small font-weight-bold text-danger">{{ client.sla_breached }} SLA breach{{ client.sla_breached > 1 ? 'es' : '' }}</span>
                                        </div>
                                        <div v-if="client.trend && client.trend.length > 1">
                                            <div class="cstat-label mb-1">6-Month Trend</div>
                                            <apexchart type="area" height="50"
                                                :options="getClientSparkOptions(client)"
                                                :series="[{ name: 'Jobs', data: client.trend.map(t => t.total) }]"
                                            ></apexchart>
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>
                            <div v-else-if="!clientLoading" class="text-center py-10 text-muted">
                                No client data found for this company and period.
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
    name: "BossAnalyticsDashboard",
    components: {
        SideBar,
        apexchart: VueApexCharts
    },
    data() {
        return {
            loading: false,
            filterPeriod: "monthly",
            totals: { raised: 0, converted: 0, sla_breached: 0, branches: 0 },
            branchData: [],
            allStaff: [],
            // Action items
            actionItems: [],
            actionLoading: false,
            // Mailbox
            mailboxConnections: [],
            newMailbox: { email_address: '', provider: 'gmail', access_token: '' },
            connecting: false,
            disconnecting: null,
            // Sales targets
            salesTargets: [],
            newTarget: { target_type: 'user', target_id: '', quarter: '', revenue_target: null, tonnage_target: null },
            savingTarget: false,
            targetSaved: false,
            // Command: clients
            clientStats: [],
            clientLoading: false,
            clientSearch: '',
            clientSortKey: 'raised'
        };
    },
    computed: {
        currentUser() { return this.$store.getters.currentUser; },
        companyTier() {
            return this.currentUser && this.currentUser.company
                ? this.currentUser.company.tier : 'viper_core';
        },
        isViperCore() { return this.companyTier === 'viper_core'; },
        isViperCommand() { return this.companyTier === 'viper_command'; },
        filteredClients() {
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
            this.actionLoading = true;

            const branchReq = ApiService.query('/user/analytics/boss/branch-summary', {
                params: { period: this.filterPeriod }
            }).then(res => {
                if (res.data.status) {
                    this.branchData = res.data.data;
                    this.totals = res.data.totals;
                }
            }).catch(err => console.error(err));

            const staffReq = ApiService.get('/user/analytics/boss/staff-all')
                .then(res => {
                    if (res.data.status) this.allStaff = res.data.data;
                }).catch(err => console.error(err));

            const actionReq = ApiService.get('/user/analytics/boss/action-items')
                .then(res => {
                    if (res.data.status) this.actionItems = res.data.data;
                }).catch(err => console.error(err))
                .finally(() => { this.actionLoading = false; });

            const mailboxReq = ApiService.get('/user/mailbox-connections')
                .then(res => {
                    this.mailboxConnections = Array.isArray(res.data) ? res.data : [];
                }).catch(() => { this.mailboxConnections = []; });

            const targetReq = ApiService.get('/user/analytics/boss/sales-targets')
                .then(res => {
                    if (res.data.status) this.salesTargets = res.data.data;
                }).catch(err => console.error(err));

            Promise.all([branchReq, staffReq, actionReq, mailboxReq, targetReq])
                .finally(() => { this.loading = false; });

            if (this.isViperCommand) {
                this.fetchClientStats();
            }
        },

        fetchClientStats() {
            this.clientLoading = true;
            ApiService.query('/user/analytics/boss/client-all', {
                params: { period: this.filterPeriod }
            }).then(res => {
                if (res.data.status) this.clientStats = res.data.data;
            }).catch(err => console.error(err))
            .finally(() => { this.clientLoading = false; });
        },

        async connectMailbox() {
            this.connecting = true;
            try {
                const res = await ApiService.post('/user/mailbox-connections/connect', {
                    ...this.newMailbox,
                    refresh_token: 'placeholder',
                });
                if (res.data.status) {
                    this.mailboxConnections.push(res.data.data);
                    this.newMailbox = { email_address: '', provider: 'gmail', access_token: '' };
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.connecting = false;
            }
        },

        async disconnectMailbox(id) {
            this.disconnecting = id;
            try {
                await ApiService.delete(`/user/mailbox-connections/${id}`);
                this.mailboxConnections = this.mailboxConnections.filter(c => c.id !== id);
            } catch (err) {
                console.error(err);
            } finally {
                this.disconnecting = null;
            }
        },

        async saveTarget() {
            this.savingTarget = true;
            this.targetSaved = false;
            try {
                const res = await ApiService.post('/user/analytics/boss/sales-targets', {
                    ...this.newTarget,
                    target_id: parseInt(this.newTarget.target_id),
                });
                if (res.data.status) {
                    this.targetSaved = true;
                    this.newTarget = { target_type: 'user', target_id: '', quarter: '', revenue_target: null, tonnage_target: null };
                    // Reload targets
                    const t = await ApiService.get('/user/analytics/boss/sales-targets');
                    if (t.data.status) this.salesTargets = t.data.data;
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.savingTarget = false;
            }
        },

        getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        },

        getOliClass(score) {
            if (score >= 15.0) return 'oli-danger';
            if (score >= 8.0)  return 'oli-warning';
            return 'oli-success';
        },

        getBranchSparklineOptions(branch) {
            const last = branch.trend[branch.trend.length - 1]?.total ?? 0;
            const first = branch.trend[0]?.total ?? 0;
            return {
                chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: false } },
                stroke: { curve: 'smooth', width: 2 },
                fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.02 } },
                colors: [last >= first ? '#10B981' : '#F59E0B'],
                tooltip: { enabled: false }
            };
        },

        getConversionClass(rate) {
            if (rate >= 60) return 'ring-high';
            if (rate >= 30) return 'ring-mid';
            return 'ring-low';
        },

        getClientSparkOptions(client) {
            const last = client.trend[client.trend.length - 1]?.total ?? 0;
            const first = client.trend[0]?.total ?? 0;
            return {
                chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: false } },
                stroke: { curve: 'smooth', width: 2 },
                fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
                colors: [last >= first ? '#10B981' : '#F59E0B'],
                tooltip: { enabled: true, x: { show: false }, y: { formatter: v => `${v} jobs` } }
            };
        },

        formatAmount(val) {
            if (!val) return '0';
            return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }
};
</script>

<style scoped>
.body-color { padding-bottom: 3rem; }

.main-content-area {
    background: rgba(255,255,255,0.9);
    border: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 10px 30px rgba(53,85,148,0.08);
    border-radius: 32px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
}

/* Header */
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
    border: 1px solid rgba(53,85,148,0.2);
    color: #355594;
    font-weight: 600;
    background-color: white;
}
.separator-line {
    border: 0;
    border-top: 1px solid rgba(53,85,148,0.12);
    margin: 0;
}

/* Teaser */
.teaser-container {
    max-width: 600px;
    background: linear-gradient(135deg, #f8fafd 0%, #fff 100%);
    border: 1px solid rgba(53,85,148,0.15);
    border-radius: 24px;
}
.icon-circle {
    width: 90px; height: 90px;
    background: linear-gradient(135deg, #a5c7f7, #355594);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 10px 20px rgba(53,85,148,0.2);
}
.teaser-title { color: #355594; font-weight: 800; font-family: 'Inter', sans-serif; }
.teaser-description { color: #64748b; font-size: 1.05rem; line-height: 1.6; max-width: 480px; }
.upgrade-btn {
    background: linear-gradient(135deg, #355594, #1e3a8a) !important;
    border: none !important;
    border-radius: 12px;
    font-weight: 700;
    color: white;
    box-shadow: 0 8px 16px rgba(53,85,148,0.25);
    transition: all 0.3s;
}
.upgrade-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(53,85,148,0.35); }

/* Metric Cards */
.metric-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(53,85,148,0.08);
    transition: transform 0.3s;
}
.metric-card:hover { transform: translateY(-4px); }
.metric-label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: block; }
.metric-value { font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin: 0.5rem 0; }
.metric-subtext { font-size: 0.78rem; color: #94a3b8; }
.border-danger-left { border-left: 4px solid #ef4444; }

/* Chart container */
.chart-container {
    background: white; border-radius: 20px; padding: 1.75rem;
    border: 1px solid rgba(53,85,148,0.08);
}
.chart-title { color: #1e293b; font-size: 1.05rem; font-weight: 800; font-family: 'Inter', sans-serif; }

/* Section headings */
.section-heading { color: #1e293b; font-size: 1.2rem; font-weight: 800; font-family: 'Inter', sans-serif; margin-bottom: 4px; }
.section-desc { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; }
.section-sub-title { font-weight: 700; color: #355594; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }

/* Traffic dots */
.traffic-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background-color: #10B981; box-shadow: 0 0 8px rgba(16,185,129,0.4); }
.dot-amber { background-color: #F59E0B; box-shadow: 0 0 8px rgba(245,158,11,0.4); }
.dot-red   { background-color: #EF4444; box-shadow: 0 0 8px rgba(239,68,68,0.4); }

/* Action Cards */
.action-card {
    border-radius: 14px; padding: 1rem 1.25rem;
    border-left: 4px solid;
    transition: transform 0.2s;
}
.action-card--danger {
    background: rgba(239,68,68,0.04);
    border-color: #ef4444;
}
.action-card--warning {
    background: rgba(245,158,11,0.04);
    border-color: #f59e0b;
}
.action-card:hover { transform: translateY(-2px); }
.action-title { font-weight: 800; color: #1e293b; font-size: 0.9rem; }
.action-branch { font-size: 0.75rem; color: #355594; font-weight: 700; margin: 2px 0; }
.action-desc { font-size: 0.78rem; color: #64748b; }

/* Branch Cards */
.branch-card {
    background: white; border-radius: 18px; padding: 1.25rem;
    border: 1px solid rgba(53,85,148,0.08);
    transition: transform 0.3s, box-shadow 0.3s;
}
.branch-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(53,85,148,0.1) !important; }
.branch-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, #355594, #1e3a8a);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.branch-name { font-weight: 800; color: #1e293b; font-size: 0.92rem; font-family: 'Inter', sans-serif; }
.branch-staff { font-size: 0.72rem; color: #94a3b8; }
.sla-badge {
    padding: 4px 8px; border-radius: 8px; font-size: 0.72rem; font-weight: 700;
}
.sla-green { background: #d1fae5; color: #065f46; }
.sla-red   { background: #fee2e2; color: #991b1b; }
.branch-stats-row {
    display: flex; gap: 12px; margin-top: 0.75rem;
}
.bstat { display: flex; flex-direction: column; flex: 1; }
.bstat-val { font-size: 1.3rem; font-weight: 800; font-family: 'Inter', sans-serif; line-height: 1; }
.bstat-lbl { font-size: 0.68rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

/* Staff Table */
.boss-staff-table { border-collapse: separate; border-spacing: 0; }
.boss-staff-table thead th {
    background: #f8fafc; color: #64748b; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 14px;
    border-bottom: 2px solid rgba(53,85,148,0.08);
}
.boss-staff-table tbody td {
    padding: 12px 14px; border-bottom: 1px solid rgba(53,85,148,0.06);
    vertical-align: middle; font-size: 0.87rem;
}
.staff-row-tr:hover td { background: rgba(53,85,148,0.02); }
.mini-avatar {
    width: 32px; height: 32px; border-radius: 10px;
    background: linear-gradient(135deg, #355594, #5b82cc);
    color: white; font-weight: 800; font-size: 0.75rem;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif; flex-shrink: 0;
}
.branch-tag {
    background: rgba(53,85,148,0.08); color: #355594;
    font-size: 0.72rem; font-weight: 700; padding: 3px 8px;
    border-radius: 6px; display: inline-block;
}
.oli-badge {
    display: inline-block; padding: 4px 10px; border-radius: 10px;
    font-size: 0.78rem; font-weight: 700;
}
.oli-success { background: #d1fae5; color: #065f46; }
.oli-warning { background: #fef3c7; color: #92400e; }
.oli-danger  { background: #fee2e2; color: #991b1b; }

/* Mailbox */
.mailbox-row {
    background: #f8fafc; border-radius: 14px; padding: 12px 16px;
    border: 1px solid rgba(53,85,148,0.08);
}
.mailbox-provider-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #355594, #1e3a8a);
    display: flex; align-items: center; justify-content: center;
}

/* Forms */
.form-label-boss {
    font-size: 0.78rem; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.5px;
    display: block; margin-bottom: 6px;
}
.boss-input {
    border-radius: 12px !important;
    border: 1px solid rgba(53,85,148,0.15) !important;
    color: #355594 !important;
    font-weight: 600 !important;
}
.boss-input:focus {
    border-color: #355594 !important;
    box-shadow: 0 0 0 3px rgba(53,85,148,0.08) !important;
}
.connect-btn {
    background: linear-gradient(135deg, #355594, #1e3a8a) !important;
    border: none !important;
    border-radius: 12px !important;
    font-weight: 700 !important;
    color: white !important;
    transition: all 0.3s;
}
.connect-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(53,85,148,0.25); }

/* Command section */
.command-badge {
    display: inline-block;
    background: linear-gradient(135deg, #1e3a8a, #355594);
    color: white; font-size: 0.65rem; font-weight: 800;
    letter-spacing: 1.5px; padding: 3px 8px; border-radius: 6px;
    vertical-align: middle;
}

/* Client search */
.client-search-wrap { position: relative; flex: 1; max-width: 300px; }
.client-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.9rem; }
.client-search-input {
    width: 100%; background: white;
    border: 1px solid rgba(53,85,148,0.15); border-radius: 20px;
    padding: 8px 16px 8px 34px; font-size: 0.9rem;
    color: #355594; font-weight: 500; outline: none; transition: all 0.2s;
}
.client-search-input:focus { border-color: #355594; box-shadow: 0 0 0 3px rgba(53,85,148,0.08); }

/* Client cards */
.client-card {
    background: white; border-radius: 20px; padding: 1.5rem;
    border: 1px solid rgba(53,85,148,0.08);
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
}
.client-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(53,85,148,0.1) !important; }
.client-avatar {
    width: 44px; height: 44px; border-radius: 14px;
    background: linear-gradient(135deg, #1e3a8a, #355594);
    color: white; font-weight: 800; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-family: 'Inter', sans-serif;
}
.client-card-name { font-weight: 800; color: #1e293b; font-size: 0.95rem; font-family: 'Inter', sans-serif; line-height: 1.2; }
.client-card-sub { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }
.conversion-ring {
    width: 52px; height: 52px; border-radius: 50%; border: 3px solid;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.ring-high { border-color: #10B981; }
.ring-mid  { border-color: #F59E0B; }
.ring-low  { border-color: #EF4444; }
.conversion-ring-value { font-size: 0.8rem; font-weight: 800; line-height: 1; color: #1e293b; }
.conversion-ring-label { font-size: 0.58rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.client-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cstat-box { background: #f8fafc; border-radius: 10px; padding: 8px 10px; display: flex; flex-direction: column; }
.cstat-label { font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.cstat-value { font-size: 1.3rem; font-weight: 800; color: #1e293b; line-height: 1.2; margin-top: 2px; }
.sla-breach-row {
    display: flex; align-items: center;
    background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.12);
    border-radius: 8px; padding: 6px 10px;
}
</style>
