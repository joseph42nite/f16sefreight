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

          <!-- BLOG READER CARD -->
          <div class="blog-reader-card">
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
              <article class="post-content mb-12">
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
              <div class="share-section py-8 border-top border-bottom mb-0 d-flex align-items-center justify-content-between">
                  <div class="share-info">
                      <span class="fw-bold text-dark d-block mb-1">Enjoyed this article?</span>
                      <span class="text-muted small">Share it with your logistics network.</span>
                  </div>
                  <b-button @click="showShareModal = true" class="hero-btn share-trigger-btn">
                      <span>Share Post</span>
                      <div class="btn-icon">
                        <b-icon icon="share-fill"></b-icon>
                      </div>
                  </b-button>
              </div>
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
              <h3 class="section-heading mb-10 font-weight-bold text-dark" style="font-size: 2rem; letter-spacing: -0.5px;">Continue Reading</h3>
              <b-row>
                  <b-col md="6" v-for="(related, rIdx) in relatedPosts" :key="rIdx" class="mb-8">
                      <div class="blog-card glass-card h-100" @click="$router.push('/blog/' + related.slug)" style="cursor: pointer;">
                          <div class="blog-image-wrap">
                              <img :src="related.image" :alt="related.title" class="blog-card-img">
                              <span class="card-category-badge">{{ related.category }}</span>
                          </div>
                          <div class="blog-content p-6">
                              <span class="post-date-small mb-3 d-block text-muted small">{{ related.date || 'Recent Article' }}</span>
                              <h3 class="blog-card-title mb-4" style="font-size: 1.3rem; font-weight: 800; color: #1e3a6e;">{{ related.title }}</h3>
                              <p class="blog-card-excerpt mb-6 text-muted small">{{ related.excerpt }}</p>
                              <b-button class="read-more-link">
                                  <span>Read Article</span>
                                  <b-icon icon="arrow-right-short" class="ms-1"></b-icon>
                              </b-button>
                          </div>
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
import { blogs as fallbackBlogs } from "./blogData";
import ApiService from "@/core/services/api.service";

export default {
  name: "BlogPost",
  metaInfo() {
    const siteOrigin = window.location.origin;
    const imagePath = this.post.image || this.post.image_path || '/media/assets/blog/futuristic-hud-overlays.webp';
    const absoluteImageUrl = siteOrigin + imagePath;
    const pageUrl = window.location.href;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": this.post.title,
      "image": [absoluteImageUrl],
      "datePublished": this.post.created_at || this.post.date,
      "author": [{
        "@type": "Organization",
        "name": "F16s Editorial Team",
        "url": siteOrigin
      }],
      "description": this.post.excerpt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl
      }
    };

    return {
      title: this.post.meta_title || this.post.metaTitle || this.post.title,
      meta: [
        { name: 'description', content: this.post.meta_description || this.post.metaDescription || this.post.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: pageUrl },
        { property: 'og:title', content: this.post.meta_title || this.post.metaTitle || this.post.title },
        { property: 'og:description', content: this.post.meta_description || this.post.metaDescription || this.post.excerpt },
        { property: 'og:image', content: absoluteImageUrl },
        { property: 'og:image:alt', content: this.post.title },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: pageUrl },
        { name: 'twitter:title', content: this.post.meta_title || this.post.metaTitle || this.post.title },
        { name: 'twitter:description', content: this.post.meta_description || this.post.metaDescription || this.post.excerpt },
        { name: 'twitter:image', content: absoluteImageUrl }
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
      post: {},
      relatedPosts: []
    };
  },
  watch: {
    '$route.params.slug': {
      handler(newSlug) {
        this.fetchPost(newSlug);
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
    fetchPost(slug) {
      // 1. Immediate fallback lookup
      const offlinePost = fallbackBlogs.find(b => b.slug === slug);
      if (offlinePost) {
        this.setPost(offlinePost);
      }

      // 2. Dynamic DB Lookup with override
      ApiService.get(`/get-public-blog/${slug}`)
        .then(({ data }) => {
          if (data.success && data.data) {
            const item = data.data;
            // Ensure proper casting of relational arrays
            let parsedTakeaways = item.takeaways;
            if (typeof parsedTakeaways === 'string') {
                parsedTakeaways = JSON.parse(parsedTakeaways);
            }

            const formattedPost = {
              ...item,
              image: item.image_path,
              readTime: item.read_time,
              takeaways: parsedTakeaways || [],
              date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            };
            this.setPost(formattedPost);
          }
        })
        .catch(() => {
            console.log("Static fallback content maintained.");
        });
        
      // Fetch related fallback logic, or grab other public ones
      ApiService.get('/get-public-blogs')
        .then(({ data }) => {
           if(data.success && data.data) {
              const rel = data.data.filter(d => d.slug !== slug).slice(0, 2).map(i => ({
                  ...i,
                  image: i.image_path
              }));
              if (rel.length > 0) this.relatedPosts = rel;
           }
        })
        .catch(() => {
           // final fallback
           this.relatedPosts = fallbackBlogs.filter(b => b.slug !== slug).slice(0, 2);
        });
    },
    setPost(p) {
        this.post = p;
    },
    updateProgress() {
      const scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      this.readingProgress = scrollH > 0 ? (scrolled / scrollH) * 100 : 0;
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.currentUrl).then(() => {
        this.copyStatus = 'Copied!';
        setTimeout(() => { this.copyStatus = 'Copy Link'; }, 2000);
      });
    },
    copyFullMessage() {
      const message = `${this.post.title}\n\n${this.post.excerpt}\n\nRead more at: ${this.currentUrl}`;
      navigator.clipboard.writeText(message).then(() => {
        this.copyMessageStatus = 'Message Copied!';
        setTimeout(() => { this.copyMessageStatus = 'Copy Message for Sharing'; }, 2000);
      });
    }
  }
};
</script>

<style scoped>

.main-wrapper {
    font-family: 'Inter', sans-serif;
}

.content-container {
    position: relative;
    z-index: 10;
}

/* Premium Blog Reader Card */
.blog-reader-card {
    background: #ffffff;
    border: 1px solid rgba(53, 85, 148, 0.08);
    border-radius: 32px;
    padding: 3.5rem;
    box-shadow: 0 30px 60px rgba(53, 85, 148, 0.05);
    margin-bottom: 3.5rem;
}

@media (max-width: 767px) {
    .blog-reader-card {
        padding: 2rem 1.5rem;
        border-radius: 24px;
        margin-bottom: 2rem;
    }
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



/* PREMIUM SHARE MODAL STYLING */
:deep(.premium-share-modal) {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px) !important;
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
