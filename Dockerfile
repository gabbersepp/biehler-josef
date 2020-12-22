FROM node:12.18.1 as node

RUN mkdir biehlerjosef
COPY "./app" "./biehlerjosef/app"
COPY "./build" "./biehlerjosef/build"
COPY "package.json" "./biehlerjosef/"
COPY "package-lock.json" "./biehlerjosef/"

WORKDIR /biehlerjosef/
# do install as soon as possible because it takes a while. Doing it sooner won't trigger it if we touch the Dockerfile again
RUN npm install

ARG TWTR_CKEY
ARG TWTR_CSECRET
ARG TWTR_ATOKEN
ARG TWTR_ASECRET
ARG GITHUB_TOKEN
ARG DEVTO_TOKEN

ENV TWTR_CKEY=$TWTR_CKEY
ENV TWTR_CSECRET=$TWTR_CSECRET
ENV TWTR_ATOKEN=$TWTR_ATOKEN
ENV TWTR_ASECRET=$TWTR_ASECRET
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV DEVTO_TOKEN=$DEVTO_TOKEN

RUN npm run twitter 2>&1 | tee out_twitter.txt
RUN npm run contributions 2>&1 | tee out_contributions.txt
RUN npm run 11ty 2>&1 | tee out_11ty.txt

FROM nginx
COPY --from=node /biehlerjosef/app/dist /usr/share/nginx/html


