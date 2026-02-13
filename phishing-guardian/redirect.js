let p = new URLSearchParams(location.search)
let target = p.get("u") || "Unknown"
let box = document.querySelector("#urlBox")
box.textContent = target
let back = document.querySelector("#safe")
let go = document.querySelector("#proceed")
back.onclick = () => {
    history.back()
    setTimeout(() => {
        location.href = "about:blank"
    }, 400)
}
go.onclick = () => {
    location.href = target
}

function pulse() {
    let w = document.querySelector("#wrapper")
    let x = 0
    let i = setInterval(() => {
        x += 0.06
        let s = 1 + Math.sin(x) * 0.02
        w.style.transform = "scale(" + s + ")"
    }, 30)
}
pulse()

function blink() {
    let t = document.querySelector("#title")
    let f = 1
    setInterval(() => {
        f = f === 1 ? 0.65 : 1
        t.style.opacity = f
    }, 900)
}
blink()

function warn() {
    document.title = "Security Warning"
}
warn()

function glow() {
    let b = document.querySelector("#safe")
    let g = document.querySelector("#proceed")
    setInterval(() => {
        b.style.boxShadow = "0 0 12px rgba(255,0,0,0.6)"
        g.style.boxShadow = "0 0 12px rgba(0,255,0,0.4)"
        setTimeout(() => {
            b.style.boxShadow = "none"
            g.style.boxShadow = "none"
        }, 500)
    }, 1100)
}
glow()

function typeEffect(el, text, sp) {
    let i = 0
    let t = setInterval(() => {
        if (i >= text.length) return clearInterval(t)
        el.textContent = text.substring(0, i + 1)
        i++
    }, sp)
}
typeEffect(box, target, 12)

function bounce() {
    let i = document.querySelector("#icon")
    let y = 0
    setInterval(() => {
        y += 0.1
        let v = Math.sin(y) * 4
        i.style.transform = "translateY(" + v + "px)"
    }, 30)
}
bounce()

function addKey() {
    document.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            location.href = target
        }
        if (e.key === "Escape") {
            history.back()
        }
    })
}
addKey()

function flashBorder() {
    let w = document.querySelector("#wrapper")
    setInterval(() => {
        w.style.border = "2px solid #d32f2f"
        setTimeout(() => {
            w.style.border = "2px solid transparent"
        }, 250)
    }, 1200)
}
flashBorder()

function touch() {
    document.addEventListener("touchstart", () => {
        document.body.style.opacity = "0.95"
        setTimeout(() => { document.body.style.opacity = "1" }, 150)
    })
}
touch()