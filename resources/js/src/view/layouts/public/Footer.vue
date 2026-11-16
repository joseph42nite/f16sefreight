<template>
    <!--
        Site footer (redesigned 2026-11-16, owner), shared by every public page. Paper fading into the hero's sky; the
        logo, one line and the site's one button on the left, three short link columns on the right, and a giant pale
        "F16s" across the foot with the jet flying over it. The Facebook link went: it pointed nowhere ("#").
    -->
    <footer class="sf">
        <b-container class="sf-inner">
            <div class="sf-top">
                <div class="sf-brand">
                    <router-link :to="isAuthenticated ? '/focus-air' : '/'" class="sf-logo-link">
                        <img src="/media/assets/logos/blue-logo.png" alt="F16s" class="sf-logo" />
                    </router-link>
                    <p class="sf-line">Freight forwarding software for air and sea. Every shipment on one clear board.</p>
                    <lp-button to="/#talk-to-us" icon="arrow-right">Talk to us</lp-button>
                </div>

                <nav class="sf-cols" aria-label="Footer">
                    <div class="sf-col">
                        <h2 class="sf-head">Product</h2>
                        <ul>
                            <li><router-link to="/product-description">Focus Air</router-link></li>
                            <li><router-link to="/product-description">Focus Sea</router-link></li>
                            <li><span class="sf-soon">Focus Road <em>Soon</em></span></li>
                            <li><router-link to="/#plans-heading">Plans</router-link></li>
                        </ul>
                    </div>
                    <div class="sf-col">
                        <h2 class="sf-head">Company</h2>
                        <ul>
                            <li><router-link to="/about-us">About us</router-link></li>
                            <li><router-link to="/blogs-and-news">Blog</router-link></li>
                            <li><router-link to="/#faq-section">FAQs</router-link></li>
                            <li><router-link to="/contact-us">Contact</router-link></li>
                        </ul>
                    </div>
                    <div class="sf-col">
                        <h2 class="sf-head">Legal</h2>
                        <ul>
                            <li><router-link to="/terms-conditions">Terms of service</router-link></li>
                            <li><router-link to="/privacy-policy">Privacy policy</router-link></li>
                        </ul>
                    </div>
                </nav>
            </div>

            <div class="sf-bottom">
                <span class="sf-copy">© 2026 F16s E-Freight Solutions. All rights reserved.</span>
                <div class="sf-social">
                    <a href="https://www.linkedin.com/company/f16s-efreightsolutions/" target="_blank" rel="noopener noreferrer" aria-label="F16s on LinkedIn"><b-icon icon="linkedin" aria-hidden="true"></b-icon></a>
                    <a href="https://www.instagram.com/f16s_efreight/" target="_blank" rel="noopener noreferrer" aria-label="F16s on Instagram"><b-icon icon="instagram" aria-hidden="true"></b-icon></a>
                    <a href="https://www.youtube.com/@F16sE-FreightSolutions" target="_blank" rel="noopener noreferrer" aria-label="F16s on YouTube"><b-icon icon="youtube" aria-hidden="true"></b-icon></a>
                </div>
            </div>
        </b-container>

        <!-- The giant wordmark at the foot, written in full like the logo ("F16s." with its dot), with the jet crossing it. -->
        <div class="sf-mark" aria-hidden="true">
            <span class="sf-word">F16s<i aria-hidden="true"></i></span>
            <svg class="sf-jet" viewBox="0 0 24 24"><path d="M12 1.2 C12.9 2.3 13.3 4 13.3 6.2 V9.4 L21.2 14.4 V16.3 L13.3 13.9 L13.1 18.1 L16.2 20.4 V21.9 L12 20.9 L7.8 21.9 V20.4 L10.9 18.1 L10.7 13.9 L2.8 16.3 V14.4 L10.7 9.4 V6.2 C10.7 4 11.1 2.3 12 1.2 Z" /></svg>
        </div>
    </footer>
</template>

<script>
import { mapGetters } from "vuex";
import LpButton from "@/view/pages/public/components/LpButton.vue";

export default {
    name: "Footer",
    components: { LpButton },
    computed: {
        ...mapGetters(["isAuthenticated"]),
    },
};
</script>

<style>
.sf {
    position: relative; z-index: 6; overflow: hidden; padding: 88px 0 0; font-family: "Inter", sans-serif;
    background: linear-gradient(180deg, #F8F6F1 0%, #EEF4FD 55%, #DCEAFC 100%);
}
.sf-inner { position: relative; z-index: 1; }

.sf-top { display: grid; grid-template-columns: 1.1fr 1.4fr; gap: 56px; }
.sf-logo { height: 48px; width: auto; }
.sf-line { max-width: 340px; margin: 20px 0 24px; font-size: 1rem; line-height: 1.6; color: #4B5B78; }

.sf-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.sf-head { margin: 0 0 18px; font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #6B7A93; }
.sf-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.sf-col a, .sf-soon { font-size: .9375rem; font-weight: 500; color: #1E3A6E !important; text-decoration: none !important; transition: color .2s ease; }
.sf-col a:hover { color: #2F6FCF !important; }
.sf-col a:focus-visible { outline: 2px solid #3E8BEA; outline-offset: 3px; border-radius: 4px; }
.sf-soon { color: #9AA8C0 !important; }
.sf-soon em { margin-left: 6px; padding: 2px 8px; border-radius: 999px; background: #FCF3D6; color: #A77A0B; font-size: .6875rem; font-style: normal; font-weight: 700; }

.sf-bottom {
    display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 64px; padding: 22px 0;
    border-top: 1px solid rgba(30, 58, 110, .12);
}
.sf-copy { font-size: .875rem; color: #6B7A93; }
.sf-social { display: flex; gap: 10px; }
.sf-social a {
    display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: #fff; color: #2F6FCF !important;
    box-shadow: 0 6px 16px rgba(38, 68, 127, .10); transition: transform .2s ease, box-shadow .2s ease;
}
.sf-social a:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(38, 68, 127, .16); }
.sf-social a:focus-visible { outline: 2px solid #3E8BEA; outline-offset: 3px; }

/* The giant pale wordmark, cut by the bottom of the page, with the jet crossing it. */
.sf-mark { position: relative; display: flex; justify-content: center; margin-top: 16px; padding-bottom: 20px; pointer-events: none; user-select: none; }
.sf-word {
    display: block; font-size: clamp(140px, 24vw, 360px); font-weight: 700; line-height: .86; letter-spacing: -.06em; white-space: nowrap;
    background: linear-gradient(180deg, rgba(255, 255, 255, .98) 0%, rgba(255, 255, 255, .45) 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
}
/* The logo's dot, pale like the letters. */
.sf-word i {
    display: inline-block; width: .13em; height: .13em; margin-left: .03em; border-radius: 50%; vertical-align: baseline;
    background: rgba(255, 255, 255, .7); font-size: inherit; font-style: normal; color: transparent; overflow: hidden;
}
.sf-jet {
    position: absolute; top: 30%; left: -6%; width: clamp(28px, 3vw, 44px); fill: #2F6FCF; opacity: .55; transform: rotate(78deg);
    animation: sf-fly 22s linear infinite;
}
@keyframes sf-fly { from { left: -6%; top: 30%; } to { left: 106%; top: 4%; } }

@media (max-width: 991px) {
    .sf { padding-top: 64px; }
    .sf-top { grid-template-columns: 1fr; gap: 40px; }
}
@media (max-width: 575px) {
    .sf-cols { grid-template-columns: 1fr 1fr; }
    .sf-bottom { flex-direction: column-reverse; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
    .sf-jet { animation: none; left: 72%; }
    .sf-col a, .sf-social a { transition: none; }
}
</style>
