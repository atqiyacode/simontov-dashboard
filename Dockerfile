# Use an official Node.js runtime as a base image
FROM node:20-alpine 

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package* .

# Install app dependencies
RUN npm install

# Copy the app source code
COPY . .

CMD ["npm", "run", "dev"]