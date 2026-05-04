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
        <span class="section-eyebrow">Data Governance</span>
        <h1 class="section-title">Privacy Policy</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 800px;">
          F16s E-Freight Solutions is committed to the highest standards of data protection. This policy outlines how we handle, process, and safeguard your operational intelligence.
        </p>
      </section>

      <!-- UNIFIED PRIVACY CARD -->
      <div class="unified-terms-wrapper">
        <div class="terms-glass-card">
          <div class="terms-inner-content">
            
            <div class="terms-section">
              <h3 class="terms-h3">1. F16s as a Data Processor</h3>
              <p>The Client acknowledges that F16s operates primarily as a <strong>Data Processor</strong> under relevant data protection laws (including GDPR where applicable). The Client remains the <strong>Data Controller</strong> of all freight-related information uploaded to the portal, including shipper and consignee details.</p>
            </div>

            <div class="terms-section highlight-section">
              <h3 class="terms-h3">2. Information Collection & Operational Scope</h3>
              <p>We collect and process data strictly necessary for the fulfillment of freight documentation and transmission services. This includes:</p>
              <ul class="bullet-list">
                <li><strong>User Account Data:</strong> Names, corporate email addresses, and authentication credentials.</li>
                <li><strong>Logistics Data:</strong> Air Waybill (AWB) details, manifest information, flight numbers, and cargo descriptions.</li>
                <li><strong>Technical Logs:</strong> IP addresses and access timestamps for security auditing and fraud prevention.</li>
              </ul>
              <p><strong>Note:</strong> F16s does not sell or lease Client data to any third-party marketing entities under any circumstances.</p>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">3. Data Security & Encryption</h3>
              <p>We implement industry-standard technical and organizational measures to protect Client data. All data transmissions between the Client and the F16s portal are secured via <strong>TLS/SSL encryption</strong>. Data at rest is stored in secure, redundant cloud environments with restricted physical and digital access.</p>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">4. Disclosure to Third Parties</h3>
              <p>F16s discloses Client data only to the following entities, and solely for operational purposes:</p>
              <ul class="bullet-list">
                <li><strong>Carriers & Airlines:</strong> To facilitate the transmission of e-AWB and manifest data.</li>
                <li><strong>Customs Authorities:</strong> When required by international law or specific route regulations.</li>
                <li><strong>Legal Requirements:</strong> When compelled by a court order or authorized governmental inquiry.</li>
              </ul>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">5. Data Retention & Deletion</h3>
              <p>Client data is retained for the duration of the service agreement and for a period thereafter as required by international freight regulations and tax laws. Upon termination of service and fulfillment of legal retention obligations, F16s will securely purge or anonymize Client data upon written request.</p>
            </div>

            <div class="terms-section highlight-section">
              <h3 class="terms-h3">6. Client Compliance Warranty</h3>
              <p>By using the platform, the Client warrants that they have obtained all necessary consents from third parties (including shippers, consignees, and employees) whose personal or corporate data is uploaded to F16s. The Client agrees to indemnify F16s against any claims arising from the Client's failure to secure such consents.</p>
            </div>

            <div class="terms-section">
              <h3 class="terms-h3">7. Policy Updates</h3>
              <p>F16s reserves the right to modify this Privacy Policy to reflect changes in legal requirements or platform functionality. Continued use of the portal after such changes constitutes acceptance of the revised policy.</p>
            </div>

          </div>
        </div>
      </div>

      <!-- FOOTER NOTE -->
      <div class="text-center mt-12">
        <p class="footer-note">
          Effective Date: May 3, 2026 • <router-link to="/contact-us">Data Protection Inquiry</router-link>
        </p>
      </div>
    </b-container>
  </b-container>
</template>

<script>
export default {
    name: "PrivacyPolicy"
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
