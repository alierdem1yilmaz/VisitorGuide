// CSS/SVG placeholder standing in for the real logo asset — swap the <svg>
// below for public/images/logo/logo.svg (via next/image) once it's added.
export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700">
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-600" fill="currentColor">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
          </svg>
          <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500" />
        </div>
      </div>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-brand-700">Visitor</span>
        <span className="text-brand-500">Guide</span>
      </span>
    </div>
  );
}
