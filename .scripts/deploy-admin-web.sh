set -e

echo "Deploying Aplication ..."

# update codebase
git pull origin dev-admin-web

# install package
npm install

npm run build

echo "Application Deployed Successfully"
