import ApiService from "@/core/services/api.service";

/**
 * Open a waybill PDF in a new tab (2026-09-16 audit). The download routes need a signed link, which the server
 * gives only for the caller's own waybills. The tab is opened first, while the click still counts, so the
 * browser does not block it as a pop-up.
 *
 * @param {string} path e.g. "/download-awb-pdf/17610000008"
 */
export function openPdf(path) {
  const tab = window.open("", "_blank");

  return ApiService.post("/user/pdf-link", { path })
    .then(({ data }) => {
      if (tab) tab.location = data.url;
      else window.location = data.url;
    })
    .catch(() => {
      if (tab) tab.close();
    });
}
