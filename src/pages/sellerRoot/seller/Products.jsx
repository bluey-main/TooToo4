import { useCallback, useContext, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
// import product from "../../../assets/shirt1.jpeg";
import { CiEdit } from "react-icons/ci";
import { GoTrash } from "react-icons/go";
import Pagination from "../../../components/pagination/Pagination";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
// import { useUser } from "../../../context/UserContext";
import { ClipLoader } from "react-spinners";
import { numberWithCommas } from "../../../utils/helper";
import { SellerContext, useSeller } from "../../../context/SellerContext";

import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/seller/Modal";

const Products = () => {
  const navigate = useNavigate();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);
  const { userDetails } = useAuth();

  const {
    setDeleteProductModal,
    deleteProductFromDatabase,
    setDoubleConfirmationModal,
    doubleConfirmationModal,
    deleteProductModal,
    setProductToDeleteDetails,
    productToDeleteDetails,
  } = useSeller();

  const getProductsFromSnapshot = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", userDetails.id);

      if (error) {
        throw error;
      }
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.error("Error processing snapshot:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, [userDetails]);

  useEffect(() => {
    if (!userDetails?.id) return;

    getProductsFromSnapshot();
  }, [userDetails?.uid, getProductsFromSnapshot]);

  return (
    <div className=" px-2">
      <Modal
        actionButtonText="Delete"
        setOpen={setDeleteProductModal}
        open={deleteProductModal}
        modalTitle={`Delete ${productToDeleteDetails.productName}  Product`}
        confirmation={false}
        actionFunction={() => {
          setDeleteProductModal(false);
          setDoubleConfirmationModal(true);
        }}
        modalDescription=" Are you sure you want to delete This Product? All of
                          the prouct data will be permanently removed. This
                          action cannot be undone."
      />
      <Modal
        actionButtonText="Delete"
        setOpen={setDoubleConfirmationModal}
        open={doubleConfirmationModal}
        modalTitle={`Delete ${productToDeleteDetails.productName}  Product`}
        confirmation={false}
       actionFunction={() => deleteProductFromDatabase(getProductsFromSnapshot)}
        modalDescription=" ARE YOU REALLY SURE."
      />

      <header className=" space-y-3">
        <section className=" font-sans rounded-md py-1  items-center border-[1px] flex gap-5 px-2 border-gray-400">
          <input
            type="text"
            placeholder="Search for product's name"
            className=" w-full outline-none placeholder:text-sm px-2 bg-transparent"
            name=""
            id=""
          />
          <IoIosSearch className=" text-xl" />
        </section>
        <section className=" flex justify-between px-3 py-2">
          <select className=" text-gray-500 font-light   outline-none border-2 py-1 px-2 rounded-lg">
            <option value="">Category</option>
            <option value="">A-Z</option>
          </select>
          <button
            className=" bg-green-800 px-4 font-light py-1 rounded-md text-white"
            onClick={function () {
              navigate(`new-product`);
            }}
          >
            Add new
          </button>
        </section>
      </header>

      <main className=" bg-white px-2 my-3 py-5 rounded-md">
        {loadingProducts ? (
          <div className="flex gap-4 items-center justify-center py-4">
            <ClipLoader color="#086047" size={30} />
            <p>Loading Products</p>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid p-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-x-2 gap-y-5">
            {products.map((eachProduct, index) => {
              return (
                <div
                  key={index + "123"}
                  className="border-[1px] border-gray-300 rounded-md"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-md bg-black/10 lg:aspect-none group-hover:opacity-75 max-h-60 h-full">
                    <img
                      src={
                        eachProduct?.image_urls?.length > 0
                          ? eachProduct.image_urls[0].url
                          : "https://placehold.co/600x400"
                      }
                      alt=""
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>

                  <div className="p-3 py-3 w-full">
                    <section className=" flex justify-between mb-3">
                      <p className=" text-[10px] text-sm line-clamp-2">
                        {eachProduct.name}
                      </p>
                      {/* <p className=" text-[10px]">Sold:7</p> */}
                    </section>
                    <section className="pb-2 flex justify-between items-center">
                      <p className=" text-sm font-semibold">
                        ₦{numberWithCommas(eachProduct.price)}
                      </p>
                      <p className=" text-[10px]">
                        {eachProduct.quantity} units left - 0 Sold
                      </p>
                    </section>
                    <div className=" flex sm:grid sm:grid-cols-2 flex-col gap-2">
                      <button
                        onClick={() =>
                          navigate(`new-product?param=${eachProduct.id}`)
                        }
                        className=" border-[1px] flex items-center justify-center gap-2 font-sans text-sm rounded-md py-1 px-1 text-gray-600 border-gray-500"
                      >
                        <CiEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setProductToDeleteDetails({
                            productId: eachProduct.id,
                            fileArray: eachProduct.image_urls,
                            productName: eachProduct.name,
                          });
                          setDeleteProductModal(true);

                          console.log({
                            productId: eachProduct.id,
                            fileArray: eachProduct.image_urls,
                            productName: eachProduct.name,
                          });
                        }}
                        className=" text-yellow-500 border-[1px] flex items-center justify-center gap-2 font-sans text-sm rounded-md py-1 px-1 border-yellow-500"
                      >
                        <GoTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-xl text-green-800">No Products.</p>
          </div>
        )}
      </main>
      <section className=" py-5">
        <select
          name=""
          className=" sm:hidden outline-none border-2 font-semibold text-slate-700 py-1 px-1 rounded-lg"
          id=""
        >
          <option value="">5 per page</option>
          <option value="">10 per page</option>
          <option value="">15 per page</option>
          <option value="">20 per page</option>
        </select>
        <section className=" max-sm:hidden">
          <Pagination />
        </section>
      </section>
    </div>
  );
};

export default Products;
