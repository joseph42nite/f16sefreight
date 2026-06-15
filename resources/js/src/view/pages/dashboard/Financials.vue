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
                "
                class="ml-lg-4 mt-4 mt-lg-0"
            >
                <!-- Header -->
                <div class="container py-8 px-6 px-sm-8 px-md-10 bg-light-gradient">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div>
                            <span style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 700; color: #355594; opacity: 0.6; margin-bottom: 0.5rem; display: block;">Accounts & Ledgers</span>
                            <h6 style="color:#355594;font-size:26px !important;line-height:34px !important;font-weight:800 !important;letter-spacing:-0.5px !important;margin-bottom:0px;font-family:'Inter', sans-serif !important;">Financials & Reconciliation</h6>
                        </div>
                        <div v-if="isViperCommand" class="mt-3 mt-md-0 d-flex gap-2">
                            <b-button @click="openInvoiceModal" class="btn-action shadow-sm mr-2" variant="primary">
                                <b-icon icon="plus-circle-fill" class="mr-1"></b-icon> New Invoice
                            </b-button>
                            <b-button @click="openVoucherModal" class="btn-action shadow-sm" variant="outline-primary">
                                <b-icon icon="plus-circle" class="mr-1"></b-icon> New Voucher
                            </b-button>
                        </div>
                    </div>
                </div>

                <hr style="border: 0; border-top: 1px solid rgba(53, 85, 148, 0.12); margin-top: 0; margin-bottom: 0;" />

                <!-- Main Gated Interface -->
                <div class="container py-6 px-6 px-sm-8 px-md-10">
                    <div v-if="!isViperCommand" class="teaser-container mx-auto py-10 px-8 rounded-lg shadow-lg text-center mt-10">
                        <div class="icon-circle mb-6 mx-auto">
                            <b-icon icon="shield-lock-fill" font-scale="3" class="lock-icon"></b-icon>
                        </div>
                        <h3 class="teaser-title mb-4">Upgrade to Unlock Financials</h3>
                        <p class="teaser-description mb-6 mx-auto">
                            Get full double-entry ledger bookkeeping, real-time Plaid/Setu bank statement reconciliation, and automated CASS airline weight validation triggers.
                        </p>
                        <b-button class="upgrade-btn px-8 py-3" variant="primary">
                            Upgrade to Viper Command
                        </b-button>
                    </div>

                    <div v-else>
                        <!-- Navigation Tabs -->
                        <div class="d-flex justify-content-start border-bottom mb-6 nav-tabs-custom">
                            <button 
                                @click="setActiveTab('invoices')" 
                                :class="['tab-btn mr-4 pb-3', { 'active': activeTab === 'invoices' }]"
                            >
                                <b-icon icon="file-earmark-text" class="mr-1"></b-icon> Sales Invoices
                            </button>
                            <button 
                                @click="setActiveTab('vouchers')" 
                                :class="['tab-btn mr-4 pb-3', { 'active': activeTab === 'vouchers' }]"
                            >
                                <b-icon icon="file-earmark-spreadsheet" class="mr-1"></b-icon> Purchase Vouchers
                            </button>
                            <button 
                                @click="setActiveTab('reconciliation')" 
                                :class="['tab-btn mr-4 pb-3', { 'active': activeTab === 'reconciliation' }]"
                            >
                                <b-icon icon="cash-stack" class="mr-1"></b-icon> CASS Reconciliation
                            </button>
                            <button 
                                @click="setActiveTab('bank_reconciliation')" 
                                :class="['tab-btn mr-4 pb-3', { 'active': activeTab === 'bank_reconciliation' }]"
                            >
                                <b-icon icon="credit-card" class="mr-1"></b-icon> Bank Reconciliation
                            </button>
                            <button 
                                @click="setActiveTab('statements')" 
                                :class="['tab-btn pb-3', { 'active': activeTab === 'statements' }]"
                            >
                                <b-icon icon="file-earmark-bar-graph" class="mr-1"></b-icon> Financial Reports
                            </button>
                        </div>

                        <!-- Tab Content -->
                        <div v-if="loading" class="text-center py-10">
                            <b-spinner variant="primary" label="Loading data..."></b-spinner>
                            <p class="text-muted mt-2">Fetching ledger details...</p>
                        </div>

                        <div v-else>
                            <!-- Tab: Invoices -->
                            <div v-if="activeTab === 'invoices'">
                                <div class="table-responsive">
                                    <table class="table custom-table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Invoice No</th>
                                                <th>Client</th>
                                                <th>Job Enquiry</th>
                                                <th>Doc Date</th>
                                                <th>Subtotal</th>
                                                <th>Tax Amount</th>
                                                <th>Grand Total</th>
                                                <th>Status</th>
                                                <th class="text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="inv in invoices" :key="inv.id">
                                                <td class="font-weight-bold text-primary">{{ inv.invoice_no }}</td>
                                                <td>{{ inv.client ? inv.client.name : 'N/A' }}</td>
                                                <td>{{ inv.job ? inv.job.enquiry_no : 'N/A' }}</td>
                                                <td>{{ formatDate(inv.document_date) }}</td>
                                                <td>INR {{ formatAmount(inv.subtotal) }}</td>
                                                <td>INR {{ formatAmount(inv.tax_amount) }}</td>
                                                <td class="font-weight-bold">INR {{ formatAmount(inv.grand_total) }}</td>
                                                <td>
                                                    <span :class="['badge px-2 py-1', inv.status === 'finalized' ? 'badge-success' : 'badge-warning']">
                                                        {{ inv.status }}
                                                    </span>
                                                </td>
                                                <td class="text-right">
                                                    <b-button 
                                                        v-if="inv.status === 'draft'" 
                                                        size="sm" 
                                                        variant="primary" 
                                                        @click="finalizeInvoice(inv.id)"
                                                        class="btn-sm-action"
                                                    >
                                                        Finalize
                                                    </b-button>
                                                    <span v-else class="text-muted font-size-sm"><b-icon icon="check-circle-fill" class="text-success"></b-icon> Posted</span>
                                                </td>
                                            </tr>
                                            <tr v-if="invoices.length === 0">
                                                <td colspan="9" class="text-center text-muted py-6">No invoices found. Create a new draft invoice to begin.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Tab: Vouchers -->
                            <div v-if="activeTab === 'vouchers'">
                                <div class="table-responsive">
                                    <table class="table custom-table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Voucher No</th>
                                                <th>Vendor</th>
                                                <th>Job</th>
                                                <th>Doc Date</th>
                                                <th>Subtotal</th>
                                                <th>Tax Amount</th>
                                                <th>Grand Total</th>
                                                <th>Status</th>
                                                <th class="text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="vch in vouchers" :key="vch.id">
                                                <td class="font-weight-bold text-primary">{{ vch.voucher_no }}</td>
                                                <td>{{ vch.vendor ? vch.vendor.name : 'N/A' }}</td>
                                                <td>{{ vch.job ? vch.job.enquiry_no : 'N/A' }}</td>
                                                <td>{{ formatDate(vch.document_date) }}</td>
                                                <td>INR {{ formatAmount(vch.subtotal) }}</td>
                                                <td>INR {{ formatAmount(vch.tax_amount) }}</td>
                                                <td class="font-weight-bold">INR {{ formatAmount(vch.grand_total) }}</td>
                                                <td>
                                                    <span :class="['badge px-2 py-1', vch.status === 'finalized' ? 'badge-success' : 'badge-warning']">
                                                        {{ vch.status }}
                                                    </span>
                                                </td>
                                                <td class="text-right">
                                                    <b-button 
                                                        v-if="vch.status === 'draft'" 
                                                        size="sm" 
                                                        variant="primary" 
                                                        @click="finalizeVoucher(vch.id)"
                                                        class="btn-sm-action"
                                                    >
                                                        Finalize
                                                    </b-button>
                                                    <span v-else class="text-muted font-size-sm"><b-icon icon="check-circle-fill" class="text-success"></b-icon> Posted</span>
                                                </td>
                                            </tr>
                                            <tr v-if="vouchers.length === 0">
                                                <td colspan="9" class="text-center text-muted py-6">No purchase vouchers found. Create a new draft voucher to begin.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Tab: Reconciliation -->
                            <div v-if="activeTab === 'reconciliation'">
                                <div class="bg-light-blue p-6 rounded-lg mb-6 border d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                    <div>
                                        <h5 class="text-primary font-weight-bold mb-2">IATA CASS Clearing & Auto-Match</h5>
                                        <p class="text-muted mb-0">Reconcile operational carrier cost vouchers against CASS clearing reports dynamically using weight & rate cross-auditing.</p>
                                    </div>
                                    <div class="mt-4 mt-md-0 d-flex gap-2">
                                        <b-button @click="triggerReconciliation" class="btn-action shadow-sm mr-2" variant="success">
                                            <b-icon icon="play-fill"></b-icon> Run Auto-Match Reconciliation
                                        </b-button>
                                        <b-button @click="showUploadForm = !showUploadForm" class="btn-action" variant="outline-primary">
                                            <b-icon icon="cloud-upload"></b-icon> Ingest Statement Row
                                        </b-button>
                                    </div>
                                </div>

                                <!-- Dynamic upload statement form inline -->
                                <div v-if="showUploadForm" class="card card-body mb-6 border shadow-sm rounded-lg p-5">
                                    <h6 class="text-primary font-weight-bold mb-3">Add CASS Statement Row</h6>
                                    <b-row>
                                        <b-col md="3">
                                            <label class="font-size-sm font-weight-bold">AWB Number</label>
                                            <b-form-input v-model="cassUpload.awb_number" placeholder="020-12345678"></b-form-input>
                                        </b-col>
                                        <b-col md="2">
                                            <label class="font-size-sm font-weight-bold">Gross Weight (kg)</label>
                                            <b-form-input type="number" v-model="cassUpload.cass_gross_weight"></b-form-input>
                                        </b-col>
                                        <b-col md="2">
                                            <label class="font-size-sm font-weight-bold">Cass Rate</label>
                                            <b-form-input type="number" v-model="cassUpload.cass_rate"></b-form-input>
                                        </b-col>
                                        <b-col md="3">
                                            <label class="font-size-sm font-weight-bold">Grand Total</label>
                                            <b-form-input type="number" v-model="cassUpload.grand_total"></b-form-input>
                                        </b-col>
                                        <b-col md="2" class="d-flex align-items-end">
                                            <b-button @click="uploadStatementRow" variant="primary" class="w-100">Ingest</b-button>
                                        </b-col>
                                    </b-row>
                                </div>

                                <div class="table-responsive">
                                    <table class="table custom-table table-hover">
                                        <thead>
                                            <tr>
                                                <th>AWB Number</th>
                                                <th>Billing Cycle</th>
                                                <th>CASS Weight</th>
                                                <th>CASS Rate</th>
                                                <th>Total Billed</th>
                                                <th>Status</th>
                                                <th>Matched cost sheet Voucher</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="stmt in cassStatements" :key="stmt.id">
                                                <td class="font-weight-bold text-primary">{{ stmt.awb_number }}</td>
                                                <td>{{ stmt.billing_period }}</td>
                                                <td>{{ stmt.cass_gross_weight }} kg</td>
                                                <td>INR {{ stmt.cass_rate }}</td>
                                                <td class="font-weight-bold">INR {{ formatAmount(stmt.grand_total) }}</td>
                                                <td>
                                                    <span :class="['badge px-2 py-1', getReconStatusBadgeClass(stmt.reconciliation_status)]">
                                                        {{ stmt.reconciliation_status }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="stmt.matched_voucher" class="font-weight-bold text-success">
                                                        <b-icon icon="link"></b-icon> {{ stmt.matched_voucher.voucher_no }}
                                                    </span>
                                                    <span v-else class="text-muted">-</span>
                                                </td>
                                            </tr>
                                            <tr v-if="cassStatements.length === 0">
                                                <td colspan="7" class="text-center text-muted py-6">No CASS statements ingested. Click "Ingest Statement Row" to start.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Tab: Bank Reconciliation -->
                            <div v-if="activeTab === 'bank_reconciliation'">
                                <div class="bg-light-blue p-6 rounded-lg mb-6 border d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center shadow-sm">
                                    <div>
                                        <h5 class="text-primary font-weight-bold mb-2">Automated Bank Feed Reconciliation</h5>
                                        <p class="text-muted mb-0">Retrieve statement feeds via Plaid/Setu, match payments against finalized customer invoices automatically, and audit client payment risks.</p>
                                    </div>
                                    <div class="mt-4 mt-md-0 d-flex gap-2 align-items-center">
                                        <b-button @click="fetchBankFeed" class="btn-action shadow-sm mr-2" variant="outline-primary" :disabled="loading">
                                            <b-icon icon="arrow-repeat" class="mr-1"></b-icon> Fetch Bank Feed
                                        </b-button>
                                        <b-button @click="runBankAutoMatch" class="btn-action shadow-sm mr-2" variant="success" :disabled="loading">
                                            <b-icon icon="play-fill" class="mr-1"></b-icon> Auto-Match Payments
                                        </b-button>
                                        <b-button @click="runAiRiskAudit" class="btn-action shadow-sm" variant="info" :disabled="aiRiskLoading">
                                            <b-icon icon="cpu-fill" class="mr-1"></b-icon> AI Risk Audit
                                        </b-button>
                                    </div>
                                </div>

                                <b-row>
                                    <!-- Bank Statements Grid -->
                                    <b-col lg="8" class="mb-6">
                                        <div class="card shadow-sm border-0 rounded-lg overflow-hidden">
                                            <div class="card-header bg-white py-4 px-5 border-bottom">
                                                <h6 class="font-weight-bold text-secondary mb-0">Bank Feed Transactions</h6>
                                            </div>
                                            <div class="table-responsive">
                                                <table class="table custom-table table-hover mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Booking Date</th>
                                                            <th>Reference Description</th>
                                                            <th class="text-right">Amount</th>
                                                            <th>Status</th>
                                                            <th>Matched Invoice</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="stmt in bankStatements" :key="stmt.id">
                                                            <td>{{ formatDate(stmt.booking_date) }}</td>
                                                            <td>
                                                                <span class="font-weight-bold text-secondary">{{ stmt.sender_reference }}</span>
                                                                <small v-if="stmt.plaid_transaction_id" class="d-block text-muted font-size-xs">ID: {{ stmt.plaid_transaction_id }}</small>
                                                            </td>
                                                            <td class="text-right font-weight-bold" :class="stmt.amount >= 0 ? 'text-success' : 'text-danger'">
                                                                INR {{ formatAmount(stmt.amount) }}
                                                            </td>
                                                            <td>
                                                                <span :class="['badge px-2 py-1', getBankReconBadgeClass(stmt.status)]">
                                                                    {{ stmt.status }}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span v-if="stmt.matched_invoice" class="font-weight-bold text-success">
                                                                    <b-icon icon="link-45deg"></b-icon> {{ stmt.matched_invoice.invoice_no }}
                                                                </span>
                                                                <span v-else class="text-muted">-</span>
                                                            </td>
                                                        </tr>
                                                        <tr v-if="bankStatements.length === 0">
                                                            <td colspan="5" class="text-center text-muted py-8">
                                                                <b-icon icon="inbox" font-scale="2" class="mb-2 text-muted"></b-icon>
                                                                <p class="mb-0">No bank transactions loaded. Click "Fetch Bank Feed" to ingest mock Plaid feeds.</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </b-col>

                                    <!-- AI Risk Panel -->
                                    <b-col lg="4">
                                        <div class="card shadow-sm border-0 rounded-lg overflow-hidden mb-6" style="background: rgba(248, 250, 252, 0.8); border: 1px dashed #355594;">
                                            <div class="card-header bg-gradient-dark py-4 px-5 d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
                                                <h6 class="font-weight-bold text-white mb-0">
                                                    <b-icon icon="shield-shaded" class="mr-1"></b-icon> Gemini Risk Audit
                                                </h6>
                                                <span class="badge badge-light px-2 py-1 text-dark" style="font-size: 0.75rem;">Privacy Masked</span>
                                            </div>
                                            <div class="card-body p-5">
                                                <div v-if="aiRiskLoading" class="text-center py-6">
                                                    <b-spinner variant="primary" label="Querying Gemini..."></b-spinner>
                                                    <p class="text-muted mt-3 font-size-sm">Scrubbing client data metrics & running risk analysis...</p>
                                                </div>
                                                <div v-else-if="aiRiskAnalysis" class="ai-analysis-render font-size-sm" v-html="renderMarkdown(aiRiskAnalysis)">
                                                </div>
                                                <div v-else class="text-center py-8 text-muted">
                                                    <b-icon icon="cpu" font-scale="2.5" class="mb-3 text-secondary" style="opacity: 0.4;"></b-icon>
                                                    <p class="mb-3">Compile real-time credit metrics & client payment delays into an LLM threat audit.</p>
                                                    <b-button @click="runAiRiskAudit" size="sm" variant="outline-primary" class="rounded-pill px-4">
                                                        Run Audit
                                                    </b-button>
                                                </div>
                                            </div>
                                        </div>
                                    </b-col>
                                </b-row>
                            </div>

                            <!-- Tab: Financial Reports -->
                            <div v-if="activeTab === 'statements'">
                                <div class="d-flex justify-content-center mb-6">
                                    <b-form-radio-group
                                        v-model="statementType"
                                        :options="[
                                            { text: 'Trial Balance', value: 'trial-balance' },
                                            { text: 'Profit & Loss', value: 'profit-loss' },
                                            { text: 'Balance Sheet', value: 'balance-sheet' }
                                        ]"
                                        buttons
                                        button-variant="outline-primary"
                                        size="md"
                                        @change="loadFinancialStatements"
                                    ></b-form-radio-group>
                                </div>

                                <!-- Trial Balance View -->
                                <div v-if="statementType === 'trial-balance' && trialBalance">
                                    <div class="border rounded-lg p-5 shadow-sm bg-white mb-6">
                                        <div class="d-flex justify-content-between align-items-center mb-4">
                                            <h5 class="text-primary font-weight-bold mb-0">Trial Balance Sheet</h5>
                                            <span :class="['badge px-3 py-2', trialBalance.is_balanced ? 'badge-success' : 'badge-danger']">
                                                {{ trialBalance.is_balanced ? '🟢 Ledger Balanced' : '🔴 Ledger Out of Balance' }}
                                            </span>
                                        </div>
                                        <table class="table custom-table">
                                            <thead>
                                                <tr>
                                                    <th>Account Code</th>
                                                    <th>Account Name</th>
                                                    <th>Type</th>
                                                    <th class="text-right">Debit Balance</th>
                                                    <th class="text-right">Credit Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="acc in trialBalance.accounts" :key="acc.account_id">
                                                    <td>{{ acc.code }}</td>
                                                    <td class="font-weight-bold text-secondary">{{ acc.name }}</td>
                                                    <td class="text-capitalize">{{ acc.type }}</td>
                                                    <td class="text-right text-success font-weight-bold">
                                                        {{ acc.debit > 0 ? 'INR ' + formatAmount(acc.debit) : '-' }}
                                                    </td>
                                                    <td class="text-right text-danger font-weight-bold">
                                                        {{ acc.credit > 0 ? 'INR ' + formatAmount(acc.credit) : '-' }}
                                                    </td>
                                                </tr>
                                                <tr class="table-totals">
                                                    <td colspan="3" class="text-right font-weight-bold">Total</td>
                                                    <td class="text-right text-success font-weight-bold" style="border-top: 1.5px solid #333; border-bottom: 3px double #333;">
                                                        INR {{ formatAmount(trialBalance.total_debit) }}
                                                    </td>
                                                    <td class="text-right text-danger font-weight-bold" style="border-top: 1.5px solid #333; border-bottom: 3px double #333;">
                                                        INR {{ formatAmount(trialBalance.total_credit) }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Profit & Loss View -->
                                <div v-if="statementType === 'profit-loss' && profitAndLoss">
                                    <div class="border rounded-lg p-5 shadow-sm bg-white mb-6">
                                        <h5 class="text-primary font-weight-bold mb-4">Profit & Loss Statement</h5>
                                        
                                        <div class="statement-section mb-5">
                                            <h6 class="font-weight-bold border-bottom pb-2 text-success">Revenues</h6>
                                            <table class="table table-sm table-borderless">
                                                <tbody>
                                                    <tr v-for="rev in profitAndLoss.revenues" :key="rev.account_id">
                                                        <td>{{ rev.code }} - {{ rev.name }}</td>
                                                        <td class="text-right text-success font-weight-bold">INR {{ formatAmount(rev.balance) }}</td>
                                                    </tr>
                                                    <tr class="font-weight-bold border-top">
                                                        <td>Total Revenues</td>
                                                        <td class="text-right text-success">INR {{ formatAmount(profitAndLoss.total_revenue) }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="statement-section mb-5">
                                            <h6 class="font-weight-bold border-bottom pb-2 text-danger">Expenses</h6>
                                            <table class="table table-sm table-borderless">
                                                <tbody>
                                                    <tr v-for="exp in profitAndLoss.expenses" :key="exp.account_id">
                                                        <td>{{ exp.code }} - {{ exp.name }}</td>
                                                        <td class="text-right text-danger font-weight-bold">INR {{ formatAmount(exp.balance) }}</td>
                                                    </tr>
                                                    <tr class="font-weight-bold border-top">
                                                        <td>Total Expenses</td>
                                                        <td class="text-right text-danger">INR {{ formatAmount(profitAndLoss.total_expense) }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center bg-light-blue p-4 rounded border mt-4">
                                            <h5 class="font-weight-bold mb-0 text-primary">Net Profit / Operating Margin</h5>
                                            <h4 class="font-weight-bold mb-0 text-success">INR {{ formatAmount(profitAndLoss.net_profit) }}</h4>
                                        </div>
                                    </div>
                                </div>

                                <!-- Balance Sheet View -->
                                <div v-if="statementType === 'balance-sheet' && balanceSheet">
                                    <div class="border rounded-lg p-5 shadow-sm bg-white mb-6">
                                        <h5 class="text-primary font-weight-bold mb-4">Balance Sheet</h5>

                                        <b-row>
                                            <b-col md="6" class="border-right">
                                                <h6 class="font-weight-bold border-bottom pb-2 text-success">Assets</h6>
                                                <table class="table table-sm table-borderless">
                                                    <tbody>
                                                        <tr v-for="ast in balanceSheet.assets" :key="ast.account_id">
                                                            <td>{{ ast.code }} - {{ ast.name }}</td>
                                                            <td class="text-right font-weight-bold">INR {{ formatAmount(ast.balance) }}</td>
                                                        </tr>
                                                        <tr class="font-weight-bold border-top bg-light">
                                                            <td>Total Assets</td>
                                                            <td class="text-right text-success">INR {{ formatAmount(balanceSheet.total_assets) }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </b-col>
                                            <b-col md="6">
                                                <h6 class="font-weight-bold border-bottom pb-2 text-danger">Liabilities & Equities</h6>
                                                <table class="table table-sm table-borderless">
                                                    <tbody>
                                                        <tr v-for="lia in balanceSheet.liabilities" :key="lia.account_id">
                                                            <td>{{ lia.code }} - {{ lia.name }}</td>
                                                            <td class="text-right font-weight-bold">INR {{ formatAmount(lia.balance) }}</td>
                                                        </tr>
                                                        <tr class="border-top"><td colspan="2" class="py-1"></td></tr>
                                                        <tr v-for="eqt in balanceSheet.equity" :key="eqt.code">
                                                            <td>{{ eqt.code }} - {{ eqt.name }}</td>
                                                            <td class="text-right font-weight-bold">INR {{ formatAmount(eqt.balance) }}</td>
                                                        </tr>
                                                        <tr class="font-weight-bold border-top bg-light">
                                                            <td>Total Liabilities & Equity</td>
                                                            <td class="text-right text-danger">INR {{ formatAmount(parseFloat(balanceSheet.total_liabilities) + parseFloat(balanceSheet.total_equity)) }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </b-col>
                                        </b-row>

                                        <div v-if="Math.abs(parseFloat(balanceSheet.total_assets) - (parseFloat(balanceSheet.total_liabilities) + parseFloat(balanceSheet.total_equity))) < 0.05" 
                                             class="alert alert-success mt-4 mb-0 text-center font-weight-bold"
                                        >
                                            🟢 Balanced: Assets equal Liabilities plus Equities!
                                        </div>
                                        <div v-else class="alert alert-warning mt-4 mb-0 text-center font-weight-bold">
                                            ⚠️ Out of Balance: Assets do not equal Liabilities plus Equities!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal: New Invoice -->
        <b-modal v-model="showInvoiceModal" title="Create Draft Sales Invoice" hide-footer size="lg">
            <b-form @submit.prevent="submitInvoice">
                <b-row class="mb-3">
                    <b-col md="6">
                        <label class="font-weight-bold">Job Card / Enquiry</label>
                        <b-form-select v-model="newInvoice.job_id" required>
                            <option value="">Select Operational Job</option>
                            <option v-for="job in jobs" :key="job.id" :value="job.id">
                                {{ job.enquiry_no }} ({{ job.transport_mode }} - {{ job.status }})
                            </option>
                        </b-form-select>
                    </b-col>
                    <b-col md="6">
                        <label class="font-weight-bold">Client Company</label>
                        <b-form-select v-model="newInvoice.client_id" required>
                            <option value="">Select Billed Client</option>
                            <option v-for="com in companies" :key="com.id" :value="com.id">
                                {{ com.name }}
                            </option>
                        </b-form-select>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col md="4">
                        <label class="font-weight-bold">Type</label>
                        <b-form-select v-model="newInvoice.type" required>
                            <option value="invoice">Sales Invoice</option>
                            <option value="debit_note">Debit Note</option>
                            <option value="credit_note">Credit Note</option>
                            <option value="brokerage">Brokerage Invoice</option>
                            <option value="consol_invoice">Consolidation Invoice</option>
                        </b-form-select>
                    </b-col>
                    <b-col md="4">
                        <label class="font-weight-bold">Document Date</label>
                        <b-form-input type="date" v-model="newInvoice.document_date" required></b-form-input>
                    </b-col>
                    <b-col md="4">
                        <label class="font-weight-bold">Due Date</label>
                        <b-form-input type="date" v-model="newInvoice.due_date" required></b-form-input>
                    </b-col>
                </b-row>

                <div class="border-top pt-3 mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="font-weight-bold mb-0">Invoice Line Items</h6>
                        <b-button size="sm" variant="outline-primary" @click="addInvoiceItem">Add Line</b-button>
                    </div>

                    <div v-for="(item, idx) in newInvoice.items" :key="idx" class="border p-3 rounded mb-3 bg-light">
                        <b-row>
                            <b-col md="3">
                                <label class="font-size-sm">Charge Type</label>
                                <b-form-input v-model="item.charge_type" required></b-form-input>
                            </b-col>
                            <b-col md="4">
                                <label class="font-size-sm">Description</label>
                                <b-form-input v-model="item.description" required></b-form-input>
                            </b-col>
                            <b-col md="1.5" class="px-1">
                                <label class="font-size-sm">Qty/Weight</label>
                                <b-form-input type="number" v-model="item.qty" @input="updateInvoiceTotals" required></b-form-input>
                            </b-col>
                            <b-col md="1.5" class="px-1">
                                <label class="font-size-sm">Rate</label>
                                <b-form-input type="number" v-model="item.unit_rate" @input="updateInvoiceTotals" required></b-form-input>
                            </b-col>
                            <b-col md="1.5" class="px-1">
                                <label class="font-size-sm">Tax (%)</label>
                                <b-form-input type="number" v-model="item.tax_rate" @input="updateInvoiceTotals" required></b-form-input>
                            </b-col>
                            <b-col md="0.5" class="d-flex align-items-end justify-content-center">
                                <b-button size="sm" variant="danger" @click="removeInvoiceItem(idx)"><b-icon icon="trash"></b-icon></b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>

                <div class="border-top pt-3 mt-4 text-right bg-light p-3 rounded">
                    <span class="d-block font-size-sm text-muted">Subtotal: <strong>INR {{ formatAmount(newInvoice.subtotal) }}</strong></span>
                    <span class="d-block font-size-sm text-muted">Tax Amount: <strong>INR {{ formatAmount(newInvoice.tax_amount) }}</strong></span>
                    <span class="d-block font-size-md font-weight-bold text-primary">Grand Total: INR {{ formatAmount(newInvoice.grand_total) }}</span>
                </div>

                <div class="text-right mt-4">
                    <b-button variant="secondary" class="mr-2" @click="showInvoiceModal = false">Cancel</b-button>
                    <b-button type="submit" variant="primary">Save Draft</b-button>
                </div>
            </b-form>
        </b-modal>

        <!-- Modal: New Purchase Voucher -->
        <b-modal v-model="showVoucherModal" title="Create Draft Purchase Voucher" hide-footer size="lg">
            <b-form @submit.prevent="submitVoucher">
                <b-row class="mb-3">
                    <b-col md="6">
                        <label class="font-weight-bold">Job Card / Enquiry</label>
                        <b-form-select v-model="newVoucher.job_id" required>
                            <option value="">Select Operational Job</option>
                            <option v-for="job in jobs" :key="job.id" :value="job.id">
                                {{ job.enquiry_no }} ({{ job.transport_mode }} - {{ job.status }})
                            </option>
                        </b-form-select>
                    </b-col>
                    <b-col md="6">
                        <label class="font-weight-bold">Vendor Carrier</label>
                        <b-form-select v-model="newVoucher.vendor_id" required>
                            <option value="">Select Billed Vendor</option>
                            <option v-for="com in companies" :key="com.id" :value="com.id">
                                {{ com.name }}
                            </option>
                        </b-form-select>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col md="4">
                        <label class="font-weight-bold">Document Date</label>
                        <b-form-input type="date" v-model="newVoucher.document_date" required></b-form-input>
                    </b-col>
                    <b-col md="4">
                        <label class="font-weight-bold">Vendor Invoice No</label>
                        <b-form-input v-model="newVoucher.vendor_invoice_no"></b-form-input>
                    </b-col>
                    <b-col md="4">
                        <label class="font-weight-bold">Vendor Invoice Date</label>
                        <b-form-input type="date" v-model="newVoucher.vendor_invoice_date"></b-form-input>
                    </b-col>
                </b-row>

                <div class="border-top pt-3 mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="font-weight-bold mb-0">Voucher Cost Items</h6>
                        <b-button size="sm" variant="outline-primary" @click="addVoucherItem">Add Line</b-button>
                    </div>

                    <div v-for="(item, idx) in newVoucher.items" :key="idx" class="border p-3 rounded mb-3 bg-light">
                        <b-row>
                            <b-col md="3">
                                <label class="font-size-sm">Charge Type</label>
                                <b-form-input v-model="item.charge_type" required></b-form-input>
                            </b-col>
                            <b-col md="4">
                                <label class="font-size-sm">Description</label>
                                <b-form-input v-model="item.description" required></b-form-input>
                            </b-col>
                            <b-col md="1.5" class="px-1">
                                <label class="font-size-sm">Qty/Weight</label>
                                <b-form-input type="number" v-model="item.qty" @input="updateVoucherTotals" required></b-form-input>
                            </b-col>
                            <b-col md="1.5" class="px-1">
                                <label class="font-size-sm">Rate</label>
                                <b-form-input type="number" v-model="item.unit_rate" @input="updateVoucherTotals" required></b-form-input>
                            </b-col>
                            <b-col md="1.5" class="px-1">
                                <label class="font-size-sm">Tax (%)</label>
                                <b-form-input type="number" v-model="item.tax_rate" @input="updateVoucherTotals" required></b-form-input>
                            </b-col>
                            <b-col md="0.5" class="d-flex align-items-end justify-content-center">
                                <b-button size="sm" variant="danger" @click="removeVoucherItem(idx)"><b-icon icon="trash"></b-icon></b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>

                <div class="border-top pt-3 mt-4 text-right bg-light p-3 rounded">
                    <span class="d-block font-size-sm text-muted">Subtotal: <strong>INR {{ formatAmount(newVoucher.subtotal) }}</strong></span>
                    <span class="d-block font-size-sm text-muted">Tax Amount: <strong>INR {{ formatAmount(newVoucher.tax_amount) }}</strong></span>
                    <span class="d-block font-size-md font-weight-bold text-primary">Grand Total: INR {{ formatAmount(newVoucher.grand_total) }}</span>
                </div>

                <div class="text-right mt-4">
                    <b-button variant="secondary" class="mr-2" @click="showVoucherModal = false">Cancel</b-button>
                    <b-button type="submit" variant="primary">Save Draft</b-button>
                </div>
            </b-form>
        </b-modal>
    </b-container>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import ApiService from "@/core/services/api.service";

export default {
    name: "Financials",
    components: {
        SideBar
    },
    data() {
        return {
            activeTab: "invoices",
            loading: false,
            showUploadForm: false,
            invoices: [],
            vouchers: [],
            cassStatements: [],
            bankStatements: [],
            aiRiskAnalysis: "",
            aiRiskLoading: false,
            jobs: [],
            companies: [],
            statementType: "trial-balance",
            trialBalance: null,
            profitAndLoss: null,
            balanceSheet: null,
            showInvoiceModal: false,
            showVoucherModal: false,
            cassUpload: {
                awb_number: "",
                cass_gross_weight: 100,
                cass_rate: 10,
                grand_total: 1180,
                airline_id: 1
            },
            newInvoice: {
                job_id: "",
                client_id: "",
                type: "invoice",
                document_date: "",
                due_date: "",
                currency: "INR",
                exchange_rate: 1.0,
                subtotal: 0,
                tax_amount: 0,
                grand_total: 0,
                items: []
            },
            newVoucher: {
                job_id: "",
                vendor_id: "",
                document_date: "",
                vendor_invoice_no: "",
                vendor_invoice_date: "",
                currency: "INR",
                exchange_rate: 1.0,
                subtotal: 0,
                tax_amount: 0,
                grand_total: 0,
                items: []
            }
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        isViperCommand() {
            const tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
            return tier === 'viper_command';
        }
    },
    mounted() {
        if (this.isViperCommand) {
            this.loadTabContent();
            this.loadDropdownData();
        }
    },
    methods: {
        setActiveTab(tab) {
            this.activeTab = tab;
            this.loadTabContent();
        },
        loadTabContent() {
            this.loading = true;
            if (this.activeTab === "invoices") {
                ApiService.get("/user/invoices")
                    .then(({ data }) => {
                        this.invoices = data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else if (this.activeTab === "vouchers") {
                ApiService.get("/user/purchase-vouchers")
                    .then(({ data }) => {
                        this.vouchers = data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else if (this.activeTab === "reconciliation") {
                ApiService.get("/user/reconciliation/cass")
                    .then(({ data }) => {
                        this.cassStatements = data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else if (this.activeTab === "statements") {
                this.loadFinancialStatements();
            } else if (this.activeTab === "bank_reconciliation") {
                this.loadBankStatements();
            }
        },
        loadDropdownData() {
            ApiService.get("/user/inbox/active-jobs").then(({ data }) => {
                this.jobs = data;
            });
            ApiService.get("/companies").then(({ data }) => {
                this.companies = data;
            });
        },
        loadBankStatements() {
            this.loading = true;
            ApiService.get("/user/reconciliation/bank")
                .then(({ data }) => {
                    this.bankStatements = data;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        fetchBankFeed() {
            this.loading = true;
            ApiService.post("/user/reconciliation/bank/poll")
                .then(() => {
                    this.$bvToast.toast("Bank statement feed synced from Plaid sandbox.", {
                        title: "Fetch Completed",
                        variant: "success",
                        solid: true
                    });
                    this.loadBankStatements();
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        runBankAutoMatch() {
            this.loading = true;
            ApiService.post("/user/reconciliation/bank/match")
                .then(({ data }) => {
                    this.$bvToast.toast(`Payment matching done. Successfully matched and posted ${data.matched} cash ledger entries.`, {
                        title: "Reconciliation Success",
                        variant: "success",
                        solid: true
                    });
                    this.loadBankStatements();
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        runAiRiskAudit() {
            this.aiRiskLoading = true;
            ApiService.get("/user/reconciliation/bank/ai-risk")
                .then(({ data }) => {
                    this.aiRiskAnalysis = data.analysis;
                    this.aiRiskLoading = false;
                })
                .catch(() => {
                    this.aiRiskLoading = false;
                });
        },
        getBankReconBadgeClass(status) {
            switch (status) {
                case "reconciled": return "badge-success";
                case "flagged": return "badge-warning";
                default: return "badge-secondary";
            }
        },
        renderMarkdown(text) {
            if (!text) return "";
            let html = text;
            html = html.replace(/^### (.*$)/gim, '<h6 class="font-weight-bold text-primary mt-3 mb-2">$1</h6>');
            html = html.replace(/^## (.*$)/gim, '<h6 class="font-weight-bold text-secondary mt-3 mb-2">$1</h6>');
            html = html.replace(/^# (.*$)/gim, '<h5 class="font-weight-bold text-dark mt-2 mb-2">$1</h5>');
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/^\s*-\s*(.*$)/gim, '<li class="ml-3">$1</li>');
            html = html.replace(/\n/g, "<br/>");
            return html;
        },
        loadFinancialStatements() {
            this.loading = true;
            if (this.statementType === "trial-balance") {
                ApiService.get("/user/financial-statements/trial-balance")
                    .then(({ data }) => {
                        this.trialBalance = data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else if (this.statementType === "profit-loss") {
                ApiService.get("/user/financial-statements/profit-and-loss")
                    .then(({ data }) => {
                        this.profitAndLoss = data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else if (this.statementType === "balance-sheet") {
                ApiService.get("/user/financial-statements/balance-sheet")
                    .then(({ data }) => {
                        this.balanceSheet = data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            }
        },
        // Actions
        finalizeInvoice(id) {
            this.loading = true;
            ApiService.post(`/user/invoices/${id}/finalize`)
                .then(() => {
                    this.$bvToast.toast("Invoice finalized & posted to ledger.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.loadTabContent();
                })
                .catch(err => {
                    this.loading = false;
                    const msg = err.response && err.response.data && err.response.data.message
                        ? err.response.data.message
                        : "Validation failed.";
                    this.$bvToast.toast(msg, {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                });
        },
        finalizeVoucher(id) {
            this.loading = true;
            ApiService.post(`/user/purchase-vouchers/${id}/finalize`)
                .then(() => {
                    this.$bvToast.toast("Purchase Voucher finalized & posted to ledger.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.loadTabContent();
                })
                .catch(err => {
                    this.loading = false;
                    const msg = err.response && err.response.data && err.response.data.message
                        ? err.response.data.message
                        : "Validation failed.";
                    this.$bvToast.toast(msg, {
                        title: "Error",
                        variant: "danger",
                        solid: true
                    });
                });
        },
        triggerReconciliation() {
            this.loading = true;
            ApiService.post("/user/reconciliation/cass/match")
                .then(({ data }) => {
                    this.$bvToast.toast(`Matched ${data.matched} of ${data.processed} statements successfully.`, {
                        title: "Reconciliation Done",
                        variant: "success",
                        solid: true
                    });
                    this.loadTabContent();
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        uploadStatementRow() {
            ApiService.post("/user/reconciliation/cass/upload", {
                statements: [this.cassUpload]
            }).then(() => {
                this.$bvToast.toast("CASS Statement row uploaded successfully.", {
                    title: "Success",
                    variant: "success",
                    solid: true
                });
                this.showUploadForm = false;
                this.cassUpload.awb_number = "";
                this.loadTabContent();
            });
        },
        // Modal management
        openInvoiceModal() {
            this.newInvoice = {
                job_id: "",
                client_id: "",
                type: "invoice",
                document_date: new Date().toISOString().substr(0, 10),
                due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().substr(0, 10),
                currency: "INR",
                exchange_rate: 1.0,
                subtotal: 0,
                tax_amount: 0,
                grand_total: 0,
                items: [
                    { charge_type: "Freight", description: "Freight Charges", qty: 100, unit_rate: 10, tax_rate: 18, subtotal: 1000, tax_amount: 180, total_amount: 1180 }
                ]
            };
            this.showInvoiceModal = true;
            this.updateInvoiceTotals();
        },
        addInvoiceItem() {
            this.newInvoice.items.push({
                charge_type: "Freight",
                description: "Freight Charges",
                qty: 1,
                unit_rate: 0,
                tax_rate: 18,
                subtotal: 0,
                tax_amount: 0,
                total_amount: 0
            });
        },
        removeInvoiceItem(idx) {
            this.newInvoice.items.splice(idx, 1);
            this.updateInvoiceTotals();
        },
        updateInvoiceTotals() {
            let sub = 0;
            let tax = 0;
            this.newInvoice.items.forEach(item => {
                item.subtotal = parseFloat(item.qty || 0) * parseFloat(item.unit_rate || 0);
                item.tax_amount = (item.subtotal * parseFloat(item.tax_rate || 0)) / 100;
                item.total_amount = item.subtotal + item.tax_amount;
                sub += item.subtotal;
                tax += item.tax_amount;
            });
            this.newInvoice.subtotal = sub;
            this.newInvoice.tax_amount = tax;
            this.newInvoice.grand_total = sub + tax;
        },
        submitInvoice() {
            ApiService.post("/user/invoices", this.newInvoice).then(() => {
                this.$bvToast.toast("Draft Sales Invoice saved.", {
                    title: "Success",
                    variant: "success",
                    solid: true
                });
                this.showInvoiceModal = false;
                this.loadTabContent();
            });
        },
        // Voucher Modal
        openVoucherModal() {
            this.newVoucher = {
                job_id: "",
                vendor_id: "",
                document_date: new Date().toISOString().substr(0, 10),
                vendor_invoice_no: "",
                vendor_invoice_date: new Date().toISOString().substr(0, 10),
                currency: "INR",
                exchange_rate: 1.0,
                subtotal: 0,
                tax_amount: 0,
                grand_total: 0,
                items: [
                    { charge_type: "Freight", description: "Freight charges buy-side", qty: 100, unit_rate: 6, tax_rate: 18, subtotal: 600, tax_amount: 108, total_amount: 708 }
                ]
            };
            this.showVoucherModal = true;
            this.updateVoucherTotals();
        },
        addVoucherItem() {
            this.newVoucher.items.push({
                charge_type: "Freight",
                description: "Freight Charges",
                qty: 1,
                unit_rate: 0,
                tax_rate: 18,
                subtotal: 0,
                tax_amount: 0,
                total_amount: 0
            });
        },
        removeVoucherItem(idx) {
            this.newVoucher.items.splice(idx, 1);
            this.updateVoucherTotals();
        },
        updateVoucherTotals() {
            let sub = 0;
            let tax = 0;
            this.newVoucher.items.forEach(item => {
                item.subtotal = parseFloat(item.qty || 0) * parseFloat(item.unit_rate || 0);
                item.tax_amount = (item.subtotal * parseFloat(item.tax_rate || 0)) / 100;
                item.total_amount = item.subtotal + item.tax_amount;
                sub += item.subtotal;
                tax += item.tax_amount;
            });
            this.newVoucher.subtotal = sub;
            this.newVoucher.tax_amount = tax;
            this.newVoucher.grand_total = sub + tax;
        },
        submitVoucher() {
            ApiService.post("/user/purchase-vouchers", this.newVoucher).then(() => {
                this.$bvToast.toast("Draft Purchase Voucher saved.", {
                    title: "Success",
                    variant: "success",
                    solid: true
                });
                this.showVoucherModal = false;
                this.loadTabContent();
            });
        },
        // Formatting helpers
        formatDate(dateString) {
            if (!dateString) return "-";
            const date = new Date(dateString);
            return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
        },
        formatAmount(value) {
            if (value === null || value === undefined) return "0.00";
            return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
        },
        getReconStatusBadgeClass(status) {
            switch (status) {
                case "matched": return "badge-success";
                case "rate_mismatch": return "badge-danger";
                case "weight_mismatch": return "badge-warning";
                default: return "badge-secondary";
            }
        }
    }
};
</script>

<style scoped>
.body-color {
    min-height: 90vh;
    padding-bottom: 2rem;
    background: #f4f6fa;
}

.bg-light-gradient {
    background: linear-gradient(180deg, #f8fafd 0%, #ffffff 100%);
}

.bg-light-blue {
    background-color: #f0f5ff;
    border-color: #d6e4ff !important;
}

.nav-tabs-custom {
    border-bottom: 1.5px solid rgba(53, 85, 148, 0.12);
}

.tab-btn {
    background: none;
    border: none;
    font-weight: 600;
    color: #64748b;
    font-size: 1.05rem;
    position: relative;
    outline: none;
    transition: all 0.2s ease;
}

.tab-btn:hover {
    color: #355594;
}

.tab-btn.active {
    color: #355594;
    font-weight: 700;
}

.tab-btn.active::after {
    content: "";
    position: absolute;
    bottom: -1.5px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #355594;
    border-radius: 3px;
}

.custom-table {
    margin-bottom: 0;
}

.custom-table th {
    border-top: none;
    border-bottom: 2px solid rgba(53, 85, 148, 0.12);
    color: #475569;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.custom-table td {
    vertical-align: middle;
    color: #334155;
    font-size: 0.95rem;
    border-bottom: 1px solid rgba(53, 85, 148, 0.08);
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

.btn-action {
    border-radius: 12px;
    font-weight: 600;
    padding: 0.6rem 1.2rem;
    transition: all 0.2s ease;
}

.btn-sm-action {
    border-radius: 8px;
    font-weight: 600;
    padding: 0.35rem 0.8rem;
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

.table-totals td {
    background-color: #f8fafc;
}
</style>
