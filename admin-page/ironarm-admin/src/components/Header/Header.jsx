import "./Header.css";

import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";

function Header() {

    return (
        <header className="header">

            <div className="header-title">
                Dashboard
            </div>

            <ProfileDropdown />

        </header>
    );

}

export default Header;