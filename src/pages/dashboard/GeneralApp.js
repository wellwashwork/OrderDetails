import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';

import axios from '../../utils/axios';

// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices, _courierProvider } from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const theme = useTheme();

  const [countObj, setcountObj] = useState([]);
  const [tableData, setTableData] = useState([]);

  const labelList = ['Return Received', 'RTO Return', 'Delivered', 'In Process'];

  const { themeStretch } = useSettings();
  useEffect(() => {
    axios.get('api/orderStatusCount').then((res) => {
      console.log(res.data);
      setcountObj(res.data);
    });
    axios.get('api/todaysDate').then((res) => {
      console.log(res.data);
      setTableData(res.data);
    });
  }, []);
  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user}`}
              description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={
                <Button variant="contained" component={RouterLink} to={PATH_DASHBOARD.eCommerce.new}>
                  Upload File
                </Button>
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
          </Grid>

          {countObj.map((obj, index) => (
            <Grid item xs={12} md={3} key={index}>
              <AppWidgetSummary
                title={obj.status}
                percent={2.6}
                total={parseInt(obj.count, 10)}
                chartColor={theme.palette.primary.main}
                // chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
              />
            </Grid>
          ))}

          {/* <Grid item xs={12} md={2.4}>
            <AppWidgetSummary
              title="Total Deliverd"
              percent={0.2}
              total={4876}
              chartColor={theme.palette.chart.blue[0]}
              // chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <AppWidgetSummary
              title="Return Received"
              percent={-0.1}
              total={678}
              chartColor={theme.palette.chart.red[0]}
              //  chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <AppWidgetSummary
              title="In Process"
              percent={-0.1}
              total={678}
              chartColor={theme.palette.chart.red[0]}
              // chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <AppWidgetSummary
              title="Payment Recevied"
              percent={-0.1}
              total={678}
              chartColor={theme.palette.chart.red[0]}
              //  chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Courier wise Order"
              chartColors={[
                theme.palette.primary.lighter,
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.dark,
              ]}
              chartData={[
                { label: 'Delhivery', value: 12244 },
                { label: 'Xpress Bees', value: 53345 },
                { label: 'Ecom Express', value: 44313 },
                { label: 'Shadowfax', value: 78343 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewInvoice
              title="Courierwise Pick Up Detail List"
              tableData={_courierProvider}
              tableLabels={[
                { id: 'id', label: 'Sr No' },
                { id: 'Courier', label: 'Courier Name' },
                { id: 'Quantity', label: 'Quantity' },
                // { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
            {/* <AppAreaInstalled
              title="Area Installed"
              subheader="(+43%) than last year"
              chartLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
              chartData={[
                {
                  year: '2019',
                  data: [
                    { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                    { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                  ],
                },
              ]}
            /> */}
          </Grid>

          <Grid item xs={12} md={12}>
            <AppNewInvoice
              title="Today Order Detail List"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Related Applications" list={_appRelated} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning" chartData={75} />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
