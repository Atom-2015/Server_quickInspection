# FROM node:20

# WORKDIR /myapp

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm" , "start"]

FROM node:20

WORKDIR /myapp

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
