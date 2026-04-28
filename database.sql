-- ============================================================
--  SWASTHYA SETU — Synthetic Database
--  Compatible with MySQL Workbench / MySQL 8.x
--  Run this script in MySQL Workbench to populate the schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS swasthya_setu
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE swasthya_setu;

-- ────────────────────────────────────────────────────────────
-- TABLE: hospitals
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS hospitals;
CREATE TABLE hospitals (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  address       VARCHAR(255)  NOT NULL,
  city          VARCHAR(80)   NOT NULL DEFAULT 'Gadag',
  state         VARCHAR(80)   NOT NULL DEFAULT 'Karnataka',
  pincode       CHAR(6),
  latitude      DECIMAL(10,7),
  longitude     DECIMAL(10,7),
  distance_km   DECIMAL(5,2)  COMMENT 'Distance from city center in km',
  travel_mins   INT           COMMENT 'Estimated travel time in minutes',
  phone_primary VARCHAR(20)   NOT NULL,
  phone_alt     VARCHAR(20),
  email         VARCHAR(120),
  type          ENUM('Government','Private','Primary Health','Specialty','Clinic') NOT NULL,
  availability  ENUM('Open 24/7','Day only (8am-8pm)','Emergency Only') NOT NULL DEFAULT 'Open 24/7',
  beds          INT,
  emergency_ward TINYINT(1)   DEFAULT 1  COMMENT '1 = has emergency ward',
  icu_available  TINYINT(1)   DEFAULT 0,
  blood_bank     TINYINT(1)   DEFAULT 0,
  ambulance      TINYINT(1)   DEFAULT 0,
  rating        DECIMAL(2,1)  COMMENT 'Out of 5',
  active        TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO hospitals
  (name, address, city, pincode, latitude, longitude, distance_km, travel_mins,
   phone_primary, phone_alt, email, type, availability,
   beds, emergency_ward, icu_available, blood_bank, ambulance, rating)
VALUES
  ('District Government Hospital',
   'Main Road, Near Bus Stand', 'Gadag', '582101',
   15.4315, 75.6205, 2.10, 8,
   '08372-234567', '08372-234568', 'dgh.gadag@karnataka.gov.in',
   'Government', 'Open 24/7',
   300, 1, 1, 1, 1, 4.1),

  ('Srinivasa Medical Centre',
   'Station Road, Opp Railway Station', 'Gadag', '582101',
   15.4258, 75.6312, 3.40, 12,
   '08372-223344', '9448112345', 'srinivasa.mc@gmail.com',
   'Private', 'Open 24/7',
   80, 1, 1, 0, 1, 4.3),

  ('PHC Betageri',
   'Betageri Main Road, Near Water Tank', 'Betageri', '582102',
   15.4190, 75.6145, 1.20, 5,
   '08372-245678', NULL, NULL,
   'Primary Health', 'Open 24/7',
   30, 1, 0, 0, 0, 3.8),

  ('KLE Dr. Prabhakar Kore Hospital',
   'MG Road, Near Town Hall', 'Gadag', '582101',
   15.4350, 75.6280, 2.80, 10,
   '08372-251100', '08372-251101', 'kle.gadag@klehospital.org',
   'Specialty', 'Open 24/7',
   150, 1, 1, 1, 1, 4.5),

  ('City Nursing Home',
   'Laxmeshwar Road, 2nd Cross', 'Gadag', '582101',
   15.4295, 75.6195, 1.70, 7,
   '08372-261122', '9886223344', NULL,
   'Private', 'Open 24/7',
   40, 1, 0, 0, 0, 4.0),

  ('Shri Veereswara Hospital',
   'Shirahatti Road, Near Old Bus Stand', 'Gadag', '582101',
   15.4330, 75.6155, 2.50, 9,
   '08372-271133', NULL, NULL,
   'Private', 'Day only (8am-8pm)',
   60, 0, 0, 0, 0, 3.9),

  ('PHC Mulugund',
   'Mulugund Town, NH-67', 'Mulugund', '582115',
   15.5123, 75.6789, 18.00, 35,
   '08372-281144', NULL, NULL,
   'Primary Health', 'Open 24/7',
   20, 1, 0, 0, 0, 3.5),

  ('Gadag Trauma & Ortho Centre',
   'Hubli Road, Near Petrol Bunk', 'Gadag', '582101',
   15.4378, 75.6312, 3.10, 11,
   '08372-291155', '9743001122', 'traumagadag@gmail.com',
   'Specialty', 'Open 24/7',
   50, 1, 1, 0, 1, 4.2),

  ('Mahesh Children & Maternity Hospital',
   'Vidyanagar, 4th Cross', 'Gadag', '582103',
   15.4222, 75.6267, 2.20, 8,
   '08372-301166', '9900223344', NULL,
   'Specialty', 'Open 24/7',
   35, 1, 0, 0, 0, 4.4),

  ('Shirahatti Government Hospital',
   'Main Road, Shirahatti Town', 'Shirahatti', '582120',
   15.2345, 75.5678, 22.00, 42,
   '08372-311177', NULL, NULL,
   'Government', 'Open 24/7',
   100, 1, 0, 0, 1, 3.6);


-- ────────────────────────────────────────────────────────────
-- TABLE: emergency_contacts
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS emergency_contacts;
CREATE TABLE emergency_contacts (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT           NOT NULL DEFAULT 1  COMMENT 'Foreign key to users table',
  full_name    VARCHAR(120)  NOT NULL,
  relationship ENUM('Wife','Husband','Son','Daughter','Father','Mother',
                    'Brother','Sister','Friend','Neighbour','Doctor','Other') NOT NULL,
  phone        VARCHAR(20)   NOT NULL,
  phone_alt    VARCHAR(20),
  priority     TINYINT       NOT NULL DEFAULT 1  COMMENT '1=Primary, 2=Secondary, 3=Tertiary',
  notify_sms   TINYINT(1)   DEFAULT 1,
  notify_call  TINYINT(1)   DEFAULT 1,
  active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO emergency_contacts
  (user_id, full_name, relationship, phone, phone_alt, priority, notify_sms, notify_call)
VALUES
  (1, 'Sunita Kumar',  'Wife',     '+91 98765 43210', '+91 98765 43211', 1, 1, 1),
  (1, 'Raju Kumar',    'Son',      '+91 87654 32109', NULL,              2, 1, 1),
  (1, 'Meena Patil',   'Daughter', '+91 76543 21098', NULL,              3, 1, 0),
  (2, 'Lakshmi Rao',   'Wife',     '+91 99887 76655', '+91 99887 76656', 1, 1, 1),
  (2, 'Anil Rao',      'Brother',  '+91 88776 65544', NULL,              2, 1, 1),
  (3, 'Pooja Sharma',  'Daughter', '+91 77665 54433', NULL,              1, 1, 1),
  (3, 'Dr. Ramesh K',  'Doctor',   '+91 93456 78901', '+91 93456 78902', 2, 0, 1);


-- ────────────────────────────────────────────────────────────
-- TABLE: users  (basic — extend as needed)
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(120)  NOT NULL,
  phone        VARCHAR(20)   NOT NULL UNIQUE,
  dob          DATE,
  blood_group  ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown') DEFAULT 'Unknown',
  address      VARCHAR(255),
  city         VARCHAR(80)   DEFAULT 'Gadag',
  state        VARCHAR(80)   DEFAULT 'Karnataka',
  active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (full_name, phone, dob, blood_group, address, city)
VALUES
  ('Rajesh Kumar',  '+91 98765 43200', '1980-06-15', 'B+', 'MG Road, Gadag',       'Gadag'),
  ('Venkat Rao',    '+91 99887 76600', '1975-03-22', 'O+', 'Station Road, Gadag',  'Gadag'),
  ('Priya Sharma',  '+91 77665 54400', '1990-11-08', 'A+', 'Betageri, Gadag',      'Betageri');


-- ────────────────────────────────────────────────────────────
-- TABLE: sos_events  (audit log of SOS triggers)
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS sos_events;
CREATE TABLE sos_events (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  service_type ENUM('Ambulance','Police','Fire Brigade','Family') NOT NULL,
  number_called VARCHAR(20),
  latitude     DECIMAL(10,7),
  longitude    DECIMAL(10,7),
  triggered_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved     TINYINT(1)  DEFAULT 0,
  notes        TEXT
);

INSERT INTO sos_events (user_id, service_type, number_called, latitude, longitude, resolved)
VALUES
  (1, 'Ambulance',   '108', 15.4315, 75.6205, 1),
  (2, 'Police',      '100', 15.4258, 75.6312, 1),
  (1, 'Fire Brigade','101', 15.4190, 75.6145, 0);


-- ────────────────────────────────────────────────────────────
-- USEFUL VIEWS
-- ────────────────────────────────────────────────────────────

-- View: nearest open hospitals sorted by distance
CREATE OR REPLACE VIEW v_nearest_hospitals AS
SELECT id, name, address, city, distance_km, travel_mins,
       phone_primary, type, availability,
       emergency_ward, icu_available, blood_bank, ambulance, rating
FROM   hospitals
WHERE  active = 1
ORDER  BY distance_km ASC;

-- View: primary emergency contact per user
CREATE OR REPLACE VIEW v_primary_contacts AS
SELECT ec.user_id, u.full_name AS patient_name,
       ec.full_name AS contact_name, ec.relationship,
       ec.phone, ec.priority
FROM   emergency_contacts ec
JOIN   users u ON u.id = ec.user_id
WHERE  ec.active = 1 AND ec.priority = 1;

-- ────────────────────────────────────────────────────────────
-- SAMPLE QUERIES (for reference / testing)
-- ────────────────────────────────────────────────────────────

-- Q1: List all 24/7 hospitals within 5 km
-- SELECT name, distance_km, phone_primary, type
-- FROM   hospitals
-- WHERE  availability = 'Open 24/7' AND distance_km <= 5 AND active = 1
-- ORDER  BY distance_km;

-- Q2: Get all emergency contacts for user 1, ordered by priority
-- SELECT full_name, relationship, phone, priority
-- FROM   emergency_contacts
-- WHERE  user_id = 1 AND active = 1
-- ORDER  BY priority;

-- Q3: Hospitals with ICU
-- SELECT name, phone_primary, distance_km
-- FROM   hospitals
-- WHERE  icu_available = 1 AND active = 1
-- ORDER  BY distance_km;