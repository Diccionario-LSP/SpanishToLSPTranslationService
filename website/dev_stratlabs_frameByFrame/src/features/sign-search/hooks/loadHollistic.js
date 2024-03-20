import { Holistic } from "@mediapipe/holistic";

const loadHolisticModel = async () => {
  try {
    // Load the MediaPipe Holistic model
    const holistic = new Holistic({
      locateFile: (file) => {
        return `./mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 0,
      useCpuInference: true,
      refineFaceLandmarks: false,
    });

    // Wait for the model to load
    await holistic.initialize();

    // Return the initialized Holistic model
    return holistic;
  } catch (error) {
    console.error("Error loading the Holistic model:", error);
    throw error;
  }
};

export default loadHolisticModel;
