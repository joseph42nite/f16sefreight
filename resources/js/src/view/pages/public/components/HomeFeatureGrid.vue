<template>
    <section class="features-container mb-25" aria-labelledby="features-heading">
        <div class="features-bg-glow"></div>
        <b-row class="features-section">
            <b-col cols="12" class="text-center mb-16">
                <span class="section-eyebrow">Capabilities</span>
                <h2 id="features-heading" class="section-title">Logistics Automation Features</h2>
                <p class="section-subtitle mt-4">Discover the powerful features that streamline your global freight operations.</p>
            </b-col>
            <b-col lg="3" md="6" sm="12" class="mb-8" v-for="(feature, idx) in features" :key="idx">
                <router-link :to="feature.link && feature.link !== '#' ? feature.link : ''" custom v-slot="{ navigate }">
                    <div class="feature-card-wrapper" @click="feature.link && feature.link !== '#' ? navigate($event) : null" :style="feature.link && feature.link !== '#' ? 'cursor: pointer;' : ''">
                        <div class="feature-card-glow"></div>
                        <b-card class="feature-card h-100">
                            <div class="feature-icon-container mb-8">
                                <div class="icon-circle"></div>
                                <img :src="feature.icon" :alt="`Icon representing ${feature.title}`" class="feature-icon">
                            </div>
                            <h3 class="feature-title">{{ feature.title }}</h3>
                            <p class="feature-desc">{{ feature.description }}</p>
                            <div class="feature-footer mt-auto pt-6">
                                <div class="feature-link">
                                    <span>Explore Feature</span>
                                    <b-icon icon="arrow-right" class="ms-2" aria-hidden="true"></b-icon>
                                </div>
                            </div>
                        </b-card>
                    </div>
                </router-link>
            </b-col>
        </b-row>
    </section>
</template>

<script>
export default {
    name: "HomeFeatureGrid",
    data() {
        return {
            features: [
                { title: "Small Business", description: "Tailored logistics solutions designed to help growing businesses scale efficiently.", icon: "/media/assets/illustrations/small-business.png", link: "/small-business" },
                { title: "Cloud Storage", description: "Secure, high-speed access to all your freight documents and history, anywhere, anytime.", icon: "/media/assets/illustrations/cloud-storage.png", link: "/cloud-storage" },
                { title: "Privacy", description: "Enterprise-grade encryption ensuring your sensitive data and trade secrets remain confidential.", icon: "/media/assets/illustrations/privacy.png", link: "/privacy" },
                { title: "End to End Service", description: "Comprehensive freight management from initial booking to final delivery, fully automated.", icon: "/media/assets/illustrations/end-to-end-service.png", link: "/end-to-end" }
            ],
        };
    }
};
</script>


