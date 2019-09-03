FROM gitpod/workspace-full

USER root

# Install custom tools, runtime, etc.
RUN apt-get update && apt-get install -y \
    && nvm i v12.5 && nvm alias default v12.5 && nvm use v12.5 && npm i yarn -g \
    && npm i gulp -g

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
# RUN apt-get update \
#    && apt-get install -y bastet \
#    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*
#
# More information: https://www.gitpod.io/docs/42_config_docker/
