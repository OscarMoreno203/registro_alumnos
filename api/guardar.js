export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { registros } = req.body;

    const token = process.env.GITHUB_TOKEN;
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const filePath = process.env.GITHUB_FILE;

    // URL de la API del archivo
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${filePath}`;

    // 1. Obtener el SHA del archivo actual
    const existente = await fetch(apiUrl, {
        headers: { Authorization: `token ${token}` }
    }).then(r => r.json());

    const sha = existente.sha;

    // 2. Codificar nuevo contenido en Base64
    const content = Buffer.from(JSON.stringify(registros, null, 2)).toString("base64");

    // 3. Hacer commit al repositorio
    const resultado = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Actualizado desde la página web",
            content,
            sha
        })
    }).then(r => r.json());

    return res.status(200).json({ ok: true, resultado });
}
