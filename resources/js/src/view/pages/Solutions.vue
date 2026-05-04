<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container pt-12 pb-24">
      <!-- HERO SECTION -->
      <section class="solutions-hero text-center mb-20 mt-8">
        <span class="section-eyebrow">Innovation</span>
        <h1 class="section-title">Our Solutions</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 800px;">
          At F16s E-Freight Solutions, we are more than just a logistics technology provider—we are forward thinkers who understand the evolving landscape of global trade. We’re equipping businesses with the tools they need to thrive in a digital world.
        </p>
        
        <div class="hero-decoration-wrapper mt-12">
            <div class="hero-glass-bar">
                <div class="bar-item">
                    <b-icon icon="cpu" class="me-2"></b-icon>
                    <span>Digital Literacy</span>
                </div>
                <div class="bar-divider"></div>
                <div class="bar-item">
                    <b-icon icon="diagram-3" class="me-2"></b-icon>
                    <span>Adaptable Tools</span>
                </div>
                <div class="bar-divider"></div>
                <div class="bar-item">
                    <b-icon icon="shield-check" class="me-2"></b-icon>
                    <span>Future-Ready</span>
                </div>
            </div>
        </div>
      </section>

      <!-- MAIN CONTENT PILLARS -->
      <b-row class="justify-content-center">
        <!-- PILLAR 1: DIGITAL LITERACY -->
        <b-col lg="10" class="mb-16">
          <div class="pillar-card-wrapper">
            <div class="pillar-card-glow"></div>
            <div class="pillar-card glass-card">
              <b-row align-v="center">
                <b-col md="5" class="mb-8 mb-md-0">
                  <div class="pillar-image-container">
                    <div class="pillar-icon-ring">
                      <img src="/media/custome/real-time.svg" alt="Digital Literacy Icon" class="pillar-icon-svg">
                    </div>
                  </div>
                </b-col>
                <b-col md="7">
                  <h2 class="pillar-title">Why Digital Literacy Matters</h2>
                  <p class="pillar-text">
                    The logistics industry is transforming rapidly. Digital literacy is essential for maintaining efficiency and competitiveness in global commerce. Our solutions are designed to bridge the knowledge gap, making it easy for businesses of all sizes to adopt digital practices without overwhelming complexity.
                  </p>
                  <p class="pillar-text">
                    We believe every business should leverage digital tools to simplify processes, make better decisions, and achieve operational excellence.
                  </p>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>

        <!-- PILLAR 2: FUTURE-READY -->
        <b-col lg="10" class="mb-16">
          <div class="pillar-card-wrapper">
            <div class="pillar-card-glow alt-glow"></div>
            <div class="pillar-card glass-card reversed">
              <b-row align-v="center">
                <b-col md="7" class="order-2 order-md-1">
                  <h2 class="pillar-title">Future-Ready Solutions</h2>
                  <p class="pillar-text">
                    Our commitment goes beyond current needs—we design solutions that anticipate the future. We know that the logistics industry must evolve alongside technological advances, and we are constantly innovating to create systems that grow with our clients.
                  </p>
                  <p class="pillar-text">
                    From scalable architectures to adaptive digital tools, our offerings are crafted to be as dynamic as the global freight industry itself.
                  </p>
                </b-col>
                <b-col md="5" class="order-1 order-md-2 mb-8 mb-md-0">
                  <div class="pillar-image-container">
                    <div class="pillar-icon-ring alt-ring">
                      <img src="/media/custome/automated-workflow.svg" alt="Future-Ready Icon" class="pillar-icon-svg alt-svg">
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>

        <!-- PILLAR 3: CONFIDENCE -->
        <b-col lg="10" class="mb-16">
          <div class="pillar-card-wrapper">
            <div class="pillar-card-glow"></div>
            <div class="pillar-card glass-card">
              <b-row align-v="center">
                <b-col md="5" class="mb-8 mb-md-0">
                  <div class="pillar-image-container">
                    <div class="pillar-icon-ring">
                      <img src="/media/custome/customer-support.svg" alt="Digital Confidence Icon" class="pillar-icon-svg">
                    </div>
                  </div>
                </b-col>
                <b-col md="7">
                  <h2 class="pillar-title">Building Digital Confidence</h2>
                  <p class="pillar-text">
                    Digital literacy requires support and a genuine understanding of specific needs. Our team works closely with each business to guide them through digital adoption, training them in our systems and empowering them to make technology-driven decisions.
                  </p>
                  <p class="pillar-text">
                    At F16s E-Freight Solutions, we are committed to guiding the logistics industry towards a smarter, digitally enabled future where businesses can thrive with confidence.
                  </p>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- CTA SECTION -->
      <section class="solutions-cta mt-8 text-center">
        <div class="cta-glass-card">
          <h2 class="cta-title">Ready to modernize your logistics?</h2>
          <p class="cta-subtitle mb-8">Join the network trusted for over 1,00,000+ AWBs globally.</p>
          <b-button to="/contact-us" class="hero-btn">
            <span>Get Started Now</span>
            <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
          </b-button>
        </div>
      </section>
    </b-container>
    
    </b-container>
  </b-container>
</template>

<script>

export default {
  name: "Solutions",
  components: { 
  },
  data() {
    return {};
  }
};
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
}

/* Typography Standardized */
.section-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: #1e3a8a;
    letter-spacing: -1.5px;
    margin-bottom: 0.5rem;
}
.section-subtitle {
    font-size: 1.25rem;
    color: #4A5E80;
    line-height: 1.8;
}
.section-eyebrow {
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #355594;
    opacity: 0.7;
    margin-bottom: 1.5rem;
    display: block;
}

/* Hero Decoration */
.hero-glass-bar {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 999px;
    padding: 16px 48px;
    gap: 48px;
    box-shadow: 0 10px 25px rgba(53, 85, 148, 0.05);
}
.bar-item {
    display: flex;
    align-items: center;
    color: #355594;
    font-weight: 600;
    font-size: 1rem;
}
.bar-item .b-icon {
    margin-right: 12px;
}
.bar-divider {
    width: 1px;
    height: 20px;
    background: rgba(53, 85, 148, 0.2);
}

/* Pillar Cards */
.pillar-card-wrapper {
    position: relative;
    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.pillar-card-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #355594, #ABC0FF);
    border-radius: 42px;
    opacity: 0;
    filter: blur(20px);
    transition: opacity 0.5s ease;
}
.alt-glow {
    background: linear-gradient(135deg, #1e3a6e, #6366f1);
}
.glass-card {
    position: relative;
    z-index: 1;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 40px;
    padding: 4rem;
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.08);
}
.pillar-card-wrapper:hover {
    transform: translateY(-10px);
}
.pillar-card-wrapper:hover .pillar-card-glow {
    opacity: 0.3;
}

/* Pillar Content */
.pillar-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.pillar-icon-ring {
    width: 180px;
    height: 180px;
    background: #F0F7FF;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(15deg);
    transition: all 0.5s ease;
    box-shadow: 0 15px 35px rgba(53, 85, 148, 0.1);
}
.alt-ring {
    background: #EEF2FF;
    transform: rotate(-15deg);
}
.pillar-card-wrapper:hover .pillar-icon-ring {
    transform: rotate(0deg) scale(1.05);
    background: #355594;
}
.pillar-card-wrapper:hover .pillar-icon-svg {
    filter: brightness(0) invert(1);
}
.pillar-icon-svg {
    width: 80px;
    height: 80px;
    object-fit: contain;
    transition: all 0.5s ease;
}
.pillar-title {
    font-size: 2.25rem;
    font-weight: 800;
    color: #1e3a6e;
    margin-bottom: 1.5rem;
    letter-spacing: -0.5px;
}
.pillar-text {
    font-size: 1.1rem;
    color: #5A6B8A;
    line-height: 1.8;
    margin-bottom: 1.25rem;
}

/* CTA Card */
.cta-glass-card {
    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);
    border-radius: 40px;
    padding: 5rem 2rem;
    color: white;
    box-shadow: 0 30px 60px rgba(30, 58, 138, 0.2);
}
.cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
}
.cta-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* Global Button Style (Sync with Home) */
.hero-btn {
    background: white;
    border: none;
    border-radius: 999px;
    padding: 12px 12px 12px 28px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    font-weight: 600;
    color: #1e3a6e;
}
.hero-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    background: #f8faff;
}
.hero-btn span {
    font-weight: 600;
    margin-right: 18px;
}
.hero-btn .btn-icon {
    background: #1e3a6e;
    color: white;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    padding: 8px;
}

/* Responsive Styles */
@media (max-width: 991px) {
    .section-title { font-size: 2.8rem; }
    .glass-card { padding: 3rem 2rem; }
    .pillar-title { font-size: 1.8rem; }
    .pillar-icon-ring { width: 140px; height: 140px; }
}

@media (max-width: 767px) {
    .section-title { font-size: 2.25rem; }
    .hero-glass-bar { flex-direction: column; border-radius: 24px; padding: 20px; width: 100%; }
    .bar-divider { display: none; }
    .cta-title { font-size: 1.8rem; }
    .pillar-image-container { margin-bottom: 2rem; }
}
</style>