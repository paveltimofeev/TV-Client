
echo "Type login:"
read LOGIN
echo "Type password:"
read PASSW

docker build -t vk-auth-proxy .
docker run -it --rm --env VK_LOGIN="$LOGIN" VK_PASSW="$PASSW" --name auth-proxy vk-auth-proxy
