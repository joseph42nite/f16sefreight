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
                <div class="author-details">
                    <span class="author-name">F16s Editorial Team</span>
                    <span class="post-date d-block">{{ post.date }}</span>
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
              <div class="share-info">
                  <span class="fw-bold text-dark d-block mb-1">Enjoyed this article?</span>
                  <span class="text-muted small">Share it with your logistics network.</span>
              </div>
              <b-button @click="showShareModal = true" class="hero-btn share-trigger-btn">
                  <span>Share Post</span>
                  <b-icon icon="share-fill" class="btn-icon ms-2"></b-icon>
              </b-button>
          </div>

          <!-- SHARE PREVIEW MODAL -->
          <b-modal v-model="showShareModal" hide-footer centered title="Share this Insight" content-class="premium-share-modal" size="md">
              <div class="share-preview-wrapper p-4">
                  <p class="preview-label mb-4 text-muted small text-uppercase fw-bold">Social Preview</p>
                  
                  <!-- SOCIAL CARD PREVIEW -->
                  <div class="social-preview-card mb-8">
                      <div class="social-card-image">
                          <img :src="post.image" :alt="post.title">
                      </div>
                      <div class="social-card-content">
                          <p class="social-card-domain">f16sefreight.com</p>
                          <h4 class="social-card-title">{{ post.title }}</h4>
                          <p class="social-card-excerpt">{{ post.excerpt }}</p>
                      </div>
                  </div>

                  <div class="share-actions-grid">
                      <div class="social-links-row mb-6 d-flex justify-content-center gap-4">
                          <a :href="'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(currentUrl)" target="_blank" class="social-icon-btn linkedin">
                              <b-icon icon="linkedin"></b-icon>
                          </a>
                          <a :href="'https://twitter.com/intent/tweet?url=' + encodeURIComponent(currentUrl) + '&text=' + encodeURIComponent(post.title)" target="_blank" class="social-icon-btn twitter">
                              <b-icon icon="twitter"></b-icon>
                          </a>
                          <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(currentUrl)" target="_blank" class="social-icon-btn facebook">
                              <b-icon icon="facebook"></b-icon>
                          </a>
                          <a :href="'https://api.whatsapp.com/send?text=' + encodeURIComponent(post.title + ' ' + currentUrl)" target="_blank" class="social-icon-btn whatsapp">
                              <b-icon icon="whatsapp"></b-icon>
                          </a>
                      </div>

                      <div class="copy-actions-row d-flex flex-column gap-3">
                          <b-button @click="copyToClipboard" class="copy-btn link-btn w-100 py-3">
                              <b-icon :icon="copyStatus === 'Copied!' ? 'check-lg' : 'link-45deg'" class="me-2"></b-icon>
                              {{ copyStatus }}
                          </b-button>
                          <b-button @click="copyFullMessage" class="copy-btn message-btn w-100 py-3">
                              <b-icon :icon="copyMessageStatus === 'Message Copied!' ? 'check-lg' : 'file-earmark-text'" class="me-2"></b-icon>
                              {{ copyMessageStatus }}
                          </b-button>
                      </div>
                  </div>
              </div>
          </b-modal>

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
import { blogs } from "../blogData";

export default {
  name: "BlogPost",
  metaInfo() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": this.post.title,
      "image": [this.post.image],
      "datePublished": this.post.date,
      "author": [{
        "@type": "Organization",
        "name": "F16s Editorial Team",
        "url": "https://f16sefreight.com"
      }],
      "description": this.post.excerpt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };

    return {
      title: this.post.metaTitle || this.post.title,
      meta: [
        { name: 'description', content: this.post.metaDescription || this.post.excerpt },
        { property: 'og:title', content: this.post.metaTitle || this.post.title },
        { property: 'og:description', content: this.post.metaDescription || this.post.excerpt },
        { property: 'og:image', content: this.post.image },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      script: [
        { innerHTML: JSON.stringify(schema), type: 'application/ld+json' }
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  },
  data() {
    return {
      readingProgress: 0,
      showShareModal: false,
      currentUrl: window.location.href,
      copyStatus: 'Copy Link',
      copyMessageStatus: 'Copy Message for Sharing',
      post: blogs.find(b => b.slug === this.$route.params.slug) || blogs[0],
      relatedPosts: blogs.filter(b => b.slug !== this.$route.params.slug).slice(0, 2)
    };
  },
  watch: {
    '$route.params.slug': {
      handler(newSlug) {
        this.post = blogs.find(b => b.slug === newSlug) || blogs[0];
        this.relatedPosts = blogs.filter(b => b.slug !== newSlug).slice(0, 2);
        window.scrollTo(0, 0);
      },
      immediate: true
    }
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
    },
    copyFullMessage() {
      const message = `${this.post.title}\n\n${this.post.excerpt}\n\nRead more at: ${this.currentUrl}`;
      navigator.clipboard.writeText(message).then(() => {
        this.copyMessageStatus = 'Message Copied!';
        setTimeout(() => {
          this.copyMessageStatus = 'Copy Message for Sharing';
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
.author-name { font-weight: 700; color: #1e3a6e; font-size: 1rem; line-height: 1; }
.post-date { color: #64748b; font-size: 0.85rem; margin-top: 2px; }

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

/* REUSABLE HERO BTN STYLE FOR SHARE */
.hero-btn {
    background: #355594;
    border: none;
    border-radius: 999px;
    padding: 10px 10px 10px 22px;
    display: inline-flex;
    align-items: center;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.hero-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(53, 85, 148, 0.2);
}
.hero-btn span {
    color: white;
    font-weight: 700;
    margin-right: 8px;
    font-size: 0.95rem;
}
.hero-btn .btn-icon {
    background: white;
    color: #355594;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    padding: 8px;
    transition: transform 0.3s ease;
}
.hero-btn:hover .btn-icon {
    transform: rotate(15deg);
}

/* PREMIUM SHARE MODAL STYLING */
:deep(.premium-share-modal) {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.6) !important;
    border-radius: 32px !important;
    box-shadow: 0 40px 100px rgba(53, 85, 148, 0.15) !important;
    overflow: hidden;
}

:deep(.premium-share-modal .modal-header) {
    border-bottom: 1px solid rgba(53, 85, 148, 0.08);
    padding: 1.5rem 2rem;
}

:deep(.premium-share-modal .modal-title) {
    font-weight: 800;
    color: #1e3a6e;
    letter-spacing: -0.5px;
}

.social-preview-card {
    border-radius: 24px;
    overflow: hidden;
    background: white;
    border: 1px solid rgba(53, 85, 148, 0.1);
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.06);
    transition: transform 0.3s ease;
}
.social-preview-card:hover {
    transform: scale(1.02);
}

.social-card-image {
    width: 100%;
    aspect-ratio: 1.91 / 1;
    overflow: hidden;
}
.social-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.social-card-content {
    padding: 20px;
}
.social-card-domain {
    font-size: 0.85rem;
    color: #355594;
    letter-spacing: -0.2px;
    font-weight: 700;
    margin-bottom: 8px;
    opacity: 0.8;
}
.social-card-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #1e3a6e;
    margin-bottom: 10px;
    line-height: 1.3;
}
.social-card-excerpt {
    font-size: 0.9rem;
    color: #5A6B8A;
    line-height: 1.6;
    margin-bottom: 0;
}

.social-icon-btn {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: white;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-decoration: none;
}
.social-icon-btn.linkedin { background: #0077b5; box-shadow: 0 8px 20px rgba(0, 119, 181, 0.25); }
.social-icon-btn.twitter { background: #1da1f2; box-shadow: 0 8px 20px rgba(29, 161, 242, 0.25); }
.social-icon-btn.facebook { background: #1877f2; box-shadow: 0 8px 20px rgba(24, 119, 242, 0.25); }
.social-icon-btn.whatsapp { background: #25d366; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.25); }
.social-icon-btn:hover { transform: translateY(-6px) rotate(8deg); color: white; filter: brightness(1.1); }

.copy-btn {
    border: none;
    border-radius: 16px;
    font-weight: 800;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    letter-spacing: -0.2px;
}
.copy-btn.link-btn { 
    background: #f0f7ff; 
    color: #355594; 
    border: 1px solid rgba(53, 85, 148, 0.1);
}
.copy-btn.message-btn { 
    background: #355594; 
    color: white; 
}
.copy-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(53, 85, 148, 0.1); }
.copy-btn.message-btn:hover { box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); }

@media (max-width: 991px) {
    .post-title { font-size: 2.25rem; }
    .lead-text { font-size: 1.25rem; }
}
</style>
