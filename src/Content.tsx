import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from 'react';

import { ReferendumPage } from '~pages/ReferendumPage';

import FarmsMigrate from '~pages/farms/FarmsMigrate';
import FarmsBoosterPage from '~pages/farms/FarmsBoostPage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DepositPage from './pages/DepositPage';
import { PoolDetailsPage } from './pages/pools/DetailsPage';
import SwapPage from './pages/SwapPage';
import { AccountPage } from './pages/AccountPage';
import { RecentActivityPage } from './pages/RecentActivityPage';
import { LiquidityPage } from './pages/pools/LiquidityPage';
import { YourLiquidityPage } from './pages/pools/YourLiquidityPage';
import { AddTokenPage } from './pages/pools/AddTokenPage';
import AdboardPage from './pages/Adboard/AdboardPage';
import NavigationBar from './components/layout/NavigationBar';
import Footer from './components/layout/Footer';
import { MorePoolsPage } from '~pages/pools/MorePoolsPage';
import StableSwapPage from './pages/stable/StableSwapPage';
import XrefPage from './pages/xref/XrefPage';
import RiskPage from './pages/RiskPage';
import USNPage from './pages/USNPage';
import {
  auroraAddr,
  getAuroraPool,
  getErc20Addr,
  useAuroraTokens,
} from './services/aurora/aurora';
import {
  BgShapeLeftTop,
  BgShapeCenter,
  BgShapeCenterSmall,
} from './components/icon';
import Modal from 'react-modal';

import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import { FarmsPage } from '~pages/farms/FarmsPage';
import { AirdropPage } from '~pages/AirdropPage';
import PopUpSwiper from '~components/layout/PopUp';
import SwapGuide from '~components/layout/SwapGuide';
import { isMobile } from '~utils/device';
import {
  wallet as webWallet,
  REF_FARM_CONTRACT_ID,
  STABLE_POOL_ID,
  STABLE_POOL_USN_ID,
  BTC_POOL_ID,
} from './services/near';
import {
  getSenderWallet,
  WALLET_TYPE,
  getCurrentWallet,
} from './utils/wallets-integration';
import {
  getURLInfo,
  failToast,
  usnBuyAndSellToast,
} from './components/layout/transactionTipPopUp';
import { StableSwapPageEntry } from '~pages/stable/StableSwapEntry';
import { senderSignedInToast } from '~components/layout/senderSignInPopUp';
import { getAllTriPools } from './services/aurora/aurora';

import {
  getSenderLoginRes,
  LOCK_INTERVAL,
  saveSenderLoginRes,
} from './utils/wallets-integration';
import {
  senderWallet,
  SENDER_WALLET_SIGNEDIN_STATE_KEY,
} from './utils/wallets-integration';

import {
  WalletContext,
  globalStateReducer,
  removeSenderLoginRes,
} from './utils/wallets-integration';

import { StableSwapRouter } from './pages/stable/StableSwapRouter';

import { useGlobalPopUp } from './state/popUp';
import { providers } from 'near-api-js';
import {
  ACCOUNT_ID_KEY,
  useWalletSelector,
} from './context/WalletSelectorContext';
import getConfig from './services/config';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { InjectedWallet } from '@near-wallet-selector/core';
import { REF_FARM_BOOST_CONTRACT_ID } from './services/near';

export type Account = AccountView & {
  account_id: string;
};

Modal.defaultStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
  },
  content: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -65%)',
  },
};

Modal.setAppElement('#root');

export function Content() {
  const GlobalStateReducer = useReducer(globalStateReducer, {
    isSignedIn: false,
  });
  const [globalState, globalStatedispatch] = GlobalStateReducer;

  const { selector, modal, accounts, accountId, setAccountId } =
    useWalletSelector();

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const provider = new providers.JsonRpcProvider({
      url: getConfig().nodeUrl,
    });

    return provider
      .query<AccountView>({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      })
      .then((data: any) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId]);

  useEffect(() => {
    if (!accountId) {
      return null;
    }

    getAccount()
      .then((res) => {
        console.log(res, 'dispatch sign in: content');

        globalStatedispatch({ type: 'signIn' });
      })
      .catch((e) => {
        console.log('this is error dispatch signin', e);
      });
  }, [accountId, getAccount]);

  useEffect(() => {
    if (
      !window?.near?.isSender ||
      selector?.store?.getState()?.selectedWalletId !== 'sender'
    )
      return;

    window.near.on('accountChanged', async (changedAccountId: string) => {
      const senderModule = selector.store
        .getState()
        .modules.find((m) => m.id === 'sender');

      const senderWallet = (await senderModule.wallet()) as InjectedWallet;

      await senderWallet.signIn({
        contractId: REF_FARM_BOOST_CONTRACT_ID,
      });

      window.location.reload();
    });
  }, [window.near]);

  useGlobalPopUp(globalState);

  return (
    <WalletContext.Provider value={{ globalState, globalStatedispatch }}>
      <NavigationBar />
      <ToastContainer
        style={{
          marginTop: isMobile() ? 'none' : '44px',
        }}
      />
      <Switch>
        <Route path="/account" component={AccountPage} />
        <Route path="/recent" component={RecentActivityPage} />
        <Route
          path="/more_pools/:tokenIds"
          component={AutoHeight(MorePoolsPage)}
        />
        <Route path="/pool/:id" component={AutoHeight(PoolDetailsPage)} />
        <Route path="/pools/add-token" component={AutoHeight(AddTokenPage)} />
        <Route path="/pools/yours" component={AutoHeight(YourLiquidityPage)} />
        <Route path="/pools" component={AutoHeight(LiquidityPage)} />
        <Route path="/airdrop" component={AutoHeight(AirdropPage)} />
        <Route path="/farms" component={AutoHeight(FarmsPage)} />
        <Route path={`/sauce/:id`} component={AutoHeight(StableSwapRouter)} />

        <Route path="/sauce" component={AutoHeight(StableSwapPageEntry)} />

        <Route path="/xref" component={AutoHeight(XrefPage)} />
        <Route path="/risks" component={AutoHeight(RiskPage)} />
        {!!getConfig().REF_VE_CONTRACT_ID ? (
          <Route path="/referendum" component={AutoHeight(ReferendumPage)} />
        ) : null}

        <Route path="/v2farms/:id?" component={AutoHeight(FarmsBoosterPage)} />
        <Route path="/farmsMigrate" component={AutoHeight(FarmsMigrate)} />
        <Route path="/" component={AutoHeight(SwapPage)} />
      </Switch>
    </WalletContext.Provider>
  );
}

// decorate any components with this HOC to display them as vertical-align middle
// use individual fn is needed since `h-4/5` is not a appropriate style rule for
// any components
function AutoHeight(Comp: any) {
  return (props: any) => {
    return (
      <div className="xs:flex xs:flex-col md:flex md:flex-col justify-center h-4/5 lg:mt-12 relative">
        <Comp {...props} />
      </div>
    );
  };
}
