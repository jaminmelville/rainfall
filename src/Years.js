import React from 'react';
import Color from 'color';
import classNames from 'classnames';
import moment from 'moment';

function Years(props) {
  const color = Color({ r: 255, g: 127, b: 127 });
  const time = moment('2001-01-01');
  const allYears = [];
  while (time < moment()) {
    allYears.unshift(time.format('YYYY'));
    time.add(1, 'year');
  }
  const years = allYears.map((year, index) => {
    const isSelected = props.value.indexOf(year) >= 0;
    return (
      <li 
        key={year}
        className="p-1 d-inline-block"
      >
        <button 
          className={classNames('btn btn-outline-dark', {
            active: isSelected
          })}
          onClick={(e) => {
            if (!isSelected && e.ctrlKey) {
              props.onChange([ ...props.value, year ].sort());
            } else if (!isSelected) {
              props.onChange([ year ]);
            } else {
              props.onChange(props.value.filter(item => item !== year));
            }
          }}
        >
          {year}
          {isSelected &&
            <span 
              className="ml-1 px-2" 
              style={{
                backgroundColor: color.rotate(props.value.indexOf(year) / props.value.length * 360).rgb().string()
              }}
            />
          }
        </button>      
      </li>
    )
  })
  return (
    <ul className="list-unstyled m-n1 d-flex justify-content-center flex-wrap">
      {years}
    </ul>
  );
}

export default Years;
