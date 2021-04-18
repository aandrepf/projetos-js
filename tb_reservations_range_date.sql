SELECT
	CONCAT(YEAR(date), '-', MONTH(date)) AS date,
    COUNT(*) AS total,
    SUM(people) / COUNT(*) as avg_people
FROM saboroso.tb_reservations
WHERE
	date BETWEEN '2017-09-24' AND '2018-09-24'
GROUP BY YEAR(date) DESC, MONTH(date) DESC
ORDER BY YEAR(date) DESC, MONTH(date) DESC;