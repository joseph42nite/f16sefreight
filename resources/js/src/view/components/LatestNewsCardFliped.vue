<!-- <template>
    <b-row align-h="center" align-v="center">
        <b-col
            v-for="(newsItem, index) in newsItems"
            :key="index"
            cols="12"
            sm="4"
            md="4"
            lg="4"
            xl="4"
            xxl="4"
            class="mb-16"
        >
            <vue-flip
                v-bind="flipProps"
                class="flip-card"
                height="100%"
                width="100%"
            >
                <template v-slot:front>
                    <b-card class="text-center latest-news-card toggle-btn">
                        <div class="front">
                            <div class="latest-news-card-img">
                                <b-img
                                    :src="newsItem.imgSrc"
                                    :alt="newsItem.imgAlt"
                                    class="img-fluid d-block"
                                    style="width: 100%"
                                />
                            </div>
                            <div class="latest-news-card-title">
                                {{ newsItem.title }}
                            </div>
                        </div>
                    </b-card>
                </template>

                <template v-slot:back>
                    <div class="back">
                    <b-card class="text-center latest-news-card toggle-btn">
                        
                            <div class="toggle-content">
                                <h2>{{ newsItem.innerTitle }}</h2>
                                <p>{{ newsItem.innerDescription }}</p>
                                <hr />
                            </div>
                            <div class="latest-news-card-title">
                                {{ newsItem.title }}
                            </div>
                        
                    </b-card>
                </div>
                </template>
            </vue-flip>
        </b-col>

        <b-col cols="12" class="mb-8">
            <div class="d-flex flex-row justify-content-center">
                <b-button class="expMore-btn">Explore More</b-button>
            </div>
        </b-col>
    </b-row>
</template>

<script>
import VueFlip from "vue-flip";
export default {
    data() {
        return {
            newsItems: [
                {
                    imgSrc: "/media/custome/gallary/img-1.png",
                    imgAlt: "latest news image-1",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-2.png",
                    imgAlt: "latest news image-2",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-3.png",
                    imgAlt: "latest news image-3",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-4.png",
                    imgAlt: "latest news image-4",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-5.png",
                    imgAlt: "latest news image-5",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-6.png",
                    imgAlt: "latest news image-6",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
            ],
            isVisible: false,
        };
    },
    components: {
        "vue-flip": VueFlip,
    },
    computed: {
        flipProps() {
            return {
                front: {
                    class: "front-side",
                },
                back: {
                    class: "back-side",
                },
            };
        },
    },
};
</script>

<style scoped>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

html, body, html * {
  font-family: 'Roboto', sans-serif !important;
}
.section-title {
    font-size: 32px !important;
    font-weight: 600;
    line-height: 40px !important;
    text-align: center;
    color: #355594;
}

.latest-news-card {
    background: linear-gradient(180deg, #d9efff 0%, #f1f9ff 71%);
    border-radius: 25px;
}
.latest-news-card .card-body {
    width: 100%;
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
    color: #3a3b7b;
    border-radius: 0px;
    padding: 0px;
    text-decoration: underline;
}
.expMore-btn:hover {
    background: #00000000 !important;
    border: 0px !important;
    font-size: 16px !important;
    color: #3a3b7b !important;
    border-radius: 0px !important;
    padding: 0px !important;
    text-decoration: underline;
}
.toggle-content {
    overflow: hidden;
    position: absolute;
    top: 0px;
    background: #000;
    width: 100%;
    border-radius: 25px;
    color: #ffffff;
    background-color: #355594;
}
.toggle-content {
    max-height: 1000px;
    padding: 15px;
}
.flip-card {
    perspective: 1000px;
    position: relative;
    height: 100%;
    width: 100%;
    transform-style: preserve-3d;
}

.flip-card .front,
.flip-card .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden; 
    -webkit-backface-visibility: hidden;
    transition: transform 0.6s ease-in-out;
}

.flip-card .front {
    transform: rotateY(0deg);
    z-index: 2;
}

.flip-card .back {
    transform: rotateY(180deg);
    z-index: 1; 
    visibility: hidden;
}

On hover, flip the card
.flip-card:hover .front {
    transform: rotateY(-180deg);
    z-index: 1;
    visibility: hidden; 
}

.flip-card:hover .back {
    transform: rotateY(0deg);
    z-index: 2;
    visibility: visible; 
}
.toggle-content {
    max-height: 1000px;
    padding: 15px;
}
</style>
<style>
.front {
    position: relative !important;
}
.back {
    position: relative !important;
}
</style> -->



<template>
    <b-row align-h="center" align-v="center">
        <b-col v-for="(newsItem, index) in newsItems" :key="index" cols="12" sm="4" md="4" lg="4" xl="4" xxl="4" class="mb-16">
            <b-card class="text-center latest-news-card toggle-btn">
                <!-- Apply vue-flip to the flip-card container -->
                <div class="front flip">
                    <vue-flip :active-hover="true" class="flip-card" height="100%" width="100%">
                        <!-- Front Section: Image and Title -->
                        <template v-slot:front class="front">
                            <div class="latest-news-card-img">
                                <b-img
                                    :src="newsItem.imgSrc"
                                    :alt="newsItem.imgAlt"
                                    class="img-fluid d-block flip-image"
                                    style="width: 100%"
                                />
                            </div>
                        </template>
                        <!-- Back Section: Content (Text) -->
                        <template v-slot:back>
                            <div class="toggle-content">
                                <h2>{{ newsItem.innerTitle }}</h2>
                                <p>{{ newsItem.innerDescription }}</p>
                                <hr />
                            </div>
                        </template>
                    </vue-flip>
                    <div class="latest-news-card-title">
                        {{ newsItem.title }}
                    </div>
                </div>
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
            newsItems: [
            {
                    imgSrc: "/media/custome/gallary/img-1.png",
                    imgAlt: "latest news image-1",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-2.png",
                    imgAlt: "latest news image-2",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-3.png",
                    imgAlt: "latest news image-3",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-4.png",
                    imgAlt: "latest news image-4",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-5.png",
                    imgAlt: "latest news image-5",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
                {
                    imgSrc: "/media/custome/gallary/img-6.png",
                    imgAlt: "latest news image-6",
                    title: "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerTitle:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda",
                    innerDescription:
                        "Lorem ipsum dolor uhyw iqmnq iwmn uwkajs opla orkda. Curabitur pretium sapien et dolor convallis, nec dapibus lacus varius. Nulla facilisi. Nam hendrerit libero non magna vestibulum laoreet. Nam hendrerit libero non magna vestibulum laoreet. Nulla vehicula ligula at nulla bibendum ultricies......",
                },
            ]
        };
    },
};
</script>

<style scoped>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

.latest-news-card {
    background: linear-gradient(180deg, #d9efff 0%, #f1f9ff 71%);
    border-radius: 25px;
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

.toggle-content {
    position: absolute;
    top: 0;
    background: #355594;
    width: 100%;
    border-radius: 25px;
    color: white;
    padding: 15px;
    /* height: 100%; */
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
}

.flip-card {
    perspective: 1000px;
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
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

.flip-image {
    transition: transform 0.6s ease-in-out;
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

.flip-card:hover .front .latest-news-card-img>img {
    visibility: hidden;
}


</style>

<style>
.front {
    position: relative !important;
}
.back {
    position: relative !important;
}
</style>