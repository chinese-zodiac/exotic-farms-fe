import { useState } from 'react';
import {
    InputGroup, FormControl, Row, Col, Button,
    Modal, Nav, Form, Spinner
} from 'react-bootstrap';


export type PoolProps = { pId:number;duration: string; apr: number; czf: string; harvestable: string; };

export function LoopModal({ onClose, onConfirm }: {
    onClose: () => any;
    onConfirm:(percentage:number)=>any;
}) {

    const perVals = [25, 50, 75, 100];
    const [selectedPrtage, setSelectedPrtage] = useState(0);

    return <Modal show centered onHide={() => onClose && onClose()}
        contentClassName="app-dark-mode loopModal">

        <Modal.Header closeButton>
            <Modal.Title>Loop CZF</Modal.Title>
        </Modal.Header>

        <Modal.Body className="m-5">

            <Form.Range className="mb-3" step={1} min={0} max={perVals.length - 1}
                value={selectedPrtage}
                onChange={e => {
                    setSelectedPrtage(Number.parseInt(e.target.value));
                }} />

            <Nav justify variant="pills"
                activeKey={selectedPrtage} onSelect={s => {
                    s && setSelectedPrtage(Number.parseInt(s));
                }}
                className="bg-secondary-mod"
            >

                {perVals.map((l, i) => <Nav.Item key={l}>
                    <Nav.Link eventKey={i}>Loop {l}%</Nav.Link>
                </Nav.Item>)}
            </Nav>

        </Modal.Body>

        <Modal.Footer>
            <Button variant="primary" onClick={()=>onConfirm(perVals[selectedPrtage])}>
                Confirm
            </Button>
            <Button variant="secondary" onClick={() => onClose && onClose()}>
                Cancel
            </Button>
        </Modal.Footer>

    </Modal>;
}

export type CZActionProps ={
    type:'loopCZF';
    pId:number;
}|{
    type:'loopAllCZF';
}|{
    type:'harvestAll';
}|{
    type:'reloopCZF';
}|{
    type:'harvestCZF';
}|{
    type:'ff75';
}|{
    type:'buyCZF';
}|{
    type:'loopCZFConfirmed';
    pId:number;
    percentage:number;
};

export function LoopCZF({onCZAction, selectedPool}:{
    onCZAction:(props:CZActionProps)=>any;
    selectedPool?:PoolProps;
}) {

    if(!selectedPool){
        return <div className="bg-secondary-mod text-center p-4">
            <Spinner animation="border" variant="primary" />
        </div>;
    }

    const roi = selectedPool.apr+'%';

    return <div className="bg-secondary-mod text-center p-4">

        <h4>Loop CZF for {roi} APR</h4>

        <div className="d-flex flex-row justify-content-center">
            <h5>CZF -&gt; CZF ·</h5>
            <span>{selectedPool.duration}</span>
        </div>

        <h6>ROI {roi}</h6>

        <Row className="my-3">

            <Col md >

                <InputGroup className="m-2">
                    <FormControl
                        placeholder="0.0"
                    />
                    <InputGroup.Text id="basic-addon2">CZF</InputGroup.Text>
                </InputGroup>

            </Col>

            <Col md>

                <div className="d-flex flex-row gap-2 m-2">
                    <Button variant='primary' className="flex-grow-1" onClick={() => onCZAction({
                        type:'loopCZF',
                        pId:selectedPool.pId
                    })}>
                        Loop CZF
                    </Button>

                    <Button variant='secondary'>
                        +CZF
                    </Button>

                </div>

            </Col>
        </Row>

        <Row className="my-3">
            <Col md className="d-flex">
                <Button variant="light" size="lg" className="flex-grow-1 m-2">
                    Harvest All
                </Button>
            </Col>

            <Col md className="d-flex">
                <Button variant="light" size="lg" className="flex-grow-1 m-2">
                    Loop All CZF
                </Button>
            </Col>
        </Row>

    </div>;
}