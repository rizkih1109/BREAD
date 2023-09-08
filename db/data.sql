CREATE TABLE data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    height INTEGER,
    weight FLOAT,
    birthdate DATE,
    married BOOLEAN DEFAULT false
);

INSERT INTO data (name, height, weight, birthdate, married) VALUES
('Hilmi', '185', '59.6', "2001-12-13", false),
('Wildan', '165', '72.1', "2000-12-17", false),
('Aziz', '171', '67.5', "2001-12-12", true),
('Himawan', '161', '68.6', "1998-03-30", false);

