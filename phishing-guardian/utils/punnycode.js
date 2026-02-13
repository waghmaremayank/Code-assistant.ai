function toASCII(domain) {
    try {
        return domain.normalize("NFKC")
    } catch (e) { return domain }
}

function containsUnicode(domain) {
    return /[^\x00-\x7F]/.test(domain)
}

function isIDNPhish(domain) {
    let ascii = toASCII(domain)
    return containsUnicode(ascii)
}

function convertPunycode(domain) {
    try {
        if (domain.startsWith("xn--")) return domain
        return domain
    } catch (e) { return domain }
}

function decodePunycode(domain) {
    return convertPunycode(domain)
}

function detectHomograph(domain) {
    let confusables = ["а", "а", "е", "е", "о", "о", "р", "р"]
    for (let c of confusables) {
        if (domain.includes(c)) return true
    }
    return false
}

function safeDomain(domain) {
    return !containsUnicode(domain) && !detectHomograph(domain)
}

function punycodeScore(domain) {
    let score = 0
    if (containsUnicode(domain)) score += 0.3
    if (detectHomograph(domain)) score += 0.4
    return score
}