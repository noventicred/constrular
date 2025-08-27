// API de usuário por ID para Vercel
export default async function handler(req, res) {
  // Headers CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    switch (req.method) {
      case "GET":
        console.log("👤 API Usuário - Retornando dados mockados para ID:", id);

        // Mock user data
        const user = {
          id: id,
          email: "usuario@teste.com",
          full_name: "Usuário Teste",
          phone: "(11) 99999-9999",
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return res.status(200).json({ user });

      case "PUT":
        console.log("👤 API Usuário - Atualizando usuário (mockado):", id);

        const updatedUser = {
          id: id,
          ...req.body,
          updated_at: new Date().toISOString(),
        };

        return res.status(200).json({ user: updatedUser });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de usuários:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
}
