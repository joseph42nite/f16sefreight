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
              <p>{{ slide.caption }}</p>
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
  max-width: 50%;
  margin-bottom: 10px;
}

.main-image {
  max-width: 100%;
}
</style>

<style>
.carousel-3d-slide {
    border-radius: 25px;
    border: 0px;
    background-color: transparent;
}
</style>