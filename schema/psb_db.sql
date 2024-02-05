CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(255),
    token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS parking_spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    start_date_time TIMESTAMP,
    end_date_time TIMESTAMP,
    parking_spot_id INTEGER REFERENCES parking_spots(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO parking_spots(name) VALUES
('A'),
('B'),
('C'),
('D'),
('E'),
('F'),
('G'),
('H'),
('I'),
('J');

INSERT INTO users(id, first_name, last_name, email, role, token) VALUES
(1, 'John', 'Doe', 'john@example.com', 'admin', '1|admin'),
(2, 'Jane', 'Doe', 'jane@example.com', 'standard', '2|standard');
