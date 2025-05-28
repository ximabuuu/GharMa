import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UrlConverter } from '../utils/UrlConverter'
import { MdDeliveryDining } from "react-icons/md";
import { DiscountedPrice } from '../utils/DiscountedPrice';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi.js';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../global/globalFunc';
import AddToCart from './AddToCart';

const ProductCard = ({ data }) => {

  const url = `/product/${UrlConverter(data.name)}-${data._id}`
  const [loading, setLoading] = useState(false)
  const { fetchCartItem } = useGlobalContext()

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.addtocart,
        data: {
          productId: data?._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }

  }

  

  return (
    <Link to={url}>
      <div className='border border-blue-100 bg-white shadow-md hover:-translate-y-2.5 transition- p-4 lg:p-4 grid lg:gap-3 gap-3 mx-auto min-w-36  lg:max-w-52 lg:min-w-52 rounded cursor-pointer '>
        <div className='lg:min-h-32 w-full  max-h-32 rounded'>
          <img src={data.image[0]} alt="product image" className='w-full h-full object-scale-down lg:scale-110 rounded' />
        </div>
        <div className='flex items-center lg:justify-between'>
          
          <div>
            {
              data.discount !== 0 && (
                <p className='text-red-800 text-xs mx-2 lg:mx-0 lg:text-sm w-fit px-1 p-[1px] bg-red-50 rounded '>{data.discount}% off</p>
              )
            }
          </div>
        </div>
        <div className='lg:px-0 px-2 font-medium text-ellipsis text-sm lg:text-base line-clamp-1 lg:line-clamp-1 '>
          {data.name}
        </div>
        <div className='w-fit text-sm lg:text-base px-2 lg:px-0 '>
          {data.unit}
        </div>
        <div className=' flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base px-2 lg:px-0 '>
          <div className='lg:font-semibold font-medium '>
            Rs.{DiscountedPrice(data.BasePrice, data.discount)}
          </div>
          <div className=''>
            <AddToCart data={data}/>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
