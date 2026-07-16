// Rana SQL Trainer — bulut okuma (Dayı, Rana'nın son durumunu çeker)
module.exports = async (req, res) => {
  try {
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }

    const url = process.env.KV_REST_API_URL;
    const tok = process.env.KV_REST_API_TOKEN;
    if (!url || !tok) {
      res.status(200).json({ ok: false, reason: 'KV bağlanmamış' });
      return;
    }
    const auth = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };

    const r = await fetch(url, { method: 'POST', headers: auth, body: JSON.stringify(['GET', 'rana:snapshot']) });
    const j = await r.json();
    let updates = 0;
    try { const c = await (await fetch(url, { method: 'POST', headers: auth, body: JSON.stringify(['GET', 'rana:updates']) })).json(); updates = c.result || 0; } catch (e) {}

    if (j && j.result) {
      res.status(200).json({ ok: true, snapshot: JSON.parse(j.result), updates });
    } else {
      res.status(200).json({ ok: false, reason: 'Rana henüz veri göndermemiş' });
    }
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
};
