import { useEffect, useMemo, useState } from "react";
import memberService from "../../services/member";
import subscriptionPlanService from "../../services/subscriptionPlan";
import subscriptionPlanOptionService from "../../services/subscriptionPlanOption";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import {
    formatUzPhone,
    phoneForSubmit,
} from "../../utils/phoneFormat";
import {
    computePlanEndDate,
    formatPlanDate,
} from "../../utils/planDates";
import "./MemberModal.css";

function MemberModal({ open, onClose, onSuccess, member }) {
    const isEdit = !!member;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("+998 ");
    const [isSinglePurchase, setIsSinglePurchase] = useState(true);
    const [subscriptionPlanId, setSubscriptionPlanId] = useState("");
    const [subscriptionPlanOptionId, setSubscriptionPlanOptionId] = useState("");
    const [active, setActive] = useState(true);
    const [plans, setPlans] = useState([]);
    const [planOptions, setPlanOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        subscriptionPlanService.getAll()
            .then(setPlans)
            .catch((err) => {
                console.error(err);
                alert("Unable to load membership plans.");
            });
    }, [open]);

    useEffect(() => {
        if (!open) return;

        if (member) {
            setFirstName(member.firstName);
            setLastName(member.lastName);
            setPhone(formatUzPhone(member.phone || ""));
            setSubscriptionPlanId(member.subscriptionPlanId || "");
            setSubscriptionPlanOptionId(member.subscriptionPlanOptionId || "");
            setActive(member.active !== null ? member.active : true);
            setIsSinglePurchase(false);
        } else {
            setFirstName("");
            setLastName("");
            setPhone("+998 ");
            setSubscriptionPlanId("");
            setSubscriptionPlanOptionId("");
            setActive(true);
            setIsSinglePurchase(true);
        }
    }, [open, member]);

    useEffect(() => {
        if (!open || !subscriptionPlanId) {
            setPlanOptions([]);
            setSubscriptionPlanOptionId("");
            return;
        }

        subscriptionPlanOptionService.getByPlan(subscriptionPlanId)
            .then(setPlanOptions)
            .catch((err) => {
                console.error(err);
                alert("Unable to load subscription plan options.");
            });
    }, [open, subscriptionPlanId]);

    const selectedPlan = useMemo(
        () => plans.find((plan) => plan.id === subscriptionPlanId),
        [plans, subscriptionPlanId]
    );

    const planPeriod = useMemo(() => {
        if (!selectedPlan) {
            return null;
        }

        let startDate;

        if (isEdit) {
            if (member.subscriptionStartDate) {
                startDate = new Date(`${member.subscriptionStartDate}T12:00:00`);
            } else if (member.createdAt) {
                startDate = new Date(member.createdAt);
            } else {
                startDate = new Date();
            }
        } else {
            startDate = new Date();
        }

        const endDate = computePlanEndDate(
            startDate,
            selectedPlan.durationMonths
        );

        return {
            startDate,
            endDate,
            durationMonths: selectedPlan.durationMonths,
        };
    }, [selectedPlan, isEdit, member]);

    if (!open) return null;

    function handlePhoneChange(e) {
        setPhone(formatUzPhone(e.target.value));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!isSinglePurchase && !subscriptionPlanId) {
            alert("Please select a membership plan.");
            return;
        }

        const digitsOnly = phone.replace(/\D/g, "").replace(/^998/, "");
        if (digitsOnly.length > 0 && digitsOnly.length < 9) {
            alert("Enter a complete phone number (+998 XX XXX XX XX) or leave it empty.");
            return;
        }

        try {
            setLoading(true);

            const data = {
                firstName,
                lastName,
                phone: phoneForSubmit(phone),
                isSinglePurchase,
                subscriptionPlanId: isSinglePurchase ? null : subscriptionPlanId,
                subscriptionPlanOptionId: isSinglePurchase ? null : (subscriptionPlanOptionId || null),
                active: isSinglePurchase ? null : active,
            };

            if (isEdit) {
                await memberService.update(member.id, data);
            } else {
                await memberService.create(data);
            }

            onSuccess();
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Unable to save member.";
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{isEdit ? "Edit Member" : "New Member"}</h2>
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
                        <label>Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="+998 90 123 45 67"
                            inputMode="numeric"
                            autoComplete="tel"
                        />
                    </div>

                    <div className="form-group">
                        <label>Single Purchase</label>
                        <ToggleSwitch
                            checked={isSinglePurchase}
                            onChange={(e) => setIsSinglePurchase(e.target.checked)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Membership Plan</label>
                        <select
                            value={subscriptionPlanId}
                            onChange={(e) => setSubscriptionPlanId(e.target.value)}
                            disabled={isSinglePurchase}
                            required={!isSinglePurchase}
                        >
                            <option value="">Select a plan</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} ({plan.durationMonths}{" "}
                                    {plan.durationMonths === 1 ? "month" : "months"})
                                </option>
                            ))}
                        </select>
                        {planPeriod && (
                            <p className="plan-period-hint">
                                Starts{" "}
                                <strong>{formatPlanDate(planPeriod.startDate)}</strong>
                                {" · "}
                                Ends{" "}
                                <strong>{formatPlanDate(planPeriod.endDate)}</strong>
                                {" "}
                                ({planPeriod.durationMonths}{" "}
                                {planPeriod.durationMonths === 1 ? "month" : "months"})
                            </p>
                        )}
                    </div>

                    {planOptions.length > 0 && (
                        <div className="form-group">
                            <label>Subscription Option</label>
                            <select
                                value={subscriptionPlanOptionId}
                                onChange={(e) => setSubscriptionPlanOptionId(e.target.value)}
                            >
                                <option value="">Select an option (optional)</option>
                                {planOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.optionType} - {parseFloat(option.price).toFixed(2)} UZS
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {!isSinglePurchase && selectedPlan && (
                        <div className="form-group">
                            <label>Active Status</label>
                            <ToggleSwitch
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                        </div>
                    )}

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
                                    ? "Update Member"
                                    : "Create Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MemberModal;
