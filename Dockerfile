# Use the official Nginx image as the base image
FROM nginx

# Install nano
RUN apt-get update && apt-get install -y nano

# Expose port 80
EXPOSE 80
