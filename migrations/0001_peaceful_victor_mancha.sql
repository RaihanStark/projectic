CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"label" varchar(100),
	"status" varchar(20) DEFAULT 'todo' NOT NULL,
	"urgency" varchar(20) DEFAULT 'medium' NOT NULL,
	"deadline" timestamp,
	"is_starred" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
