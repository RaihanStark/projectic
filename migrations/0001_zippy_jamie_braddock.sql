CREATE TABLE "subtasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;