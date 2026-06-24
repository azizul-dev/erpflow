import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Package, Tag, DollarSign, Archive, MessageSquare } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      category: 'General',
      description: '',
      price: '',
      cost: '',
      stock: 0,
      unit: 'pcs',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await productService.createProduct({
        ...data,
        price: Number(data.price),
        cost: Number(data.cost),
        stock: Number(data.stock),
      });
      toast.success('Product added successfully!');
      navigate('/dashboard/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back navigation header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/products"
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-150"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Add New Product</h2>
          <p className="text-sm text-muted-foreground">Register a new item in your inventory catalog</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="name">
                Product Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Package size={18} />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                    ${errors.name ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                  `}
                  {...register('name', { required: 'Product name is required' })}
                />
              </div>
              {errors.name && (
                <span className="text-xs font-medium text-destructive">{errors.name.message}</span>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="sku">
                SKU / Barcode *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Tag size={18} />
                </span>
                <input
                  id="sku"
                  type="text"
                  placeholder="e.g. MOUSE-WRL-01"
                  className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 uppercase
                    ${errors.sku ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                  `}
                  {...register('sku', { required: 'SKU code is required' })}
                />
              </div>
              {errors.sku && (
                <span className="text-xs font-medium text-destructive">{errors.sku.message}</span>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="e.g. Electronics, Office"
                className="w-full rounded-xl border border-input bg-background py-2.5 px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('category')}
              />
            </div>

            {/* Unit */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="unit">
                Unit of Measure
              </label>
              <input
                id="unit"
                type="text"
                placeholder="e.g. pcs, boxes, kgs"
                className="w-full rounded-xl border border-input bg-background py-2.5 px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('unit')}
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="price">
                Selling Price ($) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <DollarSign size={18} />
                </span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                    ${errors.price ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                  `}
                  {...register('price', {
                    required: 'Selling price is required',
                    min: { value: 0, message: 'Price cannot be negative' },
                  })}
                />
              </div>
              {errors.price && (
                <span className="text-xs font-medium text-destructive">{errors.price.message}</span>
              )}
            </div>

            {/* Cost */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="cost">
                Cost Price ($) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <DollarSign size={18} />
                </span>
                <input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20
                    ${errors.cost ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'}
                  `}
                  {...register('cost', {
                    required: 'Cost price is required',
                    min: { value: 0, message: 'Cost cannot be negative' },
                  })}
                />
              </div>
              {errors.cost && (
                <span className="text-xs font-medium text-destructive">{errors.cost.message}</span>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="stock">
                Initial Stock Level
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Archive size={18} />
                </span>
                <input
                  id="stock"
                  type="number"
                  placeholder="0"
                  className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register('stock', {
                    min: { value: 0, message: 'Stock level cannot be negative' },
                  })}
                />
              </div>
              {errors.stock && (
                <span className="text-xs font-medium text-destructive">{errors.stock.message}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="description">
              Description
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-muted-foreground">
                <MessageSquare size={18} />
              </span>
              <textarea
                id="description"
                rows="3"
                placeholder="Product description and details..."
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('description')}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={() => navigate('/dashboard/products')}
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
                  Saving Product...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;
