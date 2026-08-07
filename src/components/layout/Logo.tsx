import Stamp from "@/components/ui/Stamp";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <Stamp value="VG" size="md" tone="onInk" className="shrink-0" />
      <span className="font-serif text-xl font-semibold tracking-tight">
        <span className="text-paper">Visitor</span>
        <span className="text-gold-soft">Guide</span>
      </span>
    </div>
  );
}
