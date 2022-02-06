import {Button} from 'react-bootstrap';
import './chronoPools.scss'

export default function ChronoPools() {
    return <div className="bg-secondary-mod-1 chronoPools p-3">

        <div className="d-flex flex-row justify-content-between">
            <h4>Chrono Pools</h4>

            <Button  variant='link' >
                <span className="guide">Chrono Pool Guide </span>
            </Button>

        </div>

    </div>;
}