FROM cusspvz/node:0.12.7

ENV CHANGE_DATE="17-Dec-2015" 

ENV VK_LOGIN="name@server.com" \
    VK_PASSW="pawssodr" \
    VK_SCOPE="audio,video"
    
ADD proxy.js /
ADD auth.js /
ADD package.json /

RUN cd / && npm install

ENTRYPOINT ["npm", "start", ${VK_LOGIN}, ${VK_PASSW}, ${VK_SCOPE}]

EXPOSE 8080 
