echo "ENTER PORT FOR BACKEND:"
read port
docker build -t backend .
docker run -it --rm -p $port:10010/tcp -d=false --name backend backend 

