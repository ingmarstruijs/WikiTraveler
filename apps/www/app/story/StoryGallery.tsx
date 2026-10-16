import Image from "next/image";

export type GalleryItem = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type Props = {
  items: GalleryItem[];
  caption?: string;
  /** `desktop-mobile`: give the landscape shot most of the row; phone stays narrow. */
  layout?: "equal" | "desktop-mobile";
};

export function StoryGallery({ items, caption, layout = "equal" }: Props) {
  const galleryClass =
    layout === "desktop-mobile"
      ? "wt-www-article__gallery wt-www-article__gallery--desktop-mobile"
      : "wt-www-article__gallery";
  const sizes =
    layout === "desktop-mobile"
      ? "(max-width: 640px) 92vw, (max-width: 960px) 55vw, 480px"
      : "(max-width: 640px) 92vw, 240px";

  return (
    <figure className="wt-www-article__figure">
      <div className={galleryClass}>
        {items.map((item) => (
          <a
            key={item.src}
            className="wt-www-article__media-link"
            href={item.src}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width ?? 800}
              height={item.height ?? 1200}
              sizes={sizes}
            />
          </a>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
