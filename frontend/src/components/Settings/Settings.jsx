// components/Settings/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export function Settings() {
  const { user } = useAppContext();
  const [settings, setSettings] = useState({
    defaultTestType: 'Functional',
    defaultCoverage: 'Comprehensive',
    autoAnalysis: true,
    notificationEmails: true
  });
  const [message, setMessage] = useState('');
  const [issue, setIssue] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('qaSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Unable to read saved settings', err);
      setIssue('Failed to load previous settings, using defaults.');
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('qaSettings', JSON.stringify(settings));
      setMessage('Settings saved successfully');
      setIssue('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
      setIssue('Unable to save settings. Make sure your browser allows local storage.');
    }
  };

  if (!user) {
    return (
      <div className="p-7">
        <h1 className="syne text-[22px] font-extrabold text-[#e8e8f0] mb-1">Settings</h1>
        <p className="text-sm text-[#66667a]">You must be logged in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="p-7">
      <h1 className="syne text-[22px] font-extrabold text-[#e8e8f0] mb-1.5">Settings</h1>
      <p className="text-[13px] text-[#66667a] mb-6">Configure your AI test generator preferences.</p>

      <div className="glass p-8">
        <div className="flex items-center gap-3 mb-5">
          <SettingsIcon size={30} className="text-[#f59e0b]" />
          <h2 className="font-bold text-white">Generator Settings</h2>
        </div>

        {issue && <p className="text-yellow-300 text-sm mb-4">{issue}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#999]">Default Test Type</label>
            <select
              value={settings.defaultTestType}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultTestType: e.target.value }))}
              className="ai-select w-full"
            >
              <option>Functional</option>
              <option>Regression</option>
              <option>Performance</option>
              <option>Security</option>
              <option>Integration</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#999]">Default Coverage</label>
            <select
              value={settings.defaultCoverage}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultCoverage: e.target.value }))}
              className="ai-select w-full"
            >
              <option>Standard</option>
              <option>Comprehensive</option>
              <option>Edge Cases</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 my-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.autoAnalysis}
              onChange={(e) => setSettings((prev) => ({ ...prev, autoAnalysis: e.target.checked }))}
            />
            Auto-run analysis after test generation
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.notificationEmails}
              onChange={(e) => setSettings((prev) => ({ ...prev, notificationEmails: e.target.checked }))}
            />
            Email notifications for new results
          </label>
        </div>

        <button className="btn-primary py-2 px-4" onClick={handleSave}>Save Settings</button>

        {message && <p className="text-green-400 text-sm mt-3">{message}</p>}
      </div>
    </div>
  );
}