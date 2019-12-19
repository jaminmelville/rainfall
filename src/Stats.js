import React from 'react';
import Color from 'color';

function Stats(props) {
  const color = Color({ r: 255, g: 127, b: 127 });
  const rows = [ ...props.years].map((year, index) => (
    <tr key={index}>
      <td>
        {year.label}
        <span 
          className="ml-1 px-2" 
          style={{ backgroundColor: color.rotate(index / props.years.length * 360).rgb().string()}}
        />
      </td>
      <td>
        {year.stats.total.toFixed(2)}mm
      </td>
      <td>
        {year.stats.records}
      </td>
      <td>
        {year.stats.days}
      </td>
    </tr>
  ));
  return (
    <>
      <p>
        <ul>
          <li>
            The <strong>most recent rain</strong> was 
            <strong> {props.latest.date.fromNow()} </strong>
            on the 
            <strong> {props.latest.date.format('Mo MMMM')} </strong>
            when it rained 
            <strong> {props.latest.amount}mm</strong>
          </li>
          <li>
            <strong>{props.highestDay.amount}mm </strong>
            of rain fell 
            <strong> {props.highestDay.date.fromNow()} </strong>
            on the
            <strong> {props.highestDay.date.format('Mo MMMM YYYY')} </strong>
            making it the 
            <strong> wettest day </strong> 
            on record
          </li>
          <li>
            The 
            <strong> most rainfall for a year </strong>
            was in 
            <strong> {props.highestYear.label} </strong>
            when it totalled 
            <strong> {props.highestYear.stats.total}mm</strong>
          </li>
        </ul>
      </p>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Total</th>
            <th scope="col">Records</th>
            <th scope="col">Days</th>
          </tr>
        </thead>
        <tbody>
          {rows.reverse()}
          <tr className="font-weight-bold">
            <td>Average</td>
            <td>{props.average.year.total.toFixed(2)}mm</td>
            <td>{parseInt(props.average.year.records)}</td>
            <td>{parseInt(props.average.year.days)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Stats;
