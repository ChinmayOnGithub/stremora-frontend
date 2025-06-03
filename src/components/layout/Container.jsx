import React from "react";
import PropTypes from "prop-types";

const Container = ({ children, className = "" }) => (
  <div className={"container mx-auto px-4 sm:px-6 lg:px-8 w-full " + className}>
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Container; 