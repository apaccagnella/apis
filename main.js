let accessToken, csrfToken, jobUrl, validateJobURL, runJobURL;
//Attention!!!! modify this information, with URLs of your SAC tenant
    const csrfTokenUrl = 'https://libertyutilities.us10.hcs.cloud.sap/api/v1/csrf';
    const clientId = 'sb-2f2e9ccd-9ace-40a8-8a81-b6c23b9723d1!b18382|client!b655';
    const clientSecret = '182a356e-ed63-46fc-a7a0-fa02edb34851$qVKL_bA3ppxhiNx5G1FB3oBWIqfY7vaqGFKjui99Z_U=';
    const tokenUrl = 'https://libertyutilities.authentication.us10.hana.ondemand.com/oauth/token';
    const apiEndpoint = 'https://libertyutilities.us10.hcs.cloud.sap/api/v1/dataimport/models/C8D746S2370K1TX68AQ117VGG0/masterFactData';

 const jobSettings = {
        "Mapping": {  
     "Version___ID": "Version",
     "Date___CALMONTH": "Date",
     "id___ID": "id",
          "label___ID": "label",
            "startDate___ID": "startDate",
           "endDate___ID": "endDate",
            "open___ID": "open",
            "progress": "progress"
        },
        "JobSettings": {
            "importMethod": "Update"
        }
    };


    function getAccessToken(messagesElement) {
        return fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`
        })
        .then(response => response.json())
        .then(data => {
            accessToken = data.access_token;
            console.log('Access token:', accessToken);
           if (messagesElement) {
            messagesElement.textContent = '';  // Clear the messages
            messagesElement.textContent += 'Access token: ' + accessToken + '\n';}
            })
           
        .catch(error => console.error('Error:', error));
    }
    
    window.getAccessToken = getAccessToken;
    
    function getCsrfToken(messagesElement) {
        if (!accessToken) {
            console.log('Access token is not set');
            return;
        }

        return fetch(csrfTokenUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-csrf-token': 'fetch',
                'x-sap-sac-custom-auth' :  'true'
            }
        })
        .then(response => {
            csrfToken = response.headers.get('x-csrf-token');
            console.log('CSRF token:', csrfToken);
             if (messagesElement) {
           messagesElement.textContent = '';  // Clear the messages
          messagesElement.textContent += 'CSRF token: ' + csrfToken + '\n';}

        })
        .catch(error => console.error('Error:', error));
    }
    
    window.getCsrfToken = getCsrfToken;

    function uploadData(csvData, messagesElement) {
      console.log('uploadData is triggered');
        if (!accessToken || !csrfToken || !jobUrl) {
            console.log('Access token, CSRF token, or job URL is not set');
            return;
        }
   // Log the values of accessToken, csrfToken, and jobUrl
    console.log('accessToken:', accessToken);
    console.log('csrfToken:', csrfToken);
    console.log('jobUrl:', jobUrl);
    console.log('csvData:', csvData);
        return fetch(jobUrl, {                   
            method: 'POST',
            headers: {
                'Content-Type': 'text/csv',
                'Authorization': `Bearer ${accessToken}`,
                'x-csrf-token': csrfToken,
                'x-sap-sac-custom-auth' :  'true'
            },
            body: csvData
        }) 
         .then(response =>  { 
            console.log(response);  // Log the raw response object.
        return response.json(); }  )
        .then(data => {
             console.log(data); 
            validateJobURL = data.validateJobURL;
            runJobURL = data.runJobURL;
            console.log('Validate job URL:', validateJobURL);
            console.log('Run job URL:', runJobURL);
             if (messagesElement) {
           messagesElement.textContent = '';  // Clear the messages
            messagesElement.textContent += 'Validate job URL: ' + validateJobURL + '\n';
      messagesElement.textContent += 'Run job URL: ' + runJobURL + '\n';} 
 
        })
        .catch(error => console.error('Error:', error));
    }
window.uploadData = uploadData;