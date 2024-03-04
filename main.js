import {
    GestureRecognizer,
    FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js";

const canvas = document.getElementById('canvas')
const drawCanvas = document.getElementById('drawCanvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
drawCanvas.width = window.innerWidth
drawCanvas.height = window.innerHeight
const ctx = canvas.getContext('2d')
const dCtx = drawCanvas.getContext('2d')

ctx.scale(-1, 1)
ctx.translate(-canvas.width, 0)

dCtx.scale(-1, 1)
dCtx.translate(-canvas.width, 0)
let video
let gestureRecognizer
let pick = { active: false, x: 0, y: 0 }
const pickStatus = document.getElementById('pickStatus')
let ball = { x: 300, y: 100, velocityY: 0 }
let ground = { x: 0, y: 550 }
let Gravity = 0.9


try {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "./gesture_recognizer.task",
            runningMode: 'IMAGE'
        },
        numHands: 2
    })

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {

        video = document.createElement('video')
        video.srcObject = stream

        video.play()

        video.onloadeddata = () => {

            animate()

        }

    })

} catch (err) {
    console.log(err)
}




const animate = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dCtx.clearRect(0, 0, canvas.width, canvas.height)

    const gestureRecognitionResult = gestureRecognizer.recognize(video)

    if (gestureRecognitionResult.landmarks[0]) {

        if (gestureRecognitionResult.landmarks[0][4] && gestureRecognitionResult.landmarks[0][8]) {

            ctx.save()
            ctx.fillStyle = 'red'
            ctx.beginPath()
            ctx.arc(gestureRecognitionResult.landmarks[0][8].x * canvas.width, gestureRecognitionResult.landmarks[0][8].y * canvas.height, 3, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            let dist = Math.hypot(gestureRecognitionResult.landmarks[0][4].x * canvas.width - gestureRecognitionResult.landmarks[0][8].x * canvas.width, gestureRecognitionResult.landmarks[0][4].y * canvas.height - gestureRecognitionResult.landmarks[0][8].y * canvas.height)

            if (dist < 50) {

                let center = {x : gestureRecognitionResult.landmarks[0][8].x * canvas.width, y : gestureRecognitionResult.landmarks[0][8].y * canvas.height}
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.save()
                ctx.beginPath()
                ctx.fillStyle = 'red'
                ctx.arc(center.x, center.y, 5, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()
                ctx.restore()

                pick.active = true
                pick.x = center.x
                pick.y = center.y

            } else {

                pick.active = false
                pick.x = 0
                pick.y = 0

            }

        }

    }

    if (pick.active) {

        let dist = Math.hypot(ball.x - pick.x, ball.y - pick.y)
        pickStatus.innerHTML = `Dist : ${dist}`
        if (dist < 30) {

            ball.x = pick.x
            ball.y = pick.y

        }
    }else{

        dCtx.fillStyle = 'black'
    }


    dCtx.beginPath()
    dCtx.arc(ball.x, ball.y, 40, 0, Math.PI * 2)
    dCtx.fill()

    requestAnimationFrame(() => animate())

}

const lerp = (A, B, t) => {

    return A + (B - A) * t

}