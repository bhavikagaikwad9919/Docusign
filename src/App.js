import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import config from './config';
import Loader from './Loader';

const App = () => {
  const [person1, setPerson1] = useState({ name: '', email: '' ,dateOfBirth:"",address1:"",address2:"",city:"",state:"",zipCode:"",ssn:"",accNumber:"",phoneNo:"",checkbox1:"true"});
  const [person2, setPerson2] = useState({ name: '', email: '',dateOfBirth:"",address1:"",address2:"",city:"",state:"",zipCode:"",ssn:"",accNumber:"",phoneNo:""});
  const [authCode, setAuthCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setAuthCode(code);
    }
  }, []);

  const getAccessToken = async (code) => {
    try {
      const response = await fetch('http://localhost:5000/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: config.redirectUri
        })
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error obtaining access token:', error);
      return null;
    }
  };

  const handleAuthRedirect = () => {
    const authUrl = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature cors&client_id=${config.IntegrationId}&redirect_uri=${encodeURIComponent(config.redirectUri)}`;
    window.location.href = authUrl;
  };
  const calculateAnchorXOffset = (anchorString) => {
     const characterWidth = 4; return anchorString.length * characterWidth;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    if (!authCode) {
      console.error('Authorization code is missing');
      setLoading(false);
      return;
    }

    const accessToken = await getAccessToken(authCode);
    if (!accessToken) {
      alert('Failed to get access token');
      setLoading(false);
      return;
    }

    if (!pdfFile) {
      alert('Please upload a PDF file');
      setLoading(false);
      return;
    }
    
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64File = reader.result.split(',')[1];
          resolve(base64File);
        };
        reader.onerror = reject;
      });
    };

    try {
      const base64File = await convertFileToBase64(pdfFile);

      const envelopeDefinition = {
        emailSubject: 'Please sign this document',
        documents: [
          {
            documentBase64: base64File,
            name: 'Terms and Conditions',
            fileExtension: 'pdf',
            documentId: '1'
          },
        ],
        recipients: {
          signers: [
            {
              email: person1.email,
              name: person1.name,
              dateOfBirth: person1.dateOfBirth,
              address1: person1.address1,
              address2: person1.address2,
              city: person1.city,
              state: person1.state,
              zipCode: person1.zipCode,
              ssn: person1.ssn,
              accNumber: person1.accNumber,
              phoneNo: person1.phoneNo,
              checkbox1:person1.checkbox1,
              recipientId: "1",
              roleName: "seller",
              tabs: {
                textTabs: [
                  {
                    anchorString: "Name (First/MI/Last)",
                    // anchorXOffset: "80",
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.name,
                    anchorXOffset: calculateAnchorXOffset("Name (First/MI/Last)"),
                    pageNumber: '1',
                    anchorUnits: "pixels"
                  },
                  {
                    anchorString: "Email Address",
                    anchorXOffset: calculateAnchorXOffset("Email Address"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.email,
                  },
                  {
                    anchorString: "Address Line 1",
                    anchorXOffset: calculateAnchorXOffset("Address Line 1"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.address1,
                  },
                  {
                    anchorString: "Address Line 2",
                    anchorXOffset: calculateAnchorXOffset("Address Line 2"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.address2,
                  },
                  {
                    anchorString: "City/State/ZIP",
                    anchorXOffset: calculateAnchorXOffset("City/State/ZIP"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.city,
                  },
                  {
                    anchorString: "Social Security Number",
                    anchorXOffset: calculateAnchorXOffset("Social Security Number"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.ssn,
                  },
                  {
                    anchorString: "Date of Birth",
                    anchorXOffset: "42",
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.dateOfBirth,
                  },
                  {
                    anchorString: "Phone",
                    anchorXOffset: calculateAnchorXOffset("Phone"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.phoneNo,
                  },
                  {
                    anchorString: "Account Number",
                    anchorXOffset:calculateAnchorXOffset("Account Number"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person1.accNumber,
                  },
                ],
                checkboxTabs:[
                  {
                    anchorString: "Regular (Includes catch-up contributions)",
                    anchorXOffset: "-20",
                    anchorYOffset:"-5",
                    anchorIgnoreIfNotPresent: "false",
                    selected: "true",
                  },
                ]
              }
            },
            {
              email: person2.email,
              name: person2.name,
              recipientId: "2",
              tabs: {
                textTabs: [
                  {
                    anchorString: "Name",
                    anchorXOffset: "50",
                    anchorIgnoreIfNotPresent: "false",
                    value: person2.name,
                  },
                  {
                    anchorString: "Email Address",
                    anchorXOffset:calculateAnchorXOffset("Email Address"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person2.email,
                  },
                  {
                    anchorString: "Address Line 1",
                    anchorXOffset: calculateAnchorXOffset("Address Line 1"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person2.address1,
                  },
                  {
                    anchorString: "Address Line 2",
                    anchorXOffset: calculateAnchorXOffset("Address Line 2"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person2.address2,
                  },
                  {
                    anchorString: "City/State/ZIP",
                    anchorXOffset: calculateAnchorXOffset("City/State/ZIP"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person2.city,
                  },
                  {
                    anchorString: "Phone",
                    anchorXOffset: calculateAnchorXOffset("Phone"),
                    anchorIgnoreIfNotPresent: "false",
                    value: person2.phoneNo,
                  },
                ],
              }
            },
          ],
        },
        status: 'sent'
      };

      const apiConfig = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post(
        `${config.basePath}/v2.1/accounts/${config.accountId}/envelopes`,
        envelopeDefinition,
        apiConfig
      );

      const envelopeId = response.data.envelopeId;
      if (envelopeId) {
        alert("Email sent successfully");
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error creating envelope:', error);
      alert('Error creating envelope: ' + error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container">
      <button onClick={handleAuthRedirect}>Authorization</button>
      <h1 className="statement-of-work">IRA Template</h1>

      <div className='pdfFile'>
            <input 
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
             />
        </div>

      <form onSubmit={handleSubmit}>
        {loading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )}

        <div className='maindiv form-group'>
          <div>
            <label className="label">
            Name (First/MI/Last):
              <input
                type="text"
                value={person1.name}
                onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
              />
            </label>
            <label className="label">
            Address Line 1:
            <input
              type="text"
              value={person1.address1}
              onChange={(e) => setPerson1({ ...person1, address1: e.target.value })}
            />
            
          </label>
          <label className="label">
          Address Line 2:
            <input
              type="text"
              value={person1.address2}
              onChange={(e) => setPerson1({ ...person1, address2: e.target.value })}
            />
          </label>
          <label className="label">
            City/State/ZIP:
            <input
              type="text"
              value={person1.city}
              onChange={(e) => setPerson1({ ...person1, city: e.target.value })}
            />
          </label>
          <label className="label">
            Social Security Number:
            <input
              type="text"
              value={person1.ssn}
              onChange={(e) => setPerson1({ ...person1, ssn: e.target.value })}
            />
          </label>
          <label className="label">
            Date of Birth:
            <input
              type="text"
              value={person1.dateOfBirth}
              onChange={(e) => setPerson1({ ...person1, dateOfBirth: e.target.value })}
            />
          </label>
          <label className="label">
            Phone:
            <input
              type="text"
              value={person1.phoneNo}
              onChange={(e) => setPerson1({ ...person1, phoneNo: e.target.value })}
            />
          </label>
          <label className="label">
          Email Address:
              <input
                type="email"
                value={person1.email}
                onChange={(e) => setPerson1({ ...person1, email: e.target.value })}
              />
            </label>
          <label className="label">
            Account Number:
            <input
              type="text"
              value={person1.accNumber}
              onChange={(e) => setPerson1({ ...person1, accNumber: e.target.value })}
            />
            
          </label>
          </div>
          <div>
            <label className="label">
              Name:
              <input
                type="text"
                value={person2.name}
                onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
              />
            </label>
            <label className="label">
              Email Address:
              <input
                type="email"
                value={person2.email}
                onChange={(e) => setPerson2({ ...person2, email: e.target.value })}
              />
            </label>
            {/* <label className="label">
            Person 2 Date Of Birth:
            <input
              type="text"
              value={person2.dateOfBirth}
              onChange={(e) => setPerson2({ ...person2, dateOfBirth: e.target.value })}
            />
          </label> */}
          <label className="label">
            Address line 1:
            <input
              type="text"
              value={person2.address1}
              onChange={(e) => setPerson2({ ...person2, address1: e.target.value })}
            />
          </label>
          <label className="label">
            Address line 2:
            <input
              type="text"
              value={person2.address2}
              onChange={(e) => setPerson2({ ...person2, address2: e.target.value })}
            />
          </label>
          <label className="label">
          City/State/ZIP:
            <input
              type="text"
              value={person2.city}
              onChange={(e) => setPerson2({ ...person2, city: e.target.value })}
            />
          </label>
          <label className="label">
            Phone:
            <input
              type="text"
              value={person2.phoneNo}
              onChange={(e) => setPerson2({ ...person2, phoneNo: e.target.value })}
            />
          </label>
          {/* <label className="label">
            Person 2 SSN:
            <input
              type="text"
              value={person2.ssn}
              onChange={(e) => setPerson2({ ...person2, ssn: e.target.value })}
            />
          </label> */}
          </div>
        </div>
        <div className="button-wrapper">
          <button type="submit">Sign</button>
        </div>
      </form>
    </div>
  );
};

export default App;
