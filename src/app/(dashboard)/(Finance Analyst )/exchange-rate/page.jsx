"use client";
import { useExchangeRates } from "../exchange-rate/_hook/useExchangeRates";
import { ExchangeRateTable } from "./components/ExchangeRateTable";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExchangeRatesPage() {
  const ratesHook = useExchangeRates();

  return (
    <div className="space-y-6 bg-slate-50/30 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Exchange Rates</h1>
          <p className="text-slate-500 text-sm font-medium">Manage global currency conversion rates for costing.</p>
        </div>
        <Button variant="outline" size="sm" onClick={ratesHook.refresh} disabled={ratesHook.loading}>
          <RefreshCcw size={14} className={`mr-2 ${ratesHook.loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <ExchangeRateTable ratesHook={ratesHook} />
    </div>
  );
}