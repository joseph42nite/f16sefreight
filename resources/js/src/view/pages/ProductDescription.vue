<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container pt-12 pb-24">
      
      <!-- FOCUS AIR MAIN CARD -->
      <section class="service-main-card mb-16">
        <div class="card-glass-body">
            <div class="card-content text-center">
                <h1 class="card-main-title">FOCUS AIR</h1>
                <p class="card-intro mb-16 mx-auto">
                    Focus Air is an expert air-freight management tool that brings advanced system operations for the global logistics and logistics providers. Our goals of air way.
                </p>

                <b-row class="product-grid justify-content-center">
                    <b-col lg="4" md="6" class="mb-12" v-for="(product, idx) in products" :key="idx">
                        <div class="inner-product-item">
                            <div class="icon-wrapper mb-4">
                                <img :src="product.icon" :alt="product.title" class="product-svg">
                            </div>
                            <h3 class="inner-title">{{ product.title }}</h3>
                            <p class="inner-desc">{{ product.description }}</p>
                        </div>
                    </b-col>
                </b-row>

                <div class="mt-12">
                    <b-button to="/contact-us" class="hero-btn">
                        <span>Contact us</span>
                        <b-icon icon="arrow-right" class="btn-icon"></b-icon>
                    </b-button>
                </div>
            </div>
        </div>
      </section>

      <!-- FOCUS ROAD MAIN CARD -->
      <section class="service-main-card mb-16">
        <div class="card-glass-body">
            <div class="card-content text-center py-10">
                <h1 class="card-main-title">FOCUS ROAD</h1>
                <div class="status-info">
                    <p class="status-label mb-2">Under development</p>
                    <p class="status-sub">For more details</p>
                </div>

                <div class="mt-12">
                    <b-button to="/contact-us" class="hero-btn">
                        <span>Contact us</span>
                        <b-icon icon="arrow-right" class="btn-icon"></b-icon>
                    </b-button>
                </div>
            </div>
        </div>
      </section>

      <!-- FOCUS SEA MAIN CARD -->
      <section class="service-main-card mb-16">
        <div class="card-glass-body">
            <div class="card-content text-center py-10">
                <h1 class="card-main-title">FOCUS SEA</h1>
                <div class="status-info">
                    <p class="status-label mb-2">Under development</p>
                    <p class="status-sub">For more details</p>
                </div>

                <div class="mt-12">
                    <b-button to="/contact-us" class="hero-btn">
                        <span>Contact us</span>
                        <b-icon icon="arrow-right" class="btn-icon"></b-icon>
                    </b-button>
                </div>
            </div>
        </div>
      </section>

    </b-container>
  </b-container>
</template>

<script>

export default {
  name: "ProductDescription",
  components: {
  },
  data() {
    return {
      products: [
        {
          title: "AWB Execution Tracker",
          description: "Maintain stock for all airlines with original history including last 100 awb clearly visible for complete operational transparency.",
          icon: "/media/custome/affordable-awb.svg"
        },
        {
          title: "Stock/AWB Management System",
          description: "Manage your waybill stock with office back history and keep real-time check on availability and usage patterns.",
          icon: "/media/custome/database-management.svg"
        },
        {
          title: "EDI Transfer to Airlines",
          description: "Stable system providing data connectivity with 150+ airlines globally for worldwide fast and accurate data transfer.",
          icon: "/media/custome/automated-workflow.svg"
        },
        {
          title: "Shipment Status Search Engine",
          description: "Easy and custom search with last search status option, checking history logs, and instant search by AWB number.",
          icon: "/media/custome/real-time.svg"
        },
        {
          title: "Tariff Rates & Features System",
          description: "Accurate and reliable tariff rates along with powerful features and tools to make informed decisions for every shipment.",
          icon: "/media/custome/scalable-performance.svg"
        }
      ]
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.main-wrapper {
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow-x: hidden;
}

/* Decorative background elements */
.decorative-ellipses .ellipse {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    z-index: 0;
    opacity: 0.4;
}
.ellipse-tl { width: 300px; height: 300px; background: #D0E6F8; top: -50px; left: -50px; }
.ellipse-tr { width: 200px; height: 200px; background: #E6F0FF; top: 15%; right: 5%; }

.content-container {
    position: relative;
    z-index: 10;
}

/* Main Service Card */
.service-main-card {
    position: relative;
    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.service-main-card:hover {
    transform: translateY(-10px) scale(1.01);
}
.card-glass-body {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 60px;
    padding: 6rem 4rem;
    position: relative;
    transition: all 0.5s ease;
    box-shadow: 0 20px 50px rgba(53, 85, 148, 0.05);
}
.service-main-card:hover .card-glass-body {
    box-shadow: 0 40px 100px rgba(53, 85, 148, 0.12);
    background: rgba(255, 255, 255, 0.85);
}

.card-content {
    position: relative;
    z-index: 1;
}

/* Large Header Title at Top */
.card-main-title {
    font-size: 8rem;
    font-weight: 900;
    color: #1e3a6e;
    opacity: 0.1;
    letter-spacing: -3px;
    margin-bottom: 2.5rem;
    line-height: 1;
    transition: all 0.5s ease;
}
.service-main-card:hover .card-main-title {
    opacity: 1;
    color: #1e3a6e;
    transform: scale(1.02);
}

.card-intro {
    font-size: 1.15rem;
    color: #5A6B8A;
    line-height: 1.8;
    max-width: 750px;
    position: relative;
    z-index: 2;
}

/* Product Grid */
.product-grid {
    margin-top: 4rem;
}
.inner-product-item {
    padding: 1rem;
}
.icon-wrapper {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.product-svg {
    width: 140px;
    height: 140px;
    object-fit: contain;
}
.inner-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e3a6e;
    margin-bottom: 0.75rem;
}
.inner-desc {
    font-size: 1rem;
    color: #7A8BA8;
    line-height: 1.6;
    max-width: 280px;
    margin: 0 auto;
}

/* Status Info (Road/Sea) */
.status-info {
    margin-top: 0;
}
.status-label {
    font-size: 1.2rem;
    font-weight: 700;
    color: #355594;
}
.status-sub {
    font-size: 1.1rem;
    color: #5A6B8A;
}

/* Hero Button Style (Standardized) */
.hero-btn {
    background: white;
    border: none;
    border-radius: 999px;
    padding: 12px 12px 12px 28px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(30, 58, 110, 0.1);
}
.hero-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(30, 58, 110, 0.2);
    background: #f8faff;
}
.hero-btn span {
    color: #1e3a6e;
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

/* Responsive */
@media (max-width: 1199px) {
    .card-main-title { font-size: 5rem; }
}
@media (max-width: 991px) {
    .card-main-title { font-size: 4rem; margin-bottom: 1rem; }
    .card-glass-body { padding: 4rem 2rem; }
}
@media (max-width: 767px) {
    .card-main-title { font-size: 3rem; }
    .product-svg { width: 100px; height: 100px; }
}
</style>
