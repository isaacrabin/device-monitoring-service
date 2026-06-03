'use client';

import { useEffect, useState } from 'react';
import { deviceApi } from '@/app/services/api';
import { Device, DeviceStatus, DeviceType } from '@/app/types';
import DeviceCard from '@/app/components/DeviceCard';
import { 
  Network, 
  Wifi, 
  Power, 
  AlertTriangle, 
  Plus, 
  RefreshCw,
  Zap,
  LogOut,
  User
} from 'lucide-react';
import AddDeviceModal from '@/app/components/AddDeviceModal';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  
  const { user, logout } = useAuth();
  const router = useRouter();

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await deviceApi.getAllDevices();
      setDevices(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.last_status === DeviceStatus.ONLINE && !d.is_stale).length,
    offline: devices.filter(d => d.last_status === DeviceStatus.OFFLINE || d.is_stale).length,
    degraded: devices.filter(d => d.last_status === DeviceStatus.DEGRADED && !d.is_stale).length,
  };

  const statCards = [
    { title: 'Total Devices', value: stats.total, icon: Network, color: 'text-primary' },
    { title: 'Online', value: stats.online, icon: Wifi, color: 'text-green-400' },
    { title: 'Offline', value: stats.offline, icon: Power, color: 'text-red-400' },
    { title: 'Degraded', value: stats.degraded, icon: AlertTriangle, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-100 via-dark to-dark">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Logout Button - Top Right */}
          <div className="absolute top-6 right-6 z-10">
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="flex items-center gap-2 bg-dark-200/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700">
                <User size={16} className="text-primary" />
                <span className="text-sm text-gray-300">{user?.username || 'Admin'}</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6 border border-primary/20">
              <Zap size={16} className="text-primary" />
              <span className="text-sm text-primary">Real-time Monitoring</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Network Device</span>
              <br />
              <span className="text-white">Monitor</span>
            </h1>
            
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Monitor your network infrastructure in real-time with advanced analytics and instant alerts
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {statCards.map((stat, index) => (
              <div
                key={stat.title}
                className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon size={32} className={`${stat.color} mx-auto mb-3`} />
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Network Devices</h2>
            <p className="text-gray-500">
              Managing {stats.total} device{stats.total !== 1 ? 's' : ''} across your network
            </p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={fetchDevices} className="btn-secondary flex items-center gap-2">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={() => setShowRegisterModal(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              Register Device
            </button>
          </div>
        </div>

        <p className="text-right text-xs text-gray-600 mb-4">
          Last updated: {mounted ? lastUpdated.toLocaleTimeString() : '—'}
        </p>

        {loading && devices.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <p className="text-gray-500">Loading devices...</p>
            </div>
          </div>
        ) : devices.length === 0 ? (
          <div className="bg-dark-200 rounded-2xl p-12 text-center border border-gray-800">
            <Network size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Devices Registered</h3>
            <p className="text-gray-500 mb-6">Get started by registering your first network device</p>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Register Device
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} onUpdate={fetchDevices} />
            ))}
          </div>
        )}
      </div>

      {showRegisterModal && (
        <AddDeviceModal onClose={() => setShowRegisterModal(false)} onSuccess={fetchDevices} />
      )}
    </div>
  );
}
