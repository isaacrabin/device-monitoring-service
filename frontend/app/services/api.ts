import axios from 'axios';
import { Device, DeviceDetail, StatusReport, ApiResponse, DeviceStatus } from '@/app/types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Device APIs
export const deviceApi = {
  registerDevice: async (device: Partial<Device>): Promise<Device> => {
    const response = await api.post<ApiResponse<Device>>('/devices', device);
    return response.data.data;
  },

  getAllDevices: async (): Promise<Device[]> => {
    const response = await api.get<ApiResponse<Device[]>>('/devices');
    return response.data.data;
  },

  getDeviceDetails: async (id: string): Promise<DeviceDetail> => {
    const response = await api.get<ApiResponse<DeviceDetail>>(`/devices/${id}`);
    return response.data.data;
  },

  submitStatusReport: async (deviceId: string, status: DeviceStatus, message?: string): Promise<StatusReport> => {
    const response = await api.post<ApiResponse<StatusReport>>(`/devices/${deviceId}/status`, {
      status,
      diagnosticMessage: message,
    });
    return response.data.data;
  },
};
