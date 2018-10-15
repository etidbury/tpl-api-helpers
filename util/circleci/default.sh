# quit as soon as a command fails
set -e -v
echo "Deployment v1.0.0"

GITHUB_REPO_URL="https://${GITHUB_TOKEN}@github.com/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}.git"
TMP_DEV_BRANCH="${CIRCLE_BRANCH}-build-${CIRCLE_BUILD_NUM}"
TARGET_BRANCH="development"

## SEQUELIZE
USE_SEQUELIZE=true
#SEQUELIZE_AUTO_CONNECT=true
SEQUELIZE_SYNC=true
SEQUELIZE_SYNC_FORCE=true

## Load fixtures upon starting API
FIXTURES=true
## MySQL Connection Settings
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB_NAME="db_${CIRCLE_PROJECT_REPONAME}"

# Register repo
git remote -v
git remote rm origin
git remote add origin ${GITHUB_REPO_URL}
git remote -v

# Setup and sync target branch
git checkout -B ${TARGET_BRANCH}
git reset --hard HEAD
((git fetch origin ${TARGET_BRANCH} || echo "No remote branch '${TARGET_BRANCH}' yet"))
((git merge origin/${TARGET_BRANCH} || echo "No remote branch '${TARGET_BRANCH}' to merge"))

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
git commit -am "Merge new build changes (Build ${CIRCLE_BUILD_NUM})"
git checkout ${TARGET_BRANCH}
git merge ${TMP_DEV_BRANCH}
git push origin ${TARGET_BRANCH}


# delete tmp branch
git branch -d ${TMP_DEV_BRANCH}
