#!/bin/bash

lb=$'\n';
export IFS=":";
for file in $sass_files; do
    sources+="$file$lb";
    destinations+="${file%????}css$lb";
done;
echo "sources<<{delimiter}
${sources%?}
{delimiter}" >> $GITHUB_ENV
echo "destinations<<{delimiter}
${destinations%?}
{delimiter}" >> $GITHUB_ENV
