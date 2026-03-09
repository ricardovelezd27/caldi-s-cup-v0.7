import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language";

interface CoffeeImageProps {
  src: string | null;
  alt: string;
  className?: string;
  isTemporaryImage?: boolean;
  additionalImages?: string[];
}

export function CoffeeImage({ src, alt, className, isTemporaryImage, additionalImages }: CoffeeImageProps) {
  const { t } = useLanguage();
  const galleryImages = additionalImages && additionalImages.length > 0 ? additionalImages : null;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainSrc = galleryImages ? galleryImages[selectedIndex] : src;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-4 border-border bg-muted shadow-[4px_4px_0px_0px_hsl(var(--border))]">
        {mainSrc ? (
          <>
            <img
              src={mainSrc}
              alt={alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {isTemporaryImage && (
              <div className="absolute bottom-0 inset-x-0 bg-foreground/80 px-3 py-2 text-center">
                <p className="text-background text-sm font-medium">
                  <a href="/auth" className="underline text-primary font-bold">{t('coffee.signInLink')}</a>
                  {" "}{t('coffee.saveImageToCollection')}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Thumbnail gallery */}
      {galleryImages && galleryImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {additionalImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "flex-shrink-0 w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-md overflow-hidden border-4 transition-colors",
                i === selectedIndex
                  ? "border-primary shadow-[2px_2px_0px_0px_hsl(var(--primary))]"
                  : "border-border hover:border-primary/50"
              )}
            >
              <img
                src={img}
                alt={`${alt} view ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
