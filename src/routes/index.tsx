import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ListaClientes } from "../components/ListaClientes";
import { FormularioCliente } from "../components/FormularioCliente";
import { DetalhesCliente } from "../components/DetalhesCliente";
import { FormularioEndereco } from "../components/FormularioEndereco";
import { FormularioCartao } from "../components/FormularioCartao";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clientes" replace />} />
      <Route path="/clientes" element={<ListaClientes />} />
      <Route path="/clientes/novo" element={<FormularioCliente />} />
      <Route path="/clientes/editar/:id" element={<FormularioCliente />} />
      <Route path="/clientes/:id" element={<DetalhesCliente />} />

      {/* Rotas para endereços */}
      <Route
        path="/clientes/:id/enderecos/novo"
        element={<FormularioEndereco />}
      />
      <Route
        path="/clientes/:id/enderecos/:enderecoId"
        element={<FormularioEndereco />}
      />

      {/* Rotas para cartões */}
      <Route path="/clientes/:id/cartoes/novo" element={<FormularioCartao />} />
      <Route
        path="/clientes/:id/cartoes/:cartaoId"
        element={<FormularioCartao />}
      />
    </Routes>
  );
};
