import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area 
} from 'recharts';
import { SentimentStats, VolumeData } from '../types';

interface StatsProps {
  stats: SentimentStats;
}

const COLORS = {
  positive: '#3b82f6', // Professional blue
  negative: '#f43f5e', // Rose
  neutral: '#cbd5e1'   // Slate
};

export const SentimentDonut = ({ stats }: StatsProps) => {
  const hasData = stats.total > 0;
  
  const data = hasData ? [
    { name: 'Positive', value: stats.positive, color: COLORS.positive },
    { name: 'Negative', value: stats.negative, color: COLORS.negative },
    { name: 'Neutral', value: stats.neutral, color: COLORS.neutral },
  ] : [
    { name: 'No Data', value: 1, color: '#f1f5f9' }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="h-[220px] w-full relative flex items-center justify-center">
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Awaiting Data</p>
            <p className="text-[9px] text-gray-300 italic transition-colors dark:text-gray-600">No signals analyzed</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={hasData ? 2 : 0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            {hasData && (
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {hasData && (
        <div className="flex gap-4 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{entry.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const VolumeAreaChart = ({ data }: { data: VolumeData[] }) => {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="mentions" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorMentions)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
