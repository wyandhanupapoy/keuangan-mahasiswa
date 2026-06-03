import { useState } from 'react';
import { CATEGORIES, QUICK_AMOUNTS } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';

type TransactionFormProps = {
  onAddTransaction: (data: { amount: number; description: string; category: string; transactionDate: string }) => Promise<void>;
  isSubmitting: boolean;
};

export default function TransactionForm({ onAddTransaction, isSubmitting }: TransactionFormProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makan');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return alert('Mohon isi jumlah dan keterangan!');
    
    await onAddTransaction({
      amount: Number(amount),
      description,
      category,
      transactionDate,
    });
    
    setAmount('');
    setDescription('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[100px]" />
      
      <h2 className="text-white/80 font-semibold text-lg flex items-center gap-2 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Plus size={18} />
        </div>
        Catat Mutasi
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Tanggal</label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name} className="bg-slate-900 text-white">
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Keterangan</label>
            <input
              type="text"
              placeholder="Contoh: Beli Kopi, Buku Cetak..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Nominal (Rp)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-serif text-lg group-focus-within:text-indigo-400 transition-colors">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pl-12 text-white font-serif text-2xl md:text-3xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm shadow-inner"
                required
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.slice(0, 4).map(amt => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-[10px] font-medium border border-white/5 transition-all active:scale-95"
                >
                  +{amt >= 1000 ? `${amt / 1000}K` : amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-2xl transition-all duration-300 mt-6 flex items-center justify-center gap-2 border border-white/10 backdrop-blur-md shadow-[0_4px_14px_0_rgba(255,255,255,0.05)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={18} className="group-hover:scale-110 transition-transform" />
              Catat Sekarang
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
