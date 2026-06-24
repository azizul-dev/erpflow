import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await login(data.email, data.password);
    setSubmitting(false);

    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
        
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/20">
            E
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Welcome back to ERPFlow
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your ERP operations
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                  ${errors.email ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                `}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-xs font-medium text-destructive">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-10 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                  ${errors.password ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                `}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-medium text-destructive">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all duration-200"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Link to register page */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
