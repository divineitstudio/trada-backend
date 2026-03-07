import * as marketService from './market.service.js';

export const getMarketSummary = async (req, res, next) => {
  try {
    const result = await marketService.getAnalyticsByTicker(req.params.symbol);
    
    if (!result) return res.status(404).json({ success: false, message: 'Symbol not found' });

    res.status(200).json({
      success: true,
      data: {
        ticker: result.symbol.ticker,
        price_usd: result.price_usd,
        price_idr: result.price_idr,
        pct_change_1h: result.pct_change_1h,
        point_change_1h: result.point_change_1h
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMarketAnalytic = async (req, res, next) => {
  try {
    const result = await marketService.getAnalyticsByTicker(req.params.symbol);
    
    if (!result) return res.status(404).json({ success: false, message: 'Symbol not found' });

    res.status(200).json({
      success: true,
      data: {
        ema_50: result.ema_50,
        distance_to_ema50_pct: result.distance_to_ema50_pct,
        trend_status: result.trend_status
      }
    });
  } catch (error) {
    next(error);
  }
};