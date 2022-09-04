import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import parse from 'html-react-parser';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFRIM } from 'utilities/constants';

const ConfirmModal = ({ title, content, show, onAction }) => {
	return (
		<>
			<Modal
				show={show}
				onHide={() => onAction(MODAL_ACTION_CLOSE)}
				backdrop="static"
			>
				<Modal.Header closeButton>
					<Modal.Title className="h5">{parse(title)}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{parse(content)}</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => onAction(MODAL_ACTION_CLOSE)}
					>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={() => onAction(MODAL_ACTION_CONFRIM)}
					>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ConfirmModal;
