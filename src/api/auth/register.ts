import { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthService } from "../../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ error: "Email, senha e nome completo são obrigatórios" });
    }

    const user = await AuthService.createUser({
      email,
      password,
      fullName,
      phone,
    });

    return res.status(201).json({ user });
  } catch (error: any) {
    console.error("Erro no registro:", error);

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email já está em uso" });
    }

    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
