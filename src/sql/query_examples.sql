
-- Example queries for common operations

-- Get all users with their roles
SELECT u.id, u.username, u.email, u.full_name, GROUP_CONCAT(r.name) AS roles
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
GROUP BY u.id;

-- Get complete schedule with show and host information
SELECT 
    s.day_of_week,
    s.start_time,
    s.end_time,
    sh.title AS show_title,
    sh.description AS show_description,
    u.full_name AS host_name
FROM schedule s
JOIN shows sh ON s.show_id = sh.id
LEFT JOIN users u ON s.host_id = u.id
ORDER BY 
    CASE s.day_of_week
        WHEN 'Montag' THEN 1
        WHEN 'Dienstag' THEN 2
        WHEN 'Mittwoch' THEN 3
        WHEN 'Donnerstag' THEN 4
        WHEN 'Freitag' THEN 5
        WHEN 'Samstag' THEN 6
        WHEN 'Sonntag' THEN 7
    END,
    s.start_time;

-- Add a new user and assign moderator role
INSERT INTO users (username, password_hash, email, full_name, is_active) 
VALUES ('moderator1', '$2y$10$someHashedPassword', 'mod1@radiostation.de', 'Moderator Eins', TRUE);

INSERT INTO user_roles (user_id, role_id)
SELECT 
    (SELECT id FROM users WHERE username = 'moderator1'),
    (SELECT id FROM roles WHERE name = 'moderator');

-- Update show information
UPDATE shows
SET title = 'Neuer Showtitel', description = 'Neue Beschreibung'
WHERE id = 1;

-- Update schedule time
UPDATE schedule
SET start_time = '09:00:00', end_time = '12:00:00'
WHERE show_id = 1 AND day_of_week = 'Montag';

-- Delete a show and its schedule (will cascade delete related schedule entries)
DELETE FROM shows WHERE id = 5;
