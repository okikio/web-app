FROM gitpod/workspace-full:latest

USER root

# Install custom tools, runtime, etc.
RUN apt-get update && apt-get install -y \
    && nvm i v12 && nvm alias default v12.5 && nvm use v12 && npm i yarn gulp -g \
    && apt-get install -y libx11-dev libxkbfile-dev libsecret-1-dev libgconf2-dev libnss3 libgtk-3-dev libasound2-dev twm \
    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

USER gitpod

# Install custom tools, runtime, etc.
RUN apt-get update && apt-get install -y \
    && nvm i v12 && nvm alias default v12 && nvm use v12.5 && npm i yarn gulp -g \
    && apt-get install -y libx11-dev libxkbfile-dev libsecret-1-dev libgconf2-dev libnss3 libgtk-3-dev libasound2-dev twm \
    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
# RUN apt-get update \
#    && apt-get install -y bastet \
#    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*
#
# More information: https://www.gitpod.io/docs/42_config_docker/
