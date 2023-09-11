import { Holistic } from "@mediapipe/holistic";

const loadHolisticModel = async () => {
  try {
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

    await holistic.initialize();

    return holistic;
  } catch (error) {
    console.error("Error loading the Holistic model:", error);
    throw error;
  }
};

export default loadHolisticModel;
