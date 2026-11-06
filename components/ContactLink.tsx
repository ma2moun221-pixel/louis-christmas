"use client";

import { track } from "@/lib/track";

/** رابط واتساب بيسجّل حدث Contact بالبكسل لما ينكبس */
export default function ContactLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={() => track("Contact")}>
      {children}
    </a>
  );
}
