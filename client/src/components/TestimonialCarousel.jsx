import React from "react"
export default function TestimonialCarousel({ items=[] }){
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map(t => (
        <div key={t._id} className="card p-4">
          <div className="font-semibold">{t.name}</div>
          <div className="text-yellow-500">{'★'.repeat(t.rating||5)}</div>
          <p className="text-gray-600 mt-2">{t.message}</p>
        </div>
      ))}
    </div>
  )
}
