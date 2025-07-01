import { Cliente, Endereco, CartaoCredito } from '../types/Cliente';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Clientes
  async getClientes(): Promise<Cliente[]> {
    return this.request<Cliente[]>('/clientes');
  }

  async getCliente(id: string): Promise<Cliente> {
    return this.request<Cliente>(`/clientes/${id}`);
  }

  async createCliente(cliente: Omit<Cliente, 'id' | 'ativo'> & { senha: string }): Promise<Cliente> {
    return this.request<Cliente>('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  }

  async updateCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    return this.request<Cliente>(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  }

  async deleteCliente(id: string): Promise<void> {
    return this.request<void>(`/clientes/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteClientePermanente(id: string): Promise<void> {
    return this.request<void>(`/clientes/${id}/permanente`, {
      method: 'DELETE',
    });
  }

  // Endereços
  async getEnderecos(clienteId: string): Promise<Endereco[]> {
    return this.request<Endereco[]>(`/enderecos/cliente/${clienteId}`);
  }

  async getEndereco(id: string): Promise<Endereco> {
    return this.request<Endereco>(`/enderecos/${id}`);
  }

  async createEndereco(endereco: Omit<Endereco, 'id' | 'dataCadastro' | 'dataAtualizacao'>): Promise<Endereco> {
    return this.request<Endereco>('/enderecos', {
      method: 'POST',
      body: JSON.stringify(endereco),
    });
  }

  async updateEndereco(id: string, endereco: Partial<Endereco>): Promise<Endereco> {
    return this.request<Endereco>(`/enderecos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(endereco),
    });
  }

  async deleteEndereco(id: string): Promise<void> {
    return this.request<void>(`/enderecos/${id}`, {
      method: 'DELETE',
    });
  }

  // Cartões
  async getCartoes(clienteId: string): Promise<CartaoCredito[]> {
    return this.request<CartaoCredito[]>(`/cartoes/cliente/${clienteId}`);
  }

  async getCartao(id: string): Promise<CartaoCredito> {
    return this.request<CartaoCredito>(`/cartoes/${id}`);
  }

  async createCartao(cartao: Omit<CartaoCredito, 'id' | 'dataCadastro' | 'dataAtualizacao'>): Promise<CartaoCredito> {
    return this.request<CartaoCredito>('/cartoes', {
      method: 'POST',
      body: JSON.stringify(cartao),
    });
  }

  async updateCartao(id: string, cartao: Partial<CartaoCredito>): Promise<CartaoCredito> {
    return this.request<CartaoCredito>(`/cartoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cartao),
    });
  }

  async deleteCartao(id: string): Promise<void> {
    return this.request<void>(`/cartoes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 