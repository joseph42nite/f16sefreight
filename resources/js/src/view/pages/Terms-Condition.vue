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
      <section class="terms-hero text-center mb-16 mt-8">
        <span class="section-eyebrow">Legal Framework</span>
        <h1 class="section-title">Terms of Service</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 800px;">
          Please read these terms carefully. By accessing or using the F16s portal, you agree to be bound by these legally binding terms and conditions.
        </p>
      </section>

      <!-- UNIFIED TERMS CARD -->
      <div class="unified-terms-wrapper">
        <div class="terms-glass-card">
          <div class="terms-inner-content">
            
            <div class="terms-section">
              <h3 class="terms-h3">1. Scope of Service</h3>
              <p>F16s E-Freight Solutions ("F16s") provides a technical infrastructure and software platform designed to facilitate freight documentation and data transmission. F16s acts solely as a technology provider and does not operate as a carrier, freight forwarder, or logistics agent.</p>
            </div>

            <div class="terms-section highlight-section">
              <h3 class="terms-h3">2. Absolute Client Responsibility & Data Integrity</h3>
              <p><strong>The Client assumes full and exclusive responsibility</strong> for all data, information, and documentation uploaded to or transmitted through the F16s portal. This includes, but is not limited to, the accuracy, completeness, and legality of Air Waybills (AWB), House Waybills (HAWB), and manifest data.</p>
              <ul class="bullet-list">
                <li><strong>No Manual Verification:</strong> F16s does not perform manual checks, audits, or validation of user-submitted data. Any automated validation provided is for convenience only and does not relieve the Client of their duty to ensure data accuracy.</li>
                <li><strong>Liability Waiver:</strong> F16s shall not be liable for any errors, omissions, or misstatements in data transmitted to airlines, customs authorities, or third-party logistics providers.</li>
                <li><strong>Transmission Risks:</strong> The Client acknowledges that data transmission is subject to external network conditions; F16s is responsible only for providing the technical interface and addressing internal software concerns.</li>
              </ul>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">3. Limitation of Liability</h3>
              <p>To the maximum extent permitted by law, F16s, its directors, and employees shall not be liable for any direct, indirect, incidental, special, or consequential damages, including but not limited to loss of profits, cargo delays, customs fines, or business interruptions arising out of the use or inability to use the portal.</p>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">4. Indemnification</h3>
              <p>The Client agrees to indemnify, defend, and hold harmless F16s from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorney's fees) arising from the Client's violation of these terms or any third-party claims related to data transmitted by the Client.</p>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">5. Intellectual Property</h3>
              <p>All platform software, proprietary algorithms, user interface designs, and the "F16s" brand are the exclusive property of F16s E-Freight Solutions. No license is granted to reverse engineer, replicate, or redistribute the platform's logic or assets.</p>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">6. Technical Support & Uptime</h3>
              <p>F16s commits to maintaining the technical integrity of the portal and addressing software-related malfunctions. However, F16s does not guarantee uninterrupted access and is not liable for downtime caused by maintenance, ISP failures, or force majeure events.</p>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">7. Governing Law</h3>
              <p>These terms shall be governed and construed in accordance with the laws of the jurisdiction in which F16s E-Freight Solutions is registered, without regard to its conflict of law provisions.</p>
            </div>

          </div>
        </div>
      </div>

      <!-- FOOTER NOTE -->
      <div class="text-center mt-12">
        <p class="footer-note">
          Last Updated: May 3, 2026 • <router-link to="/contact-us">Request Legal Clarification</router-link>
        </p>
      </div>
    </b-container>
  </b-container>
</template>

<script>
export default {
    name: "Terms-Condition"
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
}
.ellipse-tl { width: 400px; height: 400px; background: #D0E6F8; top: -100px; left: -100px; }
.ellipse-tr { width: 300px; height: 300px; background: rgba(53, 85, 148, 0.1); top: 100px; right: -50px; }
.ellipse-br { width: 500px; height: 500px; background: rgba(53, 85, 148, 0.05); bottom: -150px; right: 10%; }

.content-container {
    position: relative;
    z-index: 1;
}

/* Hero Styles */
.section-eyebrow {
    color: #355594;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    display: block;
    margin-bottom: 1rem;
}

.section-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: #1e3a6e;
    letter-spacing: -1px;
}

.section-subtitle {
    font-size: 1.25rem;
    color: #5A6B8A;
    line-height: 1.6;
}

/* Unified Terms Card */
.unified-terms-wrapper {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
    border-radius: 32px;
    box-shadow: 0 40px 100px rgba(53, 85, 148, 0.1);
}

.terms-glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 31px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.terms-inner-content {
    padding: 4rem;
}

.terms-section {
    margin-bottom: 3rem;
}

.terms-section:last-child {
    margin-bottom: 0;
}

.terms-h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1e3a6e;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
}

.terms-section p {
    font-size: 1.05rem;
    line-height: 1.8;
    color: #4A5568;
    margin-bottom: 1.5rem;
}

/* Highlight Section (Critical Liability) */
.highlight-section {
    background: rgba(53, 85, 148, 0.03);
    padding: 2.5rem;
    border-radius: 20px;
    border-left: 4px solid #355594;
}

.bullet-list {
    list-style: none;
    padding: 0;
}

.bullet-list li {
    position: relative;
    padding-left: 1.75rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.6;
    color: #4A5568;
}

.bullet-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #355594;
    font-weight: 800;
    font-size: 1.5rem;
    top: -5px;
}

.footer-note {
    color: #818498;
    font-size: 0.95rem;
}

.footer-note a {
    color: #355594;
    font-weight: 600;
    text-decoration: none;
}

@media (max-width: 991px) {
    .section-title { font-size: 2.5rem; }
    .terms-inner-content { padding: 2.5rem; }
    .highlight-section { padding: 1.5rem; }
}
</style>