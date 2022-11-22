NOTE: Remember to errase your AWS credential when you add it in "invoke.py" and "container/deploy.py", and also some Role, S3 and ECR information.

# Steps to prepare the inference

1. prepare the config.json file located in configuration folder in the main folder.

2. Place the smile-lab model in "container" folder and call it "model" (.pt or .pth)

3  You can use "download_kp_model.sh" file (in container/code) or this  [link](https://drive.google.com/file/d/1f_c3uKTDQ4DR3CrwMSI8qdsTKJvKVt7p/view) to download the Hrnet pre-trained model for keypoint estimation. this file have to be located in "code"

## In case you want to try the inference
1. use the yaml file placed in "container/code" called "environment.yml" to install all the dependencies the inference need in Conda. 

# Files used to as part of the DockerFile creation process

* config.properties: It have the configuration of torchserve service
* deep_learning_container.py: It helps to manage the model pointed in a S3 bucket
* Dockerfile: File to create the Docker image
* Invoke.py: Its complete version is in AWS lamda also called as "invoke.py"
* torchserve-entrypoint.py: [and torchserve-ec2-entrypoint.py] this both files are used by otrchserve to manage sagemaker function. We do not know which one we have to use.
* container folder: It is used to copy all the "smile-lab" scripts and model at once to the docker image.

## under container foldel
* deploy.py: used to initialize the sagemaker endpoint
* local_test.py: It is used to try locally the inference. At the same time, this file have another version of "input_fn, model_fn, predict_fn, output_fn" but here it is called as "preprocess, Inference, postprocess". We saved it in case this one is the one we have to use in the inference (in this case, it have to be placed in code folder).
* model.pt: the pre-trained PSL recognition model. If it is not here, you have to train a new one or ask us to share you one.
* code folder: It have all the scripts to make the inference work