<template>
  <BusinessCard :person="person" />
</template>

<script>
import BusinessCard from "@/view/pages/public/components/BusinessCard.vue";
import { cardMeta } from "@/core/services/businessCard";

/** Who this card is for. The card itself is one component for everybody (frontend audit §7). */
const person = {
  first: "Deepanjan",
  name: "Deepanjan Sarkar",
  role: "COO",
  initial: "D",
  username: "@deepanjan_coo",
  quote: "Optimizing operations and building scalable workflows to power F16s global freight network.",
  phone: "7278178402",
  email: "d.sarkar@f16sefreight.com",
  linkedin: "https://www.linkedin.com/in/deepanjan-sarkar-b5a28b290/",
  path: "/deepanjan-coo-839204817294",
};

export default {
  name: "DeepanjanCard",
  components: { BusinessCard },
  metaInfo() {
    return cardMeta(person);
  },
  data: () => ({ person }),
};
</script>
