FROM node:10.15.1

# Create server directory
RUN mkdir -p /usr/src/backend
WORKDIR /usr/src/backend

# Install app dependencies
COPY package.json /usr/src/backend
RUN npm install

# Bundle app source
COPY . /usr/src/backend
EXPOSE 4000
CMD ["npm", "start"]