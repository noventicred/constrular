import { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthService } from "../../src/lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    switch (req.method) {
      case "GET":
        const user = await AuthService.getUserById(id);
        if (!user) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res.status(200).json({ user });

      case "PUT":
        const updatedUser = await AuthService.updateUser(id, req.body);
        return res.status(200).json({ user: updatedUser });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de usuários:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
