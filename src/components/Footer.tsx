import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Mail, Phone, MapPin, Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-red-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-32 bg-white rounded-lg p-1">
                <Image
                  src="/logo.png"
                  alt="RE/MAX ELITE"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              RE/MAX ELITE is the premier luxury residential & commercial brokerage. Providing verified architectural specifications, transparent pricing, and comprehensive property comparisons.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-red-400 transition-colors">
                  Featured Properties
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-red-400 transition-colors flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors">
                  About RE/MAX ELITE
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors">
                  Contact Specialists
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-red-400 transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Broker & Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Luxury Villas & Estates</li>
              <li>Skyline Penthouses</li>
              <li>Architectural Lofts</li>
              <li>Historic Townhouses</li>
              <li>Waterfront & Coastal Residences</li>
            </ul>
          </div>

          {/* Contact / Office */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Brokerage Office
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  Remax Elite, No 7 - 3/1 E,<br />
                  Orchard Shopping Complex, Galle Road,<br />
                  Colombo 06, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>colombo@remax-elite.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RE/MAX ELITE Sri Lanka. Each office is independently owned and operated. Licensed Real Estate Agency in Colombo.</p>
          <div className="flex items-center gap-6">
            <span className="text-red-400 font-bold">RE/MAX Elite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
