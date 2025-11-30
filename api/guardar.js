export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader("Access-Control-Allow-Origin", "https://oscarmoreno203.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responder preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Asegurar que venga en formato JSON
  let body;
  try {
    // Vercel a veces NO parsea req.body automáticamente
    if (!req.body || typeof req.body === "string") {
      body = JSON.parse(req.body || "{}");
    } else {
      body = req.body;
    }
  } catch (e) {
    return res.status(400).json({ ok: false, error: "JSON inválido" });
  }

  const { registros } = body;

  if (!registros) {
    return res.status(400).json({
      ok: false,
      error: "No se enviaron registros",
      bodyRecibido: body
    });
  }

  // Aquí va tu lógica de guardar en GitHub...
  // Por ahora solo respondemos
  return res.status(200).json({
    ok: true,
    mensaje: "Registros recibidos correctamente",
    registros
  });
}
