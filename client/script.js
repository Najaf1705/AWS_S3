
const instanceIP='13.201.20.245';
const putObject=async(file, fileName, contentType)=>{
    document.getElementById("uploadingImg").textContent="Uploading Image....";
    try {
        const putObjectURLResponse=await fetch(`http://${instanceIP}:5000/s3/upload?filename=${fileName}&contentType=${contentType}`);
        const putObjectURL=await putObjectURLResponse.json();
        // console.log(putObjectURL.url);

        const response=await fetch(putObjectURL.url,{
            method: 'PUT',
            headers:{
                'Content-Type': contentType,
            },
            body: file,
        });

        if(response.status===200){
            console.log("File Uploaded succesfully");
            document.getElementById("uploadingImg").textContent="File Uploaded succesfully";
            await displayImages();
        }
        else {
            console.log("Failed to upload file", response.statusText);
            document.getElementById("uploadingImg").textContent="Failed to upload file";
        }
    } catch (error) {
        console.log("error:",error);
        document.getElementById("uploadingImg").textContent="Error uploading file";
    }finally{
        document.querySelector("input[type=file]").value='';
        setTimeout((req,res)=>{
            document.getElementById("uploadingImg").textContent="";
        },3000);
    }
}


const insertImage = async () => {
    const file = document.querySelector("input[type=file]").files[0];
    if (!file) {
        console.error("No file selected");
        return;
    }
    await putObject(file, `${Date.now()}.jpeg`, "image/png");
};
document.getElementById("insertBtn").addEventListener("click",insertImage);





const displayImages=async() => {
    try {
        const response = await fetch(`http://${instanceIP}:5000/s3/images`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json", 
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const signedURLs=data.signedURLs;
        // console.log("Image Keys:", data.signedURLs);
        
        const gridContainer = document.getElementById("imageGrid");
        gridContainer.innerHTML='';
        signedURLs.forEach((image) => {
            const gridItem = document.createElement("div");
            gridItem.className = "grid-item";

            gridItem.innerHTML = `
                <img src="${image}" alt="Image not found" />
                <button onclick="deleteImage('${image}')">Delete</button>
            `;

            gridContainer.appendChild(gridItem);
        });
    } catch (error) {
        console.error('There was an error fetching the image keys:', error);
    }
};
// Populate the grid on page load
displayImages();

const deleteImage=async(imageURL)=>{
    try {
        const encodedURL = encodeURIComponent(imageURL);
        const response=await fetch(`http://${instanceIP}:5000/s3/delete?imageURL=${encodedURL}`,{
            method: 'DELETE',
        });
        // console.log(response);
        if(response.ok){
            const data=await response.json();
            console.log(data.msg);
            displayImages();
        }
    } catch (error) {
        console.log(error);
    }
};