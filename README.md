# Templete for new node express app with authentication built in

## Quick postgress database setup

```
$ sudo su - postgres
$ psql
CREATE ROLE application_user WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'application_user';
\q
$ exit
$ psql -U application_user -d postgres -h 127.0.0.1 -W
CREATE database application_database
```
## migrations

To generate migrations after modifications on entities:
`npm run typeorm migration:generate -- -n migrationName`

To run the migrations:
`npm run typeorm migration:run`
