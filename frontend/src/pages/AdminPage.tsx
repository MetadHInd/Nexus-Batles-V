import { useState } from "react";
import AdminHeroForm from "../components/AdminHeroForm";
import "../styles/admin.css";
import { isAdmin } from "../hooks/useAuth";

export default function AdminPage() {

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  //
  return (
    <div className="admin-bg">

      <div className="admin-overlay">

        <div className="admin-banner">
          <h1 className="admin-title">Panel del Administrador</h1>
          <p className="admin-subtitle">Control total sobre los héroes</p>

          <button
            className="admin-btn"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            ✦ Agregar Nuevo Héroe
          </button>
        </div>

        {mostrarFormulario && <AdminHeroForm />}

      </div>
    </div>
  );
}