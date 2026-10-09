import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { PasswordResetModal } from './PasswordResetModal';
import {
  Lock,
  EnvelopeSimple,
  SunDim,
  MoonStars,
  ShieldCheck,
  ChalkboardTeacher,
  Student,
} from '@phosphor-icons/react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const { login } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please wait a minute before retrying.');
      } else if (err.response?.status === 401) {
        setError('Invalid campus email or password.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfd] dark:bg-black p-6 transition-colors selection:bg-apple-blue selection:text-white relative overflow-hidden">
      {/* Background ambient blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-apple-blue/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-apple-blue flex items-center justify-center text-white font-bold text-base shadow-sm">
            C
          </div>
          <span className="font-semibold text-sm tracking-tight text-apple-gray-900 dark:text-white">
            CampusOS
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-apple-gray-600 dark:text-apple-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunDim weight="duotone" className="h-5 w-5 text-amber-400" />
          ) : (
            <MoonStars weight="duotone" className="h-5 w-5 text-apple-gray-700" />
          )}
        </button>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md mx-auto my-auto z-10">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Sign In to CampusOS
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
            Unified university portal for students, faculty & administration
          </p>
        </div>

        <Card className="p-8 shadow-apple-lg border border-black/5 dark:border-white/10 backdrop-blur-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Campus Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@campusos.edu"
              required
              leftIcon={<EnvelopeSimple weight="duotone" className="h-4 w-4" />}
            />

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                leftIcon={<Lock weight="duotone" className="h-4 w-4" />}
              />
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="text-xs text-apple-blue dark:text-apple-blue-dark hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-apple-gray-200/80 dark:border-apple-gray-800/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400 text-center mb-3">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@campusos.edu', 'Admin@123')}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-apple-gray-200/70 dark:border-apple-gray-800 hover:bg-black/5 dark:hover:bg-white/5 transition text-center group"
              >
                <ShieldCheck weight="duotone" className="h-5 w-5 text-apple-blue group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-apple-gray-700 dark:text-apple-gray-300">
                  Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('faculty1@campusos.edu', 'Faculty@123')}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-apple-gray-200/70 dark:border-apple-gray-800 hover:bg-black/5 dark:hover:bg-white/5 transition text-center group"
              >
                <ChalkboardTeacher weight="duotone" className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-apple-gray-700 dark:text-apple-gray-300">
                  Faculty
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('student00001@campusos.edu', 'Student@123')}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-apple-gray-200/70 dark:border-apple-gray-800 hover:bg-black/5 dark:hover:bg-white/5 transition text-center group"
              >
                <Student weight="duotone" className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-apple-gray-700 dark:text-apple-gray-300">
                  Student
                </span>
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-apple-gray-400 z-10">
        © 2026 CampusOS Academic ERP. High-Performance Spring Boot + React Architecture.
      </div>

      <PasswordResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
    </div>
  );
};
