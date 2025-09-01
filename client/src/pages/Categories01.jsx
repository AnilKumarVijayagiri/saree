// import { useEffect, useState } from 'react'
// import { api } from '../lib/api'

// export default function Categories01() {
//   const [list, setList] = useState([])
//   const [form, setForm] = useState(null)

//   useEffect(() => {
//     (async () => {
//       const { data } = await api.get('/api/products')
//       setList(data)
//     })()
//   }, [])

//   const del = async (id) => {
//     if (confirm('Delete?')) {
//       await api.delete(`/api/products/${id}`)
//       setList(list.filter(p => p._id !== id))
//     }
//   }

//   return (
//     <div className="space-y-12">
//       {['Sarees','Kurtis','Kurti Sets','Ethnic Frocks','Other'].map(cat => {
//         const items = list.filter(p => p.category === cat)
//         return (
//           <div key={cat}>
//             <h2 className="text-xl font-bold mb-3 text-gray-800 border-b pb-1">{cat}</h2>

//             {items.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-100 text-left text-sm">
//                       <th className="p-3">Image</th>
//                       <th className="p-3">Name</th>
//                       <th className="p-3">Price</th>
//                       <th className="p-3">Category</th>
//                       <th className="p-3 text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.map(p => (
//                       <tr key={p._id} className="border-b hover:bg-gray-50 text-sm">
//                         <td className="p-3">
//                           <img
//                             src={p.images?.[0] || 'https://via.placeholder.com/60'}
//                             className="w-14 h-14 object-cover rounded-md"
//                           />
//                         </td>
//                         <td className="p-3 font-medium">{p.name}</td>
//                         <td className="p-3">₹{p.price}</td>
//                         <td className="p-3">{p.category}</td>
//                         <td className="p-3 text-center space-x-2">
//                           <button
//                             className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
//                             onClick={() => setForm(p)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
//                             onClick={() => del(p._id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-gray-400 italic">No products in this category.</p>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }
