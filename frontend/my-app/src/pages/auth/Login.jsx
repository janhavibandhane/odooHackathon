import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { authService } from '../../services/apiService';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const onSubmit = async (data) => {
    if (isForgotPassword) {
      if (resetToken) {
        // Reset Password
        setIsResetting(true);
        try {
          await authService.resetPassword(resetToken, data.password);
          toast.success('Password reset successful! Please login.');
          setIsForgotPassword(false);
          setResetToken('');
        } catch (error) {
          toast.error(error.response?.data?.message || 'Reset failed');
        } finally {
          setIsResetting(false);
        }
      } else {
        // Forgot Password
        setIsResetting(true);
        try {
          const res = await authService.forgotPassword(data.email);
          toast.success('Reset token generated!');
          setResetToken(res.resetToken);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to generate token');
        } finally {
          setIsResetting(false);
        }
      }
      return;
    }

    // Normal Login
    const res = await login(data.email, data.password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="glass-card p-8 sm:p-10 rounded-3xl w-[450px]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          {isForgotPassword 
            ? (resetToken ? 'New Password' : 'Reset Password') 
            : 'Welcome Back'}
        </h1>
        <p className="text-base-content/70">
          {isForgotPassword 
            ? (resetToken ? 'Enter your new password' : 'Enter your email to receive a reset token') 
            : 'Enter your credentials to access your account'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {(!isForgotPassword || !resetToken) && (
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
        )}

        {(!isForgotPassword || resetToken) && (
          <Input
            label={resetToken ? "New Password" : "Password"}
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
          />
        )}

        {!isForgotPassword && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-md" />
              <span className="text-sm text-base-content/70">Remember me</span>
            </label>
            <button 
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting || isResetting}
        >
          {isForgotPassword ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              {resetToken ? 'Reset Password' : 'Get Token'}
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </>
          )}
        </Button>
        
        {isForgotPassword && (
          <button
            type="button"
            onClick={() => { setIsForgotPassword(false); setResetToken(''); }}
            className="flex items-center justify-center w-full text-sm font-medium text-base-content/60 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </button>
        )}
      </form>

      {!isForgotPassword && (
        <div className="mt-8 text-center text-sm text-base-content/70">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Create an account
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;
