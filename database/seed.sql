-- Seed data
-- Default login: admin@test.com / 123456
-- Password hash below is a bcrypt hash (10 rounds) of "123456"
-- Generated with: bcrypt.hashSync('123456', 10)

INSERT INTO users (name, email, password)
VALUES (
    'Admin User',
    'admin@test.com',
    '$2b$10$OXRVNt5WIRUGNJ35LiKwUeig7eg1PxGoE1BFZyXYX98OF.EMp7H7G'
);

-- A handful of sample tasks so the dashboard isn't empty on first login
INSERT INTO tasks (user_id, title, description, priority, status, due_date)
VALUES
    (1, 'Set up project repository', 'Initialize Git repo and folder structure', 'High', 'Completed', CURRENT_DATE - INTERVAL '5 days'),
    (1, 'Design database schema', 'Model users and tasks tables', 'High', 'Completed', CURRENT_DATE - INTERVAL '3 days'),
    (1, 'Build authentication API', 'Login endpoint with JWT', 'High', 'In Progress', CURRENT_DATE + INTERVAL '1 day'),
    (1, 'Build task CRUD API', 'Create, read, update, delete endpoints', 'Medium', 'Pending', CURRENT_DATE + INTERVAL '3 days'),
    (1, 'Implement dashboard UI', 'Show task counts by status', 'Medium', 'Pending', CURRENT_DATE + INTERVAL '5 days'),
    (1, 'Write README', 'Document setup and API', 'Low', 'Pending', CURRENT_DATE + INTERVAL '7 days'),
    (1, 'Fix overdue styling bug', 'Overdue badge not showing on mobile', 'Low', 'Pending', CURRENT_DATE - INTERVAL '2 days');
