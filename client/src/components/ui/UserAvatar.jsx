import { useState, useEffect } from "react";

const SIZE_CLASSES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
  "2xl": "w-24 h-24 text-3xl",
};

export default function UserAvatar({ user, size = "sm", className = "", showBorder = true }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states whenever user avatarUrl updates
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [user?.avatarUrl]);

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;
  const initial =
    user?.username?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "V";

  const hasAvatarUrl = Boolean(user?.avatarUrl);

  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center overflow-hidden select-none bg-vault-surface ${sizeClass} ${
        showBorder ? "border border-vault-accent/40" : ""
      } ${className}`}
    >
      {/* Monogram Fallback (Always mounted as background layer) */}
      <div className="w-full h-full bg-gradient-to-br from-vault-surface via-vault-panel to-[#14161A] text-vault-accent font-mono font-bold flex items-center justify-center shadow-inner">
        {initial}
      </div>

      {/* Real Image (Overlays on top when available and successfully loaded) */}
      {hasAvatarUrl && !imageError && (
        <img
          src={user.avatarUrl}
          alt={user.username || "User profile"}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
          className={`absolute inset-0 w-full h-full object-cover rounded-full transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
