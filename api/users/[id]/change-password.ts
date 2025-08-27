import { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthService } from "../../../src/lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const { currentPassword, newPassword } = req.body;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Senhas são obrigatórias" });
  }

  try {
    const success = await AuthService.changePassword(id, currentPassword, newPassword);
    
    if (!success) {
      return res.status(400).json({ error: "Senha atual incorreta" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
