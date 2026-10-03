import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getErrorMessage } from '../../lib/utils';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';

  // If already authenticated, redirect to workspace
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, returnUrl]);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Authentication successful. Welcome back!');
      navigate(returnUrl, { replace: true });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to sign in. Please verify your credentials.');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2563eb] text-white shadow-sm mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">
          Portfolio CMS Engine
        </h2>
        <p className="mt-1 text-sm text-[#475569]">
          Sign in to manage projects, blogs, and systems architecture.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 border border-[#e2e8f0] rounded-xl shadow-level-1">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email Address"
              type="email"
              id="email"
              name="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-[#94a3b8] hover:text-[#475569] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Quick Credential Hint for local development */}
          <div className="mt-6 pt-5 border-t border-[#f1f5f9] text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
              Test Credentials Available in API Spec
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}