import React, { useState } from 'react'
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom'


const ForgotPassword = () => {

    const [data,setData] = useState({
        email : "",
    })

    const navigate = useNavigate()

    const handleChange = (e) =>{
        const { name, value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const filled = Object.values(data).every(el => el)
    const handleSubmit = async(e) => {
        e.preventDefault()
      

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })

            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                navigate("/otp",{
                    state : {
                        email : data.email
                    }
                })
                setData({
                    email : "",
                })
                
            }

            console.log("response",response)
        } catch (error) {
            AxiosToastError(error)
        }

        

    

    }

  return (
    <section className='w-full container mx-auto px-6'>
      <div className='bg-white my-6 w-full max-w-lg mx-auto rounded p-8'>
        <p className='font-bold text-2xl'>Forgot Password</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor="email">Email</label>
                <input type="email" className='bg-blue-50 p-2 border outline-none focus:border-[#4A90E2] rounded' name="email" id="email" placeholder='Enter Your Email' autoFocus value={data.email} onChange={handleChange} />
            </div>
        
            

            <button disabled={!filled} className={`${filled ? "bg-[#4A90E2] hover:bg-blue-700" : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-widest`}>Send OTP</button>
            
        </form>
        <p> Already have an Account? <Link to={"/login"} className='font-semibold text-[#4A90E2] hover:text-blue-700'>Login</Link></p> 
      </div>
    </section>
  )
}

export default ForgotPassword
