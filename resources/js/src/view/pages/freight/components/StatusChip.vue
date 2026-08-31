<template>
  <!--
    §1.3 NEVER SIGNAL WITH COLOUR ALONE. The chip always carries its LABEL; the tone
    only reinforces it. Someone who cannot distinguish the hues still reads the state.
  -->
  <span class="fx-chip" :class="'fx-chip--' + tone">{{ label }}</span>
</template>

<script>
/* Maps a lifecycle value to one of §2.2's five semantic tones. Anything unmapped falls
   through to `neutral` rather than guessing — an unknown state is not a healthy one. */
const TONE = {
  new: "info",
  quoted: "info",
  awaiting_client: "warning",
  converted: "success",
  lost: "neutral",

  Intake: "info",
  "AI Extraction": "info",
  Verification: "warning",
  Generation: "info",
  "PDF Generated": "info",
  "Sent to Airline": "info",
  "Airline Confirmed": "success",
  Completed: "success",
  Cancelled: "neutral",

  // §9.6 financial documents. `void` is NEUTRAL, not critical — voiding is a normal
  // correction, and colouring it as an alarm would make a routine credit note look
  // like a failure on a register the accountant scans all day.
  draft: "neutral",
  finalized: "info",
  sent: "info",
  partially_paid: "warning",
  paid: "success",
  void: "neutral",

  posted: "success",
  unposted: "warning",

  // §9.2 inbox classifications. `customer_enquiry` is the only one that becomes work
  // for pricing, so it is the only one toned as a positive signal; the rest are
  // operational chatter that must NOT be promoted.
  customer_enquiry: "info",
  airline: "neutral",
  clearance: "neutral",
  trucking_road: "neutral",

  // §5.1 extraction confidence. `high` is NOT success-green: the operator still has
  // to check it, and a green chip invites them not to. Medium and low are the ones
  // that must catch the eye.
  high: "neutral",
  medium: "warning",
  low: "critical",

  // §5.6 platform health. `up` is neutral, not success-green: a monitor whose normal
  // state is a wall of green trains the eye to stop reading it, and the one red card
  // then has to compete with four greens for attention.
  up: "neutral",
  down: "critical",

  // Support desk. `investigating` is warning — somebody is waiting on it.
  investigating: "warning",
  resolved: "success",

  // 🔴 A credit hold is the state that stops cargo moving — the strongest tone we have.
  credit_hold: "critical",
  within_limit: "success",
};

export default {
  name: "StatusChip",
  props: { value: { type: String, default: null } },
  computed: {
    tone() {
      return TONE[this.value] || "neutral";
    },
    label() {
      if (!this.value) return "—";
      return this.value.replace(/_/g, " ");
    },
  },
};
</script>
