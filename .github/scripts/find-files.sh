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

for file in $files; do
    case $file in
        *.scss | *.sass)
            sass_files+="$file$'\n'";;
        *.ts)
            ts_files+="$file$'\n'";;
        *.js)
            js_files+="$file$'\n'";;
        *.html)
            html_files+="$file$'\n'";;
        *.svg)
            svg_files+="$file$'\n'";;
    esac
done;


if [[ $sass_files ]]; then
# if [[ ! ${#sass_files[@]} -eq 0 ]]; then
#     sass_files="$(printf '%s\n' "${sass_files[@]}")"
    echo $sass_files
    echo "::set-output name=sass_files::$sass_files"
fi;

if [[ $sass_files ]]; then
# if [[ ! ${#ts_files[@]} -eq 0 ]]; then
#     ts_files="$(printf '%s\n' "${ts_files[@]}")"
    echo $ts_files
    echo "::set-output name=ts_files::$ts_files"
fi;

if [[ $sass_files ]]; then
# if [[ ! ${#js_files[@]} -eq 0 ]]; then
#     js_files="$(printf '%s\n' "${js_files[@]}")"
    echo $js_files
    echo "::set-output name=js_files::$js_files"
fi;

if [[ $sass_files ]]; then
# if [[ ! ${#html_files[@]} -eq 0 ]]; then
#     html_files="$(printf '%s\n' "${html_files[@]}")"
    echo $html_files
    echo "::set-output name=html_files::$html_files"
fi;

if [[ $sass_files ]]; then
# if [[ ! ${#svg_files[@]} -eq 0 ]]; then
#     svg_files="$(printf '%s\n' "${svg_files[@]}")"
    echo $svg_files
    echo "::set-output name=svg_files::$svg_files"
fi;