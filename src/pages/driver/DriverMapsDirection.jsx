
import { AccountButtonOutline } from "../../components/Buttons/AccountButtons";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';

const DriverMapsDirection = ({ from, waypoints }) => {
  const handleOpenGoogleMaps = () => {
    try {
      const waypointsStr = waypoints
        .map((waypoint) => waypoint.join(","))
        .join("/");
      const url = `https://www.google.com/maps/dir/${from}/${waypointsStr}`;
      window.open(url);
    } catch (err) {
      toast.error("Error opening Google Maps, Kindly refresh the page.");
    }
  };

  return (
    <div>
      <button onClick={handleOpenGoogleMaps}></button>

      <AccountButtonOutline
        text="Open Google Maps"
        onClick={handleOpenGoogleMaps}
      />
    </div>
  );
};

DriverMapsDirection.propTypes = {
  from: PropTypes.string,
  waypoints: PropTypes.array,
};

export default DriverMapsDirection;
