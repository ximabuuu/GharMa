    import React, { useState } from 'react'
    import { IoMdCloseCircle } from "react-icons/io";
    import uploadImage from '../utils/uploadImage';
    import { useSelector } from 'react-redux';
    import SummaryApi from '../config/SummaryApi.js';
    import Axios from '../utils/axios';
    import toast from 'react-hot-toast';
    import AxiosToastError from '../utils/AxiosToastError';

    const AddSubCategory = ({url,close,fetchData}) => {

        const [subCategoryData,setSubCategoryData] = useState({
            name : "",
            image : "",
            category : []
        })

        const allCategory = useSelector(state => state.product.allCategory)
        

        const handleChange = (e)=>{
            const {name,value} = e.target

            setSubCategoryData((preve)=>{
                return{
                    ...preve,
                    [name] : value
                }
            })
        }

        const handleUploadSubCateImg =async (e)=>{
            const file = e.target.files[0]

            if (!file) {
            return 
            }

            const response = await uploadImage(file)
            const {data : ImageResponse} = response 

            setSubCategoryData((preve)=>{
                return{
                    ...preve,
                    image : ImageResponse.data.url
                }
            })

        }

        const handleRemoveSelCat = (categoryId)=>{
            const index = subCategoryData.category.findIndex(el => el._id === categoryId)
            subCategoryData.category.splice(index,1)
            setSubCategoryData((preve)=>{
                return{
                    ...preve
                }
            })
        }

        const handleSubmit = async (e)=>{
            e.preventDefault()

            try {
                // setLoading(true)
                const response = await Axios({
                    ...SummaryApi.addsubcategory,
                    data : subCategoryData
                })
                const { data : responseData } = response

                if (responseData.success) {
                    toast.success(responseData.message)
                    close()
                    fetchData()
                }

            } catch (error) {
                AxiosToastError(error)
            }finally{
                // setLoading(false)
            }
        }

    return (
        <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800/70 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-5xl bg-white p-4 rounded'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold'>
                        Add Sub Category
                    </h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoMdCloseCircle size={25} />
                    </button>
                </div>
                <form className='my-4 grid gap-3' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name</label>
                        <input 
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            type="text"
                            className='p-3 bg-blue-50 border border-blue-100 outline-none focus-within:border-red-800 rounded'
                            />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex flex-col lg:flex-row items-center gap-3'>
                            <div className='border h-36 lg:w-36 w-full bg-blue-50 border-blue-100 flex items-center justify-center'>
                                {
                                    subCategoryData.image ? (
                                        <img src={subCategoryData.image} alt="subCategory" className='w-full h-full object-scale-down' />
                                    ):(
                                        <p className='text-sm text-neutral-600'>No Image</p>
                                    )
                                }
                            </div>
                            <label htmlFor="uploadSubCategoryImage">
                                <div className={`
                                    ${!subCategoryData.name ? "bg-gray-400" : "bg-red-800 text-white hover:bg-red-600 font-semibold"}
                                        px-4 py-2 rounded cursor-pointer 
                                    `}>
                                    Upload Image
                                </div>
                                <input 
                                    type="file"
                                    id='uploadSubCategoryImage'
                                    className='hidden'
                                    disabled={!subCategoryData.name}
                                    onChange={handleUploadSubCateImg}
                                    />
                            </label>
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="">Select Category</label>
                        <div className='border focus-within:border-red-800 rounded'>
                        {/* display value */}
                        <div className='flex flex-wrap gap-2'>
                            {
                                subCategoryData.category.map((cat,index)=>{
                                    return(
                                        <h1 key={cat._id+"selectedValue"} className='bg-blue-50 shadow-md px-1 py-2 flex items-center gap-2'>{cat.name}
                                            <div className='cursor-pointer hover:text-red-800' onClick={()=>handleRemoveSelCat(cat._id)}>
                                                <IoMdCloseCircle size={18} />
                                            </div>
                                        </h1>
                                    )
                                })
                            }
                        </div>

                        {/* select category */}
                        <select onChange={(e)=>{
                            const value = e.target.value
                            const categoryDetails = allCategory.find(el => el._id == value)
                            setSubCategoryData((preve)=>{
                                return{
                                    ...preve,
                                    category : [...preve.category,categoryDetails]
                                }
                            })
                        }} 
                        className='w-full p-2 bg-transparent outline-none border '>
                            <option value={""} disabled >Select Category</option>
                            {
                                allCategory.map((category,index)=>{
                                    return(
                                        <option value={category?._id} key={category._id+"subcategory"}>{category?.name}</option>
                                    )
                                })
                            }
                        </select>
                        </div>
                    </div>

                    <button className={`py-2 font-semibold 
                            ${subCategoryData.name && subCategoryData.image && subCategoryData.category[0] ? "bg-red-800 text-white hover:bg-red-600" : "bg-gray-400"}
                        `}>
                        Add 
                    </button>

                </form>
            </div>
        </section>
    )
    }

    export default AddSubCategory
