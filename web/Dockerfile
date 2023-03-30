FROM node:16.19.1

WORKDIR /usr/src/

# -=- Install Packages -=-
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# -=- Copy Source Code -=-
COPY . .

# -=- Expose The Port -=-
EXPOSE 3000

# -=- Build / Run The Code -=-
CMD [ "yarn", "run", "start" ]