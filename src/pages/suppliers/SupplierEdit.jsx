import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import supplierService from '../../services/supplierService';
import Loader from '../../components/Loader';
import { toast } from 'sonner';

const SupplierEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const data = await supplierService.getSupplierById(id);
        reset(data);
      } catch (error) {
        toast.error('Failed to load supplier data');
        navigate('/dashboard/suppliers');
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await supplierService.updateSupplier(id, data);
      toast.success('Supplier updated successfully');
      navigate('/dashboard/suppliers');
    } catch (error) {
      toast.error(error.message || 'Failed to update supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Supplier</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              {...register('phone', { required: 'Phone is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register('address')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/suppliers')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Update Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierEdit;
