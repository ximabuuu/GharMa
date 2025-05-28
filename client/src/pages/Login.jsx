import React, { useState } from 'react'
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom'
import fetchUserDetails from '../utils/fetchUserDetails.js';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../redux/userSlice.js';


const Login = () => {

    const [data,setData] = useState({
        email : "",
        password : "",
    })

    const [showPassword,setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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
                ...SummaryApi.login,
                data : data
            })

            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accessToken',response.data.data.accessToken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                navigate("/")
            }

            console.log("response",response)
        } catch (error) {
            AxiosToastError(error)
        }

        

    

    }

  return (
    <section className='w-full container mx-auto px-6'>
      <div className='bg-white my-6 w-full max-w-lg mx-auto rounded p-8'>
        <p className='font-bold text-2xl'>Login</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor="email">Email</label>
                <input type="email" className='bg-blue-50 p-2 border outline-none focus:border-[#4A90E2] rounded' name="email" id="email" placeholder='Enter Your Email' autoFocus value={data.email} onChange={handleChange} />
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
                <Link to={"/forgot-password"} className='block ml-auto hover:text-[#4A90E2]'>Forgot Password?</Link>
            </div>
            

            <button disabled={!filled} className={`${filled ? "bg-[#4A90E2] hover:bg-blue-700" : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-widest`}>Login</button>
            
        </form>
        <p> Dont have an Account? <Link to={"/register"} className='font-semibold text-[#4A90E2] hover:text-blue-700'>Register</Link></p> 
      </div>
    </section>
  )
}

export default Login
