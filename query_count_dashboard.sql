SELECT
	(SELECT COUNT(*) FROM saboroso.tb_contacts) AS nrcontacts,
    (SELECT COUNT(*) FROM saboroso.tb_menus) AS nrmenus,
    (SELECT COUNT(*) FROM saboroso.tb_reservations) AS nrreservations,
    (SELECT COUNT(*) FROM saboroso.tb_users) AS nrusers;