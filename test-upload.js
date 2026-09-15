const fs = require('fs');

async function testUpload() {
  try {
    const base64Str = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    const freeimageFormData = new FormData();
    freeimageFormData.append('source', base64Str);
    freeimageFormData.append('key', '6d207e02198a847aa98d0a2a901485a5');
    freeimageFormData.append('action', 'upload');
    freeimageFormData.append('format', 'json');
    
    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: freeimageFormData
    });
    const text = await res.text();
    console.log("Freeimage:", text);

    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Str);
    imgbbFormData.append('key', 'e22e9e03dff42d8d34e6c925d7b57a3e');
    const res2 = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbFormData
    });
    const text2 = await res2.text();
    console.log("ImgBB:", text2);

  } catch (e) {
    console.error(e);
  }
}
testUpload();
