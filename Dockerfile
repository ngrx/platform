FROM node:10.15.3

# Create app directory
WORKDIR /platform

COPY . .

WORKDIR /platform/projects/ngrx.io	

# Install all the dependencies, boilerplate, stackblitz, zips and run dgeni on the docs.
RUN yarn setup

# Create a production build of the application (after installing dependencies, boilerplate, etc)
RUN yarn build

EXPOSE 4200

CMD ["yarn", "start:docker"]
