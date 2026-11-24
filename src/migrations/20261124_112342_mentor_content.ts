import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_study_methods_kind" AS ENUM('uitleg', 'zelf');
  CREATE TYPE "public"."enum_participants_role" AS ENUM('mentor', 'mentee');
  CREATE TYPE "public"."enum_appointments_status" AS ENUM('proposed', 'confirmed', 'cancelled');
  CREATE TYPE "public"."enum_appointments_place" AS ENUM('online', 'bibliotheek');
  CREATE TABLE "study_phases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "study_methods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"kind" "enum_study_methods_kind" NOT NULL,
  	"minutes" numeric DEFAULT 10,
  	"href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "study_methods_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"study_phases_id" integer
  );
  
  CREATE TABLE "mentor_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"invite_code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "participants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"group_id" integer NOT NULL,
  	"role" "enum_participants_role" NOT NULL,
  	"token_hash" varchar NOT NULL,
  	"availability" jsonb DEFAULT '[]'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "appointments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"group_id" integer NOT NULL,
  	"proposer_id" integer NOT NULL,
  	"partner_id" integer NOT NULL,
  	"starts_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_appointments_status" DEFAULT 'proposed' NOT NULL,
  	"place" "enum_appointments_place" DEFAULT 'bibliotheek' NOT NULL,
  	"request_id" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "study_phases_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "study_methods_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mentor_groups_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "participants_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appointments_id" integer;
  ALTER TABLE "study_methods_rels" ADD CONSTRAINT "study_methods_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."study_methods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "study_methods_rels" ADD CONSTRAINT "study_methods_rels_study_phases_fk" FOREIGN KEY ("study_phases_id") REFERENCES "public"."study_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "participants" ADD CONSTRAINT "participants_group_id_mentor_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."mentor_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_group_id_mentor_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."mentor_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_proposer_id_participants_id_fk" FOREIGN KEY ("proposer_id") REFERENCES "public"."participants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_partner_id_participants_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."participants"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "study_phases_slug_idx" ON "study_phases" USING btree ("slug");
  CREATE INDEX "study_phases_updated_at_idx" ON "study_phases" USING btree ("updated_at");
  CREATE INDEX "study_phases_created_at_idx" ON "study_phases" USING btree ("created_at");
  CREATE UNIQUE INDEX "study_methods_slug_idx" ON "study_methods" USING btree ("slug");
  CREATE INDEX "study_methods_updated_at_idx" ON "study_methods" USING btree ("updated_at");
  CREATE INDEX "study_methods_created_at_idx" ON "study_methods" USING btree ("created_at");
  CREATE INDEX "study_methods_rels_order_idx" ON "study_methods_rels" USING btree ("order");
  CREATE INDEX "study_methods_rels_parent_idx" ON "study_methods_rels" USING btree ("parent_id");
  CREATE INDEX "study_methods_rels_path_idx" ON "study_methods_rels" USING btree ("path");
  CREATE INDEX "study_methods_rels_study_phases_id_idx" ON "study_methods_rels" USING btree ("study_phases_id");
  CREATE UNIQUE INDEX "mentor_groups_invite_code_idx" ON "mentor_groups" USING btree ("invite_code");
  CREATE INDEX "mentor_groups_updated_at_idx" ON "mentor_groups" USING btree ("updated_at");
  CREATE INDEX "mentor_groups_created_at_idx" ON "mentor_groups" USING btree ("created_at");
  CREATE INDEX "participants_group_idx" ON "participants" USING btree ("group_id");
  CREATE UNIQUE INDEX "participants_token_hash_idx" ON "participants" USING btree ("token_hash");
  CREATE INDEX "participants_updated_at_idx" ON "participants" USING btree ("updated_at");
  CREATE INDEX "participants_created_at_idx" ON "participants" USING btree ("created_at");
  CREATE INDEX "appointments_group_idx" ON "appointments" USING btree ("group_id");
  CREATE INDEX "appointments_proposer_idx" ON "appointments" USING btree ("proposer_id");
  CREATE INDEX "appointments_partner_idx" ON "appointments" USING btree ("partner_id");
  CREATE INDEX "appointments_starts_at_idx" ON "appointments" USING btree ("starts_at");
  CREATE UNIQUE INDEX "appointments_request_id_idx" ON "appointments" USING btree ("request_id");
  CREATE INDEX "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
  CREATE INDEX "appointments_created_at_idx" ON "appointments" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_study_phases_fk" FOREIGN KEY ("study_phases_id") REFERENCES "public"."study_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_study_methods_fk" FOREIGN KEY ("study_methods_id") REFERENCES "public"."study_methods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mentor_groups_fk" FOREIGN KEY ("mentor_groups_id") REFERENCES "public"."mentor_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_participants_fk" FOREIGN KEY ("participants_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_study_phases_id_idx" ON "payload_locked_documents_rels" USING btree ("study_phases_id");
  CREATE INDEX "payload_locked_documents_rels_study_methods_id_idx" ON "payload_locked_documents_rels" USING btree ("study_methods_id");
  CREATE INDEX "payload_locked_documents_rels_mentor_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("mentor_groups_id");
  CREATE INDEX "payload_locked_documents_rels_participants_id_idx" ON "payload_locked_documents_rels" USING btree ("participants_id");
  CREATE INDEX "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "study_phases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "study_methods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "study_methods_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mentor_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "participants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "appointments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "study_phases" CASCADE;
  DROP TABLE "study_methods" CASCADE;
  DROP TABLE "study_methods_rels" CASCADE;
  DROP TABLE "mentor_groups" CASCADE;
  DROP TABLE "participants" CASCADE;
  DROP TABLE "appointments" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_study_phases_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_study_methods_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_mentor_groups_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_participants_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appointments_fk";
  
  DROP INDEX "payload_locked_documents_rels_study_phases_id_idx";
  DROP INDEX "payload_locked_documents_rels_study_methods_id_idx";
  DROP INDEX "payload_locked_documents_rels_mentor_groups_id_idx";
  DROP INDEX "payload_locked_documents_rels_participants_id_idx";
  DROP INDEX "payload_locked_documents_rels_appointments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "study_phases_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "study_methods_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "mentor_groups_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "participants_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appointments_id";
  DROP TYPE "public"."enum_study_methods_kind";
  DROP TYPE "public"."enum_participants_role";
  DROP TYPE "public"."enum_appointments_status";
  DROP TYPE "public"."enum_appointments_place";`)
}
