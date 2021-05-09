import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, faInfoCircle, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Task = props => {
 
    const [smShow, setSmShow] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [newName, setNewName] = useState('');
    const changeName = (text) => setNewName(text);

    return (
        <div key={props.task.id} 
            id={props.task.id}
            draggable={true}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={(event) => props.handleDrag(event.currentTarget.id)}
            onDrop={(event) => props.handleDrop(event.currentTarget.id)}
            className={`task-item ${props.task.finished ? 'finished' : ''}`} >
            <div className="row">
                <div className="col-sm-8 task-name">
                    {props.task.name}
                </div>
                <div className="col-sm-4 buttons">
                    {!props.task.finished ?
                        <Button variant="success" onClick={handleShow}>
                            <FontAwesomeIcon icon={faEdit} />
                        </Button> : ''
                    }
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Edit title</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input type="text" onChange={(event) => changeName(event.target.value)} placeholder={props.task.name} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="success" onClick={() => {props.changeTask(props.task.id, newName);  handleClose();}}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Button variant="success" onClick={() => setSmShow(true)}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </Button>
                    <Modal
                        size="sm"
                        show={smShow}
                        onHide={() => setSmShow(false)}
                        aria-labelledby="example-modal-sizes-title-sm"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-sm">
                                Info
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FontAwesomeIcon icon={faClock} /> <span>Start time: {props.task.addTime}</span><br />
                            <FontAwesomeIcon icon={faClock} /> <span>Finish time: {props.task.finishTime ? props.task.finishTime : 'Not finished yet.'}</span>
                        </Modal.Body>
                    </Modal>
                    {!props.task.finished ?
                        <Button variant="success" title="Finish task"
                            onClick={() => props.finishTask(props.task.id)}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </Button> : ''
                    }
                    <Button variant="success" title="Remove from list"
                        onClick={() => props.removeTask(props.task.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Task;