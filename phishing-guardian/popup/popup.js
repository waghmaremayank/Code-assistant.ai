let urlEl = document.querySelector("#currentURL")
let riskVal = document.querySelector("#riskValue")
let statusText = document.querySelector("#statusText")
let entropyVal = document.querySelector("#entropyVal")
let subsVal = document.querySelector("#subsVal")
let lenVal = document.querySelector("#lenVal")
let mlVal = document.querySelector("#mlVal")
let punyVal = document.querySelector("#punyVal")
let hostVal = document.querySelector("#hostVal")
let panel = document.querySelector("#detailsPanel")
let openBtn = document.querySelector("#openPanel")
let closeBtn = document.querySelector("#closePanel")
let scanBtn = document.querySelector("#scanBtn")
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    let u = tabs[0].url || ""
    urlEl.textContent = u
    runScan(u)
})

function runScan(u) {
    statusText.textContent = "Scanning..."
    chrome.runtime.sendMessage({ type: "scan", url: u }, res => {
        if (res && res.risk !== undefined) {
            let risk = res.risk
            riskVal.textContent = risk ? "High" : "Low"
            statusText.textContent = risk ? "High Risk" : "Low Risk"
        }
    })
    let h = getHostname(u)
    let features = hostnameFeatures(h)
    entropyVal.textContent = features.entropy.toFixed(2)
    subsVal.textContent = features.dots
    lenVal.textContent = features.length
    punyVal.textContent = features.punycode.toFixed(2)
    let ml = mlPredict(h)
    mlVal.textContent = ml.toFixed(2)
    hostVal.textContent = suspiciousHostname(h) ? 1 : 0
    let s = (features.entropy * 0.2) + (features.length > 20 ? 0.2 : 0) + (features.punycode * 0.2) + (ml * 0.4)
    let pct = Math.min(99, Math.round(s * 100))
    riskVal.textContent = pct + "%"
    if (pct > 55) {
        riskVal.style.color = "#f44336"
        statusText.textContent = "High Risk"
    } else if (pct > 30) {
        riskVal.style.color = "#ff9800"
        statusText.textContent = "Moderate Risk"
    } else {
        riskVal.style.color = "#4caf50"
        statusText.textContent = "Low Risk"
    }
}
openBtn.onclick = () => {
    panel.style.display = "block"
}
closeBtn.onclick = () => {
    panel.style.display = "none"
}
scanBtn.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, t => {
        runScan(t[0].url)
    })
}

function animate() {
    let v = 1
    setInterval(() => {
        v = v === 1 ? 0.7 : 1
        statusText.style.opacity = v
    }, 800)
}
animate()

function pulseRisk() {
    setInterval(() => {
        riskVal.style.transform = "scale(1.05)"
        setTimeout(() => { riskVal.style.transform = "scale(1)" }, 150)
    }, 1200)
}
pulseRisk()

function blinkBorder() {
    setInterval(() => {
        panel.style.border = "1px solid #333"
        setTimeout(() => { panel.style.border = "1px solid transparent" }, 200)
    }, 1500)
}
blinkBorder()