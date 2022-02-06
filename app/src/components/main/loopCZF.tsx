
import { InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap';

export default function LoopCZF() {

    const roi = '999%';

    return <div className="bg-secondary-mod text-center p-4">
        <h4>Loop CZF for {roi} APR</h4>

        <div className="d-flex flex-row justify-content-center">
            <h5>CZF -&gt; CZF ·</h5>
            <span>1 YEAR</span>
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
                    <Button variant='primary' className="flex-grow-1">
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