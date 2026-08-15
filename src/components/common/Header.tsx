// src/components/common/Header.tsx
import logoBlue from "@/assets/desamiBlue.png";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const scrollToForm = () => {
    document
      .getElementById("waitlist-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <img src={logoBlue} alt="Desami" className="h-8 w-auto" />
        <button
          onClick={scrollToForm}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
        >
          Join Waitlist
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
