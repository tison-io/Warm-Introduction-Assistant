'use client';
import { Investor } from "../../types/investor";
import { Mail, Tag as TagIcon } from "lucide-react";

interface Props {
  investor: Investor;
  isSelected?: boolean;
}

export default function InvestorCard({ investor, isSelected }: Props) {
  return (
    <div className={`p-4 rounded-2xl border transition-all cursor-pointer bg-[#11141b] group
      ${isSelected 
        ? 'border-blue-500 ring-1 ring-blue-500/50 bg-blue-500/5' 
        : 'border-gray-800/50 hover:border-gray-700 hover:bg-white/5'
      }`}>
      <div className="flex justify-between items-start gap-4">
        <div className="grow">
          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
            {investor.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <Mail size={12} />
            <span className="text-xs truncate">{investor.email}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-900 px-2 py-1 rounded-md border border-gray-800">
            {investor.preferred_intro_format}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {investor.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {tag}
          </span>
        ))}
        {investor.tags.length > 4 && (
            <span className="text-[9px] text-gray-600">+{investor.tags.length - 4}</span>
        )}
      </div>
    </div>
  );
}