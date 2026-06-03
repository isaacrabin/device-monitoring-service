'use client';

import { DeviceStatus } from '@/app/types';
import { Wifi, Power, AlertTriangle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: DeviceStatus;
  isStale?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, isStale = false, size = 'md' }: StatusBadgeProps) {

  const getConfig = () => {
    if (isStale) {
      return {
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20',
        icon: Clock,
        label: 'Stale',
      };
    }
    
    switch (status) {
      case DeviceStatus.ONLINE:
        return {
          color: 'text-green-400',
          bg: 'bg-green-400/10',
          border: 'border-green-400/20',
          icon: Wifi,
          label: 'Online',
        };
      case DeviceStatus.OFFLINE:
        return {
          color: 'text-red-400',
          bg: 'bg-red-400/10',
          border: 'border-red-400/20',
          icon: Power,
          label: 'Offline',
        };
      case DeviceStatus.DEGRADED:
        return {
          color: 'text-yellow-400',
          bg: 'bg-yellow-400/10',
          border: 'border-yellow-400/20',
          icon: AlertTriangle,
          label: 'Degraded',
        };
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-400/10',
          border: 'border-gray-400/20',
          icon: AlertTriangle,
          label: 'Unknown',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  return (
    <div className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.color} border ${config.border} ${sizeClasses[size]} transition-all duration-200`}>
      <Icon size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      <span>{config.label}</span>
    </div>
  );
}
