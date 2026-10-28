import type { LucideIcon } from "lucide-react";
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

type Props = {
  label?: string;
  type?: HTMLInputTypeAttribute;
  name: string;
  id: string;
  placeholder?: string;
  icon?: LucideIcon;
  iconProps?: {
    size?: number;
    className?: string;
  };
  className?: string;
  containerClassName?: string;
  value?: string | number | readonly string[];
  onChange?: (value: string) => void;
  extraProps?: InputHTMLAttributes<HTMLInputElement>
};

export default function TextField(props: Props) {
  return (
    <label htmlFor={props.id} className={`w-full flex flex-col gap-y-3 ${props.containerClassName}`}>
      {props.label && <span className="text-sm text-near-black">{props.label}</span>}
      <div className={`border border-input p-3 flex items-center gap-x-2.5 ${props.className}`}>
        {props.icon && <props.icon size={props.iconProps?.size || 15} className={`text-near-black shrink-0 ${props.iconProps?.className}`} />}
        <input
          type={props.type || "text"}
          name={props.name}
          id={props.id}
          placeholder={props.placeholder}
          className="w-full text-sm leading-normal placeholder:text-muted text-near-black outline-none"
          value={props.value}
          onChange={(e) => props.onChange?.(e.target.value)}
        />
      </div>
    </label>
  );
}
