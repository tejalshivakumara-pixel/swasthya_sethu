-- ============================================================
--  SWASTHYA SETU — merged schema
--  Combines the rich hospitals/emergency_contacts/sos_events
--  design with the tables database_manager.py already queries.
--  Safe to re-run: uses DROP TABLE IF EXISTS, so this is meant
--  for (re)seeding a dev database, not a production migration.
-- ============================================================

CREATE DATABASE IF NOT EXISTS swasthya_setu_v2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE swasthya_setu_v2;

SET FOREIGN_KEY_CHECKS = 0;

-- ────────────────────────────────────────────────────────────
-- users  (kept email + password — required for login_user/register_user)
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(120)  NOT NULL,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  password     VARCHAR(255)  NOT NULL,
  phone        VARCHAR(20)   NOT NULL,
  dob          DATE,
  blood_group  ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown') DEFAULT 'Unknown',
  address      VARCHAR(255),
  city         VARCHAR(80)   DEFAULT 'Gadag',
  state        VARCHAR(80)   DEFAULT 'Karnataka',
  active       TINYINT(1)    NOT NULL DEFAULT 1,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (full_name, email, password, phone, dob, blood_group, address, city) VALUES
  ('Rajesh Kumar', 'rajesh@example.com', 'demo1234', '+91 98765 43200', '1980-06-15', 'B+', 'MG Road, Gadag', 'Gadag'),
  ('Venkat Rao',   'venkat@example.com', 'demo1234', '+91 99887 76600', '1975-03-22', 'O+', 'Station Road, Gadag', 'Gadag'),
  ('Priya Sharma', 'priya@example.com',  'demo1234', '+91 77665 54400', '1990-11-08', 'A+', 'Betageri, Gadag', 'Betageri');

-- ────────────────────────────────────────────────────────────
-- hospitals  (richer version, from database.sql)
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS hospitals;
CREATE TABLE hospitals (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(150)  NOT NULL,
  address        VARCHAR(255)  NOT NULL,
  city           VARCHAR(80)   NOT NULL DEFAULT 'Gadag',
  state          VARCHAR(80)   NOT NULL DEFAULT 'Karnataka',
  pincode        CHAR(6),
  latitude       DECIMAL(10,7),
  longitude      DECIMAL(10,7),
  distance_km    DECIMAL(5,2)  COMMENT 'Distance from city center in km',
  travel_mins    INT           COMMENT 'Estimated travel time in minutes',
  phone_primary  VARCHAR(20)   NOT NULL,
  phone_alt      VARCHAR(20),
  email          VARCHAR(120),
  type           ENUM('Government','Private','Primary Health','Specialty','Clinic') NOT NULL,
  availability   ENUM('Open 24/7','Day only (8am-8pm)','Emergency Only') NOT NULL DEFAULT 'Open 24/7',
  beds           INT,
  emergency_ward TINYINT(1)    DEFAULT 1,
  icu_available  TINYINT(1)    DEFAULT 0,
  blood_bank     TINYINT(1)    DEFAULT 0,
  ambulance      TINYINT(1)    DEFAULT 0,
  rating         DECIMAL(2,1),
  active         TINYINT(1)    NOT NULL DEFAULT 1,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO hospitals
  (name, address, city, pincode, latitude, longitude, distance_km, travel_mins,
   phone_primary, phone_alt, email, type, availability,
   beds, emergency_ward, icu_available, blood_bank, ambulance, rating)
VALUES
  ('District Government Hospital', 'Main Road, Near Bus Stand', 'Gadag', '582101',
   15.4315, 75.6205, 2.10, 8, '08372-234567', '08372-234568', 'dgh.gadag@karnataka.gov.in',
   'Government', 'Open 24/7', 300, 1, 1, 1, 1, 4.1),
  ('Srinivasa Medical Centre', 'Station Road, Opp Railway Station', 'Gadag', '582101',
   15.4258, 75.6312, 3.40, 12, '08372-223344', '9448112345', 'srinivasa.mc@gmail.com',
   'Private', 'Open 24/7', 80, 1, 1, 0, 1, 4.3),
  ('PHC Betageri', 'Betageri Main Road, Near Water Tank', 'Betageri', '582102',
   15.4190, 75.6145, 1.20, 5, '08372-245678', NULL, NULL,
   'Primary Health', 'Open 24/7', 30, 1, 0, 0, 0, 3.8),
  ('KLE Dr. Prabhakar Kore Hospital', 'MG Road, Near Town Hall', 'Gadag', '582101',
   15.4350, 75.6280, 2.80, 10, '08372-251100', '08372-251101', 'kle.gadag@klehospital.org',
   'Specialty', 'Open 24/7', 150, 1, 1, 1, 1, 4.5),
  ('City Nursing Home', 'Laxmeshwar Road, 2nd Cross', 'Gadag', '582101',
   15.4295, 75.6195, 1.70, 7, '08372-261122', '9886223344', NULL,
   'Private', 'Open 24/7', 40, 1, 0, 0, 0, 4.0),
   ('Manipal Hospital Old Airport Road',
'98 HAL Airport Road',
'Bengaluru',
'560017',
12.9580,
77.6490,
4.50,
15,
'08025024444',
NULL,
'info@manipalhospitals.com',
'Private',
'Open 24/7',
650,
1,
1,
1,
1,
4.8),

('Apollo Hospital Bannerghatta Road',
'154 Bannerghatta Main Road',
'Bengaluru',
'560076',
12.8894,
77.5977,
7.80,
20,
'08026304050',
NULL,
'info@apollohospitals.com',
'Private',
'Open 24/7',
700,
1,
1,
1,
1,
4.9),

('Fortis Hospital Bannerghatta',
'Bannerghatta Main Road',
'Bengaluru',
'560076',
12.8935,
77.5968,
7.60,
18,
'08066214444',
NULL,
'info@fortishealthcare.com',
'Private',
'Open 24/7',
450,
1,
1,
1,
1,
4.7),

('Narayana Health City',
'Bommasandra',
'Bengaluru',
'560099',
12.8005,
77.7042,
18.50,
35,
'08071222222',
NULL,
'info@narayanahealth.org',
'Specialty',
'Open 24/7',
1200,
1,
1,
1,
1,
4.9),

('Aster CMI Hospital',
'Hebbal',
'Bengaluru',
'560092',
13.0458,
77.5938,
8.90,
22,
'08043420100',
NULL,
'care@asterhospital.com',
'Private',
'Open 24/7',
500,
1,
1,
1,
1,
4.8),

('Sakra World Hospital',
'Marathahalli',
'Bengaluru',
'560103',
12.9398,
77.6963,
9.50,
24,
'08049694969',
NULL,
'info@sakraworldhospital.com',
'Private',
'Open 24/7',
350,
1,
1,
1,
1,
4.7),

('MS Ramaiah Memorial Hospital',
'New BEL Road',
'Bengaluru',
'560054',
13.0307,
77.5653,
6.40,
16,
'08023608888',
NULL,
'info@msrmh.com',
'Specialty',
'Open 24/7',
800,
1,
1,
1,
1,
4.8),

('St Johns Medical College Hospital',
'Sarjapur Road',
'Bengaluru',
'560034',
12.9352,
77.6245,
5.90,
18,
'08022065000',
NULL,
'info@stjohns.in',
'Specialty',
'Open 24/7',
1200,
1,
1,
1,
1,
4.8),

('NIMHANS',
'Hosur Road',
'Bengaluru',
'560029',
12.9431,
77.5969,
5.00,
15,
'08026995000',
NULL,
'hospital@nimhans.ac.in',
'Government',
'Open 24/7',
950,
1,
1,
1,
1,
4.9),

('Sri Jayadeva Institute of Cardiovascular Sciences',
'Bannerghatta Road',
'Bengaluru',
'560069',
12.9128,
77.5993,
6.70,
17,
'08022977200',
NULL,
'info@jayadevainstitute.org',
'Government',
'Open 24/7',
750,
1,
1,
1,
1,
4.8);
-- ────────────────────────────────────────────────────────────
-- doctors
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS doctors;
CREATE TABLE doctors (
  doctor_id   INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT NOT NULL,
  doctor_name VARCHAR(120) NOT NULL,
  specialty   VARCHAR(80),
  phone       VARCHAR(20),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

INSERT INTO doctors (hospital_id, doctor_name, specialty, phone) VALUES
  (1, 'Dr. Anita Rao', 'General Physician', '+91 90000 00001'),
  (1, 'Dr. Kiran Shetty', 'Pediatrics', '+91 90000 00002'),
  (2, 'Dr. Meera Iyer', 'Gynecology', '+91 90000 00003'),
  (4, 'Dr. Suresh Naik', 'Orthopedics', '+91 90000 00004'),
-- Hospital 1
(1,'Dr. Rajesh Kumar','General Physician','9876500001'),
(1,'Dr. Priya Sharma','Cardiologist','9876500002'),
(1,'Dr. Arjun Reddy','Neurologist','9876500003'),
(1,'Dr. Sneha Rao','Orthopedic Surgeon','9876500004'),
-- Hospital 2
(2,'Dr. Vivek Jain','General Physician','9876500005'),
(2,'Dr. Meera Nair','Pediatrician','9876500006'),
(2,'Dr. Rohit Bhat','Dermatologist','9876500007'),
-- Hospital 3
(3,'Dr. Kavya Rao','ENT Specialist','9876500008'),
(3,'Dr. Anil Kumar','Gynecologist','9876500009'),
(3,'Dr. Pooja Iyer','Dentist','9876500010'),
-- Hospital 4
(4,'Dr. Sanjay Gupta','Cardiologist','9876500011'),
(4,'Dr. Neha Kapoor','General Physician','9876500012'),
(4,'Dr. Rahul Singh','Neurologist','9876500013'),
(4,'Dr. Mohan Rao','Orthopedic Surgeon','9876500014'),
-- Hospital 5
(5,'Dr. Harish Patil','General Physician','9876500015'),
(5,'Dr. Ritu Sharma','Pediatrician','9876500016'),
(5,'Dr. Akash Verma','Dermatologist','9876500017'),
-- Hospital 6
(6,'Dr. Siddharth Rao','Cardiologist','9876500018'),
(6,'Dr. Divya Shetty','General Physician','9876500019'),
(6,'Dr. Ramesh Babu','Orthopedic Surgeon','9876500020'),
-- Hospital 7
(7,'Dr. Asha Menon','Neurologist','9876500021'),
(7,'Dr. Kiran Shetty','General Physician','9876500022'),
(7,'Dr. Nisha Gupta','Pediatrician','9876500023'),
-- Hospital 8
(8,'Dr. Vinay Kulkarni','Cardiologist','9876500024'),
(8,'Dr. Swathi Rao','ENT Specialist','9876500025'),
(8,'Dr. Mahesh Gowda','General Physician','9876500026'),
-- Hospital 9
(9,'Dr. Lakshmi Prasad','Gynecologist','9876500027'),
(9,'Dr. Shilpa Patil','Pediatrician','9876500028'),
(9,'Dr. Naveen Kumar','General Physician','9876500029'),
-- Hospital 10
(10,'Dr. Ananya Rao','Cardiologist','9876500030'),
(10,'Dr. Karthik Reddy','Orthopedic Surgeon','9876500031'),
(10,'Dr. Deepa Nair','Dermatologist','9876500032'),
-- Hospital 11
(11,'Dr. Sunil Joshi','General Physician','9876500033'),
(11,'Dr. Kavitha Rao','Neurologist','9876500034'),
(11,'Dr. Manoj Bhat','Dentist','9876500035'),
-- Hospital 12
(12,'Dr. Rekha Shetty','Cardiologist','9876500036'),
(12,'Dr. Gopal Krishna','ENT Specialist','9876500037'),
(12,'Dr. Ashwini Patil','General Physician','9876500038'),
-- Hospital 13
(13,'Dr. Ravi Verma','Orthopedic Surgeon','9876500039'),
(13,'Dr. Shruthi Rao','Gynecologist','9876500040'),
(13,'Dr. Ajay Kumar','General Physician','9876500041'),
-- Hospital 14
(14,'Dr. Sahana Iyer','Pediatrician','9876500042'),
(14,'Dr. Vishal Mehta','Cardiologist','9876500043'),
(14,'Dr. Bhavana Rao','Neurologist','9876500044'),
-- Hospital 15
(15,'Dr. Prakash Gowda','General Physician','9876500045'),
(15,'Dr. Jyothi Kulkarni','Dermatologist','9876500046'),
(15,'Dr. Anand Shetty','ENT Specialist','9876500047'),
(15,'Dr. Rekha Nair','Dentist','9876500048'),
(15,'Dr. Suresh Hegde','Orthopedic Surgeon','9876500049'),
(15,'Dr. Keerthi Rao','Cardiologist','9876500050');

-- ────────────────────────────────────────────────────────────
-- appointments
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
  appointment_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  doctor_id         INT NOT NULL,
  hospital_id       INT NOT NULL,
  appointment_date  DATE NOT NULL,
  appointment_time  VARCHAR(20) NOT NULL,
  symptoms          TEXT,
  status            VARCHAR(20) DEFAULT 'Booked',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- health_records
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS health_records;
CREATE TABLE health_records (
  record_id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  blood_pressure    VARCHAR(20),
  sugar_level       VARCHAR(20),
  height            VARCHAR(20),
  weight            VARCHAR(20),
  allergies         TEXT,
  chronic_diseases  TEXT,
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- prescriptions
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS prescriptions;
CREATE TABLE prescriptions (
  prescription_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  doctor_id        INT NULL,
  image_path       VARCHAR(255),
  diagnosis        TEXT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE SET NULL
);

-- ────────────────────────────────────────────────────────────
-- medicines / medicine_reminders / pharmacies
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS medicine_reminders;
DROP TABLE IF EXISTS medicines;
CREATE TABLE medicines (
  medicine_id    INT AUTO_INCREMENT PRIMARY KEY,
  medicine_name  VARCHAR(150) NOT NULL,
  description    TEXT,
  price          DECIMAL(8,2)
);

INSERT INTO medicines (medicine_name, description, price) VALUES
  ('Paracetamol 500mg', 'Fever / pain relief', 25.00),
  ('Cetirizine 10mg', 'Antihistamine', 18.00),
  ('Vitamin C 500mg', 'Supplement', 40.00),
('Paracetamol 500mg','Fever and pain relief',25.00),
('Dolo 650','Fever and body pain',35.00),
('Crocin Advance','Pain reliever',28.00),
('Cetirizine 10mg','Allergy relief',18.00),
('Levocetirizine','Allergy medicine',22.00),
('Azithromycin 500mg','Antibiotic',120.00),
('Amoxicillin 500mg','Antibiotic',95.00),
('Pantoprazole 40mg','Acidity treatment',48.00),
('Omeprazole','Acidity relief',40.00),
('Metformin 500mg','Diabetes medicine',55.00),
('Glimepiride','Diabetes treatment',65.00),
('Amlodipine 5mg','Blood pressure control',45.00),
('Telmisartan','Hypertension medicine',75.00),
('Atorvastatin','Cholesterol control',110.00),
('Rosuvastatin','Cholesterol medicine',130.00),
('Vitamin C 500mg','Immunity booster',40.00),
('Vitamin D3','Vitamin supplement',90.00),
('Calcium Tablets','Bone health',80.00),
('Iron Tablets','Iron deficiency',60.00),
('ORS Powder','Dehydration treatment',25.00),
('Insulin Injection','Diabetes insulin',350.00),
('Salbutamol Inhaler','Asthma inhaler',250.00),
('Montelukast','Asthma & allergy',120.00),
('Cough Syrup','Dry cough relief',75.00),
('Benadryl Syrup','Cold & cough',90.00),
('Diclofenac Gel','Pain relief gel',110.00),
('Ibuprofen 400mg','Painkiller',35.00),
('Zinc Tablets','Immunity support',70.00),
('Multivitamin Capsules','Daily vitamins',150.00),
('Electral Powder','Electrolyte supplement',30.00);

CREATE TABLE medicine_reminders (
  reminder_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  medicine_id    INT NOT NULL,
  dosage         VARCHAR(50),
  reminder_time  VARCHAR(20),
  frequency      VARCHAR(50),
  start_date     DATE,
  end_date       DATE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS pharmacies;
CREATE TABLE pharmacies (
  pharmacy_id    INT AUTO_INCREMENT PRIMARY KEY,
  pharmacy_name  VARCHAR(150) NOT NULL,
  address        VARCHAR(255),
  phone          VARCHAR(20),
  latitude       DECIMAL(10,6),
  longitude      DECIMAL(10,6)
);

INSERT INTO pharmacies (pharmacy_name, address, phone, latitude, longitude) VALUES
  ('Sai Medical Store', 'Bus Stand Road', '+91 90000 11111', 15.4315, 75.6205),
  ('Jan Aushadhi Kendra', 'Market Road', '+91 90000 22222', 15.4258, 75.6312),
('Apollo Pharmacy','MG Road, Bengaluru','9876543210',12.9750,77.6050),
('MedPlus Pharmacy','Indiranagar, Bengaluru','9876543211',12.9715,77.6400),
('Wellness Forever','Koramangala, Bengaluru','9876543212',12.9345,77.6110),
('Jan Aushadhi Kendra','Rajajinagar, Bengaluru','9876543213',12.9910,77.5550),
('Sai Medical Store','Gadag Bus Stand','9876543214',15.4315,75.6205),
('Life Care Pharmacy','Hubballi','9876543215',15.3647,75.1240),
('City Medicals','Dharwad','9876543216',15.4589,75.0078),
('Aster Pharmacy','Hebbal','9876543217',13.0458,77.5938),
('Fortis Pharmacy','Bannerghatta','9876543218',12.8935,77.5968),
('Narayana Pharmacy','Bommasandra','9876543219',12.8005,77.7042),
('Manipal Pharmacy','HAL Road','9876543220',12.9580,77.6490),
('HealthPlus Medicals','Jayanagar','9876543221',12.9250,77.5938),
('Medico Pharmacy','Whitefield','9876543222',12.9698,77.7500),
('Care Medicals','Mysuru','9876543223',12.2958,76.6394),
('Community Pharmacy','Belagavi','9876543224',15.8497,74.4977);

-- ────────────────────────────────────────────────────────────
-- symptom_history
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS symptom_history;
CREATE TABLE symptom_history (
  history_id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  symptoms        TEXT,
  ai_result       TEXT,
  recommendation  TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- emergency_contacts  (new, from database.sql — not yet wired
-- to database_manager.py; see note in chat)
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS emergency_contacts;
CREATE TABLE emergency_contacts (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT           NOT NULL,
  full_name    VARCHAR(120)  NOT NULL,
  relationship ENUM('Wife','Husband','Son','Daughter','Father','Mother',
                    'Brother','Sister','Friend','Neighbour','Doctor','Other') NOT NULL,
  phone        VARCHAR(20)   NOT NULL,
  phone_alt    VARCHAR(20),
  priority     TINYINT       NOT NULL DEFAULT 1,
  notify_sms   TINYINT(1)    DEFAULT 1,
  notify_call  TINYINT(1)    DEFAULT 1,
  active       TINYINT(1)    NOT NULL DEFAULT 1,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO emergency_contacts (user_id, full_name, relationship, phone, phone_alt, priority, notify_sms, notify_call) VALUES
  (1, 'Sunita Kumar', 'Wife', '+91 98765 43210', '+91 98765 43211', 1, 1, 1),
  (1, 'Raju Kumar',   'Son',  '+91 87654 32109', NULL, 2, 1, 1),
  (2, 'Lakshmi Rao',  'Wife', '+91 99887 76655', '+91 99887 76656', 1, 1, 1);

-- ────────────────────────────────────────────────────────────
-- sos_events  (richer version, from database.sql — matches
-- the columns save_sos() already inserts into)
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS sos_events;
CREATE TABLE sos_events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  service_type  ENUM('Ambulance','Police','Fire Brigade','Family') NOT NULL,
  number_called VARCHAR(20),
  latitude      DECIMAL(10,7),
  longitude     DECIMAL(10,7),
  triggered_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved      TINYINT(1) DEFAULT 0,
  notes         TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- Views
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_nearest_hospitals AS
SELECT id, name, address, city, distance_km, travel_mins,
       phone_primary, type, availability,
       emergency_ward, icu_available, blood_bank, ambulance, rating
FROM   hospitals
WHERE  active = 1
ORDER  BY distance_km ASC;

CREATE OR REPLACE VIEW v_primary_contacts AS
SELECT ec.user_id, u.full_name AS patient_name,
       ec.full_name AS contact_name, ec.relationship,
       ec.phone, ec.priority
FROM   emergency_contacts ec
JOIN   users u ON u.id = ec.user_id
WHERE  ec.active = 1 AND ec.priority = 1;

SET FOREIGN_KEY_CHECKS = 1;
SHOW COLUMNS FROM hospitals;

