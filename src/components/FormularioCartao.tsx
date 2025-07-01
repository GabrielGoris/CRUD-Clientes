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
import InputMask from "react-input-mask";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../services/api";
import { CartaoCredito } from "../types/Cliente";

const validationSchema = Yup.object({
  numero: Yup.string().required("Número do cartão é obrigatório"),
  nomeTitular: Yup.string().required("Nome do titular é obrigatório"),
  dataValidade: Yup.string().required("Data de validade é obrigatória"),
  bandeira: Yup.string().required("Bandeira é obrigatória"),
  cvv: Yup.string().required("CVV é obrigatório"),
});

export const FormularioCartao: React.FC = () => {
  const navigate = useNavigate();
  const { id: clienteId, cartaoId } = useParams<{
    id: string;
    cartaoId?: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartao, setCartao] = useState<CartaoCredito | null>(null);

  // Carregar cartão se estiver editando
  useEffect(() => {
    if (cartaoId) {
      const carregarCartao = async () => {
        try {
          setLoading(true);
          const data = await apiService.getCartao(cartaoId);
          setCartao(data);
        } catch (err) {
          setError("Erro ao carregar cartão");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      carregarCartao();
    }
  }, [cartaoId]);

  const formik = useFormik({
    initialValues: {
      numero: cartao?.numero || "",
      nomeTitular: cartao?.nomeTitular || "",
      dataValidade: cartao?.dataValidade || "",
      bandeira: cartao?.bandeira || "VISA",
      cvv: cartao?.cvv || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const dadosCartao = {
          clienteId: clienteId!,
          numero: values.numero,
          nomeTitular: values.nomeTitular,
          dataValidade: values.dataValidade,
          bandeira: values.bandeira as "VISA" | "MASTERCARD" | "ELO" | "AMEX",
          cvv: values.cvv,
        };

        if (cartaoId) {
          // Atualizar cartão existente
          await apiService.updateCartao(cartaoId, dadosCartao);
        } else {
          // Criar novo cartão
          await apiService.createCartao(dadosCartao);
        }

        // Mostrar mensagem de sucesso
        alert(
          cartaoId
            ? "Cartão atualizado com sucesso!"
            : "Cartão cadastrado com sucesso!"
        );

        // Redirecionar para detalhes do cliente
        navigate(`/clientes/${clienteId}`);
      } catch (err: any) {
        setError(err.message || "Erro ao salvar cartão");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading && !cartao) {
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
        {cartao ? "Editar Cartão" : "Novo Cartão"}
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <InputMask
              mask="9999 9999 9999 9999"
              value={formik.values.numero}
              onChange={formik.handleChange}
              disabled={false}
            >
              {() => (
                <TextField
                  fullWidth
                  id="numero"
                  name="numero"
                  label="Número do Cartão"
                  error={formik.touched.numero && Boolean(formik.errors.numero)}
                  helperText={formik.touched.numero && formik.errors.numero}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Bandeira</InputLabel>
              <Select
                name="bandeira"
                value={formik.values.bandeira}
                onChange={formik.handleChange}
                error={
                  formik.touched.bandeira && Boolean(formik.errors.bandeira)
                }
                label="Bandeira"
              >
                <MenuItem value="VISA">Visa</MenuItem>
                <MenuItem value="MASTERCARD">Mastercard</MenuItem>
                <MenuItem value="ELO">Elo</MenuItem>
                <MenuItem value="AMEX">American Express</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="nomeTitular"
              name="nomeTitular"
              label="Nome do Titular"
              value={formik.values.nomeTitular}
              onChange={formik.handleChange}
              error={
                formik.touched.nomeTitular && Boolean(formik.errors.nomeTitular)
              }
              helperText={
                formik.touched.nomeTitular && formik.errors.nomeTitular
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputMask
              mask="99/99"
              value={formik.values.dataValidade}
              onChange={formik.handleChange}
              disabled={false}
            >
              {() => (
                <TextField
                  fullWidth
                  id="dataValidade"
                  name="dataValidade"
                  label="Validade (MM/AA)"
                  error={
                    formik.touched.dataValidade &&
                    Boolean(formik.errors.dataValidade)
                  }
                  helperText={
                    formik.touched.dataValidade && formik.errors.dataValidade
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputMask
              mask="999"
              value={formik.values.cvv}
              onChange={formik.handleChange}
              disabled={false}
            >
              {() => (
                <TextField
                  fullWidth
                  id="cvv"
                  name="cvv"
                  label="CVV"
                  error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                  helperText={formik.touched.cvv && formik.errors.cvv}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              )}
            </InputMask>
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
            ) : cartao ? (
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
