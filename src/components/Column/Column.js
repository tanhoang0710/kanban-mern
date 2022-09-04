import Card from 'components/Card/Card';
import ConfirmModal from 'components/Common/ConfirmModal';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { Draggable, Container } from 'react-smooth-dnd';
import { MODAL_ACTION_CONFRIM } from 'utilities/constants';
import {
	saveContentAfterPressEnter,
	selectAllInlineText,
} from 'utilities/contentEditable';
import { mapOrder } from 'utilities/sorts';
import './Column.scss';

const Column = ({ column, onCardDrop, onUpdateColumn }) => {
	const cards = mapOrder(column.cards, column.cardOrder, 'id');

	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const [columnTitle, setColumnTitle] = useState('');

	useEffect(() => {
		setColumnTitle(column.title);
	}, [column.title]);

	const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

	const onConfirmModalAction = (type) => {
		if (type === MODAL_ACTION_CONFRIM) {
			const newColumn = {
				...column,
				_destroy: true,
			};
			onUpdateColumn(newColumn);
		}
		toggleShowConfirmModal();
	};

	const handleColumnTitleChange = (e) => {
		setColumnTitle(e.target.value);
	};

	const handleColumnTitleBlur = () => {
		const newColumn = {
			...column,
			title: columnTitle,
		};
		onUpdateColumn(newColumn);
	};

	return (
		<div className="column">
			<header className="column-drag-handle">
				<div className="column-title">
					<Form.Control
						size="sm"
						type="text"
						className="kanban-content-editable"
						value={columnTitle}
						spellCheck="false"
						onChange={handleColumnTitleChange}
						onClick={selectAllInlineText}
						onBlur={handleColumnTitleBlur}
						onKeyDown={saveContentAfterPressEnter}
						onMouseDown={(e) => e.preventDefault()}
					/>
				</div>
				<div className="column-dropdown-actions">
					<Dropdown>
						<Dropdown.Toggle
							size="sm"
							className="dropdown-btn"
							id="dropdown-basic"
						/>

						<Dropdown.Menu>
							<Dropdown.Item>Add card...</Dropdown.Item>
							<Dropdown.Item onClick={toggleShowConfirmModal}>
								Remove column...
							</Dropdown.Item>
							<Dropdown.Item>
								Move all cards in this column(beta...)
							</Dropdown.Item>
							<Dropdown.Item>
								Archive all cards in this column(beta...)
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</header>
			<div className="card-list">
				<Container
					// onDragStart={(e) => console.log('drag started', e)}
					// onDragEnd={(e) => console.log('drag end', e)}
					// onDragEnter={() => {
					// 	console.log('drag enter:', column.id);
					// }}
					// onDragLeave={() => {
					// 	console.log('drag leave:', column.id);
					// }}
					// onDropReady={(p) => console.log('Drop ready: ', p)}
					groupName="col"
					onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
					getChildPayload={(index) => cards[index]}
					dragClass="card-ghost"
					dropClass="card-ghost-drop"
					dropPlaceholder={{
						animationDuration: 150,
						showOnTop: true,
						className: 'card-drop-preview',
					}}
					dropPlaceholderAnimationDuration={200}
				>
					{cards.map((card, index) => (
						<Draggable key={index}>
							<Card card={card} />
						</Draggable>
					))}
				</Container>
			</div>
			<footer>
				<div className="footer-actions">
					<i className="fa fa-plus icon"></i>Add another card
				</div>
			</footer>
			<ConfirmModal
				show={showConfirmModal}
				onAction={onConfirmModalAction}
				title="Remove column"
				content={`Are you sure to remove <strong>${column.title}</strong>. <br/> All related cards will also be removed`}
			/>
		</div>
	);
};

export default Column;
