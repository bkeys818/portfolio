ignore=$'./node_modules\n./.github\n'
search_for() {
    if [[ $ignore ]]; then
        ignore_str='\( ';
        for item in $ignore; do
            ignore_str+="-path $item -o ";
        done;
        ignore_str="${ignore_str%???}\) -prune -false -o";
        echo "$(eval "find . $ignore_str \( $1 \)")";
    else
        echo "$(eval "find . $1")";
    fi;
}
search_arg="-type f \( -name '*.scss' -not -name '_*.scss' \) -o \( -name '*.sass' -not -name '_*.sass' \) -o -name '*.ts' -o -name '*.js' -o -name '*.html' -o -name '*.svg'";
files=$(search_for "$search_arg");

while IFS= read -r file; do
    case "$file" in
        *.scss | *.sass)
            sass_files+="$file:";;
        *.ts)
            ts_files+="$file:";;
        *.js)
            js_files+="$file:";;
        *.html)
            html_files+="$file:";;
        *.svg)
            svg_files+="$file:";;
    esac
done <<< "$files"


[[ ! -z "$sass_files" ]] && sass_files=${sass_files%?}
# echo "::set-output name=sass_files::$sass_files"

[[ ! -z "$ts_files" ]] && ts_files=${ts_files%?}
# echo "::set-output name=ts_files::$ts_files"

[[ ! -z "$js_files" ]] && js_files=${js_files%?}
# echo "::set-output name=js_files::$js_files"

[[ ! -z "$html_files" ]] && html_files=${html_files%?}
# echo "::set-output name=html_files::$html_files"

[[ ! -z "$svg_files" ]] && svg_files=${svg_files%?}
# echo "::set-output name=svg_files::$svg_files"
