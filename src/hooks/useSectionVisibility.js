import {
  useProjects,
  useBlogs,
  useExperiences,
  useServices,
  useTestimonials,
  useSkills,
} from './usePortfolio';

/**
 * Evaluates server collection counts to enforce the "Ghost Section" omission protocol.
 * If an array has 0 published items, its corresponding section and navigation link are suppressed.
 */
export function useSectionVisibility() {
  const { data: projects = [], isLoading: loadingProjects } = useProjects();
  const { data: blogData, isLoading: loadingBlogs } = useBlogs({ limit: 5 });
  const { data: experiences = [], isLoading: loadingExperiences } = useExperiences();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: testimonials = [], isLoading: loadingTestimonials } = useTestimonials();
  const { data: skills = [], isLoading: loadingSkills } = useSkills();

  const blogs = blogData?.blogs || [];

  const isInitialLoading =
    loadingProjects &&
    loadingBlogs &&
    loadingExperiences &&
    loadingServices &&
    loadingTestimonials &&
    loadingSkills;

  return {
    isInitialLoading,
    hasSkills: skills.length > 0,
    hasProjects: projects.length > 0,
    hasBlogs: blogs.length > 0,
    hasExperiences: experiences.length > 0,
    hasServices: services.length > 0,
    hasTestimonials: testimonials.length > 0,
    counts: {
      projects: projects.length,
      blogs: blogs.length,
      experiences: experiences.length,
      services: services.length,
      testimonials: testimonials.length,
      skills: skills.length,
    },
  };
}