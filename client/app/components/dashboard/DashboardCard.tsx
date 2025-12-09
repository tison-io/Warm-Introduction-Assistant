// components/DashboardSummaryCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardSummaryCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

const DashboardCard: React.FC<DashboardSummaryCardProps> = ({ title, count, icon: Icon, iconColor, bgColor }) => {
  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-xl border-b-4 ${bgColor} transition duration-300 hover:bg-gray-200`}>
      <div>
        <p className="text-xl text-black mb-1">{title}</p>
        <p className="text-4xl font-bold text-black">{count}</p>
      </div>
      <div className={`p-3 rounded-full ${iconColor} bg-white/10`}>
        <Icon className="h-6 w-6 text-black" />
      </div>
    </div>
  );
};

export default DashboardCard;