import { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthService } from "../../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await AuthService.loginUser({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
