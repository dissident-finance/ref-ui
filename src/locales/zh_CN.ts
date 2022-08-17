import React from 'react';
const zh_CN_in_risks_page = {
  risks: '风险',
  of_using_ref_finance: 'Ref. finance的使用',
  introduction:
    '在 Ref Finance 上提供流动性和/或交易并非没有风险。 在与协议交互之前，请先进行研究并了解所涉及的风险。',
  general_risks_quiz: '一般风险测试',
  amm_core_design: 'AMM核心设计',
  audits: '审计',
  audits_paragraph_2:
    '安全审计并不能完全消除风险。 请不要将您的毕生积蓄或您无法承受损失的资产提供给 Ref Finance，尤其是作为流动性提供者。',
  admin_keys: '管理员密钥',
  admin_keys_paragraph_2:
    '目前的 DAO 有 26 个成员。 Ref Finance 将过渡到完全去中心化的 DAO。',
  admin_keys_paragraph_3:
    '请在下方找到直接管理或目前管理 Ref Finance 事务的合同和地址列表。',
  address: '地址',
  type: '类型',
  mission: '任务',
  Locked: '锁住',
  exchange_contract: '交换合约',
  table_body_tr_1: '管理自动做市商功能； 交换并提供流动性',
  farming_contract: '农场合约',
  table_body_tr_2: '管理流动性激励措施',
  staking_contract: '质押合约',
  table_body_tr_3: '铸造和销毁 xREF，并分发基于时间的奖励',
  sputnik_dao_contract: 'Sputnik DAO合约',
  table_body_tr_4: '通过制定战略决策（包括智能合约修订）确保 Ref 的成功',
  table_body_tr_5: '管理和分配资金给特定的社区贡献者',
  table_body_tr_6: '执行战略和路线图',
  vesting_contract: '归属合同',
  table_body_tr_7: '管理 Dev DAO 成员的 REF 归属合同',
  airdrop_contract: '空投合约',
  table_body_tr_8: '管理第一个 REF 空投',
  near_address: 'NEAR地址',
  table_body_tr_9: '管理一次性错误赏金支付',
  fungible_token_contract: '可替代代币合约',
  table_body_tr_10: '铸造 REF 代币',
  rug_pull: '地毯拉力',
  rug_pull_paragraph_1:
    '如果代币背后的团队（无论是否列入白名单）决定放弃其项目并拿走投资者的钱，那么该项目的代币可能价值 0 美元。',
  rug_pull_paragraph_2:
    '如果代币在 Ref Finance 上被列入白名单，这并不意味着该项目会成功。 您有责任对项目进行自己的尽职调查，并且应该了解加密是非常高风险的投机性投资。',
  rug_pull_paragraph_3: '您应该意识到并准备好可能损失部分或全部投资资金。',
  divergence_loss: '发散损失',
  divergence_loss_paragraph_1:
    '如果您提供流动性，请注意，您可以通过不提供流动性来赚更多的钱。',
  divergence_loss_paragraph_2:
    '发散损失通常被不恰当地称为“无常损失”。 形容词（无常）可能会假设或创造一种营销感觉，即损失只是无常的，这意味着损失肯定会被逆转，这是不正确的。',
  divergence_loss_paragraph_3: '了解有关发散损失的更多信息',
  staking_risks: '质押风险',
  staking_risks_paragraph_1:
    '质押时，您会使用多种智能合约产品，每种产品都有其自身的风险。',
  permanent_loss_of_a_peg: '永久丢失挂钩',
  permanent_loss_of_a_peg_paragraph_1:
    '如果池中的一个稳定币大幅下跌至低于 1.0 的挂钩并且永远不会回到挂钩，这实际上意味着池流动性提供者几乎持有该货币的所有流动性。',
  systemic_issues: '系统性问题',
  systemic_issues_paragraph_1:
    '一般来说，DeFi 或货币的乐高是高度关联的，这意味着其组件的一个故障可能会引发一连串的故障。',
  systemic_issues_paragraph_2:
    '系统性风险意味着即使失败与您的投资/风险没有直接关系，您也可能会亏损。',
  systemic_issues_paragraph_3: '以下风险可能会对流动资金池产生影响：',
  systemic_issues_paragraph_4: '借贷协议的智能合约问题',
  systemic_issues_paragraph_5: '权益协议的智能合约问题',
  systemic_issues_paragraph_6: '这些池中稳定币的系统性问题',
  systemic_issues_paragraph_7: '这些池中 ERC20 原生代币的系统性问题',
  crypto_trading_addiction: '加密交易成瘾',
  crypto_trading_addiction_paragraph_1:
    '交易加密货币可能会让人上瘾，并且根据许多消息来源，它是一种赌博成瘾的形式，可以摧毁生命。',
  crypto_trading_addiction_paragraph_2: '请在下面找到与该问题相关的故事集。',
  crypto_trading_addiction_paragraph_3: '“交易就是赌博，这是毫无疑问的”',
  crypto_trading_addiction_paragraph_4: '“我在交易比特币时损失了 50 万英镑”',
  crypto_trading_addiction_paragraph_5:
    '“我们与一位治疗加密货币交易成瘾的治疗师交谈”',
  crypto_trading_addiction_paragraph_6:
    '“我因加密货币交易成瘾损失了数百万美元”',
  no_in_progress: '不是（进行中）',
  yes: '是的',
  no: '不是',
  NA: '不适用',
  ref_finance_near: 'ref-finance.near',
  ref_finance_near_mission:
    'v1（旧版本）- 管理自动做市商功能； 交换并提供流动性',
  token_ref_finance_near: 'token.ref-finance.near',
  token_ref_finance_near_type: '可替代代币合约',
  token_ref_finance_near_mission: 'v1（旧版本）- Mint REF 代币',
  refchef_near: 'refchef.near',
  simple_address: '简单地址',
  refchef_near_mission: '管理账户间交易',
  ref_dev_teller_near: 'ref-dev-teller.near',
  Locked_title: '锁定？ 信息框：悬停时显示：',
  Locked_paragraph_1: '锁定合约意味着没有允许重新部署合约代码的访问密钥。',
  Locked_paragraph_2: '在一般情况下，可以通过以下方式重新部署代码：',
  Locked_paragraph_3: '1. 具有部署代码操作的事务',
  Locked_paragraph_4: '2. 合约本身可以实现触发部署代码操作的函数调用',
  Locked_paragraph_5:
    '要使用交易重新部署代码，必须使用完全访问密钥对交易进行签名。 如果合约上没有这样的密钥，除非合约代码本身有专门的支持，否则无法重新部署代码，因此我们将此类合约标记为已锁定。',
  Locked_paragraph_6:
    '如果合约账户上至少注册了一个完全访问密钥，则合约不会被锁定。',
  audited_first_sentence:
    'Ref Finance 智能合约已经过<label class="underline cursor-pointer text-riskTextColor hover:text-white" onclick=' +
    "window.open('https://guide.ref.finance/developers/audits')" +
    '>审计</label>。',
  admin_first_sentence:
    'Ref Finance 由 <label class="underline cursor-pointer text-riskTextColor hover:text-white" onclick=' +
    "window.open('https://app.astrodao.com/dao/ref-finance.sputnik-dao.near')" +
    '>Ref Finance Sputnik DAO</label> 管理。有<label class="underline cursor-pointer text-riskTextColor hover:text-white" onclick=' +
    "window.open('https://gov.ref.finance/t/introducing-the-guardians/253')" +
    '>监护人</label>，特定的 NEAR 地址，可以暂停合约。 只有 DAO 可以随时恢复合约。',
  risks_of_using_ref_finance:
    'Ref. finance的使用<label class="text-greenColor">风险</label>',
};
const zh_CN = {
  deposit: '存入',
  Deposit: '存入',
  withdraw: '提取',
  Withdraw: '提取',
  withdraw_token: '提取代币',
  swap: '兑换',
  Swap: '兑换',
  exchange_tokens: '交换代币',
  pool: '流动池',
  Pool: '流动池',
  pools: '流动池',
  Pools: '流动池',
  Quiz: 'Quiz',
  no_tokens_deposited: '无代币存入',
  view_pools: '查看流动池',
  view_pool: '查看流动池',
  add_token: '添加代币',
  Add_Token: '添加代币',
  create_new_pool: '创建流动池',
  Create_New_Pool: '创建流动池',
  your_liquidity: '你的流动性',
  Your_Liquidity: '你的流动性',
  farms: '农场',
  Farms: '农场',
  airdrop: '空投',
  Airdrop: '空投',
  docs: '文档',
  Docs: '文档',
  community: '社区',
  Community: '社区',
  more: '更多',
  More: '更多',
  account: '账号',
  Account: '账号',
  New_ui: 'New UI',
  Risks: '风险',
  Forum: '论坛',
  Discord: 'Discord',
  Telegram: 'Telegram',
  Twitter: 'Twitter',
  Medium: 'Medium',
  move_assets_to_from_ethereum: '以太坊资产桥',
  rainbow_bridge: '以太坊资产桥',
  deposit_to_swap: '存入代币进行兑换',
  connect_to_near: '连接钱包',
  slippage: '滑点',
  slippage_title: '交易设置',
  minimum_received: '可收到的最低数额',
  swap_rate: '兑换汇率',
  swap_rate_pre: '汇率',
  pool_fee: '手续费',
  balance: '余额',
  from: '从',
  to: '到',
  submit: '提交',
  wrapnear: 'Wrap NEAR',
  wrapnear_tip_one: 'wNEAR支持您在REF中交易，',
  wrapnear_tip_two: '请保留至少0.5个NEAR，',
  wrapnear_tip_three: '以保障gas费充足。',
  wrap_error_msg: '余额不足',
  sign_out: '退出',
  view_account: '查看账户',
  deposit_to_swap_and_add_liquidity: '存入代币兑换或增加流动性',
  small_storage_fee_is_applied_of: '存储费为',
  liquidity: '流动性',
  tokens: '代币',
  fee: '手续费',
  fees: '手续费',
  view_detail: '查看详情',
  pool_details: '资金池详情',
  details: '详情',
  detail: '详情',
  liquidity_pools: '流动性资金池',
  minimum_tokens_out: '最少可获得代币数量',
  pair: '交易对',
  tvl: '总锁定价值',
  search_pools: '搜索资金池',
  add_liquidity: '添加流动性',
  remove_liquidity: '移除流动性',
  total_liquidity: '总流动性',
  coming_soon: '敬请期待',
  remove_as_one_token: '选择只获得一种代币',
  connect_to_near_tip: '连接您的钱包以提供流动性并查看您的存款',
  accumulated_volume: '累计成交量',
  flexible_tip: '选择分别获得每种代币的数量',
  underlying_liquidity: '基础流动性',
  total_shares: '份额总量',
  my_shares: '份额',
  token: '代币',
  enter_token_address: '输入代币地址',
  you_are_not_providing_liquidity_to_any_pools: '你未提供任何池子的流动性',
  remove: '移除',
  select: '选择代币',
  select_token: '选择代币',
  basis_points: '基点',
  total_fee: '总费用 % ',
  protocol_fee_is: '协议费为 ',
  start_in: '开始',
  start_at: '开始于',
  started_at: '开始于',
  start_date: '开始时间',
  end_at: '结束于',
  end_date: '结束时间',
  earn: '赚取',
  ended: '已结束',
  pending: '未开始',
  rewards_per_week: '每周奖励总额',
  apr: '年化率',
  total_staked: '质押总金额',
  unclaimed_rewards: '未领取奖励',
  claim: '认领',
  claim_all: '认领全部',
  stake: '质押',
  unstake: '取消质押',
  your_rewards: '你的奖励',
  your_shares: '份额',
  shares_owned: '当前份额',
  stake_your_liquidity_provider_LP_tokens: '质押你的LP代币',
  go_to_wallet: '跳转到钱包',
  recent_activity: '近期操作',
  view_all: '查看全部',
  cancel: '取消',
  claim_ref_token: '认领 REF 代币',
  has_no_available_claim: '无空投额度',
  sorry: '抱歉',
  total_ref_token: 'REF代币总额度',
  locking_ref_token: 'REF代币锁定额度',
  unclaim_ref_token: 'REF代币未领取额度',
  unlocked: '已解锁',
  locking: '锁定中',
  you_can_claim_from: '你可以从如下时间开始认领',
  you_have_claimed_all_your_rewards: '你已经领取了你所有的奖励',
  ends_in: '结束于',
  days: '天后',
  swap_successful_click_to_view: '交易成功，点击查看详情',
  claim_successful_click_to_view: '认领成功，点击查看详情',
  claim_failed_click_to_view: '认领失败，点击查看详情',
  slippageCopyForMobile:
    '滑点是您期望得到的和因先执行的其他交易而实际得到的之间的差异。',
  slippageCopy:
    '滑点是您期望得到的和因先执行的其他交易而实际得到的之间的差异。',
  depositCopy: '将您选择的代币存入，以便进行兑换或添加到流动性池中。',
  nearDepositCopy: '将 Ⓝ 打包存入进行交换或添加到流动性池中',
  nearWithdrawCopy: '将您的 Ⓝ 取出后并将代币移到您的钱包中。',
  withdrawCopy: '取出您选择的代币，并将其存入您的钱包。',
  registerToken: '申请注册一个代币名单以外的新代币。',
  whitelistTokenCopy: '添加NEP-141代币。',
  addLiquidityPoolCopy:
    '为所选的两个代币对创建一个新的流动性池。<br>兑换手续费用是流动池从每笔交易中获得的百分比。',
  swapCopy:
    '兑换交易是将第一个选定的代币交换成第二个选定的代币。<br> 将使用最高流动性和最低交易费用的池。',
  addTokenCopy: '添加NEP-141代币。',
  getLPTokenCopy: '单击此处跳转到相应的池。',
  airdropCopy: '请在截止日期前至少领取一次空投，否则您的余额将捐给财政部。',
  farmRewardsCopy: '这是基于价格的指示性值而非实际结果',
  totalValueLockedCopy: '总锁定价值',
  topPoolsCopy: '对每一个交易对, 只展示最高锁仓量的流动池',
  myWatchList: '我的收藏列表',
  you_do_not_have_enough: '你没有足够的',
  amount_must_be_greater_than_0: '数量需大于0',
  is_not_exist: '不存在',
  must_input_a_value_greater_than_zero: '必须输入一个大于0的值',
  amount_must_be_not_greater_your_balance: '输入的数值不能大于你的余额数量',
  no_pool_available_to_make_a_swap_from: '没有池子能够提供',
  for_the_amount: '数额为',
  no_pool_eng_for_chinese: '的交易',
  is_not_a_valid_swap_amount: '错误的兑换数额',
  not_nep_address:
    '您输入的地址不是NEP-141地址，请检查后再输入。如果是其他主网合约，去彩虹桥进行桥接处理',
  not_correct_address: '您输入的地址不正确，请检查后再输入',
  popular_tokens: '常用代币',
  asset_label: '资产',
  account_label: '账户',
  total_label: '总量',
  top_pools: 'Top pools',
  pool_id: '流动池 ID',
  more_pools: '更多流动池',
  my_watchlist: '我的收藏',
  h24_volume: '24小时交易量',
  volume: '交易量',
  hide_low_tvl_pools: '隐藏低锁仓量池',
  hide_low_tvl_pools_mobile: '隐藏低锁仓量池',
  watchlist_title: '顶部的我的收藏',
  add_watchlist: '添加到收藏',
  remove_watchlist: '取消收藏',
  my_watchlist_copy: '收藏过的流动池将会出现在这里',
  search_token: '搜索代币',
  language: '语言',
  deposit_to_add_liquidity: '存入代币以添加流动性',
  slip_warn: '注意，请检查您可以收到的最低金额',
  slip_invalid: '请输入有效的值',
  input_to_search: '输入以搜索',
  click_search_bar_to_search: '点击搜索图标以搜索',
  reward_tokens: '奖励币',
  detail_tip: '详情',
  no_data: '暂无数据',
  stable_swap: '稳定币兑换',
  StableSwap: '稳定币兑换',
  including_fees: '(已包含手续费)',
  standard_gas: 'Standard Gas fee:',
  rst_token: 'Your RST token',
  by_share: '份额',
  by_token: '代币',
  remove_tip: '选择份额来移除流动性不收取手续费',
  share_liquidity: 'Share of liquidity',
  remove_token_confirm: '你将获得的三种代币数量',
  add_type_all: '根据流动池的比例来增加添加代币',
  add_type_max: '将所有余额添加到流动池',
  select_balance: '选择资产来源',
  selectBalanceCopy: '选择[NEAR钱包]直接使用你钱包里的资产进行交易',
  near_wallet: 'NEAR钱包',
  ref_account: 'REF账户',
  swap_tip: '如果想从REF账户中兑换可以在设置中选择REF账户',
  attention: '请注意',
  live: '进行中',
  ended_search: '已结束',
  my_farms: '你的农场',
  staked_only: '按质押',
  sort_by: '按排序',
  your_farms_rewards: '你的农场奖励',
  your_farms: '你的农场',
  new: '最新',
  unstake_tip_t: '你有未领取的奖励...',
  unstake_tip_m:
    '取消质押操作会把所有质押从相同交易对的所有进行中和未开始的农场里移除.',
  unstake_tip_b: '你想取消质押吗?',
  value_rewards: '已领取的奖励',
  stake_unstake_tip: '质押或取消质押操作将自动领取奖励',
  over_tip: '为了优化gas费用，您一次最多可以提取4个代币',
  no_token_tip: '没有可提取的代币',
  getToken_tip: '你可以现在认领你的奖励或质押代币！',
  in_farm: '在农场',
  swap_rate_including_fee: '汇率 (已包含手续费)',
  roi_calculator: 'ROI 计算器',
  lp_staked: '流动代币质押',
  usd: '美元',
  lp_token: '流动性代币',
  stake_for: '质押时间',
  day_1: '1天',
  day_2: '7天',
  day_3: '30天',
  day_4: '90天',
  day_5: '1年',
  cur_apr: 'ROI',
  reward_token: '奖励代币',
  get_lp_token: '获取流动性代币',
  calculate_roi: 'ROI 计算器',
  rewards_claimed: '可领取的奖励',
  value_rewards_token: '奖励代币的价值',
  all: '全选',
  all_5: '一次最多4种代币',
  your_positions_will_be_displayed_here: '你参与的流动池将会出现在这里',
  price_impact: '价格影响',
  shares_left: '剩下的份额',
  total_stable_coins: '稳定币总量',
  daily_volume: '24小时交易量',
  liquidity_utilisation: '交易活跃度',
  token_reserves: '统计',
  insufficient_shares: '超过了可用的份额',
  shares_removed: '流动性',
  shares_avaliable: '可用的份额',
  minimum_shares: '最少份额',
  shares_tip: '可用的份额 / 总的份额',
  stablecoin_only: '稳定币',
  more_than: '请输入大于等于0.01的数字',
  less_than: '请输入小于20的数字',
  no_valid: '请输入有效数字',
  lp_fee: '流动性提供者',
  protocol_fee: '协议费',
  referral_fee: '中介费',
  total_fee_create: '总费用',
  xref_title: '赚取更多收益通过',
  xref_introdution:
    '通过质押REF，您有机会赚取协议产生的费用，任何REF持有人都可以分享REF Finance的收入。',
  staking_apr: '质押年化率',
  view_stats: '统计数据查看',
  xref: 'xREF',
  ref: 'REF',
  more_than_general_seed: '请输入大于等于0.000001的数',
  more_than_stable_seed: '请输入大于等于1的数',
  are_you_sure: '你确定吗',
  price_impact_is_about: '价格影响大约是',
  yes_swap: '确定, 兑换吧',
  volume_ratio: '24小时交易量/流动性比率',
  go_to_near_wallet: '跳转到NEAR钱包',
  into_ref_account: '到你的REF账户。',
  deposit_into_ref_account: '到REF账户来添加流动性',
  deposit_near_tip: '存入时至少保留一个NEAR以支付汽油费',
  input_greater_than_available_shares: '输入大于可用份额',
  number_of_unique_stakers: '质押人数',
  total_ref_staked: '质押的REF总数量',
  total_xref_minted: '产出的xREF的总数量',
  total_platform_fee_revenue: '平台总的费用收入',
  protocol_projected_revenue: '和xREF持有者分享的收入',
  total_fee_Revenue_shared_with_xref_holders: '分给xREF拥有者的总的费用',
  provision_treasury: '财政收入',
  protocol_projected_revenue_tip:
    '这个数字对应xREF持有人的累计共享交易费用收入。这相当于平台总费用收入的75%。由于价格波动，它将与实际REF代币回购金额不同。',
  stake_ref_to_xref_for_earning_more: '通过质押REF换取xREF来赚取更多！',
  auto_router: '交易路径',
  auto_router_detail_sub_1: '此路径优化了此次交易,',
  auto_router_detail_sub_2: '其将当前交易对的所有池子都纳入考虑.',
  auto_router_detail_sub_3: '详情:',
  introducing_parallel_swap: '介绍Parallel Swap',
  at_least: '至少',
  xref_start_time: '开始于 1am UTC, 18th Jan, 2022。',
  xref_to_receive: '收到的xREF',
  ref_to_receive: '收到的REF',
  more_expensive_than_best_rate_en: '',
  more_expensive_than_best_rate_zh_cn: '比最优汇率高出',
  optimal_path_found_by_our_solution: '我们找到的最好路径',
  check_to_stable_banner: '查看',
  rates_to_stable_banner: '汇率',
  make_sure_you_understand_what_you_do: '请确认你此时所做的事',
  more_expensive_than_best_rate: '比最好汇率更贵',
  risks: '风险',
  go_to_your_account_to: '去你的账户',
  deposit_l: '存储',
  withdraw_l: '提取',
  got_it: '知道了',
  check_the_transaction_settings: '查看交易设置',
  filter_by: '过滤',
  allOption: '全部',
  stablecoin: '稳定币',
  near_ecosystem: 'Near生态',
  bridged_tokens: '桥接代币',
  gaming: '游戏',
  nft: 'NFT',
  bridge: '桥接 到/来自',
  from_ethereum: 'Ethereum',
  from_aurora: 'Aurora',
  from_solana: 'Solana',
  from_terra: 'Terra',
  from_celo: 'Celo',
  no_result: '抱歉, 没有找到农场',
  multiple: '倍率',
  default: '默认',
  vi_go_live: '越南版上线啦',
  do_not_need_to_deposit_in_ref: '你已经不需要在Ref Finance上进行存入操作了!',
  you_can_add_liquidity_directly: '你现在可以直接使用NEAR钱包添加流动性了。',
  do_not_need_deposit_anymore: '你已经不需要再存入了!',
  lightning_swaps: '轻量的交换操作',
  frictionless_add_remove_liquidity: '顺滑地进行流动性的添加和移除操作',
  create: '创建',
  select_a: '选择一个',
  wallet: '钱包',
  web: '网页',
  to_use_ref_finance: '来使用Ref.Finance',
  not_supported: '不支持',
  installed: '已安装',
  installe_now: '现在安装',
  extension: '插件',
  first_time_using_ref: '第一次使用Ref',
  learn_more: '查看更多',
  install_sender_now: '现在安装Sender',
  connect_to_dapps_with_one_click: '一键连接到dApp',
  install: '安装',
  Connecting: '连接中',
  connecting: '连接中',
  check_sender_wallet_extension: '请确认Sender钱包插件',
  having_trouble: '有问题?',
  go_back: '返回',
  Type: '类型',
  click_to_view: '点击查看详情',
  transaction_failed: '交易失败',
  wallet_vi: ' ',
  value: '价值',
  usd_value: '美元价值',
  sauce_note: 'SAUCE专为挂钩资产的流动性池设计, 提供最优价格.',
  support_ledger: '支持 Ledger',
  initialize_account_tip: '请初始化你的账号',
  support_ledger_tip:
    '根据Ledger的设计, 因其内存限制, Ledger不能处理大型交易(即自动路由: 一次跨多个池进行交易)。激活后,"支持 Ledger"选项会将交易限制在最简单的形式(不利于更好的价格),因此可以签署合理规模的交易。',
  start: '开始',
  aprTip: '基于所有奖励（未开始和进行中）的指示性值',
  half: 'Half',
  max: 'Max',
  ref_account_balance_tip: '添加/移除流动性的时候似乎发生了错误',
  ref_account_tip_2: '你的REF账户中有代币',
  ref_account_tip_top: '你的代币可能在REF内部账户里',
  click_here: '点击这里',
  to_recover_them: '来取回他们',
  ref_account_tip_3: '要从您的REF帐户提取代币到您的NEAR钱包,请选择并提取',
  aurora_account_tip_4: '要从您的映射帐户提取代币到您的NEAR钱包,请选择并提取',
  mapping_account: '映射账户',
  pool_fee_cross_swap: '流动池/跨链费用',
  mapping_account_tip: '你的映射账户中存在代币',
  admin_sentence_1:
    'Ref Finance 由  <label class="underline cursor-pointer text-riskTextColor hover:text-white" onclick=' +
    "window.open('https://app.astrodao.com/dao/ref-finance.sputnik-dao.near')" +
    '>Ref Finance Sputnik DAO</label> 管理，并将过渡到完全去中心化的 DAO。',
  admin_sentence_2:
    '有关直接管理或目前管理 Ref Finance 事务的合约和地址的更多信息，请查看我们的<label class="underline cursor-pointer text-riskTextColor hover:text-white" onclick=' +
    "window.open('https://guide.ref.finance/developers/contracts')" +
    '>文档</label>。',
  cumulative_ref_buyback: '累计 REF 回购',
  yearly_revenue_booster: '年度收入加速器',
  Confirm: '确认',
  Request_for_Quote: '请求报价',
  mapping_account_explanation:
    '一个映射账户是一个代理地址, 将用户的NEAR账户映射到对应的Aurora上的以太坊地址',
  buy: '买',
  sell: '卖',
  buy_nsn: '买 USN',
  buy_nsn_tip: 'USN是NEAR经济支持的原生稳定币',
  usn_tip_one: 'USN 允许你在REF上交易，',
  vote_capital: '公投',
  rate: '汇率',
  trading_fee: '交易费',
  usn_successful_click_to_view: '交易成功，点击查看详情',
  awesomeNear_verified_token: 'AwesomeNear 已认证代币',
  usn_fee_tip: 'Ref收取零费用，用户只需支付USN费用!',
  name: '名字',
  diff: '差距',
  best: '最好',
  total_bitcoins: '所有比特币',
  total_usd_value: '美元总值',
  bitcoin_value: '比特币价值',
  stable_coin_value: '稳定币价值',
  pool_fee_apr: '流动池手续费年化收益率',
  ref_account_balance_tip_mobile: '你的REF账户中有代币.',
  click: '点击',
  to_recover: '来取回.',
  rewards_week: '奖励/周',
  rewards: '奖励',
  claimed_Rewards: '已领取奖励',
  POOL: '流动池',
  STAKE: '质押',
  lp_Token: 'LP 代币',
  booster: '加速器',
  slash_policy: '罚金策略',
  stake_period: '质押期间',
  append: '追加',
  append_staking: '追加质押',
  unstake_time: '解锁时间',
  farm: '农场',
  reward_Token: '奖励代币',
  status: '状态',
  value_of_rewards: '奖励价值',
  Rewards: '奖励',
  free: '活期',
  lp_tokens: 'LP 代币',
  connect_to_wallet: '连接钱包',
  anytime: '任意时候',
  slash_policy_content:
    '每个种子都有自己的罚金倍率。 并且会随着时间线性递减，直到本CD账号解锁时为0。',
  not_expired: '没有过期',
  accept_pay_slash_tip: '我接受支付罚金',
  i_will_pay: '我将要支付',
  lp_token_slash: 'LP代币退出费。',
  booster_change_reason: '加速器将因追加时间而改变',
  initial_booster: '初始加速器',
  append_timing: '追加时间',
  cd_limit: '超过 16 cd 帐户限制',
  expired: '已到期',
  all_5_v2: '5 代币/每次',
  all_4_v2: '4 代币/每次',

  more_than_seed: '输入必须大于或等于 ',
  how_to_earn_more: '如何赚更多?',
  you_shares: '您的份额',
  lock_your_lp_tokens_with_booster: '锁定您的 LP 代币以获得更高的奖励',
  unstaked_anytime_no_booster: '随时取消，没有加速器',
  ordinary_stake: '普通质押',
  locking_stake: '锁定质押',
  change_to_lock: '更改为锁定质押',
  estimated_rewards: '预计回报',
  final_booster: 'Final Booster',
  existing_amount: '最终加速器',
  append_amount: '追加金额',
  will_be_able_to_unstaked_after: '后就可以解压',
  expected_reward: '预期回报',
  you_have: '你有',
  tokens_small: '代币',
  reward_apr: '奖励年化收益率',
  price_board: '价格面板',
  close: '关闭',
  stake_min_deposit: '输入的值必须大于或等于 ',
  unlock: '解锁',
  exit_fee: '退出费',
  end_locking_period: '锁定期结束',
  add_lp_tokens_tip:
    '您需要 LP 代币来质押相应的农场。 首先，向池中添加流动性以获得 LP 代币。',
  slash_tip: '退出费用=退出费率*锁定期结束*解锁金额',

  nonBoosted: '非加速器',
  exit_fee_tip: '打破锁定期您将支付的估计金额',
  forbiddenTip: '此场不支持此持续时间选项',
  unstakeTip: '质押或取消质押将自动获得您的奖励。',
  endedFarmsUnstakeTip: '取消抵押将从同一对的所有活动和待定农场中删除抵押。 ',
  comimg: '即将开始',
  appendTip: '不能早于当前锁定时间',
  week: '周',
  yours: '你的',
  boost: '加速',
  near: 'NEAR',
  eth: 'ETH',
  others: '其它',
  stakeLove: '质押LOVE',
  unstakeLove: '解押LOVE',
  get_love: '获取LOVE',
  swap_successful: '交易成功. ',
  trading_successfull: '交易成功. ',
  total_near_amount: '所有NEAR数量',
  near_value: 'NEAR价值',
  borrow: '借',
  burrow_usn_tip: '你可以通过Burrow来借USN.',
  migrate: '升级',
  go_to_new_farm: '访问新版农场',
  voting_gauge_share_tip: '在这个周期中REF的奖励分配相对于所有REF奖励的比例',
  swap_capital: '兑换',
  farm_capital: '农场',
  sauce_capital: 'SAUCE',
  dao_capital: 'DAO',
  available_to_stake: '可供质押',
  recent_one_mounth_activity: '一个月的活动',
  your_assets: '你的资产',
  disconnect: '断开连接',
  change: '切换钱包',
  wallets_below_supports_on_PC: '以下钱包支持在PC上使用',
  make_sure_device_plugged_in: '请确认你的设备已插入电脑',
  then_enter_an_account_id_to_connect: '输入一个账号ID来连接',
  veTip: 'veLP代币不可转移, 代表你的投票治理能力 ',
  loveTip:
    'LOVE代表veToken的流动性, 就像NEP-141代币,可转移, 可交易, 可建立流动池, 可质押,可作为农场激励.代表veTokens的潜在流动性',
  lock_your_lp_tokens: '锁定你的流动性代币',
  unlock_your_defi_power: '解锁你的DeFi能量',
  unlock_tip_mobile: '现在已可解锁!',
  unlock_tip_top: '解锁期已到, 现在已可解锁!',
  bonus_to_be_withdraw: '种奖励代币可提取',
  keep_ve: '保持',
  months: '月',
  month: '月',
  lock_lp_tokens: '锁定流动性代币',
  get_lptoken: '获得流动性代币',
  duration: '期限',
  ve_lock_tip: '不能早于当前的解锁期',
  get: '获得',
  locking_ve: '锁定',
  in_addition_to_the: '加上',
  already_locked: '已锁定',
  unlocking_is: '解锁期是',
  you_have_no_lp_share: '你没有流动性代币',
  lock: '锁定',
  unlock_lptoken: '解锁流动性代币',
  locked: '已锁定',
  available: '可用',
  balance_lowercase: '余额',
  voting_power: '投票治理能力',
  lock_lp_tokens_first: '先锁定流动性代币!',
  farm_booster: '农场加速',
  go_to_farm: '去农场',
  in: '在',
  more_lowercase: '更多',
  avaliable_to_lock: '可锁定',
  lock_lptoken: '锁定流动性代币',
  lptoken_locker: '流动性代币锁定',
  filter: '过滤',
  bonus: '奖励',
  your_shares_ve: '你的份额',
  voted: '已投',
  my_voting_power: '我的投票治理能力',
  new_voting_ratio: '新投票比例',
  REF_allocation: 'REF 分配',
  vote: '投票',
  preview: '预览',
  options: '选项',
  ratio: '比例',
  forum_discussion: '论坛讨论',
  voted_veLPT: '已投的veLPT',
  your_contribution: '你的贡献',
  delete: '删除',
  not_start: '未开始',
  no_veLPT: '无veLPT',
  claim_bonus: '认领奖励',
  ended_ve: '已结束',
  proposal_details: '提案详情',
  back: '返回',
  pending_ve: '未开始',
  you_voted: '已投',
  add_bonus: '添加奖励',
  you_vote: '你的投票',
  Creator: '创建者',
  turn_out: '参与比例',
  top_answer: '最高票答案',
  your_bonus: '你的奖励',
  gauge_weight_vote: '激励分配投票',
  governance: '治理',
  confirm: '确认',
  voting_period: '投票期',
  applying_period: '生效期',
  community_gauge_share: '社区分配比例',
  qualified_pools: '可投票的流动池',
  total: '总计',
  supply_voted: '已投比例',
  proposed: ' ',
  farm_reward: '农场奖励',
  check_last_round: '查看上一轮',
  last_round_voting_result: '上一轮投票结果',
  create_proposal: '创建提案',
  type: '类型',
  add_option: '增加选项',
  proposed_zh: '提案',
  lock_lp_terms: '我已了解在我选定的解锁期之前不能解锁我的流动性代币',
  connect_wallet: '连接钱包',
  connect_to_near_wallet: '连接NEAR钱包',
  connect: '连接',
  v1Legacy: 'V1-Legacy',
  v2New: 'V2-New',
  v2_new_farms: 'V2 新版农场',
  migrate_now: '现在升级!',
  v2_boost_tip:
    'V2农场将支持加速农场。V1农场将在<span class="font-bold">2022年8月1日</span>耗尽奖励。',
  v2_boost_tip2: 'V2农场支持加速农场。',
  v2_boost_no_tip:
    'V1农场将在<span class="font-bold">2022年8月1日</span>耗尽奖励。',
  no_farm_need_to_migrate: '没有需要升级的农场',
  v1_farms: 'V1 农场',
  has_rewards_tip:
    '在<a class="text-greenColor text-base cursor-pointer underline hover:text-senderHot"  href="/farms" >V1农场</a>中您还有未提取的奖励。奖励不会去任何地方，您可以随时提取。</div>',
  love: 'LOVE',
  Available_to_stake: '可供质押',
  you_staked: '你已质押',
  has_rewards_tip_in_v2:
    '从<a href="/farms" class="text-sm text-greenColor cursor-pointer underline hover:text-senderHot mr-1"> V1 农场</a>中提取遗留奖励。',
  how_to_get: '如何获取?',
  get_booster: '获得加速器',
  ended_farms: '已结束农场',
  boosted_farms: '被加速的农场',
  your_farm: '你的农场',
  your_boosted_farms: '你的加速农场',
  search_farms_by_token: '通过代币搜索农场...',
  search_farms: '搜索农场',
  more_lock_ve_popup: '质押',
  more_lock_ve_popup2: ' ',
  more_in: '质押在',
  more_in_cn: '质押在',
  only_for_whitelist_address: '只允许白名单用户创建',
  starts: '开始',
  left: '剩余',
  proposal_title: '提案标题',
  share_forum_discussion_link_here: '在这里分享论坛讨论链接',
  required_field: '请输入',
  voting_power_and_extra_earnings: '投票治理能力 & 额外收益',
  bonus_tip: '投票奖励用于激励用户去投票. 你的奖励将和你的投票份额相关',
  unlocking_tip: '解锁LP代币会自动取消你的以下提案的投票以及相应的奖励',
  yes_continue: '是的, 继续',
  create_pool: '创建流动池',
  search_by_token: '根据代币搜索',
  your_power: '你的能量',
  farm_has_boost_tip: '你的能量 = 你的流动性代币 * 倍率 (根据质押的LOVE数量)',
  more_than_a_simple_pool: '不只是一个简单的流动池',
  farm_no_boost_tip: '你的能量 = 你质押的流动性代币',
  ended_Farms: '已结束的农场',
  please_choose_proposal_voting_duration: '请选择提案的投票时间',
  starting_time: '开始时间',
  ending_time: '结束时间',
  please_choose_voting_duration: '请选择投票持续时间',
  vote_mobile_capital: '公投',
  days_ve: '天',
  view_on: '查看',
  risks_capital: '风险',
  boostFarmTip: '通过质押LOVE获得加速',
  boosted: '加速',
  love_staked: '已质押的LOVE',
  your_apr: '你的奖励年化收益率',
  range_apr: '范围和参考年化收益率',
  no_pair_found: '没有找到匹配的交易对',
  found_stable_pool_in_sauce: '在SAUCE中找到一个稳定池',
  you_currently_have: '你现在有',
  scheduled_to_be_unlocked: '将可解锁于',
  locking_more_lp_tokens: '锁定更多LP代币',
  will_mean_these: '意味着',
  lp_tokens_will_not_be_unlocked_until: 'LP代币将不可被解锁直到',
  "I_understand_that_I_won't_be_able_to_remove_my": '我已了解我将不能解锁我的',
  until: '直到',
  lp_tokens_locking: 'LP代币',
  continue: '继续',
  then_enter_a_derivation_path_to_connect: '输入一个衍生路径来连接',
  account_identification_failed: '账号验证失败! 请手动输入',
  input_account_id: '输入账号ID',
  we_found: '我们发现',
  accounts_on_your_device: '个账号在你的设备中',
  select_the_accounts_you_wish_to_connect: '选择你想连接的账号',
  can_not_find_any_accounts: '找不到和当前Ledger相关的账号. 请重新创建账号于',
  or_connect_another_ledger: '或连接其他Ledger',
  add: '添加',
  finish: '完成',
  add_custom_network: '添加自定义网络',
  network_name: '网络名称',
  rpc_name_taken_tip: '网络名称已占用',
  network_invalid: '无效网络',
  fobidden_testnet_rpc_tip: 'RPC服务器的网络(测试网)与本网络(主网)不同',
  no_support_testnet_rpc_tip: 'Testnet不支持添加自定义RPC',
};
export default Object.assign(zh_CN, zh_CN_in_risks_page);
