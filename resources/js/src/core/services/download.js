/**
 * A file the server (or the page) made, handed to the browser. This was written out by hand in a dozen pages
 * (frontend audit §7), with small differences that mattered: two of them freed the file the moment the link was
 * clicked, which some browsers treat as cancelling the download.
 */
const KEEP_FOR = 30000;

function addressOf(data, type) {
  const blob = type ? new Blob([data], { type }) : (data instanceof Blob ? data : new Blob([data]));
  const url = window.URL.createObjectURL(blob);
  // Freed later: the browser is still reading it when the click returns.
  setTimeout(() => window.URL.revokeObjectURL(url), KEEP_FOR);
  return url;
}

/** Saves `data` under `name`. `type` is the kind of file ("text/csv"); without it a Blob keeps its own. */
export function saveFile(data, name, type) {
  const link = document.createElement("a");
  link.href = addressOf(data, type);
  link.download = name;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Shows `data` in a tab. Pass the tab opened inside the click (`window.open("", "_blank")`) when the file is
 * fetched first: a tab opened after the fetch is a pop-up and is blocked.
 */
export function showFile(data, type, tab) {
  const url = addressOf(data, type);
  if (tab) tab.location = url;
  else window.open(url, "_blank");
}
