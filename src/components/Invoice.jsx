import { useRef } from 'react';
import { Printer, Download, X } from 'lucide-react';

const Invoice = ({ sale, onClose }) => {
  const printRef = useRef();

  const invoiceNumber = `INV-${sale._id?.slice(-6).toUpperCase() || '000000'}`;
  const saleDate = sale.saleDate
    ? new Date(sale.saleDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; color: #111; background: #fff; padding: 40px; }
            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
            .company-name { font-size: 28px; font-weight: 800; color: #1d4ed8; }
            .company-tagline { color: #6b7280; font-size: 13px; margin-top: 4px; }
            .invoice-badge { background: #1d4ed8; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
            .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 36px; }
            .meta-box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 6px; }
            .meta-box p { font-size: 14px; color: #111; font-weight: 500; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            thead tr { background: #1d4ed8; }
            thead th { color: white; padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            tbody tr { border-bottom: 1px solid #f3f4f6; }
            tbody tr:nth-child(even) { background: #f9fafb; }
            tbody td { padding: 12px 16px; font-size: 13px; color: #374151; }
            .totals { margin-left: auto; width: 280px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #e5e7eb; }
            .total-final { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 800; color: #1d4ed8; }
            .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 12px; }
            .divider { border: none; border-top: 2px dashed #e5e7eb; margin: 32px 0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownload = async () => {
    const { default: html2canvas } = await import('html2canvas').catch(() => null);
    const { default: jsPDF } = await import('jspdf').catch(() => null);

    if (!html2canvas || !jsPDF) {
      // Fallback: just print
      handlePrint();
      return;
    }

    const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-700">ERPFlow</h1>
              <p className="text-gray-400 text-sm mt-1">Enterprise Resource Planning System</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                INVOICE
              </span>
              <p className="text-gray-700 font-bold mt-2 text-lg">{invoiceNumber}</p>
              <p className="text-gray-400 text-sm">{saleDate}</p>
            </div>
          </div>

          {/* Bill To / Status */}
          <div className="flex justify-between mb-10">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Bill To</h4>
              <p className="text-gray-800 font-semibold text-base">{sale.customer?.name || 'Walk-in Customer'}</p>
              {sale.customer?.email && <p className="text-gray-500 text-sm">{sale.customer.email}</p>}
              {sale.customer?.phone && <p className="text-gray-500 text-sm">{sale.customer.phone}</p>}
            </div>
            <div className="text-right">
              <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Status</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                sale.status === 'Completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {sale.status || 'Completed'}
              </span>
            </div>
          </div>

          <hr className="border-dashed border-gray-200 mb-8" />

          {/* Items Table */}
          <table className="w-full text-left mb-8">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-xs uppercase tracking-wide rounded-tl-lg">#</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide">Product</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-right">Qty</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-right">Unit Price</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-right rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {(sale.items || []).map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-3 px-4 text-gray-500 text-sm">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    {item.product?.name || item.productName || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-gray-700 text-sm text-right">${Number(item.unitPrice).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-800 text-sm font-semibold text-right">
                    ${Number(item.total || item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
                <span>Subtotal</span>
                <span>${Number(sale.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-extrabold text-blue-700 mt-1">
                <span>Grand Total</span>
                <span>${Number(sale.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <hr className="border-dashed border-gray-200 my-8" />

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs">
            <p className="font-medium text-gray-500 mb-1">Thank you for your business!</p>
            <p>Generated by ERPFlow &bull; {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
