FROM node:4-onbuild

ADD proxy.js /
ADD auth.js /
ADD package.json /

RUN mkdir .private
RUN npm install

CMD ["npm", "start"]

EXPOSE 8080 
