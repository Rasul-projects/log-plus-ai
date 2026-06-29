"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [service, setService] = useState("Authentication-API");
  const [logLevel, setLogLevel] = useState("CRITICAL");
  const [errorCode, setErrorCode] = useState("ERR_DB_CONN_TIMEOUT");
  const [rawMessage, setRawMessage] = useState("Connection timeout after 5000ms matching pool max lines.");
  const [aiDiagnosis, setAiDiagnosis] = useState("The database connection pool is exhausted. Recommendation: Scale up the read-replica connections or optimize execution runtime contexts.");

  // Fetch existing items when page loads
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Handle click action
  const handleCommit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, logLevel, errorCode, rawMessage, aiDiagnosis })
      });
      if (res.ok) {
        // Refresh items instantly
        await fetchLogs();
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans p-8">
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-400 flex items-center gap-2">
            📊 LogPulse AI Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">Production B2B App • Enterprise Threat Diagnostic Ingestion Hub via AWS DynamoDB</p>
        </div>
        <div className="flex gap-3">
          <span className="bg-[#1e1b4b] text-orange-400 border border-orange-500/30 text-xs px-3 py-1.5 rounded font-semibold">
            Database Engine: <span className="underline">DynamoDB Serverless</span>
          </span>
          <span className="bg-[#1e1b4b] text-blue-400 border border-blue-500/30 text-xs px-3 py-1.5 rounded font-semibold">
            Frontend Stack: <span className="underline">Vercel v0 Edge</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Interactive Panel */}
        <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-6 shadow-xl h-fit">
          <h2 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            &gt;_ Ingest Mock Production Incident
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Service Microarchitecture</label>
              <select value={service} onChange={(e) => setService(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-white">
                <option value="Authentication-API">Authentication-API</option>
                <option value="Payment-Gateway">Payment-Gateway</option>
                <option value="Invoicing-Engine">Invoicing-Engine</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Log Level</label>
                <select value={logLevel} onChange={(e) => setLogLevel(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-white">
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="WARNING">WARNING</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Error Code</label>
                <input type="text" value={errorCode} onChange={(e) => setErrorCode(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Raw Infrastructure Log String</label>
              <textarea value={rawMessage} onChange={(e) => setRawMessage(e.target.value)} rows={3} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Automated Diagnostic Generation</label>
              <textarea value={aiDiagnosis} onChange={(e) => setAiDiagnosis(e.target.value)} rows={3} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
            </div>

            <button 
              onClick={handleCommit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white font-bold py-3 px-4 rounded transition shadow-lg mt-2 cursor-pointer"
            >
              {loading ? "Streaming Payload..." : "Commit Trace Record to AWS Backend"}
            </button>
          </div>
        </div>

        {/* Right Stream Panel */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            🥞 Live High-Throughput Stream Ingestion
          </h2>

          {logs.length === 0 ? (
            <div className="bg-[#0b0f19] border border-dashed border-gray-800 rounded-xl p-12 text-center text-gray-500">
              No incidents captured in DB pipeline yet. Fire standard incidents using the ingestion engine tool.
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log: any, index: number) => (
                <div key={index} className="bg-[#0b0f19] border border-gray-800 rounded-xl p-5 shadow-md hover:border-gray-700 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-900/40 text-red-400 border border-red-500/20 text-xs font-bold px-2.5 py-0.5 rounded">
                        {log.logLevel}
                      </span>
                      <span className="text-sm font-semibold text-gray-300">{log.service}</span>
                      <span className="text-xs text-gray-500 font-mono">[{log.errorCode}]</span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="bg-[#111827] p-2.5 rounded text-xs font-mono text-gray-400 border border-gray-800/60 mb-3 break-all">
                    {log.rawMessage}
                  </div>
                  <div className="text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 p-3 rounded">
                    <strong className="text-emerald-300">💡 AI Diagnosis:</strong> {log.aiDiagnosis}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
