# Trading Bot Multi-Analysis System

## Overview

This is a comprehensive automated trading bot system designed for forex and metals trading, featuring multiple analysis layers including technical analysis, fundamental analysis, sentiment analysis, and COT (Commitment of Traders) positioning data. The system uses a modern full-stack architecture with React frontend and Express backend, implementing paper trading capabilities with sophisticated risk management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **WebSockets**: Native WebSocket implementation for real-time updates
- **Session Management**: PostgreSQL-based session storage

### Database Design
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle Kit for migrations
- **Tables**: Users, instruments, market data, technical indicators, fundamental data, sentiment data, COT data, trading signals, paper trades, risk settings, system logs, API status

## Key Components

### Data Acquisition Layer
- **Purpose**: Fetches market data from multiple free APIs
- **Sources**: Yahoo Finance, Alpha Vantage (mock implementations)
- **Frequency**: Automated collection every 5 minutes
- **Data Types**: OHLCV data for forex and metals instruments

### Analysis Services
1. **Technical Analysis Service**
   - Calculates RSI, MACD, Moving Averages, Bollinger Bands, ATR
   - Support/resistance level detection
   - Multiple timeframe analysis (15m, 1h, 4h, 1d)

2. **Fundamental Analysis Service**
   - Economic calendar events
   - Central bank announcements
   - News impact assessment

3. **Sentiment Analysis Service**
   - Social media sentiment (Twitter, Reddit mock)
   - News sentiment analysis
   - Market positioning insights

4. **COT Analysis Service**
   - Commitment of Traders report parsing
   - Large player positioning tracking
   - Commercial vs non-commercial positioning

### Signal Generation Engine
- **Multi-factor Analysis**: Combines all analysis types
- **Confidence Scoring**: Weighted scoring system
- **Risk-adjusted Signals**: Integrates risk management rules
- **Real-time Updates**: WebSocket broadcasting of new signals

### Risk Management System
- **Position Sizing**: Dynamic position sizing based on risk parameters
- **Daily Risk Limits**: Configurable maximum daily risk exposure
- **Drawdown Protection**: Maximum drawdown monitoring
- **Correlation Limits**: Prevents over-exposure to correlated instruments

### Paper Trading Engine
- **Simulated Execution**: Full paper trading implementation
- **Performance Tracking**: P&L calculation and trade history
- **Slippage Modeling**: Realistic execution simulation
- **Trade Validation**: Risk management integration

## Data Flow

1. **Data Collection**: Automated services collect market data every 5 minutes
2. **Analysis Processing**: Each analysis service processes raw data into insights
3. **Signal Generation**: Signal engine combines all analyses to generate trading signals
4. **Risk Assessment**: Risk manager validates and adjusts signals
5. **Paper Execution**: Paper trading service executes validated signals
6. **Real-time Updates**: WebSocket broadcasts updates to frontend
7. **Performance Monitoring**: System tracks and logs all activities

## External Dependencies

### APIs and Data Sources
- **Yahoo Finance API**: Market data (mock implementation)
- **Alpha Vantage API**: Technical indicators (mock implementation)
- **CFTC COT Reports**: Positioning data (simulated)
- **Social Media APIs**: Sentiment data (mock implementation)

### Third-party Libraries
- **Frontend**: React Query, Radix UI, Tailwind CSS, Wouter
- **Backend**: Drizzle ORM, Express, WebSocket, date-fns
- **Development**: Vite, TypeScript, ESBuild

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: @neondatabase/serverless with WebSocket support

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon serverless PostgreSQL
- **Environment**: Node.js with tsx for TypeScript execution

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: ESBuild bundling for optimized server code
- **Deployment**: Single application serving both frontend and API

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate dev, build, and production scripts
- **Type Safety**: Full TypeScript coverage across frontend and backend

### Monitoring and Logging
- **System Logs**: Comprehensive logging system with different log levels
- **API Monitoring**: Status tracking for all external APIs
- **Performance Metrics**: Trade performance and system health monitoring
- **Error Handling**: Centralized error management with detailed logging

The system is designed to be highly modular, allowing for easy extension of analysis methods, addition of new data sources, and integration with live trading platforms in the future. The paper trading implementation provides a safe environment for strategy testing and validation.