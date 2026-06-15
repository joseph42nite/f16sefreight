<template>
    <b-container fluid class="body-color">
        <div class="d-flex flex-column flex-lg-row h-100">
            <!-- Sidebar -->
            <SideBar :collapsed="drawerOpen"></SideBar>

            <!-- Main Workspace Container -->
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
                    height: 82vh;
                "
                class="ml-lg-4 mt-4 mt-lg-0"
            >
                <!-- Viper Core Lock Teaser -->
                <div v-if="isViperCore" class="teaser-container mx-auto my-auto py-10 px-8 text-center rounded-lg shadow-lg">
                    <div class="icon-circle mb-6 mx-auto">
                        <b-icon icon="envelope-open-fill" font-scale="3" class="lock-icon"></b-icon>
                    </div>
                    <h3 class="teaser-title mb-4">Upgrade to Unlock Inbox</h3>
                    <p class="teaser-description mb-6 mx-auto">
                        Connect your company mailboxes to sync operational emails directly. Triage inquiries, auto-create Job cards, track response SLAs, and reply to customers in a single unified view.
                    </p>
                    <b-button class="upgrade-btn px-8 py-3" variant="primary">
                        Upgrade to Viper Tactical / Command
                    </b-button>
                </div>

                <!-- 3-Column Active Workspace for Tactical & Command -->
                <div v-else class="workspace-layout d-flex flex-row h-100 w-100 position-relative">
                    
                    <!-- COLUMN 1: Folders Directory -->
                    <div class="column-folders p-4 d-flex flex-column border-right" :class="{ 'cols-hidden': drawerOpen }">
                        <div class="folders-header mb-4 px-2">
                            <h5 class="mb-0 font-weight-bold" style="color: #355594; font-family: 'Inter', sans-serif;">Inbox Folders</h5>
                        </div>
                        <ul class="nav flex-column folders-nav">
                            <li v-for="(folder, key) in foldersList" :key="key" class="nav-item mb-1">
                                <a 
                                    href="#" 
                                    class="nav-link d-flex align-items-center justify-content-between py-2 px-3 rounded-lg"
                                    :class="{ 'active': activeFolder === key }"
                                    @click.prevent="selectFolder(key)"
                                >
                                    <div class="d-flex align-items-center">
                                        <b-icon :icon="folder.icon" class="mr-3 text-muted icon-size" :class="{ 'text-primary': activeFolder === key }"></b-icon>
                                        <span class="folder-label">{{ folder.label }}</span>
                                    </div>
                                    <b-badge 
                                        v-if="folderCounts[key] !== undefined && folderCounts[key] > 0" 
                                        pill 
                                        class="folder-badge"
                                        :variant="activeFolder === key ? 'primary' : 'light'"
                                    >
                                        {{ folderCounts[key] }}
                                    </b-badge>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- COLUMN 2: Thread Feed -->
                    <div class="column-threads d-flex flex-column border-right" :class="{ 'cols-hidden': drawerOpen }">
                        <!-- Search Bar -->
                        <div class="p-3 border-bottom search-wrapper">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    <b-icon icon="search"></b-icon>
                                </b-input-group-prepend>
                                <b-form-input 
                                    v-model="searchQuery" 
                                    placeholder="Search subject or sender..." 
                                    class="search-input"
                                ></b-form-input>
                            </b-input-group>
                        </div>

                        <!-- Thread List -->
                        <div class="threads-list-scroll flex-grow-1 overflow-auto">
                            <b-spinner v-if="loadingThreads" class="d-block mx-auto my-6 text-primary"></b-spinner>
                            <div v-else-if="filteredThreads.length === 0" class="text-center py-12 text-muted">
                                <b-icon icon="inbox" font-scale="2.5" class="mb-3"></b-icon>
                                <p class="mb-0">No conversations in this folder.</p>
                            </div>
                            <div v-else>
                                <div 
                                    v-for="thread in filteredThreads" 
                                    :key="thread.id"
                                    class="thread-card p-3 border-bottom position-relative"
                                    :class="{ 'active': activeThreadKey === thread.thread_key, 'unread': thread.status === 'unread' }"
                                    @click="selectThread(thread.thread_key)"
                                >
                                    <!-- Unread Dot Indicator -->
                                    <div v-if="thread.status === 'unread'" class="unread-dot"></div>

                                    <div class="d-flex justify-content-between align-items-start mb-1">
                                        <h6 class="thread-sender text-truncate mb-0 font-weight-bold pr-2">
                                            {{ thread.sender || 'Unknown Sender' }}
                                        </h6>
                                        <span class="thread-time text-muted small whitespace-nowrap ml-2">
                                            {{ formatTime(thread.latest_message_received_at) }}
                                        </span>
                                    </div>
                                    <div class="thread-subject text-truncate mb-1 font-weight-bold">
                                        {{ thread.subject || '(No Subject)' }}
                                    </div>
                                    <p class="thread-snippet text-muted small mb-2 text-truncate-2">
                                        {{ thread.snippet }}
                                    </p>

                                    <!-- Bottom Info/Badges -->
                                    <div class="d-flex align-items-center justify-content-between mt-2 flex-wrap" style="gap: 6px;">
                                        <!-- Job Association Badge -->
                                        <b-badge v-if="thread.job" variant="primary" class="job-badge px-2 py-1">
                                            Job: {{ thread.job.enquiry_no }}
                                        </b-badge>
                                        <b-badge v-else variant="light" class="job-badge-unassigned px-2 py-1">
                                            Unassigned Inquiry
                                        </b-badge>

                                        <!-- SLA Countdown Timer -->
                                        <span 
                                            v-if="thread.sla_status && thread.sla_status !== 'inactive'" 
                                            class="sla-timer badge" 
                                            :class="getSlaBadgeClass(thread.sla_status)"
                                        >
                                            <b-icon icon="clock-fill" class="mr-1"></b-icon>
                                            {{ getSlaText(thread) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- COLUMN 3: Conversation Feed -->
                    <div class="column-conversation d-flex flex-column" :class="drawerOpen ? 'col-conv-narrow' : 'flex-grow-1'">
                        <!-- Loading State -->
                        <div v-if="loadingDetails" class="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                            <b-spinner class="mb-3 text-primary"></b-spinner>
                            <p>Loading conversation details...</p>
                        </div>

                        <!-- Empty Placeholder -->
                        <div v-else-if="!activeThreadKey" class="d-flex flex-column align-items-center justify-content-center h-100 text-muted p-6 text-center">
                            <div class="conversation-placeholder-icon mb-4">
                                <b-icon icon="envelope-fill" font-scale="3.5" class="text-primary opacity-3"></b-icon>
                            </div>
                            <h4 class="font-weight-bold text-dark mb-2">No Thread Selected</h4>
                            <p style="max-width: 350px;">Select a thread from the feed on the left to read messages, manage operator assignments, and triage inquiries.</p>
                        </div>

                        <!-- Active Conversation Content -->
                        <div v-else class="d-flex flex-column h-100 overflow-hidden">
                            <!-- Timeline Header -->
                            <div class="conversation-header p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
                                <div>
                                    <h5 class="mb-1 font-weight-bold text-dark">{{ activeThread.subject || '(No Subject)' }}</h5>
                                    <div class="d-flex align-items-center text-muted small flex-wrap" style="gap: 8px;">
                                        <b-badge v-if="activeThread.job" variant="primary" class="px-2 py-1">
                                            Job ID: {{ activeThread.job.enquiry_no }} ({{ activeThread.job.status }})
                                        </b-badge>
                                        <b-badge v-else variant="warning" class="px-2 py-1">
                                            Unassigned Inquiry
                                        </b-badge>
                                        <b-badge v-if="activeThread.job && (activeThread.job.status === 'PDF Generated' || activeThread.job.status === 'Generation')" variant="info" class="px-2 py-1">
                                            PDF Generation
                                        </b-badge>
                                    </div>
                                </div>

                                <!-- Conversation Header Actions -->
                                <div class="d-flex align-items-center" style="gap: 8px;">
                                    <!-- Triage Dropdown -->
                                    <b-dropdown 
                                        v-if="!activeThread.job" 
                                        size="sm" 
                                        variant="outline-primary" 
                                        class="triage-dropdown mr-2" 
                                        no-caret
                                    >
                                        <template #button-content>
                                            <b-icon icon="tags-fill" class="mr-1"></b-icon> Triage
                                        </template>
                                        <b-dropdown-item @click="triageThread('job')">
                                            <b-icon icon="file-earmark-plus" class="mr-2 text-primary"></b-icon> Job / Enquiry
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="openLinkJobModal">
                                            <b-icon icon="link-45deg" class="mr-2 text-success"></b-icon> Link to Existing Job
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="triageThread('airline')">
                                            <b-icon icon="mailbox" class="mr-2 text-warning"></b-icon> Airline Mail
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="triageThread('escalation')">
                                            <b-icon icon="exclamation-octagon" class="mr-2 text-danger"></b-icon> Escalation Mail
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="triageThread('clearance')">
                                            <b-icon icon="check2-square" class="mr-2 text-info"></b-icon> Clearance Mail
                                        </b-dropdown-item>
                                    </b-dropdown>

                                    <!-- Operational Action Buttons for Pricing Staff -->
                                    <div v-if="activeThread.job && activeThread.job.status !== 'Completed' && activeThread.job.status !== 'Lost' && currentUser && currentUser.designation === 'pricing'" class="d-flex mr-2" style="gap: 8px;">
                                        <b-button id="btn-confirm-shipment" variant="success" size="sm">
                                            <b-icon icon="check-circle" class="mr-1"></b-icon> Confirm Shipment
                                        </b-button>
                                        <b-button id="btn-mark-lost" variant="danger" size="sm">
                                            <b-icon icon="x-circle" class="mr-1"></b-icon> Mark as Lost
                                        </b-button>
                                    </div>

                                    <label class="mb-0 text-muted small font-weight-bold text-uppercase d-none d-sm-block">Owner:</label>
                                    <b-form-select 
                                        v-model="activeThread.assigned_operator_id"
                                        :options="operatorOptions"
                                        class="assignee-select"
                                        @change="assignOperator"
                                        :disabled="assigningOperator"
                                    >
                                        <template #first>
                                            <option :value="null">Unassigned</option>
                                        </template>
                                    </b-form-select>
                                    <b-spinner v-if="assigningOperator" small class="text-primary"></b-spinner>

                                    <!-- Split-Pane Toggle Button -->
                                    <b-button
                                        id="drawer-toggle-btn"
                                        :variant="drawerOpen ? 'primary' : 'outline-secondary'"
                                        size="sm"
                                        class="split-pane-btn ml-1"
                                        @click="toggleDrawer"
                                        v-b-tooltip.hover :title="drawerOpen ? 'Close Workspace' : 'Open Split Workspace'"
                                    >
                                        <b-icon :icon="drawerOpen ? 'layout-split' : 'layout-split'" font-scale="1"></b-icon>
                                    </b-button>
                                </div>
                            </div>

                            <!-- Timeline Messages Area -->
                            <div class="messages-scroll flex-grow-1 p-4 overflow-auto bg-timeline">
                                <div 
                                    v-for="(email, index) in emails" 
                                    :key="email.id" 
                                    class="message-card mb-4 rounded-lg shadow-sm border overflow-hidden"
                                    :class="{ 'expanded': expandedMessageIndex === index }"
                                >
                                    <!-- Header / Subject summary bar -->
                                    <div 
                                        class="message-header p-3 d-flex align-items-center justify-content-between bg-white cursor-pointer"
                                        @click="toggleMessageExpand(index)"
                                    >
                                        <div class="d-flex align-items-center text-truncate pr-2">
                                            <div class="sender-avatar mr-3">
                                                {{ email.from.charAt(0).toUpperCase() }}
                                            </div>
                                            <div class="text-truncate">
                                                <div class="d-flex align-items-center flex-wrap" style="gap: 4px;">
                                                    <span class="font-weight-bold text-dark text-truncate">{{ email.from }}</span>
                                                    <span class="text-muted small">to {{ email.to }}</span>
                                                </div>
                                                <span v-if="expandedMessageIndex !== index" class="text-muted text-truncate d-block small">
                                                    {{ email.body_text || email.body_html | snippetText }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center ml-2 flex-shrink-0" style="gap: 8px;">
                                            <span class="text-muted small">{{ formatTime(email.received_at) }}</span>
                                            <b-icon :icon="expandedMessageIndex === index ? 'chevron-up' : 'chevron-down'" class="text-muted"></b-icon>
                                        </div>
                                    </div>

                                    <!-- Expanded Body Content -->
                                    <transition name="expand">
                                        <div v-show="expandedMessageIndex === index" class="message-body p-4 bg-white border-top">
                                            <!-- Render HTML safely if available, else render text -->
                                            <div v-if="email.body_html" v-html="email.body_html" class="email-body-content"></div>
                                            <div v-else class="email-body-content whitespace-pre-line">{{ email.body_text }}</div>

                                            <!-- Attachments Grid -->
                                            <div v-if="email.attachments && email.attachments.length > 0" class="attachments-section mt-4 pt-3 border-top">
                                                <h6 class="font-weight-bold text-muted small mb-2">Attachments ({{ email.attachments.length }})</h6>
                                                <div class="d-flex flex-wrap" style="gap: 10px;">
                                                    <div v-for="att in email.attachments" :key="att.id" class="attachment-chip d-flex align-items-center p-2 rounded-lg border bg-light">
                                                        <b-icon icon="file-earmark-pdf-fill" class="mr-2 text-danger font-scale-1.2"></b-icon>
                                                        <span class="attachment-name text-truncate mr-2">{{ att.filename }}</span>
                                                        <b-button size="sm" variant="light" class="p-1 line-height-0 rounded" v-b-tooltip.hover title="Open File">
                                                            <b-icon icon="eye" font-scale="0.9"></b-icon>
                                                        </b-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </div>

                            <!-- Timeline Reply Composer -->
                            <div class="conversation-reply-box p-3 border-top bg-light">
                                <b-form-textarea
                                    v-model="replyText"
                                    placeholder="Write a response to the customer..."
                                    rows="3"
                                    max-rows="6"
                                    class="reply-textarea mb-2"
                                ></b-form-textarea>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted" v-if="activeThread && activeThread.mailboxConnection">
                                        <b-icon icon="envelope-check-fill" class="mr-1 text-success"></b-icon>
                                        Sending from <strong>{{ activeThread.mailbox_email || 'connected mailbox' }}</strong>
                                    </small>
                                    <small class="text-muted" v-else></small>
                                    <b-button 
                                        class="send-reply-btn px-5" 
                                        variant="primary" 
                                        @click="sendQuickReply"
                                        :disabled="!replyText.trim() || sendingReply"
                                    >
                                        <b-spinner small class="mr-1" v-if="sendingReply"></b-spinner>
                                        <b-icon icon="reply-fill" class="mr-1" v-else></b-icon>
                                        {{ sendingReply ? 'Sending…' : 'Send Reply' }}
                                    </b-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- DRAWER PANEL: Split-Pane Workspace -->
                    <transition name="drawer-slide">
                        <div v-if="drawerOpen" class="drawer-panel d-flex flex-column">
                            <!-- Drawer Header -->
                            <div class="drawer-header d-flex align-items-center justify-content-between px-4 py-3">
                                <div class="d-flex align-items-center" style="gap: 12px;">
                                    <b-icon icon="grid-1x2-fill" class="text-primary" font-scale="1.1"></b-icon>
                                    <span class="font-weight-bold" style="color: #1e293b; font-size: 0.95rem; font-family: 'Inter', sans-serif;">Workspace</span>
                                </div>
                                <!-- Drawer Tabs -->
                                <div class="drawer-tabs d-flex" style="gap: 4px;">
                                    <b-button 
                                        v-for="tab in filteredDrawerTabs"
                                        :key="tab.key"
                                        class="drawer-tab-btn"
                                        :class="{ 'active': drawerTab === tab.key }"
                                        @click="drawerTab = tab.key"
                                    >
                                        <b-icon :icon="tab.icon" class="mr-2"></b-icon>
                                        {{ tab.label }}
                                    </b-button>
                                </div>
                                <!-- Close -->
                                <b-button variant="light" size="sm" class="drawer-close-btn" @click="drawerOpen = false">
                                    <b-icon icon="x" font-scale="1.2"></b-icon>
                                </b-button>
                            </div>

                            <!-- Drawer Body -->
                            <div class="drawer-body flex-grow-1 overflow-auto">

                                <!-- TAB: Upload / OCR -->
                                <div v-if="drawerTab === 'upload'" class="drawer-tab-content">
                                    <div class="ocr-header mb-4">
                                        <h6 class="font-weight-bold mb-1" style="color: #1e293b;">Upload & OCR Extract</h6>
                                        <p class="text-muted small mb-0">Drop a PDF or image — AI will extract shipper, consignee, weight and dimensions automatically.</p>
                                    </div>
                                    <div 
                                        class="ocr-dropzone"
                                        :class="{ 'drag-over': ocrDragOver }"
                                        @dragover.prevent="ocrDragOver = true"
                                        @dragleave.prevent="ocrDragOver = false"
                                        @drop.prevent="handleOcrDrop"
                                        @click="$refs.ocrFileInput.click()"
                                    >
                                        <input ref="ocrFileInput" type="file" accept=".pdf,image/*" class="d-none" @change="handleOcrFileSelect">
                                        <div v-if="!ocrFile && !ocrProcessing && !ocrResult" class="text-center">
                                            <div class="ocr-drop-icon mb-3">
                                                <b-icon icon="cloud-upload-fill" font-scale="3" class="text-primary"></b-icon>
                                            </div>
                                            <p class="font-weight-bold mb-1" style="color: #334155;">Drag & drop a file here</p>
                                            <p class="text-muted small">or click to browse — PDF, PNG, JPG accepted</p>
                                        </div>
                                        <div v-else-if="ocrProcessing" class="text-center py-4">
                                            <b-spinner class="mb-3 text-primary"></b-spinner>
                                            <p class="font-weight-bold text-primary mb-0">Processing with OCR...</p>
                                            <p class="text-muted small">This usually takes 5–10 seconds</p>
                                        </div>
                                        <div v-else-if="ocrFile && !ocrResult && !ocrProcessing" class="text-center py-3">
                                            <b-icon icon="file-earmark-pdf-fill" font-scale="2.5" class="text-danger mb-2"></b-icon>
                                            <p class="font-weight-bold mb-1" style="color: #334155;">{{ ocrFile.name }}</p>
                                            <p class="text-muted small mb-0">Ready to extract</p>
                                        </div>
                                    </div>
                                    
                                    <!-- OCR Action Buttons -->
                                    <div v-if="ocrFile && !ocrResult" class="d-flex justify-content-between mt-3">
                                        <b-button variant="outline-secondary" size="sm" @click="clearOcr">Clear</b-button>
                                        <b-button variant="primary" size="sm" class="ocr-extract-btn" @click="runOcrExtract" :disabled="ocrProcessing">
                                            <b-icon icon="cpu-fill" class="mr-1"></b-icon>
                                            Extract with AI
                                        </b-button>
                                    </div>

                                    <!-- OCR Result Card -->
                                    <div v-if="ocrResult" class="ocr-result-card mt-4">
                                        <div class="d-flex align-items-center justify-content-between mb-3">
                                            <h6 class="font-weight-bold mb-0" style="color: #1e293b;">Extracted Data</h6>
                                            <b-button variant="outline-secondary" size="sm" @click="clearOcr">Clear</b-button>
                                        </div>
                                        <div class="ocr-fields">
                                            <div v-for="(value, key) in ocrResult" :key="key" class="ocr-field-row">
                                                <span class="ocr-field-label">{{ formatOcrKey(key) }}</span>
                                                <span class="ocr-field-value">{{ value || '—' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- TAB: Focus Air -->
                                <div v-if="drawerTab === 'focusair'" class="drawer-tab-content">
                                    <div class="workspace-link-card" @click="navigateTo('/focus-air')">
                                        <div class="workspace-link-icon" style="background: linear-gradient(135deg, #355594 0%, #1e3a8a 100%)">
                                            <b-icon icon="file-earmark-text" font-scale="2" class="text-white"></b-icon>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="font-weight-bold mb-1" style="color: #1e293b;">Focus Air Waybill</h6>
                                            <p class="text-muted small mb-0">Create or edit Master Air Waybills for this job. All fields pre-linked to the active thread.</p>
                                        </div>
                                        <b-icon icon="arrow-right-circle-fill" class="text-primary" font-scale="1.3"></b-icon>
                                    </div>
                                    <div v-if="activeThread && activeThread.job" class="mt-4 p-3 rounded-lg" style="background: #f0f9ff; border: 1px solid #bae6fd;">
                                        <p class="small font-weight-bold mb-1" style="color: #0369a1;">Linked Job</p>
                                        <p class="mb-0 font-weight-bold" style="color: #1e293b;">{{ activeThread.job.enquiry_no }} — {{ activeThread.job.status }}</p>
                                    </div>
                                    <div v-else class="mt-4 p-3 rounded-lg" style="background: #fffbeb; border: 1px solid #fde68a;">
                                        <p class="small mb-0" style="color: #92400e;"><b-icon icon="exclamation-triangle-fill" class="mr-1"></b-icon>No job linked to this thread yet. Classify the email first to auto-create a job card.</p>
                                    </div>
                                </div>

                                <!-- TAB: Focus Air Import -->
                                <div v-if="drawerTab === 'focusair_import'" class="drawer-tab-content">
                                    <div class="workspace-link-card" @click="navigateTo('/focus-air-import')">
                                        <div class="workspace-link-icon" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)">
                                            <b-icon icon="file-earmark-arrow-down" font-scale="2" class="text-white"></b-icon>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="font-weight-bold mb-1" style="color: #1e293b;">Focus Air Import</h6>
                                            <p class="text-muted small mb-0">Manage air cargo imports, arrivals notices, and delivery orders.</p>
                                        </div>
                                        <b-icon icon="arrow-right-circle-fill" class="text-indigo" font-scale="1.3"></b-icon>
                                    </div>
                                </div>

                                <!-- TAB: House Waybill -->
                                <div v-if="drawerTab === 'hwb'" class="drawer-tab-content">
                                    <div class="workspace-link-card" @click="navigateTo('/house-way-bill')">
                                        <div class="workspace-link-icon" style="background: linear-gradient(135deg, #059669 0%, #065f46 100%)">
                                            <b-icon icon="file-earmark" font-scale="2" class="text-white"></b-icon>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="font-weight-bold mb-1" style="color: #1e293b;">House Waybill</h6>
                                            <p class="text-muted small mb-0">Generate House Waybills for consolidation shipments. Opens the full editor.</p>
                                        </div>
                                        <b-icon icon="arrow-right-circle-fill" class="text-success" font-scale="1.3"></b-icon>
                                    </div>
                                </div>

                                <!-- TAB: Focus Sea Master -->
                                <div v-if="drawerTab === 'sea_master'" class="drawer-tab-content">
                                    <div class="workspace-link-card" @click="navigateTo('/focus-sea-master')">
                                        <div class="workspace-link-icon" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%)">
                                            <b-icon icon="file-earmark-text" font-scale="2" class="text-white"></b-icon>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="font-weight-bold mb-1" style="color: #1e293b;">Focus Sea Master</h6>
                                            <p class="text-muted small mb-0">Create or edit Master Ocean Bills of Lading. Pre-linked to the active thread.</p>
                                        </div>
                                        <b-icon icon="arrow-right-circle-fill" class="text-info" font-scale="1.3"></b-icon>
                                    </div>
                                    <div v-if="activeThread && activeThread.job" class="mt-4 p-3 rounded-lg" style="background: #f0f9ff; border: 1px solid #bae6fd;">
                                        <p class="small font-weight-bold mb-1" style="color: #0369a1;">Linked Job</p>
                                        <p class="mb-0 font-weight-bold" style="color: #1e293b;">{{ activeThread.job.enquiry_no }} — {{ activeThread.job.status }}</p>
                                    </div>
                                    <div v-else class="mt-4 p-3 rounded-lg" style="background: #fffbeb; border: 1px solid #fde68a;">
                                        <p class="small mb-0" style="color: #92400e;"><b-icon icon="exclamation-triangle-fill" class="mr-1"></b-icon>No job linked to this thread yet. Classify the email first to auto-create a job card.</p>
                                    </div>
                                </div>

                                <!-- TAB: Focus Sea House -->
                                <div v-if="drawerTab === 'sea_house'" class="drawer-tab-content">
                                    <div class="workspace-link-card" @click="navigateTo('/focus-sea-house')">
                                        <div class="workspace-link-icon" style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%)">
                                            <b-icon icon="file-earmark" font-scale="2" class="text-white"></b-icon>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="font-weight-bold mb-1" style="color: #1e293b;">Focus Sea House</h6>
                                            <p class="text-muted small mb-0">Generate House Bills of Lading for ocean consolidation shipments.</p>
                                        </div>
                                        <b-icon icon="arrow-right-circle-fill" class="text-teal" font-scale="1.3"></b-icon>
                                    </div>
                                </div>

                                <!-- TAB: Sea Consolidation -->
                                <div v-if="drawerTab === 'sea_consol'" class="drawer-tab-content">
                                    <div class="workspace-link-card" @click="navigateTo('/focus-sea-consol')">
                                        <div class="workspace-link-icon" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%)">
                                            <b-icon icon="folder2-open" font-scale="2" class="text-white"></b-icon>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="font-weight-bold mb-1" style="color: #1e293b;">Sea Consolidation</h6>
                                            <p class="text-muted small mb-0">Group multiple ocean HBLs under a parent MBL container.</p>
                                        </div>
                                        <b-icon icon="arrow-right-circle-fill" class="text-warning" font-scale="1.3"></b-icon>
                                    </div>
                                </div>

                                <!-- TAB: Job Cost -->
                                <div v-if="drawerTab === 'cost'" class="drawer-tab-content">
                                    <div v-if="!activeThread || !activeThread.job" class="text-center py-5">
                                        <b-icon icon="exclamation-circle-fill" font-scale="3" class="text-warning mb-3"></b-icon>
                                        <h5>No operational job linked to this thread.</h5>
                                        <p class="text-muted small">Triage the thread as a job first to manage ledger accounts.</p>
                                    </div>
                                    <div v-else-if="loadingCostSheet" class="text-center py-5">
                                        <b-spinner class="text-primary mb-3"></b-spinner>
                                        <p>Loading Job Cost Ledger...</p>
                                    </div>
                                    <div v-else>
                                        <!-- Header summary -->
                                        <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                            <div>
                                                <h6 class="font-weight-bold mb-1 text-dark">Job Cost Ledger</h6>
                                                <span class="badge badge-light-primary text-uppercase font-weight-bold" style="font-size: 0.8rem;">
                                                    {{ activeThread.job.enquiry_no }}
                                                </span>
                                            </div>
                                            <!-- Profit Margin Summary -->
                                            <div class="text-right">
                                                <span class="text-muted small d-block">Est. Profit Margin:</span>
                                                <span 
                                                    class="font-weight-bold" 
                                                    :class="profitMargin >= 0 ? 'text-success' : 'text-danger'"
                                                    style="font-size: 1.1rem;"
                                                >
                                                    ${{ profitMargin.toFixed(2) }} ({{ profitMarginPercent.toFixed(1) }}%)
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Revenue (Sell Side) -->
                                        <div class="card mb-4 border shadow-sm">
                                            <div class="card-header bg-light d-flex justify-content-between align-items-center py-2 px-3">
                                                <strong class="text-primary small text-uppercase">Revenue / Sell Charges</strong>
                                                <b-button size="sm" variant="outline-primary" class="py-0 px-2" style="font-size: 0.75rem;" @click="addInvoiceItem">
                                                    + Add Charge
                                                </b-button>
                                            </div>
                                            <div class="card-body p-2">
                                                <div v-for="(item, idx) in costSheetInvoiceItems" :key="'inv-' + idx" class="mb-3 p-2 bg-light rounded position-relative">
                                                    <b-button variant="link" class="text-danger position-absolute p-0" style="right: 8px; top: 4px;" @click="removeInvoiceItem(idx)">
                                                        <b-icon icon="trash-fill" font-scale="0.85"></b-icon>
                                                    </b-button>
                                                    <b-form-row>
                                                        <b-col cols="6" class="pr-1">
                                                            <label class="small text-muted mb-1">Charge Type</label>
                                                            <b-form-input v-model="item.charge_type" size="sm" required></b-form-input>
                                                        </b-col>
                                                        <b-col cols="6" class="pl-1">
                                                            <label class="small text-muted mb-1">Description</label>
                                                            <b-form-input v-model="item.description" size="sm"></b-form-input>
                                                        </b-col>
                                                    </b-form-row>
                                                    <b-form-row class="mt-2">
                                                        <b-col cols="4" class="pr-1">
                                                            <label class="small text-muted mb-1">Qty</label>
                                                            <b-form-input type="number" v-model.number="item.qty" size="sm" step="0.01" @input="calculateItemTotal(item)"></b-form-input>
                                                        </b-col>
                                                        <b-col cols="4" class="px-1">
                                                            <label class="small text-muted mb-1">Sell Rate ($)</label>
                                                            <b-form-input type="number" v-model.number="item.unit_rate" size="sm" step="0.01" @input="calculateItemTotal(item)"></b-form-input>
                                                        </b-col>
                                                        <b-col cols="4" class="pl-1">
                                                            <label class="small text-muted mb-1">Tax (%)</label>
                                                            <b-form-input type="number" v-model.number="item.tax_rate" size="sm" step="0.5" @input="calculateItemTotal(item)"></b-form-input>
                                                        </b-col>
                                                    </b-form-row>
                                                    <div class="text-right mt-2 text-dark font-weight-bold small">
                                                        Total: ${{ (item.total_amount || 0).toFixed(2) }}
                                                    </div>
                                                </div>
                                                <div class="text-right pr-2 pt-2 border-top small font-weight-bold">
                                                    Revenue Total: ${{ costSheetInvoiceTotal.toFixed(2) }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Expenses (Buy Side) -->
                                        <div class="card mb-4 border shadow-sm">
                                            <div class="card-header bg-light d-flex justify-content-between align-items-center py-2 px-3">
                                                <strong class="text-warning-dark small text-uppercase">Expenses / Buy Vouchers</strong>
                                                <b-button size="sm" variant="outline-warning" class="py-0 px-2" style="font-size: 0.75rem;" @click="addPurchaseItem">
                                                    + Add Cost
                                                </b-button>
                                            </div>
                                            <div class="card-body p-2">
                                                <div v-for="(item, idx) in costSheetPurchaseItems" :key="'pv-' + idx" class="mb-3 p-2 bg-light rounded position-relative">
                                                    <b-button variant="link" class="text-danger position-absolute p-0" style="right: 8px; top: 4px;" @click="removePurchaseItem(idx)">
                                                        <b-icon icon="trash-fill" font-scale="0.85"></b-icon>
                                                    </b-button>
                                                    <b-form-row>
                                                        <b-col cols="6" class="pr-1">
                                                            <label class="small text-muted mb-1">Cost Type</label>
                                                            <b-form-input v-model="item.charge_type" size="sm" required></b-form-input>
                                                        </b-col>
                                                        <b-col cols="6" class="pl-1">
                                                            <label class="small text-muted mb-1">Description</label>
                                                            <b-form-input v-model="item.description" size="sm"></b-form-input>
                                                        </b-col>
                                                    </b-form-row>
                                                    <b-form-row class="mt-2">
                                                        <b-col cols="4" class="pr-1">
                                                            <label class="small text-muted mb-1">Qty</label>
                                                            <b-form-input type="number" v-model.number="item.qty" size="sm" step="0.01" @input="calculateItemTotal(item)"></b-form-input>
                                                        </b-col>
                                                        <b-col cols="4" class="px-1">
                                                            <label class="small text-muted mb-1">Buy Rate ($)</label>
                                                            <b-form-input type="number" v-model.number="item.unit_rate" size="sm" step="0.01" @input="calculateItemTotal(item)"></b-form-input>
                                                        </b-col>
                                                        <b-col cols="4" class="pl-1">
                                                            <label class="small text-muted mb-1">Tax (%)</label>
                                                            <b-form-input type="number" v-model.number="item.tax_rate" size="sm" step="0.5" @input="calculateItemTotal(item)"></b-form-input>
                                                        </b-col>
                                                    </b-form-row>
                                                    <div class="text-right mt-2 text-dark font-weight-bold small">
                                                        Total: ${{ (item.total_amount || 0).toFixed(2) }}
                                                    </div>
                                                </div>
                                                <div class="text-right pr-2 pt-2 border-top small font-weight-bold">
                                                    Expense Total: ${{ costSheetPurchaseTotal.toFixed(2) }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Save Buttons -->
                                        <div class="d-flex justify-content-end" style="gap: 8px;">
                                            <b-button size="sm" variant="light" @click="fetchJobCostSheet">Reset</b-button>
                                            <b-button size="sm" variant="primary" @click="saveJobCostSheet" :disabled="savingCostSheet">
                                                <b-spinner small v-if="savingCostSheet" class="mr-1"></b-spinner>
                                                Save Ledger Draft
                                            </b-button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </transition>

                    <!-- Link Job Modal -->
                    <b-modal id="link-job-modal" title="Link to Existing Job" @ok="handleLinkJob" ok-title="Link Job" ok-variant="primary" cancel-variant="light">
                        <b-form-group label="Select Active Job" label-for="existing-job-select">
                            <b-form-select 
                                id="existing-job-select" 
                                v-model="selectedExistingJobId" 
                                :options="activeJobsOptions"
                                required
                            >
                                <template #first>
                                    <option :value="null" disabled>-- Select an Active Job --</option>
                                </template>
                            </b-form-select>
                        </b-form-group>
                    </b-modal>

                    <!-- Popover for Confirm Shipment -->
                    <b-popover 
                        target="btn-confirm-shipment" 
                        triggers="click" 
                        placement="bottomleft"
                        ref="confirmPopover"
                    >
                        <template #title>Confirm Shipment</template>
                        <div class="p-2" style="width: 280px;">
                            <b-form-group label="AWB / MBL Number" label-size="sm">
                                <b-form-input 
                                    v-model="confirmAwb" 
                                    size="sm" 
                                    placeholder="e.g. 020-12345678"
                                    required
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group label="Assign Operator" label-size="sm">
                                <b-form-select 
                                    v-model="confirmOperatorId" 
                                    :options="operatorOptions"
                                    size="sm"
                                    required
                                >
                                    <template #first>
                                        <option :value="null" disabled>-- Select Operator --</option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                            <b-form-group label="Planned Clearance Date" label-size="sm">
                                <b-form-input 
                                    type="date" 
                                    v-model="confirmClearanceDate" 
                                    size="sm"
                                    required
                                ></b-form-input>
                            </b-form-group>
                            <div class="d-flex justify-content-end mt-2" style="gap: 8px;">
                                <b-button size="sm" variant="light" @click="closeConfirmPopover">Cancel</b-button>
                                <b-button size="sm" variant="success" @click="submitConfirmShipment" :disabled="confirmingShipment || !confirmAwb || !confirmOperatorId || !confirmClearanceDate">
                                    <b-spinner small v-if="confirmingShipment" class="mr-1"></b-spinner>
                                    Confirm
                                </b-button>
                            </div>
                        </div>
                    </b-popover>

                    <!-- Popover for Mark as Lost -->
                    <b-popover 
                        target="btn-mark-lost" 
                        triggers="click" 
                        placement="bottomleft"
                        ref="lostPopover"
                    >
                        <template #title>Mark as Lost</template>
                        <div class="p-2" style="width: 280px;">
                            <b-form-group label="Lost Reason" label-size="sm">
                                <b-form-select 
                                    v-model="lostReason" 
                                    size="sm"
                                    required
                                >
                                    <option value="rates_high">Rates High</option>
                                    <option value="delay_in_response">Delay in Response</option>
                                    <option value="client_cancelled">Client Cancelled</option>
                                    <option value="capacity_issue">Capacity Issue</option>
                                    <option value="other">Other</option>
                                </b-form-select>
                            </b-form-group>
                            <b-form-group 
                                v-if="lostReason === 'other'" 
                                label="Custom Reason" 
                                label-size="sm"
                            >
                                <b-form-textarea 
                                    v-model="lostReasonCustom" 
                                    size="sm" 
                                    rows="2"
                                    placeholder="Details..."
                                ></b-form-textarea>
                            </b-form-group>
                            <div class="d-flex justify-content-end mt-2" style="gap: 8px;">
                                <b-button size="sm" variant="light" @click="closeLostPopover">Cancel</b-button>
                                <b-button size="sm" variant="danger" @click="submitMarkLost" :disabled="savingLoss">
                                    <b-spinner small v-if="savingLoss" class="mr-1"></b-spinner>
                                    Save Loss
                                </b-button>
                            </div>
                        </div>
                    </b-popover>

                </div>
            </div>
        </div>
    </b-container>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import ApiService from "@/core/services/api.service";

export default {
    name: "JobInbox",
    components: {
        SideBar
    },
    data() {
        return {
            activeFolder: "inbox",
            activeThreadKey: null,
            searchQuery: "",
            replyText: "",
            foldersList: {
                inbox: { label: "Inbox", icon: "mailbox" },
                assigned: { label: "Assigned", icon: "person-check-fill" },
                unassigned: { label: "Unassigned", icon: "person-x-fill" },
                processing: { label: "Processing", icon: "play-fill" },
                awaiting_client: { label: "Awaiting Client", icon: "reply-fill" },
                completed: { label: "Completed", icon: "check-circle-fill" }
            },
            folderCounts: {},
            threads: [],
            activeThread: {},
            emails: [],
            operators: [],
            expandedMessageIndex: 0,
            loadingThreads: false,
            loadingDetails: false,
            assigningOperator: false,
            sendingReply: false,
            refreshInterval: null,
            // Phase 2.6 — Drawer
            drawerOpen: false,
            drawerTab: 'upload',
            // OCR state
            ocrFile: null,
            ocrDragOver: false,
            ocrProcessing: false,
            ocrResult: null,
            // Phase 3 operational properties
            selectedExistingJobId: null,
            activeJobs: [],
            confirmAwb: "",
            confirmOperatorId: null,
            confirmClearanceDate: "",
            lostReason: "rates_high",
            lostReasonCustom: "",
            confirmingShipment: false,
            savingLoss: false,
            triagingThread: false,
            // Job Cost Sheet properties
            loadingCostSheet: false,
            savingCostSheet: false,
            costSheetInvoiceItems: [],
            costSheetPurchaseItems: [],
        };
    },
    filters: {
        snippetText(val) {
            if (!val) return "";
            const plain = val.replace(/<[^>]*>/g, "");
            return plain.length > 80 ? plain.substring(0, 80) + "..." : plain;
        }
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        isViperCore() {
            const tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
            return !tier || tier === 'viper_core';
        },
        filteredDrawerTabs() {
            const portalScope = sessionStorage.getItem('active_portal_scope') || 'air';
            if (portalScope === 'sea') {
                return [
                    { key: 'upload',     label: 'Upload/OCR',     icon: 'cloud-upload'       },
                    { key: 'sea_master', label: 'Focus Sea Master', icon: 'file-earmark-text'  },
                    { key: 'sea_house',  label: 'Focus Sea House',  icon: 'file-earmark'       },
                    { key: 'sea_consol', label: 'Sea Consol',     icon: 'folder2-open'       },
                    { key: 'cost',       label: 'Job Cost',        icon: 'cash-stack'         }
                ];
            } else {
                return [
                    { key: 'upload',          label: 'Upload/OCR',      icon: 'cloud-upload'       },
                    { key: 'focusair',        label: 'Focus Air',       icon: 'file-earmark-text'  },
                    { key: 'focusair_import', label: 'Focus Air Import',icon: 'file-earmark-arrow-down' },
                    { key: 'hwb',             label: 'HWB',             icon: 'file-earmark'        },
                    { key: 'cost',            label: 'Job Cost',        icon: 'cash-stack'          }
                ];
            }
        },
        filteredThreads() {
            let list = this.threads;
            if (this.currentUser && this.currentUser.designation === 'operations') {
                list = list.filter(t => t.assigned_operator_id === this.currentUser.id || (t.assigned_operator && t.assigned_operator.id === this.currentUser.id));
            }
            if (!this.searchQuery) return list;
            const query = this.searchQuery.toLowerCase();
            return list.filter(t => 
                (t.subject && t.subject.toLowerCase().includes(query)) ||
                (t.sender && t.sender.toLowerCase().includes(query))
            );
        },
        operatorOptions() {
            return this.operators.map(op => {
                const count = op.active_jobs !== undefined ? ` (${op.active_jobs} Jobs)` : '';
                const overload = op.active_jobs >= 15 ? ' 🔴 OVERLOADED' : '';
                return {
                    value: op.id,
                    text: `${op.name}${count}${overload}`
                };
            });
        },
        activeJobsOptions() {
            return this.activeJobs.filter(j => j.status !== 'Completed').map(job => {
                const jobNo = job.execution_job_no ? `${job.execution_job_no} (Enq: ${job.enquiry_no})` : job.enquiry_no;
                return {
                    value: job.id,
                    text: `${jobNo} - ${job.status}`
                };
            });
        },
        costSheetInvoiceTotal() {
            return this.costSheetInvoiceItems.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        },
        costSheetPurchaseTotal() {
            return this.costSheetPurchaseItems.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        },
        profitMargin() {
            return this.costSheetInvoiceTotal - this.costSheetPurchaseTotal;
        },
        profitMarginPercent() {
            if (this.costSheetInvoiceTotal === 0) return 0;
            return (this.profitMargin / this.costSheetInvoiceTotal) * 100;
        }
    },
    watch: {
        drawerTab(newVal) {
            if (newVal === 'cost' && this.activeThread && this.activeThread.job) {
                this.fetchJobCostSheet();
            }
        },
        activeThreadKey() {
            if (this.drawerTab === 'cost' && this.activeThread && this.activeThread.job) {
                this.fetchJobCostSheet();
            }
        }
    },
    mounted() {
        if (!this.isViperCore) {
            this.loadWorkspaceData();
            
            // Check for thread_key query param to auto-select and open drawer
            const threadKey = this.$route.query.thread_key;
            if (threadKey) {
                this.selectThreadAndOpenDrawer(threadKey);
            }

            // Poll for fresh folder counts and threads every 30 seconds
            this.refreshInterval = setInterval(() => {
                this.fetchFolderCounts();
                this.fetchThreads(false);
            }, 30000);
        }
    },
    beforeDestroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    },
    methods: {
        loadWorkspaceData() {
            this.fetchFolderCounts();
            this.fetchThreads(true);
            this.fetchOperators();
        },
        fetchFolderCounts() {
            ApiService.get("/user/inbox/folders")
                .then(response => {
                    this.folderCounts = response.data;
                })
                .catch(error => console.error("Failed to load folder counts:", error));
        },
        fetchThreads(showLoader = true) {
            if (showLoader) this.loadingThreads = true;
            ApiService.query("/user/inbox/threads", { params: { folder: this.activeFolder } })
                .then(response => {
                    this.threads = response.data;
                })
                .catch(error => console.error("Failed to load threads:", error))
                .finally(() => {
                    if (showLoader) this.loadingThreads = false;
                });
        },
        fetchOperators() {
            ApiService.get("/user/inbox/staff-workloads")
                .then(response => {
                    this.operators = response.data;
                })
                .catch(error => console.error("Failed to load operators/workloads:", error));
        },
        selectFolder(key) {
            this.activeFolder = key;
            this.activeThreadKey = null;
            this.emails = [];
            this.activeThread = {};
            this.fetchThreads(true);
        },
        selectThread(threadKey) {
            this.activeThreadKey = threadKey;
            this.loadingDetails = true;
            this.expandedMessageIndex = 0; // default expand latest

            ApiService.get(`/user/inbox/threads/${threadKey}`)
                .then(response => {
                    this.activeThread = response.data.thread;
                    this.emails = response.data.emails;
                    // Auto-expand last email (index of last element)
                    this.expandedMessageIndex = this.emails.length - 1;
                    
                    // Update thread status locally to 'read' if it was 'unread'
                    const idx = this.threads.findIndex(t => t.thread_key === threadKey);
                    if (idx !== -1 && this.threads[idx].status === 'unread') {
                        this.threads[idx].status = 'read';
                        this.fetchFolderCounts();
                    }
                })
                .catch(error => console.error("Failed to load thread details:", error))
                .finally(() => {
                    this.loadingDetails = false;
                });
        },
        selectThreadAndOpenDrawer(threadKey) {
            this.activeThreadKey = threadKey;
            this.loadingDetails = true;
            this.expandedMessageIndex = 0;

            ApiService.get(`/user/inbox/threads/${threadKey}`)
                .then(response => {
                    this.activeThread = response.data.thread;
                    this.emails = response.data.emails;
                    this.expandedMessageIndex = this.emails.length - 1;
                    
                    // Automatically slide open the split drawer
                    this.drawerOpen = true;
                    // Pre-load correct tab based on job status
                    if (this.activeThread.job) {
                        const status = this.activeThread.job.status;
                        if (status === 'Verification' || status === 'Generation' || status === 'PDF Generated') {
                            this.drawerTab = 'focusair';
                        } else if (status === 'AI Extraction') {
                            this.drawerTab = 'upload';
                        }
                    }

                    const idx = this.threads.findIndex(t => t.thread_key === threadKey);
                    if (idx !== -1 && this.threads[idx].status === 'unread') {
                        this.threads[idx].status = 'read';
                        this.fetchFolderCounts();
                    }
                })
                .catch(error => console.error("Failed to auto-load thread details:", error))
                .finally(() => {
                    this.loadingDetails = false;
                });
        },
        toggleMessageExpand(index) {
            this.expandedMessageIndex = this.expandedMessageIndex === index ? -1 : index;
        },
        assignOperator(operatorId) {
            this.assigningOperator = true;
            ApiService.post(`/user/inbox/threads/${this.activeThreadKey}/assign`, {
                assigned_operator_id: operatorId
            })
                .then(response => {
                    this.$bvToast.toast("Operator successfully assigned.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    
                    // Update operator local display
                    const op = this.operators.find(o => o.id === operatorId);
                    this.activeThread.assigned_operator = op ? { id: op.id, name: op.name } : null;

                    // Reload active feeds
                    this.fetchFolderCounts();
                    this.fetchThreads(false);
                })
                .catch(error => {
                    this.$bvToast.toast("Failed to assign operator.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.assigningOperator = false;
                });
        },
        sendQuickReply() {
            if (!this.replyText.trim() || this.sendingReply) return;

            const body = this.replyText.trim();
            this.sendingReply = true;

            this.$http.post(`/api/user/inbox/threads/${this.activeThreadKey}/reply`, { body })
                .then(response => {
                    const outbound = response.data.email;

                    // Append the real outbound email to the conversation timeline
                    this.emails.push(outbound);
                    this.expandedMessageIndex = this.emails.length - 1;
                    this.replyText = "";

                    // Update thread status locally to 'replied'
                    const idx = this.threads.findIndex(t => t.thread_key === this.activeThreadKey);
                    if (idx !== -1) {
                        this.threads[idx].status = 'replied';
                    }
                    if (this.activeThread) {
                        this.activeThread.status = 'replied';
                    }

                    this.$bvToast.toast("Reply sent successfully via your connected mailbox.", {
                        title: "Reply Sent",
                        variant: "success",
                        solid: true,
                        autoHideDelay: 4000
                    });
                })
                .catch(err => {
                    const msg = err.response?.data?.error || "Failed to send reply. Please try again.";
                    this.$bvToast.toast(msg, {
                        title: "Send Failed",
                        variant: "danger",
                        solid: true,
                        autoHideDelay: 6000
                    });
                })
                .finally(() => {
                    this.sendingReply = false;
                });
        },

        // ----- Phase 2.6 — Drawer methods -----
        toggleDrawer() {
            if (!this.activeThreadKey) {
                this.$bvToast.toast('Select a thread first to open the workspace.', {
                    title: 'No Thread Selected', variant: 'warning', solid: true, autoHideDelay: 3000
                });
                return;
            }
            this.drawerOpen = !this.drawerOpen;
        },
        navigateTo(path) {
            this.$router.push(path);
        },
        handleOcrDrop(e) {
            this.ocrDragOver = false;
            const file = e.dataTransfer.files[0];
            if (file) this.ocrFile = file;
        },
        handleOcrFileSelect(e) {
            const file = e.target.files[0];
            if (file) this.ocrFile = file;
        },
        clearOcr() {
            this.ocrFile = null;
            this.ocrResult = null;
            this.ocrProcessing = false;
            if (this.$refs.ocrFileInput) this.$refs.ocrFileInput.value = '';
        },
        runOcrExtract() {
            if (!this.ocrFile) return;
            this.ocrProcessing = true;
            this.ocrResult = null;
            const formData = new FormData();
            formData.append('file', this.ocrFile);
            this.$http.post('/api/user/ocr/extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(res => {
                this.ocrResult = res.data.extracted || res.data;
            })
            .catch(() => {
                this.$bvToast.toast('OCR extraction failed. Please try again.', {
                    title: 'OCR Error', variant: 'danger', solid: true
                });
            })
            .finally(() => { this.ocrProcessing = false; });
        },
        formatOcrKey(key) {
            return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        },
        // ----- End Phase 2.6 -----

        formatTime(isoString) {

            if (!isoString) return "";
            const date = new Date(isoString);
            return date.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        },
        getSlaBadgeClass(slaStatus) {
            switch (slaStatus) {
                case "normal": return "badge-success";
                case "warning": return "badge-warning";
                case "breached": return "badge-danger";
                default: return "badge-light";
            }
        },
        getSlaText(thread) {
            if (thread.sla_remaining_seconds === null) return "Inactive";
            
            const totalSecs = thread.sla_remaining_seconds;
            if (totalSecs <= 0) {
                const elapsedMins = Math.floor(Math.abs(totalSecs) / 60);
                return `Breached (${elapsedMins}m)`;
            } else {
                const remainingMins = Math.ceil(totalSecs / 60);
                return `${remainingMins}m left`;
            }
        },
        triageThread(classification) {
            this.triagingThread = true;
            ApiService.post(`/user/inbox/threads/${this.activeThreadKey}/triage`, {
                classification: classification
            })
                .then(response => {
                    this.$bvToast.toast("Thread successfully triaged.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.activeThread = response.data.thread;
                    this.fetchFolderCounts();
                    this.fetchThreads(false);
                })
                .catch(error => {
                    console.error("Failed to triage thread:", error);
                    this.$bvToast.toast("Failed to triage thread.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.triagingThread = false;
                });
        },
        openLinkJobModal() {
            this.selectedExistingJobId = null;
            ApiService.get("/user/inbox/active-jobs")
                .then(response => {
                    this.activeJobs = response.data;
                    this.$bvModal.show("link-job-modal");
                })
                .catch(error => {
                    console.error("Failed to load active jobs:", error);
                    this.$bvToast.toast("Failed to load active jobs.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                });
        },
        handleLinkJob(evt) {
            evt.preventDefault();
            if (!this.selectedExistingJobId) {
                this.$bvToast.toast("Please select an active job to link.", {
                    title: "Required Field",
                    variant: "warning",
                    solid: true
                });
                return;
            }
            this.triagingThread = true;
            ApiService.post(`/user/inbox/threads/${this.activeThreadKey}/triage`, {
                classification: 'job',
                existing_job_id: this.selectedExistingJobId
            })
                .then(response => {
                    this.$bvToast.toast("Thread successfully linked to job.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.activeThread = response.data.thread;
                    this.fetchFolderCounts();
                    this.fetchThreads(false);
                    this.$nextTick(() => {
                        this.$bvModal.hide("link-job-modal");
                    });
                })
                .catch(error => {
                    console.error("Failed to link thread to job:", error);
                    this.$bvToast.toast("Failed to link thread to job.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.triagingThread = false;
                });
        },
        closeConfirmPopover() {
            if (this.$refs.confirmPopover) {
                this.$refs.confirmPopover.$emit('close');
            }
        },
        closeLostPopover() {
            if (this.$refs.lostPopover) {
                this.$refs.lostPopover.$emit('close');
            }
        },
        submitConfirmShipment() {
            if (!this.confirmAwb || !this.confirmOperatorId || !this.confirmClearanceDate) {
                this.$bvToast.toast("Please fill in all confirmation fields.", {
                    title: "Validation Error",
                    variant: "warning",
                    solid: true
                });
                return;
            }
            this.confirmingShipment = true;
            ApiService.post(`/user/inbox/threads/${this.activeThreadKey}/confirm`, {
                awb_number: this.confirmAwb,
                operator_id: this.confirmOperatorId,
                planned_clearance_date: this.confirmClearanceDate
            })
                .then(response => {
                    this.$bvToast.toast("Shipment confirmed and operator assigned.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.closeConfirmPopover();
                    this.confirmAwb = "";
                    this.confirmOperatorId = null;
                    this.confirmClearanceDate = "";
                    this.selectThread(this.activeThreadKey);
                })
                .catch(error => {
                    console.error("Failed to confirm shipment:", error);
                    const msg = error.response?.data?.error || "Failed to confirm shipment.";
                    this.$bvToast.toast(msg, {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.confirmingShipment = false;
                });
        },
        submitMarkLost() {
            if (!this.lostReason) {
                this.$bvToast.toast("Please select a reason.", {
                    title: "Validation Error",
                    variant: "warning",
                    solid: true
                });
                return;
            }
            this.savingLoss = true;
            ApiService.post(`/user/inbox/threads/${this.activeThreadKey}/lost`, {
                lost_reason: this.lostReason,
                lost_reason_custom: this.lostReason === 'other' ? this.lostReasonCustom : null
            })
                .then(response => {
                    this.$bvToast.toast("Job marked as lost and thread archived.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.closeLostPopover();
                    this.lostReason = "rates_high";
                    this.lostReasonCustom = "";
                    this.activeThreadKey = null;
                    this.activeThread = {};
                    this.emails = [];
                    this.fetchFolderCounts();
                    this.fetchThreads(true);
                })
                .catch(error => {
                    console.error("Failed to mark lost:", error);
                    this.$bvToast.toast("Failed to mark lost.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.savingLoss = false;
                });
        },
        fetchJobCostSheet() {
            if (!this.activeThread || !this.activeThread.job) return;
            this.loadingCostSheet = true;
            ApiService.get(`/user/inbox/jobs/${this.activeThread.job.id}/cost-sheet`)
                .then(response => {
                    this.costSheetInvoiceItems = response.data.invoice.items;
                    this.costSheetPurchaseItems = response.data.purchase_voucher.items;
                    
                    // Run calculation to populate total amounts
                    this.costSheetInvoiceItems.forEach(this.calculateItemTotal);
                    this.costSheetPurchaseItems.forEach(this.calculateItemTotal);
                })
                .catch(error => {
                    console.error("Failed to load job cost sheet:", error);
                    this.$bvToast.toast("Failed to load cost sheet ledger.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.loadingCostSheet = false;
                });
        },
        calculateItemTotal(item) {
            const qty = parseFloat(item.qty) || 0;
            const rate = parseFloat(item.unit_rate) || 0;
            const taxRate = parseFloat(item.tax_rate) || 0;
            
            item.subtotal = qty * rate;
            item.tax_amount = item.subtotal * (taxRate / 100);
            item.total_amount = item.subtotal + item.tax_amount;
        },
        addInvoiceItem() {
            const defaultQty = 1.00;
            const newItem = {
                charge_type: "Local Delivery",
                description: "Cartage or local delivery fees",
                qty: defaultQty,
                unit_rate: 150.00,
                tax_rate: 18.00,
                subtotal: 150.00,
                tax_amount: 27.00,
                total_amount: 177.00
            };
            this.costSheetInvoiceItems.push(newItem);
        },
        removeInvoiceItem(index) {
            this.costSheetInvoiceItems.splice(index, 1);
        },
        addPurchaseItem() {
            const defaultQty = 1.00;
            const newItem = {
                charge_type: "Local Handler Fee",
                description: "Terminal or local handling cost",
                qty: defaultQty,
                unit_rate: 100.00,
                tax_rate: 18.00,
                subtotal: 100.00,
                tax_amount: 18.00,
                total_amount: 118.00
            };
            this.costSheetPurchaseItems.push(newItem);
        },
        removePurchaseItem(index) {
            this.costSheetPurchaseItems.splice(index, 1);
        },
        saveJobCostSheet() {
            this.savingCostSheet = true;
            ApiService.post(`/user/inbox/jobs/${this.activeThread.job.id}/cost-sheet`, {
                invoice_items: this.costSheetInvoiceItems,
                purchase_items: this.costSheetPurchaseItems
            })
                .then(response => {
                    this.$bvToast.toast("Job Cost Ledger draft saved successfully.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.fetchJobCostSheet();
                })
                .catch(error => {
                    console.error("Failed to save job cost sheet:", error);
                    this.$bvToast.toast("Failed to save Job Cost Ledger draft.", {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.savingCostSheet = false;
                });
        }
    }
};
</script>

<style scoped>
.body-color {
    min-height: 82vh;
    padding-bottom: 1rem;
    box-sizing: border-box;
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

/* 3-Column Layout */
.workspace-layout {
    font-family: 'Inter', sans-serif;
    color: #475569;
}

.column-folders {
    width: 20%;
    min-width: 180px;
    max-width: 240px;
    background: #f8fafc;
}

.folders-nav .nav-link {
    color: #475569;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s ease;
}

.folders-nav .nav-link:hover {
    background: rgba(53, 85, 148, 0.05);
    color: #355594;
}

.folders-nav .nav-link.active {
    background: rgba(53, 85, 148, 0.1);
    color: #355594;
    font-weight: 700;
}

.folder-badge {
    font-weight: 700;
    font-size: 0.75rem;
}

.icon-size {
    font-size: 1.1rem;
}

.column-threads {
    width: 30%;
    min-width: 280px;
    max-width: 360px;
    background: #ffffff;
}

.search-wrapper {
    background: #f8fafc;
}

.search-input {
    border-radius: 0 8px 8px 0 !important;
    border: 1px solid #e2e8f0 !important;
}

.thread-card {
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
}

.thread-card:hover {
    background: #f8fafc;
}

.thread-card.active {
    background: rgba(53, 85, 148, 0.04);
    border-left-color: #355594;
}

.thread-card.unread {
    background: rgba(53, 85, 148, 0.01);
}

.unread-dot {
    position: absolute;
    top: 15px;
    left: 8px;
    width: 8px;
    height: 8px;
    background: #3b82f6;
    border-radius: 50%;
}

.thread-sender {
    color: #1e293b;
    font-size: 0.95rem;
}

.thread-card.unread .thread-sender {
    color: #0f172a;
}

.thread-subject {
    font-size: 0.9rem;
    color: #334155;
}

.thread-card.unread .thread-subject {
    color: #0f172a;
}

.thread-snippet {
    color: #64748b;
    line-height: 1.4;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
}

.job-badge {
    border-radius: 6px;
    font-weight: 700;
}

.job-badge-unassigned {
    border-radius: 6px;
    color: #64748b;
    background: #f1f5f9;
    font-weight: 600;
}

.sla-timer {
    font-weight: 700;
    border-radius: 6px;
}

.column-conversation {
    background: #f1f5f9;
}

.conversation-header {
    height: 70px;
    border-bottom: 1px solid #e2e8f0;
}

.assignee-select {
    width: 160px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-weight: 600;
    font-size: 0.85rem;
    height: 36px;
    padding: 0 10px;
    color: #334155;
}

.bg-timeline {
    background-color: #f1f5f9;
}

.message-card {
    border: 1px solid #e2e8f0;
    background: #ffffff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-header:hover {
    background-color: #f8fafc !important;
}

.sender-avatar {
    width: 36px;
    height: 36px;
    background: #355594;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.email-body-content {
    color: #334155;
    font-size: 0.95rem;
    line-height: 1.6;
}

.whitespace-pre-line {
    white-space: pre-line;
}

.attachments-section {
    background: #f8fafc;
    border-radius: 12px;
}

.attachment-chip {
    max-width: 250px;
    font-size: 0.85rem;
    border-color: #cbd5e1;
}

.attachment-name {
    color: #475569;
    font-weight: 600;
}

.reply-textarea {
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    font-size: 0.95rem;
    padding: 12px;
}

.reply-textarea:focus {
    border-color: #355594;
    box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.1);
}

.send-reply-btn {
    background: linear-gradient(135deg, #355594 0%, #1e3a8a 100%) !important;
    border: none !important;
    border-radius: 10px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(53, 85, 148, 0.15);
    transition: all 0.2s ease;
}

.send-reply-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(53, 85, 148, 0.25);
}

/* Animations */
.expand-enter-active, .expand-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    overflow: hidden;
}
.expand-enter, .expand-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

/* ── Phase 2.6 — Drawer / Split-Pane ───────────────────────────────────── */

/* Hide cols 1 & 2 when drawer is open */
.cols-hidden {
    width: 0 !important;
    min-width: 0 !important;
    overflow: hidden !important;
    padding: 0 !important;
    border: none !important;
    flex: 0 0 0 !important;
    transition: flex 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Column 3 narrows to 50% when drawer open */
.col-conv-narrow {
    width: 50%;
    flex: 0 0 50%;
    transition: flex 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Split-pane toggle button */
.split-pane-btn {
    width: 34px;
    height: 34px;
    padding: 0;
    display: flex !important;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;
}
.split-pane-btn:hover { transform: scale(1.08); }

/* Drawer panel */
.drawer-panel {
    width: 50%;
    flex: 0 0 50%;
    background: #ffffff;
    border-left: 1px solid #e2e8f0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* Drawer slide transition */
.drawer-slide-enter-active, .drawer-slide-leave-active {
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}
.drawer-slide-enter, .drawer-slide-leave-to {
    transform: translateX(40px);
    opacity: 0;
}

/* Drawer header */
.drawer-header {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 8px;
}

/* Drawer tab buttons */
.drawer-tab-btn {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    outline: none;
}
.drawer-tab-btn:hover { background: #f1f5f9; color: #355594; border-color: #cbd5e1; }
.drawer-tab-btn.active {
    background: linear-gradient(135deg, #355594 0%, #1e3a8a 100%);
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 2px 8px rgba(53, 85, 148, 0.3);
}

/* Drawer close button */
.drawer-close-btn {
    width: 30px !important; height: 30px !important;
    padding: 0 !important;
    display: flex !important; align-items: center; justify-content: center;
    border-radius: 8px !important;
    background: #f1f5f9 !important; border: none !important;
    transition: all 0.2s ease;
}
.drawer-close-btn:hover { background: #fee2e2 !important; color: #dc2626 !important; }

/* Drawer body */
.drawer-body { flex-grow: 1; overflow-y: auto; padding: 24px; }

/* Tab content fade-in-up */
.drawer-tab-content { animation: drawerFadeUp 0.25s ease forwards; }
@keyframes drawerFadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* OCR Dropzone */
.ocr-dropzone {
    border: 2px dashed #cbd5e1;
    border-radius: 16px; padding: 32px 20px; cursor: pointer;
    transition: all 0.25s ease; background: #f8fafc;
    min-height: 160px; display: flex; align-items: center; justify-content: center;
}
.ocr-dropzone:hover, .ocr-dropzone.drag-over {
    border-color: #355594; background: rgba(53,85,148,0.04); transform: scale(1.01);
}
.ocr-drop-icon { animation: pulseIcon 2s ease-in-out infinite; }
@keyframes pulseIcon {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
}
.ocr-extract-btn {
    background: linear-gradient(135deg, #355594 0%, #1e3a8a 100%) !important;
    border: none !important; border-radius: 8px !important; font-weight: 700;
    box-shadow: 0 4px 12px rgba(53,85,148,0.2);
}

/* OCR Result */
.ocr-result-card { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; }
.ocr-fields { display: flex; flex-direction: column; gap: 10px; }
.ocr-field-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 10px; padding-bottom: 10px; border-bottom: 1px solid #e0f2fe;
}
.ocr-field-row:last-child { border-bottom: none; padding-bottom: 0; }
.ocr-field-label { font-size: 0.8rem; font-weight: 700; color: #0369a1; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
.ocr-field-value { font-size: 0.9rem; color: #1e293b; font-weight: 500; text-align: right; }

/* Workspace Link Card */
.workspace-link-card {
    display: flex; align-items: center; gap: 16px; padding: 20px;
    border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.workspace-link-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(53,85,148,0.12); border-color: #bfdbfe; }
.workspace-link-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* HWB placeholder list */
.hwb-placeholder-list { display: flex; flex-direction: column; gap: 8px; }
.hwb-placeholder-item { display: flex; align-items: center; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; color: #64748b; }

/* Job Cost Coming Soon */
.cost-coming-soon { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 20px; min-height: 300px; }
.cost-icon-wrap { width: 80px; height: 80px; background: linear-gradient(135deg, rgba(53,85,148,0.1) 0%, rgba(30,58,138,0.05) 100%); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }

</style>
