import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Tree from "./Tree";
import { postCron, deleteCron } from "../api";

function Modal({ data, items }) {
  const [isModalActive, toggleModal] = useState(false);
  const [folderName, setFolderName] = useState("");
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

  const handleFolderNameInputChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleFilesInputChange = (event) => {
    let name = "";
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
    console.log('create Cron');
    // postCreateFolder(`${path}/${folderName}`)
    //   .then((result) => {
    //     if (result?.status === 200) {
    //       updateTree();
    //       changeModalStatus();
    //       setFolderName("");
    //     } else {
    //       console.log(`Not able to create the folder. More details ${result}`);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(
    //       `Some Error Occurred while creating the folder ${inspect(err)}`
    //     );
    //   });
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

    console.log('delete');

    // deletePaths(path, selectedItems.filter(i => i.selected === true))
    //   .then((result) => {
    //     console.log(result);
    //     if (result?.status === 200) {
    //       updateTree();
    //       changeModalStatus();
    //     } else {
    //       console.log(`Not able to delete the files. More details ${result}`);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(
    //       `Some Error Occurred while deleting the files ${inspect(err)}`
    //     );
    //   });
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
          <input
            className="input is-primary"
            type="text"
            placeholder="Folder Name"
            value={folderName}
            onChange={handleFolderNameInputChange}
          />
        );
      case 2:
        return (<Tree treeList={items} treeClickEvent={handleItemClicked} checkBoxTree={true} />)
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
