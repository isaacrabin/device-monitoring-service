-- =====================================================
-- V3__seed_sample_data.sql
-- Description: Seed sample device data for testing
-- =====================================================

-- =====================================================
-- SAMPLE DATA - 3 DEVICES
-- =====================================================

-- Device 1: Core Router (ONLINE)
INSERT INTO device (
    id, name, device_type, hostname, ip_address, location, 
    registered_at, last_status, last_report_timestamp, last_diagnostic_message
) VALUES (
    uuid_generate_v4(), 
    'Core-Router-01', 
    'ROUTER', 
    'router01.example.com', 
    '192.168.1.1', 
    'Data Center A - Rack 1',
    NOW() - INTERVAL '30 days',
    'ONLINE',
    NOW() - INTERVAL '2 minutes',
    'All systems operational, CPU: 45%, Memory: 62%'
);

-- Device 2: Access Switch (DEGRADED)
INSERT INTO device (
    id, name, device_type, hostname, ip_address, location,
    registered_at, last_status, last_report_timestamp, last_diagnostic_message
) VALUES (
    uuid_generate_v4(),
    'Access-Switch-02',
    'SWITCH',
    'switch02.example.com',
    '192.168.2.10',
    'Floor 2 - Comms Room',
    NOW() - INTERVAL '15 days',
    'DEGRADED',
    NOW() - INTERVAL '5 minutes',
    'High CPU usage: 85%, Packet loss: 3%'
);

-- Device 3: Edge Firewall (OFFLINE/STALE)
INSERT INTO device (
    id, name, device_type, hostname, ip_address, location,
    registered_at, last_status, last_report_timestamp, last_diagnostic_message
) VALUES (
    uuid_generate_v4(),
    'Edge-Firewall-01',
    'FIREWALL',
    'firewall01.example.com',
    '203.0.113.1',
    'Perimeter Network',
    NOW() - INTERVAL '45 days',
    'OFFLINE',
    NOW() - INTERVAL '25 minutes',
    'No response from device, possible connectivity issue'
);

-- =====================================================
-- STATUS HISTORY FOR EACH DEVICE
-- =====================================================

-- Status history for Core-Router-01 (Last 10 reports)
DO $$
DECLARE
    device_uuid UUID;
BEGIN
    SELECT id INTO device_uuid FROM device WHERE name = 'Core-Router-01';
    
    INSERT INTO status_report (device_id, reported_at, status, diagnostic_message) VALUES
    (device_uuid, NOW() - INTERVAL '2 minutes', 'ONLINE', 'Normal operation'),
    (device_uuid, NOW() - INTERVAL '1 hour', 'ONLINE', 'All systems stable'),
    (device_uuid, NOW() - INTERVAL '2 hours', 'ONLINE', 'CPU: 42%, Memory: 60%'),
    (device_uuid, NOW() - INTERVAL '3 hours', 'ONLINE', 'Traffic spike handled'),
    (device_uuid, NOW() - INTERVAL '4 hours', 'ONLINE', 'Regular health check'),
    (device_uuid, NOW() - INTERVAL '5 hours', 'DEGRADED', 'High bandwidth usage: 90%'),
    (device_uuid, NOW() - INTERVAL '6 hours', 'ONLINE', 'Returned to normal'),
    (device_uuid, NOW() - INTERVAL '7 hours', 'ONLINE', 'All systems go'),
    (device_uuid, NOW() - INTERVAL '8 hours', 'ONLINE', 'Backup completed'),
    (device_uuid, NOW() - INTERVAL '9 hours', 'ONLINE', 'Regular operation');
END $$;

-- Status history for Access-Switch-02 (Last 10 reports)
DO $$
DECLARE
    device_uuid UUID;
BEGIN
    SELECT id INTO device_uuid FROM device WHERE name = 'Access-Switch-02';
    
    INSERT INTO status_report (device_id, reported_at, status, diagnostic_message) VALUES
    (device_uuid, NOW() - INTERVAL '5 minutes', 'DEGRADED', 'CPU: 85%, packet loss: 3%'),
    (device_uuid, NOW() - INTERVAL '1 hour', 'DEGRADED', 'CPU: 82%, memory: 70%'),
    (device_uuid, NOW() - INTERVAL '2 hours', 'DEGRADED', 'Interface errors detected'),
    (device_uuid, NOW() - INTERVAL '3 hours', 'ONLINE', 'Recovered temporarily'),
    (device_uuid, NOW() - INTERVAL '4 hours', 'DEGRADED', 'High temperature warning'),
    (device_uuid, NOW() - INTERVAL '5 hours', 'DEGRADED', 'Fan speed: HIGH'),
    (device_uuid, NOW() - INTERVAL '6 hours', 'ONLINE', 'Normalized after reboot'),
    (device_uuid, NOW() - INTERVAL '7 hours', 'DEGRADED', 'Power supply fluctuation'),
    (device_uuid, NOW() - INTERVAL '8 hours', 'ONLINE', 'All ports operational'),
    (device_uuid, NOW() - INTERVAL '9 hours', 'DEGRADED', 'Uplink congestion');
END $$;

-- Status history for Edge-Firewall-01 (Last 10 reports)
DO $$
DECLARE
    device_uuid UUID;
BEGIN
    SELECT id INTO device_uuid FROM device WHERE name = 'Edge-Firewall-01';
    
    INSERT INTO status_report (device_id, reported_at, status, diagnostic_message) VALUES
    (device_uuid, NOW() - INTERVAL '25 minutes', 'OFFLINE', 'No response from device'),
    (device_uuid, NOW() - INTERVAL '1 hour', 'ONLINE', 'Active connections: 1250'),
    (device_uuid, NOW() - INTERVAL '2 hours', 'ONLINE', 'DDoS protection active'),
    (device_uuid, NOW() - INTERVAL '3 hours', 'DEGRADED', 'High connection count: 5000'),
    (device_uuid, NOW() - INTERVAL '4 hours', 'ONLINE', 'Normal traffic pattern'),
    (device_uuid, NOW() - INTERVAL '5 hours', 'ONLINE', 'Security scan completed'),
    (device_uuid, NOW() - INTERVAL '6 hours', 'ONLINE', 'All rules updated'),
    (device_uuid, NOW() - INTERVAL '7 hours', 'ONLINE', 'VPN connections: 45'),
    (device_uuid, NOW() - INTERVAL '8 hours', 'ONLINE', 'Regular health check'),
    (device_uuid, NOW() - INTERVAL '9 hours', 'ONLINE', 'System stable');
END $$;

-- =====================================================
-- VERIFY SAMPLE DATA (Optional - for logging)
-- =====================================================
DO $$
DECLARE
    device_count INTEGER;
    report_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO device_count FROM device;
    SELECT COUNT(*) INTO report_count FROM status_report;
    
    RAISE NOTICE 'Sample data seeded: % devices, % status reports', device_count, report_count;
END $$;
