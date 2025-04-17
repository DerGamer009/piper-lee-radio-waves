
-- Database Creation
CREATE DATABASE IF NOT EXISTS radio_station;
USE radio_station;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- User Roles Mapping Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Shows Table
CREATE TABLE IF NOT EXISTS shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Schedule Table
CREATE TABLE IF NOT EXISTS schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    day_of_week ENUM('Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    host_id INT,
    is_recurring BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator mit vollen Rechten'),
('moderator', 'Moderator mit eingeschränkten Rechten');

-- Insert admin user (password: admin123)
-- Note: In production, use a secure password hashing method
INSERT INTO users (username, password_hash, email, full_name, is_active) VALUES
('admin', '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2', 'admin@radiostation.de', 'System Administrator', TRUE);

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'admin';

-- Insert sample shows
INSERT INTO shows (title, description, created_by) VALUES
('Morgenmelodien', 'Starten Sie Ihren Tag mit den besten Melodien und guter Laune.', 
 (SELECT id FROM users WHERE username = 'admin')),
('Mittagsbeat', 'Energiegeladene Musik für Ihre Mittagspause.',
 (SELECT id FROM users WHERE username = 'admin')),
('Nachmittagsklänge', 'Entspannte Musik für den Nachmittag.',
 (SELECT id FROM users WHERE username = 'admin')),
('Abendechos', 'Die besten Hits zum Abend.',
 (SELECT id FROM users WHERE username = 'admin')),
('Nachtlounge', 'Musik zum Entspannen und Träumen.',
 (SELECT id FROM users WHERE username = 'admin'));

-- Insert sample schedule
INSERT INTO schedule (show_id, day_of_week, start_time, end_time, host_id, is_recurring) VALUES
((SELECT id FROM shows WHERE title = 'Morgenmelodien'), 'Montag', '08:00:00', '11:00:00', 
 (SELECT id FROM users WHERE username = 'admin'), TRUE),
((SELECT id FROM shows WHERE title = 'Mittagsbeat'), 'Montag', '12:00:00', '14:00:00', 
 (SELECT id FROM users WHERE username = 'admin'), TRUE),
((SELECT id FROM shows WHERE title = 'Nachmittagsklänge'), 'Dienstag', '13:00:00', '15:00:00', 
 (SELECT id FROM users WHERE username = 'admin'), TRUE),
((SELECT id FROM shows WHERE title = 'Abendechos'), 'Mittwoch', '19:00:00', '21:00:00', 
 (SELECT id FROM users WHERE username = 'admin'), TRUE),
((SELECT id FROM shows WHERE title = 'Nachtlounge'), 'Donnerstag', '22:00:00', '00:00:00', 
 (SELECT id FROM users WHERE username = 'admin'), TRUE);
