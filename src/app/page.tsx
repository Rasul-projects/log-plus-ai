"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Terminal, ShieldAlert, CheckCircle, Cpu, Layers } from "lucide-react";

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form submission state hooks
  const [service, setService] = useState("Authentication-API");
  const [logLevel, setLogLevel] = useState("CRITICAL");
  const [errorCode, setErrorCode] = useState("ERR_DB_CONN_TIMEOUT");
  const [rawMessage, setRawMessage] = useState("Connection timeout after 5000ms matching pool max lines.");
  const [aiDiagnosis, setAiDiagnosis] = useState("The database connection pool is exhausted. Recommendation: Scale up the read-replica connections or optimize execution runtime contexts.");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
      }
    } catch (err) {
      console.error("Failed to load records from DynamoDB", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, logLevel, errorCode, rawMessage, aiDiagnosis }),
      });
      if (response.ok) {
        fetchLogs();
        setRawMessage("");
        setAiDiagnosis("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header Panel */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Cpu className="text-indigo-500 w-8 h-8" /> LogPulse AI Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Production B2B App • Enterprise Threat Diagnostic Ingestion Hub via AWS DynamoDB
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs">
            <span className="text-slate-400">Database Engine:</span> <strong className="text-amber-500">DynamoDB Serverless</strong>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs">
            <span className="text-slate-400">Frontend Stack:</span> <strong className="text-cyan-400">Vercel v0 Edge</strong>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Interactive Entry Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Terminal className="text-emerald-500 w-5 h-5" /> Ingest Mock Production Incident
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Target Service Microarchitecture</label>
              <select value={service} onChange={(e) => setService(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                <option value="Authentication-API">Authentication-API</option>
                <option value="Payment-Gateway">Payment-Gateway</option>
                <option value="Data-Processing-Node">Data-Processing-Node</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Log Level</label>
                <select value={logLevel} onChange={(e) => setLogLevel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="ERROR">ERROR</option>
                  <option value="WARNING">WARNING</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Error Code</label>
                <input type="text" value={errorCode} onChange={(e) => setErrorCode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Raw Infrastructure Log String</label>
              <textarea rows={3} value={rawMessage} onChange={(e) => setRawMessage(e.target.value)} placeholder="Paste machine logs here..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" required></textarea>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">AI Automated Diagnostic Generation</label>
              <textarea rows={3} value={aiDiagnosis} onChange={(e) => setAiDiagnosis(e.target.value)} placeholder="Auto remediation advice..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" required></textarea>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition text-sm shadow-md shadow-indigo-900/20">
              Commit Trace Record to AWS Backend
            </button>
          </form>
        </div>

        {/* Right Active Incident Feed Display Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-indigo-500 w-5 h-5" /> Live High-Throughput Stream Ingestion
          </h2>

          {loading ? (
            <div className="text-sm text-slate-500 animate-pulse">Syncing system state loops with active AWS DynamoDB Tables...</div>
          ) : logs.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 p-8 rounded-xl text-center text-slate-500 text-sm">
              No incidents captured in DB pipeline yet. Fire standard incidents using the ingestion engine tool.
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${log.logLevel === "CRITICAL" ? "bg-red-500" : log.logLevel === "ERROR" ? "bg-amber-500" : "bg-yellow-400"}`} />
                  
                  <div className="flex justify-between items-start mb-3 pl-2">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <h3 className="text-md font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                        {log.service} <span className="text-xs font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 rounded">{log.errorCode}</span>
                      </h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${log.logLevel === "CRITICAL" ? "bg-red-950 text-red-400 border border-red-900" : "bg-amber-950 text-amber-400 border border-amber-900"}`}>
                      {log.logLevel}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 mb-3 font-mono text-xs text-red-300 max-h-20 overflow-y-auto">
                    {log.rawMessage}
                  </div>

                  <div className="bg-indigo-950/40 border border-indigo-900/60 p-3 rounded-lg flex items-start gap-2.5">
                    <ShieldAlert className="text-indigo-400 w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">Automated Diagnostic Resolution</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{log.aiDiagnosis}</p>
                    </div>
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
