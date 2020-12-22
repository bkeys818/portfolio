# Repository Template for Websites


### Ignored files

Will ignore any file ending in **".map"**

If you are using [some] compiler in replace of [some] file type, then add [this] to your .gitignore

| If Using Compiler | In Replace of | Add to .gitignore |
| :---------------: | :-----------: | :---------------: |
|       Sass        |      CSS      |       *.css       |
|    Typescript     |  Javascript   |       *.js        |



### Compile Website Action

When the repository is pushed to, it does the following...

- Creates new publish branch
- Compiles any Sass files and replaces it with minfied CSS
- Compiles any Typescript files and replaces it with JS

