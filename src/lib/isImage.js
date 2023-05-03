

export const isImage = (gran) =>{
    console.log('gran.split(\'.\').pop()',gran.split('.').pop())
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
        case 'nc':
            return 'nc'
        default:
            return false
    }

}