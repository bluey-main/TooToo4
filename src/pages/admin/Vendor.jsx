import { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const Vendor = () => {
  const {id}=useParams();
  const [vendor,setVendor] = useState([]);
  const [products,setProducts] = useState([]);
  const [joinedDate,setJoinedDate] = useState("");
  const [totalSales, setTotalSales] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  const vendorFunction = async function(){
    const { data: vendor, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (error) {
      console.error("Error fetching vendor:", error);
      return;
    }
    const testDate = new Date(vendor.created_at).toLocaleDateString(undefined,{day:'numeric',year:"numeric",month:'long'})
    setJoinedDate(testDate)
    setVendor([vendor]);
  }
  
  const allProducts = async function(){
    if (!id) return;
    
  (true)
    try{
      const { data: products, error } = await supabase.from("products").select("*").eq("seller_id", id);
      const {data:categories,error:catError} = await supabase.from("categories").select("*");
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      if(catError){
        console.log("Error fetching categories ",catError);
        return
      }
      const newProducts = products.map((product)=>{
        const category = categories.find((cat)=> cat.id === product.category_id);
        return {...product, category: category ? category.name : "Unknown"};
      });
      const sales = newProducts.reduce((acc, product) => acc + product.price * (product.sold_quantity || 0), 0)
      const orders = newProducts.reduce((acc, product) => acc + (product.sold_quantity || 0), 0)

      console.log(newProducts)
      setTotalSales(sales)
      setTotalOrders(orders)
      setProducts(newProducts);
    }catch(error){
      console.log("An unexpected error");
    }finally{
    (false)
    }
  }
  
  useEffect(function(){
    allProducts()
    vendorFunction()
  },[])

  const findVendor = async (id) => {
    try {
      console.log("Starting update for ID:", id);
      
      // Check current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting current user:", userError);
      } else {
        console.log("Current user ID:", user?.id);
        console.log("Target vendor ID:", id);
        console.log("Are they the same?", user?.id === id);
      }
      
      // First, fetch the current vendor data
      const { data: vendor, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching vendor:", fetchError);
        return;
      }
      
      console.log("Current vendor data:", vendor);
      console.log("Current is_restricted value:", vendor.is_restricted);
      
      // Toggle the is_restricted value
      const newRestrictedValue = !vendor.is_restricted;
      console.log("New is_restricted value will be:", newRestrictedValue);
      
      // Update the database - let's check how many rows were affected
      const { error: updateError, count } = await supabase
        .from("profiles")
        .update({ is_restricted: newRestrictedValue })
        .eq("id", id)
        .select('*', { count: 'exact' });
        
      if (updateError) {
        console.error("Error updating vendor restriction:", updateError);
        console.error("Update error details:", JSON.stringify(updateError, null, 2));
        return;
      }

      console.log("Database update successful!");
      console.log("Number of rows affected by update:", count);

      // Update local state if needed
      setVendor([{...vendor, is_restricted: newRestrictedValue}])
      
    } catch (error) {
      console.error("Unexpected error in findVendor:", error);
    }
  };

  const restrictVendor = () => {
    if (id) {
        findVendor(id)
      }
  }

  if (!id) {
      return (
        <section className="p-5 text-mamiblack">
          <p className="text-xl">Please provide a vendor ID</p>
        </section>
      )
    }

  return (
    <section className="p-6 text-mamiblack bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Vendor Profile</h3>
      <p className="flex items-center gap-2 py-3 text-sm text-gray-600">
        <Link to={-1} className="hover:text-gray-900">Vendors</Link> 
        <BsChevronRight />
        <span className="font-semibold capitalize text-gray-900">
          {vendor.length===0?"Vendor":vendor[0]?.business_name || 'Vendor'}
        </span>
      </p>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Left Column - Vendor Profile */}
        <div className="lg:col-span-2">
          {vendor.length===0 ? (
            <div className="bg-white rounded-lg border shadow-sm p-6 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          ) : (
            vendor.map(function(vendor){
              return(
                <div key={vendor.id} className="bg-white rounded-lg border shadow-sm">
                  <div className="p-6 flex flex-col items-center justify-center border-b border-gray-200">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600 overflow-hidden mb-4">
                      {vendor.profile_picture_url ? (
                        <img src={vendor.profile_picture_url} alt="Avatar" className="w-full h-full object-cover"/>
                      ) : vendor.first_name ? (
                        `${vendor?.first_name[0].toUpperCase()}${vendor?.last_name?.[0]?.toUpperCase() || ''}`
                      ) : (
                        'V'
                      )}
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">{vendor.first_name} {vendor.last_name}</p>
                    <p className="text-sm text-gray-600 mb-4">{vendor.email}</p>
                    
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.is_restricted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {vendor.is_restricted?"Restricted":"Active"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <p className="text-sm text-gray-600">Store Name:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {vendor.business_name ? vendor.business_name : 'No Business Name'}
                      </p>
                    </div>
                    
                    <div className="flex items-start justify-between py-2">
                      <p className="text-sm text-gray-600">Store Description:</p>
                      <p className="text-sm text-gray-900 text-right max-w-32">
                        {!vendor.store_description || vendor.store_description.trim() === ""?
                          "No Description"
                          :vendor.store_description
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <p className="text-sm text-gray-600">Phone Number:</p>
                      <p className="text-sm font-medium text-gray-900">{vendor.phone_number}</p>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <p className="text-sm text-gray-600">Joined on:</p>
                      <p className="text-sm font-medium text-gray-900">{joinedDate}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <button onClick={restrictVendor}
                        type="button"
                        className={`w-full flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                          vendor.is_restricted
                            ? "text-red-600 bg-white border border-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            : "text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        } shadow-sm`}
                      >
                        {vendor.is_restricted?"Remove Restriction":"Restrict Vendor"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Right Column - Stats and Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards - This is what was missing */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-1 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="text-3xl font-bold text-gray-900">${totalSales.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total sales</div>
            </div>
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
              <div className="text-sm text-gray-600 mt-1">Total orders</div>
            </div>
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="text-3xl font-bold text-gray-900">{products.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total products</div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Product catalog</h3>
            </div>
            
            {/* Mobile View */}
            <div className="sm:hidden">
              {products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No products in catalog
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {products.map((eachProduct) => {
                    return (
                      <div key={eachProduct.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Product</span>
                            <span className="text-sm font-medium text-gray-900">{eachProduct.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Category</span>
                            <span className="text-sm text-gray-900">{eachProduct.category}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Price(₦)</span>
                            <span className="text-sm font-medium text-gray-900">{Number(eachProduct.price).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Stock</span>
                            <span className="text-sm text-gray-900">{eachProduct.quantity}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Discount Price</span>
                            <span className="text-sm text-gray-900">{Number(eachProduct.discounted_price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block">
              {products.length===0 ? (
                <div className="p-8 text-center text-gray-500">
                  No products in catalog
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₦)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map(function(eachProduct){
                        return(
                          <tr className="bg-white hover:bg-gray-50 transition-colors" key={eachProduct.id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{eachProduct.name}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                {eachProduct.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{Number(eachProduct.price).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                eachProduct.quantity > 10 
                                  ? 'bg-green-100 text-green-800' 
                                  : eachProduct.quantity > 0 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {eachProduct.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{eachProduct.sold_quantity || 0}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">26 Jun 2023</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vendor;