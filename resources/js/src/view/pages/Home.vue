<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container">
        <!-- HERO SECTION -->
        <section class="hero-section" aria-labelledby="hero-heading">
            <transition name="hero-fade">
                <div :key="heroServices[currentHeroIndex].title" class="hero-bg-text" aria-hidden="true">{{ heroServices[currentHeroIndex].title }}</div>
            </transition>
            <div class="hero-plane-wrapper">
                <transition name="hero-fade">
                    <img :key="heroServices[currentHeroIndex].image" 
                         :src="heroServices[currentHeroIndex].image" 
                         :style="heroServices[currentHeroIndex].extraStyle" 
                         alt="Digital freight logistics solutions" 
                         :class="['hero-plane', { 'is-tilted-plane': heroServices[currentHeroIndex].title === 'FOCUS AIR' }]">
                </transition>
            </div>
            <div class="hero-content">
                <div class="hero-text-block">
                    <h1 id="hero-heading" class="hero-title">Smart e-Freight Solutions for Freight Forwarders</h1>
                    <p class="hero-subtitle">
                        Eliminate manual entry frustrations. Process <strong>MAWB and HAWB in under 3 seconds</strong>, seamlessly connect with <strong>150+ airlines globally</strong>, and join the network trusted for over <strong>1,00,000+ AWBs</strong>.
                    </p>
                    <b-button to="/about-us" class="hero-btn" aria-label="Explore our logistics solutions">
                        <span>Explore Now</span>
                        <b-icon icon="arrow-right" class="btn-icon ms-2" aria-hidden="true"></b-icon>
                    </b-button>
                </div>
            </div>
        </section>

        <!-- AFFILIATIONS SCROLLER -->
        <section class="aff-section" aria-label="Our Airline Partners">
          <div class="aff-label">
            <span class="aff-eyebrow">Partners</span>
            <h2 class="aff-heading">Global Airline Affiliations</h2>
          </div>
          <div class="aff-divider"></div>
          <div class="aff-track-wrap">
            <div class="scroller-track">
              <div v-for="(img, idx) in affiliateImages" :key="idx" class="aff-logo-wrap">
                <img :src="img" class="affiliate-logo" :alt="`Partner airline logo ${idx + 1}`">
              </div>
            </div>
          </div>
        </section>

        <!-- WHAT F16S CAN DO (FEATURES) -->
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

        <!-- THREE MAJOR SERVICES SECTION - Redesigned -->
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
                                    <img src="/media/custome/about/boat.png" alt="Focus Sea - Digital Ocean Freight Management">
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
                                    <img src="/media/custome/about/plane.png" alt="Focus Air - Automated Air Freight Solutions">
                                </div>
                                <div class="service-product-info">
                                    <h3 class="service-product-title">FOCUS AIR</h3>
                                    <p class="service-product-desc">The gold standard in air freight automation. Instant AWB generation, real-time EDI connectivity, and automated status updates.</p>
                                    <b-button to="/product-description" class="hero-btn" aria-label="Start using Focus Air services">
                                        <span>Explore More</span>
                                        <b-icon icon="arrow-right" class="btn-icon" aria-hidden="true"></b-icon>
                                    </b-button>
                                </div>
                            </article>
                        </router-link>

                        <!-- ROAD SERVICE -->
                        <router-link to="/product-description" custom v-slot="{ navigate }">
                            <article class="service-product-card is-coming-soon order-lg-3 order-3" @click="navigate" style="cursor: pointer;">
                                <div class="service-product-badge">Upcoming</div>
                                <div class="service-product-image">
                                    <img src="/media/custome/about/truck.png" alt="Focus Road - Road Transportation Management">
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

        <!-- STATS SECTION -->
        <section class="stats-container mb-25" aria-labelledby="stats-heading">
            <b-row align-v="center">
                <b-col lg="4" class="mb-12 mb-lg-0">
                    <div class="stats-intro">
                        <span class="section-eyebrow">Our Impact</span>
                        <h2 id="stats-heading" class="section-title">Redefining Logistics Standards</h2>
                        <p class="section-subtitle mt-4">We are driving the future of logistics through advanced automation and global EDI connectivity.</p>
                        <div class="stats-decoration-line mt-8"></div>
                    </div>
                </b-col>
                <b-col lg="8">
                    <div class="stats-minimal-grid">
                        <div v-for="(stat, key) in statsData" :key="key" class="stat-minimal-item" :ref="`statRef-${key}`">
                            <div class="stat-minimal-icon">
                                <b-icon :icon="stat.icon" aria-hidden="true"></b-icon>
                            </div>
                            <div class="stat-minimal-info">
                                <div class="stat-minimal-number">
                                    {{ formatStat(animatedStats[key], key) }}{{ stat.suffix }}
                                </div>
                                <h3 class="stat-minimal-label">{{ stat.label }}</h3>
                                <p class="stat-minimal-desc">{{ stat.description }}</p>
                            </div>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </section>

        <!-- NEWS SECTION -->
        <section class="news-section-container mb-25" aria-labelledby="news-heading">
            <b-row class="mb-16 align-items-end">
                <b-col md="8">
                    <span class="section-eyebrow">Insights</span>
                    <h2 id="news-heading" class="section-title">Latest Logistics News & Insights</h2>
                    <p class="section-subtitle mt-4">Stay updated with the evolving landscape of global trade and freight technology.</p>
                </b-col>
                <b-col md="4" class="text-md-end d-none d-md-block">
                    <b-link to="/blogs-and-news" class="view-all-btn" aria-label="View all logistics news articles">
                        <span>View All News</span>
                        <b-icon icon="arrow-right" class="ms-2" aria-hidden="true"></b-icon>
                    </b-link>
                </b-col>
            </b-row>

            <b-row>
                <b-col lg="6" class="mb-8">
                    <!-- Featured News Card -->
                    <article class="news-card featured" @click="$router.push('/blog/' + featuredPost.slug)" style="cursor: pointer;">
                        <div class="news-image-wrap">
                            <img :src="featuredPost.image" class="news-img" :alt="featuredPost.title">
                            <div class="news-category">{{ featuredPost.category }}</div>
                        </div>
                        <div class="news-body">
                            <div class="news-meta">
                                <time :datetime="featuredPost.date" class="news-date">{{ featuredPost.date }}</time>
                                <span class="meta-dot"></span>
                                <span class="news-author">F16s Editorial</span>
                            </div>
                            <h3 class="news-title">{{ featuredPost.title }}</h3>
                            <p class="news-excerpt">{{ featuredPost.excerpt }}</p>
                            <b-link :to="'/blog/' + featuredPost.slug" class="news-read-more" aria-label="Read full article">
                                <span>Read Full Article</span>
                                <b-icon icon="plus" class="ms-1" aria-hidden="true"></b-icon>
                            </b-link>
                        </div>
                    </article>
                </b-col>
                <b-col lg="6">
                    <b-row>
                        <b-col md="6" v-for="(news, idx) in newsItems" :key="idx" class="mb-8">
                            <article class="news-card small" @click="$router.push('/blog/' + news.slug)" style="cursor: pointer;">
                                <div class="news-image-wrap small">
                                    <img :src="news.image" class="news-img" :alt="news.title">
                                    <div class="news-category">{{ news.category }}</div>
                                </div>
                                <div class="news-body">
                                    <div class="news-meta">
                                        <span class="news-date">{{ news.date }}</span>
                                    </div>
                                    <h4 class="news-title-small">{{ news.title }}</h4>
                                    <b-link :to="'/blog/' + news.slug" class="news-link-simple" :aria-label="`Read more about ${news.title}`">Read More</b-link>
                                </div>
                            </article>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <div class="d-md-none text-center mt-4">
                <b-link href="#" class="view-all-btn" aria-label="View all logistics news articles">View All News</b-link>
            </div>
        </section>

        <!-- FAQs SECTION -->
        <section class="faq-section-container mb-25" id="faq-section" aria-labelledby="faq-heading">
            <b-row class="justify-content-center">
                <b-col lg="9">
                    <div class="text-center mb-16">
                        <span class="section-eyebrow">Support</span>
                        <h2 id="faq-heading" class="section-title">Freight Automation FAQs</h2>
                        <p class="section-subtitle mt-4">Everything you need to know about the F16s freight management platform.</p>
                    </div>

                    <div class="faq-accordion-list">
                        <article v-for="(faq, idx) in accordions" :key="idx" 
                             class="faq-item" :class="{'is-open': faq.isOpen}">
                            <div class="faq-header" @click="toggleAccordion(idx)" 
                                 role="button" :aria-expanded="faq.isOpen.toString()"
                                 :aria-controls="`faq-content-${idx}`">
                                <h3 class="faq-question">{{ faq.title }}</h3>
                                <div class="faq-toggle-icon">
                                    <div class="icon-line horizontal"></div>
                                    <div class="icon-line vertical" :class="{'is-hidden': faq.isOpen}"></div>
                                </div>
                            </div>
                            <b-collapse v-model="faq.isOpen" :id="`faq-content-${idx}`">
                                <div class="faq-body">
                                    <p>{{ faq.content }}</p>
                                </div>
                            </b-collapse>
                        </article>
                    </div>

                    <!-- Still Have Questions -->
                    <div class="faq-footer mt-16 text-center">
                        <div class="faq-footer-card">
                            <h4 class="mb-2">Still have questions about our logistics tools?</h4>
                            <p class="mb-6">Can't find the answer you're looking for? Please contact our expert logistics team.</p>
                            <b-button to="/contact-us" class="faq-contact-btn" aria-label="Contact our support team">Get in Touch</b-button>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </section>
    </b-container>
  </b-container>
</template>

<script>

import { blogs } from "../blogData";

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
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "description": "Smart e-Freight Solutions for Freight Forwarders. Process MAWB and HAWB in seconds with 150+ airline connections."
                }), 
                type: 'application/ld+json' 
            }
        ],
        __dangerouslyDisableSanitizers: ['script']
    },
    components: { },
    data() {
        return {
            animatedStats: { awbs: 0, airlines: 0, speed: 0 },
            statsData: {
                awbs: { label: "AWBs Processed", target: 100000, suffix: "", icon: "file-earmark-check", description: "Our robust EDI engine has successfully processed over 1,00,000 Air Waybills, providing unmatched reliability for freight forwarders globally." },
                airlines: { label: "Airlines", target: 150, suffix: "+", icon: "cursor", description: "Seamlessly connect with 150+ airlines via our direct EDI integrations. No more manual entry—just instant, accurate data transmission to any carrier." },
                speed: { label: "Processing Speed", target: 3, suffix: " sec", icon: "lightning-charge", description: "Experience lightning-fast operations. Our platform automates complex documentation, reducing manual entry time from minutes to just 3 seconds per AWB." }
            },
            hasAnimatedStats: { awbs: false, airlines: false, speed: false },
            currentHeroIndex: 0,
            heroInterval: null,
            heroServices: [
                { title: 'FOCUS AIR', image: '/media/custome/banner-plane.png', extraStyle: {} },
                { title: 'FOCUS SEA', image: '/media/custome/banner-ship.png', extraStyle: {} },
                { title: 'FOCUS ROAD', image: '/media/custome/banner-truck.png', extraStyle: { marginTop: '40px' } }
            ],
            affiliateImages: [
                "/media/custome/affiliation-tags/air-france.png",
                "/media/custome/affiliation-tags/emirates.png",
                "/media/custome/affiliation-tags/lufthansa.png",
                "/media/custome/affiliation-tags/qatar.png",
                "/media/custome/affiliation-tags/turkish-airlines.png"
            ],
            features: [
                { title: "Small Business", description: "Tailored logistics solutions designed to help growing businesses scale efficiently.", icon: "/media/custome/small-business.png", link: "/small-business" },
                { title: "Cloud Storage", description: "Secure, high-speed access to all your freight documents and history, anywhere, anytime.", icon: "/media/custome/cloud-storage.png", link: "/cloud-storage" },
                { title: "Privacy", description: "Enterprise-grade encryption ensuring your sensitive data and trade secrets remain confidential.", icon: "/media/custome/privacy.png", link: "/privacy" },
                { title: "End to End Service", description: "Comprehensive freight management from initial booking to final delivery, fully automated.", icon: "/media/custome/end-to-end-service.png", link: "/end-to-end" }
            ],
            featuredPost: blogs[0],
            newsItems: blogs.slice(1, 5),
            accordions: [
                { title: "Does F16s support multiple AWB connections?", content: "Yes, our Pro plan allows users to connect multiple AWBs for seamless data transfer across airlines and logistics partners.", isOpen: false },
                { title: "Can I print my freight documents from F16s?", content: "Yes, our platform includes a document printing option for MAWB, HAWB and consolidation.", isOpen: false },
                { title: "Can I search for past AWBs?", content: "Yes, you can view the last 10, 20, 50, or 100 executed AWBs, check their history, and access shipment tracking, HAWB details, and message logs.", isOpen: false },
                { title: "What are the pricing options for F16s?", content: "We offer a Basic plan for database management and printable documentation, while the Pro plan includes multiple AWB connections and additional feature.", isOpen: false },
            ]
        }
    },
    methods: {
        toggleAccordion(index) {
            this.accordions[index].isOpen = !this.accordions[index].isOpen;
        },
        formatStat(value, key) {
            if (key === 'awbs') {
                // Format to 1,00,000 (Indian format as requested)
                return value.toLocaleString('en-IN');
            }
            return value.toLocaleString();
        },
        animateStat(key) {
            const target = this.statsData[key].target;
            const duration = 2000;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    this.animatedStats[key] = target;
                    clearInterval(timer);
                } else {
                    this.animatedStats[key] = Math.floor(current);
                }
            }, stepTime);
        },
        isElementInViewport(element) {
            if(!element) return false;
            const rect = element.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
        },
        checkVisibility() {
            Object.keys(this.statsData).forEach(key => {
                const refName = `statRef-${key}`;
                const element = this.$refs[refName] ? this.$refs[refName][0] : null;
                
                if (element && !this.hasAnimatedStats[key] && this.isElementInViewport(element)) {
                    this.animateStat(key);
                    this.hasAnimatedStats[key] = true;
                }
            });

            const allDone = Object.values(this.hasAnimatedStats).every(v => v);
            if (!allDone) {
                this.animationFrameId = requestAnimationFrame(this.checkVisibility);
            }
        }
    },
    mounted() {
        this.animationFrameId = requestAnimationFrame(this.checkVisibility);
        
        this.heroInterval = setInterval(() => {
            this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroServices.length;
        }, 4000);

        // Multiply the 5 logos to create a continuous dense ticker of 150 items
        const baseLogos = this.affiliateImages;
        let expandedLogos = [];
        for(let i = 0; i < 30; i++) {
            expandedLogos = expandedLogos.concat(baseLogos);
        }
        this.affiliateImages = expandedLogos;
    },
    beforeDestroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.heroInterval) {
            clearInterval(this.heroInterval);
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.main-wrapper {
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow-x: hidden;
}

/* Decorative background elements */
.decorative-ellipses .ellipse {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.5;
}
.ellipse-tl { width: 400px; height: 400px; background: #D0E6F8; top: -100px; left: -100px; }
.ellipse-tr { width: 300px; height: 300px; background: #E6F0FF; top: 20%; right: -50px; }
.ellipse-br { width: 500px; height: 500px; background: #F0F7FF; bottom: 10%; left: 20%; }

.content-container {
    position: relative;
    z-index: 10;
    padding-top: 0;
}

/* Typography */
.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #355594;
    letter-spacing: -0.5px;
}
.section-subtitle {
    font-size: 1.25rem;
    color: #5A6B8A;
    font-weight: 400;
}

.hero-section {
    position: relative;
    width: 100%;
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 2rem;
    background: transparent;
}

/* Title — pinned near the top */
.hero-bg-text {
    position: absolute;
    top: 16%;
    left: 5%;
    font-size: clamp(6rem, 16vw, 14rem);
    font-weight: 900;
    color: white;
    opacity: 0.95;
    letter-spacing: -0.03em;
    z-index: 1;
    white-space: nowrap;
    pointer-events: none;
    line-height: 1;
    text-shadow: 0 8px 32px rgba(53, 85, 148, 0.15);
}

/* Plane — large, anchored bottom-right, overlapping the title */
.hero-plane {
    position: absolute;
    right: -2%;
    top: 18%;
    width: 64%;
    max-width: 780px;
    z-index: 2;
    filter: drop-shadow(0 40px 80px rgba(53, 85, 148, 0.18));
    pointer-events: none;
}
.hero-plane.is-tilted-plane {
    transform: rotate(-5deg);
}

.hero-fade-enter-active, .hero-fade-leave-active {
    transition: opacity 1s ease-in-out;
}
.hero-fade-enter, .hero-fade-leave-to {
    opacity: 0 !important;
}

/* Content — sits in normal flow, below the title area */
.hero-content {
    position: absolute;
    top: 58%;
    left: 6.5%;
    transform: translateY(-50%);
    z-index: 3;
    padding: 0;
}

.hero-text-block {
    max-width: 460px;
}

.hero-title {
    font-size: 2.8rem;
    font-weight: 800;
    color: #355594;
    margin-bottom: 1rem;
    line-height: 1.1;
    letter-spacing: -1px;
}

.hero-subtitle {
    font-size: 1.05rem;
    line-height: 1.8;
    color: #4A5E80;
    margin-bottom: 2rem;
}
.hero-subtitle strong {
    color: #355594;
    font-weight: 600;
}

.hero-btn {
    background: #355594;
    border: none;
    border-radius: 999px;
    padding: 10px 10px 10px 22px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
}
.hero-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.25);
}
.is-dark .hero-btn {
    background: white;
}
.is-dark .hero-btn:hover {
    background: #f8faff;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.hero-btn span {
    color: white;
    font-weight: 500;
    margin-right: 14px;
}
.is-dark .hero-btn span {
    color: #1e3a6e;
}
.hero-btn .btn-icon {
    background: white;
    color: #355594;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    padding: 8px;
}
.is-dark .hero-btn .btn-icon {
    background: #1e3a6e;
    color: white;
}





/* Affiliations Section */
.aff-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.25rem 1.5rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 10;
  margin-top: 0;
  top: -8.5rem;
  width: 90%;
  max-width: 1100px;
  left: 5%;
}
.aff-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
  display: block;
}
.aff-heading {
  font-size: 15px;
  font-weight: 600;
  color: #355594;
  display: block;
}
.aff-divider {
  width: 1px;
  height: 40px;
  background: rgba(0,0,0,0.08);
  flex-shrink: 0;
}
.aff-track-wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-width: 0;
}
.aff-track-wrap::before,
.aff-track-wrap::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 48px;
  z-index: 2;
  pointer-events: none;
}
.aff-track-wrap::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
.aff-track-wrap::after  { right: 0; background: linear-gradient(to left,  #fff, transparent); }
.scroller-track {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  animation: scroll 120s linear infinite;
  width: max-content;
}
.scroller-track:hover { animation-play-state: paused; }
.aff-logo-wrap {
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.2s ease;
}
.aff-logo-wrap:hover { background: #f3f4f6; }
.affiliate-logo {
  height: 32px;
  object-fit: contain;
  filter: grayscale(100%) opacity(0.45);
  transition: filter 0.3s ease, transform 0.3s ease;
}
.affiliate-logo:hover {
  filter: grayscale(0%) opacity(1);
  transform: scale(1.08);
}
@keyframes scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Features Section */
.features-container {
    position: relative;
    padding: 4rem 0;
}
.features-bg-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, rgba(208, 230, 248, 0.4) 0%, transparent 70%);
    z-index: -1;
    filter: blur(60px);
}
.section-eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #355594;
    opacity: 0.6;
    margin-bottom: 1rem;
    display: block;
}

.feature-card-wrapper {
    position: relative;
    height: 100%;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.feature-card-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #355594, #ABC0FF);
    border-radius: 24px;
    opacity: 0;
    filter: blur(15px);
    transition: opacity 0.4s ease;
    z-index: 0;
}
.feature-card {
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 32px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
    backdrop-filter: blur(20px);
    padding: 2.5rem;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 2px 4px -1px rgba(0, 0, 0, 0.03),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}
.feature-card :deep(.card-body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.feature-icon-container {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.5rem;
}
.icon-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #F0F7FF;
    border-radius: 32px;
    transform: rotate(45deg);
    transition: all 0.4s ease;
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.05);
}
.feature-icon {
    position: relative;
    z-index: 2;
    max-width: 64px;
    max-height: 64px;
    transition: all 0.5s ease;
}

.feature-title {
    color: #1e3a6e;
    font-weight: 800;
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
    letter-spacing: -0.5px;
}
.feature-desc {
    color: #5A6B8A;
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.feature-link {
    display: inline-flex;
    align-items: center;
    color: #355594;
    font-weight: 700;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-top: auto;
}
.feature-link span {
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}

/* Hover States - Simplified */
.feature-card-wrapper:hover {
    transform: translateY(-8px);
}
.feature-card-wrapper:hover .feature-card-glow {
    opacity: 0.3;
}
.feature-card-wrapper:hover .feature-card {
    background: white;
    border-color: #355594;
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.1);
}
.feature-card-wrapper:hover .icon-circle {
    background: #355594;
    transform: rotate(45deg) scale(1.05); /* Keep diamond shape */
}
.feature-card-wrapper:hover .feature-icon {
    filter: brightness(0) invert(1);
    transform: scale(1.1);
}
.feature-card-wrapper:hover .feature-link {
    color: #1e3a6e;
}
.feature-card-wrapper:hover .feature-link .b-icon {
    transform: translateX(5px);
}

/* Specialized Services - Product Card Layout */
.services-modern-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
}

.service-product-card {
    background: #fbfbfd;
    border-radius: 28px;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    transition: all 0.4s ease;
    border: 1px solid transparent;
}
.service-product-card:hover {
    background: #1e3a6e;
    border-color: #1e3a6e;
    transform: translateY(-5px);
    box-shadow: 0 40px 80px rgba(30, 58, 110, 0.3);
}
.service-product-card:hover .service-product-title {
    color: white;
}
.service-product-card:hover .service-product-desc {
    color: rgba(255, 255, 255, 0.85);
}
.service-product-card:hover .hero-btn,
.service-product-card:hover .service-product-btn {
    background: white;
    color: #1e3a6e;
    border-color: white;
}
.service-product-card:hover .hero-btn span,
.service-product-card:hover .service-product-btn span {
    color: #1e3a6e;
}
.service-product-card:hover .hero-btn .btn-icon {
    background: #1e3a6e;
    color: white;
}

.service-product-badge {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #5A6B8A;
    background: #F0F4F8;
    padding: 4px 12px;
    border-radius: 8px;
}

.service-product-image {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.5rem;
}
.service-product-image img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.05));
    transition: transform 0.4s ease;
}
.service-product-card:hover .service-product-image img {
    transform: scale(1.05);
}

.service-product-title {
    color: #1e3a6e;
    font-weight: 800;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
}
.service-product-desc {
    color: #5A6B8A;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    max-width: 280px;
}
.service-product-btn {
    border-radius: 999px;
    padding: 12px 28px;
    font-weight: 700;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: none;
    background: #E5E7EB;
    color: #6B7280;
}
.service-product-btn.active {
    background: #355594;
    color: white;
}
.service-product-btn.active:hover {
    background: #1e3a6e;
    transform: scale(1.05);
}

@media (max-width: 991px) {
    .services-modern-grid {
        grid-template-columns: 1fr;
    }
    .service-product-card {
        padding: 4rem 2rem;
    }
}

/* Stats Section - Minimalist */
.stats-container {
    padding: 4rem 0;
}
.stats-intro {
    padding-right: 2rem;
}
.stats-decoration-line {
    width: 60px;
    height: 4px;
    background: #355594;
    border-radius: 2px;
}

.stats-minimal-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
}

.stat-minimal-item {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    padding: 2rem;
    margin: 0 -2rem;
    border-radius: 24px;
    border-bottom: 1px solid rgba(53, 85, 148, 0.1);
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.stat-minimal-item:last-child {
    border-bottom: none;
}
.stat-minimal-item:hover {
    background: #355594;
    transform: translateX(20px);
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.15);
}

.stat-minimal-icon {
    font-size: 2.2rem;
    color: #355594;
    padding-top: 0.5rem;
    transition: all 0.4s ease;
}
.stat-minimal-item:hover .stat-minimal-icon {
    transform: scale(1.1);
    color: white;
}

.stat-minimal-number {
    font-size: 3.5rem;
    font-weight: 900;
    color: #1e3a6e;
    line-height: 1;
    margin-bottom: 0.5rem;
    letter-spacing: -2px;
    transition: all 0.4s ease;
}
.stat-minimal-item:hover .stat-minimal-number {
    color: white;
}
.stat-minimal-label {
    font-size: 1.1rem;
    font-weight: 800;
    color: #355594;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.75rem;
    transition: all 0.4s ease;
}
.stat-minimal-item:hover .stat-minimal-label {
    color: rgba(255, 255, 255, 0.9);
}
.stat-minimal-desc {
    color: #5A6B8A;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
    max-width: 500px;
    transition: all 0.4s ease;
}
.stat-minimal-item:hover .stat-minimal-desc {
    color: rgba(255, 255, 255, 0.8);
}

@media (min-width: 992px) {
    .stats-minimal-grid {
        grid-template-columns: 1fr;
    }
}

/* News Section */
.news-section-container {
    padding: 2rem 0;
}

.view-all-btn {
    display: inline-flex;
    align-items: center;
    background: #F0F7FF;
    color: #355594;
    padding: 12px 24px;
    border-radius: 999px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid #E6F0FF;
}
.view-all-btn:hover {
    background: #355594;
    color: white;
    text-decoration: none;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.1);
}

.news-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    height: 100%;
    transition: all 0.4s ease;
    border: 1px solid rgba(230, 240, 255, 0.6);
    display: flex;
    flex-direction: column;
}
.news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05);
    border-color: #355594;
}

.news-image-wrap {
    position: relative;
    height: 320px;
    overflow: hidden;
}
.news-image-wrap.small {
    height: 180px;
}
.news-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}
.news-card:hover .news-img {
    transform: scale(1.1);
}

.news-category {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(53, 85, 148, 0.9);
    color: white;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    backdrop-filter: blur(4px);
}

.news-body {
    padding: 2rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.news-card.small .news-body {
    padding: 1.5rem;
}

.news-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #9CA3AF;
    font-weight: 600;
}
.meta-dot {
    width: 4px;
    height: 4px;
    background: #D1D5DB;
    border-radius: 50%;
}

.news-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: #1e3a6e;
    line-height: 1.3;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
}
.news-title-small {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e3a6e;
    line-height: 1.4;
    margin-bottom: 1rem;
}

.news-excerpt {
    color: #5A6B8A;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.news-read-more {
    display: inline-flex;
    align-items: center;
    color: #355594;
    font-weight: 800;
    text-decoration: none;
    margin-top: auto;
}
.news-read-more .b-icon {
    font-size: 1.4rem;
}

.news-link-simple {
    color: #355594;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: underline;
    text-underline-offset: 4px;
    margin-top: auto;
}
.news-link-simple:hover {
    color: #1e3a6e;
}

/* FAQ Section - Modern Redesign */
.faq-section-container {
    padding: 2rem 0;
}

.faq-accordion-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.faq-item {
    background: white;
    border: 1px solid #E6F0FF;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
}
.faq-item:hover {
    border-color: #ABC0FF;
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.03);
}
.faq-item.is-open {
    border-color: #355594;
    box-shadow: 0 15px 30px rgba(53, 85, 148, 0.08);
}

.faq-header {
    padding: 1.75rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.faq-question {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e3a6e;
    margin: 0;
    padding-right: 2rem;
}

.faq-toggle-icon {
    position: relative;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}
.icon-line {
    position: absolute;
    background: #355594;
    transition: all 0.3s ease;
}
.icon-line.horizontal {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}
.icon-line.vertical {
    width: 2px;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}
.icon-line.vertical.is-hidden {
    transform: translateX(-50%) rotate(90deg);
    opacity: 0;
}

.faq-body {
    padding: 0 2rem 2rem;
}
.faq-body p {
    color: #5A6B8A;
    font-size: 1.05rem;
    line-height: 1.7;
    margin: 0;
}

.faq-footer-card {
    background: #F8FBFF;
    border: 1px solid #E6F0FF;
    padding: 3rem;
    border-radius: 32px;
}
.faq-footer-card h4 {
    font-weight: 800;
    color: #1e3a6e;
}
.faq-footer-card p {
    color: #5A6B8A;
    font-size: 1.1rem;
}

.faq-contact-btn {
    background: #355594;
    color: white;
    border: none;
    border-radius: 999px;
    padding: 14px 32px;
    font-weight: 700;
    transition: all 0.3s ease;
}
.faq-contact-btn:hover {
    background: #1e3a6e;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.2);
}

/* Responsive Overrides */
@media (max-width: 1199px) {
    .hero-title { font-size: 3.5rem; }
    .stat-minimal-number { font-size: 3rem; }
}

@media (max-width: 991px) {
    .hero-section { 
        display: flex; 
        flex-direction: column; 
        padding-top: 4rem;
        min-height: auto;
        position: relative;
    }
    .hero-bg-text { 
        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: clamp(4rem, 18vw, 8rem); 
        color: #ffffff;
        opacity: 0.9;
        z-index: 1;
        text-align: center;
        width: 100%;
        letter-spacing: -2px;
        line-height: 1;
        white-space: nowrap;
        pointer-events: none;
        text-shadow: 0 10px 40px rgba(53, 85, 148, 0.15);
    }
    .hero-plane-wrapper {
        order: 1;
        position: relative;
        width: 100%;
        height: 320px;
        margin: 0 auto 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }
    .hero-plane { 
        position: relative;
        top: 0;
        left: auto;
        transform: none;
        width: 85%; 
        max-width: 600px; 
        margin: 0; 
        display: block; 
        opacity: 1;
        filter: drop-shadow(0 20px 40px rgba(53, 85, 148, 0.15));
    }
    .hero-plane.is-tilted-plane {
        transform: none;
    }
    .hero-content { 
        order: 2;
        position: relative;
        top: auto;
        left: auto;
        transform: none;
        text-align: center; 
        padding: 0 2rem 4rem;
        width: 100%;
        z-index: 3;
        margin-top: -2rem;
    }
    .aff-section { 
        margin-top: 2rem !important; 
        top: 0 !important; 
        left: 5% !important;
        position: relative !important;
        margin-bottom: 4rem !important;
        flex-direction: column;
        text-align: center;
        padding: 1.5rem !important;
        gap: 1.5rem !important;
    }
    .aff-label {
        text-align: center;
    }
    .aff-divider {
        display: none;
    }
    .scroller-track {
        animation: scroll 40s linear infinite !important;
    }
    .hero-text-block { width: 100%; max-width: 800px; margin: 0 auto; }
    .hero-title { 
        font-size: clamp(2.2rem, 6vw, 3.2rem); 
        margin-bottom: 1.5rem; 
        opacity: 1 !important; 
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
    }
    .hero-subtitle { 
        font-size: 1.15rem; 
        max-width: 650px; 
        margin: 0 auto 2.5rem; 
        opacity: 1 !important; 
    }
    .cta-group { justify-content: center; }
    
    .services-modern-grid { grid-template-columns: 1fr; gap: 2rem; }
    .service-product-card { padding: 3rem 2rem; }
    
    .stats-intro { text-align: center; padding-right: 0; margin-bottom: 4rem; display: flex; flex-direction: column; align-items: center; }
    .stat-minimal-item { gap: 1.5rem; padding: 1.5rem; margin: 0; }
    .stat-minimal-number { font-size: 2.8rem; }
    
    .news-title { font-size: 1.4rem; }
    .news-image-wrap { height: 240px; }
}

@media (max-width: 767px) {
    .hero-section { padding-top: 3rem; }
    .hero-bg-text { font-size: clamp(2.5rem, 15vw, 4rem); top: 1.5rem; }
    .hero-plane-wrapper { height: 180px; margin-bottom: 1rem; }
    .hero-plane { width: 95%; }
    .hero-title { font-size: 1.8rem; margin-bottom: 1rem; }
    .hero-subtitle { font-size: 1rem; margin-bottom: 2rem; }
    .section-title { font-size: 1.8rem; }
    .section-subtitle { font-size: 1rem; }
    
    .feature-card { padding: 2rem 1.5rem; }
    .feature-icon-container { width: 80px; height: 80px; }
    .feature-icon { max-width: 40px; }
    
    .stat-minimal-item { flex-direction: column; align-items: center; text-align: center; gap: 1rem; }
    .stat-minimal-icon { padding-top: 0; }
    .stat-minimal-number { font-size: 2.5rem; letter-spacing: -1px; }
    .stat-minimal-item:hover { transform: translateY(-5px); }
    
    .news-card.featured .news-image-wrap { height: 200px; }
    .news-body { padding: 1.5rem; }
    
    .faq-question { font-size: 1rem; padding-right: 1rem; }
    .faq-header { padding: 1.25rem 1.5rem; }
    .faq-footer-card { padding: 2rem 1.5rem; }
    
    .mb-25 { margin-bottom: 4rem !important; }
}
</style>