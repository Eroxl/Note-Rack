FROM node:20.2.0

WORKDIR /usr/src/

# -=- Install Packages -=-
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# -=- Copy Source Code -=-
COPY . .

# -=- Expose The Port -=-
EXPOSE 8000

# -=- Build / Run The Code -=-
CMD [ "yarn", "run", "build" ]