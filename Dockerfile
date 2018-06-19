FROM node:latest

LABEL maintainer=njohnhale@gmail.com

# set the working directory
WORKDIR /app

# copy source
COPY . .

# install dependencies
RUN npm install

# expose GRPC ports
EXPOSE 50051

# run as anonymous user
USER 1001

ENTRYPOINT ["npm", "start"]
