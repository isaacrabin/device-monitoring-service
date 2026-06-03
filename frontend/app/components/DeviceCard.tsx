'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Device, DeviceStatus } from '@/app/types';
import { deviceApi } from '@/app/services/api';
import { 
  Wifi, 
  Power, 
  AlertTriangle, 
  ChevronRight,
  MapPin,
  Globe,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceCardProps {
  device: Device;
  onUpdate: (deviceId: string, newStatus: DeviceStatus) => void; // Changed to accept device update
}

export default function DeviceCard({ device, onUpdate }: DeviceCardProps) {
  const [updating, setUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [localDevice, setLocalDevice] = useState<Device>(device); // Add local state

  const getStatusConfig = () => {
    if (localDevice.is_stale) {
      return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', label: 'Stale' };
    }
    switch (localDevice.last_status) {
      case DeviceStatus.ONLINE:
        return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', label: 'Online' };
      case DeviceStatus.OFFLINE:
        return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', label: 'Offline' };
      case DeviceStatus.DEGRADED:
        return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', label: 'Degraded' };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', label: 'Unknown' };
    }
  };

  const getStatusIcon = () => {
    if (localDevice.is_stale) return <Power size={14} />;
    switch (localDevice.last_status) {
      case DeviceStatus.ONLINE: return <Wifi size={14} />;
      case DeviceStatus.OFFLINE: return <Power size={14} />;
      case DeviceStatus.DEGRADED: return <AlertTriangle size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const updateStatus = async (status: DeviceStatus) => {
    setUpdating(true);
    
    // Optimistic update - update UI immediately
    const oldStatus = localDevice.last_status;
    setLocalDevice({
      ...localDevice,
      last_status: status,
      last_report_timestamp: new Date().toISOString(),
      is_stale: false
    });
    
    try {
      await deviceApi.submitStatusReport(localDevice.id, status, `Status updated to ${status}`);
      // Notify parent to update stats without refetching all devices
      onUpdate(localDevice.id, status);
    } catch (error) {
      // Revert on error
      setLocalDevice({
        ...localDevice,
        last_status: oldStatus
      });
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
      setShowMenu(false);
    }
  };

  const statusConfig = getStatusConfig();
  const lastReportTime = localDevice.last_report_timestamp
    ? formatDistanceToNow(new Date(localDevice.last_report_timestamp), { addSuffix: true })
    : 'Never';

  return (
    <div className="group bg-dark-200 rounded-xl border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:shadow-xl overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <Link href={`/device/${localDevice.id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-200">
              {localDevice.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{localDevice.device_type}</p>
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} hover:scale-105`}
            >
              {getStatusIcon()}
              {statusConfig.label}
              {updating && <RefreshCw size={10} className="animate-spin" />}
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-dark-300 rounded-lg border border-gray-800 overflow-hidden shadow-xl z-10 animate-fade-in">
                {Object.values(DeviceStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    Set {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {localDevice.ip_address && (
            <div className="flex items-center gap-2 text-gray-500">
              <Globe size={14} className="text-primary" />
              <span>{localDevice.ip_address}</span>
            </div>
          )}
          
          {localDevice.location && (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin size={14} className="text-primary" />
              <span>{localDevice.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <Clock size={12} />
            <span>Last report: {lastReportTime}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex gap-3">
          <Link
            href={`/device/${localDevice.id}`}
            className="flex-1 text-center text-primary hover:text-primary-light text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
          >
            View Details
            <ChevronRight size={14} />
          </Link>
          
          <button
            onClick={() => updateStatus(DeviceStatus.ONLINE)}
            disabled={updating}
            className="flex-1 bg-dark-300 hover:bg-dark-100 text-gray-300 rounded-lg py-1.5 text-xs transition-all duration-200 disabled:opacity-50"
          >
            Mark Online
          </button>
        </div>
      </div>
    </div>
  );
}
