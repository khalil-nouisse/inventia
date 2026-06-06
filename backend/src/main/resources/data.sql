INSERT IGNORE INTO roles(id, name) VALUES (1, 'ROLE_ADMIN'), (2, 'ROLE_MANAGER'), (3, 'ROLE_USER');
INSERT IGNORE INTO users(id, username, email, password, first_name, last_name, enabled, created_at, updated_at) VALUES
(1, 'admin', 'admin@inventia.local', '$2a$10$DowJones.D8iJkkyzqz2Z1eKOtG0/.7RzXf.0edp3jD6u16x6xZKJtO', 'Admin', 'InventIA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'manager', 'manager@inventia.local', '$2a$10$DowJones.D8iJkkyzqz2Z1eKOtG0/.7RzXf.0edp3jD6u16x6xZKJtO', 'Manager', 'InventIA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'user', 'user@inventia.local', '$2a$10$DowJones.D8iJkkyzqz2Z1eKOtG0/.7RzXf.0edp3jD6u16x6xZKJtO', 'User', 'InventIA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES (1,1),(1,2),(1,3),(2,2),(2,3),(3,3);
INSERT IGNORE INTO hackathons(id, title, description, theme, prize, registration_deadline, start_date, end_date, max_team_size, status, created_by_id, created_at, updated_at) VALUES
(1, 'ENSAM InventIA Challenge', 'Academic hackathon for Spring Boot and React delivery.', 'Inventory intelligence', 'Certificates and jury recognition', '2026-06-15', '2026-06-20', '2026-06-22', 5, 'UPCOMING', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
