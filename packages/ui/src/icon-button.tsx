import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({ label, className = "", ...props }: IconButtonProps) {
  return (
    <button aria-label={label} className={`ui-icon-button ${className}`.trim()} {...props} />
  );
}
