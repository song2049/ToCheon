CREATE USER 'tocheon'@'localhost' IDENTIFIED BY 'block13';
GRANT ALL PRIVILEGES ON *.* TO 'tocheon'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'wnqudgus1234'@'localhost';

INSERT INTO TB_USER(EMAIL, PASSWORD, NAME, ROLE) values("admin@email.com", "admin", "관리자", "ADMIN");
UPDATE TB_USER SET PASSWORD="$2b$10$aQ1en58ZONvZ4VDgqpGFqOz.loCq9xKhiX1bzKWweQTytlfjsgq1a" WHERE ID=1;

SELECT * FROM TB_USER;
