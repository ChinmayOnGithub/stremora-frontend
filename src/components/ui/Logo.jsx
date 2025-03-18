import { NavLink } from "react-router-dom";

const Logo = () => (
  <div className="flex-1 flex items-center gap-2 sm:gap-3">
    <NavLink
      to="/">
      <img
        src="https://i.ibb.co/fGMbrcL4/video-collection-svgrepo-com.png"
        className="h-12 sm:h-10 w-auto select-none"
        alt="Logo" />
    </NavLink>
    <NavLink
      to="/"
      className="text-2xl font-semibold hidden sm:block text-gray-100 dark:text-white tracking-wider uppercase font-merriweather"
    >
      Stremora
    </NavLink>
  </div>
)

export default Logo;