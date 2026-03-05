import { useEffect, useState } from "react";

    interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
    }

    export default function EcommercePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos", error);
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    return (
        <div className="ecommerce-container">
        <h1 className="ecommerce-title">Tienda Nexus Battles</h1>

        <div className="products-grid">
            {products.slice(0, 16).map((product) => (
            <div key={product.id} className="product-card">
                <img
                src={product.image || "https://via.placeholder.com/200"}
                alt={product.name}
                />
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <button className="add-btn">Agregar al carrito</button>
            </div>
            ))}
        </div>
        </div>
    );
    }