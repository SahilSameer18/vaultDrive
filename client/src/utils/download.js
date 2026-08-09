/**
 * Force-downloads a file from a URL (including cross-origin Cloudinary URLs)
 * directly to the user's local hard drive.
 */
export async function handleFileDownload(url, fileName = "download") {
  if (!url) return;

  try {
    // 1. Try Cloudinary URL transformation first (inject fl_attachment flag)
    let downloadUrl = url;
    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
      downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
    }

    // 2. Fetch binary blob and force browser download
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
    // Fallback: force open in new window if blob fetch is blocked
    const fallbackUrl = url.includes("res.cloudinary.com") && url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;
    window.open(fallbackUrl, "_blank");
  }
}
