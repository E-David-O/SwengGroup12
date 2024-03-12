# Use a Node.js base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the frontend
RUN npm run build

# Expose the port that the frontend will run on
EXPOSE 3000

# Start the frontend server
CMD ["npm", "run", "preview"]
