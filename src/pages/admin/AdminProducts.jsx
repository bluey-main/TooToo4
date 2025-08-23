import React, { useState } from "react";
import Products from "../../components/admin/Products"
const AdminProducts = () => {
  const productOptions = [{text:'Live Products',url:'/live_products'}]
  const [navigateProducts, setNavigateProducts] = useState(0)
  return(
    <React.Fragment>
      <div className=" flex flex-col gap-5 p-5 h-[89vh] max-h-[89vh] overflow-auto">
        <div className="  justify-between  px-5 py-5 flex flex-col md:flex-row gap-5 ">
          <section className="  flex gap-5 items-center">
            <p className=" font-semibold">Products</p>
            <div className=" bg-gray-200 py-1 px-2 rounded-md w-fit flex gap-3">
              {
                productOptions.map((text,index)=>{
                  return(
                    <button className={`text-xs sm:text-sm ${navigateProducts===index?' px-2 py-1 rounded-md text-black bg-white':' text-gray-600'}`} onClick={()=>{
                      setNavigateProducts(index);
                    }} key={index}>{text.text}</button>
                  )
                })
              }
            </div>
          </section>
        </div>

        <section className="px-5 py-3 bg-white gap-5 flex flex-col ">
          <Products/>
        </section>
      </div>
    </React.Fragment>
  )

};

export default AdminProducts;
