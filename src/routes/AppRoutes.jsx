import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { LoginPage } from '../pages/auth/LoginPage';

// Module Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AboutPage } from '../pages/about/AboutPage';
import { SkillsPage } from '../pages/skills/SkillsPage';
import { ExperiencesPage } from '../pages/experiences/ExperiencesPage';
import { ServicesPage } from '../pages/services/ServicesPage';
import { TestimonialsPage } from '../pages/testimonials/TestimonialsPage';
import { ProjectListPage } from '../pages/projects/ProjectListPage';
import { ProjectEditorPage } from '../pages/projects/ProjectEditorPage';
import { BlogListPage } from '../pages/blogs/BlogListPage';
import { BlogEditorPage } from '../pages/blogs/BlogEditorPage';
import { ContactInboxPage } from '../pages/contact/ContactInboxPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirects */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Public Auth Route */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Protected Admin Workspace */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard Hub */}
          <Route path="/admin/dashboard" element={<DashboardPage />} />

          {/* About Profile */}
          <Route path="/admin/about" element={<AboutPage />} />

          {/* Technology Skills */}
          <Route path="/admin/skills" element={<SkillsPage />} />

          {/* Career Experiences */}
          <Route path="/admin/experiences" element={<ExperiencesPage />} />

          {/* Service Offerings */}
          <Route path="/admin/services" element={<ServicesPage />} />

          {/* Client Testimonials */}
          <Route path="/admin/testimonials" element={<TestimonialsPage />} />

          {/* Projects Module */}
          <Route path="/admin/projects" element={<ProjectListPage />} />
          <Route path="/admin/projects/new" element={<ProjectEditorPage />} />
          <Route path="/admin/projects/:id/edit" element={<ProjectEditorPage />} />

          {/* Blog Engine */}
          <Route path="/admin/blogs" element={<BlogListPage />} />
          <Route path="/admin/blogs/new" element={<BlogEditorPage />} />
          <Route path="/admin/blogs/:id/edit" element={<BlogEditorPage />} />

          {/* Contact Inbox */}
          <Route path="/admin/contact" element={<ContactInboxPage />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}