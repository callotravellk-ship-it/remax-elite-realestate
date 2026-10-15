"use client";

import React, { useState, useId } from "react";
import { Calculator, Percent, Calendar } from "lucide-react";

interface MortgageCalculatorProps {
  initialPrice?: number;
  annualTaxes?: number;
  monthlyHoa?: number;
}

export default function MortgageCalculator({
  initialPrice = 125000000,
  annualTaxes = 250000,
  monthlyHoa = 35000,
}: MortgageCalculatorProps) {
  const homePriceId = useId();
  const downPaymentPercentId = useId();
  const interestRateId = useId();
  const loanTermId = useId();
  const [price, setPrice] = useState(initialPrice);
  const [downPercent, setDownPercent] = useState(25);
  const [interestRate, setInterestRate] = useState(11.5);
  const [loanYears, setLoanYears] = useState(20);

  const downPaymentDollars = (price * downPercent) / 100;
  const loanAmount = Math.max(0, price - downPaymentDollars);

  // Monthly mortgage calculation: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanYears * 12;
  
  const monthlyPrincipalInterest =
    monthlyRate > 0 && totalMonths > 0
      ? (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / (totalMonths || 1);

  const monthlyPropertyTax = annualTaxes / 12;
  const monthlyInsurance = Math.round((price * 0.002) / 12); // ~0.20% fire & perils insurance est.
  const totalMonthly = Math.round(
    monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + monthlyHoa
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            RE/MAX Sri Lanka Mortgage & Loan Calculator
          </h3>
          <p className="text-xs text-slate-500">
            Estimate your monthly repayment with Sri Lankan bank housing loan rates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Controls */}
        <div className="space-y-4">
          {/* Home Price */}
          <div>
            <label htmlFor={homePriceId} className="block text-xs font-bold text-slate-700 mb-1">
              Property Value (Rs.)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                Rs.
              </span>
              <input
                id={homePriceId}
                type="number"
                step="500000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 font-semibold"
              />
            </div>
          </div>

          {/* Down Payment % and Rs. */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={downPaymentPercentId} className="block text-xs font-bold text-slate-700 mb-1">
                Down Payment (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  id={downPaymentPercentId}
                  type="number"
                  min="0"
                  max="100"
                  value={downPercent}
                  onChange={(e) => setDownPercent(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1">
                Down Payment (Rs.)
              </span>
              <div className="py-2 px-3 text-sm bg-slate-100 rounded-lg text-slate-700 font-bold truncate">
                Rs. {Math.round(downPaymentDollars).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Interest Rate & Loan Term */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={interestRateId} className="block text-xs font-bold text-slate-700 mb-1">
                Interest Rate (% p.a.)
              </label>
              <input
                id={interestRateId}
                type="number"
                step="0.25"
                min="1"
                max="30"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label htmlFor={loanTermId} className="block text-xs font-bold text-slate-700 mb-1">
                Loan Term
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <select
                  id={loanTermId}
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none"
                >
                  <option value={20}>20 Years Fixed</option>
                  <option value={15}>15 Years Fixed</option>
                  <option value={10}>10 Years Fixed</option>
                  <option value={25}>25 Years Fixed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Output Payment Breakdown Card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="text-center pb-4 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimated Monthly Installment
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              Rs. {totalMonthly.toLocaleString()}
              <span className="text-xs font-normal text-slate-500"> /mo</span>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                Principal & Interest (EMI)
              </span>
              <span className="font-bold text-slate-900">
                Rs. {Math.round(monthlyPrincipalInterest).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Municipal Rates (Est.)
              </span>
              <span className="font-bold text-slate-900">
                Rs. {Math.round(monthlyPropertyTax).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Property Insurance (Est.)
              </span>
              <span className="font-bold text-slate-900">
                Rs. {monthlyInsurance.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Monthly Maintenance
              </span>
              <span className="font-bold text-slate-900">
                Rs. {monthlyHoa.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-5 text-[11px] text-slate-500 text-center leading-relaxed">
            Loan Capital: Rs. {Math.round(loanAmount).toLocaleString()} • Down Payment: Rs. {Math.round(downPaymentDollars).toLocaleString()} ({downPercent}%)
          </div>
        </div>
      </div>
    </div>
  );
}
