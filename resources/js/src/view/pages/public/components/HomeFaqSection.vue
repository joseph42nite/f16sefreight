<template>
    <section class="faq-section-container mb-25" id="faq-section" aria-labelledby="faq-heading">
        <b-row class="justify-content-center">
            <b-col lg="9">
                <div class="text-center mb-16">
                    <span class="section-eyebrow">Support</span>
                    <h2 id="faq-heading" class="section-title">Freight Automation FAQs</h2>
                    <p class="section-subtitle mt-4">Everything you need to know about the F16s freight management platform.</p>
                </div>

                <div class="faq-accordion-list">
                    <article v-for="(faq, idx) in accordions" :key="idx" 
                         class="faq-item" :class="{'is-open': faq.isOpen}">
                        <div class="faq-header" @click="toggleAccordion(idx)" 
                             role="button" :aria-expanded="faq.isOpen.toString()"
                             :aria-controls="`faq-content-${idx}`">
                            <h3 class="faq-question">{{ faq.title }}</h3>
                            <div class="faq-toggle-icon">
                                <div class="icon-line horizontal"></div>
                                <div class="icon-line vertical" :class="{'is-hidden': faq.isOpen}"></div>
                            </div>
                        </div>
                        <b-collapse v-model="faq.isOpen" :id="`faq-content-${idx}`">
                            <div class="faq-body">
                                <p>{{ faq.content }}</p>
                            </div>
                        </b-collapse>
                    </article>
                </div>

                <div class="faq-footer mt-16 text-center">
                    <div class="cta-glass-card">
                        <h2 class="cta-title">Still have questions about our logistics tools?</h2>
                        <p class="cta-subtitle mb-8">Can't find the answer you're looking for? Please contact our expert logistics team.</p>
                        <b-button to="/contact-us" class="hero-btn is-white" aria-label="Contact our support team">
                            <span>Get in Touch</span>
                            <div class="btn-icon">
                                <b-icon icon="arrow-right" aria-hidden="true"></b-icon>
                            </div>
                        </b-button>
                    </div>
                </div>
            </b-col>
        </b-row>
    </section>
</template>

<script>
export default {
    name: "HomeFaqSection",
    data() {
        return {
            accordions: [
                { title: "Does F16s support multiple AWB connections?", content: "Yes, our Pro plan allows users to connect multiple AWBs for seamless data transfer across airlines and logistics partners.", isOpen: false },
                { title: "Can I print my freight documents from F16s?", content: "Yes, our platform includes a document printing option for MAWB, HAWB and consolidation.", isOpen: false },
                { title: "Can I search for past AWBs?", content: "Yes, you can view the last 10, 20, 50, or 100 executed AWBs, check their history, and access shipment tracking, HAWB details, and message logs.", isOpen: false },
                { title: "What are the pricing options for F16s?", content: "We offer a Basic plan for database management and printable documentation, while the Pro plan includes multiple AWB connections and additional feature.", isOpen: false },
            ]
        };
    },
    methods: {
        toggleAccordion(index) {
            this.accordions[index].isOpen = !this.accordions[index].isOpen;
        }
    }
};
</script>


