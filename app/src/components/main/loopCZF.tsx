import { useState, useEffect } from 'react';
import {
    InputGroup, FormControl, Row, Col, Button,
    Modal, Nav, Form, Spinner, Dropdown
} from 'react-bootstrap';

import { useDisplayMode } from '../utils/display';
import { useAccountCtx, supportedChains, useConnectCalls } from '../web3';
import { useFarmPools } from '../pools';
import { IAsyncResult } from '../utils';

import { CZFarm } from '../../typechain/CZFarm';
import CZFarm_JSON from '../../typechain/CZFarm.json';

export type PoolTypeProps = { type: 'chronoPool' } | { type: 'exoticfarm', lp: string; };

export type PoolProps = {
    pId: number;
    duration: string; durationDays: number;
    apr: number;
    czfPerDay: number;
    harvestableFn: () => number;
    vested: number;
}
    & PoolTypeProps;


export function FastForwardModal({ onClose, onConfirm }: {
    onClose: () => any;
    onConfirm: (showFFWarning:boolean) => any;
}) {
    const [showFFwarning, setShowFFwarning] = useState(true);
    const { darkMode } = useDisplayMode();

    return <Modal show centered onHide={() => onClose && onClose()}
        contentClassName={"fastForwardModal " + (darkMode ? 'app-dark-mode' : 'app-light-mode')}>

        <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
        </Modal.Header>

        <Modal.Body>

            <p>
                FastForward will cancel all your future vesting! You will only get 75.00% of the CZF you staked. Read more info at czodiac.gitbook.io
            </p>

        </Modal.Body>

        <Modal.Footer>

            <div>
                <div className="d-flex gap-2">

                    <Button variant="primary" onClick={() => onConfirm(showFFwarning)}>
                        OK
                    </Button>
                    <Button variant="secondary"  onClick={() => onClose()}>
                        Cancel
                    </Button>

                </div>

                <div className="mt-3">
                    <Form.Check type='checkbox' id='noshow_cb' label='Don’t show me this again'
                        checked={!showFFwarning}
                        onClick={()=>setShowFFwarning(!showFFwarning)}
                    />
                </div>

            </div>
        </Modal.Footer>

    </Modal>;
}


export function LoopModal({ onClose, onConfirm }: {
    onClose: () => any;
    onConfirm: (percentage: number) => any;
}) {

    const perVals = [25, 50, 75, 100];
    const [selectedPrtage, setSelectedPrtage] = useState(0);
    const { darkMode } = useDisplayMode();


    return <Modal show centered onHide={() => onClose && onClose()}
        contentClassName={"loopModal " + (darkMode ? 'app-dark-mode' : 'app-light-mode')}>

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
            <Button variant="primary" onClick={() => onConfirm(perVals[selectedPrtage])}>
                Confirm
            </Button>
            <Button variant="secondary" onClick={() => onClose && onClose()}>
                Cancel
            </Button>
        </Modal.Footer>

    </Modal>;
}

export type ExoticLpProps = {
    lp: string;
    lpBalance_eth: number;
    lpBalance_Wei: string;
}

export type CZActionProps = { pId: number; } & ({
    type: 'loopCZF';

    //we are looping exoticWith lp
    exotic?: ExoticLpProps;

} | {
    type: 'loopAllCZF';
} | {
    type: 'harvestAll';
} | {
    type: 'reloopCZF';
} | {
    type: 'harvestCZF';
} | {
    type: 'ff75';
} | {
    type: 'ff75Confirmed';
} | {
    type: 'buyCZF';
} | {
    type: 'loopCZFConfirmed';
    percentage?: number;
    amountEth?: string;

    exotic?: ExoticLpProps;

} | {
    type: 'harvestCZF-lp';
} | {
    type: 'ff75-lp';
} | {
    type: 'ff75-lp-confirmed';
} | {
    type: 'depositLP';
    exoticLp: string;
    amount_Wei: string;
}| {
    type: 'approveLP';
    exoticLp: string;
}
);

export function LoopCZF({ onCZAction }: {
    onCZAction: (props: CZActionProps) => any;
}) {
    const pools = useFarmPools();
    const { readOnly, connect } = useConnectCalls();
    const { account, networkId, nounce } = useAccountCtx();
    const [loopAmount, setLoopAmount] = useState<string>();
    const [selectedPool, setSelectedPool] = useState<PoolProps>();

    useEffect(() => {

        const defaultSelection = pools?.result && pools?.result.chronoPools.length > 0 && pools?.result.chronoPools[3] || undefined;
        if (defaultSelection) {
            setSelectedPool(defaultSelection);
        }

    }, [pools]);

    useEffect(() => {

    (async () => {
      try {

        const chainInfo = networkId && supportedChains.find(n => n.chainId == networkId) || undefined;

        if (!chainInfo || undefined === account) {
          return;
        }

        const { web3ro } = await readOnly();

        const czFarm: CZFarm = new web3ro.eth.Contract(CZFarm_JSON.abi as any, chainInfo.contracts.czFarm) as any;
        const currBalance_Wei = await czFarm.methods.balanceOf(account).call();

        if(!loopAmount) {
            setLoopAmount(web3ro.utils.fromWei(currBalance_Wei).replace(/\.[0-9]*/g,''));
        }

      } catch (error: any) {
        //setCzfBalance({ error });
      }

        })();

    }, [account, networkId, nounce, loopAmount]);

    if (!selectedPool) {
        return <div className="bg-secondary-mod text-center p-4">
            <Spinner animation="border" variant="primary" />
        </div>;
    }

    const roi = (selectedPool.apr * (selectedPool.durationDays / 365)).toFixed(2) + '%';

    return <div className="bg-secondary-mod text-center p-4">

        <h4>Loop CZF for {selectedPool.apr}% APR</h4>

        <div className="d-flex flex-row justify-content-center align-items-center">
            <h5 className="mt-2">CZF -&gt; CZF   </h5>

            <Dropdown>
                <Dropdown.Toggle variant="Secondary" id="dropdown-pool">
                    {selectedPool.duration}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {(pools?.result?.chronoPools || []).map(p => <Dropdown.Item key={p.pId} onClick={() => setSelectedPool(p)} >
                        <span>{p.duration}</span></Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </div>

        <h6>ROI {roi}</h6>

        <Row className="my-3">

            <Col md >

                <InputGroup className="m-2">
                    <FormControl required placeholder="0.0"
                        value={loopAmount || ''}

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
                    <Button variant='primary' disabled={!loopAmount} className="flex-grow-1" onClick={() => onCZAction({
                        type: 'loopCZFConfirmed',
                        pId: selectedPool.pId,
                        amountEth: loopAmount
                    })}>
                        Loop CZF
                    </Button>

                    <Button variant='secondary' onClick={() => {
                        window.open('https://app.1inch.io/#/56/swap/BNB/0x7c1608C004F20c3520f70b924E2BfeF092dA0043');
                    }}>
                        Buy CZF
                    </Button>

                </div>

            </Col>
        </Row>

        <Row className="my-3">
            <Col md className="d-flex">
                <Button variant="secondary" size="lg" className="flex-grow-1 m-2" onClick={() => onCZAction({
                    type: 'harvestAll',
                    pId: selectedPool.pId
                })}>
                    Harvest All
                </Button>
            </Col>

            <Col md className="d-flex">
                <Button variant="secondary" size="lg" className="flex-grow-1 m-2" onClick={() => onCZAction({
                    type: 'loopCZFConfirmed',
                    percentage: 100,
                    pId: selectedPool.pId
                })}>
                    Loop All CZF
                </Button>
            </Col>
        </Row>

    </div>;
}