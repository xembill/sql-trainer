// Rana SQL Trainer — bulut kayıt (Rana'nın cihazından veriyi alıp KV'ye yazar)
// Vercel KV (Upstash) ortam değişkenleri gerekir: KV_REST_API_URL, KV_REST_API_TOKEN
module.exports = async (req, res) => {
  try {
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'POST bekleniyor' }); return; }

    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const tok = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !tok) {
      res.status(200).json({ ok: false, reason: 'KV bağlanmamış (Vercel Storage → Upstash for Redis oluştur)' });
      return;
    }

    const data = (req.body && typeof req.body === 'object') ? req.body : JSON.parse(req.body || '{}');
    data.receivedAt = new Date().toISOString();

    const auth = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
    const r = await fetch(url, {
      method: 'POST', headers: auth,
      body: JSON.stringify(['SET', 'rana:snapshot', JSON.stringify(data)])
    });
    const j = await r.json();
    await fetch(url, { method: 'POST', headers: auth, body: JSON.stringify(['INCR', 'rana:updates']) }).catch(() => {});

    res.status(200).json({ ok: j && j.result === 'OK' });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
};
