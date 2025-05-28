import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/uploadImage.js';
import Loading from '../component/Loading.jsx';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoMdCloseCircle } from "react-icons/io";
import AddField from '../component/AddField.jsx';
import Axios from '../utils/axios.js';
import SummaryApi from '../config/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import successMsg from '../utils/SuccessMsg.js';

const AddProduct = () => {

  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unitPrice: "",
    BasePrice: "",
    pricePerUnit: "",
    minUnits: "",
    addOns: [],
    pricingModel: "",
    discount: "",
    description: "",
    more_details: {}
  })

  const [loading, setLoading] = useState(false)
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCat, setSelectCat] = useState("")
  const [selectSubCat, setSelectSubCat] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [selectRestro, setSelectRestro] = useState("")

  const [openMoreField, setOpenMoreField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setLoading(false)

  }

  const handleDelImg = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleDelCat = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleDelSubCat = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }



  const handleAddField = async (index) => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenMoreField(false)

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)

    try {
      const response = await Axios({
        ...SummaryApi.addProduct,
        data: data
      })
      const { data: responseData } = response
      if (responseData.success) {
        successMsg(responseData.message)
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unitPrice: "",
          BasePrice: "",
          pricePerUnit: "",
          minUnits: "",
          addOns: [],
          pricingModel: "",
          discount: "",
          description: "",
          more_details: {}
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }

  }
  // useEffect(()=>{
  //   successMsg("Uploaded Successfully")
  // },[])

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Add Products</h2>
      </div>
      <div className='grid p-3'>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='name' className='font-medium'>Name</label>
            <input id='name' type="text" name='name' placeholder='Enter Product Name' value={data.name} onChange={handleChange} required
              className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='description' className='font-medium'>Description</label>
            <textarea id='description' type="text" name='description' placeholder='Enter Product Descriptions' value={data.description} onChange={handleChange} required multiple rows={3}
              className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded resize-none border-blue-200'
            />
          </div>
          <div className='grid gap-1'>
            <p className='font-medium'>Image</p>
            <div>
              <label htmlFor='Image' className='bg-blue-50 h-24 flex items-center justify-center rounded border border-blue-200 cursor-pointer'>
                <div className='text-center flex justify-center items-center flex-col'>
                  {
                    loading ? <Loading /> : (
                      <>
                        <FaCloudUploadAlt size={60} />
                        <p>Upload Image</p>
                      </>
                    )
                  }

                </div>
                <input type="file"
                  className='hidden'
                  id='Image'
                  accept='image/*'
                  onChange={handleUpload}
                />
              </label>
            </div>
            {/* Display uploaded images */}
            <div className="flex gap-4 mt-1">
              {data.image.length > 0 &&
                data.image.map((img, index) => (
                  <div key={index} className="h-20 w-20 bg-blue-50 border relative group">
                    <img src={img} alt={`Uploaded ${index}`} className="w-full h-full object-cover rounded" />
                    <div onClick={() => handleDelImg(index)} className='absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 hover:text-white cursor-pointer rounded-full hidden group-hover:block'>
                      <MdDelete />
                    </div>
                  </div>
                ))}
            </div>

          </div>
          <div className='grid gap-1'>
            <label htmlFor="" className='font-medium'>Category</label>
            <div>
              <select name="" id="" value={selectCat} onChange={(e) => {
                const value = e.target.value
                const category = allCategory.find(el => el._id === value)
                console.log("value", category)

                setData((preve) => {
                  return {
                    ...preve,
                    category: [...preve.category, category]
                  }
                })
                setSelectCat("")

              }} className='bg-blue-50 w-full border p-2 rounded border-blue-200'>
                <option value={""}>Select Category</option>
                {
                  allCategory.map((cat, index) => {
                    return (
                      <option value={cat?._id} key={cat?._id + index + "category"}>{cat.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.category.map((cat, index) => {
                    return (
                      <div key={cat._id + index + "product"} className='text-sm flex items-center gap-1 bg-blue-50 mt-1'>
                        <p>{cat?.name}</p>
                        <div className='hover:text-red-800 cursor-pointer' onClick={() => handleDelCat(index)}>
                          <IoMdCloseCircle size={15} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className='grid gap-1'>
            <label htmlFor="" className='font-medium'>Sub Category</label>
            <div>
              <select name="" id="" value={selectSubCat} onChange={(e) => {
                const value = e.target.value
                const subCategory = allSubCategory.find(el => el._id === value)


                setData((preve) => {
                  return {
                    ...preve,
                    subCategory: [...preve.subCategory, subCategory]
                  }
                })
                setSelectSubCat("")

              }} className='bg-blue-50 w-full border p-2 rounded border-blue-200'>
                <option value={""}>Select Sub Category</option>
                {
                  allSubCategory.map((sub, index) => {
                    return (
                      <option value={sub?._id} key={sub?._id + index + "subcategory"}>{sub.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.subCategory.map((sub, index) => {
                    return (
                      <div key={sub._id + index + "cat"} className='text-sm flex items-center gap-1 bg-blue-50 mt-1'>
                        <p>{sub?.name}</p>
                        <div className='hover:text-red-800 cursor-pointer' onClick={() => handleDelSubCat(index)}>
                          <IoMdCloseCircle size={15} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          {/* Pricing Model */}
          <div className='grid gap-1'>
            <label htmlFor='pricingModel' className='font-medium'>Pricing Model</label>
            <select
              id='pricingModel'
              name='pricingModel'
              value={data.pricingModel}
              onChange={handleChange}
              className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
              required
            >
              <option value=''>Select Pricing Model</option>
              <option value='fixed'>Fixed</option>
              <option value='per_unit'>Per Unit</option>
              <option value='per_hour'>Per Hour</option>
              <option value='area_based'>Area Based</option>
            </select>
          </div>

          {/* Base Price */}
          <div className='grid gap-1'>
            <label htmlFor='BasePrice' className='font-medium'>Base Price</label>
            <input
              id='BasePrice'
              type='number'
              name='BasePrice'
              placeholder='Enter Base Price'
              value={data.BasePrice}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor='discount' className='font-medium'>Discount</label>
            <input
              id='discount'
              type='number'
              name='discount'
              placeholder='Enter Discount'
              value={data.discount}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
            />
          </div>

          {/* Per Unit Fields - Conditional */}
          {data.pricingModel === 'per_unit' && (
            <>
              <div className='grid gap-1'>
                <label htmlFor='pricePerUnit' className='font-medium'>Price Per Unit</label>
                <input
                  id='pricePerUnit'
                  type='number'
                  name='pricePerUnit'
                  placeholder='Enter Price Per Unit'
                  value={data.pricePerUnit}
                  onChange={handleChange}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='unitName' className='font-medium'>Unit Name</label>
                <input
                  id='unitName'
                  type='text'
                  name='unitName'
                  placeholder='e.g. seat, sqft'
                  value={data.unitName}
                  onChange={handleChange}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='minUnits' className='font-medium'>Minimum Units</label>
                <input
                  id='minUnits'
                  type='number'
                  name='minUnits'
                  placeholder='Minimum Units'
                  value={data.minUnits}
                  onChange={handleChange}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
                />
              </div>
            </>
          )}

          {/* AddOns Field */}
          <div className='grid gap-1'>
            <label className='font-medium'>Add-Ons</label>
            {data.addOns?.map((addon, index) => (
              <div key={index} className='flex gap-2 mb-2'>
                <input
                  type='text'
                  placeholder='Addon Name'
                  value={addon.name}
                  onChange={(e) => {
                    const updated = [...data.addOns];
                    updated[index].name = e.target.value;
                    setData({ ...data, addOns: updated });
                  }}
                  className='bg-blue-50 p-2 border rounded w-full'
                />
                <input
                  type='number'
                  placeholder='Price'
                  value={addon.price}
                  onChange={(e) => {
                    const updated = [...data.addOns];
                    updated[index].price = e.target.value;
                    setData({ ...data, addOns: updated });
                  }}
                  className='bg-blue-50 p-2 border rounded w-32'
                />
              </div>
            ))}
            <button
              onClick={() => setData({ ...data, addOns: [...data.addOns, { name: '', price: '' }] })}
              type='button'
              className='mt-1 text-sm border border-red-800 rounded px-3 py-1 hover:bg-red-800 hover:text-white'
            >
              + Add Add-On
            </button>
          </div>

          {/* More Details (Dynamic Fields) */}
          <div className='mt-4'>
            {Object.keys(data.more_details)?.map((m, index) => (
              <div key={index} className='grid gap-1'>
                <label htmlFor={m} className='font-medium'>{m}</label>
                <input
                  id={m}
                  type='text'
                  value={data.more_details[m]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((prev) => ({
                      ...prev,
                      more_details: {
                        ...prev.more_details,
                        [m]: value
                      }
                    }));
                  }}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-red-800 rounded border-blue-200'
                />
              </div>
            ))}
          </div>

          {/* Add More Field Button */}
          <div
            onClick={() => setOpenMoreField(true)}
            className='inline-block bg-white hover:bg-red-800 hover:text-white cursor-pointer text-black py-1 px-3 rounded w-32 text-center font-semibold border border-red-800 mt-2'
          >
            Add Field
          </div>

          <button className='bg-red-800 hover:bg-red-600 text-white rounded py-2 font-semibold'>
            Add
          </button>
        </form>
      </div>

      {
        openMoreField && (
          <AddField value={fieldName}
            onChange={(e) => { setFieldName(e.target.value) }}
            submit={handleAddField}
            close={() => setOpenMoreField(false)} />
        )
      }

    </section>
  )
}

export default AddProduct
