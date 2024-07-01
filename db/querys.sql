-- Querys

/* 1. Obtener todos los usuarios (id, correo)
que se encuentren en un radio (a definir, de momento usa 2km)
del punto donde se reporta una mascota perdida (post.lost_in)
usando su residencia */
SELECT u.id, u.email
FROM users u
JOIN posts p 
ON ST_DWithin(
    ST_Transform(u.residence, 3857), 
    ST_Transform(p.lost_in, 3857), 
    2000
)
WHERE p.is_lost = true
AND p.id = '123e4567-e89b-12d3-a456-426614174000';


/* 2. Obtener todos los usuarios (id, correo)
que se encuentren en un radio (a definir, de momento usa 2km)
del punto donde se reporta una mascota perdida (post.lost_in)
usando su ubicacion actual */
SELECT u.id, u.email
FROM users u
JOIN posts p 
ON ST_DWithin(
    ST_Transform(u.current_location, 3857), 
    ST_Transform(p.lost_in, 3857), 
    2000
)
WHERE p.is_lost = true
    AND p.id = '0218f717-0d42-407b-9261-f35da1db50bc';


/* 3. Obtener todos los usuarios (id, correo)
cuyos puntos de residencia se encuentren en una colonia
que coinicida tambien con el punto de reporte de una mascota perdida (post.lost_in) */
WITH lost_community AS (
    SELECT colonia
    FROM communities
    JOIN posts p ON ST_Within(p.lost_in, communities.geom)
    WHERE p.id = '0218f717-0d42-407b-9261-f35da1db50bc'
		AND p.is_lost = true
    LIMIT 1
)
SELECT u.id, u.email, c.colonia
FROM users u
JOIN communities c ON ST_Within(u.residence, c.geom)
WHERE c.colonia = (SELECT colonia FROM lost_community);


/* 4. Obtener la cantidad de mascotas perdidas agrupadas por departamentos */
SELECT d.nom_dpto AS department, COUNT(p.id) AS lost_pets_count
FROM departamentos d
JOIN posts p ON ST_Within(p.lost_in, d.geom)
WHERE p.is_lost = true
GROUP BY department;


/* 5. Obtener los puntos (post.lost_in) reportes de mascotas perdias
contenidas dentro de un departamento acepta de entrada el id del departamento */ 
SELECT p.lost_in
FROM posts p
JOIN departamentos d ON ST_Within(p.lost_in, d.geom)
WHERE d.cod_dpto = '05'
  AND p.is_lost = true;


/* 6. Obtener la cantidad de mascotas perdidas agrupadas por municipios */
SELECT m.nom_mun AS municipality, COUNT(p.id) AS lost_pets_count
FROM municipios m
JOIN posts p ON ST_Within(p.lost_in, m.geom)
WHERE p.is_lost = true
GROUP BY m.nom_mun;


/* 7. Obtener los puntos (post.lost_in) reportes de mascotas perdias
contenidas dentro de un municipio acepta de entrada el id del municipio */
SELECT p.lost_in
FROM posts p
JOIN municipios m ON ST_Within(p.lost_in, m.geom)
WHERE m.id = '255'
  AND p.is_lost = true;


/* 8. Obtener la cantidad de mascotas perdidas agrupadas por colonias */
WITH lost_pets_per_community AS (
    SELECT c.colonia, p.id
    FROM communities c
    JOIN posts p ON ST_Within(p.lost_in, c.geom)
    WHERE p.is_lost = true
)
SELECT colonia, COUNT(id) AS lost_pets_count
FROM lost_pets_per_community
GROUP BY colonia;