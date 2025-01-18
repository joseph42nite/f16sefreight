
<template>
    <b-container fluid class="main-container">
        <!-- Include Header -->
        <Header></Header>
        <b-container>
            <b-row align-h="center" align-v="center" style="position: relative">
                <div class="ellipse-1"><img src="/media/custome/circle/ellipse-1.png" alt="circle-image" id="" class="circle-image-1" /></div>
                <div class="ellipse-2"><img src="/media/custome/circle/ellipse-2.png" alt="circle-image" id="" class="circle-image-2" /></div>
                <div class="ellipse-3"><img src="/media/custome/circle/ellipse-3.png" alt="circle-image" id="" class="circle-image-3" /></div>
                <div class="ellipse-4"><img src="/media/custome/circle/ellipse-4.png" alt="circle-image" id="" class="circle-image-4" /></div>
                <div class="ellipse-5"><img src="/media/custome/circle/ellipse-5.png" alt="circle-image" id="" class="circle-image-5" /></div>
                <b-col cols="12">
                    <b-row class="d-flex flex-row justify-content-center align-items-center" style="width: 90%;margin: 6% 5% 0%;">
                        <!-- Primary Banner Text Image -->
                        <b-col cols="12" class="">
                            <img :src="banner_primary_text" alt="Banner-primary-text" id="Banner-primary-text" class="" style="width: 92%;display:block;margin:auto" />
                        </b-col>
                        <!-- Left Description Column -->
                        <b-col cols="12" md="4" lg="4" class="banner-description-container">
                            <h4 class="text-left banner-description mb-8">
                                Whether you need fast and reliable data flow for airlines or simplified document handling for sea and road transport, we’ve got you covered.
                            </h4>
                            <b-button to="/about-us" class="d-flex align-items-center mb-8 exp-btn">
                                <span>Explore Now</span>
                                <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
                            </b-button>
                        </b-col>
                        <!-- Right Banner Image Column -->
                        <b-col cols="12" md="8" lg="8" class="banner-image-container">
                            <div class="banner">
                                <img :src="banner" alt="Banner-image" id="Banner-image" class="banner-image" />
                                <!-- Gray Shadow Div Below the Image -->
                                <div class="gray-shadow"></div>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <!-- Affiliations section start here -->
            <b-row align-h="center" align-v="center">
                <b-col cols="12" class="my-15 my-md-20 my-lg-25">
                    <b-row align-h="center" align-v="center">
                        <b-col cols="4" sm="3" md="3" lg="3" xl="2" class="">
                           <p class="affiliation m-0">Affiliations:</p> 
                        </b-col>
                        <b-col cols="8" sm="9" md="9" lg="9" xl="10" class="parent-scroll-container">
                            <!-- Child divs that will be displayed horizontally and scrollable -->
                            <div class="child-scroll-container">
                                <div class="child-div" v-for="(affiliate, index) in affiliates" ><b-img :src="affiliate.imgSrc" :alt="affiliate.imgAlt" class="img-fluid d-block" style="width: 100%;" /></div>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <!-- What F16s can do for you -->
            <b-row align-h="center" align-v="center">
                <b-col cols="12" class="my-15 my-md-20 my-lg-25">
                    <b-row align-h="center" align-v="center" style="position:relative;">
                        <div class="ellipse-6"><img src="/media/custome/circle/ellipse-6.png" alt="circle-image" id="" class="circle-image-6" /></div>
                        <b-col cols="12" class="mb-15 mb-md-20 mb-lg-25">
                            <h2 class="section-title">Learn what F16s can do for you</h2>
                        </b-col>
                        <b-col
                            v-for="(serviceCard, index) in serviceCards"
                            :key="index"
                            cols="12" sm="6" md="3" lg="3" xl="3" xxl="3"
                            class="mb-6 mb-md-20 service-card"
                            >
                            <b-card class="mb-2 text-center">
                                <div class="card-img">
                                    <b-img :src="serviceCard.imgSrc" :alt="serviceCard.imgAlt" class="card-img-img d-block" />
                                </div>
                                <div class="service-card-title py-xl-10 py-lg-10 py-md-14 py-sm-10 py-10">
                                    <p v-html="serviceCard.title"></p>
                                </div>
                                <div class="service-card-btn-container">
                                    <b-button class="service-card-arrow-btn">
                                        <b-icon icon="arrow-right" font-scale="2" class="service-card-btn-icon ms-2"></b-icon>
                                    </b-button>
                                </div>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row align-h="center" align-v="center">
                <b-col cols="12" class="my-15 my-md-20 my-lg-25">
                    <b-row align-h="center" align-v="center" style="position: relative;">
                        <div class="ellipse-7"><img src="/media/custome/circle/ellipse-7.png" alt="circle-image" id="" class="circle-image-7" /></div>
                        <div class="ellipse-8"><img src="/media/custome/circle/ellipse-8.png" alt="circle-image" id="" class="circle-image-8" /></div>
                        <div class="ellipse-9"><img src="/media/custome/circle/ellipse-9.png" alt="circle-image" id="" class="circle-image-9" /></div>
                        <div class="ellipse-10"><img src="/media/custome/circle/ellipse-10.png" alt="circle-image" id="" class="circle-image-10" /></div>
                        <b-col cols="12">
                            <div>
                                <h2 class="section-title mb-8">Connecting global freight networks with smart data solutions</h2>
                            </div>
                        </b-col>
                        <b-col cols="10" md="10" lg="10" xl="8" class="">
                            <div class="d-flex flex-row justify-content-center text-center">
                                <h6 class="section-sub-title mb-8">F16s E-Freight Solutions provides seamless data transmission and documentation for air, sea, and road freight.</h6>
                            </div>
                            <div class="d-flex flex-row justify-content-center">
                                <b-button to="/about-us" class="learnMore-btn">Learn More</b-button>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <!-- slider -->
            <b-row align-h="center" align-v="center">
                <b-col cols="12">
                    <div>
                        <h2 class="section-title mb-10">Our Services</h2>
                    </div>
                    <HomeCarousel></HomeCarousel>
                </b-col>
            </b-row>
            <!-- end Slider -->
            <!-- Business count section start here -->
            <b-row align-h="center" align-v="center">
                <b-col cols="12" class="my-15 my-md-20 my-lg-25">
                    <b-row align-h="center" align-v="center" style="position: relative;">
                        <div class="ellipse-11"><img src="/media/custome/circle/ellipse-7.png" alt="circle-image" id="" class="circle-image-11" /></div>
                        <div class="ellipse-12"><img src="/media/custome/circle/ellipse-8.png" alt="circle-image" id="" class="circle-image-12" /></div>
                        <div class="ellipse-13"><img src="/media/custome/circle/ellipse-10.png" alt="circle-image" id="" class="circle-image-13" /></div>
                        <b-col cols="12" class="">
                        `    <div>
                                <h2 class="section-title mb-4">Making Best, Even Better.</h2>
                                <h6 class="section-sub-title mb-16">Your partner for smarter, faster operations and freight solutions.</h6>
                            </div>
                        </b-col>
                        <b-col cols="12" sm="4" md="4" lg="4" xl="4" xxl="4" class="mb-14 business-count" ref="countSection1">
                            <h1 class="text-center">{{ count1 }}+</h1>
                            <p class="text-center">Data transmitted</p>
                        </b-col>
                        <b-col cols="12" sm="4" md="4" lg="4" xl="4" xxl="4" class="mb-14 business-count" ref="countSection2">
                            <h1 class="text-center">{{ count2 }}+</h1>
                            <p class="text-center">Cities</p>
                        </b-col>
                        <b-col cols="12" sm="4" md="4" lg="4" xl="4" xxl="4" class="mb-14 business-count" ref="countSection3">
                            <h1 class="text-center">{{ count3 }}+</h1>
                            <p class="text-center">Airline affiliations</p>
                        </b-col>`
                    </b-row>
                </b-col>
            </b-row>

            <!-- Latest News section with flip  -->
                    <LatestNewsCardFliped></LatestNewsCardFliped>
             <!-- end New section with flip  -->

            <!-- Latest News section start here -->
            <!-- <b-row align-h="center" align-v="center">
                <b-col cols="12" class="mt-18 mb-7">
                    <div>
                        <h2 class="section-title text-center my-12">Latest Logistics News</h2>
                    </div>
                </b-col>
                <b-col
                    v-for="(newsItem, index) in newsItems"
                    :key="index"
                    cols="12" sm="4" md="4" lg="4" xl="4" xxl="4"
                    class="mb-16"
                >
                    <b-card class="text-center latest-news-card toggle-btn" @click="toggleSlide">
                        <template v-slot:default>
                            <div class="front">
                                <div class="latest-news-card-img">
                                    <b-img :src="newsItem.imgSrc" :alt="newsItem.imgAlt" class="img-fluid d-block" style="width: 100%;" />
                                </div>
                                <div class="latest-news-card-title">
                                    {{ newsItem.title }}
                                </div>
                                <div class="toggle-content"
                                    :class="{ 'slide-up': !isVisible }"
                                    v-show="isVisible">
                                    <h2>{{ newsItem.innerTitle }}</h2>
                                    <p>{{ newsItem.innerDescription }}</p>
                                    <hr/>
                                </div>
                            </div>
                        </template>
                    </b-card>
                </b-col>
                <b-col cols="12" class="mb-8">
                    <div class="d-flex flex-row justify-content-center">
                        <b-button class="expMore-btn">Explore More</b-button>
                    </div>
                </b-col>
            </b-row> -->
            <b-col cols="12" class="mb-8">
                <div class="d-flex flex-row justify-content-center">
                    <b-button class="expMore-btn">Explore More</b-button>
                </div>
            </b-col>
            <!-- FAQs Accordion section start here -->
            <b-row align-h="center" align-v="center" id="faq-section">
                <b-col cols="12" class="my-12 my-md-16 my-lg-20">
                    <b-row align-h="center" align-v="center">
                        <b-col cols="12" class="">
                            <div>
                                <h2 class="section-title mb-10">FAQs</h2>
                            </div>
                        </b-col>
                        <b-col cols="12" class="mb-20">
                            <div class="mb-6 accordion-box"
                                v-for="(accordion, index) in accordions" :key="index"
                                :style="{ background: accordion.isOpen ? '#355594' : '#F1F9FF8A'}"
                                @click="toggleAccordion(index)">
                                <div class="d-flex flex-row justify-content-between align-items-center cursor-pointer text-left">
                                    <h5 class="faq-accordion-title" :style="{ color: accordion.isOpen ? '#ffffff' : '#4C4C4C' }">
                                        {{ accordion.title }}
                                    </h5>
                                    <!-- Show chevron-down if closed -->
                                    <b-icon v-if="!accordion.isOpen" icon="chevron-compact-down" scale="2" :style="{ color: accordion.isOpen ? '#ffffff' : '#4C4C4C', }"></b-icon>
                                </div>
                                <b-collapse v-model="accordion.isOpen" class="mt-2">
                                    <b-card class="accordion-card">
                                        <div class="d-flex flex-row justify-content-between cursor-pointer">
                                            <p class="" :style="{ color: accordion.isOpen ? '#ffffff' : '#4C4C4C' }">
                                                {{ accordion.content }}
                                            </p>
                                            <!-- Show chevron-up if open -->
                                            <b-icon v-if="accordion.isOpen" icon="chevron-compact-up" scale="2" :style="{ color: accordion.isOpen ? '#ffffff' : '#4C4C4C', }"></b-icon>
                                        </div>
                                    </b-card>
                                </b-collapse>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </b-container>
</template>

<script>
    import Header from "@/view/layout/Header.vue";
    import HomeCarousel from "../components/HomeCarousel.vue";
    import LatestNewsCardFliped from "../components/LatestNewsCardFliped.vue";
    export default {
        name: "Home",
        data(){
            return{
                banner: "/media/custome/banner-plane.svg",
                banner_primary_text: "/media/custome/banner-primary-text.svg",
                count1: 0,
                count2: 0,
                count3: 0,
                targetCounts: {
                    count1: 100,
                    count2: 10,
                    count3: 100,
                },
                hasAnimated: {
                    count1: false,
                    count2: false,
                    count3: false,
                },
                affiliates: [
                    {
                        imgSrc: "/media/custome/affiliation-tags/air-france.svg",
                        imgAlt: "air france"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/emirates.svg",
                        imgAlt: "emirates"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/lufthansa.svg",
                        imgAlt: "lufthansa"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/qatar.svg",
                        imgAlt: "qatar"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/turkish-airlines.svg",
                        imgAlt: "turkish-airlines"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/air-france.svg",
                        imgAlt: "air france"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/emirates.svg",
                        imgAlt: "emirates"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/lufthansa.svg",
                        imgAlt: "lufthansa"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/air-france.svg",
                        imgAlt: "air france"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/emirates.svg",
                        imgAlt: "emirates"
                    },
                    {
                        imgSrc: "/media/custome/affiliation-tags/lufthansa.svg",
                        imgAlt: "lufthansa"
                    },
                ],
                // Array of Services section
                serviceCards: [
                    {
                        imgSrc: "/media/custome/small-business.png",
                        imgAlt: "business",
                        title: "Small<br />Business",
                    },
                    {
                        imgSrc: "/media/custome/cloud-storage.png",
                        imgAlt: "cloud storage",
                        title: "Cloud<br />Storage",
                    },
                    {
                        imgSrc: "/media/custome/privacy.png",
                        imgAlt: "privacy",
                        title: "Privacy<br /> &nbsp;",
                    },
                    {
                        imgSrc: "/media/custome/end-to-end-service.png",
                        imgAlt: "end to end service",
                        title: "End to End<br />Service",
                    }
                ],
                // Array of Latest news items
                newsItems: [
                    {
                        imgSrc: "/media/custome/gallary/img-1.png",
                        imgAlt: 'latest news image-1',
                        title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerTitle: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerDescription: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-2.png",
                        imgAlt: 'latest news image-2',
                        title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerTitle: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerDescription: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-3.png",
                        imgAlt: 'latest news image-3',
                        title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerTitle: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerDescription: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-4.png",
                        imgAlt: 'latest news image-4',
                        title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerTitle: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerDescription: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-5.png",
                        imgAlt: 'latest news image-5',
                        title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerTitle: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerDescription: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......"
                    },
                    {
                        imgSrc: "/media/custome/gallary/img-6.png",
                        imgAlt: 'latest news image-6',
                        title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerTitle: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                        innerDescription: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......"
                    },
                ],
                isVisible: true,
                // Array of Faqs Accordion section
                accordions: [
                    {
                        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius.",
                        isOpen: false,
                    },
                    {
                        title: "Phasellus ultricies quam in elit tristique scelerisque?",
                        content: "Phasellus ultricies quam in elit tristique scelerisque. Mauris vestibulum nisl eu felis congue, ac tempor nulla scelerisque.",
                        isOpen: false,
                    },
                    {
                        title: "Donec quis magna nec sapien congue varius non sit amet urna?",
                        content: "Donec quis magna nec sapien congue varius non sit amet urna. Vivamus dignissim metus id dolor ultricies, vitae malesuada neque auctor.",
                        isOpen: false,
                    },
                ],
            }
        },
        components: {
            Header,
            HomeCarousel,
            LatestNewsCardFliped
        },
        methods: {
            toggleSlide() {
                this.isVisible = !this.isVisible; // Toggle visibility on button click
            },
            animateCount(target, key) {
                const duration = 10000; // Animation duration in milliseconds
                const increment = Math.ceil(target / (duration / 16)); // Calculate increment per frame (16ms per frame)

                const interval = setInterval(() => {
                    if (this[key] < target) {
                    this[key] = Math.min(this[key] + increment, target); // Increment count, cap at target
                    } else {
                    clearInterval(interval);
                    }
                }, 16);
            },

            toggleAccordion(index) {
                // Check if the index is valid
                if (index >= 0 && index < this.accordions.length) {
                    this.accordions[index].isOpen = !this.accordions[index].isOpen;
                } else {
                    console.error("Accordion index is invalid:", index);
                }
            },

            // Check if the element is in the viewport
            isElementInViewport(element) {
                const rect = element.getBoundingClientRect();
                return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
            },

            // Method to check visibility periodically
            checkVisibility() {
                if (!this.hasAnimated.count1 && this.isElementInViewport(this.$refs.countSection1)) {
                    this.animateCount(this.targetCounts.count1, "count1");
                    this.hasAnimated.count1 = true;
                }
                if (!this.hasAnimated.count2 && this.isElementInViewport(this.$refs.countSection2)) {
                    this.animateCount(this.targetCounts.count2, "count2");
                    this.hasAnimated.count2 = true;
                }
                if (!this.hasAnimated.count3 && this.isElementInViewport(this.$refs.countSection3)) {
                    this.animateCount(this.targetCounts.count3, "count3");
                    this.hasAnimated.count3 = true;
                }

                // If any section has not yet animated, keep checking
                if (!this.hasAnimated.count1 || !this.hasAnimated.count2 || !this.hasAnimated.count3) {
                    requestAnimationFrame(this.checkVisibility);
                }
            },
        },
        mounted() {
            // Start checking visibility when the component is mounted
            requestAnimationFrame(this.checkVisibility);
        },

    };
</script>

<style scoped>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);


/* /////////////////////////////////////////////////////////////////////////////////////////////////////// */
html, body * {
  font-family: 'Roboto', sans-serif !important;
  scroll-behavior: smooth !important;
}
hr {
    width: 72%;
    margin-right: 5rem;
    margin-left: 4rem;
    background-color: #fff;
    border: 2px solid;
    border-radius: 10px;
    margin-bottom: 2rem;
}
.main-container {
    background: linear-gradient(180deg, #D0E6F8 20%, #FFFFFF 58%);
}
.ellipse-1 {
    position: absolute;
    left: 93%;
    top: 5%;
}
.ellipse-2 {
    position: absolute;
    left: 99%;
    top: 7%;
}
.ellipse-3 {
    position: absolute;
    left: 98%;
    top: 16%;
}
.ellipse-4 {
    position: absolute;
    left: 0%;
    top: 68%;
}
.ellipse-5 {
    position: absolute;
    left: 96%;
    top: 100%;
}
.ellipse-6 {
    position: absolute;
    left: -1%;
    top: 39%;
}
.ellipse-7 {
    position: absolute;
    left: 16%;
    top: -42%;
}
.ellipse-8 {
    position: absolute;
    left: 14%;
    top: -20%;
}
.ellipse-9 {
    position: absolute;
    left: 80%;
    top: 18%;
}
.ellipse-10 {
    position: absolute;
    left: 78%;
    top: 48%;
}
.ellipse-11 {
    position: absolute;
    left: 0%;
    top: -31%;
}
.ellipse-12 {
    position: absolute;
    left: 5%;
    top: -29%;
}
.ellipse-13 {
    position: absolute;
    left: 98%;
    top: 12%;
}
.circle-image-1 {
    width: 80%;
}
.circle-image-2 {
    width: 80%;
}
.circle-image-3 {
    width: 90%;
}
.circle-image-4 {
    width: 80%;
}
.circle-image-5 {
    width: 90%;
}
.circle-image-6 {
    width: 80%;
}
.circle-image-7 {
    width: 80%;
}
.circle-image-8 {
    width: 90%;
}
.circle-image-9 {
    width: 80%;
}
.circle-image-10 {
    width: 90%;
}
.circle-image-11 {
    width: 90%;
}
.circle-image-12 {
    width: 90%;
}
.circle-image-13 {
    width: 80%;
}
.banner-description {
    margin-left: 10%;
    margin-top: -16%;
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    color: #4A5568;
    font-family: 'Inter', sans-serif !important;
}
.banner-image {
    width: 112%;
    margin-top: -6%;
    position: relative;
    z-index: 99;
}
.gray-shadow {
    width: 30%;
    height: 20px;
    box-shadow: 0px 0px 20px 20px #7575752e;
    position: absolute;
    top: 59%;
    border-radius: 50%;
    left: 40%;
    background: #7575752e;
    backdrop-filter: blur(3px);
}
.banner-image-container {
    margin-top: -2%;
}
.section-title {
    font-size: 32px !important;
    font-weight: 600;
    line-height: 40px !important;
    text-align: center;
    color: #355594;

}
.section-sub-title {
    font-size: 24px !important;
    line-height: 28px !important;
    text-align: center;
    color: #6D7A8C;
    font-weight: 400;
}
.exp-btn {
    background: linear-gradient(360deg, rgba(119, 128, 177, 0.21) 0%, rgba(34, 50, 138, 0.21) 53.5%);
    border-radius: 30px;
    border: 0px;
    gap: 25px;
    padding: 8px 5px;
    max-width: fit-content;
    margin-left: 10%;
}
.exp-btn:hover {
    background: #fff !important;
}
.exp-btn span {
    color: #355594;
    font-size: 16px;
    line-height: 22px;
    padding-left: 15px;
    font-weight: 600;
}
.exp-btn .btn-icon {
    background: #fff;
    border-radius: 30px;
    font-size: 36px !important;
    font-weight: 600;
    padding: 4px;
    color: #355594;
}
.affiliation {
    font-size: 32px;
    font-weight: 500;
    line-height: 71px;
    color: #355594;
    text-align: center;
}
.parent-scroll-container {
    width: 100%;
    overflow-x: auto; /* Enable horizontal scrolling */
    white-space: nowrap; /* Prevent content from wrapping */
    scrollbar-width: none;  /* Firefox */
    max-width: 100%; /* Ensure the parent div doesn't overflow the screen */
}
/* For Webkit browsers like Chrome, Safari */
.parent-scroll-container::-webkit-scrollbar {
  display: none;  /* Hide the scrollbar */
}
.child-scroll-container {
    display: flex; /* Make child divs align in a row */
    gap:60px;
}
.child-div {
    min-width: 120px;
    margin: auto;
}
.service-card {
    position: relative;
}
.service-card .card {
    border-radius: 18px;
    border: double 1.5px transparent;
    /* background-image: linear-gradient(white, white), linear-gradient(152.6deg, #ABC0FF 58.02%, rgba(255, 255, 255, 0) 91.63%); */
    background-image: linear-gradient(white, white), linear-gradient(151.6deg, #ABC0FF 20%, rgba(255, 255, 255, 0) 100%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    /* height: 400px !important; */
}
.service-card .card-body {
    padding: 0;
}
.service-card .card-img {
    padding: 40px 0px 0px !important;
    width: 80%;
    margin: auto;
    object-fit: cover;
}
.service-card .card-img-img {
    width:100%;
    margin:auto;
    aspect-ratio: 13 / 12;
}
.service-card-title p {
    color: #3b3c7c;
    font-size: 24px !important;
    line-height: 30px !important;
    font-weight: 300;
    padding: 10px 0px;
    margin: 0;
}
.service-card-btn-container {
    position: absolute;
    right: -3%;
    top: 86%;
}
.service-card-arrow-btn {
    background: #e3edff00 !important;
    border:0px;
    border-radius: 0px;
    padding: 0px;
}
.service-card-btn-icon {
    background: #E3EDFF42;
    backdrop-filter: blur(20px);
    border-radius: 30px;
    font-size: 56px !important;
    padding: 18px;
    color: #355594;
    box-shadow: 1px 1px 10px 1px #00000040;
}
.service-card-btn-icon:hover {
    background: #355594;
    color: #fff;
}
.learnMore-btn {
    background: #00000000;
    border: 1px solid #355594;
    color: #355594;
    border-radius: 30px;
    padding: 12px 24px;
}
.learnMore-btn:hover {
    background: #00000000 !important;
    border: 1px solid #355594 !important;
    color: #355594 !important;
    box-shadow: 1px 0px 10px 0px #00000040;
}
.business-count h1{
    color:#355594;
    font-size: 64px;
    font-weight: 700;
}
.business-count p{
    color:#6D7A8C;
    font-size: 24px;
    line-height: 20px;
}
.latest-news-card {
    background: linear-gradient(180deg, #D9EFFF 0%, #F1F9FF 71%);
    border-radius: 25px;
}
.latest-news-card .card-body {
    width:100%;
    padding: 0px !important;
    position: relative;
    z-index: 100;
}
.latest-news-card-img {
    padding: 10px;
}
.latest-news-card-title {
    font-size: 20px;
    color: #355594;
    padding: 20px 12px;
    font-weight: 600;
    line-height: 26px;
}
.expMore-btn {
    background: #00000000;
    border: 0px;
    font-size: 16px !important;
    color: #3A3B7B;
    border-radius: 0px;
    padding: 0px;
    text-decoration: underline;
}
.expMore-btn:hover {
    background: #00000000 !important;
    border: 0px !important;
    font-size: 16px !important;
    color: #3A3B7B !important;
    border-radius: 0px !important;
    padding: 0px !important;
    text-decoration: underline;
}
.accordion-box {
    padding: 25px 40px;
    border-radius: 10px;
}
.accordion-box h5 {
    padding-right: 100px;
    margin: 0;
}
.accordion-box p {
    padding-right: 100px;
    margin: 0;
}
.accordion-card {
    background: #ffffff00 !important;
    border: 0px !important;
}
.accordion-box .card-body {
    padding: 0;
}

/* For Smaller Screens (xs - <576px) */
@media (max-width: 576px) {
    .ellipse-1 {
        position: absolute;
        left: 89%;
        top: 2%;
    }
    .ellipse-2 {
        position: absolute;
        left: 98%;
        top: 2%;
    }
    .ellipse-3 {
        position: absolute;
        left: 96%;
        top: 12%;
    }
    .ellipse-4 {
        position: absolute;
        left: 0%;
        top: 39%;
    }
    .ellipse-5 {
        position: absolute;
        left: 96%;
        top: 100%;
    }
    .ellipse-7 {
        position: absolute;
        left: 7%;
        top: -25%;
    }
    .ellipse-8 {
        position: absolute;
        left: 2%;
        top: -13%;
    }
    .ellipse-9 {
        position: absolute;
        left: 89%;
        top: 9%;
    }
    .ellipse-10 {
        position: absolute;
        left: 86%;
        top: 28%;
    }
    .ellipse-11 {
        position: absolute;
        left: 0%;
        top: -7%;
    }
    .ellipse-12 {
        position: absolute;
        left: 10%;
        top: -6%;
    }
    .ellipse-13 {
        position: absolute;
        left: 94%;
        top: 4%;
    }
    .circle-image-1 {
        width: 55%;

    }
    .circle-image-2 {
        width: 80%;

    }
    .circle-image-3 {
        width: 70%;

    }
    .circle-image-7 {
        width: 70%;

    }
    .circle-image-8 {
        width: 70%;

    }
    .circle-image-10 {
        width: 70%;

    }
    .circle-image-11 {
        width: 70%;

    }
    .circle-image-12 {
        width: 70%;

    }
    .circle-image-13 {
        width: 70%;

    }
    .banner-description {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        margin-left: 4%;
        margin-right: 4%;
        margin-top: 4%;
    }
    .banner-image {
        width: 100%;
    }
    .gray-shadow[data-v-1ae9e65b] {
        box-shadow: 0px 0px 20px 20px #7575751c;
        background: #7575751c;
    }
    .exp-btn {
        margin-left: 4%;
        gap: 18px;
    }
    .exp-btn span {
        font-size: 14px;
        line-height: 20px;
    }
    .section-title {
        font-size: 22px !important;
        line-height: 26px !important;

    }
    .section-sub-title {
        font-size: 18px !important;
        line-height: 24px !important;
    }
    .service-card .card-img {
        height: auto;
    }
    .affiliation {
        font-size: 20px;
        line-height: 32px;
    }
    .child-scroll-container {
        gap:20px;
    }
    .child-div {
        min-width: 80px;
        margin: auto;
    }
    .service-card-btn-container {
        right: -1%;
        top: 90%;
    }
    .accordion-box h5 {
        padding-right: 40px;
    }
    .accordion-box p {
        padding-right: 40px;
    }
}

/* For Small Screens (sm - ≥576px) */
@media (min-width: 576px) and (max-width: 768px) {
    .ellipse-1 {
        position: absolute;
        left: 90%;
        top: 2%;
    }
    .ellipse-2 {
        position: absolute;
        left: 98%;
        top: 2%;
    }
    .ellipse-3 {
        position: absolute;
        left: 96%;
        top: 10%;
    }
    .ellipse-4 {
        position: absolute;
        left: 0%;
        top: 37%;
    }
    .ellipse-7 {
        position: absolute;
        left: 4%;
        top: -20%;
    }
    .ellipse-8 {
        position: absolute;
        left: 2%;
        top: 1%;
    }
    .ellipse-9 {
        position: absolute;
        left: 89%;
        top: 12%;
    }
    .ellipse-10 {
        position: absolute;
        left: 86%;
        top: 28%;
    }
    .ellipse-11 {
        position: absolute;
        left: 0%;
        top: -16%;
    }
    .ellipse-12 {
        position: absolute;
        left: 10%;
        top: -12%;
    }
    .ellipse-13 {
        position: absolute;
        left: 95%;
        top: 8%;
    }
    .circle-image-1 {
        width: 50%;

    }
    .circle-image-2 {
        width: 70%;

    }
    .circle-image-3 {
        width: 70%;

    }
    .banner-description {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        margin-left: 4%;
        margin-top: 4%;
        margin-right: 4%;
    }
    .banner-image-container {
        margin-top: 0%;
    }
    .banner-image {
        width:100%;
    }
    .gray-shadow {
        box-shadow: 0px 0px 20px 20px #7575751c;
        background: #7575751c;
    }
    .exp-btn {
        margin-left: 4%;
    }
    .section-title {
        font-size: 26px !important;
        line-height: 32px !important;
    }
    .section-sub-title {
        font-size: 20px !important;
        line-height: 24px !important;
    }
    .affiliation {
        font-size: 22px;
        line-height: 54px;
    }
    .child-scroll-container {
        gap:30px;
    }
    .child-div {
        min-width: 100px;
        margin: auto;
    }
    .service-card-btn-container {
        top: 87%;
    }
    .business-count h1{
        color:#355594;
        font-size: 52px;
        font-weight: 700;
    }
    .business-count p{
        color:#6D7A8C;
        font-size: 20px;
        line-height: 24px;
    }
    .latest-news-card-img {
        padding: 10px;
    }
    .latest-news-card-title {
        font-size: 14px;
        padding: 12px 10px;
        font-weight: 600;
        line-height: 18px;
    }
}
/* For Medium Screens (md - ≥768px) */
@media (min-width: 768px) and (max-width: 991px) {
    .banner-description {
        margin-top: 12%;
        font-size: 14px;
        line-height: 22px;
    }
    .ellipse-1 {
        position: absolute;
        left: 92%;
        top: 2%;
        width: 5%;
    }
    .ellipse-2 {
        position: absolute;
        left: 99%;
        top: 2%;
    }
    .ellipse-3 {
        position: absolute;
        left: 98%;
        top: 17%;
    }
    .ellipse-4 {
        position: absolute;
        left: 0%;
        top: 79%;
    }
    .ellipse-7 {
        position: absolute;
        left: 4%;
        top: -25%;
    }
    .ellipse-8 {
        position: absolute;
        left: 1%;
        top: -9%;
    }
    .ellipse-9 {
        position: absolute;
        left: 92%;
        top: 16%;
    }
    .ellipse-10 {
        position: absolute;
        left: 91%;
        top: 46%;
    }
    .ellipse-11 {
        position: absolute;
        left: 0%;
        top: -18%;
    }
    .ellipse-12 {
        position: absolute;
        left: 8%;
        top: -15%;
    }
    .ellipse-13 {
        position: absolute;
        left: 96%;
        top: 10%;
    }
    .banner-image {
        width: 112%;
        margin-top: -6%;
    }
    .exp-btn {
        gap: 20px;
        padding: 8px 5px;
    }
    .exp-btn span {
        font-size: 15px;
        padding-left: 12px;
    }
    .section-title {
        font-size: 30px !important;
        line-height: 36px !important;

    }
    .section-sub-title {
        font-size: 22px !important;
        line-height: 24px !important;
    }
    .affiliation {
        font-size: 24px;
        line-height: 54px;
    }
    .child-scroll-container {
        gap:40px;
    }
    .child-div {
        min-width: 110px;
        margin: auto;
    }
    .service-card-btn-container {
        top: 83%;
    }
    .service-card .card-img-img {
        aspect-ratio: 14 / 13;
    }
    .business-count h1{
        color:#355594;
        font-size: 56px;
        font-weight: 700;
    }
    .business-count p{
        color:#6D7A8C;
        font-size: 22px;
        line-height: 26px;
    }
    .latest-news-card-img {
        padding: 10px;
    }
    .latest-news-card-title {
        font-size: 18px;
        padding: 14px 12px;
        line-height: 24px;
    }
}

/* For Large Screens (lg - ≥992px) */
@media (min-width: 992px) and (max-width: 1199px) {
    .ellipse-1 {
        position: absolute;
        left: 91%;
        top: 4%;
    }
    .ellipse-2 {
        position: absolute;
        left: 99%;
        top: 6%;
    }
    .ellipse-3 {
        position: absolute;
        left: 98%;
        top: 17%;
    }
    .ellipse-4 {
        position: absolute;
        left: 0%;
        top: 82%;
    }
    .ellipse-7 {
        position: absolute;
        left: 3%;
        top: -44%;
    }
    .ellipse-8 {
        position: absolute;
        left: 1%;
        top: -18%;
    }
    .ellipse-9 {
        position: absolute;
        left: 94%;
        top: 18%;
    }
    .ellipse-10 {
        position: absolute;
        left: 91%;
        top: 46%;
    }
    .ellipse-11 {
        position: absolute;
        left: 0%;
        top: -25%;
    }
    .ellipse-12 {
        position: absolute;
        left: 7%;
        top: -23%;
    }
    .ellipse-13 {
        position: absolute;
        left: 97%;
        top: 11%;
    }
    .banner-description {
        margin-top: 18%;
    }
    .banner-image {
        width: 112%;
        margin-top: 10%;
    }
    .gray-shadow[data-v-1ae9e65b] {
        top: 67%;
        left: 43%;
    }
    .banner-image-container {
        margin-top: -15%;
    }
    .service-card-btn-container {
        top: 83%;
    }
    .latest-news-card-img {
        padding: 10px;
    }
    .latest-news-card-title {
        font-size: 18px;
        padding: 14px 12px;
        line-height: 24px;
    }
}

/* For Extra Large Screens (xl - ≥1200px) */
@media (min-width: 1200px) and (max-width: 1400px) {
    .ellipse-7 {
        position: absolute;
        left: 10%;
        top: -42%;
    }
    .ellipse-8 {
        position: absolute;
        left: 8%;
        top: -18%;
    }
    .ellipse-9 {
        position: absolute;
        left: 88%;
        top: 18%;
    }
    .ellipse-10 {
        position: absolute;
        left: 90%;
        top: 46%;
    }
    .ellipse-11 {
        position: absolute;
        left: 0%;
        top: -31%;
    }
    .ellipse-12 {
        position: absolute;
        left: 5%;
        top: -29%;
    }
    .ellipse-13 {
        position: absolute;
        left: 97%;
        top: 10%;
    }
}

/* Custom media query for extra command over design */
@media (min-width: 880px) and (max-width: 922px) {
    .banner-description {
        margin-top: 12%;
    }
    .banner-image {
        width: 112%;
        margin-top: -6%;
    }
}
@media (min-width: 800px) and (max-width: 868px) {
    .banner-description {
        margin-top: 12%;
    }
    .banner-image {
        width: 112%;
        margin-top: -9%;
    }
}
@media (min-width: 768px) and (max-width: 800px) {
    .banner-description {
        margin-top: 12%;
    }
    .banner-image {
        width: 112%;
        margin-top: -14%;
    }
}
</style>