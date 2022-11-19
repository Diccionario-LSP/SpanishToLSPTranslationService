NOTE: Remember to errase your AWS credential when you add it in "invoke.py" and "container/deploy.py", and also some Role, S3 and ECR information.

# Steps to prepare the inference

1. Place the smile-lab model in "container" folder

2. Download the Hrnet pre-trained model for keypoint estimation from [drive](https://drive.google.com/file/d/1f_c3uKTDQ4DR3CrwMSI8qdsTKJvKVt7p/view) and place it in "container/code"

3. use the yaml file placed in "container/code" called "environment.yml" to install all the dependencies the inference need in Conda. 