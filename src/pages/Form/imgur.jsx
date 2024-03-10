import React from 'react';

function UploadButton() {
  const uploadImage = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "46a489e80849737");

    var formdata = new FormData();
    formdata.append("image", "BASE64_ENCODED_IMAGE");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://api.imgur.com/3/image", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };

  return <button onClick={uploadImage}>上传图片</button>;
}

export default UploadButton;
