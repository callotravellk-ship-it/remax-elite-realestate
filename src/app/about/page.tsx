import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  generateOrganizationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import {
  ShieldCheck,
  Scale,
  Award,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description:
    "Learn about RE/MAX ELITE — pioneering luxury architectural real estate brokerage paired with industry-first side-by-side property comparison technology.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `About RE/MAX ELITE | Premier Luxury Real Estate`,
    description:
      "Combining global brokerage authority with transparent property metrics and interactive comparison tools.",
    url: `${SITE_URL}/about`,
  },
};

const teamMembers = [
  {
    name: "Dilani Senanayake",
    role: "Managing Broker & Principal Partner",
    license: "RE/MAX Elite Colombo • DRE #01928374",
    phone: "+94 77 234 5678",
    email: "d.senanayake@remax-elite.lk",
    image: "/agents/agent-female-blazer.jpg",
    bio: "Over 20 years leading luxury residential acquisitions and high-value developments across Colombo 07, Colombo 03, and Cinnamon Gardens.",
  },
  {
    name: "Hiruni Wickramasinghe",
    role: "Senior Vice President, Architectural Estates",
    license: "RE/MAX Elite Colombo • DRE #02049182",
    phone: "+94 77 345 6789",
    email: "h.wickramasinghe@remax-elite.lk",
    image: "/agents/agent-female-white-top.jpg",
    bio: "Specialist in tropical modernist residences, colonial heritage bungalows, and luxury coastal estates across Sri Lanka.",
  },
  {
    name: "Sanduni Jayawardena",
    role: "Director of Luxury Acquisitions & Analytics",
    license: "RE/MAX Elite Colombo • DRE #02118239",
    phone: "+94 77 456 7890",
    email: "s.jayawardena@remax-elite.lk",
    image: "/agents/agent-female-blue-kurti.jpg",
    bio: "Pioneered RE/MAX ELITE's proprietary price-per-square-foot and price-per-perch valuation model for Sri Lankan real estate investments.",
  },
  {
    name: "Roshan De Silva",
    role: "Senior Advisor, Waterfront & Penthouses",
    license: "RE/MAX Elite Colombo • DRE #01882931",
    phone: "+94 77 567 8901",
    email: "r.desilva@remax-elite.lk",
    image: "/agents/agent-male-galleface.jpg",
    bio: "Renowned for waterfront dominance across Galle Face, Marine Drive oceanfront penthouses, and southern coastal luxury properties.",
  },
];

export default function AboutPage() {
  const orgJsonLd = generateOrganizationJsonLd();
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950">
      <JsonLd data={orgJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>The RE/MAX ELITE Difference</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Redefining Luxury Real Estate Through{" "}
            <span className="bg-gradient-to-r from-red-400 via-white to-blue-300 bg-clip-text text-transparent">
              Precision & Technology.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RE/MAX ELITE bridges world-class brokerage expertise with the industry&apos;s most advanced property comparison matrix. We empower buyers, sellers, and investors with transparent, verified data.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            <Link
              href="/#listings"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              <span>Explore Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 border border-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-red-400" />
              <span>Contact Specialists</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t-4 border-t-red-600">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">$1.4B+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Career Sales Volume
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-red-600">1,600+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Closed Luxury Deals
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-900 dark:text-blue-400">45+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Top Metropolitan Markets
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">99.4%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Client Satisfaction
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Our Vision</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              A New Standard for High-Stakes Real Estate Decisions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Founded on the belief that luxury property acquisitions deserve absolute clarity, RE/MAX ELITE has pioneered a data-driven approach to real estate. While traditional brokerages rely solely on emotional marketing, we pair architectural storytelling with hard quantitative metrics.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our proprietary <strong>Side-by-Side Property Comparison Matrix</strong> allows clients to contrast square foot values, HOA assessments, floor area ratios, and structural amenities with surgical precision before making seven- and eight-figure decisions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Fiduciary First</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Uncompromising client loyalty and negotiation mastery.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verified Analytics</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Accurate price/sqft, tax assessments, and HOA modeling.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="RE/MAX ELITE Architectural Masterpiece"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
              <div className="text-white space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400">Flagship Representation</p>
                <p className="text-lg font-black">Cinnamon Gardens Heritage Luxury Bungalow • Rs. 485,000,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Top Producers */}
      <section className="bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>Leadership & Advisory</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Meet Our Executive Brokerage Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Seasoned advisors with distinguished records in ultra-luxury estates, architectural design, and comparative valuation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-slate-950/60 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                      {member.license}
                    </span>
                    <h3 className="text-base font-bold text-white">{member.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs font-bold text-blue-900 dark:text-blue-400">{member.role}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 rounded-2xl p-10 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Let&apos;s Discuss Your Vision
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Looking to Buy, Sell, or Compare Architectural Homes?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Connect with an executive RE/MAX ELITE advisor for a confidential consultation, property valuation, or bespoke comparative analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              Get in Touch
            </Link>
            <Link
              href="/compare"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              Open Comparison Matrix
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
