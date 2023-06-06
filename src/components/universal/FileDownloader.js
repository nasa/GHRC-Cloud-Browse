import config from "../../config";
import { saveAs } from 'file-saver';
import JSZip from "jszip";

const downloader = async (linkList, setShow) => {
    console.log('list', linkList);

    try {
        const zip = new JSZip(); // Create a new instance of JSZip
        const filesGreaterThan2MB = linkList.filter(file => file.Size > 2000000);
        console.log('filesGreaterThan2MB',filesGreaterThan2MB)
        let counter = 1;
        for (const link of linkList) {
            if (link && link.Size) {
                const cacheBuster = new Date().getTime() + Math.random(); // Generate cache-busting timestamp
                const url = `${config.cloudWatchUrlBase}${link['Key']}?cache=${cacheBuster}`;
                const res = await fetch(url);
                const blob = await res.blob();
                const fileSizeMB = blob.size / (1024 * 1024); // Calculate file size in MB
                const fileName = link['Key'].split('/').pop();

                if (fileSizeMB <= 2) {
                    console.log('zipping', counter, 'of', linkList.length - filesGreaterThan2MB.length)
                    counter += 1
                    zip.file(fileName, blob); // Add the file to the zip
                } else {
                    saveAs(blob, fileName); // Download the file as is
                }

            } else {
                if (typeof setShow === 'function') setShow(true);
            }
        }

        if (Object.keys(zip.files).length > 0) {
            console.log('Object.keys(zip.files).length',Object.keys(zip.files).length)
            const zipBlob = await zip.generateAsync({ type: 'blob' }); // Generate the zip blob
            const zipFileName = 'download.zip';
            saveAs(zipBlob, zipFileName); // Save the zip file
        } else {
            console.log('No files to download.');
        }

    } catch (error) {
        console.error('Error during download:', error);
    }
};



export const downloadFile = async (fileUrl) => {
    try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const fileName = fileUrl.split('/').pop();
        saveAs(blob, fileName);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};


export default downloader
