import { useEffect, useState } from "react";
import { addToCart } from "../api/cart";

interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
    stock?: number;
    }

    export default function EcommercePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Obtener token directamente
    const token = localStorage.getItem("accessToken");

    // 🔹 Fetch productos
    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/products");

            if (!response.ok) {
            throw new Error("Error cargando productos");
            }

            const data = await response.json();
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    // 🔹 Agregar al carrito
    const handleAddToCart = async (productId: number) => {
        if (!token) {
        alert("Debes iniciar sesión para comprar.");
        return;
        }

        try {
        await addToCart(productId, token);
        alert("Producto agregado al carrito ⚔️");
        } catch (error) {
        alert("Error agregando al carrito.");
        }
    };

    if (loading) {
        return <div className="ecommerce-container">Cargando productos...</div>;
    }

    if (error) {
        return <div className="ecommerce-container">Error: {error}</div>;
    }

    return (
        <div className="ecommerce-container">
        <div className="ecommerce-header">
            <h1 className="ecommerce-title">The Nexus Market</h1>
            <p className="ecommerce-subtitle">
            Equip yourself for glory in the arena.
            </p>
        </div>

        <div className="products-grid">
            {products.slice(0, 16).map((product) => (
            <div key={product.id} className="product-card">
                <div className="product-image">
                <img
                    src={
                    product.image ||
                    "https://via.placeholder.com/300x200?text=Nexus+Item"
                    }
                    alt={product.name}
                />
                </div>

                <div className="product-info">
                <h3>{product.name}</h3>

                <p className="price">${product.price}</p>

                {product.stock !== undefined && product.stock <= 0 ? (
                    <button className="add-btn" disabled>
                    Out of Stock
                    </button>
                ) : (
                    <button
                    className="add-btn"
                    onClick={() => handleAddToCart(product.id)}
                    >
                    Acquire
                    </button>
                )}
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}