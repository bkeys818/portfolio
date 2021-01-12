#!/usr/bin/env bash
# Purpose: Build website from github repo with submodules.
#          Submodules can be set up as there own npm package.
#          Script requires git to be using ssh-key with r/w privileges.
# Author: Ben Keys
# --------------------------------------
# set -o nounset  # exit when undeclared variable is used



compile_repository() {
    set -o errexit # exit when a command fails
    set -o xtrace  # trace what gets executed (debugging)

    ### Compile only current repository ###

    # Create new branch
    git branch -f $PUB_BRANCH
    git checkout $PUB_BRANCH

    # Replace .gitignore contents
    echo "node_modules" > ".gitignore"
    git add .

    # if npm script "build" exist
    if npm run | grep -q build; then
        # Install dependencies
        npm install
        # Run build script
        npm run build
        # Commit changes
        git add .
        git commit -m ":rocket: Compile repository"
    fi

    ### Compile submodules of repository ###

    # Relative paths any submodules in repo
    submodules=$(git config --file .gitmodules --get-regexp path | awk '{ print $2 }')

    if [[ ! -z "$submodules" ]]; then
        # Exact path of this repo
        parent_repo="$(echo $PWD)"

        # Submodules' urls from HTTPS to SSH
        perl -i -p -e 's|https://(.*?)/|git@\1:|g' .gitmodules

        # Get submodules content
        git submodule init
        git submodule update

        # Loop through repo's submodules
        while IFS= read -r submodule; do
            cd "$submodule"
            compile_repository
            # if remote repo contains a branch named $PUB_BRANCH
            # Set submodule to track the new branch
            cd "$parent_repo"
            [[ ! -z "$(git ls-remote --heads origin publish)" ]] && \
            git submodule set-branch -b $PUB_BRANCH -- "$submodule"
        done <<<"$submodules"

        # Change submodules' url back from ssh to https
        perl -i -p -e 's|git@(.*?):|https://\1/|g' .gitmodules

        # Commit changes
        rm -r node_modules || echo true
        rm .gitignore
        git add .
        git commit -m ":package: Compile submodules"
    fi;


    ### Push changes to repository ###
    git push -f origin $PUB_BRANCH || echo true
}

git config --global user.name github-actions
git config --global user.email github-actions@github.com
compile_repository