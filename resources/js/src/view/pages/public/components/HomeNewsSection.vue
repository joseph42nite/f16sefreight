<template>
    <!--
        Blog (redesigned again 2026-11-16, owner). Picture-led, like a magazine cover wall: one tall lead story and four
        smaller ones, each a photo with its title written on it, no white boxes. On phones the five become a row you
        swipe. Blogs only: posts whose category says news ("Industry News") are left out; news gets its own section
        later. #blogs-section stays: the header's "Blogs" link jumps here.
    -->
    <section id="blogs-section" class="ln" aria-labelledby="news-heading">
        <header class="lp-head">
            <span class="lp-eyebrow">Blog</span>
            <h2 id="news-heading" class="lp-title">From the F16s desk.</h2>
            <p class="lp-sub">Notes on air and sea freight, documents and running a forwarding team.</p>
        </header>

        <div v-if="posts.length" class="ln-wall">
            <router-link v-for="(post, i) in posts.slice(0, 5)" :key="post.slug" :to="'/blog/' + post.slug"
                         class="ln-tile" :class="{ 'ln-tile--lead': i === 0 }">
                <img :src="post.image" :alt="post.title" loading="lazy" />
                <span class="ln-shade" aria-hidden="true"></span>
                <span class="ln-cat">{{ post.category }}</span>
                <span class="ln-words">
                    <span class="ln-meta">
                        <time :datetime="post.date">{{ post.date }}</time>
                        <template v-if="post.readTime"> · {{ post.readTime }} read</template>
                    </span>
                    <component :is="i === 0 ? 'h3' : 'h4'" class="ln-title">{{ post.title }}</component>
                    <span v-if="i === 0" class="ln-excerpt">{{ post.excerpt }}</span>
                    <span class="ln-read">Read <b-icon icon="arrow-up-right" aria-hidden="true"></b-icon></span>
                </span>
            </router-link>
        </div>
        <p v-else class="ln-empty">New articles are on the way. Check back soon.</p>

        <div class="ln-foot">
            <lp-button to="/blogs-and-news" icon="arrow-right">All articles</lp-button>
        </div>
    </section>
</template>

<script>
import { blogs as fallbackBlogs } from "../blogData";
import ApiService from "@/core/services/api.service";
import LpButton from "./LpButton.vue";

// News will get its own section; this one shows blogs only.
const isNews = (category) => /news/i.test(category || "");

export default {
    name: "HomeNewsSection",
    components: { LpButton },
    data: () => ({ posts: [] }),
    created() {
        this.loadPosts();
    },
    methods: {
        loadPosts() {
            // Fill at once from the bundled posts, then swap in the live ones if there are any.
            this.setPosts(fallbackBlogs);
            ApiService.get("/get-public-blogs")
                .then(({ data }) => {
                    if (data.success && data.data && data.data.length > 0) {
                        this.setPosts(data.data.map((item) => ({
                            ...item,
                            image: item.image_path,
                            readTime: item.read_time,
                            date: new Date(item.published_at || item.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                        })));
                    }
                })
                .catch(() => {});
        },
        setPosts(arr) {
            this.posts = arr.filter((p) => p && p.slug && !isNews(p.category));
        },
    },
};
</script>

<style>
.ln { padding: 72px 0 40px; font-family: "Inter", sans-serif; }
.ln .lp-head { margin-bottom: 44px; }

/* The wall: one tall lead story, four beside it in a 2 × 2. */
.ln-wall { display: grid; grid-template-columns: 1.35fr 1fr 1fr; grid-template-rows: 250px 250px; gap: 16px; }
.ln-tile {
    position: relative; display: block; overflow: hidden; border-radius: 26px; background: #1E3A6E; color: #fff !important;
    text-decoration: none !important; isolation: isolate;
}
.ln-tile--lead { grid-row: 1 / span 2; border-radius: 30px; }
.ln-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2, .7, .2, 1); z-index: -2; }
.ln-tile:hover img { transform: scale(1.06); }
/* A navy fade from the foot, so white words read on any photo. */
.ln-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(16, 37, 82, 0) 30%, rgba(16, 37, 82, .55) 62%, rgba(16, 37, 82, .92) 100%); transition: opacity .3s ease; }
.ln-cat {
    position: absolute; left: 16px; top: 16px; padding: 6px 12px; border-radius: 999px; background: rgba(255, 255, 255, .92);
    backdrop-filter: blur(6px); color: #2459B5; font-size: .75rem; font-weight: 700;
}
.ln-words { position: absolute; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; gap: 8px; padding: 20px; }
.ln-tile--lead .ln-words { padding: 30px; gap: 12px; }
.ln-meta { font-size: .75rem; font-weight: 500; color: rgba(255, 255, 255, .78); }
.ln-title {
    margin: 0; color: #fff; font-size: 1.0625rem; line-height: 1.3; font-weight: 600; letter-spacing: -.01em;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.ln-tile--lead .ln-title { font-size: 1.875rem; line-height: 1.15; letter-spacing: -.025em; -webkit-line-clamp: 3; }
.ln-excerpt { font-size: .9375rem; line-height: 1.55; color: rgba(255, 255, 255, .85); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
/* "Read" slides up on hover; on the lead story it always shows. */
.ln-read {
    display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; padding: 7px 14px; border-radius: 999px;
    background: #fff; color: #2459B5; font-size: .8125rem; font-weight: 600;
    opacity: 0; transform: translateY(6px); transition: opacity .25s ease, transform .25s ease;
}
.ln-tile:hover .ln-read, .ln-tile:focus-visible .ln-read, .ln-tile--lead .ln-read { opacity: 1; transform: none; }
.ln-tile:focus-visible { outline: 3px solid #3E8BEA; outline-offset: 3px; }

.ln-empty { margin: 0; padding: 40px 0; text-align: center; color: #6B7A93; }
.ln-foot { display: flex; justify-content: center; margin-top: 36px; }

@media (max-width: 991px) {
    .ln-wall { grid-template-columns: 1fr 1fr; grid-template-rows: 340px 220px 220px; }
    .ln-tile--lead { grid-column: 1 / -1; grid-row: auto; }
}
/* Phones: a row of tall cards you swipe. */
@media (max-width: 575px) {
    .ln-wall {
        display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 0 -16px; padding: 0 16px 6px; scrollbar-width: none;
    }
    .ln-wall::-webkit-scrollbar { display: none; }
    .ln-tile, .ln-tile--lead { flex: 0 0 82%; height: 380px; border-radius: 24px; scroll-snap-align: center; }
    .ln-tile .ln-title, .ln-tile--lead .ln-title { font-size: 1.25rem; }
    .ln-excerpt { display: none; }
    .ln-read { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
    .ln-tile img, .ln-read { transition: none; }
}
</style>
