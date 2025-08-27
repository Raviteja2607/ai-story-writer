import { clsx } from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant="primary", size="md", ...props }: ButtonProps) {
  const base = "rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const variantCls = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50",
    ghost: "hover:bg-white/60"
  }[variant];
  const sizeCls = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg"
  }[size];
  return <button className={clsx(base, variantCls, sizeCls, className)} {...props} />;
}
