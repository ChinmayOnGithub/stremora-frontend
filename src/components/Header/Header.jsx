// import React from 'react'
import { NavLink } from "react-router-dom"

function Header() {
  return (
    <div className="w-full bg-gray-400">
      <ul className="flex justify-center gap-3 m-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${isActive ? "text-orange-700" : "text-gray-700"} lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
            }>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user"
            className={({ isActive }) =>
              `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${isActive ? "text-orange-700" : "text-gray-700"} lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
            }>
            User
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${isActive ? "text-orange-700" : "text-gray-700"} lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
            }>
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${isActive ? "text-orange-700" : "text-gray-700"} lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
            }>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${isActive ? "text-orange-700" : "text-gray-700"} lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
            }>
            Upload
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Header