'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Tipe Data
type Transaction = {
  id: string;
  transaction_date: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category: string;
};

// Daftar Kategori beserta Icon & Tipenya
const CATEGORIES = [
  { name: 'Makan', icon: '🍜', type: 'expense' },
  { name: 'Transportasi', icon: '🚌', type: 'expense' },
  { name: 'Hiburan', icon: '🎬', type: 'expense' },
  { name: 'Belanja', icon: '🛍️', type: 'expense' },
  { name: 'Kuliah', icon: '📚', type: 'expense' },
  { name: 'Kesehatan', icon: '💊', type: 'expense' },
  { name: 'Lain-lain', icon: '⚙️', type: 'expense' },
  { name: 'Uang Saku', icon: '💰', type: 'income' },
  { name: 'Beasiswa', icon: '🎓', type: 'income' },
  { name: 'Part-time', icon: '💼', type: 'income' },
  { name: 'Pemasukan Lain', icon: '↗️', type: 'income' },
];

const QUICK_AMOUNTS = [5000, 10000, 15000, 20000, 25000, 50000, 100000];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'Catat' | 'Riwayat' | 'Laporan'>('Catat');
  
  // State Filter Bulan & Tahun (Default: Bulan & Tahun saat ini)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // State Form
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makan');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTransactions();
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

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return alert('Mohon isi jumlah dan keterangan!');
    setIsSubmitting(true);

    const selectedCategory = CATEGORIES.find(c => c.name === category);
    const type = selectedCategory?.type || 'expense';

    const { error } = await supabase
      .from('transactions')
      .insert([{ 
        amount: Number(amount), 
        description, 
        type, 
        category,
        transaction_date: transactionDate 
      }]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan transaksi');
    } else {
      setAmount('');
      setDescription('');
      fetchTransactions();
      alert('Berhasil disimpan!');
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

  // Kalkulasi Saldo (Berdasarkan transaksi yang sudah difilter per bulan)
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const getCategoryIcon = (catName: string) => CATEGORIES.find(c => c.name === catName)?.icon || '📌';

  return (
    // Tambahkan pb-24 agar konten tidak tertutup oleh bar navigasi bawah
    <main className="min-h-screen bg-[#0A101D] text-slate-200 font-sans p-4 md:p-8 pb-24 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            📒 Buku Kas Mahasiswa
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-4 py-1 rounded-full border border-slate-700">
            <span>Bulan {MONTH_NAMES[currentMonth]} {currentYear}</span>
            <span>•</span>
            <span>{filteredTransactions.length} transaksi</span>
          </div>
        </header>

        {/* Ringkasan Saldo */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#151E2F] p-4 rounded-xl border border-slate-700/50">
            <h2 className="text-xs text-slate-400 uppercase font-semibold mb-1">↑ Pemasukan</h2>
            <p className="text-emerald-400 font-bold text-lg">Rp {totalIncome.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-[#151E2F] p-4 rounded-xl border border-slate-700/50">
            <h2 className="text-xs text-slate-400 uppercase font-semibold mb-1">↓ Pengeluaran</h2>
            <p className="text-rose-400 font-bold text-lg">Rp {totalExpense.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-[#151E2F] p-4 rounded-xl border border-slate-700/50">
            <h2 className="text-xs text-slate-400 uppercase font-semibold mb-1">= Saldo</h2>
            <p className={`font-bold text-lg ${balance < 0 ? 'text-rose-500' : 'text-white'}`}>
              Rp {balance.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Tabs Utama */}
        <div className="flex bg-[#151E2F] rounded-lg p-1 border border-slate-700/50">
          {['Catat', 'Riwayat', 'Laporan'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'Catat' ? '📝' : tab === 'Riwayat' ? '🧾' : '📊'} {tab}
            </button>
          ))}
        </div>

        {/* --- TAB: CATAT (FORM TRANSAKSI) --- */}
        {activeTab === 'Catat' && (
          <div className="bg-[#151E2F] rounded-xl border border-slate-700/50 p-6 space-y-6">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <span>+</span> Transaksi Baru
            </h2>
            <form onSubmit={addTransaction} className="space-y-5">
              {/* Form Input sama seperti sebelumnya... */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Tanggal</label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full bg-[#0A101D] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Keterangan</label>
                <input
                  type="text"
                  placeholder="contoh: Makan siang di warteg, Nonton Avengers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0A101D] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        category === cat.name
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                          : 'bg-[#0A101D] border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Jumlah (Rp)</label>
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#0A101D] border border-slate-700 rounded-lg p-3 pl-12 text-white font-bold focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-medium border border-slate-700 transition"
                    >
                      {amt >= 1000 ? `${amt / 1000}rb` : amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-4"
              >
                {isSubmitting ? 'Menyimpan...' : '✅ Simpan Transaksi'}
              </button>
            </form>
          </div>
        )}

        {/* --- TAB: RIWAYAT / DAFTAR TRANSAKSI --- */}
        {(activeTab === 'Riwayat' || activeTab === 'Catat') && (
          <div className="space-y-3 mt-8">
            <h3 className="text-xs text-slate-400 uppercase font-semibold mb-4 px-1">
              Transaksi {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-slate-500 py-8 bg-[#151E2F] rounded-xl border border-slate-800">
                Belum ada transaksi di bulan ini.
              </p>
            ) : (
              filteredTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-[#151E2F] rounded-xl border border-slate-800 hover:border-slate-700 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0A101D] border border-slate-700 flex items-center justify-center text-lg">
                      {getCategoryIcon(t.category)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{t.description}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(t.transaction_date).toLocaleDateString('id-ID')} • {t.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                    </p>
                    <div className="flex gap-2 justify-end mt-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => deleteTransaction(t.id)} className="text-xs text-rose-500 hover:text-rose-400">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* --- SPREADSHEET BOTTOM TABS --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A101D] border-t border-slate-800 flex shadow-[0_-4px_10px_rgba(0,0,0,0.5)] z-50">
        
        {/* Navigasi Tahun */}
        <div className="flex items-center bg-[#151E2F] border-r border-slate-800 shrink-0">
          <button 
            onClick={() => setCurrentYear(y => y - 1)} 
            className="px-3 py-3 text-slate-400 hover:text-white transition"
          >
            ◀
          </button>
          <span className="text-sm font-bold text-white px-1">{currentYear}</span>
          <button 
            onClick={() => setCurrentYear(y => y + 1)} 
            className="px-3 py-3 text-slate-400 hover:text-white transition"
          >
            ▶
          </button>
        </div>

        {/* Tab Bulan */}
        <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {MONTH_NAMES.map((month, index) => (
            <button
              key={month}
              onClick={() => setCurrentMonth(index)}
              className={`min-w-[80px] py-3 text-sm font-medium border-r border-slate-800 transition-colors ${
                currentMonth === index
                  ? 'bg-indigo-600/10 text-indigo-400 border-t-2 border-t-indigo-500 bg-gradient-to-t from-transparent to-indigo-900/20'
                  : 'bg-[#0A101D] text-slate-500 hover:bg-[#151E2F] hover:text-slate-300 border-t-2 border-t-transparent'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
      
    </main>
  );
}