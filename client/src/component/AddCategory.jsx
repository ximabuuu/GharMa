import React, { useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import uploadImage from '../utils/uploadImage.js';
import Axios from '../utils/axios.js';
import SummaryApi from '../config/SummaryApi.js';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError.js';

const AddCategory = ({close,fetchData}) => {

    const [data,setData] = useState({
        name : "",
        image : ""
    })

    const [loading,setLoading] = useState(false)

    const handleOnChange = (e)=>{
        const {name, value} = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addCategory,
                data : data
            })
            const { data : responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchData()
                close()
            }

        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

    const handleUploadCate =async (e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        const response = await uploadImage(file)
        const {data : ImageResponse} = response 

        setData((preve)=>{
            return{
                ...preve,
                image : ImageResponse.data.url
            }
        })


    }

  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 p-4 bg-gray-600/60 flex items-center justify-center'>
        <div className='bg-white max-w-4xl w-full p-4 rounded '>
           <div className='flex items-center justify-between'>
            <h1 className='font-semibold'>Add Category</h1>
           <button onClick={close} className='w-fit block ml-auto'>
            <IoMdCloseCircle size={25} />
            </button>
           </div>
           <form className='grid gap-2' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label id='category'>Name</label>
                <input className='bg-blue-50 border border-blue-100 focus-within:border-black outline-none p-2 rounded' type="text" name="name" id="categoryName" placeholder='Enter Category Name' value={data.name} onChange={handleOnChange} />
            </div>
            <div className='grid gap-1'>
                <p>Image</p>
                <div className='flex gap-4 flex-col lg:flex-row items-center'>
                <div className='border border-blue-100 bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                    {
                        data.image ? (
                            <img src={data.image} alt="category" className='w-full h-full object-scale-down' />
                        ) : (
                            <p className='text-sm'>No Image</p>
                        )
                    }
                    
                </div>
                <label htmlFor='uploadCategoryImage'>
                <div className={`
                    ${!data.name ? "bg-gray-400" : "bg-red-800 text-white hover:bg-red-600 font-semibold"}
                    px-4 py-2 rounded cursor-pointer 
                    `}>Upload Image</div>
                    <input disabled={!data.name} onChange={handleUploadCate} type="file" id='uploadCategoryImage' className='hidden' />
                </label>
                </div>
            </div>
            <button className={
                `
                ${data.name && data.image ? "bg-red-800 text-white hover:bg-red-600" : "bg-gray-400"}
                py-2 font-semibold
                `
            }> {loading ? "Adding..." : "Add"}</button>
           </form>
        </div>
    </section>
  )
}

export default AddCategory
