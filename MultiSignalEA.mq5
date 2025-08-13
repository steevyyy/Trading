//+------------------------------------------------------------------+
//|                                               MultiSignalEA.mq5  |
//|                                       Copyright 2024, Jules AI  |
//|                                                                  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, Jules AI"
#property link      "https://www.example.com"
#property version   "1.00"
#property description "A multi-signal Expert Advisor based on technical, fundamental, sentiment, and COT analysis."
/*
   HOW TO USE:
   1. Technical Analysis is calculated automatically by this EA.
   2. Fundamental, Sentiment, and COT signals are NOT calculated internally.
   3. You must provide the final scores for these external signals via the input parameters below.
   4. An external application or script would be required to generate these scores and update the EA's inputs.
   5. The 'Score' inputs should be a value between -100 (strong sell) and +100 (strong buy),
      representing the signal direction multiplied by its confidence (e.g., a buy signal with 80% confidence = +80).
*/

//--- Include Trade library for easy order management
#include <Trade\Trade.mqh>

//--- EA Input Parameters

// Trading Parameters
input group "Trading Parameters"
input double InpLotSize = 0.01;         // The lot size for trades
input int    InpMagicNumber = 12345;    // Magic number to identify EA's trades
input int    InpSlippage = 10;          // Allowed slippage in points

// Signal Weights (should sum to 1.0)
input group "Signal Weights"
input double InpWeightTechnical   = 0.40; // Technical Analysis Weight
input double InpWeightFundamental = 0.25; // Fundamental Analysis Weight
input double InpWeightSentiment   = 0.20; // Sentiment Analysis Weight
input double InpWeightCot         = 0.15; // COT Analysis Weight

// --- External Signal Inputs ---
// These values must be updated manually or by an external tool,
// as MQL5 cannot natively collect this data.
input group "External Signals (Manual or External Tool)"
input double InpFundamentalScore      = 0.0; // Fundamental Score (-100 to 100)
input double InpFundamentalConfidence = 0.0; // Fundamental Confidence (0 to 100)
input double InpSentimentScore        = 0.0; // Sentiment Score (-100 to 100)
input double InpSentimentConfidence   = 0.0; // Sentiment Confidence (0 to 100)
input double InpCotScore              = 0.0; // COT Score (-100 to 100)
input double InpCotConfidence         = 0.0; // COT Confidence (0 to 100)

//--- Global Variables
CTrade trade; // Trading object from the standard library

//--- Indicator Handles
int rsi_handle;
int ma50_handle;
int ma200_handle;
int atr_handle;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   //--- Initialize CTrade object
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetSlippage(InpSlippage);
   trade.SetTypeFilling(ORDER_FILLING_FOK); // Using Fill Or Kill as a default setting

   //--- Get indicator handles
   // RSI(14)
   rsi_handle = iRSI(_Symbol, _Period, 14, PRICE_CLOSE);
   if(rsi_handle == INVALID_HANDLE)
     {
      Print("Error creating RSI indicator handle. Error code: ", GetLastError());
      return(INIT_FAILED);
     }

   // 50-period Simple Moving Average
   ma50_handle = iMA(_Symbol, _Period, 50, 0, MODE_SMA, PRICE_CLOSE);
   if(ma50_handle == INVALID_HANDLE)
     {
      Print("Error creating MA50 indicator handle. Error code: ", GetLastError());
      return(INIT_FAILED);
     }

   // 200-period Simple Moving Average
   ma200_handle = iMA(_Symbol, _Period, 200, 0, MODE_SMA, PRICE_CLOSE);
   if(ma200_handle == INVALID_HANDLE)
     {
      Print("Error creating MA200 indicator handle. Error code: ", GetLastError());
      return(INIT_FAILED);
     }

   // ATR(14)
   atr_handle = iATR(_Symbol, _Period, 14);
   if(atr_handle == INVALID_HANDLE)
     {
      Print("Error creating ATR indicator handle. Error code: ", GetLastError());
      return(INIT_FAILED);
     }

   Print("EA Initialized Successfully. Indicator handles created.");
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   //--- Resource cleanup on EA exit
   IndicatorRelease(rsi_handle);
   IndicatorRelease(ma50_handle);
   IndicatorRelease(ma200_handle);
   IndicatorRelease(atr_handle);
   Print("EA Deinitialized. Indicator handles released.");
}

//+------------------------------------------------------------------+
//| Expert tick function (main logic)                                |
//+------------------------------------------------------------------+
void OnTick()
{
   //--- Rate limit to run only once per new bar for stability
   static int prev_bars = 0;
   int current_bars = Bars(_Symbol, _Period);
   if(current_bars == prev_bars)
     {
      return;
     }
   prev_bars = current_bars;

   //--- 1. Get Technical Signal from our helper function
   TechnicalSignal tech_signal = GetTechnicalSignal();
   // The "score" is the signal type (-1, 0, or 1) multiplied by its confidence
   double technical_score = tech_signal.signal * tech_signal.confidence;

   //--- 2. Get External Signals from EA Inputs
   // The user provides the final score for each external module (equivalent to signal * confidence)
   double fundamental_score = InpFundamentalScore;
   double sentiment_score = InpSentimentScore;
   double cot_score = InpCotScore;

   //--- 3. Calculate the final combined score using weights
   double combined_score = (technical_score * InpWeightTechnical) +
                           (fundamental_score * InpWeightFundamental) +
                           (sentiment_score * InpWeightSentiment) +
                           (cot_score * InpWeightCot);

   //--- 4. Determine the final signal type from the combined score
   int final_signal = 0; // 1 for buy, -1 for sell, 0 for hold
   if(combined_score > 30) final_signal = 1;
   else if(combined_score < -30) final_signal = -1;

   //--- 5. Apply the confidence filter (confidence is the absolute value of the score)
   double final_confidence = MathAbs(combined_score);
   if(final_confidence < 50)
     {
      return; // Signal confidence is too low, do not trade
     }

   //--- If we have a valid signal, proceed to the trade execution block
   if(final_signal != 0)
     {
      string signal_text = (final_signal == 1) ? "BUY" : "SELL";
      Print("New Valid Signal: ", signal_text, " | Confidence: ", DoubleToString(final_confidence, 2), " | Combined Score: ", DoubleToString(combined_score, 2));
      Print("  Score Breakdown: Tech=", DoubleToString(technical_score, 2), ", Fund=", DoubleToString(fundamental_score, 2), ", Sent=", DoubleToString(sentiment_score, 2), ", COT=", DoubleToString(cot_score, 2));

      // --- TRADE EXECUTION LOGIC ---

      // First, check if a position is already open for this symbol by this EA
      if(PositionSelect(_Symbol))
        {
         if(PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
           {
            // A position for this EA already exists. Do not open another one.
            return;
           }
        }

      // Get current ATR for SL/TP calculation
      double atr_buffer[1];
      if(CopyBuffer(atr_handle, 0, 0, 1, atr_buffer) <= 0)
        {
         Print("Error copying ATR buffer for trade execution. ", GetLastError());
         return;
        }
      double atr_value = atr_buffer[0];

      // Calculate SL and TP based on the formulas from the original source code
      double price = (final_signal == 1) ? SymbolInfoDouble(_Symbol, SYMBOL_ASK) : SymbolInfoDouble(_Symbol, SYMBOL_BID);
      int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);

      double confidence_multiplier = final_confidence / 100.0;
      double atr_multiplier = 2.0 + confidence_multiplier; // SL is 1.5 * ATR, TP is (2 to 3) * ATR

      double stop_loss = 0;
      double take_profit = 0;

      if(final_signal == 1) // Buy Signal
        {
         stop_loss = NormalizeDouble(price - (atr_value * 1.5), digits);
         take_profit = NormalizeDouble(price + (atr_value * atr_multiplier), digits);
        }
      else // Sell Signal
        {
         stop_loss = NormalizeDouble(price + (atr_value * 1.5), digits);
         take_profit = NormalizeDouble(price - (atr_value * atr_multiplier), digits);
        }

      // Execute the trade using the CTrade object
      bool trade_result = false;
      if(final_signal == 1)
        {
         trade_result = trade.Buy(InpLotSize, _Symbol, price, stop_loss, take_profit, "Buy by MultiSignalEA");
        }
      else
        {
         trade_result = trade.Sell(InpLotSize, _Symbol, price, stop_loss, take_profit, "Sell by MultiSignalEA");
        }

      // Check the result of the trade operation
      if(trade_result)
        {
         Print("Trade opened successfully. Ticket: ", trade.ResultDeal(), " at price ", trade.ResultPrice());
        }
      else
        {
         Print("Error opening trade: ", trade.ResultComment(), ". (Error code: ", trade.ResultRetcode(), ")");
        }
     }
}
//+------------------------------------------------------------------+


//+------------------------------------------------------------------+
//|                        HELPER FUNCTIONS                          |
//+------------------------------------------------------------------+

// --- Struct to hold the result of the technical analysis ---
struct TechnicalSignal
{
   int    signal;     // 1 for buy, -1 for sell, 0 for hold
   double confidence; // 0-100
};

// --- Function to calculate Exponential Moving Average manually ---
// MQL5's iMA can do this, but manual calculation ensures logic matches the source code exactly.
double CalculateEMA(const double &price_array[], int period)
{
   double k = 2.0 / (period + 1.0);
   int size = ArraySize(price_array);
   if(size == 0) return 0;

   double ema = price_array[0];
   for(int i = 1; i < size; i++)
     {
      ema = price_array[i] * k + ema * (1.0 - k);
     }
   return ema;
}


// --- Function to get the combined technical signal ---
TechnicalSignal GetTechnicalSignal()
{
   TechnicalSignal tech_signal;
   tech_signal.signal = 0;
   tech_signal.confidence = 0;

   //--- Get latest values from indicator handles
   double rsi_buffer[1], ma50_buffer[1], ma200_buffer[1];
   if(CopyBuffer(rsi_handle, 0, 0, 1, rsi_buffer) <= 0 ||
      CopyBuffer(ma50_handle, 0, 0, 1, ma50_buffer) <= 0 ||
      CopyBuffer(ma200_handle, 0, 0, 1, ma200_buffer) <= 0)
     {
      Print("Error copying indicator buffers for TA signal. ", GetLastError());
      return tech_signal;
     }
   double rsi_value = rsi_buffer[0];
   double ma50_value = ma50_buffer[0];
   double ma200_value = ma200_buffer[0];

   //--- Manual MACD Calculation to match source code
   double close_prices[200];
   // We need enough data for the longest EMA (26). CopyClose gets oldest data at index 0.
   if(CopyClose(_Symbol, _Period, 0, 200, close_prices) < 26)
     {
      Print("Error copying close prices for MACD calculation. Not enough data.");
      return tech_signal;
     }

   // Calculate EMAs on the full historical data for better accuracy.
   double ema12 = CalculateEMA(close_prices, 12);
   double ema26 = CalculateEMA(close_prices, 26);

   double macd_value = ema12 - ema26;
   double macd_signal_line = macd_value * 0.9; // This is the simplified signal line from the original TS code

   //--- Combine signals into a weighted score
   double score = 0;
   double total_weight = 4.5; // 2 (RSI) + 1.5 (MACD) + 1 (MA)

   // RSI signal (weight: 2)
   if(rsi_value < 30) score += 2.0;
   else if(rsi_value > 70) score -= 2.0;

   // MACD signal (weight: 1.5)
   if(macd_value > macd_signal_line) score += 1.5;
   else score -= 1.5;

   // Moving Average signal (weight: 1)
   if(ma50_value > ma200_value) score += 1.0;
   else score -= 1.0;

   //--- Normalize score and determine final signal
   if(total_weight > 0)
     {
      double normalized_score = score / total_weight;

      if(normalized_score > 0.3) tech_signal.signal = 1;  // Buy
      else if(normalized_score < -0.3) tech_signal.signal = -1; // Sell
      else tech_signal.signal = 0; // Hold

      tech_signal.confidence = MathAbs(normalized_score) * 100.0;
      if(tech_signal.confidence > 100) tech_signal.confidence = 100;
     }

   return tech_signal;
}
