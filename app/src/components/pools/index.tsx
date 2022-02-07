import { Button } from 'react-bootstrap';
import './chronoPools.scss';

export function ChronoPools() {

    const pool = {
        pools: [
            { duration: '7 DAYS', apr: 17.73, czf: '0.0000', harvestable: '0.0000' },
            { duration: '30 DAYS', apr: 23.73, czf: '0.0000', harvestable: '0.0000' },
            { duration: '90 DAYS', apr: 29.77, czf: '0.0000', harvestable: '0.0000' },
            { duration: '1 YEAR', apr: 59.59, czf: '0.0000', harvestable: '0.0000' },
            { duration: '18 MONTHS', apr: 77.47, czf: '0.0000', harvestable: '0.0000' },
            { duration: '4 YEARS', apr: 119.19, czf: '0.0000', harvestable: '0.0000' },
            { duration: '10 YEARS', apr: 148.99, czf: '0.0000', harvestable: '0.0000' },
        ]
    };

    return <PoolsView poolList={[pool]} title="Chrono Pools" guidePrompt="Chrono Pool Guide" />;
}

export function ExoticFarms() {

    const pools = [
        {
            title: 'CZF/BNB on PCS',
            cashLogo: 'bnbLogo',
            pools: [
                { duration: '7 DAYS', apr: 17.73, czf: '0.0000', harvestable: '0.0000' },
                { duration: '90 DAYS', apr: 59.49, czf: '0.0000', harvestable: '0.0000' },
                { duration: '1 YEAR', apr: 119.04, czf: '0.0000', harvestable: '0.0000' },
            ]
        },
        {
            title: 'CZF/BUSD on PCS',
            cashLogo: 'busdLogo',
            pools: [
                { duration: '7 DAYS', apr: 17.73, czf: '0.0000', harvestable: '0.0000' },
                { duration: '90 DAYS', apr: 59.49, czf: '0.0000', harvestable: '0.0000' },
                { duration: '1 YEAR', apr: 119.04, czf: '0.0000', harvestable: '0.0000' },
            ]
        }
    ];

    return <PoolsView poolList={pools} title="Exotic Farms" guidePrompt="Exotic Farms Guide" />;
}


function PoolsView({ poolList, title, guidePrompt }: {
    title: string; guidePrompt: string;
    poolList: {
        title?: string;
        cashLogo?: string;
        pools: { duration: string; apr: number; czf: string; harvestable: string; }[]
    }[]
}) {

    return <div className="bg-secondary-mod-1 poolsView p-3">

        <div className="d-flex flex-row justify-content-between">
            <h4>{title}</h4>

            <Button variant='link' >
                <span className="guide">{guidePrompt}</span>
            </Button>
        </div>

        {poolList.map((pl, pi) => <div key={pi}>

            {pl.title && <div className='mt-4 mb-2 d-flex flex-row gap-2 align-items-center'>
                <h5 className="pt-2">{pl.title}</h5>
                <Button variant='link' >
                    <span className="guide">{pl.title}</span>
                </Button>
            </div>}

            {pl.pools.map((p, i) => <div key={i} className="bg-secondary-mod my-2 d-flex flex-row gap-2 p-2 align-items-center">


                <div>
                    <div className="poolLogo bg-secondary-mod-1">
                        <div className="logo"></div>
                    </div>

                    {pl.cashLogo && <div className="poolLogo bg-secondary-mod-1 cashLogo">
                        <div className={pl.cashLogo}></div>
                    </div>
                    }

                </div>

                <div className="flex-grow-1 text-center">
                    <small>Duration</small>
                    <h5>{p.duration}</h5>
                </div>

                <div className="flex-grow-1 text-center">
                    <small>APR</small>
                    <h5>{p.apr}%</h5>
                </div>

                <div className="flex-grow-1 text-center">
                    <small>Est. CZF/day</small>
                    <h5>{p.czf}%</h5>
                </div>

                <div className="flex-grow-1 text-center">
                    <small>Est. Harvestable</small>
                    <h5>{p.harvestable}%</h5>
                </div>

                <Button variant='link'>
                    <div className='poolBtn'></div>
                </Button>

            </div>)}

        </div>)}

    </div>;
}