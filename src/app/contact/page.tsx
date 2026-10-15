import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  SITE_NAME,
  SITE_URL,
  generateContactPageJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ContactForm from "./ContactForm";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description:
    "Connect with the RE/MAX ELITE brokerage team for private viewings, listing consultations, architectural appraisals, and side-by-side comparison assistance.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: `Contact RE/MAX ELITE | Direct Brokerage Desk`,
    description:
      "Schedule a private showing or speak with an architectural real estate specialist today.",
    url: `${SITE_URL}/contact`,
  },
};

const faqs = [
  {
    q: "How does the side-by-side comparison tool help during my purchase?",
    a: "Our matrix breaks down key specs, price per square foot, HOA fees, and amenities across up to 4 homes side-by-side. This gives you empirical leverage when making offers and identifying underpriced opportunities.",
  },
  {
    q: "How quickly will an advisor respond to my private showing request?",
    a: "Our concierge team reviews all incoming inquiries within 2 hours during business hours and pairs you with the dedicated listing specialist for that specific market.",
  },
  {
    q: "Can you assist with confidential off-market pocket listings?",
    a: "Yes. In addition to our public listings catalog, RE/MAX ELITE manages an extensive private collection of off-market architectural estates and penthouses available exclusively through our advisory team.",
  },
  {
    q: "Do you represent international and corporate relocation buyers?",
    a: "Our group frequently handles domestic and international wire escrow, cross-border tax coordination, and remote video walkthroughs for global clients.",
  },
];

export default function ContactPage() {
  const contactJsonLd = generateContactPageJsonLd();
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <JsonLd data={contactJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Direct Client Services Desk</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Connect With{" "}
            <span className="bg-gradient-to-r from-red-400 via-white to-blue-300 bg-clip-text text-transparent">
              RE/MAX ELITE.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether inquiring about an architectural residence, requesting a comparative market analysis, or scheduling a private tour, our specialists are at your disposal.
          </p>
        </div>
      </section>

      {/* Main Grid: Form & Info Cards */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Information & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Headquarters Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    RE/MAX ELITE Flagship Office
                  </h3>
                  <p className="text-xs text-slate-500">Orchard Shopping Complex, Galle Road</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 text-slate-700">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Office Location</p>
                    <p className="text-slate-500">
                      Remax Elite, No 7 - 3/1 E,<br />
                      Orchard Shopping Complex, Galle Road,<br />
                      Colombo 06, Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <Phone className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Telephone Inquiries</p>
                    <p className="text-slate-500">
                      Head Office: +94 11 234 5678<br />
                      Direct / WhatsApp: +94 77 123 4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <Mail className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Email Correspondence</p>
                    <p className="text-slate-500">
                      General: colombo@remax-elite.lk<br />
                      Showings: showings@remax-elite.lk
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Hours of Operation</p>
                    <p className="text-slate-500">
                      Monday – Friday: 8:30 AM – 6:30 PM (IST)<br />
                      Saturday: 9:00 AM – 3:00 PM<br />
                      Sunday: By Private Showing Appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* Private Valet / Directions Note */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-blue-900 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  Convenient Parking Available at Orchard Shopping Complex, Galle Road
                </span>
              </div>
            </div>

            {/* Quick Browse Callout */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Have listings in mind?
              </span>
              <h4 className="text-base font-bold">
                Compare Multiple Properties Directly
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use our side-by-side comparison engine to analyze price per square foot, HOA fees, and amenities before speaking with your broker.
              </p>
              <div className="pt-2">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                >
                  <span>Launch Comparison Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-20 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-12">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Questions</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">
              Key details regarding our representation, showings, and comparison services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
