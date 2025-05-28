import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import SummaryApi from '../config/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import Axios from '../utils/axios';

const ResetPassword = () => {

    const location = useLocation()
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const [data,setData] = useState({
        email : "",
        newPassword : "",
        confirmPassword : ""
    })

    const filled = Object.values(data).every(el => el)

    useEffect(()=>{
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }
        if (location?.state?.email) {
            setData((preve)=>{
                return{
                    ...preve,
                    email : location?.state?.email
                }
            })
        }
    },[])
    console.log("reset",data)

    const handleChange = (e) =>{
        const { name, value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (data.newPassword !== data.confirmPassword) {
            toast.error(
                "New Password and Confirm Password must be same."
            )
            return 
        }
      

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data : data
            })

            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email : "",
                    newPassword : "",
                    confirmPassword : ""
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
        <p className='font-bold text-2xl'>Reset Password</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
           <div className='grid gap-1'>
                <label htmlFor="newPassword">Enter Your New Password</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-[#4a90e2]'>
                    <input type={showPassword ? "text" : "password"} className='w-full outline-none' name="newPassword" id="password" placeholder='Enter Your Password' autoFocus value={data.newPassword} onChange={handleChange} />
                        <div onClick={()=> setShowPassword(preve => !preve)} className='cursor-pointer'>
                               {
                                   showPassword ? (
                                       <IoEye />
                                   ) : (
                                       <IoEyeOff />
                                   )
                               }
                               
                        </div>
                </div>
                        
            </div>
            <div className='grid gap-1'>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-[#4a90e2]'>
                    <input type={showConfirmPassword ? "text" : "password"} className='w-full outline-none' name="confirmPassword" id="password" placeholder='Enter Your Confirm Password'  value={data.confirmPassword} onChange={handleChange} />
                        <div onClick={()=> setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                               {
                                   showConfirmPassword ? (
                                       <IoEye />
                                   ) : (
                                       <IoEyeOff />
                                   )
                               }
                               
                        </div>
                </div>
                        
            </div>
        
            

            <button disabled={!filled} className={`${filled ? "bg-[#4a90e2] hover:bg-blue-700" : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-widest`}>Change Password</button>
            
        </form>
        <p> Already have an Account? <Link to={"/login"} className='font-semibold text-[#4a90e2] hover:text-blue-700'>Login</Link></p> 
      </div>
    </section>
  )
}

export default ResetPassword
