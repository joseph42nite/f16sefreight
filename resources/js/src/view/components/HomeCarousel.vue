<!-- <template>
    <carousel-3d :controls-visible="false" :clickable="true">
      <slide v-for="(slide, i) in slides" :key="i" :index="i">
        <vue-flip active-hover width="350px" height="200px">
          <template v-slot:front class="front">
            This is the front of the card/slide
            <div class="slide-content">
              <img :src="slide.image" alt="Slide Image" />
              <figcaption>{{ slide.caption }}</figcaption>
            </div>
          </template>
          <template v-slot:back class="back">
            This is the back of the card/slide
            <div class="slide-content">
              <h3>{{ slide.caption }}</h3>
              Add more content if needed
            </div>
          </template>
        </vue-flip>
      </slide>
    </carousel-3d>
  </template>
  
  <script>
  import { Carousel3d, Slide } from 'vue-carousel-3d';
  import VueFlip from 'vue-flip';
  
  export default {
    data() {
      return {
        slides: [
          {
            image: "/media/custome/small-business.png",
            caption: "The sky is the limit only for those who aren't afraid to fly!",
          },
          {
            image: "/media/custome/cloud-storage.png",
            caption: "Start your journey to success today!",
          },
          {
            image: "/media/custome/privacy.png",
            caption: "Innovation distinguishes between a leader and a follower.",
          },
        ],
      };
    },
    components: {
      "carousel-3d": Carousel3d,
      slide: Slide,
      "vue-flip": VueFlip,
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
  }
  </style> -->
  <template>
    <carousel-3d :controls-visible="false" :clickable="true">
      <slide v-for="(slide, i) in slides" :key="i" :index="i">
        <vue-flip :active-hover="true" width="100%" height="100%">
          <!-- Front Side -->
          <template v-slot:front>
            <div class="slide-content front">
              <img :src="slide.image" alt="Front Slide Image" />
              <p>{{ slide.caption }}</p>
            </div>
          </template>
          <!-- Back Side -->
          <template v-slot:back>
            <div class="slide-content back">
              <h3>{{ slide.caption }}</h3>
              <p>More details about {{ slide.caption }}</p>
            </div>
          </template>
        </vue-flip>
      </slide>
    </carousel-3d>
  </template>
  
  <script>
  import { Carousel3d, Slide } from "vue-carousel-3d";
  import VueFlip from "vue-flip";
  
  export default {
    data() {
      return {
        slides: [
          {
            image: "/media/custome/small-business.png",
            caption: "Slide 1",
          },
          {
            image: "/media/custome/cloud-storage.png",
            caption: "Slide 2",
          },
          {
            image: "/media/custome/privacy.png",
            caption: "Slide 3",
          },
        ],
      };
    },
    components: {
      "carousel-3d": Carousel3d,
      slide: Slide,
      "vue-flip": VueFlip,
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
  color: white;
  background-color: #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.front {
  /* background-color: #4caf50; */
}

.back {
  /* background-color: #f44336; */
}
</style>

  