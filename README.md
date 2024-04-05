# SwengGroup12
Optimised Live Video Analytics at Scale (TCD Software Engineering Project)

## Steps to run the application
1. Run `docker compose up --build` from the repository root (the folder with the compose.yaml file).
2. Go to [/frontend](/frontend) folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Go to <http://localhost:3000/> to access the app.


## Additional links
1. Go to <http://localhost:3000/docs> to access frontend JSDocs.
2. Go to <http://localhost:9001/login> and input Username:`minioConnect` and Password: `connectMinio`, to access Minio Bucket.
3. On PgAdmin4 register server on address `localhost` and port `5432` and input Username: `postgres` and Password: `postgres`, to access Postgres DB.