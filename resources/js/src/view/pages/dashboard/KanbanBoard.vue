<template>
    <b-container fluid class="body-color">
        <div class="d-flex flex-column flex-lg-row">
            <SideBar></SideBar>
            
            <div
                style="
                    background: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1);
                    z-index: 1;
                    border-radius: 32px;
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    min-height: 82vh;
                "
                class="ml-lg-4 mt-4 mt-lg-0"
            >
                <!-- Lock Teaser for Viper Core Tier -->
                <div v-if="isViperCore" class="teaser-container mx-auto my-auto py-12 px-8 text-center rounded-lg shadow-lg">
                    <div class="icon-circle mb-6 mx-auto">
                        <b-icon icon="lock-fill" font-scale="3" class="lock-icon"></b-icon>
                    </div>
                    <h3 class="teaser-title mb-4">Upgrade to Unlock Kanban Board</h3>
                    <p class="teaser-description mb-6 mx-auto">
                        Transform your logistics operations with a dynamic Kanban workflow. Track jobs from initial email enquiry to final airline confirmation in real-time.
                    </p>
                    <b-button class="upgrade-btn px-8 py-3" variant="primary">
                        Upgrade to Viper Tactical / Command
                    </b-button>
                </div>

                <!-- Active Kanban Workspace for Tactical/Command -->
                <div v-else class="kanban-workspace p-4 d-flex flex-column h-100">
                    <!-- Header -->
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom" style="gap: 16px;">
                        <div>
                            <span class="text-uppercase tracking-wider text-primary font-weight-bold small mb-1 d-block" style="letter-spacing: 1.5px; opacity: 0.7;">
                                Workflow Operations
                            </span>
                            <h4 class="font-weight-extrabold text-dark mb-0 font-family-inter" style="letter-spacing: -0.5px; font-weight: 800;">
                                Operational Board
                            </h4>
                        </div>
                        
                        <!-- Toggle Perspective Buttons -->
                        <div class="d-flex align-items-center" style="gap: 8px;">
                            <b-button-group size="sm">
                                <b-button 
                                    :variant="currentView === 'process' ? 'primary' : 'outline-primary'" 
                                    @click="currentView = 'process'"
                                    class="px-3"
                                >
                                    <b-icon icon="layout-three-columns" class="mr-1"></b-icon> Process View
                                </b-button>
                                <b-button 
                                    :variant="currentView === 'schedule' ? 'primary' : 'outline-primary'" 
                                    @click="currentView = 'schedule'"
                                    class="px-3"
                                >
                                    <b-icon :icon="isPricing ? 'people-fill' : 'calendar3'" class="mr-1"></b-icon> {{ isPricing ? 'Staff View' : 'Schedule View' }}
                                </b-button>
                            </b-button-group>
                        </div>
                    </div>

                    <!-- Filter Control Panel -->
                    <div class="filter-panel p-3 mb-4 rounded-lg bg-light border d-flex flex-wrap align-items-center justify-content-between" style="gap: 16px;">
                        <!-- Staff Workload Filter -->
                        <div v-if="!isOps" class="d-flex align-items-center flex-wrap" style="gap: 8px;">
                            <span class="small font-weight-bold text-muted text-uppercase">Operator:</span>
                            <b-form-select 
                                v-model="selectedOperatorId" 
                                size="sm" 
                                class="filter-select"
                                style="width: 240px; border-radius: 8px;"
                            >
                                <option :value="null">All Operators</option>
                                <option value="unassigned">Unassigned Jobs</option>
                                <option v-for="op in opsOperators" :key="op.id" :value="op.id">
                                    {{ op.name }} ({{ op.active_jobs }} jobs) {{ op.active_jobs >= 15 ? '🔴 OVERLOAD' : '🟢 OK' }}
                                </option>
                            </b-form-select>
                        </div>
                        <div v-else class="d-flex align-items-center flex-wrap" style="gap: 8px;">
                            <span class="small font-weight-bold text-muted text-uppercase">Operator:</span>
                            <span class="badge badge-primary px-3 py-2 font-weight-bold font-family-inter" style="font-size: 0.85rem; border-radius: 8px; background-color: #355594; color: #ffffff;">
                                {{ currentUser ? currentUser.name : 'My Assigned' }}
                            </span>
                        </div>

                        <!-- Date Filters -->
                        <div class="d-flex align-items-center flex-wrap" style="gap: 8px;">
                            <span class="small font-weight-bold text-muted text-uppercase">Clearance:</span>
                            <b-form-input 
                                type="date" 
                                v-model="startDateFilter" 
                                size="sm" 
                                class="filter-date-input"
                                style="width: 140px; border-radius: 8px;"
                            ></b-form-input>
                            <span class="text-muted small">to</span>
                            <b-form-input 
                                type="date" 
                                v-model="endDateFilter" 
                                size="sm" 
                                class="filter-date-input"
                                style="width: 140px; border-radius: 8px;"
                            ></b-form-input>
                            <b-button size="sm" variant="outline-primary" @click="setTodayFilter" style="border-radius: 8px;">
                                Today
                            </b-button>
                            <b-button size="sm" variant="link" class="text-muted p-0 ml-1" @click="clearDateFilter">
                                Clear
                            </b-button>
                        </div>
                    </div>

                    <!-- Stuck Jobs Widget Banner -->
                    <div v-if="stuckJobs.length > 0" class="stuck-banner p-3 mb-4 rounded-lg bg-light-warning border border-warning">
                        <div class="d-flex align-items-center mb-2">
                            <b-icon icon="exclamation-triangle-fill" class="text-warning mr-2" font-scale="1.2"></b-icon>
                            <span class="font-weight-bold text-warning-dark small text-uppercase">
                                Attention Required: Stuck Jobs (>30m Inactive)
                            </span>
                        </div>
                        <div class="d-flex flex-wrap" style="gap: 8px;">
                            <div 
                                v-for="job in stuckJobs" 
                                :key="job.id" 
                                class="stuck-chip p-2 rounded d-flex align-items-center cursor-pointer"
                                @click="openJobInbox(job)"
                            >
                                <b-icon icon="clock-fill" class="mr-1 text-warning"></b-icon>
                                <span class="font-weight-bold mr-1">{{ job.execution_job_no || job.enquiry_no }}:</span>
                                <span class="text-muted small">{{ job.status }} for {{ getStuckDurationText(job) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Kanban Columns Grid -->
                    <div class="kanban-grid flex-grow-1 overflow-auto">
                        <b-spinner v-if="loadingJobs" class="d-block mx-auto my-12 text-primary"></b-spinner>
                        
                        <div v-else class="d-flex w-100" style="gap: 16px; min-height: 500px;">
                            <!-- Dynamic rendering of columns based on view type -->
                            <div 
                                v-for="(col, colKey) in (currentView === 'process' ? processColumns : (isPricing ? staffColumns : scheduleColumns))" 
                                :key="colKey"
                                class="kanban-column d-flex flex-column rounded-xl p-3"
                            >
                                <!-- Column Header -->
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="font-weight-bold mb-0 text-slate">{{ col.title }}</h6>
                                    <b-badge pill :variant="col.badgeClass" class="column-count-badge">
                                        {{ col.jobs.length }}
                                    </b-badge>
                                </div>

                                <!-- Cards List -->
                                <div class="cards-container flex-grow-1 overflow-y-auto" style="max-height: 60vh;" @dragover.prevent @drop="dropCard($event, colKey)">
                                    <div v-if="col.jobs.length === 0" class="empty-column-placeholder text-center text-muted py-8 rounded">
                                        <b-icon icon="inbox" font-scale="1.5" class="mb-2 opacity-5"></b-icon>
                                        <p class="small mb-0">No jobs in this stage</p>
                                    </div>

                                    <!-- Staff View: group cards by clearance date status -->
                                    <template v-if="currentView === 'schedule' && isPricing">
                                        <!-- Overdue Group -->
                                        <div v-if="col.groups.overdue.length > 0" class="mb-3">
                                            <div class="small font-weight-bold text-danger mb-2 px-1 text-uppercase tracking-wider">
                                                🔴 Overdue / Previous ({{ col.groups.overdue.length }})
                                            </div>
                                            <div 
                                                v-for="job in col.groups.overdue" 
                                                :key="job.id"
                                                class="kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border border-danger-light position-relative"
                                                draggable="true"
                                                @dragstart="dragStart($event, job)"
                                                @dragend="dragEnd"
                                                @click="openJobInbox(job)"
                                            >
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <span class="job-card-id font-weight-bold text-primary">
                                                        {{ job.execution_job_no || job.enquiry_no }}
                                                    </span>
                                                    <b-badge :variant="getStatusBadgeVariant(job.status)" class="job-status-badge text-capitalize">
                                                        {{ job.status }}
                                                    </b-badge>
                                                </div>
                                                <div class="job-customer mb-2 text-truncate font-weight-bold small text-slate-dark">
                                                    <b-icon icon="person" class="mr-1 text-muted"></b-icon>
                                                    {{ job.client ? job.client.name : 'Direct Consignment / Walk-in' }}
                                                </div>
                                                <div class="job-awb-row mb-2 d-flex align-items-center justify-content-between small">
                                                    <span class="text-muted">AWB/MBL:</span>
                                                    <a 
                                                        v-if="getAwbNumber(job)" 
                                                        href="#" 
                                                        @click.stop.prevent="openMilestoneDrawer(job)" 
                                                        class="awb-link font-weight-extrabold text-success"
                                                    >
                                                        {{ getAwbNumber(job) }}
                                                    </a>
                                                    <span v-else class="text-muted font-italic">Unassigned</span>
                                                </div>
                                                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style="gap: 4px;">
                                                    <div class="clearance-date-badge text-danger font-weight-bold">
                                                        <b-icon icon="calendar-event" class="mr-1"></b-icon>
                                                        {{ formatClearanceDate(job) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Today Group -->
                                        <div v-if="col.groups.today.length > 0" class="mb-3">
                                            <div class="small font-weight-bold text-success mb-2 px-1 text-uppercase tracking-wider">
                                                🟡 Today ({{ col.groups.today.length }})
                                            </div>
                                            <div 
                                                v-for="job in col.groups.today" 
                                                :key="job.id"
                                                class="kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border border-success-light position-relative"
                                                draggable="true"
                                                @dragstart="dragStart($event, job)"
                                                @dragend="dragEnd"
                                                @click="openJobInbox(job)"
                                            >
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <span class="job-card-id font-weight-bold text-primary">
                                                        {{ job.execution_job_no || job.enquiry_no }}
                                                    </span>
                                                    <b-badge :variant="getStatusBadgeVariant(job.status)" class="job-status-badge text-capitalize">
                                                        {{ job.status }}
                                                    </b-badge>
                                                </div>
                                                <div class="job-customer mb-2 text-truncate font-weight-bold small text-slate-dark">
                                                    <b-icon icon="person" class="mr-1 text-muted"></b-icon>
                                                    {{ job.client ? job.client.name : 'Direct Consignment / Walk-in' }}
                                                </div>
                                                <div class="job-awb-row mb-2 d-flex align-items-center justify-content-between small">
                                                    <span class="text-muted">AWB/MBL:</span>
                                                    <a 
                                                        v-if="getAwbNumber(job)" 
                                                        href="#" 
                                                        @click.stop.prevent="openMilestoneDrawer(job)" 
                                                        class="awb-link font-weight-extrabold text-success"
                                                    >
                                                        {{ getAwbNumber(job) }}
                                                    </a>
                                                    <span v-else class="text-muted font-italic">Unassigned</span>
                                                </div>
                                                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style="gap: 4px;">
                                                    <div class="clearance-date-badge text-success font-weight-bold">
                                                        <b-icon icon="calendar-event" class="mr-1"></b-icon>
                                                        {{ formatClearanceDate(job) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Tomorrow Group -->
                                        <div v-if="col.groups.tomorrow.length > 0" class="mb-3">
                                            <div class="small font-weight-bold text-info mb-2 px-1 text-uppercase tracking-wider">
                                                🔵 Tomorrow ({{ col.groups.tomorrow.length }})
                                            </div>
                                            <div 
                                                v-for="job in col.groups.tomorrow" 
                                                :key="job.id"
                                                class="kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border position-relative"
                                                draggable="true"
                                                @dragstart="dragStart($event, job)"
                                                @dragend="dragEnd"
                                                @click="openJobInbox(job)"
                                            >
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <span class="job-card-id font-weight-bold text-primary">
                                                        {{ job.execution_job_no || job.enquiry_no }}
                                                    </span>
                                                    <b-badge :variant="getStatusBadgeVariant(job.status)" class="job-status-badge text-capitalize">
                                                        {{ job.status }}
                                                    </b-badge>
                                                </div>
                                                <div class="job-customer mb-2 text-truncate font-weight-bold small text-slate-dark">
                                                    <b-icon icon="person" class="mr-1 text-muted"></b-icon>
                                                    {{ job.client ? job.client.name : 'Direct Consignment / Walk-in' }}
                                                </div>
                                                <div class="job-awb-row mb-2 d-flex align-items-center justify-content-between small">
                                                    <span class="text-muted">AWB/MBL:</span>
                                                    <a 
                                                        v-if="getAwbNumber(job)" 
                                                        href="#" 
                                                        @click.stop.prevent="openMilestoneDrawer(job)" 
                                                        class="awb-link font-weight-extrabold text-success"
                                                    >
                                                        {{ getAwbNumber(job) }}
                                                    </a>
                                                    <span v-else class="text-muted font-italic">Unassigned</span>
                                                </div>
                                                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style="gap: 4px;">
                                                    <div class="clearance-date-badge text-info font-weight-bold">
                                                        <b-icon icon="calendar-event" class="mr-1"></b-icon>
                                                        {{ formatClearanceDate(job) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Upcoming Group -->
                                        <div v-if="col.groups.upcoming.length > 0" class="mb-3">
                                            <div class="small font-weight-bold text-secondary mb-2 px-1 text-uppercase tracking-wider">
                                                🟢 Upcoming / Future ({{ col.groups.upcoming.length }})
                                            </div>
                                            <div 
                                                v-for="job in col.groups.upcoming" 
                                                :key="job.id"
                                                class="kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border position-relative"
                                                draggable="true"
                                                @dragstart="dragStart($event, job)"
                                                @dragend="dragEnd"
                                                @click="openJobInbox(job)"
                                            >
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <span class="job-card-id font-weight-bold text-primary">
                                                        {{ job.execution_job_no || job.enquiry_no }}
                                                    </span>
                                                    <b-badge :variant="getStatusBadgeVariant(job.status)" class="job-status-badge text-capitalize">
                                                        {{ job.status }}
                                                    </b-badge>
                                                </div>
                                                <div class="job-customer mb-2 text-truncate font-weight-bold small text-slate-dark">
                                                    <b-icon icon="person" class="mr-1 text-muted"></b-icon>
                                                    {{ job.client ? job.client.name : 'Direct Consignment / Walk-in' }}
                                                </div>
                                                <div class="job-awb-row mb-2 d-flex align-items-center justify-content-between small">
                                                    <span class="text-muted">AWB/MBL:</span>
                                                    <a 
                                                        v-if="getAwbNumber(job)" 
                                                        href="#" 
                                                        @click.stop.prevent="openMilestoneDrawer(job)" 
                                                        class="awb-link font-weight-extrabold text-success"
                                                    >
                                                        {{ getAwbNumber(job) }}
                                                    </a>
                                                    <span v-else class="text-muted font-italic">Unassigned</span>
                                                </div>
                                                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style="gap: 4px;">
                                                    <div class="clearance-date-badge text-muted">
                                                        <b-icon icon="calendar-event" class="mr-1"></b-icon>
                                                        {{ formatClearanceDate(job) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <!-- Process or Schedule View -->
                                    <template v-else>
                                        <div 
                                            v-for="job in col.jobs" 
                                            :key="job.id"
                                            class="kanban-card p-3 mb-3 bg-white rounded-lg shadow-sm border position-relative"
                                            draggable="true"
                                            @dragstart="dragStart($event, job)"
                                            @dragend="dragEnd"
                                            @click="openJobInbox(job)"
                                        >
                                            <!-- Job ID Header -->
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <span class="job-card-id font-weight-bold text-primary">
                                                    {{ job.execution_job_no || job.enquiry_no }}
                                                </span>
                                                <b-badge :variant="getStatusBadgeVariant(job.status)" class="job-status-badge text-capitalize">
                                                    {{ job.status }}
                                                </b-badge>
                                            </div>

                                            <!-- Customer Details -->
                                            <div class="job-customer mb-2 text-truncate font-weight-bold small text-slate-dark">
                                                <b-icon icon="person" class="mr-1 text-muted"></b-icon>
                                                {{ job.client ? job.client.name : 'Direct Consignment / Walk-in' }}
                                            </div>

                                            <!-- AWB / MBL number (Click to open milestone drawer) -->
                                            <div class="job-awb-row mb-2 d-flex align-items-center justify-content-between small">
                                                <span class="text-muted">AWB/MBL:</span>
                                                <a 
                                                    v-if="getAwbNumber(job)" 
                                                    href="#" 
                                                    @click.stop.prevent="openMilestoneDrawer(job)" 
                                                    class="awb-link font-weight-extrabold text-success"
                                                >
                                                    {{ getAwbNumber(job) }}
                                                </a>
                                                <span v-else class="text-muted font-italic">Unassigned</span>
                                            </div>

                                            <!-- Date and operator details footer -->
                                            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style="gap: 4px;">
                                                <!-- Clearance Date -->
                                                <div class="clearance-date-badge text-muted">
                                                    <b-icon icon="calendar-event" class="mr-1"></b-icon>
                                                    {{ formatClearanceDate(job) }}
                                                </div>
                                                <!-- Operator Avatar/Name -->
                                                <div class="operator-profile text-muted text-truncate" style="max-width: 100px;">
                                                    <b-icon icon="person-circle" class="mr-1" :class="job.operator ? 'text-primary' : 'text-muted'"></b-icon>
                                                    {{ job.operator ? job.operator.name : 'Unassigned' }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side Milestone tracking Drawer -->
        <b-sidebar 
            id="milestone-drawer" 
            v-model="milestoneDrawerOpen" 
            title="Milestone Tracking Drawer" 
            right 
            shadow 
            no-header-close
            width="320px"
        >
            <div class="px-4 py-3 h-100 d-flex flex-column font-family-inter">
                <div v-if="selectedMilestoneJob" class="mb-4">
                    <h5 class="font-weight-extrabold text-primary mb-1">
                        {{ selectedMilestoneJob.execution_job_no || selectedMilestoneJob.enquiry_no }}
                    </h5>
                    <p class="text-muted small mb-2">
                        Client: <strong>{{ selectedMilestoneJob.client ? selectedMilestoneJob.client.name : 'Direct Consignment' }}</strong>
                    </p>
                    <div class="p-2 bg-light rounded-lg border text-center">
                        <span class="text-muted small d-block">Waybill Document Number:</span>
                        <strong class="text-success font-weight-black" style="font-size: 1rem;">
                            {{ selectedMilestoneAwb }}
                        </strong>
                    </div>
                </div>
                
                <hr class="my-2" />

                <!-- Vertical Milestone Timeline -->
                <div class="milestone-timeline flex-grow-1 py-3">
                    <div 
                        v-for="(m, idx) in milestones" 
                        :key="idx" 
                        class="milestone-item position-relative d-flex mb-4"
                        :class="{ 'completed': idx <= activeMilestoneIndex }"
                    >
                        <!-- Vertical line indicator -->
                        <div v-if="idx < milestones.length - 1" class="timeline-line"></div>
                        
                        <!-- Marker -->
                        <div class="milestone-marker d-flex align-items-center justify-content-center z-index-1">
                            <b-icon 
                                :icon="idx <= activeMilestoneIndex ? 'check-circle-fill' : 'circle'" 
                                :variant="idx <= activeMilestoneIndex ? 'success' : 'secondary'"
                                font-scale="1.2"
                            ></b-icon>
                        </div>
                        
                        <!-- Content -->
                        <div class="milestone-content pl-3 flex-grow-1">
                            <h6 class="mb-1 font-weight-bold" :class="idx <= activeMilestoneIndex ? 'text-success' : 'text-slate-muted'">
                                {{ m.label }}
                            </h6>
                            <p class="text-muted small mb-0">{{ m.desc }}</p>
                        </div>
                    </div>
                </div>

                <div class="mt-auto pt-3 border-top">
                    <b-button variant="primary" block size="sm" @click="openJobInbox(selectedMilestoneJob)" v-if="selectedMilestoneJob">
                        <b-icon icon="envelope-fill" class="mr-1"></b-icon> Open Inbox Workflow
                    </b-button>
                </div>
            </div>
        </b-sidebar>
    </b-container>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import ApiService from "@/core/services/api.service";

export default {
    name: "KanbanBoard",
    components: {
        SideBar
    },
    data() {
        return {
            isDragging: false,
            jobs: [],
            operators: [],
            loadingJobs: false,
            currentView: "process", // "process" or "schedule"
            selectedOperatorId: null,
            startDateFilter: "",
            endDateFilter: "",
            milestoneDrawerOpen: false,
            selectedMilestoneJob: null,
            selectedMilestoneAwb: "",
            milestones: [
                { label: "Cargo Accepted", desc: "Shipment intake initialized and registered in system" },
                { label: "Manifested", desc: "Cargo manifests compiled and cargo flight detail set" },
                { label: "Departed", desc: "Aircraft/Vessel departed from origin station" },
                { label: "Arrived", desc: "Cargo arrived at destination station port" },
                { label: "Customs Cleared", desc: "Cargo cleared through local customs authorities" },
                { label: "Delivered", desc: "Cargo delivered to consignee warehouse" }
            ]
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        isViperCore() {
            const tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
            return !tier || tier === 'viper_core';
        },
        isPricing() {
            return this.currentUser && this.currentUser.designation === 'pricing';
        },
        isOps() {
            return this.currentUser && this.currentUser.designation === 'operations';
        },
        opsOperators() {
            return this.operators.filter(op => op.designation === 'operations');
        },
        filteredJobs() {
            let list = this.jobs;
            if (this.isOps) {
                list = list.filter(j => j.operator_id === this.currentUser.id);
            }

            // Filter by selected operator
            if (this.selectedOperatorId) {
                if (this.selectedOperatorId === 'unassigned') {
                    list = list.filter(j => !j.operator_id);
                } else {
                    list = list.filter(j => j.operator_id === this.selectedOperatorId);
                }
            }

            // Filter by planned clearance date range
            if (this.startDateFilter) {
                list = list.filter(j => {
                    const dateStr = this.getClearanceDate(j);
                    if (!dateStr) return false;
                    return dateStr >= this.startDateFilter;
                });
            }
            if (this.endDateFilter) {
                list = list.filter(j => {
                    const dateStr = this.getClearanceDate(j);
                    if (!dateStr) return false;
                    return dateStr <= this.endDateFilter;
                });
            }

            return list;
        },
        processColumns() {
            const cols = {
                new: { title: "New", jobs: [], badgeClass: "secondary" },
                assigned: { title: "Assigned", jobs: [], badgeClass: "primary" },
                processing: { title: "Processing", jobs: [], badgeClass: "info" },
                awaiting_customer: { title: "Awaiting Customer", jobs: [], badgeClass: "warning" },
                completed: { title: "Completed", jobs: [], badgeClass: "success" }
            };

            this.filteredJobs.forEach(job => {
                const status = typeof job.status === "object" && job.status !== null ? (job.status.value || job.status.name) : job.status;
                if (status === "Intake") {
                    if (!job.operator_id) {
                        cols.new.jobs.push(job);
                    } else {
                        cols.assigned.jobs.push(job);
                    }
                } else if (status === "AI Extraction" || status === "Verification") {
                    cols.processing.jobs.push(job);
                } else if (
                    status === "Generation" || 
                    status === "PDF Generated" || 
                    status === "Sent to Airline" || 
                    status === "Airline Confirmed"
                ) {
                    cols.awaiting_customer.jobs.push(job);
                } else if (status === "Completed") {
                    cols.completed.jobs.push(job);
                }
            });

            return cols;
        },
        scheduleColumns() {
            const cols = {
                overdue: { title: "Overdue / Previous", jobs: [], badgeClass: "danger" },
                today: { title: "Today", jobs: [], badgeClass: "success" },
                tomorrow: { title: "Tomorrow", jobs: [], badgeClass: "info" },
                upcoming: { title: "Upcoming / Future", jobs: [], badgeClass: "secondary" }
            };

            const todayStr = new Date().toISOString().split("T")[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split("T")[0];

            this.filteredJobs.forEach(job => {
                const dateStr = this.getClearanceDate(job);
                if (!dateStr) {
                    // Show in upcoming/future if clearance date is unset so it is not lost
                    cols.upcoming.jobs.push(job);
                    return;
                }

                const jobDateStr = dateStr.split("T")[0];
                if (jobDateStr < todayStr) {
                    if (job.status !== "Completed") {
                        cols.overdue.jobs.push(job);
                    } else {
                        cols.upcoming.jobs.push(job);
                    }
                } else if (jobDateStr === todayStr) {
                    cols.today.jobs.push(job);
                } else if (jobDateStr === tomorrowStr) {
                    cols.tomorrow.jobs.push(job);
                } else {
                    cols.upcoming.jobs.push(job);
                }
            });

            return cols;
        },
        staffColumns() {
            const cols = {};
            const opsStaff = this.operators.filter(op => op.designation === 'operations');
            opsStaff.forEach(op => {
                cols[op.id] = {
                    title: op.name,
                    badgeClass: "primary",
                    jobs: [],
                    groups: {
                        overdue: [],
                        today: [],
                        tomorrow: [],
                        upcoming: []
                    }
                };
            });
            // Add Unassigned column
            cols['unassigned'] = {
                title: "Unassigned",
                badgeClass: "secondary",
                jobs: [],
                groups: {
                    overdue: [],
                    today: [],
                    tomorrow: [],
                    upcoming: []
                }
            };

            const todayStr = new Date().toISOString().split("T")[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split("T")[0];

            this.filteredJobs.forEach(job => {
                const opId = job.operator_id;
                const targetCol = (opId && cols[opId]) ? cols[opId] : cols['unassigned'];
                targetCol.jobs.push(job);

                // Group by clearance date
                const dateStr = this.getClearanceDate(job);
                if (!dateStr) {
                    targetCol.groups.upcoming.push(job);
                    return;
                }

                const jobDateStr = dateStr.split("T")[0];
                if (jobDateStr < todayStr) {
                    if (job.status !== "Completed") {
                        targetCol.groups.overdue.push(job);
                    } else {
                        targetCol.groups.upcoming.push(job);
                    }
                } else if (jobDateStr === todayStr) {
                    targetCol.groups.today.push(job);
                } else if (jobDateStr === tomorrowStr) {
                    targetCol.groups.tomorrow.push(job);
                } else {
                    targetCol.groups.upcoming.push(job);
                }
            });

            return cols;
        },
        stuckJobs() {
            return this.jobs.filter(job => {
                const status = typeof job.status === "object" && job.status !== null ? (job.status.value || job.status.name) : job.status;
                if (status === "Completed" || status === "Lost") return false;
                const updated = new Date(job.updated_at);
                const diffMs = new Date() - updated;
                // Stuck if pending in current state for more than 30 minutes
                return diffMs > 30 * 60 * 1000;
            });
        },
        activeMilestoneIndex() {
            if (!this.selectedMilestoneJob) return -1;
            const status = typeof this.selectedMilestoneJob.status === "object" && this.selectedMilestoneJob.status !== null 
                ? (this.selectedMilestoneJob.status.value || this.selectedMilestoneJob.status.name) 
                : this.selectedMilestoneJob.status;
            switch (status) {
                case "Intake":
                case "AI Extraction":
                    return 0; // Cargo Accepted
                case "Verification":
                case "Generation":
                    return 1; // Manifested
                case "PDF Generated":
                    return 2; // Departed
                case "Sent to Airline":
                    return 3; // Arrived
                case "Airline Confirmed":
                    return 4; // Customs Cleared
                case "Completed":
                    return 5; // Delivered
                default:
                    return -1;
            }
        }
    },
    mounted() {
        if (!this.isViperCore) {
            this.loadKanbanData();
        }
    },
    methods: {
        loadKanbanData() {
            this.loadingJobs = true;
            ApiService.get("/user/inbox/staff-workloads")
                .then(res => {
                    this.operators = res.data;
                })
                .catch(err => console.error("Failed to load staff workloads:", err));

            ApiService.query("/user/inbox/active-jobs", { params: { include_completed: 1 } })
                .then(res => {
                    this.jobs = res.data;
                })
                .catch(err => console.error("Failed to load active jobs for Kanban:", err))
                .finally(() => {
                    this.loadingJobs = false;
                });
        },
        getClearanceDate(job) {
            if (job.transport_mode === "air" && job.air_shipment_detail) {
                return job.air_shipment_detail.flight_date;
            } else if (job.transport_mode === "sea" && job.sea_shipment_detail) {
                return job.sea_shipment_detail.vessel_etd;
            }
            return null;
        },
        formatClearanceDate(job) {
            const dateStr = this.getClearanceDate(job);
            if (!dateStr) return "Clearance date unset";
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        },
        getAwbNumber(job) {
            if (job.transport_mode === "air" && job.airway_bills && job.airway_bills.length > 0) {
                const wb = job.airway_bills[0];
                return wb.awb_code ? `${wb.awb_code}-${wb.awb_no}` : wb.awb_no;
            } else if (job.transport_mode === "sea" && job.houseway_bills && job.houseway_bills.length > 0) {
                const wb = job.houseway_bills[0];
                return wb.reference_id || wb.awb_no;
            }
            return "";
        },
        getStatusBadgeVariant(statusObj) {
            const status = typeof statusObj === "object" && statusObj !== null ? (statusObj.value || statusObj.name) : statusObj;
            switch (status) {
                case "Intake": return "secondary";
                case "AI Extraction":
                case "Verification":
                    return "info";
                case "Generation":
                case "PDF Generated":
                case "Sent to Airline":
                case "Airline Confirmed":
                    return "warning";
                case "Completed": return "success";
                case "Lost": return "danger";
                default: return "light";
            }
        },
        getStuckDurationText(job) {
            const updated = new Date(job.updated_at);
            const diffMs = new Date() - updated;
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 60) {
                return `${diffMins}m`;
            }
            const diffHours = Math.floor(diffMins / 60);
            const remainMins = diffMins % 60;
            return `${diffHours}h ${remainMins}m`;
        },
        setTodayFilter() {
            const todayStr = new Date().toISOString().split("T")[0];
            this.startDateFilter = todayStr;
            this.endDateFilter = todayStr;
        },
        clearDateFilter() {
            this.startDateFilter = "";
            this.endDateFilter = "";
        },
        openMilestoneDrawer(job) {
            this.selectedMilestoneJob = job;
            this.selectedMilestoneAwb = this.getAwbNumber(job) || "No waybill number allocated";
            this.milestoneDrawerOpen = true;
        },
        openJobInbox(job) {
            if (this.isDragging) return;
            if (job.email_threads && job.email_threads.length > 0) {
                const threadKey = job.email_threads[0].thread_key;
                this.$router.push({ path: "/inbox", query: { thread_key: threadKey } });
            } else {
                this.$bvToast.toast("No linked email thread found for this operational job.", {
                    title: "No Thread",
                    variant: "info",
                    solid: true
                });
            }
        },
        dragStart(e, job) {
            this.isDragging = true;
            e.dataTransfer.setData("text/plain", job.id.toString());
            e.dataTransfer.effectAllowed = "move";
        },
        dragEnd() {
            setTimeout(() => {
                this.isDragging = false;
            }, 100);
        },
        dropCard(e, targetColKey) {
            const jobIdStr = e.dataTransfer.getData("text/plain");
            const jobId = parseInt(jobIdStr);
            if (!jobId) return;

            const job = this.jobs.find(j => j.id === jobId);
            if (!job) return;

            if (this.currentView === "process") {
                let newStatus = job.status;
                let newOperatorId = job.operator_id;

                if (targetColKey === "new") {
                    newStatus = "Intake";
                    newOperatorId = null;
                } else if (targetColKey === "assigned") {
                    newStatus = "Intake";
                    newOperatorId = job.operator_id || (this.currentUser ? this.currentUser.id : null);
                } else if (targetColKey === "processing") {
                    newStatus = "AI Extraction";
                } else if (targetColKey === "awaiting_customer") {
                    newStatus = "Generation";
                } else if (targetColKey === "completed") {
                    newStatus = "Completed";
                }

                ApiService.post(`/user/inbox/jobs/${jobId}/update-status`, {
                    status: newStatus,
                    operator_id: newOperatorId
                })
                .then(() => {
                    this.$bvToast.toast(`Job status updated to ${newStatus}`, {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.loadKanbanData();
                })
                .catch(err => {
                    console.error("Failed to update status on drop:", err);
                    this.$bvToast.toast("Failed to update status.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                });

            } else if (this.currentView === "schedule") {
                if (this.isPricing) {
                    const newOperatorId = targetColKey === 'unassigned' ? null : parseInt(targetColKey);

                    ApiService.post(`/user/inbox/jobs/${jobId}/update-status`, {
                        operator_id: newOperatorId
                    })
                    .then(() => {
                        this.$bvToast.toast(`Job assignment updated successfully.`, {
                            title: "Success",
                            variant: "success",
                            solid: true
                        });
                        this.loadKanbanData();
                    })
                    .catch(err => {
                        console.error("Failed to update job assignment on drop:", err);
                        this.$bvToast.toast("Failed to update assignment.", {
                            title: "Error",
                            variant: "danger",
                            solid: true
                        });
                    });
                } else {
                    let newDate = "";
                    const today = new Date();
                    if (targetColKey === "overdue") {
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        newDate = yesterday.toISOString().split("T")[0];
                    } else if (targetColKey === "today") {
                        newDate = today.toISOString().split("T")[0];
                    } else if (targetColKey === "tomorrow") {
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        newDate = tomorrow.toISOString().split("T")[0];
                    } else if (targetColKey === "upcoming") {
                        const future = new Date(today);
                        future.setDate(future.getDate() + 3);
                        newDate = future.toISOString().split("T")[0];
                    }

                    ApiService.post(`/user/inbox/jobs/${jobId}/update-status`, {
                        planned_clearance_date: newDate
                    })
                    .then(() => {
                        this.$bvToast.toast(`Planned clearance date updated to ${newDate}`, {
                            title: "Success",
                            variant: "success",
                            solid: true
                        });
                        this.loadKanbanData();
                    })
                    .catch(err => {
                        console.error("Failed to update date on drop:", err);
                        this.$bvToast.toast("Failed to update clearance date.", {
                            title: "Error",
                            variant: "danger",
                            solid: true
                        });
                    });
                }
            }
        }
    }
};
</script>

<style scoped>
.body-color {
    min-height: 80vh;
    padding-bottom: 2rem;
    box-sizing: border-box;
}

.font-family-inter {
    font-family: 'Inter', sans-serif !important;
}

.teaser-container {
    max-width: 600px;
    background: linear-gradient(135deg, #f8fafd 0%, #ffffff 100%);
    border: 1px solid rgba(53, 85, 148, 0.15);
    border-radius: 24px;
}

.icon-circle {
    width: 90px;
    height: 90px;
    background: linear-gradient(135deg, #ff9b8a 0%, #ff5b5b 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 10px 20px rgba(255, 91, 91, 0.2);
}

.teaser-title {
    color: #1e3a8a;
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

/* Kanban workspace styles */
.kanban-workspace {
    font-family: 'Inter', sans-serif;
    color: #334155;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.filter-panel {
    background: #f8fafc;
    border-color: #e2e8f0 !important;
}

.filter-select, .filter-date-input {
    border-color: #cbd5e1;
    font-size: 0.85rem;
    color: #475569;
}

.bg-light-warning {
    background-color: #fffbeb;
}
.text-warning-dark {
    color: #92400e;
}

.stuck-banner {
    border-color: #fde68a !important;
}

.stuck-chip {
    background: #fef3c7;
    border: 1px solid #fcd34d;
    font-size: 0.8rem;
    color: #92400e;
    transition: all 0.2s ease;
}
.stuck-chip:hover {
    background: #fde68a;
    transform: scale(1.02);
}

.kanban-grid {
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 12px;
    overflow-x: auto;
}

.kanban-column {
    flex: 1;
    min-width: 260px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    max-height: 72vh;
}

.column-count-badge {
    font-size: 0.8rem;
    padding: 0.35em 0.6em;
}

.empty-column-placeholder {
    border: 2px dashed #cbd5e1;
    background: #f8fafc;
    margin-top: 10px;
}

.kanban-card {
    border-color: #e2e8f0 !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.kanban-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(53, 85, 148, 0.1), 0 4px 6px -2px rgba(53, 85, 148, 0.05) !important;
    border-color: #93c5fd !important;
}

.job-card-id {
    font-size: 0.9rem;
    letter-spacing: -0.2px;
}

.job-status-badge {
    font-size: 0.7rem;
    font-weight: 700;
}

.awb-link {
    text-decoration: underline;
    transition: color 0.15s ease;
}
.awb-link:hover {
    color: #15803d !important;
}

/* Milestone tracking drawer styles */
.milestone-timeline {
    position: relative;
}

.milestone-item {
    z-index: 2;
}

.timeline-line {
    position: absolute;
    top: 24px;
    left: 11px;
    width: 2px;
    height: 100%;
    background: #cbd5e1;
    z-index: 1;
}

.milestone-item.completed .timeline-line {
    background: #22c55e;
}

.milestone-marker {
    width: 24px;
    height: 24px;
    background: #ffffff;
    border-radius: 50%;
}

.text-slate-muted {
    color: #94a3b8;
}

.z-index-1 {
    z-index: 1;
}

.cards-container {
    min-height: 250px;
}
</style>
