// components/History/History.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';
import { HistoryGrid } from './HistoryGrid';
import { useAppContext } from '../contexts/AppContext';
import { aiClient } from '../../utils/aiClient';

export function History({ showToast }) {
  const { user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await aiClient.getTestCases(user?.id);

      if (payload.success) {
        setHistory(payload.data || []);
      } else {
        throw new Error(payload.error || 'Failed to load history data');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showToast('Unable to load history: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredHistory = Array.isArray(history) ? history.filter(item => {
    const codeStr = String(item.code || item.requirement || '').toLowerCase();
    const moduleStr = String(item.module || '').toLowerCase();
    const typeStr = String(item.test_type || item.testType || '').toLowerCase();
    const searchStr = searchTerm.toLowerCase();

    return codeStr.includes(searchStr) || 
           moduleStr.includes(searchStr) || 
           typeStr.includes(searchStr);
  }) : [];

  const handleDeleteTestCase = async (id) => {
    try {
      const payload = await aiClient.deleteTestCase(id, user?.id);
      if (!payload.success) throw new Error(payload.error || 'could not delete test case');
      setHistory(prev => prev.filter(item => item.id !== id));
      showToast('Test set deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Unable to delete: ' + error.message);
    }
  };

  const ensureArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return [val];
    if (typeof val === 'object') {
      const values = Object.values(val);
      if (values.length > 0) return values;
    }
    return [];
  };

  const renderItem = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      return item.description || item.message || item.text || JSON.stringify(item);
    }
    return String(item);
  };



  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="syne text-2xl font-extrabold text-[#e8e8f0] mb-1">Activity Archive</h1>
          <p className="text-[13px] text-[#66667a]">Review all your AI-powered test generations.</p>
        </div>
        <div className="flex gap-2.5">
          <input
            type="text"
            className="ai-input w-[250px]"
            placeholder="Search archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="glass p-12 text-center">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-[#e8e8f0] font-semibold">Loading history ...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Column 1: Test Cases */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 bg-[#6c63ff]/20 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-[#a78bfa]" />
              </div>
              <h2 className="syne text-lg font-bold text-white">Test Case Generations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredHistory.length === 0 ? (
                <div className="glass p-10 text-center border-dashed col-span-full">
                  <p className="text-[#66667a] text-sm">No test case history found</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div key={item.id} className="glass p-5 cursor-pointer transition-all hover:border-[#6c63ff]/30" onClick={() => setSelectedCase(item)}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="badge badge-purple">Generated</span>
                      <span className="text-[10px] text-[#66667a]">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#e8e8f0] mb-1 truncate">
                      {String(item.requirement || item.code || 'Untitled').substring(0, 60)}...
                    </h3>
                    <p className="text-[11px] text-[#66667a] mb-4">
                      {item.module || 'General'} · {item.test_type || 'Mixed'}
                    </p>
                    <div className="flex gap-2">
                      <button className="btn-ghost flex-1 py-1.5 text-xs" onClick={(e) => { e.stopPropagation(); setSelectedCase(item); }}>View</button>
                      <button className="btn-ghost py-1.5 px-3 text-xs text-red-400 hover:bg-red-500/10 border-none" onClick={(e) => { e.stopPropagation(); handleDeleteTestCase(item.id); }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Test Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCase(null)}>
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setSelectedCase(null)}>✕</button>
            <h3 className="text-xl font-bold mb-1 text-white">Generation History</h3>
            <p className="text-xs text-gray-400 mb-6">Created at {new Date(selectedCase.created_at).toLocaleString()}</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <div className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider mb-2">Module / Type</div>
                <p className="text-white text-sm">{selectedCase.module || 'General'} · {selectedCase.test_type || 'N/A'}</p>
              </div>

              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <div className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider mb-2">Requirement / Code</div>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap mono">
                  {selectedCase.code || selectedCase.requirement || 'N/A'}
                </pre>
              </div>

              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <div className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider mb-2">Generated Test Cases</div>
                <div className="space-y-3 mt-3">
                  {ensureArray(selectedCase.generated_tests).map((tc, i) => (
                    <div key={i} className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.03]">
                      <div className="text-sm font-bold text-white mb-1">{renderItem(tc.description || tc.title || `Test Case ${i+1}`)}</div>
                      <div className="text-[11px] text-gray-400">Input: {renderItem(tc.input || 'N/A')}</div>
                      <div className="text-[11px] text-gray-400">Expected: {renderItem(tc.expectedOutput || 'N/A')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}