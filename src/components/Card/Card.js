import React from 'react';
import './Card.scss';

const Card = ({ card }) => {
	return (
		<li className="card-item">
			{card.cover && (
				<img src={card.cover} alt="" className="card-cover" />
			)}
			{card.title}
		</li>
	);
};

export default Card;