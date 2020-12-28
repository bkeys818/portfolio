### Predefined Elements ###
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

### Find Files to Compile ###
search_arg="-type f \( -name '*.scss' -not -name '_*.scss' \) -o \( -name '*.sass' -not -name '_*.sass' \) \
-o -name '*.ts' \
-o -name '*.js' \
-o -name '*.html' \
-o -name '*.svg'";

files=$(search_for "$search_arg");
while IFS= read -r file; do
    case "$file" in
        *.scss | *.sass)
            sass_sources+="$file"$'\n';
            sass_destinations+="${file%????}css"$'\n';;
        *.ts)
            ts_files+="$file"$'\n';;
        *.js)
            js_files+="$file"$'\n';;
        *.html)
            html_files+="$file"$'\n';;
        *.svg)
            svg_files+="$file"$'\n';;
    esac
done <<< "$files"


if [[ $sass_sources ]]; then
    echo "sass_sources<<{delimiter}
${sass_sources%?}
{delimiter}" >> $GITHUB_ENV;
    echo "sass_destinations<<{delimiter}
${sass_destinations%?}
{delimiter}" >> $GITHUB_ENV;
fi;

if [[ $ts_files ]]; then
    echo "ts_files<<{delimiter}
${ts_files%?}
{delimiter}" >> $GITHUB_ENV;
fi;

if [[ $js_files ]]; then
    echo "js_files<<{delimiter}
${js_files%?}
{delimiter}" >> $GITHUB_ENV;
fi;

if [[ $html_files ]]; then
    echo "html_files<<{delimiter}
${html_files%?}
{delimiter}" >> $GITHUB_ENV;
fi;

if [[ $svg_files ]]; then
    echo "svg_files<<{delimiter}
${svg_files%?}
{delimiter}" >> $GITHUB_ENV;
fi;