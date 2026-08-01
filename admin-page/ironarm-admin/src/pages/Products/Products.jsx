import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";

import productService from "../../services/product";
import ProductModal from "../../components/ProductModal/ProductModal";

import "./Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            setLoading(true);
            const response = await productService.getAll();
            setProducts(response);
        } catch (err) {
            console.error(err);
            setError("Unable to load products.");
        } finally {
            setLoading(false);
        }
    }

    function handleCreate() {
        setSelectedProduct(null);
        setModalOpen(true);
    }

    function handleEdit(product) {
        setSelectedProduct(product);
        setModalOpen(true);
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Delete this product?");

        if (!confirmed) return;

        try {
            await productService.delete(id);
            await loadProducts();
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Unable to delete product.";
            alert(message);
        }
    }

    const filteredProducts = products.filter((product) => {
        const query = search.toLowerCase();
        return (
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div className="products-page">
                <div className="products-loading">Loading Products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-page">
                <div className="products-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage gym products and inventory.</p>
                </div>

                <button className="primary-btn" onClick={handleCreate}>
                    <FiPlus />
                    New Product
                </button>
            </div>

            <div className="products-toolbar">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="products-table-wrapper">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length ? (
                            filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description || "-"}</td>
                                    <td>${parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.stockQuantity}</td>
                                    <td className="actions">
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-products">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ProductModal
                open={modalOpen}
                product={selectedProduct}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSuccess={async () => {
                    setModalOpen(false);
                    setSelectedProduct(null);
                    await loadProducts();
                }}
            />
        </div>
    );
}

export default Products;
