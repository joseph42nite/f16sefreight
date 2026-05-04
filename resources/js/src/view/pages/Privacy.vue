<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container pt-12 pb-24">
      <!-- HERO -->
      <section class="privacy-hero text-center mb-16 mt-8">
        <span class="section-eyebrow">Your Privacy, Our Priority</span>
        <h1 class="section-title">Privacy</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 800px;">
          At F16s, we take your privacy seriously. We ensure that your sensitive business information is handled with the highest level of confidentiality and care. Our privacy practices include:
        </p>
        
        <!-- VIDEO PLACEHOLDER -->
        <div class="video-placeholder-wrap mt-10">
          <div class="video-placeholder">
            <div class="video-placeholder-glow"></div>
            <div class="play-btn">
              <b-icon icon="play-fill" class="play-icon"></b-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES GRID -->
      <section class="privacy-features mb-25 mt-16">
        <b-row class="justify-content-center text-center">
          <!-- Strict Access Controls -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8">
                  <div class="icon-circle"></div>
                  <img src="/media/custome/strict-access.svg" alt="Strict Access Controls" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Strict Access Controls</h3>
                <p class="feature-desc mt-3">We implement stringent access controls, ensuring only authorized personnel can view or manage your data. This ensures that your business information stays private and protected.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Privacy Regulations -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8">
                  <div class="icon-circle"></div>
                  <img src="/media/custome/privacy-regu.svg" alt="Privacy Regulations" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Privacy Regulations</h3>
                <p class="feature-desc mt-3">F16s adheres to global data privacy standards, such as GDPR and other local regulations, guaranteeing that your business stays compliant with the laws in your region.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Data Encryption -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8">
                  <div class="icon-circle"></div>
                  <img src="/media/custome/data-encription.svg" alt="Data Encryption" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Data Encryption</h3>
                <p class="feature-desc mt-3">All data transmitted through our systems is encrypted, ensuring that it remains secure from unauthorized access at all times.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Transparent Data Handling -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8">
                  <div class="icon-circle"></div>
                  <img src="/media/custome/trasparent-data.svg" alt="Transparent Data Handling" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Transparent Data Handling</h3>
                <p class="feature-desc mt-3">We are transparent about how we collect, use, and store your information. You can trust that your data is used solely for operational purposes, with no unnecessary exposure.</p>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- CTA SECTION -->
      <section class="privacy-cta-section mb-25 text-center">
        <div class="feature-card-wrapper cta-wrapper">
            <div class="feature-card-glow"></div>
            <div class="feature-card cta-card align-items-center">
              <h2 class="section-title">Concerned about Privacy?</h2>
              <p class="section-subtitle mt-4 mb-8" style="max-width: 800px;">
                Contact us to learn more about how F16s protects your business data and maintains your privacy.
              </p>
              
              <b-button to="/contact-us" class="hero-btn">
                <span>Contact us</span>
                <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
              </b-button>
            </div>
        </div>
      </section>

      <!-- FAQS -->
      <section class="privacy-faq-section mb-16">
        <div class="text-center mb-12">
            <h2 class="section-title">FAQs</h2>
        </div>
        <b-row class="justify-content-center">
          <b-col lg="8">
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
          </b-col>
        </b-row>
      </section>

    </b-container>
  </b-container>
</template>

<script>

export default {
  name: "Privacy",
  components: { },
  data() {
    return {
      accordions: [
        { title: "Who has access to my company's sensitive data?", content: "At F16s, we implement strict role-based access controls. Only explicitly authorized personnel within your organization and our essential security team can access specific data points.", isOpen: false },
        { title: "Is my data shared with third parties or airlines?", content: "Your data is used exclusively for processing your requested freight operations. We never sell, share, or expose your business intelligence to third parties without your direct operational intent.", isOpen: false },
        { title: "How does F16s comply with global privacy regulations?", content: "We adhere to international data protection standards, including GDPR. Our systems are designed with privacy-by-design principles to ensure compliance across different global regions.", isOpen: false },
        { title: "Can I request permanent deletion of my data?", content: "Yes, upon account closure or specific request, we provide permanent data deletion services in accordance with our data retention policies and legal requirements.", isOpen: false }
      ]
    }
  },
  methods: {
    toggleAccordion(index) {
        this.accordions[index].isOpen = !this.accordions[index].isOpen;
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
}

/* Typography Standardized */
.section-title {
    font-size: 3rem;
    font-weight: 800;
    color: #1e3a8a;
    letter-spacing: -1px;
    margin-bottom: 0.5rem;
}
.section-subtitle {
    font-size: 1.15rem;
    color: #4A5E80;
    line-height: 1.6;
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

/* Hero Button */
.hero-btn {
    background: #355594;
    border: none;
    border-radius: 999px;
    padding: 10px 10px 10px 22px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    text-decoration: none;
}
.hero-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.25);
    color: white;
}
.hero-btn span {
    color: white;
    font-weight: 500;
    margin-right: 14px;
}
.hero-btn .btn-icon {
    background: white;
    color: #355594;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    padding: 8px;
}

/* Video Placeholder (Standardized) */
.video-placeholder-wrap {
    position: relative;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}
.video-placeholder {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
    backdrop-filter: blur(10px);
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
}
.video-placeholder-glow {
    position: absolute;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(53, 85, 148, 0.2) 0%, transparent 70%);
    filter: blur(40px);
}
.play-btn {
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    z-index: 2;
}
.play-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 15px 30px rgba(53, 85, 148, 0.2);
}
.play-icon {
    color: #355594;
    font-size: 2rem;
    margin-left: 5px;
}

/* Feature Cards (Glassmorphism) */
.feature-card-wrapper {
    position: relative;
    height: 100%;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.feature-card-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #355594, #ABC0FF);
    border-radius: 34px;
    opacity: 0;
    filter: blur(15px);
    transition: opacity 0.4s ease;
    z-index: 0;
}
.feature-card {
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 32px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
    backdrop-filter: blur(20px);
    padding: 2.5rem;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 
        0 4px 10px rgba(0, 0, 0, 0.02),
        inset 0 0 0 1px rgba(255, 255, 255, 0.6);
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
    margin: 0 auto 2.5rem auto;
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
.feature-icon-svg {
    position: relative;
    z-index: 2;
    color: #355594;
    transition: all 0.5s ease;
}
.feature-icon {
    width: 64px;
    height: 64px;
    object-fit: contain;
    position: relative;
    z-index: 2;
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

/* Hover States */
.feature-card-wrapper:hover {
    transform: translateY(-8px);
}
.feature-card-wrapper:hover .feature-card-glow {
    opacity: 0.25;
}
.feature-card-wrapper:hover .feature-card {
    background: rgba(255, 255, 255, 0.95);
    border-color: #ABC0FF;
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.1);
}
.feature-card-wrapper:hover .icon-circle {
    background: #355594;
    transform: rotate(45deg) scale(1.05);
}
.feature-card-wrapper:hover .feature-icon-svg {
    color: white;
}
.feature-card-wrapper:hover .feature-icon {
    filter: brightness(0) invert(1);
}

/* CTA Specific (Copied from SB) */
.cta-wrapper {
    max-width: 900px;
    margin: 0 auto;
}
.cta-card {
    padding: 4rem 2rem;
    text-align: center;
}

/* FAQs Specific */
.faq-accordion-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.faq-item {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
}
.faq-item:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: #ABC0FF;
}
.faq-item.is-open {
    border-color: #355594;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);
}
.faq-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}
.faq-question {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e3a6e;
    margin: 0;
    padding-right: 2rem;
}
.faq-toggle-icon {
    position: relative;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
.icon-line {
    position: absolute;
    background-color: #355594;
    transition: transform 0.3s ease, opacity 0.3s ease;
    border-radius: 2px;
}
.icon-line.horizontal {
    width: 20px;
    height: 2px;
    top: 9px;
    left: 0;
}
.icon-line.vertical {
    width: 2px;
    height: 20px;
    top: 0;
    left: 9px;
}
.icon-line.vertical.is-hidden {
    transform: scaleY(0);
    opacity: 0;
}
.faq-body {
    padding: 0 1.5rem 1.5rem;
    color: #4A5E80;
    line-height: 1.7;
}
.faq-body p {
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .section-title {
        font-size: 2.25rem;
    }
    .feature-card {
        padding: 1.5rem;
    }
}
</style>
