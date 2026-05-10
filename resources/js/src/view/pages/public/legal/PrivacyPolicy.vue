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


