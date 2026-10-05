import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { portfolioService } from '../services/portfolioService';
import { getErrorMessage } from '../lib/utils';

/**
 * Hierarchical Query Key Factory for robust cache invalidation
 */
export const portfolioKeys = {
  all: ['portfolio'],
  about: () => [...portfolioKeys.all, 'about'],
  skills: () => [...portfolioKeys.all, 'skills'],
  experiences: () => [...portfolioKeys.all, 'experiences'],
  services: () => [...portfolioKeys.all, 'services'],
  testimonials: () => [...portfolioKeys.all, 'testimonials'],
  projects: () => [...portfolioKeys.all, 'projects'],
  project: (slug) => [...portfolioKeys.all, 'project', slug],
  blogs: (params) => [...portfolioKeys.all, 'blogs', params],
  blog: (slug) => [...portfolioKeys.all, 'blog', slug],
};

/**
 * Hook: Fetch About author profile
 */
export function useAbout() {
  return useQuery({
    queryKey: portfolioKeys.about(),
    queryFn: portfolioService.getAbout,
    staleTime: 1000 * 60 * 15, // 15 mins cache
  });
}

/**
 * Hook: Fetch Categorized Skills
 */
export function useSkills() {
  return useQuery({
    queryKey: portfolioKeys.skills(),
    queryFn: portfolioService.getSkills,
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * Hook: Fetch Career Experiences
 */
export function useExperiences() {
  return useQuery({
    queryKey: portfolioKeys.experiences(),
    queryFn: portfolioService.getExperiences,
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * Hook: Fetch Services & Capabilities
 */
export function useServices() {
  return useQuery({
    queryKey: portfolioKeys.services(),
    queryFn: portfolioService.getServices,
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * Hook: Fetch Client Testimonials
 */
export function useTestimonials() {
  return useQuery({
    queryKey: portfolioKeys.testimonials(),
    queryFn: portfolioService.getTestimonials,
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * Hook: Fetch Published Projects
 */
export function useProjects() {
  return useQuery({
    queryKey: portfolioKeys.projects(),
    queryFn: portfolioService.getProjects,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook: Fetch Single Project Case Study (with 404 non-retry)
 */
export function useProjectDetails(slug) {
  return useQuery({
    queryKey: portfolioKeys.project(slug),
    queryFn: () => portfolioService.getProjectBySlug(slug),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      // Do not retry if server returned 404 (draft or non-existent)
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook: Fetch Paginated Blogs list
 */
export function useBlogs(params = {}) {
  return useQuery({
    queryKey: portfolioKeys.blogs(params),
    queryFn: () => portfolioService.getBlogs(params),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook: Fetch Single Blog Article Detail (with 404 non-retry)
 */
export function useBlogDetails(slug) {
  return useQuery({
    queryKey: portfolioKeys.blog(slug),
    queryFn: () => portfolioService.getBlogBySlug(slug),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook: Submit Contact Message Mutation
 */
export function useContactMutation() {
  return useMutation({
    mutationFn: portfolioService.submitContact,
    onSuccess: (data) => {
      toast.success(
        data?.message || 'Your message has been received. Thank you for reaching out!'
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to send message. Please try again.'));
    },
  });
}