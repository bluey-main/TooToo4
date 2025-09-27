import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { v4 } from "uuid";
// import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { generateSlug } from "@/utils/auxillary-functions";

// Types
export interface ProductDetails {
  id?: string;
  name: string;
  description: string;
  other_info: string; //
  price: number;
  discount_rate: number; //
  discounted_price: number; //
  stock_quantity: number;
  category_id: string;
  sku: string; //
  weight: string; //
  height: string; //
  width: string; //
  length: string; //
  image_urls: ImageUrl[];
  variations: Variation[]; //
  tags: string[]; //
  seller_id?: string;
  updated_at?: string;
  created_at?: string;
}

interface ImageUrl {
  filename: string;
  url: string;
}

interface Variation {
  type: string;
  variation: string;
}

export type Order = {
  id: string;
  user_id: string;
  order_date: string; // ISO date string
  total_amount: number;
  status: "pending" | "completed" | "cancelled" | string; // extend as needed
  delivery_address_id: string;
  driver_id: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  product: Product;
  payment_id: string | null;
  payment_status: "paid" | "pending" | "failed" | string; // extend as needed
  payment_intent_id: string | null;
  stripe_customer_id: string | null;
  stripe_session_id: string | null;
  purchase_id: string | null;

};

export type Product = {
  id: string;
  name: string;
  image: {
    url: string;
    filename: string;
  };
  price: number;
  category: string;
  quantity: number;
  stripeId: string | null;
  vendorId: string;
  vendorType: "basic" | "premium" | string; // extend as needed
};

interface ProductToDeleteDetails {
  productId: string;
  fileArray: ImageUrl[];
  productName: string;
}

interface SellerContextType {
  categories: string[];
  isLoading: boolean;
  productDetails: ProductDetails;
  selectedFiles: File[];
  dragOver: boolean;
  tagInputValue: string;
  variations: Variation[];
  param: string;
  tags: string[];
  loadingOrder: boolean;
  orderUserDetails: any;
  order: Order | null;
  deliveryAddress: any;
  tagsToDeleteFromDbAfterEditing: string[];
  setTagsToDeleteFromDbAfterEditing: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  setImagesToDeleteFromStorageAfterEditing: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  variationsToDeleteFromDbAfterEditing: Variation[];
  deleteProductModal: boolean;
  setDeleteProductModal: React.Dispatch<React.SetStateAction<boolean>>;

  doubleConfirmationModal: boolean;
  setDoubleConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  productToDeleteDetails: ProductToDeleteDetails;
  setProductToDeleteDetails: React.Dispatch<
    React.SetStateAction<ProductToDeleteDetails>
  >;
  navigateToProductsPage: boolean;
  setNavigateToProductsPage: React.Dispatch<React.SetStateAction<boolean>>;
  sellerOrders: Order[] | null;
  getProductDetailsFromDatabase: (urlParam: string | null) => Promise<void>;
  setParam: React.Dispatch<React.SetStateAction<string>>;
  setVariations: React.Dispatch<React.SetStateAction<Variation[]>>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  setDeliveryAddress: React.Dispatch<React.SetStateAction<any>>;
  setOrderUserDetails: React.Dispatch<React.SetStateAction<any>>;
  setLoadingOrder: React.Dispatch<React.SetStateAction<boolean>>;
  setProductDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setVariationsToDeleteFromDbAfterEditing: React.Dispatch<
    React.SetStateAction<Variation[]>
  >;
  getUserNameFunc: (addressId: string) => Promise<string | undefined>;
  fetchUserDetails: (userId: string) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  fetchDeliveryDetails: (addressId: string) => Promise<void>;
  subTotalCalculations: () => number;
  deleteProductFromDatabase: () => Promise<void>;
  deleteParticularObjectFromStorage: (
    indexToRemove: number,
    objectKey: string,
    arrayToRemoveFrom: ImageUrl[],
    setAlternateArrayToStoreImagesToDelete: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => Promise<void>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  enterTagEvent: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleTagChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent) => void;
  handleDragLeave: (event: React.DragEvent) => void;
  handleVariationInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    propertyName: string
  ) => void;
  handleAddVariation: () => void;
  handleProductDetailsInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  addProductToDatabase: (uid: string) => Promise<void>;
  handleDeleteItemsFromArray: (
    index: number,
    setArray: React.Dispatch<React.SetStateAction<any[]>>
  ) => void;
  handleDrop: (event: React.DragEvent) => void;
  fetchAllRelatedOrderFunction: () => Promise<void>;
  getSellerOrders: () => Promise<Order[] | undefined>;
  getCategoriesFromDb: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;

}

export const SellerContext = createContext<SellerContextType | null>(null);

export const useSeller = (): SellerContextType => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error("useSeller must be used within a SellerProvider");
  }
  return context;
};

interface SellerProviderProps {
  children: ReactNode;
}

const SellerProvider: React.FC<SellerProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [navigateToProductsPage, setNavigateToProductsPage] = useState(false);
  const [param, setParam] = useState("");

  const [
    imagesToDeleteFromStorageAfterEditing,
    setImagesToDeleteFromStorageAfterEditing,
  ] = useState<string[]>([]);
  const [
    variationsToDeleteFromDbAfterEditing,
    setVariationsToDeleteFromDbAfterEditing,
  ] = useState<Variation[]>([]);
  const [tagsToDeleteFromDbAfterEditing, setTagsToDeleteFromDbAfterEditing] =
    useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const [productToDeleteDetails, setProductToDeleteDetails] =
    useState<ProductToDeleteDetails>({
      productId: "",
      fileArray: [],
      productName: "",
    });
  const [sellerOrders, setSellerOrders] = useState<Order[] | null>(null);

  const { userDetails } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");

  const resetFields: ProductDetails = {
    name: "",
    description: "",
    other_info: "",
    price: 0,
    discount_rate: 0,
    discounted_price: 0,
    stock_quantity: 0,
    category_id: "",
    sku: "",
    weight: "",
    height: "",
    width: "",
    length: "",
    image_urls: [],
    variations: [],
    tags: [],
  };

  const [productDetails, setProductDetails] =
    useState<ProductDetails>(resetFields);
  const [dragOver, setDragOver] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderUserDetails, setOrderUserDetails] = useState<any>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
  const [doubleConfirmationModal, setDoubleConfirmationModal] = useState(false);


  const updateOrderStatus = async (orderId: string, newStatus: string) => {
  if (!userDetails?.id) {
    toast.error("You must be logged in as a vendor");
    return;
  }

  try {
    // Show double confirmation modal
    setDoubleConfirmationModal(true);

    // Wait for vendor confirmation (can be a custom modal)
    const confirmed = await new Promise<boolean>((resolve) => {
      // Example: a simple confirmation
      const confirmed = window.confirm(
        `Are you sure you want to change the order status to "${newStatus}"?`
      );
      resolve(confirmed);
    });

    if (!confirmed) {
      toast("Order status change cancelled");
      return;
    }

    // Update in Supabase
    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("vendor_id", userDetails.id); // ensures only vendor can update

    if (error) throw error;

    // Update local state
    setOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
    );

    setSellerOrders((prev) =>
      prev
        ? prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        : prev
    );

    toast.success(`Order status updated to "${newStatus}"`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update order status");
  } finally {
    setDoubleConfirmationModal(false);
  }
};


  const getProductDetailsFromDatabase = async (urlParam: string | null) => {
    setIsLoading(true);
    if (urlParam === null) {
      setProductDetails(resetFields);
      console.log("no param");
      setIsLoading(false);
      return;
    }
    console.log(urlParam);
    setParam(urlParam);

    try {
      const { data: productData, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", urlParam)
        .single();

      if (error) throw error;

      setProductDetails(productData);
      setIsLoading(false);
    } catch (error) {
      console.log("error:" + error);
      setIsLoading(false);
    }
  };

  const getCategoriesFromDb = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("categories").select("*");

      if (error) throw error;

      setCategories(data || []);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategoriesFromDb();
  }, []);

  // TAG FUNCTION TO ADD TAG WHEN ENTER KEY IS PRESSED
  const enterTagEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (tagInputValue.trim() !== "") {
        setTags((prevValues) => [...prevValues, tagInputValue.trim()]);
        setTagInputValue("");
      }
    }
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputValue(event.target.value);
  };

  // Updated upload function with proper authentication
  const uploadImageToStorage = async (
    fileName: string,
    file: File,
    uid: string,
    folderName: string
  ): Promise<string> => {
    try {
      // const fileName = v4();
      const filePath = `${uid}/${folderName}/${fileName}`;

      // Make sure user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const deleteImageFromStorage = async (filePath: string) => {
    const { error } = await supabase.storage
      .from("product-images")
      .remove([filePath]);

    if (error) throw error;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const filesArray = Array.from(event.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
      setDragOver(false);
    }
  };

  const updatePropertyAtIndex = (
    array: Variation[],
    index: number,
    propertyName: string,
    value: string
  ): Variation[] => {
    return array.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [propertyName]: value,
        };
      }
      return item;
    });
  };

  const handleVariationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    propertyName: string
  ) => {
    const newValue = e.target.value;
    setVariations((prevVariations) =>
      updatePropertyAtIndex(prevVariations, index, propertyName, newValue)
    );
  };

  const handleAddVariation = () => {
    setVariations((prevState) => [
      ...prevState,
      {
        type: "",
        variation: "",
      },
    ]);
  };

  const handleProductDetailsInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "discount_rate" || name === "price") {
      const price = name === "price" ? parseFloat(value) : productDetails.price;
      const discountRate =
        name === "discount_rate"
          ? parseFloat(value)
          : productDetails.discount_rate;
      const calculatedDiscountedPrice = price - price * (discountRate / 100);

      setProductDetails((prevState) => ({
        ...prevState,
        [name]: value,
        discounted_price: calculatedDiscountedPrice,
      }));
    } else {
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const validateProductDetails = (details: ProductDetails): boolean => {
    for (const key in details) {
      if (
        [
          "imageStorageFileName",
          "image_urls",
          "tags",
          "variations",
          "id",
          "seller_id",
          "updatedAt",
          "createdAt",
          "discount_rate",
          "width",
          "height",
          "length",
        ].includes(key)
      ) {
        continue;
      }

      const value = details[key as keyof ProductDetails];
      if (
        value === "" ||
        value === 0 ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const addProductToDatabase = async (uid: string) => {
    try {
      if (
        !validateProductDetails(productDetails) ||
        (selectedFiles.length === 0 &&
          productDetails.image_urls.length === 0) ||
        // (variations.length === 0 && productDetails.variations.length === 0) ||
        (tags.length === 0 && productDetails.tags.length === 0)
      ) {
        toast.error("Fill all fields");
        return;
      }

      setIsLoading(true);
      let downloadURLs: ImageUrl[] = [];
      const folderId = param !== null ? productDetails.id : v4();

      // Upload images to Supabase Storage
      const folderName = folderId;

      for (const file of selectedFiles) {
        try {
          const fileName = v4();

          const publicUrl = await uploadImageToStorage(
            fileName,
            file,
            uid,
            folderName
          );

          downloadURLs.push({
            filename: fileName,
            url: publicUrl,
          });
        } catch (uploadError) {
          console.error("Failed to upload file:", uploadError);
          toast.error(`Failed to upload ${file.name}`);
          // Continue with other files or stop based on your needs
        }
      }

      if (selectedFiles.length > 0 && downloadURLs.length === 0) {
        toast.error("No images were uploaded successfully");
        setIsLoading(false);
        return;
      }

      const productSlug = await generateSlug(productDetails?.name);

      const updatedProductDetails = {
        ...productDetails,
        slug: productSlug,
        id: folderId,
        height: productDetails?.height ? Number(productDetails.height) : null,
        width: productDetails?.width ? Number(productDetails.width) : null,
        length: productDetails?.length ? Number(productDetails.length) : null,

        created_at: new Date().toISOString(),
        seller_id: uid,
        updated_at: new Date().toISOString(),
        // image_storage_file_name: param !== null ? productDetails.imageStorageFileName : productDetails.name,
        image_urls: [...productDetails.image_urls, ...downloadURLs],
        tags: [...productDetails.tags, ...tags],
        variations: [...productDetails.variations, ...variations],
      };

      if (param !== null) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(updatedProductDetails)
          .eq("id", param);
        if (error) throw error;
        // Delete old images if needed
        if (imagesToDeleteFromStorageAfterEditing.length > 0) {
          await Promise.all(
            imagesToDeleteFromStorageAfterEditing.map(async (filename) => {
              const filePath = `${uid}/${productDetails.id}/${filename}`;
              await deleteImageFromStorage(filePath);
            })
          );
        }
        console.log(updatedProductDetails);

        console.log("PRODUCT UPDATED");
      } else {
        // Create new product

        console.log(updatedProductDetails);
        const { error } = await supabase.from("products").insert({
          ...updatedProductDetails,
          // created_at: new Date().toISOString(),
        });

        if (error) throw error;

        console.log("PRODUCT UPLOADED");
      }

      // Reset form
      setProductDetails(resetFields);
      setSelectedFiles([]);
      setTags([]);
      setVariations([]);
      setNavigateToProductsPage(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while saving the product");
      setIsLoading(false);
    }
  };

  const deleteProductFromDatabase = async (onSuccess) => {
    try {
      // Delete product images from Supabase storage
      if (
        productToDeleteDetails.fileArray &&
        productToDeleteDetails.fileArray.length > 0
      ) {
        // Create array of file paths for batch deletion
        const filePaths = productToDeleteDetails.fileArray.map(
          (item) =>
            `${userDetails?.id}/${productToDeleteDetails.productId}/${item.filename}`
        );

        // Use Supabase storage remove method for batch deletion
        const { data: deletedFiles, error: storageError } =
          await supabase.storage
            .from("product-images") // Replace with your actual bucket name
            .remove(filePaths);

        if (storageError) {
          console.error("Storage deletion error:", storageError);
          // Continue with product deletion even if some images fail to delete
        }

        console.log(filePaths);
      }

      // Delete product from database
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDeleteDetails.productId);

      if (error) throw error;

      setDeleteProductModal(false);
      setDoubleConfirmationModal(false);
      toast.success("Product deleted successfully");

      // Call the callback to refetch products
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Error deleting product");
    }
  };

  const deleteParticularObjectFromStorage = async (
    indexToRemove: number,
    objectKey: string,
    arrayToRemoveFrom: ImageUrl[],
    setAlternateArrayToStoreImagesToDelete: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    try {
      setAlternateArrayToStoreImagesToDelete((prevState) => [
        ...prevState,
        arrayToRemoveFrom[indexToRemove].filename,
      ]);

      const updatedUrls = [
        ...arrayToRemoveFrom.slice(0, indexToRemove),
        ...arrayToRemoveFrom.slice(indexToRemove + 1),
      ];

      setProductDetails((prevState) => ({
        ...prevState,
        [objectKey]: updatedUrls,
      }));

      console.log("Image marked for deletion");
    } catch (error) {
      console.error("Error marking image for deletion:", error);
    }
  };

  const handleDeleteItemsFromArray = (
    index: number,
    setArray: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setArray((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  // Orders functions
  const fetchOrder = useCallback(async (id: string) => {
    try {
      setLoadingOrder(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setOrder(data);
      console.log("order set");
      setLoadingOrder(false);
    } catch (error) {
      setLoadingOrder(false);
      toast.error("An error occurred while fetching order details");
    }
  }, []);

  const fetchDeliveryDetails = useCallback(async (addressId: string) => {
    try {
      setLoadingOrder(true);
      const { data, error } = await supabase
        .from("delivery_addresses")
        .select("*")
        .eq("id", addressId)
        .single();

      if (error) throw error;

      setLoadingOrder(false);
      setDeliveryAddress(data);
    } catch (error) {
      setLoadingOrder(false);
      toast.error("An error occurred while fetching delivery details");
    }
  }, []);

  const getUserNameFunc = async (
    addressId: string
  ): Promise<string | undefined> => {
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("first_name")
        .eq("id", addressId)
        .single();

      if (error) throw error;

      return data.first_name;
    } catch (error) {
      toast.error("An error occurred while fetching user details");
    }
  };

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      setLoadingOrder(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setLoadingOrder(false);
      setOrderUserDetails(data);
    } catch (error) {
      setLoadingOrder(false);
      toast.error("An error occurred while fetching user details");
    }
  }, []);

  const subTotalCalculations = (): number => {
    if (!order) return 0;
    return (
      parseFloat(order.product.price.toString()) *
        parseFloat(order.product.quantity.toString()) +
      100
    );
  };

  const fetchAllRelatedOrderFunction = useCallback(async () => {
    try {
      if (order) {
        console.log("order is loaded");
        await fetchDeliveryDetails(order.delivery_address_id);
        await fetchUserDetails(order.user_id);
      }
      console.log("Checking 12");
    } catch (error) {
      toast.error("Error fetching related order data");
    }
  }, [order, fetchDeliveryDetails, fetchUserDetails]);

  const getSellerOrders = async (): Promise<Order[] | undefined> => {
    if (!userDetails?.id) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("vendor_id", userDetails.id);

        // const { data, error } = await supabase.rpc('get_orders_by_vendor', { vendor: userDetails.id });

        console.log(data)

      if (error) throw error;

      const ordersData = data.map((order) => ({
        id: order.id,
        ...order,
      }));

      setSellerOrders(ordersData);
      console.log("Orders fetched");
      return ordersData;
    } catch (error) {
      console.log(error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchAllRelatedOrderFunction();
  }, [fetchAllRelatedOrderFunction]);

  const values: SellerContextType = {
    categories,
    isLoading,
    productDetails,
    selectedFiles,
    dragOver,
    tagInputValue,
    variations,
    param,
    tags,
    loadingOrder,
    orderUserDetails,
    order,
    deliveryAddress,
    tagsToDeleteFromDbAfterEditing,
    setTagsToDeleteFromDbAfterEditing,
    setImagesToDeleteFromStorageAfterEditing,
    variationsToDeleteFromDbAfterEditing,
    deleteProductModal,
    setDeleteProductModal,
    doubleConfirmationModal,
    setDoubleConfirmationModal,
    productToDeleteDetails,
    setProductToDeleteDetails,
    navigateToProductsPage,
    setNavigateToProductsPage,
    sellerOrders,
    getProductDetailsFromDatabase,
    setParam,
    setVariations,
    setTags,
    setOrder,
    setDeliveryAddress: setDeliveryAddress,
    setOrderUserDetails,
    setLoadingOrder,
    setProductDetails,
    setSelectedFiles,
    setVariationsToDeleteFromDbAfterEditing,
    getUserNameFunc,
    fetchUserDetails,
    fetchOrder,
    fetchDeliveryDetails,
    subTotalCalculations,
    deleteProductFromDatabase,
    deleteParticularObjectFromStorage,
    handleFileSelect,
    enterTagEvent,
    handleTagChange,
    handleDragOver,
    handleDragLeave,
    handleVariationInputChange,
    handleAddVariation,
    handleProductDetailsInputChange,
    addProductToDatabase,
    handleDeleteItemsFromArray,
    handleDrop,
    fetchAllRelatedOrderFunction,
    getSellerOrders,
    getCategoriesFromDb,
      updateOrderStatus,
  };

  return (
    <SellerContext.Provider value={values}>{children}</SellerContext.Provider>
  );
};

export default SellerProvider;
