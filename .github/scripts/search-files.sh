#!/bin/bash

if [[ $ignore ]] && [[ ! $ignore_str ]]; then
    ignore_str='\( '
    for item in $ignore; do
        ignore_str+="-path $item -o "
    done;
    ignore_str="${ignore_str%???}\) -prune -false -o"
    # echo "ignore_str=$ignore_str" >> $GITHUB_ENV
fi;

echo "$(eval "find . $ignore_str \( $1 \)")"