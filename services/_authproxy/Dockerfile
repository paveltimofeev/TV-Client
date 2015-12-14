FROM node:4-onbuild

ENV CHANGE_DATE="14-Dec-2015" 

ENV VK_LOGIN="name@server.com" \
    VK_PASSW="pawssodr" \
    VK_SCOPE="audio,video"
    
ADD proxy.js /
ADD auth.js /
ADD package.json /

RUN npm install

CMD ["npm", "start", ${VK_LOGIN}, ${VK_PASSW}, ${VK_SCOPE}]

EXPOSE 8080 
