import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Icon from "@mui/material/Icon";


// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from '../../../../components/MDTypography';
import MDAvatar from '../../../../components/MDAvatar';
import DocumentSelection from '../processing_officer';

import axios from 'axios';



function DialogBox({ open, onClose, recordType, setRecordType, recordIPFS, 
recordID, recordPassword, setRecordPassword, payment_status, ctrl_number,
setAlertMessage, setIsError, setIsSuccess, handleCloseUploadDialog, data, setData, student_email}) {


// =========== For the datatable =================
const [selectedFile, setSelectedFile] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [uploadedCID, setUploadedCID] = useState(null);
const [finalCID, setFinalCID] = useState(null);
const [multihash, setMultihash] = useState(null); // Added state for multihash


const handleFileChange = (e) => {
  const file = e.target.files[0];
  setSelectedFile(file);
  setUploadedCID(null); // Clear the uploaded CID
  setErrorMessage('');
  setMultihash(null); // Clear the multihash
};

const handleFileUpload = async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8081/files/api/maindec', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (recordPassword === null ) {
        handleCloseUploadDialog();
        setIsError(true);
        setAlertMessage('Password is required.');
      } else {

        if (response.data.encrypted) {
          // File is encrypted, proceed with the upload
          setUploadedCID(response.data.cid);
          setMultihash(response.data.multihash); // Set the multihash
          setFinalCID(response.data.cid);
          // console.log(response.data.cid);
          handleUpdateSubmit(response.data.cid, response.data.multihash);
          // Reset the selectedFile state to clear the file input
          setSelectedFile(null);
          
        } else {
          // File is not encrypted, display an error message
          handleCloseUploadDialog();
          setIsError(true);
          setAlertMessage('Only encrypted files are allowed.');
          setRecordType('');
          setRecordPassword('');
        }
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      handleCloseUploadDialog();
      setIsError(true);
      setAlertMessage('Error uploading file. Please try again.');
      setRecordType('');
      setRecordPassword('');
    }
  } else {
    // If no file is selected, display an error message
    handleCloseUploadDialog();
    setIsError(true);
    setAlertMessage('Please choose an encrypted PDF file first.');
    setRecordType('');
    setRecordPassword('');
  }
};

  const dateIssued = new Date();

  const sendEmail = async (toEmail, cid, password, recordType) => {

    const ipfsLink = `http://localhost:8080/ipfs/${cid}`; // Replace with the IPFS link to the record    

    const emailData = {
      to: toEmail,
      subject: 'Your Requested Record Information',
      text: `
      Good day! 

      We are pleased to inform you that your academic record has been issued by the Registrar's office. Below, you will find the details of your record:

        • Record Type: ${recordType}
        • IPFS Link: ${ipfsLink}
        • Password: ${password}


      You can access your record by clicking on the IPFS Link. Use the provided password to securely access and download your record.

      **Note: Please keep the password secured, as it will also be used for verifying the validity of your record in the verifier portal. Your record's security relies on the confidentiality of this password.

      If you have any questions or need further assistance, please feel free to contact our office.

      Best regards,
      Registrar's Office
      `,
    };
  
    try {
      const response = await axios.post('http://localhost:8081/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleUpdateSubmit = async (CID, hash) => {
    // Create an updated record object to send to the server

    const updatedRecord = {
      recordPassword: recordPassword,
      uploadedCID: CID,
      hash: hash,
      dateIssued: dateIssued
    };

    try {
      const response = await fetch(`http://localhost:8081/mysql/upload-record-per-request/${recordID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord),
      });

      if (response.ok) {
        handleCloseUploadDialog();
        setIsSuccess(true);
        setAlertMessage('Record updated successfully.');
        sendEmail(student_email, CID, recordPassword, recordType);

        // Fetch updated data and update the state
        fetch(`http://localhost:8081/mysql/record-per-request/${ctrl_number}`)
          .then((res) => res.json())
          .then((data) => {
            setData(data); // Set the fetched data into the state
          })
          .catch((err) => console.log(err));
          setRecordType('');
          setRecordPassword('');
          
      } else {
        setAlertMessage('Failed to update record');
        setRecordType('');
        setRecordPassword('');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
      setRecordType('');
      setRecordPassword('');
    }
  };



  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Record
        <IconButton
          sx={{
            position: 'absolute',
            right: '20px',
            top: '8px',
          }}
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }} // Adjust this value to control the opacity level
      />
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center">
          
          <Grid item textAlign="center" xs={12} mb={2}>
            
            <Grid item  mt={3}>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  {recordType}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular" >
                  {recordIPFS}
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
          <Grid item textAlign="center" xs={11} mt={3}>
            <MDInput
              label="Password"
              type="password"
              value={recordPassword || ''}
              onChange={(e) => setRecordPassword(e.target.value)}
              required
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item textAlign="center" xs={11} my={3}>
            <MDInput fullWidth
              type="file"
              id="fileUpload"
              accept=".pdf"
              onChange={handleFileChange}
            />          
            
          </Grid>
        </Grid>
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
      <DialogActions>
        <MDButton onClick={onClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="info"
          type="submit"
          onClick={handleFileUpload} 
        >
            Upload Record
        </MDButton>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;