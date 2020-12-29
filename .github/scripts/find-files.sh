### Predefined Elements ###
search_for() {
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
}

### Find Files to Compile ###
search_arg="-type f \( -name '*.scss' -not -name '_*.scss' \) -o \( -name '*.sass' -not -name '_*.sass' \) \
-o -name '*.ts' \
-o -name '*.js' \
-o -name '*.html' \
-o -name '*.svg'";

files=$(./.github/scripts/search-for.sh "$search_arg");
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
    sass_sources=${sass_sources%?}
    echo "::set-output name=sass_sources::${sass_sources//$'\n'/'%0A'}"
    sass_destinations=${sass_destinations%?}
    echo "::set-output name=sass_destinations::${sass_destinations//$'\n'/'%0A'}"
    if [[ $(grep "^*.css$" ".gitignore") ]]; then
        echo "update_gitignore=true" >> $GITHUB_ENV
        [[ $GITIGNORE_CONTAINS_CCS ]] && sed -i '' '/*\.css/d' ".gitignore"
    fi
fi

if [[ $ts_files ]]; then
    ts_files=${ts_files%?}
    echo "::set-output name=ts_files::${ts_files//$'\n'/'%0A'}"
    if [[ $(grep "^*.js$" ".gitignore") ]]; then
        echo "update_gitignore=true" >> $GITHUB_ENV
        [[ $GITIGNORE_CONTAINS_CCS ]] && sed -i '' '/*\.js/d' ".gitignore"
    fi
fi

if [[ $js_files ]]; then
    js_files=${js_files%?}
    echo "::set-output name=js_files::${js_files//$'\n'/'%0A'}"
fi

if [[ $html_files ]]; then
    html_files=${html_files%?}
    echo "::set-output name=html_files::${html_files//$'\n'/'%0A'}"
fi

if [[ $svg_files ]]; then
    svg_files=${svg_files%?}
    echo "::set-output name=svg_files::${svg_files//$'\n'/'%0A'}"
fi