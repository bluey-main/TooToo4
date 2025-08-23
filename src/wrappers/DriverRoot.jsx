import { Outlet } from "react-router";
import DriverProvider from "../context/DriverContext";

const DriverRoot = () => {
  return (
    <DriverProvider>
      <Outlet />
    </DriverProvider>
  );
};

export default DriverRoot;