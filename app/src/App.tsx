import React from 'react';
import logo from './logo.svg';
import './App.scss';

import { Button, Dropdown } from 'react-bootstrap';
import { HashRouter, Link, Routes, Route } from 'react-router-dom';

import { ConnectWallet, Web3Provider, useweb3Context, useConnectCalls } from './components/web3';

import { ShowAddress } from './components/utils/display';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Topbar, BottomBar } from './components/navbars';
import MainContent from './components/main';


export default function () {

  return <Web3Provider>

    <div className='app d-flex flex-column app-dark-mode'>

      <Topbar />

      <div className="mainContentHolder py-5">

        <div className='flex-grow-1 d-flex justify-content-center align-items-center'>
          <MainContent />
        </div>

        <BottomBar />

      </div>

    </div>
  </Web3Provider>;
};
