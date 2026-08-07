const SIZE = {
  sm: "h-9 w-9 text-[10px]",
  md: "h-12 w-12 text-xs",
  lg: "h-20 w-20 text-lg",
};

const TONE = {
  onPaper: "border-ink-text text-ink-text",
  onInk: "border-gold-soft text-gold-soft",
};

export default function Stamp({
  value,
  size = "md",
  tone = "onPaper",
  className = "",
}: {
  value: string | number;
  size?: "sm" | "md" | "lg";
  tone?: "onPaper" | "onInk";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex -rotate-6 items-center justify-center rounded-full border-[1.5px] border-dashed font-mono uppercase leading-none ${SIZE[size]} ${TONE[tone]} ${className}`}
    >
      <span className="font-serif text-[1.15em] font-medium italic">{value}</span>
    </span>
  );
}
