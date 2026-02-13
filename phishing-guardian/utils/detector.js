async function detectURL(url) {
    try {
        let u = new URL(url)
        let h = u.hostname.toLowerCase()
        if (inDB(h)) return true
        let s1 = scoreHost(h)
        let s2 = mlPredict(h)
        let t = s1 * 0.4 + s2 * 0.6
        return t > 0.55
    } catch (e) { return false }
}

function inDB(host) {
    for (let i = 0; i < phishingDB.length; i++) {
        if (phishingDB[i].domain === host) return true
    }
    return false
}

function scoreHost(h) {
    let e = entropy(h)
    let d = h.split(".").length
    let l = h.length
    let s = 0
    if (e > 3.8) s += 0.35
    if (d > 4) s += 0.33
    if (l > 20) s += 0.32
    return s
}

function mlPredict(h) {
    if (!modelReady) return 0
    let hv = hashString(h) % 1000
    let sum = 0
    for (let i = 0; i < 60; i++) {
        sum += weights[(hv + i) % weights.length] / 255
    }
    return sum / 60
}

function hashString(s) {
    let h = 0
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

function checkFormInputs() {
    let f = document.querySelectorAll("input[type='password'],input[name*='pass']")
    for (let x of f) {
        bindInput(x)
    }
}

function bindInput(el) {
    if (el.dataset.detectorBound) return
    el.dataset.detectorBound = "1"
    el.addEventListener("focus", () => {
        let u = location.href
        detectURL(u).then(r => {
            if (r) window.location.href = chrome.runtime.getURL("redirect.html") + "?u=" + encodeURIComponent(u)
        })
    })
}
let obs = new MutationObserver(checkFormInputs)
obs.observe(document.body, { childList: true, subtree: true })
checkFormInputs()