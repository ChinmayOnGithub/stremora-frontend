// import React from 'react'
import PropTypes from 'prop-types';


function Banner({ children, className = "" }) {
  // padding should be given exclusively using the className
  return (
    <div
      className={`relative bg-gray-200 dark:bg-gray-800 rounded-[5px] min-w-[350px] ${className}`}>
      {children}
    </div>
  )
}

Banner.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  // isClosable: PropTypes.bool,
  // onClose: PropTypes.func,
  // position: PropTypes.oneOf(['top-center', 'top-left', 'top-right', 'bottom-center']),
  // variant: PropTypes.oneOf(['default', 'info', 'warning', 'success', 'error'])
};

export default Banner;