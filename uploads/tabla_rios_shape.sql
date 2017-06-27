SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;
CREATE TABLE "tabla_rios" (gid serial,
"id" int4,
"nombre" varchar(25),
"rios_lim" varchar(30));
ALTER TABLE "tabla_rios" ADD PRIMARY KEY (gid);
SELECT AddGeometryColumn('','tabla_rios','geom','4326','MULTILINESTRING',2);
