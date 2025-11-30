export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://oscarmoreno203.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { registros } = req.body || {};

    if (!registros) {
      return res.status(400).json({
        ok: false,
        error: "No se enviaron registros",
        bodyRecibido: req.body
      });
    }

    // Respuesta de prueba
    return res.status(200).json({
      ok: true,
      mensaje: "Registros recibidos correctamente",
      registros
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}

