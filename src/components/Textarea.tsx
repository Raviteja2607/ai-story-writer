type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ label, ...props }: Props) {
  return (
    <label className="block space-y-1">
      <span className="text-sm opacity-80">{label}</span>
      <textarea
        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...props}
      />
    </label>
  );
}
