import { useEffect, useState } from "react";
import subscriptionPlanService from "../../services/subscriptionPlan";
import "./MembershipPlanModal.css";

function MembershipPlanModal({
    open,
    onClose,
    onSuccess,
    plan,
}) {

    const isEdit = !!plan;

    const [name, setName] = useState("");
    const [durationMonths, setDurationMonths] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!open) return;

        if (plan) {

            setName(plan.name);
            setDurationMonths(plan.durationMonths);

        } else {

            setName("");
            setDurationMonths("");

        }

    }, [open, plan]);

    if (!open) return null;

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setLoading(true);

            const data = {
                name,
                durationMonths: Number(durationMonths),
            };

            if (isEdit) {

                await subscriptionPlanService.update(
                    plan.id,
                    data
                );

            } else {

                await subscriptionPlanService.create(data);

            }

            onSuccess();

        } catch (err) {

            console.error(err);

            alert("Unable to save membership plan.");

        } finally {

            setLoading(false);

        }

    }

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>
                        {isEdit
                            ? "Edit Membership Plan"
                            : "New Membership Plan"}
                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Membership Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Duration (Months)
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={durationMonths}
                            onChange={(e) =>
                                setDurationMonths(
                                    e.target.value
                                )
                            }
                            required
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
                                    ? "Update Plan"
                                    : "Create Plan"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );

}

export default MembershipPlanModal;