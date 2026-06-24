import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import salesService from '../../services/salesService';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const SaleAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      saleDate: new Date().toISOString().split('T')[0],
      items: [{ product: '', quantity: 1, unitPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch("items");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          customerService.getAllCustomers(),
          productService.getAllProducts()
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        toast.error('Failed to load initial data');
      }
    };
    fetchData();
  }, []);

  const totalAmount = watchItems.reduce((sum, item) => {
    return sum + (Number(item.quantity) * Number(item.unitPrice) || 0);
  }, 0);

  const onSubmit = async (data) => {
    try {
      if (data.items.length === 0) {
        toast.error('Please add at least one item');
        return;
      }
      setIsSubmitting(true);
      
      const payload = {
        customer: data.customer,
        saleDate: data.saleDate,
        items: data.items.map(item => ({
          product: item.product,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.quantity) * Number(item.unitPrice)
        })),
        totalAmount,
        status: data.status || 'Completed'
      };

      await salesService.createSale(payload);
      toast.success('Sale recorded successfully');
      navigate('/sales');
    } catch (error) {
      toast.error(error.message || 'Failed to record sale. Check stock levels.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductChange = (index, productId) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">New Sale</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                {...register('customer', { required: 'Customer is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="">Select a customer</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Date</label>
              <input
                type="date"
                {...register('saleDate', { required: 'Date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Items</h3>
              <button
                type="button"
                onClick={() => append({ product: '', quantity: 1, unitPrice: 0 })}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end border p-4 rounded-md bg-gray-50">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
                    <select
                      {...register(`items.${index}.product`, { required: true })}
                      onChange={(e) => {
                        register(`items.${index}.product`).onChange(e);
                        handleProductChange(index, e.target.value);
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option value="">Select product</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`items.${index}.unitPrice`, { required: true, min: 0 })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="w-24 pb-2 text-right font-medium">
                    ${(Number(watchItems[index]?.quantity || 0) * Number(watchItems[index]?.unitPrice || 0)).toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end text-xl font-bold">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/sales')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleAdd;
