import React from 'react'
import AdminInfo from '../../components/admin/AdminInfo'

import AdminInfo from '../../components/admin/AdminInfo'

function SellerInfo() {
  return (
    <>
        <div className='grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 px-1 gap-5  '>
        {/* These values are not defined in this component, they should be passed as props or fetched from a context/hook */}
        <AdminInfo heading={"Total Sales Made"} money={true} amount={0} isYesterday={false}/>
        <AdminInfo amount={0} isYesterday={false} heading={"Total Orders Made"} />
        <AdminInfo  amount={0} isYesterday={true} heading={"Total Orders"} />
           
        </div>
      <br />
    </>
  )
}

export default SellerInfo

export default SellerInfo
