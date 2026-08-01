import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";

import staffService from "../../services/staff";
import StaffModal from "../../components/StaffModal/StaffModal";

import "./Staff.css";

function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    useEffect(() => {
        loadStaff();
    }, []);

    async function loadStaff() {
        try {
            setLoading(true);
            const response = await staffService.getAll();
            setStaffList(response);
        } catch (err) {
            console.error(err);
            setError("Unable to load staff members.");
        } finally {
            setLoading(false);
        }
    }

    function handleCreate() {
        setSelectedStaff(null);
        setModalOpen(true);
    }

    function handleEdit(staff) {
        setSelectedStaff(staff);
        setModalOpen(true);
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Delete this staff member?");

        if (!confirmed) return;

        try {
            await staffService.delete(id);
            await loadStaff();
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Unable to delete staff member.";
            alert(message);
        }
    }

    const filteredStaff = staffList.filter((staff) => {
        const query = search.toLowerCase();
        return (
            staff.firstName.toLowerCase().includes(query) ||
            staff.lastName.toLowerCase().includes(query) ||
            staff.username.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="staff-page">
                <div className="staff-loading">Loading Staff...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="staff-page">
                <div className="staff-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="staff-page">
            <div className="staff-header">
                <div>
                    <h1>Staff</h1>
                    <p>Manage staff accounts with STAFF role.</p>
                </div>

                <button className="primary-btn" onClick={handleCreate}>
                    <FiPlus />
                    New Staff
                </button>
            </div>

            <div className="staff-toolbar">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search staff..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="staff-table-wrapper">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Created</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStaff.length ? (
                            filteredStaff.map((staff) => (
                                <tr key={staff.id}>
                                    <td>{staff.firstName}</td>
                                    <td>{staff.lastName}</td>
                                    <td>{staff.username}</td>
                                    <td>
                                        <span className="role-badge">{staff.role}</span>
                                    </td>
                                    <td>
                                        {new Date(staff.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="actions">
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleEdit(staff)}
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => handleDelete(staff.id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-staff">
                                    No staff members found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <StaffModal
                open={modalOpen}
                staff={selectedStaff}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedStaff(null);
                }}
                onSuccess={async () => {
                    setModalOpen(false);
                    setSelectedStaff(null);
                    await loadStaff();
                }}
            />
        </div>
    );
}

export default Staff;
