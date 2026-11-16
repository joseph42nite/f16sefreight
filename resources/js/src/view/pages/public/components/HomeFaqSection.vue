<template>
    <!--
        FAQs (redesigned 2026-11-16, owner: "why doesn't it look like FAQ, we are not giving any AI there"). A plain,
        classic FAQ: numbered questions split by thin rules, a + that turns into × when open, the answer underneath.
        No chat, no boxes. The line under it leads to the "Talk to us" form. Every answer is backed in
        docs/LANDING_PAGE.md. #faq-section stays: the footer's "FAQs" link jumps here.
    -->
    <section id="faq-section" class="lq" aria-labelledby="faq-heading">
        <header class="lp-head">
            <span class="lp-eyebrow">FAQ</span>
            <h2 id="faq-heading" class="lp-title">Frequently asked<br />questions.</h2>
            <p class="lp-sub">What forwarders ask us before they start.</p>
        </header>

        <ol class="lq-list">
            <li v-for="(faq, i) in faqs" :key="faq.q" class="lq-item" :class="{ 'is-open': open === i }">
                <h3 class="lq-h">
                    <button type="button" class="lq-q" :id="'lq-q-' + i" :aria-expanded="open === i ? 'true' : 'false'" :aria-controls="'lq-a-' + i" @click="toggle(i)">
                        <span class="lq-num">{{ String(i + 1).padStart(2, "0") }}</span>
                        <span class="lq-text">{{ faq.q }}</span>
                        <span class="lq-sign" aria-hidden="true"></span>
                    </button>
                </h3>
                <b-collapse :id="'lq-a-' + i" :visible="open === i" role="region" :aria-labelledby="'lq-q-' + i">
                    <p class="lq-a">{{ faq.a }}</p>
                </b-collapse>
            </li>
        </ol>

        <p class="lq-more">
            Still have a question?
            <a href="#talk-to-us" @click.prevent="toForm">Talk to us <b-icon icon="arrow-down" aria-hidden="true"></b-icon></a>
        </p>
    </section>
</template>

<script>
const FAQS = [
    {
        q: "Which email does F16s work with?",
        a: "Outlook and Microsoft 365 today. Your shared mailbox is read every two minutes, and client mails are sorted into import and export enquiries. Gmail is on the way.",
    },
    {
        q: "How does the AI fill an air waybill?",
        a: "Drop in the client's commercial invoice and packing list. The AI reads them and fills the waybill: shipper, consignee, pieces, weight and goods. You check what it flags and confirm. For scanned documents it asks before it spends a credit.",
    },
    {
        q: "How do airlines receive my e-AWB?",
        a: "As Cargo-XML (FWB and FHL) through the Descartes network. The airline's accept or reject comes back onto the waybill, and status updates follow the shipment until it is delivered.",
    },
    {
        q: "Can I see how my team and my clients are doing?",
        a: "Yes. Every lost enquiry keeps its reason, so you see which clients left and why. Each person has a workload score and a quarterly review, and operations figures such as days slower per step and airline rejections are worked out for you.",
    },
    {
        // Matches the Plans section (HomePlans.vue), which is taken from the code.
        q: "What plans are there?",
        a: "Three. Core covers your documents: air waybills, sea bills of lading and consolidation. Tactical adds the team: roles for pricing, operations, sales and the boss, the AI-sorted inbox, the board and AI document reading. Command adds the accounts desk, the ledger and month close, and the boss's financial reports. Prices on request.",
    },
    {
        q: "Is my data safe?",
        a: "Each company's and branch's data is kept apart. Every action goes into an audit log that cannot be changed, every upload is scanned for viruses, and mailbox and bank details are encrypted.",
    },
];

export default {
    name: "HomeFaqSection",
    data: () => ({ faqs: FAQS, open: 0 }),
    methods: {
        toggle(i) {
            this.open = this.open === i ? -1 : i;
        },
        // "Talk to us" leads to the form just below.
        toForm() {
            const el = document.getElementById("talk-to-us");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        },
    },
};
</script>

<style>
.lq { padding: 72px 0 40px; font-family: "Inter", sans-serif; }
.lq .lp-head { margin-bottom: 40px; }

/* A classic list: numbered questions, thin rules between them, no boxes. */
.lq-list { list-style: none; max-width: 860px; margin: 0 auto; padding: 0; border-top: 1px solid rgba(30, 58, 110, .12); }
.lq-item { border-bottom: 1px solid rgba(30, 58, 110, .12); }
.lq-h { margin: 0; }
.lq-q {
    display: flex; align-items: center; gap: 20px; width: 100%; padding: 24px 4px; border: 0; background: none; cursor: pointer; text-align: left;
    font: 600 1.125rem "Inter", sans-serif; letter-spacing: -.01em; color: #102552; transition: color .2s ease;
}
.lq-q:hover { color: #2F6FCF; }
.lq-q:focus-visible { outline: 2px solid #3E8BEA; outline-offset: 2px; border-radius: 10px; }
.lq-num { flex: 0 0 auto; width: 28px; font-size: .8125rem; font-weight: 700; color: #9AA8C0; font-variant-numeric: tabular-nums; transition: color .2s ease; }
.lq-item.is-open .lq-num { color: #2F6FCF; }
.lq-text { flex: 1 1 auto; }

/* + that turns into × when open. */
.lq-sign {
    position: relative; flex: 0 0 36px; height: 36px; border-radius: 50%; background: #EEF3FB; transition: background .25s ease, transform .3s ease;
}
.lq-sign::before, .lq-sign::after { content: ""; position: absolute; left: 50%; top: 50%; width: 14px; height: 2px; margin: -1px 0 0 -7px; border-radius: 2px; background: #2F6FCF; transition: background .25s ease; }
.lq-sign::after { transform: rotate(90deg); }
.lq-item.is-open .lq-sign { background: #2F6FCF; transform: rotate(45deg); }
.lq-item.is-open .lq-sign::before, .lq-item.is-open .lq-sign::after { background: #fff; }

.lq-a { margin: 0; padding: 0 60px 26px 52px; font-size: 1rem; line-height: 1.7; color: #4B5B78; }

.lq-more { margin: 32px 0 0; text-align: center; font-size: .9375rem; color: #6B7A93; }
.lq-more a { display: inline-flex; align-items: center; gap: 6px; margin-left: 6px; font-weight: 600; color: #2F6FCF !important; text-decoration: none !important; }
.lq-more a:hover { text-decoration: underline !important; }

@media (max-width: 575px) {
    .lq-q { gap: 12px; padding: 20px 0; font-size: 1rem; }
    .lq-num { width: 22px; }
    .lq-sign { flex-basis: 30px; height: 30px; }
    .lq-a { padding: 0 0 22px 34px; font-size: .9375rem; }
}
@media (prefers-reduced-motion: reduce) {
    .lq-q, .lq-num, .lq-sign, .lq-sign::before, .lq-sign::after { transition: none; }
}
</style>
