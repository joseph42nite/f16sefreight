<template>
  <b-row align-h="center" align-v="center">
    <b-col cols="12">
      <carousel-3d :controls-visible="false" :clickable="true">
        <slide v-for="(slide, i) in slides" :key="i" :index="i">
          <template>
            <div class="slide-content">
              <!-- Text Image -->
              <img :src="slide.textImage" alt="Text Image" class="text-image">
              <!-- Main Slide Image -->
              <img :src="slide.mainImage" alt="Main Slide Image" class="main-image">
              <p class="carousel-title my-md-10 my-6">{{ slide.caption }}</p>
              <b-button to="/about-us" class="d-flex align-items-center mb-8 get-btn">
                  <span>Get</span>
                  <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
              </b-button>
            </div>
          </template>
        </slide>
      </carousel-3d>
    </b-col>
  </b-row>
</template>

<script>
import { Carousel3d, Slide } from "vue-carousel-3d";

export default {
  data() {
    return {
      slides: [
        {
          textImage: "/media/custome/about/focus-sea.png",
          mainImage: "/media/custome/about/boat.png",
          caption: "Seamless freight docs with one-click printing for faster sea logistics.",
        },
        {
          textImage: "/media/custome/about/focus-air.png",
          mainImage: "/media/custome/about/plane.png",
          caption: "Fast EDI data transmission and real-time tariff updates for efficient air freight logistics.",
        },
        {
          textImage: "/media/custome/about/focus-road.png",
          mainImage: "/media/custome/about/truck.png",
          caption: "FREE login, powerful docs, and printable options for road freight.",
        },
      ],
    };
  },
  components: {
    "carousel-3d": Carousel3d,
    slide: Slide,
  },
};
</script>

<style scoped>
.slide-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  width: 100%;
  height: 100%;
  color:#355594;
  background: linear-gradient(180deg, #BBE2FF 0%, #FFFFFF 100%);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.text-image {
  padding-top: 6rem;
  max-width: 80%;
}

.main-image {
  max-width: 80%;
}
.get-btn {
    background: linear-gradient(360deg, rgba(119, 128, 177, 0.21) 0%, rgba(34, 50, 138, 0.21) 53.5%);
    border-radius: 30px;
    border: 0px;
    gap: 17px;
    padding: 8px 5px;
    max-width: fit-content;
}
.get-btn:hover {
    background: #fff !important;
}
.get-btn span {
    color: #355594;
    font-size: 16px;
    line-height: 22px;
    padding-left: 15px;
    font-weight: 500;
}
.get-btn .btn-icon {
    background: #fff;
    border-radius: 30px;
    font-size: 36px !important;
    padding: 0 8px;
    color: #355594;
    stroke: #355594;
}
</style>

<style>
.carousel-3d-container {
  height: 530px !important;
}
.carousel-3d-slider {
  display: flex;
  justify-content: center;
  margin-top: 40px !important;
  width: 388px !important;
  height: 85% !important;
}
.carousel-3d-slide {
  width: 100% !important;
  height: 100% !important;
  border-radius: 25px;
  border: 0px !important;
  background-color: transparent;
  box-shadow: 0px 10px 40px 0px #00000040;
}
.left-1{
  width: 320px !important;
  height: 410px !important;
  transition: transform 500ms, opacity 500ms, visibility 500ms;
  transform: translateX(-374px) translateZ(-150px) rotateY(32deg) !important;
  top: 0px;
  z-index: 998;
  opacity: 1;
  visibility: visible;
  box-shadow: 0px 10px 40px 0px #00000040;
}
.right-1{
  width: 320px !important;
  height: 410px !important;
  transition: transform 500ms, opacity 500ms, visibility 500ms;
  transform: translateX(374px) translateZ(-150px) rotateY(-32deg) !important;
  top: 0px;
  z-index: 998;
  opacity: 1;
  visibility: visible;
  box-shadow: 0px 10px 40px 0px #00000040;
}
.slide-content {
  box-shadow: none !important;
}
.carousel-title {
  width: 74%;
  font-size: 16px;
  line-height: 20px;
}

@media (min-width: 1024px) and (max-width: 1200px) {
  .carousel-3d-slider {
    margin-top: 40px !important;
    width: 350px !important;
    height: 80% !important;
  }
  .carousel-3d-slide {
    width: 100% !important;
    height: 100% !important;
  }
  .left-1{
    width: 280px !important;
    height: 410px !important;
    transform: translateX(-330px) translateZ(-150px) rotateY(32deg) !important;
  }
  .right-1{
    width: 280px !important;
    height: 410px !important;
    transform: translateX(330px) translateZ(-150px) rotateY(-32deg) !important;
  }
}

@media (min-width: 922px) and (max-width: 1024px) {
  .text-image {
    padding-top: 4rem !important;
  }
  .carousel-3d-slider {
    margin-top: 40px !important;
    width: 310px !important;
    height: 70% !important;
  }
  .carousel-3d-slide {
    width: 100% !important;
    height: 100% !important;
  }
  .left-1{
    width: 250px !important;
    height: 360px !important;
    transform: translateX(-298px) translateZ(-140px) rotateY(25deg) !important;
  }
  .right-1{
    width: 250px !important;
    height: 360px !important;
    transform: translateX(298px) translateZ(-140px) rotateY(-25deg) !important;
  }
}

@media (min-width: 768px) and (max-width: 922px) {
  .main-image {
    max-width: 90% !important;
  }
  .text-image {
    width: 90% !important;
    max-width: 90% !important;
  }
  .text-image {
    padding-top: 4rem !important;
  }
  .carousel-title {
    width: 90%;
  }
  .carousel-3d-container {
    height: 440px !important;
  }
  .carousel-3d-slider {
    margin-top: 40px !important;
    width: 260px !important;
    height: 80% !important;
  }
  .carousel-3d-slide {
    width: 100% !important;
    height: 100% !important;
  }
  .left-1{
    width: 220px !important;
    height: 350px !important;
    transform: translateX(-255px) translateZ(-150px) rotateY(25deg) !important;
  }
  .right-1{
    width: 220px !important;
    height: 350px !important;
    transform: translateX(255px) translateZ(-150px) rotateY(-25deg) !important;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .main-image {
    max-width: 100% !important;
  }
  .text-image {
    padding-top: 2rem !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  .carousel-title {
    width: 100% !important;
    font-size: 14px;
    line-height: 18px;
  }
  .carousel-3d-container {
    height: 370px !important;
  }
  .carousel-3d-slider {
    margin-top: 50px !important;
    width: 190px !important;
    height: 75% !important;
  }
  .carousel-3d-slide {
    width: 100% !important;
    height: 100% !important;
    
  }
  .left-1{
    width: 165px !important;
    height: 280px !important;
    transform: translateX(187px) translateZ(-130px) rotateY(-20deg) !important;
    box-shadow: 0px 10px 20px 0px #00000040 !important;
  }
  .right-1{
    width: 165px !important;
    height: 280px !important;
    transform: translateX(-187px) translateZ(-130px) rotateY(20deg) !important;
    box-shadow: 0px 10px 20px 0px #00000040 !important;
  }
  .get-btn[data-v-704fccb7] {
    gap: 14px !important;
  }
  .get-btn span[data-v-704fccb7] {
    font-size: 14px;
    line-height: 20px;
  }
  .get-btn .btn-icon[data-v-704fccb7] {
    font-size: 30px !important;
  }
}
@media (min-width: 360px) and (max-width: 575px) {
  .main-image {
    max-width: 100% !important;
  }
  .text-image {
    padding-top: 2rem !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  .carousel-title {
    width: 100% !important;
    font-size: 12px;
    line-height: 16px;
  }
  .carousel-3d-container {
    height: 370px !important;
  }
  .carousel-3d-slider {
    margin-top: 30px !important;
    width: 192px !important;
    height: 75% !important;
  }
  .carousel-3d-slide {
    width: 100% !important;
    height: 100% !important;
    
  }
  .left-1{
    width: 170px !important;
    height: 265px !important;
    transform: translateX(200px) translateZ(-270px) rotateY(-30deg) !important;
    box-shadow: 0px 10px 20px 0px #00000040 !important;
  }
  .right-1{
    width: 170px !important;
    height: 265px !important;
    transform: translateX(-200px) translateZ(-270px) rotateY(30deg) !important;
    box-shadow: 0px 10px 20px 0px #00000040 !important;
  }
  .get-btn[data-v-704fccb7] {
    gap: 14px !important;
  }
  .get-btn span[data-v-704fccb7] {
    font-size: 14px;
    line-height: 20px;
  }
  .get-btn .btn-icon[data-v-704fccb7] {
    font-size: 30px !important;
  }
}
</style>
