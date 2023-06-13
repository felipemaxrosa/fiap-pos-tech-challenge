#!/bin/sh

# Executa os testes unitarios e e2e
NODE_ENV=local-mock-repository
npm run test
npm run test:e2e

# Check the exit code of the test command
if [ $? -ne 0 ]; then
  echo "Os testes falharam.. o push foi interrompido!"
  exit 1
fi

exit 0