import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Tree from "./Tree";
import { postCron, deleteCron } from "../api";
import { inspect } from "util";

function Modal({ data, updateContents, items }) {
  const [isModalActive, toggleModal] = useState(false);
  const [cronName, setCronName] = useState("");
  const [cronExpression, setCronExpression] = useState("");
  const [filesName, setFilesName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [files, setFiles] = useState([]);

  const submitButtonAction = (e) => {
    switch (data.id) {
      case 1:
        createCron();
        break;
      case 2:
        deleteSelectedCrons();
        break;
      default:
        console.log("Modal ID not specified");
    }
  };

  const changeModalStatus = () => {
    toggleModal(!isModalActive);
  };

  const handleCronExpressionInputChange = (event) => {
    setCronExpression(event.target.value);
  };

  const handleCronNameInputChange = (event) => {
    setCronName(event.target.value);
  };

  const handleFilesInputChange = (event) => {
    let name = "";
    console.log(event);
    for (const file of event.target.files) {
      name += `${file.name}, `
    }
    setFilesName(name);
    setFiles(event.target.files);
  };

  const handleItemClicked = (event) => {
    const selectedItemsArray = [...selectedItems];
    const item = selectedItemsArray.find(i => i.index === parseInt(event.currentTarget.dataset.index));
    item.selected = event.currentTarget.checked
    setSelectedItems(selectedItemsArray);
  }

  const createCron = () => {

    console.log(cronExpression);
    console.log(cronName);
    console.log(files);
    const requestBody = {
      expression: cronExpression,
      name: cronName,
      files
    };
    postCron(requestBody)
      .then((result) => {
        if (result?.status === 200) {
          updateContents();
          changeModalStatus();
          setCronExpression("");
          setCronName("");
          setFilesName("");
          setFiles([]);
        } else {
          console.log(`Not able to schedule the cron. More details ${result}`);
        }
      })
      .catch((err) => {
        console.error(
          `Some Error Occurred while scheduling the cron ${inspect(err)}`
        );
      });
  };

  const deleteSelectedCrons = () => {
    let itemsToDeleteFound = false;
    for (const item of selectedItems) {
      if (item.selected) {
        itemsToDeleteFound = true;
        break;
      }
    }
    if (!itemsToDeleteFound) {
      console.log("No items to delete!");
      changeModalStatus();
      return;
    }

    console.log('delete', itemsToDeleteFound, selectedItems);

    deleteCron(selectedItems.filter(i => i.selected === true))
      .then((result) => {
        console.log(result);
        if (result?.status === 200) {
          updateContents();
          changeModalStatus();
        } else {
          console.log(`Not able to delete the crons. More details ${result}`);
        }
      })
      .catch((err) => {
        console.error(
          `Some Error Occurred while deleting the crons ${inspect(err)}`
        );
      });
  };

  useEffect(() => {
    if (data.id === 2) {
      for (const item of items) {
        item.selected = false;
      }
      setSelectedItems(items);
    }
  }, [items, setSelectedItems, data.id]);

  const renderModalBody = () => {
    switch (data.id) {
      case 1:
        return (
          <div>
            <input
              className="input is-primary margin-bottom-20px"
              type="text"
              placeholder="Cron Name"
              value={cronName}
              onChange={handleCronNameInputChange}
            />

            <input
              className="input is-primary margin-bottom-20px"
              type="text"
              placeholder="Cron Expression"
              value={cronExpression}
              onChange={handleCronExpressionInputChange}
            />

            <div className="columns is-centered">
              <div className="file is-medium is-boxed has-name column">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    name="items"
                    multiple
                    onChange={handleFilesInputChange}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <FontAwesomeIcon icon={faUpload} />
                    </span>
                    <span className="file-label">Add your files here</span>
                  </span>
                  { (filesName !== "") && <span className="file-name max-width-30em">{filesName}</span> }
                  <span className="file-name max-width-30em">
                    Files Count: {files.length}
                  </span>
                </label>
              </div>
            </div>
          </div>
        );
      case 2:
        return (<Tree treeList={items} treeClickEvent={handleItemClicked} checkBoxTree={true} cronsTree={true} />)
      default:
        console.log("Modal ID not specified");
    }
  };

  return (
    <div className="display-inline-block margin-right-20px margin-top-5px">
      <button
        className="js-modal-trigger button dark-button"
        onClick={changeModalStatus}
      >
        {data.TRIGGER_BUTTON_TEXT}
      </button>

      <div className={isModalActive ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{data.MODAL_TITLE}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={changeModalStatus}
            ></button>
          </header>
          <section className="modal-card-body">{renderModalBody()}</section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={submitButtonAction}>
              {data.SUBMIT_BUTTON_TEXT}
            </button>
            <button className="button" onClick={changeModalStatus}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Modal;
