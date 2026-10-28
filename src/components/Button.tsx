import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { cn } from "cn";
import type { MouseEvent, ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: "link" | "button";
  type?: "button" | "submit" | "reset";
  className?: string;
  action?: (e: MouseEvent) => void;
  href?: string;
  isExternalLink?: boolean;
  disabled?: boolean;
};

export default function Button({
  as = "button",
  type = "button",
  disabled = false,
  isExternalLink = false,
  ...props
}: Props) {
  const defaultButtonClassName = `bg-primary text-near-black px-6 py-3.5 ${disabled ? "bg-off-white text-muted cursor-default" : "disabled:bg-off-white disabled:text-muted disabled:cursor-default!"}`;

  if (as === "link") {
    return isExternalLink ? (
      <a
        href={props.href}
        target="_blank"
        referrerPolicy="no-referrer"
        className={cn(props.className, defaultButtonClassName)}
        aria-disabled={disabled}
        onClick={props.action}
      >
        {props.children}
      </a>
    ) : (
      <Link
        to={props.href as any}
        className={cn(props.className, defaultButtonClassName)}
        disabled={disabled}
        onClick={props.action}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={props.action}
      disabled={disabled}
      className={cn(props.className, defaultButtonClassName)}
    >
      {props.children}
    </button>
  );
}
