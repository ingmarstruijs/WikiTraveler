"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  compact?: boolean;
};

export function LightboxFigure({
  src,
  alt,
  caption,
  width,
  height,
  priority = false,
  sizes = "(max-width: 900px) 92vw, 560px",
  className,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const label = caption ?? alt;

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
  }, []);

  const openDialog = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <figure
        className={[
          className,
          compact ? "wt-www-home-figure wt-www-home-figure--compact" : "wt-www-home-figure",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          className="wt-www-home-media-link"
          onClick={openDialog}
          aria-haspopup="dialog"
          aria-label={`Enlarge: ${label}`}
        >
          <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes={sizes} />
        </button>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>

      <dialog
        ref={dialogRef}
        className="wt-www-lightbox"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="wt-www-lightbox__panel">
          <div className="wt-www-lightbox__bar">
            <p id={titleId} className="wt-www-lightbox__title">
              {label}
            </p>
            <button type="button" className="wt-www-lightbox__close" onClick={close}>
              Close
            </button>
          </div>
          <div className="wt-www-lightbox__frame">
            {/* eslint-disable-next-line @next/next/no-img-element -- full-res lightbox asset */}
            <img src={src} alt={alt} className="wt-www-lightbox__img" />
          </div>
        </div>
      </dialog>
    </>
  );
}
