#!/bin/sh

# Executa os testes unitarios e e2e
NODE_ENV=local-mock-repository

echo "Executando testes unitários.."
npm run test

echo "Executando testes de de integração (modo local moked).."
npm run test:e2e

status=$?

exit $status