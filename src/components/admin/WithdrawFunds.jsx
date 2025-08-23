import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import bankPng from "../../assets/bank.png"

function WithdrawFunds() {
  const navigate = useNavigate()
  const [balance,setBalance] = useState(0);

  const fetchBalance = async()=>{
    const balance = await axios.get("http://localhost:7000/balance");
    setBalance(balance.data.available[0].amount)
  }

  useEffect(()=>{
    fetchBalance()
  },[])
  return (
    <React.Fragment>
        <div>
            <button onClick={()=> navigate("/admin/wallet")}><span className=' px-4 text-xl md:text-3xl'>←</span></button>
            <header className=' bg-white py-3 px-5 rounded-md'>
              <p className=' font-semibold text-lg'>Withdrawal</p>
            </header>
            <main className="  px-3">
              <div className="w-full p-8 my-4 h-[120px] flex flex-col justify-between bg-[url('https://bafybeidr5h2c5a7ylvl3xep63hkqkijtklxj2na6s2ut47zxmnfmntcine.ipfs.nftstorage.link/Group.png')] rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-primary font-semibold">
                    Available Balance:
                  </h3>{" "}
                  <h3 className="text-[23px] text-primary font-semibold">
                    ${balance.toLocaleString()}
                  </h3>
                </div>
              </div>
              <section className=' bg-white px-5 md:px-16 mb-5 pb-5 rounded-md '>
                <div className=' flex items-center gap-5 justify-center pt-5 pb-10'>
                  <img src={bankPng} className=" w-8" alt="Bank IMG" />
                  <p className=' text-xl font-semibold'>Bank Information</p>
                </div>
                <form action="" className=' flex flex-col gap-4'>
                  <label htmlFor="" className=' gap-2 flex flex-col'>
                    <span className=' font-semibold'>Amount</span>
                    <input type={"number"} className=' py-2 px-1 ring-1 ring-green-800 outline-none rounded-md' placeholder='Withdrawal Amount' />
                    <span className=' text-[12px] font-medium '>Minimum of <strong>$10</strong></span>
                  </label>
                  <label htmlFor="" className=' flex flex-col'>
                    <section className=' flex items-center gap-2'>
                      <input type={"radio"} checked value=""  />
                      <span>Bank Transfer</span>
                    </section>
                  </label>
                  <label htmlFor="" className=' gap-2 flex flex-col'>
                    <span className=' font-semibold'>Account number</span>
                    <input type={"text"} className=' py-2 px-1 ring-1 ring-green-800 outline-none rounded-md' placeholder='Enter Account Number'  />
                  </label>
                  <label htmlFor="" className=' gap-2 flex flex-col'>
                    <span className=' font-semibold'>Bank Name</span>
                    <input type={"text"} className=' py-2 px-1 ring-1 ring-green-800 outline-none rounded-md' placeholder='Enter  Bank Name'  />
                  </label>
                  <button                className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#305c45] px-2.5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#305c45ce] focus:outline-none focus:ring-2 focus:ring-[#305c45b5] focus:ring-offset-2 sm:w-full sm:flex-grow-0 mt-5">Withdraw</button>
                  <p className=' font-semibold text-[12px]'><span className=' ring-1 px-1 ring-black rounded-full '>?</span> &nbsp;Funds will be available in your bank account within 3-5 business days</p>
                </form>
              </section>
            </main>
        </div>
    </React.Fragment>
  )
}

export default WithdrawFunds