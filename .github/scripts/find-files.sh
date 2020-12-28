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

lb=$'\n'

while IFS= read -r file; do
    case "$file" in
        *.scss | *.sass)
            sass_files+="$file$lb";;
        *.ts)
            ts_files+="$file$lb";;
        *.js)
            js_files+="$file$lb";;
        *.html)
            html_files+="$file$lb";;
        *.svg)
            svg_files+="$file$lb";;
    esac
done <<< "$files"


if [[ $sass_files ]]; then
    echo "::set-output name=sass_files::\"${sass_files%?}\""
fi;

if [[ $sass_files ]]; then
    echo "::set-output name=ts_files::\"${ts_files%?}\""
fi;

if [[ $sass_files ]]; then
    echo "::set-output name=js_files::\"${js_files%?}\""
fi;

if [[ $sass_files ]]; then
    echo "::set-output name=html_files::\"${html_files%?}\""
fi;

if [[ $sass_files ]]; then
    echo "::set-output name=svg_files::\"${svg_files%?}\""
fi;