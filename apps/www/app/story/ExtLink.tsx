import type { ComponentProps } from "react";
import { externalLinkAttrs } from "../../lib/externalHref";

type Props = ComponentProps<"a"> & { href: string };

/** Anchor that opens external http(s) links in a new tab. */
export function ExtLink({ href, children, ...rest }: Props) {
  return (
    <a href={href} {...externalLinkAttrs(href)} {...rest}>
      {children}
    </a>
  );
}
