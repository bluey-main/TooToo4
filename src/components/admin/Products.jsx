import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try{
        const { data, error } = await supabase.from("products").select("*");
        if (error) {
          console.log(error);
        } else {
          setProducts(data);
        }
      }catch(error){
        console.log("An unexpected error");
      }finally{
        setLoading(false)
      }
    };
    fetchProducts();
  }, []);

  return (
      products.length===0 && !loading ?(<div className="w-full flex flex-col items-center justify-center py-5">
        <p>No Data Currently!!</p>
      </div>):(
        loading?<div className="w-full flex flex-col items-center justify-center py-5">
        <ClipLoader />
      </div>:<div className="relative overflow-x-auto border sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Price ( $ )
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, key) => {
            return (
              <tr
                onClick={() => navigate(`/admin/products/${product.id}`)}
                className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                key={key}
              >
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">{product.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
      )
    
  );
};

export default Products;