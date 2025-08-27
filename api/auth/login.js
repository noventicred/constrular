// CommonJS version for Vercel compatibility
const { VercelRequest, VercelResponse } = require("@vercel/node");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    console.log("🔐 API Login - Autenticando usuário (mockado):", email);

    // Mock authentication - aceita qualquer email/senha para demonstração
    const user = {
      id: Date.now().toString(),
      email: email,
      full_name: "Usuário Teste",
      phone: "(11) 99999-9999",
      is_admin: email.includes("admin"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
