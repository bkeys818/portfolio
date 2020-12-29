if [[ $ignore ]]; then
    ignore_str="\( "
    for item in $ignore; do
        ignore_str+="-path $item -o "
    done
    ignore_str="${ignore_str%???}\) -prune -false -o"
    echo "$(eval "find . $ignore_str \( $1 \)")"
else
    echo "$(eval "find . $1")"
fi