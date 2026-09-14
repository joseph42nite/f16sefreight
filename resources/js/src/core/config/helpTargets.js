/**
 * The portal controls a help document can point at (PRD §5.10, user decision 2026-09-14).
 *
 * 🔴 A document writes `[[upload-document]] Click Choose files`, and the copilot's guided steps
 * highlight the element tagged `data-help="upload-document"`. The server drops any step whose name
 * is not written in the document, and this list is what the superadmin Help documents page shows
 * writers — so a name here must match a `data-help` attribute on a real element.
 *
 * ⚠️ Add a name here AND on the element in the same change. A name with no element highlights
 * nothing; an element with no name here cannot be referenced by anyone who reads the list.
 */
export const HELP_TARGETS = [
  // Inbox (/inbox)
  { name: "inbox-folders", page: "/inbox", label: "Folder tabs (All, Enquiries, Airline…)" },
  { name: "thread-classification", page: "/inbox", label: "Classification dropdown on a conversation" },
  { name: "claim-thread", page: "/inbox", label: "Claim button" },
  { name: "analyze-pdf", page: "/inbox", label: "Analyze PDF button" },
  { name: "open-workspace", page: "/inbox", label: "Open workspace button" },
  { name: "mail-attachments", page: "/inbox", label: "Attachment chips under an email" },
  { name: "reply", page: "/inbox", label: "Reply button" },
  { name: "reply-all", page: "/inbox", label: "Reply all button" },
  { name: "forward", page: "/inbox", label: "Forward button" },
  { name: "compose-editor", page: "/inbox", label: "Message box with formatting toolbar" },
  { name: "add-signature", page: "/inbox", label: "Add signature switch" },
  { name: "attach-files", page: "/inbox", label: "Attach files button" },
  { name: "send-mail", page: "/inbox", label: "Send button" },

  // Extraction panel (inside the inbox workspace)
  { name: "extract-into", page: "/inbox", label: "Extract into: Master / House AWB and number" },
  { name: "choose-files", page: "/inbox", label: "Documents drop zone / Choose files" },
  { name: "extract-document", page: "/inbox", label: "Extract button on a document" },
  { name: "take-from-it", page: "/inbox", label: "Take from it dropdown" },
  { name: "paste-text", page: "/inbox", label: "Paste anything specific box" },
  { name: "what-will-be-used", page: "/inbox", label: "What will be used table" },
  { name: "save-draft", page: "/inbox", label: "Save as draft button" },

  // Mailboxes (/mailboxes)
  { name: "connect-outlook", page: "/mailboxes", label: "Connect Outlook / Microsoft 365" },
  { name: "mailbox-signature", page: "/mailboxes", label: "Signature editor for a mailbox" },

  // Everywhere
  { name: "report-problem", page: null, label: "Raise a ticket (⚑) inside Help" },
  { name: "help-assistant", page: null, label: "Help button at the bottom of the sidebar" },
];

export const HELP_TARGET_NAMES = HELP_TARGETS.map((t) => t.name);
