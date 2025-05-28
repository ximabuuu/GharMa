import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom'


const Otp = () => {

    const [data,setData] = useState(["","","","","",""])

    const navigate = useNavigate()

    const inputRef = useRef([])
    const location = useLocation()
    console.log("location",location)

    useEffect(()=>{
        if (!location?.state?.email) {
            navigate("/forgot-password",{replace:true})
            return
        }
    },[location,navigate])


    const filled = data.every(el => el)
    const handleSubmit = async(e) => {
        e.preventDefault()
      

        try {
            const response = await Axios({
                ...SummaryApi.otp,
                data : {
                    otp : data.join(""),
                    email : location?.state?.email
                }
            })

            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                })
            } else{
                toast.error(response.data?.message || "Invalid OTP");
            }

            console.log("response",response)
        } catch (error) {
            AxiosToastError(error)
        }

        

    

    }

  return (
    <section className='w-full container mx-auto px-6'>
      <div className='bg-white my-6 w-full max-w-lg mx-auto rounded p-8'>
        <p className='font-bold text-2xl'>OTP Verification</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor="otp">Enter Your OTP</label>
                <div className='flex items-center gap-2 justify-between mt-3'>
                    {
                        data.map((element,index)=>{
                            return(
                                <input key={"otp"+index} type="text" className='bg-blue-50 w-full max-w-16 p-2 border outline-none focus:border-[#4A90E2] rounded text-center font-semibold' id="otp" ref={(ref)=>{
                                    inputRef.current[index] = ref
                                    return ref

                                }} maxLength={1} value={data[index]} onChange={(e)=>{
                                    const value = e.target.value
                                    
                                    const newData = [...data]
                                    newData[index] = value
                                    setData(newData)

                                    if (value && index < 5) {
                                        inputRef.current[index+1].focus()
                                    }

                                }} autoFocus/>
                            )
                        })
                    }
                </div>
        
            </div>
        
            

            <button disabled={!filled} className={`${filled ? "bg-[#4A90E2] hover:bg-blue-700" : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-widest`}>Verify OTP</button>
            
        </form>
        <p> Already have an Account? <Link to={"/login"} className='font-semibold text-[#4A90E2] hover:text-blue-700'>Login</Link></p> 
      </div>
    </section>
  )
}

export default Otp
