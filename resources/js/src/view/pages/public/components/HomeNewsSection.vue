<template>
    <section class="news-section-container mb-25" aria-labelledby="news-heading">
        <b-row class="mb-16 align-items-end">
            <b-col md="8">
                <span class="section-eyebrow">Insights</span>
                <h2 id="news-heading" class="section-title">Latest Logistics News & Insights</h2>
                <p class="section-subtitle mt-4">Stay updated with the evolving landscape of global trade and freight technology.</p>
            </b-col>
            <b-col md="4" class="text-md-end d-none d-md-block">
                <b-link to="/blogs-and-news" class="view-all-btn" aria-label="View all logistics news articles">
                    <span>View All News</span>
                    <b-icon icon="arrow-right" class="ms-2" aria-hidden="true"></b-icon>
                </b-link>
            </b-col>
        </b-row>

        <b-row>
            <b-col lg="6" class="mb-8">
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
            </b-col>
            <b-col lg="6">
                <b-row>
                    <b-col md="6" v-for="(news, idx) in newsItems" :key="idx" class="mb-8">
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
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </section>
</template>

<script>
import { blogs } from "../blogData";

export default {
    name: "HomeNewsSection",
    data() {
        return {
            featuredPost: blogs[0],
            newsItems: blogs.slice(1, 5),
        };
    }
};
</script>


