import { useEffect, useState } from "react";
import memberService from "../../services/member";
import "./Dashboard.css";

function Dashboard() {
    const [todayMembers, setTodayMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTodayMembers();
    }, []);

    const fetchTodayMembers = async () => {
        try {
            setLoading(true);
            const members = await memberService.getMembersCreatedToday();
            setTodayMembers(members);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-section">
                {loading ? (
                    <p>Loading...</p>
                ) : todayMembers.length === 0 ? (
                    <p>No members created today.</p>
                ) : (
                    <div className="members-list">
                        <h2>Today's New Members</h2>
                        {todayMembers.map((member) => (
                            <div key={member.id} className="member-card">
                                <div className="member-info">
                                    <h3>{member.firstName} {member.lastName}</h3>
                                    <p>Plan: {member.subscriptionPlanName || "1 Kunlik"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;