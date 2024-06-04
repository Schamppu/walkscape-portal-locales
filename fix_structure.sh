#!/bin/bash
OVERWRITE=false

while getopts f:o flag
do
  echo
    case "${flag}" in
        o) OVERWRITE=true;;
        f) FOLDER=${OPTARG};;
    esac
done

for filename in "$FOLDER"/*
do
  echo ./fix_json.js "$($OVERWRITE && echo "-o")" "$filename"
  node ./fix_json.js "$($OVERWRITE && echo "-o")" "$filename"
done