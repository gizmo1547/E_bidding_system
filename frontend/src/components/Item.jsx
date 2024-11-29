import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './Item.css';

const Item = ({ title, imgSrc, description }) => {
    return (
        <Card className="card">
            <Card.Body className="card-body">
                <Card.Title className="card-title">{title}</Card.Title>
                <Card.Img className="card-img-top" variant="top" src={imgSrc} />
                <Card.Text className="card-text">{description}</Card.Text>
                <Card.Text className="card-text">Current Bid: $0.00</Card.Text>
                <Card.Text className="card-text">Time Left: 0d 0h 0m</Card.Text>
                <Card.Text className="card-text">Seller: Shopbid</Card.Text>
                <Button className="card-button">Place Bid</Button>

            </Card.Body>
        </Card>
    );
};

export default Item;