const { execFileSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const artifactsDir =
  'C:\\Users\\mosta\\.gemini\\antigravity-ide\\brain\\54437fee-d03e-45e5-a70f-021295b83ff9'

function snap(url, filename, width = 390, height = 844) {
  const outFile = path.join(artifactsDir, filename)
  if (fs.existsSync(outFile)) {
    try {
      fs.unlinkSync(outFile)
    } catch (e) {}
  }
  const tempProfile = path.join(os.tmpdir(), 'chrome_m_' + Math.random().toString(36).substring(2))
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${tempProfile}`,
    `--window-size=${width},${height}`,
    `--screenshot=${outFile}`,
    url,
  ]

  console.log(`Snapping: ${filename} from ${url}`)
  try {
    execFileSync(chromePath, args, { timeout: 12000 })
  } catch (e) {}
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true })
  } catch (e) {}

  const exists = fs.existsSync(outFile)
  const size = exists ? fs.statSync(outFile).size : 0
  console.log(`Result: ${filename} exists=${exists} size=${size}`)
  return exists && size > 1000
}

snap('http://localhost:5173/?theme=dark', 'mobile_home_390.png', 390, 844)
snap('http://localhost:5173/profile?theme=dark', 'mobile_profile_390.png', 390, 844)
snap('http://localhost:5173/?theme=light', 'mobile_home_light_390.png', 390, 844)
snap('http://localhost:5173/profile?theme=light', 'mobile_profile_light_390.png', 390, 844)
console.log('ALL_MOBILE_SNAPS_COMPLETE')
