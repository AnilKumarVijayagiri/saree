import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function GalleryAdmin(){
  const empty = { title:'', imageUrl:'' }
  const [list, setList] = useState([])
  const [form, setForm] = useState(empty)

  const load = async ()=>{ const {data}=await api.get('/api/gallery'); setList(data) }
  useEffect(()=>{ load() }, [])

  const save = async ()=>{ await api.post('/api/gallery', form); setForm(empty); load() }
  const del = async (id)=>{ if(confirm('Delete?')){ await api.delete(`/api/gallery/${id}`); load() } }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-4">
        <h3 className="font-bold mb-2">Add Image</h3>
        <input className="border rounded-xl px-3 py-2 w-full" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input className="border rounded-xl px-3 py-2 w-full mt-2" placeholder="Image URL" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/>
        <div className="mt-3">
          <button className="btn" onClick={save}>Add</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map(img => (
          <div key={img._id} className="card p-2">
            <img src={img.imageUrl} className="w-full h-40 object-cover rounded-xl"/>
            <div className="flex justify-between items-center mt-2">
              <div className="font-semibold">{img.title}</div>
              <button className="btn !bg-red-600" onClick={()=>del(img._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
