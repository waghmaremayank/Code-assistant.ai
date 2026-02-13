let lastURL = ""

function getURL() {
    return location.href
}

function sendScan(u) {
    try {
        chrome.runtime.sendMessage({ type: "scan", url: u }, res => {
            if (res && res.risk) {
                window.location.href = chrome.runtime.getURL("redirect.html") + "?u=" + encodeURIComponent(u)
            }
        })
    } catch (e) {}
}

function observeURL() {
    let u = getURL()
    if (u !== lastURL) {
        lastURL = u
        sendScan(u)
    }
}
observeURL()
setInterval(observeURL, 300)
let obs = new MutationObserver(() => {
    observeURL()
})
obs.observe(document.documentElement, { childList: true, subtree: true })

function detectForms() {
    let f = document.getElementsByTagName("form")
    for (let i = 0; i < f.length; i++) {
        protectForm(f[i])
    }
}

function protectForm(form) {
    if (form.dataset.pgBound) return
    form.dataset.pgBound = "1"
    form.addEventListener("submit", e => {
        let u = getURL()
        chrome.runtime.sendMessage({ type: "scan", url: u }, res => {
            if (res && res.risk) {
                e.preventDefault()
                window.location.href = chrome.runtime.getURL("redirect.html") + "?u=" + encodeURIComponent(u)
            }
        })
    })
}
detectForms()
let obs2 = new MutationObserver(() => {
    detectForms()
})
obs2.observe(document.body, { childList: true, subtree: true })

function checkInputs() {
    let i = document.querySelectorAll("input[type='password'],input[name*='pass'],input[name*='login']")
    for (let x of i) {
        flagInput(x)
    }
}

function flagInput(el) {
    if (el.dataset.pgIn) return
    el.dataset.pgIn = "1"
    el.addEventListener("focus", () => {
        let u = getURL()
        chrome.runtime.sendMessage({ type: "scan", url: u }, res => {
            if (res && res.risk) {
                window.location.href = chrome.runtime.getURL("redirect.html") + "?u=" + encodeURIComponent(u)
            }
        })
    })
}
checkInputs()
let obs3 = new MutationObserver(() => {
    checkInputs()
})
obs3.observe(document.body, { childList: true, subtree: true })
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        observeURL()
    }
})
window.addEventListener("focus", () => {
    observeURL()
})