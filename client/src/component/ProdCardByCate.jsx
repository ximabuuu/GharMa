import React from 'react'

const ProdCardByCate = () => {
  return (
    <div className='border border-blue-100 bg-white shadow-md hover:-translate-y-2.5 transition- py-2 lg:p-4 grid lg:gap-3 gap-1 mx-auto min-w-36 max-w-36 lg:max-w-52 lg:min-w-52 rounded cursor-pointer animate-pulse '>
      <div className='min-h-24 lg:min-h-20 max-w-36 lg:max-w-43 bg-blue-50 rounded flex items-center justify-center'>
        <p className='text-gray-400'>GharMa</p>
      </div>
      <div className='p-2 lg:p-3 h-8 bg-blue-50 rounded w-20'>

      </div>
      <div className='p-2 lg:p-3 bg-blue-50 rounded '>

      </div>
      <div className='p-2 lg:p-3 bg-blue-50 rounded w-14'>

      </div>
      <div className='flex items-center justify-between gap-3 '>
        <div className='p-2 lg:p-3 bg-blue-50 rounded w-16'></div>
        <div className='p-2 lg:p-3 bg-blue-50 rounded w-16'></div>
      </div>
    </div>
  )
}

export default ProdCardByCate
