#!/bin/bash -exo pipefail

echo "Deployment v0.1.0"

export GITHUB_REPO_URL="https://${GITHUB_TOKEN}@github.com/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}.git"

if [ "${CIRCLE_BRANCH}" == "staging" ]; then

    echo "Deployment for staging not yet implemented..."

elif [ "${CIRCLE_BRANCH}" == "production" ]; then

    echo "Deployment for production not yet implemented..."
    
else

    set -exo pipefail

    export TMP_DEV_BRANCH="${CIRCLE_BRANCH}-build-${CIRCLE_BUILD_NUM}"
    export TARGET_BRANCH="development"

    # print current branches
    git branch -a

    # Register repo
    git remote -v
    git remote rm origin
    git remote add origin ${GITHUB_REPO_URL}
    git remote -v

    # Setup and sync target branch
    git checkout ${TARGET_BRANCH} || git checkout -B ${TARGET_BRANCH}
    git reset --hard HEAD
    git fetch origin ${TARGET_BRANCH} || (git push -u origin ${TARGET_BRANCH} && echo "'${TARGET_BRANCH}' branch was created on remote")
    git merge origin/${TARGET_BRANCH} || echo "No remote changes to merge"

    # merge remote target branch into local
    git add .
    git commit -am "Merge '${TARGET_BRANCH}' into local branch" || echo "Nothing to commit"

    # Clone branch being updated with a temporary branch
    echo "Setup temporary branch: ${TMP_DEV_BRANCH}"
    git checkout -B ${TMP_DEV_BRANCH}
    git merge ${CIRCLE_BRANCH}

    # Initialise project
    yarn
    yarn build

    # Initialise DB
    # yarn db:migrate
    # yarn db:seed

    # test new changes
    yarn test:ci


    # save new changes to target branch
    git add .
    git commit -am "Merge new build changes (Build ${CIRCLE_BUILD_NUM})" || echo "Nothing to commit"

    git checkout ${TARGET_BRANCH}
    git merge ${TMP_DEV_BRANCH}

    git push origin ${TARGET_BRANCH}

    # delete tmp branch
    git branch -d ${TMP_DEV_BRANCH}

fi

#### Deploy via Zeit Now

if [ -z "${NOW_ALIAS}" ] || [ -z "${NOW_TOKEN}" ]; then
    echo 'Skipping Zeit Now Deploy (NOW_ALIAS or NOW_TOKEN not set)'        
else

    set -exo pipefail
    
    echo "Zeit Now Deploying '${NOW_ALIAS}'..."

    now --alias "${NOW_ALIAS}" --token "${NOW_TOKEN}"

    if [ -z "${NOW_SCALE}" ]; then
        echo "Skipping scale command (NOW_SCALE not set)"
    else
        echo "Scaling ${NOW_ALIAS} [Min: 1, Max: ${NOW_SCALE}]"
        now scale "${NOW_ALIAS}" "1" "${NOW_SCALE}" --token "${NOW_TOKEN}"
    fi
   

    curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"Deployed ${CIRCLE_PROJECT_REPONAME} at https://${NOW_ALIAS}\"}" https://hooks.slack.com/services/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

fi


if [[ -z "${NOW_ALIAS}" ]]; then


fi

