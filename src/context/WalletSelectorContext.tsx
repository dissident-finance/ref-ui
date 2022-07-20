import React, { useCallback, useContext, useEffect, useState } from 'react';
import { map, distinctUntilChanged } from 'rxjs';
import { NetworkId, setupWalletSelector } from '@near-wallet-selector/core';
import type { WalletSelector, AccountState } from '@near-wallet-selector/core';
import { setupModal } from './modal-ui';
import type { WalletSelectorModal } from './modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet/src';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupMathWallet } from '@near-wallet-selector/math-wallet';
import { setupNightly } from '@near-wallet-selector/nightly';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupWalletConnect } from '@near-wallet-selector/wallet-connect/src';
import { setupNightlyConnect } from '@near-wallet-selector/nightly-connect';

import { InjectedWallet } from '@near-wallet-selector/core';

import getConfig from '../services/config';

import './modal-ui/components/styles';
import { REF_FARM_CONTRACT_ID } from '../services/near';

const CONTRACT_ID = getConfig().REF_FARM_CONTRACT_ID;

export const ACCOUNT_ID_KEY = 'REF_FI_STATE_SYNC_ACCOUNT_ID';

declare global {
  interface Window {
    selector: WalletSelector & {
      getAccountId?: () => string;
    };
    modal: WalletSelectorModal;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
  setAccountId: (accountId: string) => void;
}

const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);

  const syncAccountState = (
    currentAccountId: string | null,
    newAccounts: Array<AccountState>
  ) => {
    if (!newAccounts.length) {
      localStorage.removeItem(ACCOUNT_ID_KEY);
      setAccountId(null);
      setAccounts([]);

      return;
    }

    const validAccountId =
      currentAccountId &&
      newAccounts.some((x) => x.accountId === currentAccountId);
    const newAccountId = validAccountId
      ? currentAccountId
      : newAccounts[0].accountId;

    localStorage.setItem(ACCOUNT_ID_KEY, newAccountId);
    setAccountId(newAccountId);
    console.log('this is new account id');
    setAccounts(newAccounts);
  };

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: getConfig().networkId as NetworkId,
      debug: false,
      modules: [
        setupNearWallet({
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/near-wallet.png',
        }),
        setupMyNearWallet({
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/my-near-wallet.png',
        }),
        setupSender({
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/sender.png',
        }),
        setupMathWallet({
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/math-wallet.png',
        }),
        setupNightly({
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/nightly.png',
        }),
        setupLedger({
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/ledger.png',
        }),
        setupNightlyConnect({
          url: 'wss://ncproxy.nightly.app/app',
          appMetadata: {
            additionalInfo: '',
            application: 'ref fiannce',
            description: 'Example dApp used by NEAR Wallet Selector',
            icon: 'https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png',
          },
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/nightly-connect.png',
        }),
        setupWalletConnect({
          projectId: '423baa464ffaeca9d7165ab4222d534f',
          relayUrl: 'wss://relay.walletconnect.com',
          metadata: {
            name: 'ref_finance',
            description: 'Example dApp used by NEAR Wallet Selector',
            url: 'https://github.com/near/wallet-selector',
            icons: ['https://avatars.githubusercontent.com/u/37784886'],
          },
          iconUrl:
            'https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/WalletConnect.png',
        }),
      ],
    });
    const _modal = setupModal(_selector, { contractId: CONTRACT_ID });
    const state = _selector.store.getState();
    syncAccountState(localStorage.getItem(ACCOUNT_ID_KEY), state.accounts);

    window.selector = _selector;
    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
  }, []);

  useEffect(() => {
    init()
      .catch((err) => {
        console.error(err);
        console.log(err);
        alert('Failed to initialise wallet selector');
      })
      .then(() => {
        const subscription = selector.store.observable
          .pipe(
            map((state) => state.accounts),
            distinctUntilChanged()
          )
          .subscribe((nextAccounts) => {
            syncAccountState(accountId, nextAccounts);
          });
      });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log('acconts update ', nextAccounts);

        syncAccountState(accountId, nextAccounts);
      });

    return () => subscription.unsubscribe();
  }, [selector, accountId]);

  useEffect(() => {
    if (!selector || !modal) return;
    if (!window?.near?.isSender) return;

    window.near.on('accountChanged', async (changedAccountId: string) => {
      // window.location.reload();
      const currentWallet = await selector.wallet();

      await currentWallet.signOut();

      const senderModule = selector.store
        .getState()
        .modules.find((m) => m.id === 'sender');

      const senderWallet = (await senderModule.wallet()) as InjectedWallet;

      await senderWallet.signIn({
        contractId: REF_FARM_CONTRACT_ID,
      });
    });
  }, [selector, modal]);

  if (!selector || !modal) {
    return null;
  }

  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
        setAccountId,
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      'useWalletSelector must be used within a WalletSelectorContextProvider'
    );
  }

  return context;
}
