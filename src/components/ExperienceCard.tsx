import React from 'react';
import { Experience } from '@/types';

interface ExperienceCardProps {
  data: Experience;
  isLast: boolean;
  isEditing?: boolean;
  onUpdate?: (updated: Partial<Experience>) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  data,
  isLast,
  isEditing,
  onUpdate
}) => {
  return (
    <div className={`group print-break-inside-avoid ${!isLast ? 'border-b border-gray-200 pb-8 mb-8' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-3">
        <div className="flex flex-col flex-1">
          {isEditing ? (
            <>
              <input
                className="text-lg font-serif font-bold text-dark border-b border-blue-100 outline-none focus:border-blue-400 mb-1"
                value={data.role}
                onChange={(e) => onUpdate?.({ role: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  className="text-xs font-bold text-gray-600 uppercase tracking-wide border-b border-blue-100 outline-none focus:border-blue-400 flex-1"
                  value={data.company}
                  onChange={(e) => onUpdate?.({ company: e.target.value })}
                />
                <input
                  className="text-xs font-bold text-gray-600 uppercase tracking-wide border-b border-blue-100 outline-none focus:border-blue-400 flex-1"
                  value={data.location}
                  onChange={(e) => onUpdate?.({ location: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-serif font-bold text-dark group-hover:text-black transition-colors">
                {data.role}
              </h3>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide mt-1">
                {data.company} <span className="font-normal text-gray-400 mx-1">|</span> {data.location}
              </span>
            </>
          )}
        </div>
        {isEditing ? (
          <input
            className="font-mono text-[11px] text-gray-500 bg-gray-50 px-2 py-1 border border-blue-100 rounded mt-2 sm:mt-0 shrink-0 outline-none focus:border-blue-400"
            value={data.period}
            onChange={(e) => onUpdate?.({ period: e.target.value })}
          />
        ) : (
          <span className="font-mono text-[11px] text-gray-500 bg-gray-50 px-2 py-1 border border-gray-100 rounded mt-2 sm:mt-0 shrink-0">
            {data.period}
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-2.5">
        {data.highlights.map((point, idx) => (
          <li key={idx} className="text-sm text-gray-700 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400 flex flex-col group/highlight">
            {isEditing ? (
              <div className="flex items-start gap-2 w-full">
                <textarea
                  className="flex-1 bg-gray-50 border-b border-blue-100 outline-none focus:border-blue-400 text-sm py-1"
                  value={point}
                  rows={2}
                  onChange={(e) => {
                    const newHighlights = [...data.highlights];
                    newHighlights[idx] = e.target.value;
                    onUpdate?.({ highlights: newHighlights });
                  }}
                />
                <button
                  onClick={() => {
                    const newHighlights = data.highlights.filter((_, i) => i !== idx);
                    onUpdate?.({ highlights: newHighlights });
                  }}
                  className="text-gray-400 hover:text-red-500 pt-1 px-1 transition-colors"
                  title="Remove bullet point"
                >
                  ×
                </button>
              </div>
            ) : (
              point
            )}
          </li>
        ))}


        {isEditing && (
          <button
            onClick={() => onUpdate?.({ highlights: [...data.highlights, ""] })}
            className="text-xs text-blue-600 hover:underline mt-2 flex items-center gap-1"
          >
            + Add Bullet Point
          </button>
        )}
      </ul>
    </div>
  );
};