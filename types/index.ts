export type Transaction = {
  id: string;
  transaction_date: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category: string;
};

export const CATEGORIES = [
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

export const QUICK_AMOUNTS = [5000, 10000, 15000, 20000, 25000, 50000, 100000];
export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
