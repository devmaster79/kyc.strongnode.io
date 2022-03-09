#!/bin/sh

INITIAL_FOLDER="${PWD}"
SCRIPT_FOLDER=$(realpath "$0" | sed 's|\(.*\)/.*|\1|')

# Update front
cd "${SCRIPT_FOLDER}"
cd ../front
npm install ../shared

# Update back
cd "${SCRIPT_FOLDER}"
cd ../back
npm install ../shared

# Go back
cd "${INITIAL_FOLDER}"