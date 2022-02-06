import React from 'react';
import logo from './logo.svg';
import './App.scss';

import { Button, Dropdown } from 'react-bootstrap';
import { HashRouter, Link, Routes, Route } from 'react-router-dom';

import { ConnectWallet, Web3Provider, useweb3Context, useConnectCalls } from './components/web3';

import { ShowAddress } from './components/utils/display';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import Topbar from './components/topBar';


function MainContent() {
  const web3Ctx = useweb3Context();

  /*
  if( (!web3Ctx?.account) || web3Ctx?.reconnecting){
    return <ConnectWallet />;
  }
  */

  return <div>hello world</div>;

}

export default function () {

  return <Web3Provider>

    <div className='app d-flex flex-column app-dark-mode'>

      <Topbar />

      <div className='flex-grow-1 d-flex justify-content-center align-items-center'>
        <MainContent />
      </div>


    </div>
  </Web3Provider>;
};
