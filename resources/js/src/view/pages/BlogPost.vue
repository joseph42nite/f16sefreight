<template>
  <b-container fluid class="main-wrapper p-0">


    <b-container class="content-container py-12">
      <!-- PROGRESS BAR (FOR READING) -->
      <div class="reading-progress-container">
          <div class="reading-progress-bar" :style="{ width: readingProgress + '%' }"></div>
      </div>

      <b-row class="justify-content-center">
        <b-col lg="8" xl="7">
          <!-- BREADCRUMBS -->
          <nav class="blog-breadcrumb mb-8">
              <router-link to="/blogs-and-news">Blogs & News</router-link>
              <span class="mx-2">/</span>
              <span class="current-crumb">{{ post.category }}</span>
          </nav>

          <!-- POST HEADER -->
          <header class="post-header mb-12">
            <div class="post-meta mb-4">
                <span class="post-category-pill">{{ post.category }}</span>
                <span class="post-read-time ms-4"><b-icon icon="clock" class="me-1"></b-icon> {{ post.readTime }} read</span>
            </div>
            <h1 class="post-title mb-6">{{ post.title }}</h1>
            <div class="author-info d-flex align-items-center">
                <div class="author-avatar me-4">
                    <img src="/media/custome/avatar-placeholder.png" alt="Author" class="img-fluid rounded-circle">
                </div>
                <div class="author-details">
                    <span class="author-name d-block">F16s Editorial Team</span>
                    <span class="post-date">{{ post.date }}</span>
                </div>
            </div>
          </header>

          <!-- FEATURED IMAGE -->
          <div class="featured-image-container mb-12">
              <img :src="post.image" :alt="post.title" class="img-fluid post-featured-img">
          </div>

          <!-- POST CONTENT -->
          <article class="post-content mb-20">
            <p class="lead-text mb-8">{{ post.excerpt }}</p>
            
            <div class="article-body" v-html="post.content"></div>

            <!-- KEY TAKEAWAYS BOX -->
            <div class="takeaways-box glass-card p-8 mt-12 mb-12">
                <h3 class="mb-6"><b-icon icon="lightbulb" class="me-2 text-warning"></b-icon> Key Takeaways</h3>
                <ul class="list-unstyled">
                    <li v-for="(item, i) in post.takeaways" :key="i" class="mb-4 d-flex">
                        <b-icon icon="check2-circle" class="takeaway-icon-spacing text-primary mt-1"></b-icon>
                        <span>{{ item }}</span>
                    </li>
                </ul>
            </div>
          </article>

          <!-- SHARE SECTION -->
          <div class="share-section py-8 border-top border-bottom mb-20 d-flex align-items-center justify-content-between">
              <span class="fw-bold text-dark">Share this article:</span>
              <div class="share-icons d-flex gap-4">
                  <a :href="'https://www.linkedin.com/sharing/share-offsite/?url=' + currentUrl" target="_blank" class="share-btn" title="Share on LinkedIn">
                      <b-icon icon="linkedin"></b-icon>
                  </a>
                  <a :href="'https://twitter.com/intent/tweet?url=' + currentUrl + '&text=' + post.title" target="_blank" class="share-btn" title="Share on Twitter">
                      <b-icon icon="twitter"></b-icon>
                  </a>
                  <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl" target="_blank" class="share-btn" title="Share on Facebook">
                      <b-icon icon="facebook"></b-icon>
                  </a>
                  <button @click="copyToClipboard" class="share-btn border-0" :title="copyStatus">
                      <b-icon :icon="copyStatus === 'Copied!' ? 'check-lg' : 'link-45deg'"></b-icon>
                  </button>
              </div>
          </div>

          <!-- RELATED POSTS -->
          <section class="related-posts mb-20">
              <h3 class="section-heading mb-8">Related Articles</h3>
              <b-row>
                  <b-col md="6" v-for="(related, rIdx) in relatedPosts" :key="rIdx" class="mb-8">
                      <div class="related-card" @click="$router.push('/blog/' + related.slug)">
                          <div class="related-img-wrap mb-4">
                              <img :src="related.image" :alt="related.title" class="img-fluid">
                          </div>
                          <h4 class="related-title">{{ related.title }}</h4>
                      </div>
                  </b-col>
              </b-row>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>


export default {
  name: "BlogPost",
  data() {
    return {
      readingProgress: 0,
      currentUrl: window.location.href,
      copyStatus: 'Copy Link',
      post: {
        title: "The Future of E-Freight: How AI is Transforming Air Waybill Management",
        category: "Technology",
        date: "May 02, 2026",
        readTime: "6 min",
        image: "/media/custome/gallary/img-2.png",
        excerpt: "As the logistics industry shifts towards complete digitalization, Artificial Intelligence is moving from a buzzword to a critical operational tool.",
        content: `
            <p>The global air cargo industry is undergoing a seismic shift. For decades, the Master Air Waybill (MAWB) and House Air Waybill (HAWB) were paper-heavy, manual processes prone to human error and delays. Today, the rise of e-freight standards and the integration of AI are changing the game.</p>
            
            <h3>The Transition to Paperless Cargo</h3>
            <p>IATA's e-AWB initiative has been the cornerstone of this transformation. By digitizing the core contract of carriage, forwarders are seeing significantly reduced processing times. But the real breakthrough isn't just digitalization—it's <strong>automation</strong>.</p>
            
            <p>With F16s, the data from your ERP doesn't just sit in a database; it flows seamlessly through EDI gateways directly to airlines. This eliminates the "double entry" problem that has plagued the industry for years.</p>
            
            <h3>How AI Fits In</h3>
            <p>Modern AI algorithms can now perform "Logic Validations" on AWB data before it even hits the airline system. It can detect weight discrepancies, incorrect airport codes, and missing manifest data in milliseconds.</p>
            
            <p>Future iterations will see AI predicting potential custom delays based on historical data patterns, allowing forwarders to proactively reroute or adjust documentation before a shipment is even loaded.</p>
        `,
        takeaways: [
            "Digitalization is no longer optional; it is a prerequisite for global competition.",
            "AI-driven validation reduces documentation errors by up to 99%.",
            "EDI connectivity (FWB, FHL) is the backbone of the modern e-freight ecosystem."
        ]
      },
      relatedPosts: [
        { title: "Standardizing EDI Connectivity for Small Forwarders", slug: "standardizing-edi", image: "/media/custome/gallary/img-3.png" },
        { title: "Global Supply Chain Trends to Watch in 2026", slug: "trends-2026", image: "/media/custome/gallary/img-4.png" }
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.updateProgress);
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateProgress);
  },
  methods: {
    updateProgress() {
      const scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      this.readingProgress = (scrolled / scrollH) * 100;
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.currentUrl).then(() => {
        this.copyStatus = 'Copied!';
        setTimeout(() => {
          this.copyStatus = 'Copy Link';
        }, 2000);
      });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.main-wrapper {
    font-family: 'Inter', sans-serif;
}

.content-container {
    position: relative;
    z-index: 10;
}

/* Reading Progress Bar */
.reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    z-index: 1000;
}
.reading-progress-bar {
    height: 100%;
    background: linear-gradient(to right, #355594, #4a72c9);
    transition: width 0.1s ease;
}

/* Breadcrumb */
.blog-breadcrumb { font-size: 0.9rem; color: #64748b; font-weight: 500; }
.blog-breadcrumb a { color: #355594; text-decoration: none; }
.blog-breadcrumb a:hover { text-decoration: underline; }
.current-crumb { font-weight: 700; color: #1e3a6e; }

/* Header */
.post-category-pill { background: #f0f7ff; color: #355594; padding: 6px 16px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; }
.post-read-time { font-size: 0.9rem; color: #64748b; font-weight: 500; }
.post-title { font-size: 3rem; font-weight: 900; color: #1e3a6e; line-height: 1.1; letter-spacing: -1.5px; }
.author-name { font-weight: 700; color: #1e3a6e; font-size: 1rem; }
.post-date { color: #64748b; font-size: 0.85rem; }
.author-avatar { width: 48px; height: 48px; }

/* Content Styling */
.featured-image-container { border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
.post-featured-img { width: 100%; border-radius: 32px; }

.lead-text { font-size: 1.5rem; color: #334155; line-height: 1.5; font-weight: 500; }
.article-body { font-size: 1.2rem; color: #334155; line-height: 1.8; }
.article-body h3 { font-size: 1.8rem; font-weight: 800; color: #1e3a6e; margin-top: 2.5rem; margin-bottom: 1.25rem; }
.article-body p { margin-bottom: 1.5rem; }

/* Takeaways Box */
.takeaways-box { background: #f8fbff !important; border: 1px solid #e0f0ff !important; }
.takeaways-box h3 { font-weight: 800; color: #1e3a6e; font-size: 1.4rem; }
.takeaway-icon-spacing { margin-right: 24px !important; }

/* Share & Related */
.share-btn { width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 1.1rem; transition: all 0.3s ease; text-decoration: none; }
.share-btn:hover { background: #355594; color: white; transform: translateY(-3px); }

.related-card { cursor: pointer; transition: transform 0.3s ease; }
.related-card:hover { transform: translateY(-5px); }
.related-img-wrap { border-radius: 20px; overflow: hidden; height: 180px; }
.related-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.related-title { font-size: 1.1rem; font-weight: 700; color: #1e3a6e; line-height: 1.4; }

@media (max-width: 991px) {
    .post-title { font-size: 2.25rem; }
    .lead-text { font-size: 1.25rem; }
}
</style>
