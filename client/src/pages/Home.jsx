import React from 'react'
import banner from '../assets/banner1.jpg'
import bannerMobile from '../assets/banner-mobile.png'
import { useSelector } from 'react-redux'
import { UrlConverter } from '../utils/UrlConverter'
import { useNavigate } from 'react-router-dom'
import ProductByCategory from '../component/ProductByCategory.jsx'
import Search from '../component/Search.jsx'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleProductListPage = (id, cate) => {
    const subCategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(categ => categ._id === id)
      return filterData || null
    })
    const url = `/${UrlConverter(cate)}-${id}/${UrlConverter(subCategory.name)}-${subCategory._id}`
    navigate(url)
  }

  return (
    <section className='bg-[#f5f5f5]'>
      <div className='container mx-auto rounded my-2 px-4'>

        {/* Banner Section */}
        <div className='w-full px-4 h-full min-h-33 lg:min-h-48 rounded'>
          <div className='w-full h-[45vh] hidden md:block rounded bg-cover bg-center relative' style={{ backgroundImage: `url(${banner})` }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/30 rounded">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                Discover Services that Make Life Easier
              </h1>
              <div>
                <Search/>
              </div>
            </div>
          </div>
        </div>

        {/* Category Heading */}
        <div className='flex justify-center'>
          <div className='px-4 py-1 my-4 max-w-fit bg-[#4A90E2] rounded shadow'>
            <h1 className='font-bold text-white text-lg lg:text-2xl'>Book by Category</h1>
          </div>
        </div>

        {/* Category Grid */}
        <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6 px-4 my-4'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((_, index) => (
                <div key={index} className='bg-white rounded p-4 shadow animate-pulse h-32'></div>
              ))
            ) : (
              categoryData.map((cate) => (
                <div key={cate._id} onClick={() => handleProductListPage(cate._id, cate.name)} className='flex flex-col items-center bg-white rounded shadow-md hover:shadow-lg p-2 cursor-pointer transition'>
                  <img className='rounded w-16 h-16 object-contain mb-2' src={cate.image} alt={cate.name} />
                  <p className='text-sm font-medium text-center'>{cate.name}</p>
                </div>
              ))
            )
          }
        </div>

        {/* Product by Category */}
        {
          categoryData.map((cat) => (
            <ProductByCategory key={cat._id} id={cat._id} name={cat.name} />
          ))
        }

        {/* About Section */}
        <div className='bg-white my-10 p-6 rounded shadow-md'>
          <h2 className='text-xl lg:text-2xl font-bold mb-4 text-center text-gray-800'>Why Choose GharMa?</h2>
          <p className='text-gray-600 text-center max-w-3xl mx-auto'>
            GharMa is your one-stop solution for all home services. From cleaning and repairs to wellness and tech support, our experts bring convenience and quality to your doorstep.
          </p>
        </div>

        {/* How it Works Section */}
        <div className='my-10 px-4'>
          <h2 className='text-xl lg:text-2xl font-bold text-center text-gray-800 mb-6'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
            <div className='bg-white p-6 rounded shadow'>
              <h3 className='font-semibold text-lg text-[#4A90E2] mb-2'>1. Browse Services</h3>
              <p className='text-gray-600'>Explore a wide range of services tailored to your needs.</p>
            </div>
            <div className='bg-white p-6 rounded shadow'>
              <h3 className='font-semibold text-lg text-[#4A90E2] mb-2'>2. Book Instantly</h3>
              <p className='text-gray-600'>Schedule services with ease through our intuitive platform.</p>
            </div>
            <div className='bg-white p-6 rounded shadow'>
              <h3 className='font-semibold text-lg text-[#4A90E2] mb-2'>3. Enjoy Convenience</h3>
              <p className='text-gray-600'>Sit back and relax while our professionals handle the rest.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Home