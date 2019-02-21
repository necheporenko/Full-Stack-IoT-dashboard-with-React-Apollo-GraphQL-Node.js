FROM node:10.15.1

# Create server directory
RUN mkdir -p /usr/src/frontend
WORKDIR /usr/src/frontend

# Install app dependencies
COPY package.json /usr/src/frontend
RUN npm install

# Bundle app source
COPY . /usr/src/frontend
EXPOSE 3000
CMD ["npm", "start"]