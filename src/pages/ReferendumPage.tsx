import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FormattedMessage, FormattedRelativeTime, useIntl } from 'react-intl';
import { WRAP_NEAR_CONTRACT_ID } from '~services/wrap-near';
import { Card } from '../components/card/Card';
import { REF_TOKEN_ID, REF_VE_CONTRACT_ID } from '../services/near';
import {
  ftGetTokenMetadata,
  TokenMetadata,
  REF_META_DATA,
} from '../services/ft-contract';
import { Images } from '~components/stableswap/CommonComp';
import { wnearMetadata, unwrapedNear } from '../services/wrap-near';
import { usePoolShare } from '../state/pool';
import {
  NewGradientButton,
  BorderGradientButton,
  CheckRadioButtonVE,
} from '../components/button/Button';
import { useHistory } from 'react-router-dom';
import {
  getAccountInfo,
  getVEMetaData,
  getVEConfig,
  lockLP,
  unlockLP,
} from '../services/referendum';
import { ONLY_ZEROS, percent, divide, multiply } from '../utils/numbers';
import { VotingPowerIcon } from '~components/icon/Referendum';
import {
  LOVEBoosterIcon,
  PowerZone,
  LOVE_ICON,
} from '../components/icon/Referendum';
import Modal from 'react-modal';
import { CloseIcon, mapToView } from '../components/icon/Actions';
import { Symbols } from '../components/stableswap/CommonComp';
import { NewFarmInputAmount } from '~components/forms/InputAmount';
import { isMobile } from '../utils/device';
import { VEConfig } from '../services/referendum';
import {
  useLOVEbalance,
  useLOVEmeta,
  useMultiplier,
  useUnClaimedRewardsVE,
} from '~state/referendum';
import { ArrowLeftIcon } from '~components/icon/FarmBoost';
import {
  LeftArrowVE,
  RightArrowVE,
  VE_ICON,
} from '../components/icon/Referendum';

import moment, { duration } from 'moment';
import { CheckedTick, ErrorTriangle, TipTriangle } from '~components/icon';
import { UnCheckedBoxVE } from '../components/icon/CheckBox';
import {
  toReadableNumber,
  toNonDivisibleNumber,
  calcStableSwapPriceImpact,
} from '../utils/numbers';
import Big from 'big.js';
import {
  LOVE_TOKEN_DECIMAL,
  useAccountInfo,
  UnclaimedProposal,
} from '../state/referendum';
import { ProposalTab, ProposalCard } from '../components/layout/Proposal';
import { WalletContext } from '../utils/sender-wallet';
import { scientificNotationToString, toPrecision } from '../utils/numbers';
import { WarnTriangle } from '../components/icon/SwapRefresh';
import { useTokens, useTokenPriceList } from '../state/token';
import { GiftIcon, RewardCheck } from '../components/icon/Referendum';
import { toRealSymbol } from '../utils/token';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import {
  ConnectToNearBtnGradient,
  WithGradientButton,
} from '../components/button/Button';

export interface AccountInfo {
  duration_sec: number;
  lpt_amount: string;
  rewards: string[];
  sponsor_id: string;
  unlock_timestamp: string;
  ve_lpt_amount: string;
}

const RewardCard = ({ rewardList }: { rewardList: Record<string, string> }) => {
  const tokens = useTokens(Object.keys(rewardList));
  const tokenPriceList = useTokenPriceList();
  const [checkList, setCheckList] = useState<string[]>();

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const RewardRow = ({ id, token }: { id: string; token: TokenMetadata }) => {
    const price = tokenPriceList[id];
    const total = new Big(price).times(rewardList[id]).toNumber().toFixed(3);
    const amount = rewardList[id];
    return (
      <div className="flex items-center justify-between text-white text-sm pb-2.5">
        <div className="flex items-center px-2">
          <div
            className={`mr-2 w-4 h-4 rounde bg-opacity-30 ${
              checkList.indexOf(id) !== -1 ? 'bg-black' : 'bg-white'
            } flex items-center justify-center`}
          >
            {checkList.indexOf(id) !== -1 ? null : <RewardCheck />}
          </div>

          {token.icon ? (
            <img
              src={token.icon}
              className="rounded-full w-6 h-6 border border-gradientFrom mr-2"
            />
          ) : (
            <div className="rounded-full w-6 h-6 border border-gradientFrom mr-2"></div>
          )}

          <div className="flex flex-col">
            <span>{toRealSymbol(token.symbol)}</span>

            <span className="bg-opacity-50">${amount}</span>
          </div>
        </div>

        <div className="flex  flex-col">
          <span>{toPrecision(amount, 2)}</span>

          <span className="bg-opacity-50">${total}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="px-3 pt-3 rounded-lg bg-veGradient flex flex-col w-80 fixed top-20 right-0 text-sm">
      <div
        className="flex items-center pb-4 relative cursor-pointer"
        onClick={() => setShowDetail(!showDetail)}
      >
        <span className="mr-2">
          <GiftIcon />
        </span>

        <span>
          {Object.keys(rewardList).length}{' '}
          <FormattedMessage
            id="rewards to be withdraw"
            defaultMessage="rewards to be withdraw"
          />
          !
        </span>

        <button className="pl-1 text-sm absolute right-0">
          {showDetail ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      </div>
      {!showDetail ? null : (
        <>
          <div className="bg-balck bg-opacity-30 rounded-lg pb-4">
            {tokens?.map((token) => {
              return <RewardRow id={token.id} token={token} />;
            })}
          </div>

          <div className="flex items-center justify-between pb-4">
            <button
              className={`mr-2  flex items-center justify-center`}
              onClick={() => setCheckList(tokens.map((token) => token.id))}
            >
              <div
                className={`mr-2 h-4 w-4 rounded bg-opacity-30 flex items-center justify-center ${
                  tokens?.length > 0 &&
                  tokens.every((token) => checkList.includes(token.id))
                    ? 'bg-black'
                    : 'bg-white'
                }`}
              >
                {tokens?.length > 0 &&
                tokens.every((token) => checkList.includes(token.id)) ? (
                  <RewardCheck />
                ) : null}
              </div>

              <span className="">
                <FormattedMessage id="all" defaultMessage={'all'} />
              </span>
            </button>

            <button className="px-5 py-1.5 bg-black bg-opacity-30 rounded-lg">
              <FormattedMessage id="withdraw" defaultMessage={'withdraw'} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const timeStampToDate = (ts: number) => {
  return moment(ts * 1000).format('YYYY-MM-DD');
};

export const getPoolId = (env: string = process.env.NEAR_ENV) => {
  switch (env) {
    case 'pub-testnet':
      return 269;
    case 'testnet':
      return 269;
    case 'mainnet':
      return 79;
    default:
      return 79;
  }
};

export const ModalWrapper = (
  props: Modal.Props & {
    title: JSX.Element | string | null;
    customWidth?: string;
    customHeight?: string;
  }
) => {
  const { isOpen, onRequestClose, title, customHeight, customWidth } = props;

  const cardWidth = isMobile() ? '90vw' : '423px';
  const cardHeight = isMobile() ? '90vh' : '80vh';
  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          overflow: 'auto',
        },
        content: {
          outline: 'none',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <Card
        width="w-full"
        className="border border-gradientFrom border-opacity-50 flex flex-col justify-center text-white"
        style={{
          width: customWidth || cardWidth,
          maxHeight: customHeight || cardHeight,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl ">{title}</span>

          <button className="pl-2 pb-1" onClick={onRequestClose}>
            <CloseIcon width="12" height="12" />
          </button>
        </div>

        {props.children}
      </Card>
    </Modal>
  );
};

export const LockPopUp = ({
  isOpen,
  onRequestClose,
  tokens,
  lpShare,
  accountInfo,
  title,
}: {
  isOpen: boolean;
  onRequestClose: (e?: any) => void;
  tokens: TokenMetadata[];
  lpShare: string;
  accountInfo: AccountInfo;
  title?: string;
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const [duration, setDuration] = useState<number>(0);

  const [config, setConfig] = useState<VEConfig>();

  const [termsCheck, setTermsCheck] = useState<boolean>(false);
  const preLocked = Number(accountInfo?.unlock_timestamp) > 0;

  useEffect(() => {
    getVEConfig().then((res) => setConfig(res));
  }, []);

  const balance = useLOVEbalance();

  const { multiplier, finalAmount, appendAmount, finalLoveAmount } =
    useMultiplier({
      duration: duration || 0,
      maxMultiplier: config?.max_locking_multiplier || 20000,
      maxDuration: config?.max_locking_duration_sec || 31104000,
      amount: toNonDivisibleNumber(24, inputValue),
      lockedAmount: accountInfo?.lpt_amount || '0',
      curDuration: accountInfo?.duration_sec || 0,
      curVEAmount: accountInfo?.ve_lpt_amount || '0',
      loveBalance: balance,
    });

  const unlockTime = Number(
    new Big(accountInfo?.unlock_timestamp || 0)
      .div(new Big(1000000000))
      .toNumber()
      .toFixed()
  );
  const leftTime = useMemo(() => {
    return unlockTime - moment().unix();
  }, [unlockTime]);

  if (!config) return null;

  const candidateDurations = [2592000, 7776000, 15552000, 31104000].filter(
    (d) => d + moment().unix() >= unlockTime
  );

  if (leftTime > config.min_locking_duration_sec) {
    candidateDurations.unshift(leftTime);
  }

  const showVeAmount = !ONLY_ZEROS.test(inputValue) && duration;

  const currentVeAmount = toPrecision(
    toReadableNumber(LOVE_TOKEN_DECIMAL, accountInfo?.ve_lpt_amount),
    2
  );

  const Durations = () => (
    <div className="w-full flex items-center pt-1.5">
      {candidateDurations.map((d) => {
        const base = 2592000;
        return (
          <button
            key={d}
            className={`rounded-lg  mr-2.5 hover:bg-gradientFrom  ${
              duration === d
                ? 'text-chartBg bg-gradientFrom'
                : 'text-farmText bg-black bg-opacity-20'
            } hover:text-chartBg px-3 py-1 text-xs`}
            onClick={() => setDuration(d)}
          >
            {' '}
            {d === leftTime ? (
              <span>
                {' '}
                <FormattedMessage id="keep" defaultMessage={'keep'} />
                &nbsp; {timeStampToDate(unlockTime)}{' '}
              </span>
            ) : (
              <span>
                {d / base} &nbsp;
                <FormattedMessage
                  id={d / base > 1 ? 'months' : 'month'}
                  defaultMessage={d / base > 1 ? 'months' : 'month'}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        setInputValue('');
      }}
      title={
        <FormattedMessage
          id={title || 'lock_lp_tokens'}
          defaultMessage="Lock LP Tokens"
        />
      }
    >
      <div className="flex flex-col text-white pt-4">
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center">
            <Images tokens={tokens} size={'7'} />
            &nbsp;
            <Symbols withArrow={false} tokens={tokens} size="text-base" />
            <button
              className="text-gradientFrom pl-1 py-1"
              onClick={() => window.open(`/pool/${getPoolId()}`, '_blank')}
            >
              ↗
            </button>
          </div>
          <span>
            {!ONLY_ZEROS.test(lpShare) ? (
              toPrecision(lpShare, 2)
            ) : (
              <button
                className="text-gradientFrom"
                onClick={() => window.open(`/pool/${getPoolId()}`, '_blank')}
              >
                <FormattedMessage
                  id="get_lptoken"
                  defaultMessage={'Get LPtoken'}
                />
                &nbsp; ↗
              </button>
            )}
          </span>
        </div>

        <NewFarmInputAmount max={lpShare} onChangeAmount={setInputValue} />

        <div className="text-sm text-farmText py-5 pb-2.5 flex items-center justify-between">
          <span>
            <FormattedMessage id="durations" defaultMessage="Durations" />
          </span>

          <span className="text-white">
            {timeStampToDate(moment().unix() + duration)}
          </span>
        </div>

        {preLocked ? (
          <div className="flex items-center pb-1.5">
            <span className="mr-1">
              <TipTriangle h="14" w="13" c="#00C6A2" />
            </span>
            <span className="text-xs text-farmText">
              <FormattedMessage
                id="ve_lock_tip"
                defaultMessage={'Cannot be earlier than current duration'}
              />
            </span>
          </div>
        ) : null}

        <Durations />

        <div className="text-sm text-farmText pt-7 pb-2.5 flex items-center justify-between">
          <span>
            <FormattedMessage id="get" defaultMessage="Get" />
          </span>

          <span className="bg-gradientFromHover rounded-md text-xs px-1 text-black">
            {showVeAmount ? multiplier.toFixed(1) + 'x' : '1.0x'}
          </span>
        </div>

        <div className="rounded-lg bg-black bg-opacity-20 pt-6 pb-5 flex items-center justify-between ">
          <div className="flex flex-col w-full items-center pl-2 border-r border-white border-opacity-10">
            <div className="flex items-center">
              {preLocked && showVeAmount ? (
                <>
                  <span className="text-farmText text-xs">
                    {currentVeAmount}
                  </span>

                  <span className="mx-3">
                    <RightArrowVE />
                  </span>
                </>
              ) : null}
              <span
                className={`text-lg ${
                  showVeAmount ? 'text-white' : 'text-farmText'
                } `}
              >
                {showVeAmount ? finalAmount : '0'}
              </span>
            </div>
            <span className="pt-1 text-sm text-farmText flex items-center">
              <span className="mr-1">
                <VE_ICON />
              </span>
              <span>veLPT</span>
            </span>
          </div>
          <div className="flex flex-col w-full items-center pr-2">
            <div className="flex items-center">
              {preLocked && showVeAmount ? (
                <>
                  <span className="text-farmText text-xs">
                    {toPrecision(balance, 2)}
                  </span>
                  <span className="mx-3">
                    <RightArrowVE />
                  </span>
                </>
              ) : null}
              <span
                className={`text-lg ${
                  showVeAmount ? 'text-white' : 'text-farmText'
                }`}
              >
                {showVeAmount ? finalLoveAmount : '0'}
              </span>
            </div>
            <span className="pt-1 text-sm text-farmText flex items-center">
              <span className="mr-1">
                <LOVE_ICON />
              </span>
              <span>LOVE</span>
            </span>
          </div>
        </div>

        {!showVeAmount || !preLocked ? null : (
          <div className="rounded-lg border text-sm border-gradientFrom px-3 py-2.5 mt-4 text-center">
            <span>
              <FormattedMessage
                id="existing_amount"
                defaultMessage={'Existing amount'}
              />{' '}
              <span className="text-gradientFrom">
                {toPrecision(toReadableNumber(24, accountInfo.lpt_amount), 2)}
              </span>{' '}
              +{' '}
              <FormattedMessage
                id="append_amount"
                defaultMessage={'Append amount'}
              />{' '}
              <span className="text-gradientFrom">
                {toPrecision(inputValue, 2)}
              </span>{' '}
              <FormattedMessage
                id="will_be_able_to_unstake_after"
                defaultMessage={'will be able to unstaked after'}
              />{' '}
              <span className="text-gradientFrom">
                {moment(moment().unix() * 1000 + duration * 1000).format('ll')}
              </span>
            </span>
          </div>
        )}

        <NewGradientButton
          text={
            ONLY_ZEROS.test(lpShare) ? (
              <FormattedMessage
                id="you_have_no_lp_share"
                defaultMessage={'You have no LPtoken'}
              />
            ) : (
              <FormattedMessage id="lock" defaultMessage={'Lock'} />
            )
          }
          className="mt-6 text-lg"
          onClick={() =>
            lockLP({
              token_id: ':' + getPoolId().toString(),
              amount: toNonDivisibleNumber(24, inputValue),
              duration,
              leftTime,
            })
          }
          disabled={
            !termsCheck ||
            ONLY_ZEROS.test(inputValue) ||
            !duration ||
            ONLY_ZEROS.test(lpShare)
          }
        />

        <div className="pt-4 text-sm flex items-start ">
          <button
            className="w-4 h-4 bg-navHighLightBg flex items-center text-gradientFrom justify-center border flex-shrink-0 border-gradientFrom rounded mr-2.5"
            onClick={() => {
              setTermsCheck(!termsCheck);
            }}
          >
            {!termsCheck ? null : <RewardCheck />}
          </button>

          <span>
            I understand and accept the terms relating to the early unlocking
            penalty
          </span>
        </div>
      </div>
    </ModalWrapper>
  );
};

const UnLockPopUp = ({
  isOpen,
  onRequestClose,
  tokens,
  lpShare,
  accountInfo,
}: {
  isOpen: boolean;
  onRequestClose: (e?: any) => void;
  tokens: TokenMetadata[];
  lpShare: string;
  accountInfo: AccountInfo;
}) => {
  const preLocked = accountInfo?.unlock_timestamp;
  const unlockTime = Number(
    new Big(preLocked || 0).div(new Big(1000000000)).toNumber().toFixed()
  );

  const balance = useLOVEbalance();

  const currentVeAmount = toPrecision(
    toReadableNumber(LOVE_TOKEN_DECIMAL, accountInfo?.ve_lpt_amount),
    2
  );

  const lockedLPAmount = toPrecision(
    toReadableNumber(24, accountInfo?.lpt_amount),
    2
  );

  const [toUnlockAmount, setToUnlockAmount] = useState<string>('');

  const [error, setError] = useState<Error>(null);

  const multiplier = preLocked
    ? new Big(accountInfo?.ve_lpt_amount).div(
        new Big(accountInfo?.lpt_amount).div(1000000)
      )
    : new Big(1);

  const currentMaxUnlock = preLocked
    ? new Big(balance).div(multiplier)
    : new Big('0');

  const reduced = new Big(toUnlockAmount || '0').div(multiplier);

  const finalve = scientificNotationToString(
    new Big(
      toReadableNumber(LOVE_TOKEN_DECIMAL, accountInfo?.ve_lpt_amount || '0')
    )
      .minus(reduced)
      .toString()
  );

  const finalLove = scientificNotationToString(
    new Big(balance || 0).minus(reduced).toString()
  );

  const intl = useIntl();
  useEffect(() => {
    if (Number(finalLove) < 0) {
      setError(
        new Error(
          `You don’t have enough LOVE ${intl.formatMessage({ id: 'token' })}`
        )
      );
    } else if (Number(finalve) < 0) {
      setError(new Error(`You don’t have enough veLPT`));
    } else setError(null);
  }, [toUnlockAmount]);
  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title={
        <FormattedMessage
          id="unlock_lptoken"
          defaultMessage={'Unlock LPtoken'}
        />
      }
    >
      <div className="flex flex-col pt-4 text-farmText text-sm">
        <div className="flex items-center">
          <Images tokens={tokens} size={'7'} />
          &nbsp;
          <Symbols withArrow={false} tokens={tokens} size="text-base" />
        </div>

        <div className="flex flex-col pb-3 pt-5">
          <div className="text-center flex items-center  justify-between">
            <span>
              <FormattedMessage id="locked" defaultMessage="Locked" />
            </span>
            <span className="pb-1">{lockedLPAmount}</span>
          </div>
          <div className="text-center flex items-center pt-4 justify-between">
            <span>
              <FormattedMessage id="avaliable" defaultMessage="Avaliable" />
            </span>
            <span className="pb-1">
              {currentMaxUnlock.gt(0)
                ? toPrecision(
                    scientificNotationToString(currentMaxUnlock.toString()),
                    2
                  )
                : 0}
            </span>
          </div>
        </div>

        <NewFarmInputAmount
          max={scientificNotationToString(currentMaxUnlock.toString())}
          value={toUnlockAmount}
          onChangeAmount={setToUnlockAmount}
        />

        <div className="text-sm text-farmText pt-7 pb-2.5 flex items-center justify-between">
          veLPT/LOVE &nbsp;
          <FormattedMessage id="balance" defaultMessage="balance" />
        </div>

        <div className="rounded-lg bg-black bg-opacity-20 pt-6 pb-5 flex items-center justify-between ">
          <div className="flex flex-col w-full items-center pl-2 border-r border-white border-opacity-10">
            <div className="flex items-center">
              <span className="text-farmText text-xs">{currentVeAmount}</span>
              {ONLY_ZEROS.test(toUnlockAmount) ? null : (
                <>
                  <span className="mx-3">
                    <RightArrowVE />
                  </span>
                  <span
                    className={`text-lg ${
                      Number(finalve) >= 0 ? 'text-white' : 'text-warn'
                    } `}
                  >
                    {Number(Number(finalve).toFixed(24)) === 0
                      ? 0
                      : toPrecision(finalve, 2, false, false)}
                  </span>
                </>
              )}
            </div>
            <span className="pt-1 text-sm text-farmText flex items-center">
              <span className="mr-1">
                <VE_ICON />
              </span>
              <span>veLPT</span>
            </span>
          </div>
          <div className="flex flex-col w-full items-center pr-2">
            <div className="flex items-center">
              <span className="text-farmText text-xs">
                {toPrecision(balance, 2)}
              </span>
              {ONLY_ZEROS.test(toUnlockAmount) ? null : (
                <>
                  <span className="mx-3">
                    <RightArrowVE />
                  </span>
                  <span
                    className={`text-lg ${
                      Number(finalLove) >= 0 ? 'text-white' : 'text-warn'
                    } `}
                  >
                    {Number(Number(finalLove).toFixed(24)) === 0
                      ? 0
                      : toPrecision(finalLove, 2, false, false)}
                  </span>
                </>
              )}
            </div>
            <span className="pt-1 text-sm text-farmText flex items-center">
              <span className="mr-1">
                <LOVE_ICON />
              </span>
              <span>LOVE</span>
            </span>
          </div>
        </div>

        {!error ? null : (
          <div className=" text-center flex items-center justify-center pt-4">
            <span className="mr-1.5">
              <WarnTriangle />
            </span>

            <span className="text-warn">{error.message}</span>
          </div>
        )}

        <NewGradientButton
          text={<FormattedMessage id="unlock" defaultMessage={'Unlock'} />}
          className="mt-5 text-white text-lg py-4"
          onClick={() => {
            unlockLP({
              amount: toNonDivisibleNumber(24, toUnlockAmount),
            });
          }}
          disabled={
            ONLY_ZEROS.test(toUnlockAmount) ||
            new Big(toUnlockAmount).gt(lockedLPAmount) ||
            !!error
          }
        />
      </div>
    </ModalWrapper>
  );
};

const VotingPowerCard = ({
  veShare,
  lpShare,
}: {
  veShare: string;
  lpShare: string;
}) => {
  const allZeros = ONLY_ZEROS.test(veShare) && ONLY_ZEROS.test(lpShare);

  return (
    <div className="rounded-2xl bg-veVotingPowerCard flex p-6 font-bold text-black ml-5 mb-2 h-52">
      <div className="flex flex-col">
        <span>
          <FormattedMessage id="voting_power" defaultMessage={'Voting Power'} />
        </span>

        <span className="pt-10">
          <span>
            {allZeros ? <LeftArrowVE /> : toPrecision(veShare, 2) || '0'}
          </span>
          <div className="text-sm font-normal">
            {allZeros ? (
              <FormattedMessage
                id="lock_lp_tokens_first"
                defaultMessage="Lock LP tokens first!"
              />
            ) : (
              'veLPT'
            )}
          </div>
        </span>
      </div>
      <div>
        <VotingPowerIcon />
      </div>
    </div>
  );
};

const FarmBoosterCard = ({ lpShare }: { lpShare: string }) => {
  const history = useHistory();

  const balance = useLOVEbalance();

  const allZeros = ONLY_ZEROS.test(balance) && ONLY_ZEROS.test(lpShare);

  return (
    <div className="rounded-2xl bg-veFarmBoostCard flex p-6 font-bold text-senderHot ml-5 mt-2 h-52 relative">
      <div className="flex flex-col">
        <span>
          <FormattedMessage id="farm_booster" defaultMessage={'Farm Booster'} />
        </span>

        <span className="text-white pt-10">
          <span>
            {allZeros ? (
              <LeftArrowVE stroke="#00ffd1" />
            ) : (
              toPrecision(balance, 2) || '0'
            )}
          </span>
          <div className="text-sm font-normal">
            {' '}
            {allZeros ? (
              <FormattedMessage
                id="lock_lp_tokens_first"
                defaultMessage="Lock LP tokens first!"
              />
            ) : (
              'LOVE'
            )}
          </div>
        </span>
      </div>
      <div>
        <LOVEBoosterIcon />
      </div>

      <button
        className="absolute right-4 bottom-4 font-normal text-sm"
        onClick={() => {
          history.push('/farmsBoost');
        }}
      >
        <FormattedMessage id="go_to_farm" defaultMessage="Go to farm" />
        <span className="ml-1">↗</span>
      </button>
    </div>
  );
};

const PosterCard = ({
  veShare,
  lpShare,
}: {
  veShare: string;
  lpShare: string;
}) => {
  return (
    <div className="flex flex-col text-3xl font-bold">
      <VotingPowerCard veShare={veShare} lpShare={lpShare} />
      <FarmBoosterCard lpShare={lpShare} />
    </div>
  );
};

const UserReferendumCard = ({
  veShare,
  lpShare,
  accountInfo,
}: {
  veShare: string;
  lpShare: string;
  accountInfo: AccountInfo;
}) => {
  const tokens = [REF_META_DATA, unwrapedNear];

  const { globalState } = useContext(WalletContext);

  const isSignedIn = globalState.isSignedIn;

  const [lockPopOpen, setLockPopOpen] = useState<boolean>(false);

  const [unLockPopOpen, setUnLockPopOpen] = useState<boolean>(false);

  const preLocked = Number(accountInfo?.unlock_timestamp) > 0;

  const unlockTime = new Big(accountInfo?.unlock_timestamp || 0)
    .div(new Big(1000000000))
    .toNumber();

  const lockTime = unlockTime - (accountInfo?.duration_sec || 0);

  const passedTime_sec = moment().unix() - lockTime;

  const lockedLpShare = toReadableNumber(24, accountInfo?.lpt_amount || '0');

  return (
    <Card
      className="flex flex-col relative z-50"
      width="w-2/3"
      bgcolor="bg-veUserCard"
    >
      <div className="text-3xl font-bold mb-2">
        <FormattedMessage
          id="lock_your_lp_tokens"
          defaultMessage="Lock Your LP Tokens"
        />
      </div>
      <span className="pb-20 text-5xl valueStyle font-bold">
        <FormattedMessage
          id="unlock_your_defi_power"
          defaultMessage="Unlock your DeFi Power"
        />
      </span>
      <div className=" flex items-center text-lg">
        <Images tokens={tokens} size="6" />
        <span className="mx-1"></span>
        <Symbols tokens={tokens} seperator="-" size="text-lg" />
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex flex-col w-full">
          <span
            className={`text-3xl font-bold text-gradientFromHover ${
              ONLY_ZEROS.test(lpShare) || !isSignedIn ? 'opacity-20' : ''
            }`}
            title={lpShare}
          >
            {isSignedIn ? toPrecision(lpShare, 2) : '-'}
          </span>

          <span className="text-sm text-farmText pt-1">
            <FormattedMessage
              id="avaliable_to_lock"
              defaultMessage="Avaliable to lock"
            />
          </span>
        </div>
        <div className="flex flex-col w-full">
          <span
            className={`text-3xl font-bold text-gradientFromHover ${
              ONLY_ZEROS.test(lockedLpShare) || !isSignedIn ? 'opacity-20' : ''
            }`}
          >
            {isSignedIn ? toPrecision(lockedLpShare, 2) : '-'}
          </span>

          <span className="text-sm text-farmText pt-1">
            <FormattedMessage id="locked" defaultMessage="Locked" />
          </span>
        </div>
      </div>

      {isSignedIn ? (
        <div className="text-base flex items-center pt-8 w-full">
          <NewGradientButton
            className="w-full mr-4"
            text={
              <FormattedMessage
                id="lock_lptoken"
                defaultMessage="Lock LPtoken"
              />
            }
            onClick={() => setLockPopOpen(true)}
          />
          {ONLY_ZEROS.test(veShare) ? null : moment().unix() > unlockTime ? (
            <BorderGradientButton
              onClick={() => setUnLockPopOpen(true)}
              text={
                <span>
                  {timeStampToDate(unlockTime)}{' '}
                  <span className="">
                    <FormattedMessage id="unlock" defaultMessage="Unlock" />
                  </span>
                </span>
              }
              className="rounded-lg w-full px-5 py-3"
              width="w-full"
            />
          ) : (
            <WithGradientButton
              text={
                <span>
                  {timeStampToDate(unlockTime)}{' '}
                  <span className="">
                    <FormattedMessage id="unlock" defaultMessage="Unlock" />
                  </span>
                </span>
              }
              className="rounded-lg w-full"
              grayDisable={moment().unix() < unlockTime}
              disabled={moment().unix() < unlockTime}
              gradientWith={`${Math.ceil(
                (passedTime_sec / accountInfo?.duration_sec) * 100
              )}%`}
            />
          )}
        </div>
      ) : (
        <ConnectToNearBtnGradient className="mt-8 py-2" />
      )}

      <LockPopUp
        isOpen={lockPopOpen}
        onRequestClose={() => setLockPopOpen(false)}
        tokens={tokens}
        lpShare={lpShare}
        accountInfo={accountInfo}
      />

      <UnLockPopUp
        isOpen={unLockPopOpen}
        onRequestClose={() => setUnLockPopOpen(false)}
        tokens={tokens}
        lpShare={lpShare}
        accountInfo={accountInfo}
      />
    </Card>
  );
};

export const ReferendumPage = () => {
  const id = getPoolId();
  const unClaimedRewards = useUnClaimedRewardsVE();
  const lpShare = usePoolShare(id);

  const { veShare, accountInfo } = useAccountInfo();

  return (
    <div className="m-auto lg:w-1024px xs:w-full md:w-5/6 text-white relative">
      <div className="w-full flex ">
        <UserReferendumCard
          veShare={veShare}
          lpShare={lpShare}
          accountInfo={accountInfo}
        />
        <PosterCard veShare={veShare} lpShare={lpShare} />
      </div>

      <ProposalCard />

      <div
        className="absolute -top-12 z-20"
        style={{
          right: '40%',
        }}
      >
        <PowerZone />
      </div>

      {!unClaimedRewards ||
      Object.keys(unClaimedRewards).length === 0 ? null : (
        <RewardCard rewardList={unClaimedRewards} />
      )}
    </div>
  );
};

export const CalenderIcon = () => {
  return (
    <svg
      width="21"
      height="22"
      viewBox="0 0 21 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect opacity="0.3" width="21" height="22" rx="6" fill="#445867" />
      <path
        d="M16.21 6.20931H13.7757V5.23829C13.7757 5.02742 13.605 4.85645 13.3939 4.85645C13.1828 4.85645 13.012 5.02742 13.012 5.23829V6.20931H9.33827V5.23829C9.33827 5.02742 9.16749 4.85645 8.95642 4.85645C8.74536 4.85645 8.57457 5.02742 8.57457 5.23829V6.20931H5.72791C5.25098 6.20931 4.86279 6.5973 4.86279 7.07443V15.9251C4.86279 16.4022 5.25098 16.7902 5.72791 16.7902H16.21C16.6869 16.7902 17.0751 16.4022 17.0751 15.9251V7.07443C17.0751 6.5973 16.6869 6.20931 16.21 6.20931ZM16.3114 15.9251C16.3114 15.952 16.3007 15.9778 16.2817 15.9968C16.2627 16.0158 16.2369 16.0265 16.21 16.0265H5.72791C5.70102 16.0265 5.67523 16.0158 5.65622 15.9968C5.6372 15.9778 5.62651 15.952 5.62648 15.9251V7.07443C5.62651 7.04753 5.6372 7.02175 5.65622 7.00274C5.67523 6.98372 5.70102 6.97302 5.72791 6.97299H8.57459V7.8575C8.57459 8.06837 8.74537 8.23935 8.95644 8.23935C9.16751 8.23935 9.33829 8.06837 9.33829 7.8575V6.97299H13.012V7.8575C13.012 8.06837 13.1828 8.23935 13.3939 8.23935C13.605 8.23935 13.7757 8.06837 13.7757 7.8575V6.97299H16.21C16.2369 6.97302 16.2627 6.98372 16.2817 7.00274C16.3007 7.02175 16.3114 7.04753 16.3114 7.07443V15.9251H16.3114Z"
        fill="white"
      />
      <path
        d="M7.23584 10.5449C7.23584 10.638 7.25417 10.7301 7.28977 10.8161C7.32538 10.902 7.37757 10.9801 7.44336 11.0459C7.50915 11.1117 7.58726 11.1639 7.67322 11.1995C7.75918 11.2351 7.85131 11.2535 7.94436 11.2535C8.0374 11.2535 8.12953 11.2351 8.21549 11.1995C8.30146 11.1639 8.37956 11.1117 8.44535 11.0459C8.51115 10.9801 8.56333 10.902 8.59894 10.8161C8.63455 10.7301 8.65287 10.638 8.65287 10.5449C8.65287 10.357 8.57823 10.1768 8.44535 10.0439C8.31248 9.91107 8.13227 9.83643 7.94436 9.83643C7.75645 9.83643 7.57623 9.91107 7.44336 10.0439C7.31049 10.1768 7.23584 10.357 7.23584 10.5449Z"
        fill="white"
      />
      <path
        d="M10.3638 10.5449C10.3638 10.7329 10.4384 10.9131 10.5713 11.0459C10.7042 11.1788 10.8844 11.2535 11.0723 11.2535C11.2602 11.2535 11.4404 11.1788 11.5733 11.0459C11.7062 10.9131 11.7808 10.7329 11.7808 10.5449C11.7808 10.357 11.7062 10.1768 11.5733 10.0439C11.4404 9.91107 11.2602 9.83643 11.0723 9.83643C10.8844 9.83643 10.7042 9.91107 10.5713 10.0439C10.4384 10.1768 10.3638 10.357 10.3638 10.5449Z"
        fill="white"
      />
      <path
        d="M13.4917 10.5449C13.4917 10.638 13.51 10.7301 13.5456 10.8161C13.5812 10.902 13.6334 10.9801 13.6992 11.0459C13.765 11.1117 13.8431 11.1639 13.9291 11.1995C14.015 11.2351 14.1072 11.2535 14.2002 11.2535C14.2933 11.2535 14.3854 11.2351 14.4714 11.1995C14.5573 11.1639 14.6354 11.1117 14.7012 11.0459C14.767 10.9801 14.8192 10.902 14.8548 10.8161C14.8904 10.7301 14.9087 10.638 14.9087 10.5449C14.9087 10.4519 14.8904 10.3598 14.8548 10.2738C14.8192 10.1878 14.767 10.1097 14.7012 10.0439C14.6354 9.97815 14.5573 9.92596 14.4714 9.89036C14.3854 9.85475 14.2933 9.83643 14.2002 9.83643C14.1072 9.83643 14.015 9.85475 13.9291 9.89036C13.8431 9.92596 13.765 9.97815 13.6992 10.0439C13.6334 10.1097 13.5812 10.1878 13.5456 10.2738C13.51 10.3598 13.4917 10.4519 13.4917 10.5449Z"
        fill="white"
      />
      <path
        d="M7.23584 13.3106C7.23584 13.4036 7.25417 13.4957 7.28977 13.5817C7.32538 13.6677 7.37757 13.7458 7.44336 13.8116C7.50915 13.8774 7.58726 13.9295 7.67322 13.9652C7.75918 14.0008 7.85131 14.0191 7.94436 14.0191C8.0374 14.0191 8.12953 14.0008 8.21549 13.9652C8.30146 13.9295 8.37956 13.8774 8.44535 13.8116C8.51115 13.7458 8.56333 13.6677 8.59894 13.5817C8.63455 13.4957 8.65287 13.4036 8.65287 13.3106C8.65287 13.1227 8.57823 12.9424 8.44535 12.8096C8.31248 12.6767 8.13227 12.6021 7.94436 12.6021C7.75645 12.6021 7.57623 12.6767 7.44336 12.8096C7.31049 12.9424 7.23584 13.1227 7.23584 13.3106Z"
        fill="white"
      />
      <path
        d="M10.3638 13.3106C10.3638 13.4985 10.4384 13.6787 10.5713 13.8116C10.7042 13.9445 10.8844 14.0191 11.0723 14.0191C11.2602 14.0191 11.4404 13.9445 11.5733 13.8116C11.7062 13.6787 11.7808 13.4985 11.7808 13.3106C11.7808 13.2175 11.7625 13.1254 11.7269 13.0394C11.6913 12.9535 11.6391 12.8754 11.5733 12.8096C11.5075 12.7438 11.4294 12.6916 11.3434 12.656C11.2575 12.6204 11.1653 12.6021 11.0723 12.6021C10.9793 12.6021 10.8871 12.6204 10.8012 12.656C10.7152 12.6916 10.6371 12.7438 10.5713 12.8096C10.5055 12.8754 10.4533 12.9535 10.4177 13.0394C10.3821 13.1254 10.3638 13.2175 10.3638 13.3106Z"
        fill="white"
      />
      <path
        d="M13.4917 13.3107C13.4917 13.4037 13.51 13.4959 13.5456 13.5819C13.5812 13.6678 13.6334 13.7459 13.6992 13.8117C13.765 13.8776 13.8431 13.9298 13.9291 13.9654C14.015 14.001 14.1072 14.0193 14.2002 14.0193C14.2933 14.0193 14.3854 14.001 14.4714 13.9654C14.5574 13.9298 14.6355 13.8776 14.7013 13.8117C14.7671 13.7459 14.8193 13.6678 14.8549 13.5819C14.8905 13.4959 14.9088 13.4037 14.9088 13.3107C14.9088 13.2176 14.8905 13.1255 14.8549 13.0395C14.8193 12.9535 14.7671 12.8754 14.7013 12.8096C14.6355 12.7438 14.5574 12.6916 14.4714 12.656C14.3854 12.6204 14.2933 12.6021 14.2002 12.6021C14.1072 12.6021 14.015 12.6204 13.9291 12.656C13.8431 12.6916 13.765 12.7438 13.6992 12.8096C13.6334 12.8754 13.5812 12.9535 13.5456 13.0395C13.51 13.1255 13.4917 13.2176 13.4917 13.3107Z"
        fill="white"
      />
    </svg>
  );
};
