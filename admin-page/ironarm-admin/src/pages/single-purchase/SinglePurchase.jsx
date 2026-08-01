import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import memberService from "../../services/member";
import singlePurchaseService from "../../services/singlePurchase";
import MemberModal from "../../components/MemberModal/MemberModal";
import SinglePurchaseModal from "../../components/SinglePurchaseModal/SinglePurchaseModal";
import { formatUzPhone } from "../../utils/phoneFormat";

import "./SinglePurchase.css";

function SinglePurchase() {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [singlePurchaseModalOpen, setSinglePurchaseModalOpen] = useState(false);
    const [singlePurchasePrice, setSinglePurchasePrice] = useState(null);

    useEffect(() => {
        loadMembers();
        loadSinglePurchasePrice();
    }, []);

    async function loadMembers() {
        try {
            setLoading(true);
            const response = await memberService.getAll();
            // Filter only single-purchase members (no subscription plan)
            const singlePurchaseMembers = response.filter(
                (member) => !member.subscriptionPlanName
            );
            setMembers(singlePurchaseMembers);
        } catch (err) {
            console.error(err);
            setError("Unable to load members.");
        } finally {
            setLoading(false);
        }
    }

    async function loadSinglePurchasePrice() {
        try {
            const price = await singlePurchaseService.getPrice();
            setSinglePurchasePrice(price);
        } catch (err) {
            console.error(err);
            setSinglePurchasePrice(50000);
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
            (member.phone && member.phone.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div className="single-purchase-page">
                <div className="single-purchase-loading">Loading members...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="single-purchase-page">
                <div className="single-purchase-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="single-purchase-page">
            <div className="single-purchase-header">
                <div>
                    <h1>1 Kunlik</h1>
                    <p>Manage single-purchase gym members.</p>
                </div>

                <div className="header-buttons">
                    <button className="primary-btn" onClick={handleCreate}>
                        <FiPlus />
                        New Member
                    </button>

                    <button
                        className="single-purchase-btn"
                        onClick={() => setSinglePurchaseModalOpen(true)}
                    >
                        <FiPlus />
                        Configure Price
                    </button>

                    <span className="single-purchase-price">
                        {Number(singlePurchasePrice).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="single-purchase-toolbar">
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

            <div className="single-purchase-table-wrapper">
                <table className="single-purchase-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Plan</th>
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
                                            1 Kunlik
                                        </span>
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
                                <td colSpan="5" className="empty-members">
                                    No single-purchase members found.
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

            <SinglePurchaseModal
                open={singlePurchaseModalOpen}
                onClose={() => setSinglePurchaseModalOpen(false)}
                onSuccess={async (price) => {
                    try {
                        await singlePurchaseService.setPrice(Number(price));
                        setSinglePurchaseModalOpen(false);
                        setSinglePurchasePrice(Number(price));
                        alert(`Single Purchase price is changed to ${Number(price).toLocaleString()}`);
                    } catch (err) {
                        console.error(err);
                        alert("Unable to save single purchase price.");
                    }
                }}
            />
        </div>
    );
}

export default SinglePurchase;
