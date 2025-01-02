
<template>
    <b-container fluid class="main-container">
        <!-- Include Header -->
        <Header></Header>
        <b-container>
            <b-row align-h="center" align-v="center">
                <b-col cols="12">
                    <b-row align-h="center" align-v="center">
                        <b-col cols="12">
                            <div class="my-30">
                                <h2 class="section-title">About Us</h2>
                                <b-row align-h="center" align-v="center">
                                    <b-col cols="10" sm="8" md="8" lg="8" xl="8" xxl="8" class="mt-12">
                                        <p class="aboutUs-section-text">At F16s E-Freight Solutions, we are dedicated to transforming logistics management by offering seamless, cost-effective digital solutions tailored to meet the needs of small to medium-sized businesses in the logistics and freight forwarding sectors. With a core focus on accessibility and user-friendliness, we empower businesses by streamlining data transfer, documentation, and tracking processes across air, sea, and road freight modes.</p>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col cols="12">
                    <b-row align-h="center" align-v="center">
                        <b-col cols="12">
                            <div class="my-30">
                                <h2 class="section-title">Our Vision</h2>
                                <b-row align-h="center" align-v="center">
                                    <b-col cols="10" sm="8" md="8" lg="8" xl="8" xxl="8" class="mt-12">
                                        <p class="vision-section-text">Our vision is to become the go-to digital partner for logistics businesses worldwide. We aim to empower small and growing companies to achieve greater efficiency and cost savings, enabling them to scale seamlessly. By providing reliable, intuitive tools and affordable service options, we’re making it easier for businesses of all sizes to thrive in today’s competitive landscape.</p>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col cols="12">
                    <b-row align-h="center" align-v="center">
                        <b-col cols="12">
                            <div class="my-30">
                                <h2 class="section-title">What We Offer</h2>
                            </div>
                        </b-col>
                        <b-col
                            v-for="(we_offer_section_card, index) in we_offer_section_cards"
                            :key="index"
                            cols="12" sm="4" md="4" lg="4" xl="4" xxl="4"
                            class="mb-6"
                        >
                            <b-card
                                :style="{
                                    boxShadow: '-5px 0px 90px 0px #00000012',
                                    background: 'linear-gradient(180deg, #BBE2FF 0%, #FFFFFF 100%)',
                                    borderRadius: '18px'
                                }"
                            >
                                <div class="my-10">
                                    <b-img :src="we_offer_section_card.titleImgSrc" :alt="we_offer_section_card.imgAlt" fluid class="d-block mx-auto my-2" />
                                    <b-img :src="we_offer_section_card.imgSrc" :alt="we_offer_section_card.imgAlt" fluid class="d-block mx-auto my-2" />
                                </div>
                                <b-card-text class="text-center offer-section-text">
                                    {{ we_offer_section_card.text }}
                                </b-card-text>
                                <div class="d-flex flex-row justify-content-center my-10">
                                    <router-link to="#">
                                        <b-button class="d-flex align-items-center text-center offer-section-btn">
                                            <span>Get</span>
                                            <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
                                        </b-button>
                                    </router-link>
                                </div>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col cols="12">
                    <b-row align-h="center" align-v="center">
                        <div class="my-30">
                            <b-row align-h="center" align-v="center">
                                <b-col cols="12" class="text-center mb-14">
                                    <h2 class="section-title">Why Choose Us?</h2>
                                </b-col>
                                <b-col ccols="12" sm="4" md="4" lg="4" xl="4" xxl="4" class="d-flex justify-content-center mb-4">
                                    <div class="choose-us-item text-center">
                                        <b-img src="/media/custome/about/choose-us-1.svg" alt="Image 1" class="img-fluid mb-3" />
                                        <h5>Innovative Technology for Small Businesses</h5>
                                        <p>Our technology solutions are built with the needs of small enterprises in mind. From database solutions to a basic ERP system, F16s equips you with the tools to track your growth month on month, helping you identify areas for improvement and operational enhancements.</p>
                                    </div>
                                </b-col>
                                <b-col cols="12" sm="4" md="4" lg="4" xl="4" xxl="4" class="d-flex justify-content-center mb-4">
                                    <div class="choose-us-item text-center">
                                        <b-img src="/media/custome/about/choose-us-2.svg" alt="Image 2" class="img-fluid mb-3" />
                                        <h5>Affordable and Scalable</h5>
                                        <p>We understand the unique challenges small businesses face in logistics. Our pricing options are crafted to be budget-friendly, providing essential tools in our Basic plan like database management and printable documentation, while our Pro plan connects businesses to multiple AWBs and adds advanced features to support growing needs.</p>
                                    </div>
                                </b-col>
                                <b-col cols="12" sm="4" md="4" lg="4" xl="4" xxl="4" class="d-flex justify-content-center mb-4">
                                    <div class="choose-us-item text-center">
                                        <b-img src="/media/custome/about/choose-us-3.svg" alt="Image 3" class="img-fluid mb-3" />
                                        <h5>Commitment to Customer Support</h5>
                                        <p>Our team is committed to helping you succeed. We offer dedicated support and resources for all our clients, ensuring that each business can leverage our platform to the fullest. We’re here to provide guidance, answer questions, and assist in adapting our solutions to meet your specific needs.</p>
                                    </div>
                                </b-col>
                            </b-row>
                        </div>
                    </b-row>
                </b-col>
                <b-col cols="12">
                    <b-row align-h="center" align-v="center">
                        <div class="my-30">
                            <b-row align-h="center" align-v="center">
                                <b-col cols="12" class="text-center mb-14">
                                    <b-card
                                        overlay
                                        img-src="/media/custome/about/bottom-img.png"
                                        img-alt="image"
                                        title="Our Story"
                                        class="custom-card"
                                    >
                                        <b-card-text class="custom-card-text">
                                            Founded in Bangalore, F16s E-Freight Solutions emerged from the combined knowledge and expertise of a freight-forwarding genius and a seasoned expert in the airline industry. Together, they envisioned a digital platform that would address the unique challenges faced by small and mid-sized logistics companies, who often lack access to the advanced tools available to larger players.
                                            <br />
                                            Recognizing the high cost and complexity of existing logistics solutions, they set out to create an affordable, easy-to-use platform tailored to empower businesses of all sizes. Their shared vision was to streamline logistics processes, enhance efficiency, and make sophisticated freight management accessible to everyone.
                                        </b-card-text>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </div>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </b-container>
</template>
<script>
    import Header from "@/view/layout/Header.vue";
    export default {
        data() {
            return {
                we_offer_section_cards: [
                    {
                        titleImgSrc: "/media/custome/about/focus-air.svg",
                        imgSrc: "/media/custome/about/plane.png",
                        imgAlt: "Focus air",
                        text: "Streamline your air freight data with seamless airline connectivity and real-time insights.",
                    },
                    {
                        titleImgSrc: "/media/custome/about/focus-sea.svg",
                        imgSrc: "/media/custome/about/boat.png",
                        imgAlt: "Focus sea",
                        text: "Simplify sea freight management with efficient stock control and sales analysis.",
                    },
                    {
                        titleImgSrc: "/media/custome/about/focus-road.svg",
                        imgSrc: "/media/custome/about/truck.png",
                        imgAlt: "Focus road",
                        text: "Manage road freight documentation and bookings with ease, complete with secure data transfers.",
                    },
                ],
            };
        },
        components: {
            Header
        },
    };
</script>
<style scoped>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

html, body, html * {
  font-family: 'Roboto', sans-serif !important;
}
.main-container {
    background: linear-gradient(180deg, #EDF7FF 10%, #FFFFFF 38%);
}
.section-title {
    font-size: 48px !important;
    font-weight: 500;
    line-height: 54px !important;
    text-align: center;
    color: #355594;

}
.vision-section-text, .aboutUs-section-text {
    font-size: 16px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color:#4C4C4C;
}
.offer-section-text {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: #4C4C4C;
    margin: 0;
}
.offer-section-btn {
    background: linear-gradient(360deg, rgba(119, 128, 177, 0.21) 0%, rgba(34, 50, 138, 0.21) 53.5%);
    border-radius: 30px;
    border: 0px;
    gap: 4px;
    font-size: 16px;
    font-weight: 400;
    padding: 6px;

}
.offer-section-btn:hover {
    background: #fff !important;
}
.offer-section-btn span {
    color: #3A3B7B;
    padding: 0px 10px;
    font-weight: 400;
}
.btn-icon {
    background: #fff;
    border-radius: 30px;
    font-size: 36px !important;
    font-weight: 600;
    padding: 4px;
    color: #355594;
}
.choose-us-item {
    vertical-align: top;
}
.choose-us-item h5 {
    font-size: 20px;
    font-weight: 700;
    line-height: 25px;
    text-align: center;
    color: #4C4C4C;
    vertical-align: top;

}
.choose-us-item p {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: #4C4C4C;
    vertical-align: top;

}
.choose-us-item img {
    vertical-align: top;

}

.custom-card {
    border-radius: 50px;
}
.custom-card img {
    border-radius: 50px;
}

.custom-card .card-title {
    font-size: 48px;
    font-weight: 500;
    line-height: 35px;
    text-align: center;
    color: #fff;
    margin: 8% 0%;
}
.custom-card-text {
    margin: 0% 27%;
    font-size: 16px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color: #4C4C4C;
    background: radial-gradient(50% 50% at 50% 50%, #FFFFFF 50%, rgba(255, 255, 255, 0) 100%);

}

.choose-us-item {
    padding: 1rem;
}
.choose-us-item h5 {
    padding: 1rem 2rem;

}
.choose-us-item p {
    padding: 1rem 2rem;

}

/* For Extra Small Screens (xs - <576px) */
@media (max-width: 575px) {
    .choose-us-item {
        padding: 1rem;
    }
    .choose-us-item h5 {
        padding: 1rem;

    }
    .choose-us-item p {
        padding: 1rem;

    }
    .custom-card .card-title {
        margin: 4% 0%;
        font-size: 36px;
    }
    .custom-card-text {
        margin: 0% 2%;
        font-size: 12px;
        line-height: 18px;


    }
}

/* For Small Screens (sm - ≥576px) */
@media (min-width: 576px) and (max-width: 767px) {
    .choose-us-item {
        padding: 1rem;
    }
    .choose-us-item h5 {
        padding: 1rem 0;

    }
    .choose-us-item p {
        padding: 1rem 0;

    }
    .custom-card .card-title {
        margin: 8% 0%;
        font-size: 40px;
    }
    .custom-card-text {
        margin: 0% 6%;
        font-size: 14px;
        line-height: 22px;

    }
}

/* For Medium Screens (md - ≥768px) */
@media (min-width: 768px) and (max-width: 991px) {
    .choose-us-item {
        padding: 1rem;
    }
    .choose-us-item h5 {
        padding: 1rem;

    }
    .choose-us-item p {
        padding: 1rem;

    }
    .custom-card .card-title {
        margin: 10% 0%;
        font-size: 44px;
    }
    .custom-card-text {
        margin: 0% 15%;

    }
}

/* For Large Screens (lg - ≥992px) */
@media (min-width: 992px) and (max-width: 1199px) {
    .choose-us-item {
        padding: 1rem;
    }
    .choose-us-item h5 {
        padding: 1rem;

    }
    .choose-us-item p {
        padding: 1rem;

    }
    .custom-card .card-title {
        margin: 10% 0%;
    }
    .custom-card-text {
        margin: 0% 12%;

    }
}

/* For Extra Large Screens (xl - ≥1200px) */
@media (min-width: 1200px) {
    
}
</style>