"use client";

import React, { useState } from "react";
import { Send, Check, Phone, Mail, Building, Clock, MapPin, ShieldCheck } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Buying a Property");
  const [budget, setBudget] = useState("Rs. 50M - Rs. 150M");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 p-6 sm:p-8 border-t-4 border-t-red-600">
      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Thank You, {name}!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your inquiry regarding <strong>{inquiryType}</strong> has been transmitted to our senior brokerage team. A designated RE/MAX ELITE advisor will reach out within 2 hours.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Direct Brokerage Inquiry
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Please share your preferences and our architectural specialists will respond promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inquiry Type
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white cursor-pointer"
              >
                <option value="Buying a Property">Buying a Property</option>
                <option value="Listing / Selling a Home">Listing / Selling a Home</option>
                <option value="Schedule Private Walkthrough">Schedule Private Walkthrough</option>
                <option value="Property Valuation">Property Valuation</option>
                <option value="Comparison Tool Support">Comparison Tool Support</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white cursor-pointer"
              >
                <option value="Under Rs. 50M">Under Rs. 50 Million</option>
                <option value="Rs. 50M - Rs. 150M">Rs. 50M - Rs. 150 Million</option>
                <option value="Rs. 150M - Rs. 350M">Rs. 150M - Rs. 350 Million</option>
                <option value="Rs. 350M - Rs. 750M">Rs. 350M - Rs. 750 Million</option>
                <option value="Rs. 750M+">Rs. 750M+ Ultra Luxury</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Message or Specific Requirements
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tell us about the property types, neighborhoods, desired amenities (pool, view, smart home), or questions you have..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              Your data is strictly confidential under NDA standards.
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition-all shadow-lg shadow-red-600/30 hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
