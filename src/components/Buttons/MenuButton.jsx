/* eslint-disable react/prop-types */
import { FaPersonBooth } from "react-icons/fa";

export function MenuButton({
  active,
  icon = <FaPersonBooth className="text-xl " />,
  title = "My Profile",
  setactive = () => {},
  index = 0,
}) {
  return (
    <div
      className={`w-full justify-start items-start inline-flex border-l-[.6rem] ${
        active
          ? "border-l-[#305C45] bg-zinc-100 text-neutral-700"
          : "border-l-transparent bg-white text-neutral-500"
      }  cursor-pointer hover:text-neutral-800`}
      onClick={() => setactive(index)}
    >
      <div className="w-[354px] pl-[30px] py-6 justify-start items-center gap-4 flex ">
        {icon}
        <div className="text-base font-medium font-['League Spartan'] capitalize">
          {title}
        </div>
      </div>
    </div>
  );
}
