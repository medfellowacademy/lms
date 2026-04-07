-- =============================================================================
-- IBMP Platform - Database Schema
-- =============================================================================
-- Run after 001_create_database.sql
-- Connect to ibmp_production database first: \c ibmp_production
-- =============================================================================

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'INSTRUCTOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TEXT', 'QUIZ', 'INTERACTIVE', 'VR_SIMULATION', 'CASE_STUDY', 'LIVE_SESSION');
CREATE TYPE "ResourceType" AS ENUM ('PDF', 'IMAGE', 'DOCUMENT', 'LINK', 'DOWNLOAD');
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE "QuizType" AS ENUM ('STANDARD', 'ADAPTIVE', 'CERTIFICATION', 'PRACTICE', 'BOARD_PREP');
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'SHORT_ANSWER', 'CASE_BASED', 'IMAGE_BASED', 'MATCHING');
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');
CREATE TYPE "AIMode" AS ENUM ('CHAT', 'SOCRATIC', 'QUIZ', 'CASE_STUDY', 'EXAM_PREP');
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');
CREATE TYPE "PostType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'POLL', 'ARTICLE', 'CASE_STUDY');
CREATE TYPE "ProposalCategory" AS ENUM ('CURRICULUM', 'FEATURE', 'PARTNERSHIP', 'COMMUNITY', 'OTHER');
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PASSED', 'REJECTED', 'EXECUTED', 'CANCELLED');
CREATE TYPE "VoteType" AS ENUM ('FOR', 'AGAINST', 'ABSTAIN');
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'DATA_COLLECTION', 'ANALYSIS', 'REVIEW', 'COMPLETED', 'PUBLISHED');
CREATE TYPE "MentorshipStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE "NotificationType" AS ENUM ('ACHIEVEMENT', 'COURSE', 'CERTIFICATE', 'SOCIAL', 'COMMUNITY', 'SYSTEM', 'AI_TUTOR');

-- =============================================================================
-- USERS TABLE
-- =============================================================================

CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "medicalTitle" TEXT,
    "currentRole" TEXT,
    "specialty" TEXT,
    "institution" TEXT,
    "country" TEXT,
    "yearsOfExperience" INTEGER,
    "medicalLicense" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT 'Intern',
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "auth0Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_auth0Id_key" ON "User"("auth0Id");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_auth0Id_idx" ON "User"("auth0Id");

-- =============================================================================
-- COURSES TABLE
-- =============================================================================

CREATE TABLE "Course" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "thumbnail" TEXT,
    "previewVideo" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "duration" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "prerequisites" TEXT[],
    "learningOutcomes" TEXT[],
    "targetAudience" TEXT[],
    "enrollmentCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "xpReward" INTEGER NOT NULL DEFAULT 100,
    "certificateId" TEXT,
    "instructorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE INDEX "Course_slug_idx" ON "Course"("slug");
CREATE INDEX "Course_category_idx" ON "Course"("category");
CREATE INDEX "Course_status_idx" ON "Course"("status");

-- =============================================================================
-- MODULES TABLE
-- =============================================================================

CREATE TABLE "Module" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");

-- =============================================================================
-- LESSONS TABLE
-- =============================================================================

CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "order" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "videoProvider" TEXT,
    "videoDuration" INTEGER,
    "type" "LessonType" NOT NULL DEFAULT 'VIDEO',
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Lesson_moduleId_idx" ON "Lesson"("moduleId");

-- =============================================================================
-- RESOURCES TABLE
-- =============================================================================

CREATE TABLE "Resource" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Resource_lessonId_idx" ON "Resource"("lessonId");

-- =============================================================================
-- ENROLLMENTS TABLE
-- =============================================================================

CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- =============================================================================
-- LESSON PROGRESS TABLE
-- =============================================================================

CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "watchTime" INTEGER NOT NULL DEFAULT 0,
    "lastPosition" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- =============================================================================
-- QUIZZES TABLE
-- =============================================================================

CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "timeLimit" INTEGER,
    "passingScore" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT true,
    "showResults" BOOLEAN NOT NULL DEFAULT true,
    "type" "QuizType" NOT NULL DEFAULT 'STANDARD',
    "difficulty" "Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Quiz_lessonId_idx" ON "Quiz"("lessonId");

-- =============================================================================
-- QUESTIONS TABLE
-- =============================================================================

CREATE TABLE "Question" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "question" TEXT NOT NULL,
    "explanation" TEXT,
    "hint" TEXT,
    "type" "QuestionType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "imageUrl" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "topic" TEXT,
    "subtopic" TEXT,
    "quizId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Question_quizId_idx" ON "Question"("quizId");
CREATE INDEX "Question_topic_idx" ON "Question"("topic");

-- =============================================================================
-- QUESTION OPTIONS TABLE
-- =============================================================================

CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");

-- =============================================================================
-- TEST ATTEMPTS TABLE
-- =============================================================================

CREATE TABLE "TestAttempt" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "earnedPoints" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TestAttempt_userId_idx" ON "TestAttempt"("userId");
CREATE INDEX "TestAttempt_quizId_idx" ON "TestAttempt"("quizId");

-- =============================================================================
-- QUESTION ANSWERS TABLE
-- =============================================================================

CREATE TABLE "QuestionAnswer" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QuestionAnswer_attemptId_idx" ON "QuestionAnswer"("attemptId");
CREATE INDEX "QuestionAnswer_questionId_idx" ON "QuestionAnswer"("questionId");

-- =============================================================================
-- ACHIEVEMENTS TABLE
-- =============================================================================

CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
    "requirement" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- =============================================================================
-- USER ACHIEVEMENTS TABLE
-- =============================================================================

CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- =============================================================================
-- DAILY CHALLENGES TABLE
-- =============================================================================

CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DailyChallenge_date_idx" ON "DailyChallenge"("date");

-- =============================================================================
-- USER DAILY CHALLENGES TABLE
-- =============================================================================

CREATE TABLE "UserDailyChallenge" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDailyChallenge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserDailyChallenge_userId_challengeId_key" ON "UserDailyChallenge"("userId", "challengeId");
CREATE INDEX "UserDailyChallenge_userId_idx" ON "UserDailyChallenge"("userId");

-- =============================================================================
-- CERTIFICATES TABLE
-- =============================================================================

CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "issuer" TEXT NOT NULL DEFAULT 'IBMP Academy',
    "courseId" TEXT,
    "examScore" DOUBLE PRECISION,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "verificationId" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "verifications" INTEGER NOT NULL DEFAULT 0,
    "recognizedIn" TEXT[],
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Certificate_verificationId_key" ON "Certificate"("verificationId");
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");
CREATE INDEX "Certificate_verificationId_idx" ON "Certificate"("verificationId");

-- =============================================================================
-- AI CONVERSATIONS TABLE
-- =============================================================================

CREATE TABLE "AIConversation" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "mode" "AIMode" NOT NULL DEFAULT 'CHAT',
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIConversation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AIConversation_userId_idx" ON "AIConversation"("userId");

-- =============================================================================
-- AI MESSAGES TABLE
-- =============================================================================

CREATE TABLE "AIMessage" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[],
    "tokensUsed" INTEGER,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AIMessage_conversationId_idx" ON "AIMessage"("conversationId");

-- =============================================================================
-- VR SCENARIOS TABLE
-- =============================================================================

CREATE TABLE "VRScenario" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "duration" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "skills" TEXT[],
    "assetUrl" TEXT,
    "thumbnailUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VRScenario_pkey" PRIMARY KEY ("id")
);

-- =============================================================================
-- VR SESSIONS TABLE
-- =============================================================================

CREATE TABLE "VRSession" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "metrics" TEXT NOT NULL,
    "aiFeedback" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VRSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "VRSession_userId_idx" ON "VRSession"("userId");
CREATE INDEX "VRSession_scenarioId_idx" ON "VRSession"("scenarioId");

-- =============================================================================
-- SOCIAL POSTS TABLE
-- =============================================================================

CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType" NOT NULL DEFAULT 'TEXT',
    "mediaUrl" TEXT,
    "thumbnailUrl" TEXT,
    "pollOptions" TEXT,
    "pollEndsAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SocialPost_authorId_idx" ON "SocialPost"("authorId");
CREATE INDEX "SocialPost_createdAt_idx" ON "SocialPost"("createdAt");

-- =============================================================================
-- COMMENTS TABLE
-- =============================================================================

CREATE TABLE "Comment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- =============================================================================
-- LIKES TABLE
-- =============================================================================

CREATE TABLE "Like" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");
CREATE INDEX "Like_postId_idx" ON "Like"("postId");

-- =============================================================================
-- BOOKMARKS TABLE
-- =============================================================================

CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Bookmark_userId_postId_key" ON "Bookmark"("userId", "postId");
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- =============================================================================
-- PROPOSALS TABLE
-- =============================================================================

CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "proposalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "category" "ProposalCategory" NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'ACTIVE',
    "votesFor" INTEGER NOT NULL DEFAULT 0,
    "votesAgainst" INTEGER NOT NULL DEFAULT 0,
    "quorum" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Proposal_proposalId_key" ON "Proposal"("proposalId");
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- =============================================================================
-- VOTES TABLE
-- =============================================================================

CREATE TABLE "Vote" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "vote" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Vote_userId_proposalId_key" ON "Vote"("userId", "proposalId");
CREATE INDEX "Vote_proposalId_idx" ON "Vote"("proposalId");

-- =============================================================================
-- KNOWLEDGE NODES TABLE
-- =============================================================================

CREATE TABLE "KnowledgeNode" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "KnowledgeNode_category_idx" ON "KnowledgeNode"("category");

-- =============================================================================
-- USER KNOWLEDGE NODES TABLE
-- =============================================================================

CREATE TABLE "UserKnowledgeNode" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "mastery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserKnowledgeNode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserKnowledgeNode_userId_nodeId_key" ON "UserKnowledgeNode"("userId", "nodeId");
CREATE INDEX "UserKnowledgeNode_userId_idx" ON "UserKnowledgeNode"("userId");

-- =============================================================================
-- RESEARCH PROJECTS TABLE
-- =============================================================================

CREATE TABLE "ResearchProject" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "collaborators" TEXT[],
    "aiAssistance" BOOLEAN NOT NULL DEFAULT true,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchProject_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ResearchProject_leaderId_idx" ON "ResearchProject"("leaderId");

-- =============================================================================
-- MENTORSHIPS TABLE
-- =============================================================================

CREATE TABLE "Mentorship" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "menteeId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'PENDING',
    "matchScore" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mentorship_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Mentorship_menteeId_mentorId_key" ON "Mentorship"("menteeId", "mentorId");
CREATE INDEX "Mentorship_menteeId_idx" ON "Mentorship"("menteeId");
CREATE INDEX "Mentorship_mentorId_idx" ON "Mentorship"("mentorId");

-- =============================================================================
-- NOTIFICATIONS TABLE
-- =============================================================================

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- =============================================================================
-- REVIEWS TABLE
-- =============================================================================

CREATE TABLE "Review" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Review_userId_courseId_key" ON "Review"("userId", "courseId");
CREATE INDEX "Review_courseId_idx" ON "Review"("courseId");

-- =============================================================================
-- COURSE TAGS TABLE
-- =============================================================================

CREATE TABLE "CourseTag" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseTag_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseTag_courseId_idx" ON "CourseTag"("courseId");
CREATE INDEX "CourseTag_name_idx" ON "CourseTag"("name");

-- =============================================================================
-- ANALYTICS EVENTS TABLE
-- =============================================================================

CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "properties" TEXT NOT NULL,
    "page" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");
CREATE INDEX "AnalyticsEvent_event_idx" ON "AnalyticsEvent"("event");
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

