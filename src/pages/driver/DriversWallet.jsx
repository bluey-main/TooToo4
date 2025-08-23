
import {
  IoChevronDown,
  IoChevronDownOutline,
  IoCreateOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router";

const DriversWallet = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white p-5 rounded-lg">
      <div className="flex gap-x-10 items-stretch max-[920px]:flex-col">
        <div className="w-[50%]  max-[920px]:w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-default-600 font-semibold text-[20px]">
              Drivers wallet
            </h3>
            <p className="text-default-600 text-sm">
              Transactions this month: 38
            </p>
          </div>
          <div className="w-full p-8 my-4 h-[240px] flex flex-col justify-between bg-[url('https://bafybeidr5h2c5a7ylvl3xep63hkqkijtklxj2na6s2ut47zxmnfmntcine.ipfs.nftstorage.link/Group.png')] rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-primary font-semibold">
                Total balance:
              </h3>{" "}
              <h3 className="text-[23px] text-primary font-semibold">
                $ 7,266
              </h3>
            </div>
            <div className="flex gap-x-4">
              <button
                onClick={() => navigate("wallet/withdraw-funds")}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#305c45] px-2.5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#305c45ce] focus:outline-none focus:ring-2 focus:ring-[#305c45b5] focus:ring-offset-2 sm:w-full sm:flex-grow-0 mt-5"
                
              >
                <p>Withdraw</p>
              </button>
            </div>
          </div>
        </div>
        <div className="w-[50%] max-[920px]:w-full">
          <h3 className="text-default-600 font-semibold text-[19px]">Cards</h3>
          <div className="border-[1px] border-default-300 rounded-lg my-4">
            <div className="flex items-center justify-between p-3 border-b-[1px] border-b-default-300 px-5">
              <h3 className="text-default-600 text-sm ">See all</h3>
              <IoCreateOutline />
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <div className="flex items-center gap-x-2">
                  <img
                    className="w-7 object-contain h-auto"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt=""
                  />
                  <p className="text-sm text-default-600">Thomas Emmanuel</p>
                </div>
                <p className="text-sm font-semibold text-default-700 mt-1">
                  24069**** ****3120
                </p>
              </div>
              <p className="text-[13px] font-semibold text-primary bg-[#dff3e7] p-1 px-2 rounded-md">
                Default
              </p>
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <div className="flex items-center gap-x-2">
                  <img
                    className="w-7 object-contain h-auto"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt=""
                  />
                  <p className="text-sm text-default-600">Thomas Emmanuel</p>
                </div>
                <p className="text-sm font-semibold text-default-700 mt-1">
                  24069**** ****3120
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end p-3 border-t-[1px] border-t-default-300 px-5">
              <Button
                onClick={() => navigate("wallet/add-new-card")}
                className="bg-white p-0 h-fit"
              >
                <h3 className="text-sm font-semibold text-primary">
                  Link a card
                </h3>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-default-600 text-[17px]">
          Transaction history
        </h3>
        <div className="relative overflow-x-auto border sm:rounded-lg mt-4">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Items
                </th>
                <th scope="col" className="px-6 py-3">
                  Price ( $ )
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount ($ )
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(10)
                .fill()
                .map((_, key) => {
                  return (
                    <tr
                      onClick={() => navigate(`/admin/orders/${key}`)}
                      className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                      key={key}
                    >
                      <td className="px-6 py-4">Luxury female handbag</td>
                      <td className="px-6 py-4">3,000</td>
                      <td className="px-6 py-4">x1</td>
                      <td className="px-6 py-4">7,000</td>
                      <td className="px-6 py-4">Fashion</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DriversWallet;