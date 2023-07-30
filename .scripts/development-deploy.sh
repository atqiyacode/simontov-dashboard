set -e

echo "Deploying Aplication ..."

# update codebase
git pull origin development

# install package
npm install

npm run build

echo "Application Deployed Successfully"
