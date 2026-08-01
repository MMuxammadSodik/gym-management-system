import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import memberService from "../../services/member";
import MemberModal from "../../components/MemberModal/MemberModal";
import { formatUzPhone } from "../../utils/phoneFormat";

import "./Members.css";

function Members() {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        loadMembers();
    }, []);

    async function loadMembers() {
        try {
            setLoading(true);
            const response = await memberService.getAll();
            // Filter out single-purchase members (only show members with subscription plans)
            const subscriptionMembers = response.filter(
                (member) => member.subscriptionPlanName
            );
            setMembers(subscriptionMembers);
        } catch (err) {
            console.error(err);
            setError("Unable to load members.");
        } finally {
            setLoading(false);
        }
    }

    function handleCreate() {
        setSelectedMember(null);
        setModalOpen(true);
    }

    function handleEdit(member) {
        setSelectedMember(member);
        setModalOpen(true);
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Delete this member?");

        if (!confirmed) return;

        try {
            await memberService.delete(id);
            await loadMembers();
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Unable to delete member.";
            alert(message);
        }
    }

    const filteredMembers = members.filter((member) => {
        const query = search.toLowerCase();
        return (
            member.firstName.toLowerCase().includes(query) ||
            member.lastName.toLowerCase().includes(query) ||
            (member.phone && member.phone.toLowerCase().includes(query)) ||
            (member.subscriptionPlanName &&
                member.subscriptionPlanName.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div className="members-page">
                <div className="members-loading">Loading members...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="members-page">
                <div className="members-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="members-page">
            <div className="members-header">
                <div>
                    <h1>Abonimentlar</h1>
                    <p>Manage gym members and their membership plans.</p>
                </div>

                <button className="primary-btn" onClick={handleCreate}>
                    <FiPlus />
                    New Member
                </button>
            </div>

            <div className="members-toolbar">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="members-table-wrapper">
                <table className="members-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Plan ends</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length ? (
                            filteredMembers.map((member) => (
                                <tr 
                                    key={member.id} 
                                    className="clickable-row"
                                    onClick={() => navigate(`/dashboard/member/${member.id}`)}
                                >
                                    <td>{member.firstName}</td>
                                    <td>{member.lastName}</td>
                                    <td>{member.phone ? formatUzPhone(member.phone) : "—"}</td>
                                    <td>
                                        <span className="plan-badge">
                                            {member.subscriptionPlanName || "1 Kunlik"}
                                        </span>
                                    </td>
                                    <td>
                                        {member.subscriptionEndDate
                                            ? new Date(
                                                  `${member.subscriptionEndDate}T12:00:00`
                                              ).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="actions">
                                        <button
                                            className="icon-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(member);
                                            }}
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(member.id);
                                            }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-members">
                                    No members found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <MemberModal
                open={modalOpen}
                member={selectedMember}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedMember(null);
                }}
                onSuccess={async () => {
                    setModalOpen(false);
                    setSelectedMember(null);
                    await loadMembers();
                }}
            />
        </div>
    );
}

export default Members;
