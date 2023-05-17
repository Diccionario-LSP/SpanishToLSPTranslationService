from sagemaker.pytorch import PyTorchModel
from sagemaker import get_execution_role
#from sagemaker.autoscaling import ScalingPolicy

import os
import json

import boto3


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
    framework_version="1.12.1",
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
    instance_type='ml.c6g.large',
    endpoint_name='spoter-Sagemaker-Endpoint-AutScalFrom1to10-50c-69a-top5',
    initial_instance_count=1)

# Prepare AutoScaling
asg_client = boto3.client('application-autoscaling') # Common class representing Application Auto Scaling for SageMaker amongst other services
resource_id=f"endpoint/{predictor.endpoint_name}/variant/AllTraffic"
response = asg_client.register_scalable_target(
    ServiceNamespace='sagemaker', #
    ResourceId=resource_id,
    ScalableDimension='sagemaker:variant:DesiredInstanceCount',
    MinCapacity=1,
    MaxCapacity=10
)

'''
auto_scaling_config = ScalingPolicy(
    policy_name='AutoScalingPolicy',
    target_tracking_scaling_policy_configuration=TargetTrackingScalingPolicyConfiguration(
        target='CPUUtilization',
        target_value=50.0,
        scale_in_cooldown=8,
        scale_out_cooldown=8)
)

predictor.configure_auto_scaling(
    auto_scaling_config=auto_scaling_config
)
'''