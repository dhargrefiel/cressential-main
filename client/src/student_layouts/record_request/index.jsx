import * as React from 'react';
import { useEffect, useState } from 'react';
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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from "@mui/material/Divider";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import MDBadge from "../../components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import DocumentSelection from "./document_selection";

import { useMaterialUIController } from "../..//context";

function Record_request() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItemID, setSelectedItemID] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const steps = [
    'Request Form',
    'Payment',
    'Submit',
  ];



  // Callback function to update the selected item and price
  const updateSelectedItem = (index, item) => {
    const updatedSelectedDocuments = [...selectedDocuments];
    updatedSelectedDocuments[index] = { ...updatedSelectedDocuments[index], ...item };
    setSelectedDocuments(updatedSelectedDocuments);
  };

  // Callback function to update the number of copies
  const updateNumOfCopies = (index, numOfCopies) => {
    const updatedSelectedDocuments = [...selectedDocuments];
    updatedSelectedDocuments[index].numOfCopies = numOfCopies;
    setSelectedDocuments(updatedSelectedDocuments);
  };

  // Callback function to update the total amount
  const updateTotalAmount = (newTotalAmount) => {
    setTotalAmount(newTotalAmount);
  };

  // Callback function to update the total amount
  const updateSelectedItemID = (newSelectedItemID) => {
    setSelectedItemID(newSelectedItemID);
  };

  const columns = [
    { Header: "Type", accessor: "type"},
    { Header: "Price", accessor: "price", align: "center"},
    { Header: "Action", accessor: "action", align: "center"}
  ];
  const [cartItems, setCartItems] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    renderCartItems();
  }, [cartItems]);

  function removeFromCart(itemId) {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
    renderCartItems();
  }


  function addToCart(id) {
    let quantity = 1;
    let itemExists = false;

    // check if item already exists in cart
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
            itemExists = true;
            cartItems[i].quantity++;
        }
    }
    const type = data.find((item) => item.id === id)?.type;
    const price = data.find((item) => item.id === id)?.price;

    // add new item to cart if not already existing
    if (!itemExists) {
        const newItem = {
          id: id,
          type: type,
          price: price,
          quantity: 1,
        };

        setCartItems([...cartItems, newItem]);
    }

    renderCartItems();
}

function renderCartItems() {
  let totalPrice = 0;
  const updatedRows = [];

  for (let i = 0; i < cartItems.length; i++) {
  let item = cartItems[i]; 
  let itemTotalPrice = item.price * item.quantity;
  totalPrice += itemTotalPrice;
      
  updatedRows.push({
    type: item.type,
    price: item.price.toFixed(2),
    quantity: item.quantity.toFixed(2),
    action: (
      <>
        <Tooltip title="Remove" >
          <IconButton color="error" onClick={() => removeFromCart(item.id)}>
            <HighlightOffIcon />
          </IconButton>
        </Tooltip>
      </>                                 
    ), 
  });
    
  }
 
  setRows(updatedRows);
}



  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>              
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="success"
                mx={2}
                mt={-3}
                mb={1}
                textAlign="center"
              >
                <Stepper activeStep={0} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </MDBox>
              <MDBox pt={2} pb={3} px={5}>
                <Grid container spacing={4}>

                  {/* LEFT COLUMN */}                  
                  <Grid item lg={6} sm={12}>     

                      {/* REQUEST FOR */}
                      <MDBox                        
                        bgColor={darkMode ? "transparent" : "grey-100"}
                        borderRadius="lg"
                        p={3}
                        mb={1}
                        mt={2}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sx={{margin:"auto"}}>
                            <MDTypography fontWeight={"bold"}>Request For:</MDTypography>                         
                          </Grid>          
                            <DocumentSelection data={data} updateTotalAmount={updateTotalAmount}  updateSelectedItemID={updateSelectedItemID}                      
                            />
                          <Grid item xs={7} >
                          </Grid>
                          <Grid item xs={5} style={{ textAlign: 'right' }} >
                            <MDButton onClick={() => addToCart(selectedItemID)} variant="gradient" color="info">Add Request</MDButton>
                          </Grid>   
                          <Grid item xs={12} >
                            <DataTable table={{ columns, 
                            rows }} entriesPerPage={false} showTotalEntries={false}/>                                          
                          </Grid>
                          
                          
                          <Grid item xs={7} sx={{margin:"auto", textAlign: 'right' }}>
                            <MDTypography variant="body2" fontWeight={"bold"}>Total Amount:</MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput type="number" disabled value={totalAmount} fullWidth/>
                          </Grid>
                        </Grid>
                      </MDBox>
                  </Grid>

                  {/* RIGHT COLUMN */}
                  <Grid item lg={6} sm={12}>                   
                    
                      {/* PURPOSE */}
                      <MDBox                        
                        bgColor={darkMode ? "transparent" : "grey-100"}
                        borderRadius="lg"
                        p={3}
                        mb={1}
                        mt={2}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sx={{margin:"auto"}}>
                            <MDTypography fontWeight={"bold"}>Purpose</MDTypography>                         
                          </Grid>
                          <Grid item xs={12} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">A. Transcript of Records (TOR):</MDTypography>
                          </Grid>
                          <Grid item xs={12} sx={{margin:"auto"}}>
                            <FormGroup sx={{marginLeft:"30px"}}>
                              <FormControlLabel control={<Checkbox defaultChecked />} label="1. Evaluation" />
                              <FormControlLabel control={<Checkbox />} label="2. Employment/Promotion" />
                              <FormControlLabel control={<Checkbox />} label="3. For further studies (Specify the college/university)" />
                            <MDInput type="text" variant="standard" label="Please specify" fullWidth/>
                            </FormGroup>
                          </Grid>
                          <Grid item xs={3} sx={{marginTop:"15px"}}>
                            <MDTypography variant="body2">B. Others:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" variant="standard" label="Please specify" fullWidth/>
                          </Grid>
                        </Grid>
                      </MDBox>
                    {/* END OF PURPOSE */}

                    <Grid container spacing={2}>
                      <Grid item xs={8}></Grid>
                        <Grid item xs={4} sx={{marginTop:"10px"}} >
                            <MDButton variant="gradient" color="info" fullWidth>
                              <Icon>send</Icon> &nbsp;Submit
                            </MDButton>
                        </Grid>
                    </Grid>
                                        
                  </Grid>
                </Grid>
              </MDBox>
            
              
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Record_request;
