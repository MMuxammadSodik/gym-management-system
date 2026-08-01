import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { FaCalendarAlt, FaCalendarDay, FaCheckCircle, FaChartBar } from "react-icons/fa";

import memberService from "../../services/member";
import visitTrackingService from "../../services/visitTracking";
import { formatUzPhone } from "../../utils/phoneFormat";

import "./MemberDetail.css";

function MemberDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [visitStats, setVisitStats] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingVisit, setAddingVisit] = useState(false);

    useEffect(() => {
        loadMember();
        loadVisitStats();
        loadVisits();
    }, [id]);

    async function loadMember() {
        try {
            setLoading(true);
            const response = await memberService.getById(id);
            setMember(response);
        } catch (err) {
            console.error(err);
            setError("Unable to load member details.");
        } finally {
            setLoading(false);
        }
    }

    async function loadVisitStats() {
        try {
            const response = await visitTrackingService.getStats(id);
            setVisitStats(response);
        } catch (err) {
            console.error(err);
        }
    }

    async function loadVisits() {
        try {
            const response = await visitTrackingService.getByMemberId(id);
            setVisits(response);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAddVisit() {
        try {
            setAddingVisit(true);
            await visitTrackingService.addVisit(id, {});
            await loadVisitStats();
            await loadVisits();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Unable to add visit.");
        } finally {
            setAddingVisit(false);
        }
    }

    if (loading) {
        return (
            <div className="member-detail-page">
                <div className="member-detail-loading">Loading member details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="member-detail-page">
                <div className="member-detail-error">{error}</div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="member-detail-page">
                <div className="member-detail-error">Member not found.</div>
            </div>
        );
    }

    return (
        <div className="member-detail-page">
            <div className="member-detail-header">
                <button className="back-btn" onClick={() => navigate("/dashboard/members")}>
                    <FiArrowLeft />
                    Back to Members
                </button>
            </div>

            <div className="member-detail-layout">
                <div className="visit-tracking-section">
                    <div className="section-header">
                        <h2>Visit Tracking System</h2>
                        <button 
                            className="add-visit-btn"
                            onClick={handleAddVisit}
                            disabled={!visitStats?.canVisitToday || addingVisit}
                        >
                            <FiPlus />
                            {addingVisit ? "Adding..." : "Add Visit"}
                        </button>
                    </div>

                    {!visitStats ? (
                        <div className="no-stats">Loading visit statistics...</div>
                    ) : (
                        <>
                            <div className="visit-stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon"><FaCalendarAlt /></div>
                                    <div className="stat-content">
                                        <span className="stat-label">Days Left Overall</span>
                                        <span className="stat-value">
                                            {visitStats.remainingVisits === Number.MAX_SAFE_INTEGER 
                                                ? "Unlimited" 
                                                : visitStats.remainingVisits}
                                        </span>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon"><FaCalendarDay /></div>
                                    <div className="stat-content">
                                        <span className="stat-label">Days Left This Month</span>
                                        <span className="stat-value">
                                            {visitStats.remainingVisitsThisMonth === Number.MAX_SAFE_INTEGER 
                                                ? "Unlimited" 
                                                : visitStats.remainingVisitsThisMonth}
                                        </span>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon"><FaCheckCircle /></div>
                                    <div className="stat-content">
                                        <span className="stat-label">Total Attended</span>
                                        <span className="stat-value">{visitStats.totalVisits}</span>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon"><FaChartBar /></div>
                                    <div className="stat-content">
                                        <span className="stat-label">Attended This Month</span>
                                        <span className="stat-value">{visitStats.visitsThisMonth}</span>
                                    </div>
                                </div>
                            </div>

                            {!visitStats.canVisitToday && (
                                <div className="visit-warning">
                                    {visitStats.optionType === "EVERY_DAY" 
                                        ? "Already visited today or subscription expired"
                                        : "Monthly visit limit reached"}
                                </div>
                            )}

                            <div className="recent-visits-section">
                                <h3>Recent Visits</h3>
                                {visits.length > 0 ? (
                                    <div className="visits-list">
                                        {visits.slice(0, 10).map((visit) => (
                                            <div key={visit.id} className="visit-item">
                                                <span className="visit-date">
                                                    {new Date(`${visit.visitDate}T12:00:00`).toLocaleDateString()}
                                                </span>
                                                <span className="visit-time">
                                                    {new Date(visit.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-visits">No visits recorded yet.</div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="member-info-sidebar">
                    <div className="member-info-card">
                        <div className="member-avatar">
                            <span className="avatar-initials">
                                {member.firstName?.[0]}{member.lastName?.[0]}
                            </span>
                        </div>
                        <h2 className="member-name">{member.firstName} {member.lastName}</h2>
                        <p className="member-phone">{member.phone ? formatUzPhone(member.phone) : "—"}</p>

                        <div className="subscription-info">
                            <h3>Subscription</h3>
                            <div className="plan-badge">{member.subscriptionPlanName}</div>
                            {member.subscriptionPlanOptionType && (
                                <div className="option-badge">{member.subscriptionPlanOptionType.replace(/_/g, ' ')}</div>
                            )}
                            {member.subscriptionPlanOptionPrice && (
                                <div className="price-badge">{Number(member.subscriptionPlanOptionPrice).toLocaleString()} UZS</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberDetail;
