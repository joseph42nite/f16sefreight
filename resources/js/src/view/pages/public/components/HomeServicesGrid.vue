<template>
    <section class="services-carousel-section mb-25" aria-labelledby="services-heading">
        <b-row>
            <b-col cols="12">
                <div class="section-header text-center mb-16">
                    <span class="section-eyebrow">Expertise</span>
                    <h2 id="services-heading" class="section-title">Specialized Logistics Services</h2>
                    <p class="section-subtitle mt-4">High-performance solutions for every freight challenge.</p>
                </div>
                <div class="services-modern-grid">
                    <!-- SEA SERVICE -->
                    <router-link to="/product-description" custom v-slot="{ navigate }">
                        <article class="service-product-card is-coming-soon order-lg-1 order-2" @click="navigate" style="cursor: pointer;">
                            <div class="service-product-badge">Upcoming</div>
                            <div class="service-product-image">
                                <img src="/media/assets/banners/banner-ship.webp" alt="Focus Sea - Digital Ocean Freight Management" loading="lazy">
                            </div>
                            <div class="service-product-info">
                                <h3 class="service-product-title">FOCUS SEA</h3>
                                <p class="service-product-desc">Streamlined ocean freight documentation and container tracking. Manage every wave of your sea logistics with one-click efficiency.</p>
                                <b-button disabled class="service-product-btn">
                                    <span>Coming Soon</span>
                                </b-button>
                            </div>
                        </article>
                    </router-link>

                    <!-- AIR SERVICE -->
                    <router-link to="/product-description" custom v-slot="{ navigate }">
                        <article class="service-product-card order-lg-2 order-1" @click="navigate" style="cursor: pointer;">
                            <div class="service-product-image">
                                <img src="/media/assets/banners/banner-plane.webp" alt="Focus Air - Automated Air Freight Solutions" loading="lazy">
                            </div>
                            <div class="service-product-info">
                                <h3 class="service-product-title">FOCUS AIR</h3>
                                <p class="service-product-desc">The gold standard in air freight automation. Instant AWB generation, real-time EDI connectivity, and automated status updates.</p>
                                <b-button to="/product-description" class="hero-btn" aria-label="Start using Focus Air services">
                                    <span>Explore More</span>
                                    <div class="btn-icon">
                                        <b-icon icon="arrow-right" aria-hidden="true"></b-icon>
                                    </div>
                                </b-button>
                            </div>
                        </article>
                    </router-link>

                    <!-- ROAD SERVICE -->
                    <router-link to="/product-description" custom v-slot="{ navigate }">
                        <article class="service-product-card is-coming-soon order-lg-3 order-3" @click="navigate" style="cursor: pointer;">
                            <div class="service-product-badge">Upcoming</div>
                            <div class="service-product-image">
                                <img src="/media/assets/banners/banner-truck.webp" alt="Focus Road - Road Transportation Management" loading="lazy">
                            </div>
                            <div class="service-product-info">
                                <h3 class="service-product-title">FOCUS ROAD</h3>
                                <p class="service-product-desc">Simplified road transportation management. Handle local trucking and cross-border freight with powerful dispatching tools.</p>
                                <b-button disabled class="service-product-btn">
                                    <span>Coming Soon</span>
                                </b-button>
                            </div>
                        </article>
                    </router-link>
                </div>
            </b-col>
        </b-row>
    </section>
</template>

<script>
export default {
    name: "HomeServicesGrid"
};
</script>


