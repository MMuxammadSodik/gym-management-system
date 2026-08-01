import { useEffect, useState } from "react";
import subscriptionPlanOptionService from "../../services/subscriptionPlanOption";
import "./MembershipPlanOptionModal.css";

const OPTION_TYPE_LABELS = {
  EVERY_DAY: "Every Day (Har Kunlik)",
  SKIP_DAY: "Skip Day (Cherezden)",
};

function formatPriceInput(value) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [integerPart = "", ...decimalParts] = cleaned.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (decimalParts.length === 0) {
    return formattedInteger;
  }

  const decimalPart = decimalParts.join("").slice(0, 2);
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

function parsePriceInput(value) {
  return value.replace(/,/g, "");
}

const MembershipOptionModal = ({
  open,
  onClose,
  onSuccess,
  membershipPlan
}) => {  
  const [optionType, setOptionType] = useState("EVERY_DAY");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setOptionType("EVERY_DAY");
    setPrice("");
  }, [open]);

  const duration = membershipPlan?.durationMonths ?? 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericPrice = parsePriceInput(price);

    if (!numericPrice || Number.isNaN(Number(numericPrice))) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      await subscriptionPlanOptionService.create({
        subscriptionPlanId: membershipPlan.id,
        optionType,
        price: Number(numericPrice),
      });

      onSuccess();
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Unable to save membership option.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="membership-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Membership Options</h2>

          <button className="close-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Membership Plan</label>

            <input value={membershipPlan?.name ?? ""} disabled />
          </div>

          <div className="form-group">
            <label>Membership Type</label>

            <div className="radio-group">
              <label className="radio-item">
                <input  
                  type="radio"
                  value="EVERY_DAY"
                  checked={optionType === "EVERY_DAY"}
                  onChange={(e) => setOptionType(e.target.value)}
                />

                <span>Every Day (Har Kunlik)</span>
              </label>

              <label className="radio-item">
                <input
                  type="radio"
                  value="SKIP_DAY"
                  checked={optionType === "SKIP_DAY"}
                  onChange={(e) => setOptionType(e.target.value)}
                />

                <span>Skip Day (Cherezden)</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Price</label>

            <input
              type="text"
              inputMode="decimal"
              placeholder="600,000"
              value={price}
              onChange={(e) => setPrice(formatPriceInput(e.target.value))}
              required
            />
          </div>

          <div className="summary-card">
            <h3>Membership Summary</h3>

            <div className="summary-row">
              <span>Duration</span>
              <strong>
                {duration} Month{duration !== 1 ? "s" : ""}
              </strong>
            </div>

            <div className="summary-row total">
              <span>Membership Type</span>
              <strong>{OPTION_TYPE_LABELS[optionType]}</strong>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Option"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipOptionModal;
