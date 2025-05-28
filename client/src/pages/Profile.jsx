import React, { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import ProfileEdit from '../component/ProfileEdit';
import Axios from '../utils/axios';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { setUserDetails } from '../redux/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import SummaryApi from '../config/SummaryApi.js';

const Profile = () => {

    const user = useSelector(state => state.user)
    const [openProfileEdit, setOpenProfileEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile
        })
    }, [user])


    const handleOnChange = (e) => {
        const { name, value } = e.target;

        if (name === "mobile") {
            setUserData((prev) => ({
                ...prev,
                [name]: value.startsWith("+") ? value : "+" + value.replace(/\D/g, ""),
            }));
        } else {
            setUserData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-4'>
            <div className='w-22 h-22 bg-[#4A90E2] flex items-center justify-center rounded-full overflow-hidden'>
                {
                    user.avatar ? (
                        <img className='w-full h-full' src={user.avatar} alt={user.name} />
                    ) : (
                        <FaUserCircle size={80} />
                    )
                }
            </div>
            <button onClick={() => setOpenProfileEdit(true)} className='text-sm min-w-22 border hover:bg-[#4A90E2] hover:text-white border-[#4A90E2] px-3 py-1 rounded-full mt-3'>Edit</button>
            {
                openProfileEdit && (
                    <ProfileEdit close={() => setOpenProfileEdit(false)} />
                )
            }
            <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
                <div className='grid '>
                    <label>Name</label>
                    <input type="text" placeholder='Enter Your Name' className='p-2 bg-blue-50 outline-black border focus-within:border-gray-950 ' value={userData.name} required onChange={handleOnChange} name='name'
                    />
                </div>
                <div className='grid '>
                    <label htmlFor='email'>Email</label>
                    <input type="email" id='email' placeholder='Enter Your Email' className='p-2 bg-blue-50 outline-black border focus-within:border-gray-950 ' value={userData.email} required onChange={handleOnChange} name='email'
                    />
                </div>
                <div className='grid '>
                    <label htmlFor='mobile'>Mobile</label>
                    <input
                        type="tel"
                        id='mobile'
                        placeholder='Enter Your Mobile (+977...)'
                        className='p-2 bg-blue-50 outline-black border focus-within:border-gray-950 '
                        value={userData.mobile}
                        required
                        onChange={handleOnChange}
                        name='mobile'
                        pattern="\+[0-9]+"
                        title="Enter a valid phone number with country code (e.g., +9779812345678)"
                    />
                </div>

                <button className='border px-4 py-2 font-semibold bg-white hover:bg-[#4A90E2] hover:text-white border-[#4A90E2]'>
                    {
                        loading ? "Ekxin Pakh" : "Submit"
                    }
                </button>
            </form>
        </div>
    )
}

export default Profile
