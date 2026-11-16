// Work emails only, for the "Talk to us" form. This is the browser's early warning; the server decides
// (app/Support/WorkEmail.php, which also checks the domain can receive mail). Keep the two lists in step.

const FREE = new Set([
    "gmail.com", "googlemail.com",
    "outlook.com", "outlook.in", "hotmail.com", "hotmail.co.in", "hotmail.co.uk", "live.com", "live.in", "msn.com",
    "yahoo.com", "yahoo.co.in", "yahoo.in", "yahoo.co.uk", "ymail.com", "rocketmail.com",
    "icloud.com", "me.com", "mac.com", "aol.com",
    "proton.me", "protonmail.com", "pm.me", "tutanota.com", "tuta.io", "hey.com", "fastmail.com",
    "zoho.com", "zohomail.com", "zohomail.in", "gmx.com", "gmx.net", "mail.com", "email.com", "inbox.com",
    "yandex.com", "yandex.ru", "mail.ru", "rediffmail.com", "rediff.com", "qq.com", "163.com", "126.com", "sina.com",
]);
const FREE_FAMILY = /^(gmail|googlemail|outlook|hotmail|live|yahoo|ymail|icloud|aol|proton(mail)?|yandex|gmx|rediff(mail)?)\./i;
const SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const WORK_EMAIL_MESSAGE = "Please use your work email (name@yourcompany.com). Personal addresses like Gmail or Outlook aren't accepted.";

/** "" when the address looks like a work email, otherwise the reason. */
export function workEmailProblem(email) {
    const value = (email || "").trim();
    if (!value) return "Your work email is needed.";
    if (!SHAPE.test(value)) return "That doesn't look like an email address.";
    const domain = value.slice(value.lastIndexOf("@") + 1).toLowerCase();
    if (FREE.has(domain) || FREE_FAMILY.test(domain)) return WORK_EMAIL_MESSAGE;
    return "";
}
