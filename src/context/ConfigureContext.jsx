
import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

export const ConfigureContext = createContext();

export const useConfigure = () => {
  return useContext(ConfigureContext);
};

export const ConfigureProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ConfigureContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </ConfigureContext.Provider>
  );
};

ConfigureProvider.propTypes = {
  children: PropTypes.node,
};
