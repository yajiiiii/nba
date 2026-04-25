import type { SVGProps } from "react";

export function BasketballIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3v18" />
      <path d="M5.6 5.6c2.5 2.5 2.5 10.3 0 12.8" />
      <path d="M18.4 5.6c-2.5 2.5-2.5 10.3 0 12.8" />
    </svg>
  );
}
