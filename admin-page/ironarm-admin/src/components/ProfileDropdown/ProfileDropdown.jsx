import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LuChevronDown, LuLogOut } from "react-icons/lu";

import { logout } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

import "./ProfileDropdown.css";

function ProfileDropdown() {

    const navigate = useNavigate();
    const { user } = useAuth();


    const dropdownRef = useRef(null);

    const [open, setOpen] = useState(false);


    useEffect(() => {

        function handleClickOutside(event) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    function handleLogout() {

        logout();

        navigate("/", {
            replace: true,
        });

    }

    return (

        <div
            className="profile-dropdown"
            ref={dropdownRef}
        >

            <button
                className="profile-button"
                onClick={() => setOpen(!open)}
            >

                <div className="profile-avatar">
                    M
                </div>

                <div className="profile-info">

                    <span className="profile-name">
                        {user?.username}
                    </span>

                    <span className="profile-role">
                        {user?.role}
                    </span>

                </div>

                <LuChevronDown />

            </button>

            {open && (

                <div className="dropdown-menu">

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        <LuLogOut />
                        Logout
                    </button>

                </div>

            )}

        </div>

    );

}

export default ProfileDropdown;