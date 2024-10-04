import React from 'react';
import { DataTable } from 'react-native-paper';

const TableComponent = ({ data }) => {
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Item</DataTable.Title>
        <DataTable.Title numeric>Price</DataTable.Title>
      </DataTable.Header>

      {data.map((row, index) => (
        <DataTable.Row key={index}>
          <DataTable.Cell>{row.item}</DataTable.Cell>
          <DataTable.Cell numeric>{row.price}</DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

export default TableComponent;
