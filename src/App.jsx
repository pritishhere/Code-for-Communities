import { useEffect, useState } from 'react'
import './App.css'

const fields = [
  { name: 'Kisumu North', crop: 'Maize · 2.4 ha', status: 'Good', health: 82, color: 'green' },
  { name: 'Nyakach East', crop: 'Sorghum · 1.1 ha', status: 'Watch', health: 61, color: 'amber' },
  { name: 'Ahero Lowlands', crop: 'Beans · 0.8 ha', status: 'Good', health: 76, color: 'green' },
]

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [selectedField, setSelectedField] = useState('Kisumu North')
  const [scanOpen, setScanOpen] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [fieldData, setFieldData] = useState(fields)

  useEffect(() => {
    fetch('/api/dashboard').then((response) => response.json()).then((data) => setFieldData(data.fields)).catch(() => {})
  }, [])

  const runDiagnostic = async () => {
    let result = 'Likely maize rust · 87% confidence'
    try {
      const response = await fetch('/api/diagnostics', { method: 'POST' })
      const data = await response.json()
      result = `${data.diagnosis} · ${Math.round(data.confidence * 100)}% confidence`
    } catch {
      // Keep the demo usable when deployed as a static GitHub Pages build.
    }
    setScanOpen(false)
    setScanResult(result)
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><span>Saheli</span><small>FIELD NETWORK</small></div>
        <div className="workspace-label">MY WORKSPACE</div>
        <nav>{['Overview', 'My fields', 'Advisories', 'Crop clinic'].map((item, index) => <button className={activeNav === item ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(item)} key={item}><span className="nav-icon">{['⌂', '▦', '◈', '✚'][index]}</span>{item}{item === 'Advisories' && <span className="nav-count">3</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="network-card"><span className="pulse-dot"></span><div><strong>Network online</strong><small>BRICS AgriN · 12 sources</small></div></div><button className="profile"><span className="avatar">AM</span><span><strong>Amina M.</strong><small>Kisumu, KE</small></span><span className="more">···</span></button></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="crumb">Workspace <span>/</span> <strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♢<i></i></button><button className="help-button">? <span>Help center</span></button></div></header>
        <div className="page-wrap">
          <section className="intro"><div><p className="eyebrow">WEDNESDAY, 30 SEPTEMBER 2026 <span className="live-label"><span></span> LIVE DATA</span></p><h1>Good morning, Amina.</h1><p className="subhead">Your fields are looking steady. Here is what the network sees for the week ahead.</p></div><button className="field-selector"><span className="mini-map">⌖</span><span><small>MONITORING</small><strong>{selectedField}</strong></span><span>⌄</span></button></section>
          <section className="metrics"><Metric label="FIELD HEALTH" value="82" unit="%" icon="⌁" foot="6.4%" /><Metric label="RAINFALL · 7 DAY" value="18" unit="mm" icon="☼" foot="12%" down /><Metric label="SOIL MOISTURE" value="64" unit="%" icon="◒" foot="3.1%" /><Metric label="CARBON STORED" value="2.8" unit="t/ha" icon="✦" foot="0.4t" /></section>
          <section className="dashboard-grid"><div className="panel field-panel"><PanelTitle eyebrow="SATELLITE MONITORING" title="Field performance" action="View all fields" /><div className="field-list">{fieldData.map((field) => <button className={selectedField === field.name ? 'field-row selected' : 'field-row'} key={field.name} onClick={() => setSelectedField(field.name)}><span className={`field-thumb ${field.color}`}>{field.name === 'Kisumu North' ? '▧' : field.name === 'Nyakach East' ? '▤' : '▥'}</span><span className="field-info"><strong>{field.name}</strong><small>{field.crop}</small></span><span className="field-score"><strong>{field.health}%</strong><span className={`status ${field.color}`}>{field.status}</span></span><span className="sparkline">╱╲╱╱╲</span></button>)}</div><div className="data-source"><span className="source-icon">◌</span><span><strong>Data refreshed 14 minutes ago</strong><small>Sentinel-2 · SoilGrids · Open-Meteo</small></span><span className="verified">✓ Verified</span></div></div>
            <div className="panel advisory-panel"><PanelTitle eyebrow="REGENERATIVE PLAYBOOK" title="One thing to do now" badge="✦ AI INSIGHT" /><div className="advisory-art"><div className="sun"></div><div className="hill hill-back"></div><div className="hill hill-front"></div><span className="plant plant-one">⌁</span><span className="plant plant-two">⌁</span></div><div className="advisory-copy"><div className="advisory-tag">FOR KISUMU NORTH <span>·</span> THIS WEEK</div><h3>Plant a nitrogen-fixing cover crop</h3><p>Short rains are arriving late. Intercropping with <em>desmodium</em> can protect your soil and improve maize yields by up to 18%.</p><div className="advisory-meta"><span>◷ 4 min read</span><button className="dark-button">See the playbook <span>→</span></button></div></div></div>
          </section>
          <section className="lower-grid"><div className="panel timeline-panel"><PanelTitle eyebrow="NEXT 7 DAYS" title="Weather window" action="⌖ Kisumu, KE" /><div className="weather-chart"><div className="chart-grid"><span>30°</span><span>25°</span><span>20°</span></div><div className="rain-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div className="days">{['WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE'].map((day, index) => <span key={day}>{day}<strong>{[28, 29, 27, 26, 27, 28, 29][index]}°</strong></span>)}</div></div><div className="weather-note"><span>◒</span><p><strong>Best planting window: Saturday morning</strong><small>Light rain expected after 16:00. Soil moisture will be ideal for sowing.</small></p></div></div><div className="panel clinic-panel"><PanelTitle eyebrow="CROP CLINIC" title="See something unusual?" badge="✚" /><p>Upload a photo and our diagnostic model will look for early signs of disease, pests, or nutrient stress.</p>{scanResult ? <div className="scan-result"><span className="result-check">✓</span><span><strong>{scanResult}</strong><small>Suggested: isolate affected leaves and apply copper soap.</small></span><button onClick={() => setScanResult(null)}>×</button></div> : <button className="upload-button" onClick={() => setScanOpen(true)}><span>↑</span> Upload a crop photo <small>JPG, PNG up to 10MB</small></button>}</div></section>
          <footer><span><strong>Saheli</strong> is a digital public good for resilient food systems.</span><span>Built on open data · <a href="https://github.com/pritishhere/Code-for-Communities" target="_blank" rel="noreferrer">View network status ↗</a></span></footer>
        </div>
      </section>
      {scanOpen && <div className="modal-backdrop" onClick={() => setScanOpen(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setScanOpen(false)}>×</button><div className="modal-icon">✚</div><h2>Crop clinic</h2><p>Choose a photo of the affected leaf or plant. Saheli will compare it against the shared BRICS AgriN model library.</p><div className="dropzone"><span>↑</span><strong>Drop image here</strong><small>or choose from your device</small></div><button className="dark-button full" onClick={runDiagnostic}>Run diagnostic demo <span>→</span></button></div></div>}
    </main>
  )
}

function Metric({ label, value, unit, icon, foot, down }) { return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><strong>{value}<span>{unit}</span></strong><div className="metric-foot"><span className={down ? 'trend-down' : 'trend-up'}>{down ? '↘' : '↗'} {foot}</span> {down ? 'below seasonal average' : 'vs last month'}</div></div> }
function PanelTitle({ eyebrow, title, action, badge }) { return <div className="panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action && <button className="text-button">{action} <span>→</span></button>}{badge && <span className="spark-badge">{badge}</span>}</div> }

export default App
