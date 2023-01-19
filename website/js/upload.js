

	AWS.config.region = 'us-east-1'; // 1. Enter your region

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: 'us-east-1:b5013574-2741-4e18-97be-9395b5929162' // 2. Enter your identity pool
});

AWS.config.credentials.get(function(err) {
	if (err) alert(err);
	console.log("estoy aqui")
	console.log(AWS.config.credentials);
});

var bucketName = 'user-video-test'; // Enter your bucket name+


var S3 = new AWS.S3();

var bucket = new AWS.S3({
	params: {
		Bucket: bucketName
	}
});

var fileChooser = document.getElementById('file-chooser');
var button = document.getElementById('upload-button');
var results = document.getElementById('results');
var percentage = document.getElementById('percentage');
var cancelUpload = document.getElementById('cancel-button');



function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
}
// Store a reference of the preview video element and a global reference to the recorder instance
var video = document.getElementById('my-preview');
var recorder;
video.style.visibility =  "hidden";
// When the user clicks on start video recording
document.getElementById('btn-start-recording').addEventListener("click", function(){
    // Disable start recording button
    this.disabled = true;
	video.style.visibility =  "visible"; 
    // Request access to the media devices
    navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: true
    }).then(function(stream) {
        // Display a live preview on the video element of the page
        setSrcObject(stream, video);

        // Start to display the preview on the video element
        // and mute the video to disable the echo issue !
        video.play();
        video.muted = true;

        // Initialize the recorder
        recorder = new RecordRTCPromisesHandler(stream, {
            mimeType: 'video/webm',
            bitsPerSecond: 128000
        });

        // Start recording the video
        recorder.startRecording().then(function() {
            console.info('Recording video ...');
        }).catch(function(error) {
            console.log(error);
            console.error('Cannot start video recording: ', error);
        });

        // release stream on stopRecording
        recorder.stream = stream;

        // Enable stop recording button
        document.getElementById('btn-stop-recording').disabled = false;
    }).catch(function(error) {
               console.log(error);
        console.error("Cannot access media devices: ", error);
    });
}, false);

// When the user clicks on Stop video recording
document.getElementById('btn-stop-recording').addEventListener("click", function(){
    this.disabled = true;
	video.style.display =  "none"; 
    recorder.stopRecording().then(function() {
        console.info('stopRecording success');

       var DataUrl = recorder.getDataURL();
       var random = Math.random( ); 
       DataUrl.then(function(result) {

        console.log(result) //borrar

            var url_file = dataURLtoFile(result, random +'.webm');

            console.log(url_file)
            console.log(url_file.name)


        //  var bucket = new AWS.S3({params: {Bucket: 'lsp-web/videos_test'}});
        var uploadParams = {Key: url_file.name, ContentType: url_file.type, Body: url_file};
        bucket.upload(uploadParams).on('httpUploadProgress', function(progress) {
            percentage.innerHTML = parseInt((progress.loaded * 100) / progress.total)+'%'; 
            console.log("Uploaded :: " + parseInt((progress.loaded * 100) / progress.total)+'%');
        }).send(function(err, data) {
            $('#upFile').val(null);
            $("#showMessage").show();

            var lambda = new AWS.Lambda();
            var params = {
                FunctionName: 'sagemaker-invoker',
                Payload: JSON.stringify({
                    'video': url_file.name
                })
            };
            console.log("antes de invoke")
            lambda.invoke(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);

                // If OK
                } else {

                    const glossListStr = data.Payload;
                    const glossList = JSON.parse(glossListStr)
                    console.log(glossList)
                    var ul = document.createElement("ul");
                    glossList.forEach(item => {
                      console.log(item.gloss)
                      const li = document.createElement("li");
                      li.textContent = item.gloss;
                      ul.appendChild(li);
					const queryString = li.textContent;
					
					const makeUrl = filename => `https://isolatedsigns.s3.amazonaws.com/${encodeURI(filename)}`;
					const getUrlFromNode = node => node.url.split("/")[3];
					const buildUrl = node => makeUrl(getUrlFromNode(node));
					const buildVideosSearchUrl = query => `https://cklvhhyl66.execute-api.us-east-1.amazonaws.com/?word=${query}`
					const getVideosFromServer = query => fetch(buildVideosSearchUrl(query)).then(response => response.json())
					const makeUrlSentences = filename => `https://sentencesigns.s3.amazonaws.com/${encodeURI(filename)}`;
					const getUrlFromNodeSentences = node => node.urlSentence.split("/")[3];
					const buildUrlSentence = node => makeUrlSentences(getUrlFromNodeSentences(node));
					const mapValues = nodes => nodes.map(node => ({label: node.sign_gloss, imageUrl: buildUrl(node)}));
					const mapValuesSentences = nodes => nodes.map(node => ({label: node.text, imageUrl: buildUrlSentence(node)}));
					const getListElement = () => document.getElementById("products-list");
					const getListSentence = () => document.getElementById("sentences-list");
					const buildVideoNode = ({ label, imageUrl}) =>
					`
						<div class="product-item" category="adjectives">
							<video height="205px" width="205px" controls>
								<source src="${imageUrl}" type="video/mp4">
							</video>
							<a href="#">${label}</a>
						</div>
					`

					const appendVideo = node => {
						getListElement().insertAdjacentHTML('beforeend', buildVideoNode(node))
					}
					getListElement().innerHTML = "";
					getVideosFromServer(queryString).then(mapValues).then(nodes => nodes.map(appendVideo));

                    });
                    //document.getElementById("products-list").appendChild(ul);
                    
                }
            });

        });
        
        
        
          cancelUpload.addEventListener('click', function() {
                if(request.abort()){
                    percentage.innerHTML = "Uploading has been canceled.";
                }
            });


       
// here you can use the result of promiseB
});
       
        // Retrieve recorded video as blob and display in the preview element
       /* var videoBlob = recorder.getBlob();
        var blobUrl = URL.createObjectURL(videoBlob);
        console.log("Blob url" + blobUrl);
         video.srcObject = videoBlob*/
      //  video.src = URL.createObjectURL(videoBlob);
        video.play();

        // Unmute video on preview
        video.muted = false;

        // Stop the device streaming
        recorder.stream.stop();

        // Enable record button again !
        document.getElementById('btn-start-recording').disabled = false;
    }).catch(function(error) {
        console.error('stopRecording failure', error);
    });
}, false);


