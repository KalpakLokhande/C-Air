import {
    GestureRecognizer,
    FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js";

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let video
let gestureRecognizer

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

    navigator.mediaDevices.getUserMedia({video : true}).then(stream => {

        video = document.createElement('video')
        video.srcObject = stream
        video.play()

        video.onloadeddata = () => {

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight


            animate()

        }

    })





} catch (err) {
    console.log(err)
}

const animate = () => {

    const gestureRecognitionResult = gestureRecognizer.recognize(video)

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    console.log(gestureRecognitionResult.landmarks[0])

    if(gestureRecognitionResult.landmarks[0]){

        for (let i = 0; i < gestureRecognitionResult.landmarks[0].length; i++) {
    
            ctx.beginPath()
            ctx.arc(gestureRecognitionResult.landmarks[0][i].x * canvas.width, gestureRecognitionResult.landmarks[0][i].y * canvas.height, 3, 0, Math.PI * 2)
            ctx.fill()
    
        }

    }

    requestAnimationFrame(() => animate())

}
