import React, { useState, useMemo } from 'react';
import supportData from '../pages/endToEndSupport.json';
import styles from './EndToEndSupportTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const statusClass = (status) => {
  switch (status) {
    case 'SUPPORTED':
      return styles.statusSupported;
    case 'NOT SUPPORTED':
      return styles.statusNotSupported;
    default:
      return '';
  }
};

const getOsIconProps = (os) => {
  switch (os) {
    case 'macOS':
    case 'iOS':
      return ['fab', 'apple'];
    case 'Windows':
      return ['fab', 'microsoft'];
    case 'Android':
      return ['fab', 'android'];
    case 'Ubuntu':
      return ['fab', 'ubuntu'];
    default:
      return null;
  }
};

const getBrowserIconProps = (browser) => {
  switch (browser) {
    case 'Chrome':
      return ['fab', 'chrome'];
    case 'Safari':
      return ['fab', 'safari'];
    case 'Edge':
      return ['fab', 'edge'];
    default:
      return null;
  }
};

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const columnConfig = [
  { header: 'Client OS', key: 'clientOs' },
  { header: 'Client Browser', key: 'clientBrowser' },
  { header: 'Type & Flow', key: 'typeFlow' },
  { header: 'Protocol', key: 'protocol' },
  { header: 'CM Device', key: 'credentialManagerDevice' },
  { header: 'CM', key: 'credentialManager' },
  { header: 'Status', key: 'status' },
  { header: 'Reason & Solution', key: 'reason' },
];

export default function EndToEndSupportTable() {
  const { rows, legend } = supportData;
  const { items: sortedRows, requestSort, sortConfig } = useSortableData(rows);
  const abbreviations = legend ? legend.abbreviations || {} : {};
  const abbreviationItems = Object.entries(abbreviations);

  const getSortDirectionClass = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '';
    }
    return sortConfig.direction === 'ascending' ? styles.ascending : styles.descending;
  };

  return (
    <>
      {abbreviationItems.length > 0 && (
        <div className="card margin-bottom--lg">
          <div className="card__header">
            <h4>Table Legend</h4>
          </div>
          <div className="card__body">
            <div className={styles.legend}>
              {abbreviationItems.map(([key, value], index) => (
                <React.Fragment key={key}>
                  <div className={styles.legendItem}>
                    <strong>{key}:</strong> {value}
                  </div>
                  {index < abbreviationItems.length - 1 && (
                    <div className={styles.divider}>•</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {columnConfig.map(({ header, key }) => {
              const classNames = [styles.sortableHeader, getSortDirectionClass(key)];
              if (key !== 'reason') {
                classNames.push(styles.cellCentered);
              }
              return (
                <th
                  key={key}
                  onClick={() => requestSort(key)}
                  className={classNames.join(' ')}
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, index) => (
            <tr key={index}>
              {columnConfig.map(({ key }) => {
                const classNames = [
                  key !== 'reason' ? styles.cellCentered : '',
                  ['clientOs', 'clientBrowser', 'credentialManagerDevice'].includes(key) ? styles.noWrapCell : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                let content;
                const cellValue = row[key];
                let iconProps;

                if (key === 'clientOs' || key === 'credentialManagerDevice') {
                  iconProps = getOsIconProps(cellValue);
                } else if (key === 'clientBrowser') {
                  iconProps = getBrowserIconProps(cellValue);
                }

                if (iconProps) {
                  content = <>
                    <FontAwesomeIcon icon={iconProps} style={{ marginRight: '8px' }} />
                    {cellValue}
                  </>;
                } else if (key === 'status') {
                  content =
                    <span className={`${styles.statusBadge} ${statusClass(row[key])}`}>
                      {row[key]}
                    </span>;
                } else {
                  content = cellValue;
                }

                return (
                  <td key={key} className={classNames}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}