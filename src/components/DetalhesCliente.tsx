import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add, ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../services/api";
import { Cliente, Endereco, CartaoCredito } from "../types/Cliente";

export const DetalhesCliente: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);

  const carregarCliente = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCliente(id);
      setCliente(data);
    } catch (err) {
      setError("Erro ao carregar cliente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarEnderecosECartoes = async () => {
    if (!id) return;
    try {
      const enderecosData = await apiService.getEnderecos(id);
      setEnderecos(enderecosData);
      const cartoesData = await apiService.getCartoes(id);
      setCartoes(cartoesData);
    } catch (err) {
      setError("Erro ao carregar endereços/cartões");
    }
  };

  useEffect(() => {
    carregarCliente();
    carregarEnderecosECartoes();
  }, [id]);

  const handleDelete = async () => {
    if (!cliente) return;

    if (window.confirm("Tem certeza que deseja deletar este cliente?")) {
      try {
        await apiService.deleteCliente(String(cliente.id));
        navigate("/clientes");
      } catch (err) {
        setError("Erro ao deletar cliente");
        console.error(err);
      }
    }
  };

  const handleDeleteEndereco = async (enderecoId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este endereço?")) {
      try {
        await apiService.deleteEndereco(enderecoId);
        alert("Endereço deletado com sucesso!");
        await carregarEnderecosECartoes();
      } catch (err) {
        setError("Erro ao deletar endereço");
        console.error(err);
      }
    }
  };

  const handleDeleteCartao = async (cartaoId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este cartão?")) {
      try {
        await apiService.deleteCartao(cartaoId);
        alert("Cartão deletado com sucesso!");
        await carregarEnderecosECartoes();
      } catch (err) {
        setError("Erro ao deletar cartão");
        console.error(err);
      }
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
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

  if (!cliente) {
    return <Alert severity="error">Cliente não encontrado</Alert>;
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate("/clientes")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Detalhes do Cliente
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Deletar
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ flex: 1, minWidth: 340, maxWidth: "50%" }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Informações Pessoais
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.nome}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                CPF
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.cpf}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Telefone
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.telefone}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Data de Nascimento
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatarData(cliente.dataNascimento)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Gênero
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.genero === "MASCULINO"
                  ? "Masculino"
                  : cliente.genero === "FEMININO"
                  ? "Feminino"
                  : "Outros"}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.status === "ATIVO" ? "Ativo" : "Inativo"}
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, minWidth: 340, maxWidth: "50%" }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Endereços
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={() =>
                  navigate(`/clientes/${cliente.id}/enderecos/novo`)
                }
              >
                Adicionar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {enderecos.length === 0 ? (
              <Typography color="text.secondary">
                Nenhum endereço cadastrado.
              </Typography>
            ) : (
              <List sx={{ flex: 1, maxHeight: 300, overflowY: "auto" }}>
                {enderecos.map((endereco) => (
                  <ListItem
                    key={endereco.id}
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() =>
                            navigate(
                              `/clientes/${cliente.id}/enderecos/${endereco.id}`
                            )
                          }
                          color="primary"
                          size="small"
                          title="Editar"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteEndereco(endereco.id)}
                          color="error"
                          size="small"
                          title="Excluir"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={
                        <span
                          style={{ wordBreak: "break-word" }}
                        >{`${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`}</span>
                      }
                      secondary={
                        <span
                          style={{ wordBreak: "break-word" }}
                        >{`CEP: ${endereco.cep} | Tipo: ${endereco.tipo}`}</span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
        <Box sx={{ flex: 1, minWidth: 340, maxWidth: "50%" }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Cartões de Crédito
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={() => navigate(`/clientes/${cliente.id}/cartoes/novo`)}
              >
                Adicionar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {cartoes.length === 0 ? (
              <Typography color="text.secondary">
                Nenhum cartão cadastrado.
              </Typography>
            ) : (
              <List sx={{ flex: 1, maxHeight: 300, overflowY: "auto" }}>
                {cartoes.map((cartao) => (
                  <ListItem
                    key={cartao.id}
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() =>
                            navigate(
                              `/clientes/${cliente.id}/cartoes/${cartao.id}`
                            )
                          }
                          color="primary"
                          size="small"
                          title="Editar"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteCartao(cartao.id)}
                          color="error"
                          size="small"
                          title="Excluir"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={
                        <span
                          style={{ wordBreak: "break-word" }}
                        >{`**** **** **** ${cartao.numero.slice(-4)} - ${
                          cartao.nomeTitular
                        }`}</span>
                      }
                      secondary={
                        <span
                          style={{ wordBreak: "break-word" }}
                        >{`Validade: ${cartao.dataValidade}`}</span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
