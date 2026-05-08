export default async function handler(req, res) {
  try {
    const upstream = await fetch(
      'https://www.oref.org.il/WarningMessages/alert/alerts.json',
      {
        headers: { referer: 'https://www.oref.org.il/' },
        cache: 'no-store',
      }
    )
    const text = await upstream.text()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.status(upstream.status).send(text)
  } catch {
    res.status(502).json({ error: 'upstream error' })
  }
}
