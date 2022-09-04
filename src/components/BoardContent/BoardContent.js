import Column from 'components/Column/Column';
import React, { useEffect, useState, useRef } from 'react';
import { isEmpty } from 'lodash';
import { Draggable, Container } from 'react-smooth-dnd';

import { initialData } from 'actions/initialData';
import './BoardContent.scss';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';
import {
	Container as ContainerBS,
	Col,
	Row,
	Form,
	Button,
} from 'react-bootstrap';

const BoardContent = () => {
	const [board, setBoard] = useState({});
	const [columns, setColumns] = useState([]);
	const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState('');
	const newColumnInputRef = useRef(null);

	const onNewColumnTitleChange = (e) => {
		setNewColumnTitle(e.target.value);
	};

	useEffect(() => {
		const boardFromDB = initialData.boards.find(
			(board) => board.id === 'board-1'
		);
		if (boardFromDB) {
			setBoard(boardFromDB);

			setColumns(
				mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id')
			);
		}
	}, []);

	useEffect(() => {
		if (newColumnInputRef && newColumnInputRef.current) {
			newColumnInputRef.current.focus();
			newColumnInputRef.current.select();
		}
	}, [openNewColumnForm]);

	if (isEmpty(board)) {
		return (
			<div
				className="not-found"
				style={{ padding: '10px', color: 'white' }}
			>
				Board not found!
			</div>
		);
	}

	const onColumnDrop = (dropResult) => {
		let newColumns = [...columns];
		newColumns = applyDrag(newColumns, dropResult);

		let newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((c) => c.id);
		newBoard.columns = newColumns;

		setColumns(newColumns);
		setBoard(newBoard);
	};

	const onCardDrop = (columnId, dropResult) => {
		if (dropResult.removedIndex !== null || dropResult.addedIndex != null) {
			let newColumns = [...columns];

			let currentColumn = newColumns.find((c) => c.id === columnId);

			currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
			currentColumn.cardOrder = currentColumn.cards.map((i) => i.id);

			setColumns(newColumns);
		}
	};

	const toggleOpenNewColumnForm = () => {
		setOpenNewColumnForm(!openNewColumnForm);
	};

	const addNewColumn = () => {
		if (!newColumnTitle) {
			newColumnInputRef.current.focus();
			return;
		}
		const newColumnToAdd = {
			id: Math.random(toString(36).substr(2, 5)),
			boardId: board.id,
			title: newColumnTitle.trim(),
			cardOrder: [],
			cards: [],
		};

		let newColumns = [...columns];
		newColumns.push(newColumnToAdd);
		let newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((c) => c.id);
		newBoard.columns = newColumns;

		setColumns(newColumns);
		setBoard(newBoard);

		setNewColumnTitle('');
		toggleOpenNewColumnForm();
	};

	const onUpdateColumn = (newColumnToUpdate) => {
		const columnIdToUpdate = newColumnToUpdate.id;

		let newColumns = [...columns];
		const columnIndexToUpdate = newColumns.findIndex(
			(item) => item.id === columnIdToUpdate
		);

		if (newColumnToUpdate._destroy) {
			// remove column
			newColumns.splice(columnIndexToUpdate, 1);
		} else {
			// update column
			newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
		}
		let newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((c) => c.id);
		newBoard.columns = newColumns;

		setColumns(newColumns);
		setBoard(newBoard);
	};

	return (
		<div className="board-content">
			<Container
				orientation="horizontal"
				onDrop={onColumnDrop}
				dragHandleSelector=".column-drag-handle"
				dropPlaceholder={{
					animationDuration: 150,
					showOnTop: true,
					className: 'column-drop-preview',
				}}
				getChildPayload={(index) => columns[index]}
			>
				{columns.map((column, index) => (
					<Draggable key={index}>
						<Column
							column={column}
							onCardDrop={onCardDrop}
							onUpdateColumn={onUpdateColumn}
						/>
					</Draggable>
				))}
			</Container>

			<ContainerBS className="trello-container">
				{!openNewColumnForm ? (
					<Row>
						<Col
							className="add-new-column"
							onClick={toggleOpenNewColumnForm}
						>
							<i className="fa fa-plus icon"></i> Add another
							column
						</Col>
					</Row>
				) : (
					<Row>
						<Col className="enter-new-column">
							<Form.Control
								size="sm"
								type="text"
								placeholder="Enter column title..."
								className="input-enter-new-column"
								ref={newColumnInputRef}
								value={newColumnTitle}
								onChange={onNewColumnTitleChange}
								onKeyDown={(e) =>
									e.key === 'Enter' && addNewColumn()
								}
							/>
							<Button
								variant="success"
								size="sm"
								onClick={addNewColumn}
							>
								Add column
							</Button>
							<span
								className="cancel-new-column"
								onClick={toggleOpenNewColumnForm}
							>
								<i className="fa fa-times icon"></i>
							</span>
						</Col>
					</Row>
				)}
			</ContainerBS>
		</div>
	);
};

export default BoardContent;
