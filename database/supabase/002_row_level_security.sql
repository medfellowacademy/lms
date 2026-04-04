-- =============================================================================
-- IBMP Platform - Supabase Row Level Security (RLS) Policies
-- =============================================================================
-- Run AFTER 001_setup_complete.sql
-- These policies add security at the database level
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LessonProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Achievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAchievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Certificate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AIConversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AIMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VRScenario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VRSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bookmark" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KnowledgeNode" ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USER POLICIES
-- =============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = id);

-- Public profiles are visible to all authenticated users
CREATE POLICY "Public profiles visible" ON "User"
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================================
-- COURSE POLICIES
-- =============================================================================

-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses" ON "Course"
    FOR SELECT USING (status = 'PUBLISHED');

-- Instructors can manage their own courses
CREATE POLICY "Instructors can manage own courses" ON "Course"
    FOR ALL USING (auth.uid()::text = "instructorId");

-- Admins can manage all courses
CREATE POLICY "Admins can manage all courses" ON "Course"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User"
            WHERE id = auth.uid()::text
            AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- =============================================================================
-- MODULE & LESSON POLICIES
-- =============================================================================

-- Anyone can view modules/lessons of published courses
CREATE POLICY "View modules of published courses" ON "Module"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Course"
            WHERE "Course".id = "Module"."courseId"
            AND "Course".status = 'PUBLISHED'
        )
    );

CREATE POLICY "View lessons of published courses" ON "Lesson"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Module"
            JOIN "Course" ON "Course".id = "Module"."courseId"
            WHERE "Module".id = "Lesson"."moduleId"
            AND "Course".status = 'PUBLISHED'
        )
    );

-- =============================================================================
-- ENROLLMENT POLICIES
-- =============================================================================

-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" ON "Enrollment"
    FOR SELECT USING (auth.uid()::text = "userId");

-- Users can enroll themselves
CREATE POLICY "Users can enroll themselves" ON "Enrollment"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own enrollment progress
CREATE POLICY "Users can update own enrollment" ON "Enrollment"
    FOR UPDATE USING (auth.uid()::text = "userId");

-- =============================================================================
-- LESSON PROGRESS POLICIES
-- =============================================================================

-- Users can manage their own progress
CREATE POLICY "Users can manage own progress" ON "LessonProgress"
    FOR ALL USING (auth.uid()::text = "userId");

-- =============================================================================
-- ACHIEVEMENT POLICIES
-- =============================================================================

-- Anyone can view achievements
CREATE POLICY "Anyone can view achievements" ON "Achievement"
    FOR SELECT USING (true);

-- Users can view their own achievement progress
CREATE POLICY "Users can view own achievement progress" ON "UserAchievement"
    FOR SELECT USING (auth.uid()::text = "userId");

-- =============================================================================
-- CERTIFICATE POLICIES
-- =============================================================================

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON "Certificate"
    FOR SELECT USING (auth.uid()::text = "userId");

-- Public certificate verification (by verificationId)
CREATE POLICY "Public certificate verification" ON "Certificate"
    FOR SELECT USING (true);

-- =============================================================================
-- AI CONVERSATION POLICIES
-- =============================================================================

-- Users can manage their own AI conversations
CREATE POLICY "Users can manage own AI conversations" ON "AIConversation"
    FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own AI messages" ON "AIMessage"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "AIConversation"
            WHERE "AIConversation".id = "AIMessage"."conversationId"
            AND "AIConversation"."userId" = auth.uid()::text
        )
    );

-- =============================================================================
-- VR POLICIES
-- =============================================================================

-- Anyone can view VR scenarios
CREATE POLICY "Anyone can view VR scenarios" ON "VRScenario"
    FOR SELECT USING ("isActive" = true);

-- Users can manage their own VR sessions
CREATE POLICY "Users can manage own VR sessions" ON "VRSession"
    FOR ALL USING (auth.uid()::text = "userId");

-- =============================================================================
-- SOCIAL POLICIES
-- =============================================================================

-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts" ON "SocialPost"
    FOR SELECT USING ("isPublished" = true);

-- Users can create posts
CREATE POLICY "Users can create posts" ON "SocialPost"
    FOR INSERT WITH CHECK (auth.uid()::text = "authorId");

-- Users can update/delete their own posts
CREATE POLICY "Users can manage own posts" ON "SocialPost"
    FOR UPDATE USING (auth.uid()::text = "authorId");

CREATE POLICY "Users can delete own posts" ON "SocialPost"
    FOR DELETE USING (auth.uid()::text = "authorId");

-- Anyone can view comments on published posts
CREATE POLICY "Anyone can view comments" ON "Comment"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "SocialPost"
            WHERE "SocialPost".id = "Comment"."postId"
            AND "SocialPost"."isPublished" = true
        )
    );

-- Users can create comments
CREATE POLICY "Users can create comments" ON "Comment"
    FOR INSERT WITH CHECK (auth.uid()::text = "authorId");

-- Users can manage their own comments
CREATE POLICY "Users can manage own comments" ON "Comment"
    FOR ALL USING (auth.uid()::text = "authorId");

-- Users can manage their own likes
CREATE POLICY "Users can manage own likes" ON "Like"
    FOR ALL USING (auth.uid()::text = "userId");

-- Users can manage their own bookmarks
CREATE POLICY "Users can manage own bookmarks" ON "Bookmark"
    FOR ALL USING (auth.uid()::text = "userId");

-- =============================================================================
-- NOTIFICATION POLICIES
-- =============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON "Notification"
    FOR SELECT USING (auth.uid()::text = "userId");

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" ON "Notification"
    FOR UPDATE USING (auth.uid()::text = "userId");

-- =============================================================================
-- GOVERNANCE POLICIES
-- =============================================================================

-- Anyone can view active proposals
CREATE POLICY "Anyone can view proposals" ON "Proposal"
    FOR SELECT USING (true);

-- Authenticated users can create proposals
CREATE POLICY "Users can create proposals" ON "Proposal"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can manage their own votes
CREATE POLICY "Users can manage own votes" ON "Vote"
    FOR ALL USING (auth.uid()::text = "userId");

-- =============================================================================
-- KNOWLEDGE GRAPH POLICIES
-- =============================================================================

-- Anyone can view knowledge nodes
CREATE POLICY "Anyone can view knowledge nodes" ON "KnowledgeNode"
    FOR SELECT USING (true);

-- =============================================================================
-- SERVICE ROLE BYPASS
-- =============================================================================
-- Note: The service_role key bypasses RLS automatically
-- Use it for server-side operations that need full access

-- =============================================================================
-- ADMIN BYPASS FUNCTION
-- =============================================================================

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM "User"
        WHERE id = auth.uid()::text
        AND role IN ('ADMIN', 'SUPER_ADMIN')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- DONE! ✅
-- =============================================================================

