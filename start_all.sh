#!/bin/bash
./stop_all.sh

./clean_start_postgres.sh

./build_start_doorman-api.sh  

