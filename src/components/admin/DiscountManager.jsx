// import { useState, useEffect } from 'react';
// import adminApi from '../../services/adminApi';
// import { Plus, Trash2, Search, Mail, Tag, Loader2, Calendar } from 'lucide-react';
// import { toast } from 'react-toastify';

// export default function DiscountManager() {
//   const [discounts, setDiscounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [coupon, setCoupon] = useState('');
//   const [validUntil, setValidUntil] = useState(''); // ← NEW: expiration date
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     loadDiscounts();
//   }, []);

//   const loadDiscounts = async () => {
//     setLoading(true);
//     try {
//       const res = await adminApi.get('/api/admin/discounts');
//       setDiscounts(res.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to load discounts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAssign = async (e) => {
//     e.preventDefault();
//     const trimmedEmail = email.trim().toLowerCase();
//     const trimmedCoupon = coupon.trim().toUpperCase();

//     if (!trimmedEmail || !trimmedCoupon) {
//       toast.error('Email and coupon code are required');
//       return;
//     }

//     // Optional: client-side duplicate check
//     if (discounts.some(d => d.email === trimmedEmail && d.couponCode === trimmedCoupon)) {
//       toast.warn('This coupon is already assigned to this email');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const payload = {
//         email: trimmedEmail,
//         couponCode: trimmedCoupon,
//         validUntil: validUntil || null, // ← NEW: send expiration date (optional)
//       };

//       await adminApi.post('/api/admin/discounts', payload);
//       toast.success(`Coupon ${trimmedCoupon} assigned to ${trimmedEmail}`);
//       setEmail('');
//       setCoupon('');
//       setValidUntil('');
//       loadDiscounts();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to assign discount');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async (email) => {
//     if (!window.confirm(`Remove discount for ${email}?`)) return;

//     setActionLoading(true);
//     try {
//       await adminApi.delete(`/api/admin/discounts/${email}`);
//       toast.success(`Discount removed for ${email}`);
//       loadDiscounts();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to remove discount');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const filtered = discounts.filter(d =>
//     d.email.toLowerCase().includes(search.toLowerCase()) ||
//     d.couponCode.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <Tag className="w-6 h-6 text-indigo-600" />
//         Manage User Discounts
//       </h2>

//       {/* Assign Form */}
//       <form onSubmit={handleAssign} className="mb-10 bg-white p-6 rounded-lg shadow border">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               User Email <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 className="pl-10 w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="user@example.com"
//                 required
//                 disabled={actionLoading}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Coupon Code <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 value={coupon}
//                 onChange={e => setCoupon(e.target.value.toUpperCase())}
//                 className="pl-10 w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="INDIA50 / US20OFF"
//                 required
//                 disabled={actionLoading}
//               />
//             </div>
//           </div>

//           {/* ← NEW: Expiration Date Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Valid Until (optional)
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="date"
//                 value={validUntil}
//                 onChange={e => setValidUntil(e.target.value)}
//                 className="pl-10 w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//                 disabled={actionLoading}
//               />
//             </div>
//           </div>

//           <div className="flex items-end">
//             <button
//               type="submit"
//               disabled={actionLoading}
//               className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition ${
//                 actionLoading 
//                   ? 'bg-indigo-400 cursor-not-allowed' 
//                   : 'bg-indigo-600 hover:bg-indigo-700'
//               }`}
//             >
//               {actionLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Assigning...
//                 </>
//               ) : (
//                 'Assign Discount'
//               )}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Search */}
//       <div className="mb-6 relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder="Search by email or coupon code..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="pl-10 w-full px-4 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//         />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-12">
//           <Loader2 className="animate-spin h-12 w-12 mx-auto text-indigo-600" />
//           <p className="mt-4 text-gray-500">Loading discounts...</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <p className="text-center text-gray-500 py-12">
//           {search ? 'No matching discounts found' : 'No discounts assigned yet'}
//         </p>
//       ) : (
//         <div className="overflow-x-auto rounded-lg border shadow">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon Code</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
//                 {/* ← NEW: Optional - show expiration if backend returns validUntil */}
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Valid Until</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filtered.map(d => (
//                 <tr key={d.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.couponCode}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center">
//                     <span
//                       className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         d.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                       }`}
//                     >
//                       {d.used ? 'Used' : 'Active'}
//                     </span>
//                   </td>
//                   {/* Uncomment if backend returns validUntil */}
//                   <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
//                     {d.validUntil ? new Date(d.validUntil).toLocaleDateString() : 'No expiry'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => handleDelete(d.email)}
//                       disabled={actionLoading}
//                       className={`text-red-600 hover:text-red-900 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }














import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Plus, Trash2, Search, Mail, Tag, Loader2, Calendar, X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DiscountManager() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [coupon, setCoupon] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/api/admin/getDiscounts');
      setDiscounts(res.data || []);
    } catch (err) {
      toast.error('Could not load discount list');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCoupon = coupon.trim();

    if (!trimmedEmail || !trimmedCoupon) {
      toast.error('Email and coupon code are required');
      return;
    }

    setActionLoading(true);
    try {
      await adminApi.post('/api/admin/saveDiscounts', {
        email: trimmedEmail,
        couponCode: trimmedCoupon,
        validUntil: validUntil || null,
      });
      toast.success('Discount assigned');
      setEmail('');
      setCoupon('');
      setValidUntil('');
      loadDiscounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Remove discount for ${email}?`)) return;
    setActionLoading(true);
    try {
      await adminApi.delete('/api/admin/deleteDiscounts', {
        params: { email },
      });
      toast.success('Discount removed');
      loadDiscounts();
    } catch {
      toast.error('Could not remove discount');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.couponCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-md">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Discount Codes</h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Assign and manage one-time or limited-use discount codes for users
            </p>
          </div>
        </div>
      </div>

      {/* Assign Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Assign New Discount</h2>
        </div>

        <form onSubmit={handleAssign} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                User Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-slate-500 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                  required
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Coupon Code Id
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="WELCOME25 / INDIA50"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-slate-500 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                  required
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Valid Until (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-slate-500 disabled:bg-slate-50 transition-colors"
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={actionLoading}
                className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition ${
                  actionLoading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {actionLoading ? 'Assigning...' : 'Assign Discount'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Search + Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Assigned Discounts</h2>

          <div className="relative max-w-md w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search email or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-slate-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-sm">Loading discount assignments…</p>
          </div>
        ) : filteredDiscounts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            {search
              ? 'No matching discount codes found'
              : 'No discount codes have been assigned yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Coupon
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Expires
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDiscounts.map((d) => (
                  <tr key={d.id || `${d.email}-${d.couponCode}`} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {d.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">
                      {d.couponCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          d.used
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {d.used ? 'Used' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                      {d.validUntil
                        ? new Date(d.validUntil).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(d.email)}
                        disabled={actionLoading}
                        className={`text-rose-600 hover:text-rose-800 transition ${
                          actionLoading ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        title="Remove discount"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}