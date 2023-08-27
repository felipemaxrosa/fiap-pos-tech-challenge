#!/bin/bash

# Get the starting path
start_path="src"

# Define the component names
components=("api" "service" "validator" "usecase" "repository")

# Iterate over the components
for component in "${components[@]}"; do
  #echo "Searching for $component files"
  
  # Find files matching the component pattern
  files=$(find "$start_path" -type f -regex ".*\.$component\.\ts" 2>/dev/null)
  
  # Iterate over the files
  for file in $files; do
   # echo "$component found: $file"
  
    # Get the component name from the file path
    component_name=$(basename "$file" ".$component.ts")

    # Get the corresponding test file
    test_file="${file%.$component.*}.${component}.spec.ts"
    
    # Check if the test file exists
    if [ ! -f "$test_file" ]; then

      # Ignore files that contain "export abstract class .*RestApi" if component is "api"
      if [ "$component" == "api" ] && grep -q "export abstract class .*RestApi" "$file"; then
        continue
      fi

      # Ignore -memory.repository.spec.ts files if the component is "repository"
      if [ "$component" == "repository" ] && [[ "$test_file" != *"-memory.repository" ]]; then
        continue
      fi

      # Ignore files that contain "export type IValidator<xxx>;" if component is "valdidator"
      if [ "$component" == "validator" ] && grep -q "export type .* = IValidator<.*>;" "$file"; then
        continue
      fi

      #echo "$test_file: You need to create and provide the test implementation for this component."
      missing_components+=("$test_file")
    # else
    #   echo "$test_file: Found test implementation for this component."
    fi

    # Check for e2e test file for api components
    if [ "$component" == "api" ]; then

      # Get the corresponding e2e test file in the test folder
      e2e_test_files=$(find "test/e2e" -type f -regex ".*/[0-9][0-9]-${component_name}\.${component}\.e2e-spec\.ts$" 2>/dev/null)
      if [ -z "$e2e_test_files" ]; then
        missing_components+=("test/e2e/${component_name}.${component}.e2e-spec.ts")
      fi
    fi
  
  #  echo "---"
  done
done

# Check if there are any missing components
if [ ${#missing_components[@]} -eq 0 ]; then
  echo "╔═══════════════════════════════════════════╗"
  echo "║   ✅ Great! You did your best in tests!   ║"
  echo "╚═══════════════════════════════════════════╝"
  exit 0  # Exit with success status
else
   counter=0
   for component in "${missing_components[@]}"; do
    ((counter++))
    echo "$counter - $component"
   done
  
  echo "╔═══════════════════════════════════════════╗"
  echo "║    🚨 Missing test implementations 🚨     ║"
  echo "║     THIS WILL BREAK YOUR PULL REQUEST     ║"
  echo "║ CONSIDER IMPLEMENTING ALL MANDATORY TESTS ║"
  echo "╚═══════════════════════════════════════════╝"
  
  # Check if the "--silent" parameter is provided, if it is, exit with success status
  [[ "$*" == *"--silent"* ]] && exit 0 || exit 1
fi