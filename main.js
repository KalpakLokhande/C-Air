const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let model;
let video;

const ctx = canvas.getContext('2d')

handTrack.load({ flipHorizontal : true, modelType: "ssd320fpnlite", imageScaleFactor : 1}).then(m => {

    model = m

    navigator.mediaDevices.getUserMedia({ video: true, flipHorizontal : true }).then(stream => {

        video = document.createElement('video')
        video.srcObject = stream
        video.play()


        handTrack.startVideo(video)

        video.onloadeddata = () => {

            animate()

        }


    })

})

const animate = () => {

    model.detect(video).then(predictions => {
    
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    
        predictions.forEach(pre => {
    
            if (pre.label === 'open') {
    
                let center = { x: pre.bbox[0] + pre.bbox[2], y: pre.bbox[1] }
                ctx.save()
                ctx.beginPath()
                ctx.arc(center.x, center.y, 10, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
    
            }
            if (pre.label === 'point') {
    
                let center = { x: pre.bbox[0] + pre.bbox[2], y: pre.bbox[1] }
                ctx.save()
                ctx.fillStyle = 'red'
                ctx.beginPath()
                ctx.arc(center.x, center.y, 10, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
    
            }
    
        })
    
    
    }).catch(err => {
    
        console.log(err)
    
    })
    
    requestAnimationFrame(animate)

}
    

