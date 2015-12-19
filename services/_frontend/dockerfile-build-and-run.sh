echo -n "ENTER PORT FOR FRONTEND:"
read port
echo -n "ENTER BASIC AUTH LOGIN (NOT READY):"
read BA_LOGIN
echo -n "ENTER BASIC AUTH PASSWORD (NOT READY):"
read BA_PASSW

container_name=frontend
image_name=$container_name

docker stop $container_name
docker rm $container_name
docker rmi $image_name

docker build -t $image_name .
docker run -it --env BA_LOGIN="$BA_LOGIN" --env BA_PASSW="$BA_PASSW" -p $port:443 -d --name $container_name $image_name 
