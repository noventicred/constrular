import { VercelRequest, VercelResponse } from "@vercel/node";

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

    console.log("📝 API Registro - Criando usuário (mockado):", email);

    // Mock user creation
    const user = {
      id: Date.now().toString(),
      email: email,
      full_name: fullName,
      phone: phone || null,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return res.status(201).json({ user });
  } catch (error: any) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
