<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container pb-25">
      <!-- ABOUT US & VISION SECTION -->
      <section class="about-hero-section mt-12 mt-lg-20 mb-20">
        <b-row align-v="stretch">
          <b-col lg="6" class="mb-12 mb-lg-0 d-flex flex-column justify-content-center">
            <span class="section-eyebrow">About Us</span>
            <h1 class="section-title mb-6">Transforming Logistics Management</h1>
            <p class="section-subtitle mb-8">
              At F16s E-Freight Solutions, we are dedicated to transforming logistics management by offering seamless, cost-effective digital solutions tailored to meet the needs of small to medium-sized businesses in the logistics and freight forwarding sectors. 
            </p>
            <p class="section-subtitle">
              With a core focus on accessibility and user-friendliness, we empower businesses by streamlining data transfer, documentation, and tracking processes across air, sea, and road freight modes.
            </p>
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
        <b-row>
            <b-col cols="12" class="text-center mb-16">
                <span class="section-eyebrow">Expertise</span>
                <h2 class="section-title">Our Specialized Products</h2>
                <p class="section-subtitle mt-4">High-performance solutions for every freight challenge.</p>
            </b-col>
        </b-row>
        <div class="services-modern-grid">
            <article 
                v-for="(offer, index) in we_offer_section_cards" 
                :key="index" 
                class="service-product-card"
            >
                <div class="service-product-image">
                    <img :src="offer.imgSrc" :alt="offer.imgAlt">
                </div>
                <div class="service-product-info">
                    <h3 class="service-product-title">{{ offer.imgAlt }}</h3>
                    <p class="service-product-desc">{{ offer.text }}</p>
                    <b-button to="/product-description" class="hero-btn">
                        <span>Explore More</span>
                        <b-icon icon="arrow-right" class="btn-icon" aria-hidden="true"></b-icon>
                    </b-button>
                </div>
            </article>
        </div>
      </section>

      <!-- WHY CHOOSE US -->
      <section class="mb-25">
        <b-row class="justify-content-center">
            <b-col cols="12" class="text-center mb-16">
                <span class="section-eyebrow">Advantages</span>
                <h2 class="section-title">Why Choose Us?</h2>
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
            <img src="/media/custome/about/bottom-img.png" alt="Our Story Background" class="story-bg-img">
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

export default {
    name: "AboutUs",
    components: {
    },
    data() {
        return {
            we_offer_section_cards: [
                {
                    titleImgSrc: "/media/custome/about/focus-air.svg",
                    imgSrc: "/media/custome/about/plane.png",
                    imgAlt: "FOCUS AIR",
                    text: "Streamline your air freight data with seamless airline connectivity and real-time insights.",
                },
                {
                    titleImgSrc: "/media/custome/about/focus-sea.svg",
                    imgSrc: "/media/custome/about/boat.png",
                    imgAlt: "FOCUS SEA",
                    text: "Simplify sea freight management with efficient stock control and sales analysis.",
                },
                {
                    titleImgSrc: "/media/custome/about/focus-road.svg",
                    imgSrc: "/media/custome/about/truck.png",
                    imgAlt: "FOCUS ROAD",
                    text: "Manage road freight documentation and bookings with ease, complete with secure data transfers.",
                },
            ],
            chooseUsItems: [
                {
                    icon: "/media/custome/about/choose-us-1.svg",
                    title: "Innovative Technology for Small Businesses",
                    desc: "Our technology solutions are built with the needs of small enterprises in mind. From database solutions to a basic ERP system, F16s equips you with the tools to track your growth month on month, helping you identify areas for improvement and operational enhancements."
                },
                {
                    icon: "/media/custome/about/choose-us-2.svg",
                    title: "Affordable and Scalable",
                    desc: "We understand the unique challenges small businesses face in logistics. Our pricing options are crafted to be budget-friendly, providing essential tools in our Basic plan like database management and printable documentation, while our Pro plan connects businesses to multiple AWBs and adds advanced features to support growing needs."
                },
                {
                    icon: "/media/custome/about/choose-us-3.svg",
                    title: "Commitment to Customer Support",
                    desc: "Our team is committed to helping you succeed. We offer dedicated support and resources for all our clients, ensuring that each business can leverage our platform to the fullest. We’re here to provide guidance, answer questions, and assist in adapting our solutions to meet your specific needs."
                }
            ]
        };
    },
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
    padding-top: 0;
}

/* Typography */
.section-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e3a6e;
    letter-spacing: -0.5px;
    line-height: 1.2;
}
.section-subtitle {
    font-size: 1.15rem;
    color: #5A6B8A;
    font-weight: 400;
    line-height: 1.7;
}
.section-eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #355594;
    opacity: 0.8;
    margin-bottom: 0.75rem;
    display: block;
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
    backdrop-filter: blur(20px);
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
.service-product-card:hover .hero-btn {
    background: white;
}
.service-product-card:hover .hero-btn span {
    color: #1e3a6e;
}
.service-product-card:hover .hero-btn .btn-icon {
    background: #1e3a6e;
    color: white;
}

.service-product-image {
    height: 180px;
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
.is-dark .service-product-title {
    color: white;
}
.service-product-desc {
    color: #5A6B8A;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    max-width: 280px;
}
.is-dark .service-product-desc {
    color: rgba(255, 255, 255, 0.85);
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

/* Hero Button */
.hero-btn {
    background: #355594;
    border: none;
    border-radius: 999px;
    padding: 10px 10px 10px 22px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    cursor: pointer;
}
.hero-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.25);
    background: #28447a;
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
    font-weight: 600;
    font-size: 1rem;
}
.is-dark .hero-btn span {
    color: #1e3a6e;
}
.hero-btn .btn-icon {
    background: white;
    color: #355594;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    padding: 8px;
    margin-left: 14px;
}
.is-dark .hero-btn .btn-icon {
    background: #1e3a6e;
    color: white;
}

/* Media Queries */
@media (max-width: 991px) {
    .section-title {
        font-size: 2rem;
    }
    .vision-content {
        padding: 2rem;
        margin-top: 2rem;
    }
    .story-overlay {
        padding: 3rem 2rem;
    }
}
@media (max-width: 767px) {
    .section-title {
        font-size: 1.85rem;
    }
    
    /* Mobile Carousel Implementation */
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
    
    /* Remove scrollbar visibility while keeping functionality */
    .services-modern-grid::-webkit-scrollbar {
        display: none;
    }
    
    .service-product-card {
        flex: 0 0 85%; /* Larger card size on mobile */
        scroll-snap-align: center;
        padding: 4rem 2.5rem;
        background: white; /* Make cards pop on mobile */
        box-shadow: 0 15px 35px rgba(53, 85, 148, 0.1);
    }
    
    .service-product-card:hover {
        transform: none; /* Disable hover lift on mobile to prevent jitter */
    }

    .story-overlay {
        padding: 2rem 1.5rem;
    }
    .story-text {
        font-size: 1rem;
    }
}
</style>