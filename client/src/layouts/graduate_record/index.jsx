/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";

// Data
import authorsTableData from "./data/authorsTableData";
import projectsTableData from "./data/projectsTableData";
import { CoPresentSharp } from '@mui/icons-material';

function Graduate_record() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/record-request")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    { Header: "Ctrl No.", accessor: "ctrl_num"},
    { Header: "Student ID", accessor: "student_id"},
    { Header: "Record Type", accessor: "record_type" },
    { Header: "No. of Copies", accessor: "num_of_copies",align: "center" },
    { Header: "Date Requested", accessor: "date_requested"},
    { Header: "Date Releasing", accessor: "date_releasing"},
    { Header: "Processing Officer", accessor: "processing_officer"},
    { Header: "Payment Status", accessor: "payment_status"},
    { Header: "Status", accessor: "status"},
    { Header: "action", accessor: "action"}
  ];
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function getStatusColor(status, payment_status) {
    switch (status) {
      case 'Pending':
        return 'secondary'; // Set to your desired color for pending status
      case 'Received':
        return 'success'; // Set to your desired color for received status
      case 'Declined':
        return 'error'; // Set to your desired color for declined status
      case 'Completed':
        return 'info'; // Set to your desired color for completed status
      default:
        // If payment_status is 'Unpaid', return 'error'; otherwise, return 'info' as default
        return payment_status === 'Unpaid' ? 'secondary' : 'success';
    }
  }  

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Record Request Table
                </MDTypography>
                
                {/* <Link to="/graduate-record/add-record" component={RouterLink}> */}
                <Link to="/graduate-record/add-record" component={RouterLink}>
                  <MDButton variant="gradient" color="dark">
                    Add Record&nbsp;
                    <Icon>add</Icon>
                  </MDButton>
                </Link>
              </MDBox>
                <MDBox p={3}>
                  {/* <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  /> */}
                  {/* <DataTable
                    table={{
                      columns: [
                        { Header: "id", accessor: "id", width: "25%" },
                        { Header: "name", accessor: "name", width: "30%" },
                        { Header: "email", accessor: "email" },
                        { Header: "wallet", accessor: "wallet", width: "12%" },
                      ],
                      rows: [
                        
                        {
                          name: "Hanny Baniard",
                          position: "Data Coordiator",
                          office: "Baorixile",
                          age: 42,
                          startDate: "4/11/2021",
                          salary: "$474,978",
                        },
                        {
                          name: "Lara Puleque",
                          position: "Payment Adjustment Coordinator",
                          office: "Cijangkar",
                          age: 47,
                          startDate: "8/2/2021",
                          salary: "$387,287",
                        },
                        {
                          name: "Torie Repper",
                          position: "Administrative Officer",
                          office: "Montpellier",
                          age: 25,
                          startDate: "4/21/2021",
                          salary: "$94,780",
                        },
                        {
                          name: "Nat Gair",
                          position: "Help Desk Technician",
                          office: "Imider",
                          age: 57,
                          startDate: "12/6/2020",
                          salary: "$179,177",
                        },
                        {
                          name: "Maggi Slowan",
                          position: "Help Desk Technician",
                          office: "Jaunpils",
                          age: 56,
                          startDate: "11/7/2020",
                          salary: "$440,874",
                        },
                        {
                          name: "Marleah Snipe",
                          position: "Account Representative II",
                          office: "Orekhovo-Borisovo Severnoye",
                          age: 31,
                          startDate: "7/18/2021",
                          salary: "$404,983",
                        },
                        {
                          name: "Georgia Danbury",
                          position: "Professor",
                          office: "Gniezno",
                          age: 50,
                          startDate: "10/1/2020",
                          salary: "$346,576",
                        },
                        {
                          name: "Bev Castan",
                          position: "Design Engineer",
                          office: "Acharnés",
                          age: 19,
                          startDate: "1/14/2021",
                          salary: "$445,171",
                        },
                        {
                          name: "Reggi Westney",
                          position: "Financial Advisor",
                          office: "Piuí",
                          age: 56,
                          startDate: "3/21/2021",
                          salary: "$441,569",
                        },
                        {
                          name: "Bartholomeus Prosh",
                          position: "Project Manager",
                          office: "Kelīshād va Sūdarjān",
                          age: 28,
                          startDate: "5/27/2021",
                          salary: "$336,238",
                        },
                        {
                          name: "Sheffy Feehely",
                          position: "Software Consultant",
                          office: "Ndibène Dahra",
                          age: 27,
                          startDate: "3/23/2021",
                          salary: "$473,391",
                        },
                        {
                          name: "Euphemia Chastelain",
                          position: "Engineer IV",
                          office: "Little Baguio",
                          age: 63,
                          startDate: "5/1/2021",
                          salary: "$339,489",
                        },
                      ]
                    }}
                    canSearch={true}
                  /> */}
                  <Grid item xs={12} md={8} lg={12} sx={{ ml: "auto" }} >
                    <AppBar style={{borderRadius: '0.75rem'}} position="static" color="default">
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab label="All"
                          icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              folder
                            </Icon>
                          } />
                        <Tab label="Pending"
                          icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              pending
                            </Icon>
                          } />
                        <Tab label="Received" 
                            icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              verified
                            </Icon>
                          } />
                        <Tab label="Declined" 
                            icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              unpublished
                            </Icon>
                          } />
                        <Tab label="Completed" 
                            icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              assignment
                            </Icon>
                          } />
                      </Tabs>
                    </AppBar>

                    {tabValue === 0 && (
                      // Render content for the "Pending" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 1 && (
                      // Render content for the "Received" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 2 && (
                      // Render content for the "Declined" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 3 && (
                      // Render content for the "Declined" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 4 && (
                      // Render content for the "Declined" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}
                  </Grid>
                  <DataTable table={{ columns, 
                  rows: data.map((item) => ({
                    ctrl_num: "CTRL-"+item.ctrl_number,
                    student_id: item.student_id,
                    record_type: item.record_type,
                    num_of_copies: item.number_of_copies,
                    date_requested: new Date(item.date_requested).toLocaleDateString(), // Format the date_requested
                    date_releasing: new Date(item.date_releasing).toLocaleDateString(), // Format the date_releasing
                    processing_officer: item.processing_officer,
                    payment_status: (
                      <>
                      <MDBox ml={-1}>
                        <MDBadge
                          badgeContent={item.payment_status}
                          color={getStatusColor(item.payment_status)} // Set the badge color dynamically
                          variant="gradient"
                          size="sm"
                        />
                      </MDBox></>
                    ),
                    status: (
                      <>
                      <MDBox ml={-1}>
                        <MDBadge
                          badgeContent={item.status}
                          color={getStatusColor(item.status)} // Set the badge color dynamically
                          variant="gradient"
                          size="sm"
                        />
                      </MDBox></>
                    ),
                    action: (
                      <>
                        <Tooltip title="Update" >
                          <IconButton color="info" onClick={() => handleOpenUpdateDialog(item.id, item.type, item.price)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" >
                          <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>                                 
                    ), 
                    })), 
                  }} canSearch={true} />
                </MDBox>
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Graduate_record;
