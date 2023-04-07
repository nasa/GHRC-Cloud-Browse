

export const isImage = (gran) =>{
    switch (gran.split('.').pop()) {
        case 'jpg':
            return true
        case 'png':
            return true
        case 'gif':
            return true
        case 'pdf':
            return 'pdf'
        default:
            return false
    }

}