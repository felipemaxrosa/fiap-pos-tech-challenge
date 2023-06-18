#!/bin/bash

# Get the starting path
start_path="src"

# Define the component names
components=("controller" "service" "validator" "repository")

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
      #echo "$test_file: You need to create and provide the test implementation for this component."
      missing_components+=("$test_file")
    # else
    #   echo "$test_file: Found test implementation for this component."
    fi

    # # Check for e2e test file for controller components
    # if [ "$component" == "controller" ]; then
    #   # Get the corresponding e2e test file in the test folder
    #   e2e_test_file="test/e2e/.${component}.e2e.spec.ts"
    #   if [ ! -f "$e2e_test_file" ]; then
    #     missing_components+=("$e2e_test_file")
    #   fi
    # fi

    # Check for e2e test file for controller components
    if [ "$component" == "controller" ]; then
      # Get the corresponding e2e test file in the test folder
      e2e_test_file="test/e2e/${component_name}.${component}.e2e-spec.ts"
      if [ ! -f "$e2e_test_file" ]; then
        missing_components+=("$e2e_test_file")
      fi
    fi
  
  #  echo "---"
  done
done

# Check if there are any missing components
if [ ${#missing_components[@]} -eq 0 ]; then
  echo "All components have test implementations."
  exit 0  # Exit with success status
else
  echo "╔═══════════════════════════════════════════╗"
  echo "║     ⚠️ Missing test implementations ⚠️      ║"
  echo "║     THIS WILL BREAT YOUR PULL REQUEST     ║"
  echo "║      CONSIDER IMPLEMENTING THE TEST       ║"
  echo "╚═══════════════════════════════════════════╝"

   for component in "${missing_components[@]}"; do
    echo "$component"
    done
  # Check if the "--silent" parameter is provided, if it is, exit with success status
  [[ "$*" == *"--silent"* ]] && exit 0 || exit 1
fi