import React from 'react'

function Button({ className = '', color = 'bg-amber-600' }) {
  return (
    <button className={`${color} text-white px-6 py-2 rounded-lg hover:bg-amber-500 transition-all duration-200 ${className}`}>

    </button>
  )
}

export default Button;