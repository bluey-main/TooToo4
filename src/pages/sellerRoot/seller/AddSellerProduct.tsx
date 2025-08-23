/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import {Prompt} from "react-router-dom"
import { CiImageOn } from "react-icons/ci";
import { BsChevronLeft } from "react-icons/bs";
// import { useUser } from "../../../context/UserContext";
import { ClipLoader } from "react-spinners";
import useBeforeUnload from "../../../utils/useBeforeUnload";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/seller/Modal";
import { ProductDetails, SellerContext, useSeller } from "@/context/SellerContext";

function AddSellerProduct() {
  useBeforeUnload("You have unsaved changes. Are you sure you want to leave?");
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const paramValue = params.get("param");
  const [openBackModal, setOpenBackModal] = useState(false);
  // const [isBlocking, setIsBlocking] = useState(false);

    const resetFields: ProductDetails = {
    name: "",
    imageStorageFileName: "",
    description: "",
    otherInformation: "",
    price: 0,
    discountRate: 0,
    discountedPrice: 0,
    quantity: 0,
    category: "",
    productSku: "",
    productWeight: "",
    productHeight: "",
    productWidth: "",
    productLength: "",
    image_urls: [],
    variations: [],
    tags: [],
  };


  useEffect(() => {
    let isMounted = true;

    console.log("ADD SELLER PRODUCT " + isMounted);

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
      setProductDetails(resetFields);
      setParam(null);
      setSelectedFiles([]);
      setTags([]);
      setVariations([]);
      setImagesToDeleteFromStorageAfterEditing([]);
      console.log("ADD SELLER PRODUCT " + isMounted);
    };
  }, []);

  const {
    isLoading,
    categories,
    setSelectedFiles,
    selectedFiles,
    productDetails,
    dragOver,
    param,
    setParam,
    setProductDetails,
    getProductDetailsFromDatabase,
    variations,
    tagInputValue,
    tags,
    setTags,
    setTagsToDeleteFromDbAfterEditing,
    setVariations,
    setImagesToDeleteFromStorageAfterEditing,
    setVariationsToDeleteFromDbAfterEditing,
    navigateToProductsPage,
    setNavigateToProductsPage,
    handleFileSelect,
    enterTagEvent,
    handleTagChange,
    handleDragOver,
    handleDragLeave,
    handleVariationInputChange,
    handleAddVariation,
    handleProductDetailsInputChange,
    addProductToDatabase,
    deleteParticularObjectFromStorage,
    handleDeleteItemsFromArray,
    handleDrop,
  } = useSeller();

  React.useEffect(() => {
    getProductDetailsFromDatabase(paramValue);
  }, [userDetails]);

  React.useEffect(() => {
    if (navigateToProductsPage) {
      navigate("/seller/products");
      setNavigateToProductsPage(false);
    }
  }, [navigateToProductsPage]);

  return (
    <>
      <Modal
        actionButtonText="Go Back"
        setOpen={setOpenBackModal}
        open={openBackModal}
        modalTitle={`Exit Page`}
        confirmation={false}
        actionFunction={() => {
          navigate(-1);
        }}
        modalDescription="Are You Sure You Want To Exit This Page"
      />
      {isLoading ? (
        <div className="w-full h-screen flex gap-4 justify-center items-center">
          <ClipLoader color="#086047" />
          <p>Loading Products</p>
        </div>
      ) : (
        productDetails && (
          <div>
            <button
              className=" bg-[#305C45]/[5%] border text-lg font-bold px-3 py-2 mb-3 rounded-lg flex items-center gap-4"
              onClick={() => {
                setOpenBackModal(true);
              }}
            >
              <BsChevronLeft /> Back
            </button>

            <main className=" space-y-5">
              {/* PRODUCT DETAILS */}
              <section className=" bg-white p-5 space-y-6 rounded-lg">
                <p className="min-[450px]:text-lg text-base font-bold">
                  Product Info
                </p>
                <label htmlFor="" className=" flex flex-col gap-2">
                  <p className=" text-sm font-medium text-gray-700">
                    Product Name
                  </p>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className=" outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                    name="name"
                    value={productDetails.name}
                    onChange={handleProductDetailsInputChange}
                    id=""
                  />
                </label>
                <label htmlFor="" className=" flex flex-col gap-2">
                  <p className=" text-sm font-medium text-gray-700">
                    Product Description
                  </p>
                  <textarea
                    name="description"
                    value={productDetails.description}
                    onChange={handleProductDetailsInputChange}
                    id=""
                    rows="5"
                    placeholder="Enter product description"
                    className=" outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                  />
                </label>
                <label htmlFor="" className=" flex flex-col gap-2">
                  <p className=" text-sm font-medium text-gray-700">
                    Other Information
                  </p>
                  <textarea
                    name="other_info"
                    value={productDetails?.other_info}
                    onChange={handleProductDetailsInputChange}
                    id=""
                    rows="5"
                    placeholder="Enter other product information"
                    className=" outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                  />
                </label>
              </section>

              {/* PRODUCT MEDIA */}
              <section className=" bg-white p-5 space-y-2 rounded-lg">
                <p className="min-[450px]:text-lg text-base font-bold">
                  Product Media &nbsp;{" "}
                  <span className=" text-[10px] min-[450px]:text-sm text-gray-500">
                    "Minium of 2 images must be added"
                  </span>
                </p>

                <p className=" text-xs min-[450px]:text-sm text-gray-700 font-semibold py-2">
                  Product Photos
                </p>
                {param && param !== null ? (
                  <div className="gap-x-4 max-w-[80%] flex-wrap flex my-9 relative">
                    {productDetails.image_urls.map((imageUrl, index) => (
                      <div key={index} className="w-28 h-28 m-2 relative">
                        <div
                          onClick={() =>
                            deleteParticularObjectFromStorage(
                              index,
                              "image_urls",
                              productDetails?.image_urls,
                              setImagesToDeleteFromStorageAfterEditing
                            )
                          }
                          className="w-6 h-6 flex justify-center items-center rounded-full cursor-pointer  bg-green-500 absolute right-0 top-0"
                        >
                          <p className="font-bold mb-1">x</p>
                        </div>

                        <img
                          src={imageUrl?.url} // Set src to the URL created using URL.createObjectURL
                          alt={`Preview ${index}`}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative ${
                    dragOver ? "bg-green-800 [&>*]:text-white" : "bg-gray-100"
                  }  gap-5 border-gray-400 border-dashed rounded-xl p-5 border-[2px] flex flex-col items-center justify-center `}
                >
                  {selectedFiles && selectedFiles.length > 0 ? (
                    <div className="flex bg-orange-00 max-w-[80%] flex-wrap gap-x-4">
                      {selectedFiles?.map((file, index) => (
                        <div key={index} className="w-28 h-28 m-2 relative">
                          <div
                            onClick={() =>
                              handleDeleteItemsFromArray(
                                index,
                                setSelectedFiles
                              )
                            }
                            className="w-6 h-6 flex justify-center items-center rounded-full cursor-pointer  bg-green-500 absolute right-0 top-0"
                          >
                            <p className="font-bold mb-1">x</p>
                          </div>
                          <img
                            src={URL.createObjectURL(file)} // Set src to the URL created using URL.createObjectURL
                            alt={`Preview ${index}`}
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <section className=" gap-10 flex text-6xl justify-around">
                      <CiImageOn />
                      <CiImageOn />
                    </section>
                  )}

                  <p className=" min-[450px]:text-sm text-xs font-semibold text-gray-500">
                    Drag and drop images or click to upload
                  </p>
                  <input
                    id="uploaProductInput"
                    type="file"
                    onChange={handleFileSelect}
                    multiple
                    accept="image/jpeg, image/jpg, image/png"
                    hidden
                  />
                  <button
                    className=" border-[1px] border-green-800 px-5 py-1 text-green-800 rounded-md"
                    onClick={() =>
                      document?.querySelector("#uploaProductInput")?.click()
                    }
                  >
                    Upload image
                  </button>

                  <p className=" min-[450px]:text-sm text-xs font-semibold text-gray-500">
                    *Only PNG and JPEG files are allowed
                  </p>
                </div>

                {/* <button onClick={() => handleImageUploadToStorageBucket()}>ADD IMAGES TO DB</button> */}
              </section>

              {/* PRICING */}
              <section className=" bg-white p-5 space-y-2 rounded-lg">
                <p className="min-[450px]:text-lg text-base font-bold">
                  Pricing
                </p>
                <main className="  space-y-3 md:grid md:grid-cols-4 md:justify-between md:items-center">
                  <label htmlFor="" className=" col-span-4 flex flex-col gap-1">
                    <p className=" min-[450px]:text-sm text-xs font-semibold">
                      Base Price &nbsp;{" "}
                      <span className=" text-[10px] text-gray-500">
                        *Price before discount
                      </span>
                    </p>
                    <aside className="flex items-center border-[1px] border-gray-300 rounded-md py-1 px-2 divide-x-2">
                      <p className=" pr-2 text-gray-500">₦</p>
                      <input
                        name="price"
                        value={productDetails?.price}
                        onChange={handleProductDetailsInputChange}
                        type={"number"}
                        placeholder="Enter base price"
                        className=" placeholder:text-sm  px-2 w-full col-span-2 outline-none  bg-white "
                        id=""
                      />
                    </aside>
                  </label>
                  <label
                    htmlFor=""
                    className=" md:mr-5 md:col-span-2 flex flex-col gap-1"
                  >
                    <p className=" min-[450px]:text-sm text-xs font-semibold">
                      Discount Type
                    </p>
                    <select
                      name=""
                      id=""
                      className=" outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2 text-sm text-gray-500"
                    >
                      <option value="">Select discount type</option>
                    </select>
                  </label>
                  <label
                    htmlFor=""
                    className=" md:mr-5 md:col-span-2 flex flex-col gap-1"
                  >
                    <p className=" min-[450px]:text-sm text-xs font-semibold ">
                      Discount Percentage(%)
                    </p>
                    <aside className="flex items-center border-[1px] border-gray-300 rounded-md py-1 px-2 divide-x-2">
                      <input
                        type="number"
                        placeholder="7%"
                        className="  px-2 w-full col-span-2 outline-none  bg-white "
                        name="discount_rate"
                        value={productDetails?.discount_rate}
                        onChange={handleProductDetailsInputChange}
                        id=""
                      />
                      <p className=" px-2 text-xs">
                        ₦{productDetails?.discounted_price}
                      </p>
                    </aside>
                  </label>
                </main>
              </section>

              {/* INVENTORY */}
              <section className=" bg-white p-5 space-y-2 rounded-lg">
                <p className="min-[450px]:text-lg text-base font-bold">
                  Inventory
                </p>
                <main className=" md:grid md:grid-cols-2 md:gap-5 md:items-center md:space-y-0 space-y-3">
                  <label htmlFor="" className=" flex flex-col gap-1">
                    <p className="min-[450px]:text-sm text-xs font-medium text-gray-700">
                      Product SKU
                    </p>
                    <input
                      type="text"
                      placeholder="Enter product SKU"
                      className=" outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                      name="sku"
                      value={productDetails.sku}
                      onChange={handleProductDetailsInputChange}
                      id=""
                    />
                  </label>
                  <label htmlFor="" className=" flex flex-col gap-1">
                    <p className="min-[450px]:text-sm text-xs font-medium text-gray-700">
                      Product Quantity
                    </p>
                    <input
                      name="stock_quantity"
                      value={productDetails.stock_quantity}
                      type="number"
                      onChange={handleProductDetailsInputChange}
                      placeholder="Enter product quantity"
                      className=" outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                    />
                  </label>
                </main>
              </section>

              {/* VARIATIONS */}
              <section className=" bg-white p-5 space-y-2 rounded-lg">
                <p className="min-[450px]:text-lg text-base font-bold">
                  Variation
                </p>
                <main className=" space-y-5">
                  {param && param !== null ? (
                    <div className="gap-x-4 flex my-9 relative">
                      {productDetails?.variations?.map((variation, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            deleteParticularObjectFromStorage(
                              index,
                              "variations",
                              productDetails.variations,
                              setVariationsToDeleteFromDbAfterEditing
                            )
                          }
                          className="w-fit py-3 px-3 rounded-xl text-sm text-white flex justify-center items-center gap-x-5 h-7 bg-green-700"
                        >
                          <p>
                            {variation.type} : {variation.variation}
                          </p>
                          <p className="cursor-pointer mb-[0.12rem]">x</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                  {variations && variations.length > 0
                    ? variations?.map((variation, index) => (
                        <label
                          htmlFor={`variation-${index}`}
                          className="text-xs flex flex-col gap-2"
                          key={index}
                        >
                          <p className="min-[450px] text-sm font-semibold">
                            <span className="text-xs">
                              Variation Type &nbsp;| &nbsp;
                              <span
                                className="text-yellow-400"
                                onClick={() =>
                                  handleDeleteItemsFromArray(
                                    index,
                                    setVariations
                                  )
                                }
                              >
                                Remove
                              </span>
                            </span>
                          </p>
                          <select
                            name="type"
                            value={variation.type}
                            onChange={(e) =>
                              handleVariationInputChange(e, index, "type")
                            }
                            id={`variation-${index}`}
                            className="outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2 text-sm text-gray-500"
                          >
                            <option value="">Select variation type</option>
                            <option value="Color">Color</option>
                            <option value="Dimension">Dimension</option>
                          </select>
                          <p className="min-[450px] text-sm font-medium text-gray-700">
                            Variation
                          </p>
                          <input
                            type="text"
                            placeholder={variation.type}
                            className="outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                            name="variation"
                            value={variation.variation}
                            onChange={(e) =>
                              handleVariationInputChange(e, index, "variation")
                            }
                            id={`variation-${index}`}
                          />
                        </label>
                      ))
                    : "No Variations Selected"}
                </main>
                <button
                  className=" self-end border-[1px] border-green-800 text-sm px-5 py-1 text-green-800 rounded-md"
                  onClick={() => handleAddVariation()}
                >
                  Add Variation
                </button>
              </section>

              {/* PRODUCT EXTRA DETAILS */}
              <section className=" bg-white p-5 space-y-2 rounded-lg">
                <p className="min-[450px]:text-lg pb-2 text-sm font-bold">
                  Product Extra Details
                </p>
                <main className=" space-y-3">
                  <label htmlFor="" className=" flex flex-col gap-1">
                    <p className="min-[450px]:text-sm text-xs font-semibold">
                      Product Category
                    </p>
                    <select
                      name="category_id"
                      value={productDetails?.category_id}
                      id=""
                      onChange={handleProductDetailsInputChange}
                      className=" outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2 text-sm text-gray-500"
                    >
                      <option value="">Select Category</option>
                      {categories &&
                        categories?.map((category, index) => (
                          <option key={index} value={category?.id}>
                            {category?.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label htmlFor="" className=" flex flex-col gap-1">
                    <p className="min-[450px]:text-sm text-xs font-semibold">
                      Product Tags
                    </p>
                    {param && param !== null ? (
                      <div className="gap-x-4 flex my-2 relative">
                        {productDetails?.tags?.map((tag, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              deleteParticularObjectFromStorage(
                                index,
                                "tags",
                                productDetails?.tags,
                                setTagsToDeleteFromDbAfterEditing
                              )
                            }
                            className="w-fit py-3 px-3 rounded-xl text-sm text-white flex justify-center items-center gap-x-5 h-7 bg-green-700"
                          >
                            <p>{tag}</p>
                            <p className="cursor-pointer mb-[0.12rem]">x</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}

                    {tags && tags.length > 0 ? (
                      <div className="flex gap-x-2 gap-y-2 flex-wrap">
                        {tags?.map((tag, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handleDeleteItemsFromArray(index, setTags)
                            }
                            className="w-fit py-3 px-3 rounded-xl text-sm text-white flex justify-center items-center gap-x-5 h-7 bg-green-700"
                          >
                            <p>{tag}</p>
                            <p className="cursor-pointer mb-[0.12rem]">x</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}

                    <input
                      type={"text"}
                      placeholder="Enter base price"
                      className="border-[1px] border-gray-300 rounded-md placeholder:text-sm py-1 px-2 w-full col-span-2 outline-none  bg-white "
                      name="name"
                      id=""
                      value={tagInputValue}
                      onChange={handleTagChange}
                      onKeyUp={enterTagEvent}
                    />
                  </label>
                </main>
              </section>

              {/* SHIPPING */}
              <section className=" bg-white p-5 space-y-2 rounded-lg">
                <p className="min-[450px]:text-lg text-sm font-bold pb-2">
                  Shipping
                </p>
                <main className=" space-y-3">
                  <label htmlFor="" className=" flex flex-col gap-2">
                    <p className=" min-[450px]:text-sm text-xs font-medium text-gray-700">
                      Product Weight
                    </p>
                    <input
                      type="number"
                      placeholder="Kg"
                      className=" placeholder:text-xs outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                      name="weight"
                      value={productDetails?.weight}
                      onChange={handleProductDetailsInputChange}
                      id=""
                    />
                  </label>
                  <label htmlFor="" className=" flex flex-col gap-2">
                    <p className=" min-[450px]:text-sm text-xs font-medium text-gray-700">
                      Product Height
                    </p>
                    <input
                      type="number"
                      name="height"
                      value={productDetails?.height}
                      onChange={handleProductDetailsInputChange}
                      id=""
                      placeholder="Cm"
                      className=" placeholder:text-xs outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                    />
                  </label>
                  <label htmlFor="" className=" flex flex-col gap-2">
                    <p className=" min-[450px]:text-sm text-xs font-medium text-gray-700">
                      Product Width
                    </p>
                    <input
                      type="number"
                      name="width"
                      value={productDetails?.width}
                      onChange={handleProductDetailsInputChange}
                      id=""
                      placeholder="Cm"
                      className=" placeholder:text-xs outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                    />
                  </label>
                  <label htmlFor="" className=" flex flex-col gap-2">
                    <p className=" min-[450px]:text-sm text-xs font-medium text-gray-700">
                      Product Length
                    </p>
                    <input
                      type="number"
                      name="length"
                      value={productDetails?.length}
                      onChange={handleProductDetailsInputChange}
                      id=""
                      placeholder="Cm"
                      className=" placeholder:text-xs outline-none border-[1px] border-gray-300 bg-white rounded-md py-1 px-2"
                    />
                  </label>
                </main>
              </section>

              <section className="md:justify-end md:gap-3 flex justify-between bg-white px-4 py-4 rounded-md sticky bottom-2 border items-center">
                <button
                  className="border-[1px]  text-sm px-5 py-2 text-white bg-green-800 rounded-md"
                  onClick={() => addProductToDatabase(userDetails?.id)}
                >
                  {param === null ? "Create Product" : "Edit Product"}
                </button>

                <button
                  onClick={() => navigate("/seller/products")}
                  className="border-[1px] border-yellow-600 text-sm px-5 py-2 text-yellow-600 rounded-md"
                >
                  Cancel
                </button>
              </section>
            </main>
          </div>
        )
      )}
    </>
  );
}

export default AddSellerProduct;
