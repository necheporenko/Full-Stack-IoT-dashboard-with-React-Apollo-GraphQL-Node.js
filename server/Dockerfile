FROM node:10.15.1

# Create server directory
RUN mkdir -p /usr/src/graphql-api
WORKDIR /usr/src/graphql-api

# Install app dependencies
COPY package.json /usr/src/graphql-api
RUN npm install

# Bundle app source
COPY . /usr/src/graphql-api
EXPOSE 4000
CMD ["npm", "start"]