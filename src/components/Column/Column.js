import Card from 'components/Card/Card';
import ConfirmModal from 'components/Common/ConfirmModal';
import { cloneDeep } from 'lodash';
import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
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

	const newCardTextareaRef = useRef(null);

	const [openNewCardForm, setOpenNewCardForm] = useState(false);
	const toggleOpenNewCardForm = () => {
		setOpenNewCardForm(!openNewCardForm);
	};

	const [newCardTitle, setNewCardTitle] = useState('');
	const onNewCardTitleChange = (e) => {
		setNewCardTitle(e.target.value);
	};

	useEffect(() => {
		setColumnTitle(column.title);
	}, [column.title]);

	useEffect(() => {
		if (newCardTextareaRef && newCardTextareaRef.current) {
			newCardTextareaRef.current.focus();
			newCardTextareaRef.current.select();
		}
	}, [openNewCardForm]);

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

	const addNewCard = () => {
		if (!newCardTitle) {
			newCardTextareaRef.current.focus();
			return;
		}

		const newCardToAdd = {
			id: Math.random(toString(36).substr(2, 5)),
			boardId: column.boardId,
			columnId: column.id,
			title: newCardTitle.trim(),
			cover: null,
		};

		let newColumn = cloneDeep(column);
		newColumn.cards.push(newCardToAdd);
		newColumn.cardOrder.push(newCardToAdd.id);
		onUpdateColumn(newColumn);
		setNewCardTitle('');
		toggleOpenNewCardForm();
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
				{openNewCardForm && (
					<div className="add-new-card-area">
						<Form.Control
							size="sm"
							as="textarea"
							row={3}
							placeholder="Enter a title for this card..."
							className="textarea-enter-new-card"
							ref={newCardTextareaRef}
							value={newCardTitle}
							onChange={onNewCardTitleChange}
							onKeyDown={(e) => e.key === 'Enter' && addNewCard()}
						/>
					</div>
				)}
			</div>
			<footer>
				{openNewCardForm && (
					<div className="add-new-card-actions">
						<Button
							variant="success"
							size="sm"
							onClick={addNewCard}
						>
							Add card
						</Button>
						<span
							className="cancel-icon"
							onClick={toggleOpenNewCardForm}
						>
							<i className="fa fa-times icon"></i>
						</span>
					</div>
				)}
				{!openNewCardForm && (
					<div
						className="footer-actions"
						onClick={toggleOpenNewCardForm}
					>
						<i className="fa fa-plus icon"></i>Add another card
					</div>
				)}
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
