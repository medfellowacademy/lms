// Course template types and utilities

export interface CourseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  duration: number; // in minutes
  estimatedDuration: number; // in minutes (alias for duration)
  modules: CourseTemplateModule[];
  thumbnail?: string;
  tags?: string[];
  popularity?: number;
  usageCount?: number;
  isPopular?: boolean;
}

export interface CourseTemplateModule {
  name: string;
  title: string; // alias for name
  description: string;
  duration: number;
  lessons: CourseTemplateLesson[];
}

export interface CourseTemplateLesson {
  title: string;
  description: string;
  duration: number;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'INTERACTIVE';
  content?: string;
}

// Course templates - Admin should create courses via the admin panel
const templates: CourseTemplate[] = [];

// Template utility functions
export function getAllTemplates(): CourseTemplate[] {
  return templates;
}

export function getTemplateById(id: string): CourseTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function getPopularTemplates(limit: number = 5): CourseTemplate[] {
  return [...templates]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

export function getTemplatesByCategory(category: string): CourseTemplate[] {
  return templates.filter((t) => t.category === category);
}

export function searchTemplates(query: string): CourseTemplate[] {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// Convert template to course data for database
export function templateToCourseData(
  template: CourseTemplate,
  overrides: {
    title?: string;
    instructorId?: string;
    price?: number;
    isFree?: boolean;
  } = {}
) {
  return {
    title: overrides.title || template.name,
    description: template.description,
    instructorId: overrides.instructorId || 'admin',
    category: template.category,
    difficulty: template.difficulty,
    duration: template.duration,
    price: overrides.price || 0,
    isFree: overrides.isFree ?? true,
    isPublished: false,
    modules: template.modules.map((module, moduleIndex) => ({
      title: module.name,
      description: module.description,
      order: moduleIndex,
      duration: module.duration,
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        title: lesson.title,
        description: lesson.description,
        type: lesson.type,
        duration: lesson.duration,
        order: lessonIndex,
        content: lesson.content || '',
        xpReward: Math.ceil(lesson.duration / 10),
        isPublished: false,
      })),
    })),
  };
}
