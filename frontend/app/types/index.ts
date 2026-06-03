export enum DeviceType {
  CPE = 'CPE',
  ROUTER = 'ROUTER',
  SWITCH = 'SWITCH',
  ACCESS_POINT = 'ACCESS_POINT',
  FIREWALL = 'FIREWALL',
  ONT = 'ONT',
  UNKNOWN = 'UNKNOWN'
}

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  UNKNOWN = 'UNKNOWN'
}

export interface Device {
  id: string;
  name: string;
  device_type: DeviceType;
  hostname?: string;
  ip_address?: string;
  location?: string;
  registered_at: string;
  last_status: DeviceStatus;
  last_report_timestamp?: string;
  is_stale?: boolean;
}

export interface StatusReport {
  id: number;
  reported_at: string;
  status: DeviceStatus;
  diagnostic_message?: string;
}

export interface DeviceDetail extends Device {
  recent_reports: StatusReport[];
  device: Device;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: any;
}
