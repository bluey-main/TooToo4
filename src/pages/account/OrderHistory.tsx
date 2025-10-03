import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { useUser } from "../../context/UserContext";
import { numberWithCommas } from "../../utils/helper";
import { useAuth } from "@/context/AuthContext";
import { AccountHeader } from "@/components/account/AccountHeader";

export default function OrderHistory() {
  const { orders, userDetails, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userDetails);
    console.log(orders);
  }, []);

  return (
    <div className="bg-white w-full min-h-[50vh]">
      <div className="  px-4 py-5 sm:px-6 ">
        <AccountHeader
          heading=" Your Orders"
          text="Check the status of recent orders, manage returns, and discover
        similar products."
        />

        <div className="mt-12 space-y-16 sm:mt-16">
          {loading ? (
            <div className="flex items-center justify-center flex-col gap-3">
              <div
                className="inline-block h-[30px] w-[30px] animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-[#305C45]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <span className="text-sm">Loading orders...</span>
            </div>
          ) : orders.length < 1 ? (
            <p>No orders found</p>
          ) : (
            orders
              .sort((a, b) => new Date(Number(a.created_at)) - new Date(Number(b.created_at)))
              .map((order) => (
                <section key={order.id} aria-labelledby={`${order.id}-heading`}>
                  <div className="space-y-1 md:flex md:items-baseline md:space-x-4 md:space-y-0">
                    <h2
                      id={`${order.id}-heading`}
                      className="text-lg font-medium text-gray-900 md:flex-shrink-0"
                    >
                      Order #{order.id}
                    </h2>
                    <div className="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        {order.status}
                      </p>
                      <div className="flex text-sm font-medium">
                        <Link
                          to={`${order.id}`}
                          className="text-[#305C45]  hover:text-[#305c45ce] "
                        >
                          View Order
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div
                    key={order?.product?.id}
                    className="-mb-6 mt-6 flow-root divide-y divide-gray-200 border-t border-gray-200"
                  >
                    <div key={order?.product?.id} className="py-6 sm:flex">
                      <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                        <img
                        title={order?.product?.name}
                          src={order?.product?.image?.url}
                          className="h-20 w-20 flex-none rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                        <div className="min-w-0 flex-1 pt-1.5 sm:pt-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            <a href={order?.product?.id}>
                              {order?.product?.name}
                            </a>
                          </h3>
                          <p className="truncate text-sm text-gray-500">
                            {/* <span className="capitalize">
                              {order?.product?.category}
                            </span>{" "} */}
                            <span
                              className="mx-1 text-gray-400"
                              aria-hidden="true"
                            >
                              x
                            </span>{" "}
                            <span>{order?.product?.quantity}</span>
                          </p>
                          <p className="mt-1 font-medium text-gray-900">
                            $
                            {numberWithCommas(
                              order?.product?.price * order?.product?.quantity
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4 sm:ml-6 sm:mt-0 sm:w-40 sm:flex-none">
                        <button
                          onClick={() =>
                            navigate(`/product/${order?.product?.id}`)
                          }
                          type="button"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#305c45] px-2.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#305c45ce] focus:outline-none focus:ring-2 focus:ring-[#305c45b5] focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                        >
                          Buy again
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#305c45] focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                        >
                          Shop similar
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
