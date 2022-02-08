import { useState } from 'react';
import {
    InputGroup, FormControl, Row, Col, Button,
    Modal, Nav, Form, Spinner
} from 'react-bootstrap';

import {useDisplayMode} from '../utils/display';


export type PoolProps = { pId:number;duration: string; apr: number; czf: string; harvestable: string; } 
    &({type:'chronoPool'}|{type:'exoticfarm',lp:string;});


export function FastForwardModal({ onClose, onConfirm }: {
    onClose: () => any;
    onConfirm:()=>any;
}) {

    const {darkMode} = useDisplayMode();

    return <Modal show centered onHide={() => onClose && onClose()}
        contentClassName={"fastForwardModal " + (darkMode?'app-dark-mode':'app-light-mode')}>

        <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center m-5">

            <p>
            FastForward will cancel all your future vesting! You will only get 75.00% of the CZF you staked. Read more info at czodiac.gitbook.io
            </p>

        </Modal.Body>

        <Modal.Footer>
            <Button variant="primary" onClick={()=>onConfirm()}>
                OK
            </Button>
            <Button variant="secondary" onClick={() => onClose()}>
                Cancel
            </Button>
        </Modal.Footer>

    </Modal>;
}


export function LoopModal({ onClose, onConfirm }: {
    onClose: () => any;
    onConfirm:(percentage:number)=>any;
}) {

    const perVals = [25, 50, 75, 100];
    const [selectedPrtage, setSelectedPrtage] = useState(0);
    const {darkMode} = useDisplayMode();


    return <Modal show centered onHide={() => onClose && onClose()}
        contentClassName={"loopModal " + (darkMode?'app-dark-mode':'app-light-mode')}>

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

export type CZActionProps ={pId:number;} & ({
    type:'loopCZF';

    //we are looping exoticWith lp
    exoticLp?:string;
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
    type:'ff75Confirmed';
}|{
    type:'buyCZF';
}|{
    type:'loopCZFConfirmed';
    percentage?:number;
    amountEth?:string;
    exoticLp?:string;
}|{
    type:'harvestCZF-lp';
}|{
    type:'ff75-lp';
}|{
    type:'ff75-lp-confirmed';
}
);

export function LoopCZF({onCZAction, selectedPool}:{
    onCZAction:(props:CZActionProps)=>any;
    selectedPool?:PoolProps;
}) {

    const [loopAmount,setLoopAmount] = useState<string>();

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
                    <FormControl required placeholder="0.0"
                        value={loopAmount||''}

                        onChange={e => {

                            if (!e.target.value) {
                                setLoopAmount(undefined);
                                return;
                            } else {
                                const amount = e.target.value.replace(/[^0-9$.,]/g, '');
                                setLoopAmount(amount);
                            }
                        }}

                    />
                    <InputGroup.Text id="basic-addon2">CZF</InputGroup.Text>
                </InputGroup>

            </Col>

            <Col md>

                <div className="d-flex flex-row gap-2 m-2">
                    <Button variant='primary' disabled={!loopAmount}  className="flex-grow-1" onClick={() => onCZAction({
                        type:'loopCZFConfirmed',
                        pId:selectedPool.pId,
                        amountEth:loopAmount
                    })}>
                        Loop CZF
                    </Button>

                    <Button variant='secondary' onClick={() => {
                        try{
                            const current = Number.parseFloat(loopAmount||'0');
                            setLoopAmount((current+1).toString());
                        }catch{}
                    }}>
                        +CZF
                    </Button>

                </div>

            </Col>
        </Row>

        <Row className="my-3">
            <Col md className="d-flex">
                <Button variant="light" size="lg" className="flex-grow-1 m-2" onClick={() => onCZAction({
                        type:'harvestAll',
                        pId:selectedPool.pId
                    })}>
                    Harvest All
                </Button>
            </Col>

            <Col md className="d-flex">
                <Button variant="light" size="lg" className="flex-grow-1 m-2" onClick={() => onCZAction({
                        type:'loopCZFConfirmed',
                        percentage:100,
                        pId:selectedPool.pId
                    })}>
                    Loop All CZF
                </Button>
            </Col>
        </Row>

    </div>;
}