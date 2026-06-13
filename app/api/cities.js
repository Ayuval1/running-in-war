export default async function handler(req, res) {
  try {
    const upstream = await fetch(
      'https://www.oref.org.il/Shared/Ajax/GetCities.aspx?lang=he',
      { headers: { referer: 'https://www.oref.org.il/' } }
    )
    const text = await upstream.text()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(upstream.status).send(text)
  } catch {
    res.status(502).json({ error: 'upstream error' })
  }
}
