
import PropTypes from 'prop-types';

import { useState } from "react";
// import PropTypes from 'prop-types';

const CustomerDeliveries = ({isDelivered}) => {
    const [fetchAllOrders, setFetchAllOrders] = useState(isDelivered)
  return (
    <div>CustomerDeliveries</div>
  )
}

CustomerDeliveries.propTypes = {
  isDelivered: PropTypes.bool,
};

CustomerDeliveries.propTypes = {
  isDelivered: PropTypes.bool,
};

export default CustomerDeliveries
