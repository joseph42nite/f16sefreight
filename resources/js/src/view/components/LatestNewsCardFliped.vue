<template>
    <b-row align-h="center" align-v="center">
        <b-col v-for="(newsItem, index) in newsItems" :key="index" cols="12" sm="6" md="4" lg="4" xl="4" xxl="4" class="mb-16">
            <b-card class="text-center latest-news-card toggle-btn">
                <!-- Apply vue-flip to the flip-card container -->
                <vue-flip :active-click="true" class="flip-card" height="100%" width="100%">
                    <!-- Front Section: Image and Title -->
                    <template v-slot:front class="front">
                        <div class="latest-news-card-img">
                            <b-img
                                :src="newsItem.imgSrc"
                                :alt="newsItem.imgAlt"
                                class=""
                                style="width: 100%"
                            />
                        </div>
                        <div class="latest-news-card-title">
                            {{ newsItem.title }}
                        </div>
                    </template>
                    <!-- Back Section: Content (Text) -->
                    <template v-slot:back class="back">
                        <div class="toggle-content">
                            <div class="p-xl-18 p-lg-10 p-md-10 p-sm-10 p-10" style="overflow-x: hidden;">
                                <h2 class="text-left mb-4">{{ newsItem.innerTitle }}</h2>
                                <p class="text-left mb-4" v-html="newsItem.innerDescription"></p>
                                <hr />
                            </div>
                        </div>
                    </template>
                </vue-flip>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
// Import the VueFlip component
import VueFlip from 'vue-flip';

export default {
    components: {
        VueFlip, // Register it here
    },
    data() {
        return {
            // Array of Latest news items
            newsItems: [
                    {
                        imgSrc: "/media/custome/gallary/img-1.png",
                        imgAlt: 'latest news image',
                        title: "Andrea Gruber Joins MSC Air Cargo as Head of Service Excellence",
                        innerTitle: "Andrea Gruber Joins MSC Air Cargo as Head of Service Excellence",
                        innerDescription: "Andrea Gruber has been appointed as the Head of Service Excellence at MSC Air Cargo's headquarters in Geneva. With over two decades of experience in the air cargo sector, her addition is expected to enhance MSC's service quality and operational efficiency. (<a href='https://www.stattimes.com/' target='_blank'>STATTIMES.COM</a>)"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-2.png",
                        imgAlt: 'latest news image',
                        title: "India's Major Ports See 3.2% Cargo Volume Increase in December",
                        innerTitle: "India's Major Ports See 3.2% Cargo Volume Increase in December",
                        innerDescription: "In December, India's 12 major ports handled 72.2 million tonnes of cargo, marking a 3.22% growth. This rise is attributed to increased container volumes, despite a decline in iron ore shipments. (<a href='https://www.business-standard.com/' target='_blank'>BUSINESS-STANDARD.COM</a>)"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-3.png",
                        imgAlt: 'latest news image',
                        title: "Record Surge in North American Cargo Thefts in 2024",
                        innerTitle: "Record Surge in North American Cargo Thefts in 2024",
                        innerDescription: "According to Verisk's CargoNet, cargo theft incidents in North America increased by 27% in 2024, reaching a record 3,625 cases. The average value per theft also rose by 7.7%, with high-value items like electronics and consumables being primary targets. (<a href='https://www.ttnews.com/' target='_blank'>ttnews.com</a>)"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-4.png",
                        imgAlt: 'latest news image',
                        title: "Air Cargo Industry Outlook Survey Launched",
                        innerTitle: "Air Cargo Industry Outlook Survey Launched",
                        innerDescription: "Air Cargo News has initiated its annual survey, inviting airfreight professionals to share their perspectives on the industry's development in the coming year. The survey aims to gather insights on anticipated trends and challenges. (<a href='https://www.aircargonews.net/' target='_blank'>aircargonews.net</a>)"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-5.png",
                        imgAlt: 'latest news image',
                        title: "Crippling Cargo Fees Impact Australian Grain Exports",
                        innerTitle: "Crippling Cargo Fees Impact Australian Grain Exports",
                        innerDescription: "Australian farmers and exporters are facing significant challenges due to a 25% increase in landside fees by stevedoring companies over the past two years. These rising costs are affecting the competitiveness of grain exports, prompting calls for regulatory reforms. (<a href='https://www.theaustralian.com.au/' target='_blank'>theaustralian.com.au</a>)"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-6.png",
                        imgAlt: 'latest news image',
                        title: "Global Air Cargo Demand Surges Despite Economic Uncertainty",
                        innerTitle: "Global Air Cargo Demand Surges Despite Economic Uncertainty",
                        innerDescription: "The International Air Transport Association (IATA) reports that global air cargo demand has surged in early 2024, driven by increased e-commerce and supply chain resilience measures. Despite ongoing economic challenges, air freight capacity continues to expand to meet rising demands."
                    },
                ],
        };
    },
};
</script>

<style scoped>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

hr {
    border: 2px solid #355594;
    /* width: 100%; */
    border-radius: 50px;
}
.latest-news-card {
    background: linear-gradient(180deg, #d9efff 0%, #f1f9ff 71%);
    border-radius: 25px;
    position: relative; /* Important to make the flip card's position relative to this container */
    overflow: hidden; /* Prevent overflow when flipping */
    width: 100%; /* Ensure it takes full width of its column */
    height: 100%; /* Ensures it takes full height of its column */
}

.latest-news-card-img {
    padding: 10px;
    width: 100%; /* Ensures the image takes the full width of the card */
    height: auto; /* Ensures the image takes the full height of the card */
}

.latest-news-card-title {
    font-size: 20px;
    color: #355594;
    padding: 20px 12px;
    font-weight: 600;
    line-height: 26px;
}

.toggle-content {
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 25px;
    color: #355594;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: left;
    z-index: 2;
    /* overflow-x: hidden; */
}

.flip-card {
    perspective: 1000px;
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    display: flex; /* Ensures the card's front and back are aligned properly */
}

.flip-card .front,
.flip-card .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transition: transform 0.6s ease-in-out;

    display: flex;
    align-items: center;
    justify-content: center;
}

.flip-card .front {
    z-index: 2;
}

.flip-card .back {
    transform: rotateY(180deg);
    z-index: 1;
    visibility: hidden;
}

.card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 0px !important;
}

.flip-card:hover .back {
  transform: rotateY(0deg);
  visibility: visible;
}

</style>

<style>
.front {
    position: relative !important;
}
.back {
    height: 100%;
    overflow-y: auto;
    scrollbar-color: #355594 #355594;
}
.back::-webkit-scrollbar-thumb {
    background-color: #888; /* Set the color of the thumb (the draggable part) */
    border-radius: 6px;      /* Optional: rounded corners for the thumb */
}
@media (min-width: 576px) and (max-width: 768px) {
    hr {
        margin: 0;
        padding: 0;
    }
    .latest-news-card-title[data-v-6a110d6e] {
        font-size: 18px;
        line-height: 22px;
    }
}
@media (min-width: 897px) and (max-width: 921px) {
    
}
@media (min-width: 922px) and (max-width: 991px) {
    
}
@media (min-width: 992px) and (max-width: 1199px) {
    
}
@media (min-width: 1200px) and (max-width: 1400px) {
    
}
</style>