function getHostname(url) {
    try {
        return new URL(url).hostname.toLowerCase()
    } catch (e) { return "" }
}

function isIP(h) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(h)
}

function hasDash(h) {
    return h.includes("-")
}

function hasMultipleDots(h) {
    return h.split(".").length > 3
}

function hostnameFeatures(h) {
    return {
        ip: isIP(h) ? 1 : 0,
        dash: hasDash(h) ? 1 : 0,
        dots: h.split(".").length,
        length: h.length,
        entropy: entropy(h),
        punycode: punycodeScore(h)
    }
}

function suspiciousHostname(h) {
    let f = hostnameFeatures(h)
    let s = 0
    s += f.ip * 0.4
    s += f.dash * 0.3
    s += f.dots * 0.15
    s += f.entropy * 0.1
    s += f.punycode * 0.2
    return s > 0.55
}

function combinedHostnameCheck(u) {
    let h = getHostname(u)
    return suspiciousHostname(h)
}

function extractHostnameParts(h) {
    return h.split(".")
}

function domainSimilarity(h1, h2) {
    let p1 = extractHostnameParts(h1)
    let p2 = extractHostnameParts(h2)
    let count = 0
    for (let i = 0; i < Math.min(p1.length, p2.length); i++) {
        if (p1[i] === p2[i]) count++
    }
    return count / Math.max(p1.length, p2.length)
}

function normalizeHost(h) {
    return h.trim().toLowerCase()
}

function simpleCheck(u) {
    let h = getHostname(u)
    return h.length > 20 || hasMultipleDots(h)
}