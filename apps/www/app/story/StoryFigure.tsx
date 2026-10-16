import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function StoryFigure({
  src,
  alt,
  caption,
  width = 1200,
  height = 720,
  priority = false,
}: Props) {
  return (
    <figure className="wt-www-article__figure">
      <a
        className="wt-www-article__media-link"
        href={src}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(max-width: 760px) 92vw, 720px"
        />
      </a>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
