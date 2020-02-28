FROM node:10.19.0-alpine3.9 AS build

ADD package.json /tmp
WORKDIR /tmp
RUN npm install

WORKDIR /app
ADD . /app
RUN cp -R /tmp/node_modules /app/node_modules
RUN npm run build

FROM google/cloud-sdk

WORKDIR /app
COPY --from=build /app/dist /app
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/docker/entrypoint.sh /app/entrypoint.sh
COPY --from=build /app/firebase-service-account.json /app/firebase-service-account.json

CMD bash entrypoint.sh
