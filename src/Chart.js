import React from 'react';
import { Bar } from 'react-chartjs-2';
import Color from 'color';

function Chart(props) {
  const color = Color({ r: 255, g: 127, b: 127 });
  const datasets = props.years.map((year, index) => ({
    label: year.label,
    backgroundColor: color.rotate(index / props.years.length * 360).rgb().string(),
    data: year.months
  }));
  return (
    <Bar
      data={{
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets
      }}
      height={300}
      width={600}
      options={{
        scales: { 
          yAxes: [ { ticks: { beginAtZero: true } } ]  
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const year = data.datasets[tooltipItem.datasetIndex].label;
              return `${year}: ${tooltipItem.yLabel.toFixed(2)}mm`
            },            
            afterLabel: (tooltipItem) => {
              const average = props.average.months[tooltipItem.index].toFixed(2);
              return `(avg ${average}mm)`
            },
          }
        }
      }}
    />
  );
}

export default Chart;
