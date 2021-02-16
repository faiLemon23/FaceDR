const video = document.getElementById('videoInput')
const loader = document.querySelector('.loader');
const snap = document.getElementById("snap");

var imgPic;
var videoId = 'videoInput';
var scaleFactor = 0.15;
var snapshots = [];

$(window).resize(function() {
    var width = $(window).width();
    if (width > 992) {
        alert('Your screen is too big');
        try {
            Promise.all([
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
            ]).then(start)
        } catch (error) {
            window.location.reload();
        }

        function start() {
            // document.body.append('Models Loaded')

            navigator.getUserMedia({ video: {} },
                stream => video.srcObject = stream,
                err => console.error(err)
            )

            // video.src = '../videos/speech.mp4'
            console.log('video added')
            recognizeFaces()
        }
        async function recognizeFaces() {

            const labeledDescriptors = await loadLabeledImages()

            loader.className += ".hidden"; // class "loader hidden"
            loader.style.display = "none";
            // นิดเดียววววว

            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.37)

            video.addEventListener('play', async() => {
                console.log('Playing')

                const canvas = faceapi.createCanvasFromMedia(video)
                    // document.body.append(canvas)

                const displaySize = { width: video.width, height: video.height }
                faceapi.matchDimensions(canvas, displaySize)



                setInterval(async() => {
                    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

                    const resizedDetections = faceapi.resizeResults(detections, displaySize)
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    const results = resizedDetections.map((d) => {
                        return faceMatcher.findBestMatch(d.descriptor)
                    })


                    results.forEach((result, i) => {
                        const box = resizedDetections[i].detection.box
                        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                        drawBox.draw(canvas)

                        // var context = canvass.getContext('2d');
                        // context.drawImage(videoInput, 0, 0, 100, 100);
                        shoot();
                        var d = new Date();
                        var date = d.toLocaleTimeString();
                        var time = d.toLocaleDateString();
                        add(result.label, date, time);
                    })
                }, 3000)
            });
            video.addEventListener('pause', () => {
                video.load();
            });
        }

        function loadLabeledImages() {
            const labels = ['Anuruk', 'Atit', 'Burin', 'Chutima', 'Jessadakorn', 'Jidapa', 'Katchet', 'Kitsanapong', 'Kulpreeya', 'Nattapat', 'Norraphat', 'Oraya', 'Parik', 'Phichakorn', 'Pongparn', 'Suriya', 'Thanyarat', 'Wichayuth', 'Yanisa']
                // const labels = ['Prashant Kumar'] // for WebCam
            return Promise.all(
                labels.map(async(label) => {
                    const descriptions = []
                    for (let i = 1; i <= 5; i++) {
                        const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                        console.log(label + i + JSON.stringify(detections))
                        descriptions.push(detections.descriptor)
                    }
                    // document.body.append(label + ' Faces Loaded | ')
                    return new faceapi.LabeledFaceDescriptors(label, descriptions)
                })
            )
        }

        function capture(video, scaleFactor) {
            if (scaleFactor == null) {
                scaleFactor = 1;
            }
            var w = video.videoWidth * scaleFactor;
            var h = video.videoHeight * scaleFactor;
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);
            // console.log(ctx)
            return canvas;
        }

        function shoot() {
            var output = document.getElementById('output');
            var canvas = capture(videoInput, scaleFactor);
            snapshots.unshift(canvas);
            output.innerHTML = '';
            for (var i = 0; i < 4; i++) {
                output.append(snapshots[i]);
            }
            storageImg();
        }

        var storageImg = function() {

            var canvas = capture(videoInput, scaleFactor);
            const ref = firebase.storage().ref();
            var image = new Image();
            image.src = canvas.toDataURL('image/png');
            // ref.child(new Date() + '-' + 'base64').putString(image.src, 'data_url');
            imgPic = image.src;
        }

        function clockTick() {
            currentTime = new Date();
            month = currentTime.getMonth() + 1;
            day = currentTime.getDate();
            year = currentTime.getFullYear();
            // alert("hi");
            document.querySelector('.date').innerHTML = month + "/" + day + "/" + year;
        }

        setInterval(function() { clockTick(); }, 1000); //setInterval(clockTick, 1000); will also work
    }
});