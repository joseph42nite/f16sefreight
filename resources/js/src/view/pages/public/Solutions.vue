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
                      <img src="/media/assets/vectors/real-time.svg" alt="Digital Literacy Icon" class="pillar-icon-svg">
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
                      <img src="/media/assets/vectors/automated-workflow.svg" alt="Future-Ready Icon" class="pillar-icon-svg alt-svg">
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
                      <img src="/media/assets/vectors/customer-support.svg" alt="Digital Confidence Icon" class="pillar-icon-svg">
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
          <b-button to="/contact-us" class="hero-btn is-white">
            <span>Get Started Now</span>
            <div class="btn-icon">
                <b-icon icon="arrow-right"></b-icon>
            </div>
          </b-button>
        </div>
      </section>
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
