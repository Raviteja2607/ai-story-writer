type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, ...props }: Props) {
  return (
    <label className="block space-y-1">
      <span className="text-sm opacity-80">{label}</span>
      <input
        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        {...props}
      />
    </label>
  );
}
