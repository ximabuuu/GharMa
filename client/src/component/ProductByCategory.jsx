import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import ProdCardByCate from './ProdCardByCate'
import ProductCard from './ProductCard'
import { GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";
import { useSelector } from 'react-redux'
import { UrlConverter } from '../utils/UrlConverter'

const ProductByCategory = ({ id, name }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)


    const fetchProductByCategory = async (params) => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response
            console.log(responseData)

            if (responseData.success) {
                setData(responseData.data)
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductByCategory()
    }, [id])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 300
    }
    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 300
    }

    const loadingProd = new Array(6).fill(null)


    const handleProductListPage = () => {
        if (!subCategoryData || !Array.isArray(subCategoryData)) return '/';

        const subCategory = subCategoryData.find(sub =>
            sub.category?.some(categ => categ._id === id)
        );

        if (!subCategory) return '/'; // Fallback to home or a valid route

        return `/${UrlConverter(name)}-${id}/${UrlConverter(subCategory.name)}-${subCategory._id}`;
    };


    const redirectUrl = handleProductListPage()

    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold lg:text-2xl md:text-lg'>{name}</h3>
                <Link to={redirectUrl} className='font-medium text-[#4A90E2] hover:text-blue-700'>See All</Link>
            </div>
            <div className='relative flex items-center'>
                <div ref={containerRef} className='flex gap-4 md:gap-6 lg:gap-8 container mx-auto p-4 overflow-x-scroll scrollBarNone lg:overflow-hidden scroll-smooth '>
                    {loading &&
                        loadingProd.map((index) => {
                            return (
                                <ProdCardByCate key={"ProductByCategory1" + index} />
                            )
                        })
                    }
                    {
                        data.map((prod, index) => {
                            return (
                                <ProductCard data={prod} key={prod._id + "ProductByCategory"} />
                            )
                        })
                    }

                </div>
                <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between max-w-full'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-blue-100 hover:bg-gray-200 shadow-lg p-2 rounded-full text-lg'><GrFormPreviousLink size={20} /></button>
                    <button onClick={handleScrollRight} className='z-10 relative bg-blue-100 hover:bg-gray-200 shadow-lg p-2 rounded-full text-lg'><GrFormNextLink size={20} /></button>
                </div>
            </div>
        </div>
    )
}

export default ProductByCategory
