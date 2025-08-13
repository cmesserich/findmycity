export default function DeltaPill({ value, good }: { value: number; good: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        good
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-red-500/30 bg-red-500/10 text-red-400",
      ].join(" ")}
      title={good ? "Better in B" : "Worse in B"}
    >
      {value > 0 ? "▲" : value < 0 ? "▼" : "•"}&nbsp;{(value > 0 ? "+" : "") + value.toFixed(1)}%
    </span>
  );
}
