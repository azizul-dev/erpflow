import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { customerService } from '../services/customerService.js';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, User, Mail, Phone, Briefcase, MapPin } from 'lucide-react';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await customerService.createCustomer(data);
      toast.success('Customer added successfully!');
      navigate('/dashboard/customers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add customer');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/customers"
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-150"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Add New Customer</h2>
          <p className="text-sm text-muted-foreground">Register details for a new business customer</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="name">
              Customer Name *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <User size={18} />
              </span>
              <input
                id="name"
                type="text"
                placeholder="e.g. Acme Corp Representative / John Doe"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                  ${errors.name ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                `}
                {...register('name', { required: 'Customer name is required' })}
              />
            </div>
            {errors.name && (
              <span className="text-xs font-medium text-destructive">{errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="phone">
                Phone Number *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Phone size={18} />
                </span>
                <input
                  id="phone"
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                    ${errors.phone ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                  `}
                  {...register('phone', { required: 'Phone number is required' })}
                />
              </div>
              {errors.phone && (
                <span className="text-xs font-medium text-destructive">{errors.phone.message}</span>
              )}
            </div>

            {/* Email */}
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
                  placeholder="customer@domain.com"
                  className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                    ${errors.email ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                  `}
                  {...register('email', {
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-xs font-medium text-destructive">{errors.email.message}</span>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="company">
              Company Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Briefcase size={18} />
              </span>
              <input
                id="company"
                type="text"
                placeholder="e.g. Acme Corporation"
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('company')}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="address">
              Billing / Shipping Address
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-muted-foreground">
                <MapPin size={18} />
              </span>
              <textarea
                id="address"
                rows="3"
                placeholder="Street address, City, ZIP Code..."
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('address')}
              />
            </div>
          </div>

          {/* Submit Action buttons */}
          <div className="flex justify-end gap-3 border-t border-border pt-5 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/customers')}
              className="rounded-xl border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all duration-200"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Customer...
                </>
              ) : (
                'Save Customer'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
