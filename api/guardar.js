export default async function handler(req, res) {
  // CORS: permitir cualquier origen temporalmente (ajusta luego si quieres limitar)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { registros } = req.body;
    if (!Array.isArray(registros)) {
      return res.status(400).json({ error: "Body inválido: se espera { registros: [...] }" });
    }

    const token = process.env.GITHUB_TOKEN;
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const filePath = process.env.GITHUB_FILE || "registros.json";

    if (!token || !user || !repo) {
      console.log("Faltan variables de entorno", { token: !!token, user, repo });
      return res.status(500).json({ error: "Variables de entorno GITHUB_ faltantes" });
    }

    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${filePath}`;

    // Verificar si existe el archivo (obtener sha)
    const headResp = await fetch(apiUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    });

    let sha = null;
    if (headResp.ok) {
      const headJson = await headResp.json();
      sha = headJson.sha || null;
      console.log("Archivo existente sha:", sha);
    } else {
      // Si 404 -> vamos a crear el archivo (sha se queda null)
      console.log("Archivo no existe (o no accesible):", headResp.status, await headResp.text());
    }

    const contentBase64 = Buffer.from(JSON.stringify(registros, null, 2)).toString("base64");

    const body = {
      message: "Actualizado desde la página web",
      content: contentBase64,
      // sólo incluir sha si existe
      ...(sha ? { sha } : {}),
      committer: { name: "Web API", email: "noreply@example.com" }
    };

    const putResp = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const putJson = await putResp.json();
    console.log("PUT result:", putResp.status, putJson);

    if (!putResp.ok) {
      return res.status(500).json({ error: "GitHub API error", details: putJson });
    }

    return res.status(200).json({ ok: true, resultado: putJson });
  } catch (err) {
    console.error("Error en handler:", err);
    return res.status(500).json({ error: "internal", message: err.message || String(err) });
  }
}
