import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="glass-card p-8 sm:p-10 rounded-3xl w-[450px]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-base-content/70">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-md" />
            <span className="text-sm text-base-content/70">Remember me</span>
          </label>
          <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
        >
          <LogIn className="w-5 h-5 mr-2" />
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-base-content/70">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
