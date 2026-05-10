<template>
    <section class="stats-container mb-25" aria-labelledby="stats-heading">
        <b-row align-v="center">
            <b-col lg="4" class="mb-12 mb-lg-0">
                <div class="stats-intro">
                    <span class="section-eyebrow">Our Impact</span>
                    <h2 id="stats-heading" class="section-title">Redefining Logistics Standards</h2>
                    <p class="section-subtitle mt-4">We are driving the future of logistics through advanced automation and global EDI connectivity.</p>
                    <div class="stats-decoration-line mt-8"></div>
                </div>
            </b-col>
            <b-col lg="8">
                <div class="stats-minimal-grid">
                    <div v-for="(stat, key) in statsData" :key="key" class="stat-minimal-item" :ref="`statRef-${key}`">
                        <div class="stat-minimal-icon">
                            <b-icon :icon="stat.icon" aria-hidden="true"></b-icon>
                        </div>
                        <div class="stat-minimal-info">
                            <div class="stat-minimal-number">
                                {{ formatStat(animatedStats[key], key) }}{{ stat.suffix }}
                            </div>
                            <h3 class="stat-minimal-label">{{ stat.label }}</h3>
                            <p class="stat-minimal-desc">{{ stat.description }}</p>
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
    </section>
</template>

<script>
export default {
    name: "HomeStatsSection",
    data() {
        return {
            animatedStats: { awbs: 0, airlines: 0, speed: 0 },
            hasAnimatedStats: { awbs: false, airlines: false, speed: false },
            statsData: {
                awbs: { label: "AWBs Processed", target: 100000, suffix: "", icon: "file-earmark-check", description: "Our robust EDI engine has successfully processed over 1,0,000 Air Waybills, providing unmatched reliability for freight forwarders globally." },
                airlines: { label: "Airlines", target: 150, suffix: "+", icon: "cursor", description: "Seamlessly connect with 150+ airlines via our direct EDI integrations. No more manual entry—just instant, accurate data transmission to any carrier." },
                speed: { label: "Processing Speed", target: 3, suffix: " sec", icon: "lightning-charge", description: "Experience lightning-fast operations. Our platform automates complex documentation, reducing manual entry time from minutes to just 3 seconds per AWB." }
            },
        };
    },
    methods: {
        formatStat(value, key) {
            if (key === 'awbs') {
                return value.toLocaleString('en-IN');
            }
            return value.toLocaleString();
        },
        animateStat(key) {
            const target = this.statsData[key].target;
            const duration = 2000;
            const steps = duration / 20;
            const increment = target / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    this.animatedStats[key] = target;
                    clearInterval(timer);
                } else {
                    this.animatedStats[key] = Math.floor(current);
                }
            }, 20);
        },
        isElementInViewport(element) {
            if(!element) return false;
            const rect = element.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
        },
        checkVisibility() {
            Object.keys(this.statsData).forEach(key => {
                const element = this.$refs[`statRef-${key}`] ? this.$refs[`statRef-${key}`][0] : null;
                if (element && !this.hasAnimatedStats[key] && this.isElementInViewport(element)) {
                    this.animateStat(key);
                    this.hasAnimatedStats[key] = true;
                }
            });
            if (!Object.values(this.hasAnimatedStats).every(v => v)) {
                this.animationFrameId = requestAnimationFrame(() => this.checkVisibility());
            }
        }
    },
    mounted() {
        this.animationFrameId = requestAnimationFrame(() => this.checkVisibility());
    },
    beforeDestroy() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
};
</script>


