'use client';

import { useState } from 'react';
import { DeviceType } from '@/app/types';
import { deviceApi } from '@/app/services/api';

interface RegisterFormData {
  name: string;
  device_type: DeviceType;
  hostname: string;
  ip_address: string;
  location: string;
}

interface AddDeviceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDeviceModal({ onClose, onSuccess }: AddDeviceModalProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    device_type: DeviceType.ROUTER,
    hostname: '',
    ip_address: '',
    location: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ipError, setIpError] = useState('');

  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, ip_address: val });
    if (val && !ipRegex.test(val)) {
      setIpError('Invalid IP — each octet must be 0–255');
    } else {
      setIpError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ip_address && !ipRegex.test(formData.ip_address)) {
      setIpError('Invalid IP — each octet must be 0–255');
      return;
    }
    setSubmitting(true);
    try {
      await deviceApi.registerDevice(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to register device:', error);
      alert('Failed to register device');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-dark-200 rounded-2xl p-8 max-w-md w-full border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 gradient-text">Register New Device</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Device Name</label>
            <input
              type="text"
              required
              className="input-primary"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Core-Router-01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Device Type</label>
            <select
              className="input-primary"
              value={formData.device_type}
              onChange={(e) => setFormData({ ...formData, device_type: e.target.value as DeviceType })}
            >
              <option value={DeviceType.ROUTER}>Router</option>
              <option value={DeviceType.SWITCH}>Switch</option>
              <option value={DeviceType.FIREWALL}>Firewall</option>
              <option value={DeviceType.CPE}>CPE</option>
              <option value={DeviceType.ACCESS_POINT}>Access Point</option>
              <option value={DeviceType.ONT}>ONT</option>
              <option value={DeviceType.UNKNOWN}>Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hostname</label>
            <input
              type="text"
              className="input-primary"
              value={formData.hostname}
              onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
              placeholder="router-01.local"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">IP Address</label>
            <input
              type="text"
              className={`input-primary ${ipError ? 'border-red-500 focus:border-red-500' : ''}`}
              value={formData.ip_address}
              onChange={handleIpChange}
              placeholder="192.168.1.1"
            />
            {ipError && (
              <p className="text-red-400 text-xs mt-1">{ipError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              className="input-primary"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Data Center A"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || !!ipError}
              className="btn-primary flex-1"
            >
              {submitting ? 'Registering...' : 'Register Device'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
