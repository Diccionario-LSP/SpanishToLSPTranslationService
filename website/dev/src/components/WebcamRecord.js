import React, { useEffect, useRef, useState, useCallback } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";


export default function WebcamRecord() {
  // CAMERA
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  const recordingRef = useRef(false);
  const inPreparationRef = useRef(false);

  // RECORDS
  const [accumulatedResults, setAccumulatedResults] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const isInitialMount = useRef(true);

  // MODEL
  const holisticRef = useRef(null);
  const doHolisticRef = useRef(false);
  const detectingHandsRef = useRef(true);

  //SQUARES
  const [showSquares, setShowSquares] = useState(false)

  // CANVAS MESSAGE
  const messageRef = useRef("");
  // eslint-disable-next-line
  const [message, setMessage] = useState("");

  // Function to set the message value
  const updateMessage = useCallback((newMessage) => {
    setMessage(newMessage);
    messageRef.current = newMessage
  },[]);

  // Function to stop the capture
  const handleStopCapture = useCallback(() => {
    updateMessage("procesando...");
    console.log("deteniendo");
    doHolisticRef.current = false;
    setCapturing(false);
  }, [updateMessage]);

  // Function to start the capture
  const handleStartCapture = useCallback(() => {
    updateMessage("grabando");
    setCapturing(true);
    doHolisticRef.current = true;
    setTimeout(handleStopCapture, 2000); // Stop recording after 2 seconds
  }, [handleStopCapture, updateMessage]);

  // UseEffect to handle the accumulated results and trigger further actions
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (!capturing && accumulatedResults.length > 0) {
        console.log("running handleDownload");
        console.log(accumulatedResults);
        setAccumulatedResults([]);
        detectingHandsRef.current = true;
        // handleModelProcess();
        updateMessage("Póngase en posición")
        setShowSquares(true)
      }
    }
  }, [capturing, accumulatedResults, setAccumulatedResults, updateMessage]);


  // Give the user some seconds before recording
  const preparation = () => {
    console.log("Preparation");
    let timeLeft = 3;
    const videoTimer = setInterval(() => {
      updateMessage(`Prepárate...\n${timeLeft}`);
      if (timeLeft < 0) {
        inPreparationRef.current = false;
        recordingRef.current = true;
        clearInterval(videoTimer);
        console.log("grabando");
        handleStartCapture();
      }
      timeLeft -= 1;
    }, 900);
  };

  // Function to get keypoint landmarks from mediapipe
  function onResults(results) {
    if(messageRef.current === "Cargando modelos..."){
      updateMessage("Póngase en posición")
      setShowSquares(true)
    }

    if (results) {
      // 2 HANDS and FACE SQUARE
      if (detectingHandsRef.current) {
        if (results.poseLandmarks) {
          const {
            poseLandmarks: {
              15: { x: x15, y: y15 },
              17: { x: x17, y: y17 },
              19: { x: x19, y: y19 },
              16: { x: x16, y: y16 },
              18: { x: x18, y: y18 },
              20: { x: x20, y: y20 },
              2: { x: x2, y: y2 },
              5: { x: x5, y: y5 },
            },
          } = results;

          const left_hand_x = (x15 + x17 + x19) / 3;
          const left_hand_y = (y15 + y17 + y19) / 3;

          const right_hand_x = (x16 + x18 + x20) / 3;
          const right_hand_y = (y16 + y18 + y20) / 3;

          const eye_x = (x2 + x5) / 2;
          const eye_y = (y2 + y5) / 2;

          if (
            left_hand_x > 0.6 &&
            right_hand_x <= 0.3 &&
            left_hand_x < 1.0 &&
            right_hand_x > 0.0 &&
            left_hand_y > 0.77 &&
            right_hand_y > 0.77 &&
            left_hand_y < 1.0 &&
            right_hand_y < 1.0 &&
            eye_y < 0.33 &&
            eye_y > 0.0 &&
            eye_x < 0.6 &&
            eye_x > 0.3
          ) {
            console.log("detected");
            detectingHandsRef.current = false;
            inPreparationRef.current = true;
            setShowSquares(false)
            preparation();
          }
        }
      }

      if (doHolisticRef.current) {
        setAccumulatedResults((prevResults) => [...prevResults, results]); // Accumulate the results
      }
    }
  }


  const prepareCameraHolistic = () => {
    return new Promise((resolve, reject) => {
      // Create video element
      const videoElement = webcamRef.current;
  
      if (videoElement) {
        // CameraUtils is a separate library that provides the Camera class
        cameraRef.current = new Camera(videoElement, {
          onFrame: async () => {
            if (
              videoElement &&
              holisticRef.current &&
              (detectingHandsRef.current || doHolisticRef.current)
            ) {
              await holisticRef.current.send({ image: videoElement });
            }
          },
        });
        cameraRef.current.start();
  
        resolve();
      } else {
        reject(new Error('No se encontró referencia al elemento de video'));
      }
    });
  };

  // Initialize the Holistic model
  const initializeHolistic = () => {
    return new Promise((resolve, reject) => {
      const holistic = new Holistic({
        locateFile: (file) => {
          return `./mediapipe/holistic/${file}`;
        },
      });
      holistic.setOptions({
        modelComplexity: 1,
      });
  
      holisticRef.current = holistic;
      holistic.onResults(onResults);
  
      resolve(); 
    });
  };

  const initializeModel = () => {
    updateMessage("Cargando modelos...")

    //PROMISE
    initializeHolistic().then((response) => {
      //PROMISE
      prepareCameraHolistic().then(()=>{
        console.log("Camera Holistic inicializado")
      })
      .catch((error) => {
        console.log("Error en cameraHolistic", error);
        updateMessage("Error al cargar la camara holistic");
      });

    })
    .catch((error) => {
      console.log("Error en initializeHolistic", error);
      updateMessage("Error al cargar los modelos");
    });
  };
  

  useEffect(() => {
    return () => {
      console.log("Closing camera");
      if (cameraRef.current && cameraRef.current.close) {
        cameraRef.current.close();
      }
    };
  }, []);

   
  useEffect(() => {
    let stream = null;

    const handleUserMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamRef.current.srcObject = stream;

        // Perform actions or handle events when the webcam stream is loaded
        webcamRef.current.onloadedmetadata = () => {
          console.log("Webcam stream loaded");
          setMessage("Webcam stream loaded");
          // Additional actions or event handling code here
          initializeModel()
        };
      } catch (error) {
        console.log("Error accessing webcam:", error);
        setMessage("Error accessing webcam");
      }
    };

    handleUserMedia();

    return () => {

      if (cameraRef.current) {
        cameraRef.current.stop();
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  // This line and comment ensure that the camera load once at the beginning
  // eslint-disable-next-line
  }, []);

  return (
    <div className="BusquedaSeña__webcam-container">
      <div className="BusquedaSeña__contenedor-video">
        <video ref={webcamRef} autoPlay playsInline className="BusquedaSeña__video" />
        {showSquares && <div className="BusquedaSeña__cuadrado_1"></div>}
        {showSquares && <div className="BusquedaSeña__cuadrado_2"></div>}
        {showSquares && <div className="BusquedaSeña__cuadrado_3"></div>}
      </div>
      <div className="BusquedaSeña__message">{messageRef.current}</div>
     </div>
  );
}
