export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader("Access-Control-Allow-Origin", "https://oscarmoreno203.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responder preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // SOLO AQUÍ va tu código real:
  try {
    const { registros } = req.body;

    // EJEMPLO de respuesta simple (ajusta a tu lógica real)
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
