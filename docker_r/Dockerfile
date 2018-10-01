FROM rocker/r-ver:3.5
MAINTAINER soedomoto@gmail.com

RUN apt-get update \
    && apt-get install -y libgit2-dev \
    && apt-get install -y libxml2-dev libcurl4-openssl-dev libssl-dev libhiredis-dev pkg-config \
    && apt-get install -y libmariadbclient-dev \
    && rm -rf /var/lib/apt/lists/*

RUN Rscript -e "install.packages(c('devtools'))"
RUN Rscript -e "install.packages(c('processx'))"
RUN Rscript -e "install.packages(c('redux'))"
RUN Rscript -e "install.packages(c('RMySQL'))"
RUN Rscript -e "install.packages(c('readr'))"
RUN Rscript -e "install.packages(c('XML'))"
RUN Rscript -e "install.packages(c('xtable'))"
RUN Rscript -e "install.packages(c('foreign'))"
RUN Rscript -e "install.packages(c('base64enc'))"
RUN Rscript -e "install.packages(c('tidyverse'))"
RUN Rscript -e "install.packages(c('reticulate'))"
RUN Rscript -e "install.packages(c('ggplot2'))"
RUN Rscript -e "install.packages(c('broom'))"
RUN Rscript -e "install.packages(c('rlist'))"
RUN Rscript -e "install.packages(c('gridExtra'))"
RUN Rscript -e "install.packages(c('uuid'))"