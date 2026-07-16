<template>
    <section id="blogs-section" class="news-section-container mb-25" aria-labelledby="news-heading">
        <b-row class="mb-16 align-items-end">
            <b-col lg="8" class="text-center text-lg-left mb-6 mb-lg-0">
                <span class="section-eyebrow">Insights</span>
                <h2 id="news-heading" class="section-title">Latest Logistics News & Insights</h2>
                <p class="section-subtitle mt-4 mx-auto mx-lg-0" style="max-width: 600px;">Stay updated with the evolving landscape of global trade and freight technology.</p>
            </b-col>
            <b-col lg="4" class="text-center text-lg-right">
                <b-link to="/blogs-and-news" class="view-all-btn" aria-label="View all logistics news articles">
                    <span>View All News</span>
                    <b-icon icon="arrow-right" class="ms-2" aria-hidden="true"></b-icon>
                </b-link>
            </b-col>
        </b-row>

        <div class="news-modern-grid">
            <!-- Featured Post -->
            <div class="news-featured-wrapper">
                <article class="news-card featured" @click="$router.push('/blog/' + featuredPost.slug)" style="cursor: pointer;">
                    <div class="news-image-wrap">
                        <img :src="featuredPost.image" class="news-img" :alt="featuredPost.title">
                        <div class="news-category">{{ featuredPost.category }}</div>
                    </div>
                    <div class="news-body">
                        <div class="news-meta">
                            <time :datetime="featuredPost.date" class="news-date">{{ featuredPost.date }}</time>
                            <span class="meta-dot"></span>
                            <span class="news-author">F16s Editorial</span>
                        </div>
                        <h3 class="news-title">{{ featuredPost.title }}</h3>
                        <p class="news-excerpt">{{ featuredPost.excerpt }}</p>
                        <b-link :to="'/blog/' + featuredPost.slug" class="news-read-more" aria-label="Read full article">
                            <span>Read Full Article</span>
                            <b-icon icon="plus" class="ms-1" aria-hidden="true"></b-icon>
                        </b-link>
                    </div>
                </article>
            </div>
            
            <!-- Small Posts -->
            <div class="news-small-cards-wrapper">
                <div class="news-small-item" v-for="(news, idx) in newsItems" :key="idx">
                    <article class="news-card small" @click="$router.push('/blog/' + news.slug)" style="cursor: pointer;">
                        <div class="news-image-wrap small">
                            <img :src="news.image" class="news-img" :alt="news.title">
                            <div class="news-category">{{ news.category }}</div>
                        </div>
                        <div class="news-body">
                            <div class="news-meta">
                                <span class="news-date">{{ news.date }}</span>
                            </div>
                            <h4 class="news-title-small">{{ news.title }}</h4>
                            <b-link :to="'/blog/' + news.slug" class="news-link-simple" :aria-label="`Read more about ${news.title}`">Read More</b-link>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { blogs as fallbackBlogs } from "../blogData";
import ApiService from "@/core/services/api.service";

export default {
    name: "HomeNewsSection",
    data() {
        return {
            featuredPost: {},
            newsItems: [],
        };
    },
    created() {
        this.loadLiveNews();
    },
    methods: {
        loadLiveNews() {
            // Step 1: Immediately fill with fallbacks for high-speed visual loading
            this.processPostArray(fallbackBlogs);

            // Step 2: Pull the real data from the DB
            ApiService.get('/get-public-blogs')
                .then(({ data }) => {
                    if (data.success && data.data && data.data.length > 0) {
                        // Format exact mapping
                        const dynamicPosts = data.data.map(item => ({
                            ...item,
                            image: item.image_path,
                            date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                        }));
                        
                        // Override with live news
                        this.processPostArray(dynamicPosts);
                    }
                })
                .catch(() => {
                    // Handled silently by initial fallback assignment
                });
        },
        processPostArray(arr) {
            this.featuredPost = arr[0] || {};
            this.newsItems = arr.slice(1, 5);
        }
    }
};
</script>


