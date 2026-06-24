import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'sonner';
import { User, Mail, Lock, ShieldAlert, Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Admin',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await registerAuth(data.name, data.email, data.password, data.role);
    setSubmitting(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Failed to register account');
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
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by setting up your ERP administrator profile
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <User size={18} />
              </span>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                  ${errors.name ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                `}
                {...register('name', { required: 'Full name is required' })}
              />
            </div>
            {errors.name && (
              <span className="text-xs font-medium text-destructive">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email input */}
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

          {/* Password input */}
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

          {/* Role Dropdown */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="role">
              User Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <ShieldAlert size={18} />
              </span>
              <select
                id="role"
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                {...register('role', { required: 'Role selection is required' })}
              >
                <option value="Admin">Admin (Full Control)</option>
                <option value="Manager">Manager (Edit Control)</option>
                <option value="User">User (Read-only Control)</option>
              </select>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 mt-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all duration-200"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Link to login page */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
