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