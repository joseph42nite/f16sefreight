<template>
  <div>
    <!--
      🔴 ONE PAGE, TWO SIDES OF THE SAME LEDGER. Customers are who you invoice; partners are
      who you pay. They were separate rail items, which made a directory look like two
      unrelated features — and an operator hunting a company had to guess which side it
      lived on before they could look for it.
    -->
    <nav class="fx-tabs" role="tablist" aria-label="Directory">
      <button
        v-for="t in TABS"
        :key="t.key"
        class="fx-tabs__tab"
        :class="{ 'is-active': active === t.key }"
        role="tab"
        :aria-selected="String(active === t.key)"
        @click="active = t.key"
      >{{ t.label }}</button>
    </nav>

    <!--
      ⚠️ `:key` forces a remount when the tab changes. DirectoryTable loads in `created()`,
      so swapping only the prop would show the new heading over the old rows — the exact
      kind of stale render that reads as "the partners list is showing customers".
    -->
    <!--
      Clients get their own screen (user, 2026-09-20): every branch's book in one list, with the salesperson and
      the credit limit on the row. Partners stay on the generic directory — nothing is attached to them.
    -->
    <Clients v-if="active === '/customers'" />
    <DirectoryTable v-else :key="active" :endpoint="active" />
  </div>
</template>

<script>
import Clients from "@/view/pages/freight/Clients.vue";
import DirectoryTable from "@/view/pages/freight/DirectoryTable.vue";

const TABS = [
  { key: "/customers", label: "Clients" },
  { key: "/partners", label: "Partners" },
];

export default {
  name: "ClientsAndPartners",
  components: { Clients, DirectoryTable },
  data: () => ({ TABS, active: "/customers" }),
};
</script>
