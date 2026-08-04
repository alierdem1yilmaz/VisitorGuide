import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/images/logo/icon.svg"
        alt="VisitorGuide"
        width={36}
        height={36}
        priority
      />
      <span className="text-xl font-bold tracking-tight">
        <span className="text-brand-700">Visitor</span>
        <span className="text-brand-500">Guide</span>
      </span>
    </div>
  );
}
