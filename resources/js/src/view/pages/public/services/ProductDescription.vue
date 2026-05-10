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

                <b-row v-if="isReady" class="product-grid justify-content-center">
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

                <!-- SKELETON LOADER GRID (Shown while loading) -->
                <div v-if="!isReady" class="skeleton-grid-container mt-16">
                    <b-row class="justify-content-center">
                        <b-col lg="4" md="6" class="mb-12" v-for="n in 3" :key="n">
                            <div class="skeleton-product-item">
                                <div class="skeleton-icon mb-4"></div>
                                <div class="skeleton-line title mb-3"></div>
                                <div class="skeleton-line text"></div>
                                <div class="skeleton-line text short"></div>
                            </div>
                        </b-col>
                    </b-row>
                </div>

                <div class="mt-12">
                    <b-button to="/contact-us" class="hero-btn">
                        <span>Contact us</span>
                        <div class="btn-icon">
                            <b-icon icon="arrow-right"></b-icon>
                        </div>
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
                        <div class="btn-icon">
                            <b-icon icon="arrow-right"></b-icon>
                        </div>
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
                        <div class="btn-icon">
                            <b-icon icon="arrow-right"></b-icon>
                        </div>
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
          icon: "/media/assets/vectors/affordable-awb.webp"
        },
        {
          title: "Stock/AWB Management System",
          description: "Manage your waybill stock with office back history and keep real-time check on availability and usage patterns.",
          icon: "/media/assets/vectors/database-management.webp"
        },
        {
          title: "EDI Transfer to Airlines",
          description: "Stable system providing data connectivity with 150+ airlines globally for worldwide fast and accurate data transfer.",
          icon: "/media/assets/vectors/automated-workflow.webp"
        },
        {
          title: "Shipment Status Search Engine",
          description: "Easy and custom search with last search status option, checking history logs, and instant search by AWB number.",
          icon: "/media/assets/vectors/real-time.webp"
        },
        {
          title: "Tariff Rates & Features System",
          description: "Accurate and reliable tariff rates along with powerful features and tools to make informed decisions for every shipment.",
          icon: "/media/assets/vectors/scalable-performance.webp"
        }
      ],
      isReady: false
    };
  },
  mounted() {
    // Artificial delay to ensure assets are ready and show smooth skeleton
    setTimeout(() => {
      this.isReady = true;
    }, 600);
  }
};
</script>


