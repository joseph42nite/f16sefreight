<template>
  <div class="card-page-wrapper">
    <!-- Corporate Watermark Background (Matches reference image style) -->
    <div class="watermark-bg">
      <div class="watermark-row row-1">E-Freight</div>
      <div class="watermark-row row-2">Logistics</div>
      <div class="watermark-row row-3">F16s</div>
    </div>

    <!-- Official Decorative Ellipses (Light Blue Ambient Glow) -->
    <div class="decorative-ellipses">
      <div class="ellipse ellipse-tl"></div>
      <div class="ellipse ellipse-tr"></div>
      <div class="ellipse ellipse-br"></div>
      <div class="ellipse ellipse-mid"></div>
    </div>

    <!-- Main Mobile Card Wrapper -->
    <div class="digital-card-container">
      
      <!-- Graphic Header Cover Section -->
      <div class="card-cover-block">
        <!-- Abstract Logistics Flight Routes Vectors -->
        <div class="flight-paths">
          <svg viewBox="0 0 100 100" class="flight-svg" preserveAspectRatio="none">
            <path d="M-10,80 Q50,-10 110,80" stroke="rgba(255, 255, 255, 0.12)" stroke-width="0.5" fill="none"/>
            <path d="M-10,65 Q30,15 110,65" stroke="rgba(255, 255, 255, 0.08)" stroke-width="0.3" fill="none"/>
            <path d="M-10,50 Q70,25 110,50" stroke="rgba(255, 255, 255, 0.06)" stroke-width="0.2" fill="none"/>
          </svg>
        </div>
        
        <!-- climbing cargo aircraft silhouette overlay -->
        <div class="cover-plane-silhouette">
          <svg viewBox="0 0 24 24" class="plane-svg">
            <path fill="rgba(255, 255, 255, 0.06)" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l7 2.5z"/>
          </svg>
        </div>

        <!-- Upper Profile Header Strip (Matches reference layout exactly) -->
        <div class="profile-strip-header">
          <div class="strip-avatar">
            <span class="strip-initials">J</span>
          </div>
          <div class="strip-info">
            <div class="strip-name-row">
              <span class="strip-username">@joseph_ceo</span>
              <!-- Verified Badge SVG -->
              <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span class="strip-subtitle">CEO &amp; Founder | F16s E-Freight</span>
          </div>
        </div>

        <!-- Brand Logo Floating Top Right -->
        <div class="floating-brand-logo">
          <router-link to="/">
            <img src="/media/assets/logos/white-logo.png" alt="F16s" class="cover-brand-logo" @error="handleLogoError" />
          </router-link>
        </div>
      </div>

      <!-- Overlapping Frosted Lower Action Panel -->
      <div class="lower-glass-panel">
        
        <!-- Floating Quotes Icon Badge (Replicates @ badge in reference) -->
        <div class="floating-quotes-badge">
          <!-- Plane/Global Network emblem -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="badge-icon-svg">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>

        <!-- Editorial Corporate Copy -->
        <div class="editorial-text-block">
          <h2 class="editorial-name">Joseph George</h2>
          <p class="editorial-role">CEO &amp; Founder</p>
          <div class="horizontal-divider"></div>
          <p class="editorial-quote">
            "Delivering synchronized, future-ready logistics documentation and seamless airline connectivity globally."
          </p>
        </div>

        <!-- Sleek Circle Actions Grid (Interactive Circular Floating Actions) -->
        <div class="circle-actions-row">
          <a :href="whatsappUrl" target="_blank" class="circle-action-item whatsapp-accent" title="Chat on WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" class="circle-icon">
              <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 2.112.66 4.104 1.896 5.796L2.504 22l4.356-1.392c1.62.996 3.516 1.524 5.472 1.524 5.532 0 10.008-4.476 10.008-10.012C22.34 6.476 17.544 2 12.012 2zm6.276 14.196c-.288.792-1.428 1.452-1.956 1.5-1.476.132-3.264-.396-5.832-2.964-2.58-2.568-3.12-4.344-3.012-5.82.048-.528.696-1.68 1.5-1.944.252-.084.516-.132.78-.132.204 0 .42.012.6.12.18.108.348.372.48.648.336.708.828 1.956.888 2.088.072.132.096.3.012.48-.084.18-.18.3-.3.42-.12.132-.252.228-.36.36-.12.12-.252.252-.108.492.3.492.792 1.008 1.344 1.488.72.636 1.332.996 1.836 1.2.288.12.456.048.588-.084.168-.18.72-.84.912-1.128.216-.3.432-.24.72-.132.288.108 1.824.864 2.136 1.02.312.156.516.24.6.384.084.144.084.816-.204 1.608z"/>
            </svg>
          </a>

          <a :href="'tel:' + phoneNumber" class="circle-action-item default-accent" title="Call CEO">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="circle-icon-stroke">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>

          <button class="circle-action-item default-accent" @click="openEmailModal" title="Send Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="circle-icon-stroke">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </button>

          <a href="https://www.linkedin.com/in/joseph-george-b99616147/" target="_blank" class="circle-action-item linkedin-accent" title="LinkedIn Profile">
            <svg viewBox="0 0 24 24" fill="currentColor" class="circle-icon">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          <button class="circle-action-item share-accent" @click="openShareModal" title="Share Card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="circle-icon-stroke">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>

        <!-- Core Ultimate CTA Button (SASS Hero Button Style) -->
        <div class="ultimate-cta-container">
          <button class="btn-save-premium" @click="downloadVcf">
            <svg class="btn-save-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M19 13V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V13"/>
              <path d="M7 10L12 15L17 10"/>
              <path d="M12 15V3"/>
            </svg>
            Save Contact Card
          </button>
        </div>

        <!-- VIDEO INSIGHTS SECTION (New segment for video link options) -->
        <div class="video-insights-section">
          <div class="widget-header">
            <span class="widget-eyebrow">Video Insights</span>
            <h4 class="widget-title">Learn more about F16s</h4>
            <p class="section-subtitle-mini">Watch quick walk-throughs on YouTube.</p>
          </div>

          <div class="video-playlist">
            <!-- VIDEO CARD 1 -->
            <div class="video-card-item" @click="playVideo('walkthrough')">
              <div class="video-thumbnail-wrapper">
                <img src="https://img.youtube.com/vi/6jisKtE_xww/hqdefault.jpg" alt="F16s Platform Overview" class="video-thumbnail-img" />
                <div class="video-play-overlay">
                  <div class="play-btn-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="play-arrow-svg">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <span class="video-duration-badge">YouTube</span>
              </div>
              <div class="video-card-info">
                <h5 class="video-card-title">F16s Platform Walkthrough</h5>
                <p class="video-card-desc">Watch how our automated E-Freight systems manage airway bills, link HAWB to MAWB, and streamline logistics.</p>
              </div>
            </div>

            <!-- VIDEO CARD 2 -->
            <div class="video-card-item" @click="playVideo('air')">
              <div class="video-thumbnail-wrapper">
                <img src="https://img.youtube.com/vi/hIAjV4xNclo/hqdefault.jpg" alt="Focus Air in Action" class="video-thumbnail-img" />
                <div class="video-play-overlay">
                  <div class="play-btn-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="play-arrow-svg">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <span class="video-duration-badge">YouTube</span>
              </div>
              <div class="video-card-info">
                <h5 class="video-card-title">Focus Air Module Overview</h5>
                <p class="video-card-desc">See the real-time EDI airline connectivity, automated confirmations, and validation features in action.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- SPECIALIZED SERVICES (Focus Air, Sea, Road Card Design Replicated from Home Page!) -->
        <div class="services-modern-section-mobile">
          <div class="widget-header">
            <span class="widget-eyebrow">Expertise</span>
            <h4 class="widget-title">Specialized Logistics Services</h4>
          </div>

          <div class="services-modern-grid-mobile">
            
            <!-- AIR CARD -->
            <router-link to="/product-description" custom v-slot="{ navigate }">
              <article class="service-product-card-premium" @click="navigate" style="cursor: pointer;">
                <div class="service-product-image">
                  <img src="/media/assets/banners/banner-plane.webp" alt="FOCUS AIR" loading="lazy">
                </div>
                <div class="service-product-info">
                  <h3 class="service-product-title">FOCUS AIR</h3>
                  <p class="service-product-desc">The gold standard in air freight automation. Instant AWB generation, real-time EDI connectivity, and automated status updates.</p>
                  <button class="hero-btn-premium">
                    <span>Explore More</span>
                    <div class="btn-icon-premium">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="arrow-svg">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                  </button>
                </div>
              </article>
            </router-link>

            <!-- SEA CARD -->
            <router-link to="/product-description" custom v-slot="{ navigate }">
              <article class="service-product-card-premium is-coming-soon" @click="navigate" style="cursor: pointer;">
                <div class="service-product-badge">Upcoming</div>
                <div class="service-product-image">
                  <img src="/media/assets/banners/banner-ship.webp" alt="FOCUS SEA" loading="lazy">
                </div>
                <div class="service-product-info">
                  <h3 class="service-product-title">FOCUS SEA</h3>
                  <p class="service-product-desc">Streamlined ocean freight documentation and container tracking. Manage every wave of your sea logistics with one-click efficiency.</p>
                  <button class="service-product-btn-premium" disabled>
                    <span>Coming Soon</span>
                  </button>
                </div>
              </article>
            </router-link>

            <!-- ROAD CARD -->
            <router-link to="/product-description" custom v-slot="{ navigate }">
              <article class="service-product-card-premium is-coming-soon" @click="navigate" style="cursor: pointer;">
                <div class="service-product-badge">Upcoming</div>
                <div class="service-product-image">
                  <img src="/media/assets/banners/banner-truck.webp" alt="FOCUS ROAD" loading="lazy">
                </div>
                <div class="service-product-info">
                  <h3 class="service-product-title">FOCUS ROAD</h3>
                  <p class="service-product-desc">Simplified road transportation management. Handle local trucking and cross-border freight with powerful dispatching tools.</p>
                  <button class="service-product-btn-premium" disabled>
                    <span>Coming Soon</span>
                  </button>
                </div>
              </article>
            </router-link>

          </div>
        </div>

        <!-- Elegant Tiny Footer -->
        <div class="minimal-footer text-center">
          <span class="footer-tagline">Empowering Global Trade Digitally</span>
        </div>

      </div>
    </div>

    <!-- Share & QR Modal Overlay (Clean Premium Glass) -->
    <transition name="fade">
      <div v-if="shareModalOpen" class="modal-overlay" @click.self="closeShareModal">
        <div class="modal-body-glass">
          <button class="modal-close-btn" @click="closeShareModal">&times;</button>
          
          <h3 class="modal-title">Share Card</h3>
          <p class="modal-subtitle">Scan to instantly open on another phone</p>

          <!-- QR Code Container -->
          <div class="qr-container-box">
            <img :src="qrImageUrl" alt="QR Code" class="qr-code-img" />
          </div>

          <!-- Copy Link Action -->
          <div class="copy-action-box">
            <input type="text" readonly :value="shareUrl" class="copy-input" ref="shareUrlInput" @click="selectAllText" />
            <button class="copy-btn" :class="{ 'copied-success': copySuccess }" @click="copyLinkToClipboard">
              <span v-if="!copySuccess">Copy Link</span>
              <span v-else class="copied-indicator">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied!
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Video Player Modal Overlay (Real YouTube Stream) -->
    <transition name="fade">
      <div v-if="videoModalOpen" class="modal-overlay" @click.self="closeVideoModal">
        <div class="video-modal-body">
          <button class="modal-close-btn" @click="closeVideoModal">&times;</button>
          <h3 class="video-modal-title">{{ activeVideoTitle }}</h3>
          
          <div class="video-player-container">
            <iframe 
              v-if="activeYoutubeEmbedUrl"
              class="youtube-iframe-player"
              :src="activeYoutubeEmbedUrl" 
              title="F16s Corporate Video" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen>
            </iframe>
            <div v-else class="premium-player-mock">
              <div class="player-glow"></div>
              <div class="player-visual-content">
                <svg class="player-loader-icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="30 10"/>
                </svg>
                <span class="player-loading-text">Loading YouTube Stream...</span>
              </div>
            </div>
          </div>
          
          <p class="video-modal-desc">{{ activeVideoDesc }}</p>
        </div>
      </div>
    </transition>

    <!-- Email Connection Action Modal (Frosted Glassmorphic layout) -->
    <transition name="fade">
      <div v-if="emailModalOpen" class="modal-overlay" @click.self="closeEmailModal">
        <div class="modal-body-glass email-modal-card">
          <button class="modal-close-btn" @click="closeEmailModal">&times;</button>
          
          <h3 class="modal-title">Send Email</h3>
          <p class="modal-subtitle">Connect with Joseph George</p>

          <!-- Email Address Display Field with Interactive Quick-Copy -->
          <div class="email-display-container">
            <span class="email-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="badge-svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input type="text" readonly :value="emailId" class="email-address-text" ref="emailIdInput" @click="selectAllText" />
          </div>

          <div class="email-actions-grid">
            <!-- Copy Email Button -->
            <button class="email-action-option copy-option" :class="{ 'copied-success': emailCopySuccess }" @click="copyEmailToClipboard">
              <span class="option-icon">
                <svg v-if="!emailCopySuccess" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="action-icon-svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="action-icon-svg success-color">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <div class="option-text-group">
                <span class="option-label" v-if="!emailCopySuccess">Copy Email Address</span>
                <span class="option-label success-color" v-else>Email Address Copied!</span>
                <span class="option-desc">Copy to your clipboard</span>
              </div>
            </button>

            <!-- Send via Gmail -->
            <a :href="'https://mail.google.com/mail/?view=cm&fs=1&to=' + emailId" target="_blank" class="email-action-option gmail-option" @click="closeEmailModal">
              <span class="option-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" class="action-icon-svg gmail-icon">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <div class="option-text-group">
                <span class="option-label">Compose in Gmail</span>
                <span class="option-desc">Launch Gmail in browser/app</span>
              </div>
            </a>

            <!-- Send via Outlook -->
            <a :href="'https://outlook.live.com/default.aspx?rru=compose&to=' + emailId" target="_blank" class="email-action-option outlook-option" @click="closeEmailModal">
              <span class="option-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" class="action-icon-svg outlook-icon">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 0 1-.2-.25V6.8l7.25 4.53a1 1 0 0 0 1.1 0L19.8 6.8v1.2c-.1.1-.2.15-.4.25z"/>
                </svg>
              </span>
              <div class="option-text-group">
                <span class="option-label">Compose in Outlook</span>
                <span class="option-desc">Launch Outlook Web composer</span>
              </div>
            </a>

            <!-- Default Email App -->
            <a :href="'mailto:' + emailId" class="email-action-option default-option" @click="closeEmailModal">
              <span class="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="action-icon-stroke">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </span>
              <div class="option-text-group">
                <span class="option-label">Default Mail Client</span>
                <span class="option-desc">Open native mail application</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "JosephCard",
  metaInfo() {
    return {
      title: "Joseph | CEO & Founder - F16s E-Freight Solutions",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" },
        { name: "description", content: "Digital business card for Joseph, CEO & Founder of F16s E-Freight Solutions. Connect via WhatsApp, phone, email or LinkedIn instantly." },
        { property: "og:title", content: "Joseph | CEO & Founder - F16s E-Freight Solutions" },
        { property: "og:description", content: "Digital business card for Joseph. Click to save contact details instantly." },
        { property: "og:type", content: "profile" }
      ]
    };
  },
  data() {
    return {
      phoneNumber: "7011363516",
      emailId: "joseph@f16sefreight.com",
      whatsappUrl: "https://wa.me/917011363516?text=Hi%20Joseph%2C%20I%20accessed%20your%20digital%20card%20and%20would%20like%20to%20connect.",
      shareModalOpen: false,
      emailModalOpen: false,
      copySuccess: false,
      emailCopySuccess: false,
      shareUrl: "",
      videoModalOpen: false,
      activeVideoTitle: "",
      activeVideoDesc: "",
      activeYoutubeEmbedUrl: ""
    };
  },
  computed: {
    qrImageUrl() {
      const encodedUrl = encodeURIComponent(this.shareUrl);
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&color=355594&bgcolor=ffffff&qzone=2`;
    }
  },
  mounted() {
    this.shareUrl = window.location.origin + "/joseph-ceo-938204719284";
    document.body.classList.add("digital-card-active");
  },
  destroyed() {
    document.body.classList.remove("digital-card-active");
  },
  methods: {
    handleLogoError(e) {
      e.target.src = "/media/assets/logos/blue-logo.png";
    },
    downloadVcf() {
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Joseph CEO F16s;;;;",
        "FN:Joseph CEO F16s",
        "ORG:F16s E-Freight Solutions",
        "TITLE:CEO & Founder",
        "TEL;TYPE=CELL,VOICE;VALUE=uri:tel:+917011363516",
        "EMAIL;TYPE=PREF,INTERNET:joseph@f16sefreight.com",
        "URL:https://f16sefreight.com",
        "URL;type=LinkedIn:https://www.linkedin.com/in/joseph-george-b99616147/",
        "X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/in/joseph-george-b99616147/",
        "NOTE:Saved from F16s Digital Business Card.",
        "REV:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        "END:VCARD"
      ].join("\r\n");

      const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
      
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "Joseph_CEO_F16s.vcf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    openShareModal() {
      this.shareModalOpen = true;
      this.copySuccess = false;
    },
    closeShareModal() {
      this.shareModalOpen = false;
    },
    playVideo(type) {
      if (type === "walkthrough") {
        this.activeVideoTitle = "F16s Platform Walkthrough";
        this.activeVideoDesc = "Discover how F16s E-Freight Solutions provides direct airline integrations, automated manifest validations, and streamlined digital AWB management.";
        this.activeYoutubeEmbedUrl = "https://www.youtube.com/embed/6jisKtE_xww?autoplay=1&rel=0";
      } else {
        this.activeVideoTitle = "Focus Air Module Overview";
        this.activeVideoDesc = "Watch F16s Focus Air flagship module in action. See how forwarders book capacity and confirm EDI details in seconds.";
        this.activeYoutubeEmbedUrl = "https://www.youtube.com/embed/hIAjV4xNclo?autoplay=1&rel=0&start=30";
      }
      this.videoModalOpen = true;
    },
    closeVideoModal() {
      this.videoModalOpen = false;
      this.activeYoutubeEmbedUrl = ""; // Instantly silences audio and stops play
    },
    selectAllText(event) {
      event.target.select();
    },
    copyLinkToClipboard() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.shareUrl)
          .then(() => {
            this.showCopyFeedback();
          })
          .catch(() => {
            this.fallbackCopy();
          });
      } else {
        this.fallbackCopy();
      }
    },
    fallbackCopy() {
      try {
        const input = this.$refs.shareUrlInput;
        input.select();
        document.execCommand("copy");
        this.showCopyFeedback();
      } catch (err) {
        console.error("Failed to copy link", err);
      }
    },
    showCopyFeedback() {
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 2500);
    },
    openEmailModal() {
      this.emailModalOpen = true;
      this.emailCopySuccess = false;
    },
    closeEmailModal() {
      this.emailModalOpen = false;
    },
    copyEmailToClipboard() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.emailId)
          .then(() => {
            this.showEmailCopyFeedback();
          })
          .catch(() => {
            this.fallbackEmailCopy();
          });
      } else {
        this.fallbackEmailCopy();
      }
    },
    fallbackEmailCopy() {
      try {
        const input = this.$refs.emailIdInput;
        input.select();
        document.execCommand("copy");
        this.showEmailCopyFeedback();
      } catch (err) {
        console.error("Failed to copy email", err);
      }
    },
    showEmailCopyFeedback() {
      this.emailCopySuccess = true;
      setTimeout(() => {
        this.emailCopySuccess = false;
      }, 2500);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Main Wrapper Settings */
.card-page-wrapper {
  background: linear-gradient(180deg, #D0E6F8 0%, #FFFFFF 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3.5rem 1rem;
}

/* Ensure buttons and inputs inherit the Inter font */
button, input {
  font-family: inherit;
}

/* Watermark Background (Replicates background styling of the reference image) */
.watermark-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  user-select: none;
}
.watermark-row {
  font-size: 8vw;
  font-weight: 900;
  color: rgba(53, 85, 148, 0.04);
  letter-spacing: 1.5rem;
  white-space: nowrap;
  text-transform: uppercase;
}

/* Decorative ellipses (Light Blue Ambient Glow) */
.decorative-ellipses {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.decorative-ellipses .ellipse {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}
.ellipse-tl { width: 400px; height: 400px; background: #D0E6F8; top: -100px; left: -100px; }
.ellipse-tr { width: 300px; height: 300px; background: #E6F0FF; top: 20%; right: -50px; }
.ellipse-br { width: 500px; height: 500px; background: #F0F7FF; bottom: 10%; left: 20%; }
.ellipse-mid { width: 600px; height: 600px; background: #e8f2ff; top: 45%; left: -200px; }

/* Digital Card container (Frosted Glass phone container mockup) */
.digital-card-container {
  width: 100%;
  max-width: 430px;
  background: #ffffff;
  border-radius: 40px;
  box-shadow: 0 30px 70px rgba(53, 85, 148, 0.12),
              0 0 100px rgba(53, 85, 148, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.8);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card Cover Block */
.card-cover-block {
  height: 290px;
  position: relative;
  background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);
  overflow: hidden;
  padding: 1.5rem;
}

.flight-paths {
  position: absolute;
  inset: 0;
  opacity: 0.65;
  z-index: 1;
}
.flight-svg {
  width: 100%;
  height: 100%;
}

.cover-plane-silhouette {
  position: absolute;
  right: -5%;
  bottom: 0%;
  width: 250px;
  height: 250px;
  opacity: 0.85;
  z-index: 1;
  transform: rotate(-15deg);
}
.plane-svg {
  width: 100%;
  height: 100%;
}

/* Floating Brand Logo Top Right */
.floating-brand-logo {
  position: absolute;
  top: 1.8rem;
  right: 1.8rem;
  z-index: 5;
}
.cover-brand-logo {
  height: 38px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
}

/* Upper Profile Header Strip (Matches reference layout exactly) */
.profile-strip-header {
  position: absolute;
  top: 1.8rem;
  left: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 5;
}
.strip-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: radial-gradient(135deg, #ffffff 0%, #e0ebff 100%);
  border: 2px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}
.strip-initials {
  font-size: 1.25rem;
  font-weight: 900;
  background: linear-gradient(135deg, #355594 0%, #1e3a6e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.strip-info {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}
.strip-name-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.strip-username {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.verified-icon {
  width: 14px;
  height: 14px;
  color: #38bdf8;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
}
.strip-subtitle {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.2px;
}

/* Overlapping Frosted Lower Action Panel */
.lower-glass-panel {
  margin-top: -50px;
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-top: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 36px 36px 0 0;
  padding: 2.2rem 1.8rem 1.8rem 1.8rem;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 5;
  box-shadow: 0 -15px 30px rgba(53, 85, 148, 0.03);
}

/* Floating Quotes Icon Badge (Replicates @ badge from reference) */
.floating-quotes-badge {
  position: absolute;
  top: -26px;
  left: 2.2rem;
  width: 52px;
  height: 52px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(53, 85, 148, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #355594;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.9);
  transition: transform 0.3s ease;
}
.floating-quotes-badge:hover {
  transform: rotate(15deg) scale(1.05);
}
.badge-icon-svg {
  width: 24px;
  height: 24px;
}

/* Editorial Corporate Copy */
.editorial-text-block {
  margin-bottom: 2rem;
  text-align: left;
}
.editorial-name {
  font-size: 2.5rem;
  font-weight: 900;
  color: #355594;
  letter-spacing: -1.2px;
  line-height: 1;
  margin-bottom: 0.3rem;
}
.editorial-role {
  font-size: 1.1rem;
  font-weight: 600;
  color: #5A6B8A;
  letter-spacing: 0.5px;
  margin-bottom: 1.1rem;
}
.horizontal-divider {
  width: 44px;
  height: 3px;
  background: #355594;
  border-radius: 2px;
  margin-bottom: 1.2rem;
}
.editorial-quote {
  font-size: 1.15rem;
  font-weight: 500;
  color: #1e3a6e;
  line-height: 1.6;
  letter-spacing: -0.2px;
}

/* Sleek Circle Actions Grid (Interactive Circular Floating Actions) */
.circle-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.2rem;
  padding: 0 0.2rem;
}
.circle-action-item {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}
.circle-icon {
  width: 24px;
  height: 24px;
}
.circle-icon-stroke {
  width: 24px;
  height: 24px;
}

/* Custom visual accenting for interactive floating rings */
.default-accent {
  background: rgba(53, 85, 148, 0.04);
  border-color: rgba(53, 85, 148, 0.08);
  color: #355594;
  box-shadow: 0 4px 10px rgba(53, 85, 148, 0.03);
}
.default-accent:hover {
  transform: translateY(-4px) scale(1.06);
  background: #355594;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(53, 85, 148, 0.25);
}

.whatsapp-accent {
  background: rgba(16, 185, 129, 0.04);
  border-color: rgba(16, 185, 129, 0.08);
  color: #10b981;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.03);
}
.whatsapp-accent:hover {
  transform: translateY(-4px) scale(1.06);
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.25);
}

.linkedin-accent {
  background: rgba(10, 102, 194, 0.04);
  border-color: rgba(10, 102, 194, 0.08);
  color: #0a66c2;
  box-shadow: 0 4px 10px rgba(10, 102, 194, 0.03);
}
.linkedin-accent:hover {
  transform: translateY(-4px) scale(1.06);
  background: #0a66c2;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(10, 102, 194, 0.25);
}

.share-accent {
  background: rgba(90, 107, 138, 0.04);
  border-color: rgba(90, 107, 138, 0.08);
  color: #5A6B8A;
  box-shadow: 0 4px 10px rgba(90, 107, 138, 0.03);
  outline: none;
}
.share-accent:hover {
  transform: translateY(-4px) scale(1.06);
  background: #5A6B8A;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(90, 107, 138, 0.25);
}

/* Core Ultimate CTA Button (SASS Hero Button Style) */
.ultimate-cta-container {
  margin-bottom: 2.2rem;
}
.btn-save-premium {
  width: 100%;
  background-color: #355594;
  background: #355594;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 15px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(53, 85, 148, 0.2);
}
.btn-save-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(53, 85, 148, 0.25);
  background: #ffffff !important;
  background-color: #ffffff !important;
  color: #355594;
  border-color: #355594;
}
.btn-save-premium:active {
  transform: translateY(1px);
}
.btn-save-icon {
  width: 22px;
  height: 22px;
}

/* Video Insights Section */
.video-insights-section {
  margin-bottom: 2.5rem;
  text-align: left;
}
.section-subtitle-mini {
  font-size: 0.85rem;
  color: #5A6B8A;
  margin-top: 0.25rem;
  margin-bottom: 1.2rem;
  line-height: 1.5;
}
.video-playlist {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.video-card-item {
  background: #ffffff;
  border: 1px solid rgba(53, 85, 148, 0.08);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(53, 85, 148, 0.02);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
}
.video-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(53, 85, 148, 0.08);
  border-color: rgba(53, 85, 148, 0.15);
}
.video-thumbnail-wrapper {
  height: 180px;
  position: relative;
  background: #0f172a;
  overflow: hidden;
}
.video-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  transition: transform 0.4s ease;
}
.video-card-item:hover .video-thumbnail-img {
  transform: scale(1.03);
}
.video-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.25);
  transition: background 0.3s ease;
}
.video-card-item:hover .video-play-overlay {
  background: rgba(15, 23, 42, 0.4);
}
.play-btn-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #ffffff;
  color: #355594;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0,0,0,0.25);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.video-card-item:hover .play-btn-circle {
  transform: scale(1.12);
  background: #355594;
  color: #ffffff;
}
.play-arrow-svg {
  width: 22px;
  height: 22px;
  margin-left: 2px;
}
.video-duration-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}
.video-card-info {
  padding: 1.1rem;
}
.video-card-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #355594;
  margin-bottom: 0.3rem;
}
.video-card-desc {
  font-size: 0.78rem;
  color: #5A6B8A;
  line-height: 1.4;
}

/* Specialized Services - Replicated from Homepage */
.services-modern-section-mobile {
  margin-bottom: 2.2rem;
  text-align: left;
}
.services-modern-grid-mobile {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-top: 1.2rem;
}
.service-product-card-premium {
  background: #fbfbfd;
  border-radius: 28px;
  padding: 2.2rem 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(53, 85, 148, 0.05);
  box-shadow: 0 4px 10px rgba(53, 85, 148, 0.02);
}
.service-product-card-premium .service-product-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #5A6B8A;
  background: #F0F4F8;
  padding: 4px 10px;
  border-radius: 6px;
}
.service-product-card-premium .service-product-image {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
}
.service-product-card-premium .service-product-image img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.05));
  transition: transform 0.4s ease;
}
.service-product-card-premium .service-product-title {
  color: #355594;
  font-weight: 800;
  font-size: 1.35rem;
  margin-bottom: 0.6rem;
  letter-spacing: -0.5px;
}
.service-product-card-premium .service-product-desc {
  color: #5A6B8A;
  font-size: 0.85rem;
  line-height: 1.6;
  margin-bottom: 1.4rem;
  max-width: 280px;
}
.service-product-btn-premium {
  border-radius: 999px;
  padding: 10px 22px;
  font-weight: 700;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  border: none;
  background: #E5E7EB;
  color: #6B7280;
  display: inline-flex;
  align-items: center;
}
.hero-btn-premium {
  background-color: #355594;
  background: #355594;
  border: none;
  border-radius: 999px;
  padding: 10px 10px 10px 22px;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 6px 15px rgba(53, 85, 148, 0.15);
}
.hero-btn-premium span {
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
}
.hero-btn-premium .btn-icon-premium {
  background: white;
  color: #355594;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.hero-btn-premium .btn-icon-premium svg {
  width: 12px;
  height: 12px;
}

/* Hover States (Inverting to brand navy just like home page!) */
.service-product-card-premium:hover {
  background: #355594;
  border-color: #355594;
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(30, 58, 110, 0.2);
}
.service-product-card-premium:hover .service-product-title {
  color: white;
}
.service-product-card-premium:hover .service-product-desc {
  color: rgba(255, 255, 255, 0.85);
}
.service-product-card-premium:hover .service-product-image img {
  transform: scale(1.05);
}
.service-product-card-premium:hover .hero-btn-premium {
  background: white !important;
  background-color: white !important;
  color: #355594 !important;
}
.service-product-card-premium:hover .hero-btn-premium span {
  color: #355594 !important;
}
.service-product-card-premium:hover .hero-btn-premium .btn-icon-premium {
  background: #355594 !important;
  color: white !important;
  transform: translateX(2px);
}

/* Widget Header styles */
.widget-header {
  margin-bottom: 1.2rem;
  text-align: left;
}
.widget-eyebrow {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #5A6B8A;
  letter-spacing: 1px;
}
.widget-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #355594;
}

/* Elegant Tiny Footer */
.minimal-footer {
  margin-top: auto;
  padding-top: 1rem;
}
.footer-tagline {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #94a3b8;
  background: linear-gradient(135deg, #5a6b8a, #355594);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Modal Overlay Styling (Clean Premium Glass) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(42, 68, 118, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Glassmorphism Modal Body */
.modal-body-glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 32px;
  width: 100%;
  max-width: 400px;
  padding: 2.2rem 1.8rem;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Video Player Modal mock styling */
.video-modal-body {
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 32px;
  width: 100%;
  max-width: 500px;
  padding: 2.2rem 1.8rem;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25);
  text-align: left;
  position: relative;
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.video-modal-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #355594;
  margin-bottom: 1.2rem;
  padding-right: 1.5rem;
}
.video-player-container {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 20px;
  overflow: hidden;
  background: #000;
  margin-bottom: 1.2rem;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.premium-player-mock {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1e3a6e 0%, #090e1a 100%);
  position: relative;
}
.player-visual-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  z-index: 5;
  color: #ffffff;
}
.player-loader-icon {
  width: 32px;
  height: 32px;
  color: #38bdf8;
}
.player-loading-text {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.85;
}
.video-modal-desc {
  font-size: 0.85rem;
  color: #5A6B8A;
  line-height: 1.5;
}
.youtube-iframe-player {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
.animate-spin {
  animation: spin 1.2s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scaleIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #5A6B8A;
  cursor: pointer;
  transition: color 0.2s ease;
  outline: none;
}
.modal-close-btn:hover {
  color: #355594;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #355594;
  margin-bottom: 0.4rem;
}
.modal-subtitle {
  font-size: 0.85rem;
  color: #5A6B8A;
  margin-bottom: 1.8rem;
}

/* QR Code Box */
.qr-container-box {
  position: relative;
  display: inline-flex;
  padding: 1rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(53, 85, 148, 0.08);
  margin-bottom: 1.8rem;
  border: 1px solid rgba(53, 85, 148, 0.06);
}
.qr-code-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  display: block;
}

/* Copy Link block styling */
.copy-action-box {
  display: flex;
  background: rgba(53, 85, 148, 0.03);
  border: 1px solid rgba(53, 85, 148, 0.08);
  border-radius: 16px;
  overflow: hidden;
  padding: 4px;
}
.copy-input {
  background: transparent;
  border: none;
  outline: none;
  color: #5A6B8A;
  font-size: 0.85rem;
  padding: 0 0.8rem;
  flex-grow: 1;
  width: 10px;
}
.copy-btn {
  background: #355594;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.copy-btn:hover {
  background: #2a4476;
}
.copied-success {
  background: #10b981 !important;
}
.copied-indicator {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.check-icon {
  width: 14px;
  height: 14px;
}

/* Vue Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Desktop Wrapper Layout Enhancement */
@media (min-width: 500px) {
  .card-page-wrapper {
    background: radial-gradient(circle at 20% 20%, #D0E6F8 0%, #ffffff 100%);
    align-items: center;
    padding: 3rem 1rem;
  }
  .digital-card-container {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 
      0 30px 60px rgba(53, 85, 148, 0.12),
      0 0 100px rgba(53, 85, 148, 0.05);
  }
}

/* Email Modal Custom Styles */
.email-modal-card {
  max-width: 420px !important;
}
.email-display-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(53, 85, 148, 0.05);
  border: 1px solid rgba(53, 85, 148, 0.12);
  border-radius: 16px;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
}
.email-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #355594;
  flex-shrink: 0;
}
.badge-svg {
  width: 1.25rem;
  height: 1.25rem;
}
.email-address-text {
  border: none;
  background: none;
  font-size: 0.95rem;
  font-weight: 700;
  color: #2a4476;
  width: 100%;
  outline: none;
  padding: 0;
  margin: 0;
  cursor: text;
}
.email-actions-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.email-action-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  border-radius: 16px;
  background: #ffffff;
  border: 1.5px solid rgba(53, 85, 148, 0.08);
  text-decoration: none !important;
  color: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%;
  text-align: left;
  outline: none;
}
.email-action-option:hover {
  transform: translateY(-2px);
  border-color: rgba(53, 85, 148, 0.2);
  box-shadow: 0 6px 16px rgba(53, 85, 148, 0.06);
}
.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  flex-shrink: 0;
  transition: all 0.25s ease;
}
.action-icon-svg {
  width: 1.25rem;
  height: 1.25rem;
}
.action-icon-stroke {
  width: 1.25rem;
  height: 1.25rem;
}

/* Colors and Icon styles */
.copy-option .option-icon {
  background: rgba(53, 85, 148, 0.08);
  color: #355594;
}
.copy-option:hover .option-icon {
  background: #355594;
  color: #ffffff;
}
.gmail-option .option-icon {
  background: rgba(234, 67, 53, 0.08);
  color: #EA4335;
}
.gmail-option:hover .option-icon {
  background: #EA4335;
  color: #ffffff;
}
.outlook-option .option-icon {
  background: rgba(0, 120, 215, 0.08);
  color: #0078D7;
}
.outlook-option:hover .option-icon {
  background: #0078D7;
  color: #ffffff;
}
.default-option .option-icon {
  background: rgba(16, 185, 129, 0.08);
  color: #10B981;
}
.default-option:hover .option-icon {
  background: #10B981;
  color: #ffffff;
}

.option-text-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
}
.option-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: #355594;
  transition: color 0.25s ease;
}
.option-desc {
  font-size: 0.72rem;
  color: #5A6B8A;
}
.success-color {
  color: #10B981 !important;
}
.copy-option.copied-success {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.02);
}
</style>
