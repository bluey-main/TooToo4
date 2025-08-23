/* eslint-disable react/prop-types */
import React from 'react'
import logo from "../../assets/logo.png"

function WalletCard({name,balance}) {
  return (
    <React.Fragment>
      <div className=' justify-between flex py-5 px-5 rounded-lg my-5 bg-gradient-to-r text-white from-green-400 to-green-600'>
        <div className='  flex flex-col gap-1'>
            <div className=' flex flex-col gap-2'>
              <img src={logo} className=' w-20' alt="JAMAZAN logo" />
              <p className=' sm:text-xs font-mono font-semibold text-base'>Wallet Balance</p>
            </div>
            <p className=' text-lg font-semibold'>{balance}</p>
            <p className=' sm:text-xs text-sm'>{name}</p>
        </div>
        {/* 3 LINES DESIGN  */}
        <div className=' flex flex-col gap-4 items-center justify-center'>
          <section className=' w-20 h-2 bg-green-500  text-transparent  rounded-e-xl'>
            .
          </section>
          <section className=' w-20 ml-4  h-2 bg-green-500  text-transparent  rounded-e-xl'>
            .
          </section>
          <section className=' w-20 h-2 bg-green-500  text-transparent  rounded-e-xl'>
            .
          </section>
        </div>
      </div>
    </React.Fragment>
  )
}

export default WalletCard
