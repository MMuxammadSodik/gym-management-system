import { useState, useEffect } from "react";
import productService from "../../services/product";
import "./ProductModal.css";

function ProductModal({ open, onClose, onSuccess, product }) {
    const isEdit = !!product;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("0");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price || "");
            setStockQuantity(product.stockQuantity?.toString() || "0");
        } else {
            setName("");
            setDescription("");
            setPrice("");
            setStockQuantity("0");
        }
    }, [open, product]);

    if (!open) return null;

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            alert("Please enter a product name.");
            return;
        }

        if (!price || parseFloat(price) <= 0) {
            alert("Please enter a valid price.");
            return;
        }

        if (!stockQuantity || parseInt(stockQuantity) < 0) {
            alert("Please enter a valid stock quantity.");
            return;
        }

        try {
            setLoading(true);

            const data = {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                stockQuantity: parseInt(stockQuantity),
            };

            if (isEdit) {
                await productService.update(product.id, data);
            } else {
                await productService.create(data);
            }

            onSuccess();
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Unable to save product.";
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{isEdit ? "Edit Product" : "New Product"}</h2>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                min="0"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                required
                            />
                        </div>
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
                                    ? "Update Product"
                                    : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductModal;
