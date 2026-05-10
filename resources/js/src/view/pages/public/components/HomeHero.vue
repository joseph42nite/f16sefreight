<template>
    <section class="hero-section" aria-labelledby="hero-heading">
        <!-- HERO SKELETON (Shown until first image is ready) -->
        <div v-if="!imagesReady[0]" class="hero-skeleton-wrapper" aria-hidden="true">
            <div class="hero-skeleton-text"></div>
            <div class="hero-skeleton-image"></div>
        </div>

        <!-- HERO CONTENT (Shown once ready) -->
        <template v-else>
            <transition name="hero-slide">
                <div :key="heroServices[currentHeroIndex].title" class="hero-bg-text" aria-hidden="true">{{ heroServices[currentHeroIndex].title }}</div>
            </transition>
            <div class="hero-plane-wrapper">
                <transition name="hero-slide">
                    <img :key="heroServices[currentHeroIndex].image"
                         :src="heroServices[currentHeroIndex].image" 
                         :style="heroServices[currentHeroIndex].extraStyle" 
                         alt="Digital freight logistics solutions" 
                         :class="['hero-plane', { 'is-tilted-plane': heroServices[currentHeroIndex].title === 'FOCUS AIR' }]"
                         :fetchpriority="currentHeroIndex === 0 ? 'high' : 'low'">
                </transition>
            </div>
        </template>

        <div class="hero-content">
            <div class="hero-text-block">
                <h1 id="hero-heading" class="hero-title">Smart e-Freight Solutions for Freight Forwarders</h1>
                <p class="hero-subtitle">
                    Eliminate manual entry frustrations. Process <strong>MAWB and HAWB in under 3 seconds</strong>, seamlessly connect with <strong>150+ airlines globally</strong>, and join the network trusted for over <strong>1,0,000+ AWBs</strong>.
                </p>
                <b-button to="/about-us" class="hero-btn" aria-label="Explore our logistics solutions">
                    <span>Explore Now</span>
                    <div class="btn-icon">
                        <b-icon icon="arrow-right" aria-hidden="true"></b-icon>
                    </div>
                </b-button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "HomeHero",
    data() {
        return {
            currentHeroIndex: 0,
            heroInterval: null,
            imagesReady: [false, false, false],
            heroServices: [
                { title: 'FOCUS AIR', image: '/media/assets/banners/banner-plane.webp', extraStyle: {} },
                { title: 'FOCUS SEA', image: '/media/assets/banners/banner-ship.webp', extraStyle: {} },
                { title: 'FOCUS ROAD', image: '/media/assets/banners/banner-truck.webp', extraStyle: { marginTop: '40px' } }
            ],
        };
    },
    mounted() {
        // First image: inject a real <link rel="preload"> in the <head> for fastest possible load
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = this.heroServices[0].image;
        preloadLink.type = 'image/webp';
        document.head.appendChild(preloadLink);

        // Mark first image ready immediately — don't block on onload
        this.$set(this.imagesReady, 0, true);

        // Preload remaining slides in background
        this.heroServices.slice(1).forEach((service, i) => {
            const img = new Image();
            img.onload = () => {
                this.$set(this.imagesReady, i + 1, true);
            };
            img.src = service.image;
        });

        // Hero slideshow interval
        this.heroInterval = setInterval(() => {
            const nextIndex = (this.currentHeroIndex + 1) % this.heroServices.length;
            if (this.imagesReady[nextIndex]) {
                this.currentHeroIndex = nextIndex;
            }
        }, 4000);
    },
    beforeDestroy() {
        if (this.heroInterval) {
            clearInterval(this.heroInterval);
        }
    }
};
</script>


