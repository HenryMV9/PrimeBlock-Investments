import { useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import { AlertTriangle, TrendingUp, BarChart3, Globe } from 'lucide-react'

function TradingViewWidget({ symbol, containerId }: { symbol: string; containerId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: '100%',
      height: '220',
      locale: 'en',
      dateRange: '12M',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
    })

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol])

  return (
    <div className="tradingview-widget-container" ref={containerRef} id={containerId}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

function MarketOverviewWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      dateRange: '12M',
      showChart: true,
      locale: 'en',
      width: '100%',
      height: '500',
      largeChartUrl: '',
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      plotLineColorGrowing: 'rgba(59, 130, 246, 1)',
      plotLineColorFalling: 'rgba(239, 68, 68, 1)',
      gridLineColor: 'rgba(42, 46, 57, 0)',
      scaleFontColor: 'rgba(134, 137, 147, 1)',
      belowLineFillColorGrowing: 'rgba(59, 130, 246, 0.12)',
      belowLineFillColorFalling: 'rgba(239, 68, 68, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(59, 130, 246, 0)',
      belowLineFillColorFallingBottom: 'rgba(239, 68, 68, 0)',
      symbolActiveColor: 'rgba(59, 130, 246, 0.12)',
      tabs: [
        {
          title: 'Indices',
          symbols: [
            { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
            { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
            { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
          ],
          originalTitle: 'Indices',
        },
        {
          title: 'Forex',
          symbols: [
            { s: 'FX:EURUSD', d: 'EUR/USD' },
            { s: 'FX:GBPUSD', d: 'GBP/USD' },
            { s: 'FX:USDJPY', d: 'USD/JPY' },
          ],
          originalTitle: 'Forex',
        },
        {
          title: 'Crypto',
          symbols: [
            { s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
            { s: 'BITSTAMP:ETHUSD', d: 'Ethereum' },
            { s: 'BINANCE:BNBUSDT', d: 'BNB' },
          ],
          originalTitle: 'Crypto',
        },
      ],
    })

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

function TickerTapeWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
        { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
        { proName: 'FX:EURUSD', title: 'EUR/USD' },
        { proName: 'COMEX:GC1!', title: 'Gold' },
        { proName: 'NYMEX:CL1!', title: 'Crude Oil' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

const popularSymbols = [
  { symbol: 'FOREXCOM:SPXUSD', name: 'S&P 500', id: 'spx' },
  { symbol: 'BITSTAMP:BTCUSD', name: 'Bitcoin', id: 'btc' },
  { symbol: 'BITSTAMP:ETHUSD', name: 'Ethereum', id: 'eth' },
  { symbol: 'FX:EURUSD', name: 'EUR/USD', id: 'eurusd' },
]

export default function Market() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Market Overview
        </h1>
        <p className="text-slate-400">
          View live market data and global financial trends.
        </p>
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <TickerTapeWidget />
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {popularSymbols.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <TrendingUp className="text-primary-400" size={20} />
                </div>
                <span className="font-semibold text-white">{item.name}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <TradingViewWidget symbol={item.symbol} containerId={`widget-${item.id}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-500/20 rounded-lg">
              <BarChart3 className="text-accent-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Global Markets</h2>
              <p className="text-sm text-slate-400">Indices, Forex, and Cryptocurrency</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <MarketOverviewWidget />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="text-primary-400" size={24} />
            </div>
            <h3 className="font-semibold text-white mb-2">Global Coverage</h3>
            <p className="text-sm text-slate-400">
              Access market data from major exchanges worldwide.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-semibold text-white mb-2">Real-Time Data</h3>
            <p className="text-sm text-slate-400">
              Live market prices updated in real-time.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-accent-400" size={24} />
            </div>
            <h3 className="font-semibold text-white mb-2">Interactive Charts</h3>
            <p className="text-sm text-slate-400">
              Powered by TradingView professional charts.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <p className="text-xs text-slate-500 text-center">
            Market data provided by TradingView. Prices may be delayed.
            This information is for educational and informational purposes only and should not be
            construed as investment advice. Past performance is not indicative of future results.
          </p>
        </CardContent>
      </Card>
    </Layout>
  )
}
