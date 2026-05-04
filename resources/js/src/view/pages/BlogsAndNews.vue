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
                        <b-icon icon="arrow-right" class="btn-icon"></b-icon>
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
                        <b-button :to="'/blog/' + post.slug" class="read-more-link p-0">
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
import { blogs } from "../blogData";

export default {
  name: "BlogsAndNews",
  components: {
  },
  data() {
    return {
      selectedCategory: 'All',
      categories: ['All', 'Air Freight', 'Technology', 'Sea Freight', 'Industry News', 'ERP Solutions'],
      featuredPost: blogs[0],
      posts: blogs
    };
  },
  computed: {
    filteredPosts() {
      if (this.selectedCategory === 'All') return this.posts;
      return this.posts.filter(post => post.category === this.selectedCategory);
    }
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

/* Typography */
.section-title { font-size: 3.5rem; font-weight: 900; color: #1e3a6e; letter-spacing: -1.5px; }
.section-subtitle { font-size: 1.25rem; color: #5A6B8A; line-height: 1.6; }
.section-eyebrow { text-transform: uppercase; letter-spacing: 3px; font-size: 0.9rem; font-weight: 800; color: #355594; margin-bottom: 1rem; display: block; }

/* Featured Card */
.featured-card {
    border-radius: 40px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 30px 60px rgba(53, 85, 148, 0.08);
}
.featured-image-wrap { height: 100%; overflow: hidden; }
.featured-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
.featured-card:hover .featured-img { transform: scale(1.05); }
.featured-title { font-size: 2.25rem; font-weight: 800; color: #1e3a6e; line-height: 1.2; }
.featured-excerpt { font-size: 1.1rem; color: #5A6B8A; line-height: 1.7; }

/* Post Meta */
.post-category { color: #355594; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; }
.meta-dot { width: 5px; height: 5px; background: #cbd5e1; border-radius: 50%; display: inline-block; margin: 0 10px; vertical-align: middle; }
.post-date { color: #64748b; font-size: 0.9rem; font-weight: 500; }

/* Filter Bar */
.filter-pill {
    padding: 8px 24px;
    border-radius: 999px;
    border: 1px solid rgba(53, 85, 148, 0.2);
    background: rgba(255, 255, 255, 0.5);
    color: #355594;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
}
.filter-pill:hover, .filter-pill.active {
    background: #355594;
    color: white;
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.15);
}

/* Blog Cards */
.blog-card {
    border-radius: 32px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
}
.blog-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(53, 85, 148, 0.1); }
.blog-image-wrap { height: 240px; position: relative; overflow: hidden; }
.blog-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.blog-card:hover .blog-card-img { transform: scale(1.1); }
.card-category-badge { position: absolute; top: 20px; left: 20px; background: rgba(255, 255, 255, 0.9); color: #1e3a6e; padding: 6px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
.blog-card-title { font-size: 1.35rem; font-weight: 800; color: #1e3a6e; line-height: 1.3; }
.blog-card-excerpt { font-size: 0.95rem; color: #64748b; line-height: 1.6; }
.read-more-link { background: none; border: none; color: #355594; font-weight: 700; font-size: 0.95rem; display: inline-flex; align-items: center; transition: all 0.3s ease; }
.read-more-link:hover { color: #1e3a6e; letter-spacing: 0.5px; }

/* Newsletter */
.newsletter-card { position: relative; border-radius: 40px; overflow: hidden; }
.newsletter-glow { position: absolute; inset: 0; background: linear-gradient(135deg, #d0e6f8 0%, #ffffff 100%); opacity: 0.5; filter: blur(30px); }
.newsletter-content { position: relative; z-index: 1; }
.glass-input-group { display: flex; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 999px; padding: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.glass-input { flex: 1; background: none; border: none; padding: 12px 24px; font-family: 'Inter', sans-serif; color: #1e3a6e; font-weight: 500; }
.glass-input:focus { outline: none; }
.subscribe-btn { background: #355594; color: white; border: none; padding: 12px 32px; border-radius: 999px; font-weight: 700; transition: all 0.3s ease; }
.subscribe-btn:hover { background: #1e3a6e; transform: scale(1.02); }

/* Hero Button Style */
.hero-btn { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; display: inline-flex; align-items: center; transition: all 0.3s ease; }
.hero-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(53, 85, 148, 0.25); }
.hero-btn span { color: white; font-weight: 500; margin-right: 14px; }
.hero-btn .btn-icon { background: white; color: #355594; border-radius: 50%; width: 32px; height: 32px; padding: 8px; }

/* Responsive */
@media (max-width: 991px) {
    .section-title { font-size: 2.5rem; }
    .featured-title { font-size: 1.75rem; }
}
</style>
