import React from 'react';
import './item.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Item = ({ Title, imgSrc, Description, Price }) => {
    return (
        <div className="item-card">
            <LazyLoadImage
                src={imgSrc}
                alt={Title}
                effect="blur"
                placeholderSrc="/images/placeholder.png"
            />
            <h3>{Title}</h3>
            <p>{Description}</p>
            <p>Price: ${Price}</p>
        </div>
    );
};

export default Item;