import { Link } from "react-router-dom";

import "./NotFound.css";

function NotFound() {

    return (

        <section className="not-found">

            <h1>404</h1>

            <h2>Page Not Found</h2>

            <p>
                The page you're looking for doesn't exist.
            </p>

            <Link
                to="/dashboard"
                className="back-button"
            >
                Back to Dashboard
            </Link>

        </section>

    );

}

export default NotFound;