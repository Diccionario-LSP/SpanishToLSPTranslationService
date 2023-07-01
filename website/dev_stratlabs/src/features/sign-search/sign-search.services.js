/* eslint-disable no-debugger */
import API from "utils/axios-config";
import AWS from "utils/aws-config";
import { AWS_CONFIG } from 'constants'

export const useSignSearchService = () => {

    const uploadLandmarks = async (landmarks) => {
        const lambda = new AWS.Lambda();

        const keypoints = landmarks.map(l => {
            return {
                pose_landmarks: l.poseLandmarks || [],
                face_landmarks: l.faceLandmarks || [],
                left_hand_landmarks: l.leftHandLandmarks || [],
                right_hand_landmarks: l.rightHandLandmarks || [],
            }
        });

        const params = {
            FunctionName: AWS_CONFIG.LAMBDA_SAGEMAKER_INOKER,
            Payload: JSON.stringify({
                keypoints: keypoints
            })
        };

        return new Promise((resolve, reject) => {
            lambda.invoke(params, (err, data) => {
                if (err) {
                    console.log(err, err.stack);
                    reject(err);
                }
                else {

                    const raw = JSON.parse(data.Payload);
                    if (!raw) return [];

                    const result = raw.filter(r => !!r.gloss)
                        .map(r => {
                            return {
                                word: r.gloss
                            }
                        })

                    resolve(result);
                }
            });
        });
    };

    return {
        uploadLandmarks,
    };
};
