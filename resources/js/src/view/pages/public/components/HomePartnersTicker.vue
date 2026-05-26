<template>
    <section class="aff-section" aria-label="Our Airline Partners">
        <div class="aff-label">
            <span class="aff-eyebrow">Partners</span>
            <h2 class="aff-heading">Global Airline Affiliations</h2>
        </div>
        <div class="aff-divider"></div>
        <div class="aff-track-wrap">
            <div class="scroller-track">
                <div v-for="(img, idx) in expandedLogos" :key="idx" class="aff-logo-wrap">
                    <img :src="img" 
                         class="affiliate-logo" 
                         :class="getLogoClass(img)"
                         :alt="`Partner airline logo ${idx + 1}`"
                         loading="lazy">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "HomePartnersTicker",
    data() {
        return {
            affiliateImages: [
                "/media/assets/carriers/air-france.png",
                "/media/assets/carriers/emirates.png",
                "/media/assets/carriers/lufthansa.png",
                "/media/assets/carriers/qatar.png",
                "/media/assets/carriers/turkish-airlines.png",
                "/media/assets/carriers/Etihad-airways-logo.png",
                "/media/assets/carriers/air-india.jpg",
                "/media/assets/carriers/klm.png"
            ]
        };
    },
    computed: {
        expandedLogos() {
            let logos = [];
            for(let i = 0; i < 30; i++) {
                logos = logos.concat(this.affiliateImages);
            }
            return logos;
        }
    },
    methods: {
        getLogoClass(img) {
            const lowerImg = img.toLowerCase();
            return {
                'is-long-logo': lowerImg.includes('air-france') || lowerImg.includes('etihad'),
                'is-large-logo': lowerImg.includes('lufthansa') || lowerImg.includes('qatar'),
                'is-extra-large-logo': lowerImg.includes('air-india')
            };
        }
    }
};
</script>

<style scoped>
.aff-section {
    display: flex; align-items: center; gap: 2rem; padding: 1.25rem 1.5rem; background: #fff;
    border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; overflow: hidden;
    position: relative; z-index: 10; top: -8.5rem; width: 90%; max-width: 1100px; left: 5%;
}
.aff-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; display: block; }
.aff-heading { font-size: 15px; font-weight: 600; color: #355594; display: block; }
.aff-divider { width: 1px; height: 40px; background: rgba(0,0,0,0.08); flex-shrink: 0; }
.aff-track-wrap { flex: 1; overflow: hidden; position: relative; min-width: 0; }
.aff-track-wrap::before, .aff-track-wrap::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 48px; z-index: 2; pointer-events: none;
}
.aff-track-wrap::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
.aff-track-wrap::after  { right: 0; background: linear-gradient(to left,  #fff, transparent); }
.scroller-track { display: flex; align-items: center; gap: 2.5rem; animation: scroll 120s linear infinite; width: max-content; }
.scroller-track:hover { animation-play-state: paused; }
.aff-logo-wrap {
    padding: 6px 10px;
    border-radius: 6px;
    transition: background 0.2s ease;
}
.aff-logo-wrap:hover { background: #f3f4f6; }
.affiliate-logo { height: 32px; object-fit: contain; filter: grayscale(100%) opacity(0.45); transition: all 0.3s ease; }
.affiliate-logo.is-long-logo { height: 18px; }
.affiliate-logo.is-large-logo { height: 42px; }
.affiliate-logo.is-extra-large-logo { height: 52px; }
.affiliate-logo:hover { filter: grayscale(0%) opacity(1); transform: scale(1.08); }

@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

@media (max-width: 991px) {
    .aff-section { 
        margin-top: 2rem !important; 
        top: 0 !important; 
        left: 5% !important;
        position: relative !important;
        margin-bottom: 4rem !important;
        flex-direction: column;
        text-align: center;
        padding: 1.5rem !important;
        gap: 1.5rem !important;
    }
    .aff-label {
        text-align: center;
    }
    .aff-divider {
        display: none;
    }
    .scroller-track {
        animation: scroll 80s linear infinite !important;
    }
}
</style>
