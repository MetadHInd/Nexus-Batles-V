import { useEffect, useState } from "react";
import { getCart, confirmOrder } from "../api/cart";

interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    }

    export default function CartPage() {
    const token = localStorage.getItem("accessToken");

    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchCart = async () => {
        try {
            const data = await getCart(token);
            setItems(data);
        } catch (error) {
            console.error("Error cargando carrito");
        } finally {
            setLoading(false);
        }
        };

        fetchCart();
    }, [token]);

    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleConfirm = async () => {
        if (!token) {
        alert("Debes iniciar sesión");
        return;
        }

        try {
        await confirmOrder(token);
        alert("Compra confirmada ⚔️");
        setItems([]);
        } catch (error) {
        alert("Error confirmando compra");
        }
    };

    if (loading) {
        return <div className="ecommerce-container">Cargando carrito...</div>;
    }

    return (
        <div className="ecommerce-container">
        <h1 className="ecommerce-title">Your Arsenal</h1>

        {items.length === 0 ? (
            <p>No tienes productos en el carrito.</p>
        ) : (
            <>
            <div className="cart-list">
                {items.map((item) => (
                <div key={item.productId} className="cart-item">
                    <div>
                    <h3>{item.name}</h3>
                    <p>
                        ${item.price} x {item.quantity}
                    </p>
                    </div>
                    <div>
                    <strong>${item.price * item.quantity}</strong>
                    </div>
                </div>
                ))}
            </div>

            <div className="cart-total">
                <h2>Total: ${total}</h2>
                <button className="add-btn" onClick={handleConfirm}>
                Confirm Purchase
                </button>
            </div>
            </>
        )}
        </div>
    );
}