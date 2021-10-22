function endpoint(path) {
  switch (process.env.REACT_APP_ENV) {
    case "BETA":
      return "https://api-beta.landslide.id" + path;
    default:
      return "https://api.landslide.id" + path;
  }
}

export default endpoint;
