"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-sm shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
          <Image
            src="/pennyplan.svg"
            alt="PennyPlan logo"
            width={18}
            height={18}
            className="brightness-0 invert"
          />
        </div>
        <span className="font-bold text-base tracking-tight">PennyPlan</span>
      </Link>

      <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">
          Features
        </a>
        <a
          href="#how-it-works"
          className="hover:text-foreground transition-colors"
        >
          How it works
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Button asChild size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="shadow-sm shadow-primary/20">
            <Link href="/sign-up">Get started</Link>
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
