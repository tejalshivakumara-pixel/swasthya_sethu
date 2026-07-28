import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()


class DatabaseManager:

    HOST = os.getenv("DB_HOST", "localhost")
    USER = os.getenv("DB_USER", "root")
    PASSWORD = os.getenv("DB_PASSWORD", "")
    DATABASE = os.getenv("DB_NAME", "swasthya_setu_v2")

    @staticmethod
    def get_connection():
        try:
            connection = mysql.connector.connect(
                host=DatabaseManager.HOST,
                user=DatabaseManager.USER,
                password=DatabaseManager.PASSWORD,
                database=DatabaseManager.DATABASE
            )
            return connection

        except Error as e:
            print("Database Connection Error:", e)
            return None

    # -------------------------------------------------------
    # Generic Execute Query
    # -------------------------------------------------------

    @staticmethod
    def execute_query(query, values=None):

        conn = DatabaseManager.get_connection()

        if conn is None:
            return False

        cursor = conn.cursor()

        try:

            if values:
                cursor.execute(query, values)
            else:
                cursor.execute(query)

            conn.commit()
            return True

        except Error as e:
            print("Database Error:", e)
            return False

        finally:
            cursor.close()
            conn.close()

    # -------------------------------------------------------
    # Fetch All Records
    # -------------------------------------------------------

    @staticmethod
    def fetch_all(query, values=None):

        conn = DatabaseManager.get_connection()

        if conn is None:
            return []

        cursor = conn.cursor(dictionary=True)

        try:

            if values:
                cursor.execute(query, values)
            else:
                cursor.execute(query)

            return cursor.fetchall()

        except Error as e:
            print("Database Error:", e)
            return []

        finally:
            cursor.close()
            conn.close()

    # -------------------------------------------------------
    # Fetch One Record
    # -------------------------------------------------------

    @staticmethod
    def fetch_one(query, values=None):

        conn = DatabaseManager.get_connection()

        if conn is None:
            return None

        cursor = conn.cursor(dictionary=True)

        try:

            if values:
                cursor.execute(query, values)
            else:
                cursor.execute(query)

            return cursor.fetchone()

        except Error as e:
            print("Database Error:", e)
            return None

        finally:
            cursor.close()
            conn.close()

    # -------------------------------------------------------
    # USER REGISTRATION
    # -------------------------------------------------------

    @staticmethod
    def register_user(name, email, password, phone, dob):

        query = """
        INSERT INTO users
        (full_name,email,password,phone,dob)
        VALUES(%s,%s,%s,%s,%s)
        """

        return DatabaseManager.execute_query(
            query,
            (name, email, password, phone, dob)
        )

    # -------------------------------------------------------
    # USER LOGIN
    # -------------------------------------------------------

    @staticmethod
    def login_user(email, password):

        query = """
        SELECT *
        FROM users
        WHERE email=%s
        AND password=%s
        """

        return DatabaseManager.fetch_one(
            query,
            (email, password)
        )

    # -------------------------------------------------------
    # HOSPITALS
    # -------------------------------------------------------

    @staticmethod
    def get_hospitals():

        query = """
        SELECT *
        FROM hospitals
        WHERE active=1
        ORDER BY distance_km ASC
        """

        return DatabaseManager.fetch_all(query)
            # -------------------------------------------------------
    # DOCTORS
    # -------------------------------------------------------

    @staticmethod
    def get_doctors(hospital_id):

        query = """
        SELECT *
        FROM doctors
        WHERE hospital_id=%s
        ORDER BY doctor_name ASC
        """

        return DatabaseManager.fetch_all(
            query,
            (hospital_id,)
        )

    @staticmethod
    def get_doctor(doctor_id):

        query = """
        SELECT *
        FROM doctors
        WHERE doctor_id=%s
        """

        return DatabaseManager.fetch_one(
            query,
            (doctor_id,)
        )

    # -------------------------------------------------------
    # APPOINTMENTS
    # -------------------------------------------------------

    @staticmethod
    def book_appointment(
        user_id,
        doctor_id,
        hospital_id,
        appointment_date,
        appointment_time,
        symptoms
    ):

        query = """
        INSERT INTO appointments
        (
            user_id,
            doctor_id,
            hospital_id,
            appointment_date,
            appointment_time,
            symptoms
        )
        VALUES
        (%s,%s,%s,%s,%s,%s)
        """

        return DatabaseManager.execute_query(
            query,
            (
                user_id,
                doctor_id,
                hospital_id,
                appointment_date,
                appointment_time,
                symptoms
            )
        )

    @staticmethod
    def get_user_appointments(user_id):

        query = """
        SELECT

            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.symptoms,

            d.doctor_name,
            d.specialty,

            h.name AS hospital_name,
            h.address

        FROM appointments a

        JOIN doctors d
        ON a.doctor_id=d.doctor_id

        JOIN hospitals h
        ON a.hospital_id=h.id

        WHERE a.user_id=%s

        ORDER BY
        a.appointment_date DESC,
        a.appointment_time DESC
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    @staticmethod
    def cancel_appointment(appointment_id):

        query = """
        UPDATE appointments
        SET status='Cancelled'
        WHERE appointment_id=%s
        """

        return DatabaseManager.execute_query(
            query,
            (appointment_id,)
        )

    @staticmethod
    def complete_appointment(appointment_id):

        query = """
        UPDATE appointments
        SET status='Completed'
        WHERE appointment_id=%s
        """

        return DatabaseManager.execute_query(
            query,
            (appointment_id,)
        )

    @staticmethod
    def get_today_appointments(user_id):

        query = """
        SELECT *

        FROM appointments

        WHERE

        user_id=%s

        AND appointment_date=CURDATE()

        ORDER BY appointment_time
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    @staticmethod
    def appointment_count():

        row = DatabaseManager.fetch_one(
            """
            SELECT COUNT(*) AS total
            FROM appointments
            """
        )

        return row["total"] if row else 0

    @staticmethod
    def hospital_count():

        row = DatabaseManager.fetch_one(
            """
            SELECT COUNT(*) AS total
            FROM hospitals
            """
        )

        return row["total"] if row else 0

    @staticmethod
    def doctor_count():

        row = DatabaseManager.fetch_one(
            """
            SELECT COUNT(*) AS total
            FROM doctors
            """
        )

        return row["total"] if row else 0
        # -------------------------------------------------------
    # HEALTH RECORDS
    # -------------------------------------------------------

    @staticmethod
    def save_health_record(
        user_id,
        blood_pressure,
        sugar_level,
        height,
        weight,
        allergies,
        chronic_diseases,
        notes
    ):

        query = """
        INSERT INTO health_records
        (
            user_id,
            blood_pressure,
            sugar_level,
            height,
            weight,
            allergies,
            chronic_diseases,
            notes
        )
        VALUES
        (%s,%s,%s,%s,%s,%s,%s,%s)
        """

        return DatabaseManager.execute_query(
            query,
            (
                user_id,
                blood_pressure,
                sugar_level,
                height,
                weight,
                allergies,
                chronic_diseases,
                notes
            )
        )

    @staticmethod
    def get_health_records(user_id):

        query = """
        SELECT *
        FROM health_records
        WHERE user_id=%s
        ORDER BY created_at DESC
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    # -------------------------------------------------------
    # PRESCRIPTIONS
    # -------------------------------------------------------

    @staticmethod
    def save_prescription(
        user_id,
        doctor_id,
        image_path,
        diagnosis
    ):

        query = """
        INSERT INTO prescriptions
        (
            user_id,
            doctor_id,
            image_path,
            diagnosis
        )
        VALUES
        (%s,%s,%s,%s)
        """

        return DatabaseManager.execute_query(
            query,
            (
                user_id,
                doctor_id,
                image_path,
                diagnosis
            )
        )

    @staticmethod
    def get_prescriptions(user_id):

        query = """
        SELECT *

        FROM prescriptions

        WHERE user_id=%s

        ORDER BY created_at DESC
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    # -------------------------------------------------------
    # MEDICINES
    # -------------------------------------------------------

    @staticmethod
    def get_medicines():

        query = """
        SELECT *
        FROM medicines
        ORDER BY medicine_name
        """

        return DatabaseManager.fetch_all(query)

    @staticmethod
    def get_medicine(medicine_id):

        query = """
        SELECT *
        FROM medicines
        WHERE medicine_id=%s
        """

        return DatabaseManager.fetch_one(
            query,
            (medicine_id,)
        )

    # -------------------------------------------------------
    # MEDICINE REMINDERS
    # -------------------------------------------------------

    @staticmethod
    def add_reminder(
        user_id,
        medicine_id,
        dosage,
        reminder_time,
        frequency,
        start_date,
        end_date
    ):

        query = """
        INSERT INTO medicine_reminders
        (
            user_id,
            medicine_id,
            dosage,
            reminder_time,
            frequency,
            start_date,
            end_date
        )
        VALUES
        (%s,%s,%s,%s,%s,%s,%s)
        """

        return DatabaseManager.execute_query(
            query,
            (
                user_id,
                medicine_id,
                dosage,
                reminder_time,
                frequency,
                start_date,
                end_date
            )
        )

    @staticmethod
    def get_reminders(user_id):

        query = """
        SELECT

            mr.*,
            m.medicine_name

        FROM medicine_reminders mr

        JOIN medicines m

        ON mr.medicine_id=m.medicine_id

        WHERE mr.user_id=%s

        ORDER BY mr.reminder_time
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    @staticmethod
    def delete_reminder(reminder_id):

        query = """
        DELETE FROM medicine_reminders
        WHERE reminder_id=%s
        """

        return DatabaseManager.execute_query(
            query,
            (reminder_id,)
        )
        # -------------------------------------------------------
    # PHARMACIES
    # -------------------------------------------------------

    @staticmethod
    def get_pharmacies():

        query = """
        SELECT *
        FROM pharmacies
        ORDER BY pharmacy_name
        """

        return DatabaseManager.fetch_all(query)

    # -------------------------------------------------------
    # AI SYMPTOM HISTORY
    # -------------------------------------------------------

    @staticmethod
    def save_symptom_history(
        user_id,
        symptoms,
        ai_result,
        recommendation
    ):

        query = """
        INSERT INTO symptom_history
        (
            user_id,
            symptoms,
            ai_result,
            recommendation
        )
        VALUES
        (%s,%s,%s,%s)
        """

        return DatabaseManager.execute_query(
            query,
            (
                user_id,
                symptoms,
                ai_result,
                recommendation
            )
        )

    @staticmethod
    def get_symptom_history(user_id):

        query = """
        SELECT *
        FROM symptom_history
        WHERE user_id=%s
        ORDER BY created_at DESC
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    # -------------------------------------------------------
    # SOS
    # -------------------------------------------------------

    @staticmethod
    def save_sos(
        user_id,
        service_type,
        number_called,
        latitude,
        longitude,
        notes
    ):

        query = """
        INSERT INTO sos_events
        (
            user_id,
            service_type,
            number_called,
            latitude,
            longitude,
            notes
        )
        VALUES
        (%s,%s,%s,%s,%s,%s)
        """

        return DatabaseManager.execute_query(
            query,
            (
                user_id,
                service_type,
                number_called,
                latitude,
                longitude,
                notes
            )
        )

    @staticmethod
    def get_sos_history(user_id):

        query = """
        SELECT *
        FROM sos_events
        WHERE user_id=%s
        ORDER BY triggered_at DESC
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    # -------------------------------------------------------
    # EMERGENCY CONTACTS
    # -------------------------------------------------------

    @staticmethod
    def get_emergency_contacts(user_id):

        query = """
        SELECT *
        FROM emergency_contacts
        WHERE user_id=%s
        AND active=1
        ORDER BY priority
        """

        return DatabaseManager.fetch_all(
            query,
            (user_id,)
        )

    # -------------------------------------------------------
    # DASHBOARD
    # -------------------------------------------------------

    @staticmethod
    def dashboard_counts():

        users = DatabaseManager.fetch_one(
            "SELECT COUNT(*) AS total FROM users"
        )

        hospitals = DatabaseManager.fetch_one(
            "SELECT COUNT(*) AS total FROM hospitals"
        )

        doctors = DatabaseManager.fetch_one(
            "SELECT COUNT(*) AS total FROM doctors"
        )

        appointments = DatabaseManager.fetch_one(
            "SELECT COUNT(*) AS total FROM appointments"
        )

        medicines = DatabaseManager.fetch_one(
            "SELECT COUNT(*) AS total FROM medicines"
        )

        return {
            "users": users["total"] if users else 0,
            "hospitals": hospitals["total"] if hospitals else 0,
            "doctors": doctors["total"] if doctors else 0,
            "appointments": appointments["total"] if appointments else 0,
            "medicines": medicines["total"] if medicines else 0
        }

    # -------------------------------------------------------
    # USER PROFILE
    # -------------------------------------------------------

    @staticmethod
    def get_user(user_id):

        query = """
        SELECT *
        FROM users
        WHERE id=%s
        """

        return DatabaseManager.fetch_one(
            query,
            (user_id,)
        )

    @staticmethod
    def update_profile(
        user_id,
        full_name,
        phone,
        blood_group,
        address,
        city,
        state
    ):

        query = """
        UPDATE users

        SET

        full_name=%s,
        phone=%s,
        blood_group=%s,
        address=%s,
        city=%s,
        state=%s

        WHERE id=%s
        """

        return DatabaseManager.execute_query(
            query,
            (
                full_name,
                phone,
                blood_group,
                address,
                city,
                state,
                user_id
            )
        )
    @staticmethod
    def get_nearby_hospitals(limit=3):
        query = """
        SELECT
            name,
            city,
            phone_primary,
            distance_km
        FROM hospitals
        WHERE active=1
        ORDER BY distance_km ASC
        LIMIT %s
        """

        return DatabaseManager.fetch_all(
        query,
        (limit,)
        )