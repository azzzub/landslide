import "./envStatus.css";

function EnvStatus() {
  if (!process.env.REACT_APP_ENV) return <></>;

  return <div className="envStatus_container">{process.env.REACT_APP_ENV}</div>;
}

export default EnvStatus;
