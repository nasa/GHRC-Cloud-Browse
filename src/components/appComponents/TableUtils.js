const GetTableColumnDefinitions = (search) => {
  const getFName = (uri) => {
    //takes in a uri and return granule name
    if (uri === undefined) {
      return "Loading";
    }

    if (uri.slice(-1) === "/") {
      var index = uri.indexOf(search);
      return uri.slice(0, index) + uri.slice(index + search.length);
    }
    // console.log(uri);
    const temp = uri.split("/");
    return temp.pop();
  };

  const getFType = (uri) => {
    if (uri === undefined) {
      return "";
    }
    if (uri.slice(-1) === "/") {
      return "Folder";
    }
    const temp = uri.split(".");
    return temp.pop();
  };

  const getFSize = (rawSize) => {
    if (rawSize === undefined) {
      return "";
    }
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (rawSize === 0) return "0 Bytes";
    const ii = parseInt(Math.floor(Math.log(rawSize) / Math.log(1024)), 10);
    return `${(rawSize / 1024 ** ii).toPrecision(4)} ${sizes[ii]}`;
  };


  const columns = [
    {
      field: "Key",
      headerName: "Name",
      flex: 3,
      sortingOrder: ["desc", "asc"],
      valueGetter: ({ row }) => getFName(row.Key),
    },
    {
      field: "fileType",
      headerName: "File Type",
      sortable: false,
      flex: 0.5,
      valueGetter: ({ row }) => getFType(row.Key),
    },
    {
      field: "LastModified",
      headerName: "Last Modified",
      sortable: false,
      flex: 2,
      type: "dateTime",
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "Size",
      headerName: "Size",
      flex: 1,
      sortable: false,
      valueGetter: ({ row }) => getFSize(row.Size),
    },
  ];

  return columns;
};

export default GetTableColumnDefinitions;
