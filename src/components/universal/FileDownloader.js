import config from "../../config";
import { saveAs } from 'file-saver';


const downloader = (linkList, setShow) => {
    console.log('list', linkList);

    // Function to download a single link
    const downloadLink = (link) => {
        if (link && link.Size) {
            const cacheBuster = new Date().getTime() + Math.random(); // Generate cache-busting timestamp
            const url = `${config.cloudWatchUrlBase}${link['Key']}?cache=${cacheBuster}`;
            return fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                    const fileName = link['Key'].split('/').pop();
                    saveAs(blob, fileName);
                    //console.log(`Downloaded file: ${fileName}`);
                });
        }else{
            setShow(true)
        }
    };

    // Download all links in the linkList
    const downloadAllLinks = async () => {
        for (const link of linkList) {
            await downloadLink(link);
        }
    };
    // Call the function to start downloading
    downloadAllLinks().then(r => console.log('download completed'));
};

export const downloadFile = (fileUrl) => {
    fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
            const fileName = fileUrl.split('/').pop()
            saveAs(blob, fileName);
        });
};

export default downloader
