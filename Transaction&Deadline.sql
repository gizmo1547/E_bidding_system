UPDATE item
SET Deadline = '2025-01-10 10:00:00'
WHERE ItemID = 41;

describe item;
describe Transaction;
describe item;
describe bid;


ALTER TABLE `Biding_Project`.`Transaction` 
DROP FOREIGN KEY `transaction_ibfk_2`;
ALTER TABLE `Biding_Project`.`Transaction` 
CHANGE COLUMN `SellerID` `SellerID` INT NULL ;

INSERT INTO Item (
    OwnerID, Title, Description, AskingPrice, ListingType, 
    Status, ListingDate, Deadline, IsRemoved, CategoryID, image_url
) 
VALUES
(2, 'Stylish Apartment for Rent', 'Modern 2-bedroom apartment in downtown with beautiful city views.', 1500.00, 'ForRent', 'Available', NOW(), '2024-12-30 00:00:00', 0, 3, 'https://example.com/images/apt1.jpg'),
(2, 'Vintage Car for Sale', 'Classic 1965 Ford Mustang, in excellent condition, fully restored.', 35000.00, 'ForSale', 'Available', NOW(), '2025-01-15 00:00:00', 0, 2, 'https://example.com/images/mustang.jpg'),
(3, 'Looking for a Roommate', 'Looking for a responsible roommate to share my 3-bedroom house.', 2000, 'Wanted', 'Available', NOW(), '2024-12-20 00:00:00', 0, 1, 'https://example.com/images/roommate.jpg'),
(4, 'Office Space for Rent', 'Spacious office available for rent in a prime business location.', 2500.00, 'ForRent', 'Available', NOW(), '2024-12-25 00:00:00', 0, 2, 'https://example.com/images/officespace.jpg'),
(2, 'Secondhand Laptop for Sale', 'Laptop in good working condition, perfect for students and professionals.', 600.00, 'ForSale', 'Available', NOW(), '2024-12-15 00:00:00', 0, 3, 'https://example.com/images/laptop.jpg');


