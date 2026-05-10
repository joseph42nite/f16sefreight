<template>
  <b-container fluid class="main-wrapper p-0">
    <decorative-ellipses></decorative-ellipses>

    <b-container class="content-container">
        <!-- HERO SECTION -->
        <home-hero></home-hero>

        <!-- PARTNERS TICKER -->
        <home-partners-ticker></home-partners-ticker>

        <!-- WHAT F16S CAN DO (FEATURES) -->
        <home-feature-grid></home-feature-grid>

        <!-- THREE MAJOR SERVICES SECTION -->
        <home-services-grid></home-services-grid>

        <!-- STATS SECTION -->
        <home-stats-section></home-stats-section>

        <!-- NEWS SECTION -->
        <home-news-section></home-news-section>

        <!-- FAQs SECTION -->
        <home-faq-section></home-faq-section>
    </b-container>
  </b-container>
</template>

<script>
import DecorativeEllipses from "./components/DecorativeEllipses.vue";
import HomeHero from "./components/HomeHero.vue";
import HomePartnersTicker from "./components/HomePartnersTicker.vue";
import HomeFeatureGrid from "./components/HomeFeatureGrid.vue";
import HomeServicesGrid from "./components/HomeServicesGrid.vue";
import HomeStatsSection from "./components/HomeStatsSection.vue";
import HomeNewsSection from "./components/HomeNewsSection.vue";
import HomeFaqSection from "./components/HomeFaqSection.vue";

export default {
    name: "Home",
    metaInfo: {
        title: "F16s E-Freight Solutions | Smart Logistics & AWB Automation",
        meta: [
            { name: 'description', content: 'Streamline your freight forwarding with F16s E-Freight Solutions. Process MAWB and HAWB in under 3 seconds, connect with 150+ airlines globally, and automate your digital logistics workflow.' },
            { property: 'og:title', content: 'F16s E-Freight Solutions | Smart Logistics & AWB Automation' },
            { property: 'og:description', content: 'Streamline your freight forwarding with F16s E-Freight Solutions. Process MAWB and HAWB in under 3 seconds, connect with 150+ airlines globally, and automate your digital logistics workflow.' }
        ],
        script: [
            { 
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "F16s E-Freight Platform",
                    "operatingSystem": "Web-based",
                    "applicationCategory": "BusinessApplication",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                    "description": "Smart e-Freight Solutions for Freight Forwarders. Process MAWB and HAWB in seconds with 150+ airline connections."
                }), 
                type: 'application/ld+json' 
            }
        ],
        __dangerouslyDisableSanitizers: ['script']
    },
    components: {
        DecorativeEllipses,
        HomeHero,
        HomePartnersTicker,
        HomeFeatureGrid,
        HomeServicesGrid,
        HomeStatsSection,
        HomeNewsSection,
        HomeFaqSection
    }
}
</script>

<style scoped>
.content-container {
    position: relative;
    z-index: 10;
    padding-top: 0;
}
</style>