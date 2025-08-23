import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { AccountHeader } from "@/components/account/AccountHeader";


export default function LikedItems() {
  const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
  // const likedItems = loggedInUser?.likedItems || [];
  const navigate = useNavigate();
  const [likedProducts,setLikedProducts] = useState([]);

  useEffect(()=>{
    const fetchLikedProducts = async()=>{
      if (!loggedInUser?.uid) return;

      try{
        const { data: likedProducts, error } = await supabase
          .from("users")
          .select("likedItems")
          .eq("id", loggedInUser.uid)
          .single();

        if (error) {
          throw error;
        }
        console.log(likedProducts?.likedItems );
        setLikedProducts(likedProducts.likedItems || []);
      }catch(error){
        console.error(error);
      }
    }

    fetchLikedProducts();
  },[]);

  const removeLikedItemFn = async(id)=>{
    const filteredData =  likedProducts.filter((eachProduct)=>eachProduct.id !== id);
    const { error } = await supabase
      .from("users")
      .update({ likedItems: filteredData })
      .eq("id", loggedInUser.uid);

    if (error) {
      console.error("Error removing liked item:", error);
      return;
    }
    setLikedProducts(filteredData);
    console.log(filteredData);
  }

  console.log(likedProducts);
  return (
    <div className="bg-white w-full">
      <div className="  px-4 py-5 sm:px-6 ">
        <AccountHeader
          heading="Liked Items"
          text="Here is a list of your liked items"
        />

        <div className="mt-12 space-y-16 sm:mt-16">
          <div className="-mb-6 mt-6 flow-root divide-y divide-gray-200 border-t border-gray-200">
            {likedProducts.map((product) => (
              <div key={product.id} className="py-6 sm:flex">
                <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                  <img
                    src={product.imageUrls[0].url}
                    alt={product.name}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center sm:h-48 sm:w-48"
                  />
                  <div className="min-w-0 flex-1 pt-1.5 sm:pt-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      <p>{product.name}</p>
                    </h3>
                    <section className="truncate text-sm text-gray-500">
                      {
                        product.variations ? product.variations.map((eachVariation) => {
                          return (
                            <section key={eachVariation.type}>
                              <span>{eachVariation.type === "Color"? <span>Color: {eachVariation.variation}</span>:""}</span>{" "}
                              <span className="mx-1 text-gray-400" aria-hidden="true">                
                              </span>
                              <span>{eachVariation.type === "Dimension"?<span>Dimensions: {eachVariation.variation}</span>:""}</span>
                            </section>
                          )
                        }) :
                        <p>No Variation Given</p>
                      }
                    </section>
                    <p className="mt-1 font-medium text-gray-900">
                      {product.price}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4 sm:ml-6 sm:mt-0 sm:w-40 sm:flex-none">
                  <button onClick={()=>{
                    navigate(`/product/${product.id}`);
                  }}
                    type="button"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#305c45] px-2.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#305c45ce] focus:outline-none focus:ring-2 focus:ring-[#305c45b5] focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                  >
                    Buy
                  </button>
                  <button onClick={()=>{
                    removeLikedItemFn(product.id)
                  }}
                    type="button"
                    className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#305c45] focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}