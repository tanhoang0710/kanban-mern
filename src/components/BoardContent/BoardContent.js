import Column from 'components/Column/Column';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Draggable, Container } from 'react-smooth-dnd';

import { initialData } from 'actions/initialData';
import './BoardContent.scss';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';

const BoardContent = () => {
	const [board, setBoard] = useState({});
	const [columns, setColumns] = useState([]);

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
						<Column column={column} onCardDrop={onCardDrop} />
					</Draggable>
				))}
			</Container>
			<div className="add-new-column">
				<i className="fa fa-plus icon"></i> Add another column
			</div>
		</div>
	);
};

export default BoardContent;
