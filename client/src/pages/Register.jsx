import React, { useState } from 'react'
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate, useNavigation } from 'react-router-dom'


const Register = () => {

    const [data,setData] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : "",
    })

    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
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
        if (data.password !== data.confirmPassword) {
            toast.error(
                "Password and Confirm Password must be same."
            )
            return 
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })

            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }

            console.log("response",response)
        } catch (error) {
            AxiosToastError(error)
        }

        

    

    }

  return (
    <section className='w-full container mx-auto px-6'>
      <div className='bg-white my-6 w-full max-w-lg mx-auto rounded p-8'>
        <p className='font-bold text-2xl'>Welcome to GharMa</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor="name">Name</label>
                <input type="text" className='bg-blue-50 p-2 border outline-none focus:border-[#4A90E2] rounded' name="name" id="name" placeholder='Enter Your Name' autoFocus value={data.name} onChange={handleChange} />
            </div>
            <div className='grid gap-1'>
                <label htmlFor="email">Email</label>
                <input type="email" className='bg-blue-50 p-2 border outline-none focus:border-[#4A90E2] rounded' name="email" id="email" placeholder='Enter Your Email' value={data.email} onChange={handleChange} />
            </div>
            <div className='grid gap-1'>
                <label htmlFor="password">Password</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-[#4A90E2]'>
                <input type={showPassword ? "text" : "password"} className='w-full outline-none' name="password" id="password" placeholder='Enter Your Password' value={data.password} onChange={handleChange} />
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
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-[#4A90E2]'>
                <input type={showConfirmPassword ? "text" : "password"} className='w-full outline-none' name="confirmPassword" id="confirmPassword" placeholder='Confirm Your Password'  value={data.confirmPassword} onChange={handleChange} />
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

            <button disabled={!filled} className={`${filled ? "bg-[#4A90E2] hover:bg-blue-700" : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-widest`}>Register</button>
            
        </form>
        <p> Already have an Account? <Link to={"/login"} className='font-semibold text-[#4A90E2] hover:text-blue-700'>Login</Link></p> 
      </div>
    </section>
  )
}

export default Register
