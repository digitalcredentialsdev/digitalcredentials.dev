import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import supportData from '../pages/ecosystem-support.json';
import styles from './EcosystemSupportTable.module.css';

const SupportStatus = ({ status }) => {
  if (!status || status.length === 0) {
    return '-';
  }

  return (
    <div className={styles.supportStatusContainer}>
      {status.map((line, index) => {
        const isRight = line.iconPosition === 'right';
        return (
          <div
            key={index}
            className={`${styles.supportStatusLine} ${
              isRight ? styles.iconRight : ''
            }`}>
            <FontAwesomeIcon icon={line.icon} color={line.color} fixedWidth />
            <span>
              {line.text}
              {line.superscript && <sup>{line.superscript}</sup>}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function EcosystemSupportTable() {
  const { headers, rows, legend } = supportData;
  const iconLegendItems = legend.icons || [];
  const textLegendItems = legend.superscripts || [];

  return (
    <>
      <table className={styles.supportTable}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header ? <strong>{header}</strong> : ''}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <FontAwesomeIcon icon={row.platform.icon} fixedWidth /> {row.platform.name}
              </td>
              {headers.slice(1).map((browser) => (
                <td key={browser}>
                  <SupportStatus status={row.support[browser]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.legend}>
        {iconLegendItems.map((item, index) => (
          <span key={index} className={styles.legendItem}>
            {item.icon && <FontAwesomeIcon icon={item.icon} />}
            {item.text}
          </span>
        ))}
      </div>
      {textLegendItems.length > 0 && (
        <div className={styles.subLegend}>
          {textLegendItems.map((item, index) => (
            <span key={index} className={styles.legendItem}>
              {item.superscript && <sup>{item.superscript}</sup>}
              {item.text}
            </span>
          ))}
        </div>
      )}
    </>
  );
}