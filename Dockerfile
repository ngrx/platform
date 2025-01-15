FROM node:10.15.3

# Create app directory
WORKDIR /platform

COPY . .

WORKDIR /platform/projects/ngrx.io	

# Install all the dependencies, boilerplate, stackblitz, zips and run dgeni on the docs.
RUN pnpm exec setup

EXPOSE 4200

CMD ["pnpm run", "start:docker"]
