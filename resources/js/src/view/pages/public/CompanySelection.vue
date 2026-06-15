<template>
  <div class="company-selection-page d-flex align-items-center justify-content-center">
    <div class="glow-container">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
    </div>

    <b-container class="selection-card-container">
      <b-row class="justify-content-center">
        <b-col md="8" lg="6">
          <div class="premium-glass-card p-6 p-md-8 text-center animate-fade-in">
            <div class="brand-logo mb-6">
              <img src="/media/assets/logos/white-logo.png" alt="F16s Logo" class="logo-image" />
            </div>

            <h2 class="welcome-title mb-2">Select Your Workspace</h2>
            <p class="subtitle mb-6">Configure your active portal scope and company context</p>

            <div v-if="errorMsg" class="error-banner mb-4 animate-shake">
              <b-icon icon="exclamation-circle-fill" class="mr-2"></b-icon>
              {{ errorMsg }}
            </div>

            <b-form @submit.prevent="proceedToLogin">
              <!-- Company Selector -->
              <div class="premium-form-group mb-6 text-left">
                <label class="premium-label">Registered Company</label>
                <div class="select-wrapper">
                  <b-form-select
                    v-model="selectedCompany"
                    :options="companiesOptions"
                    required
                    class="premium-select"
                  ></b-form-select>
                </div>
              </div>

              <!-- Portal Selector Cards -->
              <div class="premium-form-group mb-8 text-left">
                <label class="premium-label">Select Logistics Portal</label>
                <div class="portal-cards-grid">
                  <!-- Focus Air Card -->
                  <div
                    class="portal-card"
                    :class="{ 'active': activePortal === 'air', 'disabled': isSubdomainRestricted && activePortal !== 'air' }"
                    @click="setPortal('air')"
                  >
                    <div class="portal-card-glow"></div>
                    <div class="portal-card-content">
                      <div class="icon-wrapper air-icon">
                        <b-icon icon="cursor-fill" font-scale="1.5" style="transform: rotate(45deg);"></b-icon>
                      </div>
                      <span class="portal-name">Focus Air</span>
                      <span class="portal-desc">Air waybills & flight schedules</span>
                    </div>
                  </div>

                  <!-- Focus Sea Card -->
                  <div
                    class="portal-card"
                    :class="{ 'active': activePortal === 'sea', 'disabled': isSubdomainRestricted && activePortal !== 'sea' }"
                    @click="setPortal('sea')"
                  >
                    <div class="portal-card-glow"></div>
                    <div class="portal-card-content">
                      <div class="icon-wrapper sea-icon">
                        <b-icon icon="compass" font-scale="1.5"></b-icon>
                      </div>
                      <span class="portal-name">Focus Sea</span>
                      <span class="portal-desc">Ocean manifests & container stuffing</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <button type="submit" class="premium-btn btn-lg w-100" :disabled="loading">
                <span v-if="loading"><b-spinner small class="mr-2"></b-spinner>Configuring...</span>
                <span v-else>Proceed to Workspace <b-icon icon="arrow-right" class="ml-2"></b-icon></span>
              </button>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
  name: "CompanySelection",
  data() {
    return {
      companies: [],
      selectedCompany: null,
      activePortal: 'air', // Default to air
      loading: false,
      errorMsg: null
    };
  },
  computed: {
    companiesOptions() {
      const opts = [{ value: null, text: "-- Choose Registered Company --", disabled: true }];
      this.companies.forEach(company => {
        opts.push({ value: company.id, text: company.name });
      });
      return opts;
    },
    isSubdomainRestricted() {
      const hostname = window.location.hostname;
      return hostname.startsWith('focusair.') || hostname.startsWith('focussea.');
    }
  },
  mounted() {
    this.fetchCompanies();
    // Subdomain-based portal scope detection
    const hostname = window.location.hostname;
    if (hostname.startsWith('focusair.')) {
      this.activePortal = 'air';
    } else if (hostname.startsWith('focussea.')) {
      this.activePortal = 'sea';
    } else {
      const savedPortal = sessionStorage.getItem('active_portal_scope');
      if (savedPortal) {
        this.activePortal = savedPortal;
      }
    }
    // Load existing selections from sessionStorage if present
    const savedCompany = sessionStorage.getItem('company_id');
    if (savedCompany) {
      this.selectedCompany = parseInt(savedCompany, 10);
    }
  },
  methods: {
    fetchCompanies() {
      ApiService.get("/companies")
        .then(({ data }) => {
          this.companies = data;
        })
        .catch(err => {
          console.error("Failed to load companies:", err);
          this.errorMsg = "Unable to load tenant companies. Please reload page.";
        });
    },
    setPortal(mode) {
      if (this.isSubdomainRestricted) {
        return;
      }
      this.activePortal = mode;
    },
    proceedToLogin() {
      if (!this.selectedCompany) {
        this.errorMsg = "Please select a registered company first.";
        return;
      }
      this.loading = true;
      this.errorMsg = null;

      // 1. Send context selection to backend to bind in PHP Session
      ApiService.post("/set-session-context", {
        company_id: this.selectedCompany,
        active_portal_scope: this.activePortal
      })
        .then(() => {
          // 2. Set sessionStorage context for frontend persistence
          try {
            sessionStorage.setItem('company_id', this.selectedCompany.toString());
            sessionStorage.setItem('active_portal_scope', this.activePortal);
          } catch (e) {
            console.error("Session storage write failed:", e);
          }

          // 3. Redirect to landing page and auto-trigger login popup
          this.$router.push({ path: "/", query: { trigger_login: "true" } });
        })
        .catch(err => {
          console.error("Session context configuration failed:", err);
          this.errorMsg = "Failed to synchronize session context with server. Try again.";
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

.company-selection-page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0b1120 0%, #151f32 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', 'Inter', sans-serif;
}

/* Premium radial gradient glow rings */
.glow-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.15;
  pointer-events: none;
}
.orb-1 {
  top: -10%;
  left: 20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #3b82f6 0%, rgba(59, 130, 246, 0) 70%);
}
.orb-2 {
  bottom: -10%;
  right: 20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%);
}

.selection-card-container {
  position: relative;
  z-index: 10;
}

.premium-glass-card {
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.logo-image {
  height: 65px;
  filter: drop-shadow(0 4px 10px rgba(59, 130, 246, 0.4));
}

.welcome-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.85rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
}

.premium-label {
  color: #cbd5e1;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  display: block;
}

.select-wrapper {
  position: relative;
}

.premium-select {
  background-color: rgba(15, 23, 42, 0.6) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px !important;
  height: 48px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  box-shadow: none;
}
.premium-select:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25) !important;
}

/* Portal Card Styles */
.portal-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 0.5rem;
}

.portal-card {
  position: relative;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.portal-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(15, 23, 42, 0.7);
}

.portal-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
.portal-card.disabled:hover {
  transform: none;
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.5);
}

.portal-card.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
}

.portal-card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.portal-card.active .portal-card-glow {
  opacity: 1;
}

.portal-card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.air-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.sea-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4);
}

.portal-card.active .icon-wrapper {
  transform: scale(1.08);
}

.portal-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 4px;
}

.portal-desc {
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.3;
}

.portal-card.active .portal-desc {
  color: #94a3b8;
}

/* Premium glowing proceed button */
.premium-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 14px;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  height: 52px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  cursor: pointer;
}
.premium-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.45);
}
.premium-btn:active {
  transform: translateY(0);
}
.premium-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error Banner */
.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Animations */
.animate-fade-in {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
