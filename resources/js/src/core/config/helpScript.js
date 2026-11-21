/**
 * What the Help panel says (owner, 2026-11-21): written messages and buttons that end at a person, with no AI.
 *
 * Every path ends in one of two things that already exist: the support chat with an F16s agent, or the flag, which
 * takes a picture of the page with the wrong part marked and sends it to support with a note.
 *
 * `next` goes to another step; `action` is "connect" (the support chat), "flag" (the marked picture) or "tour"
 * (the walk round the screen from core/config/tour.js); `topic` is remembered and passed to the agent, so the
 * person does not explain twice.
 */
const AGAIN = { label: "Start again", next: "start" };

const TOPICS = ["Waybills and documents", "Mail and the inbox", "Shipments and the board", "Billing and accounts", "My sign-in or my account", "Something else"];

export const HELP_SCRIPT = {
  start: {
    says: "Hello. I am an automated helper, not a person. Tell me what you need and I will get you to someone at F16s.",
    options: [
      { label: "Something on screen looks wrong", next: "wrong" },
      { label: "I have a question", next: "topic" },
      { label: "Talk to a person", next: "person" },
      { label: "Show me around", action: "tour" },
    ],
  },
  wrong: {
    says: "Show us where. Press the flag, click the part of the screen that is wrong, and add a line about it. A picture of the page, with that part marked, goes to F16s support with your note.",
    options: [{ label: "⚑ Flag what is wrong", action: "flag" }, { label: "Talk to a person instead", next: "person" }, AGAIN],
  },
  topic: {
    says: "What is it about?",
    options: TOPICS.map((topic) => ({ label: topic, next: "handover", topic })),
  },
  handover: {
    says: "A support person can answer that. I will tell them what it is about, so you do not have to explain twice.",
    options: [{ label: "Connect me", action: "connect" }, { label: "⚑ Flag something on screen", action: "flag" }, AGAIN],
  },
  person: {
    says: "I will open a chat with F16s support. If nobody is online just now, your message waits there, and the reply shows here and on the Help button.",
    options: [{ label: "Connect me", action: "connect" }, AGAIN],
  },
};

export default HELP_SCRIPT;
