/**
 * File icon mapper component based on mimetype / category
 */

export function getFileCategory(mimetype = "") {
  const type = mimetype.toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "pdf";
  if (type.includes("word") || type.includes("document") || type.includes("text/")) return "document";
  if (type.includes("zip") || type.includes("rar") || type.includes("tar") || type.includes("compressed")) return "archive";
  if (type.includes("javascript") || type.includes("json") || type.includes("html") || type.includes("css") || type.includes("code")) return "code";
  return "file";
}

export function FileCategoryIcon({ mimetype, className = "w-5 h-5" }) {
  const category = getFileCategory(mimetype);

  switch (category) {
    case "image":
      return (
        <svg className={`${className} text-vault-success`} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          <path d="m21 15-5-5-6 6-2-2-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "video":
      return (
        <svg className={`${className} text-vault-accent`} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.75" />
          <path d="M10 9v6l5-3-5-3z" fill="currentColor" />
        </svg>
      );

    case "audio":
      return (
        <svg className={`${className} text-vault-accent`} viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );

    case "pdf":
      return (
        <svg className={`${className} text-vault-danger`} viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.75" />
          <path d="M14 2v6h6M10 12h4M10 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case "document":
      return (
        <svg className={`${className} text-vault-sky`} viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.75" />
          <path d="M14 2v6h6M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case "archive":
      return (
        <svg className={`${className} text-vault-muted`} viewBox="0 0 24 24" fill="none">
          <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8M23 3H1v5h22V3zM10 12h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case "code":
      return (
        <svg className={`${className} text-vault-accent`} viewBox="0 0 24 24" fill="none">
          <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return (
        <svg className={`${className} text-vault-muted`} viewBox="0 0 24 24" fill="none">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" stroke="currentColor" strokeWidth="1.75" />
          <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
  }
}
