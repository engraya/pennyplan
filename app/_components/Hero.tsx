import Link from "next/link";
import Image from "next/image";
import {
  PiggyBank,
  CircleDollarSign,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Check,
  Target,
  Shield,
  Zap,
  UserPlus,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const features = [
  {
    icon: PiggyBank,
    title: "Smart Budgeting",
    desc: "Create budgets with visual progress tracking and instant alerts when you're approaching your limit.",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: CircleDollarSign,
    title: "Income Tracking",
    desc: "Manage multiple income streams and see your total earnings across all sources at a glance.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    desc: "Get personalized financial advice from Google Gemini AI analyzing your actual spending and savings patterns.",
    gradient: "from-violet-500 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    desc: "Beautiful charts and dashboards that make understanding your finances intuitive and actionable.",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    desc: "Your data is protected with enterprise-level encryption and secure Clerk authentication.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    desc: "Instant sync across all your devices. Add an expense and see your budget update immediately.",
    gradient: "from-yellow-500 to-orange-500",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    desc: "Sign up in seconds with your email or Google. No credit card required.",
  },
  {
    icon: Wallet,
    title: "Add budgets & income",
    desc: "Set up your budget categories and income sources to start tracking your money.",
  },
  {
    icon: Sparkles,
    title: "Get AI insights",
    desc: "Let our AI analyze your patterns and give you personalized advice to reach your goals.",
  },
];

const CHART_BARS = [35, 60, 45, 75, 50, 80, 65, 90, 55, 70, 85, 100];
const BUDGETS = [
  { name: "🍔 Food & Dining", spent: 420, total: 600, pct: 70, color: "bg-orange-400" },
  { name: "🚗 Transport", spent: 180, total: 300, pct: 60, color: "bg-blue-400" },
  { name: "🎮 Entertainment", spent: 75, total: 200, pct: 37, color: "bg-violet-400" },
];
const STATS_CARDS = [
  { label: "Total Budget", value: "$4,500", icon: Target, colorClass: "bg-primary/10 text-primary" },
  { label: "Spent", value: "$2,100", icon: TrendingUp, colorClass: "bg-warning/10 text-warning" },
  { label: "Remaining", value: "$2,400", icon: PiggyBank, colorClass: "bg-success/10 text-success" },
];

export default function Hero() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center py-16 lg:py-24 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/8 blur-[130px] -z-10 animate-glow-pulse pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[80px] -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[280px] h-[280px] rounded-full bg-pink-500/5 blur-[70px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 xl:gap-20 items-center w-full">

          {/* ── Left: Copy ── */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3 h-3" />
              AI-Powered Personal Finance
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Your money,{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
                finally in control
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Track budgets, manage income streams, and unlock AI-powered
              insights — all in one beautifully simple dashboard.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <SignedOut>
                <Button
                  size="lg"
                  className="gap-2 h-12 px-6 text-base font-semibold shadow-lg shadow-primary/25"
                  asChild
                >
                  <Link href="/sign-up">
                    Start for free <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base"
                  asChild
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  className="gap-2 h-12 px-6 text-base font-semibold shadow-lg shadow-primary/25"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </SignedIn>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {["No credit card required", "Free forever plan", "Setup in 2 minutes"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-success" />
                    </div>
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── Right: Dashboard Mockup ── */}
          <div className="relative hidden lg:block">
            {/* Glow behind */}
            <div className="absolute inset-6 bg-primary/15 blur-[60px] rounded-3xl -z-10" />

            <div className="animate-float">
              <div className="bg-card border border-border/70 rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-muted/60 border-b border-border/50 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 bg-background/60 rounded-md h-6 mx-3 flex items-center px-3 gap-2">
                    <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">
                      pennyplan.app/dashboard
                    </span>
                  </div>
                </div>

                {/* Dashboard body */}
                <div className="p-4 space-y-3">
                  {/* Greeting */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Good morning</p>
                      <p className="text-sm font-semibold">Ahmad's Dashboard</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full border border-primary/20">
                      <Sparkles className="w-3 h-3" />
                      AI Ready
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {STATS_CARDS.map((card) => (
                      <div
                        key={card.label}
                        className="bg-background rounded-xl p-3 border border-border/40"
                      >
                        <div
                          className={`w-7 h-7 ${card.colorClass} rounded-lg flex items-center justify-center mb-2`}
                        >
                          <card.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-sm font-bold">{card.value}</div>
                        <div className="text-xs text-muted-foreground">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div className="bg-background rounded-xl p-3 border border-border/40">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium">Spending Overview</span>
                      <span className="text-xs text-muted-foreground">Last 12 months</span>
                    </div>
                    <div className="flex items-end gap-1 h-14">
                      {CHART_BARS.map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div
                            className={`rounded-sm ${i === 11 ? "bg-primary" : "bg-primary/20"}`}
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Apr</span>
                      <span>Jul</span>
                      <span>Dec</span>
                    </div>
                  </div>

                  {/* Budget progress */}
                  <div className="bg-background rounded-xl p-3 border border-border/40 space-y-2.5">
                    <span className="text-xs font-medium">Budget Progress</span>
                    {BUDGETS.map((b) => (
                      <div key={b.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">{b.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ${b.spent}/${b.total}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${b.color} rounded-full`}
                            style={{ width: `${b.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ STATS ═══════════════════════════════ */}
      <section className="border-y border-border/50 bg-muted/20 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Active Users", emoji: "👥" },
            { value: "$2M+", label: "Monthly Tracked", emoji: "💰" },
            { value: "98%", label: "Satisfaction Rate", emoji: "⭐" },
            { value: "< 2min", label: "Setup Time", emoji: "⚡" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════ FEATURES ═══════════════════════════════ */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Zap className="w-3 h-3" />
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything you need to thrive{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                financially
              </span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Powerful, intuitive tools designed to give you complete clarity and
              confidence over your money.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-card border border-border hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-sm`}
                >
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ HOW IT WORKS ═══════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[90px] -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Target className="w-3 h-3" />
              How it works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                minutes
              </span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Getting started is incredibly simple. No complicated setup, no
              learning curve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-8 left-[calc(33.3%+16px)] right-[calc(33.3%+16px)] h-px bg-gradient-to-r from-border via-primary/30 to-border" />

            {steps.map((step, i) => (
              <div key={step.title} className="text-center relative">
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm shadow-primary/30">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-base">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ CTA ═══════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-violet-500/4 to-transparent -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/10 blur-[110px] -z-10 animate-glow-pulse pointer-events-none" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3 h-3" />
            Ready to start?
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Master your finances,{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
              today.
            </span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands already taking control of their financial future with
            PennyPlan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <SignedOut>
              <Button
                size="lg"
                className="gap-2 h-12 px-8 text-base font-semibold shadow-xl shadow-primary/25"
                asChild
              >
                <Link href="/sign-up">
                  Create free account <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                size="lg"
                className="gap-2 h-12 px-8 text-base font-semibold shadow-xl shadow-primary/25"
                asChild
              >
                <Link href="/dashboard">
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </SignedIn>
          </div>

          <p className="text-sm text-muted-foreground">
            Free forever · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */}
      <footer className="border-t border-border py-10 bg-muted/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Image
                src="/pennyplan.svg"
                alt="PennyPlan"
                width={16}
                height={16}
                className="brightness-0 invert"
              />
            </div>
            <span className="font-bold text-sm">PennyPlan</span>
            <span className="text-xs text-muted-foreground hidden sm:inline ml-1">
              — Take control of your financial future
            </span>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PennyPlan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
