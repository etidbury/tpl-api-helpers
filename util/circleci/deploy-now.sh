#!/bin/bash -exo pipefail

echo "Deployment v0.1.0"

if [ "${CIRCLE_BRANCH}" == "staging" ]; then
    set -exo pipefail
else
    
    echo "Deployment"

fi