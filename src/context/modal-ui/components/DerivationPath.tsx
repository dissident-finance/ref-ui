import React, { KeyboardEventHandler, useState } from 'react';
import type {
  HardwareWallet,
  HardwareWalletAccount,
  Wallet,
  WalletSelector,
} from '@near-wallet-selector/core';
import type { ModalOptions } from '../modal.types';
import type { DerivationPathModalRouteParams } from './Modal.types';
import HardwareWalletAccountsForm from './HardwareWalletAccountsForm';
import { WalletConnecting } from './WalletConnecting';
import { GradientWrapper } from './BorderWrapper';
import { FormattedMessage } from 'react-intl';
import getConfig from '../../../services/config';

interface DerivationPathProps {
  selector: WalletSelector;
  options: ModalOptions;
  onBack: () => void;
  onConnected: () => void;
  params: DerivationPathModalRouteParams;
  onError: (message: string) => void;
}

export type HardwareWalletAccountState = HardwareWalletAccount & {
  selected: boolean;
};

type HardwareRoutes =
  | 'EnterDerivationPath'
  | 'NoAccountsFound'
  | 'ChooseAccount'
  | 'AddCustomAccountId'
  | 'OverviewAccounts';

export const DEFAULT_DERIVATION_PATH = "44'/397'/0'/0'/1'";

export const DerivationPath: React.FC<DerivationPathProps> = ({
  selector,
  options,
  onBack,
  onConnected,
  params,
  onError,
}) => {
  const [route, setRoute] = useState<HardwareRoutes>('EnterDerivationPath');
  const [derivationPath, setDerivationPath] = useState(DEFAULT_DERIVATION_PATH);
  const [accounts, setAccounts] = useState<Array<HardwareWalletAccountState>>(
    []
  );
  const [hardwareWallet, setHardwareWallet] = useState<Wallet>();
  const [customAccountId, setCustomAccountId] = useState('');
  const [connecting, setConnecting] = useState(false);

  const getAccountIds = async (publicKey: string): Promise<Array<string>> => {
    const response = await fetch(
      `${selector.options.network.indexerUrl}/publicKey/ed25519:${publicKey}/accounts`
    );

    if (!response.ok) {
      throw new Error('Failed to get account id from public key');
    }

    const accountIds = await response.json();

    if (!Array.isArray(accountIds) || !accountIds.length) {
      return [];
    }
    // return [];

    if (
      typeof getConfig().kitWalletOn === 'boolean' &&
      !getConfig().kitWalletOn
    ) {
      throw new Error();
    } else {
      return accountIds;
    }
  };

  const resolveAccounts = async (
    wallet: Wallet
  ): Promise<Array<HardwareWalletAccountState> | null> => {
    const publicKey = await (wallet as HardwareWallet).getPublicKey(
      derivationPath
    );
    try {
      const accountIds = await getAccountIds(publicKey);

      return accountIds.map((accountId, index) => {
        return {
          derivationPath,
          publicKey,
          accountId,
          selected: index === 0,
        };
      });
    } catch (e) {
      return null;
    }
  };

  const handleValidateAccount = async () => {
    const wallet = await selector.wallet(params.walletId);

    if (wallet.type !== 'hardware') {
      return;
    }

    setConnecting(true);
    setHardwareWallet(wallet);

    try {
      const resolvedAccounts = await resolveAccounts(wallet);
      if (!resolvedAccounts) {
        setRoute('AddCustomAccountId');
        return;
      }
      const noAccounts = resolvedAccounts.length === 0;
      const multipleAccounts = resolvedAccounts.length > 1;

      if (noAccounts) {
        setRoute('NoAccountsFound');
        return;
      }
      setAccounts(resolvedAccounts);

      if (!multipleAccounts) {
        setRoute('OverviewAccounts');
      } else {
        setRoute('ChooseAccount');
      }
    } catch (err) {
      setConnecting(false);
      const message =
        err instanceof Error ? err.message : 'Something went wrong';

      console.log(message);

      onError(message);
    } finally {
      setConnecting(false);
    }
  };

  const handleAddCustomAccountId = async () => {
    try {
      setConnecting(true);

      const publicKey = await (hardwareWallet as HardwareWallet).getPublicKey(
        derivationPath
      );
      setAccounts([
        {
          derivationPath: derivationPath,
          publicKey,
          accountId: customAccountId,
          selected: true,
        },
      ]);
      setRoute('OverviewAccounts');
    } catch (err) {
      setConnecting(false);
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      onError(message);
    } finally {
      setConnecting(false);
    }
  };

  const handleSignIn = async () => {
    const mapAccounts = accounts.map((account: HardwareWalletAccount) => {
      return {
        derivationPath: account.derivationPath,
        publicKey: account.publicKey,
        accountId: account.accountId,
      };
    });

    return hardwareWallet!
      .signIn({
        contractId: options.contractId,
        methodNames: options.methodNames,
        accounts: mapAccounts,
      })
      .then(() => onConnected())
      .catch((err) => {
        console.log(err);

        onError(`Error: ${err.message}`);
      });
  };

  const handleEnterClick: KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.key === 'Enter') {
      await handleValidateAccount();
    }
  };

  if (connecting) {
    return (
      <div className="derivation-path-wrapper">
        <WalletConnecting
          wallet={hardwareWallet}
          onBack={() => {
            setConnecting(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="derivation-path-wrapper">
      <div className="flex items-centerk justify-center mb-7">
        <img
          src="https://ref-finance-images.s3.amazonaws.com/images/wallets-icons/ledger.png"
          alt=""
          className="w-12"
        />
      </div>
      <div className="pb-4 text-xl">Ledger</div>
      {route === 'EnterDerivationPath' && (
        <div className="enter-derivation-path">
          <div>
            <p className="text-center">
              Make sure your device is plugged in, then enter a derivation path
              to connect:
            </p>

            <div className=" mb-2 mt-4 flex items-center justify-center text-sm text-primaryText">
              <GradientWrapper className="rounded-full mr-2">
                <input
                  className="pl-4 py-2 text-white  rounded-full bg-black bg-opacity-10"
                  type="text"
                  placeholder="Derivation Path"
                  value={derivationPath}
                  onChange={(e) => {
                    setDerivationPath(e.target.value);
                  }}
                  style={{
                    backgroundColor: '#202834',
                    textAlign: 'center',
                  }}
                  onKeyPress={handleEnterClick}
                />
              </GradientWrapper>
            </div>
          </div>
          <button
            className="py-1.5 flex items-center justify-center mx-auto text-sm rounded-lg"
            style={{
              width: '242px',
              background: 'linear-gradient(180deg, #00C6A2 0%, #008B72 100%)',
              height: '40px',
              marginBottom: '5px',
            }}
            onClick={handleValidateAccount}
          >
            <FormattedMessage id="connect" defaultMessage="Connect" />
          </button>
        </div>
      )}

      {route === 'NoAccountsFound' && (
        <div className="no-accounts-found-wrapper">
          <p>
            Can't found any account associated with this Ledger. Please create a
            new NEAR account on{' '}
            <a
              href={`https://${
                selector.options.network.networkId === 'testnet'
                  ? 'testnet'
                  : 'app'
              }.mynearwallet.com/create`}
              target="_blank"
            >
              MyNearWallet
            </a>{' '}
            or connect an another Ledger.
          </p>
          <div className="action-buttons">
            <button
              className="left-button"
              onClick={() => {
                setRoute('EnterDerivationPath');
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {route === 'ChooseAccount' && (
        <HardwareWalletAccountsForm
          accounts={accounts}
          onSelectedChanged={(index, selected) => {
            setAccounts((prevAccounts) => {
              const updateAccounts = prevAccounts.map((account, idx) => {
                const selectedValue =
                  index === idx ? selected : account.selected;
                return {
                  ...account,
                  selected: selectedValue,
                };
              });
              return [...updateAccounts];
            });
          }}
          onSubmit={(acc, e) => {
            e.preventDefault();
            setAccounts((prevAccounts) => {
              const selectedAccounts = prevAccounts.filter(
                (account) => account.selected
              );

              return [...selectedAccounts];
            });
            setRoute('OverviewAccounts');
          }}
        />
      )}
      {route === 'AddCustomAccountId' && (
        <div className="enter-custom-account">
          <p className="text-center">
            Failed to automatically find account id. Provide it manually:
          </p>
          <div className=" mt-4 mb-2 flex items-center justify-start text-sm text-primaryText">
            <GradientWrapper className="rounded-full mr-2">
              <input
                type="text"
                placeholder="Account ID"
                value={customAccountId}
                onChange={(e) => {
                  setCustomAccountId(e.target.value);
                }}
                style={{
                  backgroundColor: '#202834',
                }}
              />
            </GradientWrapper>
          </div>
          <div className="action-buttons">
            <button className="right-button" onClick={handleAddCustomAccountId}>
              Continue
            </button>
          </div>
        </div>
      )}
      {route === 'OverviewAccounts' && (
        <div className="overview-wrapper">
          <div className="overview-header">
            <h4>Accounts</h4>
          </div>
          {accounts.map((account, index) => (
            <div key={account.accountId}>
              <div className="account">
                <span>{account.accountId}</span>
              </div>
            </div>
          ))}

          <div className="action-buttons">
            <button
              className="right-button"
              onClick={handleSignIn}
              disabled={accounts.length === 0}
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
