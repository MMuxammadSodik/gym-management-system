import { useEffect, useState } from "react";
import staffService from "../../services/staff";
import "./StaffModal.css";

function StaffModal({ open, onClose, onSuccess, staff }) {
    const isEdit = !!staff;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (staff) {
            setFirstName(staff.firstName);
            setLastName(staff.lastName);
            setUsername(staff.username);
            setPassword("");
        } else {
            setFirstName("");
            setLastName("");
            setUsername("");
            setPassword("");
        }
    }, [open, staff]);

    if (!open) return null;

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            const data = {
                firstName,
                lastName,
                username,
            };

            if (password) {
                data.password = password;
            }

            if (isEdit) {
                await staffService.update(staff.id, data);
            } else {
                if (!password) {
                    alert("Password is required for new staff members.");
                    return;
                }
                data.password = password;
                await staffService.create(data);
            }

            onSuccess();
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Unable to save staff member.";
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{isEdit ? "Edit Staff Member" : "New Staff Member"}</h2>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Password{isEdit ? " (leave blank to keep current)" : ""}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!isEdit}
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEdit
                                    ? "Update Staff"
                                    : "Create Staff"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StaffModal;
