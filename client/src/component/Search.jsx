import React, { useEffect, useState } from 'react'
import { IoSearchCircleSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowCircleLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const params = useLocation()
    const queryParams = new URLSearchParams(params.search);
    const searchText = queryParams.get('q') || '' 
    
    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])

    

    const redirectToSearch = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='w-full min-w-[300px] lg:min-w-[420px] h-10 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-gray-200 group focus-within:border-black'>
      <div>

        {
            (isMobile && isSearchPage) ? (
                <Link to={"/"} className='flex justify-center items-center h-full p-3 group-focus-within:text-red-600 border-red-800'>
                    <FaArrowCircleLeft size={28} />
                </Link>
            ) : (
                <button className='flex justify-center items-center h-full p-3 group-focus-within:text-red-800 border-red-800'>
                    <IoSearchCircleSharp size={30} />
                </button>
            )
        }

      </div>

      <div className='w-full h-full'>
        {
            !isSearchPage ? (
                <div onClick={redirectToSearch} className='w-full h-full flex items-center'>
                    <TypeAnimation
                        sequence={[
                            // Same substring at the start will only be typed out once, initially
                            'Search "Mo:Mo"',
                            1000, // wait 1s 
                            'Search "Sekuwa"',
                            1000,
                            'Search "Chowmein"',
                            1000,
                            'Search "Thukpa"',
                            1000,
                            'Search "Drinks"',
                            1000,
                            'Search "Desserts"',
                            1000
                        ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                    />
                </div>
            ) : (
                <div className='w-full h-full'>
                    <input type="text" defaultValue={searchText} placeholder='Search for khaja' autoFocus className='bg-transparent w-full h-full outline-none'
                        onChange={handleOnChange}
                    />
                </div>
            )
        }
      </div>
    </div>
  )
}

export default Search
