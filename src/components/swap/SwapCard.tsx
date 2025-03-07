import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  ftGetBalance,
  TokenMetadata,
  REF_META_DATA,
} from '../../services/ft-contract';
import { Pool } from '../../services/pool';
import { useTokenBalances, useDepositableBalance } from '../../state/token';
import { useSwap, estimateValidator } from '../../state/swap';
import {
  calculateExchangeRate,
  calculateFeeCharge,
  calculateFeePercent,
  calculateSmartRoutingPriceImpact,
  toPrecision,
  toReadableNumber,
  ONLY_ZEROS,
  multiply,
  divide,
  scientificNotationToString,
  calculateSmartRoutesV2PriceImpact,
  separateRoutes,
  calcStableSwapPriceImpact,
  toInternationalCurrencySystemLongString,
} from '../../utils/numbers';
import ReactDOMServer from 'react-dom/server';
import TokenAmount from '../forms/TokenAmount';
import SubmitButton from '../forms/SubmitButton';
import Alert from '../alert/Alert';
import { toRealSymbol } from '../../utils/token';
import { FormattedMessage, useIntl } from 'react-intl';
import { FaAngleUp, FaAngleDown, FaExchangeAlt } from 'react-icons/fa';
import db from '../../store/RefDatabase';
import {
  ButtonTextWrapper,
  GradientButton,
  OutlineButton,
  SolidButton,
  ConnectToNearBtn,
} from '../../components/button/Button';
import {
  AllStableTokenIds,
  BTCIDS,
  BTC_STABLE_POOL_ID,
  CUSDIDS,
  LINEARIDS,
  LINEAR_POOL_ID,
  NEARXIDS,
  NEARX_POOL_ID,
  STABLE_POOL_TYPE,
  STABLE_TOKEN_IDS,
  STNEARIDS,
  STNEAR_POOL_ID,
  wallet,
} from '../../services/near';
import SwapFormWrap from '../forms/SwapFormWrap';
import SwapTip from '../../components/forms/SwapTip';
import { WarnTriangle, ErrorTriangle } from '../../components/icon/SwapRefresh';
import ReactModal from 'react-modal';
import Modal from 'react-modal';
import { Card } from '../../components/card/Card';
import { isMobile, useMobile } from '../../utils/device';
import { ModalClose } from '../../components/icon';
import BigNumber from 'bignumber.js';
import {
  AutoRouterText,
  OneParallelRoute,
  RouterIcon,
  SmartRouteV2,
} from '../../components/layout/SwapRoutes';

import { EstimateSwapView, PoolMode, swap } from '../../services/swap';
import { QuestionTip } from '../../components/layout/TipWrapper';
import { senderWallet, WalletContext } from '../../utils/wallets-integration';
import { SwapArrow, SwapExchange } from '../icon/Arrows';
import {
  getPoolAllocationPercents,
  percentLess,
  toNonDivisibleNumber,
} from '../../utils/numbers';
import { DoubleCheckModal } from '../../components/layout/SwapDoubleCheck';
import { getTokenPriceList } from '../../services/indexer';
import { SWAP_MODE } from '../../pages/SwapPage';
import {
  isStableToken,
  STABLE_TOKEN_USN_IDS,
  USD_CLASS_STABLE_TOKEN_IDS,
} from '../../services/near';
import TokenReserves from '../stableswap/TokenReserves';
import {
  WRAP_NEAR_CONTRACT_ID,
  unwrapedNear,
  nearDeposit,
  nearWithdraw,
  wnearMetadata,
} from '../../services/wrap-near';
import getConfig, { getExtraStablePoolConfig } from '../../services/config';
import { SkyWardModal } from '../layout/SwapDoubleCheck';
import {
  NEAR_CLASS_STABLE_TOKEN_IDS,
  BTC_CLASS_STABLE_TOKEN_IDS,
} from '../../services/near';

const SWAP_IN_KEY = 'REF_FI_SWAP_IN';
const SWAP_OUT_KEY = 'REF_FI_SWAP_OUT';
const SWAP_IN_KEY_SYMBOL = 'REF_FI_SWAP_IN_SYMBOL';
const SWAP_OUT_KEY_SYMBOL = 'REF_FI_SWAP_OUT_SYMBOL';

const SWAP_SLIPPAGE_KEY = 'REF_FI_SLIPPAGE_VALUE';

const SWAP_SLIPPAGE_KEY_STABLE = 'REF_FI_SLIPPAGE_VALUE_STABLE';

export const SWAP_USE_NEAR_BALANCE_KEY = 'REF_FI_USE_NEAR_BALANCE_VALUE';
const TOKEN_URL_SEPARATOR = '|';

export const isSameStableClass = (token1: string, token2: string) => {
  const USDTokenList = USD_CLASS_STABLE_TOKEN_IDS;

  const BTCTokenList = BTC_CLASS_STABLE_TOKEN_IDS;

  const NEARTokenList = NEAR_CLASS_STABLE_TOKEN_IDS;
  return (
    (USDTokenList.includes(token1) && USDTokenList.includes(token2)) ||
    (BTCTokenList.includes(token1) && BTCTokenList.includes(token2)) ||
    (NEARTokenList.includes(token1) && NEARTokenList.includes(token2))
  );
};

export const SUPPORT_LEDGER_KEY = 'REF_FI_SUPPORT_LEDGER';

export const unWrapTokenId = (token: TokenMetadata) => {
  if (token.id === WRAP_NEAR_CONTRACT_ID && token.symbol == 'NEAR') {
    return 'near';
  } else return token.id;
};

export const wrapTokenId = (id: string) => {
  if (id === 'near') {
    return WRAP_NEAR_CONTRACT_ID;
  } else return id;
};

export function SwapDetail({
  title,
  value,
}: {
  title: string;
  value: string | JSX.Element;
}) {
  return (
    <section className="grid grid-cols-12 py-1 text-xs">
      <p className="text-primaryText text-left col-span-6">{title}</p>
      <p className="text-right text-white col-span-6">{value}</p>
    </section>
  );
}

export function SwapRateDetail({
  title,
  value,
  subTitle,
  from,
  to,
  tokenIn,
  tokenOut,
  fee,
}: {
  fee: number;
  title: string;
  value: string;
  from: string;
  to: string;
  subTitle?: string;
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
}) {
  const [newValue, setNewValue] = useState<string>('');
  const [isRevert, setIsRevert] = useState<boolean>(false);

  const exchangeRageValue = useMemo(() => {
    const fromNow = isRevert ? from : to;
    const toNow = isRevert ? to : from;
    if (ONLY_ZEROS.test(fromNow)) return '-';

    return calculateExchangeRate(fee, fromNow, toNow);
  }, [isRevert, to]);

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  useEffect(() => {
    setNewValue(
      `1 ${toRealSymbol(
        isRevert ? tokenIn.symbol : tokenOut.symbol
      )} ≈ ${exchangeRageValue} ${toRealSymbol(
        isRevert ? tokenOut.symbol : tokenIn.symbol
      )}`
    );
  }, [isRevert, exchangeRageValue]);

  function switchSwapRate() {
    setIsRevert(!isRevert);
  }

  return (
    <section className="grid grid-cols-12 py-1 text-xs">
      <p className="text-primaryText text-left flex xs:flex-col md:flex-col col-span-4 whitespace-nowrap">
        <label className="mr-1">{title}</label>
        {subTitle ? <label>{subTitle}</label> : null}
      </p>
      <p
        className="flex justify-end text-white cursor-pointer text-right col-span-8"
        onClick={switchSwapRate}
      >
        <span className="mr-2" style={{ marginTop: '0.1rem' }}>
          <FaExchangeAlt color="#00C6A2" />
        </span>
        <span className="font-sans">{newValue}</span>
      </p>
    </section>
  );
}

export function SmartRoutesV2Detail({
  swapsTodo,
  tokenIn,
  tokenOut,
}: {
  swapsTodo: EstimateSwapView[];
  tokenIn?: TokenMetadata;
  tokenOut?: TokenMetadata;
}) {
  const tokensPerRoute = swapsTodo
    .filter((swap) => swap.inputToken == swap.routeInputToken)
    .map((swap) => swap.tokens);

  const identicalRoutes = separateRoutes(
    swapsTodo,
    swapsTodo[swapsTodo.length - 1].outputToken
  );

  const pools = identicalRoutes.map((r) => r[0]).map((hub) => hub.pool);

  const percents = useMemo(() => {
    return getPoolAllocationPercents(pools);
  }, [identicalRoutes, pools]);

  return (
    <section className="md:flex lg:flex py-1 text-xs items-center md:justify-between lg:justify-between">
      <div className="text-primaryText text-left self-start">
        <div className="inline-flex items-center">
          <RouterIcon />
          <AutoRouterText />
          <QuestionTip id="optimal_path_found_by_our_solution" width="w-56" />
        </div>
      </div>

      <div className="text-right text-white col-span-7 xs:mt-2 md:mt-2 self-start">
        {tokensPerRoute.map((tokens, index) => (
          <div key={index} className="mb-2 md:w-smartRoute lg:w-smartRoute">
            <div className="text-right text-white col-span-6 xs:mt-2 md:mt-2">
              {
                <SmartRouteV2
                  tokenIn={tokenIn}
                  tokenOut={tokenOut}
                  tokens={tokens}
                  p={percents[index]}
                  pools={identicalRoutes[index].map((hub) => hub.pool)}
                />
              }
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ParallelSwapRoutesDetail({
  pools,
  tokenIn,
  tokenOut,
}: {
  pools: Pool[];
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
}) {
  const percents = useMemo(() => {
    return getPoolAllocationPercents(pools);
  }, [pools]);

  return (
    <section className="md:grid lg:grid grid-cols-12 py-1 text-xs">
      <div className="text-primaryText text-left col-span-5">
        <div className="inline-flex items-center">
          <RouterIcon />
          <AutoRouterText />
          <QuestionTip id="optimal_path_found_by_our_solution" width="w-56" />
        </div>
      </div>

      <div className="text-right text-white col-span-7 xs:mt-2 md:mt-2">
        {pools.map((pool, i) => {
          return (
            <div className="mb-2" key={pool.id}>
              <OneParallelRoute
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                poolId={pool.id}
                p={percents[i]}
                fee={pool.fee}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SmartRoutesDetail({
  swapsTodo,
  tokenIn,
  tokenOut,
}: {
  swapsTodo: EstimateSwapView[];
  tokenIn?: TokenMetadata;
  tokenOut?: TokenMetadata;
}) {
  return (
    <section className="md:flex lg:flex py-1 text-xs items-center md:justify-between lg:justify-between">
      <div className="text-primaryText text-left ">
        <div className="inline-flex items-center">
          <RouterIcon />
          <AutoRouterText />
          <QuestionTip id="optimal_path_found_by_our_solution" width="w-56" />
        </div>
      </div>

      <div className="text-right text-white col-span-6 xs:mt-2">
        {
          <SmartRouteV2
            tokens={swapsTodo[0].tokens}
            p="100"
            pools={swapsTodo.map((swapTodo) => swapTodo.pool)}
            tokenIn={tokenIn}
            tokenOut={tokenOut}
          />
        }
      </div>
    </section>
  );
}

export const GetPriceImpact = (
  value: string,
  tokenIn?: TokenMetadata,
  tokenInAmount?: string
) => {
  const textColor =
    Number(value) <= 1
      ? 'text-greenLight'
      : 1 < Number(value) && Number(value) <= 2
      ? 'text-warn'
      : 'text-error';

  const displayValue = scientificNotationToString(
    multiply(tokenInAmount, divide(value, '100'))
  );

  const tokenInInfo =
    Number(displayValue) <= 0
      ? ` / 0 ${toRealSymbol(tokenIn.symbol)}`
      : ` / -${toInternationalCurrencySystemLongString(displayValue, 3)} ${
          tokenIn.symbol
        }`;

  if (Number(value) < 0.01)
    return (
      <span className="text-greenLight">
        {`< -0.01%`}
        {tokenInInfo}
      </span>
    );

  if (Number(value) > 1000)
    return (
      <span className="text-error">
        {`< -1000%`}
        {tokenInInfo}
      </span>
    );

  return (
    <span className={`${textColor} font-sans`}>
      {`≈ -${toPrecision(value, 2)}%`}
      {tokenInInfo}
    </span>
  );
};

export const getPriceImpactTipType = (value: string) => {
  const reault =
    1 < Number(value) && Number(value) <= 2 ? (
      <WarnTriangle></WarnTriangle>
    ) : Number(value) > 2 && Number(value) != Infinity ? (
      <ErrorTriangle></ErrorTriangle>
    ) : null;
  return reault;
};

export const PriceImpactWarning = ({ value }: { value: string }) => {
  return (
    <span className="">
      <span className="rounded-full bg-acccountTab text-error px-2 py-0.5">
        <FormattedMessage
          id="more_expensive_than_best_rate_zh_cn"
          defaultMessage=" "
        />{' '}
        {Number(value) > 1000 ? '> 1000' : toPrecision(value, 2)}
        {'% '}
        <FormattedMessage
          id="more_expensive_than_best_rate_en"
          defaultMessage=" "
        />
      </span>
    </span>
  );
};

function DetailView({
  pools,
  tokenIn,
  tokenOut,
  from,
  to,
  minAmountOut,
  isParallelSwap,
  fee,
  swapsTodo,
  priceImpact,
  swapMode,
  tokenInAmount,
}: {
  pools: Pool[];
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
  from: string;
  to: string;
  minAmountOut: string;
  isParallelSwap?: boolean;
  fee?: number;
  swapsTodo?: EstimateSwapView[];
  priceImpact?: string;
  swapMode?: SWAP_MODE;
  tokenInAmount?: string;
}) {
  const intl = useIntl();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const minAmountOutValue = useMemo(() => {
    if (!minAmountOut) return '0';
    else return toPrecision(minAmountOut, 8, true);
  }, [minAmountOut]);

  const exchangeRateValue = useMemo(() => {
    if (!from || ONLY_ZEROS.test(to)) return '-';
    else return calculateExchangeRate(fee, to, from);
  }, [to]);

  useEffect(() => {
    if (Number(priceImpact) > 1) {
      setShowDetails(true);
    }
  }, [priceImpact]);

  useEffect(() => {
    if (swapsTodo?.length > 1) {
      setShowDetails(true);
    }
  }, [swapsTodo]);

  const priceImpactDisplay = useMemo(() => {
    if (!priceImpact || !tokenIn || !from) return null;
    return GetPriceImpact(priceImpact, tokenIn, from);
  }, [to, priceImpact]);

  const poolFeeDisplay = useMemo(() => {
    if (!fee || !from || !tokenIn) return null;

    return `${toPrecision(
      calculateFeePercent(fee).toString(),
      2
    )}% / ${calculateFeeCharge(fee, from)} ${toRealSymbol(tokenIn.symbol)}`;
  }, [to]);
  if (
    tokenIn &&
    tokenOut &&
    tokenIn.id === tokenOut?.id &&
    ((tokenIn.symbol == 'NEAR' && tokenOut.symbol == 'wNEAR') ||
      (tokenIn.symbol == 'wNEAR' && tokenOut.symbol == 'NEAR'))
  ) {
    return (
      <DetailView_near_wnear
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        minAmountOut={tokenInAmount}
        from={from}
        to={to}
      ></DetailView_near_wnear>
    );
  }
  if (!pools || ONLY_ZEROS.test(from) || !to || tokenIn.id === tokenOut.id)
    return null;
  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <div
          className="flex items-center text-white cursor-pointer"
          onClick={() => {
            setShowDetails(!showDetails);
          }}
        >
          <label className="mr-2">{getPriceImpactTipType(priceImpact)}</label>
          <p className="block text-xs">
            <FormattedMessage id="details" defaultMessage="Details" />
          </p>
          <div className="pl-1 text-sm">
            {showDetails ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
      </div>
      <div className={showDetails ? '' : 'hidden'}>
        <SwapDetail
          title={intl.formatMessage({ id: 'minimum_received' })}
          value={<span>{toPrecision(minAmountOutValue, 8)}</span>}
        />
        <SwapRateDetail
          title={intl.formatMessage({ id: 'swap_rate' })}
          value={`1 ${toRealSymbol(
            tokenOut.symbol
          )} ≈ ${exchangeRateValue} ${toRealSymbol(tokenIn.symbol)}`}
          from={from}
          to={to}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          fee={fee}
        />
        {Number(priceImpact) > 2 && (
          <div className="py-1 text-xs text-right">
            <PriceImpactWarning value={priceImpact} />
          </div>
        )}
        <SwapDetail
          title={intl.formatMessage({ id: 'price_impact' })}
          value={!to || to === '0' ? '-' : priceImpactDisplay}
        />
        <SwapDetail
          title={intl.formatMessage({ id: 'pool_fee' })}
          value={poolFeeDisplay}
        />

        {isParallelSwap && swapsTodo && swapsTodo.length > 1 && (
          <ParallelSwapRoutesDetail
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            pools={pools}
          />
        )}

        {swapsTodo[0].status === PoolMode.SMART && (
          <SmartRoutesDetail
            swapsTodo={swapsTodo}
            tokenIn={tokenIn}
            tokenOut={tokenOut}
          />
        )}
        {!isParallelSwap &&
          swapsTodo.every((e) => e.status !== PoolMode.SMART) &&
          pools.length > 1 && (
            <SmartRoutesV2Detail
              swapsTodo={swapsTodo}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
            />
          )}
      </div>
    </div>
  );
}

function DetailView_near_wnear({
  tokenIn,
  tokenOut,
  minAmountOut,
  from,
  to,
}: {
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
  minAmountOut: string;
  from: string;
  to: string;
}) {
  const intl = useIntl();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <div
          className="flex items-center text-white cursor-pointer"
          onClick={() => {
            setShowDetails(!showDetails);
          }}
        >
          <p className="block text-xs">
            <FormattedMessage id="details" defaultMessage="Details" />
          </p>
          <div className="pl-1 text-sm">
            {showDetails ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
      </div>
      <div className={showDetails ? '' : 'hidden'}>
        <SwapDetail
          title={intl.formatMessage({ id: 'minimum_received' })}
          value={<span>{toPrecision((minAmountOut || 0).toString(), 8)}</span>}
        />
        <SwapRateDetail
          title={intl.formatMessage({ id: 'swap_rate' })}
          value={`1 ${toRealSymbol(tokenOut.symbol)} ≈ ${1} ${toRealSymbol(
            tokenIn.symbol
          )}`}
          from={from}
          to={to}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          fee={0}
        />
        <SwapDetail
          title={intl.formatMessage({ id: 'price_impact' })}
          value={'-'}
        />
        <SwapDetail
          title={intl.formatMessage({ id: 'pool_fee' })}
          value={'-'}
        />
      </div>
    </div>
  );
}

export default function SwapCard(props: {
  allTokens: TokenMetadata[];
  swapMode: SWAP_MODE;
  stablePools: Pool[];
  tokenInAmount: string;
  setTokenInAmount: (value: string) => void;
  globalWhiteListTokens: TokenMetadata[];
}) {
  const { NEARXIDS, STNEARIDS } = getExtraStablePoolConfig();
  const { REF_TOKEN_ID } = getConfig();
  const reserveTypeStorageKey = 'REF_FI_RESERVE_TYPE';

  const {
    allTokens,
    swapMode,
    stablePools,
    tokenInAmount,
    setTokenInAmount,
    globalWhiteListTokens,
  } = props;
  const [tokenIn, setTokenIn] = useState<TokenMetadata>();
  const [tokenOut, setTokenOut] = useState<TokenMetadata>();
  const [doubleCheckOpen, setDoubleCheckOpen] = useState<boolean>(false);

  const [reservesType, setReservesType] = useState<STABLE_POOL_TYPE>(
    STABLE_POOL_TYPE[localStorage.getItem(reserveTypeStorageKey)] ||
      STABLE_POOL_TYPE.USD
  );

  const [supportLedger, setSupportLedger] = useState(
    localStorage.getItem(SUPPORT_LEDGER_KEY) ? true : false
  );

  const [useNearBalance, setUseNearBalance] = useState<boolean>(true);

  const { globalState } = useContext(WalletContext);
  const isSignedIn = globalState.isSignedIn;

  const [tokenInBalanceFromNear, setTokenInBalanceFromNear] =
    useState<string>();
  const [tokenOutBalanceFromNear, setTokenOutBalanceFromNear] =
    useState<string>();

  const [reEstimateTrigger, setReEstimateTrigger] = useState(false);

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loadingTrigger, setLoadingTrigger] = useState<boolean>(true);
  const [loadingPause, setLoadingPause] = useState<boolean>(false);
  const [showSwapLoading, setShowSwapLoading] = useState<boolean>(false);

  const [showSkywardTip, setShowSkywardTip] = useState<boolean>(false);
  const [wrapOperation, setWrapOperation] = useState<boolean>(false);
  const [wrapLoading, setWrapLoading] = useState<boolean>(false);

  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();

  const balances = useTokenBalances();
  const [urlTokenIn, urlTokenOut, urlSlippageTolerance] = decodeURIComponent(
    location.hash.slice(1)
  ).split(TOKEN_URL_SEPARATOR);

  const nearBalance = useDepositableBalance('NEAR');

  const [slippageToleranceNormal, setSlippageToleranceNormal] =
    useState<number>(
      Number(localStorage.getItem(SWAP_SLIPPAGE_KEY) || urlSlippageTolerance) ||
        0.5
    );

  const [slippageToleranceStable, setSlippageToleranceStable] =
    useState<number>(
      Number(localStorage.getItem(SWAP_SLIPPAGE_KEY_STABLE)) || 0.5
    );

  const [tokenPriceList, setTokenPriceList] = useState<Record<string, any>>({});

  useEffect(() => {
    getTokenPriceList().then(setTokenPriceList);
  }, []);
  const skywardId =
    getConfig().networkId === 'mainnet'
      ? 'token.skyward.near'
      : 'skyward.fakes.testnet';

  useEffect(() => {
    if (!tokenIn || !tokenOut) return;
    if (
      BTC_CLASS_STABLE_TOKEN_IDS.includes(tokenIn.id) &&
      BTC_CLASS_STABLE_TOKEN_IDS.includes(tokenOut.id)
    ) {
      setReservesType(STABLE_POOL_TYPE.BTC);
      localStorage.setItem(reserveTypeStorageKey, STABLE_POOL_TYPE.BTC);
    } else if (
      NEAR_CLASS_STABLE_TOKEN_IDS.includes(tokenIn.id) &&
      NEAR_CLASS_STABLE_TOKEN_IDS.includes(tokenOut.id)
    ) {
      setReservesType(STABLE_POOL_TYPE.NEAR);
      localStorage.setItem(reserveTypeStorageKey, STABLE_POOL_TYPE.NEAR);
    } else {
      setReservesType(STABLE_POOL_TYPE.USD);
      localStorage.setItem(reserveTypeStorageKey, STABLE_POOL_TYPE.USD);
    }
    history.replace(
      `#${unWrapTokenId(tokenIn)}${TOKEN_URL_SEPARATOR}${unWrapTokenId(
        tokenOut
      )}`
    );

    localStorage.setItem(SWAP_IN_KEY, tokenIn.id);
    localStorage.setItem(SWAP_OUT_KEY, tokenOut.id);
    localStorage.setItem(SWAP_IN_KEY_SYMBOL, tokenIn.symbol);
    localStorage.setItem(SWAP_OUT_KEY_SYMBOL, tokenOut.symbol);
  }, [tokenIn?.id, tokenOut?.id, tokenIn?.symbol, tokenOut?.symbol]);

  useEffect(() => {
    if (allTokens) {
      const [in_id, out_id] = getStorageTokenId();
      let urlTokenInId = allTokens.find((t) => t.id && t.id === urlTokenIn)?.id;

      let urlTokenOutId = allTokens.find(
        (t) => t.id && t.id === urlTokenOut
      )?.id;

      if (!urlTokenInId) {
        urlTokenInId = globalWhiteListTokens.find(
          (t) => t.symbol && t.symbol === urlTokenIn
        )?.id;
      }

      if (!urlTokenOutId) {
        urlTokenOutId = globalWhiteListTokens.find(
          (t) => t.symbol && t.symbol === urlTokenOut
        )?.id;
      }
      let rememberedIn = wrapTokenId(urlTokenInId) || in_id;
      let rememberedOut = wrapTokenId(urlTokenOutId) || out_id;

      if (swapMode === SWAP_MODE.NORMAL) {
        if (rememberedIn == NEARXIDS[0]) {
          rememberedIn = REF_TOKEN_ID;
        }
        if (rememberedOut == NEARXIDS[0]) {
          rememberedOut = REF_TOKEN_ID;
        }
        let candTokenIn;
        if (urlTokenIn == 'near' || urlTokenIn == 'NEAR') {
          candTokenIn = unwrapedNear;
        } else if (
          urlTokenIn == WRAP_NEAR_CONTRACT_ID ||
          urlTokenIn == 'wNEAR'
        ) {
          candTokenIn = wnearMetadata;
        } else if (rememberedIn == 'near') {
          candTokenIn = unwrapedNear;
        } else if (rememberedIn == WRAP_NEAR_CONTRACT_ID) {
          candTokenIn = wnearMetadata;
        } else {
          candTokenIn =
            allTokens.find((token) => {
              return token.id === rememberedIn;
            }) || unwrapedNear;
        }
        let candTokenOut;
        if (urlTokenOut == 'near' || urlTokenOut == 'NEAR') {
          candTokenOut = unwrapedNear;
        } else if (
          urlTokenOut == WRAP_NEAR_CONTRACT_ID ||
          urlTokenOut == 'wNEAR'
        ) {
          candTokenOut = wnearMetadata;
        } else if (rememberedOut == 'near') {
          candTokenOut = unwrapedNear;
        } else if (rememberedOut == WRAP_NEAR_CONTRACT_ID) {
          candTokenOut = wnearMetadata;
        } else {
          candTokenOut =
            allTokens.find((token) => {
              return token.id === rememberedOut;
            }) || REF_META_DATA;
        }
        if (candTokenIn.id === skywardId || candTokenOut.id === skywardId) {
          setShowSkywardTip(true);
        }

        setTokenIn(candTokenIn);
        setTokenOut(candTokenOut);

        if (
          tokenOut?.id === candTokenOut?.id &&
          tokenIn?.id === candTokenIn?.id
        )
          setReEstimateTrigger(!reEstimateTrigger);
      } else if (swapMode === SWAP_MODE.STABLE) {
        let candTokenIn: TokenMetadata;
        let candTokenOut: TokenMetadata;
        if (rememberedIn == 'near') {
          rememberedIn = WRAP_NEAR_CONTRACT_ID;
        }
        if (rememberedOut == 'near') {
          rememberedOut = WRAP_NEAR_CONTRACT_ID;
        }
        if (rememberedIn == NEARXIDS[0]) {
          rememberedIn = STNEARIDS[0];
        }
        if (rememberedOut == NEARXIDS[0]) {
          rememberedOut = STNEARIDS[0];
        }
        if (
          rememberedIn &&
          rememberedOut &&
          isSameStableClass(rememberedIn, rememberedOut)
        ) {
          candTokenIn = allTokens.find((token) => token.id === rememberedIn);
          candTokenOut = allTokens.find((token) => token.id === rememberedOut);
        } else {
          const USDTokenList = new Array(
            ...new Set(
              STABLE_TOKEN_USN_IDS.concat(STABLE_TOKEN_IDS).concat(CUSDIDS)
            )
          );

          candTokenIn = allTokens.find((token) => token.id === USDTokenList[0]);
          candTokenOut = allTokens.find(
            (token) => token.id === USDTokenList[1]
          );
          setTokenInAmount('1');
        }

        setTokenIn(candTokenIn);

        setTokenOut(candTokenOut);
        if (candTokenIn.id === skywardId || candTokenOut.id === skywardId) {
          setShowSkywardTip(true);
        }

        if (
          tokenOut?.id === candTokenOut?.id &&
          tokenIn?.id === candTokenIn?.id
        )
          setReEstimateTrigger(!reEstimateTrigger);
      }
    }
  }, [
    allTokens?.map((t) => t.id).join('-'),
    swapMode,
    urlTokenIn,
    urlTokenOut,
  ]);

  useEffect(() => {
    if (useNearBalance) {
      if (tokenIn) {
        const tokenInId = tokenIn.id;
        if (tokenInId) {
          if (isSignedIn) {
            ftGetBalance(tokenInId).then((available: string) =>
              setTokenInBalanceFromNear(
                toReadableNumber(
                  tokenIn?.decimals,
                  tokenIn.id === WRAP_NEAR_CONTRACT_ID &&
                    tokenIn.symbol == 'NEAR'
                    ? nearBalance
                    : available
                )
              )
            );
          }
        }
      }
      if (tokenOut) {
        const tokenOutId = tokenOut.id;
        if (tokenOutId) {
          if (isSignedIn) {
            ftGetBalance(tokenOutId).then((available: string) =>
              setTokenOutBalanceFromNear(
                toReadableNumber(
                  tokenOut?.decimals,
                  tokenOut.id === WRAP_NEAR_CONTRACT_ID &&
                    tokenOut.symbol == 'NEAR'
                    ? nearBalance
                    : available
                )
              )
            );
          }
        }
      }
    }
    if (
      tokenIn &&
      tokenOut &&
      ((tokenIn.symbol == 'NEAR' && tokenOut.symbol == 'wNEAR') ||
        (tokenIn.symbol == 'wNEAR' && tokenOut.symbol == 'NEAR'))
    ) {
      setWrapOperation(true);
    } else {
      setWrapOperation(false);
    }
  }, [tokenIn, tokenOut, useNearBalance, isSignedIn, nearBalance]);
  function getStorageTokenId() {
    const in_key = localStorage.getItem(SWAP_IN_KEY);
    const in_key_symbol = localStorage.getItem(SWAP_IN_KEY_SYMBOL);
    const out_key = localStorage.getItem(SWAP_OUT_KEY);
    const out_key_symbol = localStorage.getItem(SWAP_OUT_KEY_SYMBOL);
    const result = [];
    if (in_key == WRAP_NEAR_CONTRACT_ID) {
      if (in_key_symbol == 'NEAR') {
        result.push('near');
      } else {
        result.push(WRAP_NEAR_CONTRACT_ID);
      }
    } else {
      result.push(in_key);
    }
    if (out_key == WRAP_NEAR_CONTRACT_ID) {
      if (out_key_symbol == 'NEAR') {
        result.push('near');
      } else {
        result.push(WRAP_NEAR_CONTRACT_ID);
      }
    } else {
      result.push(out_key);
    }
    return result;
  }
  const slippageTolerance =
    swapMode === SWAP_MODE.NORMAL
      ? slippageToleranceNormal
      : slippageToleranceStable;
  const {
    canSwap,
    tokenOutAmount,
    minAmountOut,
    pools,
    swapError,
    makeSwap,
    avgFee,
    isParallelSwap,
    swapsToDo,
    setCanSwap,
  } = useSwap({
    tokenIn: tokenIn,
    tokenInAmount,
    tokenOut: tokenOut,
    slippageTolerance,
    setLoadingData,
    loadingTrigger,
    setLoadingTrigger,
    loadingData,
    loadingPause,
    swapMode,
    reEstimateTrigger,
    supportLedger,
  });

  const priceImpactValueSmartRouting = useMemo(() => {
    try {
      if (swapsToDo?.length === 2 && swapsToDo[0].status === PoolMode.SMART) {
        return calculateSmartRoutingPriceImpact(
          tokenInAmount,
          swapsToDo,
          tokenIn,
          swapsToDo[1].token,
          tokenOut
        );
      } else if (
        swapsToDo?.length === 1 &&
        swapsToDo[0].status === PoolMode.STABLE
      ) {
        return calcStableSwapPriceImpact(
          toReadableNumber(tokenIn.decimals, swapsToDo[0].totalInputAmount),
          swapsToDo[0].noFeeAmountOut,
          (
            Number(swapsToDo[0].pool.rates[tokenOut.id]) /
            Number(swapsToDo[0].pool.rates[tokenIn.id])
          ).toString()
        );
      } else return '0';
    } catch {
      return '0';
    }
  }, [tokenOutAmount, swapsToDo]);

  const priceImpactValueSmartRoutingV2 = useMemo(() => {
    try {
      const pi = calculateSmartRoutesV2PriceImpact(swapsToDo, tokenOut.id);

      return pi;
    } catch {
      return '0';
    }
  }, [tokenOutAmount, swapsToDo]);

  let PriceImpactValue: string = '0';

  try {
    if (
      swapsToDo[0].status === PoolMode.SMART ||
      swapsToDo[0].status === PoolMode.STABLE
    ) {
      PriceImpactValue = priceImpactValueSmartRouting;
    } else {
      PriceImpactValue = priceImpactValueSmartRoutingV2;
    }
  } catch (error) {
    PriceImpactValue = '0';
  }
  function wrapButtonCheck() {
    if (!wrapOperation) return false;
    if (
      !(
        +tokenInAmount > 0 &&
        new BigNumber(tokenInAmount).isLessThanOrEqualTo(tokenInMax)
      )
    )
      return false;
    if (tokenIn?.symbol == 'NEAR') {
      if (
        !new BigNumber(tokenInAmount).plus(0.5).isLessThanOrEqualTo(tokenInMax)
      )
        return false;
    }
    return true;
  }

  const tokenInMax = useNearBalance
    ? tokenInBalanceFromNear || '0'
    : toReadableNumber(tokenIn?.decimals, balances?.[tokenIn?.id]) || '0';
  const tokenOutTotal = useNearBalance
    ? tokenOutBalanceFromNear || '0'
    : toReadableNumber(tokenOut?.decimals, balances?.[tokenOut?.id]) || '0';

  const canSubmit =
    tokenIn &&
    tokenOut &&
    swapsToDo &&
    estimateValidator(
      swapsToDo,
      tokenIn,
      toNonDivisibleNumber(tokenIn.decimals, tokenInAmount),
      tokenOut
    ) &&
    canSwap &&
    (tokenInMax != '0' || !useNearBalance);

  const canWrap = wrapButtonCheck();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const ifDoubleCheck =
      new BigNumber(tokenInAmount).isLessThanOrEqualTo(
        new BigNumber(tokenInMax)
      ) && Number(PriceImpactValue) > 2;

    if (ifDoubleCheck) setDoubleCheckOpen(true);
    else makeSwap(useNearBalance);
  };
  const handleSubmit_wrap = (e: any) => {
    e.preventDefault();
    if (tokenIn?.symbol === 'NEAR') {
      setWrapLoading(true);
      return nearDeposit(tokenInAmount);
    } else {
      setWrapLoading(true);
      return nearWithdraw(tokenInAmount);
    }
  };

  return (
    <>
      <SwapFormWrap
        supportLedger={supportLedger}
        setSupportLedger={setSupportLedger}
        useNearBalance={useNearBalance.toString()}
        canSubmit={canSubmit}
        slippageTolerance={slippageTolerance}
        onChange={(slippage) => {
          swapMode === SWAP_MODE.NORMAL
            ? setSlippageToleranceNormal(slippage)
            : setSlippageToleranceStable(slippage);

          localStorage.setItem(
            swapMode === SWAP_MODE.NORMAL
              ? SWAP_SLIPPAGE_KEY
              : SWAP_SLIPPAGE_KEY_STABLE,
            slippage?.toString()
          );
        }}
        bindUseBalance={(useNearBalance) => {
          setUseNearBalance(useNearBalance);
          localStorage.setItem(
            SWAP_USE_NEAR_BALANCE_KEY,
            useNearBalance.toString()
          );
        }}
        // showElseView={tokenInMax === '0' && !useNearBalance}
        showElseView={wrapOperation}
        elseView={
          <div className="flex justify-center">
            {isSignedIn ? (
              <SubmitButton
                onClick={handleSubmit_wrap}
                disabled={!canWrap || wrapLoading}
                loading={wrapLoading}
              />
            ) : (
              <div className="mt-4 w-full">
                <ConnectToNearBtn />
              </div>
            )}
          </div>
        }
        swapMode={swapMode}
        onSubmit={handleSubmit}
        info={intl.formatMessage({ id: 'swapCopy' })}
        title={'swap'}
        loading={{
          loadingData,
          setLoadingData,
          loadingTrigger,
          setLoadingTrigger,
          loadingPause,
          setLoadingPause,
          showSwapLoading,
          setShowSwapLoading,
        }}
      >
        <TokenAmount
          forSwap
          swapMode={swapMode}
          amount={tokenInAmount}
          total={tokenInMax}
          max={tokenInMax}
          tokens={allTokens}
          selectedToken={tokenIn}
          balances={balances}
          onSelectToken={(token) => {
            localStorage.setItem(SWAP_IN_KEY, token.id);
            setTokenIn(token);
            setCanSwap(false);

            if (token.id === skywardId) {
              setShowSkywardTip(true);
            }
          }}
          text={intl.formatMessage({ id: 'from' })}
          useNearBalance={useNearBalance}
          onChangeAmount={(amount) => {
            setTokenInAmount(amount);
          }}
          tokenPriceList={tokenPriceList}
          isError={tokenIn?.id === tokenOut?.id}
          postSelected={tokenOut}
          onSelectPost={(token) => {
            setTokenOut(token);
          }}
          allowWNEAR={true}
        />
        <div
          className="flex items-center justify-center border-t mt-12"
          style={{ borderColor: 'rgba(126, 138, 147, 0.3)' }}
        >
          <SwapExchange
            onChange={() => {
              setTokenIn(tokenOut);
              localStorage.setItem(SWAP_IN_KEY, tokenOut.id);
              setTokenOut(tokenIn);
              localStorage.setItem(SWAP_OUT_KEY, tokenIn.id);

              setTokenInAmount(toPrecision('1', 6));
              localStorage.setItem(SWAP_IN_KEY, tokenOut.id);
              localStorage.setItem(SWAP_OUT_KEY, tokenIn.id);
            }}
          />
        </div>
        <TokenAmount
          forSwap
          swapMode={swapMode}
          amount={
            wrapOperation ? tokenInAmount : toPrecision(tokenOutAmount, 8)
          }
          total={tokenOutTotal}
          tokens={allTokens}
          selectedToken={tokenOut}
          balances={balances}
          preSelected={tokenIn}
          text={intl.formatMessage({ id: 'to' })}
          useNearBalance={useNearBalance}
          onSelectToken={(token) => {
            localStorage.setItem(SWAP_OUT_KEY, token.id);
            setTokenOut(token);
            setCanSwap(false);

            if (token.id === skywardId) {
              setShowSkywardTip(true);
            }
          }}
          isError={tokenIn?.id === tokenOut?.id}
          tokenPriceList={tokenPriceList}
          allowWNEAR={true}
        />
        <DetailView
          pools={pools}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          from={tokenInAmount}
          to={wrapOperation ? tokenInAmount : tokenOutAmount}
          minAmountOut={minAmountOut}
          isParallelSwap={isParallelSwap}
          fee={avgFee}
          swapsTodo={swapsToDo}
          priceImpact={PriceImpactValue}
          swapMode={swapMode}
          tokenInAmount={tokenInAmount}
        />
        {swapError ? (
          <div className="pb-2 relative -mb-5">
            <Alert level="warn" message={swapError.message} />
          </div>
        ) : null}
      </SwapFormWrap>
      <DoubleCheckModal
        isOpen={doubleCheckOpen}
        onRequestClose={() => {
          setDoubleCheckOpen(false);
          setShowSwapLoading(false);
          setLoadingPause(false);
        }}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        from={tokenInAmount}
        onSwap={() => makeSwap(useNearBalance)}
        priceImpactValue={PriceImpactValue}
      />

      {swapMode === SWAP_MODE.STABLE ? (
        <TokenReserves
          tokens={AllStableTokenIds.map((id) =>
            allTokens.find((token) => token.id === id)
          ).filter((token) => isStableToken(token.id))}
          pools={stablePools}
          type={reservesType}
          setType={setReservesType}
          swapPage
        />
      ) : null}

      <SkyWardModal
        onRequestClose={() => {
          setShowSkywardTip(false);
        }}
        isOpen={showSkywardTip}
      />
    </>
  );
}
