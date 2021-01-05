#!/usr/bin/env bash
# Purpose: Compile entire website
# Author: Ben Keys
# --------------------------------------

# Authenticate git profile
git config user.name github-actions
git config user.email github-actions@github.com

compile_repository() {
    # Create new branch
    git branch -f $PUB_BRANCH
    git checkout $PUB_BRANCH

    # Find unnecessary files and remove them
    find . \( -type d -name node_modules \) -prune -false -o \
    -type f \( -name ".gitignore" -o -name "*.md" \) -exec git rm {} \;
    git commit -m ":fire: Remove unnecessary files"

    # Compile directory
    npm run compile-site

    # Remove rest of unnecessary
    git rm -r node_modules package.json package-lock.json .github
    git add .
    git commit -m ':rocket: Compile Directory'

    # Push changes
    git push -uf origin $PUB_BRANCH
}


# Main repository
compile_repository
main_repository="$PWD"

# Submodules
submodules=$(git config --file .gitmodules --get-regexp path | awk '{ print $2 }')
while read -r submodule; do
    cd "$submodule"
    compile_repository
    cd "main_repository"
done <<< "$submodules"

git submodule update