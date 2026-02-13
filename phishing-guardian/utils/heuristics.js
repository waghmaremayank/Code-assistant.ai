function entropy(s) {
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

function abnormalLength(h) {
    return h.length > 22 ? 0.3 : 0
}

function abnormalSubdomains(h) {
    return h.split(".").length > 4 ? 0.3 : 0
}

function highEntropy(h) {
    return entropy(h) > 3.8 ? 0.4 : 0
}

function heuristicScore(h) {
    let s = 0
    s += abnormalLength(h)
    s += abnormalSubdomains(h)
    s += highEntropy(h)
    return s > 0.55
}

function isPhishy(h) {
    return heuristicScore(h)
}

function checkDomainPatterns(h) {
    let patterns = ["login", "secure", "update", "verify", "account"]
    for (let p of patterns) {
        if (h.includes(p)) return true
    }
    return false
}

function suspiciousURL(u) {
    try {
        let h = new URL(u).hostname
        return isPhishy(h) || checkDomainPatterns(h)
    } catch (e) { return false }
}

function combinedScore(u) {
    try {
        let h = new URL(u).hostname
        let s1 = heuristicScore(h)
        let s2 = mlPredict(h)
        return s1 * 0.4 + s2 * 0.6
    } catch (e) { return 0 }
}