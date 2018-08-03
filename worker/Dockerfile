FROM rocker/r-ver:3.5
MAINTAINER soedomoto@gmail.com

RUN apt-get update \
    && apt-get install -y libgit2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update \
    && apt-get install -y libxml2-dev libcurl4-openssl-dev libssl-dev libhiredis-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN Rscript -e "install.packages(c('devtools', 'redux', 'reticulate', 'processx'))"
RUN Rscript -e "install.packages(c('XML', 'xtable', 'foreign', 'base64enc', 'tidyverse', 'dplyr', 'ggplot2'))"
