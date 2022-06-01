import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Switch,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../components/table';
// sections
import { ProductTableRow, ProductTableToolbar } from '../../sections/@dashboard/e-commerce/product-list';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Id', label: 'Sr No.', align: 'left' },
  { id: 'suborderId', label: 'SuborderId', align: 'left' },
  { id: 'awb', label: 'AWB', align: 'left' },
  { id: 'courierProvider', label: 'courierProvider', align: 'center', width: 180 },
  { id: 'orderDate', label: 'orderDate', align: 'right' },
  { id: 'sku', label: 'sku', align: 'right' },
  { id: 'productName', label: 'productName', align: 'right' },
  { id: 'listingPrice', label: 'listingPrice', align: 'right' },
  { id: 'size', label: 'size', align: 'right' },
  { id: 'liveOrderStatus', label: 'liveOrderStatus', align: 'right' },
  { id: 'paymentDate', label: 'paymentDate', align: 'right' },
  { id: 'finalSettlementAmount', label: 'finalSettlementAmount', align: 'right' },
  { id: 'status', label: 'status', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { products, isLoading } = useSelector((state) => state.product);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const mapingApiData = async () => {
    const response = await axios.get('/api/data');
    // console.log(response.data, 'ecomm product api');
    setTableData(response.data);
  };
  useEffect(() => {
    mapingApiData();
  }, []);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.suborderId !== id);
    setSelected([]);
    setTableData(deleteRow);
  };
  const handleSendRows = (selected) => {
    const selectRow = tableData.filter((row) => selected.includes(row.suborderId));
    const userId = localStorage.getItem('userId');
    const apiBody = selectRow.map((row) => {
      const { suborderId, awb } = row;
      const body = { suborderId, awb, userId, isReturnReceived: 'yes' };
      console.log(body);

      return body;
    });
    console.log(apiBody);
    axios.post('/api/save/courierReturnInfo', apiBody); // .then((response) => console.log(response));

    const deleteRows = tableData.filter((row) => !selected.includes(row.suborderId));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Ecommerce: Product List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Product List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.new}
            >
              Upload File
            </Button>
          }
        />

        <Card>
          <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.suborderId)
                    )
                  }
                  actions={
                    <Tooltip title="Sent">
                      <IconButton color="primary" onClick={() => handleSendRows(selected)}>
                        <Iconify icon={'ic:round-send'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.suborderId)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ProductTableRow
                          key={index}
                          srno={index}
                          row={row}
                          selected={selected.includes(row.suborderId)}
                          onSelectRow={() => onSelectRow(row.suborderId)}
                          onDeleteRow={() => handleDeleteRow(row.suborderId)}
                          onEditRow={() => handleEditRow(row.suborderId)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  // console.log(tableData, 'for sort');
  tableData = stabilizedThis.map((el) => el[0]);
  // console.warn(tableData, 'after stabo');
  if (filterName) {
    tableData = tableData.filter((item) => item.courierProvider.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  // console.log(tableData, 'final retun');
  return tableData;
}
