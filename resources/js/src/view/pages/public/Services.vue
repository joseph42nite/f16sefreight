<template>
  <b-container fluid class="main-wrapper p-0">
    <decorative-ellipses :showMid="true"></decorative-ellipses>

    <b-container class="content-container pb-30">
      
      <!-- HERO SECTION -->
      <section class="services-hero-section mt-20 mt-lg-25 mb-30">
        <b-row class="justify-content-center text-center">
          <b-col lg="10" xl="9">
            <section-header 
                eyebrow="GLOBAL LOGISTICS INFRASTRUCTURE" 
                tag="h1"
                marginBottom="0"
            >
                <template #title>
                    Advanced <span class="text-gradient">E-Freight & ERP</span> Solutions for Global Forwarding
                </template>
                <template #subtitle>
                    F16s provides the digital backbone for the modern freight industry. From high-speed <strong>EDI data transfer</strong> (FWB, FHL, FZB) to comprehensive <strong>MAWB & HAWB management</strong>, our platform empowers freight forwarders, consolidators, and logistics providers with enterprise-grade automation.
                </template>
            </section-header>
          </b-col>
        </b-row>
      </section>

      <!-- CORE SEGMENTS (GRID) -->
      <section class="services-grid-section mb-30">
        <section-header 
            eyebrow="Industry Segments" 
            title="Comprehensive Freight Automation" 
            subtitle="Digitizing every touchpoint of the global supply chain with specialized tools for air, sea, and road documentation."
        />
        <b-row class="justify-content-center">
            <b-col lg="4" md="6" class="mb-12" v-for="(service, index) in services" :key="index">
                <div class="service-product-card h-100">
                    <div class="service-product-image mb-8">
                        <img :src="service.imgSrc" :alt="service.title">
                    </div>
                    <div class="service-product-info">
                        <h3 class="service-product-title">{{ service.title }}</h3>
                        <p class="service-product-desc">{{ service.desc }}</p>
                        <ul class="service-feature-list">
                            <li v-for="(feat, fIdx) in service.features" :key="fIdx" class="mb-2 text-muted">
                                <span class="feature-text">{{ feat }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </b-col>
        </b-row>
      </section>

      <!-- TECHNICAL PILLARS -->
      <section class="deep-dive-section mb-30">
        <!-- Feature 1: EDI & Data Transfer -->
        <b-row class="align-items-center mb-25 flex-column-reverse flex-lg-row">
            <b-col lg="6" class="mt-10 mt-lg-0 pe-lg-12">
                <section-header 
                    align="left"
                    eyebrow="EDI CONNECTIVITY" 
                    title="Global EDI Data Transfer (FWB, FHL, FZB)" 
                    marginBottom="0"
                >
                    <template #subtitle>
                        Our stable <strong>EDI gateway</strong> connects you directly to over 150+ airlines and global customs hubs. Ensure 100% data accuracy for <strong>FWB (Master AWB)</strong>, <strong>FHL (House Manifest)</strong>, and <strong>FZB (Flight Manifest)</strong> transmissions.
                        <br><br>
                        F16s adheres to IATA e-AWB standards, eliminating manual documentation bottlenecks and ensuring seamless <strong>MAWB & HAWB</strong> synchronization across your network.
                    </template>
                </section-header>
                <div class="d-flex flex-column flex-sm-row align-items-sm-center mt-8">
                    <div class="stat-box me-sm-8 mb-6 mb-sm-0">
                        <h4 class="stat-number">150+</h4>
                        <span class="stat-label">Airlines Connected</span>
                    </div>
                    <div class="stat-box">
                        <h4 class="stat-number">e-AWB</h4>
                        <span class="stat-label">IATA Compliant</span>
                    </div>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="feature-image-wrapper">
                    <div class="feature-glow"></div>
                    <img src="/media/assets/illustrations/amico.png" alt="EDI Data Transfer" class="img-fluid feature-img">
                </div>
            </b-col>
        </b-row>

        <!-- Feature 2: Logistics ERP -->
        <b-row class="align-items-center flex-column flex-lg-row">
            <b-col lg="6" class="mb-10 mb-lg-0">
                <div class="feature-image-wrapper">
                    <div class="feature-glow alt-glow"></div>
                    <img src="/media/assets/illustrations/pana.png" alt="Logistics ERP" class="img-fluid feature-img">
                </div>
            </b-col>
            <b-col lg="6" class="ps-lg-12">
                <section-header 
                    align="left"
                    eyebrow="ENTERPRISE ERP" 
                    title="Unified Logistics ERP & Analytics" 
                    marginBottom="0"
                >
                    <template #subtitle>
                        Manage your entire freight operation within a single <strong>Logistics ERP</strong> framework. From shipment lifecycle management to financial accounting, F16s provides the tools to track every metric.
                        <br><br>
                        Gain real-time visibility into your <strong>shipment status</strong>, vendor performance, and customer profitability with our advanced analytics dashboard.
                    </template>
                </section-header>
                <ul class="feature-bullet-list list-unstyled mt-8">
                    <li class="mb-4"><b-icon icon="layout-text-window" class="me-3 text-primary"></b-icon> Multi-modal MAWB & HAWB Management</li>
                    <li class="mb-4"><b-icon icon="shield-lock" class="me-3 text-primary"></b-icon> Secure EDI & API Data Exchange</li>
                    <li><b-icon icon="bar-chart-line" class="me-3 text-primary"></b-icon> Comprehensive Operational Reporting</li>
                </ul>
            </b-col>
        </b-row>
      </section>

      <!-- OUR COMMITMENT (GLASS CARD) -->
      <section class="vision-section mb-30">
        <b-row class="justify-content-center">
          <b-col lg="11">
            <div class="commitment-card">
               <div class="commitment-glow"></div>
               <div class="commitment-content glass-card p-8 p-md-16">
                  <b-row align-v="center">
                    <b-col lg="7">
                      <section-header 
                          align="left"
                          eyebrow="Our Commitment" 
                          title="Standardizing Global Logistics" 
                          marginBottom="0"
                      >
                        <template #subtitle>
                            We are committed to providing the most reliable and affordable <strong>e-freight infrastructure</strong> for the global logistics community. Our mission is to standardize <strong>EDI connectivity</strong> and <strong>ERP accessibility</strong> for every freight forwarder.
                            <br><br>
                            By integrating complex systems into a user-friendly platform, we enable our partners to focus on what matters most: delivering excellence at every step of the supply chain.
                        </template>
                      </section-header>
                    </b-col>
                    <b-col lg="5" class="d-none d-lg-flex justify-content-center">
                      <div class="commitment-icon-wrapper">
                        <div class="icon-ring"></div>
                        <b-icon icon="cpu" font-scale="5" class="commitment-icon"></b-icon>
                      </div>
                    </b-col>
                  </b-row>
               </div>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- CALL TO ACTION -->
      <section class="cta-section mb-20">
        <b-row class="justify-content-center">
            <b-col lg="10">
                <div class="final-cta-card">
                    <div class="cta-overlay-glow"></div>
                    <div class="cta-inner-content py-20 px-8 text-center text-white">
                        <h2 class="section-heading mb-6 text-white">Upgrade Your Freight Infrastructure Today</h2>
                        <p class="section-subtitle mb-10 text-white opacity-90 mx-auto" style="max-width: 650px;">
                            Join the global network of forwarders using F16s to power their <strong>EDI transmissions</strong> and <strong>ERP operations</strong>. Connect with our experts for a personalized demonstration.
                        </p>
                        <hero-button to="/contact-us" variant="large-white">Get Started Now</hero-button>
                    </div>
                </div>
            </b-col>
        </b-row>
      </section>

    </b-container>
  </b-container>
</template>

<script>
import DecorativeEllipses from "./components/DecorativeEllipses.vue";
import SectionHeader from "./components/SectionHeader.vue";
import HeroButton from "./components/HeroButton.vue";

export default {
    name: "Services",
    metaInfo: {
        title: "Advanced E-Freight & ERP Solutions | F16s Services",
        meta: [
            { name: 'description', content: 'Explore F16s\' suite of advanced logistics tools: EDI data transfer (FWB, FHL, FZB), MAWB & HAWB management, and unified logistics ERP.' },
            { property: 'og:title', content: 'Advanced E-Freight & ERP Solutions | F16s Services' },
            { property: 'og:description', content: 'Explore F16s\' suite of advanced logistics tools: EDI data transfer (FWB, FHL, FZB), MAWB & HAWB management, and unified logistics ERP.' }
        ]
    },
    components: {
        DecorativeEllipses,
        SectionHeader,
        HeroButton
    },
    data() {
        return {
            services: [
                {
                    imgSrc: "/media/assets/illustrations/amico.png",
                    title: "Advanced EDI Gateway",
                    desc: "High-speed data transfer for FWB, FHL, and FZB messaging, ensuring seamless connectivity between forwarders and 150+ airlines.",
                    features: ["e-AWB IATA Compliance", "Real-time Manifest Transfer", "Automated Error Validation"]
                },
                {
                    imgSrc: "/media/assets/illustrations/cuate.png",
                    title: "MAWB & HAWB Logic",
                    desc: "Enterprise-grade tools for managing Master and House Air Waybills with full version history and secure document archiving.",
                    features: ["Consolidation Tools", "Automated Documentation", "Digital History Logs"]
                },
                {
                    imgSrc: "/media/assets/illustrations/pana.png",
                    title: "Logistics Intelligence ERP",
                    desc: "A comprehensive ERP system designed specifically for the freight industry to monitor operational performance and financial growth.",
                    features: ["Shipment Lifecycle Tracking", "Vendor Performance KPIs", "Revenue Analytics"]
                }
            ]
        };
    },
};
</script>

<style scoped>
.content-container {
    position: relative;
    z-index: 10;
    padding-top: 0;
}

/* Typography Enhancements */
.section-title {
    font-size: 3.5rem;
    font-weight: 800;
}
.section-heading {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e3a6e;
    letter-spacing: -0.5px;
    line-height: 1.2;
}
.text-gradient {
    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline;
    padding-right: 0.1em;
}

/* Feature Deep Dive Images */
.feature-image-wrapper {
    position: relative;
    border-radius: 32px;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.feature-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(171, 192, 255, 0.5) 0%, transparent 70%);
}
.feature-glow.alt-glow {
    background: radial-gradient(circle at center, rgba(187, 226, 255, 0.5) 0%, transparent 70%);
}
.feature-img {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 30px 60px rgba(53, 85, 148, 0.15));
    transition: transform 0.5s ease;
    max-height: 400px;
}
.feature-image-wrapper:hover .feature-img {
    transform: translateY(-10px);
}

/* Stat Boxes & Lists */
.stat-box {
    background: white;
    border-radius: 20px;
    padding: 1.5rem 2rem;
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);
    border: 1px solid rgba(230, 240, 255, 1);
}
.stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e3a6e;
    margin-bottom: 0.25rem;
}
.stat-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #5A6B8A;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.feature-bullet-list li {
    font-size: 1.15rem;
    color: #4A5E80;
    font-weight: 500;
    display: flex;
    align-items: center;
}

/* Commitment Card */
.commitment-card { position: relative; }
.commitment-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #355594, #ABC0FF);
    border-radius: 40px;
    opacity: 0.3;
    filter: blur(25px);
    z-index: 0;
}
.glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 40px;
    box-shadow: 0 20px 50px rgba(53, 85, 148, 0.05);
}
.commitment-icon-wrapper {
    position: relative;
    width: 250px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.icon-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f0f7ff;
    border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;
    animation: morph 8s ease-in-out infinite;
}
.commitment-icon { position: relative; z-index: 1; color: #355594; }

@keyframes morph {
    0% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%; }
    50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
    100% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%; }
}

/* Final CTA Card */
.final-cta-card {
    position: relative;
    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(30, 58, 110, 0.25);
}
.cta-overlay-glow {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 80%;
    height: 150%;
    background: radial-gradient(circle, rgba(171, 192, 255, 0.15) 0%, transparent 70%);
    transform: rotate(-15deg);
}

@media (max-width: 991px) {
    .section-title { font-size: 2.5rem; }
    .commitment-content, .cta-inner-content { padding: 3rem 2rem; }
}
@media (max-width: 767px) {
    .section-title { font-size: 2.1rem; }
}
</style>