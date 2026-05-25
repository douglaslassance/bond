CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"city" text NOT NULL,
	"venue" text,
	"description" text NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_location" (
	"user_id" text PRIMARY KEY NOT NULL,
	"city" text NOT NULL,
	"country_code" text,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"timezone" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_location" ADD CONSTRAINT "user_location_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_city_starts_idx" ON "event" USING btree ("city","starts_at");--> statement-breakpoint
CREATE INDEX "place_city_idx" ON "place" USING btree ("city");