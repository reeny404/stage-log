import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SearchIcon(props: IconProps) {
  return <svg {...defaults} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>;
}

export function BookmarkIcon({ fill = "none", ...props }: IconProps) {
  return <svg {...defaults} {...props} fill={fill}><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21Z"/></svg>;
}

export function PlayIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path fill="currentColor" stroke="none" d="m9 7 8 5-8 5Z"/></svg>;
}

export function ArrowIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="M5 12h14M14 7l5 5-5 5"/></svg>;
}

export function HomeIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z"/></svg>;
}

export function RadioIcon(props: IconProps) {
  return <svg {...defaults} {...props}><circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.2 4.2a11 11 0 0 0 0 15.6M19.8 4.2a11 11 0 0 1 0 15.6"/></svg>;
}
