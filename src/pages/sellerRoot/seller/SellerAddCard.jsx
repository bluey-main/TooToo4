import React from 'react'
import mastercard from "../../../assets/mastercardicon.png"
import { useNavigate } from 'react-router'

function SellerAddCard() {
    const navigate = useNavigate(-1)
  return (
    <React.Fragment>
        <button className=' text-lg font-bold' onClick={()=>{
            navigate(-1)
          }}>←</button>
        <form className=' space-y-6 divide-y-[1px] bg-white py-2 px-3 rounded-md mx-3 '>
            <section>
                <p className=' font-semibold py-2'>Add new card</p>
                <form action="" className=' py-2 flex flex-col gap-3 lg:grid lg:grid-cols-2 md:gap-3'>
                    <label htmlFor="" className=' space-y-2'>
                        <p className=' text-sm font-light'>Card number</p>
                        <div className=' px-2 py-1 border-[1px] border-gray-300 rounded-md flex justify-between'>
                            <input type="text" className=' w-64 outline-none bg-white p-1' placeholder='1234 5678 3245 2345' />
                            <img src={mastercard} alt="Mastercard" className=' w-8'/>
                        </div>
                    </label>
                    <label htmlFor="" className=' space-y-2'>
                        <p  className=' text-sm font-light'>Name on card </p>
                        <input className=' w-full px-2 py-2 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Micheal Jacobs' />
                    </label>
                    <section className=' md:col-span-3 sm:grid sm:grid-cols-2 md:gap-4 flex flex-col w-full gap-3'>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>Expiry date</p>
                            <input className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='mm/yy'/>
                        </label>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>CVV</p>
                            <input className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='123'/>
                        </label>
                    </section>
                </form>
                <aside className=' py-1 flex items-center gap-3 my-2'>
                    <input type="checkbox" name="" className=' w-5 h-4 outline-none accent-green-700' id="" />
                    <p className=' text-sm font-light'>Set as default for making payments</p>
                </aside>
            </section>
            <section>
                <p className=' font-semibold py-2'>Billing address</p>
                <div className='  py-1 flex flex-col gap-5'>
                    <section className=' sm:grid sm:grid-cols-2 flex-col flex justify-between gap-3'>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>First name</p>
                            <input className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter first name'/>
                        </label>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>Last name</p>
                            <input className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter last name'/>
                        </label>
                    </section>
                    <label htmlFor="" className=' space-y-2'>
                        <p className=' text-sm font-light'>ZIP Code (Optional) </p>
                        <input className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter ZIP Code' />
                    </label>
                    <label htmlFor="" className=' space-y-2'>
                        <p className=' text-sm font-light'>Street address </p>
                        <input className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter street address' />
                    </label>
                    <section className=' md:grid md:grid-cols-2 flex pb-5 justify-between md:items-center'>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>City </p>
                            <input className='sm:w-64 md:w-52 lg:w-72 w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter city'/>
                        </label>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>State</p>
                            <select name="" id="" className=' sm:w-full w-44 px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1'>
                                <option value="">Select State</option>
                            </select>
                        </label>
                    </section>
                    <label htmlFor="" className=' space-y-2'>
                        <p className=' text-sm font-light'>LGA </p>
                        <select name="" id="" className=' w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1'>
                                <option value="">Select LGA</option>
                            </select>
                    </label>
                </div>
            </section>
            <section className=' py-5 flex justify-between'>
                <button onClick={()=>{
            navigate("/seller/wallet")
          }} className=' rounded-md border-[1px] border-green-800 text-green-800 px-3 py-1'>Cancel</button>
                <button className=' rounded-md bg-green-800 text-white px-3 py-1'>Save Card</button>
            </section>
        </form>
    </React.Fragment>
  )
}

export default SellerAddCard