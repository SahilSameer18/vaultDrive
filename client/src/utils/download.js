/**
 * Force-downloads a file from a URL (including backend gatekeeper streaming URLs
 * and authenticated cross-origin Cloudinary URLs) directly to the user's local hard drive.
 */
export async function handleFileDownload(url, fileName = "download") {
  if (!url) return;

  try {
    let downloadUrl = url;

    // 1. If it's a backend gatekeeper streaming URL, append ?action=download to enforce attachment headers
    if (downloadUrl.includes("/content") || downloadUrl.includes("/share/")) {
      const separator = downloadUrl.includes("?") ? "&" : "?";
      if (!downloadUrl.includes("action=download")) {
        downloadUrl += `${separator}action=download`;
      }
    } else if (downloadUrl.includes("res.cloudinary.com") && downloadUrl.includes("/upload/")) {
      // 2. Cloudinary direct URL transformation for dashboard (inject fl_attachment flag)
      downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
    }

    // 3. Fetch binary blob and trigger native save
    const response = await fetch(downloadUrl, { mode: "cors" });
    if (!response.ok) throw new Error("Fetch failed");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up memory blob after small delay
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    console.warn("Direct blob download fallback triggered:", err);
    // Fallback: force trigger download in new window/tab
    let fallbackUrl = url;
    if (fallbackUrl.includes("/content") || fallbackUrl.includes("/share/")) {
      const separator = fallbackUrl.includes("?") ? "&" : "?";
      if (!fallbackUrl.includes("action=download")) {
        fallbackUrl += `${separator}action=download`;
      }
    } else if (fallbackUrl.includes("res.cloudinary.com") && fallbackUrl.includes("/upload/")) {
      fallbackUrl = fallbackUrl.replace("/upload/", "/upload/fl_attachment/");
    }
    window.open(fallbackUrl, "_blank");
  }
}
