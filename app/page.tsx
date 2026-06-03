'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction, MONTH_NAMES } from '../types';
import DashboardSummary from '../components/DashboardSummary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ReportView from '../components/ReportView';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Share2, Download, Eye, Sparkles } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // State Filter Bulan & Tahun (Default: Bulan & Tahun saat ini)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Check if in parent mode
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'parent') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsReadOnly(true);
      }
    }
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching data:', error);
    else setTransactions(data || []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (data: { amount: number; description: string; category: string; transactionDate: string }) => {
    setIsSubmitting(true);
    
    // Import categories to get type
    const { CATEGORIES } = await import('../types');
    const selectedCategory = CATEGORIES.find(c => c.name === data.category);
    const type = selectedCategory?.type || 'expense';

    const { error } = await supabase
      .from('transactions')
      .insert([{ 
        amount: data.amount, 
        description: data.description, 
        type, 
        category: data.category,
        transaction_date: data.transactionDate 
      }]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan transaksi');
    } else {
      fetchTransactions();
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) fetchTransactions();
  };

  // FILTERING: Hanya ambil transaksi di bulan & tahun yang dipilih
  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.transaction_date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleShare = () => {
    const url = window.location.origin + window.location.pathname + '?mode=parent';
    navigator.clipboard.writeText(url);
    alert('Link Mode Orang Tua disalin! Silakan kirim (Paste) ke WhatsApp orang tua Anda.');
  };

  const handleDownload = async () => {
    setIsExporting(true);
    const node = document.getElementById('dashboard-content');
    if (!node) {
      setIsExporting(false);
      return;
    }
    try {
      await new Promise(r => setTimeout(r, 500));
      const dataUrl = await htmlToImage.toPng(node, { 
        quality: 0.95, 
        backgroundColor: '#000000', 
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const link = document.createElement('a');
      link.download = `Laporan_Kas_${MONTH_NAMES[currentMonth]}_${currentYear}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Gagal mengunduh gambar', error);
      alert('Maaf, gagal mengekspor laporan.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-screen relative selection:bg-indigo-500/30 font-sans pb-32">
      
      {/* AURORA ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/10 blur-[100px] animate-blob mix-blend-screen" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-purple-600/10 blur-[120px] animate-blob mix-blend-screen" style={{ animationDelay: '4s' }} />
      </div>

      <div id="dashboard-content" className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        
        {/* Header Baru */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md">
              <Sparkles className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif tracking-tight text-white flex items-center gap-2">
                Buku Kas
                {isReadOnly && <span className="text-xs font-sans font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1"><Eye size={12} /> Pantau</span>}
              </h1>
              <p className="text-[11px] text-white/50 font-medium uppercase tracking-widest">Fintech Pribadi</p>
            </div>
          </motion.div>
          
          <div className={cn("flex items-center gap-3", isExporting && "opacity-0")}>
            {!isReadOnly && (
              <button onClick={handleShare} className="text-xs font-semibold flex items-center gap-1.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all border border-white/10 backdrop-blur-md">
                <Share2 size={14} /> Bagikan
              </button>
            )}
            <button onClick={handleDownload} className="text-xs font-semibold flex items-center gap-1.5 text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 px-4 py-2 rounded-full transition-all border border-indigo-500/20 backdrop-blur-md">
              <Download size={14} /> Unduh
            </button>
          </div>
        </header>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(180px,auto)] gap-4 md:gap-6">
          
          {/* Bento Item: Balance Summary (Lebar Penuh Atas) */}
          <div className="md:col-span-12 lg:col-span-8">
            <DashboardSummary totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
          </div>

          {/* Bento Item: Form Tambah (Hanya jika bukan mode Pantau) */}
          {!isReadOnly && (
            <div className="md:col-span-12 lg:col-span-4 row-span-2">
              <TransactionForm onAddTransaction={handleAddTransaction} isSubmitting={isSubmitting} />
            </div>
          )}

          {/* Bento Item: Laporan Grafik */}
          <div className={cn("md:col-span-12", !isReadOnly ? "lg:col-span-8" : "lg:col-span-8")}>
            <div className="glass-panel rounded-3xl p-6 h-full w-full">
              <h2 className="text-sm text-white/50 uppercase tracking-widest font-semibold mb-6">Analisis Finansial</h2>
              <ReportView transactions={filteredTransactions} />
            </div>
          </div>

          {/* Bento Item: Riwayat Transaksi */}
          <div className={cn("md:col-span-12", isReadOnly ? "lg:col-span-4" : "lg:col-span-12")}>
            <div className="glass-panel rounded-3xl p-6 h-[500px] overflow-hidden flex flex-col">
              <TransactionList 
                transactions={filteredTransactions} 
                currentMonth={currentMonth} 
                currentYear={currentYear} 
                onDelete={deleteTransaction} 
                isReadOnly={isReadOnly}
              />
            </div>
          </div>

        </div>

      </div>

      {/* DYNAMIC ISLAND NAVIGATION */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-[90%] md:w-auto">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel bg-black/60 rounded-full p-1.5 flex items-center justify-between md:justify-center gap-1 md:gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-white/10"
        >
          {/* Tahun Nav */}
          <div className="flex items-center px-2 shrink-0 border-r border-white/10">
            <button onClick={() => setCurrentYear(y => y - 1)} className="p-2 text-white/50 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-serif font-bold text-white w-10 text-center">{currentYear}</span>
            <button onClick={() => setCurrentYear(y => y + 1)} className="p-2 text-white/50 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Bulan Nav (Scrollable on mobile) */}
          <div className="flex overflow-x-auto no-scrollbar scroll-smooth items-center gap-1 px-2 snap-x max-w-[200px] md:max-w-full">
            {MONTH_NAMES.map((month, index) => {
              const isActive = currentMonth === index;
              return (
                <button
                  key={month}
                  onClick={() => setCurrentMonth(index)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 snap-center relative",
                    isActive ? "text-white" : "text-white/40 hover:text-white/80"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="island-active"
                      className="absolute inset-0 bg-white/15 rounded-full border border-white/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{month}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
      
    </main>
  );
}