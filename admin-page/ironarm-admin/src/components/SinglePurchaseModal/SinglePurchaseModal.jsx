import { useEffect, useState } from "react";
import "./SinglePurchaseModal.css";

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

const SinglePurchaseModal = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPrice("50,000");
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericPrice = parsePriceInput(price);

    if (!numericPrice || Number.isNaN(Number(numericPrice))) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      // TODO: Call API to save single purchase price
      // For now, just call onSuccess
      onSuccess(numericPrice);
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Unable to save single purchase price.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="single-purchase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Single Purchase Price</h2>

          <button className="close-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Price</label>

            <input
              type="text"
              inputMode="decimal"
              placeholder="50,000"
              value={price}
              onChange={(e) => setPrice(formatPriceInput(e.target.value))}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SinglePurchaseModal;
