import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/dropdown";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Radio, RadioGroup } from "@nextui-org/react";

const DeliveryAddress = ({ isHome = true, onAddressSelected }) => {
  const {
    userDetails,
    deliveryAddresses,
    loadingAddress,
    fetchAddresses,
    setLoadingAddress,
  } = useAuth();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    !isHome && onAddressSelected(selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    if (deliveryAddresses.length > 0) {
      const defaultAddress = deliveryAddresses.filter(
        (address) => address.default == true
      )[0];
      setSelectedAddress(defaultAddress ? defaultAddress.id : "");
    }
  }, [deliveryAddresses]);

  const handleSetDefault = async (id) => {
    setLoadingAddress(true);
    try {
      await supabase
        .from("addresses")
        .update({ default: false })
        .eq("user_id", userDetails.id);
      await supabase.from("addresses").update({ default: true }).eq("id", id);
      setLoadingAddress(false);
      toast.success("Address updated successfully");
      fetchAddresses();
    } catch (error) {
      setLoadingAddress(false);
      toast.error("An error occured while updating address");
    }
  };

  const handleRemove = async (id) => {
    if (confirm("Are you sure you want to remove this address?") == true) {
      setLoadingAddress(true);
      try {
        await supabase.from("addresses").delete().eq("id", id);
        setLoadingAddress(false);
        toast.success("Address deleted successfully");
        fetchAddresses();
      } catch (error) {
        setLoadingAddress(false);
        toast.error("An error occured while deleting address");
      }
    }
  };

  return (
    <>
      {loadingAddress ? (
        <div className="flex items-center justify-center flex-col gap-3">
          <div
            className="inline-block h-[30px] w-[30px] animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-[#305C45]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <span className="text-sm">Loading addresses...</span>
        </div>
      ) : deliveryAddresses.length < 1 ? (
        <p className="text-sm">No delivery addresses added.</p>
      ) : isHome ? (
        deliveryAddresses
          .sort((a, b) => (a.default ? -1 : 1))
          .map((val, index) => (
            <div
              key={index}
              className="flex justify-between items-center max-md:flex-col gap-10 max-md:items-start mt-10"
            >
              <div>
                <p className="opacity-60 ">
                  Address : {val.street}, {val.city} <br /> Contact :{" "}
                  {val.phone_number}
                </p>
              </div>

              <div className="flex gap-3 flex-row  items-center ">
                {val.default && (
                  <button
                    className="  px-2.5 py-1 h-fit  bg-zinc-100 
    rounded text-xs
    text-[#305C45] 
    font-normal "
                  >
                    Default
                  </button>
                )}

                <Dropdown
                  header="Edit"
                  children={[
                    {
                      text: "Edit",
                      onClick: () => {
                        navigate(`/account/profile/edit-address/${val.id}`);
                      },
                      className: "",
                    },
                    {
                      text: "Set as default address",
                      onClick: () => {
                        handleSetDefault(val.id);
                      },
                      className: val.default ? "hidden" : "",
                    },
                    {
                      text: "Remove",
                      onClick: () => {
                        handleRemove(val.id);
                      },
                      className: "text-red-500",
                    },
                  ]}
                />
              </div>
            </div>
          ))
      ) : (
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          {deliveryAddresses
            .sort((a, b) => (a.default ? -1 : 1))
            .map((val, index) => (
              <Radio classNames={{ base: "!gap-5" }} value={val.id} key={index} className="mt-5">
                <div className="flex flex-col gap-4 items-start">
                  <div>
                    <p className="opacity-60 ">
                      Address : {val.address_line_1}, {val.city} <br /> Contact :{" "}
                      {val.phone_number}
                    </p>
                  </div>

                  <div className="flex gap-3 flex-row  items-center ">
                    {val.default && (
                      <button
                        className="  px-2.5 py-1 h-fit  bg-zinc-100 
        rounded text-xs
        text-[#305C45] 
        font-normal "
                      >
                        Default
                      </button>
                    )}

                    <Dropdown
                      header="Edit"
                      isHome={isHome}
                      children={[
                        {
                          text: "Edit",
                          onClick: () => {
                            navigate(`/account/profile/edit-address/${val.id}`);
                          },
                          className: "",
                        },
                        {
                          text: "Set as default address",
                          onClick: () => {
                            handleSetDefault(val.id);
                          },
                          className: val.default ? "hidden" : "",
                        },
                        {
                          text: "Remove",
                          onClick: () => {
                            handleRemove(val.id);
                          },
                          className: "text-red-500",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Radio>
            ))}
        </RadioGroup>
      )}
    </>
  );
};

export default DeliveryAddress;
