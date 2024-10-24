# Use an official Python runtime as a parent image
FROM node:18 as build
# Set the working directory
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY package.json yarn.lock ./
# Install the required dependencies
RUN yarn
# Copy the rest of the application code to the container
COPY . .
# Build the React app for production
RUN yarn build
# Add static server serve
RUN yarn global add serve
# Expose the port the app will run on
EXPOSE 5000
# Command to serve the app using 'serve'
CMD ["serve", "-s", "./build", "-l", "5000"]