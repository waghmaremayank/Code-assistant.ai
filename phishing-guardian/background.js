let modelReady = false
let phishingDB = []
let model = null
let weights = null
let scanMap = {}
importScripts(
    "utils/detector.js",
    "utils/heuristics.js",
    "utils/entropy.js",
    "utils/punnycode.js",
    "utils/hostname.js"
);
async function loadModel() {
    const m = await fetch("ml/model.json")
    const w = await fetch("ml/weights.bin")
    model = await m.json()
    weights = new Uint8Array(await w.arrayBuffer())
    modelReady = true
}
async function loadDB() {
    const r = await fetch("database/phishing_domains.json")
    const d = await r.json()
    phishingDB = d.domains || []
}

function hash(s) {
    let h = 0
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

function inList(host) {
    for (let i = 0; i < phishingDB.length; i++) {
        if (phishingDB[i].domain === host) return true
    }
    return false
}

function ent(s) {
    let m = {}
    for (let c of s) m[c] = (m[c] || 0) + 1
    let e = 0
    let l = s.length
    for (let k in m) {
        let p = m[k] / l
        e -= p * Math.log2(p)
    }
    return e
}

function ruleScore(h) {
    let e = ent(h)
    let d = h.split(".").length
    let l = h.length
    let s = 0
    if (e > 3.8) s += 0.35
    if (d > 4) s += 0.32
    if (l > 20) s += 0.33
    return s
}

function ml(h) {
    if (!modelReady) return 0
    let hv = hash(h) % 1000
    let s = 0
    for (let i = 0; i < 60; i++) {
        s += weights[(hv + i) % weights.length] / 255
    }
    return s / 60
}
async function detect(url) {
    try {
        let u = new URL(url)
        let h = u.hostname.toLowerCase()
        if (inList(h)) return true
        let s1 = ruleScore(h)
        let s2 = ml(h)
        let t = s1 * 0.4 + s2 * 0.6
        return t > 0.55
    } catch (e) {
        return false
    }
}
chrome.webNavigation.onCommitted.addListener(async e => {
    if (e.frameId !== 0) return
    let id = e.tabId
    scanMap[id] = 1
    let r = await detect(e.url)
    if (r) {
        chrome.tabs.update(id, { url: chrome.runtime.getURL("redirect.html") + "?u=" + encodeURIComponent(e.url) })
    }
})
chrome.tabs.onRemoved.addListener(id => {
    delete scanMap[id]
})
chrome.runtime.onMessage.addListener((msg, s, r) => {
    if (msg.type === "scan") {
        detect(msg.url).then(x => r({ risk: x }))
        return true
    }
})
loadModel()
loadDB()