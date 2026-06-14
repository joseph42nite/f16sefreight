<template>
  <b-container fluid class="main-wrapper p-0">
    <decorative-ellipses></decorative-ellipses>

    <b-container class="content-container pb-25">
      <!-- ABOUT US & VISION SECTION -->
      <section class="about-hero-section mt-12 mt-lg-20 mb-20">
        <b-row align-v="stretch">
          <b-col lg="6" class="mb-12 mb-lg-0 d-flex flex-column justify-content-center">
            <section-header 
                align="left" 
                eyebrow="About Us" 
                title="Transforming Logistics Management" 
                tag="h1"
                marginBottom="0"
            >
                <template #subtitle>
                    At F16s E-Freight Solutions, we are dedicated to transforming logistics management by offering seamless, cost-effective digital solutions tailored to meet the needs of small to medium-sized businesses in the logistics and freight forwarding sectors. 
                    <br><br>
                    With a core focus on accessibility and user-friendliness, we empower businesses by streamlining data transfer, documentation, and tracking processes across air, sea, and road freight modes.
                </template>
            </section-header>
          </b-col>
          <b-col lg="6" class="d-flex flex-column justify-content-center">
            <div class="vision-card">
               <div class="vision-glow"></div>
               <div class="vision-content">
                  <span class="section-eyebrow">Our Vision</span>
                  <h2 class="vision-title mb-4">Empowering Global Trade</h2>
                  <p class="vision-text">
                    Our vision is to become the go-to digital partner for logistics businesses worldwide. We aim to empower small and growing companies to achieve greater efficiency and cost savings, enabling them to scale seamlessly. By providing reliable, intuitive tools and affordable service options, we’re making it easier for businesses of all sizes to thrive in today’s competitive landscape.
                  </p>
               </div>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- WHAT WE OFFER -->
      <section class="services-carousel-section mb-25">

        <home-services-grid />
      </section>

      <!-- WHY CHOOSE US -->
      <section class="mb-25">
        <b-row class="justify-content-center">
            <b-col cols="12">
                <section-header eyebrow="Advantages" title="Why Choose Us?" />
            </b-col>
            <b-col lg="4" md="6" class="mb-8" v-for="(item, idx) in chooseUsItems" :key="idx">
                <div class="choose-us-item text-center">
                    <div class="choose-us-icon-wrapper mx-auto mb-6">
                        <img :src="item.icon" :alt="item.title" class="img-fluid" />
                    </div>
                    <h3 class="choose-us-title mb-4">{{ item.title }}</h3>
                    <p class="choose-us-desc">{{ item.desc }}</p>
                </div>
            </b-col>
        </b-row>
      </section>

      <!-- OUR STORY -->
      <section class="story-section mb-20">
        <div class="story-card">
            <picture>
                <source srcset="/media/assets/illustrations/bottom-img.webp" type="image/webp">
                <img src="/media/assets/illustrations/bottom-img.png" alt="Our Story Background" class="story-bg-img" loading="lazy">
            </picture>
            <div class="story-overlay">
                <span class="section-eyebrow text-white opacity-75">Origins</span>
                <h2 class="section-title text-white mb-6">Our Story</h2>
                <p class="story-text">
                    Founded in Bangalore, F16s E-Freight Solutions emerged from the combined knowledge and expertise of a freight-forwarding genius and a seasoned expert in the airline industry. Together, they envisioned a digital platform that would address the unique challenges faced by small and mid-sized logistics companies, who often lack access to the advanced tools available to larger players.
                </p>
                <p class="story-text mt-4">
                    Recognizing the high cost and complexity of existing logistics solutions, they set out to create an affordable, easy-to-use platform tailored to empower businesses of all sizes. Their shared vision was to streamline logistics processes, enhance efficiency, and make sophisticated freight management accessible to everyone.
                </p>
            </div>
        </div>
      </section>

    </b-container>
  </b-container>
</template>

<script>
import DecorativeEllipses from "./components/DecorativeEllipses.vue";
import SectionHeader from "./components/SectionHeader.vue";
import HeroButton from "./components/HeroButton.vue";
import HomeServicesGrid from "./components/HomeServicesGrid.vue";

export default {
    name: "AboutUs",
    metaInfo: {
        title: "About F16s | Our Vision for Digital Freight Forwarding",
        meta: [
            { name: 'description', content: 'Learn about F16s E-Freight Solutions, dedicated to transforming logistics management for small and medium-sized businesses with innovative, affordable digital tools.' },
            { property: 'og:title', content: 'About F16s | Our Vision for Digital Freight Forwarding' },
            { property: 'og:description', content: 'Learn about F16s E-Freight Solutions, dedicated to transforming logistics management for small and medium-sized businesses with innovative, affordable digital tools.' }
        ]
    },
    components: {
        DecorativeEllipses,
        SectionHeader,
        HeroButton,
        HomeServicesGrid
    },
    data() {
        return {
            we_offer_section_cards: [
                {
                    titleImgSrc: "/media/assets/vectors/focus-air.svg",
                    imgSrc: "/media/assets/banners/banner-plane.webp",
                    imgAlt: "FOCUS AIR",
                    text: "Streamline your air freight data with seamless airline connectivity and real-time insights.",
                },
                {
                    titleImgSrc: "/media/assets/vectors/focus-sea.svg",
                    imgSrc: "/media/assets/banners/banner-ship.webp",
                    imgAlt: "FOCUS SEA",
                    text: "Simplify sea freight management with efficient stock control and sales analysis.",
                },
                {
                    titleImgSrc: "/media/assets/vectors/focus-road.svg",
                    imgSrc: "/media/assets/banners/banner-truck.webp",
                    imgAlt: "FOCUS ROAD",
                    text: "Manage road freight documentation and bookings with ease, complete with secure data transfers.",
                },
            ],
            chooseUsItems: [
                {
                    icon: "/media/assets/vectors/choose-us-1.svg",
                    title: "Innovative Technology for Scalable Operations",
                    desc: "Our technology solutions are built with scalability in mind. From database solutions to a basic ERP system, F16s equips you with the tools to track your growth month on month, helping you identify areas for improvement and operational enhancements as you scale."
                },
                {
                    icon: "/media/assets/vectors/choose-us-2.svg",
                    title: "Affordable and Scalable",
                    desc: "We understand the unique challenges businesses face when scaling operations in logistics. Our pricing options are crafted to be scalable, providing essential tools in our Basic plan like database management and printable documentation, while our Pro plan connects businesses to multiple AWBs and adds advanced features to support expanding needs."
                },
                {
                    icon: "/media/assets/vectors/choose-us-3.svg",
                    title: "Commitment to Customer Support",
                    desc: "Our team is committed to helping you succeed. We offer dedicated support and resources for all our clients, ensuring that each business can leverage our platform to the fullest. We’re here to provide guidance, answer questions, and assist in adapting our solutions to meet your specific needs."
                }
            ]
        };
    },
};
</script>

<style scoped>
.content-container {
    position: relative;
    z-index: 10;
    padding-top: 0;
}

/* Vision Card */
.vision-card {
    position: relative;
    height: 100%;
}
.vision-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #355594, #ABC0FF);
    border-radius: 32px;
    opacity: 0.4;
    filter: blur(15px);
    z-index: 0;
}
.vision-content {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 32px;
    padding: 3rem;
    height: 100%;
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.05);
}
.vision-title {
    font-size: 2rem;
    font-weight: 800;
    color: #1e3a6e;
    letter-spacing: -0.5px;
}
.vision-text {
    font-size: 1.1rem;
    color: #4A5E80;
    line-height: 1.8;
}



/* Choose Us Grid */
.choose-us-item {
    padding: 2rem 1.5rem;
    background: transparent;
    transition: all 0.3s ease;
    border-radius: 24px;
    height: 100%;
}
.choose-us-item:hover {
    background: rgba(255,255,255,0.6);
    box-shadow: 0 10px 30px rgba(53,85,148,0.03);
}
.choose-us-icon-wrapper {
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.08);
    transition: transform 0.3s ease;
}
.choose-us-item:hover .choose-us-icon-wrapper {
    transform: translateY(-5px);
}
.choose-us-icon-wrapper img {
    width: 40px;
    height: 40px;
}
.choose-us-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e3a6e;
    line-height: 1.4;
}
.choose-us-desc {
    font-size: 1rem;
    color: #5A6B8A;
    line-height: 1.7;
}

/* Our Story */
.story-card {
    position: relative;
    border-radius: 32px;
    overflow: hidden;
    min-height: 400px;
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.15);
}
.story-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}
.story-overlay {
    position: relative;
    z-index: 2;
    background: linear-gradient(90deg, rgba(30, 58, 110, 0.95) 0%, rgba(30, 58, 110, 0.7) 100%);
    padding: 4rem 3rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.story-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.15rem;
    line-height: 1.8;
    max-width: 800px;
}

@media (max-width: 991px) {
    .vision-content {
        padding: 2rem;
        margin-top: 2rem;
    }
    .story-overlay {
        padding: 3rem 2rem;
    }
}
@media (max-width: 767px) {
    .services-modern-grid {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 24px;
        padding: 20px 20px 40px 20px;
        margin-left: -20px;
        margin-right: -20px;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
    }
    .services-modern-grid::-webkit-scrollbar { display: none; }
    .service-product-card {
        flex: 0 0 85%;
        scroll-snap-align: center;
        padding: 4rem 2.5rem;
        background: white;
        box-shadow: 0 15px 35px rgba(53, 85, 148, 0.1);
    }
    .story-overlay { padding: 2rem 1.5rem; }
    .story-text { font-size: 1rem; }
}
</style>