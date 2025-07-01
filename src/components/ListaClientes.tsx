import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { Cliente } from "../types/Cliente";

export const ListaClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getClientes();
      setClientes(data);
    } catch (err) {
      setError(
        "Erro ao carregar clientes. Verifique se o backend está rodando."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este cliente? Esta ação é irreversível."
      )
    ) {
      try {
        await apiService.deleteCliente(id);
        await carregarClientes();
      } catch (err) {
        setError("Erro ao excluir cliente");
        console.error(err);
      }
    }
  };

  const formatarData = (data: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return data;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Clientes Cadastrados
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/clientes/novo")}
          sx={{ px: 3, py: 1.5 }}
        >
          Novo Cliente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {clientes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum cliente cadastrado
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Data de Nascimento</TableCell>
                <TableCell>Gênero</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell>
                    {formatarData(cliente.dataNascimento as any)}
                  </TableCell>
                  <TableCell>
                    {cliente.genero === "MASCULINO"
                      ? "Masculino"
                      : cliente.genero === "FEMININO"
                      ? "Feminino"
                      : "Outros"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={cliente.status === "ATIVO" ? "success" : "warning"}
                      size="small"
                      onClick={async () => {
                        await apiService.updateCliente(cliente.id!.toString(), {
                          status:
                            cliente.status === "ATIVO" ? "INATIVO" : "ATIVO",
                        });
                        await carregarClientes();
                      }}
                    >
                      {cliente.status === "ATIVO" ? "Ativo" : "Inativo"}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/clientes/${cliente.id}`)}
                      title="Ver detalhes"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(cliente.id!.toString())}
                      title="Excluir"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
