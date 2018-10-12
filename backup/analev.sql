-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 08, 2018 at 03:22 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `analev`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_model`
--

CREATE TABLE `data_model` (
  `id` varchar(36) NOT NULL,
  `location` varchar(255) NOT NULL,
  `extension` varchar(10) NOT NULL,
  `label` varchar(255) NOT NULL,
  `r_handler` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_model`
--

INSERT INTO `data_model` (`id`, `location`, `extension`, `label`, `r_handler`) VALUES
('05cc5ee3-ecc3-4787-b24a-5e2001169083', 'podes/2014/Podes2014-Kabupaten_Perhubungan (Sumatera Barat).sav', 'sav', 'Podes2014-Kabupaten_Perhubungan (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('07eb19f4-5155-4515-96f8-b250807ff62b', 'susenas/2016/KOR15IND_1302.sav', 'sav', 'KOR15IND_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('0973f412-3ce8-49c9-a72c-1d2ab8b720ab', 'se/2016/1302-SE2016-Listing.sav', 'sav', '1302-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('1099ab21-1ccc-4c6f-9e3b-2780ab5f0907', 'se/2016/1371-SE2016-Listing.sav', 'sav', '1371-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('147ef28c-daaf-4e33-91fb-2042d0a59ac3', 'susenas/2017/KOR17IND_1302.sav', 'sav', 'KOR17IND_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('19608638-4734-4bda-a607-ad416ccb15b3', 'se/2016/1310-SE2016-Listing.sav', 'sav', '1310-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('20072574-daba-4494-989b-71269d05f276', 'susenas/2016/B41_ART_1302.sav', 'sav', 'B41_ART_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('24f2eee1-8975-4205-aa2e-7d76847d7cd3', 'se/2016/RDSE2016Sumbar.sav', 'sav', 'RDSE2016Sumbar.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('2a37c136-3b3d-498a-8b0e-4dca71bacd4b', 'susenas/2016/B41_ART_B431_1302.sav', 'sav', 'B41_ART_B431_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('308c98af-fb4f-4e86-9066-7e8bd2ecc373', 'se/2016/1377-SE2016-Listing.sav', 'sav', '1377-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('3540250b-1545-4c77-951d-9216f9a82738', 'susenas/2016/Justifikasi Analisis PPH Konsumsi Pangan Data Susenas  -EED_1302_2015.xlsm', 'xlsm', 'Justifikasi Analisis PPH Konsumsi Pangan Data Susenas  -EED_1302_2015.xlsm', ''),
('375cd7cb-9a78-4470-8515-ef8661804126', 'susenas/2016/BLOK41_GAB_1302_PPH.sav', 'sav', 'BLOK41_GAB_1302_PPH.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('3f13d941-7a20-4386-8f6d-559b05e953b4', 'podes/2014/Podes2014-Kecamatan_Transportasi (Sumatera Barat).sav', 'sav', 'Podes2014-Kecamatan_Transportasi (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('3f653a26-c16c-49d1-93b2-549063cff5d4', 'list.py', 'py', 'list.py', ''),
('43e4b480-b4fd-4606-8e76-266132f42d57', 'se/2016/1312-SE2016-Listing.sav', 'sav', '1312-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('5172bce8-7151-4c5f-8571-12a6410b93e0', 'susenas/2016/pph_kirim.xls', 'xls', 'pph_kirim.xls', ''),
('631590b7-cbc4-438a-8271-fe126bbe15b6', 'susenas/2017/BLOK42_1302.sav', 'sav', 'BLOK42_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('640fbf1a-fcc1-4bca-acdd-c45d02100df5', 'se/2016/1376-SE2016-Listing.sav', 'sav', '1376-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('66e20ea6-0e4c-4401-a56e-08f69e18b13b', 'susenas/2016/pph.xls', 'xls', 'pph.xls', ''),
('6a09bfd6-2c6a-462a-b5f3-f0330c1842fe', 'podes/2014/Podes2014-Kabupaten_Industri (Sumatera Barat).sav', 'sav', 'Podes2014-Kabupaten_Industri (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('6a9af977-ea7d-4c18-b5f2-d78ef3e268c8', 'se/2016/1301-SE2016-Listing.sav', 'sav', '1301-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('701d9dbf-6501-48b6-b9a5-1545dd16cf5e', 'data.zip', 'zip', 'data.zip', ''),
('73656b54-5fb9-457f-8de1-76e133db10bf', 'podes/2014/Podes2014-Kabupaten_Sungai (Sumatera Barat).sav', 'sav', 'Podes2014-Kabupaten_Sungai (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('7a3390f7-45bd-4734-a11c-922b409823e5', 'susenas/2016/BLOK41_GAB_1302.sav', 'sav', 'BLOK41_GAB_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('7a998e17-84cf-4467-a40f-2a3e8f1111bd', 'contoh.csv', 'csv', 'contoh.csv', 'read.csv(data.path(?),header=TRUE)'),
('7c7f85e8-4715-4a80-96f0-a58e34094247', 'se/2016/1304-SE2016-Listing.sav', 'sav', '1304-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('7ca955d8-8f65-4a2a-a10f-7b989c166ed0', 'sakernas/2011/201108_10+_backcast - perbaikan20141007_13.sav', 'sav', '201108_10+_backcast - perbaikan20141007_13.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('85063400-033f-4ba9-9810-603a79b7928e', 'susenas/2016/BLOK43REV_1302.sav', 'sav', 'BLOK43REV_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('8598e622-14e6-4ec0-8e2c-30cbdb1c5f4e', 'susenas/2017/KOR17RT_1302.sav', 'sav', 'KOR17RT_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('875d83f1-705a-4326-b71e-7ee7a33d3ec9', 'se/2016/1307-SE2016-Listing.sav', 'sav', '1307-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('87a7b679-f5db-48d6-946f-581fd7e41a39', 'ndc-codes.xlsx', 'xlsx', 'ndc-codes.xlsx', ''),
('92db6d93-3ebb-4a33-acfa-5426946fba16', 'populasi.csv', 'csv', 'populasi.csv', 'read.csv(data.path(?),header=TRUE)'),
('978587ae-9b67-485f-bf43-9361fc09cdc5', 'diamonds.csv', 'csv', 'diamonds.csv', 'read.csv(data.path(?),header=TRUE)'),
('a057d9fb-9c9c-4bad-b8fc-b85dad1a49bf', 'se/2016/1308-SE2016-Listing.sav', 'sav', '1308-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('a0d7f4f0-be95-4635-b021-158f5563eefa', 'sakernas/2015/sakernas201508_10+_20151125_13.sav', 'sav', 'sakernas201508_10+_20151125_13.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('a1153be4-37f1-4db4-bd7f-2f496e032c3d', 'podes/2014/Podes2014-Kecamatan (Sumatera Barat).sav', 'sav', 'Podes2014-Kecamatan (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('a2720931-8db1-47d0-848a-d0d85b77770a', 'podes/2014/Podes2014-Kabupaten (Sumatera Barat).sav', 'sav', 'Podes2014-Kabupaten (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('a2c21f40-5afc-4013-acef-977418043bc4', 'susenas/2017/BLOK43_1302.sav', 'sav', 'BLOK43_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('a3321c88-f006-400a-8f94-7d5946a8eabb', 'susenas/2017/BLOK41_1302.sav', 'sav', 'BLOK41_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('a44f2cb0-b05f-41e9-ba52-830336617c43', 'sakernas/2013/201308_15_backcast_13.sav', 'sav', '201308_15_backcast_13.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('a6292019-7843-4dd5-98f1-863d85f7ed05', 'sakernas/2014/201408_10_13.sav', 'sav', '201408_10_13.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('b02aaadb-3b5d-4a3d-ac3c-dfd92bc9210d', 'susenas/2016/KOR15RT_1302.sav', 'sav', 'KOR15RT_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('b33fe4a7-57e6-4e5c-9001-39e257d7eb7e', 'susenas/2016/BLOK43REV_1302_PPH.sav', 'sav', 'BLOK43REV_1302_PPH.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('b3def922-e2f6-4b9d-bbb5-ac712667d186', 'se/2016/1311-SE2016-Listing.sav', 'sav', '1311-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('b40d51e4-a2fd-44bc-8f4a-67f95e0083c5', 'susenas/2016/B41_ART_SUM_1302.sav', 'sav', 'B41_ART_SUM_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('b75665e9-b978-4471-9374-e54427032dd7', 'susenas/2017/BLOK41_1302_PPH.sav', 'sav', 'BLOK41_1302_PPH.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('bfb830d8-b830-4bc0-afb3-bd231382ae50', 'susenas/2016/BLOK42_1302.sav', 'sav', 'BLOK42_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('c0af8e3d-0fd3-4bff-8f70-2605664e7899', 'susenas/2016/KOR15IND_1302_olah.sav', 'sav', 'KOR15IND_1302_olah.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('c0ca3918-cc18-4206-8b09-98ecf3460199', 'sakernas/2017/1302_SAK082017_15+.sav', 'sav', '1302_SAK082017_15+.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('c148cf28-4bbd-4423-a909-455cadf69f1c', 'se/2016/1375-SE2016-Listing.sav', 'sav', '1375-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('c2c3c8db-57bc-4f82-bed9-24134ec559f7', 'se/2016/1303-SE2016-Listing.sav', 'sav', '1303-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('c2ce4b96-95d1-4ddf-bce2-381f9e173ae2', 'susenas/2016/B41_RT_1302.sav', 'sav', 'B41_RT_1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('c3b0ac4a-3dbc-4bcf-ada0-921307183318', 'data.sql', 'sql', 'data.sql', ''),
('c9d3781b-59c3-4ccf-b777-dcfe725fa738', 'podes/2014/Podes2014-Kabupaten_Pertambangan (Sumatera Barat).sav', 'sav', 'Podes2014-Kabupaten_Pertambangan (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('d0b3f03e-e4eb-49c5-9216-484a22743574', 'podes/2014/Podes2014-Kecamatan_Fasilitas (Sumatera Barat).sav', 'sav', 'Podes2014-Kecamatan_Fasilitas (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('d1691c9f-4ff4-4293-bde1-b6aca832b074', 'se/2016/1373-SE2016-Listing.sav', 'sav', '1373-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('d35eae03-e53c-4f10-9ee7-588e68d401fa', 'se/2016/1306-SE2016-Listing.sav', 'sav', '1306-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('d779eb60-fb2c-4635-af28-0148c567c5ea', 'se/2016/1372-SE2016-Listing.sav', 'sav', '1372-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('dc56801d-92c0-470f-b308-d633394cefea', 'se/2016/1309-SE2016-Listing.sav', 'sav', '1309-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('ddc9372d-3e50-4b81-bc28-cf2b27c5eb99', 'se/2016/1374-SE2016-Listing.sav', 'sav', '1374-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('e43f854f-52bf-4e08-b656-2bd61a14cb60', 'sakernas/2012/201208_10+_backcast - perbaikan20141007_13.sav', 'sav', '201208_10+_backcast - perbaikan20141007_13.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('e45b9e3d-5e8b-4634-bc29-41e504c96a65', 'se/2016/1305-SE2016-Listing.sav', 'sav', '1305-SE2016-Listing.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('eefeacfd-4113-430b-beed-335b1baeea9b', 'podes/2014/Podes2014-Kecamatan_Wisata (Sumatera Barat).sav', 'sav', 'Podes2014-Kecamatan_Wisata (Sumatera Barat).sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('f59fdf62-bc9f-4ddd-99fc-03d2864610b2', 'se/2016/Rawdata SE2016L.sav', 'sav', 'Rawdata SE2016L.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('f5cd9c47-0813-4a9e-99da-e2e09ad02faf', 'podes/2014/Podes2014-Desa+Nagari+Jorong.sav', 'sav', 'Podes2014-Desa+Nagari+Jorong.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('f7fe2c74-0cce-48e3-b12c-cfcc8c336802', 'pwt90.xlsx', 'xlsx', 'pwt90.xlsx', ''),
('fcdb5435-a6f7-4d9e-b176-92c2c6705d07', 'sp/2010/sp101302#1.sav', 'sav', 'sp101302#1.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('fe0cd2a8-18fb-4cef-97a3-ac3ae178251b', 'sp/2010/SP2000-1302.sav', 'sav', 'SP2000-1302.sav', 'read.spss(data.path(?), to.data.frame=TRUE)'),
('fee0059e-fa6c-40c0-b72b-4a6757230a06', 'susenas/2017/pph.xls', 'xls', 'pph.xls', '');

-- --------------------------------------------------------

--
-- Table structure for table `module_file_model`
--

CREATE TABLE `module_file_model` (
  `id` varchar(36) NOT NULL,
  `module_id` varchar(36) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `extension` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `module_file_model`
--

INSERT INTO `module_file_model` (`id`, `module_id`, `filename`, `extension`) VALUES
('2f2cdcc9-5d11-4c49-84e1-302048f2e884', '10b9d078-1d0e-4167-bad5-3d8ce68fa822', 'plot', 'R'),
('6d61052b-85bb-4f48-998b-8d561fbc65d9', '10b9d078-1d0e-4167-bad5-3d8ce68fa822', 'summary', 'R'),
('a07128b6-c483-11e8-9df9-0242ac120006', 'e24dada0-c455-11e8-a577-0242ac120007', 'plot', 'R'),
('a8122a1c-c568-11e8-879c-0242ac120007', 'a80f9644-c568-11e8-879c-0242ac120007', 'ui', 'js'),
('a93e4bfc-0101-440a-a1e3-9fbfbb5f4976', '10b9d078-1d0e-4167-bad5-3d8ce68fa822', 'predict', 'R'),
('e101c29a-8ec1-4c40-8105-10313193ba12', '10b9d078-1d0e-4167-bad5-3d8ce68fa822', 'ui', 'js'),
('e24eedb4-c455-11e8-a577-0242ac120007', 'e24dada0-c455-11e8-a577-0242ac120007', 'ui', 'js');

-- --------------------------------------------------------

--
-- Table structure for table `module_model`
--

CREATE TABLE `module_model` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `owner` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `module_model`
--

INSERT INTO `module_model` (`id`, `name`, `label`, `owner`) VALUES
('10b9d078-1d0e-4167-bad5-3d8ce68fa822', 'LinearRegressionOLS', 'Linear Regression (OLS)', '4a4a62e4-1aed-4363-9dfd-cef6ae7fdabe'),
('a80f9644-c568-11e8-879c-0242ac120007', 'A', 'AAA', 'fb29d957-5aec-4977-9d47-a6c04de3a07a'),
('e24dada0-c455-11e8-a577-0242ac120007', 'ASDF', 'ASDF Module', 'b1e4f1d9-3e5d-4c76-acca-682160649c27');

-- --------------------------------------------------------

--
-- Table structure for table `session_model`
--

CREATE TABLE `session_model` (
  `id` varchar(36) NOT NULL,
  `label` varchar(255) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `created_time` datetime NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session_model`
--

INSERT INTO `session_model` (`id`, `label`, `user_id`, `created_time`, `is_default`) VALUES
('a31a628f-0604-42fa-b627-15babb07f2f5', 'Session', 'fb29d957-5aec-4977-9d47-a6c04de3a07a', '2018-10-01 09:29:38', 1),
('fb434e95-d394-4554-abe8-7926501bda79', 'Session', 'b1e4f1d9-3e5d-4c76-acca-682160649c27', '2018-09-29 10:57:16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_model`
--

CREATE TABLE `user_model` (
  `id` varchar(36) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_model`
--

INSERT INTO `user_model` (`id`, `fullname`, `email`, `password`, `active`) VALUES
('4a4a62e4-1aed-4363-9dfd-cef6ae7fdabe', 'Aris Prawisudatama', 'soedomot@gmail.com', 'b7d517ff31bff1dc9367177f8ed39ceb', 1),
('fb29d957-5aec-4977-9d47-a6c04de3a07a', 'Erika Siregar', 'soedomoto@gmail.com', 'b7d517ff31bff1dc9367177f8ed39ceb', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data_model`
--
ALTER TABLE `data_model`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `module_file_model`
--
ALTER TABLE `module_file_model`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `module_model`
--
ALTER TABLE `module_model`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session_model`
--
ALTER TABLE `session_model`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_model`
--
ALTER TABLE `user_model`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
