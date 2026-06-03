import { Transaction, CATEGORIES } from '../types';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  CartesianGrid
} from 'recharts';
import { cn } from '../lib/utils';

type ReportViewProps = {
  transactions: Transaction[];
};

export default function ReportView({ transactions }: ReportViewProps) {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categoryData = CATEGORIES
    .filter(c => c.type === 'expense')
    .map(c => {
      const total = expenses
        .filter(e => e.category === c.name)
        .reduce((sum, curr) => sum + curr.amount, 0);
      return { name: c.name, value: total, icon: c.icon };
    })
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, curr) => sum + curr.amount, 0);
  const totalExpense = expenses.reduce((sum, curr) => sum + curr.amount, 0);
  const overviewData = [
    { name: 'Pemasukan', amount: totalIncome, fill: '#34d399' }, 
    { name: 'Pengeluaran', amount: totalExpense, fill: '#fb7185' } 
  ];

  const COLORS = ['#818cf8', '#6366f1', '#a78bfa', '#c084fc', '#e879f9', '#2dd4bf', '#38bdf8', '#fbbf24'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 border-dashed min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <span className="text-2xl opacity-50 grayscale">📊</span>
          </div>
          <p className="text-white/60 font-medium text-sm">Data belum cukup</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 flex-1">
          {/* Pie Chart: Kategori Pengeluaran */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-5 flex flex-col justify-center">
            <h3 className="text-white/80 font-semibold mb-6 flex items-center gap-2 text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">
                🍕
              </span>
              Distribusi Pengeluaran
            </h3>
            
            {expenses.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-10">Belum ada pengeluaran bulan ini.</p>
            ) : (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                      contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {expenses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {categoryData.slice(0, 4).map((cat, idx) => (
                  <div key={cat.name} className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[10px] text-white/60 truncate max-w-[80px]" title={cat.name}>
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar Chart: Pemasukan vs Pengeluaran */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-5 flex flex-col justify-center">
            <h3 className="text-white/80 font-semibold mb-6 flex items-center gap-2 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">
                ⚖️
              </span>
              Cash Flow
            </h3>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overviewData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                    contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {overviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
