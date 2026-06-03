import { Transaction, CATEGORIES, MONTH_NAMES } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

type TransactionListProps = {
  transactions: Transaction[];
  currentMonth: number;
  currentYear: number;
  onDelete: (id: string) => Promise<void>;
  isReadOnly?: boolean;
};

export default function TransactionList({ transactions, currentMonth, currentYear, onDelete, isReadOnly = false }: TransactionListProps) {
  const getCategoryIcon = (catName: string) => CATEGORIES.find(c => c.name === catName)?.icon || '📌';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-sm text-white/50 uppercase font-semibold tracking-widest px-1">
          Riwayat Transaksi
        </h3>
        <span className="text-xs font-medium text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pr-1 -mr-1">
        {transactions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 border-dashed"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50 grayscale">🍃</span>
            </div>
            <p className="text-white/60 font-medium text-sm">Tidak ada transaksi</p>
          </motion.div>
        ) : (
          <div className="space-y-3 pb-8">
            <AnimatePresence>
              {transactions.map((t, index) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
                  className="glass-panel-hover flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 group relative overflow-hidden"
                >
                  {/* Indicator Line */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    t.type === 'income' ? "bg-emerald-500/50" : "bg-rose-500/50"
                  )} />

                  <div className="flex items-center gap-4 pl-2">
                    <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-lg shadow-inner shrink-0">
                      {getCategoryIcon(t.category)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white/90 font-medium text-sm truncate max-w-[150px] md:max-w-[200px]">{t.description}</h4>
                      <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider font-semibold">
                        {new Date(t.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {t.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "font-serif font-semibold text-base",
                      t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    )}>
                      {t.type === 'income' ? '+' : '-'} {t.amount >= 1000 ? `${t.amount / 1000}K` : t.amount}
                    </p>
                    
                    {!isReadOnly && (
                      <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bottom-2 bg-black/60 px-1 rounded backdrop-blur-md">
                        <button 
                          onClick={() => onDelete(t.id)} 
                          className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors uppercase tracking-wider"
                        >
                          <Trash2 size={10} /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
