
import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import { SystemHealth, SystemMetrics } from '../types';

const AdminDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [healthData, metricsData] = await Promise.all([
      adminService.getSystemHealth(),
      adminService.getMetrics()
    ]);
    setHealth(healthData);
    setMetrics(metricsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-24">Aggregating distributed system logs...</div>;

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
          <p className="mt-2 text-lg text-gray-500">Aggregated real-time metrics across all service clusters.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Reservations</p>
            <p className="text-4xl font-black text-blue-600">{metrics?.totalReservations}</p>
            <div className="mt-4 flex items-center text-green-600 text-xs font-bold">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
              +12% vs last hour
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Revenue</p>
            <p className="text-4xl font-black text-indigo-600">${metrics?.revenue.toLocaleString()}</p>
            <p className="mt-4 text-[10px] text-gray-400 font-mono">Synced from Payment-Svc</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Sessions</p>
            <p className="text-4xl font-black text-purple-600">{metrics?.activeUsers}</p>
            <p className="mt-4 text-[10px] text-gray-400 font-mono">Distributed Redis state</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Catalog Items</p>
            <p className="text-4xl font-black text-green-600">{metrics?.totalEvents}</p>
            <p className="mt-4 text-[10px] text-gray-400 font-mono">Managed by Event-Svc</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Service Mesh Health</h2>
            <p className="text-sm text-gray-500">Global status of independent microservice deployments.</p>
          </div>
          <button 
            onClick={() => {setLoading(true); fetchData();}}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh Heartbeats
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Unit</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Latency</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {health.map((svc) => (
                <tr key={svc.serviceName} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900 tracking-tight">{svc.serviceName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-black rounded-full uppercase tracking-widest border ${
                      svc.status === 'UP' ? 'bg-green-100 text-green-800 border-green-200' : 
                      svc.status === 'DEGRADED' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {svc.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                       <span className={`text-sm font-mono ${svc.latency > 200 ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                         {svc.latency}ms
                       </span>
                       <div className="ml-2 w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                         <div className={`h-full rounded-full ${svc.latency > 200 ? 'bg-orange-500' : 'bg-blue-400'}`} style={{width: `${Math.min(100, (svc.latency / 500) * 100)}%`}}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-mono text-gray-400">
                    {svc.version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-black mb-4 tracking-tight">Distributed System Maintenance</h3>
          <p className="text-indigo-200 mb-8 leading-relaxed font-light">
            All services are currently scaling independently. The Event Bus is handling approximately 4.2k events/second. Kafka partitions are rebalancing automatically.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl hover:bg-indigo-50 transition shadow-lg">Manual Rebalance</button>
            <button className="px-6 py-3 bg-indigo-700/50 text-indigo-100 font-bold rounded-2xl hover:bg-indigo-700 transition border border-indigo-600">View Node Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
