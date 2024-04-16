# ~ Compile the typescript code
swc -C module.type=commonjs -d dist src/

# ~ Compile the typescript types
npx tsc -b .

# ~ Copy the package.json and .npmignore file to the dist folder
cp package.json dist/package.json
cp .npmignore dist/.npmignore

# NOTE: The -e flag is used to make the following sed command work on MacOS

# ~ Remove the dist folder from the package.json file
sed -i -e 's|"dist/|"./|g' ./dist/package.json
sed -i -e '/"files": \[/,/\]/d' ./dist/package.json

# ~ Remove the backup file created by the sed command
rm ./dist/package.json-e
