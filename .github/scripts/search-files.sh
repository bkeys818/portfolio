#!/bin/bash

ignore=$'./node_modules\n./.github\n./.vscode\n'
input=$1

ignore_str='-type d \( '
for i in ${ignore%?}; do
    ignore_str+="-path $i -o "
done;
ignore_str="${ignore_str%???}\) -prune -false -o"

cmd="find . $ignore_str $input"

echo $(eval $cmd);