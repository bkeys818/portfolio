#!/bin/bash

sources=""
destinations=""
lb=$'\n'

for file in $(./.github/scripts/search-files.sh "-name *.scss -not -name _*.scss"); do
    sources="$sources$lb$file";
    css="${file%.*}.css"
    destinations="$destinations$lb$css";
done;

continue=$( [[ $sources =~ ^[\S]+$ ]] && echo true || echo false )

echo "continue=$continue" >> $GITHUB_ENV

echo "sources<<{delimiter}
${sources}
{delimiter}" >> $GITHUB_ENV

echo "destinations<<{delimiter}
${destinations}
{delimiter}" >> $GITHUB_ENV
