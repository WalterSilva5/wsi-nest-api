# wsi-fit-api

## Tutorial de Execução

1. Instale as dependências:
   ```bash
   yarn install 
   ou 
    npm install
    ```

2 Inicie os serviços externos:
    ```bash
    docker-compose up -d
    ```
  
3. Inicie a aplicação:
    ```bash
    yarn run start:dev
    ```

4. Acesse a documentação da API em:
    ```bash
    http://localhost:3000/api/docs
    ```

## Testes Unitários

Execute os testes unitários:
    ```bash
    yarn run test
    ```
Para verificar a cobertura de testes:
    ```bash
    yarn run test:cov
    ```