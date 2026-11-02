-- SGMS Seed Sample Data for MySQL
-- Note: Password for all default accounts is encrypted with BCrypt
-- Admin: admin / Admin@123
-- Faculty: prof.sharma, prof.patel / Faculty@123
-- Student: CS2024001, CS2024002 / Student@123

INSERT INTO departments (id, code, name, description) VALUES
(1, 'CSE', 'Computer Science & Engineering', 'Department of Computer Science and Engineering'),
(2, 'ECE', 'Electronics & Communication', 'Department of Electronics and Communication Engineering'),
(3, 'IT', 'Information Technology', 'Department of Information Technology'),
(4, 'MECH', 'Mechanical Engineering', 'Department of Mechanical Engineering')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO semesters (id, semester_number, name) VALUES
(1, 1, 'Semester 1'),
(2, 2, 'Semester 2'),
(3, 3, 'Semester 3'),
(4, 4, 'Semester 4'),
(5, 5, 'Semester 5'),
(6, 6, 'Semester 6'),
(7, 7, 'Semester 7'),
(8, 8, 'Semester 8')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO academic_years (id, year_code, is_current, start_date, end_date) VALUES
(1, '2023-2024', FALSE, '2023-07-01', '2024-06-30'),
(2, '2024-2025', TRUE, '2024-07-01', '2025-06-30')
ON DUPLICATE KEY UPDATE is_current=VALUES(is_current);

