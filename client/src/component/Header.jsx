import React, { useEffect, useState } from 'react'
import logo from '../assets/logoo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { MdManageAccounts } from "react-icons/md";
import Users from './Users';
import { useGlobalContext } from '../global/globalFunc';
import DisplayCart from './DisplayCart';

const Header = () => {

    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [userMenu, setUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    // const [totalPrice,setTotalPrice] = useState(0)
    // const [totalQty,setTotalQty] = useState(0)

    const { totalPrice, totalQty } = useGlobalContext()
    const [openCart,setOpenCart] = useState(false)

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleUserMenu = () => {
        setUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }

        navigate("/user")
    }

    //total
    // useEffect(()=>{
    //     const qty = cartItem.reduce((preve,curr)=>{
    //         return preve + curr.quantity
    //     },0)
    //     setTotalQty(qty)

    //     const tPrice = cartItem.reduce((preve,curr)=>{
    //         return preve + (curr.productId.price * curr.quantity)
    //     },0)
    //     setTotalPrice(tPrice)
    // },[cartItem])


    return (
        <header className=' h-32 lg:h-24 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex items-center px-6 justify-between'>
                        <div>
                            <Link to={"/"} className='flex justify-center items-center'>
                                <img src={logo} alt="Logo" width={90} className='hidden lg:block' />
                                <img src={logo} alt="Logo" width={90} className='lg:hidden' />
                            </Link>
                        </div>
                        <div className='flex items-center gap-0.5 lg:gap-20 font-semibold lg:text-[18px]'>
                            <div>
                                <Link>Home</Link>
                            </div>
                            <div>
                                <Link>Services</Link>
                            </div>
                            <div>
                                <Link to={"aboutus"}>About</Link>
                            </div>
                            <div>
                                <Link to={'contact'}>Contact</Link>
                            </div>
                        </div>
                        {/* <div className='hidden lg:block'>
                            <Search />
                        </div> */}
                        <div>
                            {/**mobile **/}
                            <button className='lg:hidden' onClick={handleMobileUser}>
                                <FaUserCircle size={30} />
                            </button>
                            {/**desktop **/}
                            <div className='hidden lg:flex items-center gap-10'>
                                {
                                    user?._id ? (
                                        <div className='relative'>
                                            <div onClick={() => setUserMenu(preve => !preve)} className='flex items-center gap-2 cursor-pointer select-none'>
                                                <p><MdManageAccounts size={30} /></p>
                                                {
                                                    userMenu ? (
                                                        <GoTriangleUp size={25} />
                                                    ) : (
                                                        <GoTriangleDown size={25} />
                                                    )
                                                }

                                            </div>
                                            {
                                                userMenu && (
                                                    <div className='absolute right-0 top-12'>
                                                        <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                                            <Users close={handleUserMenu} />
                                                        </div>
                                                    </div>
                                                )
                                            }

                                        </div>
                                    ) : (
                                        <button onClick={redirectToLoginPage} className='text-lg px-3 hover:text-[#4A90E2]  '>Login</button>
                                    )
                                }
                                <button onClick={()=>setOpenCart(true)} className='flex items-center gap-2 bg-[#4A90E2] hover:bg-sky-600 py-2 px-3 rounded text-white'>
                                    <div className='animate-bounce'>
                                        <BsCart4 size={28} />
                                    </div>
                                    <div className='font-semibold'>
                                        {
                                            cartItem[0] ? (
                                                <div>
                                                    <p className='text-sm'>{totalQty} Items</p>
                                                    <p className='text-sm'>Rs. {totalPrice}</p>
                                                </div>
                                            ) : (
                                                <p className='py-1'>My Cart</p>
                                            )
                                        }

                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            

            {
                openCart && (
                    <DisplayCart close={()=>setOpenCart(false)}/>
                )
            }

        </header>
    )
}

export default Header
