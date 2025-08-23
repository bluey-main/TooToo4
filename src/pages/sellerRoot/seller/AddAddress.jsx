/* eslint-disable react/prop-types */
import React from 'react'
import { useLocation } from 'react-router'

function AddAddress({cancel_address_trigger}) {
    const location = useLocation()
    const address_trigger = location.pathname.split("/")
  return (
    <React.Fragment>
        {address_trigger[address_trigger.length-1]==="profile"&&<div className=' bg-gray-50 px-3 py-5 rounded-md my-1'>
            <form className=' space-y-2'>
                <label htmlFor="" className=' space-y-2'>
                    <p className=' text-sm font-light'>Street address </p>
                    <input className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter street address' />
                </label>
                <section className=' grid md:grid-cols-2 grid-cols-1  space-y-3 pb-5 justify-between md:items-center'>
                    <label htmlFor="" className=' space-y-2 '>
                        <p className=' text-sm font-light'>City </p>
                        <input className='sm:w-64 md:w-52 lg:w-72 w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white ' type="text" placeholder='Enter city'/>
                    </label>
                    <label htmlFor="" className=' space-y-2'>
                        <p className=' text-sm font-light'>State</p>
                        <select name="" id="" className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white '>
                            <option value="">Select State</option>
                        </select>
                    </label>
                </section>
                <section className=' py-5 flex justify-between'>
                    <button className=' rounded-md border-[1px] border-green-800 text-green-800 px-3 py-1' onClick={cancel_address_trigger}>Cancel</button>
                    <button className=' rounded-md bg-green-800 text-white px-3 py-1'>Save Address</button>
                </section>
            </form>
        </div>}
    </React.Fragment>
  )
}

export default AddAddress