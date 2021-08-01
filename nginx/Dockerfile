FROM nginx:latest
MAINTAINER HyunminLee "gusals005@hanyang.ac.kr"

WORKDIR /etc/nginx
RUN apt-get update
RUN apt-get install -y vim

COPY ./.vimrc .vimrc
RUN mv .vimrc ~/.vimrc

EXPOSE 80
