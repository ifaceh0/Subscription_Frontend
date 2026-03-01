// import { useState, useEffect } from 'react';
// import adminApi from '../../services/adminApi'; // your api file
// import { Plus, Edit2, Trash2, Save, X, Globe } from 'lucide-react';
// import { toast } from 'react-toastify';

// export default function CurrencyConfigManager() {
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     countryCode: '',
//     currencyCode: '',
//     currencySymbol: '',
//     currencySymbolPosition: 'prefix',
//     displayName: '',
//     locationKeywords: '',
//     isActive: true,
//     mandateRequired: false,
//     paymentMethods: 'CARD',
//   });
//   const [editingCode, setEditingCode] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     loadCountries();
//   }, []);

//   const loadCountries = async () => {
//     setLoading(true);
//     try {
//       const res = await adminApi.get('/api/admin/countries');
//       setCountries(res.data);
//     } catch (err) {
//       toast.error('Failed to load countries');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInput = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       if (editingCode) {
//         await adminApi.put(`/api/admin/countries/${editingCode}`, form);
//         toast.success('Country updated successfully');
//       } else {
//         await adminApi.post('/api/admin/countries', form);
//         toast.success('Country added successfully');
//       }
//       resetForm();
//       loadCountries();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (country) => {
//     setEditingCode(country.countryCode);
//     setForm({
//       countryCode: country.countryCode,
//       currencyCode: country.currencyCode,
//       currencySymbol: country.currencySymbol,
//       currencySymbolPosition: country.currencySymbolPosition,
//       displayName: country.displayName || '',
//       locationKeywords: country.locationKeywords || '',
//       isActive: country.isActive ?? true,
//       mandateRequired: country.mandateRequired ?? false, 
//       paymentMethods: country.paymentMethods || 'CARD',
//     });
//   };

//   const handleDelete = async (code) => {
//     if (!window.confirm(`Delete ${code}? This cannot be undone.`)) return;
//     try {
//         await adminApi.delete(`api/admin/countries/${code}`);
//         toast.success(`Country ${code} deleted`);
//         loadCountries();
//     } catch (err) {
//         toast.error('Delete failed');
//     }
//   };

//   const resetForm = () => {
//     setEditingCode(null);
//     setForm({
//       countryCode: '',
//       currencyCode: '',
//       currencySymbol: '',
//       currencySymbolPosition: 'prefix',
//       displayName: '',
//       locationKeywords: '',
//       isActive: true,
//       mandateRequired: false, 
//       paymentMethods: 'CARD',
//     });
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <Globe className="w-6 h-6" />
//         Countries & Currency Settings
//       </h2>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-lg shadow border">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Country Code <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="countryCode"
//               value={form.countryCode}
//               onChange={handleInput}
//               maxLength={2}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="IN"
//               required
//               disabled={editingCode} // ← can't change code after creation
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Currency Code <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="currencyCode"
//               value={form.currencyCode}
//               onChange={handleInput}
//               maxLength={3}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="INR"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Currency Symbol <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="currencySymbol"
//               value={form.currencySymbol}
//               onChange={handleInput}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="₹"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Symbol Position
//             </label>
//             <select
//               name="currencySymbolPosition"
//               value={form.currencySymbolPosition}
//               onChange={handleInput}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="prefix">Prefix (₹ 500)</option>
//               <option value="suffix">Suffix (500 ₹)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Display Name
//             </label>
//             <input
//               type="text"
//               name="displayName"
//               value={form.displayName}
//               onChange={handleInput}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="India"
//             />
//           </div>

//           <div className="md:col-span-2 lg:col-span-3">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Location Keywords (comma separated)
//             </label>
//             <textarea
//               name="locationKeywords"
//               value={form.locationKeywords}
//               onChange={handleInput}
//               rows="2"
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="IN,INDIA,BENGALURU,MUMBAI,DELHI,KARNATAKA,TAMILNADU"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Used to auto-detect user's country from location string
//             </p>
//           </div>

//           {/* ← NEW: Mandate Required (for India recurring mandates) */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="mandateRequired"
//               checked={form.mandateRequired}
//               onChange={handleInput}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             />
//             <label className="ml-2 text-sm text-gray-700">
//               Mandate Required (for recurring payments in this country)
//             </label>
//           </div>

//           {/* ← NEW: Payment Methods (comma-separated, e.g. CARD,UPI) */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Payment Methods (comma-separated)
//             </label>
//             <input
//               type="text"
//               name="paymentMethods"
//               value={form.paymentMethods}
//               onChange={handleInput}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="CARD,UPI"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               e.g., CARD,UPI (leave blank for default CARD only)
//             </p>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="isActive"
//               checked={form.isActive}
//               onChange={handleInput}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             />
//             <label className="ml-2 text-sm text-gray-700">Active</label>
//           </div>
//         </div>

//         <div className="mt-8 flex gap-4">
//           <button
//             type="submit"
//             disabled={submitting}
//             className={`px-6 py-3 text-white rounded-lg font-medium flex items-center gap-2 ${
//               submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
//             }`}
//           >
//             {submitting ? 'Saving...' : editingCode ? 'Update' : 'Add Country'}
//           </button>

//           {editingCode && (
//             <button
//               type="button"
//               onClick={resetForm}
//               className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mx-auto"></div>
//         </div>
//       ) : countries.length === 0 ? (
//         <p className="text-center text-gray-500 py-12">No countries added yet</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keywords</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mandate Req.</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Methods</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Active</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {countries.map(c => (
//                 <tr key={c.countryCode} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap font-medium">{c.countryCode}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{c.currencyCode}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{c.currencySymbol}</td>
//                   <td className="px-6 py-4 whitespace-nowrap capitalize">{c.currencySymbolPosition}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{c.displayName || '-'}</td>
//                   <td className="px-6 py-4">{c.locationKeywords || '-'}</td>
//                   <td className="px-6 py-4 text-center">
//                     <span className={`px-2 py-1 rounded-full text-xs ${c.mandateRequired ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
//                       {c.mandateRequired ? 'Yes' : 'No'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">{c.paymentMethods || 'CARD'}</td>
//                   <td className="px-6 py-4 text-center">
//                     <span className={`px-2 py-1 rounded-full text-xs ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {c.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right">
//                     <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:text-indigo-900 mr-3">
//                       <Edit2 size={18} />
//                     </button>
//                     <button onClick={() => handleDelete(c.countryCode)} className="text-red-600 hover:text-red-900">
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
import { Plus, Edit2, Trash2, X, Globe, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CurrencyConfigManager() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    countryCode: '',
    currencyCode: '',
    currencySymbol: '',
    currencySymbolPosition: 'prefix',
    displayName: '',
    locationKeywords: '',
    isActive: true,
    mandateRequired: false,
    paymentMethods: 'CARD',
  });
  const [editingCode, setEditingCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/api/admin/getCountries');
      setCountries(res.data || []);
    } catch (err) {
      toast.error('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCode) {
        await adminApi.put('/api/admin/updateCountries', form, {
          params: { countryCode: editingCode },
        });
        toast.success('Updated');
      } else {
        await adminApi.post('/api/admin/saveCountries', form);
        toast.success('Added');
      }
      resetForm();
      loadCountries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (country) => {
    setEditingCode(country.countryCode);
    setForm({
      countryCode: country.countryCode,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      currencySymbolPosition: country.currencySymbolPosition || 'prefix',
      displayName: country.displayName || '',
      locationKeywords: country.locationKeywords || '',
      isActive: country.isActive ?? true,
      mandateRequired: country.mandateRequired ?? false,
      paymentMethods: country.paymentMethods || 'CARD',
    });
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Delete ${code}?`)) return;
    try {
      await adminApi.delete('/api/admin/deleteCountries', {
        params: { countryCode: code },
      });
      toast.success('Deleted');
      loadCountries();
    } catch {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setEditingCode(null);
    setForm({
      countryCode: '',
      currencyCode: '',
      currencySymbol: '',
      currencySymbolPosition: 'prefix',
      displayName: '',
      locationKeywords: '',
      isActive: true,
      mandateRequired: false,
      paymentMethods: 'CARD',
    });
  };

  return (
    <div className="space-y-10 pb-16 pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-md">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Regions & Currency</h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Manage supported countries, currencies and subscription payment rules
            </p>
          </div>
        </div>

        {!editingCode && (
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium text-sm shadow-sm"
          >
            <Plus size={18} />
            Add Country
          </button>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingCode ? 'Edit Country' : 'New Country'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Country Code <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="countryCode"
                value={form.countryCode}
                onChange={handleInput}
                maxLength={2}
                disabled={!!editingCode}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2.5 px-3 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="IN"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Currency Code <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="currencyCode"
                value={form.currencyCode}
                onChange={handleInput}
                maxLength={3}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2.5 px-3"
                placeholder="INR"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Currency Symbol <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="currencySymbol"
                value={form.currencySymbol}
                onChange={handleInput}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2.5 px-3"
                placeholder="₹"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Symbol Position</label>
              <select
                name="currencySymbolPosition"
                value={form.currencySymbolPosition}
                onChange={handleInput}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2.5 px-3"
              >
                <option value="prefix">Prefix — ₹ 100</option>
                <option value="suffix">Suffix — 100 ₹</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleInput}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2.5 px-3"
                placeholder="India"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Location Keywords
              </label>
              <textarea
                name="locationKeywords"
                value={form.locationKeywords}
                onChange={handleInput}
                rows={2}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2.5 px-3"
                placeholder="IN, INDIA, BENGALURU, MUMBAI ..."
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Comma-separated — used for auto-detection
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="mandate"
                type="checkbox"
                name="mandateRequired"
                checked={form.mandateRequired}
                onChange={handleInput}
                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
              <label htmlFor="mandate" className="text-sm text-slate-700 font-medium">
                Mandate required (recurring) (For India auto-debit regulations)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="active"
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleInput}
                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
              <label htmlFor="active" className="text-sm text-slate-700 font-medium">
                Active
              </label>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Payment Methods
              </label>
              <input
                type="text"
                name="paymentMethods"
                value={form.paymentMethods}
                onChange={handleInput}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2.5 px-3"
                placeholder="CARD,UPI,NETBANKING"
              />
              <p className="mt-1.5 text-xs text-slate-500">Comma-separated (default: CARD)</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition text-sm shadow-sm ${
                submitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Saving...' : editingCode ? 'Update' : 'Add'}
            </button>

            {editingCode && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition text-sm"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Configured Regions</h2>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 text-slate-500 animate-spin" />
          </div>
        ) : countries.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No countries added yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Code</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Currency</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Symbol</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Position</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Methods</th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">Mandate</th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {countries.map((c) => (
                  <tr key={c.countryCode} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{c.countryCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{c.currencyCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{c.currencySymbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">{c.currencySymbolPosition}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{c.displayName || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.paymentMethods || 'CARD'}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          c.mandateRequired
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.mandateRequired ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          c.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-slate-600 hover:text-slate-900 mr-4"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.countryCode)}
                        className="text-rose-600 hover:text-rose-800"
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