from sagemaker.pytorch import PyTorchModel
from sagemaker import get_execution_role

import os
import json

config_file = '../../configuration/config.json'

print("retrieving aws credentials...")
with open(config_file, 'r') as json_file:
    config = json.load(json_file)
    
os.environ['AWS_DEFAULT_REGION'] =  config["credential"]['region']
os.environ['AWS_ACCESS_KEY_ID'] = config["credential"]['id']
os.environ['AWS_SECRET_ACCESS_KEY'] = config["credential"]['key'] 

role = config["credential"]['role']

# You can also configure a sagemaker role and reference it by its name.
# role = "CustomSageMakerRoleName"

print("preparing pytorch model...")
'''
If you don't have model.tar.gz file, please read the readme located in this folder
'''
pytorch_model = PyTorchModel(
    model_data='s3://sagemaker-us-east-1-psl/model.tar.gz', 
    role=role, 
    framework_version="1.12.0",
    py_version="py38",
    #source_dir='./code',
    #source_dir="s3://sagemaker-us-east-1-psl/sourcedir.tar.gz",
    entry_point='inference.py')

'''
If all was ok, you will see a charging bar that means the inference is being created. 
You can check it in Sagemaker endpoint dashboard 
'''

print("deploying the model in sagemaker endpoint...")
predictor = pytorch_model.deploy(
    instance_type='ml.t2.medium',
    endpoint_name='spoter-Sagemaker-Endpoint-video-2i-27c-60a-top5',
    initial_instance_count=2)