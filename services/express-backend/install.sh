#!/bin/bash

location=./.private
ip=$1

echo $ip
if [ "$ip" == "" ] ; 
then
    echo -n "Enter IP or HOST for SSL certificate: "
    read ip
fi

mkdir $location -p

echo generate ssl keys for "'"$ip"'"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
   -subj "//C=RU/ST=SPB/L=LOCALNET/O=MEDIATECKA/OU=BACKEND/CN="$ip \
   -keyout $location/ssl.key \
   -out $location/ssl.pem #-config ./openssl.cnf
