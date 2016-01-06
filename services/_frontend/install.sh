location=/frontend/.private
usr=$1
pas=$2
ip=$3

if [ "$ip" == "" ] ; 
then
    echo -n "Enter IP or HOST for SSL certificate: "
    read ip
fi

mkdir $location -p

echo generate ssl keys
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
   -subj "//C=UK/ST=SPB/L=LOCALNET/O=MEDIATECHA/OU=FRONTEND/CN="$ip \
   -keyout $location/ssl.key \
   -out $location/ssl.pem #-config ./openssl.cnf

echo generate basic auth login/pass
echo -n "$usr:" > $location/.htpasswd
openssl passwd -apr1 $pas >> $location/.htpasswd
cat $location/.htpasswd
