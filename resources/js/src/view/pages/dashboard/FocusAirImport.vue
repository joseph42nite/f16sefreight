<template>
  <b-container fluid class="body-color">
    <div class="d-flex flex-column flex-lg-row">
      <SideBar></SideBar>
      <div class="ml-lg-4 mt-4 mt-lg-0" style="background: #ffffff; border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1); z-index: 1; border-radius: 32px; flex: 1; min-width: 0;">
        <div class="container py-8 px-6 px-sm-8 px-md-10 font-outfit">
    <!-- Header section -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-8">
      <div class="d-flex flex-column">
        <span style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 700; color: #355594; opacity: 0.6; margin-bottom: 0.5rem; display: block;">Air Import</span>
        <h6 style="color:#355594;font-size:26px !important;line-height:34px !important;font-weight:800 !important;letter-spacing:-0.5px !important;margin-bottom:0.5rem;font-family:'Inter', sans-serif !important;" class="d-flex align-items-center">
          <b-icon icon="airplane-engines" class="mr-3" style="color: #355594;"></b-icon>
          Import Consol Manager
        </h6>
        <span style="color: #5A6B8A; font-size: 0.9rem;">Manage inbound flights, consolidate HAWBs, coordinate customs filings, and issue delivery orders</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <OcrUploadModal :is-drawer="isDrawer" category="focus_air_import" @extracted="processImportExtractedData" />
        <b-button @click="loadDemoConsol" class="show-btn">
          <b-icon icon="lightning-fill" class="mr-2 text-warning"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">Load Demo</b>
        </b-button>
        <b-button @click="resetForm" class="show-btn">
          <b-icon icon="arrow-counterclockwise" class="mr-2 text-danger"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">Reset</b>
        </b-button>
        <router-link to="/inbox" class="show-btn text-decoration-none">
          <b-icon icon="arrow-left" class="mr-2" style="color: #355594;"></b-icon><b class="font-weight-bolder" style="font-size: 1.05rem;">Back to Inbox</b>
        </router-link>
      </div>
    </div>

    <!-- Consol Quick Summary Banner (if consol no or flight loaded) -->
    <div v-if="form.execution_job_no || form.shipping_details.flight_number" class="mbl-summary-banner p-5 mb-6 rounded-lg animate-fade-in d-flex flex-column flex-md-row justify-content-between align-items-md-center">
      <div class="d-flex flex-wrap align-items-center gap-4">
        <div class="px-4 py-2 border-right-premium mb-2 mb-md-0">
          <span class="banner-label">Consol Job / Enquiry No</span>
          <h5 class="banner-value text-indigo font-weight-bold mb-0" style="color: #355594 !important;">
            {{ form.execution_job_no || 'DRAFT' }}
          </h5>
          <span class="small text-muted">{{ form.consol_type }}</span>
        </div>
        <div class="px-4 py-2 border-right-premium mb-2 mb-md-0">
          <span class="banner-label">Flight Details</span>
          <h5 class="banner-value mb-0 font-weight-bold" style="color: #475569;">
            {{ form.shipping_details.flight_number || 'TBD' }}
          </h5>
          <span class="small text-muted">Carrier: {{ form.shipping_details.carrier_name || 'TBD' }}</span>
        </div>
        <div class="px-4 py-2 border-right-premium mb-2 mb-md-0">
          <span class="banner-label">Route</span>
          <h5 class="banner-value mb-0 font-weight-bold" style="color: #475569;">
            {{ form.routing.departure_airport || 'TBD' }} ➔ {{ form.routing.destination_airport || 'TBD' }}
          </h5>
          <span class="small text-muted">ETA: {{ formatDateTime(form.shipping_details.eta_datetime) }}</span>
        </div>
        <div class="px-4 py-2 mb-2 mb-md-0">
          <span class="banner-label">Payload Totals</span>
          <h5 class="banner-value mb-0 font-weight-bold" style="color: #475569;">
            {{ formatWeight(form.packing.gross_weight) }} KGS / {{ form.packing.piece_count }} PCS
          </h5>
          <span class="small text-muted">Vol: {{ formatVol(form.packing.volume_cbm) }} CBM / Chg Wt: {{ formatWeight(form.packing.chargeable_weight) }} KGS</span>
        </div>
      </div>
      <div class="text-right d-flex flex-column align-items-end mt-3 mt-md-0">
        <span class="banner-label">Consol Owner</span>
        <span class="badge badge-light-primary px-3 py-2 mt-1">{{ getOwnerName(form.job_owner_id) }}</span>
      </div>
    </div>

    <!-- Alert / Notifications Section -->
    <div v-if="successMsg" class="alert alert-custom alert-light-success mb-6 shadow-sm animate-fade-in">
      <div class="alert-icon"><i class="fas fa-check-circle text-success"></i></div>
      <div class="alert-text font-weight-bold">{{ successMsg }}</div>
    </div>
    <div v-if="validationWarning" class="alert alert-custom alert-light-warning mb-6 shadow-sm animate-fade-in">
      <div class="alert-icon"><b-icon icon="exclamation-triangle-fill" class="text-warning"></b-icon></div>
      <div class="alert-text font-weight-bold">{{ validationWarning }}</div>
    </div>

    <!-- Top-Level Consol Metadata Form -->
    <div class="premium-glass-card p-6 mb-6">
      <h4 class="h-color mb-5 d-flex align-items-center">
        <b-icon icon="info-circle" class="mr-3" style="color: #355594;"></b-icon> Consolidation Core Parameters
      </h4>
      <b-row>
        <b-col md="3" class="mb-4">
          <b-form-group label="Consol No *" label-class="text-muted small font-weight-bold">
            <b-form-input 
              v-model="form.execution_job_no" 
              required 
              placeholder="e.g. JOBA-26-9028" 
              class="premium-input"
              :class="{'border-warning-premium': form.execution_job_no && form.execution_job_no.length > 30}"
            ></b-form-input>
            <span v-if="form.execution_job_no && form.execution_job_no.length > 30" class="text-warning small">Max 30 characters limit.</span>
          </b-form-group>
        </b-col>
        <b-col md="3" class="mb-4">
          <b-form-group label="Planned Clearance Date *" label-class="text-muted small font-weight-bold">
            <b-form-input v-model="form.planned_clearance_date" type="date" required class="premium-input"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="2" class="mb-4">
          <b-form-group label="Cargo Type" label-class="text-muted small font-weight-bold">
            <b-form-select v-model="form.cargo_type" :options="cargoTypeOptions" class="premium-select"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="2" class="mb-4">
          <b-form-group label="Consol Owner *" label-class="text-muted small font-weight-bold">
            <b-form-select v-model="form.job_owner_id" :options="ownerOptions" required class="premium-select"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="2" class="mb-4">
          <b-form-group label="Consol Type" label-class="text-muted small font-weight-bold">
            <b-form-select v-model="form.consol_type" :options="consolTypeOptions" class="premium-select"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <!-- Main Navigation Tabs -->
    <b-card no-body class="bg-transparent border-0">
      <b-tabs content-class="mt-6" class="custom-nav-tabs">
        
        <!-- Tab 1: Entity lookup details -->
        <b-tab active>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="people" class="mr-2"></b-icon>
              <span>Entity Details</span>
            </div>
          </template>
          <b-row>
            <!-- Origin Agent -->
            <b-col lg="4" class="mb-4">
              <div class="entity-card p-5 rounded-lg h-100">
                <h6 class="h-color mb-4 d-flex align-items-center">
                  <span class="badge badge-light-indigo mr-2">1</span> Origin Agent
                </h6>
                <b-form-group label="Search Origin Agent" label-class="text-muted small font-weight-bold">
                  <b-form-select 
                    v-model="selectedOriginAgent" 
                    :options="originAgentOptions" 
                    class="premium-select"
                    @change="onOriginAgentSelect"
                  ></b-form-select>
                </b-form-group>
                <b-form-group label="Agent Address Blocks (Cargo-XML 35 Chars/Line)" label-class="text-muted small font-weight-bold">
                  <b-form-textarea 
                    v-model="form.entities.origin_agent.address" 
                    rows="5" 
                    class="premium-textarea"
                    :class="{'border-warning-premium': hasAddressLineOverrun(form.entities.origin_agent.address)}"
                    placeholder="Enter full address details..."
                  ></b-form-textarea>
                  <div v-if="hasAddressLineOverrun(form.entities.origin_agent.address)" class="text-warning-premium small mt-1">
                    <b-icon icon="exclamation-circle-fill" class="mr-1"></b-icon>
                    Line exceeds 35 character limits! (Cargo-XML transmission standard)
                  </div>
                </b-form-group>
              </div>
            </b-col>

            <!-- Destination Agent -->
            <b-col lg="4" class="mb-4">
              <div class="entity-card p-5 rounded-lg h-100">
                <h6 class="h-color mb-4 d-flex align-items-center">
                  <span class="badge badge-light-indigo mr-2">2</span> Destination Agent
                </h6>
                <b-form-group label="Search Destination Agent" label-class="text-muted small font-weight-bold">
                  <b-form-select 
                    v-model="selectedDestAgent" 
                    :options="destAgentOptions" 
                    class="premium-select"
                    @change="onDestAgentSelect"
                  ></b-form-select>
                </b-form-group>
                <b-form-group label="Agent Address Blocks (Cargo-XML 35 Chars/Line)" label-class="text-muted small font-weight-bold">
                  <b-form-textarea 
                    v-model="form.entities.dest_agent.address" 
                    rows="5" 
                    class="premium-textarea"
                    :class="{'border-warning-premium': hasAddressLineOverrun(form.entities.dest_agent.address)}"
                    placeholder="Enter full address details..."
                  ></b-form-textarea>
                  <div v-if="hasAddressLineOverrun(form.entities.dest_agent.address)" class="text-warning-premium small mt-1">
                    <b-icon icon="exclamation-circle-fill" class="mr-1"></b-icon>
                    Line exceeds 35 character limits! (Cargo-XML transmission standard)
                  </div>
                </b-form-group>
              </div>
            </b-col>

            <!-- Selling Agent -->
            <b-col lg="4" class="mb-4">
              <div class="entity-card p-5 rounded-lg h-100">
                <h6 class="h-color mb-4 d-flex align-items-center">
                  <span class="badge badge-light-indigo mr-2">3</span> Selling Agent
                </h6>
                <b-form-group label="Search Selling Agent" label-class="text-muted small font-weight-bold">
                  <b-form-select 
                    v-model="selectedSellingAgent" 
                    :options="sellingAgentOptions" 
                    class="premium-select"
                    @change="onSellingAgentSelect"
                  ></b-form-select>
                </b-form-group>
                <b-form-group label="Agent Address Blocks (Cargo-XML 35 Chars/Line)" label-class="text-muted small font-weight-bold">
                  <b-form-textarea 
                    v-model="form.entities.selling_agent.address" 
                    rows="5" 
                    class="premium-textarea"
                    :class="{'border-warning-premium': hasAddressLineOverrun(form.entities.selling_agent.address)}"
                    placeholder="Enter full address details..."
                  ></b-form-textarea>
                  <div v-if="hasAddressLineOverrun(form.entities.selling_agent.address)" class="text-warning-premium small mt-1">
                    <b-icon icon="exclamation-circle-fill" class="mr-1"></b-icon>
                    Line exceeds 35 character limits! (Cargo-XML transmission standard)
                  </div>
                </b-form-group>
              </div>
            </b-col>
          </b-row>
        </b-tab>

        <!-- Tab 2: Shipping Details -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="airplane" class="mr-2"></b-icon>
              <span>Shipping Details</span>
            </div>
          </template>
          <div class="premium-glass-card p-6">
            <h5 class="h-color mb-5">Vessel/Flight Particulars</h5>
            <b-row>
              <b-col md="4" class="mb-4">
                <b-form-group label="Flight Number *" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model="form.shipping_details.flight_number" placeholder="e.g. EK502" required class="premium-input"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mb-4">
                <b-form-group label="MAWB Number *" label-class="text-muted small font-weight-bold">
                  <b-form-input 
                    v-model="form.shipping_details.mawb_number" 
                    placeholder="e.g. 020-98304921" 
                    required 
                    class="premium-input"
                    :class="{'border-warning-premium': !validateMawbFormat(form.shipping_details.mawb_number) && form.shipping_details.mawb_number !== ''}"
                  ></b-form-input>
                  <div v-if="!validateMawbFormat(form.shipping_details.mawb_number) && form.shipping_details.mawb_number !== ''" class="text-warning small mt-1">
                    Format must be NNN-NNNNNNNN (IATA prefix + serial).
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mb-4">
                <b-form-group label="Carrier Name *" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model="form.shipping_details.carrier_name" placeholder="e.g. Emirates Cargo" required class="premium-input"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6" class="mb-4">
                <b-form-group label="ETA Date/Time (Arrival) *" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model="form.shipping_details.eta_datetime" type="datetime-local" required class="premium-input"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="6" class="mb-4">
                <b-form-group label="ETD Date/Time (Departure) *" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model="form.shipping_details.etd_datetime" type="datetime-local" required class="premium-input"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </b-tab>

        <!-- Tab 3: Routing details -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="signpost-split" class="mr-2"></b-icon>
              <span>Routing</span>
            </div>
          </template>
          <div class="premium-glass-card p-6">
            <h5 class="h-color mb-5">Journey Routing Legs</h5>
            <b-row>
              <b-col md="6" class="mb-4">
                <b-form-group label="Departure Port / Airport (Origin) *" label-class="text-muted small font-weight-bold">
                  <b-form-input 
                    v-model="form.routing.departure_airport" 
                    placeholder="e.g. DXB" 
                    required 
                    class="premium-input text-uppercase"
                    :class="{'border-warning-premium': !validateIataCode(form.routing.departure_airport) && form.routing.departure_airport !== ''}"
                  ></b-form-input>
                  <div v-if="!validateIataCode(form.routing.departure_airport) && form.routing.departure_airport !== ''" class="text-warning small mt-1">
                    Must be exactly 3 uppercase letters (IATA Code).
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="6" class="mb-4">
                <b-form-group label="Destination Port / Airport (Destination) *" label-class="text-muted small font-weight-bold">
                  <b-form-input 
                    v-model="form.routing.destination_airport" 
                    placeholder="e.g. MAA" 
                    required 
                    class="premium-input text-uppercase"
                    :class="{'border-warning-premium': !validateIataCode(form.routing.destination_airport) && form.routing.destination_airport !== ''}"
                  ></b-form-input>
                  <div v-if="!validateIataCode(form.routing.destination_airport) && form.routing.destination_airport !== ''" class="text-warning small mt-1">
                    Must be exactly 3 uppercase letters (IATA Code).
                  </div>
                </b-form-group>
              </b-col>
            </b-row>

            <hr class="border-secondary opacity-15 my-6">
            
            <h6 class="h-color mb-4">Multi-Leg Journey Details</h6>
            <div v-for="(leg, index) in form.routing.legs" :key="index" class="routing-leg-row p-4 mb-3 rounded-lg border border-secondary border-opacity-10">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="text-indigo font-weight-bold small">Leg {{ index + 1 }}</span>
                <b-button v-if="index > 0" variant="link" class="text-danger p-0 small" @click="removeRoutingLeg(index)">
                  <b-icon icon="trash"></b-icon> Remove
                </b-button>
              </div>
              <b-row>
                <b-col md="3" class="mb-2 mb-md-0">
                  <b-form-group label="Transit Airport" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-input v-model="leg.airport" placeholder="e.g. DOH" class="premium-input text-uppercase"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3" class="mb-2 mb-md-0">
                  <b-form-group label="Carrier" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-input v-model="leg.carrier" placeholder="e.g. Qatar Airways" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3" class="mb-2 mb-md-0">
                  <b-form-group label="Flight No" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-input v-model="leg.flight_no" placeholder="e.g. QR528" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Date" label-class="text-muted small font-weight-bold mb-1">
                    <b-form-input v-model="leg.date" type="date" class="premium-input"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
            <b-button variant="outline-indigo" class="btn-pill mt-3" @click="addRoutingLeg">
              <b-icon icon="plus" class="mr-1"></b-icon> Add Routing Leg
            </b-button>
          </div>
        </b-tab>

        <!-- Tab 4: Attached House -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="files" class="mr-2"></b-icon>
              <span>Attached House</span>
              <span class="badge badge-indigo ml-2 small" style="font-size: 0.65rem;">{{ form.attached_house.length }}</span>
            </div>
          </template>
          <b-row>
            <!-- House List Grid -->
            <b-col lg="8" class="mb-6">
              <div class="premium-glass-card p-6 h-100">
                <div class="d-flex align-items-center justify-content-between mb-5">
                  <h5 class="h-color mb-0">House Air Waybills (HAWBs) Mapped</h5>
                  <span class="badge badge-light-indigo font-weight-bold py-2 px-3">{{ form.attached_house.length }} HAWBs Bundle</span>
                </div>
                
                <div class="table-responsive">
                  <b-table
                    hover
                    :items="form.attached_house"
                    :fields="hawbTableFields"
                    class="premium-table mb-0"
                    show-empty
                    empty-text="No House AWBs mapped under this Consolidation folder."
                  >
                    <template #cell(gross_weight)="data">
                      {{ formatWeight(data.item.gross_weight) }} KGS
                    </template>
                    <template #cell(volume_cbm)="data">
                      {{ formatVol(data.item.volume_cbm) }} CBM
                    </template>
                    <template #cell(actions)="data">
                      <b-button variant="outline-danger" size="sm" class="btn-icon" @click="unlinkHawb(data.item.id)">
                        <b-icon icon="trash"></b-icon>
                      </b-button>
                    </template>
                  </b-table>
                </div>
              </div>
            </b-col>

            <!-- Attachment Sidebar -->
            <b-col lg="4" class="mb-6">
              <div class="premium-glass-card p-6 h-100">
                <h5 class="h-color mb-4">Link Pending House Job</h5>
                <p class="text-muted small">Select from unlinked import house jobs to bundle costs and group the manifest cargo.</p>
                
                <div v-if="linkHawbSuccess" class="alert alert-success py-2 px-3 small mb-4 font-weight-bold animate-fade-in">
                  House Job linked to Consol folder!
                </div>

                <b-form-group label="Select Unassociated HAWB Job" label-class="text-muted small font-weight-bold text-left">
                  <b-form-select v-model="selectedUnassociatedHawb" :options="unassociatedHawbOptions" class="premium-select"></b-form-select>
                </b-form-group>
                
                <b-button 
                  variant="indigo" 
                  class="w-100 btn-pill mt-4" 
                  style="height: 46px;" 
                  @click="linkHawb" 
                  :disabled="!selectedUnassociatedHawb"
                >
                  <b-icon icon="plus" class="mr-1"></b-icon> Bundle HAWB Job
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-tab>

        <!-- Tab 5: Packing Details -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="box" class="mr-2"></b-icon>
              <span>Packing Details</span>
            </div>
          </template>
          <b-row>
            <!-- Aggregates card -->
            <b-col lg="4" class="mb-6">
              <div class="premium-glass-card p-6 h-100">
                <h5 class="h-color mb-5">Cargo Aggregates</h5>
                <div class="agg-row mb-4">
                  <span class="agg-label text-muted small uppercase">Total Piece Count</span>
                  <h3 class="text-dark font-weight-bold mb-0 mt-1">{{ form.packing.piece_count }} PCS</h3>
                </div>
                <div class="agg-row mb-4">
                  <span class="agg-label text-muted small uppercase">Total Gross Weight</span>
                  <h3 class="text-dark font-weight-bold mb-0 mt-1">{{ formatWeight(form.packing.gross_weight) }} KGS</h3>
                </div>
                <div class="agg-row mb-4">
                  <span class="agg-label text-muted small uppercase">Calculated Volume</span>
                  <h3 class="text-indigo font-weight-bold mb-0 mt-1">{{ formatVol(form.packing.volume_cbm) }} CBM</h3>
                </div>
                <div class="agg-row mb-4">
                  <span class="agg-label text-muted small uppercase">Total Chargeable Weight</span>
                  <h3 class="text-success font-weight-bold mb-0 mt-1">{{ formatWeight(form.packing.chargeable_weight) }} KGS</h3>
                  <span class="small text-muted">Formula: Max(Gross, Volumetric Weight @ 1:6000)</span>
                </div>
              </div>
            </b-col>

            <!-- Dimension Grid / Calculator -->
            <b-col lg="8" class="mb-6">
              <div class="premium-glass-card p-6 h-100">
                <div class="d-flex align-items-center justify-content-between mb-5">
                  <h5 class="h-color mb-0">Interactive Volumetric Calculator</h5>
                  <b-button size="sm" class="show-btn" @click="addDimensionRow">
                    <b-icon icon="plus-circle" class="mr-1"></b-icon> Add Box Group
                  </b-button>
                </div>

                <div class="table-responsive mb-4">
                  <table class="table table-sm border border-secondary border-opacity-10">
                    <thead>
                      <tr class="dim-header">
                        <th>Pieces</th>
                        <th>L (cm)</th>
                        <th>W (cm)</th>
                        <th>H (cm)</th>
                        <th>Vol (CBM)</th>
                        <th>Vol Wt (KGS)</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, idx) in calculatorRows" :key="idx" class="dim-row align-middle">
                        <td style="width: 100px;">
                          <b-form-input v-model.number="row.pieces" type="number" class="premium-input-sm text-center" @input="recalcVolumeRow(idx)"></b-form-input>
                        </td>
                        <td style="width: 100px;">
                          <b-form-input v-model.number="row.length" type="number" class="premium-input-sm text-center" @input="recalcVolumeRow(idx)"></b-form-input>
                        </td>
                        <td style="width: 100px;">
                          <b-form-input v-model.number="row.width" type="number" class="premium-input-sm text-center" @input="recalcVolumeRow(idx)"></b-form-input>
                        </td>
                        <td style="width: 100px;">
                          <b-form-input v-model.number="row.height" type="number" class="premium-input-sm text-center" @input="recalcVolumeRow(idx)"></b-form-input>
                        </td>
                        <td class="text-center font-weight-bold text-info" style="line-height: 34px;">
                          {{ formatVol(row.volume_cbm) }}
                        </td>
                        <td class="text-center font-weight-bold text-success" style="line-height: 34px;">
                          {{ formatWeight(row.vol_weight) }}
                        </td>
                        <td class="text-center" style="width: 80px; line-height: 34px;">
                          <b-button variant="link" class="text-danger p-0" @click="removeDimensionRow(idx)">
                            <b-icon icon="trash"></b-icon>
                          </b-button>
                        </td>
                      </tr>
                      <tr v-if="calculatorRows.length === 0">
                        <td colspan="7" class="text-center text-muted py-5">
                          Click "Add Box Group" to compute volumes and weights for loose cargo packs.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-if="calculatorRows.length > 0" class="d-flex justify-content-between align-items-center p-4 rounded-lg" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
                  <div class="small text-muted">
                    Total Calculator Run: <span class="font-weight-bold" style="color: #475569;">{{ calcTotalPieces }} Pcs</span> / 
                    <span class="text-info font-weight-bold">{{ formatVol(calcTotalCbm) }} CBM</span> / 
                    <span class="text-success font-weight-bold">{{ formatWeight(calcTotalVolWeight) }} KGS Vol Wt</span>
                  </div>
                  <b-button variant="success" class="btn-pill px-4" @click="applyCalculatorToPacking">
                    Apply to Packing Details
                  </b-button>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-tab>

        <!-- Tab 6: DI (Delivery Order Form) -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="file-earmark-check" class="mr-2"></b-icon>
              <span>DI (Delivery Order)</span>
              <span v-if="isDOBlocked" class="badge badge-danger ml-2" style="font-size: 0.65rem;">
                <b-icon icon="lock-fill"></b-icon>
              </span>
            </div>
          </template>
          <b-row>
            <!-- DO Party Roles Form -->
            <b-col lg="8" class="mb-6">
              <div class="premium-glass-card p-6">
                <h5 class="h-color mb-4">Delivery Routing Parties</h5>
                <b-row>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="Consignee (Client Profile) *" label-class="text-muted small font-weight-bold">
                      <b-form-select 
                        v-model="selectedConsignee" 
                        :options="consigneeListOptions" 
                        class="premium-select"
                        @change="onConsigneeSelect"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="Transporter / Trucking Co" label-class="text-muted small font-weight-bold">
                      <b-form-select 
                        v-model="selectedTransporter" 
                        :options="transporterOptions" 
                        class="premium-select"
                        @change="onTransporterSelect"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="Custom Broker (CHA)" label-class="text-muted small font-weight-bold">
                      <b-form-select 
                        v-model="selectedCustomBroker" 
                        :options="customBrokerOptions" 
                        class="premium-select"
                        @change="onCustomBrokerSelect"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="High Sea Buyer (Optional)" label-class="text-muted small font-weight-bold">
                      <b-form-input v-model="form.delivery_order.high_sea_buyer" placeholder="Enter High Sea Buyer..." class="premium-input"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="Collection / Pickup Port Gate" label-class="text-muted small font-weight-bold">
                      <b-form-input v-model="form.delivery_order.pickup_address" placeholder="e.g. ACC Chennai Warehouse Section B" class="premium-input"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="Delivery Destination Address" label-class="text-muted small font-weight-bold">
                      <div class="d-flex align-items-center justify-content-between mb-1">
                        <span></span>
                        <b-form-checkbox v-model="copyConsigneeAddrCheckbox" size="sm" class="premium-checkbox text-muted small" @change="toggleAddressCopy">
                          Copy Consignee Address
                        </b-form-checkbox>
                      </div>
                      <b-form-textarea v-model="form.delivery_order.delivery_address" rows="3" class="premium-textarea" placeholder="Street destination address details..."></b-form-textarea>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>
            </b-col>

            <!-- DO Parameters & Gatekeeping -->
            <b-col lg="4" class="mb-6">
              <!-- Gatekeeper Warnings -->
              <div v-if="isDOBlocked" class="alert alert-danger mb-4 p-4 rounded-lg animate-fade-in border border-danger border-opacity-30">
                <h6 class="font-weight-bold d-flex align-items-center mb-2">
                  <b-icon icon="shield-lock-fill" class="mr-2"></b-icon>
                  DO Release Locked
                </h6>
                <p class="small mb-0">
                  Physical release is programmatically locked:
                  <span v-if="form.financials.payment_status === 'Pending'" class="d-block mt-1 font-weight-bold">• Payment status is PENDING</span>
                  <span v-if="isCreditLimitExceeded" class="d-block mt-1 font-weight-bold">• Consignee's CREDIT LIMIT EXCEEDED</span>
                  <span v-if="form.delivery_order.status === 'hold'" class="d-block mt-1 font-weight-bold">• Manual DO status is HOLD</span>
                </p>
              </div>
              <div v-else class="alert alert-success mb-4 p-4 rounded-lg animate-fade-in border border-success border-opacity-30">
                <h6 class="font-weight-bold d-flex align-items-center mb-1">
                  <b-icon icon="shield-fill-check" class="mr-2"></b-icon>
                  Credit Approval Cleared
                </h6>
                <p class="small mb-0">Delivery Order released is authorized for cargo pick-up.</p>
              </div>

              <!-- DO Parameters -->
              <div class="premium-glass-card p-5">
                <h5 class="h-color mb-4">DO Parameters</h5>
                
                <b-form-group label="DO Status" label-class="text-muted small font-weight-bold">
                  <b-form-select v-model="form.delivery_order.status" :options="doStatusOptions" class="premium-select"></b-form-select>
                </b-form-group>

                <b-form-group label="Delivery Order No" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model="form.delivery_order.delivery_order_no" placeholder="Auto-generated upon save" class="premium-input"></b-form-input>
                </b-form-group>

                <b-form-group label="DO Release Date" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model="form.delivery_order.delivery_order_date" type="date" class="premium-input"></b-form-input>
                </b-form-group>

                <b-form-group label="Release Fee (INR)" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model.number="form.delivery_order.do_release_fee" type="number" class="premium-input"></b-form-input>
                </b-form-group>

                <b-form-group label="Warehouse Charges (INR)" label-class="text-muted small font-weight-bold">
                  <b-form-input v-model.number="form.delivery_order.warehouse_fee" type="number" class="premium-input"></b-form-input>
                </b-form-group>

                <!-- DO Printing Buttons -->
                <div class="mt-5 pt-3 border-top border-secondary border-opacity-10">
                  <b-button 
                    class="btn btn-indigo w-100 btn-pill mb-2 py-3 font-weight-bold" 
                    :disabled="isDOBlocked" 
                    @click="printDO"
                  >
                    <b-icon icon="printer-fill" class="mr-1"></b-icon> Print Delivery Order
                  </b-button>
                  <b-button 
                    class="show-btn w-100 btn-pill py-3 font-weight-bold" 
                    :disabled="isDOBlocked"
                    @click="printReceipt"
                  >
                    <b-icon icon="receipt" class="mr-1"></b-icon> Print Receipt
                  </b-button>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-tab>

        <!-- Tab 7: Charges -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="wallet2" class="mr-2"></b-icon>
              <span>Charges</span>
            </div>
          </template>
          <div class="premium-glass-card p-6">
            <div class="d-flex justify-content-between align-items-center mb-5">
              <h5 class="h-color mb-0">Consol Billing Splits</h5>
              <b-button size="sm" class="show-btn" @click="addChargeItem">
                <b-icon icon="plus-circle" class="mr-1"></b-icon> Add Charge Item
              </b-button>
            </div>

            <div class="table-responsive mb-4">
              <table class="table table-sm border border-secondary border-opacity-10">
                <thead>
                  <tr class="dim-header">
                    <th>Charge Code</th>
                    <th>Description</th>
                    <th class="text-right">Prepaid (INR)</th>
                    <th class="text-right">Collect (INR)</th>
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(charge, index) in form.charges" :key="index" class="align-middle">
                    <td style="width: 150px;">
                      <b-form-input v-model="charge.code" class="premium-input-sm text-uppercase" placeholder="e.g. FR"></b-form-input>
                    </td>
                    <td>
                      <b-form-input v-model="charge.description" class="premium-input-sm" placeholder="e.g. Air Freight Charge"></b-form-input>
                    </td>
                    <td style="width: 180px;">
                      <b-form-input v-model.number="charge.prepaid" type="number" class="premium-input-sm text-right" placeholder="0.00"></b-form-input>
                    </td>
                    <td style="width: 180px;">
                      <b-form-input v-model.number="charge.collect" type="number" class="premium-input-sm text-right" placeholder="0.00"></b-form-input>
                    </td>
                    <td class="text-center" style="width: 80px;">
                      <b-button variant="link" class="text-danger p-0" @click="removeChargeItem(index)">
                        <b-icon icon="trash"></b-icon>
                      </b-button>
                    </td>
                  </tr>
                  <tr class="dim-row font-weight-bold border-top" style="background: #F8FAFC;">
                    <td class="text-dark">TOTALS</td>
                    <td></td>
                    <td class="text-right text-info font-weight-bolder pr-4" style="line-height:34px;">
                      ₹ {{ totalChargesPrepaid.toFixed(2) }}
                    </td>
                    <td class="text-right text-success font-weight-bolder pr-4" style="line-height:34px;">
                      ₹ {{ totalChargesCollect.toFixed(2) }}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-tab>

        <!-- Tab 8: Financials -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="cash-coin" class="mr-2"></b-icon>
              <span>Financials</span>
              <span v-if="isCreditLimitExceeded" class="badge badge-danger ml-2" style="font-size: 0.65rem;">
                <b-icon icon="shield-slash-fill"></b-icon> EXCEEDED
              </span>
            </div>
          </template>
          <b-row>
            <!-- Payment forms -->
            <b-col lg="8" class="mb-6">
              <div class="premium-glass-card p-6">
                <h5 class="h-color mb-5">Billing & Accounts Receivable Status</h5>
                <b-row>
                  <b-col md="4" class="mb-4">
                    <b-form-group label="Payment Status / Mode *" label-class="text-muted small font-weight-bold">
                      <b-form-select v-model="form.financials.payment_status" :options="paymentStatusOptions" class="premium-select"></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="4" class="mb-4">
                    <b-form-group label="Invoice Number" label-class="text-muted small font-weight-bold">
                      <b-form-input v-model="form.financials.invoice_no" placeholder="INV-26-XXXX" class="premium-input"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="4" class="mb-4">
                    <b-form-group label="Invoice Amount (INR)" label-class="text-muted small font-weight-bold">
                      <b-form-input v-model.number="form.financials.invoice_amount" type="number" class="premium-input"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="Receipt Reference Number" label-class="text-muted small font-weight-bold">
                      <b-form-input v-model="form.financials.receipt_no" placeholder="REC-26-XXXX" class="premium-input"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" class="mb-4">
                    <b-form-group label="Prepaid/Collect Split Details" label-class="text-muted small font-weight-bold">
                      <div class="p-3 rounded-lg small" style="background: #F8FAFC; border: 1px solid #E2E8F0; color: #475569;">
                        Freight Collect splits are automatically aggregated. Billing entities are matched to the Consignee debtor.
                      </div>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>
            </b-col>

            <!-- Credit Master profile -->
            <b-col lg="4" class="mb-6">
              <div class="credit-card p-5 rounded-lg border border-opacity-10 h-100" :class="isCreditLimitExceeded ? 'credit-card-alert' : 'credit-card-ok'">
                <h5 class="font-weight-bold mb-4 d-flex align-items-center h-color">
                  <b-icon icon="credit-card-2-front-fill" class="mr-2" :class="isCreditLimitExceeded ? 'text-danger' : 'text-success'"></b-icon>
                  Consignee Credit Master
                </h5>
                
                <div v-if="isCreditLimitExceeded" class="alert alert-danger py-2 px-3 small mb-4 font-weight-bold border border-danger border-opacity-20 animate-fade-in">
                  <b-icon icon="exclamation-circle-fill" class="mr-1"></b-icon> CREDIT LIMIT EXCEEDED
                </div>

                <div class="credit-detail mb-3">
                  <span class="text-muted small">Debtor Status</span>
                  <div class="font-weight-bold mt-1">
                    <span v-if="selectedConsigneeObj" class="badge" :class="getBadgeClassForCredit(selectedConsigneeObj.credit_status)">
                      {{ selectedConsigneeObj.credit_status.toUpperCase() }}
                    </span>
                    <span v-else class="text-muted">—</span>
                  </div>
                </div>

                <div class="credit-detail mb-3">
                  <span class="text-muted small">Assigned Credit Limit</span>
                  <h5 class="font-weight-bold mt-1 text-dark">
                    {{ selectedConsigneeObj ? formatCurrency(selectedConsigneeObj.credit_limit) : '₹ 0.00' }}
                  </h5>
                </div>

                <div class="credit-detail mb-3">
                  <span class="text-muted small">Current Outstanding Balance</span>
                  <h5 class="font-weight-bold mt-1" :class="isCreditLimitExceeded ? 'text-danger' : 'text-success'">
                    {{ selectedConsigneeObj ? formatCurrency(selectedConsigneeObj.outstanding_balance) : '₹ 0.00' }}
                  </h5>
                </div>

                <div class="credit-detail">
                  <span class="text-muted small">Payment Terms</span>
                  <p class="font-weight-bold mb-0 mt-1 text-dark">
                    {{ selectedConsigneeObj ? selectedConsigneeObj.default_payment_terms : '—' }}
                  </p>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-tab>

        <!-- Tab 9: Customs -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="shield-check" class="mr-2"></b-icon>
              <span>Customs / CGM</span>
            </div>
          </template>
          
          <div class="premium-glass-card p-6 mb-6">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
              <h5 class="h-color mb-3 mb-md-0">Customs IGM / CGM Manifest Filings</h5>
              <div class="d-flex flex-wrap align-items-center gap-2">
                <b-form-select v-model="customsFilterStatus" :options="customsFilterOptions" class="premium-select-sm mr-2" style="width:160px;"></b-form-select>
                <b-form-input v-model="customsFilterGate" placeholder="Custom House (e.g. INMAA4)" class="premium-input-sm mr-2 text-uppercase" style="width:200px;"></b-form-input>
                <b-button variant="warning" class="btn-pill" @click="openCgmModal">
                  <b-icon icon="box-arrow-up" class="mr-1"></b-icon> Submit CGM Data
                </b-button>
              </div>
            </div>

            <!-- CGM Filings Log Table -->
            <div class="table-responsive">
              <b-table
                hover
                :items="filteredCustomsFilings"
                :fields="customsTableFields"
                class="premium-table mb-0"
                show-empty
                empty-text="No digital customs filing submissions found matching search criteria."
              >
                <template #cell(filing_type)="data">
                  <span class="badge badge-light-indigo font-weight-bold">{{ data.value }}</span>
                </template>
                <template #cell(transaction_status)="data">
                  <span class="badge" :class="getBadgeClassForCustoms(data.value)">
                    {{ data.value.toUpperCase() }}
                  </span>
                </template>
                <template #cell(flat_file_path)="data">
                  <span class="small text-muted font-family-monospace" v-if="data.value">
                    {{ data.value.substring(data.value.lastIndexOf('/') + 1) }}
                  </span>
                  <span class="text-muted" v-else>—</span>
                </template>
                <template #cell(submitted_at)="data">
                  {{ formatDateTime(data.value) }}
                </template>
                <template #cell(actions)="data">
                  <b-button variant="outline-info" size="sm" class="btn-pill px-3" @click="viewFilingLog(data.item)">
                    View Log
                  </b-button>
                </template>
              </b-table>
            </div>
          </div>
        </b-tab>

        <!-- Tab 10: E-Docket -->
        <b-tab>
          <template #title>
            <div class="d-flex align-items-center">
              <b-icon icon="folder2-open" class="mr-2"></b-icon>
              <span>E-Docket</span>
              <span class="badge badge-success ml-2 small" style="font-size: 0.65rem;">{{ form.e_docket.length }}</span>
            </div>
          </template>
          <b-row>
            <!-- Upload Dropzone -->
            <b-col lg="6" class="mb-4">
              <div class="premium-glass-card p-6 h-100">
                <h5 class="h-color mb-4">Upload physical shipping documents</h5>
                
                <!-- Dropzone Box -->
                <div 
                  class="dropzone-box d-flex flex-column align-items-center justify-content-center py-10 px-5 text-center cursor-pointer rounded-lg border-dashed border-2 border-secondary"
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                >
                  <b-icon icon="cloud-upload" font-scale="3" class="text-indigo mb-3 animate-pulse"></b-icon>
                  <h6 style="color: #1E293B; font-weight: 700;">Drag and drop files here to upload</h6>
                  <p class="text-muted small mb-0 mt-1">Supports PDF, PNG, JPG files. Max 10MB.</p>
                  <input type="file" ref="fileInput" class="d-none" multiple @change="handleFileSelect">
                </div>

                <div v-if="uploadProgress > 0" class="mt-4 animate-fade-in">
                  <div class="d-flex justify-content-between mb-1 small text-muted">
                    <span>Uploading...</span>
                    <span>{{ uploadProgress }}%</span>
                  </div>
                  <b-progress :value="uploadProgress" max="100" variant="indigo" style="height: 6px;"></b-progress>
                </div>
              </div>
            </b-col>

            <!-- Attachment File List -->
            <b-col lg="6" class="mb-4">
              <div class="premium-glass-card p-6 h-100">
                <h5 class="h-color mb-4">Attached Documents Docket</h5>
                
                <div v-for="(doc, idx) in form.e_docket" :key="idx" class="docket-file-row p-3 mb-3 rounded-lg d-flex align-items-center justify-content-between border border-secondary border-opacity-10 animate-fade-in">
                  <div class="d-flex align-items-center">
                    <b-icon icon="file-earmark-pdf" font-scale="1.5" class="text-danger mr-3" v-if="doc.mime_type.includes('pdf')"></b-icon>
                    <b-icon icon="file-earmark-image" font-scale="1.5" class="text-info mr-3" v-else></b-icon>
                    <div>
                      <div class="font-weight-bold small text-truncate text-dark" style="max-width: 200px;">{{ doc.file_name }}</div>
                      <span class="text-muted small">{{ formatBytes(doc.file_size) }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <b-form-select v-model="doc.document_type" :options="documentTypeOptions" class="premium-select-sm mr-2" style="width: 160px;"></b-form-select>
                    <b-button variant="outline-light" size="sm" class="btn-icon" @click="deleteDocketFile(idx)">
                      <b-icon icon="x"></b-icon>
                    </b-button>
                  </div>
                </div>
                
                <div v-if="form.e_docket.length === 0" class="text-center py-10 text-muted">
                  <b-icon icon="folder" font-scale="2" class="mb-3"></b-icon>
                  <p class="small mb-0">E-Docket folder is currently empty. Upload cargo files or drafts.</p>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>

    <!-- Global form save/submit footer actions -->
    <div class="d-flex justify-content-end align-items-center mt-8 pt-5 border-top border-secondary border-opacity-10">
      <b-button class="btn btn-indigo btn-pill btn-lg px-8 py-3" :disabled="formLoading" @click="saveConsol">
        <span v-if="formLoading"><b-spinner small class="mr-2"></b-spinner>Saving Consol...</span>
        <span v-else><b-icon icon="check-circle" class="mr-2"></b-icon> Save Consol Folder</span>
      </b-button>
    </div>

    <!-- Customs CGM Filing Modal -->
    <b-modal 
      id="cgm-filing-modal" 
      title="Submit CGM / ICEGATE manifest Data" 
      size="lg"
      centered
      hide-footer
    >
      <div class="cgm-modal-body p-4 font-outfit text-dark rounded-lg">
        <h5 class="h-color mb-4">Filing Details - Custom Gate Chennai</h5>
        
        <b-row>
          <b-col md="6" class="mb-3">
            <b-form-group label="Date & Time of Filing" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="cgmFilingForm.datetime" type="datetime-local" class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6" class="mb-3">
            <b-form-group label="Consol Job No. *" label-class="text-muted small font-weight-bold">
              <b-form-input v-model="cgmFilingForm.consol_no" required disabled class="premium-input"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" class="mb-3">
            <b-form-group label="Custom House Code *" label-class="text-muted small font-weight-bold">
              <b-form-input 
                v-model="cgmFilingForm.customs_house" 
                placeholder="e.g. INMAA4" 
                required 
                class="premium-input text-uppercase"
                :class="{'border-warning-premium': cgmFilingForm.customs_house.length !== 6 && cgmFilingForm.customs_house !== ''}"
              ></b-form-input>
              <div v-if="cgmFilingForm.customs_house.length !== 6 && cgmFilingForm.customs_house !== ''" class="text-warning small mt-1">
                Must be exactly 6 characters (e.g. INMAA4).
              </div>
            </b-form-group>
          </b-col>
          <b-col md="6" class="mb-3">
            <b-form-group label="Sending Method" label-class="text-muted small font-weight-bold">
              <b-form-radio-group v-model="cgmFilingForm.sending_method" :options="sendingMethods" class="premium-radio-group text-dark pt-2"></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Status / DSC Terminal Screen -->
        <h6 class="h-color mt-4 mb-2">Manifest Submission Console & DSC Status</h6>
        <div class="dsc-terminal p-4 rounded-lg border border-info border-opacity-30 mb-5 font-family-monospace">
          <div v-for="(log, idx) in dscLogs" :key="idx" class="dsc-log-line" :class="getDscLogClass(log.type)">
            {{ log.text }}
          </div>
          <div v-if="dscLogs.length === 0" class="text-muted text-center py-4">
            Terminal Idle. Trigger "Submit" or "Send for Signature" to execute filings.
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex flex-wrap justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-10">
          <b-button class="show-btn mr-2 px-4" @click="closeCgmModal">Close</b-button>
          <b-button variant="outline-info" class="btn-pill mr-2 px-4" href="#" @click.prevent="openSignatureUtility">
            <b-icon icon="download" class="mr-1"></b-icon> Get Signature Tool
          </b-button>
          <b-button variant="warning" class="btn-pill mr-2 px-4" @click="submitCgmData" :disabled="filingProcessing">
            <span v-if="filingProcessing"><b-spinner small class="mr-2"></b-spinner>Processing...</span>
            <span v-else>Submit Manifest</span>
          </b-button>
          <b-button variant="success" class="btn-pill px-4" @click="sendForSignature" :disabled="!isCgmValid || filingProcessing">
            Sign & Transmit (DSC)
          </b-button>
        </div>
      </div>
    </b-modal>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import OcrUploadModal from "@/view/components/OcrUploadModal.vue";

export default {
  name: "FocusAirImport",
  components: {
    SideBar,
    OcrUploadModal
  },
  props: {
    isDrawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      successMsg: null,
      validationWarning: null,
      formLoading: false,
      selectedOriginAgent: null,
      selectedDestAgent: null,
      selectedSellingAgent: null,
      selectedConsignee: null,
      selectedTransporter: null,
      selectedCustomBroker: null,
      selectedUnassociatedHawb: null,
      copyConsigneeAddrCheckbox: false,
      uploadProgress: 0,
      customsFilterStatus: "Both",
      customsFilterGate: "",
      filingProcessing: false,
      isCgmValid: false,
      dscLogs: [],
      
      // Consol main parameters
      form: {
        execution_job_no: "",
        planned_clearance_date: "",
        cargo_type: "Loose",
        job_owner_id: 1,
        consol_type: "Agent Consolidation",
        
        entities: {
          origin_agent: { id: null, address: "" },
          dest_agent: { id: null, address: "" },
          selling_agent: { id: null, address: "" }
        },
        shipping_details: {
          flight_number: "",
          mawb_number: "",
          carrier_name: "",
          eta_datetime: "",
          etd_datetime: ""
        },
        routing: {
          departure_airport: "",
          destination_airport: "",
          legs: [
            { airport: "", carrier: "", flight_no: "", date: "" }
          ]
        },
        attached_house: [],
        packing: {
          piece_count: 0,
          gross_weight: 0.0,
          chargeable_weight: 0.0,
          volume_cbm: 0.0
        },
        delivery_order: {
          delivery_order_no: "",
          delivery_order_date: "",
          status: "hold",
          do_release_fee: 1500.0,
          warehouse_fee: 2500.0,
          consignee_id: null,
          consignee_address: "",
          transporter_id: null,
          customs_broker_id: null,
          high_sea_buyer: "",
          pickup_address: "ACC Chennai Cargo Warehouse Terminal B Gate 12",
          delivery_address: ""
        },
        charges: [
          { code: "AF", description: "Air Freight Charges", prepaid: 45000.0, collect: 0.0 },
          { code: "MY", description: "Fuel Surcharge", prepaid: 8500.0, collect: 0.0 },
          { code: "SC", description: "Security Surcharge", prepaid: 1200.0, collect: 0.0 },
          { code: "DO", description: "Delivery Order Release Charges", prepaid: 0.0, collect: 1500.0 }
        ],
        financials: {
          payment_status: "Pending",
          invoice_no: "INV-26-8920",
          invoice_amount: 56200.0,
          receipt_no: ""
        },
        customs_filings: [
          {
            id: 301,
            filing_type: "CGM",
            transaction_status: "accepted",
            customs_house_code: "INMAA4",
            flat_file_path: "s3://f16s-manifests/flat_cgm_301.txt",
            submitted_by: "Jomy George",
            submitted_at: "2026-06-15 10:30 AM"
          },
          {
            id: 302,
            filing_type: "SCMTR",
            transaction_status: "rejected",
            customs_house_code: "INMAA4",
            flat_file_path: "s3://f16s-manifests/flat_scm_302.txt",
            submitted_by: "Jomy George",
            submitted_at: "2026-06-15 11:15 AM"
          }
        ],
        e_docket: [
          { file_name: "Commercial_Invoice_Apex.pdf", file_size: 245000, document_type: "commercial_invoice", mime_type: "application/pdf" },
          { file_name: "Packing_List_Apex.pdf", file_size: 184000, document_type: "packing_list", mime_type: "application/pdf" }
        ]
      },

      // Dropdown Options Setup
      cargoTypeOptions: [
        { value: "Loose", text: "Loose" },
        { value: "ULD", text: "ULD" },
        { value: "", text: "(Blank)" }
      ],
      consolTypeOptions: [
        { value: "Agent Consolidation", text: "Agent Consolidation" },
        { value: "Buyer's Consolidation", text: "Buyer's Consolidation" },
        { value: "", text: "(Blank)" }
      ],
      ownerOptions: [
        { value: 1, text: "Jomy George" },
        { value: 2, text: "KSR Operator" },
        { value: 3, text: "Admin" }
      ],
      originAgentOptions: [
        { value: null, text: "-- Select Origin Agent --" },
        { value: 10, text: "Apex Air Logistics (DXB)" },
        { value: 11, text: "Gulf Cargo Agency (DOH)" },
        { value: 12, text: "Zenith Forwarding (LHR)" }
      ],
      destAgentOptions: [
        { value: null, text: "-- Select Destination Agent --" },
        { value: 20, text: "KSR Freight Forwarders (Chennai)" },
        { value: 21, text: "F16s Logistics Pvt Ltd (Mumbai)" }
      ],
      sellingAgentOptions: [
        { value: null, text: "-- Select Selling Agent --" },
        { value: 30, text: "Apex Global Exporters (Dubai)" },
        { value: 31, text: "India Cargo Commission Co" }
      ],
      consigneeListOptions: [
        { value: null, text: "-- Select Consignee --" },
        { value: 50, text: "Logistics Gulf Trading Ltd" },
        { value: 51, text: "Zenith Textiles India Pvt Ltd" },
        { value: 52, text: "Dubai Garment Importers" }
      ],
      transporterOptions: [
        { value: null, text: "-- Select Transporter --" },
        { value: 60, text: "Standard Trucking Chennai Co." },
        { value: 61, text: "FastExpress Seafreight Haulers" }
      ],
      customBrokerOptions: [
        { value: null, text: "-- Select Customs Broker --" },
        { value: 70, text: "KSR Clearing House Agent Ltd" },
        { value: 71, text: "Direct Self Clearance" }
      ],
      doStatusOptions: [
        { value: "hold", text: "Hold" },
        { value: "released", text: "Released" },
        { value: "cargo_collected", text: "Cargo Collected" }
      ],
      paymentStatusOptions: [
        { value: "Pending", text: "Pending" },
        { value: "Cash", text: "Cash" },
        { value: "Cheque", text: "Cheque" },
        { value: "Bank Transfer/NEFT", text: "Bank Transfer/NEFT" },
        { value: "Credit Account", text: "Credit Account" }
      ],
      customsFilterOptions: [
        { value: "Both", text: "Filter: All Statuses" },
        { value: "accepted", text: "Accepted Only" },
        { value: "submitted", text: "Submitted Only" },
        { value: "rejected", text: "Rejected Only" }
      ],
      sendingMethods: [
        { text: "Auto File (ICEGATE Portal)", value: "auto" },
        { text: "Manual Upload", value: "manual" },
        { text: "Direct Email Gateway", value: "email" }
      ],
      documentTypeOptions: [
        { value: "commercial_invoice", text: "Commercial Invoice" },
        { value: "packing_list", text: "Packing List" },
        { value: "certificate_of_origin", text: "Certificate of Origin" },
        { value: "awb_copy", text: "AWB Copy" },
        { value: "hawb_copy", text: "HAWB Copy" },
        { value: "delivery_order", text: "Delivery Order" },
        { value: "arrival_notice", text: "Arrival Notice" },
        { value: "other", text: "Other" }
      ],

      // HAWB Table configuration
      hawbTableFields: [
        { key: "hawb_number", label: "HAWB Number", sortable: true },
        { key: "shipper", label: "Shipper" },
        { key: "consignee", label: "Consignee" },
        { key: "piece_count", label: "Pieces" },
        { key: "gross_weight", label: "Gross Wt" },
        { key: "volume_cbm", label: "Vol CBM" },
        { key: "actions", label: "Action" }
      ],
      customsTableFields: [
        { key: "filing_type", label: "Filing Type" },
        { key: "transaction_status", label: "Transaction Status" },
        { key: "customs_house_code", label: "Custom House" },
        { key: "flat_file_path", label: "Transmitted File" },
        { key: "submitted_by", label: "Filer" },
        { key: "submitted_at", label: "Submission Date" },
        { key: "actions", label: "Action" }
      ],

      // Dimensions Calculator state
      calculatorRows: [
        { pieces: 10, length: 120, width: 80, height: 100, volume_cbm: 0.96, vol_weight: 160.0 },
        { pieces: 5, length: 100, width: 100, height: 120, volume_cbm: 0.6, vol_weight: 100.0 }
      ],

      // Master lookup databases
      agentsDatabase: {
        10: { name: "Apex Air Logistics (DXB)", address: "Suite 405, Air Cargo Terminal\nDubai Int Airport, DXB\nUnited Arab Emirates" },
        11: { name: "Gulf Cargo Agency (DOH)", address: "Gate 15, Warehouse complex\nHamad International Airport\nDoha, Qatar" },
        12: { name: "Zenith Forwarding (LHR)", address: "Aviation House, Terminal 4\nHeathrow Int Airport\nLondon, United Kingdom" },
        20: { name: "KSR Freight Forwarders (Chennai)", address: "No. 42 General Muthaiah St\nACC Terminal Chennai\nChennai, TN 600001, India" },
        21: { name: "F16s Logistics Pvt Ltd (Mumbai)", address: "A-Wing 305, Freight Complex\nSahar Cargo Gate 3, ACC\nMumbai, MH 400099, India" },
        30: { name: "Apex Global Exporters (Dubai)", address: "Jebel Ali Industrial Area 2\nPlot 9048, Warehouses\nDubai, UAE" },
        31: { name: "India Cargo Commission Co", address: "Customs Agent Enclave\nACC Gate 4 Road\nChennai, TN, India" }
      },
      consigneeDatabase: {
        50: { 
          name: "Logistics Gulf Trading Ltd", 
          address: "No. 5 Cargo Ring Road, Jebel Ali Free Zone, Dubai, UAE",
          credit_limit: 500000.00,
          outstanding_balance: 345000.00,
          credit_status: "active",
          default_payment_terms: "Net 30"
        },
        51: { 
          name: "Zenith Textiles India Pvt Ltd", 
          address: "B-24 Industrial Development Area, Guindy, Chennai, India",
          credit_limit: 800000.00,
          outstanding_balance: 895000.00,
          credit_status: "hold",
          default_payment_terms: "COD Only"
        },
        52: { 
          name: "Dubai Garment Importers", 
          address: "Al Maktoum St, Deira Trade Center Suite 12, Dubai, UAE",
          credit_limit: 300000.00,
          outstanding_balance: 300000.00,
          credit_status: "suspended",
          default_payment_terms: "Prepaid Required"
        }
      },
      transporterDatabase: {
        60: { name: "Standard Trucking Chennai Co.", address: "National Highway Bypass 4, Poonamallee, Chennai, India" },
        61: { name: "FastExpress Seafreight Haulers", address: "GNT Road Madhavaram, Container Yard 5, Chennai, India" }
      },
      customBrokerDatabase: {
        70: { name: "KSR Clearing House Agent Ltd", address: "No. 8 Custom Broker Enclave, Air Cargo Gate, Chennai, India" },
        71: { name: "Direct Self Clearance", address: "Inhouse Customs Dept, F16s Operations, India" }
      },

      // Unassociated HAWB pool (dynamic linkages)
      unassociatedPool: [
        { id: 901, hawb_number: "HAWB-DEL-9482", shipper: "Saffron Exotics Ltd", consignee: "Logistics Gulf Trading Ltd", piece_count: 15, gross_weight: 450.0, volume_cbm: 1.2 },
        { id: 902, hawb_number: "HAWB-DXB-3829", shipper: "Jebel Ali Polymers", consignee: "Zenith Textiles India Pvt Ltd", piece_count: 8, gross_weight: 1200.0, volume_cbm: 3.4 },
        { id: 903, hawb_number: "HAWB-LHR-8290", shipper: "Oxford Instruments", consignee: "India Tech Systems Ltd", piece_count: 2, gross_weight: 85.0, volume_cbm: 0.45 }
      ],

      // CGM Modal Filing variables
      cgmFilingForm: {
        datetime: "",
        consol_no: "",
        customs_house: "INMAA4",
        sending_method: "auto"
      }
    };
  },
  computed: {
    // Unassociated HAWB select choices
    unassociatedHawbOptions() {
      const opts = [{ value: null, text: "-- Choose House AWB to Link --", disabled: true }];
      this.unassociatedPool.forEach(item => {
        opts.push({ value: item.id, text: `${item.hawb_number} (${item.shipper} ➔ ${item.consignee}) - ${item.piece_count} Pcs / ${item.gross_weight} KGS` });
      });
      return opts;
    },
    // Charges summations
    totalChargesPrepaid() {
      return this.form.charges.reduce((sum, item) => sum + (Number(item.prepaid) || 0), 0);
    },
    totalChargesCollect() {
      return this.form.charges.reduce((sum, item) => sum + (Number(item.collect) || 0), 0);
    },
    // Selected Consignee Object
    selectedConsigneeObj() {
      if (!this.selectedConsignee) return null;
      return this.consigneeDatabase[this.selectedConsignee] || null;
    },
    // Credit gate checks
    isCreditLimitExceeded() {
      if (!this.selectedConsigneeObj) return false;
      const outstanding = this.selectedConsigneeObj.outstanding_balance || 0;
      const limit = this.selectedConsigneeObj.credit_limit || 0;
      return outstanding > limit || this.selectedConsigneeObj.credit_status === "suspended";
    },
    isDOBlocked() {
      return (
        this.form.financials.payment_status === "Pending" ||
        this.isCreditLimitExceeded ||
        this.form.delivery_order.status === "hold"
      );
    },
    // Dimensions calculator totals
    calcTotalPieces() {
      return this.calculatorRows.reduce((sum, r) => sum + (Number(r.pieces) || 0), 0);
    },
    calcTotalCbm() {
      return this.calculatorRows.reduce((sum, r) => sum + (Number(r.volume_cbm) || 0), 0);
    },
    calcTotalVolWeight() {
      return this.calculatorRows.reduce((sum, r) => sum + (Number(r.vol_weight) || 0), 0);
    },
    // Customs listings filtered
    filteredCustomsFilings() {
      return this.form.customs_filings.filter(f => {
        const matchStatus = this.customsFilterStatus === "Both" || f.transaction_status === this.customsFilterStatus;
        const matchGate = !this.customsFilterGate || f.customs_house_code.toUpperCase().includes(this.customsFilterGate.toUpperCase());
        return matchStatus && matchGate;
      });
    }
  },
  methods: {
    // Date/Time UI formatter
    formatDateTime(dtStr) {
      if (!dtStr) return "TBD";
      return dtStr.replace("T", " ");
    },
    formatWeight(wtVal) {
      if (wtVal === undefined || wtVal === null) return "0.000";
      return Number(wtVal).toFixed(3);
    },
    formatVol(volVal) {
      if (volVal === undefined || volVal === null) return "0.000";
      return Number(volVal).toFixed(3);
    },
    formatCurrency(val) {
      if (val === undefined || val === null) return "₹ 0.00";
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);
    },
    getOwnerName(ownerId) {
      const matched = this.ownerOptions.find(o => o.value === ownerId);
      return matched ? matched.text : "Jomy George";
    },

    // Demo Data Seeding
    loadDemoConsol() {
      this.successMsg = "Demo consolidation payload loaded successfully.";
      this.validationWarning = null;

      this.form.execution_job_no = "JOBA-26-9028";
      this.form.planned_clearance_date = "2026-06-20";
      this.form.cargo_type = "Loose";
      this.form.job_owner_id = 1;
      this.form.consol_type = "Agent Consolidation";

      // Fill Entities
      this.selectedOriginAgent = 10;
      this.form.entities.origin_agent = { id: 10, address: this.agentsDatabase[10].address };
      this.selectedDestAgent = 20;
      this.form.entities.dest_agent = { id: 20, address: this.agentsDatabase[20].address };
      this.selectedSellingAgent = 30;
      this.form.entities.selling_agent = { id: 30, address: this.agentsDatabase[30].address };

      // Shipping Details
      this.form.shipping_details = {
        flight_number: "EK502",
        mawb_number: "020-98304921",
        carrier_name: "Emirates Cargo",
        eta_datetime: "2026-06-19T14:30",
        etd_datetime: "2026-06-19T04:15"
      };

      // Routing
      this.form.routing = {
        departure_airport: "DXB",
        destination_airport: "MAA",
        legs: [
          { airport: "DXB", carrier: "Emirates", flight_no: "EK502", date: "2026-06-19" }
        ]
      };

      // Bundle items
      this.form.attached_house = [
        {
          id: 101,
          hawb_number: "HAWB-MAA-2948A",
          shipper: "Zenith Textiles Ltd",
          consignee: "Logistics Gulf Trading Ltd",
          piece_count: 15,
          gross_weight: 1560.0,
          volume_cbm: 4.8
        },
        {
          id: 102,
          hawb_number: "HAWB-MAA-2948B",
          shipper: "Apex Leather Exports",
          consignee: "Logistics Gulf Trading Ltd",
          piece_count: 10,
          gross_weight: 850.0,
          volume_cbm: 2.5
        }
      ];

      // Reset Dimensions Calculator to synchronize with mock
      this.calculatorRows = [
        { pieces: 15, length: 120, width: 80, height: 100, volume_cbm: 1.44, vol_weight: 240.0 },
        { pieces: 10, length: 100, width: 100, height: 120, volume_cbm: 1.2, vol_weight: 200.0 }
      ];

      // Packing Details aggregates
      this.form.packing = {
        piece_count: 25,
        gross_weight: 2410.0,
        volume_cbm: 7.3,
        chargeable_weight: 2410.0
      };

      // Delivery Order
      this.selectedConsignee = 50;
      this.form.delivery_order.consignee_id = 50;
      this.form.delivery_order.consignee_address = this.consigneeDatabase[50].address;
      this.selectedTransporter = 60;
      this.form.delivery_order.transporter_id = 60;
      this.selectedCustomBroker = 70;
      this.form.delivery_order.customs_broker_id = 70;
      this.form.delivery_order.delivery_address = this.consigneeDatabase[50].address;
      this.copyConsigneeAddrCheckbox = true;
      
      this.form.delivery_order.delivery_order_no = "DO-AIMP-90280";
      this.form.delivery_order.delivery_order_date = "2026-06-16";
      this.form.delivery_order.status = "released";
      
      // Financials
      this.form.financials.payment_status = "Credit Account";
      this.form.financials.invoice_no = "INV-26-9028";
      this.form.financials.invoice_amount = 54700.0;
      this.form.financials.receipt_no = "REC-26-4820";

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    resetForm() {
      this.successMsg = null;
      this.validationWarning = null;
      this.selectedOriginAgent = null;
      this.selectedDestAgent = null;
      this.selectedSellingAgent = null;
      this.selectedConsignee = null;
      this.selectedTransporter = null;
      this.selectedCustomBroker = null;
      this.selectedUnassociatedHawb = null;
      this.copyConsigneeAddrCheckbox = false;

      this.form = {
        execution_job_no: "",
        planned_clearance_date: "",
        cargo_type: "Loose",
        job_owner_id: 1,
        consol_type: "Agent Consolidation",
        entities: {
          origin_agent: { id: null, address: "" },
          dest_agent: { id: null, address: "" },
          selling_agent: { id: null, address: "" }
        },
        shipping_details: { flight_number: "", mawb_number: "", carrier_name: "", eta_datetime: "", etd_datetime: "" },
        routing: { departure_airport: "", destination_airport: "", legs: [{ airport: "", carrier: "", flight_no: "", date: "" }] },
        attached_house: [],
        packing: { piece_count: 0, gross_weight: 0.0, chargeable_weight: 0.0, volume_cbm: 0.0 },
        delivery_order: {
          delivery_order_no: "",
          delivery_order_date: "",
          status: "hold",
          do_release_fee: 1500.0,
          warehouse_fee: 2500.0,
          consignee_id: null,
          consignee_address: "",
          transporter_id: null,
          customs_broker_id: null,
          high_sea_buyer: "",
          pickup_address: "ACC Chennai Cargo Warehouse Terminal B Gate 12",
          delivery_address: ""
        },
        charges: [
          { code: "AF", description: "Air Freight Charges", prepaid: 0.0, collect: 0.0 }
        ],
        financials: { payment_status: "Pending", invoice_no: "", invoice_amount: 0.0, receipt_no: "" },
        customs_filings: [],
        e_docket: []
      };

      this.calculatorRows = [];
    },

    // Agent lookup selection updates
    onOriginAgentSelect() {
      if (this.selectedOriginAgent) {
        this.form.entities.origin_agent = {
          id: this.selectedOriginAgent,
          address: this.agentsDatabase[this.selectedOriginAgent].address
        };
      }
    },
    onDestAgentSelect() {
      if (this.selectedDestAgent) {
        this.form.entities.dest_agent = {
          id: this.selectedDestAgent,
          address: this.agentsDatabase[this.selectedDestAgent].address
        };
      }
    },
    onSellingAgentSelect() {
      if (this.selectedSellingAgent) {
        this.form.entities.selling_agent = {
          id: this.selectedSellingAgent,
          address: this.agentsDatabase[this.selectedSellingAgent].address
        };
      }
    },

    // Validation tools
    hasAddressLineOverrun(addressText) {
      if (!addressText) return false;
      const lines = addressText.split("\n");
      return lines.some(line => line.length > 35);
    },
    validateIataCode(airportCode) {
      if (!airportCode) return true;
      return /^[A-Z]{3}$/.test(airportCode);
    },
    validateMawbFormat(mawbNo) {
      if (!mawbNo) return true;
      return /^\d{3}-\d{8}$/.test(mawbNo);
    },

    // Routing Leg list management
    addRoutingLeg() {
      this.form.routing.legs.push({ airport: "", carrier: "", flight_no: "", date: "" });
    },
    removeRoutingLeg(idx) {
      this.form.routing.legs.splice(idx, 1);
    },

    // HAWB linking methods
    linkHawb() {
      if (!this.selectedUnassociatedHawb) return;
      const matchedIdx = this.unassociatedPool.findIndex(item => item.id === this.selectedUnassociatedHawb);
      if (matchedIdx !== -1) {
        const item = this.unassociatedPool[matchedIdx];
        this.form.attached_house.push({
          id: item.id,
          hawb_number: item.hawb_number,
          shipper: item.shipper,
          consignee: item.consignee,
          piece_count: item.piece_count,
          gross_weight: item.gross_weight,
          volume_cbm: item.volume_cbm
        });

        // Sum aggregates
        this.form.packing.piece_count += item.piece_count;
        this.form.packing.gross_weight += item.gross_weight;
        this.form.packing.volume_cbm += item.volume_cbm;
        
        // Dynamic Chargeable Weight calc
        const volWt = (item.volume_cbm * 1000000) / 6000;
        this.form.packing.chargeable_weight += Math.max(item.gross_weight, volWt);

        // Remove from pending lookup pool
        this.unassociatedPool.splice(matchedIdx, 1);
        this.selectedUnassociatedHawb = null;
        
        this.linkHawbSuccess = true;
        setTimeout(() => { this.linkHawbSuccess = false; }, 3000);
      }
    },
    unlinkHawb(itemId) {
      const matchedIdx = this.form.attached_house.findIndex(h => h.id === itemId);
      if (matchedIdx !== -1) {
        const item = this.form.attached_house[matchedIdx];
        
        // Deduct aggregates
        this.form.packing.piece_count -= item.piece_count;
        this.form.packing.gross_weight -= item.gross_weight;
        this.form.packing.volume_cbm -= item.volume_cbm;
        
        const volWt = (item.volume_cbm * 1000000) / 6000;
        this.form.packing.chargeable_weight -= Math.max(item.gross_weight, volWt);
        if (this.form.packing.chargeable_weight < 0) this.form.packing.chargeable_weight = 0;

        // Push back to unassociated pool
        this.unassociatedPool.push({
          id: item.id,
          hawb_number: item.hawb_number,
          shipper: item.shipper,
          consignee: item.consignee,
          piece_count: item.piece_count,
          gross_weight: item.gross_weight,
          volume_cbm: item.volume_cbm
        });

        this.form.attached_house.splice(matchedIdx, 1);
      }
    },

    // Packing Dimensions calculator calculations
    addDimensionRow() {
      this.calculatorRows.push({ pieces: 1, length: 50, width: 50, height: 50, volume_cbm: 0.125, vol_weight: 20.83 });
    },
    removeDimensionRow(idx) {
      this.calculatorRows.splice(idx, 1);
    },
    recalcVolumeRow(idx) {
      const row = this.calculatorRows[idx];
      const pcs = Number(row.pieces) || 0;
      const l = Number(row.length) || 0;
      const w = Number(row.width) || 0;
      const h = Number(row.height) || 0;

      // Vol in CBM = L * W * H * Pcs / 1,000,000
      row.volume_cbm = (pcs * l * w * h) / 1000000;
      // Vol Weight = CBM * 166.67 (which is Vol / 6000 inside cubic centimeters)
      row.vol_weight = row.volume_cbm * 166.67;
    },
    applyCalculatorToPacking() {
      this.form.packing.piece_count = this.calcTotalPieces;
      this.form.packing.volume_cbm = this.calcTotalCbm;
      // Recalc Chargeable Weight
      this.form.packing.chargeable_weight = Math.max(this.form.packing.gross_weight, this.calcTotalVolWeight);
      
      this.successMsg = "Calculated volumetric packing dimensions applied to Consol totals.";
      setTimeout(() => { this.successMsg = null; }, 3000);
    },

    // DO Release party lookup selection handlers
    onConsigneeSelect() {
      if (this.selectedConsignee) {
        const c = this.consigneeDatabase[this.selectedConsignee];
        this.form.delivery_order.consignee_id = this.selectedConsignee;
        this.form.delivery_order.consignee_address = c.address;
        if (this.copyConsigneeAddrCheckbox) {
          this.form.delivery_order.delivery_address = c.address;
        }
      }
    },
    onTransporterSelect() {
      if (this.selectedTransporter) {
        this.form.delivery_order.transporter_id = this.selectedTransporter;
      }
    },
    onCustomBrokerSelect() {
      if (this.selectedCustomBroker) {
        this.form.delivery_order.customs_broker_id = this.selectedCustomBroker;
      }
    },
    toggleAddressCopy() {
      if (this.copyConsigneeAddrCheckbox && this.selectedConsignee) {
        this.form.delivery_order.delivery_address = this.consigneeDatabase[this.selectedConsignee].address;
      }
    },

    // DO Printing triggers (Gatekeeped)
    printDO() {
      if (this.isDOBlocked) return;
      alert(`Printing Delivery Order PDF. Reference: ${this.form.delivery_order.delivery_order_no || 'Pending'}`);
    },
    printReceipt() {
      if (this.isDOBlocked) return;
      alert(`Printing Payment Receipt PDF. Reference: ${this.form.financials.receipt_no || 'Pending'}`);
    },

    // Charges handlers
    addChargeItem() {
      this.form.charges.push({ code: "", description: "", prepaid: 0.0, collect: 0.0 });
    },
    removeChargeItem(idx) {
      this.form.charges.splice(idx, 1);
    },

    // Customs CGM filing modal actions
    openCgmModal() {
      this.cgmFilingForm.consol_no = this.form.execution_job_no || "JOBA-26-DRAFT";
      this.cgmFilingForm.datetime = new Date().toISOString().substring(0, 16);
      this.dscLogs = [];
      this.isCgmValid = false;
      this.$bvModal.show("cgm-filing-modal");
    },
    closeCgmModal() {
      this.$bvModal.hide("cgm-filing-modal");
    },
    openSignatureUtility() {
      alert("Initializing Logi-Sys background digital signature setup (DSC driver download package).");
    },
    submitCgmData() {
      this.filingProcessing = true;
      this.dscLogs = [];

      // Validation
      const errorLines = [];
      if (!this.form.execution_job_no) {
        errorLines.push("[VALIDATION ERROR] Missing Consol job execution number.");
      }
      if (!this.form.shipping_details.mawb_number) {
        errorLines.push("[VALIDATION ERROR] Master Air Waybill (MAWB) number is required.");
      } else if (!this.validateMawbFormat(this.form.shipping_details.mawb_number)) {
        errorLines.push("[VALIDATION ERROR] MAWB number is invalid.");
      }
      if (this.form.attached_house.length === 0) {
        errorLines.push("[VALIDATION ERROR] Consolidation must contain at least one linked HAWB.");
      }

      setTimeout(() => {
        this.filingProcessing = false;
        if (errorLines.length > 0) {
          this.dscLogs.push({ type: "error", text: "Manifest validation checks failed:" });
          errorLines.forEach(err => {
            this.dscLogs.push({ type: "error", text: `  ${err}` });
          });
          this.isCgmValid = false;
        } else {
          this.dscLogs.push({ type: "info", text: `[VALIDATION OK] Validating manifest records for Consol: ${this.cgmFilingForm.consol_no}` });
          this.dscLogs.push({ type: "info", text: `[SYSTEM] Package pieces matching confirmed: ${this.form.packing.piece_count} PCS` });
          this.dscLogs.push({ type: "info", text: `[SYSTEM] Manifest XML formatted. Target port: ${this.cgmFilingForm.customs_house.toUpperCase()}` });
          this.dscLogs.push({ type: "success", text: "[SUCCESS] XML manifest structure built. Ready for Digital Signature Token encryption." });
          this.isCgmValid = true;
        }
      }, 1000);
    },
    sendForSignature() {
      if (!this.isCgmValid) return;
      this.filingProcessing = true;

      // Queue logs with delays
      const steps = [
        { text: "[DSC] Connecting USB Digital Signature Certificate (DSC)...", type: "info", delay: 800 },
        { text: "[DSC] Found Active Profile: 'JOMY GEORGE (e-Mudhra Class 3 Signer)'", type: "info", delay: 1500 },
        { text: "[DSC] Running PIN authorization challenge... Accepted.", type: "success", delay: 2200 },
        { text: "[DSC] Encrypting cargo manifest flat-file structure...", type: "info", delay: 3000 },
        { text: "[ICEGATE] Signed file successfully transmitted via HTTPS gateway.", type: "success", delay: 4000 },
        { text: "[ICEGATE] Response code: 200. IGM Reference Received: SCMTR-AIMP-9028", type: "success", delay: 4800 }
      ];

      steps.forEach(step => {
        setTimeout(() => {
          this.dscLogs.push({ type: step.type, text: step.text });
          
          // Final step updates list
          if (step.text.includes("IGM Reference")) {
            this.filingProcessing = false;
            
            // Add filing to list
            const newFiling = {
              id: 300 + Math.floor(Math.random() * 900),
              filing_type: "CGM",
              transaction_status: "accepted",
              customs_house_code: this.cgmFilingForm.customs_house.toUpperCase(),
              flat_file_path: `s3://f16s-manifests/flat_cgm_signed_${Math.floor(100 + Math.random()*900)}.txt`,
              submitted_by: "Jomy George",
              submitted_at: new Date().toISOString().replace("T", " ").substring(0, 16)
            };
            this.form.customs_filings.push(newFiling);

            this.successMsg = `IGM/CGM customs filing accepted by ICEGATE for Consol: ${this.cgmFilingForm.consol_no}. Reference recorded.`;
            setTimeout(() => { this.successMsg = null; }, 5000);
          }
        }, step.delay);
      });
    },
    getBadgeClassForCustoms(status) {
      if (status === "accepted") return "badge-light-success";
      if (status === "submitted") return "badge-light-warning";
      if (status === "rejected") return "badge-light-danger";
      return "badge-light-secondary";
    },
    getDscLogClass(type) {
      if (type === "error") return "text-danger";
      if (type === "success") return "text-success";
      return "text-info";
    },
    getBadgeClassForCredit(status) {
      if (status === "active") return "badge-light-success";
      if (status === "hold") return "badge-light-warning";
      if (status === "suspended") return "badge-light-danger";
      return "badge-light-secondary";
    },
    viewFilingLog(filing) {
      alert(`ICEGATE Log Output (ID ${filing.id}):\nFiling Status: ${filing.transaction_status.toUpperCase()}\nCustoms Port: ${filing.customs_house_code}\nFile: ${filing.flat_file_path}\nSubmitted: ${filing.submitted_at}`);
    },

    // E-Docket dropzone select methods
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(e) {
      const files = Array.from(e.target.files);
      this.uploadFiles(files);
    },
    handleFileDrop(e) {
      const files = Array.from(e.dataTransfer.files);
      this.uploadFiles(files);
    },
    uploadFiles(files) {
      if (files.length === 0) return;
      
      this.uploadProgress = 10;
      const interval = setInterval(() => {
        this.uploadProgress += 15;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.uploadProgress = 0;

          // Push uploaded
          files.forEach(f => {
            this.form.e_docket.push({
              file_name: f.name,
              file_size: f.size,
              document_type: "other",
              mime_type: f.type || "application/pdf"
            });
          });

          this.successMsg = `${files.length} document(s) uploaded to Consol E-Docket archive.`;
          setTimeout(() => { this.successMsg = null; }, 3000);
        }
      }, 200);
    },
    deleteDocketFile(idx) {
      this.form.e_docket.splice(idx, 1);
    },
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },

    // Global save handler
    saveConsol() {
      this.formLoading = true;
      this.validationWarning = null;
      this.successMsg = null;

      // Validation
      let isValid = true;
      const warnMsg = [];

      if (!this.form.execution_job_no) {
        isValid = false;
        warnMsg.push("Consol execution job number is required.");
      }
      if (this.hasAddressLineOverrun(this.form.entities.origin_agent.address) || 
          this.hasAddressLineOverrun(this.form.entities.dest_agent.address) || 
          this.hasAddressLineOverrun(this.form.entities.selling_agent.address)) {
        warnMsg.push("One or more address fields exceed Cargo-XML line limits (35 characters).");
      }
      if (!this.validateMawbFormat(this.form.shipping_details.mawb_number)) {
        warnMsg.push("MAWB Number does not match standard IATA format.");
      }
      if (!this.validateIataCode(this.form.routing.departure_airport) || 
          !this.validateIataCode(this.form.routing.destination_airport)) {
        warnMsg.push("Departure and Destination airport codes must be exactly 3 uppercase letters.");
      }

      setTimeout(() => {
        this.formLoading = false;
        if (!isValid || warnMsg.length > 0) {
          this.validationWarning = "Validation warnings detected: " + warnMsg.join(" ");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.successMsg = `Consol job folder ${this.form.execution_job_no} saved successfully in local cache.`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => { this.successMsg = null; }, 5000);
        }
      }, 1000);
    },

    // OCR Extraction: Map AI-extracted fields into the import form
    processImportExtractedData(response) {
      console.log('Import form: Processing extracted data payload:', response);

      // Helper for unstructured fields with {value, confidence} shape
      const getVal = (fieldKey) => {
        const field = response[fieldKey];
        if (field && typeof field === 'object' && field.value !== null && field.value !== undefined) {
          return String(field.value);
        }
        if (typeof field === 'string') return field;
        return '';
      };

      // Map shipper/consignee into entity address blocks
      const shipperParts = [getVal('shipper_name'), getVal('shipper_address'), getVal('shipper_city'), getVal('shipper_state'), getVal('shipper_post_code'), getVal('shipper_country')].filter(Boolean);
      if (shipperParts.length > 0) {
        this.form.entities.origin_agent.address = shipperParts.join('\n');
      }

      const consigneeParts = [getVal('consignee_name'), getVal('consignee_address'), getVal('consignee_city'), getVal('consignee_state'), getVal('consignee_post_code'), getVal('consignee_country')].filter(Boolean);
      if (consigneeParts.length > 0) {
        this.form.entities.dest_agent.address = consigneeParts.join('\n');
      }

      // Map packing / cargo details
      const totalPackages = getVal('total_packages');
      if (totalPackages) {
        this.form.packing.piece_count = parseInt(totalPackages) || this.form.packing.piece_count;
      }

      const grossWeight = getVal('total_gross_weight');
      if (grossWeight) {
        this.form.packing.gross_weight = parseFloat(grossWeight) || this.form.packing.gross_weight;
      }

      const totalVolume = getVal('total_volume');
      if (totalVolume) {
        this.form.packing.volume_cbm = parseFloat(totalVolume) || this.form.packing.volume_cbm;
      }

      const chargeableWeight = getVal('chargeable_weight');
      if (chargeableWeight) {
        this.form.packing.chargeable_weight = parseFloat(chargeableWeight) || this.form.packing.chargeable_weight;
      }

      // Map dimensions if available
      const dimensions = getVal('dimensions');
      if (dimensions && this.calculatorRows) {
        // Try to parse dimension string like "120x80x100 cm"
        const dimMatch = dimensions.match(/(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)/);
        if (dimMatch) {
          this.calculatorRows.push({
            pieces: parseInt(totalPackages) || 1,
            length: parseFloat(dimMatch[1]),
            width: parseFloat(dimMatch[2]),
            height: parseFloat(dimMatch[3]),
            volume_cbm: 0,
            vol_weight: 0
          });
          this.recalcVolumeRow(this.calculatorRows.length - 1);
        }
      }

      // Map financial info if available
      const invoiceNo = getVal('invoice_no');
      if (invoiceNo) {
        this.form.financials.invoice_no = invoiceNo;
      }

      const grandTotal = getVal('grand_total');
      if (grandTotal) {
        this.form.financials.invoice_amount = parseFloat(grandTotal) || this.form.financials.invoice_amount;
      }

      this.successMsg = 'Document data extracted successfully. Please verify all fields.';
      setTimeout(() => { this.successMsg = null; }, 5000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.body-color {
  padding-top: 35px;
  padding-bottom: 35px;
  min-height: 80vh;
}

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.h-color {
  color: #355594;
  font-family: 'Inter', sans-serif;
  font-weight: 800 !important;
  font-size: 18px !important;
  letter-spacing: -0.2px;
}

.show-btn {
  background: white !important;
  color: #355594 !important;
  border: 1px solid #E6F0FF !important;
  border-radius: 50px !important;
  padding: 10px 22px !important;
  font-weight: 600 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
}

.show-btn:hover {
  background: #f0f7ff !important;
  border-color: #355594 !important;
  color: #355594 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 12px rgba(53, 85, 148, 0.1) !important;
}

.premium-glass-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(53, 85, 148, 0.03);
}

.entity-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
}

.premium-input, .premium-select, .premium-textarea {
  border: 1px solid #E2E8F0 !important;
  border-radius: 10px !important;
  height: 38px;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  color: #1E293B !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  background-color: #FFFFFF !important;
}

.premium-textarea {
  height: auto !important;
}

.premium-input:focus, .premium-select:focus, .premium-textarea:focus {
  border-color: #355594 !important;
  box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.12) !important;
  outline: none !important;
  background-color: #FFFFFF !important;
}

.premium-input-sm {
  border: 1px solid #E2E8F0 !important;
  border-radius: 8px !important;
  height: 32px !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  color: #1E293B !important;
  background-color: #FFFFFF !important;
  font-size: 0.85rem !important;
}

.premium-input-sm:focus {
  border-color: #355594 !important;
  box-shadow: 0 0 0 2px rgba(53, 85, 148, 0.1) !important;
  outline: none !important;
}

.premium-select-sm {
  border: 1px solid #E2E8F0 !important;
  border-radius: 8px !important;
  height: 32px !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  color: #1E293B !important;
  background-color: #FFFFFF !important;
  font-size: 0.85rem !important;
  padding: 2px 8px !important;
}

.premium-select-sm:focus {
  border-color: #355594 !important;
  box-shadow: 0 0 0 2px rgba(53, 85, 148, 0.1) !important;
  outline: none !important;
}

.border-warning-premium {
  border-color: #f59e0b !important;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2) !important;
}

.text-warning-premium {
  color: #f59e0b;
}

.mbl-summary-banner {
  background: #F0F7FF;
  border: 1px solid #E6F0FF;
  border-radius: 16px;
}

.border-right-premium {
  border-right: 1px solid rgba(53, 85, 148, 0.12);
}

.banner-label {
  display: block;
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.banner-value {
  font-size: 1.15rem;
  color: #355594;
}

.premium-table >>> th {
  background-color: #F8FAFC !important;
  color: #355594 !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  padding: 12px 6px !important;
  border-bottom: 1px solid rgba(53, 85, 148, 0.1) !important;
  border-top: none !important;
}

.premium-table >>> td {
  padding: 8px 6px !important;
  vertical-align: middle !important;
  border-bottom: 1px solid #F1F5F9 !important;
  border-top: none !important;
  color: #475569 !important;
  font-size: 14px !important;
}

.btn-indigo {
  background: linear-gradient(135deg, #355594 0%, #2a4476 100%);
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(53, 85, 148, 0.25);
}

.btn-indigo:hover {
  background: linear-gradient(135deg, #2a4476 0%, #1e3054 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(53, 85, 148, 0.35);
}

.btn-outline-indigo {
  color: #355594;
  border-color: #355594;
  background: transparent;
}

.btn-outline-indigo:hover {
  background: #355594;
  color: #ffffff;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 8px;
}

.dim-header th {
  background-color: #F8FAFC !important;
  color: #355594 !important;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 8px !important;
  border-bottom: 1px solid rgba(53, 85, 148, 0.1) !important;
}

.dim-row td {
  padding: 8px !important;
  border-bottom: 1px solid #F1F5F9 !important;
  color: #475569 !important;
}

.routing-leg-row {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
}

.credit-card {
  background: #F8FAFC;
  border-radius: 16px;
}

.credit-card-ok {
  border: 1px solid rgba(16, 185, 129, 0.25);
  background: rgba(16, 185, 129, 0.02);
}

.credit-card-alert {
  border: 1px solid rgba(239, 68, 68, 0.25);
  background: rgba(239, 68, 68, 0.03);
}

.dsc-terminal {
  background: #090a15;
  height: 200px;
  overflow-y: auto;
  font-size: 0.85rem;
  line-height: 1.5;
}

.dsc-log-line {
  margin-bottom: 4px;
}

.dropzone-box {
  background: #F8FAFC;
  border: 2px dashed #E2E8F0 !important;
  transition: all 0.2s ease;
}

.dropzone-box:hover {
  border-color: #355594 !important;
  background: rgba(53, 85, 148, 0.05);
}

.docket-file-row {
  background: #F8FAFC;
  border: 1px solid #E2E8F0 !important;
}

.badge-indigo {
  background-color: #355594;
  color: #ffffff;
}

.badge-light-indigo {
  background-color: rgba(53, 85, 148, 0.1);
  color: #355594;
}

.custom-nav-tabs >>> .nav-tabs {
  border-bottom: 0px !important;
  display: flex !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  -webkit-overflow-scrolling: touch !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  gap: 4px;
  background: #F1F5F9 !important;
  padding: 6px !important;
  border-radius: 14px !important;
  margin-bottom: 1.5rem !important;
  width: 100% !important;
}

.custom-nav-tabs >>> .nav-tabs::-webkit-scrollbar {
  display: none !important;
}

.custom-nav-tabs >>> .nav-item {
  flex: 0 0 auto !important;
}

.custom-nav-tabs >>> .nav-link {
  color: #64748B !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  border: none !important;
  padding: 8px 16px !important;
  margin: 0px !important;
  border-radius: 10px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  white-space: nowrap !important;
  background: transparent !important;
}

.custom-nav-tabs >>> .nav-link:hover:not(.active) {
  color: #355594 !important;
  background: rgba(53, 85, 148, 0.05) !important;
}

.custom-nav-tabs >>> .nav-link.active {
  color: #355594 !important;
  background: #FFFFFF !important;
  box-shadow: 0 4px 12px rgba(53, 85, 148, 0.08) !important;
  border-bottom: none !important;
}

.animate-fade-in {
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
</style>
