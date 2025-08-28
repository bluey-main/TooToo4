import { IProduct } from "@/App";
import { numberWithCommas } from "@/utils/helper";
import { useNavigate } from "react-router";

interface ProductCardProps {
  product: IProduct
}

const ProductCard: React.FC<ProductCardProps> = ({
product
}) => {
  const navigate = useNavigate();

  function isNew(createdAt: string): boolean {
  // Convert DB timestamptz string to Date
  const createdDate = new Date(createdAt);
  const now = new Date();

  // Difference in milliseconds
  const diffMs = now.getTime() - createdDate.getTime();

  // Convert ms → days
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Check if within a week
  return diffDays <= 7 ? true : false;
}

const isSpecialOffer = product?.discount_rate || product?.discount_rate !== 0
  return (
    <div
      key={product?.id}
      onClick={() => navigate(`/product/${product?.id}`)}
      className="group cursor-pointer relative border rounded-lg hover:border-[#086047] max-lg:min-w-[200px] h-fit overflow-hidden"
    >
      {isNew(product?.created_at) && (
        <div className="uppercase bg-[#086047] text-white rounded-md absolute top-3 left-3 text-[13px] font-semibold p-1.5 px-3 shadow-lg z-[5]">
          <p>New</p>
        </div>
      )}
      {isSpecialOffer && (
        <div className="uppercase bg-[#fef3e9] text-[#f68b1e] rounded-md absolute top-3 right-3 text-[13px] font-semibold p-1.5 px-3 z-[5] border border-[#f68b1e]">
          <p>-{product?.discount_rate}%</p>
        </div>
      )}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-md bg-black/10 lg:aspect-none group-hover:opacity-75 max-h-60 min-h-60 max-lg:min-h-[150px] max-lg:max-h-[150px] h-full">
        
        <img
        title={product?.name}
          src={product?.image_urls?.length > 0 ? product?.image_urls[0]?.url : "https://placehold.co/600x400"}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="flex justify-between max-lg:flex-col p-5 bg-black/[5%]">
        <div className="w-full">
          <h3 className="text-sm text-gray-700 line-clamp-1 max-w-[80%] max-lg:mb-1">
            <span aria-hidden="true" className="absolute inset-0" />
            {product?.name}
          </h3>
          <p className="mt-1 text-sm max-lg:hidden text-gray-500 capitalize line-clamp-1">
            {product?.category}
          </p>
        </div>
        <p
          className={`text-md relative font-semibold text-gray-900 ${
            isSpecialOffer && "lg:line-through lg:text-sm lg:text-gray-900/40"
          }`}
        >
          {isSpecialOffer  ? (
            <span className="max-lg:hidden">${numberWithCommas(product?.price)} </span>
          ) : (
            <span className="text-[#086047]">${numberWithCommas(product?.price)} </span>
          )}
          {isSpecialOffer && (
            <span className="lg:hidden text-[#086047]">${numberWithCommas(product?.discounted_price)} </span>
          )}
          {isSpecialOffer && (
            <span className="absolute max-lg:hidden top-5 left-0 text-[#086047]">
              ${numberWithCommas(product?.discounted_price)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
