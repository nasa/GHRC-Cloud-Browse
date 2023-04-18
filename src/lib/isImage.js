

export const isImage = (gran) =>{
    switch (gran.split('.').pop()) {
        case 'jpg':
            return 'jpeg'
        case 'png':
            return 'png'
        case 'gif':
            return 'gif'
        case 'pdf':
            return 'pdf'
        case 'txt':
            return 'text'
        case 'json':
            return 'json'
        case 'doc':
            return 'doc'
        default:
            return false
    }

}