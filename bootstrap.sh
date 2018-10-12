export AUTOKILL_AFTER_ITERATION=20
export MAX_WORKER=3
export APP_DIR=./worker
export MODULE_DIR=../analev-module
export WORKSPACE_DIR=../analev-workspace
export DATA_DIR=../data
export REDIS_HOST=ec2-34-214-232-140.us-west-2.compute.amazonaws.com
export MYSQL_HOST=my-analev.c5vuep5dmqph.us-west-2.rds.amazonaws.com
export MySQL_USER=analev
export MySQL_PASSWORD=analevelana
export MYSQL_DATABASE=analev

nohup Rscript ./worker/manager.R &
Rscript ./worker/logger.R