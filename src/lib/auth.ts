import bcrypt from "bcryptjs";
import { prisma } from "./db";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  street: string | null;
  number: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  fullName: string;
  phone?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async createUser(data: RegisterData): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        phone: data.phone,
      },
    });

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async loginUser({
    email,
    password,
  }: LoginCredentials): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async updateUser(
    id: string,
    data: Partial<Omit<User, "id" | "email" | "createdAt" | "updatedAt">>
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return false;
    }

    const isCurrentPasswordValid = await this.comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return false;
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    await prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    return true;
  }
}
