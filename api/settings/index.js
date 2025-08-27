// API de configurações para Vercel
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

  // Mock data para configurações da loja
  const mockSettings = {
    whatsapp_number: "5511999999999",
    store_name: "ConstrutorPro",
    store_email: "contato@construtorpro.com",
    free_shipping_threshold: "199.00",
    default_shipping_cost: "29.90",
    store_address: "Rua das Construções, 123 - São Paulo, SP",
    store_phone: "(11) 3456-7890",
    business_hours: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
    payment_methods: ["PIX", "Cartão de Crédito", "Cartão de Débito", "Boleto"],
    delivery_areas: ["São Paulo Capital", "Grande São Paulo", "ABC Paulista"],
    social_media: {
      facebook: "https://facebook.com/construtorpro",
      instagram: "https://instagram.com/construtorpro",
      youtube: "https://youtube.com/construtorpro",
    },
    seo: {
      meta_title: "ConstrutorPro - Material de Construção Online",
      meta_description:
        "Loja completa de material de construção com os melhores preços. Cimento, tijolos, tintas, ferramentas e muito mais.",
      keywords: "material de construção, cimento, tijolo, tinta, ferramentas",
    },
    updated_at: new Date().toISOString(),
  };

  try {
    switch (req.method) {
      case "GET":
        console.log("⚙️ API Settings - Retornando configurações mockadas");
        return res.status(200).json({ settings: mockSettings });

      case "PUT":
        console.log("⚙️ API Settings - Atualizando configurações (mockado)");

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const updatedData = JSON.parse(body);
            const updatedSettings = {
              ...mockSettings,
              ...updatedData,
              updated_at: new Date().toISOString(),
            };

            return res.status(200).json({
              settings: updatedSettings,
              message: "Configurações atualizadas com sucesso",
            });
          } catch (error) {
            console.error("Erro ao parsear dados:", error);
            return res.status(400).json({ error: "Dados inválidos" });
          }
        });
        break;

      case "POST":
        console.log("⚙️ API Settings - Criando configurações (mockado)");

        let postBody = "";
        req.on("data", (chunk) => {
          postBody += chunk.toString();
        });

        req.on("end", () => {
          try {
            const newData = JSON.parse(postBody);
            const newSettings = {
              ...mockSettings,
              ...newData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            return res.status(201).json({
              settings: newSettings,
              message: "Configurações criadas com sucesso",
            });
          } catch (error) {
            console.error("Erro ao parsear dados:", error);
            return res.status(400).json({ error: "Dados inválidos" });
          }
        });
        break;

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de configurações:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
