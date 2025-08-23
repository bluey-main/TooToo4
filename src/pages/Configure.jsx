import { useContext } from "react";
import BtnSmall from "../components/Buttons/BtnSmall";
import { ConfigureContext } from "../context/ConfigureContext";


function Configure() {
  const { configureCategoriesOptions } = useContext(ConfigureContext);
  return (
    <div className=" bg-red-600 max-h-96 h-96">
      <BtnSmall title="Set Categories" onClick={() => configureCategoriesOptions()} />
    </div>
  );
}

export default Configure;
