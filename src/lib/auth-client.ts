// Client-side auth service que usa APIs em vez de Prisma diretamente
export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export class AuthService {
  private static API_BASE = typeof window !== 'undefined' 
    ? '/api' 
    : process.env.VITE_API_URL || 'http://localhost:3000/api';

  static async createUser(data: RegisterData): Promise<User> {
    const response = await fetch(`${this.API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar usuário');
    }

    const result = await response.json();
    return result.user;
  }

  static async loginUser({ email, password }: LoginCredentials): Promise<User | null> {
    const response = await fetch(`${this.API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null; // Credenciais inválidas
      }
      const error = await response.json();
      throw new Error(error.error || 'Erro no login');
    }

    const result = await response.json();
    return result.user;
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.API_BASE}/users/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  static async updateUser(
    id: string,
    data: Partial<Omit<User, "id" | "email" | "createdAt" | "updatedAt">>
  ): Promise<User> {
    const response = await fetch(`${this.API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar usuário');
    }

    const result = await response.json();
    return result.user;
  }

  static async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const response = await fetch(`${this.API_BASE}/users/${id}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao alterar senha');
    }

    return true;
  }
}
