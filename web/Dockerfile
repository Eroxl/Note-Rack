FROM node:16

WORKDIR /usr/src/

# -=- Install Packages -=-
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# -=- Copy Source Code -=-
COPY . .

# -=- Expose The Port -=-
EXPOSE 3000

# -=- Build the server code -=-
RUN yarn run build

# -=- Build / Run The Code -=-
CMD [ "yarn", "run", "start" ]