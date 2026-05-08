import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Flame,
  MapPinned,
  ShieldCheck,
  Store,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const featureItems: FeatureItem[] = [
  {
    title: "Hyperlocal Discovery",
    description:
      "Find street-food stalls near you with live map context and real-time community activity.",
    icon: MapPinned,
  },
  {
    title: "Verified Check-ins",
    description:
      "Only nearby users can check in, so food buzz stays trustworthy and location-aware.",
    icon: ShieldCheck,
  },
  {
    title: "Community Growth",
    description:
      "Suggest hidden gems, upload photos, and help your city's food culture stay discoverable.",
    icon: UsersRound,
  },
];

const quickStats = [
  { value: "3", label: "steps to share a stall" },
  { value: "24/7", label: "map-based discovery" },
  { value: "100%", label: "community-powered data" },
];

const workflow = [
  {
    title: "Explore nearby",
    text: "Open the map to see what is sizzling around you right now.",
    icon: Compass,
  },
  {
    title: "Check in & review",
    text: "Share quick check-ins and photos when you are physically near the stall.",
    icon: Flame,
  },
  {
    title: "Grow the map",
    text: "Suggest new stalls so others can discover hidden local favorites.",
    icon: Store,
  },
];

export default function LandingPage() {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-10">
          <section className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-red-50 p-6 md:p-10">
            <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-14 h-52 w-52 rounded-full bg-red-200/30 blur-3xl" />

            <div className="relative z-10 grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-end">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold text-secondary">
                  <Flame size={14} />
                  STREET FOOD, POWERED BY LOCALS
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  Discover the best street food near you.
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                  KhauSpot helps you explore authentic neighborhood food spots,
                  check in on the go, and spotlight underrated local vendors.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="shadow-sm">
                    <Link href="/map">
                      Explore Map <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/add">Suggest a Stall</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-200/80 bg-white/85 p-4 md:p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Why people use KhauSpot
                </h2>
                <div className="space-y-3">
                  {quickStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-3"
                    >
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {featureItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_0_0_rgba(15,23,42,0.02)]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <item.icon size={20} />
                </div>
                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-border bg-white p-6 md:p-8">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
                  HOW IT WORKS
                </p>
                <h2 className="text-2xl md:text-3xl font-bold">
                  From discovery to check-in in minutes.
                </h2>
              </div>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/activity">View community activity</Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-border bg-muted/40 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <step.icon size={18} className="text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </article>
              ))}
            </div>

            <div className="md:hidden mt-5">
              <Button asChild variant="ghost" className="w-full">
                <Link href="/activity">View community activity</Link>
              </Button>
            </div>
          </section>

          <section className="rounded-3xl bg-primary text-primary-foreground p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                Ready to map your neighborhood flavors?
              </h2>
              <p className="text-primary-foreground/85 text-sm md:text-base">
                Start exploring now or contribute your favorite street-food
                spot.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" size="lg">
                <Link href="/map">Open Map</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10"
              >
                <Link href="/add">Add a Stall</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
