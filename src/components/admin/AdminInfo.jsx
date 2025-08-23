/* eslint-disable react/prop-types */
import React from 'react'

function AdminInfo({heading,amount,isYesterday,money}) {
  return (
    <React.Fragment>
        <div className="p-6 flex-col  bg-white w-full rounded-2xl border">
            <p className="text-neutral-400 text-lg font-normal mb-5">{heading}</p>

            <h1 className="text-neutral-700 text-[28px] font-medium mb-3">
            {money && "$"}{Number(amount).toLocaleString()}
            </h1>
            <p className="text-neutral-700 text-sm font-normal leading-tight inline-flex gap-2 items-center">
               {/* {money && "Start of The Company"} */}
               {isYesterday && "Yesterday"}
            </p>
      </div>
    </React.Fragment>
  )
}

export default AdminInfo