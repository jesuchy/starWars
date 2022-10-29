import { React, useState, useEffect } from "react";
import "./assets/scss/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import PropagateLoader from "react-spinners/PropagateLoader";

function App() {
  const [peoples, setPeoples] = useState([]);
  const [modal, setModal] = useState(false);
  const [features, setFeatures] = useState({});
  const [valueInitial, setInitialValue] = useState();
  const handleClose = () => setModal(false);

  // Consulta api y posteriormente cargar dos funciones
  const obtenerPersonajes = async () => {
    const data = await fetch("https://swapi.dev/api/people");
    const personajes = await data.json();
    setPeoples(personajes.results);
    setInitialValue(personajes.results);
  };

  // Popover
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      more features
    </Tooltip>
  );

  // Este es un ternario el cual contrla el estado del Modal
  const caracteristicas = (elemento) => {
    modal ? setModal(false) : setModal(true);
    setFeatures(elemento);
  };

  // Designamos las filas y las columnas de la tabla
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Height",
      selector: (row) => row.height,
    },
    {
      name: "Skin color",
      selector: (row) => row.skin_color,
    },
    {
      name: "Eye color",
      selector: (row) => row.eye_color,
    },
    {
      name: "Actions",
      selector: (row) => (
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <Button onClick={() => caracteristicas(row)} variant="outline-info">
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </OverlayTrigger>
      ),
    },
  ];

  // Buscador, filtra la informacin por 4 datos, nombre, color ojo, color de piel y altura
  const handleFilter = (tarjet) => {
    const { value } = tarjet;
    const filtered = valueInitial.filter(
      (x) =>
        x?.name.includes(value) ||
        x?.height.includes(value) ||
        x?.eye_color.includes(value) ||
        x?.skin_color.includes(value)
    );
    setPeoples(filtered);
  };

  // Esta funcion faLineChart, cumple la funcion de
  // cargar lat tabla despues de un refresco
  useEffect(() => {
    obtenerPersonajes();
  }, []);

  return (
    <div className="App">
      <div className="cabezera">
        <h1>star wars characters</h1>
        <div className="form">
          <input
            type="text"
            name="name"
            required
            onChange={(e) => handleFilter(e?.target)}
          />
          <label htmlFor="name" className="label-name">
            <span className="content-name">Seach</span>
          </label>
        </div>
      </div>
      <div hidden={peoples != ""} className="spinner">
        <PropagateLoader
          color="gray"
          aria-label="cargando..."
          data-testid="loader"
        />
      </div>
      <div className="Contenido">
        <DataTable columns={columns} data={peoples} pagination />
      </div>

      <Modal show={modal} onHide={handleClose}>
        <ModalHeader>
          <div>
            <h3>features</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="contenedor">
            <div className="item">
              <div className="caja">
                <h5>name </h5>
                <span> {features?.name} </span>
              </div>
              <div className="caja">
                <h5>Eye color </h5>
                <span> {features?.eye_color} </span>
              </div>
            </div>
            <div className="item">
              <div className="caja">
                <h5> Mass </h5>
                <span> {features?.mass} kg </span>
              </div>
              <div className="caja">
                <h5>Height </h5>
                <span>{features?.height} m</span>
              </div>
            </div>
            <div className="item">
              <div className="caja">
                <h5>Gender </h5>
                <span> {features?.gender} </span>
              </div>
              <div className="caja">
                <h5>Skin color </h5>
                <span> {features?.skin_color} </span>
              </div>
            </div>
            <div className="item">
              <div className="caja">
                <h5>Hair color </h5>
                <span> {features?.hair_color} </span>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default App;
