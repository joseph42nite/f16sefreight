<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- HERO: full-bleed, outside the content container. It stays put once its foot is on screen, and the sheet below
         slides up over it. -->
    <home-hero></home-hero>

    <!-- The rest of the page, on a white sheet with a curved top edge that scrolls up over the hero (owner, 2026-11-12). -->
    <div class="lp-sheet">
    <b-container class="content-container">
        <!-- THE BEST REASONS TO CHOOSE F16S, first thing on the sheet (owner, 2026-11-12) -->
        <home-features></home-features>

        <!-- AIRLINES your AWBs reach, through Descartes — right under "Why F16s" (owner, 2026-11-13). -->
        <home-airlines></home-airlines>

        <!-- HOW WE USE AI (owner, 2026-11-13) -->
        <home-ai></home-ai>
    </b-container>
    </div>

    <!-- Like the hero: the first sheet ends after the AI section with a curved bottom edge, the next section sits on the
         hero's blue, and a second sheet curves up over it (owner, 2026-11-13). -->
    <div class="lp-blue">
      <img class="lp-blue__cloud lp-blue__cloud--a" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
      <img class="lp-blue__cloud lp-blue__cloud--b" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
      <b-container class="content-container">
        <!-- HOW EVERYTHING IS CONNECTED: mail → enquiry → job → documents → airline → tracking → invoice → books -->
        <home-connected></home-connected>
      </b-container>
    </div>

    <div class="lp-sheet lp-sheet--next">
    <b-container class="content-container">
        <!-- AIR, SEA, ROAD — true status for each -->
        <home-modes></home-modes>

        <!-- CALL TO ACTION, above the plans (owner, 2026-11-16), in the hero's blue -->
        <home-cta></home-cta>

        <!-- PLANS, in the Products card style, one jet picture per plan (owner, 2026-11-13) -->
        <home-plans></home-plans>

        <!-- SAFE AND IN CONTROL: a shield with six safeguards wired to it (owner, 2026-11-16) -->
        <home-trust></home-trust>

        <!-- NEWS -->
        <home-news-section></home-news-section>

        <!-- FAQs -->
        <home-faq-section></home-faq-section>

        <!-- TALK TO US: work emails only, with designation (owner, 2026-11-16) -->
        <home-lead-form></home-lead-form>

    </b-container>
    </div>
  </b-container>
</template>

<script>
import HomeHero from "./components/HomeHero.vue";
import HomeFeatures from "./components/HomeFeatures.vue";
import HomeModes from "./components/HomeModes.vue";
import HomeAirlines from "./components/HomeAirlines.vue";
import HomeAi from "./components/HomeAi.vue";
import HomeConnected from "./components/HomeConnected.vue";
import HomePlans from "./components/HomePlans.vue";
import HomeTrust from "./components/HomeTrust.vue";
import HomeNewsSection from "./components/HomeNewsSection.vue";
import HomeFaqSection from "./components/HomeFaqSection.vue";
import HomeLeadForm from "./components/HomeLeadForm.vue";
import HomeCta from "./components/HomeCta.vue";

export default {
    name: "Home",
    metaInfo: {
        title: "F16s E-Freight Solutions | Smart Logistics & AWB Automation",
        meta: [
            { name: 'description', content: 'Every shipment on one clear board: client mails read every 2 minutes, air waybills drafted by AI, and e-AWBs sent to airlines through Descartes. Air and sea freight software for forwarders.' },
            { property: 'og:title', content: 'F16s E-Freight Solutions | Smart Logistics & AWB Automation' },
            { property: 'og:description', content: 'Every shipment on one clear board: client mails read every 2 minutes, air waybills drafted by AI, and e-AWBs sent to airlines through Descartes. Air and sea freight software for forwarders.' }
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
                    "description": "Freight forwarding software: every shipment on one clear board, with AI-drafted air waybills and e-AWBs sent to airlines through Descartes."
                }), 
                type: 'application/ld+json' 
            }
        ],
        __dangerouslyDisableSanitizers: ['script']
    },
    components: {
        HomeAi,
        HomeConnected,
        HomePlans,
        HomeTrust,
        HomeHero,
        HomeFeatures,
        HomeModes,
        HomeAirlines,
        HomeNewsSection,
        HomeFaqSection,
        HomeLeadForm,
        HomeCta
    }
}
</script>

<style scoped>
/* clip, not hidden: hidden also cuts the hero's sky off where it runs up behind the header. */
.main-wrapper {
    overflow-x: clip;
}
.content-container {
    position: relative;
    z-index: 10;
    padding-top: 0;
}
/* Above the sticky hero, with a curved top edge and a soft shadow cast upwards onto the blue. The first sheet also
   curves at the bottom, where the blue band shows (owner, 2026-11-13). */
.lp-sheet {
    position: relative;
    z-index: 5;
    margin-top: -56px;
    padding-top: 8px;
    /* Warm off-white, as in the owner's features reference, so the white clouds behind the cards read. */
    background: #F8F6F1;
    border-radius: 56px;
    box-shadow: 0 -20px 50px rgba(40, 90, 170, 0.14);
}
.lp-sheet--next {
    margin-top: -56px;
    border-radius: 56px 56px 0 0;
}
/* The blue band between the sheets: the hero's colours, its clouds, tucked under both curved edges. */
.lp-blue {
    position: relative;
    z-index: 4;
    overflow: clip;
    margin-top: -56px;
    padding: 96px 0 120px;
    background: linear-gradient(180deg, #6FA9F2 0%, #9CC6F7 60%, #CFE4FC 100%);
}
.lp-blue__cloud { position: absolute; pointer-events: none; mix-blend-mode: screen; }
.lp-blue__cloud--a { left: -160px; top: 30%; width: 620px; opacity: .75; animation: lp-cloud-a 40s ease-in-out infinite alternate; }
.lp-blue__cloud--b { right: -140px; bottom: 6%; width: 520px; opacity: .6; transform: scaleX(-1); animation: lp-cloud-b 52s ease-in-out infinite alternate; }
/* The band's clouds drift slowly, in opposite directions. */
@keyframes lp-cloud-a { from { transform: translateX(0); } to { transform: translateX(160px); } }
@keyframes lp-cloud-b { from { transform: scaleX(-1) translateX(0); } to { transform: scaleX(-1) translateX(140px); } }
@media (prefers-reduced-motion: reduce) { .lp-blue__cloud { animation: none; } }
@media (max-width: 575px) {
    .lp-sheet {
        margin-top: -32px;
        border-radius: 32px;
    }
    .lp-sheet--next { border-radius: 32px 32px 0 0; }
    .lp-blue { margin-top: -32px; padding: 64px 0 80px; }
}
</style>
<style>
/* Shared section headings on the landing page (redesign, 2026-11-12) — the hero's type: Inter, medium weight, tight
   tracking, navy. Used by HomeHowItWorks, HomeModes, HomeAirlines, HomeNewsSection, HomeFaqSection. */
.lp-head { position: relative; z-index: 1; text-align: center; font-family: "Inter", sans-serif; }
.lp-eyebrow { display: block; margin-bottom: 14px; font-size: .75rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #6B7A93; }
.lp-title { margin: 0 0 14px; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.12; font-weight: 500; letter-spacing: -.03em; color: #1E3A6E; }
.lp-sub { margin: 0 auto; max-width: 520px; font-size: 1rem; line-height: 1.6; color: #6B7A93; }
/* Left-aligned headings (news, FAQ): two classes, so they win over .lp-head whatever order the styles load in. */
.lp-head.lp-head--left { text-align: left; }
.lp-head.lp-head--left .lp-sub { margin-left: 0; }
/* Headings on the blue band: white, like the hero. */
.lp-blue .lp-eyebrow { color: rgba(255, 255, 255, .85); }
.lp-blue .lp-title { color: #fff; text-shadow: 0 2px 18px rgba(30, 80, 160, .28); }
.lp-blue .lp-sub { color: rgba(255, 255, 255, .92); text-shadow: 0 1px 10px rgba(30, 80, 160, .3); }
.lp-blue .lcn { padding: 0; }
</style>
