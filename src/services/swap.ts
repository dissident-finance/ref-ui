import BN from 'bn.js';
import Big from 'big.js';

import { getLiquidity } from '~utils/pool';

import {
  ONLY_ZEROS,
  percentLess,
  scientificNotationToString,
  toNonDivisibleNumber,
  toPrecision,
  toReadableNumber,
} from '../utils/numbers';
import {
  executeMultipleTransactions,
  near,
  ONE_YOCTO_NEAR,
  REF_FI_CONTRACT_ID,
  RefFiFunctionCallOptions,
  refFiManyFunctionCalls,
  Transaction,
  wallet,
  STABLE_POOL_ID,
  STABLE_TOKEN_IDS,
} from './near';
import {
  calculateOptimalOutput,
  calculate_dx_float,
  calculate_dy_float,
  formatPoolNew,
  checkIntegerSumOfAllocations,
} from './parallelSwapLogic';

import {
  ftGetStorageBalance,
  ftGetTokenMetadata,
  ftGetTokensMetadata,
  TokenMetadata,
} from './ft-contract';
import {
  getPoolsByTokens,
  getPoolByToken,
  parsePool,
  Pool,
  getPool,
  getStablePool,
  StablePool,
  getRefPoolsByToken1ORToken2,
} from './pool';
import {
  checkTokenNeedsStorageDeposit,
  getWhitelistedTokens,
  round,
} from './token';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import {
  storageDepositAction,
  STORAGE_TO_REGISTER_WITH_MFT,
} from './creators/storage';
import { registerTokenAction } from './creators/token';
import { BigNumber } from 'bignumber.js';
import _, { filter } from 'lodash';
import { getSwappedAmount } from './stable-swap';
import { STABLE_LP_TOKEN_DECIMALS } from '~components/stableswap/AddLiquidity';
import { getSmartRouteSwapActions, stableSmart } from './smartRouteLogic';
import { ExtractRouteOptionalParam } from 'react-router';

// Big.strict = false;
const FEE_DIVISOR = 10000;
const LP_THERESHOLD = 0.001;
const MAXIMUM_NUMBER_OF_POOLS = 5;
const STABLE_POOL_KEY = 'STABLE_POOL_VALUE';
const REF_FI_STABLE_Pool_INFO_KEY = 'REF_FI_STABLE_Pool_INFO_VALUE';

export enum PoolMode {
  PARALLEL = 'parallel swap',
  SMART = 'smart routing',
  SMART_V2 = 'stableSmart',
}

interface EstimateSwapOptions {
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
  amountIn: string;
  intl?: any;
  setLoadingData?: (loading: boolean) => void;
  loadingTrigger?: boolean;
  setLoadingTrigger?: (loadingTrigger: boolean) => void;
}

export interface ReservesMap {
  [index: string]: string;
}

export interface RoutePool {
  amounts: string[];
  fee: number;
  id: number;
  reserves: ReservesMap;
  shares: string;
  token0_ref_price: string;
  token1Id: string;
  token1Supply: string;
  token2Id: string;
  token2Supply: string;
  updateTime: number;
  partialAmountIn?: string | number | Big;
  gamma_bps?: Big;
  supplies?: ReservesMap;
  tokenIds?: string[];
  x?: string;
  y?: string;
}

export interface EstimateSwapView {
  estimate: string;
  pool: Pool;
  intl?: any;
  dy?: string;
  status?: PoolMode;
  token?: TokenMetadata;
  noFeeAmountOut?: string;
  inputToken?: string;
  outputToken?: string;
  nodeRoute?: string[];
  tokens?: TokenMetadata[];
  routeInputToken: string;
  routeOutputToken: string;
  route?: RoutePool[];
  allRoutes?: RoutePool[][];
  allNodeRoutes?: string[][];
  totalInputAmount?: string;
  overallPriceImpact?: string;
}

const getStablePoolEstimate = ({
  tokenIn,
  tokenOut,
  amountIn,
  stablePoolInfo,
  stablePool,
}: {
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
  amountIn: string;
  stablePoolInfo: StablePool;
  stablePool: Pool;
}) => {
  const [amount_swapped, fee, dy] = getSwappedAmount(
    tokenIn.id,
    tokenOut.id,
    amountIn,
    stablePoolInfo
  );

  const amountOut =
    amount_swapped < 0
      ? '0'
      : toPrecision(scientificNotationToString(amount_swapped.toString()), 0);

  const dyOut =
    amount_swapped < 0
      ? '0'
      : toPrecision(scientificNotationToString(dy.toString()), 0);

  return {
    estimate: toReadableNumber(STABLE_LP_TOKEN_DECIMALS, amountOut),
    noFeeAmountOut: toReadableNumber(STABLE_LP_TOKEN_DECIMALS, dyOut),
    pool: stablePool,
    token: tokenIn,
  };
};

const getSinglePoolEstimate = (
  tokenIn: TokenMetadata,
  tokenOut: TokenMetadata,
  pool: Pool,
  tokenInAmount: string
) => {
  const allocation = toReadableNumber(
    tokenIn.decimals,
    scientificNotationToString(tokenInAmount)
  );

  const amount_with_fee = Number(allocation) * (FEE_DIVISOR - pool.fee);
  const in_balance = toReadableNumber(
    tokenIn.decimals,
    pool.supplies[tokenIn.id]
  );
  const out_balance = toReadableNumber(
    tokenOut.decimals,
    pool.supplies[tokenOut.id]
  );
  const estimate = new BigNumber(
    (
      (amount_with_fee * Number(out_balance)) /
      (FEE_DIVISOR * Number(in_balance) + amount_with_fee)
    ).toString()
  ).toFixed();

  return {
    token: tokenIn,
    estimate,
    pool,
  };
};

export const estimateSwap = async ({
  tokenIn,
  tokenOut,
  amountIn,
  intl,
  setLoadingData,
  loadingTrigger,
}: EstimateSwapOptions): Promise<EstimateSwapView[]> => {
  const parsedAmountIn = toNonDivisibleNumber(tokenIn.decimals, amountIn);

  if (ONLY_ZEROS.test(parsedAmountIn))
    throw new Error(
      `${amountIn} ${intl.formatMessage({ id: 'is_not_a_valid_swap_amount' })}`
    );

  const throwNoPoolError = () => {
    throw new Error(
      `${intl.formatMessage({
        id: 'no_pool_available_to_make_a_swap_from',
      })} ${tokenIn.symbol} -> ${tokenOut.symbol} ${intl.formatMessage({
        id: 'for_the_amount',
      })} ${amountIn} ${intl.formatMessage({
        id: 'no_pool_eng_for_chinese',
      })}`
    );
  };

  // First check to see if both tokens are stable coins. If so, short circuit to the stable swap pool.

  // const bothStableCoin =
  //   STABLE_TOKEN_IDS.includes(tokenIn.id) &&
  //   STABLE_TOKEN_IDS.includes(tokenOut.id);

  // if (bothStableCoin) {
  //   throwNoPoolError();
  // }

  const pools = await getPoolsByTokens({
    tokenInId: tokenIn.id,
    tokenOutId: tokenOut.id,
    amountIn: parsedAmountIn,
    setLoadingData,
    loadingTrigger,
  });

  const orpools = await getRefPoolsByToken1ORToken2(tokenIn.id, tokenOut.id);

  let stableSmartActions = await stableSmart(
    orpools,
    tokenIn.id,
    tokenOut.id,
    parsedAmountIn
  );

  console.log('actions,', stableSmartActions);

  return stableSmartActions;
  // const maxLPPool = _.maxBy(pools, (p) => getLiquidity(p, tokenIn, tokenOut));

  // const maxPoolLiquidity = maxLPPool
  //   ? new Big(getLiquidity(maxLPPool, tokenIn, tokenOut))
  //   : new Big(0);

  // const filterFunc = (pool: Pool, i: number) =>
  //   maxPoolLiquidity.gt(0) &&
  //   new Big(getLiquidity(pool, tokenIn, tokenOut))
  //     .div(maxPoolLiquidity)
  //     .gt(LP_THERESHOLD);

  // const filteredPools = _.orderBy(
  //   pools,
  //   (p) => getLiquidity(p, tokenIn, tokenOut),
  //   ['desc']
  // )
  //   .slice(0, MAXIMUM_NUMBER_OF_POOLS)
  //   .filter(filterFunc);

  // const poolAllocations = calculateOptimalOutput(
  //   filteredPools,
  //   parsedAmountIn,
  //   tokenIn.id,
  //   tokenOut.id
  // );

  // const parallelPoolsWithAllocation = filteredPools.map((pool, i) => ({
  //   ...pool,
  //   partialAmountIn: scientificNotationToString(poolAllocations[i].toString()),
  // }));

  // const parallelPools = parallelPoolsWithAllocation.filter(
  //   (paraPool) => Number(paraPool.partialAmountIn) > 0
  // );

  // const parallelEstimates = parallelPools.map((pool) => ({
  //   ...getSinglePoolEstimate(
  //     tokenIn,
  //     tokenOut,
  //     pool,
  //     pool.partialAmountIn.toString()
  //   ),
  //   status: PoolMode.PARALLEL,
  // }));

  // let pool1, pool2;
  // let stablePool: Pool;
  // let stablePoolInfo: StablePool;

  // const bothStableCoin =
  //   STABLE_TOKEN_IDS.includes(tokenIn.id) &&
  //   STABLE_TOKEN_IDS.includes(tokenOut.id);

  // if (bothStableCoin) {
  //   if (parallelEstimates.length) return parallelEstimates;
  //   else throwNoPoolError();
  // }

  // if (
  //   STABLE_TOKEN_IDS.includes(tokenIn.id) ||
  //   STABLE_TOKEN_IDS.includes(tokenOut.id)
  // ) {
  //   [stablePool, stablePoolInfo] = await Promise.all([
  //     JSON.parse(localStorage.getItem(STABLE_POOL_KEY)) ||
  //       (await getPool(Number(STABLE_POOL_ID))),
  //     JSON.parse(localStorage.getItem(REF_FI_STABLE_Pool_INFO_KEY)) ||
  //       (await getStablePool(Number(STABLE_POOL_ID))),
  //   ]);
  //   localStorage.setItem(STABLE_POOL_KEY, JSON.stringify(stablePool));
  //   localStorage.setItem(
  //     REF_FI_STABLE_Pool_INFO_KEY,
  //     JSON.stringify(stablePoolInfo)
  //   );
  // }

  // const candidatePools = [];

  // const pools1 = (await getPoolByToken(tokenIn.id)).filter((p) => {
  //   const supplies = Object.values(p.supplies);
  //   return new Big(supplies[0]).times(new Big(supplies[1])).gt(0);
  // });

  // if (STABLE_TOKEN_IDS.includes(tokenIn.id) && stablePool) {
  //   pools1.push(stablePool);
  // }

  // for (let i = 0; i < pools1.length; i++) {
  //   const tempPool1 = pools1[i];
  //   const tokenMidIds = tempPool1.tokenIds.filter((id) => id !== tokenIn.id);

  //   for (let k = 0; k < tokenMidIds.length; k++) {
  //     const tokenMidId = tokenMidIds[k];

  //     const pools2 = (await getPoolByToken(tokenMidId)).filter((p) => {
  //       const supplies = Object.values(p.supplies);
  //       return (
  //         new Big(supplies[0]).times(new Big(supplies[1])).gt(0) &&
  //         p.tokenIds.includes(tokenOut.id) &&
  //         tokenMidId !== tokenOut.id
  //       );
  //     });

  //     if (
  //       STABLE_TOKEN_IDS.includes(tokenOut.id) &&
  //       STABLE_TOKEN_IDS.includes(tokenMidId) &&
  //       stablePool &&
  //       tokenOut.id !== tokenMidId
  //     ) {
  //       pools2.push(stablePool);
  //     }

  //     if (pools2.length > 0) {
  //       pool2 = _.maxBy(pools2, (p) =>
  //         Number(
  //           new Big(
  //             toReadableNumber(tokenOut.decimals, p.supplies[tokenOut.id])
  //           )
  //         )
  //       );
  //       pool1 = tempPool1;
  //       candidatePools.push([pool1, pool2]);
  //     }
  //   }
  // }

  // const tokensMedata = await ftGetTokensMetadata(
  //   candidatePools.map((cp) => cp.map((p) => p.tokenIds).flat()).flat()
  // );

  // if (candidatePools.length > 0) {
  //   const BestPoolPair = _.maxBy(candidatePools, (poolPair) => {
  //     const tokenMidId = poolPair[0].tokenIds.find((t) =>
  //       poolPair[1].tokenIds.includes(t)
  //     );

  //     const tokenMidMeta = tokensMedata[tokenMidId];

  //     const pool1 = poolPair[0];
  //     const pool2 = poolPair[1];

  //     const estimate1 = {
  //       ...(pool1.id === Number(STABLE_POOL_ID)
  //         ? getStablePoolEstimate({
  //             tokenIn,
  //             tokenOut: tokenMidMeta,
  //             amountIn,
  //             stablePoolInfo,
  //             stablePool,
  //           })
  //         : getSinglePoolEstimate(
  //             tokenIn,
  //             tokenMidMeta,
  //             pool1,
  //             parsedAmountIn
  //           )),
  //       status: PoolMode.SMART,
  //     };

  //     const estimate2 = {
  //       ...(pool2.id === Number(STABLE_POOL_ID)
  //         ? getStablePoolEstimate({
  //             tokenIn: tokenMidMeta,
  //             tokenOut,
  //             amountIn: estimate1.estimate,
  //             stablePoolInfo,
  //             stablePool,
  //           })
  //         : getSinglePoolEstimate(
  //             tokenMidMeta,
  //             tokenOut,
  //             pool2,
  //             toNonDivisibleNumber(tokenMidMeta.decimals, estimate1.estimate)
  //           )),
  //       status: PoolMode.SMART,
  //     };
  //     console.log('series estimates are...', [estimate1, estimate2]);
  //     return [estimate1, estimate2];
  //   }

  //   const tokenMidId = BestPoolPair[0].tokenIds.find((t) =>
  //     BestPoolPair[1].tokenIds.includes(t)
  //   );

  //   const tokenMidMeta = tokensMedata[tokenMidId];

  //   const estimate1 = {
  //     ...(pool1.id === Number(STABLE_POOL_ID)
  //       ? getStablePoolEstimate({
  //           tokenIn,
  //           tokenOut: tokenMidMeta,
  //           amountIn,
  //           stablePoolInfo,
  //           stablePool,
  //         })
  //       : getSinglePoolEstimate(tokenIn, tokenMidMeta, pool1, parsedAmountIn)),
  //     status: PoolMode.SMART,
  //   };

  //   const estimate2 = {
  //     ...(pool2.id === Number(STABLE_POOL_ID)
  //       ? getStablePoolEstimate({
  //           tokenIn: tokenMidMeta,
  //           tokenOut,
  //           amountIn: estimate1.estimate,
  //           stablePoolInfo,
  //           stablePool,
  //         })
  //       : getSinglePoolEstimate(
  //           tokenMidMeta,
  //           tokenOut,
  //           pool2,
  //           toNonDivisibleNumber(tokenMidMeta.decimals, estimate1.estimate)
  //         )),
  //     status: PoolMode.SMART,
  //   };

  //   const smartRoutingEstimates = [estimate1, estimate2];

  //   return new BigNumber(estimate2.estimate).gt(
  //     BigNumber.sum(...parallelEstimates.map((e) => e.estimate))
  //   ) || parallelEstimates.length === 0
  //     ? smartRoutingEstimates
  //     : parallelEstimates;
  // } else if (parallelEstimates.length === 0) {
  //   throwNoPoolError();
  // } else {
  //   try {
  //     const estimates = parallelPools.map((pool) => ({
  //       ...getSinglePoolEstimate(
  //         tokenIn,
  //         tokenOut,
  //         pool,
  //         pool.partialAmountIn.toString()
  //       ),
  //       status: PoolMode.PARALLEL,
  //     }));
  //     console.log('estimates are...');
  //     console.log(estimates);
  //     return estimates;
  //   } catch (err) {
  //     throwNoPoolError();
  //   }
  // }
};

interface SwapOptions {
  useNearBalance?: boolean;
  swapsToDo: EstimateSwapView[];
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
  amountIn: string;
  slippageTolerance: number;
}

export const swap = async ({
  useNearBalance,
  tokenIn,
  tokenOut,
  swapsToDo,
  slippageTolerance,
  amountIn,
}: SwapOptions) => {
  if (swapsToDo) {
    if (useNearBalance) {
      await instantSwap({
        tokenIn,
        tokenOut,
        amountIn,
        swapsToDo,
        slippageTolerance,
      });
    } else {
      await depositSwap({
        tokenIn,
        tokenOut,
        amountIn,
        slippageTolerance,
        swapsToDo,
      });
    }
  }
};

export const instantSwap = async ({
  tokenIn,
  tokenOut,
  amountIn,
  swapsToDo,
  slippageTolerance,
}: // minAmountOut,
SwapOptions) => {
  const transactions: Transaction[] = [];
  const tokenInActions: RefFiFunctionCallOptions[] = [];
  const tokenOutActions: RefFiFunctionCallOptions[] = [];

  const registerToken = async (token: TokenMetadata) => {
    const tokenRegistered = await ftGetStorageBalance(
      token.id,
      wallet.getAccountId()
    ).catch(() => {
      throw new Error(`${token.id} doesn't exist.`);
    });

    if (tokenRegistered === null) {
      tokenOutActions.push({
        methodName: 'storage_deposit',
        args: {
          registration_only: true,
          account_id: wallet.getAccountId(),
        },
        gas: '30000000000000',
        amount: STORAGE_TO_REGISTER_WITH_MFT,
      });

      transactions.push({
        receiverId: token.id,
        functionCalls: tokenOutActions,
      });
    }
  };

  const isParallelSwap = swapsToDo.every(
    (estimate) => estimate.status === PoolMode.PARALLEL
  );

  if (wallet.isSignedIn()) {
    if (isParallelSwap) {
      const swapActions = swapsToDo.map((s2d) => {
        let dx_float = Number(s2d.pool.partialAmountIn);
        let fpool = formatPoolNew(s2d.pool, tokenIn.id, tokenOut.id);
        let dy_float = calculate_dy_float(
          dx_float,
          fpool,
          tokenIn.id,
          tokenOut.id
        );
        let tokenOutAmount = toReadableNumber(
          tokenOut.decimals,
          scientificNotationToString(dy_float.toString())
        );

        s2d.estimate = tokenOutAmount;
        let minTokenOutAmount = tokenOutAmount
          ? percentLess(slippageTolerance, tokenOutAmount)
          : '0';
        let allocation = toReadableNumber(
          tokenIn.decimals,
          scientificNotationToString(s2d.pool.partialAmountIn)
        );

        return {
          pool_id: s2d.pool.id,
          token_in: tokenIn.id,
          token_out: tokenOut.id,
          amount_in: round(
            tokenIn.decimals,
            toNonDivisibleNumber(tokenIn.decimals, allocation)
          ),
          min_amount_out: round(
            tokenOut.decimals,
            toNonDivisibleNumber(tokenOut.decimals, minTokenOutAmount)
          ),
        };
      });

      await registerToken(tokenOut);

      tokenInActions.push({
        methodName: 'ft_transfer_call',
        args: {
          receiver_id: REF_FI_CONTRACT_ID,
          amount: toNonDivisibleNumber(tokenIn.decimals, amountIn),
          msg: JSON.stringify({
            force: 0,
            actions: swapActions,
          }),
        },
        gas: '180000000000000',
        amount: ONE_YOCTO_NEAR,
      });

      transactions.push({
        receiverId: tokenIn.id,
        functionCalls: tokenInActions,
      });

      return executeMultipleTransactions(transactions);
    } else {
      //making sure all actions get included.
      await registerToken(tokenOut);
      var actionsList = [];
      let allSwapsTokens = swapsToDo.map((s) => [s.inputToken, s.outputToken]); // to get the hop tokens
      for (var i in allSwapsTokens) {
        let swapTokens = allSwapsTokens[i];
        if (swapTokens[0] == tokenIn.id && swapTokens[1] == tokenOut.id) {
          // parallel, direct hop route.
          actionsList.push({
            pool_id: swapsToDo[i].pool.id,
            token_in: tokenIn.id,
            token_out: tokenOut.id,
            amount_in: swapsToDo[i].pool.partialAmountIn,
            min_amount_out: round(
              tokenOut.decimals,
              toNonDivisibleNumber(
                tokenOut.decimals,
                percentLess(slippageTolerance, swapsToDo[i].estimate)
              )
            ),
          });
        } else if (swapTokens[0] == tokenIn.id) {
          // first hop in double hop route
          //TODO -- put in a check to make sure this first hop matches with the next (i+1) hop as a second hop.
          actionsList.push({
            pool_id: swapsToDo[i].pool.id,
            token_in: swapTokens[0],
            token_out: swapTokens[1],
            amount_in: swapsToDo[i].pool.partialAmountIn,
            min_amount_out: '0',
          });
        } else {
          // second hop in double hop route.
          //TODO -- put in a check to make sure this second hop matches with the previous (i-1) hop as a first hop.
          actionsList.push({
            pool_id: swapsToDo[i].pool.id,
            token_in: swapTokens[0],
            token_out: swapTokens[1],
            min_amount_out: round(
              tokenOut.decimals,
              toNonDivisibleNumber(
                tokenOut.decimals,
                percentLess(slippageTolerance, swapsToDo[i].estimate)
              )
            ),
          });
        }
      }

      transactions.push({
        receiverId: tokenIn.id,
        functionCalls: [
          {
            methodName: 'ft_transfer_call',
            args: {
              receiver_id: REF_FI_CONTRACT_ID,
              amount: toNonDivisibleNumber(tokenIn.decimals, amountIn),
              msg: JSON.stringify({
                force: 0,
                actions: actionsList,
              }),
            },
            gas: '180000000000000',
            amount: ONE_YOCTO_NEAR,
          },
        ],
      });

      return executeMultipleTransactions(transactions);
    }
  }
};

export const depositSwap = async ({
  tokenIn,
  tokenOut,
  amountIn,
  slippageTolerance,
  swapsToDo,
}: // minAmountOut,
SwapOptions) => {
  const isParallelSwap = swapsToDo.every(
    (estimate) => estimate.status === PoolMode.PARALLEL
  );

  if (isParallelSwap) {
    const swapActions = swapsToDo.map((s2d) => {
      let dx_float = Number(s2d.pool.partialAmountIn);
      let fpool = formatPoolNew(s2d.pool, tokenIn.id, tokenOut.id);
      let dy_float = calculate_dy_float(
        dx_float,
        fpool,
        tokenIn.id,
        tokenOut.id
      );
      let tokenOutAmount = toReadableNumber(
        tokenOut.decimals,
        scientificNotationToString(dy_float.toString())
      );

      s2d.estimate = tokenOutAmount;
      let minTokenOutAmount = tokenOutAmount
        ? percentLess(slippageTolerance, tokenOutAmount)
        : '0';
      let allocation = toReadableNumber(
        tokenIn.decimals,
        scientificNotationToString(s2d.pool.partialAmountIn)
      );

      return {
        pool_id: s2d.pool.id,
        token_in: tokenIn.id,
        token_out: tokenOut.id,
        amount_in: round(
          tokenIn.decimals,
          toNonDivisibleNumber(tokenIn.decimals, allocation)
        ),
        min_amount_out: round(
          tokenOut.decimals,
          toNonDivisibleNumber(tokenOut.decimals, minTokenOutAmount)
        ),
      };
    });

    const actions: RefFiFunctionCallOptions[] = [
      {
        methodName: 'swap',
        args: { actions: swapActions },
        amount: ONE_YOCTO_NEAR,
      },
    ];

    const whitelist = await getWhitelistedTokens();
    if (!whitelist.includes(tokenOut.id)) {
      actions.unshift(registerTokenAction(tokenOut.id));
    }

    const neededStorage = await checkTokenNeedsStorageDeposit();
    if (neededStorage) {
      actions.unshift(storageDepositAction({ amount: neededStorage }));
    }

    return refFiManyFunctionCalls(actions);
  } else {
    const whitelist = await getWhitelistedTokens();
    // need to add in condition if smart route solves for direct hop as optimal solution and there is no tokenMid:

    // need to do a more robust check on swapsToDo. For each of these, if inputToken and outputToken for swapsToDo[i] match
    // overall inputToken/outputToken, then that is a single-hop / parallel swap.
    // otherwise, if the inputToken for swapsToDo[i] matches overall inputToken, then it is a first hop. Can probably assume
    // that swapsToDo[i+1] will be the corresponding second hop. But need to check this to make sure.
    // Need to build up full actions list.
    var actionsList = [];
    let allSwapsTokens = swapsToDo.map((s) => [s.inputToken, s.outputToken]); // to get the hop tokens
    for (var i in allSwapsTokens) {
      let swapTokens = allSwapsTokens[i];
      if (swapTokens[0] == tokenIn.id && swapTokens[1] == tokenOut.id) {
        // parallel, direct hop route.
        actionsList.push({
          pool_id: swapsToDo[i].pool.id,
          token_in: tokenIn.id,
          token_out: tokenOut.id,
          amount_in: swapsToDo[i].pool.partialAmountIn,
          min_amount_out: round(
            tokenOut.decimals,
            toNonDivisibleNumber(
              tokenOut.decimals,
              percentLess(slippageTolerance, swapsToDo[i].estimate)
            )
          ),
        });
      } else if (swapTokens[0] == tokenIn.id) {
        // first hop in double hop route
        //TODO -- put in a check to make sure this first hop matches with the next (i+1) hop as a second hop.
        actionsList.push({
          pool_id: swapsToDo[i].pool.id,
          token_in: swapTokens[0],
          token_out: swapTokens[1],
          amount_in: swapsToDo[i].pool.partialAmountIn,
          min_amount_out: '0',
        });
      } else {
        // second hop in double hop route.
        //TODO -- put in a check to make sure this second hop matches with the previous (i-1) hop as a first hop.
        actionsList.push({
          pool_id: swapsToDo[i].pool.id,
          token_in: swapTokens[0],
          token_out: swapTokens[1],
          min_amount_out: round(
            tokenOut.decimals,
            toNonDivisibleNumber(
              tokenOut.decimals,
              percentLess(slippageTolerance, swapsToDo[i].estimate)
            )
          ),
        });
      }
    }

    var actions: RefFiFunctionCallOptions[] = [
      {
        methodName: 'swap',
        amount: ONE_YOCTO_NEAR,
        args: {
          actions: actionsList,
        },
      },
    ];

    if (!whitelist.includes(tokenOut.id)) {
      actions.unshift(registerTokenAction(tokenOut.id));
    }

    const neededStorage = await checkTokenNeedsStorageDeposit();
    if (neededStorage) {
      actions.unshift(storageDepositAction({ amount: neededStorage }));
    }

    return refFiManyFunctionCalls(actions);
  }
};

export const checkTransaction = (txHash: string) => {
  return (near.connection.provider as JsonRpcProvider).sendJsonRpc(
    'EXPERIMENTAL_tx_status',
    [txHash, wallet.getAccountId()]
  );
};
