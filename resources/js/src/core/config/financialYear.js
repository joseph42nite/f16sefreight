/**
 * The years a period can be opened for (owner, 2026-10-09: "let them select, primarily financial year").
 *
 * The Indian financial year runs 1 April – 31 March, so any month from April belongs to the year that just started and
 * January to March to the one before — the same rule the server uses (App\Support\FinancialYear) and the one document
 * numbers already follow. The calendar year is offered after it, for a company whose books run that way.
 */
const pad = (n) => String(n).padStart(2, "0");

export function financialYear(startYear, tag) {
  const short = pad((startYear + 1) % 100);

  return {
    key: "fy-" + startYear,
    label: "Financial year " + startYear + "-" + short + (tag ? " (" + tag + ")" : "") + " · 1 Apr " + startYear + " – 31 Mar " + (startYear + 1),
    name: "FY " + startYear + "-" + short,
    start: startYear + "-04-01",
    end: (startYear + 1) + "-03-31",
  };
}

export function yearChoices(now = new Date()) {
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const cal = now.getFullYear();

  return [
    financialYear(fyStart, "this year"),
    financialYear(fyStart + 1, "next"),
    financialYear(fyStart - 1, "last"),
    { key: "cal-" + cal, label: "Calendar year " + cal + " · 1 Jan – 31 Dec", name: "CY " + cal, start: cal + "-01-01", end: cal + "-12-31" },
  ];
}
