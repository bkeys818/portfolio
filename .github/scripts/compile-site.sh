#!/usr/bin/env bash
# Purpose: Compile entire website
# Author: Ben Keys
# --------------------------------------


# Authenticate git profile
git config user.name github-actions
git config user.email github-actions@github.com


# Create new branch
git config user.name github-actions
git config user.email github-actions@github.com
git branch -f $PUB_BRANCH
git checkout $PUB_BRANCH


# Find unnecessary files and remove them
find . \( -type d -name node_modules \) -prune -false -o \
-type f \( -name ".gitignore" -o -name "*.md" \) -exec git rm {} \;
git commit -m ":fire: Remove unnecessary files"


# Compile directory
files=`\
find . -type d \( -path 'node_modules' -o -path '.github' \) -prune -false -o -type f \
\( -name ".gitignore" -o -name "*.md" \) -o \
\( \( -name '*.scss' -not -name '_*.scss' \) -o \( -name '*.sass' -not -name '_*.sass' \) \)\
`
while read -r file; do
    case $file in
        # Files to remove
        ".gitignore" | *".md" )
            rm -rf "$file";;
        # Sass files
        *".scss" | *".sass" )
            if [[ $sass_run ]]; then
                rm -rf "$file"
            else
                node_modules/.bin/sass .:. --embed-source-map
                rm -rf "$file"
                sass_run=0
            fi;;
    esac
done <<< "$files"


# Remove rest of unnecessary files
git rm -r node_modules package.json package-lock.json .github


# Switch submodules to publish branch
submodules=$(git config --file .gitmodules --get-regexp path | awk '{ print $2 }')
while read -r submodule; do
    git submodule set-branch --branch publihs -- "$submodule"
done <<< "$submodules"
git submodule update --remote


# Commit & push changes
git add .
git commit -m ':rocket: Compile Directory'
git push --set-upstream origin publish