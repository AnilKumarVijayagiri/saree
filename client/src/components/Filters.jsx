export default function Filters({ value, onChange }){
  const set = (k,v)=> onChange({ ...value, [k]: v })
  return (
    <div className="card p-4 grid md:grid-cols-4 gap-4">
      <input placeholder="Search" className="border rounded-xl px-3 py-2" value={value.q||''} onChange={e=>set('q',e.target.value)} />
      <select className="border rounded-xl px-3 py-2" value={value.category||''} onChange={e=>set('category',e.target.value)}>
        {['','Sarees','Kurtis','Kurti Sets','Ethnic Frocks'].map(f=>(<option key={f} value={f}>{f||'All Categories'}</option>))}
      </select>
      <input placeholder="Min ₹" className="border rounded-xl px-3 py-2" value={value.min||''} onChange={e=>set('min',e.target.value)} />
      <input placeholder="Max ₹" className="border rounded-xl px-3 py-2" value={value.max||''} onChange={e=>set('max',e.target.value)} />
    </div>
  )
}
