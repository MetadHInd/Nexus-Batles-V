const API_URL = "http://localhost:3000";

export const addToCart = async (productId: number, token: string) => {
    const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        productId,
        quantity: 1,
        }),
    });

    if (!response.ok) {
        throw new Error("Error agregando al carrito");
    }

    return response.json();
};

export const getCart = async (token: string) => {
    const response = await fetch(`${API_URL}/cart`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error obteniendo carrito");
    }

    return response.json();
    };

    export const confirmOrder = async (token: string) => {
    const response = await fetch(`${API_URL}/orders/confirm`, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error confirmando compra");
    }

    return response.json();
};