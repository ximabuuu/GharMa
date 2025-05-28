import React from 'react'
import { useSelector } from 'react-redux'
import Worker from '../utils/Worker'

const WorkerPerm = ({children}) => {

    const user = useSelector(state => state.user)



  return (
    <>
        {
            Worker(user.role) ? children : <p className='text-red-800 bg-red-100 p-4'>You are not worker.</p>
        }
    </>
  )
}

export default WorkerPerm
