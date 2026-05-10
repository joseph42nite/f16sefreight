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
