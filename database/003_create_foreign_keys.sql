-- =============================================================================
-- IBMP Platform - Foreign Key Constraints
-- =============================================================================
-- Run after 002_create_schema.sql
-- =============================================================================

-- Module -> Course
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Lesson -> Module
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" 
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Resource -> Lesson
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_lessonId_fkey" 
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enrollment -> User
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enrollment -> Course
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- LessonProgress -> User
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- LessonProgress -> Lesson
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" 
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Quiz -> Lesson
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" 
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Question -> Quiz
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" 
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- QuestionOption -> Question
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" 
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- TestAttempt -> User
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- TestAttempt -> Quiz
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_quizId_fkey" 
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- QuestionAnswer -> TestAttempt
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_attemptId_fkey" 
    FOREIGN KEY ("attemptId") REFERENCES "TestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- QuestionAnswer -> Question
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_questionId_fkey" 
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserAchievement -> User
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserAchievement -> Achievement
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" 
    FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserDailyChallenge -> User
ALTER TABLE "UserDailyChallenge" ADD CONSTRAINT "UserDailyChallenge_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserDailyChallenge -> DailyChallenge
ALTER TABLE "UserDailyChallenge" ADD CONSTRAINT "UserDailyChallenge_challengeId_fkey" 
    FOREIGN KEY ("challengeId") REFERENCES "DailyChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Certificate -> User
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AIConversation -> User
ALTER TABLE "AIConversation" ADD CONSTRAINT "AIConversation_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AIMessage -> AIConversation
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_conversationId_fkey" 
    FOREIGN KEY ("conversationId") REFERENCES "AIConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- VRSession -> User
ALTER TABLE "VRSession" ADD CONSTRAINT "VRSession_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- VRSession -> VRScenario
ALTER TABLE "VRSession" ADD CONSTRAINT "VRSession_scenarioId_fkey" 
    FOREIGN KEY ("scenarioId") REFERENCES "VRScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- SocialPost -> User
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_authorId_fkey" 
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment -> User
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" 
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment -> SocialPost
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" 
    FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment -> Comment (self-reference for replies)
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" 
    FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Like -> User
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Like -> SocialPost
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" 
    FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Bookmark -> User
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Bookmark -> SocialPost
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_postId_fkey" 
    FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vote -> User
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vote -> Proposal
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposalId_fkey" 
    FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- KnowledgeNode -> KnowledgeNode (self-reference)
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_parentId_fkey" 
    FOREIGN KEY ("parentId") REFERENCES "KnowledgeNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- UserKnowledgeNode -> User
ALTER TABLE "UserKnowledgeNode" ADD CONSTRAINT "UserKnowledgeNode_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserKnowledgeNode -> KnowledgeNode
ALTER TABLE "UserKnowledgeNode" ADD CONSTRAINT "UserKnowledgeNode_nodeId_fkey" 
    FOREIGN KEY ("nodeId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ResearchProject -> User
ALTER TABLE "ResearchProject" ADD CONSTRAINT "ResearchProject_leaderId_fkey" 
    FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Mentorship -> User (mentee)
ALTER TABLE "Mentorship" ADD CONSTRAINT "Mentorship_menteeId_fkey" 
    FOREIGN KEY ("menteeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Mentorship -> User (mentor)
ALTER TABLE "Mentorship" ADD CONSTRAINT "Mentorship_mentorId_fkey" 
    FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Notification -> User
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Review -> Course
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CourseTag -> Course
ALTER TABLE "CourseTag" ADD CONSTRAINT "CourseTag_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

