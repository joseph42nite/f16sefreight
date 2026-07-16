<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container pt-12 pb-24">
      
      <!-- HERO SECTION -->
      <section class="blogs-hero text-center mb-20">
        <span class="section-eyebrow">Industry Insights</span>
        <h1 class="section-title mb-6">Blogs & News</h1>
        <p class="section-subtitle mx-auto" style="max-width: 700px;">
          Stay updated with the latest trends in global logistics, e-freight automation, and industry breakthroughs.
        </p>
      </section>

      <!-- FEATURED POST -->
      <section class="featured-post-section mb-20">
        <div class="featured-card glass-card">
            <b-row align-v="center">
                <b-col lg="6">
                    <div class="featured-image-wrap">
                        <img :src="featuredPost.image" :alt="featuredPost.title" class="featured-img">
                    </div>
                </b-col>
                <b-col lg="6" class="p-8 p-md-12">
                    <div class="post-meta mb-4">
                        <span class="post-category">{{ featuredPost.category }}</span>
                        <span class="meta-dot"></span>
                        <span class="post-date">{{ featuredPost.date }}</span>
                    </div>
                    <h2 class="featured-title mb-6">{{ featuredPost.title }}</h2>
                    <p class="featured-excerpt mb-8">{{ featuredPost.excerpt }}</p>
                    <b-button :to="'/blog/' + featuredPost.slug" class="hero-btn">
                        <span>Read Full Article</span>
                        <div class="btn-icon">
                            <b-icon icon="arrow-right"></b-icon>
                        </div>
                    </b-button>
                </b-col>
            </b-row>
        </div>
      </section>

      <!-- FILTER BAR -->
      <section class="filter-bar mb-12">
        <div class="d-flex flex-wrap align-items-center gap-4">
            <button 
                v-for="cat in categories" 
                :key="cat" 
                @click="selectedCategory = cat"
                :class="['filter-pill', { active: selectedCategory === cat }]"
            >
                {{ cat }}
            </button>
        </div>
      </section>

      <!-- BLOG GRID -->
      <section class="blog-grid-section">
        <b-row>
            <b-col lg="4" md="6" class="mb-12" v-for="(post, idx) in filteredPosts" :key="idx">
                <div class="blog-card glass-card h-100">
                    <div class="blog-image-wrap">
                        <img :src="post.image" :alt="post.title" class="blog-card-img">
                        <span class="card-category-badge">{{ post.category }}</span>
                    </div>
                    <div class="blog-content p-6">
                        <span class="post-date-small mb-3 d-block">{{ post.date }}</span>
                        <h3 class="blog-card-title mb-4">{{ post.title }}</h3>
                        <p class="blog-card-excerpt mb-6">{{ post.excerpt }}</p>
                        <b-button :to="'/blog/' + post.slug" class="read-more-link">
                            <span>Read More</span>
                            <b-icon icon="arrow-right-short" class="ms-1"></b-icon>
                        </b-button>
                    </div>
                </div>
            </b-col>
        </b-row>
      </section>

      <!-- NEWSLETTER CTA -->
      <section class="newsletter-section mt-20">
        <div class="newsletter-card text-center py-16 px-6">
            <div class="newsletter-glow"></div>
            <div class="newsletter-content">
                <h2 class="section-title mb-4">Subscribe to our newsletter</h2>
                <p class="section-subtitle mb-10 text-muted">Get the latest logistics news delivered straight to your inbox.</p>
                <div class="newsletter-form mx-auto" style="max-width: 500px;">
                    <div class="glass-input-group">
                        <input type="email" placeholder="Enter your email address" class="glass-input">
                        <button class="subscribe-btn">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </b-container>
  </b-container>
</template>

<script>
import { blogs as fallbackBlogs } from "./blogData";
import ApiService from "@/core/services/api.service";

export default {
  name: "BlogsAndNews",
  data() {
    return {
      selectedCategory: 'All',
      categories: ['All', 'Air Freight', 'Technology', 'Sea Freight', 'Industry News', 'ERP Solutions'],
      posts: [],
      featuredPost: {}
    };
  },
  created() {
    this.loadBlogs();
  },
  methods: {
    loadBlogs() {
      // Load fallback initially for zero-content flash
      this.updatePosts(fallbackBlogs);

      ApiService.get('/get-public-blogs')
        .then(({ data }) => {
          if (data.success && data.data && data.data.length > 0) {
            // Map dynamic DB entries to frontend key structure
            const dynamicPosts = data.data.map(item => ({
              ...item,
              image: item.image_path,
              // Format backend timestamp to consistent UI display format
              date: new Date(item.published_at || item.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            }));
            
            // Use dynamic data as the source of truth
            this.updatePosts(dynamicPosts);
          }
        })
        .catch(() => {
          console.log("Running in offline/fallback mode for blogs.");
        });
    },
    updatePosts(postArray) {
      this.posts = postArray;
      this.featuredPost = postArray[0] || {};
    }
  },
  computed: {
    filteredPosts() {
      if (this.selectedCategory === 'All') return this.posts;
      return this.posts.filter(post => post.category === this.selectedCategory);
    }
  }
};
</script>


