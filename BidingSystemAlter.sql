ALTER TABLE Bid 
DROP FOREIGN KEY bid_ibfk_2;

ALTER TABLE Bid
DROP COLUMN BidderID,
DROP INDEX BidderID;

Alter Table Bid
ADD BidderName VARCHAR(50) NOT NULL;

Alter table Bid
ADD CONSTRAINT BidderName_FK FOREIGN KEY (BidderName) References User(Username);

ALTER TABLE Bid
CHANGE COLUMN IsAccepted sAccepted  TINYINT(1) NULL DEFAULT '0' ;

ALTER TABLE Item
ADD COLUMN image_url VARCHAR(350);

UPDATE Item SET image_url = 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6505/6505124_sd.jpg' WHERE (ItemID = '41');
UPDATE Item SET image_url = 'https://i.guim.co.uk/img/media/2ce8db064eabb9e22a69cc45a9b6d4e10d595f06/392_612_4171_2503/master/4171.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=45b5856ba8cd83e6656fbe5c166951a4' WHERE (ItemID = '42');
UPDATE Item SET image_url = 'https://m.media-amazon.com/images/I/718yxonHN8L.jpg' WHERE (ItemID = '43');
UPDATE Item SET image_url = 'https://i5.walmartimages.com/seo/Mainstays-Ergonomic-Mesh-Back-Task-Office-Chair-with-Flip-up-Arms-Black-Fabric-275-lb_584c4cc5-fc4d-46d3-9a23-5a3fb5bb134e.6c681a1d24f26e9c017a3a011877e2d8.jpeg' WHERE (ItemID=  '44');
UPDATE Item SET image_url = 'https://m.media-amazon.com/images/I/81H5HXNbcNL.jpg' WHERE (ItemID = '45');
UPDATE Item SET image_url = 'https://m.media-amazon.com/images/I/81PsfT5PTWL.jpg' WHERE (ItemID = '46');
UPDATE Item SET image_url = 'https://i.etsystatic.com/7271736/r/il/cc9ef0/3681483664/il_570xN.3681483664_21s8.jpg' WHERE (ItemID = '47');
UPDATE Item SET image_url = 'https://cdn.britannica.com/77/196577-050-1101EEBD/Michelangelos-David-Goliath-one-statues-world.jpg' WHERE (ItemID = '48');
UPDATE Item SET image_url = 'https://www.dreamsart.it/wp-content/uploads/2022/09/IMG_4719.jpg' WHERE (ItemID = '49');
UPDATE Item SET image_url = 'https://external-preview.redd.it/sony-may-be-prepping-two-socs-for-playstation-6-sparking-v0-mh9LTqHuo71xp2kptTYrq95JX21ZJ9-5M4c9T4pryVE.jpg?width=640&crop=smart&auto=webp&s=6507535ede3772ad4c557db46acf3edcf0123c6c' WHERE (ItemID = '50');
