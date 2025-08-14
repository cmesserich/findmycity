// components/PrintBrandHeader.tsx
import Logo from "@/components/Logo";

export default function PrintBrandHeader() {
  return (
    // Hidden on screen, shown only for print/PDF
    <div className="hidden print:flex items-center justify-between pb-3 mb-4 border-b border-slate-300">
      <Logo />
      <div className="text-sm text-slate-700">
        Relocation brief
      </div>
    </div>
  );
}
