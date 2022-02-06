
import { ConnectWallet, Web3Provider, useweb3Context, useConnectCalls } from '../web3';
import './main.scss';
import {Row, Col, Container, Button} from "react-bootstrap";

import LoopCZF from './loopCZF';
import ChronoPools from '../chronoPools';

export default function MainContent() {
    const web3Ctx = useweb3Context();

    /*
    if( (!web3Ctx?.account) || web3Ctx?.reconnecting){
      return <ConnectWallet />;
    }
    */
    const czfData = [{ val: '0.0000', label: 'Your CZF' }, { val: '0.0000', label: 'CZF/day' }, 
                { val: '0.0000', label: 'Harvestable CZF' }, { val: '0.0000', label: 'CZF Vesting' }];

    return <Container className="mainContent">

        <Row className="gap-3"> 
            {czfData.map((d,i)=><Col key={i} sm className="bg-light-mod text-center py-3">
                <h4>{d.val}</h4>
                <div>{d.label}</div>
            </Col>)}
        </Row>

        <Row className="gap-3 my-5"> 
            <Col md className="high-yield-left"></Col>
            <Col md>
                <div>
                    <h3 className="mb-3">Loop CZF For High Yield</h3>
                    <LoopCZF/>
                </div>
            </Col>
        </Row>

        <Row className="gap-3 my-5"> 
            <Col md >
                <h5>How to Play</h5>
                <p>
                    The Chrono Farmer Loops CZF with his Time Machine. <br/>
                    The Farmer is more powerful and earns CZF every second. <br/>
                    Does he Harvest his CZF, or re-Loop it? You decide. <br/>
                    Or perhaps he becomes impatient, and orders the Machine to Fast Forward. <br/>
                    If he Fast Forwards, he must make a great sacrifice.
                </p>

                <div className="d-flex flex-row gap-1 social-how">
                    <Button variant='link'>
                        <div className="icon-how btn-how-copy"></div>
                    </Button>
                    <Button variant='link'>
                        <div className="icon-how btn-how-tele"></div>
                    </Button>
                    <Button variant='link'>
                        <div className="icon-how btn-how-discord"></div>
                    </Button>
                </div>
            </Col>

            <Col md>
                <h5>Security</h5>
                <p>
                The Contracts for CZF are scanned by automated testing bots to seek and destroy bugs. These automatic scripts protect the inner workings of the Time Machine for the safety of the Chrono Farmer.<br/>
                You can view the code on Github here.<br/>
                The Contracts are audited by audits.finance here.<br/>
                You may view the verified source code on BSCscan here.
                </p>
            </Col>
        </Row>

        <ChronoPools/>


    </Container>;

}
