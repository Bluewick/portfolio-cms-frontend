import { api } from '../lib/api';

/**
 * Public Portfolio Service
 * Consumes read-only public endpoints and the contact form submission.
 */
export const portfolioService = {
  /**
   * Fetches public author biography, avatar, resume URL, and social links.
   * Endpoint: GET /api/about
   */
  async getAbout() {
    const response = await api.get('/api/about');
    return response.data?.data || null;
  },

  /**
   * Fetches published skills categorized by tech domain.
   * Endpoint: GET /api/skills
   */
  async getSkills() {
    const response = await api.get('/api/skills');
    return response.data?.data || [];
  },

  /**
   * Fetches career history & employment milestones ordered by display_order.
   * Endpoint: GET /api/experiences
   */
  async getExperiences() {
    const response = await api.get('/api/experiences');
    return response.data?.data || [];
  },

  /**
   * Fetches service offerings and engineering capabilities.
   * Endpoint: GET /api/services
   */
  async getServices() {
    const response = await api.get('/api/services');
    return response.data?.data || [];
  },

  /**
   * Fetches client endorsements and testimonials.
   * Endpoint: GET /api/testimonials
   */
  async getTestimonials() {
    const response = await api.get('/api/testimonials');
    return response.data?.data || [];
  },

  /**
   * Fetches all published portfolio projects with attached skill tags and links.
   * Endpoint: GET /api/projects
   */
  async getProjects() {
    const response = await api.get('/api/projects');
    return response.data?.data || [];
  },

  /**
   * Fetches deep case study details for a single project by its unique slug.
   * Endpoint: GET /api/projects/:slug
   */
  async getProjectBySlug(slug) {
    if (!slug) return null;
    const response = await api.get(`/api/projects/${encodeURIComponent(slug)}`);
    return response.data?.data || null;
  },

  /**
   * Fetches published technical articles with pagination meta.
   * Endpoint: GET /api/blogs
   */
  async getBlogs(params = {}) {
    const response = await api.get('/api/blogs', { params });
    return {
      blogs: response.data?.data || [],
      meta: response.data?.meta || { page: 1, limit: 10, total: 0, total_pages: 1 },
    };
  },

  /**
   * Fetches a single blog post article by its unique slug.
   * Endpoint: GET /api/blogs/:slug
   */
  async getBlogBySlug(slug) {
    if (!slug) return null;
    const response = await api.get(`/api/blogs/${encodeURIComponent(slug)}`);
    return response.data?.data || null;
  },

  /**
   * Submits a direct inquiry to the backend contact inbox.
   * Endpoint: POST /api/contact
   */
  async submitContact(payload) {
    const response = await api.post('/api/contact', payload);
    return response.data;
  },
};