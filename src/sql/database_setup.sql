

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

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    recipient_id INT,
    sender_name VARCHAR(100),
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    is_system_message BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL
);

-- System Logs Table
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('info', 'warning', 'error', 'debug') NOT NULL,
    message TEXT NOT NULL,
    details JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to get all database tables
DELIMITER $$
CREATE FUNCTION get_all_tables() RETURNS JSON
BEGIN
    DECLARE result JSON;
    SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'table_name', table_name,
        'row_count', (SELECT COUNT(*) FROM `information_schema`.`tables` WHERE `table_schema` = DATABASE() AND `table_name` = t.`table_name`),
        'total_bytes', (SELECT data_length + index_length FROM `information_schema`.`tables` WHERE `table_schema` = DATABASE() AND `table_name` = t.`table_name`)
    )) INTO result
    FROM `information_schema`.`tables` t
    WHERE `table_schema` = DATABASE();
    
    RETURN result;
END$$
DELIMITER ;

-- Function to execute read-only queries safely
DELIMITER $$
CREATE FUNCTION execute_read_query(query_text TEXT) RETURNS JSON
BEGIN
    DECLARE result JSON;
    DECLARE query_type VARCHAR(10);
    
    -- Extract the first word to determine query type
    SET query_type = UPPER(TRIM(SUBSTRING_INDEX(query_text, ' ', 1)));
    
    IF query_type != 'SELECT' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only SELECT queries are allowed';
    END IF;
    
    -- Execute the query and format results as JSON
    SET @sql = CONCAT('SELECT JSON_OBJECT("columns", 
                          (SELECT JSON_ARRAYAGG(COLUMN_NAME) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @tablename),
                          "rows", 
                          (SELECT JSON_ARRAYAGG(JSON_OBJECT(*)) FROM (', query_text, ') as subq))');
    
    -- Extract table name from query
    SET @tablename = SUBSTRING_INDEX(SUBSTRING_INDEX(query_text, 'FROM', -1), ' ', 1);
    SET @tablename = TRIM(@tablename);
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- Return JSON result
    RETURN result;
END$$
DELIMITER ;

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

-- Insert sample messages
INSERT INTO messages (sender_id, sender_name, content, timestamp, is_read, is_starred, is_system_message) VALUES
((SELECT id FROM users WHERE username = 'admin'), 'Max Mustermann', 'Hallo! Ich wollte mich nach dem Status meiner Anfrage erkundigen. Vielen Dank im Voraus!', 
 DATE_SUB(NOW(), INTERVAL 1 DAY), FALSE, TRUE, FALSE),
(NULL, 'Lisa Schmidt', 'Vielen Dank für die schnelle Antwort. Ich habe noch eine Frage bezüglich der Sendezeit...',
 DATE_SUB(NOW(), INTERVAL 2 DAY), TRUE, FALSE, FALSE),
(NULL, 'Tim Weber', 'Könnten Sie mir bitte mitteilen, wann die nächste Livesendung stattfindet? Ich würde gerne teilnehmen.',
 DATE_SUB(NOW(), INTERVAL 3 DAY), TRUE, FALSE, FALSE),
(NULL, 'System', 'Wichtige Systembenachrichtigung: Wartungsarbeiten sind für morgen um 02:00 Uhr geplant. Die Plattform wird voraussichtlich für 2 Stunden nicht verfügbar sein.',
 NOW(), FALSE, TRUE, TRUE);

-- Insert sample system logs
INSERT INTO system_logs (level, message, details, timestamp) VALUES
('info', 'System startup completed', '{"environment": "production", "services": ["web", "db", "cache"]}', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('warning', 'High CPU usage detected', '{"usage": 85, "threshold": 80, "process": "web_server"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('error', 'Database connection failed', '{"error": "Connection timeout", "retries": 3}', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
('info', 'Backup completed successfully', '{"size": "1.2GB", "duration": "00:05:23"}', DATE_SUB(NOW(), INTERVAL 6 HOUR));
