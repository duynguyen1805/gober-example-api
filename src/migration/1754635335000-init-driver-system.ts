import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDriverSystem1754635335000 implements MigrationInterface {
  name = 'InitDriverSystem1754635335000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "public"."driver_status_enum" AS ENUM('active', 'inactive', 'suspended')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."driver_approval_status_enum" AS ENUM('draft', 'pending', 'approved', 'rejected')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."request_status_enum" AS ENUM('pending', 'approved', 'rejected', 'cancelled')
    `);

    // Create supporting tables
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "admin_id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_admins_admin_id" PRIMARY KEY ("admin_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "provinces" (
        "province_id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_provinces_province_id" PRIMARY KEY ("province_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "files" (
        "file_id" SERIAL NOT NULL,
        "filename" character varying NOT NULL,
        "url" character varying NOT NULL,
        "mime_type" character varying,
        "file_extension" character varying,
        "size" integer,
        "uploaded_by_id" integer,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_files_file_id" PRIMARY KEY ("file_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "service_types" (
        "service_type_id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_service_types_service_type_id" PRIMARY KEY ("service_type_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "request_types" (
        "request_type_id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_request_types_request_type_id" PRIMARY KEY ("request_type_id")
      )
    `);

    // Create main tables
    await queryRunner.query(`
      CREATE TABLE "drivers" (
        "driver_id" SERIAL NOT NULL,
        "full_name" character varying,
        "phone_number" character varying NOT NULL,
        "email" character varying,
        "password" character varying,
        "device_token" character varying,
        "last_login" TIMESTAMP,
        "email_verified_at" TIMESTAMP,
        "avatar" integer,
        "active_area_id" integer,
        "temporary_address" character varying,
        "identity_card_front_id" integer,
        "identity_card_back_id" integer,
        "status" "public"."driver_status_enum" NOT NULL DEFAULT 'active',
        "submitted_at" TIMESTAMP,
        "approval_status" "public"."driver_approval_status_enum" NOT NULL DEFAULT 'draft',
        "approved_at" TIMESTAMP,
        "approved_by_id" integer,
        "approved_note" character varying,
        "created_by_id" integer,
        "balance" integer NOT NULL DEFAULT '0',
        "pin" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_drivers_driver_id" PRIMARY KEY ("driver_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_requests" (
        "driver_request_id" SERIAL NOT NULL,
        "code" character varying NOT NULL,
        "description" character varying NOT NULL,
        "type_id" integer NOT NULL,
        "status" "public"."request_status_enum" NOT NULL DEFAULT 'pending',
        "approved_by_id" integer,
        "approved_at" TIMESTAMP,
        "reason" character varying,
        "driver_id" integer NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_requests_driver_request_id" PRIMARY KEY ("driver_request_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_refresh_tokens" (
        "driver_refresh_token_id" SERIAL NOT NULL,
        "driver_id" integer NOT NULL,
        "token" character varying NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "device_token" character varying NOT NULL,
        "is_revoked" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_refresh_tokens_driver_refresh_token_id" PRIMARY KEY ("driver_refresh_token_id")
      )
    `);

    // Create additional tables for driver relationships
    await queryRunner.query(`
      CREATE TABLE "driver_banks" (
        "driver_bank_id" SERIAL NOT NULL,
        "driver_id" integer NOT NULL,
        "bank_name" character varying NOT NULL,
        "account_number" character varying NOT NULL,
        "account_holder_name" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_banks_driver_bank_id" PRIMARY KEY ("driver_bank_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_emergency_contacts" (
        "driver_emergency_contact_id" SERIAL NOT NULL,
        "driver_id" integer NOT NULL,
        "full_name" character varying NOT NULL,
        "phone_number" character varying NOT NULL,
        "relationship" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_emergency_contacts_driver_emergency_contact_id" PRIMARY KEY ("driver_emergency_contact_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_vehicles" (
        "driver_vehicle_id" SERIAL NOT NULL,
        "driver_id" integer NOT NULL,
        "license_plate" character varying NOT NULL,
        "vehicle_type" character varying NOT NULL,
        "brand" character varying NOT NULL,
        "model" character varying NOT NULL,
        "year" integer NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_vehicles_driver_vehicle_id" PRIMARY KEY ("driver_vehicle_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_signatures" (
        "driver_signature_id" SERIAL NOT NULL,
        "driver_id" integer NOT NULL,
        "signature_data" character varying NOT NULL,
        "signature_type" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_signatures_driver_signature_id" PRIMARY KEY ("driver_signature_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_uniforms" (
        "driver_uniform_id" SERIAL NOT NULL,
        "driver_id" integer NOT NULL,
        "uniform_type" character varying NOT NULL,
        "size" character varying NOT NULL,
        "quantity" integer NOT NULL,
        "issued_date" TIMESTAMP NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_uniforms_driver_uniform_id" PRIMARY KEY ("driver_uniform_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_availabilities" (
        "driver_availability_id" SERIAL NOT NULL,
        "driver_id" integer NOT NULL,
        "day_of_week" integer NOT NULL,
        "start_time" character varying NOT NULL,
        "end_time" character varying NOT NULL,
        "is_available" boolean NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_driver_availabilities_driver_availability_id" PRIMARY KEY ("driver_availability_id")
      )
    `);

    // Create junction tables
    await queryRunner.query(`
      CREATE TABLE "driver_service_types" (
        "driver_id" integer NOT NULL,
        "service_type_id" integer NOT NULL,
        CONSTRAINT "PK_bb0b4c1f7b2c5c5c5c5c5c5c5c5" PRIMARY KEY ("driver_id", "service_type_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "driver_request_files" (
        "driver_request_id" integer NOT NULL,
        "file_id" integer NOT NULL,
        CONSTRAINT "PK_cc0b4c1f7b2c5c5c5c5c5c5c5c5" PRIMARY KEY ("driver_request_id", "file_id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "drivers" ADD CONSTRAINT "FK_drivers_approved_by_id" 
      FOREIGN KEY ("approved_by_id") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "drivers" ADD CONSTRAINT "FK_drivers_created_by_id" 
      FOREIGN KEY ("created_by_id") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "drivers" ADD CONSTRAINT "FK_drivers_active_area_id" 
      FOREIGN KEY ("active_area_id") REFERENCES "provinces"("province_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "drivers" ADD CONSTRAINT "FK_drivers_identity_card_front_id" 
      FOREIGN KEY ("identity_card_front_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "drivers" ADD CONSTRAINT "FK_drivers_identity_card_back_id" 
      FOREIGN KEY ("identity_card_back_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "drivers" ADD CONSTRAINT "FK_drivers_avatar" 
      FOREIGN KEY ("avatar") REFERENCES "files"("file_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_driver_requests_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_driver_requests_approved_by_id" 
      FOREIGN KEY ("approved_by_id") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_driver_requests_type_id" 
      FOREIGN KEY ("type_id") REFERENCES "request_types"("request_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_refresh_tokens" ADD CONSTRAINT "FK_driver_refresh_tokens_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_service_types" ADD CONSTRAINT "FK_driver_service_types_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_service_types" ADD CONSTRAINT "FK_driver_service_types_service_type_id" 
      FOREIGN KEY ("service_type_id") REFERENCES "service_types"("service_type_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_request_files" ADD CONSTRAINT "FK_driver_request_files_driver_request_id" 
      FOREIGN KEY ("driver_request_id") REFERENCES "driver_requests"("driver_request_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_request_files" ADD CONSTRAINT "FK_driver_request_files_file_id" 
      FOREIGN KEY ("file_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Add foreign key constraint for files uploaded_by_id
    await queryRunner.query(`
      ALTER TABLE "files" ADD CONSTRAINT "FK_files_uploaded_by_id" 
      FOREIGN KEY ("uploaded_by_id") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Add foreign key constraints for additional tables
    await queryRunner.query(`
      ALTER TABLE "driver_banks" ADD CONSTRAINT "FK_driver_banks_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_emergency_contacts" ADD CONSTRAINT "FK_driver_emergency_contacts_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_driver_vehicles_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_signatures" ADD CONSTRAINT "FK_driver_signatures_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_driver_uniforms_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "driver_availabilities" ADD CONSTRAINT "FK_driver_availabilities_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("driver_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Add indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_drivers_phone_number" ON "drivers" ("phone_number")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_drivers_email" ON "drivers" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_drivers_status" ON "drivers" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_drivers_approval_status" ON "drivers" ("approval_status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_driver_requests_code" ON "driver_requests" ("code")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_driver_requests_driver_id" ON "driver_requests" ("driver_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_driver_requests_status" ON "driver_requests" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_driver_refresh_tokens_driver_id" ON "driver_refresh_tokens" ("driver_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_driver_refresh_tokens_token" ON "driver_refresh_tokens" ("token")
    `);

    // Insert sample data
    await queryRunner.query(`
      INSERT INTO "admins" ("name", "email", "password") VALUES 
      ('Admin User', 'admin@example.com', '$2b$10$encrypted_password_hash')
    `);

    await queryRunner.query(`
      INSERT INTO "provinces" ("name") VALUES 
      ('Ho Chi Minh City'),
      ('Ha Noi'),
      ('Da Nang'),
      ('Can Tho')
    `);

    await queryRunner.query(`
      INSERT INTO "service_types" ("name", "description") VALUES 
      ('Food Delivery', 'Food delivery service'),
      ('Grocery Delivery', 'Grocery delivery service'),
      ('Package Delivery', 'Package delivery service'),
      ('Ride Sharing', 'Ride sharing service')
    `);

    await queryRunner.query(`
      INSERT INTO "request_types" ("name", "description") VALUES 
      ('Leave Request', 'Request for leave'),
      ('Equipment Request', 'Request for equipment'),
      ('Support Request', 'Request for support'),
      ('Payment Request', 'Request for payment')
    `);

    // Seed sample files
    await queryRunner.query(`
      INSERT INTO "files" ("filename", "url", "mime_type", "file_extension", "size", "uploaded_by_id") VALUES 
      ('avatar-john.png', '/uploads/avatar-john.png', 'image/png', 'png', 204800, (SELECT admin_id FROM "admins" LIMIT 1)),
      ('id-front-john.png', '/uploads/id-front-john.png', 'image/png', 'png', 102400, (SELECT admin_id FROM "admins" LIMIT 1)),
      ('id-back-john.png', '/uploads/id-back-john.png', 'image/png', 'png', 102400, (SELECT admin_id FROM "admins" LIMIT 1)),
      ('contract-jane.pdf', '/uploads/contract-jane.pdf', 'application/pdf', 'pdf', 512000, (SELECT admin_id FROM "admins" LIMIT 1))
    `);

    // Seed sample drivers
    await queryRunner.query(`
      INSERT INTO "drivers" (
        "full_name", "phone_number", "email", "active_area_id", "approved_by_id", "created_by_id", "balance"
      ) VALUES 
      (
        'John Driver', '+84901234567', 'john.driver@example.com',
        (SELECT province_id FROM "provinces" WHERE name = 'Ho Chi Minh City' LIMIT 1),
        (SELECT admin_id FROM "admins" LIMIT 1),
        (SELECT admin_id FROM "admins" LIMIT 1),
        0
      ),
      (
        'Jane Driver', '+84918888888', 'jane.driver@example.com',
        (SELECT province_id FROM "provinces" WHERE name = 'Ha Noi' LIMIT 1),
        (SELECT admin_id FROM "admins" LIMIT 1),
        (SELECT admin_id FROM "admins" LIMIT 1),
        0
      )
    `);

    // Map drivers to service types
    await queryRunner.query(`
      INSERT INTO "driver_service_types" ("driver_id", "service_type_id")
      SELECT d.driver_id, st.service_type_id
      FROM "drivers" d
      JOIN "service_types" st ON st.name IN ('Food Delivery', 'Ride Sharing')
      WHERE d.phone_number IN ('+84901234567', '+84918888888')
    `);

    // Seed driver requests
    await queryRunner.query(`
      INSERT INTO "driver_requests" (
        "code", "description", "type_id", "status", "driver_id"
      ) VALUES 
      (
        'REQ-0001', 'Request leave for 1 day',
        (SELECT request_type_id FROM "request_types" WHERE name = 'Leave Request' LIMIT 1),
        'pending',
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1)
      ),
      (
        'REQ-0002', 'Request equipment: helmet',
        (SELECT request_type_id FROM "request_types" WHERE name = 'Equipment Request' LIMIT 1),
        'approved',
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1)
      )
    `);

    // Seed driver refresh tokens
    await queryRunner.query(`
      INSERT INTO "driver_refresh_tokens" (
        "driver_id", "token", "expires_at", "device_token", "is_revoked"
      ) VALUES 
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1),
        'sample-refresh-token-1', now() + interval '30 days', 'device-token-1', false
      ),
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1),
        'sample-refresh-token-2', now() + interval '30 days', 'device-token-2', false
      )
    `);

    // Seed driver banks
    await queryRunner.query(`
      INSERT INTO "driver_banks" (
        "driver_id", "bank_name", "account_number", "account_holder_name"
      ) VALUES 
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1),
        'Vietcombank', '0123456789', 'John Driver'
      ),
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1),
        'Techcombank', '9876543210', 'Jane Driver'
      )
    `);

    // Seed driver emergency contacts
    await queryRunner.query(`
      INSERT INTO "driver_emergency_contacts" (
        "driver_id", "full_name", "phone_number", "relationship"
      ) VALUES 
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1),
        'Mike Driver', '+84123456789', 'Brother'
      ),
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1),
        'Anna Driver', '+84999888777', 'Sister'
      )
    `);

    // Seed driver vehicles
    await queryRunner.query(`
      INSERT INTO "driver_vehicles" (
        "driver_id", "license_plate", "vehicle_type", "brand", "model", "year"
      ) VALUES 
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1),
        '59A1-123.45', 'motorbike', 'Honda', 'Wave', 2020
      ),
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1),
        '30B1-678.90', 'motorbike', 'Yamaha', 'Sirius', 2021
      )
    `);

    // Seed driver signatures
    await queryRunner.query(`
      INSERT INTO "driver_signatures" (
        "driver_id", "signature_data", "signature_type"
      ) VALUES 
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1),
        'signed-by-john-base64', 'image/png'
      ),
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1),
        'signed-by-jane-base64', 'image/png'
      )
    `);

    // Seed driver uniforms
    await queryRunner.query(`
      INSERT INTO "driver_uniforms" (
        "driver_id", "uniform_type", "size", "quantity", "issued_date"
      ) VALUES 
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1),
        'T-Shirt', 'L', 2, now()
      ),
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1),
        'Jacket', 'M', 1, now()
      )
    `);

    // Seed driver availabilities
    await queryRunner.query(`
      INSERT INTO "driver_availabilities" (
        "driver_id", "day_of_week", "start_time", "end_time", "is_available"
      ) VALUES 
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84901234567' LIMIT 1), 1, '08:00', '17:00', true
      ),
      (
        (SELECT driver_id FROM "drivers" WHERE phone_number = '+84918888888' LIMIT 1), 2, '09:00', '18:00', true
      )
    `);

    // Link driver requests with files
    await queryRunner.query(`
      INSERT INTO "driver_request_files" ("driver_request_id", "file_id") VALUES 
      (
        (SELECT driver_request_id FROM "driver_requests" WHERE code = 'REQ-0001' LIMIT 1),
        (SELECT file_id FROM "files" WHERE filename = 'id-front-john.png' LIMIT 1)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_driver_refresh_tokens_token"`);
    await queryRunner.query(`DROP INDEX "IDX_driver_refresh_tokens_driver_id"`);
    await queryRunner.query(`DROP INDEX "IDX_driver_requests_status"`);
    await queryRunner.query(`DROP INDEX "IDX_driver_requests_driver_id"`);
    await queryRunner.query(`DROP INDEX "IDX_driver_requests_code"`);
    await queryRunner.query(`DROP INDEX "IDX_drivers_approval_status"`);
    await queryRunner.query(`DROP INDEX "IDX_drivers_status"`);
    await queryRunner.query(`DROP INDEX "IDX_drivers_email"`);
    await queryRunner.query(`DROP INDEX "IDX_drivers_phone_number"`);

    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "driver_request_files" DROP CONSTRAINT "FK_driver_request_files_file_id"`);
    await queryRunner.query(`ALTER TABLE "driver_request_files" DROP CONSTRAINT "FK_driver_request_files_driver_request_id"`);
    await queryRunner.query(`ALTER TABLE "driver_service_types" DROP CONSTRAINT "FK_driver_service_types_service_type_id"`);
    await queryRunner.query(`ALTER TABLE "driver_service_types" DROP CONSTRAINT "FK_driver_service_types_driver_id"`);
    await queryRunner.query(`ALTER TABLE "driver_refresh_tokens" DROP CONSTRAINT "FK_driver_refresh_tokens_driver_id"`);
    await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_driver_requests_type_id"`);
    await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_driver_requests_approved_by_id"`);
    await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_driver_requests_driver_id"`);
    await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_drivers_avatar"`);
    await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_drivers_identity_card_back_id"`);
    await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_drivers_identity_card_front_id"`);
    await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_drivers_active_area_id"`);
    await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_drivers_created_by_id"`);
    await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_drivers_approved_by_id"`);

    // Drop foreign key constraints for additional tables
    await queryRunner.query(`ALTER TABLE "driver_availabilities" DROP CONSTRAINT "FK_driver_availabilities_driver_id"`);
    await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_driver_uniforms_driver_id"`);
    await queryRunner.query(`ALTER TABLE "driver_signatures" DROP CONSTRAINT "FK_driver_signatures_driver_id"`);
    await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_driver_vehicles_driver_id"`);
    await queryRunner.query(`ALTER TABLE "driver_emergency_contacts" DROP CONSTRAINT "FK_driver_emergency_contacts_driver_id"`);
    await queryRunner.query(`ALTER TABLE "driver_banks" DROP CONSTRAINT "FK_driver_banks_driver_id"`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_files_uploaded_by_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "driver_request_files"`);
    await queryRunner.query(`DROP TABLE "driver_service_types"`);
    await queryRunner.query(`DROP TABLE "driver_availabilities"`);
    await queryRunner.query(`DROP TABLE "driver_uniforms"`);
    await queryRunner.query(`DROP TABLE "driver_signatures"`);
    await queryRunner.query(`DROP TABLE "driver_vehicles"`);
    await queryRunner.query(`DROP TABLE "driver_emergency_contacts"`);
    await queryRunner.query(`DROP TABLE "driver_banks"`);
    await queryRunner.query(`DROP TABLE "driver_refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "driver_requests"`);
    await queryRunner.query(`DROP TABLE "drivers"`);
    await queryRunner.query(`DROP TABLE "request_types"`);
    await queryRunner.query(`DROP TABLE "service_types"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "provinces"`);
    await queryRunner.query(`DROP TABLE "admins"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."request_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."driver_approval_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."driver_status_enum"`);
  }
} 