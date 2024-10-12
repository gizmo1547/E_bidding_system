-- Create the User table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Role ENUM('Visitor', 'User', 'SuperUser') NOT NULL DEFAULT 'Visitor',
    AccountBalance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    IsVIP BOOLEAN NOT NULL DEFAULT FALSE,
    IsSuspended BOOLEAN NOT NULL DEFAULT FALSE,
    SuspensionCount INT NOT NULL DEFAULT 0,
    AverageRating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    NumberOfRatings INT NOT NULL DEFAULT 0,
    NumberOfTransactions INT NOT NULL DEFAULT 0,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    RegistrationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the Item table
CREATE TABLE IF NOT EXISTS Item (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    OwnerID INT NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    AskingPrice DECIMAL(10,2) NOT NULL,
    ListingType ENUM('ForSale', 'ForRent', 'Wanted') NOT NULL,
    Status ENUM('Available', 'Sold', 'Rented') NOT NULL DEFAULT 'Available',
    ListingDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Deadline DATETIME NOT NULL,
    IsRemoved BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (OwnerID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create the Bid table
CREATE TABLE IF NOT EXISTS Bid (
    BidID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT NOT NULL,
    BidderID INT NOT NULL,
    BidAmount DECIMAL(10,2) NOT NULL,
    BidDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsAccepted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (BidderID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CHECK (BidAmount >= 0)
);

-- Create the Transaction table
CREATE TABLE IF NOT EXISTS Transaction (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    BuyerID INT NOT NULL,
    SellerID INT NOT NULL,
    ItemID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    TransactionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BuyerID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (SellerID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CHECK (Amount >= 0)
);

-- Create the Rating table
CREATE TABLE IF NOT EXISTS Rating (
    RatingID INT AUTO_INCREMENT PRIMARY KEY,
    FromUserID INT NOT NULL,
    ToUserID INT NOT NULL,
    TransactionID INT NOT NULL,
    RatingValue INT NOT NULL,
    RatingDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FromUserID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ToUserID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (TransactionID) REFERENCES Transaction(TransactionID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CHECK (RatingValue >= 1 AND RatingValue <= 5)
);

-- Create the Comment table
CREATE TABLE IF NOT EXISTS Comment (
    CommentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ItemID INT NOT NULL,
    Content TEXT NOT NULL,
    CommentDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create the Complaint table without the CHECK constraint
CREATE TABLE IF NOT EXISTS Complaint (
    ComplaintID INT AUTO_INCREMENT PRIMARY KEY,
    ComplainantID INT NOT NULL,
    AgainstUserID INT NOT NULL,
    Content TEXT NOT NULL,
    ComplaintDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsResolved BOOLEAN NOT NULL DEFAULT FALSE,
    ResolvedBy INT,
    ResolutionDate DATETIME,
    FOREIGN KEY (ComplainantID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (AgainstUserID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ResolvedBy) REFERENCES User(UserID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Create the Application table
CREATE TABLE IF NOT EXISTS Application (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    VisitorID INT NOT NULL UNIQUE,
    ArithmeticQuestion VARCHAR(100) NOT NULL,
    ProvidedAnswer VARCHAR(50) NOT NULL,
    IsHumanVerified BOOLEAN NOT NULL DEFAULT FALSE,
    IsApproved BOOLEAN NOT NULL DEFAULT FALSE,
    ApprovedBy INT,
    ApplicationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ApprovalDate DATETIME,
    FOREIGN KEY (VisitorID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ApprovedBy) REFERENCES User(UserID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX idx_user_role ON User(Role);
CREATE INDEX idx_item_status ON Item(Status);
CREATE INDEX idx_bid_item ON Bid(ItemID);
CREATE INDEX idx_transaction_date ON Transaction(TransactionDate);
CREATE INDEX idx_rating_to_user ON Rating(ToUserID);
CREATE INDEX idx_comment_item ON Comment(ItemID);
CREATE INDEX idx_complaint_against_user ON Complaint(AgainstUserID);

-- Create the trigger to enforce the constraint on the Complaint table
DELIMITER $$

CREATE TRIGGER trg_complaint_before_insert
BEFORE INSERT ON Complaint
FOR EACH ROW
BEGIN
    IF NEW.ComplainantID = NEW.AgainstUserID THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ComplainantID cannot be the same as AgainstUserID.';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_complaint_before_update
BEFORE UPDATE ON Complaint
FOR EACH ROW
BEGIN
    IF NEW.ComplainantID = NEW.AgainstUserID THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ComplainantID cannot be the same as AgainstUserID.';
    END IF;
END$$

DELIMITER ;
