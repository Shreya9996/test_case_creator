import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TestCaseCard({ testCase }) {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'badge-pink';
      case 'high': return 'badge-orange';
      default: return 'badge-purple';
    }
  };

  const renderValue = (val) => {
    if (!val) return 'N/A';
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-200 hover:border-[#6c63ff]/40">
      
      {/* Header */}
      <div 
        className="flex items-start justify-between cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#a78bfa]">
              TC-{testCase.id}
            </span>
            <span className={`badge ${getSeverityColor(testCase.severity)}`}>
              {renderValue(testCase.severity)}
            </span>
            <span className="badge badge-green">
              {renderValue(testCase.type)}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[#e8e8f0] mb-1">
            {renderValue(testCase.title)}
          </h3>

          <p className="text-xs text-[#88889a]">
            {renderValue(testCase.description)}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs text-[#66667a]">
            {renderValue(testCase.coverage)}
          </span>
          {expanded 
            ? <ChevronUp size={16} className="text-[#88889a]" /> 
            : <ChevronDown size={16} className="text-[#88889a]" />
          }
        </div>
      </div>

      {/* ✅ FIX: Conditional rendering */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs font-semibold text-[#a78bfa] mb-2">
            Test Steps:
          </div>

          <div className="space-y-2">
            {testCase.steps.map((step, idx) => {
              const action = typeof step.action === 'object'
                ? JSON.stringify(step.action, null, 2)
                : String(step.action || step.input || 'N/A');

              const expected = typeof step.expected === 'object'
                ? JSON.stringify(step.expected, null, 2)
                : String(step.expected || step.expectedOutput || 'N/A');

              return (
                <div key={idx} className="flex gap-2 text-xs">
                  <span className="text-[#a78bfa] font-medium">
                    {step.step}.
                  </span>

                  <div className="flex-1">
                    <div className="text-[#e8e8f0] whitespace-pre-wrap">
                      {renderValue(action)}
                    </div>
                    <div className="text-[#88889a] text-[11px] whitespace-pre-wrap">
                      Expected: {renderValue(expected)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}