import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../services/api";
import { Endereco } from "../types/Cliente";

const validationSchema = Yup.object({
  tipo: Yup.string().required("Tipo é obrigatório"),
  cep: Yup.string().required("CEP é obrigatório"),
  logradouro: Yup.string().required("Logradouro é obrigatório"),
  numero: Yup.string().required("Número é obrigatório"),
  bairro: Yup.string().required("Bairro é obrigatório"),
  cidade: Yup.string().required("Cidade é obrigatória"),
  estado: Yup.string().required("Estado é obrigatório"),
});

export const FormularioEndereco: React.FC = () => {
  const navigate = useNavigate();
  const { id: clienteId, enderecoId } = useParams<{
    id: string;
    enderecoId?: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<Endereco | null>(null);

  // Carregar endereço se estiver editando
  useEffect(() => {
    if (enderecoId) {
      const carregarEndereco = async () => {
        try {
          setLoading(true);
          const data = await apiService.getEndereco(enderecoId);
          setEndereco(data);
        } catch (err) {
          setError("Erro ao carregar endereço");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      carregarEndereco();
    }
  }, [enderecoId]);

  const formik = useFormik({
    initialValues: {
      tipo: endereco?.tipo || "COBRANCA",
      cep: endereco?.cep || "",
      logradouro: endereco?.logradouro || "",
      numero: endereco?.numero || "",
      complemento: endereco?.complemento || "",
      bairro: endereco?.bairro || "",
      cidade: endereco?.cidade || "",
      estado: endereco?.estado || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const dadosEndereco = {
          clienteId: clienteId!,
          tipo: values.tipo as "COBRANCA" | "ENTREGA",
          cep: values.cep,
          logradouro: values.logradouro,
          numero: values.numero,
          complemento: values.complemento,
          bairro: values.bairro,
          cidade: values.cidade,
          estado: values.estado,
        };

        if (enderecoId) {
          // Atualizar endereço existente
          await apiService.updateEndereco(enderecoId, dadosEndereco);
        } else {
          // Criar novo endereço
          await apiService.createEndereco(dadosEndereco);
        }

        // Mostrar mensagem de sucesso
        alert(
          enderecoId
            ? "Endereço atualizado com sucesso!"
            : "Endereço cadastrado com sucesso!"
        );

        // Redirecionar para detalhes do cliente
        navigate(`/clientes/${clienteId}`);
      } catch (err: any) {
        setError(err.message || "Erro ao salvar endereço");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading && !endereco) {
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
    <Box
      component={Paper}
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 600,
          color: (theme) => theme.palette.primary.main,
        }}
      >
        {endereco ? "Editar Endereço" : "Novo Endereço"}
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Endereço</InputLabel>
              <Select
                name="tipo"
                value={formik.values.tipo}
                onChange={formik.handleChange}
                error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                label="Tipo de Endereço"
              >
                <MenuItem value="COBRANCA">Cobrança</MenuItem>
                <MenuItem value="ENTREGA">Entrega</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="cep"
              name="cep"
              label="CEP"
              value={formik.values.cep}
              onChange={formik.handleChange}
              error={formik.touched.cep && Boolean(formik.errors.cep)}
              helperText={formik.touched.cep && formik.errors.cep}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              id="logradouro"
              name="logradouro"
              label="Logradouro"
              value={formik.values.logradouro}
              onChange={formik.handleChange}
              error={
                formik.touched.logradouro && Boolean(formik.errors.logradouro)
              }
              helperText={formik.touched.logradouro && formik.errors.logradouro}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="numero"
              name="numero"
              label="Número"
              value={formik.values.numero}
              onChange={formik.handleChange}
              error={formik.touched.numero && Boolean(formik.errors.numero)}
              helperText={formik.touched.numero && formik.errors.numero}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="complemento"
              name="complemento"
              label="Complemento (opcional)"
              value={formik.values.complemento}
              onChange={formik.handleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="bairro"
              name="bairro"
              label="Bairro"
              value={formik.values.bairro}
              onChange={formik.handleChange}
              error={formik.touched.bairro && Boolean(formik.errors.bairro)}
              helperText={formik.touched.bairro && formik.errors.bairro}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="cidade"
              name="cidade"
              label="Cidade"
              value={formik.values.cidade}
              onChange={formik.handleChange}
              error={formik.touched.cidade && Boolean(formik.errors.cidade)}
              helperText={formik.touched.cidade && formik.errors.cidade}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="estado"
              name="estado"
              label="Estado"
              value={formik.values.estado}
              onChange={formik.handleChange}
              error={formik.touched.estado && Boolean(formik.errors.estado)}
              helperText={formik.touched.estado && formik.errors.estado}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(`/clientes/${clienteId}`)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : endereco ? (
              "Atualizar"
            ) : (
              "Cadastrar"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
