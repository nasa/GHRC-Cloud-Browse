import config from "../../config";
import { saveAs } from 'file-saver';

const downloader = async (linkList, setShow) => {
    console.log('list', linkList);

    try {
        for (const link of linkList) {
            if (link && link.Size) {
                const cacheBuster = new Date().getTime() + Math.random(); // Generate cache-busting timestamp
                const url = `${config.cloudWatchUrlBase}${link['Key']}?cache=${cacheBuster}`;
                const res = await fetch(url);
                const blob = await res.blob();
                const fileName = link['Key'].split('/').pop();
                saveAs(blob, fileName);
            } else {
                if (typeof setShow === 'function') setShow(true);
            }
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
