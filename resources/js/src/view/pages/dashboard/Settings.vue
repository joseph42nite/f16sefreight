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
                <div class="container py-8 px-6 px-sm-8 px-md-10">
                    <div class="d-flex flex-column">
                        <span style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 700; color: #355594; opacity: 0.6; margin-bottom: 0.5rem; display: block;">Setup</span>
                        <h6 style="color:#355594;font-size:26px !important;line-height:34px !important;font-weight:800 !important;letter-spacing:-0.5px !important;margin-bottom:0px;font-family:'Inter', sans-serif !important;">Mailbox Settings</h6>
                    </div>
                </div>

                <hr style="border: 0; border-top: 1px solid rgba(53, 85, 148, 0.12);" />

                <!-- Body / Teaser -->
                <div class="container py-8 px-6 px-sm-8 px-md-10">
                    <!-- Core tier Upgrade teaser -->
                    <div v-if="isViperCore" class="teaser-container mx-auto py-10 px-8 text-center rounded-lg shadow-lg">
                        <div class="icon-circle mb-6 mx-auto">
                            <b-icon icon="gear-wide-connected" font-scale="3" class="lock-icon"></b-icon>
                        </div>
                        <h3 class="teaser-title mb-4">Upgrade to Connect Mailboxes</h3>
                        <p class="teaser-description mb-6 mx-auto">
                            Link your Gmail or Outlook corporate accounts to unlock unified synchronization, AI exclusions, automatic job creation, and quick replies.
                        </p>
                        <b-button class="upgrade-btn px-8 py-3" variant="primary">
                            Upgrade to Viper Tactical / Command
                        </b-button>
                    </div>

                    <!-- Tactical & Command view -->
                    <div v-else class="settings-workspace mx-2 mx-sm-4">
                        <b-row>
                            <!-- Connect Form -->
                            <b-col lg="5" class="mb-6 mb-lg-0">
                                <div class="settings-card p-6 rounded-lg">
                                    <h4 class="settings-card-title mb-4">Connect New Mailbox</h4>
                                    <b-form @submit.prevent="connectMailbox">
                                        <b-form-group label="Email Address:" label-for="email" label-class="font-weight-bold text-muted">
                                            <b-form-input
                                                id="email"
                                                v-model="form.email_address"
                                                type="email"
                                                placeholder="e.g. ops@company.com"
                                                required
                                                class="form-control-custom"
                                            ></b-form-input>
                                        </b-form-group>

                                        <b-form-group label="Email Provider:" label-for="provider" label-class="font-weight-bold text-muted">
                                            <b-form-select
                                                id="provider"
                                                v-model="form.provider"
                                                :options="providerOptions"
                                                required
                                                class="form-control-custom"
                                            ></b-form-select>
                                        </b-form-group>

                                        <b-button type="submit" class="save-btn w-100 py-3 mt-2" :disabled="isSubmitting">
                                            <b-spinner v-if="isSubmitting" small class="mr-2"></b-spinner>
                                            Connect Account
                                        </b-button>
                                    </b-form>
                                </div>
                            </b-col>

                            <!-- Connected Mailboxes List -->
                            <b-col lg="7">
                                <div class="settings-card p-6 rounded-lg">
                                    <h4 class="settings-card-title mb-4">Active Connections</h4>
                                    <b-spinner v-if="isLoading" class="d-block mx-auto my-8 text-primary"></b-spinner>
                                    <div v-else-if="connections.length === 0" class="text-center py-8 text-muted">
                                        <b-icon icon="inboxes" font-scale="2" class="mb-3"></b-icon>
                                        <p class="mb-0">No mailboxes connected yet.</p>
                                    </div>
                                    <div v-else class="connections-list">
                                        <div 
                                            v-for="conn in connections" 
                                            :key="conn.id" 
                                            class="connection-item d-flex align-items-center justify-content-between p-4 mb-3 rounded-lg"
                                        >
                                            <div class="d-flex align-items-center">
                                                <div class="provider-badge mr-3" :class="conn.provider">
                                                    <b-icon :icon="conn.provider === 'gmail' ? 'google' : 'envelope-fill'"></b-icon>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 font-weight-bold text-dark">{{ conn.email_address }}</h6>
                                                    <span class="badge badge-success px-2 py-1" style="font-size: 0.75rem;">Active & Synced</span>
                                                </div>
                                            </div>
                                            <b-button size="sm" variant="outline-danger" @click="disconnectMailbox(conn.id)" class="disconnect-btn">
                                                Disconnect
                                            </b-button>
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </div>
        </div>
    </b-container>
</template>

<script>
import SideBar from "@/view/layouts/public/SideBar.vue";
import ApiService from "@/core/services/api.service";

export default {
    name: "Settings",
    components: {
        SideBar
    },
    data() {
        return {
            form: {
                email_address: "",
                provider: "gmail"
            },
            providerOptions: [
                { value: "gmail", text: "Google Gmail Workspace" },
                { value: "outlook", text: "Microsoft Outlook / Office 365" }
            ],
            connections: [],
            isLoading: false,
            isSubmitting: false
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        isViperCore() {
            const tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
            return !tier || tier === 'viper_core';
        }
    },
    mounted() {
        if (!this.isViperCore) {
            this.fetchConnections();
        }
    },
    methods: {
        fetchConnections() {
            this.isLoading = true;
            ApiService.get("/user/mailbox-connections")
                .then(response => {
                    this.connections = response.data;
                })
                .catch(error => {
                    console.error("Failed to load connections:", error);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        connectMailbox() {
            this.isSubmitting = true;
            
            // Generate dummy credentials for OAuth sync callback
            const payload = {
                email_address: this.form.email_address,
                provider: this.form.provider,
                access_token: "mock_access_token_" + Math.random().toString(36).substring(7),
                refresh_token: "mock_refresh_token_" + Math.random().toString(36).substring(7),
                expires_in: 3600
            };

            ApiService.post("/user/mailbox-connections/connect", payload)
                .then(response => {
                    this.$bvToast.toast(response.data.message || "Mailbox connected successfully.", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    this.form.email_address = "";
                    this.fetchConnections();
                })
                .catch(error => {
                    const errorMsg = error.response && error.response.data && error.response.data.error
                        ? error.response.data.error
                        : "Failed to connect mailbox.";
                    this.$bvToast.toast(errorMsg, {
                        title: "Connection Error",
                        variant: "danger",
                        solid: true
                    });
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        },
        disconnectMailbox(id) {
            if (confirm("Are you sure you want to disconnect this mailbox connection?")) {
                ApiService.delete(`/user/mailbox-connections/${id}`)
                    .then(response => {
                        this.$bvToast.toast("Mailbox successfully disconnected.", {
                            title: "Success",
                            variant: "success",
                            solid: true
                        });
                        this.fetchConnections();
                    })
                    .catch(error => {
                        this.$bvToast.toast("Failed to disconnect mailbox.", {
                            title: "Error",
                            variant: "danger",
                            solid: true
                        });
                    });
            }
        }
    }
};
</script>

<style scoped>
.body-color {
    min-height: 80vh;
    padding-bottom: 2rem;
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

.settings-card {
    background: #f8fafc;
    border: 1px solid rgba(53, 85, 148, 0.1);
    box-shadow: 0 4px 12px rgba(53, 85, 148, 0.03);
}

.settings-card-title {
    color: #355594;
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
}

.form-control-custom {
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    height: 44px !important;
    font-size: 14px !important;
    color: #355594 !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;
}

.form-control-custom:focus {
    border-color: #355594 !important;
    box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.1) !important;
}

.save-btn {
    background: linear-gradient(135deg, #355594 0%, #1e3a8a 100%) !important;
    border: none !important;
    border-radius: 10px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(53, 85, 148, 0.15);
    transition: all 0.2s ease;
}

.save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(53, 85, 148, 0.25);
}

.connection-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.connection-item:hover {
    border-color: rgba(53, 85, 148, 0.2);
    box-shadow: 0 4px 12px rgba(53, 85, 148, 0.05);
}

.provider-badge {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
}

.provider-badge.gmail {
    background: #ea4335;
}

.provider-badge.outlook {
    background: #0078d4;
}

.disconnect-btn {
    border-radius: 8px;
    font-weight: 600;
}
</style>
