'use client';

import { Investment, Portfolio } from '@/lib/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Scale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PortfolioService } from '@/lib/services/portfolio.service';
import { useState, useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  investments: Investment[];
}

export function PerformanceChart({ investments }: PerformanceChartProps) {

  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    allInvestments: [],
    profitableInvestments: [],
    unprofitableInvestments: [],
  });
  
  useEffect(() => {
    PortfolioService.calculatePortfolio(investments).then((portfolio) => {
      setPortfolio(portfolio);
    });
  }, [investments]);

  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  const data = {
    labels: dates.map(date => date.toLocaleDateString()),
    datasets: [
      {
        label: 'Portfolio Value',
        data: dates.map(date => {
          return portfolio.allInvestments.reduce((total, investment) => {
            const purchaseDate = new Date(investment.purchaseDate);
            if (date >= purchaseDate) {
              return total + (investment.quantity * (investment.currentPrice || 0));
            }
            return total;
          }, 0);
        }),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: Scale, value: string | number) {
            return `$${Number(value).toLocaleString()}`;
          }
        }
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Line options={options} data={data} />
      </CardContent>
    </Card>
  );
} 