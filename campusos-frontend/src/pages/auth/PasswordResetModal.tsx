import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { authApi } from '../../api/auth';
import { useNotificationStore } from '../../store/notificationStore';
import { Key, EnvelopeSimple, CheckCircle } from '@phosphor-icons/react';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { addToast } = useNotificationStore();

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.requestPasswordReset(email);
      // In dev environment or mock email, token might be in response
      if (res.token) {
        setToken(res.token);
      }
      addToast({
        type: 'success',
        title: 'Reset Code Dispatched',
        message: 'A password reset token has been issued. Check your email.',
      });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request reset token');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.confirmPasswordReset(token, newPassword);
      setSuccess(true);
      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your password has been changed. You may now log in.',
      });
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setToken('');
    setNewPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reset Your Password"
      description="Enter your registered campus email to receive a password reset authorization code."
    >
      {success ? (
        <div className="py-6 flex flex-col items-center text-center space-y-3">
          <CheckCircle weight="duotone" className="h-12 w-12 text-emerald-500" />
          <h4 className="text-base font-semibold text-apple-gray-900 dark:text-white">
            Password Changed Successfully
          </h4>
          <p className="text-xs text-apple-gray-500">
            You can now log in using your new credentials.
          </p>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleRequestToken} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}
          <Input
            label="Campus Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. student00001@campusos.edu"
            required
            leftIcon={<EnvelopeSimple weight="duotone" className="h-4 w-4" />}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Send Reset Code
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleConfirmReset} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}
          <Input
            label="Reset Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your reset token"
            required
            leftIcon={<Key weight="duotone" className="h-4 w-4" />}
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-apple-gray-500 hover:text-apple-gray-800 dark:hover:text-apple-200"
            >
              ← Back
            </button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={loading}>
                Update Password
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
