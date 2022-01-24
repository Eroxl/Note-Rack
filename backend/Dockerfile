FROM node:14

WORKDIR /usr/src/

# -=- Install Packages -=-
COPY package*.json ./
RUN npm install --global yarn
RUN yarn

# -=- Copy Source Code -=-
COPY . .

# -=- Expose The Port -=-
EXPOSE 8000

# -=- Build / Run The Code -=-
CMD [ "yarn", "run", "build" ]