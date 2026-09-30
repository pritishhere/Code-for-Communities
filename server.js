import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

const fields = [
  { name: 'Kisumu North', crop: 'Maize · 2.4 ha', status: 'Good', health: 82, color: 'green' },
  { name: 'Nyakach East', crop: 'Sorghum · 1.1 ha', status: 'Watch', health: 61, color: 'amber' },
  { name: 'Ahero Lowlands', crop: 'Beans · 0.8 ha', status: 'Good', health: 76, color: 'green' },
]

const send = (response, status, data) => {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  response.end(JSON.stringify(data))
}

const server = createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/api/health') return send(response, 200, { status: 'online', network: 'BRICS AgriN', sources: 12 })
  if (request.method === 'GET' && request.url === '/api/dashboard') return send(response, 200, {
    fields,
    metrics: { fieldHealth: 82, rainfallMm: 18, soilMoisture: 64, carbonStored: 2.8 },
    advisory: { crop: 'Maize', action: 'Plant a nitrogen-fixing cover crop', cropModel: 'desmodium', yieldImpact: 'up to 18%' },
    weather: { location: 'Kisumu, KE', plantingWindow: 'Saturday morning', forecast: [28, 29, 27, 26, 27, 28, 29] },
    sources: ['Sentinel-2', 'SoilGrids', 'Open-Meteo'],
  })
  if (request.method === 'POST' && request.url === '/api/diagnostics') return send(response, 200, {
    diagnosis: 'Likely maize rust', confidence: 0.87, recommendation: 'Isolate affected leaves and apply copper soap.', model: 'BRICS AgriN crop clinic v0.1',
  })
  if (request.method === 'GET') {
    const requestedPath = request.url === '/' ? '/index.html' : request.url
    const filePath = join(root, 'dist', requestedPath)
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }
    readFile(filePath).then((file) => {
      response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' })
      response.end(file)
    }).catch(() => readFile(join(root, 'dist', 'index.html')).then((file) => {
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.end(file)
    }).catch(() => send(response, 404, { error: 'Frontend build not found. Run npm run build.' })))
    return
  }
  send(response, 404, { error: 'Route not found' })
})

server.listen(8787, '127.0.0.1', () => console.log('Saheli API running at http://127.0.0.1:8787'))
