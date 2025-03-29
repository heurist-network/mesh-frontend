CREATE TABLE IF NOT EXISTS "NewChat" (
	"id" varchar PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"userId" varchar NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NewDocument" (
	"id" varchar NOT NULL,
	"createdAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"text" varchar DEFAULT 'text' NOT NULL,
	"userId" varchar NOT NULL,
	CONSTRAINT "NewDocument_id_createdAt_pk" PRIMARY KEY("id","createdAt")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NewMessage" (
	"id" varchar PRIMARY KEY NOT NULL,
	"chatId" varchar NOT NULL,
	"role" varchar NOT NULL,
	"content" json NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NewSuggestion" (
	"id" varchar NOT NULL,
	"documentId" varchar NOT NULL,
	"documentCreatedAt" timestamp NOT NULL,
	"originalText" text NOT NULL,
	"suggestedText" text NOT NULL,
	"description" text,
	"isResolved" boolean DEFAULT false NOT NULL,
	"userId" varchar NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "NewSuggestion_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NewUser" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NewVote" (
	"chatId" varchar NOT NULL,
	"messageId" varchar NOT NULL,
	"isUpvoted" boolean NOT NULL,
	CONSTRAINT "NewVote_chatId_messageId_pk" PRIMARY KEY("chatId","messageId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NewChat" ADD CONSTRAINT "NewChat_userId_NewUser_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."NewUser"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NewDocument" ADD CONSTRAINT "NewDocument_userId_NewUser_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."NewUser"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NewMessage" ADD CONSTRAINT "NewMessage_chatId_NewChat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."NewChat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NewSuggestion" ADD CONSTRAINT "NewSuggestion_userId_NewUser_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."NewUser"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NewSuggestion" ADD CONSTRAINT "NewSuggestion_documentId_documentCreatedAt_NewDocument_id_createdAt_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."NewDocument"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NewVote" ADD CONSTRAINT "NewVote_chatId_NewChat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."NewChat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NewVote" ADD CONSTRAINT "NewVote_messageId_NewMessage_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."NewMessage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
