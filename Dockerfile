FROM node:10.15.3

# Create app directory
WORKDIR /platform

COPY . .

WORKDIR /platform/projects/ngrx.io	

EXPOSE 4200

CMD ["yarn", "start"]
