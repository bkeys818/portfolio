#!/bin/bash

SASS_FILES=" "
TS_FILES=" "

GITIGNORE_CONTAINS_CCS=$( [[ $SASS_FILES && $(grep "^*.css$" ".gitignore") ]] && echo " " || echo "" )
GITIGNORE_CONTAINS_JS=$( [[ $TS_FILES && $(grep "^*.js$" ".gitignore") ]] && echo " " || echo "" )
if [[ $GITIGNORE_CONTAINS_CCS || $GITIGNORE_CONTAINS_JS ]]; then
  [[ $GITIGNORE_CONTAINS_CCS ]] && sed -i '' '/*\.css/d' ".gitignore";
  [[ $GITIGNORE_CONTAINS_JS ]] && sed -i '' '/*\.js/d' ".gitignore";
  echo "commit"
fi;