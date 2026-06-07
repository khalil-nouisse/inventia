INSERT IGNORE INTO roles(id, name) VALUES (1, 'ROLE_ADMIN'), (2, 'ROLE_MANAGER'), (3, 'ROLE_USER');
INSERT IGNORE INTO users(id, username, email, password, first_name, last_name, enabled, role_id, created_at, updated_at) VALUES
(1, 'admin', 'admin@inventia.local', '$2a$10$Jov4M9AEr1H77cXKIy0k8ug.6C/OXRMvNRc039uye.tVdF3sluPNq', 'Admin', 'InventIA', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'manager', 'manager@inventia.local', '$2a$10$Jov4M9AEr1H77cXKIy0k8ug.6C/OXRMvNRc039uye.tVdF3sluPNq', 'Manager', 'InventIA', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'user', 'user@inventia.local', '$2a$10$Jov4M9AEr1H77cXKIy0k8ug.6C/OXRMvNRc039uye.tVdF3sluPNq', 'User', 'InventIA', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT IGNORE INTO hackathons(id, title, description, theme, prize, registration_deadline, start_date, end_date, max_team_size, status, created_by_id, created_at, updated_at) VALUES
(1, 'ENSAM InventIA Challenge', 'Academic hackathon for Spring Boot and React delivery.', 'Inventory intelligence', 'Certificates and jury recognition', '2026-06-15', '2026-06-20', '2026-06-22', 5, 'UPCOMING', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
