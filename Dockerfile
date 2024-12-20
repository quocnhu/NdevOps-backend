# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["npm", "start"]
