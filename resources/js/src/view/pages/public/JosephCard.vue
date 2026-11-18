<template>
  <BusinessCard :person="person" />
</template>

<script>
import BusinessCard from "@/view/pages/public/components/BusinessCard.vue";
import { cardMeta } from "@/core/services/businessCard";

/** Who this card is for. The card itself is one component for everybody (frontend audit §7). */
const person = {
  first: "Joseph",
  name: "Joseph George",
  role: "CEO",
  initial: "J",
  username: "@joseph_ceo",
  quote: "Delivering synchronized, future-ready logistics documentation and seamless airline connectivity globally.",
  phone: "7011363516",
  email: "joseph@f16sefreight.com",
  linkedin: "https://www.linkedin.com/in/joseph-george-b99616147/",
  path: "/joseph-ceo-938204719284",
};

export default {
  name: "JosephCard",
  components: { BusinessCard },
  metaInfo() {
    return cardMeta(person);
  },
  data: () => ({ person }),
};
</script>
