
<template>
    <b-container fluid class="main-container">
        <!-- Include Header -->
        <Header></Header>
        <b-container>
            <b-row align-h="center" align-v="center" class="mt-md-30 mt-sm-25 mt-20">
                <b-col cols="12">
                    <b-row align-h="center" align-v="center" style="position: relative;">
                        <div class="ellipse-1"><img src="/media/custome/circle/ellipse-1.png" alt="circle-image" id="" class="circle-image-1" /></div>
                        <div class="ellipse-2"><img src="/media/custome/circle/ellipse-2.png" alt="circle-image" id="" class="circle-image-2" /></div>
                        <div class="ellipse-3"><img src="/media/custome/circle/ellipse-3.png" alt="circle-image" id="" class="circle-image-3" /></div>
                        <b-col cols="12">
                            <div class="mb-md-30 mb-sm-20 mb-10">
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
                        <b-col cols="12" style="position: relative;">
                            <div class="ellipse-4"><img src="/media/custome/circle/ellipse-4.png" alt="circle-image" id="" class="circle-image-4" /></div>
                            <div class="ellipse-5"><img src="/media/custome/circle/ellipse-5.png" alt="circle-image" id="" class="circle-image-5" /></div>
                            <div class="ellipse-6"><img src="/media/custome/circle/ellipse-6.png" alt="circle-image" id="" class="circle-image-6" /></div>
                            <div class="my-md-30 my-sm-20 my-10">
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
                    <b-row align-h="center" align-v="center" class="my-md-30 my-sm-20 my-10">
                        <b-col cols="12">
                            <div class="mb-12">
                                <h2 class="section-title">What We Offer</h2>
                            </div>
                        </b-col>
                        <b-col
                            v-for="(we_offer_section_card, index) in we_offer_section_cards"
                            :key="index"
                            cols="12" sm="12" md="4" lg="4" xl="4" xxl="4"
                            class="mb-6"
                        >
                            <b-card
                                :style="{
                                    boxShadow: '-5px 0px 90px 0px #00000012',
                                    background: 'linear-gradient(180deg, #BBE2FF 0%, #FFFFFF 100%)',
                                    borderRadius: '18px'
                                }"
                            >
                                <div class="my-5 my-sm-8 my-md-10">
                                    <div style="padding-bottom: 16%; position: relative">
                                        <b-img :src="we_offer_section_card.titleImgSrc" :alt="we_offer_section_card.imgAlt" class="mx-auto" style="position: absolute; left: 10%; right: 10%; height: 0; width: 80%; height: 100%" />
                                    </div>
                                    <div style="padding-bottom: 42%; position: relative">
                                        <b-img :src="we_offer_section_card.imgSrc" :alt="we_offer_section_card.imgAlt" class="mx-auto" style="position: absolute; left: 0; height: 0; width: 100%; height: 100%" />
                                    </div>
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
                        <div class="ellipse-7"><img src="/media/custome/circle/ellipse-7.png" alt="circle-image" id="" class="circle-image-7" /></div>
                        <div class="ellipse-8"><img src="/media/custome/circle/ellipse-8.png" alt="circle-image" id="" class="circle-image-8" /></div>
                        <div class="ellipse-9"><img src="/media/custome/circle/ellipse-9.png" alt="circle-image" id="" class="circle-image-9" /></div>
                        <div class="my-md-30 my-sm-20 my-10">
                            <b-row align-h="center" align-v="center">
                                <b-col cols="12" class="text-center mb-14">
                                    <h2 class="section-title">Why Choose Us?</h2>
                                </b-col>
                                <b-col ccols="12" sm="12" md="4" lg="4" xl="4" xxl="4" class="d-flex justify-content-center mb-4">
                                    <div class="choose-us-item text-center">
                                        <b-img src="/media/custome/about/choose-us-1.svg" alt="Image 1" class="img-fluid mb-3" />
                                        <h5>Innovative Technology for Small Businesses</h5>
                                        <p>Our technology solutions are built with the needs of small enterprises in mind. From database solutions to a basic ERP system, F16s equips you with the tools to track your growth month on month, helping you identify areas for improvement and operational enhancements.</p>
                                    </div>
                                </b-col>
                                <b-col cols="12" sm="12" md="4" lg="4" xl="4" xxl="4" class="d-flex justify-content-center mb-4">
                                    <div class="choose-us-item text-center">
                                        <b-img src="/media/custome/about/choose-us-2.svg" alt="Image 2" class="img-fluid mb-3" />
                                        <h5>Affordable and Scalable</h5>
                                        <p>We understand the unique challenges small businesses face in logistics. Our pricing options are crafted to be budget-friendly, providing essential tools in our Basic plan like database management and printable documentation, while our Pro plan connects businesses to multiple AWBs and adds advanced features to support growing needs.</p>
                                    </div>
                                </b-col>
                                <b-col cols="12" sm="12" md="4" lg="4" xl="4" xxl="4" class="d-flex justify-content-center mb-4">
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
                        <div class="my-md-30 my-sm-20 my-2">
                            <b-row align-h="center" align-v="center">
                                <b-col cols="12" class="text-center mb-20">
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
.ellipse-1 {
    position: absolute;
    left: 95%;
    top: -22%;
}
.circle-image-1 {
    width: 60px;
    height: auto;
}
.ellipse-2 {
    position: absolute;
    left: 10%;
    top: 35%;
}
.circle-image-2 {
    width: 10px;
    height: auto;
}
.ellipse-3 {
    position: absolute;
    left: 5%;
    top: 54%;
}
.circle-image-3 {
    width: 25px;
    height: auto;
}
.ellipse-4 {
    position: absolute;
    left: 90%;
    top: 48%;
}
.circle-image-4 {
    width: 27px;
    height: auto;
}
.ellipse-5 {
    position: absolute;
    left: 12%;
    top: 42%;
} 
.circle-image-5 {
    width: 45px;
    height: auto;
}
.ellipse-6 {
    position: absolute;
    left: 7%;
    top: 60%;
}
.circle-image-6 {
    width: 10px;
    height: auto;
}
.ellipse-7 {
    position: absolute;
    left: 5%;
    top: 12%;
}
.circle-image-7 {
    width: 60px;
    height: auto;
}
.ellipse-8 {
    position: absolute;
    left: 16%;
    top: 17%;
}
.circle-image-8 {
    width: 10px;
    height: auto;
}
.ellipse-9 {
    position: absolute;
    left: 93%;
    top: 19%;
}
.circle-image-9 {
    width: 18px;
    height: auto;
}
/*  Custom css  */
@media (max-width: 480px) {
    .card-body {
        padding: 1rem !important;
    }
    .custom-card .card-title {
        margin: 2% 0% !important;
        font-size: 24px !important;
    }
    .custom-card-text {
        margin: 0% 1% !important;
        font-size: 10px !important;
        line-height: 14px !important;
    }
    .card-img-overlay {
        padding: 0.7rem !important;
    }
}
/* For Extra Small Screens (xs - <576px) */
@media (max-width: 575px) {
    .card-body {
        padding: 1rem !important;
    }
    .section-title {
        font-size: 32px !important;
        font-weight: 500;
        line-height: 36px !important;
        text-align: center;
        color: #355594;

    }
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
    .ellipse-1 {
        position: absolute;
        left: 86%;
        top: -8%;
    }
    .circle-image-1 {
        width: 35px;
        height: auto;
    }
    .ellipse-2 {
        position: absolute;
        left: 10%;
        top: 10%;
    }
    .circle-image-2 {
        width: 10px;
        height: auto;
    }
    .ellipse-3 {
        position: absolute;
        left: 5%;
        top: 26%;
    }
    .circle-image-3 {
        width: 20px;
        height: auto;
    }
    .ellipse-4 {
        position: absolute;
        left: 93%;
        top: 27%;
    }
    .circle-image-4 {
        width: 20px;
        height: auto;
    }
    .ellipse-5 {
        position: absolute;
        left: 4%;
        top: 25%;
    } 
    .circle-image-5 {
        width: 25px;
        height: auto;
    }
    .ellipse-6 {
        position: absolute;
        left: 4%;
        top: 37%;
    }
    .circle-image-6 {
        width: 8px;
        height: auto;
    }
    .ellipse-7 {
        position: absolute;
        left: 3%;
        top: 2%;
    }
    .circle-image-7 {
        width: 32px;
        height: auto;
    }
    .ellipse-8 {
        position: absolute;
        left: 17%;
        top: 5%;
    }
    .circle-image-8 {
        width: 10px;
        height: auto;
    }
    .ellipse-9 {
        position: absolute;
        left: 93%;
        top: 3%;
    }
    .circle-image-9 {
        width: 18px;
        height: auto;
    }
}

/* For Small Screens (sm - ≥576px) */
@media (min-width: 576px) and (max-width: 767px) {
    .card-body {
        padding: 2rem !important;
    }
    .section-title {
        font-size: 36px !important;
        font-weight: 500;
        line-height: 40px !important;
        text-align: center;
        color: #355594;

    }
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
        margin: 5% 0%;
        font-size: 40px;
    }
    .custom-card-text {
        margin: 0% 6%;
        font-size: 14px;
        line-height: 22px;

    }
    .ellipse-1 {
        position: absolute;
        left: 78%;
        top: -13%;
    }
    .circle-image-1 {
        width: 35px;
        height: auto;
    }
    .ellipse-2 {
        position: absolute;
        left: 10%;
        top: 10%;
    }
    .circle-image-2 {
        width: 10px;
        height: auto;
    }
    .ellipse-3 {
        position: absolute;
        left: 5%;
        top: 25%;
    }
    .circle-image-3 {
        width: 20px;
        height: auto;
    }
    .ellipse-4 {
        position: absolute;
        left: 90%;
        top: 36%;
    }
    .circle-image-4 {
        width: 20px;
        height: auto;
    }
    .ellipse-5 {
        position: absolute;
        left: 11%;
        top: 33%;
    } 
    .circle-image-5 {
        width: 25px;
        height: auto;
    }
    .ellipse-6 {
        position: absolute;
        left: 8%;
        top: 45%;
    }
    .circle-image-6 {
        width: 8px;
        height: auto;
    }
    .ellipse-7 {
        position: absolute;
        left: 7%;
        top: 4%;
    }
    .circle-image-7 {
        width: 40px;
        height: auto;
    }
    .ellipse-8 {
        position: absolute;
        left: 22%;
        top: 6%;
    }
    .circle-image-8 {
        width: 10px;
        height: auto;
    }
    .ellipse-9 {
        position: absolute;
        left: 93%;
        top:7%;
    }
    .circle-image-9 {
        width: 18px;
        height: auto;
    }
}

/* For Medium Screens (md - ≥768px) */
@media (min-width: 768px) and (max-width: 991px) {
    .card-body {
        padding: 1rem !important;
    }
    .section-title {
        font-size: 40px !important;
        font-weight: 500;
        line-height: 44px !important;
        text-align: center;
        color: #355594;

    }
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
        margin: 5% 0%;
        font-size: 44px;
    }
    .custom-card-text {
        margin: 0% 15%;
    }
    .ellipse-1 {
        position: absolute;
        left: 88%;
        top: -19%;
    }
    .circle-image-1 {
        width: 48px;
        height: auto;
    }
    .ellipse-2 {
        position: absolute;
        left: 10%;
        top: 12%;
    }
    .circle-image-2 {
        width: 10px;
        height: auto;
    }
    .ellipse-3 {
        position: absolute;
        left: 5%;
        top: 31%;
    }
    .circle-image-3 {
        width: 25px;
        height: auto;
    }
    .ellipse-4 {
        position: absolute;
        left: 92%;
        top: 43%;
    }
    .circle-image-4 {
        width: 27px;
        height: auto;
    }
    .ellipse-5 {
        position: absolute;
        left: 10%;
        top: 42%;
    } 
    .circle-image-5 {
        width: 40px;
        height: auto;
    }
    .ellipse-6 {
        position: absolute;
        left: 7%;
        top: 58%;
    }
    .circle-image-6 {
        width: 10px;
        height: auto;
    }
    .ellipse-7 {
        position: absolute;
        left: 5%;
        top: 10%;
    }
    .circle-image-7 {
        width: 45px;
        height: auto;
    }
    .ellipse-8 {
        position: absolute;
        left: 18%;
        top: 14%;
    }
    .circle-image-8 {
        width: 10px;
        height: auto;
    }
    .ellipse-9 {
        position: absolute;
        left: 93%;
        top: 15%;
    }
    .circle-image-9 {
        width: 18px;
        height: auto;
    }
}

/* For Large Screens (lg - ≥992px) */
@media (min-width: 992px) and (max-width: 1199px) {
    .section-title {
        font-size: 44px !important;
        font-weight: 500;
        line-height: 48px !important;
        text-align: center;
        color: #355594;

    }
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