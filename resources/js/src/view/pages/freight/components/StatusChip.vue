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
