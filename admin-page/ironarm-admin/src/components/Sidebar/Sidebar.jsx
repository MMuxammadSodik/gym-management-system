import { NavLink } from "react-router-dom";

import logo from "../../assets/iron-arm-logo.jpg";
import { useAuth } from "../../context/AuthContext";

import {
  LuLayoutDashboard,
  LuUsers,
  LuCalendarDays,
  LuShield,
  LuPackage,
  LuMenu,
} from "react-icons/lu";

import "./Sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
      <div className="sidebar-top">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <LuMenu size={22} />
        </button>

        <div className="sidebar-logo">
          <img src={logo} alt="IronArm Logo" />
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end>
          <LuLayoutDashboard className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/members">
          <LuUsers className="nav-icon" />
          <span className="nav-text">Abonimentlar</span>
        </NavLink>

        <NavLink to="/dashboard/single-purchase">
          <LuCalendarDays className="nav-icon" />
          <span className="nav-text">1 Kunlik</span>
        </NavLink>

        <NavLink to="/dashboard/membership-plans">
          <LuCalendarDays className="nav-icon" />
          <span className="nav-text">Membership Plans</span>
        </NavLink>

        <NavLink to="/dashboard/products">
          <LuPackage className="nav-icon" />
          <span className="nav-text">Products</span>
        </NavLink>

        {role === "ADMIN" && (
          <NavLink to="/dashboard/staff">
            <LuShield className="nav-icon" />
            <span className="nav-text">Staff</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <p>IRON ARM GYM</p>
        <span>Version 1.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;
