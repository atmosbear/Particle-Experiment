
function createCanvas() {
    let c = document.createElement("canvas")
    c.style.backgroundColor = "darkorange"
    c.width = innerWidth
    c.height = innerHeight
    document.body.append(c)
    return c
}
type Dot = { x: number, y: number, mass: number, linked?: Dot[] }
let dots: Dot[] = []
function drawDot(dot: Dot, ct: CanvasRenderingContext2D = context) {
    ct.beginPath()
    let radius = 5
    ct.ellipse(dot.x, dot.y, radius, radius, 0, 0, 300)
    ct.fill()
    // ct.fillStyle = ["red", "blue", "green", "orange", "yellow"][Math.round(Math.random()*5)]
    ct.closePath()
    return dot
}
function createLink(dot1: Dot, dot2: Dot) {
    if (dot1.linked === undefined) {
        dot1.linked = []
    }
    dot1.linked.push()
    if (dot1.linked === undefined) {
        dot1.linked = []
    }
    dot1.linked.push(dot2)
}
function drawLink(dot1: Dot, dot2: Dot, ct = context) {
    ct.beginPath()
    ct.moveTo(dot1.x, dot1.y)
    ct.lineTo(dot2.x, dot2.y)
    ct.stroke()
    ct.closePath()
}
function drawFrame() {
    dots.forEach(dot => { drawDot(dot) })
    dots.forEach(dot => {
        if (dot.linked) {
            dot.linked.forEach(linkedDot => {
                drawLink(dot, linkedDot)
            })
        }
    })
}
function createTestDots() {
    for (let i = 0; i < 200; i++) {
        dots.push(drawDot({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, mass: 1 }))
    }
    for (let i = 0; i < 120; i++) {
        let dot1 = dots[Math.round(dots.length * Math.random())]
        let dot2 = dots[Math.round(dots.length * Math.random())]
        if (dot1 && dot2 && dot1 !== dot2) {
            createLink(dot1, dot2)
        }
    }
    dots.forEach((dot) => {
        if (!dot.linked) {
            dot.linked = []
        }
        if (dot.linked.length === 0 && Math.random() > 0.99) {
            dot.linked.push(dots[Math.floor(Math.random()*dots.length)])
        }
    })
}
let C1CONSTANT_spring_stiffness_i_think = 5
let C2CONSTANT_organicity_instead_of_straight_lines = 3
let C3CONSTANT_repulse_non_linked = 5
let C4CONSTANT_overall_force = 2
let C5CONSTANT_central_force = 0.01
function moveDots() {
    dots.forEach(dot => {
        if (dot.linked === undefined) {
            dot.linked = []
        }
        dot.linked.forEach(dot2 => {
            // spring between linked:
            dot.x += C1CONSTANT_spring_stiffness_i_think * Math.log(getDotDistance(dot, dot2).x / C2CONSTANT_organicity_instead_of_straight_lines) * getDirectionFor1(dot, dot2).x * -1 * C4CONSTANT_overall_force * (1/dot.mass)
            dot.y += C1CONSTANT_spring_stiffness_i_think * Math.log(getDotDistance(dot, dot2).y / C2CONSTANT_organicity_instead_of_straight_lines) * getDirectionFor1(dot, dot2).y * -1 * C4CONSTANT_overall_force * (1/dot.mass)
            dot2.x += C1CONSTANT_spring_stiffness_i_think * Math.log(getDotDistance(dot, dot2).x / C2CONSTANT_organicity_instead_of_straight_lines) * getDirectionFor1(dot, dot2).x * C4CONSTANT_overall_force * (1/dot2.mass)
            dot2.y += C1CONSTANT_spring_stiffness_i_think * Math.log(getDotDistance(dot, dot2).y / C2CONSTANT_organicity_instead_of_straight_lines) * getDirectionFor1(dot, dot2).y * C4CONSTANT_overall_force * (1/dot2.mass)
        })
        dots.forEach(dot2 => {
            if (dot.linked!.includes(dot2) === false && dot !== dot2) {
                // repel non linked
                dot.x += C3CONSTANT_repulse_non_linked / Math.sqrt(getDotDistance(dot, dot2).x) * getDirectionFor1(dot, dot2).x * C4CONSTANT_overall_force * (1/dot.mass)
                dot.y += C3CONSTANT_repulse_non_linked / Math.sqrt(getDotDistance(dot, dot2).y) * getDirectionFor1(dot, dot2).y * C4CONSTANT_overall_force * (1/dot.mass)
                // dot2.x += C3CONSTANT_repulse_non_linked / Math.sqrt(getDotDistance(dot, dot2).x) * getDirectionFor1(dot, dot2).x * -1 * C4CONSTANT_overall_force * (1/dot2.mass)
                // dot2.y += C3CONSTANT_repulse_non_linked / Math.sqrt(getDotDistance(dot, dot2).y) * getDirectionFor1(dot, dot2).y * -1 * C4CONSTANT_overall_force * (1/dot2.mass)
            }
        })
        let centerCoord = { x: innerWidth / 2, y: innerHeight / 2, mass: 100 }
        let distFromCenter = getDotDistance(dot, centerCoord)
        dot.x += distFromCenter.x * getDirectionFor1(dot, centerCoord).x * -1 * C5CONSTANT_central_force * C4CONSTANT_overall_force * (1 / dot.mass)
        dot.y += distFromCenter.y * getDirectionFor1(dot, centerCoord).y * -1 * C5CONSTANT_central_force * C4CONSTANT_overall_force * (1 / dot.mass)
    })
}
function getDotDistance(dot1: Dot, dot2: Dot) {
    return { x: Math.abs(dot1.x - dot2.x), y: Math.abs(dot1.y - dot2.y) }
}
function getDirectionFor1(dot1: Dot, dot2: Dot) {
    return { x: Math.sign(dot1.x - dot2.x), y: Math.sign(dot1.y - dot2.y) }
    // return {x: Math.abs(dot1.x - dot2.x), y: Math.abs(dot1.y - dot2.y)}
}

function clearCanvas(ct = context) {
    let w = ct.canvas.width
    let h = ct.canvas.height
    ct.fillStyle = ct.canvas.style.backgroundColor
    ct.fillRect(0, 0, w, h)
    ct.fillStyle = "black"
}
let iterations = 0
let origCentral = C5CONSTANT_central_force
function animar() {
    if (iterations < 10000) {
        if (iterations % 5 === 0 && C5CONSTANT_central_force < origCentral * 10) {
            C5CONSTANT_central_force *= 1.2
        } else {
            C4CONSTANT_overall_force /= 1.02
        }
        // if (iterations < 50) {
        //     C1CONSTANT_spring_stiffness_i_think *= 1.2
        // }
        // if (iterations > 50) {
        //     C1CONSTANT_spring_stiffness_i_think /= 1.1
        // }
        clearCanvas()
        moveDots()
        drawFrame()
        requestAnimationFrame(animar)
        iterations++
    }
}
let canvas = createCanvas()
let context = canvas.getContext("2d")!
createTestDots()
animar()