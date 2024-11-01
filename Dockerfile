FROM node:20-alpine

WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

# Install the dependencies
RUN npm install

RUN npm run build

EXPOSE 4008

CMD [ "npm", "run", "start:dev" ]