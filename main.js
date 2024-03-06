import {
    GestureRecognizer,
    FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js";

import { Analytics } from "@vercel/analytics/react"

const canvas = document.getElementById('canvas')
const drawCanvas = document.getElementById('drawCanvas')
const camCanvas = document.getElementById('gestureCanvas')


canvas.width = window.innerWidth
canvas.height = window.innerHeight
drawCanvas.width = window.innerWidth
drawCanvas.height = window.innerHeight

const ctx = canvas.getContext('2d')
const dCtx = drawCanvas.getContext('2d')
const cCtx = camCanvas.getContext('2d')


ctx.scale(-1, 1)
ctx.translate(-canvas.width, 0)
dCtx.scale(-1, 1)
dCtx.translate(-canvas.width, 0)
cCtx.scale(-1, 1)
cCtx.translate(-canvas.width, 0)


const poseDetect = document.getElementById('poseDetect')

let video
let gestureRecognizer
let pick = { active: false, x: 0, y: 0 }
const pickStatus = document.getElementById('pickStatus')
let ball = { x: 300, y: 100}
let moveModule = {x : canvas.width / 2, y : 40, width : '100px', height : '50px', text : 'Move Things Around' }
let gestureModule = {x : canvas.width / 2, y : 40, width : '100px', height : '50px', text : 'Detect Gestures'}
let modules = [moveModule,gestureModule]



try {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "./gesture_recognizer.task",
            runningMode: 'VIDEO'
        },
        numHands: 2
    })

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {

        video = document.createElement('video')
        video.srcObject = stream

        video.play()

        video.onloadeddata = () => {

            camCanvas.width = video.videoWidth / 2
            camCanvas.height = video.videoHeight / 2
            animate()

        }

    })

} catch (err) {
    console.log(err)
}

const animate =  () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dCtx.clearRect(0, 0, canvas.width, canvas.height)

    // cCtx.drawImage(video,0,0,500,300)
    const gestureRecognitionResult = gestureRecognizer.recognize(video)

    dCtx.beginPath()
    dCtx.arc(ball.x, ball.y, 80, 0, Math.PI * 2)
    dCtx.fill()

    if (gestureRecognitionResult.landmarks[0]) {

        ctx.save()
        ctx.beginPath()
        ctx.arc(gestureRecognitionResult.landmarks[0][8].x * canvas.width, gestureRecognitionResult.landmarks[0][8].y * canvas.height, 10, 0, Math.PI * 2)
        ctx.fill()

        let dist = Math.hypot(gestureRecognitionResult.landmarks[0][4].x * canvas.width - gestureRecognitionResult.landmarks[0][8].x * canvas.width, gestureRecognitionResult.landmarks[0][4].y * canvas.height - gestureRecognitionResult.landmarks[0][7].y * canvas.height)

        if (dist < 50) {

            let center = { x: gestureRecognitionResult.landmarks[0][8].x * canvas.width, y: gestureRecognitionResult.landmarks[0][8].y * canvas.height }
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

        // if(gestureRecognitionResult.gestures[0][0].categoryName !== 'Open_Palm' && gestureRecognitionResult.gestures[0][0].categoryName !== 'Closed_Fist' && gestureRecognitionResult.gestures[0][0].categoryName !== 'None'){

        //     ctx.clearRect(0,0,canvas.width,canvas.height)
        //     dCtx.clearRect(0,0,canvas.width,canvas.height)
        //     for(let i = 0; i < gestureRecognitionResult.landmarks[0].length; i++){

        //         ctx.beginPath()
        //         ctx.arc(gestureRecognitionResult.landmarks[0][i].x * canvas.width,gestureRecognitionResult.landmarks[0][i].y * canvas.height,3,0,Math.PI*2)
        //         ctx.fill()

        //     }

        //     poseDetect.innerHTML = `Pose : ${gestureRecognitionResult.gestures[0][0].categoryName}`

        //     ctx.lineWidth = 2
        //     //Thumb
        //     ctx.save()
        //     ctx.strokeStyle = 'royalBlue'
        //     ctx.beginPath()
        //     ctx.moveTo(gestureRecognitionResult.landmarks[0][0].x * canvas.width, gestureRecognitionResult.landmarks[0][0].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][1].x * canvas.width, gestureRecognitionResult.landmarks[0][1].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][2].x * canvas.width, gestureRecognitionResult.landmarks[0][2].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][3].x * canvas.width, gestureRecognitionResult.landmarks[0][3].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][4].x * canvas.width, gestureRecognitionResult.landmarks[0][4].y * canvas.height)
        //     ctx.stroke()
        //     ctx.restore()

        //     //Index
        //     ctx.save()
        //     ctx.strokeStyle = 'red'
        //     ctx.beginPath()
        //     ctx.moveTo(gestureRecognitionResult.landmarks[0][5].x * canvas.width, gestureRecognitionResult.landmarks[0][5].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][6].x * canvas.width, gestureRecognitionResult.landmarks[0][6].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][7].x * canvas.width, gestureRecognitionResult.landmarks[0][7].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][8].x * canvas.width, gestureRecognitionResult.landmarks[0][8].y * canvas.height)
        //     ctx.stroke()
        //     ctx.restore()

        //     //Middle
        //     ctx.save()
        //     ctx.strokeStyle = 'yellowGreen'
        //     ctx.beginPath()
        //     ctx.moveTo(gestureRecognitionResult.landmarks[0][9].x * canvas.width, gestureRecognitionResult.landmarks[0][9].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][10].x * canvas.width, gestureRecognitionResult.landmarks[0][10].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][11].x * canvas.width, gestureRecognitionResult.landmarks[0][11].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][12].x * canvas.width, gestureRecognitionResult.landmarks[0][12].y * canvas.height)
        //     ctx.stroke()
        //     ctx.restore()

        //     //Ring
        //     ctx.save()
        //     ctx.strokeStyle = 'purple'
        //     ctx.beginPath()
        //     ctx.moveTo(gestureRecognitionResult.landmarks[0][13].x * canvas.width, gestureRecognitionResult.landmarks[0][13].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][14].x * canvas.width, gestureRecognitionResult.landmarks[0][14].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][15].x * canvas.width, gestureRecognitionResult.landmarks[0][15].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][16].x * canvas.width, gestureRecognitionResult.landmarks[0][16].y * canvas.height)
        //     ctx.stroke()
        //     ctx.restore()

        //     //Pinky
        //     ctx.save()
        //     ctx.strokeStyle = 'hotPink'
        //     ctx.beginPath()
        //     ctx.moveTo(gestureRecognitionResult.landmarks[0][17].x * canvas.width, gestureRecognitionResult.landmarks[0][17].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][18].x * canvas.width, gestureRecognitionResult.landmarks[0][18].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][19].x * canvas.width, gestureRecognitionResult.landmarks[0][19].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][20].x * canvas.width, gestureRecognitionResult.landmarks[0][20].y * canvas.height)
        //     ctx.stroke()
        //     ctx.restore()

        //     //Palm
        //     ctx.save()
        //     ctx.beginPath()
        //     ctx.moveTo(gestureRecognitionResult.landmarks[0][0].x * canvas.width, gestureRecognitionResult.landmarks[0][0].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][5].x * canvas.width, gestureRecognitionResult.landmarks[0][5].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][9].x * canvas.width, gestureRecognitionResult.landmarks[0][9].y * canvas.height)
        //     ctx.lineTo(gestureRecognitionResult.landmarks[0][17].x * canvas.width, gestureRecognitionResult.landmarks[0][17].y * canvas.height)
        //     ctx.closePath()
        //     ctx.stroke()
        //     ctx.restore()

        // }        

    }

    if (pick.active) {

        let dist = Math.hypot(ball.x - pick.x, ball.y - pick.y)
        if (dist < 80) {

            ball.x = pick.x
            ball.y = pick.y

        }
    } 

    requestAnimationFrame(() => animate())

}
