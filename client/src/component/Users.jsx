import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { LiaGiftsSolid } from "react-icons/lia";
import { FaLocationDot } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { AiFillProduct } from "react-icons/ai";
import { IoBagAdd } from "react-icons/io5";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { GiShop } from "react-icons/gi";
import { SlPresent } from "react-icons/sl";
import { FaRegImage } from "react-icons/fa6";
import Divider from './Divider';
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js';
import { logout } from '../redux/userSlice';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError.js';
import Admin from '../utils/Admin.js';
import Worker from '../utils/Worker.js';

const Users = ({ close }) => {

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })

      if (response.data.success) {
        if (close) {
          close()
        }
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close()
    }
  }


  return (
    <div className='px-6'>
      <div className='font-semibold'>My Account</div>
      <div className='flex items-center'>
        <Link onClick={handleClose} className='hover:text-red-800' to={"/dashboard/profile"}><div className='text-sm flex gap-2'>{user.name || user.mobile}<FiExternalLink size={15} /> </div></Link>
        <span className='text-md font-semibold text-red-800'>{user.role === "ADMIN" ? "(admin)" : user.role === "WORKER" ? "(worker)" : ""}</span>
      </div>

      <Divider />

      <div className='text-sm grid gap-2'>
        {
          Admin(user.role) && (
            <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/category"}>Category <BiSolidCategoryAlt size={18} /></Link>
          )
        }
        {
          Admin(user.role) && (
            <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/subcategory"}>Sub Category <MdCategory size={18} /></Link>
          )
        }
        {
          Admin(user.role) && (
            <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/add-product"}>Add Product <IoBagAdd size={18} /></Link>
          )
        }
        {
          Admin(user.role) && (
            <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/products"}>Products <AiFillProduct size={20} /></Link>
          )
        }
        {
          Admin(user.role) && (
            <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/allorders"}>All Orders <SlPresent size={17} /></Link>
          )
        }
        {
          Worker(user.role) && (
            <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/orders"}>Orders <SlPresent size={17} /></Link>
          )
        }
        {
          Admin(user.role) && (
            <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/popup"}>Pop Up <FaRegImage size={15} /></Link>
          )
        }
        <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/myorders"}>My Orders <LiaGiftsSolid size={20} /></Link>
        <Link onClick={handleClose} className='flex gap-1 hover:bg-[#4A90E2] rounded hover:text-white px-2 py-1' to={"/dashboard/address"}>Address <FaLocationDot size={15} /></Link>
        <button onClick={handleLogout} className='text-left bg-[#4A90E2] text-white p-2 rounded cursor-pointer px-2'>Log Out</button>
      </div>
    </div>
  )
}

export default Users
