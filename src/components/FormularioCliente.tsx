import React from "react";
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
} from "@mui/material";
import InputMask from "react-input-mask";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../services/api";
import { Cliente } from "../types/Cliente";

export const FormularioCliente: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cliente, setCliente] = React.useState<Cliente | null>(null);

  // Carregar cliente se estiver editando
  React.useEffect(() => {
    if (id) {
      const carregarCliente = async () => {
        try {
          setLoading(true);
          const data = await apiService.getCliente(id);
          setCliente(data);
        } catch (err) {
          setError("Erro ao carregar cliente");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      carregarCliente();
    }
  }, [id]);

  // Schema de validação condicional
  const validationSchema = React.useMemo(() => {
    const baseSchema = {
      nome: Yup.string().required("Nome é obrigatório"),
      cpf: Yup.string()
        .required("CPF é obrigatório")
        .length(14, "CPF inválido"),
      email: Yup.string()
        .email("Email inválido")
        .required("Email é obrigatório"),
      telefone: Yup.string().required("Telefone é obrigatório"),
      dataNascimento: Yup.string().required("Data de nascimento é obrigatória"),
    };

    if (id) {
      // Editando - senha opcional
      return Yup.object({
        ...baseSchema,
        senha: Yup.string().optional(),
        confirmacaoSenha: Yup.string().optional(),
      });
    } else {
      // Criando - senha obrigatória
      return Yup.object({
        ...baseSchema,
        senha: Yup.string()
          .min(8, "A senha deve ter no mínimo 8 caracteres")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
          )
          .required("Senha é obrigatória"),
        confirmacaoSenha: Yup.string()
          .oneOf([Yup.ref("senha")], "As senhas devem ser iguais")
          .required("Confirmação de senha é obrigatória"),
      });
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      nome: cliente?.nome || "",
      cpf: cliente?.cpf || "",
      email: cliente?.email || "",
      telefone: cliente?.telefone || "",
      senha: "",
      confirmacaoSenha: "",
      dataNascimento: cliente?.dataNascimento || "",
      status: cliente?.status || "ATIVO",
      genero: cliente?.genero || "OUTROS",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const dadosCliente = {
          nome: values.nome,
          cpf: values.cpf,
          email: values.email,
          telefone: values.telefone,
          dataNascimento: values.dataNascimento,
          status: values.status,
          genero: values.genero,
        };

        if (id) {
          // Atualizar cliente existente (sem senha)
          await apiService.updateCliente(id, dadosCliente);
        } else {
          // Criar novo cliente (com senha)
          await apiService.createCliente({
            ...dadosCliente,
            senha: values.senha,
          });
        }

        // Mostrar mensagem de sucesso
        alert(
          id
            ? "Cliente atualizado com sucesso!"
            : "Cliente cadastrado com sucesso!"
        );

        // Redirecionar para a lista de clientes
        navigate("/clientes");
      } catch (err: any) {
        setError(err.message || "Erro ao salvar cliente");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading && !cliente) {
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
        {cliente ? "Editar Cliente" : "Novo Cliente"}
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
            <TextField
              fullWidth
              id="nome"
              name="nome"
              label="Nome Completo"
              value={formik.values.nome}
              onChange={formik.handleChange}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputMask
              mask="999.999.999-99"
              value={formik.values.cpf}
              onChange={formik.handleChange}
              disabled={false}
            >
              {() => (
                <TextField
                  fullWidth
                  id="cpf"
                  name="cpf"
                  label="CPF"
                  error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                  helperText={formik.touched.cpf && formik.errors.cpf}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputMask
              mask="(99) 99999-9999"
              value={formik.values.telefone}
              onChange={formik.handleChange}
              disabled={false}
            >
              {() => (
                <TextField
                  fullWidth
                  id="telefone"
                  name="telefone"
                  label="Telefone"
                  error={
                    formik.touched.telefone && Boolean(formik.errors.telefone)
                  }
                  helperText={formik.touched.telefone && formik.errors.telefone}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              )}
            </InputMask>
          </Grid>

          {!cliente && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="senha"
                  name="senha"
                  label="Senha"
                  type="password"
                  value={formik.values.senha}
                  onChange={formik.handleChange}
                  error={formik.touched.senha && Boolean(formik.errors.senha)}
                  helperText={formik.touched.senha && formik.errors.senha}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="confirmacaoSenha"
                  name="confirmacaoSenha"
                  label="Confirmar Senha"
                  type="password"
                  value={formik.values.confirmacaoSenha}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmacaoSenha &&
                    Boolean(formik.errors.confirmacaoSenha)
                  }
                  helperText={
                    formik.touched.confirmacaoSenha &&
                    formik.errors.confirmacaoSenha
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="dataNascimento"
              name="dataNascimento"
              label="Data de Nascimento"
              type="date"
              value={formik.values.dataNascimento}
              onChange={formik.handleChange}
              error={
                formik.touched.dataNascimento &&
                Boolean(formik.errors.dataNascimento)
              }
              helperText={
                formik.touched.dataNascimento && formik.errors.dataNascimento
              }
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              id="genero"
              name="genero"
              label="Gênero"
              value={formik.values.genero}
              onChange={formik.handleChange}
              SelectProps={{ native: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTROS">Outros</option>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              id="status"
              name="status"
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              SelectProps={{ native: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </TextField>
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
            onClick={() => navigate("/clientes")}
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
            ) : cliente ? (
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
