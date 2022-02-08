import { useEffect, useState, useMemo, useRef } from "react";
import { useQueryParams, IAsyncResult, ShowError } from '../utils';

import {
    InputGroup, FormControl, Row, Col, Button,
    Modal, Nav, Form, Spinner
} from 'react-bootstrap';

import './web3.scss';

import { ChainInfo, Injectedweb3, ConnectCtx } from './injected';
import constate from 'constate';
import Web3 from "web3";
import {useDisplayMode} from '../utils/display';

//the default chain needs to be the first One
export const supportedChains: ChainInfo[] = [
    {
        chainId: '56', name: 'BSC', hexChainId: '0x38', 
        rpcProvider: 'https://bsc-dataseed.binance.org/', 
        explorer:'https://bscscan.com',
        contracts: {
            chronoPoolService: '0x5B11FB84ca9bBFA02894d7385bfD0d46F2D30843',
            exoticMaster: '0x37E4dDAfF95d684E1443B5F18C81deD953B627dD',
            czFarm: '0x7c1608C004F20c3520f70b924E2BfeF092dA0043'
        }
    },
    {
        chainId: '97', name: 'bsc Testnet', hexChainId: '0x61', 
            rpcProvider: 'https://data-seed-prebsc-1-s1.binance.org:8545/', 
            explorer:'https://testnet.bscscan.com',
            contracts: {
            chronoPoolService: '0xcc2604AA5ab2D0fa7A177A39c6A29aEC17a06bA5',
            exoticMaster: '0x26d36234aD95269a4318252d38B251b90c4f3A85',
            czFarm: '0xc74aA89c7e2BEB5F993b602e7a3ccdEFd92FddB9'
        }
    }
];

export const [Web3Provider,
    useweb3Context, useConnectCalls, useAccountCtx] = constate(
        useWeb3,
        v => v.ctx,
        v => v.connector,
        v => v.accountCtx
    );

function useWeb3() {

    const [ctx, setCtx] = useState<ConnectCtx & { chainInfo: ChainInfo, reconnecting?: boolean }>();
    const chainInfoRef = useRef<ChainInfo>();

    if(undefined === chainInfoRef.current){
        const isTestNet = window?.location?.search?.includes('testnet');
        chainInfoRef.current = isTestNet?supportedChains[1]:supportedChains[0];
    }
    
    const chainInfo = chainInfoRef.current;
    
    const [accountCtx, setAccountCtx] = useState<{ account?: string, networkId?: string,nounce:number }>({
        networkId:chainInfo.chainId,
        nounce:0
    });

    

    useEffect(() => {

        try {
            
            const injected = new Injectedweb3();

            injected.injected.on('accountsChanged', function (accounts: string[]) {
                
                setAccountCtx({ ...accountCtx, account: (accounts && accounts.length > 0 && accounts[0]) || undefined });
            });

            injected.injected.on('networkChanged', function (networkId: string) {
                
                setAccountCtx({ ...accountCtx, networkId });
            });

        } catch (err: any) {
            console.error(`failed to init web3 :${err}`);
        }

    }, []);

    const connect = async () => {
        const injected = new Injectedweb3();
        const r = await injected.connect(chainInfo);

        const myCtx = { ...r, chainInfo: chainInfo };
        setCtx(myCtx);

        if(myCtx?.account != accountCtx?.account || chainInfo.chainId != accountCtx?.networkId ){
            setAccountCtx({ networkId:chainInfo.chainId, account:myCtx?.account, nounce:0});
        }

        return myCtx;
    }

    const invalidDateBalance= ()=>{
        setAccountCtx({ ...accountCtx, nounce:accountCtx.nounce+1 });
    }

    const readOnly = async () => {
        const web3ro = new Web3(chainInfo.rpcProvider);

        return { web3ro, chainInfo: chainInfo };
    }

    const disconnect = async () => {
        if (!ctx?.chainInfo)
            return;

        try {
            setCtx({ ...ctx, reconnecting: true });

            const injected = new Injectedweb3();
            await injected.disconnect();
            const r = await injected.connect(ctx?.chainInfo);
            setCtx({ ...r, chainInfo: ctx?.chainInfo });

        } catch (error: any) {
            setCtx({ ...ctx, reconnecting: false });
            console.error(`failed to reconnect ${error}`);
        }

    }

    const connector = useMemo(() => ({
        connect,
        readOnly,
        disconnect,
        invalidDateBalance
    }), [ctx]);

    return { ctx, connector, accountCtx };
}

export type TxModelProp = {txHash:string;chainInfo:ChainInfo};

export function TxModal({ txResult, onClose }: {
    onClose: () => any;
    txResult: IAsyncResult<TxModelProp>;
}) {
    const {darkMode} = useDisplayMode();
    return <Modal show centered onHide={() => !txResult.isLoading && onClose && onClose()}
        contentClassName={"txModal "+ (darkMode?'app-dark-mode':'app-light-mode')}>

        <Modal.Header closeButton>
            <Modal.Title>{txResult.result ? 'Transaction Sent' : 'Sign Transaction'}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="m-5">

            <div className="d-flex flex-column align-items-center">

                {txResult.isLoading && <>
                    <div className="bigSpinner mb-4 d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>

                    <p>Please sign transaction in your wallet</p>
                </>
                }

                {txResult.error && <ShowError error={txResult.error} />}

                {txResult.result && <>
                    <div className="txDone mb-4"></div>

                    <small>{txResult.result.txHash}</small>
                </>}

            </div>


        </Modal.Body>

        <Modal.Footer>

            {txResult.result && <Button variant="primary" onClick={() => {
                window.open(`${txResult.result?.chainInfo.explorer}/tx/${txResult.result?.txHash}`);
             }}>
                <div className="vBscScan">View on BscScan</div>
            </Button>
            }

            <Button variant="secondary" disabled={!!txResult.isLoading} onClick={() => !txResult.isLoading && onClose && onClose()}>
                Close
            </Button>

        </Modal.Footer>

    </Modal>;
}


export function ConnectWallet() {

    const qParams = useQueryParams();
    const { connect } = useConnectCalls();
    const liftedCtx = useweb3Context();


    const [web3ctx, setWeb3Ctx] = useState<IAsyncResult<{
        ctx?: ConnectCtx;
    }>>({ isLoading: true });

    useEffect(() => {
        console.log('connecting wallet');

        if (liftedCtx?.reconnecting) {
            console.log('wallet is reconnecting exit');
            return;
        }

        let injected: any = undefined;

        if (typeof window !== "undefined") {
            injected = (window as any)?.ethereum;
        }

        if (!injected) {
            console.log("no injected provider found");
            setWeb3Ctx({ result: {} });
            return;
        }

        const usingTestnet = qParams['network'] == 'test';
        console.log(`usingTestnet = ${usingTestnet}`);

        const chainInfo = supportedChains[usingTestnet ? 1 : 0];

        (async () => {
            try {
                const ctx = await connect();
                setWeb3Ctx({ result: { ctx } });

            } catch (error: any) {
                setWeb3Ctx({ error });
            }

        })();

    }, []);

    if (!!web3ctx.isLoading || liftedCtx?.reconnecting) {
        return <div className="p-3 d-flex ">
            <Spinner animation="border" variant="primary" />
            <span className="m-1">Waiting for wallet</span>
        </div>;
    }

    if (!!web3ctx?.error) {
        return <ShowError error={web3ctx?.error} />
    }

    if (web3ctx.result && !web3ctx.result.ctx) {
        return <div className="text-center">
            <h2>No injected wallet found</h2>
            <p>We suggest installing <a href="https://metamask.io/download">Metamask</a></p>
        </div>;
    }

    return <div>ok </div>;
}
