function entropy(s) {
    let freq = {}
    for (let c of s) freq[c] = (freq[c] || 0) + 1
    let e = 0
    let l = s.length
    for (let k in freq) {
        let p = freq[k] / l
        e -= p * Math.log2(p)
    }
    return e
}

function normalizedEntropy(s) {
    return entropy(s) / Math.log2(s.length + 1)
}

function hostEntropy(h) {
    let parts = h.split(".")
    let sum = 0
    for (let p of parts) sum += entropy(p)
    return sum / parts.length
}

function highEntropyCheck(h) {
    return hostEntropy(h) > 3.8
}

function characterDiversity(s) {
    let set = new Set(s)
    return set.size / s.length
}

function isSuspiciousByEntropy(h) {
    return hostEntropy(h) > 3.8 || characterDiversity(h) > 0.75
}

function combinedEntropyScore(h) {
    let s = 0
    s += normalizedEntropy(h)
    if (highEntropyCheck(h)) s += 0.3
    return s
}

function entropyForML(h) {
    return combinedEntropyScore(h)
}