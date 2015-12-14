FROM node:4-onbuild

ENV CHANGE_DATE="14-Dec-2015"

ADD backend ./backend/
ADD package.json ./

RUN npm install -g swagger
RUN npm install

CMD ["swagger", "project", "start", "backend"]

EXPOSE 10010
