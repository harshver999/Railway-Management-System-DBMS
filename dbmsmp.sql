-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: railway_ticket_reservation_system
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `passengers`
--

DROP TABLE IF EXISTS `passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passengers` (
  `passenger_ID` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `category` enum('Child','Adult','Senior Citizen','Student') DEFAULT NULL,
  `contact` int DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `concession` decimal(2,2) DEFAULT NULL,
  PRIMARY KEY (`passenger_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passengers`
--

LOCK TABLES `passengers` WRITE;
/*!40000 ALTER TABLE `passengers` DISABLE KEYS */;
/*!40000 ALTER TABLE `passengers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `route_ID` int NOT NULL,
  `station_ID` varchar(4) DEFAULT NULL,
  `arrival` time DEFAULT NULL,
  `departure` time DEFAULT NULL,
  `day` int DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `distance` int DEFAULT NULL,
  PRIMARY KEY (`route_ID`),
  KEY `station_ID` (`station_ID`),
  CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`station_ID`) REFERENCES `stations` (`station_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `train_ID` int DEFAULT NULL,
  `class` enum('1A','2A','3A','EA','EC','FC','3E','CC','SL','2S') DEFAULT NULL,
  `coach` varchar(3) DEFAULT NULL,
  `berth` enum('SL','SU','LB','MB','UB') DEFAULT NULL,
  `seat_number` int DEFAULT NULL,
  `seat_ID` int NOT NULL,
  PRIMARY KEY (`seat_ID`),
  KEY `train_ID` (`train_ID`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`train_ID`) REFERENCES `trains` (`train_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `station_ID` varchar(4) NOT NULL,
  `station_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`station_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `pnr` int DEFAULT NULL,
  `purchase_time` datetime DEFAULT NULL,
  `status` enum('WL','CNF') DEFAULT NULL,
  `ticket_number` int DEFAULT NULL,
  KEY `ticket_number` (`ticket_number`),
  CONSTRAINT `status_ibfk_1` FOREIGN KEY (`ticket_number`) REFERENCES `tickets` (`ticket_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_number` int NOT NULL,
  `pnr` int DEFAULT NULL,
  `passanger_ID` int DEFAULT NULL,
  `seat_ID` int DEFAULT NULL,
  `origin_station` varchar(4) DEFAULT NULL,
  `origin_time` datetime DEFAULT NULL,
  `destination_station` varchar(4) DEFAULT NULL,
  `destination_time` datetime DEFAULT NULL,
  `fees` decimal(6,2) DEFAULT NULL,
  `status` enum('WL','CNF') DEFAULT NULL,
  PRIMARY KEY (`ticket_number`),
  KEY `passanger_ID` (`passanger_ID`),
  KEY `seat_ID` (`seat_ID`),
  KEY `origin_station` (`origin_station`),
  KEY `destination_station` (`destination_station`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`passanger_ID`) REFERENCES `passengers` (`passenger_ID`),
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`seat_ID`) REFERENCES `seats` (`seat_ID`),
  CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`origin_station`) REFERENCES `stations` (`station_ID`),
  CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`destination_station`) REFERENCES `stations` (`station_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trains`
--

DROP TABLE IF EXISTS `trains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trains` (
  `train_ID` int NOT NULL,
  `train_name` varchar(50) DEFAULT NULL,
  `route_ID` int DEFAULT NULL,
  `running_days` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`train_ID`),
  KEY `route_ID` (`route_ID`),
  CONSTRAINT `trains_ibfk_1` FOREIGN KEY (`route_ID`) REFERENCES `routes` (`route_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trains`
--

LOCK TABLES `trains` WRITE;
/*!40000 ALTER TABLE `trains` DISABLE KEYS */;
/*!40000 ALTER TABLE `trains` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-11 23:33:22
