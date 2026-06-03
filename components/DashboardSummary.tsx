import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

type DashboardSummaryProps = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export default function DashboardSummary({ totalIncome, totalExpense, balance }: DashboardSummaryProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Saldo Utama - Kolom Kiri di Desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden flex flex-col justify-center min-h-[160px]"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h2 className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-2">Total Saldo</h2>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif text-white/70">Rp</span>
            <span className={cn(
              "text-5xl md:text-6xl font-serif tracking-tighter",
              balance < 0 ? "text-rose-400" : "text-white"
            )}>
              {balance.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Income & Expense - Kolom Kanan di Desktop */}
      <div className="flex flex-row md:flex-col gap-4 md:w-1/3">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel rounded-3xl p-5 flex-1 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h2 className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Pemasukan</h2>
          </div>
          <p className="text-emerald-400 font-serif text-xl md:text-2xl truncate mt-1">
            <span className="text-sm opacity-70 mr-1">Rp</span>
            {totalIncome.toLocaleString('id-ID')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel rounded-3xl p-5 flex-1 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <h2 className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Pengeluaran</h2>
          </div>
          <p className="text-rose-400 font-serif text-xl md:text-2xl truncate mt-1">
            <span className="text-sm opacity-70 mr-1">Rp</span>
            {totalExpense.toLocaleString('id-ID')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
