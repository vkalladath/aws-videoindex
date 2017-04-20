function uploadFile(file, signedRequest, url) {
  const status = document.getElementById('status');
  status.textContent = "Upload started...";

  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        status.textContent = "Upload done." + url;
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}

function getSignedRequest(file, title, date) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/api/sign-s3?file-name=${file.name}&file-type=${file.type}&title=${title}&date=${date}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function dateValid(str) {
  return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(str);
}

function isVideo(type) {
  return /^video\//.test(type);
}

function startUpload() {
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const files = document.getElementById('file-input').files;
  const file = files[0];

  if (file == null) {
    return alert('No file selected.');
  }
  if (!isVideo(file.type)) {
    return alert('Not a video file.');
  }
  if (isBlank(title)) {
    return alert('Title is missing.');
  }
  if (isBlank(date)) {
    return alert('Date is missing.');
  }
  if (!dateValid(date)) {
    return alert('Invalid date format. Expecting YYYY-MM-DD');
  }

  getSignedRequest(file, title, date);
}

function initialize() {
  document.getElementById("upload-button").onclick = (e) => {
    e.preventDefault();
    startUpload();
  };
}