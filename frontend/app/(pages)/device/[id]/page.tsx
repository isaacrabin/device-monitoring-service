'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { deviceApi } from '@/app/services/api';
import { DeviceDetail, DeviceStatus } from '@/app/types';
import StatusBadge from '@/app/components/StatusBadge';
import { 
  ArrowLeft, 
  RefreshCw,
  MapPin,
  Globe,
  Calendar,
  Clock,
  Server,
  Activity
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatDate } from '@/app/utils/formatDate';

export default function DeviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [device, setDevice] = useState<DeviceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const STATUS_LABELS: Record<number, string> = {
    3: 'ONLINE',
    2: 'DEGRADED',
    1: 'OFFLINE',
  };

  const fetchDeviceDetails = async () => {
    try {
      const data = await deviceApi.getDeviceDetails(id as string);
      setDevice(data);
      console.log('Fetched device details:', data);
    } catch (error) {
      console.error('Failed to fetch device details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
    const interval = setInterval(fetchDeviceDetails, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const getChartData = () => {
    if (!device) return [];
    return device?.recent_reports.slice().reverse().map(report => ({
      time: format(new Date(report.reported_at), 'HH:mm'),
      status: report.status === DeviceStatus.ONLINE ? 3 : report.status === DeviceStatus.DEGRADED ? 2 : 1,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-gray-500">Loading device details...</p>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Device Not Found</h2>
          <button onClick={() => router.back()} className="text-primary hover:text-primary-light mt-4">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          
          <button
            onClick={() => {
              setRefreshing(true);
              fetchDeviceDetails();
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Device Info */}
        <div className="bg-dark-200 rounded-2xl p-8 mb-8 border border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{device?.device.name}</h1>
                <StatusBadge status={device?.device.last_status} isStale={device?.device.is_stale} size="lg" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <Server size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Device Type</p>
                    <p className="font-medium">{device?.device.device_type}</p>
                  </div>
                </div>
                
                {device?.device.ip_address && (
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">IP Address</p>
                      <p className="font-medium">{device?.device.ip_address}</p>
                    </div>
                  </div>
                )}
                
                {device.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{device?.device.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Registered</p>
                    <p className="font-medium">{formatDate(device?.device.registered_at, 'PPP')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline Chart */}
        <div className="bg-dark-200 rounded-2xl p-6 mb-8 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            Status Timeline (Last 20 Reports)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;

                  const statusValue = payload[0].value as number;

                  return (
                    <div
                      style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #ff6900',
                        borderRadius: '8px',
                        padding: '10px',
                      }}
                    >
                      <p className="text-sm text-gray-300">
                        <strong>Time:</strong> {label}
                      </p>

                      <p className="text-sm text-gray-300">
                        <strong>Status:</strong> {STATUS_LABELS[statusValue] ?? 'UNKNOWN'}
                      </p>
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="status" stroke="#ff6900" strokeWidth={2} dot={{ fill: '#ff6900' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status History Table */}
        <div className="bg-dark-200 rounded-2xl overflow-hidden border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Recent Status Reports
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {device.recent_reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm">
                      {formatDate(report.reported_at, 'PPpp')}
                      <span className="text-xs text-gray-500 block">
                        {report.reported_at && !isNaN(new Date(report.reported_at).getTime())
                          ? formatDistanceToNow(new Date(report.reported_at), { addSuffix: true })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={report.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {report.diagnostic_message || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
