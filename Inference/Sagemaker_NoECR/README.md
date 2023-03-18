# How to prepare the model_inference_format folder
Note: we change "model" by the name of the model we are using to

inside that folder you have to place the model and the code you will use for the inference.
This have to be in an specific structure
|- code/
|     - requirement.txt
|     - inference.py
|- model.pth

where:
* ***requirement.txt*** is the file where are located the dependencies to make the model work
* ***inference.py*** is the file which is referenced in deploy.py where you can find the functions that make the inference work.
* ***model.pth*** is the pre-trained model saved

more information about the structure and the use of sagemaker SDK can be found [here](https://sagemaker.readthedocs.io/en/stable/frameworks/pytorch/using_pytorch.html#bring-your-own-model)

***IMPORTANT***
The file "inference.py" have to have necessary functions:
- def input_fn(request_body, request_content_type):
- def predict_fn(input_data, model):
- def model_fn(model_dir): 
- def output_fn(prediction, content_type):

# Steps to set the inference in production

1. Prepare all the files mentioned before
2. check if the necessary function are set in inference.py
3. got to the "model_inference_format" folder (spoter_inference_format is been used in this example)
4. put in that folder the model.pth prepared in the training of spoter model
5. check if all the parameters in code/config.json are the same as the pre-trained model
6. if it is necessary, the file "code/meaning.json" have to be replaced
7. run 'tar czvf model.tar.gz *' to compress the model and the code folder
8. upload this compress file in the specific AWS S3 bucket for that purpouse 
9. go back to the previous folder
10. In "deploy.py" check if all the parameters are as desired (Note: don't forget to prepare aws configuration)
11. run 'python deploy.py'  

# Lessons learned

* Prepare requirement.txt without version to adapt it in the sagemaker endpoint platform
* Sagemaker pip library is all you need to deploy the endpoint (it also possible using the dashboard but is more complicated because you have to configure it manually)
* Always check CloudWatch to know what happend when it deploys.
* Also, when you are coding, left some message using logging library because you can check it on CloudWatch

```
logger = logging.getLogger(__name__)
c_handler = logging.StreamHandler()
c_handler.setLevel(logging.WARNING)
c_format = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
c_handler.setFormatter(c_format)
logger.addHandler(c_handler)
```
* The way the code runs locally is different in sagemaker, you need to add "code" folder in all the imports and in the paths if you use some files such as 'scv', 'json', etc. To solve the first you can add this code at the beginning of the code
```
import sys
sys.path.append('./code')
```
* in "def model_fn(model_dir)" the model_dir variable only have the path to the root where the model is located. So, you need to add the name of the model to this path.

* in the script used for deploy, remember to use in PyTorchModel the following parameters  'framework_version" higher than "1.9.0" to be able to use "py38" in "py_version" 

Note: To train a model you have to use "ConnectingPoints" repository and follow the readme of this respository, or download our preprocessed Hdf5 files from our google drive (this will be added in the future) and modify the dataset path in the config.json of this folder.