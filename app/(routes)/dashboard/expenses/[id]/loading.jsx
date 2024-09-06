import React from 'react'

function loading() {
  return (
    <div className="w-full flex flex-col justify-center items-center max-auto min-h-screen">
    <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600">
    </div>
    <span>
    loading...
    </span>
  </div>
  )
}

export default loading