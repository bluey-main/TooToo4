import { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";


const Vendor = () => {
  const {id}=useParams();
  const [vendor,setVendor] = useState([]);
  const [products,setProducts] = useState([]);
  const [joinedDate,setJoinedDate] = useState("");
  
  const vendorFunction = async function(){
    const { data: vendor, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error) {
      console.error("Error fetching vendor:", error);
      return;
    }
    const testDate = new Date(vendor.created_at).toLocaleDateString(undefined,{day:'numeric',year:"numeric",month:'long'})
    setJoinedDate(testDate)
    setVendor([vendor]);
  }
  
  const allProducts = async function(){
    const { data: products, error } = await supabase.from("products").select("*").eq("sellerId", id);
    if (error) {
      console.error("Error fetching products:", error);
      return;
    }
    setProducts(products)
  }

  useEffect(function(){

    allProducts()
    vendorFunction()
    
  },[])


  const findVendor = async (id) => {
    const { data: vendor, error } = await supabase.from("users").select("isRestricted").eq("id", id).single();
    if (error) {
      console.error("Error fetching vendor:", error);
      return;
    }
  
    if (vendor && vendor.isRestricted) {
      const { error: updateError } = await supabase.from("users").update({ isRestricted: false }).eq("id", id);
      if (updateError) {
        console.error("Error updating vendor restriction:", updateError);
        return;
      }
    } else {
      const { error: updateError } = await supabase.from("users").update({ isRestricted: true }).eq("id", id);
      if (updateError) {
        console.error("Error updating vendor restriction:", updateError);
        return;
      }
    }
  
    setVendor([{...vendor,isRestricted:!vendor.isRestricted}])
  };
  const restrictVendor = ()=>{
    findVendor(id);
  }


  return (
    <section className="p-5 text-mamiblack">
      <h3 className="text-[24px] font-semibold ">Vendor Profile</h3>
      <p className="flex items-center gap-2 py-5 pt-0 max-md:text-sm">
        <Link to={-1}>Vendors</Link> <BsChevronRight />
        <span className="font-semibold capitalize">{vendor.length===0?<p>Vendor</p>:vendor[0]?.businessName}</span>
      </p>
      {vendor.length===0 ?<p>Loading Vendor</p>:
      vendor.map(function(vendor){
        return(
          <section key={vendor.uid} className="grid grid-cols-3 gap-4 grid-flow-row-dense max-xl:grid-cols-2 max-lg:grid-cols-1">
            <div className="bg-white rounded-lg h-fit border">
              <div className="p-5 flex flex-col items-center justify-center">
                <img
                  src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                  className="w-24 h-24 text-large object-cover rounded-full mb-2 border"
                />
                <p className="text-[17px] mt-2">{vendor.firstName} {vendor.lastName}</p>
                <p className="text-sm opacity-60">{vendor.email}</p>
              </div>
              <div className="p-5 text-sm">
                <div className="w-full flex flex-wrap items-center justify-between mb-3">
                  <p className="opacity-60">Store Name:</p>
                  <p>{vendor.businessName ? vendor.businessName : 'No Business Name'}</p>
                </div>
                <div className=" space-y-2 w-full flex flex-wrap items-center justify-between mb-3">
                  <p className="opacity-60">Store Description:</p>
                  <p>
                    {vendor.storeDescription}
                  </p>
                </div>
                <div className="w-full flex flex-wrap items-center justify-between mb-3">
                  <p className="opacity-60">Phone Number:</p>
                  <p>{vendor.phoneNumber}</p>
                </div>

                <div className="w-full flex flex-wrap items-center justify-between mb-3">
                  <p className="opacity-60">Joined on:</p>
                  <p>{joinedDate}</p>
                </div>
                <div className="w-full flex flex-wrap items-center justify-between mb-3">
                  <p className="opacity-60">Restricted:</p>
                  <p>{vendor.isRestricted?"Restricted":"Not Restricted"}</p>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={restrictVendor}
                    type="button"
                    className={`flex w-full items-center justify-center rounded-md border border-transparent ${vendor.isRestricted?"text-[#F32013] bg-[#ffff] border-[1px] border-[#F32013] hover:bg-[#ffff] focus:outline-none focus:ring-2 focus:ring-[#ffff] focus:ring-offset-2":"text-white bg-[#F32013] hover:bg-[#F32013] focus:outline-none focus:ring-2 focus:ring-[#F32013] focus:ring-offset-2"} px-2.5 py-2 text-sm font-medium  shadow-sm  sm:w-full sm:flex-grow-0`}
                  >
                    {vendor.isRestricted?"Cancel Restriction":"Restrict Vendor"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )
      })}
      <div>
        <h3 className="text-[24px] font-semibold mt-10 mb-5">All Products</h3>
        <div className=" sm:hidden flex flex-col gap-5">
            {products.map((eachProduct) => {
              return (
                <div key={eachProduct.id} className=" rounded-md py-2 border-2 px-3 flex flex-col gap-5">
                  <section className=" flex items-center justify-between">
                    <h1 className=" text-sm text-black font-semibold font-sans">
                      #{eachProduct.id}
                    </h1>
                  </section>

                  <div className=" text-[12px] border-t-[1px] flex flex-col gap-4 py-5">
                    <section className="flex justify-between text-sm text-gray-700">
                      <p className=" text-gray-500 font-light text-[12px]">
                        Product
                      </p>
                      <p className=" text-[12px]">
                        {eachProduct.name}
                      </p>
                    </section>

                    <section className="flex justify-between text-sm text-gray-700">
                      <p className=" text-gray-500 font-light text-[12px]">
                        Category
                      </p>
                      <p className=" text-[12px]">
                        {eachProduct.category}
                      </p>
                    </section>

                    <section className="flex justify-between text-sm text-gray-700">
                      <p className=" text-gray-500 font-light text-[12px]">
                        Price(₦)
                      </p>
                      <p className=" text-xs">{Number(eachProduct.price).toLocaleString()}</p>
                    </section>

                    <section className="flex justify-between text-sm text-gray-700">
                      <p className=" text-gray-500 font-light text-[12px]">
                        Stock
                      </p>
                      <p className=" text-[12px]">{eachProduct.quantity}</p>
                    </section>

                    <section className="flex justify-between text-sm text-gray-700">
                      <p className=" text-gray-500 font-light text-[12px]">
                        Discount Price
                      </p>
                      <p className=" text-xs">{Number(eachProduct.discountedPrice).toLocaleString()}</p>
                    </section>
                    
                  </div>
                </div>

              );
            })}
          </div>
          <div className="w-full max-sm:hidden">
            {
              products.length===0?<p>No Products in User Catalog</p>:
              <div className="relative overflow-x-auto border sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 md:table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <th scope="col" className="px-6 py-3">Product</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3">Discount Price</th>
                </thead>
                <tbody className=" px-2 py-4">{
                products.map(function(eachProduct){
                  return(
                    <tr className="rounded-md bg-white border-b cursor-pointer hover:bg-gray-50 " key={eachProduct.id}>
                      <td className="px-6 py-4">{eachProduct.name}</td>
                      <td className="px-6 py-4">{eachProduct.category}</td>
                      <td className="px-6 py-4">{Number(eachProduct.price).toLocaleString()}</td>
                      <td className="px-6 py-4">{eachProduct.quantity}</td>
                      <td className="px-6 py-4">{Number(eachProduct.discountedPrice).toLocaleString()}</td>
                    </tr>
                  )
                })
              }
            </tbody>
              </table>
            </div>
            }
          </div>
      </div>
    </section>
  );
};

export default Vendor;