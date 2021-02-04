FROM node:14

WORKDIR /usr/monitor/client

COPY ./client/package.json /usr/monitor/client/
COPY ./client/tsconfig.json /usr/monitor/client/

RUN npm install
RUN npm install -g typescript 

COPY ./client /usr/monitor/client/
COPY ./Types.ts /usr/monitor/
COPY ./DatabaseType.ts /usr/monitor/

RUN npm run build-ts


CMD ["node", "./dist/client/main.js"]