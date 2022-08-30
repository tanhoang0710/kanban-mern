import React from 'react';
import './Card.scss';

const Card = ({ card }) => {
	return (
		<div className="card-item">
			{card.cover && (
				<img
					src={card.cover}
					alt=""
					className="card-cover"
					draggable="false"
				/>
			)}
			{card.title}
		</div>
	);
};

export default Card;
